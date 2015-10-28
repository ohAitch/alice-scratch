#!/usr/bin/python

"""bandcamp-dl
Usage:
  bandcamp-dl.py <url>
  bandcamp-dl.py [--template=<template>] [--base-dir=<dir>]
                 [--full-album]
                 (<url> | --artist=<artist> --album=<album>)
                 [--overwrite]
  bandcamp-dl.py (-h | --help)
  bandcamp-dl.py (--version)

Options:
  -h --help                 Show this screen.
  -v --version              Show version.
  -a --artist=<artist>      The artist's slug (from the URL)
  -b --album=<album>        The album's slug (from the URL)
  -t --template=<template>  Output filename template.
                            [default: %{artist}/%{album}/%{track} - %{title}]
  -d --base-dir=<dir>       Base location of which all files are downloaded.
  -f --full-album           Download only if all tracks are availiable.
  -o --overwrite           Overwrite tracks that already exist. Default is False.
"""

# taken from https://github.com/iheanyi/bandcamp-dl/tree/83b409a94b3b9eebfd495b6873376d579c615095

from slimit.parser import Parser
import slimit.ast as ast

def read_js_object(code):
    def visit(node):
        if isinstance(node, ast.Program):
            d = {}
            for child in node:
                if not isinstance(child, ast.VarStatement):
                    raise ValueError("All statements should be var statements")
                key, val = visit(child)
                d[key] = val
            return d
        elif isinstance(node, ast.VarStatement):
            return visit(node.children()[0])
        elif isinstance(node, ast.VarDecl):
            return (visit(node.identifier), visit(node.initializer))
        elif isinstance(node, ast.Object):
            d = {}
            for property in node:
                key = visit(property.left)
                value = visit(property.right)
                d[key] = value
            return d
        elif isinstance(node, ast.BinOp):
            # simple constant folding
            if node.op == '+':
                if isinstance(node.left, ast.String) and isinstance(node.right, ast.String):
                    return visit(node.left) + visit(node.right)
                elif isinstance(node.left, ast.Number) and isinstance(node.right, ast.Number):
                    return visit(node.left) + visit(node.right)
                else:
                    raise ValueError("Cannot + on anything other than two literals")
            else:
                raise ValueError("Cannot do operator '%s'" % node.op)

        elif isinstance(node, ast.String):
            return node.value.strip('"').strip("'")
        elif isinstance(node, ast.Array):
            return [visit(x) for x in node]
        elif isinstance(node, ast.Number) or isinstance(node, ast.Identifier) or isinstance(node, ast.Boolean) or isinstance(node, ast.Null):
            return node.value
        else:
            raise Exception("Unhandled node: %r" % node)
    return visit(Parser().parse(code))


import wgetter

from mutagen.mp3 import MP3
from mutagen.id3 import TIT2
from mutagen.easyid3 import EasyID3
import os
from slugify import slugify

class BandcampDownloader():

    def __init__(self, urls=None, template=None, directory=None, overwrite=False):
        if type(urls) is str:
            self.urls = [urls]

        if directory:
            directory = os.path.expanduser(directory)

            if os.path.isdir(directory):
                self.directory = directory

        self.urls = urls
        self.template = template
        self.overwrite = overwrite

    def start(self, album):
        self.download_album(album)

    def template_to_path(self, track):
        path = self.template
        path = path.replace("%{artist}", slugify(track['artist']))
        path = path.replace("%{album}", slugify(track['album']))
        path = path.replace("%{track}", str(track['track']).zfill(2))
        path = path.replace("%{title}", slugify(track['title']))
        path = u"{0}/{1}.{2}".format(self.directory, path, "mp3")

        return path

    def create_directory(self, filename):
        directory = os.path.dirname(filename)
        if not os.path.exists(directory):
            os.makedirs(directory)

        return directory

    def download_album(self, album):

        for track in album['tracks']:
            track_meta = {
                "artist": album['artist'],
                "album": album['title'],
                "title": track['title'],
                "track": track['track'],
                "date": album['date']
            }

            filename = self.template_to_path(track_meta)
            dirname = self.create_directory(filename)

            if not self.overwrite and os.path.isfile(filename):
                print "Skipping track {} - {} as it's already downloaded, use --overwrite to overwrite existing files".format(track['track'], track['title'])
                continue

            if not track.get('url'):
                print "Skipping track {} - {} as it is not available".format(track['track'], track['title'])
                continue

            try:
                tmp_file = wgetter.download('http:'+track['url'], outdir=dirname)
                os.rename(tmp_file, filename)
                self.write_id3_tags(filename, track_meta)
            except Exception as e:
                print e
                print "Downloading failed.."
                return False
        try:
            tmp_art_file = wgetter.download(album['art'], outdir=dirname)
            os.rename(tmp_art_file, dirname + "/cover.jpg")
        except Exception as e:
            print e
            print "Couldn't download album art."

        return True

    def write_id3_tags(self, filename, meta):
        print "Encoding . . . "

        audio = MP3(filename)
        audio["TIT2"] = TIT2(encoding=3, text=["title"])
        audio.save()

        audio = EasyID3(filename)
        audio["tracknumber"] = meta['track']
        audio["title"] = meta['title']
        audio["artist"] = meta['artist']
        audio["album"] = meta['album']
        audio["date"] = meta['date']
        audio.save()

        print "Done encoding . . . "


from bs4 import BeautifulSoup
import requests


class Bandcamp:

    def parse(self, url):
        try:
            r = requests.get(url)
        except requests.exceptions.MissingSchema:
            return None

        if r.status_code is not 200:
            return None

        self.soup = BeautifulSoup(r.text, "lxml")
        album = {
            "tracks": [],
            "title": "",
            "artist": "",
            "full": False,
            "art": "",
            "date": ""
        }

        album_meta = self.extract_album_meta_data(r)

        album['artist'] = album_meta['artist']
        album['title'] = album_meta['title']
        album['date'] = album_meta['date']

        for track in album_meta['tracks']:
            track = self.get_track_meta_data(track)
            album['tracks'].append(track)

        album['full'] = self.all_tracks_available(album)
        album['art'] = self.get_album_art()

        return album

    def all_tracks_available(self, album):
        for track in album['tracks']:
            if track['url'] is None:
                return False

        return True

    def get_track_meta_data(self, track):
        new_track = {}
        if not (isinstance(track['file'], unicode) or isinstance(track['file'], str)):
            if 'mp3-128' in track['file']:
                new_track['url'] = track['file']['mp3-128']
        else:
            new_track['url'] = None

        new_track['duration'] = track['duration']
        new_track['track'] = track['track_num']
        new_track['title'] = track['title']

        return new_track

    def extract_album_meta_data(self, request):
        album = {}

        embedData = self.get_embed_string_block(request)

        block = request.text.split("var TralbumData = ")

        stringBlock = block[1]

        stringBlock = stringBlock.split("};")[0] + "};"
        stringBlock = read_js_object("var TralbumData = %s" % stringBlock)

        album['title'] = embedData['EmbedData']['album_title']
        album['artist'] = stringBlock['TralbumData']['artist']
        album['tracks'] = stringBlock['TralbumData']['trackinfo']
        album['date'] = stringBlock['TralbumData']['album_release_date'].split()[2]

        return album

    @staticmethod
    def generate_album_url(artist, album):
        return "http://{0}.bandcamp.com/album/{1}".format(artist, album)

    def get_album_art(self):
        try:
            url = self.soup.find(id='tralbumArt').find_all('img')[0]['src']
            return url
        except:
            pass


    def get_embed_string_block(self, request):
        embedBlock = request.text.split("var EmbedData = ")

        embedStringBlock = embedBlock[1]
        embedStringBlock = embedStringBlock.split("};")[0] + "};"
        embedStringBlock = read_js_object("var EmbedData = %s" % embedStringBlock)

        return embedStringBlock

from docopt import docopt
import os

if __name__ == '__main__':
    arguments = docopt(__doc__, version='bandcamp-dl 1.0')
    bandcamp = Bandcamp()

    if (arguments['--artist'] and arguments['--album']):
        url = Bandcamp.generate_album_url(arguments['--artist'], arguments['--album'])
    else:
        url = arguments['<url>']

    album = bandcamp.parse(url)
    basedir = arguments['--base-dir'] or '/Users/ali/Downloads' # os.getcwd()

    if not album:
        print "The url {} is not a valid bandcamp page.".format(url)
    elif arguments['--full-album'] and not album['full']:
        print "Full album not available. Skipping..."
    else:
        bandcamp_downloader = BandcampDownloader(url, arguments['--template'], basedir, arguments['--overwrite'])
        bandcamp_downloader.start(album)

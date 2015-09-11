import sublime, sublime_plugin
import subprocess
import re

# todo: understand urls magically like open_context.py does.
# actually parse the query string

class NiceUrlCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		for reg in view.sel():
			v = o = view.substr(reg)
			#
			v = re.sub(r'^/','file:///',v)
			if re.match(r'^file:///',v): v = re.sub(r'(?<!\\) ','\\ ',v)
			# symlinks
			v = re.sub(r'^file:///Users/ali/','file:///~/',v)
			v = re.sub(r'^file:///~/ali/books/papers/','file:///~/papers/',v)
			v = re.sub(r'^file:///~/ali/books/','file:///~/books/',v)
			#
			v = re.sub(r'^https://','http://',v)
			v = re.sub(r'^http://www\.','http://',v)
			v = re.sub(r'^http://youtube\.com/watch\?v=([^&]+)&','http://youtu.be/\\1?',v)
			v = re.sub(r'^http://youtube\.com/watch\?v=([^&]+)' ,'http://youtu.be/\\1' ,v)
			v = re.sub(r'^http://en\.wikipedia\.org/','http://wikipedia.org/',v)
			v = re.sub(r'^(http://docs\.google\.com/document/d/[\w_]+)/edit','\\1',v)
			v = re.sub(r'^http://facebook\.com/(\w+)(?:\?fref=nf)?','http://fb.com/\\1',v)
			v = re.sub(r'^http://mail\.google\.com/mail/u/0/\??#(?:inbox|label/\w+)/(\w+)','http://google.com/mail/#all/\\1',v)
			if v is not o: view.replace(edit, reg, v)

############ todo ############

# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408/ref=sr_1_1?s=books&ie=UTF8&qid=1365921208&sr=1-1&keywords=Lower+Your+Taxes%3ABig+Time
# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408/

# http://smile.amazon.com/gp/product/B0044DEESS/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B0044DEESS&linkCode=as2&tag=ajo-20&l=as2&o=1&a=B0044DEESS&sa-no-redirect=1
# http://amazon.com/gp/product/B0044DEESS/

# http://mail.google.com/mail/u/0/#search/working+with+or+volunteering+for+giv/1471d4aa606b592f
# http://google.com/mail/#all/1471d4aa606b592f

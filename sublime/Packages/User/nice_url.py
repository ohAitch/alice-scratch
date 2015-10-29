import sublime, sublime_plugin
import subprocess
import re

# todo: understand urls magically like open_context.py does.
# actually parse the query string
# symlinks should maybe actually query the folders / and ~ for symlinks and do replacements for all of them

class NiceUrlCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		view = self.view
		for reg in view.sel():
			ι = o = view.substr(reg)
			
			ι = re.sub(r'^/','file:///',ι)
			ι = re.sub(r'^~','file:///~',ι)
			
			ι = re.sub(r'^file:///Users/ali/','file:///~/',ι)
			ι = re.sub(r'^file:///~/ali/books/papers/','file:///~/papers/',ι)
			ι = re.sub(r'^file:///~/ali/books/','file:///~/books/',ι)
			
			ι = re.sub(r'^https://','http://',ι)
			ι = re.sub(r'^http://www\.','http://',ι)
			ι = re.sub(r'^http://youtube\.com/watch\?ι=([^&]+)&','http://youtu.be/\\1?',ι)
			ι = re.sub(r'^http://youtube\.com/watch\?ι=([^&]+)' ,'http://youtu.be/\\1' ,ι)
			ι = re.sub(r'^http://en\.wikipedia\.org/','http://wikipedia.org/',ι)
			ι = re.sub(r'^(http://docs\.google\.com/document/d/[\w_]+)/edit','\\1',ι)
			ι = re.sub(r'^http://facebook\.com/','http://fb.com/',ι)
			ι = re.sub(r'^(http://fb\.com/[\w.]+)([?&]fref=\w+)?([?&]hc_location=[\w_]+)?','\\1',ι)
			# https://www.facebook.com/kaya.stechly?fref=pb&hc_location=friends_tab
			ι = re.sub(r'^http://mail\.google\.com/mail/u/0/\??#(?:inbox|label/\w+)/(\w+)','http://google.com/mail/#all/\\1',ι)

			if re.match(r'^file:///',ι): ι = re.sub(r'(?<!\\) ','\\ ',ι)

			ι = re.sub(r'^"(.*)"$',r'“\1”',ι) #! not actually for urls
			if ι is not o: view.replace(edit, reg, ι)

############ todo ############

# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408/ref=sr_1_1?s=books&ie=UTF8&qid=1365921208&sr=1-1&keywords=Lower+Your+Taxes%3ABig+Time
# http://amazon.com/Lower-Your-Taxes-Time-2013-2014/dp/0071803408/

# http://smile.amazon.com/gp/product/B0044DEESS/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B0044DEESS&linkCode=as2&tag=ajo-20&l=as2&o=1&a=B0044DEESS&sa-no-redirect=1
# http://amazon.com/gp/product/B0044DEESS/

# actually
# http://smile.amazon.com/Thinking-Pencil-Henning-Nelms/dp/0898150523?sa-no-redirect=1
# Thinking Pencil http://amzn.to/1jxKp9q

# http://mail.google.com/mail/u/0/#search/working+with+or+volunteering+for+giv/1471d4aa606b592f
# http://google.com/mail/#all/1471d4aa606b592f

# https://docs.google.com/spreadsheets/d/1wfFMPo8n_mpcoBCFdsIUUIt7oSm7d__Duex51yejbBQ/edit#gid=0
# http://goo.gl/0nrUfP

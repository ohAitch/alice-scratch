import sublime, sublime_plugin
from sublime import Region
import threading, http.server, json, os, codecs, re, weakref
# from itertools import *

PORT = 34289

#################################### helper ####################################
tce_r = None
def eval_(ι,vars):
	vars = dict(list({ 'sublime':sublime, 'json':json, 're':re, 'Region':Region, 'view_from':view_from, 'edit':edit, }.items()) + list(vars.items()))
	ι = re.sub('(\n|;|$)',r'=r\1',ι[::-1],1)[::-1]; exec(ι,vars); return vars.get('r')
	# if it does this [re.sub('(\n|;|$)] (and the vars?) it should replace views with id objects
	# and it doesnt
	# ?so it shouldnt do this?
class tc_eval(sublime_plugin.TextCommand):
	def run(self,edit,ι): global tce_r; tce_r = None; tce_r = eval_(ι,{'view':self.view,'edit':edit})

###################################### api #####################################
def view_from(ι): return ι if type(ι) is sublime.View else next(t for t in sublime.windows() for t in t.views() if t.id() == ι)
def edit(view,code): view_from(view).run_command("tc_eval",{'ι':code}); return tce_r
def serialize(ι): #! COPIED from munge_stuff, goodness, so bad
	if isinstance(ι,sublime.View): return { "type":'sublime.View', "id":ι.id() }
	else: return 'error_ls1w8idny'
def deserialize(ι):
	if ι["type"] is 'sublime.View': return View_from(ι["id"])
	else: return 'error_r1kbyq77d'

##################################### main #####################################
class server_h(http.server.BaseHTTPRequestHandler):
	def log_request(self,code='-',size='-'): pass
	def do_PUT(self):
		ι = codecs.open('/tmp/fs_ipc_'+str(PORT),'r','utf8').read()
		r = eval_(ι,{})
		self.send_response(200)
		self.wfile.write(bytes(json.dumps(r)+'    \n','UTF-8'))
server = http.server.HTTPServer(('localhost',PORT),server_h)
def t():
	APP = '[external eval]'
	try: print(APP,'server starting'); server.serve_forever()
	except: print(APP,'server shutting down')
threading.Thread(target=t, daemon=True).start()
def plugin_unloaded(): server.socket.close()

import sublime, sublime_plugin
import threading, http.server, json, os, codecs
import re # for code in execs

PORT = 34289

def exec_(ι,vars): exec(ι,None,vars); return vars['ι'] if 'ι' in vars else None

class Listener(sublime_plugin.EventListener):
	def on_activated(self,view): global _self; _self = self; global _view; _view = view
	def on_window_command(self,window,cmd,args): global _window; _window = window

class ExecEditCommand(sublime_plugin.TextCommand):
	def run(self,edit,ι): global ee_r; ee_r = None; ee_r = exec_(ι,{'self':self,'view':self.view,'window':_window,'edit':edit})

class server_h(http.server.BaseHTTPRequestHandler):
	def do_PUT(self_):
		ι = codecs.open('/tmp/sublime_external_command','r','utf8').read()
		ι = re.sub('(\n|;|$)',r' = ι\1',ι[::-1],1)[::-1]
		if re.search(r'view\.(insert|erase|replace)\(',ι):
			_view.run_command("exec_edit",{'ι':ι}); ι = ee_r
		else:
			ι = exec_(ι,{'self':_self,'view':_view,'window':_window})
		self_.send_response(200)
		self_.wfile.write(bytes(json.dumps(ι)+'    \n','UTF-8'))
	def log_request(self_,code='-',size='-'):
		pass
server = http.server.HTTPServer(('127.0.0.1',PORT),server_h)
def t():
	try: print('[EXTERNAL COMMAND] server starting'); server.serve_forever()
	except: print('[EXTERNAL COMMAND] server shutting down')
threading.Thread(target=t, daemon=True).start()
def plugin_unloaded(): server.socket.close()

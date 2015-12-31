import sublime, sublime_plugin
import threading, http.server, json, os, codecs, re

PORT = 34289 #↩ {"PORT":34289}

def window_(): return sublime.active_window()
def view_():   return sublime.active_window().active_view()

def exec_(ι,edit=None): t = {'window':window_(), 'view':view_(), 'edit':edit}; exec(ι,None,t); return t['ι'] if 'ι' in t else None
class exec_edit(sublime_plugin.TextCommand):
	def run(self,edit,ι): global ee_r; ee_r = None; ee_r = exec_(ι,edit)
def exec_edit_(ι): view_().run_command("exec_edit",{'ι':ι}); return ee_r

class server_h(http.server.BaseHTTPRequestHandler):
	def log_request(self,code='-',size='-'): pass
	def do_PUT(self):
		ι = codecs.open('/tmp/fs_ipc_'+str(PORT),'r','utf8').read()
		ι = re.sub('(\n|;|$)',r' = ι\1',ι[::-1],1)[::-1]
		ι = (exec_edit_ if re.search(r'\bview\.(insert|erase|replace)\b',ι) else exec_)(ι)
		self.send_response(200)
		self.wfile.write(bytes(json.dumps(ι)+'    \n','UTF-8'))
server = http.server.HTTPServer(('127.0.0.1',PORT),server_h)
def t():
	try: print('[external eval] server starting'); server.serve_forever()
	except: print('[external eval] server shutting down')
threading.Thread(target=t, daemon=True).start()
def plugin_unloaded(): server.socket.close()

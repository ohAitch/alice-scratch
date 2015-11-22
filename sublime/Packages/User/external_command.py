import sublime, sublime_plugin
import threading
import http.server
import json
import re # for code in execs

PORT = 34289

class Handler(http.server.BaseHTTPRequestHandler):
	def do_PUT(self_):
		ι = self_.rfile.read(int(self_.headers.get('content-length'))).decode('utf-8')
		ι = re.sub('(\n|;|$)',r' = r\1',ι[::-1],1)[::-1]
		if re.search(r'view\.(insert|erase|replace)\(',ι):
			global exec_edit_ι; global exec_edit_r
			exec_edit_ι = re.sub(r'(\bview\.(insert|erase|replace)\()',r'\1edit,',ι)
			g_view.run_command("exec_edit")
			r = json.dumps(exec_edit_r)
		else:
			r = {'self':g_self, 'view':g_view, 'window':g_window}
			exec(ι,None,r)
			r = json.dumps(r['r']) if 'r' in r else 'null'
		self_.send_response(200)
		self_.wfile.write(bytes(r+'    \n','UTF-8'))
	def log_request(self_,code='-',size='-'):
		pass
server = http.server.HTTPServer(('127.0.0.1',PORT), Handler)
def t():
	try: server.serve_forever()
	except: pass
threading.Thread(target=t, daemon=True).start()
print("[EXTERNAL COMMAND] server started")
def plugin_unloaded(): print('[EXTERNAL COMMAND] server shutting down'); server.socket.close()

class Listener(sublime_plugin.EventListener):
	def on_activated(self,view): global g_self; global g_view; g_self = self; g_view = view
	def on_window_command(self,window,cmd,args): global g_window; g_window = window;

class ExecEditCommand(sublime_plugin.TextCommand):
	def run(self,edit):
		global exec_edit_r; exec_edit_r = None
		r = {'self':self,'view':self.view,'edit':edit, 'window':g_window}
		exec(exec_edit_ι,None,r)
		if 'r' in r: exec_edit_r = r['r']

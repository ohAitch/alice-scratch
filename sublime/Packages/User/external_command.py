"""
import sublime, sublime_plugin
import threading
import http.server
import json

class Handler(http.server.BaseHTTPRequestHandler):
	def do_PUT(self):
		body = self.rfile.read(int(self.headers.get('content-length')))
		locals = {}
		exec(body,None,locals)
		self.send_response(200)
		if 'r' in locals:
			t = json.dumps(locals['r'])
			self.wfile.write(bytes((t if len(t) >= 6 else t+'    ')+'\n','UTF-8'))
		else:
			self.wfile.write(bytes('null  ','UTF-8'))
	def log_request(self,code='-',size='-'):
		pass
t = http.server.HTTPServer(('127.0.0.1', 34289), Handler)
def serve():
	try: t.serve_forever()
	except: pass
threading.Thread(target=serve, daemon=True).start()
print("[EXTERNAL COMMAND] server started")

def plugin_unloaded(): print('[EXTERNAL COMMAND] server shutting down'); t.socket.close()

class Listener(sublime_plugin.EventListener):
	def on_activated(self,view_): global view; view = view_

class ExecEditCommand(sublime_plugin.TextCommand):
	def run(self,edit,v): view = self.view; exec(v)
"""

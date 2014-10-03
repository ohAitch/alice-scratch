import sublime, sublime_plugin, time
import re
from datetime import datetime
# from datetime import timedelta

# def round_time(dt, round_to):
# 	seconds = (dt - dt.min).seconds
# 	rounding = (seconds+round_to/2) // round_to * round_to
# 	return dt + timedelta(0,rounding-seconds,-dt.microsecond)

class _(sublime_plugin.EventListener):
	def on_query_completions(self, view, prefix, locations):
		print(prefix)
		if False: pass
		# elif prefix == 'u'   : r = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
		elif prefix == 'utc' : r = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
		elif prefix == 'utcm' : t = datetime.utcnow(); r = t.strftime('%Y-%m-%dT%H:%M:%S.')+t.strftime('%f')[:3]+'Z'
		# elif prefix == 'unow': r = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
		elif prefix == 'now0': r = datetime.now().strftime('%Y-%m-%d/%H:%M')
		elif prefix == 'now' : r = datetime.utcnow().strftime('%Y-%m-%d/%H:%MZ')
		elif prefix == 'day' : r = datetime.now().strftime('%Y-%m-%d')
		elif prefix == 'week': r = datetime.now().strftime('%Y-W%W')
		elif re.match('^\d\d\d\d-W\d\d$',prefix): t = datetime.now(); r = t.strftime('%Y-W%W-') + str((int(t.strftime('%w')) - 1) % 7 + 1)
		# elif prefix == 'time': r = datetime.now().strftime('%H:%M')
		# elif prefix == 'time': r = round_time(datetime.now(),15*60).strftime('%H:%M')
		else                 : r = None
		return [(prefix,prefix,r)] if r else []

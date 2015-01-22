import sublime, sublime_plugin, time
import re
from datetime import datetime
# from datetime import timedelta

# maybe this really should do that reverse generation (aka: parsing) we tried having it do
# maybe this should merge with our snippets file

# def round_time(dt, round_to):
# 	seconds = (dt - dt.min).seconds
# 	rounding = (seconds+round_to/2) // round_to * round_to
# 	return dt + timedelta(0,rounding-seconds,-dt.microsecond)

class _(sublime_plugin.EventListener):
	def on_query_completions(self, view, prefix, locations):
		u = datetime.utcnow()
		l = datetime.now()
		return ([
			['now', u.strftime('%Y-%m-%dT%H:%MZ')],
			['now', u.strftime('%Y-%m-%dT%H:%M:%SZ')],
			['now', u.strftime('%Y-%m-%dT%H:%M:%S.')+u.strftime('%f')[:3]+'Z'],
			['lnow', l.strftime('%Y-%m-%d/%H:%M')],
			['day', l.strftime('%Y-%m-%d')],
			['week', l.strftime('%Y-W%W')],
			['week', l.strftime('%Y-W%W-') + str((int(l.strftime('%w')) - 1) % 7 + 1)]
		],sublime.INHIBIT_WORD_COMPLETIONS)

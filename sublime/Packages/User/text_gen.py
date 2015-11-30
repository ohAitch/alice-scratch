import sublime, sublime_plugin
import re, time, datetime

################################# make divider #################################

# i wanna styles of different boldness, like, ===== is bolder than -----, and i wanna switch between them iff i hit the divider key and the length doesn't change
# and maybe if you hit the command again it should unmake the divider?
# should probably handle indented dividers
# if it's already an empty divider, know that, don't do the silly thing
# maybe work by trimming divider-matchables on both sides first, instead of trying to match an entire possible-divider?

e_table_ = {
	'Packages/JavaScript/JavaScript.tmLanguage': '/',
	'Packages/Python/Python.tmLanguage': '#',
	'Packages/ShellScript/Shell-Unix-Generic.tmLanguage': '#',
	'Packages/Ruby/Ruby.tmLanguage': '#',
	'Packages/Lisp/Lisp.tmLanguage': ';',
	}
s_table = {
	'#': [r'^#+.*#+$',r'^#+\s*(.+?)\s*#+$','#',''],
	'-': [r'^-+.*-+$',r'^-+\s*(.+?)\s*-+$','-',''],
	'/': [r'^// ?-+.*-+ ?//$',r'^// ?-+(?://)? *(.+?) *(?://)?-+ ?//$','-','// '],
	';': [r'^; ?-+.*-+ ?;$',r'^; ?-+;? *(.+?) *;?-+ ?;$','-','; ']
	}
def data(view): ι = view.settings().get('syntax'); return s_table[e_table_[ι] if ι in e_table_ else '-']

class MakeDividerCommand(sublime_plugin.TextCommand):
	def run(self,edit,length):
		view = self.view
		test, match, fill, ends = data(view)
		for region in [ι for ι in view.sel()][::-1]:
			line = view.line(region)
			s = view.substr(line)
			t = re.match(r'^(\t*)(.*)',s); tabs = t.group(1); s = t.group(2)
			if re.match(test,s):
				s = re.match(match,s).group(1)
			else:
				s = s.strip()
			def len_a(ι): return sum([len(ι) for ι in ι])
			if s == '':
				r = [ends,'',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				r[1] = fill * len_
			else:
				r = [ends,'',' ',s,' ','',ends[::-1]]
				len_ = length - len(tabs)*2 - len_a(r)
				while len_ < 6: len_ += 10
				r[1] = fill * ((len_+1)//2)
				r[5] = fill * (len_//2)
			q = region == line and region.empty()
			if q: view.sel().subtract(region)
			view.replace(edit,line,tabs+''.join(r))
			if q: view.sel().add(sublime.Region(view.line(region).end()))

################################### snippets ###################################

# maybe this really should do that reverse generation (aka: parsing) we tried having it do
# maybe this should merge with our snippets file

# def round_time(dt, round_to):
# 	seconds = (dt - dt.min).seconds
# 	rounding = (seconds+round_to/2) // round_to * round_to
# 	return dt + timedelta(0,rounding-seconds,-dt.microsecond)

class _(sublime_plugin.EventListener):
	def on_query_completions(self, view, prefix, locations):
		u = datetime.datetime.utcnow()
		l = datetime.datetime.now()
		return ([
			['now', u.strftime('%Y-%m-%dT%H:%MZ')],
			['now', u.strftime('%Y-%m-%dT%H:%M:%SZ')],
			['now', u.strftime('%Y-%m-%dT%H:%M:%S.')+u.strftime('%f')[:3]+'Z'],
			['lnow', l.strftime('%Y-%m-%d/%H:%M')],
			['day', l.strftime('%Y-%m-%d')],
			['week', l.strftime('%Y-W%W')],
			['week', l.strftime('%Y-W%W-') + str((int(l.strftime('%w')) - 1) % 7 + 1)]
		],sublime.INHIBIT_WORD_COMPLETIONS)

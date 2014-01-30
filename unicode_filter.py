# used by code/menu_key.sh

import sys
import codecs

def lfill(s,i):
	while len(s) < i: s = '0'+s
	return s

def fix(v):
	try:
		while True:
			i = v.index('UNICODE ')
			v = v[:i]+lfill(hex(ord(v[i+8]))[2:],4)+v[i+9:]
	except ValueError:
		return v

t = [fix(line) for line in codecs.open(sys.argv[1], "r", "utf-8")]
f = codecs.open(sys.argv[1], "w", "utf-8")
for v in t: f.write(v)
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys, os, mailbox, email, quopri, json
MBOX = sys.argv[1]
OUT_DIR = sys.argv[2]

def msg_to_json(msg):
	r = {'parts': []}
	for (k, v) in msg.items(): r[k] = v.decode('utf-8', 'ignore')
	try:
		for part in msg.walk():
			if part.get_content_maintype() == 'multipart':
				continue
			t = part.get_payload(decode=False)
			if type(t) is not list: t = [t]
			for t in t:
				if t.__class__ is email.message.Message:
					r['parts'].append(msg_to_json(t))
				else:
					v = quopri.decodestring(t).decode('utf-8', 'ignore')
					v = v.replace('\r\n','\n')
					type_ = part.get_content_type()
					if type_ == "text/html": v = v.replace('\r','').replace('\n','')
					r['parts'].append({'contentType': type_, 'content': v})
	except Exception, e:
		sys.stderr.write('\nSkipping message - error encountered (%s)\n' % (str(e), ))
		r['error'] = True
	finally:
		return r

os.makedirs(OUT_DIR)
mbox = mailbox.UnixMailbox(open(MBOX, 'rb'), email.message_from_file)
for i in xrange(sys.maxint):
	v = mbox.next()
	if v is None: break
	print str(i)+'\r',
	json.dump(msg_to_json(v),open(OUT_DIR+'/'+str(i)+'.json','wb'),indent=2)

# https://github.com/gmailgem/gmail

# mbox_to_json.py ~/ali/history/text\ logs/2015-10-03\ alice0meta\@gmail.com.mbox ~/Downloads/alice0meta\@gmail.com

# r ← []
# for (ι of fs('.').findˢ('>')) {ι = JSON.parse(fs(ι).$); if (ι['X-Gmail-Labels'] && ι['X-Gmail-Labels'].split(',')._.contains('Chat') && ι.From === 'Alice Monday <alice0meta@gmail.com>') r.push(ι.parts._.map('content').join('\n'))}
# copy(r.join('\n'))

# r ← []
# for (ι of fs('.').findˢ('>')) {ι = JSON.parse(fs(ι).$); t ← ι.parts._.map('content').filter(/<\/a>/.λ).join(' '); t !== '' && r.push(t)}

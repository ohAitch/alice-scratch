how could it optimize parsimmon?

well, how could it optimize

random_id_ ← L=> _.range(L).map(()=> random( _.range(0x100).map(ι=> chr(ι)).filter(ι=> ι.match(/[0-9a-z]/)) )).join('')
_.range(8).map(random_id_)

price _.range(0x100)
	heap: 0x100 + 1 words = 257
	cpu: inspect _.range -> 9 + 0x100 * 4 + 1 simple instructions = 1034
	<i * 256>
price chr(i)
	heap: 0
	cpu: 1 simple instructions
	<str_cp>
price <i * 256>.map(ι=> chr(ι))
	heap: 0x100 + 1 words = 257
	cpu: 256 * (1 + 1) simple instructions = 512
	<str_cp * 256>
price str.match(/[0-9a-z]/)
	heap: 4 + (str.‖ * 2 bytes) words
	cpu: str.‖ simple instructions
	<match result>
price <str_cp * 256>.filter(ι=> ι.match(/[0-9a-z]/))
	heap: 0x100 + 1 words = 257
	cpu: (1+1+2) * 256 simple instructions = 1024
	<str_cp * (0 .. 256)>
price random(<str_cp * (0 .. 256)>)
	heap: 0
	cpu: 5 simple instructions (approximately)
	<str_cp or ‽>
‡ not quite right. i have some ideas on what would be right.

for parsimmon all i actually want is to inline the closures, like, to take the final Parser and inline all or most of its closures, because this is extremely suitable for parser combinators
actually also: to redo the pure function in case of error, so that i only need to keep track of (expensive) metadata in case of error
anything else?

‡ hey explore compilings of this object
◍ nothing much found. any chance i could instrument it?
‡ sure, here''s a code you can run to make it again
◍ cool. so that object is *this* big and *stuff*; we could make another object like *so* that for additional *such* size, and it''s *this* stuff, which could be better

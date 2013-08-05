def sort(v): v.sort(); return v
def cat(v): return [v for v in v for v in v]

def naive(groups):
	r = False
	for group in groups:
		for v in group:
			t = v.copy()
			v -= set().union(*[w for w in group if w is not v and len(w) == 1])
			if v != t: r = True
	return r

def solve(grid):
	horiz = [[set([int(v)]) for v in v] for v in grid]
	vert = [[horiz[y][x] for y in range(9)] for x in range(9)]
	sq = [[horiz[y][x] for y in range(Y*3,(Y+1)*3) for x in range(X*3,(X+1)*3)] for Y in range(3) for X in range(3)]
	for v in horiz:
		for v in v:
			if 0 in v:
				v.clear()
				v |= set([1,2,3,4,5,6,7,8,9])

	while naive(horiz) or naive(vert) or naive(sq): pass

	r = horiz[0][:3]
	for v in r:
		if len(v) != 1: return sq
	r = [v.pop() for v in r]
	return r[0]*100 + r[1]*10 + r[2]

def solve_all(): return [solve(v[1:]) for v in zip(*(iter([line[:-1] for line in open('sudoku.txt')]),) * 10)]

#print([v for v in cat(solve_all()[1]) if len(v) != 1])
print(solve_all()[1])
#include <cstdio>
#include <iostream>
#include <algorithm> // for copy
#include <iterator> // for ostream_iterator
#include <cmath>
#include <map>
#include <string>
#include <vector>
#include <stdexcept>

using namespace std;

//===--------------------------------------------===// utils //===--------------------------------------------===//

exception err(const string& v) {return runtime_error(v);}
#define pr(v) cout << v << "\n"
#define S <<" "<<
typedef long long i64;

namespace std {
	template <typename T> void sort(vector<T> &v) {sort(v.begin(),v.end());}
	template <typename T> void reverse(vector<T> &v) {reverse(v.begin(),v.end());}
}

//===--------------------------------------------===// problem 14 //===--------------------------------------------===//
#ifdef NOT_DEF

namespace collatz {
	i64 next(i64 v) {return v % 2 == 0? v/2 : 3*v+1;}
	i64 solve(i64 len) {
		i64 max=0,maxv;
		for (i64 i=1;i<len;i++) {
			i64 v=i,t=1; while (v != 1) {t++; v = next(v);}
			if (t > max) {max = t; maxv = i;}
			//if (i % (len/20) == 0) pr(i S t);
		}
		return maxv;}
	i64 solve() {return solve(1000000);}
}

//===--------------------------------------------===// problem 62 //===--------------------------------------------===//

namespace cubic_permutations {
	bool cmp_0_last(int a,int b) {return a == 0? false : b == 0? true : a<b;}
	i64 cube(i64 v) {return v*v*v;}
	i64 ipow(i64 a,i64 b) {return (i64)(pow(a,b)+0.5);}
	double cbrt(i64 v) {return pow((double)v,1.0/3.0);}
	i64 sort_digits(i64 v) {
		vector<int> t;
		if (v == 0) t.push_back(0); else {while (v != 0) {t.push_back(v%10); v = v/10;}}
		sort(t.begin(),t.end(),cmp_0_last);
		reverse(t);
		i64 r=0; while (!t.empty()) {r = r*10 + t.back(); t.pop_back();} return r;}
	i64 solve(int perm_cnt,int limit) {
		for (int l=1;l<=limit;l++) {
			i64 start = (i64)ceil (cbrt(ipow(10,l-1)));
			i64 end   = (i64)floor(cbrt(ipow(10,l  )));
			map<i64,i64> hist; // {perm: cnt}
			for (i64 cbrt=start;cbrt<=end;cbrt++)
				hist[sort_digits(cube(cbrt))]++;
			for(map<i64,i64>::iterator i = hist.begin(); i != hist.end(); i++) {
				if (i->second >= perm_cnt) {
					pr(i->second S i->first);
					for (i64 cbrt=start;cbrt<=end;cbrt++)
						if (sort_digits(cube(cbrt)) == i->first)
							pr(cube(cbrt));
				}
			}
		}
		return 0;}
	i64 solve() {return solve(5,12);}
}

#endif
//===--------------------------------------------===// problem 78 //===--------------------------------------------===//

#include "bigint.h"
namespace coin_partitions {
	#define MEMO_SIZE 3000
	int factor;
	int memo[MEMO_SIZE][MEMO_SIZE];
	int p(int n, int lim) {
		#define R int r=1; for (int i=1;i<lim;i++) r += p(n-i,min(n-i,i));
		if (n < MEMO_SIZE) {if (memo[n][lim] != 0) return memo[n][lim]; R; return (memo[n][lim] = r % factor);}
		else {R; return r % factor;}}
	int p(int n) {return p(n,n);}
	int solve(int factor_) {
		factor = factor_;
		for (int n=1;;n++) {int t = p(n); pr(n S t); if (t % factor == 0) return n;}
	}
	i64 solve() {return solve(1000000);}
}

//===--------------------------------------------===// <edge> //===--------------------------------------------===//

int main() {
	pr("start");
	pr(coin_partitions::solve(10000));

	return 0;}
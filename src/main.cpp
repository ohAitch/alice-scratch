#include <cstdio>
#include <iostream>
#include <iomanip> // for setprecision
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
#define pr_(v) cout << v
#define S <<" "<<
#define B <<"\t"<<
#define D(v) #v <<":"<< v
typedef long long i64;

namespace std {
	template <typename T> void sort(vector<T> &v) {sort(v.begin(),v.end());}
	template <typename T> void reverse(vector<T> &v) {reverse(v.begin(),v.end());}
}

//===--------------------------------------------===// common //===--------------------------------------------===//

#define SQ(v) ((v)*(v))
int gcd(int a, int b) {
	while (b != 0) {int t = a % b; a = b; b = t;}
	return a;}
bool coprime(int a, int b) {
	for(;;){
		if (!(a %= b)) return b == 1;
		if (!(b %= a)) return a == 1;
		}}
bool fast_square_verify(i64 x) {
	static int start[1024] = {
		1,3,1769,5,1937,1741,7,1451,479,157,9,91,945,659,1817,11,1983,707,1321,1211,1071,13,1479,405,415,1501,1609,741,15,339,1703,203,
		129,1411,873,1669,17,1715,1145,1835,351,1251,887,1573,975,19,1127,395,1855,1981,425,453,1105,653,327,21,287,93,713,1691,1935,301,551,587,
		257,1277,23,763,1903,1075,1799,1877,223,1437,1783,859,1201,621,25,779,1727,573,471,1979,815,1293,825,363,159,1315,183,27,241,941,601,971,
		385,131,919,901,273,435,647,1493,95,29,1417,805,719,1261,1177,1163,1599,835,1367,315,1361,1933,1977,747,31,1373,1079,1637,1679,1581,1753,1355,
		513,1539,1815,1531,1647,205,505,1109,33,1379,521,1627,1457,1901,1767,1547,1471,1853,1833,1349,559,1523,967,1131,97,35,1975,795,497,1875,1191,1739,
		641,1149,1385,133,529,845,1657,725,161,1309,375,37,463,1555,615,1931,1343,445,937,1083,1617,883,185,1515,225,1443,1225,869,1423,1235,39,1973,
		769,259,489,1797,1391,1485,1287,341,289,99,1271,1701,1713,915,537,1781,1215,963,41,581,303,243,1337,1899,353,1245,329,1563,753,595,1113,1589,
		897,1667,407,635,785,1971,135,43,417,1507,1929,731,207,275,1689,1397,1087,1725,855,1851,1873,397,1607,1813,481,163,567,101,1167,45,1831,1205,
		1025,1021,1303,1029,1135,1331,1017,427,545,1181,1033,933,1969,365,1255,1013,959,317,1751,187,47,1037,455,1429,609,1571,1463,1765,1009,685,679,821,
		1153,387,1897,1403,1041,691,1927,811,673,227,137,1499,49,1005,103,629,831,1091,1449,1477,1967,1677,697,1045,737,1117,1737,667,911,1325,473,437,
		1281,1795,1001,261,879,51,775,1195,801,1635,759,165,1871,1645,1049,245,703,1597,553,955,209,1779,1849,661,865,291,841,997,1265,1965,1625,53,
		1409,893,105,1925,1297,589,377,1579,929,1053,1655,1829,305,1811,1895,139,575,189,343,709,1711,1139,1095,277,993,1699,55,1435,655,1491,1319,331,
		1537,515,791,507,623,1229,1529,1963,1057,355,1545,603,1615,1171,743,523,447,1219,1239,1723,465,499,57,107,1121,989,951,229,1521,851,167,715,
		1665,1923,1687,1157,1553,1869,1415,1749,1185,1763,649,1061,561,531,409,907,319,1469,1961,59,1455,141,1209,491,1249,419,1847,1893,399,211,985,1099,
		1793,765,1513,1275,367,1587,263,1365,1313,925,247,1371,1359,109,1561,1291,191,61,1065,1605,721,781,1735,875,1377,1827,1353,539,1777,429,1959,1483,
		1921,643,617,389,1809,947,889,981,1441,483,1143,293,817,749,1383,1675,63,1347,169,827,1199,1421,583,1259,1505,861,457,1125,143,1069,807,1867,
		2047,2045,279,2043,111,307,2041,597,1569,1891,2039,1957,1103,1389,231,2037,65,1341,727,837,977,2035,569,1643,1633,547,439,1307,2033,1709,345,1845,
		1919,637,1175,379,2031,333,903,213,1697,797,1161,475,1073,2029,921,1653,193,67,1623,1595,943,1395,1721,2027,1761,1955,1335,357,113,1747,1497,1461,
		1791,771,2025,1285,145,973,249,171,1825,611,265,1189,847,1427,2023,1269,321,1475,1577,69,1233,755,1223,1685,1889,733,1865,2021,1807,1107,1447,1077,
		1663,1917,1129,1147,1775,1613,1401,555,1953,2019,631,1243,1329,787,871,885,449,1213,681,1733,687,115,71,1301,2017,675,969,411,369,467,295,693,
		1535,509,233,517,401,1843,1543,939,2015,669,1527,421,591,147,281,501,577,195,215,699,1489,525,1081,917,1951,2013,73,1253,1551,173,857,309,
		1407,899,663,1915,1519,1203,391,1323,1887,739,1673,2011,1585,493,1433,117,705,1603,1111,965,431,1165,1863,533,1823,605,823,1179,625,813,2009,75,
		1279,1789,1559,251,657,563,761,1707,1759,1949,777,347,335,1133,1511,267,833,1085,2007,1467,1745,1805,711,149,1695,803,1719,485,1295,1453,935,459,
		1151,381,1641,1413,1263,77,1913,2005,1631,541,119,1317,1841,1773,359,651,961,323,1193,197,175,1651,441,235,1567,1885,1481,1947,881,2003,217,843,
		1023,1027,745,1019,913,717,1031,1621,1503,867,1015,1115,79,1683,793,1035,1089,1731,297,1861,2001,1011,1593,619,1439,477,585,283,1039,1363,1369,1227,
		895,1661,151,645,1007,1357,121,1237,1375,1821,1911,549,1999,1043,1945,1419,1217,957,599,571,81,371,1351,1003,1311,931,311,1381,1137,723,1575,1611,
		767,253,1047,1787,1169,1997,1273,853,1247,413,1289,1883,177,403,999,1803,1345,451,1495,1093,1839,269,199,1387,1183,1757,1207,1051,783,83,423,1995,
		639,1155,1943,123,751,1459,1671,469,1119,995,393,219,1743,237,153,1909,1473,1859,1705,1339,337,909,953,1771,1055,349,1993,613,1393,557,729,1717,
		511,1533,1257,1541,1425,819,519,85,991,1693,503,1445,433,877,1305,1525,1601,829,809,325,1583,1549,1991,1941,927,1059,1097,1819,527,1197,1881,1333,
		383,125,361,891,495,179,633,299,863,285,1399,987,1487,1517,1639,1141,1729,579,87,1989,593,1907,839,1557,799,1629,201,155,1649,1837,1063,949,
		255,1283,535,773,1681,461,1785,683,735,1123,1801,677,689,1939,487,757,1857,1987,983,443,1327,1267,313,1173,671,221,695,1509,271,1619,89,565,
		127,1405,1431,1659,239,1101,1159,1067,607,1565,905,1755,1231,1299,665,373,1985,701,1879,1221,849,627,1465,789,543,1187,1591,923,1905,979,1241,181};

	static bool bad255[512] = {
		0,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,
		0,1,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,1,1,1,1,1,
		1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,
		1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,
		0,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,0,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,
		0,1,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,0,1,1,1,1,1,1,
		1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,
		1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0};

	// Quickfail
	if (x < 0 || (x&2) || ((x & 7) == 5) || ((x & 11) == 8)) return false;
	if (x == 0) return true;

	// Check mod 255 = 3 * 5 * 17, for fun
	i64 y = x;
	y = (y & 4294967295LL) + (y >> 32);
	y = (y & 65535) + (y >> 16);
	y = (y & 255) + ((y >> 8) & 255) + (y >> 16);
	if (bad255[y]) return false;

	// Divide out powers of 4 using binary search
	if ((x & 4294967295LL) == 0) x >>= 32;
	if ((x & 65535) == 0) x >>= 16;
	if ((x & 255) == 0) x >>= 8;
	if ((x & 15) == 0) x >>= 4;
	if ((x & 3) == 0) x >>= 2;

	if ((x & 7) != 1) return false;

	// Compute sqrt using something like Hensel's lemma
	i64 r, t, z;
	r = start[(x >> 3) & 1023];
	do {
		z = x - r * r;
		if (z == 0) return true;
		if (z < 0) return false;
		t = z & (-z);
		r += (z & t) >> 1;
		if (r > (t >> 1)) r = t - r;
	} while (t <= (1LL << 33));

	return false;}
#define sqv fast_square_verify
i64 ipow(i64 a,i64 b) {i64 r=1; for (i64 _=0;_<b;_++) r*=a; return r;}
//i64 ipow(i64 a,i64 b) {return (i64)(pow(a,b)+0.5);}
int ipow(int a,int b) {return (int)ipow((i64)a,(i64)b);}
//#include "bigint.h"
//InfInt ipow(InfInt a, InfInt b) {InfInt r=1; for (InfInt _=0;_<b;_++) r*=a; return r;}
void ceilE(int &l, int base) {l = (l-1)/base*base+base;}
void set_bit  (i64 &l, int i) {l |=   1LL << i ;}
void clear_bit(i64 &l, int i) {l &= ~(1LL << i);}

vector<int> primes;
vector<i64> is_primes;
void sieve();
bool is_prime(int n) {if (n/64 < is_primes.size()) return (is_primes[n/64] >> (n%64)) & 1; else {sieve(); return is_prime(n);}}
int prime(int n) {if (n < primes.size()) return primes[n-1]; else {sieve(); return prime(n);}}
void sieve(int lim) {
	ceilE(lim,64);
	int prev_lim = is_primes.size()*64;
	is_primes.resize(lim/64,-1LL);
	clear_bit(is_primes[0],0);
	clear_bit(is_primes[0],1);
	for (int i=1;i<=(int)sqrt(lim);i++)
		if (is_prime(i))
			for (int j=i*i;j<lim;j+=i)
				clear_bit(is_primes[j/64],j%64);
	for (int i=prev_lim+1;i<lim;i++)
		if (is_prime(i))
			primes.push_back(i);
	}
void sieve() {sieve(max((int)is_primes.size()*2,16)*64);}
vector<i64> prime_factors(i64 n) { // list of prime factors
	vector<i64> r;
	for (int i=1;;i++) {
		i64 p = prime(i);
		for (;;) {
			if (n < p*p) {if (n != 1) r.push_back(n); return r;}
			else if (n%p == 0) {r.push_back(p); n/=p;}
			else break;}
	}}
vector<int> prime_factors_group(i64 n) { // {(index by prime's index in primes[i]): count}
	vector<int> r;
	for (int i=1;;i++) {
		r.push_back(0);
		i64 p = prime(i);
		for (;;) {
			if (n == 1) return r;
			//if (n < p*p) {if (n != 1) {while (r.size() < n) r.push_back(0); r.push_back(1);} return r;}
			else if (n%p == 0) {r[r.size()-1]++; n/=p;}
			else break;}
	}}
int count_factors(i64 n) {
	vector<i64> npf = prime_factors(n);
	int ncf=1,t=0; for (int i=1;i<npf.size();i++) {t++; if (npf[i-1] != npf[i]) {ncf *= t+1; t = 0;}} ncf *= t+1+1;
	return ncf;}
int euler_totient(int n) {
	//eulerTotient = product . map (\(a,b) -> a^(b-1) * (a-1)) . map (\xs -> (head xs, len xs)) . group . primeFactors
	//vector<int> f = prime_factors_group(n);
	//int r=1; for (int i=0;i<f.size();i++) r *= prime(i)
	if (n<2) return 0;
	else if (is_prime(n)) return n-1;
	else if (n%2==0) {int m=n/2; return euler_totient(m) * (m%2==0? 2 : 1);}
	else for (int i=1;;i++) {int p = prime(i); if (!(p<=n)) pr("OH DEAR");
		if (n%p==0) {
			int d = gcd(p,n/p);
			int r = euler_totient(p)*euler_totient(n/p);
			return d==1? r : r*d/euler_totient(d);
		}
	}}
//sumDivisors = product . map (\(a,b) -> sum $ map ((^) a) [0..b]) . map (\xs -> (head xs, len xs)) . group . primeFactors

//int fast_pow(int v, int e, int m) { // return v**e % m;
	//int r = 1;
	//while (e > 0) {
	//	if (e % 2 == 1)
	//		r = (r*v) % m;
	//	e >>= 1;
	//	v = (v*v) % m;
	//}
	//return r;}
// uses binomial expansion to cheaply calculate pow(a-1,n,m) and pow(a+1,n,m) where m == a**2
i64 mod_pow_sq_p1(i64 a, i64 n, i64 m) {return (a*n + 1) % m;}
i64 mod_pow_sq_m1(i64 a, i64 n, i64 m) {return ((n%2==0? (-a*n + 1) : (a*n - 1)) + m) % m;}

//===--------------------------------------------===// solutions //===--------------------------------------------===//

/*===---  14 ---===*/ namespace collatz {/*
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
	*/}
/*===---  62 ---===*/ namespace cubic_permutations {/*
	bool cmp_0_last(int a,int b) {return a == 0? false : b == 0? true : a<b;}
	i64 cube(i64 v) {return v*v*v;}
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
	*/}
/*===---  73 ---===*/ namespace ranging_fractions {/*
	int solve(int D) {
		int r = 0;
		for (int d=2;d<=D;d++)
			for (int n=d/3+1;n<d/2+(d%2==0?0:1);n++)
				if (coprime(n,d))
					r++;
		return r;}
	int solve() {return solve(12000);}
	*/}
/*===---  75 ---===*/ namespace pythagorean_rapture {/*
	int solve(i64 lim) {
		int r=0;
		for (i64 l=2;l<=lim;l+=2) {
			// b = (L-A - AA/(L-A))/2
			#define SOLVE_BC(test) {i64 x=l-a, y=a*a, z=y/x; if (z*x==y) {test {if (cnt == 1) goto main; cnt=1;}}}
			i64 start = (i64)(l/(2+sqrt(2)))+1;
			i64 se = start + (start%2==0? 0 : 1);
			i64 so = start + (start%2==0? 1 : 0);
			int cnt=0;
			for (i64 a=se;a<l/2;a+=2) SOLVE_BC(i64 w=x-z; i64 b=w/2; if (b*2==w))
			for (i64 a=so;a<l/2;a+=2) SOLVE_BC(;)
			if (cnt == 1) {
				r++;
				if (r%10==0) pr("mrr~" S r S l);
			}
		main:;}
		return r;}
	int solve() {return solve(1500000);}
	*/}
/*===---  78 ---===*/ namespace coin_partitions {/*
	i64 solve(int factor, int buf_size) {
		int memo[buf_size];
		int init_buf[buf_size];

		for (int i=0;i<buf_size;i++) init_buf[i] = 1;
		for (int lim=2;lim<buf_size;lim++) {
			for (int n=lim;n<buf_size;n++)
				{init_buf[n] += init_buf[n-lim]; init_buf[n] %= factor;}
			memo[lim] = init_buf[lim];
			if (lim % (buf_size/20) == 0) pr("|" S lim S memo[lim]);
			if (memo[lim] == 0) return lim;
		}

		return -1;}
	i64 solve() {return solve(1000000,100000);}
	*/}
/*===---  94 ---===*/ namespace pythagorean_isosceles {/*
	i64 solve(int lim) {
		i64 r=0;
		for (i64 i=3;i<=lim/3;i+=2) {
			i64 m = i*i - (i-1)*(i-1)/4;
			i64 p = i*i - (i+1)*(i+1)/4;
			if (sqv(m)) {r += i*3-1; pr("woo-" S i S r);}
			if (sqv(p)) {r += i*3+1; pr("woo+" S i S r);}
		}
		return r;}
	i64 solve() {return solve(1000000000);}
	*/}
/*===--- 100 ---===*/ namespace consecutive_factorization {/*
	bool mul_eq(i64 a0, i64 a1, i64 b0, i64 b1) { // return a0*a1 == b0*b1;
		#define M32 0xffffffff
		#define DE_(v) i64 v##0 = v & M32; i64 v##1 = (v>>32) & M32;
		#define DE(v) DE_(v##0) DE_(v##1)
		#define DE2(v) DE(v##0) DE(v##1)
		#define MUL(p) i64 p##m00 = p##00*p##10; i64 p##m01 = p##00*p##11; i64 p##m10 = p##01*p##10; i64 p##m11 = p##01*p##11;
		DE(a) DE(b)
		MUL(a) MUL(b)
		DE2(am) DE2(bm)
		return (am000 == bm000 && am001+am010+am100 == bm001+bm010+bm100 && am011+am101+am110 == bm011+bm101+bm110 && am111==bm111);}
	bool match(i64 n) {double t = (int)(n/sqrt(2)+0.5); return mul_eq(t*2,t-1,n,n-1);}
	i64 solve(i64 start) {
		for (i64 i=start;;i++)
			if (match(i))
				pr("max" S i);
		return 0;}
	i64 solve() {return 0;}
	// finished solving in python
	// from math import *
	// v = 4
	// while v < 1e12: v = v * (sqrt(2)*2+3) - 2
	// print 'answer:',v
	*/}
/*===--- 110 ---===*/ namespace bielephantine {/*
	int count_factors_special(i64 n) {
		vector<int> npf = prime_factors_group(n);
		if (npf.size() < 10) npf.resize(10,0); static int extra[] = {2,2,1,1,1,1,1,1,1,1}; // (2^2 3^2 5 7 11 13 17 19 23 29)^2
		int r=1; for (int i=0;i<npf.size();i++) r *= npf[i]+(i<10?extra[i]*2:0)+1; return r;}
	int solve() {
		sieve(1000000);
		int top=0;
		for (i64 n=1;;n++) if (!is_prime(n)) {int t = (count_factors_special(n*n)+1)/2; if (t > top) {pr("new top!" S n B t); top = t;}}
		return 0;}
	*/}
/*===--- 119 ---===*/ namespace digit_powah {/*
	InfInt sum_digits(InfInt v) {InfInt r=0; while (v > 0) {r += v%10; v /= 10;} return r;}
	i64 sum_digits(i64 v) {i64 r=0; while (v > 0) {r += v%10; v /= 10;} return r;}
	bool is_powah(i64 v) {i64 s = sum_digits(v), t=1; if (s == 1) return false; while (t < v) {t *= s; if (t == v) return true;} return false;}
	int solve(int n) {
		for (i64 i=1;;i++) {
			for (i64 j=0;j<i;j++) {
				for (i64 k=0;k<10;k++) {
					InfInt a = j*10+k + 2, b = i-j-1 + 2;
					InfInt p = ipow(a,b);
					InfInt s = sum_digits(p);
					if (s == a) pr("solution" S a S b S p);
				}
			}
		}
	}
	int solve() {return solve(30);}
	*/}
/*===--- 120 ---===*/ namespace modular_exponentiation {/*
	int rmax(int a) {i64 r = 0; for (int n=0;n<a*a*2;n++) r = max(r,mod_pow_special(a,n)); return (int)r;}
	int solve(int from, int to) {int r = 0; for (int i=from;i<=to;i++) {r += rmax(i); pr(i);} return r;}
	int solve() {return solve(3,1000);}
	*/}
/*=-- 129 & 130 --=*/ namespace serial_punist {/*
	int A(int n) {int r=1; for (int k=1;;k++) {if (r%n==0) return k; r=(r*10+1)%n;}}
	int solve_129(int lim) {
		for (int n=1;;n++) {
			if (coprime(n,10) && A(n) > lim) return n;
			if (n%100==0) pr("bluh" S n);
		}
	}
	int solve_129() {return solve_129(1000000);}
	int solve_130() {int r=0, cnt=0; for (int i=2;;i++) if (!is_prime(i) && gcd(i,10)==1) if ((i-1)%A(i)==0) {pr("~" S i); r += i; cnt++; if (cnt >= 25) return r;}}
	*/}
/*===--- 131 ---===*/ namespace defiant_fucking {/*
	i64 winN=1;
	bool fucks(i64 p) {
		for (i64 N=winN;N<=winN+30;N++) {
			i64 af = N*N;
			i64 n = N*N*N;
			for (i64 a=n+af;a<n+p;a+=af) {i64 t = a*a+a*n+n*n; if (t%p==0 && t/p*(a-n) == n*n) {winN = N; return true;}}
		}
		return false;}
	int solve() {
		int r=0;
		for (int i=1;;i++) {int p = prime(i); if (p >= 1000000) break; if (fucks(p)) {r++; pr("!" S r S i S p);}}
		return r;}
	*/}
/*===--- 142 ---===*/ namespace square_orgy {/*
	int solve() {
		for (int x=3;;x++)
		for (int Y=1;;Y++) {
			int y = x - Y*Y;
			if (!(y>1)) break;
			if (sqv(x+y))
			for (int Z=1;;Z++) {
				int z = y - Z*Z;
				if (!(z>0)) break;
				if (sqv(x+z) && sqv(x-z) && sqv(y+z)) pr("SOLUTION" S (x+y+z) S "|" S x S y S z);
			}
		}
	}
	*/}
/*=-- 173 & 174 --=*/ namespace laminae {/*
	int l(int n) {
		int r=0;
		for (int w=1;w<=(int)(sqrt(n)/2-0.00000001);w++)
			if (n/(4*w)*(4*w) == n)
				r++;
		return r;}
	int solve_173() {
		int r=0;
		for (int i=1;i<=1000000;i++) {
			r += l(i);
			if (i%10000==0) pr(i S r);
		}
		return r;}
	int solve_174() {
		int r=0;
		for (int i=1;i<=1000000;i++) {
			int n = l(i);
			if (1 <= n && n <= 10) r++;
			if (i%10000==0) pr(i S r);
		}
		return r;}
	*/}
/*===--- 214 ---===*/ namespace fifty_shades_of_totient {/*
	// misses 357800039 ??
	bool yes(int n) {for (int i=0;i<25-1;i++) {n = euler_totient(n); if (n == 0) return false;} return n == 1;}
	i64 solve() {
		i64 r=0;
		for (int i=1;;i++) {int p = prime(i); if (!(p<40000000)) break; if (yes(p)) {r+=p; if (i%100==0) pr("hi!" S i S p S r);}}
		return r;}
	*/}
/*===--- 243 ---===*/ namespace gcd_search {/*
	double q(int v) {
		int r = 0;
		for (int i=1;i<v;i++) if (coprime(i,v)) r++;
		return r / (double)(v-1);}
	int solve(double target) {
		double low = 1;
		for (int i=1;;i++) {
			double t = q(i*2*3*5*7*11*13*17*19*23);
			if (t < low) {
				pr("new low!" S i S setprecision(15) S t);
				low = t;
				if (t < target) return i;
			}
		}
	}
	int solve() {return solve(15499.0/94744.0);} // 0.16358819555855779785527315713924
	*/}
/*===-----------===*/ namespace scratch_space {
	i64 solve() {
		int c=1,p=0;
		for (int l=2;;l++) {
			int w = l*2-1;
			for (int i=0;i<4;i++) {int v = w*w - (3-i)*(w-1); if (is_prime(v)) p++; else c++;}
			if (9*p < 1*c) return w;
			pr("-" S l S 9*p S 1*c);
		}}
	}

//===--------------------------------------------===// main //===--------------------------------------------===//

int main() {
	pr("start");
	pr(scratch_space::solve());
	return 0;}
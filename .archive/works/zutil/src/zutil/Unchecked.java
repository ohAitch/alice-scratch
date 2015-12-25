package zutil;

public class Unchecked {

static public long   l_add(long   a, long   b){return a + b;}
static public long   l_sub(long   a, long   b){return a - b;}
static public long   l_neg(long   a          ){return -a;}
static public long   l_mul(long   a, long   b){return a * b;}
static public long   l_div(long   a, long   b){return a / b;}
static public long   l_rem(long   a, long   b){return a % b;}

static public double d_add(double a, double b){return a + b;}
static public double d_sub(double a, double b){return a - b;}
static public double d_neg(double a          ){return -a;}
static public double d_mul(double a, double b){return a * b;}
static public double d_div(double a, double b){return a / b;}
static public double d_rem(double a, double b){return a % b;}

static public float  f_add(float  a, float  b){return a + b;}
static public float  f_sub(float  a, float  b){return a - b;}
static public float  f_neg(float  a          ){return -a;}
static public float  f_mul(float  a, float  b){return a * b;}
static public float  f_div(float  a, float  b){return a / b;}
static public float  f_rem(float  a, float  b){return a % b;}

}
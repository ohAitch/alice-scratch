package grass2;

import java.util.Arrays;
import java.util.Random;

//version: June 25 2010

/**Provides a variety of succinctly named functions for general use.*/
public /*static*/ final class S
{
//////////////////////////////////////////////////////////////// misc ////////////////////////////////////////////////////////////////

		/**System.arraycopy(...)*/
	public static void ac(Object src, int srcPos, Object dest, int destPos, int length)
		{System.arraycopy(src, srcPos, dest, destPos, length);}
		
	public static void sleep(long millis)
	{
		try {Thread.sleep(millis);}
		catch (InterruptedException e) {}
	}
	
		//yeah, I know that I should just be using asserts, but I _like_ this
	public static void claim(boolean claim)
		{if (!claim) throw new AssertationException();}
	public static void claim(boolean claim, String message)
		{if (!claim) throw new AssertationException(message);}

	public static int intpow(int base, int exponent)
	{
		if (exponent == 2) return base * base;
		if (exponent == 3) return base * base * base;
		if (exponent > 3)
		{
			int b = base;
			for (int i = 1; i < exponent; i++)
				base *= b;
			return base;
		}
		if (exponent == 1) return base;
		if (exponent == 0) return 1;
		return 0;
	}
	
//////////////////////////////////////////////////////////////// timing ////////////////////////////////////////////////////////////////

		/**System.currentTimeMillis()*/
	public static long time() {return System.currentTimeMillis();}
		/**System.nanoTime() / 1000000*/
	public static long mTime() {return System.nanoTime() / 1000000;}
		/**System.nanoTime()*/
	public static long nTime() {return System.nanoTime();}

	/*private static sun.misc.Perf perf = sun.misc.Perf.getPerf();
	private static long perfFreq = perf.highResFrequency();
	public static long pTime()
		{S.pln(Long.MAX_VALUE + " " + (perf.highResCounter() * 1000000000L));
		return (perf.highResCounter() * 1000000000L) / perfFreq;}*/

//////////////////////////////////////////////////////////////// random ////////////////////////////////////////////////////////////////

	public static Random rand = new Random();
	
		/**rand.nextDouble()*/
	public static double rand()
		{return rand.nextDouble();}

		/**Returns a random integer between 0 (inclusive) and inty (exclusive).*/
	public static int rand(int inty)
		{return rand.nextInt(inty);}
		
		/**Returns a random integer between a (inclusive) and b (inclusive).*/
	public static int rand(int a, int b)
		{return rand.nextInt(b - a + 1) + a;}
	
		/**Returns a random double between a (inclusive) and b (inclusive).*/
	public static double rand(double a, double b)
		{return rand() * (b - a) + a;}
		
	public static int getRandomNumber()
	{
		return 4;	// chosen by fair dice roll.
					// guaranteed to be random.
	}

//////////////////////////////////////////////////////////////// strings & print ////////////////////////////////////////////////////////////////

	/**System.out.print*/ public static void p(int eger) {System.out.print(eger);}
	/**System.out.print*/ public static void p(byte code) {System.out.print(code);}
	/**System.out.print*/ public static void p(char coal) {System.out.print(coal);}
	/**System.out.print*/ public static void p(long boat) {System.out.print(boat);}
	/**System.out.print*/ public static void p(float ation) {System.out.print(ation);}
	/**System.out.print*/ public static void p(short cut) {System.out.print(cut);}
	/**System.out.print*/ public static void p(char[] grilled) {System.out.print(grilled);}
	/**System.out.print*/ public static void p(double penetration) {System.out.print(penetration);}
	/**System.out.print*/ public static void p(Object Oriented) {System.out.print(Oriented);}
	/**System.out.print*/ public static void p(String theory) {System.out.print(theory);}
	/**System.out.print*/ public static void p(boolean logic) {System.out.print(logic);}

	/**System.out.println*/ public static void pln() {System.out.println();}
	/**System.out.println*/ public static void pln(int p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(byte p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(char p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(long p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(short p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(float p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(char[] p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(double p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(Object p) {System.out.println(p);}
	/**System.out.println*/ public static void pln(boolean p) {System.out.println(p);}
	
	/**prints .toString()'d stuff with ' + " " + ' between*/
	public static void plno(Object... args)
	{
		String print = new String();
		for (Object o : args)
			print += o.toString() + " ";
		print = print.substring(0, print.length() - 1);
		S.pln(print);
	}
	
	/**plno with .toHex(...)ing*/
	public static void plnohex(Object... args)
	{
		String print = new String();
		for (Object o : args)
			if (o instanceof Integer) print += toHex((Integer)o) + " ";
			else if (o instanceof Double) print += toHex((Double)o) + " ";
			else if (o instanceof Float) print += toHex((Float)o) + " ";
			else if (o instanceof Byte) print += toHex((Byte)o) + " ";
			else if (o instanceof Short) print += toHex((Short)o) + " ";
			else if (o instanceof Long) print += toHex((Long)o) + " ";
			else print += o.toString() + " ";
		if (print.length() > 0)
			print = print.substring(0, print.length() - 1);
		S.pln(print);
	}
	
	/**converts to hex string (Double.toHexString(hex))*/ public static String toHex(double hex) {return Double.toHexString(hex);}
	/**converts to hex string (Float.toHexString(hex))*/ public static String toHex(float hex) {return Float.toHexString(hex);}
	/**efficiently converts to hex string*/ public static String toHex(byte hex) {return new String (new char[]{hexchar[hex >>> 4 & 0xf], hexchar[hex & 0xf]});}
	/**efficiently converts to hex string*/ public static String toHex(short hex)
		{return new String(new char[]{hexchar[hex >>> 12], hexchar[hex >>> 8 & 0xf], hexchar[hex >>> 4 & 0xf], hexchar[hex & 0xf]});}
	/**efficiently converts to hex string*/ public static String toHex(int hex)
		{return new String(new char[]{hexchar[hex >>> 28      ], hexchar[hex >>> 24 & 0xf], hexchar[hex >>> 20 & 0xf], hexchar[hex >>> 16 & 0xf],
		                              hexchar[hex >>> 12 & 0xf], hexchar[hex >>>  8 & 0xf], hexchar[hex >>>  4 & 0xf], hexchar[hex        & 0xf]});}
	/**efficiently converts to hex string*/ public static String toHex(long hex)
		{int hex1 = (int)(hex >>> 32); int hex2 = (int)hex;
		return new String(new char[]{hexchar[hex1 >>> 28      ], hexchar[hex1 >>> 24 & 0xf], hexchar[hex1 >>> 20 & 0xf], hexchar[hex1 >>> 16 & 0xf],
		                             hexchar[hex1 >>> 12 & 0xf], hexchar[hex1 >>>  8 & 0xf], hexchar[hex1 >>>  4 & 0xf], hexchar[hex1        & 0xf],
		                             hexchar[hex2 >>> 28      ], hexchar[hex2 >>> 24 & 0xf], hexchar[hex2 >>> 20 & 0xf], hexchar[hex2 >>> 16 & 0xf],
		                             hexchar[hex2 >>> 12 & 0xf], hexchar[hex2 >>>  8 & 0xf], hexchar[hex2 >>>  4 & 0xf], hexchar[hex2        & 0xf]});}
	private static final char[] hexchar = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

//////////////////////////////////////////////////////////////// } ////////////////////////////////////////////////////////////////
}

class AssertationException extends RuntimeException
{
    public AssertationException() {super();}
    public AssertationException(String message) {super(message);}
    public AssertationException(String message, Throwable cause) {super(message, cause);}
    public AssertationException(Throwable cause) {super(cause);}
}

class Arrayu
{
	
	public static     int[] fill(    int[] a,     int val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static    byte[] fill(   byte[] a,    byte val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static    char[] fill(   char[] a,    char val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static    long[] fill(   long[] a,    long val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static   float[] fill(  float[] a,   float val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static   short[] fill(  short[] a,   short val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static  double[] fill( double[] a,  double val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static  String[] fill( String[] a,  String val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	public static boolean[] fill(boolean[] a, boolean val) {for (int i = 0; i < a.length; i++) a[i] = val; return a;}
	
	public static     int[][] fill(    int[][] a,     int val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static    byte[][] fill(   byte[][] a,    byte val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static    char[][] fill(   char[][] a,    char val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static    long[][] fill(   long[][] a,    long val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static   float[][] fill(  float[][] a,   float val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static   short[][] fill(  short[][] a,   short val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static  double[][] fill( double[][] a,  double val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static  String[][] fill( String[][] a,  String val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	public static boolean[][] fill(boolean[][] a, boolean val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) a[i][j] = val; return a;}
	
	public static     int[][][] fill(    int[][][] a,     int val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static    byte[][][] fill(   byte[][][] a,    byte val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static    char[][][] fill(   char[][][] a,    char val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static    long[][][] fill(   long[][][] a,    long val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static   float[][][] fill(  float[][][] a,   float val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static   short[][][] fill(  short[][][] a,   short val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static  double[][][] fill( double[][][] a,  double val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static  String[][][] fill( String[][][] a,  String val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	public static boolean[][][] fill(boolean[][][] a, boolean val) {for(int i=0;i<a.length;i++) for(int j=0;j<a[i].length;j++) for(int k=0;k<a[i][j].length;k++) a[i][j][k] = val; return a;}
	
	/*public static int[] fill(int[] a, int val) {Arrays.fill(a, val); return a;}
	public static byte[] fill(byte[] a, byte val) {Arrays.fill(a, val); return a;}
	public static char[] fill(char[] a, char val) {Arrays.fill(a, val); return a;}
	public static long[] fill(long[] a, long val) {Arrays.fill(a, val); return a;}
	public static float[] fill(float[] a, float val) {Arrays.fill(a, val); return a;}
	public static short[] fill(short[] a, short val) {Arrays.fill(a, val); return a;}
	public static double[] fill(double[] a, double val) {Arrays.fill(a, val); return a;}
	public static String[] fill(String[] a, String val) {Arrays.fill(a, val); return a;}
	public static boolean[] fill(boolean[] a, boolean val) {Arrays.fill(a, val); return a;}
	
	public static int[][] fill(int[][] a, int val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static byte[][] fill(byte[][] a, byte val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static char[][] fill(char[][] a, char val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static long[][] fill(long[][] a, long val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static float[][] fill(float[][] a, float val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static short[][] fill(short[][] a, short val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static double[][] fill(double[][] a, double val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static String[][] fill(String[][] a, String val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	public static boolean[][] fill(boolean[][] a, boolean val) {for (int i = 0; i < a.length; i++) Arrays.fill(a[i], val); return a;}
	
	public static int[][][] fill(int[][][] a, int val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i][j], val); return a;}
	public static byte[][][] fill(byte[][][] a, byte val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static char[][][] fill(char[][][] a, char val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static long[][][] fill(long[][][] a, long val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static float[][][] fill(float[][][] a, float val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static short[][][] fill(short[][][] a, short val) {for (int i = 0; i < a.length; i++) for (int j = 0; j < a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static double[][][] fill(double[][][] a, double val) {for (int i = 0; i < a.length; i++) for (int j=0; j<a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static String[][][] fill(String[][][] a, String val) {for (int i = 0; i < a.length; i++) for (int j=0; j<a[i].length; j++) Arrays.fill(a[i], val); return a;}
	public static boolean[][][] fill(boolean[][][] a, boolean val) {for (int i = 0; i < a.length; i++) for (int j=0; j<a[i].length; j++) Arrays.fill(a[i], val); return a;}
*/
}
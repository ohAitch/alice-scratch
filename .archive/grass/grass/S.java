package grass;

import java.util.Arrays;
import java.util.Random;

/**Provides a shorthand for some general functions, such as those in java.util.Arrays, java.util.Random and java.lang.System*/
public /*static*/ final class S
{
//////////////////////////////////////////////////////////////// arrays ////////////////////////////////////////////////////////////////

		/**System.arraycopy(...)*/
	public static void ac(Object src, int srcPos, Object dest, int destPos, int length)
		{System.arraycopy(src, srcPos, dest, destPos, length);}

	public static int[] newFilledArray(int length, int fill)
	{
		int[] ret = new int[length];
		Arrays.fill(ret, fill);
		return ret;
	}

//////////////////////////////////////////////////////////////// misc ////////////////////////////////////////////////////////////////

	public static void sleep(long millis)
	{
		try {Thread.sleep(millis);}
		catch (InterruptedException e) {}
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

//////////////////////////////////////////////////////////////// strings ////////////////////////////////////////////////////////////////

	/**converts to hex string*/ public static String toHex(int hex) {return Integer.toHexString(hex);}
	/**converts to hex string*/ public static String toHex(double hex) {return Double.toHexString(hex);}
	/**converts to hex string*/ public static String toHex(float hex) {return Float.toHexString(hex);}
	/**converts to hex string*/ public static String toHex(byte hex)
		{return hex < 0? Integer.toHexString(hex).substring(6) : (hex < 16? "0" + Integer.toHexString(hex) : Integer.toHexString(hex));}
	/**converts to hex string*/ public static String toHex(short hex) {return Integer.toHexString(hex);}
	/**converts to hex string*/ public static String toHex(long hex) {return Long.toHexString(hex);}

//////////////////////////////////////////////////////////////// print ////////////////////////////////////////////////////////////////

	/**System.out.print(...)*/ public static void p(int printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(byte printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(char printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(long printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(short printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(float printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(double printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(char[] printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(Object printy) {System.out.print(printy);}
	/**System.out.print(...)*/ public static void p(boolean printy) {System.out.print(printy);}

	/**System.out.println()*/    public static void pln() {System.out.println();}
	/**System.out.println(...)*/ public static void pln(int printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(byte printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(char printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(long printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(short printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(float printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(double printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(char[] printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(Object printy) {System.out.println(printy);}
	/**System.out.println(...)*/ public static void pln(boolean printy) {System.out.println(printy);}

	/**printlns hex form of printy*/ public static void plnhex(int printy) {pln(toHex(printy));}
	/**printlns hex form of printy*/ public static void plnhex(byte printy) {pln(toHex(printy));}
	/**printlns hex form of printy*/ public static void plnhex(long printy) {pln(toHex(printy));}
	/**printlns hex form of printy*/ public static void plnhex(short printy) {pln(toHex(printy));}
	/**printlns hex form of printy*/ public static void plnhex(float printy) {pln(toHex(printy));}
	/**printlns hex form of printy*/ public static void plnhex(double printy) {pln(toHex(printy));}
	
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
		print = print.substring(0, print.length() - 1);
		S.pln(print);
	}
	
//////////////////////////////////////////////////////////////// } ////////////////////////////////////////////////////////////////
}
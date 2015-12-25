// idea: SOUND!~
// other sexy colors: (.5,.8,.1) and (.8,.1,.8)
// we REALLY need a force that actually properly counteracts gravity

// jargon:
// sscmp: sufficiently-smart-compiled . means that the code is a deliberate performance hack

import lombok.*;
import java.util.*;
import static java.lang.Math.*;
import static java.lang.Double.isNaN;
import java.util.concurrent.atomic.*;
import java.lang.reflect.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;

import java.io.*;
import java.applet.*;
import java.net.*;

import java.util.List;

public class $ {

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// in the style of greenspun's law //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// COPIED VERBATIM FROM ATCMIT

static interface Fn0 <R> {R $();}
static interface Fn1 <R,A> {R $(A a);}
static <R,A> Fn1<R,A> fn1(final Class c, String name) {
	{val m = jmethod1(c,name); if (m != null) {
		val s = jisStatic(m);
		return new Fn1<R,A>(){public R $(A a){try {return (R)(s? m.invoke(null,a) : m.invoke((Class)a));} catch (Exception e) {return throw_(e);}}};
	}}{val m = jfield(c,name); if (m != null) {
		return new Fn1<R,A>(){public R $(A a){try {return (R)m.get(a);} catch (Exception e) {return throw_(e);}}};
	}}
	return fail();}
static <T> T throw_(Object v) {
	$.<RuntimeException>throw__(v instanceof Throwable? (Throwable)v : new Exception(""+v));
	return null;}
@SuppressWarnings("unchecked") static <T extends Throwable> void throw__(Throwable t) throws T {throw (T)t;}
static <T> T fail(Object... v) {return throw_(new Exception(v.length == 0? "assert false;" : pretty(v)));}
static String pretty(Object... v) {String r = ""; if (v.length > 0) {r += v[0]; for (int i = 1; i < v.length; i++) r += " "+v[i];} return r;}
static void print(Object... v) {System.out.print(pretty(v));}
static void println(Object... v) {System.out.println(pretty(v));}
static int i(Object v) {return v instanceof Number? ((Number)v).intValue() : Integer.parseInt(v+"");}
static double d(Object v) {return v instanceof Number? ((Number)v).doubleValue() : Double.parseDouble(v+"");}
static boolean b(Object v) {return v instanceof Boolean? (Boolean)v : "true".equals(v)? true : "false".equals(v)? false : v != null;}
static File file(Object v) {return v instanceof File? (File)v : new File(v+"");}
static <T> List<T> list(Object... v) {val r = new ArrayList<T>(); for (val vv : v) r.add((T)vv); return r;}
static <K,V> Map<K,V> hashMap(Object... v) {
	if (v.length % 2 != 0) fail();
	val r = new HashMap<K,V>(); for (int i=0;i<v.length/2;i++) r.put((K)v[i*2],(V)v[i*2+1]); return r;}
static <T> Set<T> set(Object... v) {val r = new HashSet<T>(); for (val vv : v) r.add((T)vv); return r;}
static <T,_> List<T> map(Object list, Fn1<T,_> f) {
	List<T> r = list();
	for (val v : (List<_>)list) r.add(f.$(v));
	return r;}
static <K,V> Map<K,V> dictBy(Object list, Fn1<K,V> f) {
	Map<K,V> r = hashMap();
	for (val v : (List<V>)list) r.put(f.$(v),v);
	return r;}
static <T> T T(Object v) {return (T)v;}
static <T> T or(T a, T b) {return a != null? a : b;}
static <T> T copy(T v) {
	if (v instanceof List) return (T)new ArrayList<T>((List)v);
	return fail();}
static <T> List<T> cat(List<T> a, List<T> b) {val r = $.<T>list(); r.addAll(a); r.addAll(b); return r;}

static <T> T jaccessible(T v) {((AccessibleObject)v).setAccessible(true); return v;}
static Method jmethod1(Class c, String name) {
	Method r = null;
	Class c_ = c;
	do {
		for (val m : c_.getDeclaredMethods())
			if (m.getName().equals(name))
				{if (r != null) return null; else r = m;}
		c_ = c_.getSuperclass();
	} while (c_ != null);
	return r == null? null : jaccessible(r);}
static Field jfield(Class c, String name) {
	Field r = null; try {r = c.getDeclaredField(name);} catch (NoSuchFieldException e) {}
	return r == null? null : jaccessible(r);}
static Object jmethod_call(Object me, String name, Object... args) {
	try {return jmethod1(me.getClass(),name).invoke(me,args);} catch (Exception e) {return throw_(e);}}
static <T> T jcall(Object v, String name, Object... args) {try {
	val vc = v instanceof Class;
	val c = vc? (Class)v : v.getClass();
	v = vc? null : v;
	val j = jaccessible(c.getDeclaredField(name));
	if (args.length == 0) {
		return (T)j.get(v);
	} else if (args.length == 1) {
		j.set(v,args[0]); return (T)args[0];
	} else return fail();
	} catch (Exception e) {return throw_(e);}}
static boolean jisStatic(Member m) {return Modifier.isStatic(m.getModifiers());}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// misc //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
// COPIED VERBATIM FROM ATCMIT

static double time() {return System.nanoTime()/1000000000.0;}

// random
static {random();}
static Random rand = jcall(Math.class,"randomNumberGenerator");
static <T> T rand(List<T> v) {return v.get(rand.nextInt(v.size()));}
static int rand(int n) {return rand.nextInt(n);}
static int rand(int a, int b) {return rand(b-a)+a;}

// strictly better than java.util.Timer (also, uses daemon threads)
// minor issue: only uses ten threads, so eleven tasks won't happen simultaneously
static AtomicInteger _timerName = new AtomicInteger();
static java.util.concurrent.ScheduledExecutorService _timer =
	java.util.concurrent.Executors.newScheduledThreadPool(10,
		new java.util.concurrent.ThreadFactory(){public Thread newThread(final Runnable v){
			Thread r = new Thread(v); r.setDaemon(true); r.setName("pool_timer-"+_timerName.incrementAndGet()); return r;}});
static Runnable _exWrap(final Runnable v) {class c_exWrap implements Runnable {public void run(){try {v.run();} catch (Throwable e) {
	List t = list();
	StackTraceElement here = null;
	for (val v : e.getStackTrace()) {
		if (v.getClassName().endsWith("c_exWrap"))
			{here = v; break;}
		t.add(v);}
	e.setStackTrace((StackTraceElement[])t.toArray(new StackTraceElement[0]));
	print("Exception in thread \""+Thread.currentThread().getName()+"\" "); e.printStackTrace();
	println("\tat <pool> ("+here+")");
	}}}
	return new c_exWrap();}
static void runIn(double seconds, Runnable v) {_timer.schedule(_exWrap(v),(long)(seconds*1000),java.util.concurrent.TimeUnit.MILLISECONDS);}
static void runWithFixedRate(double seconds, Runnable v) {_timer.scheduleAtFixedRate(_exWrap(v),0,(long)(seconds*1000),java.util.concurrent.TimeUnit.MILLISECONDS);}
static void runWithFixedDelay(double seconds, Runnable v) {_timer.scheduleWithFixedDelay(_exWrap(v),0,(long)(seconds*1000),java.util.concurrent.TimeUnit.MILLISECONDS);}

// swing / awt
static Color color(double r, double g, double b) {return new Color((float)min(r,1d),(float)min(g,1d),(float)min(b,1d));}
static int SCREEN_WIDTH() {return TK().getScreenSize().width;}
static int SCREEN_HEIGHT() {return TK().getScreenSize().height;}
static int c1080(int v) {return v*SCREEN_HEIGHT()/1080;}
static float c1080(float v) {return v*SCREEN_HEIGHT()/1080;}
static Toolkit TK() {return Toolkit.getDefaultToolkit();}
static JFrame makeFullscreenJFrame() {
	val r = new JFrame();
	r.setUndecorated(true);
	r.setSize(TK().getScreenSize());
	return r;}
static void JFrame_setContentPane(JFrame a, Container b) {
	a.setContentPane(b);
	a.validate();
	a.repaint();
	}
static void JFrame_addEscapeHook(JFrame jf, final Runnable v) {
	jf.getRootPane().registerKeyboardAction(
		new ActionListener(){public void actionPerformed(ActionEvent e) {v.run();}},
		KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE,0),
		JComponent.WHEN_IN_FOCUSED_WINDOW);
	}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// semiverbatim? //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

static class D2 {
	final double x, y;

	static D2 O = D2(0,0);
	D2(double x, double y) {this.x = x; this.y = y;}
	static D2 polar(double r, double theta) {return D2(r*cos(theta),r*sin(theta));}

	D2 add(D2 b) {return D2(x+b.x,y+b.y);}
	D2 sub(D2 b) {return D2(x-b.x,y-b.y);}
	D2 mul(D2 b) {return D2(x*b.x,y*b.y);}
	D2 div(D2 b) {return D2(x/b.x,y/b.y);}
	D2 add(I2 b) {return D2(x+b.x,y+b.y);}
	D2 sub(I2 b) {return D2(x-b.x,y-b.y);}
	D2 mul(I2 b) {return D2(x*b.x,y*b.y);}
	D2 div(I2 b) {return D2(x/b.x,y/b.y);}
	D2 add(double v) {return D2(x+v,y+v);}
	D2 sub(double v) {return D2(x-v,y-v);}
	D2 mul(double v) {return D2(x*v,y*v);}
	D2 div(double v) {return D2(x/v,y/v);}

	D2 absS() {return D2(abs(x),abs(y));}
	D2 normalize() {return this.mul(1/len());}
	double lenSq() {return x*x + y*y;}
	double len() {return sqrt(lenSq());}
	I2 round() {return I2((int)Math.round(x),(int)Math.round(y));}

	public String toString() {return ""+list(x,y);}
	}
static D2 D2(double x, double y) {return new D2(x,y);}
static D2 D2(I2 v) {return v.toD2();}
static class I2 {
	final int x, y;

	static I2 O = I2(0,0);
	I2(int x, int y) {this.x = x; this.y = y;}

	I2 add(I2 b) {return I2(x+b.x,y+b.y);}
	I2 sub(I2 b) {return I2(x-b.x,y-b.y);}
	I2 mul(I2 b) {return I2(x*b.x,y*b.y);}
	I2 div(I2 b) {return I2(x/b.x,y/b.y);}
	I2 add(int v) {return I2(x+v,y+v);}
	I2 sub(int v) {return I2(x-v,y-v);}
	I2 mul(int v) {return I2(x*v,y*v);}
	I2 div(int v) {return I2(x/v,y/v);}

	D2 toD2() {return D2(x,y);}
	}
static I2 I2(int x, int y) {return new I2(x,y);}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// misc/util //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//static BufferedImage makeImage(Component me, int X, int Y) {return me.getGraphicsConfiguration().createCompatibleImage(X,Y);}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// local misc/util //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

static Color cute_gradient(int v) {
	if (v <=  3) {v-= 0; double n=v/  3d; return color(0,	n*.7+.3,1	);}
	if (v <=  7) {v-= 3; double n=v/  4d; return color(0,	1,		1-n	);}
	if (v <= 12) {v-= 7; double n=v/  5d; return color(n,	1,		0	);}
	if (v <= 20) {v-=12; double n=v/  8d; return color(1,	1-n,	0	);}
	;            {v-=20; double n=v/100d; return color(1,	n,		n	);}
	}
static D2 gravityForceA(D2 a, D2 b, double am, double bm) {
	if (a.x==b.x&&a.y==b.y) return D2.O;
	double G = 1; // 6.674e-11
	D2 d = b.sub(a);
	double t = d.lenSq();
	double o = 1;
	if (t < o*o) t = o*o/(t/(o*o)); // WHAT A HACK
	return d.normalize().mul(G * am * bm / t);}
static D2 qForceA(D2 a, D2 b, double am, double bm) {
	if (a.x==b.x&&a.y==b.y) return D2.O;
	double G = -1; // 6.674e-11
	D2 d = b.sub(a);
	double t = pow(d.len(),3);
	double o = 1;
	//if (t < o*o) t = o*o/(t/(o*o)); // WHAT A HACK
	return d.normalize().mul(G * am * bm / t);}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// <edge> //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

static int PARTICLE_NUM = 1000;
static class G {
	static boolean pressed;
	static I2 m = I2.O;
	static int sliderMode = -1;
	
	static I2 px = I2(1920,1080);//.div(2);
	static I2 phy = I2(192,108);

	static List<Particle> particles = list(); static {
		int total = PARTICLE_NUM;
		for (int i=0;i<total/3;i++) {
			val r = new Particle();
			r.p = D2(G.phy).div(2).add(D2(-38.4,0)).add(D2.polar(sqrt(random())*8.64,random()*2*PI));
			r.v = D2(0,-.853);
			particles.add(r);
		}
		for (int i=total/3;i<total;i++) {
			val r = new Particle();
			r.p = D2(G.phy).div(2).add(D2(38.4/2,0)).add(D2.polar(sqrt(random())*3.24,random()*2*PI));
			r.v = D2(0,.853/2);
			particles.add(r);
		}
	}
	
	static int sliderWidth;
	static class Slider {String label; Color color; double mid,max; int pxValue; double lv;}
	static Slider[] sliders; static {val r = list();
		{val t = new Slider();	t.label = "Density";	t.color = color(1,.7,.1);	t.mid = 10;	t.max = 1000;	t.lv = 0;	r.add(t);}
		{val t = new Slider();	t.label = "Stiffness";	t.color = color(.9,.1,.1);	t.mid = 1;	t.max = 100;	t.lv = 1;	r.add(t);}
		{val t = new Slider();	t.label = "Bulk Viscosity";	t.color = color(.1,.5,.7);	t.mid = 1;	t.max = 40;	t.lv = 1;	r.add(t);}
		{val t = new Slider();	t.label = "Viscosity";	t.color = color(.1,.7,.9);	t.mid = 1;	t.max = 3;	t.lv = 1;	r.add(t);}
		{val t = new Slider();	t.label = "Gravity";	t.color = color(.7,.7,.7);	t.mid = 1;	t.max = 10;	t.lv = 1;	r.add(t);}
		{val t = new Slider();	t.label = "Smoothing";	t.color = color(.1,1,.8);	t.mid = .5;	t.max = 1;	t.lv = .2;	r.add(t);}
		sliders = r.toArray(new Slider[0]);
		sliderWidth = (G.px.x-1) / sliders.length;
		for (val v : sliders) v.pxValue = (int)(v.lv / v.mid * G.sliderWidth / 2); // bug: doesn't get values right unless they're 0 or mid
		}
}

static int[][] TEMP = new int[G.px.x][G.px.y];
static int[] TEMP_P = new int[G.particles.size()];
static D2[] pps_last;
static Object PAINT_LOCK = new Object();
static void paint(final Graphics2D g) {
	g.setColor(Color.BLACK);
	g.fillRect(0,0,G.px.x,G.px.y);

	final double mul = 1d*G.px.x/G.phy.x;
	final int off = 8;

	/*val o = GQPAINT; if (o != null) {
		g.setColor(color(0,.1,0));
		class draw {void $(GQTree v) {
			I2 o = v.origin.mul(mul).add(off).round();
			I2 s = v.size.mul(mul).round();
			g.drawRect(o.x,o.y,s.x,s.y);
			}} val draw = new draw();
		class t {void $(GQTree v) {
			draw.$(v);
			for (GQTree t : v.subtrees()) if (t != null && t.center != null) this.$(t);
			}} val t = new t();
		t.$(o);
	}*/

	{//particles
		D2[] pps = new D2[G.particles.size()];
		synchronized (PAINT_LOCK) {for (int i=0;i<G.particles.size();i++) pps[i] = G.particles.get(i).p;}
		if (pps_last == null) pps_last = pps;

		for (int x=0;x<G.px.x;x++)
			for (int y=0;y<G.px.y;y++)
				TEMP[x][y] = 0;
		for (int i=0;i<pps.length;i++)
			TEMP_P[i] = 0;
		for (int i=0;i<pps.length;i++) {
			I2 t = pps[i].mul(mul).add(off).round();
			I2 f = pps_last[i].mul(mul).add(off).round();
			TEMP[min(max(0,t.x),G.px.x-1)][min(max(0,t.y),G.px.y-1)]++;
		}
		for (int i=0;i<pps.length;i++) {
			I2 t = pps[i].mul(mul).add(off).round();
			I2 f = pps_last[i].mul(mul).add(off).round();
			TEMP_P[i] = TEMP[min(max(0,t.x),G.px.x-1)][min(max(0,t.y),G.px.y-1)];
		}
		
		for (int i=0;i<pps.length;i++) {
			g.setColor(cute_gradient(TEMP_P[i]));
			I2 t = pps[i].mul(mul).add(off).round();
			I2 f = pps_last[i].mul(mul).add(off).round();
			g.drawLine(t.x,t.y,f.x,f.y);
		}
		for (int x=0;x<G.px.x;x++) {
			for (int y=0;y<G.px.y;y++) {
				if (TEMP[x][y] > 0) {
					g.setColor(cute_gradient(TEMP[x][y]));
					g.drawLine(x,y,x,y);
				}
			}
		}

		pps_last = pps;
	}

	g.setColor(Color.BLACK);
	g.fillRect(0, 0, G.px.x, 10);
	g.setColor(Color.WHITE);
	for (int i = 0; i < G.sliders.length; i++) {
		g.setColor(G.sliders[i].color);
		g.fillRect(i * G.sliderWidth, 0, G.sliders[i].pxValue, 10);
		if (G.m.y <= 10 && G.m.x / G.sliderWidth == i)
			g.setColor(G.sliders[i].color.brighter());
		g.drawRect(i * G.sliderWidth, 0, G.sliderWidth, 10);
		g.drawString(G.sliders[i].label, i * G.sliderWidth + 5, 25);
	}
}

static class Particle {
	D2 p; // position
	D2 v = D2.O; // ?velocity?

	// set at the beginning of each round and then not changed afterwards
	I2 c;
	D2[] np = new D2[3];
	D2[] ng = new D2[3];
	}

static class s0 {
	static I2 mprev = I2.O;
	static boolean pressedprev;
	static boolean drag;
	static D2 md;
}
static class Node {
	double m;
	D2 g=D2.O;
	D2 v=D2.O;
	D2 v2=D2.O;
	D2 a=D2.O;

	Object sscmp0; //sscmp: Set.contains
	}
static void simulate() {
	sim_view();

	val times = list();
	double t0 = time();
	double t;
	t=time(); sim_init_particle_cnpg(); times.add((int)((time()-t)*1000)); // medium: 40
	// ^ gets: p.p | sets: p.c,np,ng (cnp,cnpg) | both:
	t=time(); val grid = sim_build_nodes(); times.add((int)((time()-t)*1000)); // cheap: 0
	t=time(); sim_init_nodes(grid); times.add((int)((time()-t)*1000)); // expensive: 250
	// ^ gets: p.cnpg,v | sets: n.m,g,v | both:

	t=time(); sim4_1(grid,G.sliders[0].lv,G.sliders[1].lv,G.sliders[2].lv,G.sliders[3].lv); times.add((int)((time()-t)*1000)); // expensive: 100
	// ^ gets: p.cnpg n.v | sets: | both: n.a | important: n.a+=n.v
	// d gets: p.p n.m,g | sets: | both: | important:
	t=time(); sim_edge_avoid_soft(grid); times.add((int)((time()-t)*1000)); // cheap: 10
	// ^ gets: p.cnp,p | sets: | both: n.a | important: n.a+=
	t=time(); sim6_0(grid); times.add((int)((time()-t)*1000)); // expensive: 100
	// ^ gets: p.cnp n.a | sets: | both: p.v | important: p.v+=n.a
	t=time(); sim_gravity(G.sliders[4].lv); times.add((int)((time()-t)*1000)); // cheap: 10
	// ^ gets: p.p | sets: | both: p.v | important: p.v+=
	t=time(); sim_drag(); times.add((int)((time()-t)*1000)); // cheap: 1
	// ^ gets: p.p | sets: | both: p.v | important: p.v*=,p.v+=
	t=time(); sim_edge_avoid_hard(); times.add((int)((time()-t)*1000)); // cheap: 10
	// ^ gets: p.p | sets: | both: p.v | important: p.v+=

	t=time(); sim_update_pp_pv(grid,G.sliders[5].lv); times.add((int)((time()-t)*1000)); // expensive: 300
	// ^ gets: p.cnp | sets: | both: p.p,v | important: does crazy stuff with p.p and p.v and temporarily uses n.v2
	println("times:",(int)(1000*(time()-t0)),times);
	}
static void sim_view() {
	s0.drag = false;
	s0.md = D2.O;
	if (G.pressed && s0.pressedprev) {
		int m = G.sliderMode;
		if (m == -1) {
			s0.drag = true;
			s0.md = G.m.toD2().sub(s0.mprev).div(G.px.toD2().div(G.phy));
		} else {
			val s = G.sliders[m];
			s.pxValue = min(max(0,G.m.x - m * G.sliderWidth),G.sliderWidth);
			double t = 2d * s.pxValue / G.sliderWidth;
			if (t < 1) s.lv = s.mid * t*t;
			else s.lv = (s.max-s.mid) * (t-1)*(t-1) + s.mid;
		}
	}
	s0.pressedprev = G.pressed;
	s0.mprev = I2(G.m.x,G.m.y);
	}
static void sim_init_particle_cnpg() {
	for (val p : G.particles) {
		p.c = p.p.round();
		D2 o0 = p.c.toD2().sub(p.p);
		D2 o1 = o0.add(1);
		D2 on1 = o0.add(-1);
		p.np[0] = D2.O.add(on1.mul(on1).mul(.5)).add(on1.mul(1.5)).add(1.125); // .5 * o*o + 1.5 * o + 1.125;
		p.np[1] = D2.O.add(o0.mul(o0).mul(-1)).add(.75); // -o*o + .75;
		p.np[2] = D2.O.add(o1.mul(o1).mul(.5)).add(o1.mul(-1.5)).add(1.125); // .5 * o*o - 1.5 * o + 1.125;
		p.ng[0] = on1.add(1.5);
		p.ng[1] = o0.mul(-2);
		p.ng[2] = o1.add(-1.5);
	}
	}
static Node[][] sim_build_nodes() {
	val r = new Node[G.phy.x][G.phy.y];
	for (int i = 0; i < G.phy.x; i++)
		for (int j = 0; j < G.phy.y; j++)
			r[i][j] = new Node();
	return r;}
static void sim_init_nodes(Node[][] grid) {
	List<Node> active = list(); //sscmp: Set
	for (val p : G.particles) {
		for (int i=-1;i<=1;i++) {
			for (int j=-1;j<=1;j++) {
				double phi = p.np[i+1].x * p.np[j+1].y;
				Node n = grid[p.c.x+i][p.c.y+j];
				if (n.sscmp0 == null) {active.add(n); n.sscmp0 = true;} //sscmp: Set.add
				n.m += phi;
				n.v=n.v.add(p.v.mul(phi));
				n.g=n.g.add(D2(p.ng[i+1].x * p.np[j+1].y, p.np[i+1].x * p.ng[j+1].y)); // d
			}
		}
	}
	for (val n : active) n.v=n.v.mul(n.m==0? 0 : 1/n.m);
	}
static void sim4_1(Node[][] grid, double densityS, double stiffnessS, double bulkViscosityS, double viscosityS) {
	if (stiffnessS == 0 && viscosityS == 0) return;

	for (val p : G.particles) {
		double T00,T01,T11; {
			double dudx=0,dudy=0,dvdx=0,dvdy=0;
			for (int i=-1;i<=1;i++) {
				for (int j=-1;j<=1;j++) {
					Node n = grid[p.c.x+i][p.c.y+j];
					double gx = p.ng[i+1].x * p.np[j+1].y;
					double gy = p.np[i+1].x * p.ng[j+1].y;
					dudx += n.v.x * gx;
					dudy += n.v.x * gy;
					dvdx += n.v.y * gx;
					dvdy += n.v.y * gy;
				}
			}
			double pressure = min(2, stiffnessS / max(1, densityS) * (sim4_density(p,grid) - densityS));
			double trace = ( dudx+dvdy)/2;
			double D00   = ( dudx-dvdy)/2;
			double D01   = ( dudy+dvdx)/2;
			double D11   = (-dudx+dvdy)/2;
			T00 = viscosityS * D00 + pressure + bulkViscosityS * trace * stiffnessS;
			T01 = viscosityS * D01;
			T11 = viscosityS * D11 + pressure + bulkViscosityS * trace * stiffnessS;
		}
		for (int i=-1;i<=1;i++) {
			for (int j=-1;j<=1;j++) {
				Node n = grid[p.c.x+i][p.c.y+j];
				D2 d = D2(p.ng[i+1].x * p.np[j+1].y, p.np[i+1].x * p.ng[j+1].y);
				n.a=n.a.sub(D2(d.x*T00,d.x*T01));
				n.a=n.a.sub(D2(d.y*T01,d.y*T11));
			}
		}
	}
	}
static double sim4_density(Particle p, Node[][] grid) {
	Node
		n00 = grid[(int)p.p.x  ][(int)p.p.y  ],
		n01 = grid[(int)p.p.x  ][(int)p.p.y+1],
		n10 = grid[(int)p.p.x+1][(int)p.p.y  ],
		n11 = grid[(int)p.p.x+1][(int)p.p.y+1];

	double pdx = n10.m - n00.m;
	double pdy = n01.m - n00.m;
	double C20 =  3*pdx - n10.g.x - 2*n00.g.x;
	double C02 =  3*pdy - n01.g.y - 2*n00.g.y;
	double C30 = -2*pdx + n10.g.x +   n00.g.x;
	double C03 = -2*pdy + n01.g.y +   n00.g.y;
	double csum1 = n00.m + n00.g.y + C02 + C03;
	double csum2 = n00.m + n00.g.x + C20 + C30;
	double C21 =  3*n11.m - 2*n01.g.x - n11.g.x - 3*csum1 - C20;
	double C12 =  3*n11.m - 2*n10.g.y - n11.g.y - 3*csum2 - C02;
	double C31 = -2*n11.m +   n01.g.x + n11.g.x + 2*csum1 - C30;
	double C13 = -2*n11.m +   n10.g.y + n11.g.y + 2*csum2 - C03;
	double C11 = n01.g.x - C13 - C12 - n00.g.x;

	double u = p.p.x - (int)p.p.x;
	double v = p.p.y - (int)p.p.y;
	return
		n00.m +
		n00.g.y * v +
		C02 * v*v + 
		C03 * v*v*v +
		n00.g.x * u +
		C20 * u*u +
		C30 * u*u*u +
		C21 * u*u * v +
		C31 * u*u*u * v +
		C11 * u * v +
		C12 * u * v*v +
		C13 * u * v*v*v;}
static void sim_edge_avoid_soft(Node[][] grid) {
	for (val p : G.particles) {
		if (p.p.x < 3)
			for (int i=-1;i<=1;i++)
				for (int j=-1;j<=1;j++)
					{val n = grid[p.c.x+i][p.c.y+j]; n.a=n.a.add(D2(   (3-p.p.x) * (p.np[i+1].x * p.np[j+1].y), 0));} // * (phi)
		if (p.p.y < 3)
			for (int i=-1;i<=1;i++)
				for (int j=-1;j<=1;j++)
					{val n = grid[p.c.x+i][p.c.y+j]; n.a=n.a.add(D2(0, (3-p.p.y) * (p.np[i+1].x * p.np[j+1].y)   ));} // * (phi)
		if (p.p.x > G.phy.x - 4)
			for (int i=-1;i<=1;i++)
				for (int j=-1;j<=1;j++)
					{val n = grid[p.c.x+i][p.c.y+j]; n.a=n.a.add(D2(   (G.phy.x-4 - p.p.x) * (p.np[i+1].x * p.np[j+1].y), 0));} // * (phi)
		if (p.p.y > G.phy.y - 4)
			for (int i=-1;i<=1;i++)
				for (int j=-1;j<=1;j++)
					{val n = grid[p.c.x+i][p.c.y+j]; n.a=n.a.add(D2(0, (G.phy.y-4 - p.p.y) * (p.np[i+1].x * p.np[j+1].y)   ));} // * (phi)
	}
	}
static void sim6_0(Node[][] grid) {
	for (val p : G.particles)
		for (int i=-1;i<=1;i++)
			for (int j=-1;j<=1;j++)
				{Node n = grid[p.c.x+i][p.c.y+j]; p.v=p.v.add(n.a.mul(n.m==0? 0 : 1/n.m).mul(p.np[i+1].x * p.np[j+1].y));} // .mul(phi)
	}
static class GQTree {
	D2 origin,size;
	GQTree nn,np,pn,pp; // Negative Positive
	D2 center; double mass;

	GQTree(D2 origin, D2 size) {this.origin=origin; this.size=size;}

	void add(D2 p, double m) {
		if (center == null) {
			center = p; mass = m;
		} else {
			if (nn == null) {
				nn = new GQTree(origin,size.div(2));
				np = new GQTree(origin.add(D2(0,size.y/2)),size.div(2));
				pn = new GQTree(origin.add(D2(size.x/2,0)),size.div(2));
				pp = new GQTree(origin.add(size.div(2)),size.div(2));
				_subtree(center).add(center,mass);
			}
			_subtree(p).add(p,m);

			double newMass = m+mass;
			center = D2.O.add(center.mul(mass/newMass)).add(p.mul(m/newMass));
			mass = newMass;
		}
	}

	D2 getForce(D2 p, double m) {
		if (center == null) return D2.O;
		if (nn == null)
			return gravityForceA(p,center,m,mass);

		val sub = _subtree(p);
		D2 r = sub == null? D2.O : sub.getForce(p,m);
		for (val tree : subtrees())
			if (tree != sub && tree.center != null)
				if (tree.size.len() / tree.center.sub(p).len() < .5) // .5 is a standard threshold
					r=r.add(gravityForceA(p,tree.center,m,tree.mass));
				else
					r=r.add(tree.getForce(p,m));
		return r;}

	D2 getForceGC(D2 p, double m) {
		if (center == null) return D2.O;
		if (nn == null)
			return gravityForceA(p,center,m,mass);

		val sub = _subtree(p);
		D2 r = sub == null? D2.O : sub.getForce(p,m);
		for (val tree : subtrees())
			if (tree != sub && tree.center != null)
				if (tree.size.len() / tree.center.sub(p).len() < .5) // .5 is a standard threshold
					r=r.add(gravityForceA(p,tree.center,m,tree.mass));
				else
					r=r.add(tree.getForce(p,m));
		return r;}

	List<GQTree> subtrees() {return list(nn,np,pn,pp);}

	GQTree _subtree(D2 p) {
		boolean px = p.x-origin.x >= size.x/2;
		boolean py = p.y-origin.y >= size.y/2;
		return 
			!px && !py? nn:
			!px &&  py? np:
			 px && !py? pn:
			 px &&  py? pp:
			 	null;}
}
static void sim_gravity(double slider) {
	if (slider == 0) return;

	GQTree o = new GQTree(D2.O,D2(G.phy.x,G.phy.x));
	double t = time();
	for (val p : G.particles) o.add(p.p,.35);
	for (val p : G.particles) p.v=p.v.add(o.getForceGC(p.p,.35).mul(slider));
	}
static void sim_drag() {
	if (s0.drag) {
		for (val p : G.particles) {
			D2 v = p.p.sub(G.m.toD2().div(G.px).mul(G.phy)).absS().div(12);
			if (v.len() < 1) {
				D2 t = p.v;
				p.v=p.v.mul(v.len());
				p.v=p.v.add(s0.md.mul(1-v.len()));
			}
		}
	}
	}
static void sim_edge_avoid_hard() {
	for (val p : G.particles) {
		D2 t = p.p.add(p.v);
		if (t.x < 2)
			p.v=p.v.add(D2(             2 - t.x + random() * 0.01, 0));
		else if (t.x > G.phy.x - 3)
			p.v=p.v.add(D2(   G.phy.x - 3 - t.x - random() * 0.01, 0));
		if (t.y < 2)
			p.v=p.v.add(D2(0,           2 - t.y + random() * 0.01));
		else if (t.y > G.phy.y - 3)
			p.v=p.v.add(D2(0, G.phy.y - 3 - t.y - random() * 0.01));
	}
	}
static void sim_update_pp_pv(Node[][] grid, double smoothing) {
	for (val p : G.particles) {
		for (int i=-1;i<=1;i++) {
			for (int j=-1;j<=1;j++) {
				Node n = grid[p.c.x+i][p.c.y+j];
				n.v2=n.v2.add(p.v.mul(p.np[i+1].x * p.np[j+1].y)); // .mul(phi)
			}
		}
	}
	synchronized (PAINT_LOCK) {for (val p : G.particles) {
		D2 delta_p = D2.O;
		for (int i=-1;i<=1;i++)
			for (int j=-1;j<=1;j++)
				{Node n = grid[p.c.x+i][p.c.y+j]; delta_p=delta_p.add(n.v2.mul(n.m==0? 0 : 1/n.m).mul(p.np[i+1].x * p.np[j+1].y));} // .mul(phi)
		p.p=p.p.add(delta_p);
		p.v=D2.O.add(p.v.mul(1-smoothing)).add(delta_p.mul(smoothing));
	}}
	}

public static void main(String[] args) {
	val panel = new JPanel(){public void paint(Graphics g) {$.paint((Graphics2D)g);}};
	panel.setSize(G.px.x,G.px.y);
	panel.addMouseListener(new MouseAdapter(){
		public void mousePressed(MouseEvent ev) {
			G.pressed = true;
			if (G.m.y < 10) G.sliderMode = G.m.x / G.sliderWidth;
			else G.sliderMode = -1;
			}
		public void mouseReleased(MouseEvent ev) {G.pressed = false; G.sliderMode = -1;}
		});
	panel.addMouseMotionListener(new MouseAdapter(){
		public void mouseDragged(MouseEvent ev) {G.m = I2(ev.getX(),ev.getY());}
		public void mouseMoved  (MouseEvent ev) {G.m = I2(ev.getX(),ev.getY());}
		});

	val frame = makeFullscreenJFrame();
	JFrame_addEscapeHook(frame,new Runnable(){public void run(){
		frame.dispose();
		}});
	frame.setSize(G.px.x,G.px.y);
	if (G.px.x == 960) frame.setLocation(960,250);
	frame.add(panel);
	frame.show();
	frame.validate();

	runWithFixedDelay(.02,new Runnable(){public void run(){panel.repaint();}});
	runIn(0,new Runnable(){public void run(){
		while (true) simulate();
		}});
	}

}
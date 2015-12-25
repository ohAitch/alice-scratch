package grass2;

import org.lwjgl.*;
import lombok.*;

import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.Canvas;
import java.awt.Container;
import java.awt.Toolkit;
import javax.swing.JFrame;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Frame;

//"the housing development"??
//A: She loves you.
//C: Her sister. (wikipedia)
//D: Your leaving.
//F: suicide

//magic - more magic

//random:
//a37f 2d23 d478 a411 ff55 d6a0 1dde ecb8 730b 9e3b bd92 0d6c 64f3 93c7 4c6f
//1200 ab4b 0802 a940 0691 723d 6765 7d08 961a 7b23 df70 4a33 0963 56f8 2209
//9f29 beed 621a 8ded d29a c216 16dd b16d 9c58 e1bc b0cb

//How in TV- and movie-land, successfully logging in causes a huge modal window to pop up that says
//ACCESS GRANTED
//and hangs there for a couple minutes. Because, y'know, I definitely put that in all my login sequences.

public class M extends Applet
{
	//sets the OS interrupt period to 1ms for the duration of this program (or is it this JVM?)
	static {
		Thread t = new Thread("Thread-InterruptPeriodSetter")
		{
			public void run()
				{while (true) S.sleep(Long.MAX_VALUE);}
		};
		t.setDaemon(true);
		t.start();
	}

	public static boolean appMode = false; //application mode: false means we're an applet, true means a stand-alone window.
	public static boolean fullscreen = false;
	public static int width = 800, height = 600; //MC is 854x480
	
	private static Frame frame;
	private static Applet appl;
	
	public static void setDisplayParent() throws LWJGLException
		{org.lwjgl.opengl.Display.setParent(displayParent);}
	private static Canvas displayParent = new Canvas()
	{
		private Thread gameThread = new Thread(Render.INST, "Thread-Render");
		public final void addNotify()
		{
			super.addNotify();
			//Once the Canvas is created its add notify method will call this method to start the LWJGL Display and game loop in another thread.
			gameThread.start();
		}
		public final void removeNotify()
		{
			//Tell game loop to stop running, after which the LWJGL Display will be destoryed. The main thread will wait for the Display.destroy() to complete
			Render.quit();
			try {gameThread.join();}
			catch (InterruptedException e) {e.printStackTrace();}
			super.removeNotify();
		}
	};

	/*public static void main(String[] args)
	{
		appMode = true;
		
		JFrame jf = new JFrame("\"It's Not Minecraft (and I Plan to Take It in a Different Direction) but This Alpha Is Awfully Similar\"");
		frame = jf;
		jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		jf.setResizable(false);
		jf.getContentPane().add(displayParent);
		jf.setResizable(false);
		//jf.addWindowListener(new WindowAdapter() {public void windowClosing(WindowEvent ev) {System.exit(0);}});
		
		displayParent.setSize(width, height);
		displayParent.setFocusable(true);
		displayParent.requestFocusInWindow();
		displayParent.setIgnoreRepaint(true);
			
		frame.setVisible(true);
		setFrameSize();
	}*/
	
	public static void main(String... args)
	{
		appl = new M(/*false*/);//false: not being run as an Applet
		frame = new Frame("\"It's Not Minecraft (and I Plan to Take It in a Different Direction) but This Alpha Is Awfully Similar\"");

		frame.setSize(width + 16, height + 36);//replace this with my own, better calculations later
		frame.addWindowListener(new java.awt.event.WindowAdapter() {
				public void windowClosing(java.awt.event.WindowEvent ev) //"Handle request to shutdown. @param ev event giving details of closing."
					{appl.stop(); appl.destroy(); System.exit(0);}
			});

		frame.add(appl);
		appl.init();
		frame.validate();
		frame.setVisible(true);
		appl.start();
	}
	
	private static void setFrameSize()
	{
		int wmod = frame.getInsets().right + frame.getInsets().left;
		int hmod = frame.getInsets().top + frame.getInsets().bottom;
		int w = wmod + width;
		int h = hmod + height;
		java.awt.Dimension screen = M.defaultTk.getScreenSize();
		frame.setBounds((screen.width - w)/2, (screen.height - h)/2, w, h + 2);
	}

	public void init()
	{
		appl = this;
		appl.setLayout(new BorderLayout());
		appl.add(displayParent);
		displayParent.setSize(appl.getWidth(), appl.getHeight());
		displayParent.setFocusable(true);
		displayParent.requestFocusInWindow();
		displayParent.setIgnoreRepaint(true);
		appl.setVisible(true);
	}

	public void start()
	{
	}

	public void stop()
	{
	}

	//Applet Destroy method will remove the canvas, before canvas is destroyed it will notify stopLWJGL() to stop main game loop and to destroy the Display
	public void destroy()
	{
		remove(displayParent);
		super.destroy();
		System.out.println("Clear up");
	}
	
//////////////////////////////////////////////////////////////// misc ////////////////////////////////////////////////////////////////
	
	public static final Toolkit defaultTk = Toolkit.getDefaultToolkit();
	
	public static void catchEx(Exception e) {catchEx(e, null);}
	public static void catchEx(Exception e, String msg)
	{
		if (e != null)
			e.printStackTrace();
		if (msg != null && msg.length() > 0)
			//Sys.alert("Error", msg);
			S.pln("Sys.alert: " + msg);
	}
	
	public static void aintGonnaWork(Exception e)
	{
		if (e != null) e.printStackTrace();
		else new Exception().printStackTrace();
		Sys.alert("Oh well", "Sorry man, but this program totally ain't gonna work. Something with " +
			"your computer, maybe? Or maybe it's my program's fault and I should fix it.");
		throw new Error("Ain't gonna work.");
	}

	public static int compareD(double d1, double d2)
	{
		double e = Math.max(d1, d2) * 1e-9;
		if (d1 > d2 - e && d1 < d2 + e) return 0;
		if (d1 > d2) return 1;
		return -1;
	}
	
	//public static void convertPointToFrame(java.awt.Point p)
	//	{javax.swing.SwingUtilities.convertPointToScreen(p, frame);}

	private static final Cursor DEFAULT_CURSOR = new Cursor(Cursor.DEFAULT_CURSOR);
	private static final Cursor BLANK_CURSOR = M.defaultTk.createCustomCursor(M.defaultTk.createImage(new byte[0]), new java.awt.Point(), "blank cursor");
		/**true = default cursor. false = blank cursor.*/
	public static void setCursor(boolean b) {appl.setCursor(b? DEFAULT_CURSOR : BLANK_CURSOR);}
}
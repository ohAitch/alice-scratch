package grass;

import org.lwjgl.*;

import java.applet.Applet;
import java.awt.BorderLayout;
import java.awt.Canvas;
import java.awt.Container;
import javax.swing.JFrame;

//"the housing development"??

/** @author Vuntic <vuntic@gmail.com> */
public class M extends Applet
{
	//sets the OS interrupt period to 1ms for the duration of this program (or is it this JVM?)
	static {
		Thread t = new Thread()
		{
			public void run()
				{while (true) S.sleep(Long.MAX_VALUE);}
		};
		t.setDaemon(true);
		t.start();
	}
	
	/** Exit the game */
	static boolean finished;
	public static boolean appMode = false; //application mode: false means we're an applet, true means a stand-alone window.
	public static boolean fullscreen = false;
	
	private static Container frame;
	
	/** The Canvas where the LWJGL Display is added */
	static Canvas displayParent = new Canvas()
	{
		private Thread gameThread = new Thread(Render.INST);// Thread which runs the main game loop
		public final void addNotify()
		{
			super.addNotify();
			//Once the Canvas is created its add notify method will call this method to start the LWJGL Display and game loop in another thread.
			gameThread.setName("Thread-Render");
			gameThread.start();
		}
		public final void removeNotify()
		{
			//Tell game loop to stop running, after which the LWJGL Display will be destoryed. The main thread will wait for the Display.destroy() to complete
			Render.running = false;
			try {gameThread.join();}
			catch (InterruptedException e) {e.printStackTrace();}
			super.removeNotify();
		}
	};

	public static void main(String[] args)
	{
		appMode = true;
		
		JFrame jf = new JFrame("Ohh so grassy... it's a candle =P");
		frame = jf;
		jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		jf.setResizable(false);
		jf.getContentPane().add(displayParent);
		jf.setResizable(false);
		
		displayParent.setSize(800, 600);
		displayParent.setFocusable(true);
		displayParent.requestFocusInWindow();
		displayParent.setIgnoreRepaint(true);
		
		frame.setVisible(true);
		setFrameSize();
	}
	
	private static void setFrameSize()
	{
		int hmod = frame.getInsets().top + frame.getInsets().bottom;
		int wmod = frame.getInsets().right + frame.getInsets().left;
		int inh = 600;
		int inw = 800;
		int h = hmod + inh;
		int w = wmod + inw;
		java.awt.Dimension screen = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
		//((JFrame)frame).setBounds((screen.width - w)/2, (screen.height - h)/2, w, h);
		frame.setBounds((screen.width - w)/2, (screen.height - h)/2, w, h);
	}

	/**
	 * initialise applet by adding a canvas to it, this canvas will start the LWJGL Display and game loop
	 * in another thread. It will also stop the game loop and destroy the display on canvas removal when applet is destroyed.
	 */
	public void init()
	{
		frame = this;
		frame.setLayout(new BorderLayout());
		frame.add(displayParent);
		displayParent.setSize(frame.getWidth(), frame.getHeight());
		displayParent.setFocusable(true);
		displayParent.requestFocusInWindow();
		displayParent.setIgnoreRepaint(true);
		frame.setVisible(true);
	}

	public void start()
	{
	}

	public void stop()
	{
	}

	/**
	 * Applet Destroy method will remove the canvas, before canvas is destroyed it will notify
	 * stopLWJGL() to stop main game loop and to destroy the Display
	 */
	public void destroy()
	{
		remove(displayParent);
		super.destroy();
		System.out.println("Clear up");
	}
	
//////////////////////////////////////////////////////////////// misc ////////////////////////////////////////////////////////////////
	
	public static void catchEx(Exception e, String msg)
	{
		if (e != null)
			e.printStackTrace();
		if (msg != null && msg.length() > 0)
			Sys.alert("Error", msg);
	}
	
	public static void claim(boolean claim)
		{if (!claim) throw new AssertationException();}
	public static void claim(boolean claim, String message)
		{if (!claim) throw new AssertationException(message);}
}

class AssertationException extends RuntimeException
{
    public AssertationException() {super();}
    public AssertationException(String message) {super(message);}
    public AssertationException(String message, Throwable cause) {super(message, cause);}
    public AssertationException(Throwable cause) {super(cause);}
}
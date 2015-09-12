package dirt;

import org.lwjgl.*;

import org.lwjgl.opengl.Display;
import org.lwjgl.input.Mouse;

/**Do all calculations, handle input, etc.*/
public class Logic extends Thread
{
	private Logic() {setName("Logic-Thread");}
	private static Logic INST = new Logic();

	public static void go() {if (state == 0) {state = 1; INST.start();} if (state == 2) state = 1;}
	public static void pause() {if (state == 1) state = 2;}
	public static void end() {if (state == 0) go(); if (state == 1 || state == 2) state = 3;}

	private static final long MIL20 = 16666667;
	private static int state = 0; //0 = not started, 1 = running, 2 = paused, 3 = quitting, 4 = ended

	private long nanoBucket = 0;
	private long lastTime = 0;

	public void run()
	{
		lastTime = S.nTime();
		while (state != 3)
		{
			if (nanoBucket >= MIL20)
			{
				nanoBucket -= MIL20;
				logic();
			}
			else
				S.sleep(2);

			if (state == 1)
				nanoBucket += S.nTime() - lastTime;
			lastTime = S.nTime();
		}
		state = 4;
	}

////////logic////////

	private static float xspeed = 0.2f, yspeed = 0.3f;
	
	private void logic()
	{		
		KeyIn.poll();
		
		//if (KeyIn.once("ESCAPE"))
		//	G.finished = true;
		
		if (KeyIn.once("F"))
			try {Display.setFullscreen(!Display.isFullscreen());}
			catch (LWJGLException e) {e.printStackTrace();}
			
		if (KeyIn.down("L"))
			S.pln("l key!");
			
		if (KeyIn.once("N"))
			S.pln("n key!");

		// Rotate the stuff
		GearsApplet.angle = (GearsApplet.angle + 0.5f) % 360;
		//G.xrot = (G.xrot + xspeed) % 360;
		//G.yrot = (G.yrot + yspeed) % 360;
	}
}
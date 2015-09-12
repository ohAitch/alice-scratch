package sandy;

import org.lwjgl.*;

import org.lwjgl.opengl.*;

/**
 * @author Vuntic <vuntic@gmail.com>
 * @version 0.0
 */
public class G extends java.applet.Applet
{
	/** Desired frame time */
	private static final int FRAMERATE = 60;
	/** Exit the game */
	static boolean finished;

	static boolean light;
	static float xrot, yrot, z = -5.0f;
	static float[] lightAmbient = {0.5f, 0.5f, 0.5f, 1.0f};		// Ambient Light Values
	static float[] lightDiffuse = {1.0f, 1.0f, 1.0f, 1.0f};		// Diffuse Light Values
	static float[] lightPosition = {0.0f, 0.0f, 2.0f, 1.0f};	// Light Position
	static int filter;											// Which Filter To Use
	static Texture[] tex = new Texture[3];						// Storage for 3 textures

	public void init()
	{
		//sets the OS interrupt period to 1ms for the duration of this program
		{
			Thread t = new Thread()
			{
				public void run()
					{while (true) S.sleep(Long.MAX_VALUE);}
			};
			t.setDaemon(true);
			t.start();
		}

		//boolean fullscreen = (args.length == 1 && args[0].equals("-fullscreen"));

		otherInit(false);//fullscreen);
		run();
		cleanupAndExit();
	}
	public void start(){}
	public void stop(){}
	public void destroy(){}

	public static void main(String[] args)
	{
		//sets the OS interrupt period to 1ms for the duration of this program
		{
			Thread t = new Thread()
			{
				public void run()
					{while (true) S.sleep(Long.MAX_VALUE);}
			};
			t.setDaemon(true);
			t.start();
		}

		boolean fullscreen = (args.length == 1 && args[0].equals("-fullscreen"));

		otherInit(fullscreen);
		run();
		cleanupAndExit();
	}

	private static void otherInit(boolean fullscreen)
	{
		DisplayMode chosenMode = null;
		try
		{
			DisplayMode[] modes = Display.getAvailableDisplayModes();

			for (int i = 0; i < modes.length; i++)
			if (modes[i].getWidth() == 640 && modes[i].getHeight() == 480)
				{chosenMode = modes[i]; break;}
			if (chosenMode == null) throw new LWJGLException();
		}
		catch (LWJGLException e)
		{
			e.printStackTrace(System.err);
			Sys.alert("Error", "Unable to determine display modes.");
			cleanupAndExit();
		}

		try
		{
			// Create a fullscreen window with 1:1 orthographic 2D projection (default)
			Display.setDisplayMode(chosenMode);
			Display.setTitle("Sandy");
			Display.setFullscreen(fullscreen);//may throw an LWJGLException

			// Enable vsync if we can (due to how OpenGL works, it cannot be guarenteed to always work)
			Display.setVSyncEnabled(true);

			// Create default display of 640x480
			Display.create();//may throw an LWJGLException

Drawable d = Display.getDrawable();
S.pln(d instanceof Pbuffer);
		}
		catch (LWJGLException e)
		{
			e.printStackTrace(System.err);
			Sys.alert("Error", "An error occured and the game will exit.");
			cleanupAndExit();
		}

		resizeGLScene(Display.getDisplayMode().getWidth(), Display.getDisplayMode().getHeight());
		initGL();
	}

	private static void resizeGLScene(int width, int height)// Resize And Initialize The GL Window
	{
		GL11.glViewport(0, 0, width, height);// Reset The Current Viewport
		GL11.glMatrixMode(GL11.GL_PROJECTION);// Select The Projection Matrix
		GL11.glLoadIdentity();// Reset The Projection Matrix
		org.lwjgl.util.glu.Project.gluPerspective(45.0f, (float)(width / (height * 1.0f)), 0.1f, 100.0f);// Calculate The Aspect Ratio Of The Window
			//params: float fovy, float aspect, float zNear, float zFar
		GL11.glMatrixMode(GL11.GL_MODELVIEW);// Select The Modelview Matrix
		GL11.glLoadIdentity();// Reset The Modelview Matrix
	}

	private static void initGL()
	{
		loadGLTextures();
		GL11.glEnable(GL11.GL_TEXTURE_2D);			// Enable Texture Mapping
		GL11.glShadeModel(GL11.GL_SMOOTH);			// Enables Smooth Shading
		GL11.glClearColor(0.0f, 0.0f, 0.0f, 0.0f);	// Black Background
		GL11.glClearDepth(1.0f);					// Depth Buffer Setup
		GL11.glEnable(GL11.GL_DEPTH_TEST);			// Enables Depth Testing
		GL11.glDepthFunc(GL11.GL_LEQUAL);			// The Type Of Depth Test To Do
		GL11.glHint(GL11.GL_PERSPECTIVE_CORRECTION_HINT, GL11.GL_NICEST);// Really Nice Perspective Calculations
		java.nio.ByteBuffer temp = java.nio.ByteBuffer.allocateDirect(16);
		temp.order(java.nio.ByteOrder.nativeOrder());
		GL11.glLight(GL11.GL_LIGHT1, GL11.GL_AMBIENT, (java.nio.FloatBuffer)temp.asFloatBuffer().put(lightAmbient).flip());// Setup The Ambient Light
		GL11.glLight(GL11.GL_LIGHT1, GL11.GL_DIFFUSE, (java.nio.FloatBuffer)temp.asFloatBuffer().put(lightDiffuse).flip());// Setup The Diffuse Light
		GL11.glLight(GL11.GL_LIGHT1, GL11.GL_POSITION, (java.nio.FloatBuffer)temp.asFloatBuffer().put(lightPosition).flip());// Position The Light
		GL11.glEnable(GL11.GL_LIGHT1);// Enable Light One
	}

	private static void loadGLTextures()
	{
		Texture.get(0);
		tex[0] = new Texture("sandy/res/crate.tga", GL11.GL_NEAREST, GL11.GL_NEAREST);
		tex[1] = new Texture("sandy/res/crate.tga", GL11.GL_LINEAR, GL11.GL_LINEAR);
		tex[2] = new Texture("sandy/res/crate.tga", GL11.GL_LINEAR, GL11.GL_LINEAR_MIPMAP_NEAREST);
	}

	/**Runs the game (the "main loop")*/
	private static void run()
	{
		while (!finished)
		{
			// Always call Window.update(), all the time - it does some behind the
			// scenes work, and also displays the rendered output
			Display.update();

			// Check for close requests
			if (Display.isCloseRequested())
				{finished = true; break;}

			// The window is in the foreground, so we should play the game
			if (Display.isActive())
			{
				Logic.go();
				drawGLScene();
				Display.sync(FRAMERATE);
			}
			// The window is not in the foreground, so we can allow other stuff to run and infrequently update
			else
			{
				Logic.pause();
				// Only bother rendering if the window is visible or dirty
				if (Display.isVisible() || Display.isDirty())
					drawGLScene();

				S.sleep(50);
			}
		}
	}

	/**Do any game-specific cleanup*/
	private static void cleanupAndExit()
	{
		Logic.end();
		// Close the window
		Display.destroy();

		System.exit(0);
	}

	/**Render the current frame*/
	private static void drawGLScene()
	{
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);// Clear The Screen And The Depth Buffer

		GL11.glLoadIdentity();															// Reset The Current Modelview Matrix
		GL11.glTranslatef(0.0f, 0.0f, z);
		GL11.glRotatef(xrot, 1.0f, 0.0f, 0.0f);
		GL11.glRotatef(yrot, 0.0f, 1.0f, 0.0f);
		GL11.glBindTexture(GL11.GL_TEXTURE_2D, tex[filter].address);					// Select A Texture Based On filter
			GL11.glBegin(GL11.GL_QUADS);												// Start Drawing Quads
				// Front Face
				GL11.glNormal3f(0.0f, 0.0f, 1.0f);										// Normal Pointing Towards Viewer
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);	// Point 1 (Front)
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);	// Point 2 (Front)
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);	// Point 3 (Front)
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);	// Point 4 (Front)
				// Back Face
				GL11.glNormal3f(0.0f, 0.0f,-1.0f);										// Normal Pointing Away From Viewer
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);	// Point 1 (Back)
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);	// Point 2 (Back)
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);	// Point 3 (Back)
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);	// Point 4 (Back)
				// Top Face
				GL11.glNormal3f(0.0f, 1.0f, 0.0f);										// Normal Pointing Up
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);	// Point 1 (Top)
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);	// Point 2 (Top)
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);	// Point 3 (Top)
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);	// Point 4 (Top)
				// Bottom Face
				GL11.glNormal3f(0.0f,-1.0f, 0.0f);										// Normal Pointing Down
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);	// Point 1 (Bottom)
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);	// Point 2 (Bottom)
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);	// Point 3 (Bottom)
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);	// Point 4 (Bottom)
				// Right face
				GL11.glNormal3f(1.0f, 0.0f, 0.0f);										// Normal Pointing Right
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);	// Point 1 (Right)
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);	// Point 2 (Right)
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);	// Point 3 (Right)
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);	// Point 4 (Right)
				// Left Face
				GL11.glNormal3f(-1.0f, 0.0f, 0.0f);										// Normal Pointing Left
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);	// Point 1 (Left)
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);	// Point 2 (Left)
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);	// Point 3 (Left)
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);	// Point 4 (Left)
			GL11.glEnd();																// Done Drawing Quads
	}
}
	//do rendering
		/*// clear the screen
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_STENCIL_BUFFER_BIT);

		// center square according to screen size
		GL11.glPushMatrix();
		GL11.glTranslatef(Display.getDisplayMode().getWidth() / 2, Display.getDisplayMode().getHeight() / 2, 0.0f);

			// rotate square according to angle
			GL11.glRotatef(angle, 0, 0, 1.0f);

			// render the square
			GL11.glBegin(GL11.GL_QUADS);
				GL11.glVertex2i(-50, -50);
				GL11.glVertex2i(50, -50);
				GL11.glVertex2i(50, 50);
				GL11.glVertex2i(-50, 50);
			GL11.glEnd();

			GL11.glBegin(GL11.GL_QUADS);
				GL11.glTexCoord2f(0, 0);
				GL11.glVertex2f(0, 0);
				GL11.glTexCoord2f(0, 0.5f);
				GL11.glVertex2f(0, 0.5f);
				GL11.glTexCoord2f(0.5f, 0.5f);
				GL11.glVertex2f(0.5f, 0.5f);
				GL11.glTexCoord2f(0.5f, 0);
				GL11.glVertex2f(0.5f, 0);
			GL11.glEnd();

		GL11.glPopMatrix();*/
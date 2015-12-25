package grass;

import org.lwjgl.*;

import org.lwjgl.opengl.ARBTransposeMatrix;
import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GLContext;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

/**The Rendering thread.*/
public class Render implements Runnable
{
	private Render() {}
	public static Render INST = new Render();
	
	static boolean running = false; //is the game loop running
	
	public void run()
	{
		running = true;
		if (M.appMode)
			try
			{
				DisplayMode[] modes = Display.getAvailableDisplayModes();
				DisplayMode chosenMode = null;
				for (int i = 0; i < modes.length; i++)
				if (modes[i].getWidth() == 800 && modes[i].getHeight() == 600)
					{chosenMode = modes[i]; break;}
				if (chosenMode == null) throw new LWJGLException();
				Display.setDisplayMode(chosenMode);
			}
			catch (LWJGLException e) {M.catchEx(e, "Unable to find a proper display mode.");}
		try
		{
			Display.setParent(M.displayParent);
			//Display.setVSyncEnabled(true);
			Display.create();
		}
		catch (LWJGLException e) {e.printStackTrace();}
		if (M.appMode)
			resizeGLScene(Display.getDisplayMode().getWidth(), Display.getDisplayMode().getHeight());
		else
			resizeGLScene(800, 600);//!
		initGL();
		gameLoop();
		Display.destroy();
	}
	
	private static void gameLoop()
	{
		long startTime = S.mTime() + 5000;
		long fps = 0;

		while (running)
		{
			Display.update();
			
			logic();
			drawGLScene();
			
			Display.sync(60); //^tempsimp^

			if (startTime > S.mTime())
				fps++;
			else
			{
				long timeUsed = 5000 + (startTime - S.mTime());
				startTime = S.mTime() + 5000;
				S.pln(fps + " frames 2 in " + (float) (timeUsed / 1000f) + " seconds = " + (fps / (timeUsed / 1000f)));
				fps = 0;
			}
		}
	}
	
	private static void resizeGLScene(int width, int height)// Resize And Initialize The GL Window
	{
		GL11.glViewport(0, 0, width, height);// Reset The Current Viewport
		GL11.glMatrixMode(GL11.GL_PROJECTION);// Select The Projection Matrix
		GL.loadIdentity();// Reset The Projection Matrix
		org.lwjgl.util.glu.Project.gluPerspective(45.0f, (float)(width / (height * 1.0f)), 0.1f, 150.0f);// Calculate The Aspect Ratio Of The Window
			//params: float fovy, float aspect, float zNear, float zFar
		GL11.glMatrixMode(GL11.GL_MODELVIEW);// Select The Modelview Matrix
		GL.loadIdentity();// Reset The Current Modelview Matrix
	}

	private static void initGL()
	{
		loadGLTextures();
		buildDisplayLists();
		
		GL.enable(GL11.GL_TEXTURE_2D);										// Enable Texture Mapping
		GL11.glShadeModel(GL11.GL_SMOOTH);									// Enables Smooth Shading
		GL11.glClearColor(0.0f, 0.0f, 0.0f, 0.5f);							// Black Background
		GL11.glClearDepth(1.0f);											// Depth Buffer Setup
		GL.enable(GL11.GL_DEPTH_TEST);
		GL11.glDepthFunc(GL11.GL_LEQUAL);									// The Type Of Depth Test To Do
		//GL.enable(GL11.GL_LIGHT0);											// Quick And Dirty Lighting (Assumes Light0 Is Set Up)
		//GL.enable(GL11.GL_LIGHTING);										// Enable Lighting
		GL.enable(GL11.GL_COLOR_MATERIAL);									// Enable Material Coloring
		GL11.glHint(GL11.GL_PERSPECTIVE_CORRECTION_HINT, GL11.GL_NICEST);	// Really Nice Perspective Calculations
		//GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);	// Blending Function For Translucency Based On Source Alpha Value
		//GL.enable(GL11.GL_BLEND);
		//GL11.glPolygonMode(GL11.GL_BACK, GL11.GL_FILL);						// Back Face Is Filled In
		//GL11.glPolygonMode(GL11.GL_FRONT, GL11.GL_LINE);					// Front Face Is Drawn With Lines
	}
	
	private static void loadGLTextures()
	{
		Texture.get(0);
		cubeTex = new Texture("res/cube.png", GL11.GL_LINEAR, GL11.GL_LINEAR);
		//tim = new Texture("res/ava.png", GL11.GL_LINEAR, GL11.GL_LINEAR);
		//GL11.GL_NEAREST, GL11.GL_LINEAR, GL11.GL_LINEAR_MIPMAP_NEAREST
	}
	
	private static void buildDisplayLists()
	{
		box.address = GL11.glGenLists(2);
		GL11.glNewList(box.address, GL11.GL_COMPILE);
			GL11.glBegin(GL11.GL_QUADS);
				// Bottom Face
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);
				// Front Face
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);
				// Back Face
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);
				// Right face
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f, -1.0f);
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f( 1.0f, -1.0f,  1.0f);
				// Left Face
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f, -1.0f);
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f(-1.0f, -1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);
			GL11.glEnd();
		GL11.glEndList();
		
		top.address = box.address + 1;
		GL11.glNewList(top.address, GL11.GL_COMPILE);
			GL11.glBegin(GL11.GL_QUADS);
				// Top Face
				GL11.glTexCoord2f(0.0f, 1.0f); GL11.glVertex3f(-1.0f,  1.0f, -1.0f);
				GL11.glTexCoord2f(0.0f, 0.0f); GL11.glVertex3f(-1.0f,  1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 0.0f); GL11.glVertex3f( 1.0f,  1.0f,  1.0f);
				GL11.glTexCoord2f(1.0f, 1.0f); GL11.glVertex3f( 1.0f,  1.0f, -1.0f);
			GL11.glEnd();
		GL11.glEndList();
	}
	
//You should SORT THE TRANSPARENT POLYGONS BY DEPTH and draw them AFTER THE ENTIRE SCENE HAS BEEN DRAWN, with the DEPTH
//BUFFER ENABLED, or you will get incorrect results. I know this sometimes is a pain, but this is the correct way to do it.

	private static final float PIo180 = (float)(Math.PI / 180);
	
	//private static float yrot, xpos, zpos;
	//private static float walkbias, walkbiasangle, heading, lookupdown;
	static Sector sector1 = new Sector("res/worldQuads.txt");
	
	//static float xrot, yrot, zrot;
	//static float[][][] points = new float[45][45][3];
	
	static Texture cubeTex;
	
	static DisplayList box = new DisplayList(), top = new DisplayList();
	static float xrot, yrot;
	static Color3f[] boxcol =
	{
		new Color3f(1.0f, 0.0f, 0.0f), //bright red
		new Color3f(1.0f, 0.5f, 0.0f), //bright orange
		new Color3f(1.0f, 1.0f, 0.0f), //bright yellow
		new Color3f(0.0f, 1.0f, 0.0f), //bright green
		new Color3f(0.0f, 1.0f, 1.0f), //bright blue
	};
	static Color3f[] topcol =
	{
		new Color3f(0.5f, 0.0f, 0.0f), //dark red
		new Color3f(0.5f,0.25f, 0.0f), //dark orange
		new Color3f(0.5f, 0.5f, 0.0f), //dark yellow
		new Color3f(0.0f, 0.5f, 0.0f), //dark green
		new Color3f(0.0f, 0.5f, 0.5f), //dark blue
	};
	
	static DisplayList base;
	
	
	private static void drawGLScene()
	{
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);// Clear The Screen And The Depth Buffer
		
		for (int y = 1; y <= 5; y++)
		for (int x = 0; x < y; x++)
		{
			GL.loadIdentity();
			GL11.glBindTexture(GL11.GL_TEXTURE_2D, Texture.get(y*5+x-5).address);
			GL.translate(1.4f + x * 2.8f - y * 1.4f,(6.0f - y) * 2.4f - 7.0f, -20.0f);
			GL.rotate(45.0f - 2.0f * y + xrot, 1.0f, 0.0f, 0.0f);
			GL.rotate(45.0f + yrot, 0.0f, 1.0f, 0.0f);
			GL.color3f(boxcol[y - 1]);
			GL11.glCallList(box.address);
			GL.color3f(topcol[y - 1]);
			GL11.glCallList(top.address);
		}
	}
	
	static int wiggleCount = 0;
	private static void logic()
	{
		KeyIn.poll();
		Mice.poll();
		
		if (KeyIn.down("ESCAPE")) System.exit(0);
		
		if (KeyIn.down("RIGHT")) yrot += 1.5f;
		if (KeyIn.down("LEFT")) yrot -= 1.5f;
		if (KeyIn.down("UP")) xrot -= 1.5f;
		if (KeyIn.down("DOWN")) xrot += 1.5f;
	}
}

class DisplayList
{
	public int address;
}

class Sector
{
	public Quad[] list;
	
	public Sector(int size)
		{list = new Quad[size];}
		
	public Sector(String filename)
	{
		try
		{
			BufferedReader br = new BufferedReader(new InputStreamReader(M.class.getResourceAsStream(filename), "UTF-8"));
				//specifically, the file is expected to be encoded in UTF-8 without a BOM

			for (String line = ""; line != null; line = br.readLine())
			{
				if (line.trim().length() == 0 || line.trim().startsWith("//"))
					continue;
				if (line.startsWith("NUMPOLLIES"))
				{
					list = new Quad[Integer.parseInt(line.substring(line.indexOf("NUMPOLLIES") + "NUMPOLLIES".length() + 1))];
					for (int i = 0; i < list.length; i++)
						list[i] = new Quad();
					break;
				}
			}

			outer:
			for (int i = 0; i < list.length; i++)
			for (int j = 0; j < list[0].list.length; j++)
			{
				String line;
				while (true)
				{
					line = br.readLine();
					if (line == null)
						break outer;
					if (line.trim().length() != 0 && !line.trim().startsWith("//"))
						break;
				}

				java.util.StringTokenizer st = new java.util.StringTokenizer(line, " ");

				list[i].list[j] = new Vertex();
				list[i].list[j].x = Float.valueOf(st.nextToken()).floatValue();
				list[i].list[j].y = Float.valueOf(st.nextToken()).floatValue();
				list[i].list[j].z = Float.valueOf(st.nextToken()).floatValue();
				list[i].list[j].u = Float.valueOf(st.nextToken()).floatValue();
				list[i].list[j].v = Float.valueOf(st.nextToken()).floatValue();
			}
			br.close();
		}
		catch (IOException e) {M.catchEx(e, "Could not read " + filename);}
    }
}

class Quad
{
	public Vertex[] list = new Vertex[4];
}

class Vertex
{
	public float x, y, z;	// 3D Coordinates
	public float u, v;		// Texture Coordinates
}

class Color3f
{
	public float r, g, b;
	public Color3f(float r, float g, float b)
		{this.r = r; this.g = g; this.b = b;}
}

		/*GL.loadIdentity();
		//GL.rotate(lookupdown, 1.0f, 0, 0);// Rotate Up And Down To Look Up And Down
		GL.rotate(yrot, 0, 1.0f, 0);
		//GL.translate(-xpos, -walkbias - 0.25f, -zpos);// Translate The Scene Based On Player Position
		GL.translate(0, -0.5f, 0);
		GL11.glBindTexture(GL11.GL_TEXTURE_2D, Texture.get(22).address);
		for (int i = 0; i < sector1.list.length; i++)
		{
			GL11.glBegin(GL11.GL_QUADS);
				GL11.glNormal3f(0.0f, 0.0f, 1.0f);// Normal Pointing Forward
				for (int j = 0; j < 4; j++)
				{
					float x = sector1.list[i].list[j].x;
					float y = sector1.list[i].list[j].y;
					float z = sector1.list[i].list[j].z;
					float u = sector1.list[i].list[j].u;
					float v = sector1.list[i].list[j].v;
					GL11.glTexCoord2f(u, v);
					GL11.glVertex3f(x, y, z);
				}
			GL11.glEnd();
		}//*/

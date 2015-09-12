package grass2;

import org.lwjgl.*;
import lombok.*;

import org.lwjgl.opengl.Display;
import org.lwjgl.opengl.DisplayMode;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL12;
import org.lwjgl.opengl.GLContext;

import java.awt.image.BufferedImage;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

import java.nio.FloatBuffer;
import java.nio.IntBuffer;

public class Render implements Runnable
{
	private Render() {}
	public static Render INST = new Render();

	private static boolean shouldQuit = false; //is the game loop running
	public static void quit() {shouldQuit = true;}

	public void run()
	{
		if (M.appMode)
			try
			{
				DisplayMode[] modes = Display.getAvailableDisplayModes();
				DisplayMode chosenMode = null;
				for (int i = 0; i < modes.length; i++)
				if (modes[i].getWidth() == M.width && modes[i].getHeight() == M.height)
					{chosenMode = modes[i]; break;}
				if (chosenMode != null)
					Display.setDisplayMode(chosenMode);
			}
			catch (LWJGLException e) {M.aintGonnaWork(e);}
		try
		{
			M.setDisplayParent();
			//Display.setVSyncEnabled(true);
			Display.create();
		}
		catch (LWJGLException e) {M.aintGonnaWork(e);}
		if (M.appMode) S.claim(Display.getDisplayMode().getWidth() == M.width && Display.getDisplayMode().getHeight() == M.height);
		resizeGLScene(M.width, M.height);
		initGL();
		Logic.go();
		gameLoop();
		Display.destroy();
	}

	private static final int fpsPollingPeriod = 2000;
	private @Getter static double fps = 10;
	private static String fpsString = "? frames in ? secs = ? fps";

	private static void gameLoop()
	{
		long startTime = S.mTime() + fpsPollingPeriod;
		int frames = 0;

		while (!shouldQuit)
		{
			Display.update(false);

			drawGLScene();

			if (startTime > S.mTime())
				frames++;
			else
			{
				double timeUsed = (fpsPollingPeriod + startTime - S.mTime()) / 1000.0;
				startTime = S.mTime() + fpsPollingPeriod;
				fps = frames / timeUsed;
				fpsString = frames + " frames in " + timeUsed + " secs = " + Double.toString(fps).substring(0, Math.min(5, Double.toString(fps).length())) + " fps";
				frames = 0; 
			}
		}
	}

//////////////////////////////////////////////////////////////// openGL, mostly ////////////////////////////////////////////////////////////////

	private static final float neg180oPI = -180 / (float)Math.PI;
	public static final float zNear = 0.1f; //near clipping distance
	public static final float zFar = 500f; //far clipping distance
	public static final float yFov = 85f; //field-of-view angle in the y direction
	private static final float pixSize = (float)Math.tan(yFov / 360 * Math.PI) / M.width * 8 / 3;
	private static Texture curses;
	private static Texture crosshair;
	private static Texture terrain;

	private static void resizeGLScene(int width, int height)
	{
		GL11.glViewport(0, 0, width, height);// Reset The Current Viewport
		GL11.glMatrixMode(GL11.GL_PROJECTION);// Select The Projection Matrix
		GL.loadIdentity();
		org.lwjgl.util.glu.Project.gluPerspective(yFov, width / (float)height, zNear, zFar);// Calculate The Aspect Ratio Of The Window
		GL11.glMatrixMode(GL11.GL_MODELVIEW);// Select The Modelview Matrix
		GL.loadIdentity();
	}

	private static void initGL()
	{
		if (!GLContext.getCapabilities().GL_ARB_vertex_buffer_object)
			M.aintGonnaWork(null);

		loadGLTextures();
		Grid.initGL();

		GL.enable(GL11.GL_CULL_FACE);
		GL.enable(GL11.GL_TEXTURE_2D);						// Enable Texture Mapping
		GL11.glShadeModel(GL11.GL_SMOOTH);					// Enables Smooth Shading
		GL11.glClearColor(0.0f, 0.0f, 0.0f, 0.5f);			// Black Background
		GL11.glClearDepth(1.0f);							// Depth Buffer Setup
		GL.enable(GL11.GL_DEPTH_TEST);
		GL11.glDepthFunc(GL11.GL_LEQUAL);					// The Type Of Depth Test To Do
		//GL.enable(GL11.GL_LIGHT0);							// Quick And Dirty Lighting (Assumes Light0 Is Set Up)
		//GL.enable(GL11.GL_LIGHTING);						// Enable Lighting
		//GL11.glColorMaterial(GL11.GL_FRONT_AND_BACK, GL11.GL_AMBIENT_AND_DIFFUSE);
		//GL.enable(GL11.GL_COLOR_MATERIAL);					// Enable Material Coloring
		GL.hint(GL.PERSPECTIVE_CORRECTION_HINT, GL.NICEST);	// Really Nice Perspective Calculations
		GL11.glBlendFunc(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA);	// Blending Function For Translucency Based On Source Alpha Value
		GL11.glPixelStorei(GL11.GL_UNPACK_ALIGNMENT, 4); //useful for VBOs? idk(
	}

	private static void loadGLTextures()
	{
		//GL.NEAREST, GL.LINEAR, GL.LINEAR_MIPMAP_NEAREST
		//crosshair
			BufferedImage chimg = new BufferedImage(32, 32, BufferedImage.TYPE_INT_ARGB);
			for (int i = 7; i < 18 + 7; i++)
			{
				chimg.setRGB(i, 15, 0xffffffff);
				chimg.setRGB(i, 16, 0xffffffff);
				chimg.setRGB(15, i, 0xffffffff);
				chimg.setRGB(16, i, 0xffffffff);
			}
			crosshair = new Texture(chimg, GL.NEAREST, GL.LINEAR);
		//curses font
			BufferedImage curses8x13 = FyleMan.getImage("res/curses_8x13.png");
			for (int x = 0; x < curses8x13.getWidth(); x++)
			for (int y = 0; y < curses8x13.getHeight(); y++)
			if (curses8x13.getRGB(x, y) == 0xffff00ff)
				curses8x13.setRGB(x, y, 0x00000000);
			for (int x = 0; x < curses8x13.getWidth() - 1; x++)
			for (int y = 0; y < curses8x13.getHeight() - 1; y++)
			if (curses8x13.getRGB(x, y) == 0xffffffff && curses8x13.getRGB(x + 1, y + 1) == 0x00000000)
				curses8x13.setRGB(x + 1, y + 1, 0xff000000);
			curses = new Texture(curses8x13, GL.NEAREST, GL.NEAREST);
			sizeX = pixSize * curses.width / 16f * sizeFactor;
			sizeY = pixSize * curses.height / 16f * sizeFactor;
		//terrain
			BufferedImage terr = FyleMan.getImage("res/terrain.png");
			for (int i = 256; i < 272; i++)
			for (int j = 0; j < 272; j++)
			{
				if (terr.getRGB(i, j) == 0xff000000)
					terr.setRGB(i, j, 0);
				if (terr.getRGB(j, i) == 0xff000000)
					terr.setRGB(j, i, 0);
				if (terr.getRGB(i, j) != 0)
					terr.setRGB(i, j, 0xd0000000);
				if (terr.getRGB(j, i) != 0)
					terr.setRGB(j, i, 0xd0000000);
			}
			terrain = new Texture(terr, GL.NEAREST, GL.NEAREST);
	}

	private static void drawGLScene()
	{
		Display.processMessages();
		GL11.glClear(GL11.GL_COLOR_BUFFER_BIT | GL11.GL_DEPTH_BUFFER_BIT);
		GL.loadIdentity();

		Position pos = Logic.getPlayerPosition();
		float angleY = pos.angleY, angleXZ = pos.angleXZ;
		int callsToDPM = Math.min(1, (int)(100 / fps) + 1);

	//Drawing opaque polygons:

		//background
			GL.disable(GL11.GL_TEXTURE_2D);
			GL.begin(GL.QUADS);
				GL.color3f(0.7f, 0.1f, 0.7f); GL.vertex3f(-611.7f,  459f, -zFar + 0.1f);//GL.color3f(0.3f, 0.5f, 0.5f);
				GL.color3f(0.7f, 0.7f, 0.1f); GL.vertex3f(-611.7f, -459f, -zFar + 0.1f);//GL.color3f(.85f,    1,    1);
				GL.color3f(0.7f, 0.1f, 0.1f); GL.vertex3f( 611.7f, -459f, -zFar + 0.1f);//GL.color3f(.55f, .84f, .88f);
				GL.color3f(0.7f, 0.7f, 0.7f); GL.vertex3f( 611.7f,  459f, -zFar + 0.1f);//GL.color3f(.85f,    1,    1);
			GL.end();
			GL.enable(GL11.GL_TEXTURE_2D);
			GL.color3f(1, 1, 1);

		//cubes
			Logic.theGrid.render();
		
		//wireframe
			int wfx = Logic.wireframe.x;
			int wfy = Logic.wireframe.y;
			int wfz = Logic.wireframe.z;
			if (wfx >= 0 && wfx < Logic.theGrid.X && wfy >= 0 && wfy < Logic.theGrid.Y && wfz >= 0 && wfz < Logic.theGrid.Z)
			{
				float d = -0.001f;
				float q = 1 - d;
				GL11.glLineWidth(2);
				GL.color3f(0.2f, 0.2f, 0.2f);
				GL.pushMatrix();
				GL.rotate(angleY * neg180oPI, 1.0f, 0.0f, 0.0f);
				GL.rotate(angleXZ * neg180oPI, 0.0f, 1.0f, 0.0f);
				GL.translate(-pos.x + wfx, -pos.y + wfy, -pos.z + wfz);
				GL.begin(GL.LINE_LOOP);
					GL.vertex3f(d, d, d);
					GL.vertex3f(d, d, q);
					GL.vertex3f(q, d, q);
					GL.vertex3f(q, d, d);
				GL.end();
				GL.begin(GL.LINE_LOOP);
					GL.vertex3f(d, q, d);
					GL.vertex3f(d, q, q);
					GL.vertex3f(q, q, q);
					GL.vertex3f(q, q, d);
				GL.end();
				GL.begin(GL.LINES);
					GL.vertex3f(d, d, d); GL.vertex3f(d, q, d);
					GL.vertex3f(d, d, q); GL.vertex3f(d, q, q);
					GL.vertex3f(q, d, q); GL.vertex3f(q, q, q);
					GL.vertex3f(q, d, d); GL.vertex3f(q, q, d);
				GL.end();
				GL.popMatrix();
				GL.color3f(1, 1, 1);
			}

	//Drawing transparent polygons, from back to front:
		GL.enable(GL11.GL_BLEND);

	//Drawing 2D UI things, which are in the plane of -1 and are drawn with the depth buffer off:
		GL.disable(GL11.GL_DEPTH_TEST);
			
		float chfx = pixSize * crosshair.width / 2;
		float chfy = pixSize * crosshair.height / 2;
		GL.bindTexture2D(crosshair);
		GL.begin(GL.QUADS);
			GL11.glTexCoord2f(0.0f, 0.0f); GL.vertex3f(-chfx, -chfy, -1);
			GL11.glTexCoord2f(1.0f, 0.0f); GL.vertex3f( chfx, -chfy, -1);
			GL11.glTexCoord2f(1.0f, 1.0f); GL.vertex3f( chfx,  chfy, -1);
			GL11.glTexCoord2f(0.0f, 1.0f); GL.vertex3f(-chfx,  chfy, -1);
		GL.end();
		
		drawString(fpsString, 0, M.height - 13);
		if (Logic.isFastMode())
			drawString("1337 |-|4><><0RZ", 0, M.height - 26);
		drawString("Tile: " + S.toHex((byte)Logic.getTileToPlace()), M.width - 8 * 8, M.height - 13);
			
		if (KeyIn.down("LSHIFT") || KeyIn.down("NUMPAD1"))
		{
			GL.bindTexture2D(terrain);
			GL.begin(GL.QUADS);
				GL11.glTexCoord2f(0.0f, 1.0f); GL.vertex3f(pixSize * 94, pixSize * (6-272), -1);
				GL11.glTexCoord2f(1.0f, 1.0f); GL.vertex3f(pixSize * (94+272), pixSize * (6-272), -1);
				GL11.glTexCoord2f(1.0f, 0.0f); GL.vertex3f(pixSize * (94+272), pixSize * 6, -1);
				GL11.glTexCoord2f(0.0f, 0.0f); GL.vertex3f(pixSize * 94, pixSize * 6, -1);
			GL.end();
			GL.color3f(0, 0, 0);
			GL11.glLineWidth(2);
			int tile = (byte)Logic.getTileToPlace();
			if (tile < 0) tile += 256;
			GL.begin(GL.LINE_LOOP);
				GL.vertex3f(pixSize * (94 -  1 + (tile % 16) * 16), pixSize * (6 -  1 - (tile / 16 + 1) * 16), -1);
				GL.vertex3f(pixSize * (94 + 17 + (tile % 16) * 16), pixSize * (6 -  1 - (tile / 16 + 1) * 16), -1);
				GL.vertex3f(pixSize * (94 + 17 + (tile % 16) * 16), pixSize * (6 + 17 - (tile / 16 + 1) * 16), -1);
				GL.vertex3f(pixSize * (94 -  1 + (tile % 16) * 16), pixSize * (6 + 17 - (tile / 16 + 1) * 16), -1);
			GL.end();
			GL.color3f(1, 1, 1);
		}
			
		GL.enable(GL11.GL_DEPTH_TEST);
		GL.disable(GL11.GL_BLEND);
	}

	static void drawString(String s, int originX, int originY)
	{
		if (s == null) return;
		GL.bindTexture2D(curses);
		GL.pushMatrix();
		GL.loadIdentity();
		GL.translate((originX - M.width / 2) * pixSize, (originY - M.height / 2) * pixSize, 0);
		for (int i = 0, offset = 0; i < s.length(); i++)
		{
			char c = s.charAt(i) < 256? s.charAt(i) : '?';
			if (c == '\t')
			{
				do {drawCharPartial(' '); GL.translate(8 * pixSize, 0, 0); offset++;}
				while ((i + offset) % 8 != 0);
				offset--;
			}
			else
				{drawCharPartial(c); GL.translate(8 * pixSize, 0, 0);}
		}
		GL.popMatrix();
	}

	private static final int sizeFactor = 1;
	private static float sizeX;
	private static float sizeY;
	private static final float o16 = 1f / 16f;
	private static void drawCharPartial(char c)
	{
		float x = (c % 16) / 16f;
		float y = (c / 16) / 16f;
		GL.begin(GL.QUADS);
			GL11.glTexCoord2f(x      , y + o16); GL.vertex3f(0    , 0    , -1);
			GL11.glTexCoord2f(x + o16, y + o16); GL.vertex3f(sizeX, 0    , -1);
			GL11.glTexCoord2f(x + o16, y      ); GL.vertex3f(sizeX, sizeY, -1);
			GL11.glTexCoord2f(x      , y      ); GL.vertex3f(0    , sizeY, -1);
		GL.end();
	}
}
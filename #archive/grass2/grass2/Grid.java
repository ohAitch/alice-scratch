package grass2;

import org.lwjgl.*;
import lombok.*;

import org.lwjgl.opengl.GL11;

import java.awt.image.BufferedImage;

public class Grid
{
	private final Chunk[][][] chunk;
	public final int X, Y, Z;
	final int Xo8, Yo8, Zo8;
	
	public Grid(int x, int y, int z) {this(new int[x][y][z]);}
	public Grid(int[][][] data)
	{
		Xo8 = data.length / 64;
		Yo8 = data[0].length / 64;
		Zo8 = data[0][0].length / 64;
		X = Xo8 * 64;
		Y = Yo8 * 64;
		Z = Zo8 * 64;
		chunk = new Chunk[Xo8][Yo8][Zo8];
		for (int x = 0; x < Xo8; x++)
		for (int y = 0; y < Yo8; y++)
		for (int z = 0; z < Zo8; z++)
		{
			int[][][] dat = new int[64][64][64];
			for (int x8 = 0; x8 < 64; x8++)
			for (int y8 = 0; y8 < 64; y8++)
			for (int z8 = 0; z8 < 64; z8++)
				dat[x8][y8][z8] = getFromRaggedArray(data, x * 64 + x8, y * 64 + y8, z * 64 + z8);
			chunk[x][y][z] = new Chunk(this, new Point3i(x, y, z), dat);
		}
	}
	
	public void setTile(int x, int y, int z, int value) {chunk[0][0][0].set(x, y, z, value);}
	public int getTile(int x, int y, int z) {return chunk[0][0][0].get(x, y, z);}
	public int getAdjacentTile(int face, int x, int y, int z) {return chunk[0][0][0].getAdjacent(face, x, y, z);}
	
	Chunk getChunk(int x, int y, int z)
	{
		if (y >= Yo8)
			return Chunk.NULLUP;
		if (x < 0 || x >= Xo8 || y < 0 || z < 0 || z >= Zo8)
			return Chunk.NULLUP;
		return chunk[x][y][z];
	}
	
	private static int getFromRaggedArray(int[][][] arr, int x, int y, int z)
	{
		if (x >= arr.length || y >= arr[x].length || z >= arr[x][y].length)
			return -1;
		return arr[x][y][z];
	}

//////////////////////////////////////////////////////////////// opengl ////////////////////////////////////////////////////////////////
	
	private static final float neg180oPI = -180 / (float)Math.PI;
	public static Texture terrain;
	
	public static void initGL()
	{
		if (terrain != null) return;
		/*BufferedImage bi = FyleMan.getImage("res/curses_8x12.png");
		BufferedImage terr = new BufferedImage(12, 3072, BufferedImage.TYPE_INT_ARGB);
		for (int x = 0; x < 16; x++)
		for (int y = 0; y < 16; y++)
		for (int i = 0; i < 12; i++)
		for (int j = 0; j < 12; j++)
		{
			int rgb = 0xff000000;
			if (i >= 2 && i < 10)
				rgb = bi.getRGB(x * 8 + i - 2, y * 12 + j);
			if (rgb == 0xffff00ff)
				rgb = 0xff000000;
			int r = rgb >>> 16 & 0xff;
			int g = rgb >>> 8 & 0xff;
			int b = rgb & 0xff;
			if (x == 7 && y == 15)
				rgb = 0xa0 << 24 | r << 16 | g << 8 | b;
			//terr.setRGB(x * 12 + i, y * 12 + j, rgb);
			terr.setRGB(i, (x + y * 16) * 12 + j, rgb);
		}*/
		BufferedImage bi = FyleMan.getImage("res/terrain.png");
		BufferedImage terr = new BufferedImage(288, 288, BufferedImage.TYPE_INT_ARGB);
		for (int x = 0; x < 16; x++)
		for (int y = 0; y < 16; y++)
		for (int i = 0; i < 16; i++)
		for (int j = 0; j < 16; j++)
		{
			int rgb = bi.getRGB(x * 16 + i, y * 16 + j);
			terr.setRGB(x * 18 + i + 1, y * 18 + j + 1, rgb);
			if (i == 0) terr.setRGB(x * 18, y * 18 + j + 1, rgb);
			if (j == 0) terr.setRGB(x * 18 + i + 1, y * 18, rgb);
			if (i == 15) terr.setRGB(x * 18 + 17, y * 18 + j + 1, rgb);
			if (j == 15) terr.setRGB(x * 18 + i + 1, y * 18 + 17, rgb);
			if (i == 0 && j == 0) terr.setRGB(x * 18, y * 18, rgb);
			if (i == 0 && j == 15) terr.setRGB(x * 18, y * 18 + 17, rgb);
			if (i == 15 && j == 0) terr.setRGB(x * 18 + 17, y * 18, rgb);
			if (i == 15 && j == 15) terr.setRGB(x * 18 + 17, y * 18 + 17, rgb);
		}
		terrain = new Texture(terr, GL.NEAREST, GL.LINEAR);
	}
	
	public void render()
	{
		Position pos = Logic.getPlayerPosition();
		float angleY = pos.angleY, angleXZ = pos.angleXZ;
		int callsToDPM = Math.max(1, (int)(100 / Render.getFps()) + 1) * 4; //times 4 for safety and happiness
		
		VBO.beginRendering();
		GL.pushMatrix();
		GL.bindTexture2D(terrain);
		GL.rotate(angleY * neg180oPI, 1.0f, 0.0f, 0.0f);
		GL.rotate(angleXZ * neg180oPI, 0.0f, 1.0f, 0.0f);
		for (int x = 0; x < Xo8; x++)
		for (int y = 0; y < Yo8; y++)
		{
			//ensures that Display.processMessages() is called at least once per Logic cycle to avoid input lag
			//if ((x * Yo8 + y) % (Xo8 * Yo8 / callsToDPM) == 0)
				org.lwjgl.opengl.Display.processMessages();
			for (int z = 0; z < Zo8; z++)
			{
				chunk[x][y][z].update();
				if (chunk[x][y][z].vbo != null)
				{
					GL.pushMatrix();
					GL.translate(-pos.x + x * 64, -pos.y + y * 64, -pos.z + z * 64);
					chunk[x][y][z].vbo.render();
					GL.popMatrix();
				}
			}
		}
		GL.enable(GL11.GL_BLEND);
		for (int x = 0; x < Xo8; x++)
		for (int y = 0; y < Yo8; y++)
		for (int z = 0; z < Zo8; z++)
		if (chunk[x][y][z].trans != null)
		{
			GL.pushMatrix();
			GL.translate(-pos.x + x * 64, -pos.y + y * 64, -pos.z + z * 64);
			chunk[x][y][z].trans.render();
			GL.popMatrix();
		}
		GL.disable(GL11.GL_BLEND);
		GL.popMatrix();
		VBO.endRendering();
		
		GL.enable(GL11.GL_BLEND);
		GL.disable(GL11.GL_DEPTH_TEST);
		Render.drawString("quads: " + Chunk.quads + " and chunks: " + (Xo8 * Yo8 * Zo8) + " so quads / chunks: " + (Chunk.quads / Xo8 / Yo8 / Zo8), 0, M.height - 13 * 3);
		GL.enable(GL11.GL_DEPTH_TEST);
		GL.disable(GL11.GL_BLEND);
	}
}
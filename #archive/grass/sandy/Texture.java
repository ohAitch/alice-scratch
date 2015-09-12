package sandy;

import org.lwjgl.*;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.File;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.IntBuffer;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL12;

public class Texture
{
	public int  width    = 16; // the width
	public int  height   = 16; // the height
	public byte bitdepth = 32; // the bitdepth, ie: 24bit
	public int  address  = -1; // the opengl name by creation

	private Texture() {}

	public Texture(String filename, int magFilter, int minFilter)
	{
		java.io.DataInputStream dis = null;
		try {dis = new java.io.DataInputStream(new java.io.FileInputStream(filename));}
		catch (java.io.FileNotFoundException e) {Sys.alert("Error", filename + " not found."); System.exit(0);}
		byte[] tgaRawHeader = new byte[12];
		try {dis.readFully(tgaRawHeader);}
		catch (IOException e) {Sys.alert("Error", "Oh nyo!");}

		Texture tex = null;
		if (tgaRawHeader[2] == 2)
		{
			byte[] tgaHeader = new byte[6];
			try {dis.readFully(tgaHeader);}
			catch (IOException e) {Sys.alert("Error", "Oh nyo!");}

			tex = new Texture();
			tex.width    = (tgaHeader[1] << 8) + tgaHeader[0];
			tex.height   = (tgaHeader[3] << 8) + tgaHeader[2];
			tex.bitdepth = tgaHeader[4];

			final byte[] textureData = new byte[tex.width * tex.height * tex.bitdepth / 8];
			try {dis.readFully(textureData);}
			catch (IOException e) {Sys.alert("Error", "Oh nyo!");}

			tex = createTexture(tex, textureData, magFilter, minFilter);
		}
		else if (tgaRawHeader[2] == 10)
			{Sys.alert("Error", "RLE encoded TGA not supported."); System.exit(0);} //tex = loadCompressedData();
		else
			{Sys.alert("Error", "Encoding not recognized."); System.exit(0);}

		this.width = tex.width;
		this.height = tex.height;
		this.bitdepth = tex.bitdepth;
		this.address = tex.address;
	}

	public static Texture get(int xy)
	{
		if (tex[xy] == null)
			makeTex(xy);
		return tex[xy];
	}

	private static BufferedImage terrain = null;
	static	{try {terrain = ImageIO.read(new File("sandy/res/terrain.png"));}
			catch (IOException e) {e.printStackTrace();}}
	private static final Texture[] tex = new Texture[256];
	private static void makeTex(int xy)
	{
		tex[xy] = new Texture();
		byte[] texData = new byte[tex[xy].width * tex[xy].height * tex[xy].bitdepth / 8];

		for (int x = 0; x < 16; x++)
		for (int y = 0; y < 16; y++)
		{
			int rgb = terrain.getRGB((xy % 16 + 1) * 16 - x - 1, (xy / 16 + 1) * 16 - y - 1);
			texData[(y * 16 + x) * 4 + 0] = (byte) (rgb & 0xff);
			texData[(y * 16 + x) * 4 + 1] = (byte) (rgb >>> 8 & 0xff);
			texData[(y * 16 + x) * 4 + 2] = (byte) (rgb >>> 16 & 0xff);
			texData[(y * 16 + x) * 4 + 3] = (byte) 0xff;
		}

		tex[xy] = createTexture(tex[xy], texData, GL11.GL_NEAREST, GL11.GL_LINEAR);
	}

	private static Texture createTexture(Texture tex, byte[] textureData, int magFilter, int minFilter)
	{
		final ByteBuffer textureBuffer = ByteBuffer.allocateDirect(textureData.length).order(ByteOrder.nativeOrder());

		textureBuffer.clear();
		textureBuffer.put(textureData);
		textureBuffer.flip();

		final IntBuffer glName = ByteBuffer.allocateDirect(4).order(ByteOrder.nativeOrder()).asIntBuffer();

		GL11.glGenTextures(glName);
		tex.address = glName.get(0);

		GL11.glBindTexture(GL11.GL_TEXTURE_2D, tex.address);

		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, magFilter);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, minFilter);

		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);

		// RGB OR RGBA - We assume that it is at least 24 bit
		int glColor = tex.bitdepth == 32 ? GL12.GL_BGRA : GL12.GL_BGR;
		int glColor2 = tex.bitdepth == 32 ? GL11.GL_RGBA : GL11.GL_RGB;
		GL11.glTexImage2D(GL11.GL_TEXTURE_2D,0,glColor2,tex.width,tex.height,0,glColor,GL11.GL_UNSIGNED_BYTE,textureBuffer);

		return tex;
	}
}
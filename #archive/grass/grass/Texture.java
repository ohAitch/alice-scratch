package grass;

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
		String filetype = null;
		if (filename.lastIndexOf('.') != -1 && filename.lastIndexOf('.') != filename.length() - 1)
			filetype = filename.substring(filename.lastIndexOf('.') + 1);
		if (filetype == null)
			M.catchEx(null, "new Texture(...): Filetype invalid.");
		else if (filetype.equals("tga"))
		{
			java.io.DataInputStream dis = new java.io.DataInputStream(M.class.getResourceAsStream(filename));
			if (dis == null)
				M.catchEx(new java.io.FileNotFoundException(), filename + " not found.");

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

				final byte[] texData = new byte[tex.width * tex.height * tex.bitdepth / 8];
				try {dis.readFully(texData);}
				catch (IOException e) {Sys.alert("Error", "Oh nyo!");}

				tex = createTexture(tex, texData, magFilter, minFilter);
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
		else if (filetype.equals("png"))
		{
			BufferedImage img = null;
			try {img = ImageIO.read(M.class.getResource(filename));}
			catch (IOException e) {M.catchEx(e, filename + " not found");}

			Texture tex = new Texture();
			tex.width    = img.getWidth();
			tex.height   = img.getHeight();
			tex.bitdepth = (byte)img.getColorModel().getPixelSize();
			
			byte[] texData = new byte[tex.width * tex.height * tex.bitdepth / 8];
			for (int x = 0; x < tex.width; x++)
			for (int y = 0; y < tex.height; y++)
			{
				int rgb = img.getRGB(x, y);
				texData[(y * tex.width + x) * 4 + 0] = (byte)(rgb & 0xff);
				texData[(y * tex.width + x) * 4 + 1] = (byte)(rgb >>> 8 & 0xff);
				texData[(y * tex.width + x) * 4 + 2] = (byte)(rgb >>> 16 & 0xff);
				texData[(y * tex.width + x) * 4 + 3] = (byte)(rgb >>> 24);
			}

			tex = createTexture(tex, texData, magFilter, minFilter);
			
			this.width = tex.width;
			this.height = tex.height;
			this.bitdepth = tex.bitdepth;
			this.address = tex.address;
		}
		else
			M.catchEx(null, "new Texture(...): Filetype not useable.");
	}

	public static Texture get(int xy)
	{
		if (tex[xy] == null)
			makeTex(xy);
		return tex[xy];
	}

	private static BufferedImage terrain = null;
	static	{try {terrain = ImageIO.read(M.class.getResource("res/terrain.png"));}
			catch (IOException e) {M.catchEx(e, "/res/terrain.png not found");}}
	private static final Texture[] tex = new Texture[256];
	private static void makeTex(int xy)
	{
		tex[xy] = new Texture();
		byte[] texData = new byte[tex[xy].width * tex[xy].height * tex[xy].bitdepth / 8];

		for (int x = 0; x < 16; x++)
		for (int y = 0; y < 16; y++)
		{
			int rgb = terrain.getRGB((xy % 16 + 1) * 16 - x - 1, (xy / 16 + 1) * 16 - y - 1);
			texData[(y * 16 + x) * 4 + 0] = (byte)(rgb & 0xff);
			texData[(y * 16 + x) * 4 + 1] = (byte)(rgb >>> 8 & 0xff);
			texData[(y * 16 + x) * 4 + 2] = (byte)(rgb >>> 16 & 0xff);
			texData[(y * 16 + x) * 4 + 3] = (byte)(rgb >>> 24);
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
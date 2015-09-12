package grass2;

import org.lwjgl.*;
import lombok.*;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL12;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.File;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.IntBuffer;

public class Texture
{
	public int  width    = 16;
	public int  height   = 16;
	public byte bitdepth = 32;
	public int  address  = -1;

	private Texture() {}
	
	private void newTexture(BufferedImage img, int magFilter, int minFilter)
	{ // should only be called from a constructor
		Texture tex = new Texture();
		tex.width    = img.getWidth();
		tex.height   = img.getHeight();
		tex.bitdepth = (byte)img.getColorModel().getPixelSize();
		
		byte[] texData = new byte[tex.width * tex.height * tex.bitdepth / 8];
		for (int x = 0; x < tex.width; x++)
		for (int y = 0; y < tex.height; y++)
		{
			int rgb = img.getRGB(x, y);
			texData[(y * tex.width + x) * 4 + 0] = (byte)(rgb);
			texData[(y * tex.width + x) * 4 + 1] = (byte)(rgb >>> 8);
			texData[(y * tex.width + x) * 4 + 2] = (byte)(rgb >>> 16);
			texData[(y * tex.width + x) * 4 + 3] = (byte)(rgb >>> 24);
		}

		tex = createTexture(tex, texData, magFilter, minFilter);
		
		this.width = tex.width;
		this.height = tex.height;
		this.bitdepth = tex.bitdepth;
		this.address = tex.address;
	}
	
	public Texture(BufferedImage bi, GL magFilter, GL minFilter)
		{newTexture(bi, magFilter.id, minFilter.id);}

	public Texture(String path, GL magFilter, GL minFilter)
	{
		String filetype = null;
		if (path.lastIndexOf('.') != -1 && path.lastIndexOf('.') != path.length() - 1)
			filetype = path.substring(path.lastIndexOf('.') + 1);
		if (filetype == null)
			M.catchEx(null, "new Texture(...): Filetype invalid.");
		else if (filetype.equals("tga"))
		{
			java.io.DataInputStream dis = new java.io.DataInputStream(M.class.getResourceAsStream(path));
			if (dis == null)
				M.catchEx(new java.io.FileNotFoundException(), path + " not found.");

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

				tex = createTexture(tex, texData, magFilter.id, minFilter.id);
			}
			else if (tgaRawHeader[2] == 10)
				{Sys.alert("Error", "RLE encoded TGA not supported."); System.exit(0);}
			else
				{Sys.alert("Error", "Encoding not recognized."); System.exit(0);}

			this.width = tex.width;
			this.height = tex.height;
			this.bitdepth = tex.bitdepth;
			this.address = tex.address;
		}
		else if (filetype.equals("png"))
			newTexture(FyleMan.getImage(path), magFilter.id, minFilter.id);
		else
			M.catchEx(null, "new Texture(...): Filetype not useable.");
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

		GL.bindTexture2D(tex);

		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, magFilter);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, minFilter);

		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);

		// RGB OR RGBA - We assume that it is at least 24 bit
		int glColor = tex.bitdepth == 32 ? GL12.GL_BGRA : GL12.GL_BGR;
		int glColor2 = tex.bitdepth == 32 ? GL11.GL_RGBA : GL11.GL_RGB;
		GL11.glTexImage2D(GL11.GL_TEXTURE_2D, 0, glColor2, tex.width, tex.height, 0, glColor, GL11.GL_UNSIGNED_BYTE, textureBuffer);

		return tex;
	}
}
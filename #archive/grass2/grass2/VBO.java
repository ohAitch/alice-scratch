package grass2;

import org.lwjgl.*;
import lombok.*;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL15;

import java.nio.FloatBuffer;
import java.nio.IntBuffer;

public class VBO
{
	public final int addressVert;
	public final int addressTexC;
	public final int addressCol;
	public final int vertCount;
	
	public VBO(Vertex[] vert, TexCoord[] texc, Color[] col)
	{
		vertCount = vert.length;		
		
		float[] vertarr = new float[vert.length * 3];
		for (int i = 0; i < vert.length; i++)
		{
			vertarr[i * 3 + 0] = vert[i].x;
			vertarr[i * 3 + 1] = vert[i].y;
			vertarr[i * 3 + 2] = vert[i].z;
		}
		FloatBuffer vertfb = BufferUtils.createFloatBuffer(vert.length * 3);
		vertfb.put(vertarr);
		vertfb.position(0);
		addressVert = GL15.glGenBuffers();
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressVert);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, vertfb, GL15.GL_STATIC_DRAW);

		float[] texcarr = new float[texc.length * 2];
		for (int i = 0; i < texc.length; i++)
		{
			texcarr[i * 2 + 0] = texc[i].u;
			texcarr[i * 2 + 1] = texc[i].v;
		}
		FloatBuffer texcfb = BufferUtils.createFloatBuffer(texc.length * 2);
		texcfb.put(texcarr);
		texcfb.position(0);
		addressTexC = GL15.glGenBuffers();
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressTexC);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, texcfb, GL15.GL_STATIC_DRAW);
		
		float[] colarr = new float[col.length * 4];
		for (int i = 0; i < col.length; i++)
		{
			colarr[i * 4 + 0] = col[i].r;
			colarr[i * 4 + 1] = col[i].g;
			colarr[i * 4 + 2] = col[i].b;
			colarr[i * 4 + 3] = col[i].a;
		}
		FloatBuffer colfb = BufferUtils.createFloatBuffer(col.length * 4);
		colfb.put(colarr);
		colfb.position(0);
		addressCol = GL15.glGenBuffers();
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressCol);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, colfb, GL15.GL_STATIC_DRAW);
	}
	
	public static void beginRendering()
	{
		GL.enableClientState(GL.VERTEX_ARRAY);
		GL.enableClientState(GL.TEXTURE_COORD_ARRAY);
		GL.enableClientState(GL.COLOR_ARRAY);
	}
	public void render()
	{
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressVert);
		GL11.glVertexPointer(3, GL11.GL_FLOAT, 0, 0);
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressTexC);
		GL11.glTexCoordPointer(2, GL11.GL_FLOAT, 0, 0);
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, addressCol);
		GL11.glColorPointer(4, GL11.GL_FLOAT, 0, 0);
		GL11.glDrawArrays(GL.TRIANGLES.id, 0, vertCount);
	}
	public static void endRendering()
	{
		GL.disableClientState(GL.VERTEX_ARRAY);
		GL.disableClientState(GL.TEXTURE_COORD_ARRAY);
		GL.disableClientState(GL.COLOR_ARRAY);
	}

	public void delete()
	{
		GL15.glDeleteBuffers(addressVert);
		GL15.glDeleteBuffers(addressTexC);
		GL15.glDeleteBuffers(addressCol);
	}
}
	/*private static void bufferData(int id, FloatBuffer buffer)
	{
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, id);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, buffer, GL15.GL_STATIC_DRAW);
	}
	private static void bufferElementData(int id, IntBuffer buffer)
	{
		GL15.glBindBuffer(GL15.GL_ELEMENT_ARRAY_BUFFER, id);
		GL15.glBufferData(GL15.GL_ELEMENT_ARRAY_BUFFER, buffer, GL15.GL_STATIC_DRAW);
	}*/
package grass2;

import org.lwjgl.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

public class Chunk
{
	private static final float o16 = 1f / 16f;
	private static final float o256 = 1f / 256f;
	private static final float o288 = 1f / 288f;
	
	public static final Chunk NULL = new Chunk(null, new Point3i(-1, -1, -1), new int[0][0][0]) {
		public void update() {}
		public int get(int x, int y, int z) {return 1;}
		public void set(int x, int y, int z, int val) {}
		public Chunk getChunk(int x, int y, int z) {return this;}
	};
	public static final Chunk NULLUP = new Chunk(null, new Point3i(-1, -1, -1), new int[0][0][0]) {
		public void update() {}
		public int get(int x, int y, int z) {return -1;}
		public void set(int x, int y, int z, int val) {}
		public Chunk getChunk(int x, int y, int z) {return this;}
	};
	private final int[][][] data;
	public VBO vbo;
	public VBO trans;
	private boolean isOld = true;
	private Grid holder = null;
	private Point3i pos = null;
	
	public Chunk(Grid holder, Point3i pos, int[][][] data)
	{
		this.holder = holder;
		this.pos = pos;
		this.data = data; //*hackish* I really should use getFromRaggedArray to make this line safe
	}
	
	public void update()
	{
		if (!isOld)
			return;
		isOld = false;
		if (vbo != null)
			{vbo.delete(); vbo = null;}
		if (trans != null)
			{trans.delete(); trans = null;}
		
		List<Vertex> vert = new ArrayList<Vertex>();
		List<TexCoord> texc = new ArrayList<TexCoord>();
		List<Color> col = new ArrayList<Color>();
						
		for (int x = 0; x < 64; x++)
		for (int y = 0; y < 64; y++)
		for (int z = 0; z < 64; z++)
		{
			int gt = get(x, y, z);
			if (gt != -1 && gt != 123 && gt != 49 && gt != 0x1f7)
			for (int f = 0; f < 6; f++)
			{
				int gat = getAdjacent(f, x, y, z);
				if (gat == -1 || gat == 123 || gat == 49 || gat == 0x1f7)
					addFace(vert, f, x, y, z, 1, texc, gt, col, gt >> 8);
			}
		}
		
		if (vert.size() > 0)
			vbo = new VBO(vert.toArray(new Vertex[0]), texc.toArray(new TexCoord[0]), col.toArray(new Color[0]));
		
		vert = new ArrayList<Vertex>();
		texc = new ArrayList<TexCoord>();
		col = new ArrayList<Color>();
						
		for (int x = 0; x < 64; x++)
		for (int y = 0; y < 64; y++)
		for (int z = 0; z < 64; z++)
		{
			int gt = get(x, y, z);
			if (gt == 123 || gt == 49 || gt == 0x1f7)
			for (int f = 0; f < 6; f++)
			{
				int gat = getAdjacent(f, x, y, z);
				if (gat == -1)
					addFace(vert, f, x, y, z, 1, texc, gt, col, gt >> 8);
			}
		}
		
		if (vert.size() > 0)
			trans = new VBO(vert.toArray(new Vertex[0]), texc.toArray(new TexCoord[0]), col.toArray(new Color[0]));
	}
	
	public int get(int x, int y, int z)
	{
		if (x >= 0 && x < 64 && y >= 0 && y < 64 && z >= 0 && z < 64)
			return data[x][y][z];
		return getChunk(ddiv(x), ddiv(y), ddiv(z)).get(mmod(x), mmod(y), mmod(z));
	}
	public int getAdjacent(int face, int x, int y, int z)
	{
		switch (face)
		{
			case 0: x++; break;
			case 1: x--; break;
			case 2: y++; break;
			case 3: y--; break;
			case 4: z++; break;
			case 5: z--; break;
		}
		return get(x, y, z);
	}

	public void set(int x, int y, int z, int val)
	{
		if (x < 0 || x >= 64 || y < 0 || y >= 64 || z < 0 || z >= 64)
			{getChunk(ddiv(x), ddiv(y), ddiv(z)).set(mmod(x), mmod(y), mmod(z), val); return;}
		data[x][y][z] = val;
		isOld = true;
		     if (x == 63 && pos.x < holder.Xo8 - 1) getChunk( 1,  0,  0).isOld = true;
		else if (x ==  0 && pos.x > 0             ) getChunk(-1,  0,  0).isOld = true;
		     if (y == 63 && pos.y < holder.Yo8 - 1) getChunk( 0,  1,  0).isOld = true;
		else if (y ==  0 && pos.y > 0             ) getChunk( 0, -1,  0).isOld = true;
		     if (z == 63 && pos.z < holder.Zo8 - 1) getChunk( 0,  0,  1).isOld = true;
		else if (z ==  0 && pos.z > 0             ) getChunk( 0,  0, -1).isOld = true;
	}
	
	public Chunk getChunk(int x, int y, int z)
	{
		if (holder == null)
			return Chunk.NULL;
		return holder.getChunk(pos.x + x, pos.y + y, pos.z + z);
	}
	
	private static int ddiv(int i) {return i < 0? (i - 63) / 64 : i / 64;}
	private static int mmod(int i) {return (i % 64 + 64) % 64;}
static int quads;
	private static void addFace(List<Vertex> vert, int face, int x, int y, int z, float stretch, List<TexCoord> texc, int tex, List<Color> col, int color)
	{
quads++;
		float dx = (face >= 2? stretch : 1), dy = 1, dz = (face >= 2? 1 : stretch);
		switch (face)
		{
			case 0: case 1: float a, b, c;
				if (face == 0) {a = dx; b =  0; c = dz;}
				else           {a =  0; b = dz; c =  0;}
				vert.add(new Vertex(x + a, y + dy, z + c));
				vert.add(new Vertex(x + a, y +  0, z + c));
				vert.add(new Vertex(x + a, y + dy, z + b));
				vert.add(new Vertex(x + a, y +  0, z + b));
				vert.add(new Vertex(x + a, y + dy, z + b));
				vert.add(new Vertex(x + a, y +  0, z + c));
				break;
			case 2: case 3:
				if (face == 2) {a = dy; b = dx; c =  0;}
				else           {a =  0; b =  0; c = dx;}
				vert.add(new Vertex(x + b, y + a, z + dz));
				vert.add(new Vertex(x + b, y + a, z +  0));
				vert.add(new Vertex(x + c, y + a, z + dz));
				vert.add(new Vertex(x + c, y + a, z +  0));
				vert.add(new Vertex(x + c, y + a, z + dz));
				vert.add(new Vertex(x + b, y + a, z +  0));
				break;
			case 4: case 5:
				if (face == 4) {a = dz; b = dx; c =  0;}
				else           {a =  0; b =  0; c = dx;}
				vert.add(new Vertex(x + c, y + dy, z + a));
				vert.add(new Vertex(x + c, y +  0, z + a));
				vert.add(new Vertex(x + b, y + dy, z + a));
				vert.add(new Vertex(x + b, y +  0, z + a));
				vert.add(new Vertex(x + b, y + dy, z + a));
				vert.add(new Vertex(x + c, y +  0, z + a));
				break;
		}

		float fx = (tex & 0xf) * o16;
		float fy = (tex >> 4 & 0xf) * o16;
		texc.add(new TexCoord(fx + o288      , fy + o288      ));
		texc.add(new TexCoord(fx + o288      , fy - o288 + o16));
		texc.add(new TexCoord(fx - o288 + o16, fy + o288      ));
		texc.add(new TexCoord(fx - o288 + o16, fy - o288 + o16));
		texc.add(new TexCoord(fx - o288 + o16, fy + o288      ));
		texc.add(new TexCoord(fx + o288      , fy - o288 + o16));
		
		/*float tiles = (face >= 2? dx : dz);
		float f = (tex & 0xff) * o256;
		texc.add(new TexCoord(0    , f       ));
		texc.add(new TexCoord(0    , f + o256));
		texc.add(new TexCoord(tiles, f       ));
		texc.add(new TexCoord(tiles, f + o256));
		texc.add(new TexCoord(tiles, f       ));
		texc.add(new TexCoord(0    , f + o256));*/

		Color toUse = (tex == 123? code74col[0xf].withAlpha(0.53f) : code74col[0xf]);
		col.add(toUse);
		col.add(toUse);
		col.add(toUse);
		col.add(toUse);
		col.add(toUse);
		col.add(toUse);
	}
	
	private static final Color[] code74col =
	{
		new Color(1f, 0x00 / 256f, 0x00 / 256f, 0x00 / 256f), // 0 black
		new Color(1f, 0x00 / 256f, 0x00 / 256f, 0x80 / 256f), // 1 blue
		new Color(1f, 0x00 / 256f, 0x80 / 256f, 0x00 / 256f), // 2 green
		new Color(1f, 0x00 / 256f, 0x80 / 256f, 0x80 / 256f), // 3 cyan
		new Color(1f, 0x80 / 256f, 0x00 / 256f, 0x00 / 256f), // 4 red
		new Color(1f, 0x80 / 256f, 0x00 / 256f, 0x80 / 256f), // 5 magenta
		new Color(1f, 0x80 / 256f, 0x80 / 256f, 0x00 / 256f), // 6 brown
		new Color(1f, 0xc0 / 256f, 0xc0 / 256f, 0xc0 / 256f), // 7 light grey
		new Color(1f, 0x80 / 256f, 0x80 / 256f, 0x80 / 256f), // 8 dark grey
		new Color(1f, 0x00 / 256f, 0x00 / 256f, 0xff / 256f), // 9 bright blue
		new Color(1f, 0x00 / 256f, 0xff / 256f, 0x00 / 256f), // a bright green
		new Color(1f, 0x00 / 256f, 0xff / 256f, 0xff / 256f), // b bright cyan
		new Color(1f, 0xff / 256f, 0x00 / 256f, 0x00 / 256f), // c bright red
		new Color(1f, 0xff / 256f, 0x00 / 256f, 0xff / 256f), // d bright magenta
		new Color(1f, 0xff / 256f, 0xff / 256f, 0x00 / 256f), // e yellow
		new Color(1f, 0xff / 256f, 0xff / 256f, 0xff / 256f), // f white
	};
}
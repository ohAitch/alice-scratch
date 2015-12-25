package grass2;

import org.lwjgl.*;
import lombok.*;

import java.awt.image.BufferedImage;

public /*static*/ class TerrGen
{
	public static int[][][] createMapOutOfThePrimalVoidOfImagination()
	{
		return gridFromHeightmap(plasmaFractalHeightmap(128, 0.6, null, 128), 20);
		//return gridFromHeightmap(faultFractalHeightmap(64), 1);
		//return gridFromHeightmap(fbmFractalHeightmap(64), 2);
		//return gridFromHeightmap(reesheeHeightmap(64), 1);
		//return dwarfFortress();
		//return planetoidize();
	}
	
	private static int[][][] planetoidize()
	{
		int[][][] ret = Arrayu.fill(new int[128][128][128], -1);
		
		for (int x = 0; x < 128; x++)
		for (int y = 0; y < 128; y++)
		for (int z = 0; z < 128; z++)
		{
			double n = Noise.perlin(x * 0.02, y * 0.02, z * 0.02);
			if (n < -0.25)
				ret[x][y][z] = select(S.rand(17));
		}
		
		return ret;
	}
	
	private static double[][] plasmaFractalHeightmap(int size, double roughness, double[][] seedMesh, int seedPeriod)
	{
		if (seedMesh == null || seedMesh.length != size + 1 || seedMesh[0].length != size + 1)
		{
			seedMesh = new double[size + 1][size + 1];
			if (seedPeriod != 0)
				for (int x = 0; x < size + 1; x += 64)
				for (int z = 0; z < size + 1; z += 64)
					seedMesh[x][z] = S.rand();
		}
		if (seedPeriod == 0)
			seedPeriod = size;
		double[][] mesh = divideMesh(seedMesh, 1, roughness, size, seedPeriod / 2);
		double[][] ret = new double[size][size];
		for (int x = 0; x < size - 1; x++)
		for (int z = 0; z < size - 1; z++)
			ret[x][z] = mesh[x][z];
			/*ret[x][z] = (
				mesh[x + 0][z + 0] + mesh[x + 1][z + 0] + mesh[x + 2][z + 0] +
				mesh[x + 0][z + 1] + mesh[x + 1][z + 1]*2 + mesh[x + 2][z + 1] +
				mesh[x + 0][z + 2] + mesh[x + 1][z + 2] + mesh[x + 2][z + 2]
				) / 10;*/
		for (int i = 0; i < size; i++)
		{
			ret[i][size - 1] = (mesh[i][size - 1] + mesh[i + 1][size - 1] + mesh[i][size] + mesh[i + 1][size]) / 4;
			ret[size - 1][i] = (mesh[size - 1][i] + mesh[size - 1][i + 1] + mesh[size][i] + mesh[size][i + 1]) / 4;
		}
		return normalize(ret);
	}
	static int step;
	private static double[][] divideMesh(double[][] mesh, double maxHeight, double roughness, int size, int step)
	{
		if (step == 0)
			return mesh;
		
		double dHeight = maxHeight * roughness;
		TerrGen.step = step;

		// diamond step for all mid points at this level
		for (int z = step; z < size + 1; z += step * 2)
		for (int x = step; x < size + 1; x += step * 2)
			mesh[z][x] = (mesh[ccc(z-step,size)][ccc(x-step,size)] + mesh[ccc(z-step,size)][ccc(x+step,size)] + mesh[ccc(z+step,size)][ccc(x-step,size)] +
				mesh[ccc(z+step,size)][ccc(x+step,size)]) / 4 + S.rand() * 2 * dHeight - dHeight;
		// square step for all points surrounding diamonds
		for (int z = step; z < size + 1; z += step * 2)
		{
			mesh[z][0] = getSquare(mesh, z, 0, dHeight, size, step);  // left column
			for (int x = step; x < size + 1; x += step * 2)
			{
				mesh[ccc(z - step, size)][x] = getSquare(mesh, ccc(z - step, size), x, dHeight, size, step);
				mesh[z][ccc(x + step, size)] = getSquare(mesh, z, ccc(x + step, size), dHeight, size, step);
			}
		}
		for (int x = step; x < size + 1; x += step * 2)
			mesh[size][x] = getSquare(mesh, size, x, dHeight, size, step);  // front row

		return divideMesh(mesh, maxHeight * roughness, roughness, size, step / 2);
	}
	private static double getSquare(double[][] mesh, int z, int x, double dHeight, int size, int step)
		{return (mesh[ccc(z-step,size)][x]+mesh[ccc(z+step,size)][x]+mesh[z][ccc(x-step,size)]+mesh[z][ccc(x+step,size)]) / 4 + Math.random() * 2 * dHeight - dHeight;}
	private static int ccc(int index, int size) {return index < 0? index + step * 2 : (index > size? index - step * 2 : index);}
	
	public static double[][] heightmapFromImage(BufferedImage src)
	{
		double[][] ret = new double[src.getWidth()][src.getHeight()];
		for (int x = 0; x < ret.length; x++)
		for (int y = 0; y < ret[0].length; y++)
		{
			int rgb = src.getRGB(x, y);
			ret[x][y] = 0.299 * (rgb >>> 16 & 0xff) + 0.587 * (rgb >>> 8 & 0xff) + 0.114 * (rgb & 0xff) + 0.00001;
		}
		return ret;
	}
	
	private static double[][] normalize(double[][] arr)
	{
		double min = Double.MAX_VALUE;
		for (int x = 0; x < arr.length; x++)
		for (int z = 0; z < arr[x].length; z++)
		if (arr[x][z] < min)
			min = arr[x][z];
		double max = Double.MIN_VALUE;
		for (int x = 0; x < arr.length; x++)
		for (int z = 0; z < arr[x].length; z++)
		if (arr[x][z] > max)
			max = arr[x][z];
		double heightRecip = 1 / (max - min);
		for (int x = 0; x < arr.length; x++)
		for (int z = 0; z < arr[x].length; z++)
		{
			arr[x][z] -= min;
			arr[x][z] *= heightRecip;
		}
		return arr;
	}
	
	private static double[][] multiply(double[][] arr, double factor)
	{
		for (int x = 0; x < arr.length; x++)
		for (int z = 0; z < arr[x].length; z++)
			arr[x][z] *= factor;
		return arr;
	}
	
	private static int[][] castAsInt(double[][] arr)
	{
		int[][] ret = new int[arr.length][arr[0].length];
		for (int x = 0; x < arr.length; x++)
		for (int z = 0; z < arr[0].length; z++)
			ret[x][z] = (int)arr[x][z];
		return ret;
	}
	
	private static int select(int choice)
	{
		if (choice > 14 && choice <= 29)
			return 0xd0 + choice - 14;
		if (choice > 29 && choice <= 44)
			return 0x40 + choice - 29;
		switch (choice)
		{
			case 0: return 160;
			case 1: return 0;
			case 2: return 2;
			case 3: return 100;
			case 4: return 16;
			case 5: return 18;
			case 6: return 19;
			case 7: return 96;
			case 8: return 98;
			case 9: return 102;
			case 10: return 77;
			case 11: return 105;
			case 12: return 17;
			case 13: return 97;
			case 14: return 37;
			default: return -1;
		}
	}
	
//////////////////////////////////////////////////////////////// other stuff ////////////////////////////////////////////////////////////////

	private static int[][][] dwarfFortress()
	{
		//ASL = above sea level
		//each unit is 10m, so the highest peak is 3km ASL and the lowest trench is -1km ASL and the mountain-line/tree-line is 2km ASL
		double[][] elevd = multiply(plasmaFractalHeightmap(256, 0.45, null, 128), 500);
		for (int x = 0; x < 256; x++)
		for (int z = 0; z < 256; z++)
			if (elevd[x][z] < 200) elevd[x][z] /= 2;
			else elevd[x][z] -= 100;
		int[][] elev = castAsInt(elevd);
		elevd = null;
		
		double[][] temperSeed = new double[257][257];
		for (int x = 0; x < 257; x += 16)
		for (int z = 0; z < 257; z += 16)
			temperSeed[x][z] = z / 256.0 * 0.72 + S.rand() * 0.28;
		double[][] tempd = plasmaFractalHeightmap(256, 0, temperSeed, 16);
		temperSeed = null;
		for (int x = 0; x < 256; x++)
		for (int z = 0; z < 256; z++)
			tempd[x][z] += (200.0 - elev[x][z]) / 400 * 0.35; //it's 6.5C lower per kilometer going up, so I'm not sure what this formula works out as yet
		//double[][] rainfall = plasmaFractalHeightmap(...);
		//double[][] drainage = plasmaFractalHeightmap(...);
		int[][][] ret = Arrayu.fill(new int[elev.length][64][elev.length], -1);
		for (int x = 0; x < ret.length; x++)
		for (int z = 0; z < ret[0][0].length; z++)
		{
			for (int y = 0; y <= elev[x][z] / 10 && y < 64; y++)
				ret[x][y][z] = selectTemp(tempd[x][z]) * 0x100 + selectDF(elev[x][z]);
			for (int y = 0; y <= 100 / 10; y++)
			if (ret[x][y][z] == -1)
				ret[x][y][z] = 0x1f7;//123
		}
		return ret;
	}
	private static int selectDF(int elev)
	{
		if (elev < 100) return 0xf7;
		if (elev < 300) return '"';
		if (elev < 333) return 0x7f;
		if (elev < 366) return 0x1e;
		                return '^';
	}
	private static int selectTemp(double d)
	{
		if (d < 1.4 / 6) return 0xb;
		if (d < 2.2 / 6) return 0x9;
		if (d < 3.0 / 6) return 0xa;
		if (d < 3.8 / 6) return 0xe;
		if (d < 4.6 / 6) return 0xc;
		                 return 0x4;
	}

	private static double[][] faultFractalHeightmap(int size)
	{
		double[][] hmap = Arrayu.fill(new double[size][size], 10);
		for (int i = 0; i < 1000; i++)
		{
			double m = Math.tan(S.rand(0, Math.PI));
			double px = S.rand(0, 100);
			double py = S.rand(0, 100);
			double diff = S.rand(-0.5, 0.5);
			for (int x = 0; x < size; x++)
			for (int y = 0; y < size; y++)
			if (px - x + (py - y) * m < 0)
				hmap[x][y] += diff;
			else
				hmap[x][y] -= diff;
		}
		for (int x = 0; x < size-1; x++)
		for (int y = 0; y < size-1; y++)
			hmap[x][y] = (hmap[x][y] + hmap[x + 1][y] + hmap[x][y + 1] + hmap[x + 1][y + 1]) / 4;
		return hmap;
	}
	
	private static double[][] fbmFractalHeightmap(int size)
	{
		double seed = S.rand();
		double[][] hmap = Arrayu.fill(new double[size][size], 7);
		for (int x = 0; x < size; x++)
		for (int y = 0; y < size; y++)
		for (int i = 0; i < 5; i++)
			hmap[x][y] += Noise.perlin(x * 0.05 * S.intpow(2, i), seed, y * 0.05 * S.intpow(2, i)) * 4 / S.intpow(2, i);
		for (int x = 0; x < size-1; x++)
		for (int y = 0; y < size-1; y++)
			hmap[x][y] = (hmap[x][y] + hmap[x + 1][y] + hmap[x][y + 1] + hmap[x + 1][y + 1]) / 4;
		return hmap;
	}
	
	private static double[][] reesheeHeightmap(int size)
	{
		double amplitude = 0.4;
		double[][] hmap = Arrayu.fill(new double[size][size], 5);
		for (int i = 0; i < 300; i++)
		{
			int x = S.rand(size), y = S.rand(8, 15), z = S.rand(size);
			for (int j = 1, k = y - (int)hmap[x][z]; k > 0; j += 2, k--)
			for (int h = 0; h < j - 1; h++)
			{
				if (x-j/2+h >= 0 && x-j/2+h < size && z+j/2 >= 0 && z+j/2 < size) hmap[x-j/2+h][z+j/2] += k * amplitude;
				if (x-j/2+h+1 >= 0 && x-j/2+h+1 < size && z-j/2 >= 0 && z-j/2 < size) hmap[x-j/2+h+1][z-j/2] += k * amplitude;
				if (x+j/2 >= 0 && x+j/2 < size && z-j/2+h+1 >= 0 && z-j/2+h+1 < size) hmap[x+j/2][z-j/2+h+1] += k * amplitude;
				if (x-j/2 >= 0 && x-j/2 < size && z-j/2+h >= 0 && z-j/2+h < size) hmap[x-j/2][z-j/2+h] += k * amplitude;
			}
			hmap[x][z] += (y - hmap[x][z]) * amplitude;
		}
		return hmap;
	}
	
	public static int[][][] gridFromHeightmap(double[][] hmap, double amplitude)
	{
		int[][][] ret = Arrayu.fill(new int[hmap.length][64][hmap[0].length], -1);
		//int[][][] ret = Arrayu.fill(new int[128][64][128], -1);

		for (int x = 0; x < ret.length; x++)
		for (int z = 0; z < ret[0][0].length; z++)
		{
			for (int y = 0; y <= hmap[x][z] * amplitude && y < 64; y++)
				ret[x][y][z] = select(y);
			for (int y = 0; y <= 11; y++)
			if (ret[x][y][z] == -1)
				ret[x][y][z] = 123;
		}
		return ret;
	}
}

class Noise
{
	public static double perlin(double x, double y, double z)
	{
		int xr = (int)Math.floor(x) & 255,                 // FIND UNIT CUBE THAT
		    yr = (int)Math.floor(y) & 255,                 // CONTAINS POINT.
		    zr = (int)Math.floor(z) & 255;
		x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
		y -= Math.floor(y);                                // OF POINT IN CUBE.
		z -= Math.floor(z);
		double u = fade(x),                                // COMPUTE FADE CURVES
		       v = fade(y),                                // FOR EACH OF X,Y,Z.
		       w = fade(z);
		int a = p[xr    ] + yr, aa = p[a] + zr, ab = p[a + 1] + zr,      // HASH COORDINATES OF
		    b = p[xr + 1] + yr, ba = p[b] + zr, bb = p[b + 1] + zr;      // THE 8 CUBE CORNERS,

		return lerp(w, lerp(v, lerp(u, grad(p[aa    ], x    , y    , z    ),  // AND ADD
		                               grad(p[ba    ], x - 1, y    , z    )), // BLENDED
		                       lerp(u, grad(p[ab    ], x    , y - 1, z    ),  // RESULTS
		                               grad(p[bb    ], x - 1, y - 1, z    ))),// FROM  8
		               lerp(v, lerp(u, grad(p[aa + 1], x    , y    , z - 1),  // CORNERS
		                               grad(p[ba + 1], x - 1, y    , z - 1)), // OF CUBE
		                       lerp(u, grad(p[ab + 1], x    , y - 1, z - 1),
		                               grad(p[bb + 1], x - 1, y - 1, z - 1))));
	}

	private static double fade(double t) {return t * t * t * (t * (t * 6 - 15) + 10);}
	private static double lerp(double t, double a, double b) {return a + t * (b - a);}
	private static double grad(int hash, double x, double y, double z)
	{
		//int h = hash & 15;                         // CONVERT LO 4 BITS OF HASH CODE
		int h = (hash >> 3) & 15;                         // CONVERT LO 4 BITS OF HASH CODE
		double u = h < 8? x : y,                   // INTO 12 GRADIENT DIRECTIONS.
		       v = h < 4? y : (h == 12 || h == 14? x : z);
		return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
	}
	private static final int[] p = new int[512], permutation = {151,160,137,91,90,15,
		131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
		190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
		88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
		77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
		102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
		135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
		5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
		223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
		129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
		251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
		49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
		138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180};
	static {for (int i = 0; i < 256; i++) p[256 + i] = p[i] = permutation[i];}
}
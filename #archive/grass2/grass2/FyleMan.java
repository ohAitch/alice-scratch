package grass2;

import org.lwjgl.*;
import lombok.*;

import java.io.IOException;
import java.io.DataInputStream;
import java.io.EOFException;
import java.io.FileNotFoundException;
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

public /*static*/ class FyleMan
{
	public static BufferedImage getImage(String path)
	{
		BufferedImage ret = null;
		try {ret = ImageIO.read(M.class.getResource(path));}
		catch (IllegalArgumentException e) {M.catchEx(e, path + " not found or not readable or SOMETHING");}
		catch (IOException e) {M.catchEx(e, path + " not found or not readable or SOMETHING");}
		return ret;
	}
	
		/**@return success*/
	public static boolean writeMapToFile(String path, Grid map)
	{
		DataOutputStream out = null;
		try {out = new DataOutputStream(new FileOutputStream("grass2/" + path));}
		catch (FileNotFoundException e) {return false;}
		catch (SecurityException e) {return false;}
		try
		{
			out.writeInt(map.X);
			out.writeInt(map.Y);
			out.writeInt(map.Z);
			for (int x = 0; x < map.X; x++)
			for (int y = 0; y < map.Y; y++)
			for (int z = 0; z < map.Z; z++)
				out.writeInt(map.getTile(x, y, z));
		}
		catch (IOException e) {return false;}
		return true;
	}
	
		/**@return null if unsuccessful*/
	public static int[][][] readMapFromResource(String resource)
	{
		DataInputStream dat = new DataInputStream(M.class.getResourceAsStream(resource));
		int[][][] ret = null;
		try
		{
			int X = dat.readInt();
			int Y = dat.readInt();
			int Z = dat.readInt();
			ret = Arrayu.fill(new int[X][Y][Z], -1);
			for (int x = 0; x < X; x++)
			for (int y = 0; y < Y; y++)
			for (int z = 0; z < Z; z++)
				ret[x][y][z] = dat.readInt();
		}
		catch (EOFException e) {}
		catch (IOException e) {return null;}

		return ret;
	}
}
package grass2;

import org.lwjgl.*;
import lombok.*;

public class Playa
{
	private static final double PIx2 = Math.PI * 2;
	private static final double PIo2 = Math.PI / 2;
	private static final double sqrt2o2 = Math.sqrt(2) / 2;
	private static final double cycLength = Logic.NANOS_PER_FRAME / 1000000000.0;
	
	public static final double tiny = 100e-9;
	public static final double RAISED_AMOUNT = 1.625; //note: player height = 1.7m
	private static final double runAccel = 50; //m/s^2
	private static final double g = -30;//-9.80665;
	
	public final double reach = 5;
	
	public float angleY, angleXZ = (float) (Math.PI * 6 / 5);
	public final Point3d pos = new Point3d(21.5, 32, 26.5);
	private Vector3d v = new Vector3d();
	private void v(double x, double y, double z) {v.x  = x; v.y  = y; v.z  = z;}
	public void a(double x, double y, double z) {v.x += x; v.y += y; v.z += z;}

	private @Getter boolean inAir;
	public void setInAir() {inAir = M.compareD(pos.y, (int)pos.y + tiny) != 0 || Logic.theGrid.getTile((int)pos.x, (int)pos.y - 1, (int)pos.z) == -1;}

	private static final double yFrict = 1 - (g / -140) * cycLength; //max y-velocity under acceleration of gravity = -140
	private static final double xzFrict = 1 - (runAccel / 4.0) * cycLength; //max running speed = 4.0 m/s = about 9 mph
	public void doFriction()
	{
		//currently crude; improve this. Ideas:
		//(1) different friction in ground vs air + different movement speeds, so that xz movement is a bit slower in air than ground
		//(2) friction actually modeled realistically.
		v.x *= xzFrict;
		v.y *= yFrict;
		v.z *= xzFrict;
	}
	
	/*static final int granularity = 8;
	static final int gravygrid = 128 / granularity;
	static Vector3f[][][] gravy = new Vector3f[gravygrid][gravygrid][gravygrid];
	static {
		for (int x = 0; x < gravygrid; x++)
		for (int y = 0; y < gravygrid; y++)
		for (int z = 0; z < gravygrid; z++)
			gravy[x][y][z] = new Vector3f();
		for (int x = 0; x < gravygrid; x++)
		for (int y = 0; y < gravygrid; y++)
		for (int z = 0; z < gravygrid; z++)
		{
			int boxCount = 0;
			for (int xm = 0; xm < granularity; xm++)
			for (int ym = 0; ym < granularity; ym++)
			for (int zm = 0; zm < granularity; zm++)
			if (Logic.theGrid.getTile(x * granularity + xm, y * granularity + ym, z * granularity + zm) != -1)
				boxCount++;
			if (boxCount == 0) continue;
			for (int xm = 0; xm < gravygrid; xm++)
			for (int ym = 0; ym < gravygrid; ym++)
			for (int zm = 0; zm < gravygrid; zm++)
			{
				int dx = xm - x;
				int dy = ym - y;
				int dz = zm - z;
				double sq = dx * dx + dy * dy + dz * dz;
				double factor = boxCount / (sq == 0? 0.3 : sq);
				double sqrt = Math.sqrt((sq == 0? 0.3 : sq));
				gravy[xm][ym][zm].x -= dx / sqrt * factor * 0.8;
				gravy[xm][ym][zm].y -= dy / sqrt * factor * 0.8;
				gravy[xm][ym][zm].z -= dz / sqrt * factor * 0.8;
			}
		}
	}*/

	public void doMovement()
	{
		v.y += g * cycLength; //gravity
		/*try
		{
		v.x += gravy[(int)pos.x / granularity][(int)pos.y / granularity][(int)pos.z / granularity].x * cycLength / 10;
		v.y += gravy[(int)pos.x / granularity][(int)pos.y / granularity][(int)pos.z / granularity].y * cycLength / 100;
		v.z += gravy[(int)pos.x / granularity][(int)pos.y / granularity][(int)pos.z / granularity].z * cycLength / 10;
		}
		catch (Exception e) {}*/
		move(new Point3d(pos), v.x * cycLength, v.y * cycLength, v.z * cycLength);
	}
	
	private void move(Point3d p3d, double x, double y, double z)
	{
//for me, all edges and corners exist in the planes of x,y,z =...-1.5, -0.5, 0.5, 1.5, 2.5..., if you get what that means, but I get the idea:
//whenever you move an object somewhere, don't move it to one of those planes.
		Point3d origDest = new Point3d(p3d.x + x, p3d.y + y, p3d.z + z);
		int rx = (int)p3d.x;
		int ry = (int)p3d.y;
		int rz = (int)p3d.z;

		if (x != 0 && rx == (int)origDest.x) {p3d.x += x; x = 0;}
		if (y != 0 && ry == (int)origDest.y) {p3d.y += y; y = 0;}
		if (z != 0 && rz == (int)origDest.z) {p3d.z += z; z = 0;}
		if (x == 0 && y == 0 && z == 0)
			{pos.set(p3d); return;}

		Point3d xi = null, yi = null, zi = null;

		double[] d = new double[3];
		d[0] = d[1] = d[2] = Double.POSITIVE_INFINITY;

		if (x != 0)
		{
			xi = new Point3d();
			xi.x = rx + (x > 0? 1 - tiny : tiny);
			double s = (xi.x - p3d.x) / x;
			xi.y = p3d.y + s * y;
			xi.z = p3d.z + s * z;
			d[0] = (p3d.x - xi.x) * (p3d.x - xi.x) + (p3d.y - xi.y) * (p3d.y - xi.y) + (p3d.z - xi.z) * (p3d.z - xi.z);
		}
		if (y != 0)
		{
			yi = new Point3d();
			yi.y = ry + (y > 0? 1 - tiny : tiny);
			double s = (yi.y - p3d.y) / y;
			yi.x = p3d.x + s * x;
			yi.z = p3d.z + s * z;
			d[1] = (p3d.x - yi.x) * (p3d.x - yi.x) + (p3d.y - yi.y) * (p3d.y - yi.y) + (p3d.z - yi.z) * (p3d.z - yi.z);
		}
		if (z != 0)
		{
			zi = new Point3d();
			zi.z = rz + (z > 0? 1 - tiny : tiny);
			double s = (zi.z - p3d.z) / z;
			zi.x = p3d.x + s * x;
			zi.y = p3d.y + s * y;
			d[2] = (p3d.x - zi.x) * (p3d.x - zi.x) + (p3d.y - zi.y) * (p3d.y - zi.y) + (p3d.z - zi.z) * (p3d.z - zi.z);
		}

		double least = d[0] < d[1]? (d[0] < d[2]? d[0] : d[2]) : (d[1] < d[2]? d[1] : d[2]);

		Point3d stopAt = null;
		Tuple3i dir = new Tuple3i();
		if (d[0] == least) {stopAt = xi; dir.x = x > 0? 1 : -1;}
		else if (d[1] == least) {stopAt = yi; dir.y = y > 0? 1 : -1;}
		else if (d[2] == least) {stopAt = zi; dir.z = z > 0? 1 : -1;}
		
		if (Logic.theGrid.getTile(rx + dir.x, ry + dir.y, rz + dir.z) == -1)
		{
			p3d.x = stopAt.x + dir.x * tiny * 2.5;
			p3d.y = stopAt.y + dir.y * tiny * 2.5;
			p3d.z = stopAt.z + dir.z * tiny * 2.5;
			move(p3d, origDest.x - p3d.x, origDest.y - p3d.y, origDest.z - p3d.z);
		}
		else
			move(stopAt, dir.x == 0? origDest.x - stopAt.x : (v.x = 0), dir.y == 0? origDest.y - stopAt.y : (v.y = 0), dir.z == 0? origDest.z - stopAt.z : (v.z = 0));
	}
}

/*points la and lb
*n* = (a, b, c)
plane equation: a*x + b*y + c*z + d == 0
and then t = (-d - a*xa - b*ya - c*za) / (a * (xb - xa) + b * (yb - ya) + c * (zb - za))

case *n* = (0, 1, 0)
plane equation: y == -d
and then t = (tty - ya) / (yb - ya)
so tt = la + ((tty - lay) / (lby - lay)) * (lb - la)

double s = (tty - v3dM.y) / y;
ttx = v3dM.x + s * x;
tty = -d;
ttz = v3dM.z + s * z;*/
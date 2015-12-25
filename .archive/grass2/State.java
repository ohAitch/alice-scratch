package grass2;

import org.lwjgl.*;

public class State
{
	private static final double PIx2 = Math.PI * 2;
	private static final double PIo2 = Math.PI / 2;
	private static final double sqrt2o2 = Math.sqrt(2) / 2;
	private static final double step = Logic.NANOS_PER_FRAME / 1000000000.0; //time per step
	
	private static final double tiny = 100e-9;
	private static final double RAISED_AMOUNT = 1.625; //note: player height = 1.7m
	//private static final double runAccel = 50; //m/s^2
	private static final double g = -30;//-9.80665;
	
	/*public float angleY, angleXZ = (float) (Math.PI * 6 / 5);
	final Point3d pos = new Point3d(8.5, 20.2, 8.5);
	final Vector3d v = new Vector3d();
	final Vector3d a = new Vector3d();*/
	
	public float angleY, angleXZ = (float) (Math.PI * 6 / 5);
	public final Point3d pos = new Point3d(8.5, 20.2, 8.5);
	Vector3d v = new Vector3d();
	public void a(double x, double y, double z) {v.x += x; v.y += y; v.z += z;}
	
	//void acc(double x, double y, double z) {a.x += x; a.y += y; a.z += z;}
	
	public void doMovement()
	{
		MovementResult res = Logic.theGrid.move(pos, (v.x /*+ a.x / 2*/) * step, (v.y /*+ a.y / 2*/) * step, (v.z /*+ a.z / 2*/) * step);
		pos.set(res.dest);
		if (res.collisionDir.x != 0) v.x = 0;
		if (res.collisionDir.y != 0) v.y = 0;
		if (res.collisionDir.z != 0) v.z = 0;
		/*v.x += a.x * step; v.y += a.y * step; v.z += a.z * step;
		a.x = 0; a.y = 0; a.y = 0;
		a.y += g; //gravity, yay*/
		v.y += g * step;
	}
	
	/*private static final double yFrict = 1 - (g / -140) * stepTime; //max y-velocity under acceleration of gravity = -140
	private static final double xzFrict = 1 - (runAccel / 4.0) * stepTime; //max running speed = 4.0 m/s = about 9 mph
	public void doFriction()
	{
		//currently crude; improve this. Ideas:
		//(1) different friction in ground vs air + different movement speeds, so that xz movement is a bit slower in air than ground
		//(2) friction actually modeled realistically.
		v.x *= xzFrict;
		v.y *= yFrict;
		v.z *= xzFrict;
	}*/
}

class MovementResult
{
	public final Point3d dest;
	public final Tuple3i collisionDir;
	public MovementResult(double x, double y, double z, int modX, int modY, int modZ)
		{this(new Point3d(x, y, z), new Tuple3i(modX, modY, modZ));}
	public MovementResult(Point3d dest, int modX, int modY, int modZ)
		{this(dest, new Tuple3i(modX, modY, modZ));}
	public MovementResult(double x, double y, double z, Tuple3i collisionDir)
		{this(new Point3d(x, y, z), collisionDir);}
	public MovementResult(Point3d dest, Tuple3i collisionDir)
		{this.dest = dest; this.collisionDir = collisionDir;}
}
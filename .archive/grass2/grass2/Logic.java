package grass2;

import org.lwjgl.*;
import lombok.*;

import static java.lang.Math.sin;
import static java.lang.Math.cos;

public class Logic implements Runnable
{
	public static void go() {if (state == 0) {state = 1; new Thread(new Logic(), "Thread-Logic").start();} if (state == 2) state = 1;}
	public static void pause() {if (state == 1) state = 2;}
	public static void end() {if (state == 0) go(); if (state == 1 || state == 2) state = 3;}

	public static final long NANOS_PER_FRAME = 10000000L;
	private static int state = 0; //0 = not started, 1 = running, 2 = paused, 3 = quitting, 4 = ended
	
	public void run()
	{
		long nanoBucket = 0;
		long lastTime = S.nTime();
		while (state != 3)
		{
			if (nanoBucket >= NANOS_PER_FRAME)
			{
				nanoBucket -= NANOS_PER_FRAME;
				logic();
			}
			else
				S.sleep(2);

			if (state == 1)
				nanoBucket += S.nTime() - lastTime;
			lastTime = S.nTime();
		}
		state = S.getRandomNumber();
	}

//////////////////////////////////////////////////////////////// logic ////////////////////////////////////////////////////////////////

	private static final double PIx2 = Math.PI * 2;
	private static final double PIo2 = Math.PI / 2;
	private static final float sqrt2o2 = (float)Math.sqrt(2) / 2;

	private static final double eyeRadi = 0.2;
	
	private @Getter static int tileToPlace = 100;
	private static boolean cursorTrapped = false;
	private @Getter static boolean fastMode = false;
	
	public static Point3i wireframe = new Point3i(-1, -1, -1);
	//public static Grid theGrid = new Grid(FyleMan.analysePNGMAP("res/q.png"));
	//public static Grid theGrid = new Grid(TerrGen.gridFromHeightmap(TerrGen.heightmapFromImage(FyleMan.getImage("res/q.png")));
	public static Grid theGrid = new Grid(TerrGen.createMapOutOfThePrimalVoidOfImagination());
	private static Playa me = new Playa();
	
	public static Position getPlayerPosition()
	{
		float x = (float)me.pos.x,
			y = (float)me.pos.y + (float)me.RAISED_AMOUNT,
			z = (float)me.pos.z;
		if (me.angleY == PIo2)
			y -= eyeRadi;
		else if (me.angleY == -PIo2)
			y += eyeRadi;
		else
		{
			x += sin(me.angleXZ) * cos(me.angleY) * eyeRadi;
			y -= sin(me.angleY) * eyeRadi;
			z += cos(me.angleXZ) * cos(me.angleY) * eyeRadi;
		}
		return new Position(me.angleY, me.angleXZ, x, y, z);
	}
	
	private static void logic()
	{
		KeyIn.poll();
		Mice.poll();
		
		if (KeyIn.down("ESCAPE")) System.exit(0);
		if (KeyIn.down("CONTROL") && KeyIn.once("S")) FyleMan.writeMapToFile("dat/level.dat", theGrid);
		if (KeyIn.down("CONTROL") && KeyIn.once("L")) theGrid = new Grid(FyleMan.readMapFromResource("dat/level.dat"));
		if (KeyIn.down("CONTROL") && KeyIn.once("G")) theGrid = new Grid(TerrGen.createMapOutOfThePrimalVoidOfImagination());
		if (KeyIn.once("H")) fastMode = !fastMode;
		if (KeyIn.once("P")) S.plno("pos:", me.pos.x, me.pos.y, me.pos.z);
		if (KeyIn.once("RETURN")) me = new Playa();
		if ((KeyIn.down("LSHIFT") && KeyIn.once("W")) || KeyIn.once("NUMPAD8")) tileToPlace += 0xf0;
		if ((KeyIn.down("LSHIFT") && KeyIn.once("A")) || KeyIn.once("NUMPAD4")) {tileToPlace += 0xff; if (tileToPlace % 16 == 15) tileToPlace += 0x10;}
		if ((KeyIn.down("LSHIFT") && KeyIn.once("S")) || KeyIn.once("NUMPAD2")) tileToPlace += 0x10;
		if ((KeyIn.down("LSHIFT") && KeyIn.once("D")) || KeyIn.once("NUMPAD6")) {tileToPlace += 0x01; if (tileToPlace % 16 == 0) tileToPlace -= 0x10;}
			
		if (cursorTrapped)
			rotateViewDueToMouse();
		if (KeyIn.once("NUMPAD0") || KeyIn.once("T"))
			M.setCursor(!(cursorTrapped = !cursorTrapped));
		if (cursorTrapped)
			Mice.moveTo(M.width / 2, M.height / 2);
		
		me.doFriction();
		moveWithArrowKeys();
		handleClicking();
		me.doMovement();
	}

	private static void rotateViewDueToMouse()
	{
		int rotY = Mice.y - M.height / 2;
		int rotXZ = M.width / 2 - Mice.x;
		if (rotY != 0)
		{
			double radians = rotY * 0.0025;
			if (me.angleY + radians >= PIo2)
				me.angleY = (float)PIo2;
			else if (me.angleY + radians <= -PIo2)
				me.angleY = (float)-PIo2;
			else
				me.angleY += radians;
		}
		if (rotXZ != 0)
		{
			me.angleXZ += rotXZ * 0.0025;
			if (me.angleXZ >= PIx2)
				me.angleXZ -= PIx2;
			else if (me.angleXZ < 0)
				me.angleXZ += PIx2;
		}
	}

	private static void moveWithArrowKeys()
	{
		int dirFB = 0; //forward-backward
		int dirLR = 0; //left-right
		
		float speed = -0.5f * (fastMode? 10 : 4);
		
		if (KeyIn.down("NUMPAD4")) me.a(0, 1, 0);
		if (KeyIn.down("NUMPAD1")) me.a(0, -1, 0);

		if (KeyIn.down("UP"   ) || (!KeyIn.down("LSHIFT") && KeyIn.down("W"))) dirFB++;
		if (KeyIn.down("RIGHT") || (!KeyIn.down("LSHIFT") && KeyIn.down("D"))) dirLR--;
		if (KeyIn.down("LEFT" ) || (!KeyIn.down("LSHIFT") && KeyIn.down("A"))) dirLR++;
		if (KeyIn.down("DOWN" ) || (!KeyIn.down("LSHIFT") && KeyIn.down("S"))) dirFB--;
		if (dirFB != 0 && dirLR != 0)
		{
			me.a(dirFB * (float)sin(me.angleXZ       ) * speed * sqrt2o2, 0, dirFB * (float)cos(me.angleXZ       ) * speed * sqrt2o2);
			me.a(dirLR * (float)sin(me.angleXZ + PIo2) * speed * sqrt2o2, 0, dirLR * (float)cos(me.angleXZ + PIo2) * speed * sqrt2o2);
		}
		else if (dirFB != 0)
			me.a(dirFB * (float)sin(me.angleXZ       ) * speed, 0, dirFB * (float)cos(me.angleXZ       ) * speed);
		else if (dirLR != 0)
			me.a(dirLR * (float)sin(me.angleXZ + PIo2) * speed, 0, dirLR * (float)cos(me.angleXZ + PIo2) * speed);
		if (KeyIn.down("RSHIFT") || KeyIn.down("SPACE"))
		{
			me.setInAir();
			if (!me.isInAir())
				me.a(0, 8.7 * (fastMode? 7.5 : 2), 0);
		}
	}
	
	private static void handleClicking()
	{
		int[] bi4 = null;
		Point3d eye = new Point3d(me.pos.x, me.pos.y + me.RAISED_AMOUNT, me.pos.z);
		if (me.angleY == (float)PIo2)
			bi4 = findSurface(eye, 0, me.reach, 0);
		else if (me.angleY == -(float)PIo2)
			bi4 = findSurface(eye, 0, -me.reach, 0);
		else
			bi4 = findSurface(eye, -sin(me.angleXZ) * cos(me.angleY) * me.reach, sin(me.angleY) * me.reach, -cos(me.angleXZ) * cos(me.angleY) * me.reach);

		if (bi4[0] != -2)
		{
			wireframe.set(bi4[0], bi4[1], bi4[2]);
			if (Mice.isClick(0))
				theGrid.setTile(bi4[0], bi4[1], bi4[2], -1);
			if (Mice.isClick(1))
				theGrid.setTile(bi4[3], bi4[4], bi4[5], (byte)tileToPlace);
		}
		else
			wireframe.set(-1, -1, -1);
	}

		/**If nothing found, returns new int[]{-2}. Else, returns new int[]{x1, y1, z1, x2, y2, z2}.*/
	private static int[] findSurface(Point3d p3d, double x, double y, double z)
	{
		Point3d origDest = new Point3d(p3d.x + x, p3d.y + y, p3d.z + z);
		int rx = (int)p3d.x;
		int ry = (int)p3d.y;
		int rz = (int)p3d.z;

		if (x != 0 && rx == (int)origDest.x) {p3d.x += x; x = 0;}
		if (y != 0 && ry == (int)origDest.y) {p3d.y += y; y = 0;}
		if (z != 0 && rz == (int)origDest.z) {p3d.z += z; z = 0;}
		if (x == 0 && y == 0 && z == 0)
			return new int[]{-2};

		Point3d xi = null, yi = null, zi = null;

		double[] d = new double[3];
		d[0] = d[1] = d[2] = Double.POSITIVE_INFINITY;

		if (x != 0)
		{
			xi = new Point3d();
			xi.x = rx + (x > 0? 1 - Playa.tiny : Playa.tiny);
			double s = (xi.x - p3d.x) / x;
			xi.y = p3d.y + s * y;
			xi.z = p3d.z + s * z;
			d[0] = (p3d.x - xi.x) * (p3d.x - xi.x) + (p3d.y - xi.y) * (p3d.y - xi.y) + (p3d.z - xi.z) * (p3d.z - xi.z);
		}
		if (y != 0)
		{
			yi = new Point3d();
			yi.y = ry + (y > 0? 1 - Playa.tiny : Playa.tiny);
			double s = (yi.y - p3d.y) / y;
			yi.x = p3d.x + s * x;
			yi.z = p3d.z + s * z;
			d[1] = (p3d.x - yi.x) * (p3d.x - yi.x) + (p3d.y - yi.y) * (p3d.y - yi.y) + (p3d.z - yi.z) * (p3d.z - yi.z);
		}
		if (z != 0)
		{
			zi = new Point3d();
			zi.z = rz + (z > 0? 1 - Playa.tiny : Playa.tiny);
			double s = (zi.z - p3d.z) / z;
			zi.x = p3d.x + s * x;
			zi.y = p3d.y + s * y;
			d[2] = (p3d.x - zi.x) * (p3d.x - zi.x) + (p3d.y - zi.y) * (p3d.y - zi.y) + (p3d.z - zi.z) * (p3d.z - zi.z);
		}

		double least = d[0] < d[1]? (d[0] < d[2]? d[0] : d[2]) : (d[1] < d[2]? d[1] : d[2]);

		Point3d stopAt = null;
		Point3i dir = new Point3i();
		if (d[0] == least) {stopAt = xi; dir.x = x > 0? 1 : -1;}
		if (d[1] == least) {stopAt = yi; dir.y = y > 0? 1 : -1;}
		if (d[2] == least) {stopAt = zi; dir.z = z > 0? 1 : -1;}

		if (theGrid.getTile(rx + dir.x, ry + dir.y, rz + dir.z) == -1)
		{
			p3d.x = stopAt.x + dir.x * Playa.tiny * 2.5;
			p3d.y = stopAt.y + dir.y * Playa.tiny * 2.5;
			p3d.z = stopAt.z + dir.z * Playa.tiny * 2.5;
			return findSurface(p3d, origDest.x - p3d.x, origDest.y - p3d.y, origDest.z - p3d.z);
		}
		else
			return new int[]{
				(int)stopAt.x + dir.x,
				(int)stopAt.y + dir.y,
				(int)stopAt.z + dir.z,
				(int)stopAt.x,
				(int)stopAt.y,
				(int)stopAt.z,
			};
	}
}

class Position
{
	public final float angleY, angleXZ, x, y, z;
	public Position(float aY, float aXZ, float xpos, float ypos, float zpos)
		{angleY = aY; angleXZ = aXZ; x = xpos; y = ypos; z = zpos;}
}
package grass2;

import org.lwjgl.*;
import lombok.*;

public class Tuple {private Tuple() {}}

class Tuple3d
{
	public double x, y, z;
	public Tuple3d(double x, double y, double z) {this.x = x; this.y = y; this.z = z;}
	public Tuple3d(Tuple3d toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public Tuple3d() {}
	public void set(Tuple3d toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public void negate() {x = -x; y = -y; z = -z;}
	public void mult(double factor) {x *= factor; y *= factor; z *= factor;}
}
class Point3d extends Tuple3d
{
	public Point3d(double x, double y, double z) {super(x, y, z);}
	public Point3d(Tuple3d toCopy) {super(toCopy);}
	public Point3d() {}
}
class Vector3d extends Tuple3d
{
	public Vector3d(double x, double y, double z) {super(x, y, z);}
	public Vector3d(Tuple3d toCopy) {super(toCopy);}
	public Vector3d() {}
}


class Tuple3f
{
	public float x, y, z;
	public Tuple3f(float x, float y, float z) {this.x = x; this.y = y; this.z = z;}
	public Tuple3f(Tuple3f toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public Tuple3f() {}
	public void set(Tuple3f toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public void negate() {x = -x; y = -y; z = -z;}
	public void mult(float factor) {x *= factor; y *= factor; z *= factor;}
}
class Vertex extends Tuple3f
{
	public Vertex(float x, float y, float z) {super(x, y, z);}
	public Vertex(Tuple3f toCopy) {super(toCopy);}
	public Vertex() {}
}
class Vector3f extends Tuple3f
{
	public Vector3f(float x, float y, float z) {super(x, y, z);}
	public Vector3f(Tuple3f toCopy) {super(toCopy);}
	public Vector3f() {}
}


class Color
{
	public float a, r, g, b;
	public Color(float a, float r, float g, float b) {this.a = a; this.r = r; this.g = g; this.b = b;}
	public Color(Color toCopy) {a = toCopy.a; r = toCopy.r; g = toCopy.g; b = toCopy.b;}
	public Color() {}
	public void set(Color toCopy) {a = toCopy.a; r = toCopy.r; g = toCopy.g; b = toCopy.b;}
	public Color withAlpha(float alpha) {return new Color(alpha, r, g, b);}
}


class TexCoord
{
	public float u, v;
	public TexCoord(float u, float v) {this.u = u; this.v = v;}
	public TexCoord(TexCoord toCopy) {u = toCopy.u; v = toCopy.v;}
	public TexCoord() {}
	public void set(TexCoord toCopy) {u = toCopy.u; v = toCopy.v;}
}


class Tuple3i
{
	public int x, y, z;
	public Tuple3i(int x, int y, int z) {this.x = x; this.y = y; this.z = z;}
	public Tuple3i(Tuple3i toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public Tuple3i() {}
	public void set(int x, int y, int z) {this.x = x; this.y = y; this.z = z;}
	public void set(Tuple3i toCopy) {x = toCopy.x; y = toCopy.y; z = toCopy.z;}
	public void negate() {x = -x; y = -y; z = -z;}
}
class Point3i extends Tuple3i
{
	public Point3i(int x, int y, int z) {super(x, y, z);}
	public Point3i(Tuple3i toCopy) {super(toCopy);}
	public Point3i() {}
}
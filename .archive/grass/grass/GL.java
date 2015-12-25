package grass;

import org.lwjgl.opengl.GL11;

public /*static*/ class GL
{
	public static void loadIdentity() {GL11.glLoadIdentity();}
		
	public static void enable(int capability) {GL11.glEnable(capability);}
	public static void disable(int capability) {GL11.glDisable(capability);}
		
	public static void translate(float x, float y, float z) {GL11.glTranslatef(x, y, z);}
	public static void translate(double x, double y, double z) {GL11.glTranslated(x, y, z);}
		
	public static void rotate(float angle, float x, float y, float z) {GL11.glRotatef(angle, x, y, z);}
	//public static void rotate(double angle, double x, double y, double z) {GL11.glRotatef((float)angle, (float)x, (float)y, (float)z);}
		
	public static void color3f(Color3f color)
		{GL11.glColor3f(color.r, color.g, color.b);}
		
	//public static void ()
	//	{}
}
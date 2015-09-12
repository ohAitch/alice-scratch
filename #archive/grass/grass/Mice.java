package grass;

import org.lwjgl.input.Mouse;

/**Mouse Input / Controller Engine - a wrapper for the lwjgl Mouse class that adds functionality, mainly the isClick(...) methods, and removes stuff I don't yet use.*/
public class Mice
{
	private static int BUTTON_COUNT = 16;
		/**read-only*/
	public static int x, y, dWheel;
	private static enum ButtonState {RELEASED, CLICKED, PRESSED} //not down, down for 1st time, down for 2nd time
	private static ButtonState[] buttons = new ButtonState[BUTTON_COUNT]; //polled keyboard state
		{for (int i = 0; i < BUTTON_COUNT; i++) buttons[i] = ButtonState.RELEASED;}
		
	public static void poll()
	{
		Mouse.poll();
		x = Mouse.getX();
		y = Mouse.getY();
		dWheel = Mouse.getDWheel();
		for (int i = 0; i < BUTTON_COUNT; i++)
			if (Mouse.isButtonDown(i))
				if (buttons[i] == ButtonState.RELEASED)
					buttons[i] = ButtonState.CLICKED;
				else
					buttons[i] = ButtonState.PRESSED;
			else
				buttons[i] = ButtonState.RELEASED;
	}

	public static boolean isClick(int button)
		{return buttons[button] == ButtonState.CLICKED;}
	public static boolean isDown(int button)
		{return buttons[button] != ButtonState.RELEASED;}
	public static boolean isInWindow()
		{return Mouse.isInsideWindow();}
	public static void moveTo(int x, int y)
		{Mouse.setCursorPosition(Mice.x = x, Mice.y = y);}
	public static void moveBy(int dx, int dy)
		{Mouse.setCursorPosition(x += dx, y += dy);}
}
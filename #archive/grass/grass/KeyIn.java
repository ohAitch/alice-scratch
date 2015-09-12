package grass;

import org.lwjgl.input.Keyboard;

/**Keyboard Input - a wrapper for the Keyboard class.*/
public class KeyIn
{
	private static final int KEY_COUNT = Keyboard.KEYBOARD_SIZE;
	private static enum KeyState {RELEASED, PRESSED, ONCE} //not down, down for 2nd+ time, down for 1st time
	private static KeyState[] keys = new KeyState[KEY_COUNT]; //polled keyboard state
		{for (int i = 0; i < KEY_COUNT; i++) keys[i] = KeyState.RELEASED;}
	
	public static void poll()
	{
		Keyboard.poll();
		for (int i = 0; i < KEY_COUNT; i++)
			if (Keyboard.isKeyDown(i))
				if (keys[i] == KeyState.RELEASED)
					keys[i] = KeyState.ONCE;
				else
					keys[i] = KeyState.PRESSED;
			else
				keys[i] = KeyState.RELEASED;
	}

	public static boolean down(int keyCode)
		{return keys[keyCode] == KeyState.ONCE || keys[keyCode] == KeyState.PRESSED;}

	public static boolean once(int keyCode)
		{return keys[keyCode] == KeyState.ONCE;}

	public static boolean down(String keyName)
	{
		int i = Keyboard.getKeyIndex(keyName);
		if (i == Keyboard.KEY_NONE)
			throw new IllegalArgumentException();
		return down(i);
	}
		
	public static boolean once(String keyName)
	{
		int i = Keyboard.getKeyIndex(keyName);
		if (i == Keyboard.KEY_NONE)
			throw new IllegalArgumentException();
		return once(i);
	}
}
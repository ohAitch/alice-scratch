package sandy;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

/**Keyboard Input*/
public class KeyIn implements KeyListener
{
	private static final int KEY_COUNT = 256;

	private KeyIn() {}
	public static final KeyIn I = new KeyIn();

	private boolean[] currentKeys = new boolean[KEY_COUNT]; //current state of the keyboard
	private KeyState[] keys = new KeyState[KEY_COUNT]; //polled keyboard state
	{for (int i = 0; i < KEY_COUNT; i++) keys[i] = KeyState.RELEASED;}
	private boolean altDown, controlDown, shiftDown;

	private enum KeyState
	{
		RELEASED, // Not down
		PRESSED,  // Down, but not the first time
		ONCE      // Down for the first time
	}

	public synchronized void keyPressed(KeyEvent ev)
	{
		altDown = ev.isAltDown();
		controlDown = ev.isControlDown();
		shiftDown = ev.isShiftDown();
		int keyCode = ev.getKeyCode();
		if (keyCode >= 0 && keyCode < KEY_COUNT)
			currentKeys[keyCode] = true;
	}

	public synchronized void keyReleased(KeyEvent ev)
	{
		altDown = ev.isAltDown();
		controlDown = ev.isControlDown();
		shiftDown = ev.isShiftDown();
		int keyCode = ev.getKeyCode();
		if (keyCode >= 0 && keyCode < KEY_COUNT)
			currentKeys[keyCode] = false;
	}

	public void keyTyped(KeyEvent ev) {}

	public synchronized void poll()
	{
		for (int i = 0; i < KEY_COUNT; i++)
			if (currentKeys[i])
				if (keys[i] == KeyState.RELEASED)
					keys[i] = KeyState.ONCE;
				else
					keys[i] = KeyState.PRESSED;
			else
				keys[i] = KeyState.RELEASED;
	}

	public boolean keyDown(int keyCode)
		{return keys[keyCode] == KeyState.ONCE || keys[keyCode] == KeyState.PRESSED;}

	public boolean keyDownOnce(int keyCode)
		{return keys[keyCode] == KeyState.ONCE;}

	public boolean isAltDown() {return altDown;}
	public boolean isControlDown() {return controlDown;}
	public boolean isShiftDown() {return shiftDown;}
}
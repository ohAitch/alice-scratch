package sandy;

import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

/**Mouse Input*/
public class MouseIn implements MouseListener, MouseMotionListener
{
	private static final int BUTTON_COUNT = 3;

	private MouseIn() {}
	public static final MouseIn I = new MouseIn();

	private Point mousePos = new Point(0, 0); // Polled position of the mouse cursor
	private Point currentPos = new Point(0, 0); // Current position of the mouse cursor
	private boolean[] state = new boolean[BUTTON_COUNT]; // Current state of mouse buttons
	private MouseState[] poll = new MouseState[BUTTON_COUNT]; // Polled mouse buttons
	{for (int i = 0; i < poll.length; i++) poll[i] = MouseState.RELEASED;}

	private enum MouseState
	{
		RELEASED, // Not down
		PRESSED,  // Down, but not the first time
		ONCE      // Down for the first time
	}

	public synchronized void poll()
	{
		mousePos = new Point(currentPos); // Save the current location
		for (int i = 0; i < BUTTON_COUNT; i++)
			if (state[i])
				if (poll[i] == MouseState.RELEASED)
					poll[i] = MouseState.ONCE;
				else
					poll[i] = MouseState.PRESSED;
			else
				poll[i] = MouseState.RELEASED;
	}

	public Point getPosition()
		{return mousePos;}

	public boolean buttonDownOnce(int button)
		{return poll[button - 1] == MouseState.ONCE;}

	public boolean buttonDown(int button)
		{return poll[button - 1] == MouseState.ONCE || poll[button - 1] == MouseState.PRESSED;}

	public synchronized void mousePressed(MouseEvent ev)  {state[ev.getButton() - 1] = true;}
	public synchronized void mouseReleased(MouseEvent ev) {state[ev.getButton() - 1] = false;}
	public synchronized void mouseEntered(MouseEvent ev)  {mouseMoved(ev);}
	public synchronized void mouseExited(MouseEvent ev)   {mouseMoved(ev);}
	public synchronized void mouseDragged(MouseEvent ev)  {mouseMoved(ev);}
	public synchronized void mouseMoved(MouseEvent ev)    {currentPos = ev.getPoint();}
	public void mouseClicked(MouseEvent ev) {}
}
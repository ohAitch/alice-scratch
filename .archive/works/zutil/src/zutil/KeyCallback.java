package zutil;

import java.util.List;
import java.util.ArrayList;
import clojure.lang.IFn;

public class KeyCallback {

static synchronized public void on_press  (Object key, IFn fn) {ensurePollingThread(); callbacks_on_press  .get(KeySpy.keycode(key)).add(fn);}
static synchronized public void on_release(Object key, IFn fn) {ensurePollingThread(); callbacks_on_release.get(KeySpy.keycode(key)).add(fn);}
static synchronized public void on_tick   (Object key, IFn fn) {ensurePollingThread(); callbacks_on_tick   .get(KeySpy.keycode(key)).add(fn);}
//static public void on_typed ...

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// internal //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

static List<List<IFn>> callbacks_on_press   = new ArrayList<List<IFn>>();
static List<List<IFn>> callbacks_on_release = new ArrayList<List<IFn>>();
static List<List<IFn>> callbacks_on_tick    = new ArrayList<List<IFn>>();
static {
	for (int i = 0; i < KeySpy.KEYBOARD_SIZE; i++) callbacks_on_press  .add(new ArrayList<IFn>());
	for (int i = 0; i < KeySpy.KEYBOARD_SIZE; i++) callbacks_on_release.add(new ArrayList<IFn>());
	for (int i = 0; i < KeySpy.KEYBOARD_SIZE; i++) callbacks_on_tick   .add(new ArrayList<IFn>());
}

static void ensurePollingThread() {
	if (!pollingThreadStarted.get())
		if (!pollingThreadStarted.getAndSet(true))
			new java.util.Timer(true).scheduleAtFixedRate(new java.util.TimerTask(){public void run(){poll();}}, 0, 10);}

static java.util.concurrent.atomic.AtomicBoolean pollingThreadStarted = new java.util.concurrent.atomic.AtomicBoolean();

/** keyStatus[key] = number of ticks key has been down (0 means not-down) | with GetAsyncKeyState impl, may drop keypresses shorter than polling interval*/
static int[] keyStatus = new int[KeySpy.KEYBOARD_SIZE];

static synchronized void poll() {
	for (int i = 0; i < KeySpy.KEYBOARD_SIZE; i++) {
		int v = KeySpy._is_key_down(i)? keyStatus[i] + 1 : 0;
		if (keyStatus[i] == 0 && v != 0) for (IFn fn : callbacks_on_press  .get(i)) fn.invoke();
		if (keyStatus[i] != 0 && v == 0) for (IFn fn : callbacks_on_release.get(i)) fn.invoke();
		if (keyStatus[i] != 0 && v != 0) for (IFn fn : callbacks_on_tick   .get(i)) fn.invoke((Integer)v);
		keyStatus[i] = v;
	}
}

}
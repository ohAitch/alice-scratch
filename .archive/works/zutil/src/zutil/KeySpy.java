package zutil;

public class KeySpy {

static final public int
	VK_LBUTTON   = 0x01,
	VK_RBUTTON   = 0x02,
	VK_CANCEL    = 0x03, // control-break processing
	VK_MBUTTON   = 0x04,
	VK_BACK      = 0x08,
	VK_TAB       = 0x09,
	VK_CLEAR     = 0x0C,
	VK_RETURN    = 0x0D,
	VK_SHIFT     = 0x10,
	VK_CONTROL   = 0x11,
	VK_MENU      = 0x12,
	VK_PAUSE     = 0x13,
	VK_CAPITAL   = 0x14,
	VK_ESCAPE    = 0x1B,
	VK_SPACE     = 0x20,
	VK_PRIOR     = 0x21,
	VK_NEXT      = 0x22,
	VK_END       = 0x23,
	VK_HOME      = 0x24,
	VK_LEFT      = 0x25,
	VK_UP        = 0x26,
	VK_RIGHT     = 0x27,
	VK_DOWN      = 0x28,
	VK_SELECT    = 0x29,
	VK_PRINT     = 0x2A,
	VK_EXECUTE   = 0x2B,
	VK_SNAPSHOT  = 0x2C,
	VK_INSERT    = 0x2D,
	VK_DELETE    = 0x2E,
	VK_HELP      = 0x2F,
// 0-9 A-Z are ASCII values
	VK_NUMPAD0   = 0x60,
	VK_NUMPAD1   = 0x61,
	VK_NUMPAD2   = 0x62,
	VK_NUMPAD3   = 0x63,
	VK_NUMPAD4   = 0x64,
	VK_NUMPAD5   = 0x65,
	VK_NUMPAD6   = 0x66,
	VK_NUMPAD7   = 0x67,
	VK_NUMPAD8   = 0x68,
	VK_NUMPAD9   = 0x69,
	VK_SEPARATOR = 0x6C,
	VK_SUBTRACT  = 0x6D,
	VK_DECIMAL   = 0x6E,
	VK_DIVIDE    = 0x6F,
	VK_F1        = 0x70,
	VK_F2        = 0x71,
	VK_F3        = 0x72,
	VK_F4        = 0x73,
	VK_F5        = 0x74,
	VK_F6        = 0x75,
	VK_F7        = 0x76,
	VK_F8        = 0x77,
	VK_F9        = 0x78,
	VK_F10       = 0x79,
	VK_F11       = 0x7A,
	VK_F12       = 0x7B,
	VK_F13       = 0x7C,
	VK_F14       = 0x7D,
	VK_F15       = 0x7E,
	VK_F16       = 0x7F,
	VK_NUMLOCK   = 0x90,
	VK_SCROLL    = 0x91,
	VK_LSHIFT    = 0xA0,
	VK_RSHIFT    = 0xA1,
	VK_LCONTROL  = 0xA2,
	VK_RCONTROL  = 0xA3,
	VK_LMENU     = 0xA4,
	VK_RMENU     = 0xA5,
	VK_PLAY      = 0xFA,
	VK_ZOOM      = 0xFB;
	
static final public int KEYBOARD_SIZE = VK_ZOOM + 1;

static final public int
	VK_ESC = VK_ESCAPE,
	VK_PAGE_UP = VK_PRIOR,
	VK_PAGE_DOWN = VK_NEXT,
	VK_CAPSLOCK = VK_CAPITAL,
	VK_BACKSPACE = VK_BACK,
	VK_PRINT_SCREEN = VK_SNAPSHOT;

static public boolean   is_key_down  (Object key) {return _is_key_down  (keycode(key));}
static public Character down_key_char(Object key) {return _down_key_char(keycode(key));}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// internal //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

static int keycode(Object v) {
	if (v instanceof Long) return (int)(long)(Long)v;
	if (v instanceof Integer) return (int)(Integer)v;
	Character vv = (Character)v;
	if ('a' <= vv && vv <= 'z') throw new RuntimeException("use [A-Z] not [a-z]");
	return (int)(char)vv;
}

/** 0x8000: is-down | 0x0001: was-down-since-last-call | usage: is_key_down(VK_XYZ) or is_key_down('Q') or is_key_down('3') */
static boolean _is_key_down(int key) {return (User32.GetAsyncKeyState(key) & 0x8001) != 0;}

/** returns (is-key-pressed key) and <the char that key maps to with the current modifier keys> */
static Character _down_key_char(int key) {
	//was found in original; do not know what this code is for
	//	boolean isDownShift = (User32.GetAsyncKeyState(VK_SHIFT) & 0x80) == 0x80;
	//	boolean isDownCapsLock = (User32.GetAsyncKeyState(VK_CAPS)) != 0;
	
	if (!is_key_down(key)) return null;
	
	byte[] keystate = new byte[256];
	User32.GetKeyboardState(keystate);

	com.sun.jna.ptr.IntByReference keyblayoutID = User32.GetKeyboardLayout(0);
	char[] buff = new char[10];
	int len = User32.ToUnicodeEx(key, User32.MapVirtualKeyExW(key, 0 /*MAPVK_VK_TO_VSC*/, keyblayoutID), keystate, buff, buff.length, 0, keyblayoutID);
	
	if (len == -1) throw new RuntimeException("User32.ToUnicodeEx returned -1; we don't know what that means");
	if (len == 0) throw new RuntimeException("no representation for keycode "+key);
	if (len != 1) throw new RuntimeException("I think you're trying to enter extended Unicode; sorry, this isn't supported");
	return buff[0];
}

static public interface IUser32 extends com.sun.jna.Library {
	short GetAsyncKeyState(int key);
	//not currently used: short GetKeyState(int key);
	
	com.sun.jna.ptr.IntByReference GetKeyboardLayout(int dwLayout);
	int MapVirtualKeyExW(int uCode, int nMapType, com.sun.jna.ptr.IntByReference dwhkl);
	
	boolean GetKeyboardState(byte[] lpKeyState);
	
	int ToUnicodeEx(int wVirtKey, int wScanCode, byte[] lpKeyState, char[] pwszBuff, int cchBuff, int wFlags, com.sun.jna.ptr.IntByReference dwhkl);
}
static IUser32 User32 = (IUser32)com.sun.jna.Native.loadLibrary("User32", IUser32.class);

}
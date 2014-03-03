###SingleInstance force
###NoEnv
SetBatchLines -1
ListLines Off
SendMode Input
SetTitleMatchMode 2

// used ⌘: dlq+- ↑→↓← 0-9 ‹Pause›

// todo meh: consider making menukey sticky, like F8
// todo meh: fill out F8
// todo eh: look at https://raw.github.com/polyethene/AutoHotkey-Scripts/master/Hotstrings.ahk
// ≁ ≔≕ ′″‴
// todo: ≡+mouse : add homoiconicity (this is hard), add functions. such as "highlight entire url pointed at" or "go to url pointed at" or something.
// todo: modify ≡+leftmouse behavior to simply copy and paste but also work with leftmouse+≡

// MACRO_DISPATCH (copied from hydrocarboner)
#define PASTE2(a,b) a ## b
#define PASTE2_2(a,b) PASTE2(a,b)
#define ARG_16(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,n,...) n
#define __VA_LEN__(...)   ARG_16(0,##__VA_ARGS__,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
#define MACRO_DISPATCH(fn,...) PASTE2_2(fn,__VA_LEN__(__VA_ARGS__))(__VA_ARGS__)

global explorer := "ahk_class CabinetWClass"
global cmd := "ahk_class ConsoleWindowClass"
global taskbar := "ahk_class Shell_TrayWnd"
#define WinActive_desktop (WinActive("ahk_class WorkerW") or WinActive("ahk_class Progman"))
global spotify := "Spotify ahk_class SpotifyMainWindow"
global vlc := "VLC media player ahk_class QWidget"
global calc := "Calculator ahk_class CalcFrame"
global chrome := "Chrome"
global sublime := "Sublime Text ahk_class PX_WINDOW_CLASS"
#define U(c) UNICODE c
#define B SC029
#define C COMMA
#define S BSEMICOLON
#define Q QUOTE
#define P . " " .

// register threads
OnExit exit_cleanup
SetTimer kill_rename, -1
//SetTimer anti_idle, -1
return

// define callbacks
exit_cleanup:; l33t_show(); ExitApp
kill_rename:; WinWaitActive Rename ahk_class #32770; Send y; SetTimer kill_rename, -1; return

// autoclick
^F1::; loop 10  {Click; Sleep 1} return
^F2::; loop 100 {Click; Sleep 1} return
^F3::; autoclick := autoclick = 1? "off" : 1; SetTimer Click, %autoclick%; return; Click:; Click; return

// run apps
AppsKey & S::; if WinExist(cmd) {WinActivate; if !GetKeyState("shift") {Send ‹Up›‹Enter›}; return} // else, execute next label
AppsKey & -::; t := current_directory(); Run bash -c "cd %t%SEMICOLONbash"; return
AppsKey & Enter::; if WinExist(calc) && !GetKeyState("shift") {WinActivate} else {Run calc} return
#define chrome_newtab(action) if WinExist(chrome) {WinActivate; Send ^t; action}
chrome(v) {chrome_newtab(paste(v); Send ‹Enter›)}
AppsKey & /::; chrome_newtab(); return
AppsKey & \::; chrome(copy()); return

// sound and music controls
AppsKey & Right::; if GetKeyState("shift") {MouseMove  1,  0, 0, R} else {Send ‹Volume_Up›  } return
AppsKey & Left::;  if GetKeyState("shift") {MouseMove -1,  0, 0, R} else {Send ‹Volume_Down›} return
AppsKey & Up::;    if GetKeyState("shift") {MouseMove  0, -1, 0, R} else {
	if WinExist(vlc) {WinActivate}
	else if (is_mute() and WinTitle(spotify) = "Spotify") {Send ‹Volume_Mute›}
	Send ‹Media_Play_Pause›} return
AppsKey & Down::;  if GetKeyState("shift") {MouseMove  0,  1, 0, R} else {
	if (!is_mute() and WinTitle(spotify) != "Spotify") {Send ‹Media_Play_Pause›}
	Send ‹Volume_Mute›} return
AppsKey & ,::; if WinExist(vlc) {WinActivate}; Send ‹Media_Prev›; return
AppsKey & .::; if WinExist(vlc) {WinActivate}; Send ‹Media_Next›; return
AppsKey &  RCtrl::; if WinExist(vlc) {WinActivate} else {Send ‹Launch_Media›} return
~RCtrl & AppsKey::; if WinExist(vlc) {WinActivate} else {Send ‹Launch_Media›} return
AppsKey & Numpad1::chrome(SubStr(WinTitle(spotify), StrLen("Spotify - ")+1) . " lyrics")

// manipulate windows
AppsKey & RAlt::;  if WinActive(vlc) {Send !‹Escape›} else {WinMinimize A} return
~RAlt & AppsKey::; if WinActive(vlc) {Send !‹Escape›} else {WinMinimize A} return
###if WinActive(cmd) || WinActive(calc) || WinActive(explorer) || WinActive(vlc)
^w::WinClose A
Esc::WinClose A
###if

// misc
AppsKey & n::Send ‹AppsKey›wt^a // new text file
LCtrl & Capslock::Send ^+‹Tab›
~Capslock & LCtrl::Send ‹Capslock›^+‹Tab›
AppsKey & LButton::; Click 2; Sleep 50; chrome(copy()); return
$^v::; if (clipboard_contains_files() and !WinActive(explorer)) {paste(slash_back(Clipboard))} else {paste()} return
~LWin & f::print("try win-q")
~RWin & f::print("try win-q")

// ye l33t command
AppsKey & B::
	InputBox v, "ye l33t tyme",,,200,100
	if (v = "h" or v = "hide") {
		w := WinExist("A")
		l33t_hidden .= (l33t_hidden ? "|" : "") . w
		WinHide ahk_id %w%
		GroupActivate All}
	else if (v = "s" or v = "show") {l33t_show()}
	else if (v = "t" or v = "transparent") {WinSet Transparent, 176, A}
	else if (v = "o" or v = "opaque") {WinSet Transparent, OFF, A}
	else if (SubStr(v, 1, 1) = "<") {paste(v . ">" . copy() . "</" . RegExReplace(SubStr(v, 2), " .*", "") . ">")}
	return ; global l33t_hidden
l33t_show() {loop Parse, l33t_hidden, |; {WinShow ahk_id %A_LoopField%; WinActivate ahk_id %A_LoopField%}; l33t_hidden =}

// functions
clipboard_contains_files() {return DllCall("IsClipboardFormatAvailable", "UInt", 15 /*CF_HDROP*/)}
copy_to_clipboard() {if WinActive(cmd) {Send ‹Enter›} else {Send ^c}}
copy(v = "") {// preserves clipboard
	t := ClipboardAll
	Clipboard =
	copy_to_clipboard()
	ClipWait 0.5, 1
	r := Clipboard
	Clipboard := t
	return r}
paste(v = "") {// if no argument, paste from clipboard
	if (v = "") {
		if WinActive(cmd) {Send !‹Space›ep} else {Send ^v}
	} else {
		restore_clipboard_v := ClipboardAll
		Clipboard := v
		paste()
		SetTimer restore_clipboard, -100
	}}; global restore_clipboard_v; restore_clipboard:; Clipboard := restore_clipboard_v; return
current_directory() {
	if WinActive(explorer) {
		v := WinGetText("A")
		StringSplit v, v, `n
		loop %v0% {IfInString v%A_Index%, Address; {
			v := v%A_Index%; break}}
		v := slash_back(RegExReplace(RegExReplace(v, "^Address: ", ""), "\r", ""))
		if (InStr(FileExist(v), "D"))
			return v
	} else if WinActive(sublime) {
		v := slash_back(RegExReplace(WinTitle("A"), "^(.*)\\\\.*$", "$1"))
		if (InStr(FileExist(v), "D"))
			return v
	} else if WinActive_desktop {
		return slash_back(A_Desktop)
	}
	return slash_back(A_Desktop) . "/../skryl/code"}
slash_back(v) {return RegExReplace(v, "\\\\", "/")}
is_mute() {return SoundGet("","MUTE") = "On"}
print(x="", y="", v="") {
	if (y) {v := (v? x . ", " . y . "|" . v : x . ", " . y); ToolTip %v%, x, y} else {v := x; ToolTip %v%}
	Clipboard := v; SetTimer kill_tooltip, -1500}; kill_tooltip:; Tooltip; return;
	//static tooltip_i := 0; tooltip_i := tooltip_i + 1; if (tooltip_i > 20) {tooltip_i := 1}
	//if (y) {v := (v? x . ", " . y . "|" . v : x . ", " . y); ToolTip %v%, x, y, %tooltip_i%} else {v := x; ToolTip %v%,,, %tooltip_i%}
	//Clipboard := v; SetTimer kill_tooltip_%tooltip_i%, -1500}
	//#define t(i) kill_tooltip_##i:; Tooltip, ,,, i; return;
	//t(1)t(2)t(3)t(4)t(5)t(6)t(7)t(8)t(9)t(10)t(11)t(12)t(13)t(14)t(15)t(16)t(17)t(18)t(19)t(20)
	//#undef t
alert(v) {MsgBox %v%}
mouse_pos() {MouseGetPos x, y; return x . ", " . y}
pixel(x = "", y = "", rgb = "") {if (!x) {MouseGetPos x, y}; PixelGetColor, v, %X%, %Y%, %RGB%; return v}
mouse_save(v = "") {static x; static y; if (v) {MouseMove x, y} else {MouseGetPos x, y}}
click(x, y) {MouseGetPos x_, y_; Click %x%, %y%; MouseMove x_, y_}
avgi(x,y) {return floor((x+y)/2)}

// unfinished
//~LButton::
//	MouseGetPos, mouse1x, mouse1y
//	KeyWait, LButton
//	MouseGetPos, mouse2x, mouse2y
//	if abs(mouse1x-mouse2x) > 3 or abs(mouse1y-mouse2y) > 3
//		copy_to_clipboard()
//	else {
//		KeyWait, LButton, D T0.3
//		if ErrorLevel = 0
//			copy_to_clipboard()
//	}
//	return
//~MButton Up::
//	if A_Cursor = IBeam; paste()
//	return


// anti-idle
/*F6::print(mouse_pos() P pixel())
F7::; can_mess := !can_mess; return
is_anti_idle() {return WinTitle("A") = "Play Anti-Idle: The Game, a free online game on Kongregate - Google Chrome"}
is_location(v) {return\
	(v="garden"    )? pixel(300, 250) = 0x007B00 :\
	(v="garden2"   )? pixel(316, 270) = 0x5E1700 :\
	(v="button"    )? pixel(528, 641) = 0x6B0066 :\
	(v="adventures")? pixel(288, 318) = 0x0027FF :\
		printf("no location detector entry") }
printf(v) {print(v); return false}
location(v) {
	if (is_location(v)) {
	} else if (v="garden" and is_location("garden2")) {
		click(425, 528)
	} else if (v="garden2") {
		location("garden")
		click(425, 528)
	} else {mouse_save()
		locations := ‹feature:2,mystery:3,garden:4,battle:5,button:6,printer:7,arcade:8,stadium:9,fcg:10,lol:11,adventures:12,fishing:13,business:14,dragon:15,epic:16,box:17,cards:18,typing:19›
		n := locations[v]
		MouseMove 930, 212; Sleep 250
		if (n > 12) {MouseMove 930, 693; Sleep 1100}
		click(930, 212 + 37 * (n > 12? n - 7 : n))
		mouse_save(1)}}
replant() {Send ‹Shift Down›; Sleep 50; click(852, 680); Sleep 50; Send ‹Shift Up›; click(300, 680); click(780, 680)}
anti_idle:
	if (!is_anti_idle()) {
		SetTimer anti_idle, -500
	} else {
		if (pixel( 260, 908) = 0x0000FF) {click(260, 908); if (is_location("garden")) {replant()}}
		if (pixel( 318, 919) = 0x11157B and can_mess) {location("garden"); replant(); Sleep 2000}
		if (pixel( 414, 919) = 0xFF6600) {click( 414, 919)}
		if (pixel(1096, 857) = 0x237223 and (pixel(1114, 821) != 0x555555 or pixel(1128, 822) != 0x383838 or pixel(1141, 821) != 0x505050 or pixel(1150, 821) != 0x4D4D4D)) {click(1096, 857)}
		if (pixel(1158, 849) = 0x2626A8) {click(1158, 849)}
		if (pixel(1117, 304) = 0x3B869F) {click(1117, 304)}
		if (pixel( 516, 922) = 0x990000 and can_mess) { // adventure
			//location("adventures")
			//Sleep 1000
			//Send 1
			//if (pixel(288,318) = 0x0027FF and pixel(839, 454) != 0x7FFFFF) { // ¬ at home
			//	if      (pixel(585, 207) = 0xE3E3E3 and pixel(790, 203) = 0x3B3B3B) {Send 1} // Arcade Tokens
			//	else if (pixel(540, 203) = 0x989898 and pixel(827, 197) = 0xC0C0C0) {Send 1} // Destroyer of Buttons
			//	else if (pixel(535, 203) = 0xB9B9B9                               ) {Send 2} // A Guy Playing TukkunFCG
			//	else if (pixel(606, 201) = 0xB9B9B9 and pixel(749, 195) = 0x575757) {Send 2} // COINS PLX!!!
			//	else if (pixel(582, 196) = 0x737373 and pixel(793, 202) = 0x989898) {Send 1} // Illegal Blue Coins
			//	else if (pixel(837, 209) = 0x959595 and pixel(674, 198) = 0x030303) {if (pixel(422, 511) = 0xC8E7EF) {Send 2} else {Send 3)}} // A Tired Adventurer
			//	else {
			//		Sleep 1000
			//		Send 3; Sleep 200
			//		if (pixel(839, 454) != 0x7FFFFF) {Send 2; Sleep 200
			//		if (pixel(839, 454) != 0x7FFFFF) {Send 1}}
			//		Sleep 2000
			//	}
			//}
			//Sleep 800
		}
		// fishing: first, get a lock on 843, 686 0x0000FF
		if (pixel(1050, 615) = 0x08D686 and !idle_mode) {SetTimer idle_mode, -1000; idle_mode := true}
		if (can_mess) {location("button")}
		if (is_location("button")) {
			if (!ly or !ry) {
				PixelSearch _,lyu, 370,285,     370,539, 0x666666,, Fast
				PixelSearch _,lyl, 370,lyu+140, 370,539, 0x000000,, Fast
				ly := avgi(lyu,lyl)
				PixelSearch _,ryu, 891,285,     891,539, 0x666666,, Fast
				PixelSearch _,ryl, 891,ryu+140, 891,539, 0x000000,, Fast
				ry := avgi(ryu,ryl)
			} else {
				Y := avgi(ly,ry)
				PixelSearch x,y, 265,Y, 1002,Y, 0x990000, 32, Fast
				x := x + 75
				PixelSearch _,yu, x,y-110,  x,y,      0x990000, 32, Fast
				PixelSearch _,yl, x,yu+100, x,yu+160, 0x990000, 32, Fast
				y := avgi(yu,yl)
				click(x,y)
				if (((pixel(400,Y) = 0x000099) + (pixel(500,Y) = 0x000099) + (pixel(600,Y) = 0x000099) + (pixel(700,Y) = 0x000099) + (pixel(800,Y) = 0x000099) + (pixel(900,Y) = 0x000099)) > 2) {click(358, 686)}
			}
		}
		SetTimer anti_idle, -50
	} return
	idle_mode:; if (is_anti_idle() and pixel(1050, 615) = 0x08D686) {click(1050, 615)}; idle_mode := false; return*/


// insert unicode
	#define chord(...) MACRO_DISPATCH(chord,##__VA_ARGS__)
	#define chord_(x,y,c) ~x & y::Send `b‹U(c)›
	#define chord3(x,y,c) chord_(x,y,c)
	#define chord4(x,y,c,_) chord_(x,y,c); chord_(y,x,c)
	#define m_chord(x,c) AppsKey & x::Send ‹U(c)› // menu chord
	#define c_chord(x,c,_) ~Capslock & x::Send ‹Capslock›‹U(c)›; chord_(x,Capslock,c) // capslock chord
	#define m_chord_(x,c) AppsKey & x::Send ‹c›
	#define chord_shift(x,y,l,u) ~x & y::; if GetKeyState("shift") {Send `b‹U(u)›} else {Send `b‹U(l)›} return
	#define m_chord_shift(x,l,u) AppsKey & x::; if GetKeyState("shift") {Send ‹U(u)›} else {Send ‹U(l)›} return
	// misc
	chord(B,=,≈,)			// `= ≈ ↔
	chord(B,\,≉,)			// `\ ≉ ↔
	chord(C,S,∴)			// ,; ∴ ↔
	m_chord(8,∞)			// ≡8 ∞
	m_chord(v,✓)			// ≡v ✓
	m_chord_shift(Q,‘,“)	// ≡' ‘ ⇧“
	m_chord(NumpadSub,−)	// ≡− −
	m_chord(NumpadMult,×)	// ≡× ×
	m_chord(NumpadDiv,÷)	// ≡÷ ÷
	m_chord_(Space,U+FEFF)	// ≡  U+FEFF // or maybe U+2060 would be better, but my fb chat phone app does not render it right
	// misc that i have used in programming
	chord(.,S,…,)	// .; … ↔
	chord(=,/,≠,)	// =/ ≠ ↔
	m_chord(=,≡)	// ≡= ≡
	chord(=,\,≢,)	// =\ ≢ ↔
	chord(=,C,≤,)	// =, ≤ ↔
	chord(=,.,≥,)	// =. ≥ ↔
	m_chord([,\‹)	// ≡[ ‹
	m_chord(],\›)	// ≡] ›
	// greek except omicron and nu . roughly ≡[a-z3] except cqvwn
	m_chord_shift(a,α,Α) // ≡a α ⇧Α
	m_chord_shift(b,β,Β) // ≡b β ⇧Β
	m_chord_shift(g,γ,Γ) // ≡g γ ⇧Γ
	m_chord_shift(d,δ,Δ) // ≡d δ ⇧Δ
	m_chord_shift(e,ε,Ε) // ≡e ε ⇧Ε
	m_chord_shift(z,ζ,Ζ) // ≡z ζ ⇧Ζ
	m_chord_shift(j,η,Η) // ≡j η ⇧Η
	m_chord_shift(h,θ,Θ) // ≡h θ ⇧Θ
	m_chord_shift(i,ι,Ι) // ≡i ι ⇧Ι
	m_chord_shift(k,κ,Κ) // ≡k κ ⇧Κ
	m_chord_shift(l,λ,Λ) // ≡l λ ⇧Λ
	m_chord_shift(m,μ,Μ) // ≡m μ ⇧Μ
	m_chord_shift(3,ξ,Ξ) // ≡3 ξ ⇧Ξ
	m_chord_shift(p,π,Π) // ≡p π ⇧Π
	m_chord_shift(r,ρ,Ρ) // ≡r ρ ⇧Ρ
	m_chord_shift(s,σ,Σ) // ≡s σ ⇧Σ
	m_chord_shift(t,τ,Τ) // ≡t τ ⇧Τ
	m_chord_shift(u,υ,Υ) // ≡u υ ⇧Υ
	m_chord_shift(f,φ,Φ) // ≡f φ ⇧Φ
	m_chord_shift(x,χ,Χ) // ≡x χ ⇧Χ
	m_chord_shift(y,ψ,Ψ) // ≡y ψ ⇧Ψ
	m_chord_shift(o,ω,Ω) // ≡o ω ⇧Ω
	// blackboard bold
	c_chord(c,ℂ,)	// ⇪c ℂ ↔
	c_chord(h,ℍ,)	// ⇪h ℍ ↔
	c_chord(n,ℕ,)	// ⇪n ℕ ↔
	c_chord(p,ℙ,)	// ⇪p ℙ ↔
	c_chord(q,ℚ,)	// ⇪q ℚ ↔
	c_chord(r,ℝ,)	// ⇪r ℝ ↔
	c_chord(z,ℤ,)	// ⇪z ℤ ↔
	// arrows
	chord(-,C,←,)	// -, ← ↔
	chord(-,.,→,)	// -. → ↔
	chord(-,Left,←)	// -← ←
	chord(-,Right,→)// -→ →
	chord(-,Up,↑)	// -↑ ↑
	chord(-,Down,↓)	// -↓ ↓
	// logic symbols
	chord(B,1,¬,)	// `1 ¬ ↔
	chord(9,0,⊂)	// 90 ⊂
	chord(0,9,⊃)	// 09 ⊃
	chord(9,=,⊆,)	// 9= ⊆ ↔
	chord(0,=,⊇,)	// 0= ⊇ ↔
	chord(C,.,↔,)	// ,. ↔ ↔
	m_chord(6,⊕)	// ≡6 ⊕
	chord(1,e,∃,)	// 1e ∃ ↔
	chord(B,e,∄,)	// `e ∄ ↔
	chord(1,a,∀,)	// 1a ∀ ↔
	chord(B,a,¬∀,)	// `a ¬∀ ↔
	chord(1,n,∈,)	// 1n ∈ ↔
	chord(B,n,∉,)	// `n ∉ ↔
	chord(7,a,∧,)	// 7a ∧ ↔
	chord(\,o,∨,)	// \o ∨ ↔
	// ⌈⌊⌉⌋
	chord([,Up,⌈)   // [↑ ⌈
	chord([,Down,⌊) // [↓ ⌊
	chord(],Up,⌉)   // ]↑ ⌉
	chord(],Down,⌋) // ]↓ ⌋
	// superscripts and subscripts
	chord(],0,⁰) // ]0 ⁰
	chord(],1,¹) // ]1 ¹
	chord(],2,²) // ]2 ²
	chord(],3,³) // ]3 ³
	chord(],4,⁴) // ]4 ⁴
	chord(],5,⁵) // ]5 ⁵
	chord(],6,⁶) // ]6 ⁶
	chord(],7,⁷) // ]7 ⁷
	chord(],8,⁸) // ]8 ⁸
	chord(],9,⁹) // ]9 ⁹
	chord(],+,⁺) // ]+ ⁺
	chord(],-,⁻) // ]- ⁻
	chord([,0,₀) // [0 ₀
	chord([,1,₁) // [1 ₁
	chord([,2,₂) // [2 ₂
	chord([,3,₃) // [3 ₃
	chord([,4,₄) // [4 ₄
	chord([,5,₅) // [5 ₅
	chord([,6,₆) // [6 ₆
	chord([,7,₇) // [7 ₇
	chord([,8,₈) // [8 ₈
	chord([,9,₉) // [9 ₉
	chord([,+,₊) // [+ ₊
	chord([,-,₋) // [- ₋
	chord(1,-,₋₁,) // -1 ₋₁ ↔
	chord_shift(],a,ᵃ,ᴬ)	// ]a ᵃ ⇧ᴬ
	chord_shift(],b,ᵇ,ᴮ)	// ]b ᵇ ⇧ᴮ
	chord(],c,ᶜ)],			// ]c ᶜ
	chord_shift(],d,ᵈ,ᴰ)	// ]d ᵈ ⇧ᴰ
	chord_shift(],e,ᵉ,ᴱ)	// ]e ᵉ ⇧ᴱ
	chord(],f,ᶠ)],			// ]f ᶠ
	chord_shift(],g,ᵍ,ᴳ)	// ]g ᵍ ⇧ᴳ
	chord_shift(],h,ʰ,ᴴ)	// ]h ʰ ⇧ᴴ
	chord_shift(],i,ⁱ,ᴵ)	// ]i ⁱ ⇧ᴵ
	chord_shift(],j,ʲ,ᴶ)	// ]j ʲ ⇧ᴶ
	chord_shift(],k,ᵏ,ᴷ)	// ]k ᵏ ⇧ᴷ
	chord_shift(],l,ˡ,ᴸ)	// ]l ˡ ⇧ᴸ
	chord_shift(],m,ᵐ,ᴹ)	// ]m ᵐ ⇧ᴹ
	chord_shift(],n,ⁿ,ᴺ)	// ]n ⁿ ⇧ᴺ
	chord_shift(],o,ᵒ,ᴼ)	// ]o ᵒ ⇧ᴼ
	chord_shift(],p,ᵖ,ᴾ)	// ]p ᵖ ⇧ᴾ
	chord_shift(],r,ʳ,ᴿ)	// ]r ʳ ⇧ᴿ
	chord(],s,ˢ)],			// ]s ˢ
	chord_shift(],t,ᵗ,ᵀ)	// ]t ᵗ ⇧ᵀ
	chord_shift(],u,ᵘ,ᵁ)	// ]u ᵘ ⇧ᵁ
	chord_shift(],v,ᵛ,ⱽ)		// ]v ᵛ ⇧ⱽ
	chord_shift(],w,ʷ,ᵂ)	// ]w ʷ ⇧ᵂ
	chord(],x,ˣ)			// ]x ˣ
	chord(],y,ʸ)			// ]y ʸ
	chord(],z,ᶻ)			// ]z ᶻ
	chord([,a,ₐ)	// [a ₐ
	chord([,e,ₑ)	// [e ₑ
	chord([,h,ₕ)		// [h ₕ
	chord([,i,ᵢ)	// [i ᵢ
	chord([,j,ⱼ) 	// [j ⱼ
	chord([,k,ₖ) 	// [k ₖ
	chord([,l,ₗ) 	// [l ₗ
	chord([,m,ₘ)		// [m ₘ
	chord([,n,ₙ)		// [n ₙ
	chord([,o,ₒ)	// [o ₒ
	chord([,p,ₚ)		// [p ₚ
	chord([,r,ᵣ)	// [r ᵣ
	chord([,s,ₛ) 	// [s ₛ
	chord([,t,ₜ) 	// [t ₜ
	chord([,u,ᵤ)	// [u ᵤ
	chord([,v,ᵥ)	// [v ᵥ
	chord([,x,ₓ)	// [x ₓ
// homoiconic keyboard
	F8::; Input k, L1,‹Escape›‹LControl›‹RControl›‹LShift›‹RShift›‹LAlt›‹RAlt›‹LWin›‹RWin›‹Backspace›‹Tab›‹Enter›‹Space›‹Delete›‹Insert›‹Home›‹End›‹PgUp›‹PgDn›‹Up›‹Down›‹Left›‹Right›‹CapsLock›‹NumLock›‹ScrollLock›‹PrintScreen›‹CtrlBreak›‹Pause›‹Sleep›‹F1›‹F2›‹F3›‹F4›‹F5›‹F6›‹F7›‹F8›‹F9›‹F10›‹F11›‹F12›
	// did not have keyboard with ⌘Command ⌥Option ⎄Compose ⏏Eject or any other cool key, so did not implement these keys
	// had difficulty implementing ≣MenuKey so we'll just go with ≡MenuKey, which we can already input with ≡=
	// ⌘Win is known to do weird things
		if (Errorlevel = "Max") {Send %k%}
		else if InStr(ErrorLevel, "EndKey:") {
			k := SubStr(ErrorLevel, 8)
			if (false) {}
	#define chord_f8(c,name) else if k=name; {Send ‹U(c)›}
	#define chord_f8_(c,name,before,after) else if k=name; {before; Send ‹U(c)›; after}
	// modifiers
	chord_f8(^	,LControl)			// → F8^ ^	// Ctrl
	chord_f8(^	,RControl)			// → F8^ ^	// Ctrl
	chord_f8_(⎇	,LAlt,Sleep 200,)	// → F8⎇ ⎇	// Alt
	chord_f8_(⎇	,RAlt,Sleep 200,)	// → F8⎇ ⎇	// Alt
	chord_f8(⇧	,LShift)			// → F8⇧ ⇧	// Shift
	chord_f8(⇧	,RShift)			// → F8⇧ ⇧	// Shift
	chord_f8(⌘	,LWin)				// → F8⌘ ⌘	// Win
	chord_f8(⌘	,RWin)				// → F8⌘ ⌘	// Win
	// simple text
	chord_f8(␣	,Space)		// → F8␣ ␣		// Space
	chord_f8(↹	,Tab)		// → F8↹ ↹		// Tab
	chord_f8(⏎	,Enter)		// → F8⏎ ⏎		// Enter
	chord_f8(⌦	,Delete)	// → F8⌦ ⌦	// Delete
	chord_f8(⌫	,Backspace)	// → F8⌫ ⌫	// Backspace
	// locks
	chord_f8_(⇪	,CapsLock,,SetCapsLockState Off)	// → F8⇪ ⇪	// CapsLock
	chord_f8_(⇩	,NumLock,,SetNumLockState On)		// → F8⇩ ⇩	// NumLock
	chord_f8_(⇳	,ScrollLock,,SetScrollLockState Off)// → F8⇳ ⇳	// ScrollLock
	// navigation
	chord_f8(⇱	,Home)	// → F8⇱ ⇱	// Home
	chord_f8(⇲	,End)	// → F8⇲ ⇲	// End
	chord_f8(⇞	,PgUp)	// → F8⇞ ⇞	// PgUp
	chord_f8(⇟	,PgDn)	// → F8⇟ ⇟	// PgDn
	// special
	chord_f8(⌤	,Insert)		// → F8⌤ ⌤	// Insert
	chord_f8(⎋	,Escape)		// → F8⎋ ⎋	// Escape
	chord_f8(⎙	,PrintScreen)	// → F8⎙ ⎙	// PrintScreen
	chord_f8(⎉	,Pause)			// → F8⎉ ⎉	// Pause
	chord_f8(⎊	,CtrlBreak)		// → F8⎊ ⎊	// Break
	// arrows
	chord_f8(↑	,Up)	// → F8↑ ↑	// Up
	chord_f8(↓	,Down)	// → F8↓ ↓	// Down
	chord_f8(←	,Left)	// → F8← ←	// Left
	chord_f8(→	,Right)	// → F8→ →	// Right
	// function keys
	chord_f8(F1	,F1)	// → F8F1 F1	// F1
	chord_f8(F2	,F2)	// → F8F2 F2	// F2
	chord_f8(F3	,F3)	// → F8F3 F3	// F3
	chord_f8(F4	,F4)	// → F8F4 F4	// F4
	chord_f8(F5	,F5)	// → F8F5 F5	// F5
	chord_f8(F6	,F6)	// → F8F6 F6	// F6
	chord_f8(F7	,F7)	// → F8F7 F7	// F7
	chord_f8(F8	,F8)	// → F8F8 F8	// F8
	chord_f8(F9	,F9)	// → F8F9 F9	// F9
	chord_f8(F10,F10)	// → F8F10 F10	// F10
	chord_f8(F11,F11)	// → F8F11 F11	// F11
	chord_f8(F12,F12)	// → F8F12 F12	// F12
			} return
// make menukey-mode not break on undefined chars in [a-z0-9]
	#define no(k) AppsKey & k::return
	no(c)
	no(w)
	no(q)
	no(1)
	no(2)
	no(4)
	no(5)
	no(7)
	no(9)
	no(0)

// command functions https://raw.github.com/polyethene/AutoHotkey-Scripts/master/Functions.ahk
Input(Options = "", EndKeys = "", MatchList = "") {Input, v, %Options%, %EndKeys%, %MatchList%; return v}
InputBox(Title = "", Prompt = "", HIDE = "", Width = "", Height = "", X = "", Y = "", Font = "", Timeout = "", Default = "") {InputBox, v, %Title%, %Prompt%, %HIDE%, %Width%, %Height%, %X%, %Y%, , %Timeout%, %Default%; return v}
Run(Target, WorkingDir = "", Mode = "") {Run, %Target%, %WorkingDir%, %Mode%, v; return v}
SoundGet(ComponentType = "", ControlType = "", DeviceNumber = "") {SoundGet, v, %ComponentType%, %ControlType%, %DeviceNumber%; return v}
SplitPath(ByRef InputVar, ByRef OutFileName = "", ByRef OutDir = "", ByRef OutExtension = "", ByRef OutNameNoExt = "", ByRef OutDrive = "") {SplitPath, InputVar, OutFileName, OutDir, OutExtension, OutNameNoExt, OutDrive}
StatusBarGetText(Part = "", title = "", WinText = "", ExcludeTitle = "", ExcludeText = "") {StatusBarGetText, v, %Part%, %title%, %WinText%, %ExcludeTitle%, %ExcludeText%; return v}
WinGet(Cmd = "", title = "", WinText = "", ExcludeTitle = "", ExcludeText = "") {WinGet, v, %Cmd%, %title%, %WinText%, %ExcludeTitle%, %ExcludeText%; return v}
WinGetClass(title = "", WinText = "", ExcludeTitle = "", ExcludeText = "") {WinGetClass, v, %title%, %WinText%, %ExcludeTitle%, %ExcludeText%; return v}
WinGetText(title = "", WinText = "", ExcludeTitle = "", ExcludeText = "") {WinGetText, v, %title%, %WinText%, %ExcludeTitle%, %ExcludeText%; return v}
WinTitle(title = "", WinText = "", ExcludeTitle = "", ExcludeText = "") {WinGetTitle, v, %title%, %WinText%, %ExcludeTitle%, %ExcludeText%; return v}
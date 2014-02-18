###SingleInstance force
SendMode Input

// MACRO_DISPATCH (copied from hydrocarboner)
#define PASTE2(a,b) a ## b
#define PASTE2_2(a,b) PASTE2(a,b)
#define ARG_16(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,n,...) n
#define __VA_LEN__(...)   ARG_16(0,##__VA_ARGS__,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
#define MACRO_DISPATCH(fn,...) PASTE2_2(fn,__VA_LEN__(__VA_ARGS__))(__VA_ARGS__)

// autoclick
#define autoclick_n(key,n) key::#n Loop, n {#n Click #n Sleep, 1 #n} return
autoclick_n(^F1,10)
autoclick_n(^F2,100)
F3::setTimer, autoclick, 1
F4::setTimer, autoclick, Off
autoclick: #n Click #n return

// run apps
AppsKey & ;::#n if WinExist("ahk_class ConsoleWindowClass") {#n WinActivate #n if !GetKeyState("shift") #n Send {Up}{Enter} #n} return
AppsKey &  RCtrl::Send {Launch_Media}
~RCtrl & AppsKey::Send {Launch_Media}
AppsKey & Enter::#n if WinExist("Calculator") && !GetKeyState("shift") {#n WinActivate #n} else {#n Run calc #n} return
AppsKey & /::           #n SetTitleMatchMode, 2 #n if WinExist("Chrome"){#n WinActivate #n Send ^t #n} return
AppsKey & \::#n Send ^c #n SetTitleMatchMode, 2 #n if WinExist("Chrome"){#n WinActivate #n Send ^t #n Send ^v{Enter} #n} return

// sound controls
AppsKey & Right::Send {Volume_Up}
AppsKey & Left::Send {Volume_Down}
AppsKey & Down::Send {Volume_Mute}
AppsKey & Up::Send {Media_Play_Pause}
AppsKey & ,::Send {Media_Prev}
AppsKey & .::Send {Media_Next}

// misc
AppsKey & RAlt::WinMinimize, A
~RAlt & AppsKey::WinMinimize, A
//AppsKey & n::Send {AppsKey}w{Down}{Down}{Down}{Down}{Down}{Down}{Down}{Enter}`b
LCtrl & Capslock::Send ^+{Tab}
RCtrl & Capslock::Send ^+{Tab}
~Capslock & LCtrl::Send {Capslock}^+{Tab}
~Capslock & RCtrl::Send {Capslock}^+{Tab}

// insert unicode
#define U(c) U+UNICODE c
#define C #,
#define B SC029
#define Q QUOTE
#define chord(...) MACRO_DISPATCH(chord,##__VA_ARGS__)
#define chord_(x,y,c) ~x & y::Send `b{U(c)}
#define chord3(x,y,c) chord_(x,y,c)
#define chord4(x,y,c,_) chord_(x,y,c) #n chord_(y,x,c)
#define chord_2(x,y,c1,c2,_) chord_2_(x,y,c1,c2) #n chord_2_(y,x,c1,c2)
#define chord_2_(x,y,c,d) ~x & y::Send `b{U(c)}{U(d)}
#define m_chord(x,c) AppsKey & x::Send {U(c)} // menu chord
#define c_chord(x,c,_) ~Capslock & x::Send {Capslock}{U(c)} #n chord_(x,Capslock,c) // capslock chord
#define m_chord_(x,c) AppsKey & x::Send {c}
#define chord_shift(x,y,l,u) ~x & y::#n if GetKeyState("shift") #n Send `b{U(u)} #n else Send `b{U(l)} #n return
#define m_chord_shift(x,l,u) AppsKey & x::#n if GetKeyState("shift") #n Send {U(u)} #n else Send {U(l)} #n return
// todo: harden the syntax-in-comments
// todo: consider making menukey sticky, like F8
// misc
chord(=,B,≈,)			// =` ≈ ↔
chord(C,;,∴)			// ,; ∴ ↔
m_chord(8,∞)			// ≡8 ∞
m_chord(v,✓)			// ≡v ✓
m_chord_shift(Q,‘,“)	// ≡' ‘“
m_chord(NumpadSub,−)	// ≡- −
m_chord(NumpadMult,×)	// ≡* ×
m_chord(NumpadDiv,÷)	// ≡/ ÷
m_chord_(Space,U+FEFF)	// ≡  U+FEFF // or maybe U+2060 would be better, but my fb chat phone app does not render it right
// misc that i have used in programming
chord(.,;,…,)	// .; … ↔
chord(=,/,≠,)	// =/ ≠ ↔
m_chord(=,≡)	// ≡= ≡
chord(=,\,≢,)	// =\ ≢ ↔
chord(=,C,≤,)	// =, ≤ ↔
chord(=,.,≥,)	// =. ≥ ↔
m_chord([,‹)	// ≡[ ‹
m_chord(],›)	// ≡] ›
// greek except omicron . roughly ≡[a-z3] except cqvw
m_chord_shift(a,α,Α)
m_chord_shift(b,β,Β)
m_chord_shift(g,γ,Γ)
m_chord_shift(d,δ,Δ)
m_chord_shift(e,ε,Ε)
m_chord_shift(z,ζ,Ζ)
m_chord_shift(j,η,Η)
m_chord_shift(h,θ,Θ)
m_chord_shift(i,ι,Ι)
m_chord_shift(k,κ,Κ)
m_chord_shift(l,λ,Λ)
m_chord_shift(m,μ,Μ)
m_chord_shift(n,ν,Ν)
m_chord_shift(3,ξ,Ξ)
m_chord_shift(p,π,Π)
m_chord_shift(r,ρ,Ρ)
m_chord_shift(s,σ,Σ)
m_chord_shift(t,τ,Τ)
m_chord_shift(u,υ,Υ)
m_chord_shift(f,φ,Φ)
m_chord_shift(x,χ,Χ)
m_chord_shift(y,ψ,Ψ)
m_chord_shift(o,ω,Ω)
// blackboard bold
c_chord(c,ℂ,)	// Ac ℂ
c_chord(h,ℍ,)	// Ah ℍ
c_chord(n,ℕ,)	// An ℕ
c_chord(p,ℙ,)	// Ap ℙ
c_chord(q,ℚ,)	// Aq ℚ
c_chord(r,ℝ,)	// Ar ℝ
c_chord(z,ℤ,)	// Az ℤ
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
chord_2(B,a,¬,∀,) // `a ¬∀ ↔
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
chord(0,6,⁰) // 06 ⁰
chord(1,6,¹) // 16 ¹
chord(2,6,²) // 26 ²
chord(3,6,³) // 36 ³
chord(4,6,⁴) // 46 ⁴
chord(5,6,⁵) // 56 ⁵
chord(6,AppsKey,⁶) // 6≡ ⁶
chord(7,6,⁷) // 76 ⁷
chord(8,6,⁸) // 86 ⁸
chord(9,6,⁹) // 96 ⁹
chord(+,6,⁺) // +6 ⁺
chord(-,6,⁻) // -6 ⁻
chord(0,5,₀) // 05 ₀
chord(1,5,₁) // 15 ₁
chord(2,5,₂) // 25 ₂
chord(3,5,₃) // 35 ₃
chord(4,5,₄) // 45 ₄
chord(5,AppsKey,₅) // 5≡ ₅
chord(6,5,₆) // 65 ₆
chord(7,5,₇) // 75 ₇
chord(8,5,₈) // 85 ₈
chord(9,5,₉) // 95 ₉
chord(+,5,₊) // +5 ₊
chord(-,5,₋) // -5 ₋
chord_2(1,-,₋,₁,) // 1- ₋₁ ↔
chord_shift(a,6,ᵃ,ᴬ)	// a6 ᵃᴬ
chord_shift(b,6,ᵇ,ᴮ)	// b6 ᵇᴮ
chord(c,6,ᶜ)			// c6 ᶜ
chord_shift(d,6,ᵈ,ᴰ)	// d6 ᵈᴰ
chord_shift(e,6,ᵉ,ᴱ)	// e6 ᵉᴱ
chord(f,6,ᶠ)			// f6 ᶠ
chord_shift(g,6,ᵍ,ᴳ)	// g6 ᵍᴳ
chord_shift(h,6,ʰ,ᴴ)	// h6 ʰᴴ
chord_shift(i,6,ⁱ,ᴵ)	// i6 ⁱᴵ
chord_shift(j,6,ʲ,ᴶ)	// j6 ʲᴶ
chord_shift(k,6,ᵏ,ᴷ)	// k6 ᵏᴷ
chord_shift(l,6,ˡ,ᴸ)	// l6 ˡᴸ
chord_shift(m,6,ᵐ,ᴹ)	// m6 ᵐᴹ
chord_shift(n,6,ⁿ,ᴺ)	// n6 ⁿᴺ
chord_shift(o,6,ᵒ,ᴼ)	// o6 ᵒᴼ
chord_shift(p,6,ᵖ,ᴾ)	// p6 ᵖᴾ
chord_shift(r,6,ʳ,ᴿ)	// r6 ʳᴿ
chord(s,6,ˢ)			// s6 ˢ
chord_shift(t,6,ᵗ,ᵀ)	// t6 ᵗᵀ
chord_shift(u,6,ᵘ,ᵁ)	// u6 ᵘᵁ
chord_shift(v,6,ᵛ,ⱽ)		// v6 ᵛⱽ
chord_shift(w,6,ʷ,ᵂ)	// w6 ʷᵂ
chord(x,6,ˣ)			// x6 ˣ
chord(y,6,ʸ)			// y6 ʸ
chord(z,6,ᶻ)			// z6 ᶻ
chord(a,5,ₐ)	// a5 ₐ
chord(e,5,ₑ)	// e5 ₑ
chord(h,5,ₕ)		// h5 ₕ
chord(i,5,ᵢ)	// i5 ᵢ
chord(j,5,ⱼ) 	// j5 ⱼ
chord(k,5,ₖ) 	// k5 ₖ
chord(l,5,ₗ) 	// l5 ₗ
chord(m,5,ₘ)		// m5 ₘ
chord(n,5,ₙ)		// n5 ₙ
chord(o,5,ₒ)	// o5 ₒ
chord(p,5,ₚ)		// p5 ₚ
chord(r,5,ᵣ)	// r5 ᵣ
chord(s,5,ₛ) 	// s5 ₛ
chord(t,5,ₜ) 	// t5 ₜ
chord(u,5,ᵤ)	// u5 ᵤ
chord(v,5,ᵥ)	// v5 ᵥ
chord(x,5,ₓ)	// x5 ₓ

// homoiconic keyboard
F8::#n Input, k, L1,{Escape}{LControl}{RControl}{LShift}{RShift}{LAlt}{RAlt}{LWin}{RWin}{Backspace}{Tab}{Enter}{Space}{Delete}{Insert}{Home}{End}{PgUp}{PgDn}{Up}{Down}{Left}{Right}{CapsLock}{NumLock}{ScrollLock}{PrintScreen}{CtrlBreak}{Pause}{Sleep}{F1}{F2}{F3}{F4}{F5}{F6}{F7}{F8}{F9}{F10}{F11}{F12}
// side effects: capslock,numlock,scrolllock toggle . some modifiers are down briefly, notably alt, for which there is a weird workaround
// did not have keyboard with ⌘Command ⌥Option ⎄Compose so did not implement these keys
// had difficulty implementing ≣MenuKey so we'll just go with ≡MenuKey, which we can already input with ≡=
	if Errorlevel=Max #n Send %k%
	else if InStr(ErrorLevel,"EndKey:") {
		k := SubStr(ErrorLevel,8)
		if k=placeholder #n Send nothing
#define chord_f8(c,name,before,after) else if k=name #n {#n before #n Send {U(c)} #n after #n}
#define chord_f8_s(s,name,before,after) else if k=name #n {#n before #n Send s #n after #n}
// modifiers
chord_f8(^	,LControl,,)	//Ctrl
chord_f8(^	,RControl,,)	//Ctrl
chord_f8(⎇	,LAlt,msgbox,)	//Alt
chord_f8(⎇	,RAlt,msgbox,)	//Alt
chord_f8(⇧	,LShift,,)	//Shift
chord_f8(⇧	,RShift,,)	//Shift
chord_f8(⌘	,LWin,,)	//Win
chord_f8(⌘	,RWin,,)	//Win
// simple text
chord_f8(␣	,Space,,)	//Space
chord_f8(↹	,Tab,,)	//Tab
chord_f8(⏎	,Enter,,)	//Enter
chord_f8(⌦	,Delete,,)	//Delete
chord_f8(⌫	,Backspace,,)	//Backspace
// locks
chord_f8(⇬	,CapsLock,,SetCapsLockState Off)	//CapsLock
chord_f8(⇩	,NumLock,,SetNumLockState On)	//NumLock
chord_f8(⇳	,ScrollLock,,SetScrollLockState Off)	//ScrollLock
// navigation
chord_f8(⇱	,Home,,)	//Home
chord_f8(⇲	,End,,)	//End
chord_f8(⇞	,PgUp,,)	//PgUp
chord_f8(⇟	,PgDn,,)	//PgDn
// special
chord_f8(⌤	,Insert,,)	//Insert
chord_f8(⎋	,Escape,,)	//Escape
chord_f8(⎙	,PrintScreen,,)	//PrintScreen
chord_f8(⎉	,Pause,,)	//Pause
chord_f8(⎊	,CtrlBreak,,)	//Break
// arrows
chord_f8(↑	,Up,,)	//Up
chord_f8(↓	,Down,,)	//Down
chord_f8(←	,Left,,)	//Left
chord_f8(→	,Right,,)	//Right
// function keys
chord_f8_s(F1	,F1,,) //F1
chord_f8_s(F2	,F2,,) //F2
chord_f8_s(F3	,F3,,) //F3
chord_f8_s(F4	,F4,,) //F4
chord_f8_s(F5	,F5,,) //F5
chord_f8_s(F6	,F6,,) //F6
chord_f8_s(F7	,F7,,) //F7
chord_f8_s(F8	,F8,,) //F8
chord_f8_s(F9	,F9,,) //F9
chord_f8_s(F10	,F10,,) //F10
chord_f8_s(F11	,F11,,) //F11
chord_f8_s(F12	,F12,,) //F12
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

//~LButton::
//	MouseGetPos, mouse1x, mouse1y
//	KeyWait, LButton
//	MouseGetPos, mouse2x, mouse2y
//	if abs(mouse1x-mouse2x) > 3 or abs(mouse1y-mouse2y) > 3
//		gosub send_copy
//	else {
//		KeyWait, LButton, D T0.3
//		if ErrorLevel = 0
//			gosub send_copy
//	}
//	return

//~MButton Up::
//	if A_Cursor = IBeam #n gosub send_paste
//	return

//send_copy:
//	if WinActive("ahk_class ConsoleWindowClass")
//		Send {Enter}
//	else
//		Send ^c
//	return

//send_paste:
//	if WinActive("ahk_class ConsoleWindowClass")
//		Send {RButton}
//	else
//		Send ^v
//	return
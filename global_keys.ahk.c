###SingleInstance force
SendMode Input

#define PASTE2(a,b) a ## b
#define PASTE2_2(a,b) PASTE2(a,b)
#define ARG_16(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,n,...) n
#define __VA_LEN__(...)   ARG_16(0,##__VA_ARGS__,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
#define MACRO_DISPATCH(fn,...) PASTE2_2(fn,__VA_LEN__(__VA_ARGS__))(__VA_ARGS__)

// autoclick
#define autoclick_n(key,n) key::#n Loop, n {#n Click #n Sleep, 1 #n} #n return
autoclick_n(^F1,10)
autoclick_n(^F2,100)
^F3::setTimer, autoclick, 1
^F4::setTimer, autoclick, Off
autoclick: #n Click #n return

// sound controls
AppsKey & Right::Send {Volume_Up}
AppsKey & Left::Send {Volume_Down}
AppsKey & Down::Send {Volume_Mute}
AppsKey & Up::Send {Media_Play_Pause}
AppsKey & ,::Send {Media_Prev}
AppsKey & .::Send {Media_Next}

// do things
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
#define chord(...) MACRO_DISPATCH(chord,##__VA_ARGS__)
#define chord_(k,l,c) ~k & l::Send `b{U(c)}
#define chord3(k,l,c) chord_(k,l,c)
#define chord4(k,l,c,_) chord_(k,l,c) #n chord_(l,k,c)
#define chord_2(k,l,c1,c2,_) chord_2_(k,l,c1,c2) #n chord_2_(l,k,c1,c2)
#define chord_2_(k,l,c,d) ~k & l::Send `b{U(c)}{U(d)}
#define m_chord(k,c) AppsKey & k::Send {U(c)} // menu chord
#define c_chord(k,c,_) ~Capslock & k::Send {Capslock}{U(c)} #n chord_(k,Capslock,c) // capslock chord
#define m_chord_(k,c) AppsKey & k::Send {c}
// misc
chord(=,B,≈,)	// =` ≈ ↔
chord(C,;,∴)	// ,; ∴
m_chord(8,∞)	// ≡8 ∞
m_chord(v,✓)	// ≡v ✓
m_chord(NumpadSub,−)	// ≡- −
m_chord(NumpadMult,×)	// ≡* ×
m_chord(NumpadDiv,÷)	// ≡/ ÷
m_chord_(Space,U+FEFF)	// or maybe U+2060 would be better, but my fb chat phone app does not render it right
// misc that i have used in programming
chord(.,;,…,)	// .; … ↔
chord(=,/,≠,)	// =/ ≠ ↔
m_chord(=,≡)	// ≡= ≡
chord(=,\,≢,)	// =\ ≢ ↔
chord(=,C,≤,)	// =, ≤ ↔
chord(=,.,≥,)	// =. ≥ ↔
m_chord([,‹)	// ≡[ ‹
m_chord(],›)	// ≡] ›
// greek . roughly ≡[a-z3] except cqvw
#define greek(k,u,l) AppsKey & k::#n if GetKeyState("shift") #n Send {U(u)} #n else Send {U(l)} #n return
greek(a,Α,α)
greek(b,Β,β)
greek(g,Γ,γ)
greek(d,Δ,δ)
greek(e,Ε,ε)
greek(z,Ζ,ζ)
greek(j,Η,η)
greek(h,Θ,θ)
greek(i,Ι,ι)
greek(k,Κ,κ)
greek(l,Λ,λ)
greek(m,Μ,μ)
greek(n,Ν,ν)
greek(3,Ξ,ξ)
//greek(,Ο,ο)
greek(p,Π,π)
greek(r,Ρ,ρ)
greek(s,Σ,σ)
greek(t,Τ,τ)
greek(u,Υ,υ)
greek(f,Φ,φ)
greek(x,Χ,χ)
greek(y,Ψ,ψ)
greek(o,Ω,ω)
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
chord(a,6,ᵃ) // a6 ᵃ
chord(b,6,ᵇ) // b6 ᵇ
chord(c,6,ᶜ) // c6 ᶜ
chord(d,6,ᵈ) // d6 ᵈ
chord(e,6,ᵉ) // e6 ᵉ
chord(f,6,ᶠ) // f6 ᶠ
chord(g,6,ᵍ) // g6 ᵍ
chord(h,6,ʰ) // h6 ʰ
chord(i,6,ⁱ) // i6 ⁱ
chord(j,6,ʲ) // j6 ʲ
chord(k,6,ᵏ) // k6 ᵏ
chord(l,6,ˡ) // l6 ˡ
chord(m,6,ᵐ) // m6 ᵐ
chord(n,6,ⁿ) // n6 ⁿ
chord(o,6,ᵒ) // o6 ᵒ
chord(p,6,ᵖ) // p6 ᵖ
chord(r,6,ʳ) // r6 ʳ
chord(s,6,ˢ) // s6 ˢ
chord(t,6,ᵗ) // t6 ᵗ
chord(u,6,ᵘ) // u6 ᵘ
chord(v,6,ᵛ) // v6 ᵛ
chord(w,6,ʷ) // w6 ʷ
chord(x,6,ˣ) // x6 ˣ
chord(y,6,ʸ) // y6 ʸ
chord(z,6,ᶻ) // z6 ᶻ
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
// make appskey-mode not break on undefined chars in [a-z0-9]
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

// run apps
AppsKey & ;:: #n if WinExist("ahk_class ConsoleWindowClass") #n WinActivate #n return
AppsKey & QUOTE::
	if WinExist("ahk_class ConsoleWindowClass") {
		WinActivate
		Send {Up}{Enter}
		}
	return
AppsKey &  RCtrl::Send {Launch_Media}
~RCtrl & AppsKey::Send {Launch_Media}
AppsKey & Enter::
	if WinExist("Calculator"){#n WinActivate #n}
	else {#n Run calc #n}
	return
AppsKey & /::
	SetTitleMatchMode, 2
	if WinExist("Chrome"){#n WinActivate #n Send ^t #n}
	return
AppsKey & \::
	Send ^c
	SetTitleMatchMode, 2
	if WinExist("Chrome"){#n WinActivate #n Send ^t #n Send ^v{Enter} #n}
	return

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

send_copy:
	if WinActive("ahk_class ConsoleWindowClass")
		Send {Enter}
	else
		Send ^c
	return

send_paste:
	if WinActive("ahk_class ConsoleWindowClass")
		Send {RButton}
	else
		Send ^v
	return
###SingleInstance force
###NoEnv
SendMode Input

// todo: consider making menukey sticky, like F8
// ≁ ≔≕ ′″‴

// MACRO_DISPATCH (copied from hydrocarboner)
#define PASTE2(a,b) a ## b
#define PASTE2_2(a,b) PASTE2(a,b)
#define ARG_16(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,n,...) n
#define __VA_LEN__(...)   ARG_16(0,##__VA_ARGS__,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
#define MACRO_DISPATCH(fn,...) PASTE2_2(fn,__VA_LEN__(__VA_ARGS__))(__VA_ARGS__)

#define title_explorer "ahk_class CabinetWClass"
#define title_cmd "ahk_class ConsoleWindowClass"

// register callbacks
setTimer, kill_rename, -1
return

// define callbacks
kill_rename: #n WinWaitActive, Rename ahk_class #32770 #n Send y #n setTimer, kill_rename, -1 #n return

// autoclick
#define autoclick_n(key,n) key::#n Loop, n { Click #n Sleep, 1 } return
autoclick_n(^F1,10)
autoclick_n(^F2,100)
F3::#n if autoclick_on=t #n{ autoclick_on=n #n setTimer, autoclick, Off }
	else { autoclick_on=t #n setTimer, autoclick, 1 } return
autoclick: #n Click #n return

// run apps
open_cmd_in_here()#n {
	WinGetText, v, A
	StringSplit, v, v, `n
	Loop, %v0% { IfInString, v%A_Index%, Address #n {
		v := v%A_Index% #n break } }
	v := RegExReplace(v, "^Address: ", "")
	StringReplace, v, v, `r, , all
	If( not InStr( FileExist(v), "D") ) { v := "C:\Users\zii\skryl\code" }
	Run, cmd /K cd /D "%v%"
}
AppsKey & /::#n if WinExist(title_cmd) { WinActivate #n Send {Up}{Enter} } else { open_cmd_in_here() } return
AppsKey & ;::    #n if WinExist(title_cmd)    && !GetKeyState("shift") { WinActivate } else { open_cmd_in_here() } return
AppsKey & Enter::#n if WinExist("Calculator") && !GetKeyState("shift") { WinActivate } else { Run calc           } return
AppsKey &  RCtrl::Send {Launch_Media}
~RCtrl & AppsKey::Send {Launch_Media}
AppsKey & \::#n if GetKeyState("shift") {            SetTitleMatchMode, 2 #n if WinExist("Chrome"){ WinActivate #n Send ^t          }
} else {                                  Send ^c #n SetTitleMatchMode, 2 #n if WinExist("Chrome"){ WinActivate #n Send ^t^v{Enter} }
} return

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
###If WinActive(title_cmd) || WinActive("Calculator") || WinActive(title_explorer)
^w::WinClose, A
Esc::WinClose, A
###If
AppsKey & n::Send {AppsKey}wt^a // new text file
LCtrl & Capslock::Send ^+{Tab}
~Capslock & LCtrl::Send {Capslock}^+{Tab}

// insert unicode
#define U(c) UNICODE c
#define C #,
#define B SC029
#define Q QUOTE
#define chord(...) MACRO_DISPATCH(chord,##__VA_ARGS__)
#define chord_(x,y,c) ~x & y::Send `b{U(c)}
#define chord3(x,y,c) chord_(x,y,c)
#define chord4(x,y,c,_) chord_(x,y,c) #n chord_(y,x,c)
#define m_chord(x,c) AppsKey & x::Send {U(c)} // menu chord
#define c_chord(x,c,_) ~Capslock & x::Send {Capslock}{U(c)} #n chord_(x,Capslock,c) // capslock chord
#define m_chord_(x,c) AppsKey & x::Send {c}
#define chord_shift(x,y,l,u) ~x & y::#n if GetKeyState("shift") #n Send `b{U(u)} #n else Send `b{U(l)} #n return
#define m_chord_shift(x,l,u) AppsKey & x::#n if GetKeyState("shift") #n Send {U(u)} #n else Send {U(l)} #n return
// misc
chord(B,=,≈,)			// `= ≈ ↔
chord(B,\,≉,)			// `\ ≉ ↔
chord(C,;,∴)			// ,; ∴ ↔
m_chord(8,∞)			// ≡8 ∞
m_chord(v,✓)			// ≡v ✓
m_chord_shift(Q,‘,“)	// ≡' ‘ ⇧“
m_chord(NumpadSub,−)	// ≡− −
m_chord(NumpadMult,×)	// ≡× ×
m_chord(NumpadDiv,÷)	// ≡÷ ÷
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
F8::#n Input, k, L1,{Escape}{LControl}{RControl}{LShift}{RShift}{LAlt}{RAlt}{LWin}{RWin}{Backspace}{Tab}{Enter}{Space}{Delete}{Insert}{Home}{End}{PgUp}{PgDn}{Up}{Down}{Left}{Right}{CapsLock}{NumLock}{ScrollLock}{PrintScreen}{CtrlBreak}{Pause}{Sleep}{F1}{F2}{F3}{F4}{F5}{F6}{F7}{F8}{F9}{F10}{F11}{F12}
// did not have keyboard with ⌘Command ⌥Option ⎄Compose ⏏Eject or any other cool key, so did not implement these keys
// had difficulty implementing ≣MenuKey so we'll just go with ≡MenuKey, which we can already input with ≡=
// ⌘Win and ⎇Alt are known to do weird things
	if Errorlevel=Max #n Send %k%
	else if InStr(ErrorLevel,"EndKey:") {
		k := SubStr(ErrorLevel,8)
		if k=placeholder #n Send nothing
#define chord_f8(c,name,before,after) else if k=name #n { before #n Send {U(c)} #n after }
//#define chord_f8_s(s,name,before,after) else if k=name #n { before #n Send s #n after }
// modifiers
chord_f8(^	,LControl,,)	// → F8^ ^	// Ctrl
chord_f8(^	,RControl,,)	// → F8^ ^	// Ctrl
chord_f8(⎇	,LAlt,msgbox,)	// → F8⎇ ⎇	// Alt
chord_f8(⎇	,RAlt,msgbox,)	// → F8⎇ ⎇	// Alt
chord_f8(⇧	,LShift,,)		// → F8⇧ ⇧	// Shift
chord_f8(⇧	,RShift,,)		// → F8⇧ ⇧	// Shift
chord_f8(⌘	,LWin,,)		// → F8⌘ ⌘	// Win
chord_f8(⌘	,RWin,,)		// → F8⌘ ⌘	// Win
// simple text
chord_f8(␣	,Space,,)		// → F8␣ ␣		// Space
chord_f8(↹	,Tab,,)			// → F8↹ ↹		// Tab
chord_f8(⏎	,Enter,,)		// → F8⏎ ⏎		// Enter
chord_f8(⌦	,Delete,,)		// → F8⌦ ⌦	// Delete
chord_f8(⌫	,Backspace,,)	// → F8⌫ ⌫	// Backspace
// locks
chord_f8(⇪	,CapsLock,,SetCapsLockState Off)	// → F8⇪ ⇪	// CapsLock
chord_f8(⇩	,NumLock,,SetNumLockState On)		// → F8⇩ ⇩	// NumLock
chord_f8(⇳	,ScrollLock,,SetScrollLockState Off)// → F8⇳ ⇳	// ScrollLock
// navigation
chord_f8(⇱	,Home,,)	// → F8⇱ ⇱	// Home
chord_f8(⇲	,End,,)		// → F8⇲ ⇲	// End
chord_f8(⇞	,PgUp,,)	// → F8⇞ ⇞	// PgUp
chord_f8(⇟	,PgDn,,)	// → F8⇟ ⇟	// PgDn
// special
chord_f8(⌤	,Insert,,)		// → F8⌤ ⌤	// Insert
chord_f8(⎋	,Escape,,)		// → F8⎋ ⎋	// Escape
chord_f8(⎙	,PrintScreen,,)	// → F8⎙ ⎙	// PrintScreen
chord_f8(⎉	,Pause,,)		// → F8⎉ ⎉	// Pause
chord_f8(⎊	,CtrlBreak,,)	// → F8⎊ ⎊	// Break
// arrows
chord_f8(↑	,Up,,)		// → F8↑ ↑	// Up
chord_f8(↓	,Down,,)	// → F8↓ ↓	// Down
chord_f8(←	,Left,,)	// → F8← ←	// Left
chord_f8(→	,Right,,)	// → F8→ →	// Right
// function keys
chord_f8(F1	,F1,,)	// → F8F1 F1	// F1
chord_f8(F2	,F2,,)	// → F8F2 F2	// F2
chord_f8(F3	,F3,,)	// → F8F3 F3	// F3
chord_f8(F4	,F4,,)	// → F8F4 F4	// F4
chord_f8(F5	,F5,,)	// → F8F5 F5	// F5
chord_f8(F6	,F6,,)	// → F8F6 F6	// F6
chord_f8(F7	,F7,,)	// → F8F7 F7	// F7
chord_f8(F8	,F8,,)	// → F8F8 F8	// F8
chord_f8(F9	,F9,,)	// → F8F9 F9	// F9
chord_f8(F10,F10,,)	// → F8F10 F10	// F10
chord_f8(F11,F11,,)	// → F8F11 F11	// F11
chord_f8(F12,F12,,)	// → F8F12 F12	// F12
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
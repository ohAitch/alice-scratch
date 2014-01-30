###SingleInstance force
SendMode Input

#define PASTE2(a,b) a ## b
#define PASTE2_2(a,b) PASTE2(a,b)
#define ARG_16(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,n,...) n
#define __VA_LEN__(...)   ARG_16(0,##__VA_ARGS__,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
#define MACRO_DISPATCH(fn,...) PASTE2_2(fn,__VA_LEN__(__VA_ARGS__))(__VA_ARGS__)

; autoclick
#define autoclick_n(key,n) key::#n Loop, n {#n Click #n Sleep, 1 #n} #n return
autoclick_n(^F1,10)
autoclick_n(^F2,100)
^F3::setTimer, autoclick, 1
^F4::setTimer, autoclick, Off
autoclick: #n Click #n return

; sound controls
AppsKey & Right::Send {Volume_Up}
AppsKey & Left::Send {Volume_Down}
AppsKey & Down::Send {Volume_Mute}
AppsKey & Up::Send {Media_Play_Pause}
AppsKey & ,::Send {Media_Prev}
AppsKey & .::Send {Media_Next}

; do things
AppsKey & RAlt::WinMinimize, A
~RAlt & AppsKey::WinMinimize, A
AppsKey & n::Send {AppsKey}w{Down}{Down}{Down}{Down}{Down}{Down}{Down}{Enter}`b
LCtrl & Capslock::Send ^+{Tab}
RCtrl & Capslock::Send ^+{Tab}

; insert unicode
#define U(c) U+UNICODE c
#define C #,
#define B SC029
#define chord(...) MACRO_DISPATCH(chord,##__VA_ARGS__)
#define chord_(x,y,c) ~x & y::Send `b{U(c)} ; x y :: c
#define chord3(x,y,c) chord_(x,y,c)
#define chord4(x,y,c,no) chord_(x,y,c) #n chord_(y,x,c)
#define echord_2(x,y,c,d) ~x & y::Send `b{U(c)}{U(d)} ; x y :: c
#define echord22(x,y,c,d) echord_2(x,y,c,d) #n echord_2(y,x,c,d)
chord(B,1,¬,)
chord(.,`;,…,)
chord(-,C,←,)
chord(-,.,→,)
chord(-,Left,←)
chord(-,Right,→)
chord(-,Up,↑)
chord(-,Down,↓)
chord(=,B,≈,)
chord(=,/,≠,)
chord(=,\,≢,)
chord(=,C,≤,)
chord(=,.,≥,)
chord(=,e,∈,)
chord(/,e,∉,)
chord(C,9,⊆,)
chord(.,0,⊇,)
chord([,Up,⌈)
chord([,Down,⌊)
chord(],Up,⌉)
chord(],Down,⌋)
#define nonprintkey_chord(k,c) AppsKey & k::Send {U(c)} ; ≡ k :: c
#define nonprintkey_chord_(k,c) AppsKey & k::Send {c} ; ≡ k :: c
nonprintkey_chord(8,×)
nonprintkey_chord(l,λ)
nonprintkey_chord(p,π)
nonprintkey_chord(s,σ)
nonprintkey_chord(t,τ)
nonprintkey_chord(e,∴)
nonprintkey_chord(a,∧)
nonprintkey_chord(o,∨)
nonprintkey_chord(y,✓)
nonprintkey_chord(=,≡)
nonprintkey_chord([,‹)
nonprintkey_chord(],›)
nonprintkey_chord_(Space,U+FEFF)
; or maybe U+2060 would be better, but my fb chat phone app does not render it right
chord(0,6,⁰)
chord(1,6,¹)
chord(2,6,²)
chord(3,6,³)
chord(4,6,⁴)
chord(5,6,⁵)
chord(6,AppsKey,⁶)
chord(7,6,⁷)
chord(8,6,⁸)
chord(9,6,⁹)
chord(+,6,⁺)
chord(-,6,⁻)
chord(0,5,₀)
chord(1,5,₁)
chord(2,5,₂)
chord(3,5,₃)
chord(4,5,₄)
chord(5,AppsKey,₅)
chord(6,5,₆)
chord(7,5,₇)
chord(8,5,₈)
chord(9,5,₉)
chord(+,5,₊)
chord(-,5,₋)
echord22(1,-,₋,₁)
chord(a,6,ᵃ)
chord(b,6,ᵇ)
chord(c,6,ᶜ)
chord(d,6,ᵈ)
chord(e,6,ᵉ)
chord(f,6,ᶠ)
chord(g,6,ᵍ)
chord(h,6,ʰ)
chord(i,6,ⁱ)
chord(j,6,ʲ)
chord(k,6,ᵏ)
chord(l,6,ˡ)
chord(m,6,ᵐ)
chord(n,6,ⁿ)
chord(o,6,ᵒ)
chord(p,6,ᵖ)
chord(r,6,ʳ)
chord(s,6,ˢ)
chord(t,6,ᵗ)
chord(u,6,ᵘ)
chord(v,6,ᵛ)
chord(w,6,ʷ)
chord(x,6,ˣ)
chord(y,6,ʸ)
chord(z,6,ᶻ)
chord(a,5,ₐ)
chord(e,5,ₑ)
chord(h,5,ₕ)
chord(i,5,ᵢ)
chord(j,5,ⱼ)
chord(k,5,ₖ)
chord(l,5,ₗ)
chord(m,5,ₘ)
chord(n,5,ₙ)
chord(o,5,ₒ)
chord(p,5,ₚ)
chord(r,5,ᵣ)
chord(s,5,ₛ)
chord(t,5,ₜ)
chord(u,5,ᵤ)
chord(v,5,ᵥ)
chord(x,5,ₓ)

; run apps
AppsKey & `;:: #n if WinExist("ahk_class ConsoleWindowClass") #n WinActivate #n return
AppsKey & '::
;'
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

;~LButton::
;	MouseGetPos, mouse1x, mouse1y
;	KeyWait, LButton
;	MouseGetPos, mouse2x, mouse2y
;	if abs(mouse1x-mouse2x) > 3 or abs(mouse1y-mouse2y) > 3
;		gosub send_copy
;	else {
;		KeyWait, LButton, D T0.3
;		if ErrorLevel = 0
;			gosub send_copy
;	}
;	return

;~MButton Up::
;	if A_Cursor = IBeam #n gosub send_paste
;	return

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
(ns sure)
(require '[clojure.string :as str])
(use 'batteries)
(require '[ansi_console :as esc])
(require 'run)
(use 'clojure.data.priority-map)

; skipped: mipmaps
; bug: window blinks in at upper-left sometimes

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; misc general ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
;;;;;  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  ;;;;;

(d nsn ← (. *ns* getName) (defn r[] (eval `(d (use '~nsn :reload-all) ~'(main)))))

(defn sys-time[] ‹(double (System/nanoTime)) / 1000000000›)
(def load-time (sys-time))
(defn app-time[] ‹(sys-time) - load-time›)

;;;;; un-dup

(defn interpose-out[sep coll] (concat [sep] (interpose sep coll) [sep]))

(defn init-loops[] (if →loops (mapv run/cancel @loops)) (def loops (atom [])))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; misc specific ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn namegen[]
	(apply str (map #(rand-nth (case % \a "abcdefghijklmnopqrstuvwxyz" \c "bcdfghjklmnpqrstvwxz" \v "aeiouy" \0 "0123456789" " "))
		(rand-nth [
			"  a  "
			" c v "
			"cv cv"
			" cvc "
			"cvcvc"
			"cv  a"
			"a  cv"
			" cv0 "
			"a  00"
			]))))
(defn in-bounds[[x y]] (and ‹0 ≤ x› ‹x < 13› ‹0 ≤ y› ‹y < 9›))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; main ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn bobgen[p] {
	:name (str (esc/fg (rand-nth "12359abc")) (namegen) esc/basic)
	:spirit (atom 10)
	:pos (atom p)
	:soul (λ[grid-up grid-down self]
		(if (¬ @(self :body)) (d
			near ← (filter #(in-bounds ‹@(self :pos) ++ %›) [[1 0] [-1 0] [0 1] [0 -1]])
			near-bobs ← (filter #‹@(grid-up ‹@(self :pos) ++ %›)› near)
			near-space ← (filter #(¬ @(grid-up ‹@(self :pos) ++ %›)) near)
			(cond
				(seq near-bobs) [:attack (rand-nth near-bobs)]
				‹(seq near-space) and ‹(rand) < 0.1›› [:move (rand-nth near-space)]
				:else [:mine]
				))))
	:body (atom nil)
	})

(defn main[] (d
	(init-loops)

	(def grid-up (atom {}))
	(def grid-down (atom {}))
	(dotimes [y 9] (dotimes [x 13] (swap! grid-up   assoc [x y] (atom nil))))
	(dotimes [y 9] (dotimes [x 13] (swap! grid-down assoc [x y] (atom 50))))

	(def souls (atom []))

	; display
	(def cell-str [
		#(str (esc/fg :green) (if @(@grid-up %) (@(@grid-up %) :name) "     ") esc/basic)
		#(if @(@grid-up %) (format (str"q"(esc/fg :cyan+)"%4d"esc/basic) ⌈@(@(@grid-up %) :spirit)⌉) "     ")
		#(d % "     ")
		#(d % "     ")
		#(format (str"*"(esc/fg :cyan)"%3d"esc/basic"*") @(@grid-down %))
		])
	(swap! loops conj (run/repeat 0.1 (λ[]
		; format and print
		(print (esc/go-to 0 0))
		(println (str/join (map #(str % "\n")
			(apply concat (interpose-out
				[(str/join (interpose-out "-" (repeat 13 "-----")))]
				(map #(map #(str/join (interpose-out "|" %)) %)
					; map grid to strings
					(for [y (range 9)] (for [i (range 5)] (for [x (range 13)] ((cell-str i) [x y]))))
					)
				))
			)))
		)))
	(swap! loops conj (run/repeat 5 (λ[] (print esc/clear))))

	; random bob gen
	(swap! loops conj (run/repeat 0.5 (λ[] (d
		pos ← [⌊(rand 13)⌋ ⌊(rand 9)⌋]
		(swap! (@grid-up pos) #(or % (d t ← (bobgen pos) (swap! souls conj t) t)))
		))))
	
	; bobs are brains
	; bobs can think and use their bodies at any time
	; physics has rules
	; but, bobs are physics
	; we represented waiting as an action! this is wrong. very wrong.

	; physics
	(swap! loops conj (run/every 0.1 (λ[]
		; run souls
		(doseq [soul @souls] (d
			action ← ((soul :soul) @grid-up @grid-down soul)
			(if action (reset! (soul :body) action))
			))
		; run rest of physics
		; death
		(swap! souls #(remove (λ[soul] (d
			(if ‹@(soul :spirit) < 0› (throw (derp "negative spirit!" soul)))
			r ← ‹@(soul :spirit) = 0›
			(if r (reset! (@grid-up @(soul :pos)) nil))
			r)) %))
		; soul actions
		(doseq [soul @souls] (d
			body ← (soul :body)
			pos ← (soul :pos)
			(cond
				; clear to wait?
				(¬ @body) nil
				‹(@body 0) = :attack› (d
					atk ← ‹@pos ++ (@body 1)›
					(if ‹‹@(soul :spirit) ≥ 1› and @(@grid-up atk)› (d
						(swap! (soul :spirit) - 1)
						(swap! (@(@grid-up atk) :spirit) #(max ‹% - %2› 0) 2)
						(reset! body [:wait (atom 1/10)])
					) (d
						(reset! body nil)
					)))
				‹(@body 0) = :move› (d
					move ← ‹@pos ++ (@body 1)›
					(if ‹‹@(soul :spirit) ≥ 0.1› and (¬ @(@grid-up move))› (d
						(swap! (soul :spirit) - 0.1)
						(reset! (@grid-up move) soul)
						(reset! (@grid-up @pos) nil)
						(reset! pos move)
						))
					(reset! body nil)
					)
				‹(@body 0) = :mine› (d
					(if ‹‹@(soul :spirit) ≥ 0.1› and ‹@(@grid-down @pos) ≥ 1›› (d
						(swap! (soul :spirit) - 0.1)
						(swap! (@grid-down @pos) - 1)
						(swap! (soul :spirit) + 1)
						))
					(reset! body nil)
					)
				‹(@body 0) = :wait›
					(if ‹(swap! (@body 1) - 1/10) ≤ 0›
						(reset! body nil))
				:else (throw (derp "unknown action" soul))
				)))
		)))
	nil))
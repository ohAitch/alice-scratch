(ns sure)
(require '[clojure.string :as str])
(use 'batteries)
(require '[ansi_console :as esc])
(require 'run)
(use 'clojure.data.priority-map)

; skipped: mipmaps
; bug: window blinks in at upper-left sometimes

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; misc ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
;;;;;  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  ;;;;;

(d nsn ← (. *ns* getName) (defn r[] (eval `(d (use '~nsn :reload-all) ~'(main)))))

(defn sys-time[] ‹(double (System/nanoTime)) / 1000000000›)
(def load-time (sys-time))
(defn app-time[] ‹(sys-time) - load-time›)

;;;;; un-dup

(defn interpose-out[sep coll] (concat [sep] (interpose sep coll) [sep]))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; <edge> ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

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
(defn bobgen[p] {:name (str (esc/fg (rand-nth "12359abc")) (namegen) esc/basic) :spirit (atom 10) :pos (atom p)})
(defn in-bounds[[x y]] (and ‹0 ≤ x› ‹x < 13› ‹0 ≤ y› ‹y < 9›))

(defn init-loops[] (if →loops (mapv run/cancel @loops)) (def loops (atom [])))

(defn main[] (d
	(init-loops)

	(def grid-up (atom {}))
	(def grid-down (atom {}))
	(def cell-str [
		#(str (esc/fg :green) (if @(@grid-up %) (@(@grid-up %) :name) "     ") esc/basic)
		#(if @(@grid-up %) (format (str"q"(esc/fg :cyan+)"%4d"esc/basic) ⌈@(@(@grid-up %) :spirit)⌉) "     ")
		#(if @(@grid-up %) (apply format "%2d %2d" @(@(@grid-up %) :pos)) "     ")
		#(d % "     ")
		#(format (str"*"(esc/fg :cyan)"%3d"esc/basic"*") @(@grid-down %))
		])
	(dotimes [y 9] (dotimes [x 13] (swap! grid-up   assoc [x y] (atom nil))))
	(dotimes [y 9] (dotimes [x 13] (swap! grid-down assoc [x y] (atom 50))))

	(def gtime (atom 0))
	(def events (atom (priority-map)))

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
	(swap! loops conj (run/repeat 3 (λ[] (print esc/clear))))
	(swap! loops conj (run/repeat 0.5 (λ[] (d
		pos ← [⌊(rand 13)⌋ ⌊(rand 9)⌋]
		(swap! (@grid-up pos) #(or % (d t ← (bobgen pos) (swap! events assoc t 0) t)))
		))))
	(swap! loops conj (run/every 0.1 (λ[]
		(swap! gtime + 1/10)
		; buggy as fuck . the whole iteration is dumb
		(while ‹(seq @events) and ‹((peek @events) 1) ≤ @gtime›› (d
			bob ← ((peek @events) 0) (swap! events pop)
			pos ← (bob :pos)
			near-bobs ← (filter #‹@(@grid-up %)› (filter in-bounds (map #‹% ++ @pos› [[1 0] [-1 0] [0 1] [0 -1]])))
			near-space ← (filter #(¬ @(@grid-up %)) (filter in-bounds (map #‹% ++ @pos› [[1 0] [-1 0] [0 1] [0 -1]])))
			(if ‹‹@(bob :spirit) ≥ 1› and (seq near-bobs)› (d
				(swap! (@(@grid-up @pos) :spirit) - 1)
				(swap! (@(@grid-up (rand-nth near-bobs)) :spirit) - 2)
				(swap! events assoc bob ‹@gtime + 1/10›)
			) (if ‹@(bob :spirit) ≥ 0.1› (d
				(if ‹(rand) < 0.9›
					(if ‹@(@grid-down @pos) > 0› (d
						(swap! (@(@grid-up @pos) :spirit) - 0.1)
						(swap! (@grid-down @pos) - 1)
						(swap! (@(@grid-up @pos) :spirit) + 1)
						))
					(if (seq near-space) (d
						(swap! (@(@grid-up @pos) :spirit) - 0.1)
						nxt ← (rand-nth near-space)
						(reset! (@grid-up nxt) bob)
						(reset! (@grid-up @pos) nil)
						(reset! pos nxt)
						))
					)
				(swap! events assoc bob ‹@gtime + 1/10›)
			) (if ‹@(bob :spirit) ≥ 0› (d
				(swap! events assoc bob ‹@gtime + 1/10›)
			) (d
				(reset! (@grid-up @pos) nil)
			))))
			))
		)))
	nil))
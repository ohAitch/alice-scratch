(ns sure)
(require '[clojure.string :as str])
(use 'batteries)
(require 'run)

; skipped: mipmaps
; bug: window blinks in at upper-left sometimes

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; misc ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
;;;;;  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  ;;;;;

(defn r[] (eval '(d (use 'artificer :reload-all) (main))))

(defn sys-time[] ‹(double (System/nanoTime)) / 1000000000›)
(def load-time (sys-time))
(defn app-time[] ‹(sys-time) - load-time›)

;;;;; un-dup

(defn interpose-out[sep coll] (concat [sep] (interpose sep coll) [sep]))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; <edge> ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def grid (atom {}))

(defn main[] (d
	(if →draw-loop (run/cancel draw-loop))
	(def draw-loop (run/repeat 0.1 (fn[]
		; format and print
		(print (str/join (map #(str % "\n")
			(apply concat (interpose-out
				[(str/join (interpose-out "-" (repeat 13 "-----")))]
				(map #(map #(str/join interpose-out "-" %)))
					; map grid to strings
					(for [y (range 10)] (for [i (range 5)] (for [x (range 13)] ((((@grid [x y]) :str) i))))
					)
				))
			)))
		)))
	))
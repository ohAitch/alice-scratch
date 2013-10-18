(ns life)
(require '[clojure.string :as str])
(use 'batteries)
(require 'run)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
;;;;;  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  ;;;;;
(d nsn ← (. *ns* getName) (defn r[] (eval `(d (use '~nsn :reload-all) ~'(main)))))
(defn init-loops[] (if →loops (mapv run/cancel @loops)) (def loops (atom [])))
;;;;; un-dup

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; generic utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(use 'clojure.java.io)
(defn read-image[path] (javax.imageio.ImageIO/read (file path)))
(defn write-image[bi path] (javax.imageio.ImageIO/write bi (subs (str path) (- (. (str path) length) 3)) (file path)))
(defn datestr[] (. (java.text.SimpleDateFormat. "yyyy-MM-dd HH.mm.ss") format (java.util.Date.)))
(def _robot (java.awt.Robot.))
(defn print-screen[] (. _robot createScreenCapture (java.awt.Rectangle. 0 0 1920 1080)))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; specific utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn bi=[a b] (d
	[a b] ← (map #(. (. (. % getRaster) getDataBuffer) getData) [a b])
	(java.util.Arrays/equals a b)))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; main ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def screens-dir (str (System/getenv "SKRYL")"/history/screens/"))

(defn capture[] (write-image (print-screen) (str screens-dir (datestr)".png")))

(defn realign[a b] (if ‹(read-image a) bi= (read-image b)› (d (. (file b) delete) a) b))
(defn realign-all[] (d
	a ← (atom nil)
	(doseq [b (vec (. (file screens-dir) listFiles))]
		(if ‹@a is nil› (reset! a b) (reset! a (realign @a b))))
	))
(defn realign-last[] (apply realign (slice (sort (map #(. % getAbsolutePath) (. (file screens-dir) listFiles))) -2 / /)))

(defn main[] (init-loops) (swap! loops conj (run/repeat 10 #(d (capture) (realign-last)))) nil)

;(defn mouse-loc[] (#(d [(. % x) (. % y)]) (. (java.awt.MouseInfo/getPointerInfo) getLocation)))
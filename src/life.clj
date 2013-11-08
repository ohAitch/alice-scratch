; usage:
; call (main) once
; call (nightly) daily

(ns life)

(require '[clojure.string :as str])
(use 'clojure.java.io)
(use '[clojure.walk :only (postwalk)])

(use 'batteries)
(require 'run)

; todo:
; write timestamp to files? graphically?
; record idle, filter by idle (instead of current hack, maybe?)
; call (nightly) automatically

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

;;;;;  THE FOLLOWING MATERIAL IS DUPLICATED ELSEWHERE  ;;;;;
(d nsn ← (. *ns* getName) (defn r[] (eval `(d (use '~nsn :reload-all) ~'(main)))))
(defn init-loops[] (if →loops (mapv run/cancel @loops)) (def loops (atom [])))
(defn bi[x y] (java.awt.image.BufferedImage. x y java.awt.image.BufferedImage/TYPE_INT_ARGB))
(defn bi-x[me] (. me getWidth))
(defn bi-y[me] (. me getHeight))
(defn bi-pixels[me] (-> me (.getRaster) (.getDataBuffer) (.getData)))
(defn bi-ensure-int-array[me]
  (if (isa (bi-pixels me) (Class/forName "[I"))
    me
    (let [r (bi (bi-x me) (bi-y me))]
      (. me getRGB 0 0 (bi-x me) (bi-y me) (bi-pixels r) 0 (bi-x me))
      r)))
;;;;; un-dup
(defn bi-size[me] [(bi-x me) (bi-y me)])

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; generic utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn ensure-folder-exists[f] (-> f (.getParent) (file) (.mkdir)) f)
(defn read-image[path] (javax.imageio.ImageIO/read (file path)))
(defn write-image[bi path] (javax.imageio.ImageIO/write bi (subs (str path) (- (. (str path) length) 3)) (ensure-folder-exists (file path))))
(defn datestr[format] (. (java.text.SimpleDateFormat. format) format (java.util.Date.)))
(defn AWT_TK[] (java.awt.Toolkit/getDefaultToolkit))
(defn SCREEN_SIZE[] (d t ← (. (AWT_TK) getScreenSize) [(. t getWidth) (. t getHeight)]))
(def _robot (java.awt.Robot.))
(defn print-screen[] (d [x y] ← (SCREEN_SIZE) (. _robot createScreenCapture (java.awt.Rectangle. 0 0 x y))))

(defn print-input-stream[v] (d br ← (java.io.BufferedReader. (java.io.InputStreamReader. v)) (run/in 0 #(while-letd ‹v ← (. br readLine)› (println v))) ))

(defn exec-blocking[cmd dir] (d
	t ← (-> (ProcessBuilder. (. cmd split " "))
		(.directory (file dir))
		(.start))
	(print-input-stream (. t getInputStream))
	(print-input-stream (. t getErrorStream))
	(. t waitFor)
	))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; specific utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn bi=[a b] (d
	; breaks if a and b have different data buffer formats
	[a b] ← (map #(. (. (. % getRaster) getDataBuffer) getData) [a b])
	(java.util.Arrays/equals a b)))

(defn read-image-int[path] (bi-ensure-int-array (read-image path)))

; scale pixel sizes for different screens
(defn px[v] v)
(defn px2[v] v)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; main ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def screens-dir (str (System/getenv "SKRYL")"/history/screens/"))

(defn capture[] (write-image (print-screen) (str screens-dir (datestr "yyyy-MM-dd/HH.mm.ss.'png'"))))
(defn main[] (init-loops) (swap! loops conj (run/repeat 10 #(capture))) nil)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; compression ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn filter-duplicates[dir] (d
	i ← (atom 0)
	ai ← (atom nil)
	(doseq [bf (sort (. (file dir) list))] (d
		(println "filtering" (swap! i inc))
		bf ← (file dir bf)
		bi ← (read-image-int bf)
		(if ‹‹@ai ≢ nil› and ‹‹(bi-size @ai) ≠ (bi-size bi)› or ‹@ai bi= bi› or ‹(image.transform/px_array_diff_count (bi-pixels @ai) (bi-pixels bi)) < (px2 100000)›››
			(. bf delete)
			(reset! ai bi)
			)))
	))

(defn compress[dir] (d
	timestamps ← (str/join "\n" (map #(subs % 0 8) (sort (. (file dir) list))))
	i ← (atom -1)
	(doseq [f (sort (. (file dir) list))]
		(. (file dir f) renameTo (file dir (format "%08d.png" (swap! i inc)))))
	(exec-blocking "ffmpeg -r 10 -i %08d.png -vcodec ffv1 -pix_fmt yuv420p images.avi" dir)
	(doseq [f (. (file dir) list)] (if (. f endsWith ".png") (. (file dir f) delete)))
	(spit (file dir "timestamps.txt") timestamps)
	))
(defn decompress[dir] (d
	timestamps ← (slurp (file dir "timestamps.txt"))
	(exec-blocking "ffmpeg -i images.avi -an %08d.png" dir)
	(. (file dir "images.avi") delete)
	(. (file dir "timestamps.txt") delete)
	(mapv (λ[f n] (. (file dir f) renameTo (file dir n)))
		(sort (. (file dir) list))
		(map #(str %".png") (. timestamps split "\n")))
	))

(defn nightly
	([]
		(if-let [v (last (remove #(. (file (file screens-dir %) "images.avi") exists) (drop 1 (reverse (sort (. (file screens-dir) list))))))]
			(nightly (file screens-dir v))
			(println "no uncompressed directories found before the last directory!")))
	([dir] (filter-duplicates dir) (compress dir))
	)

(ns life)
(require '[clojure.string :as str])
(use 'batteries)
(require 'run)

; todo:
; detect translation, recoloration, other simple transformations
; http://en.wikipedia.org/wiki/FFV1 ?

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

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; generic utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(use 'clojure.java.io)
(defn read-image[path] (javax.imageio.ImageIO/read (file path)))
(defn write-image[bi path] (javax.imageio.ImageIO/write bi (subs (str path) (- (. (str path) length) 3)) (file path)))
(defn datestr[] (. (java.text.SimpleDateFormat. "yyyy-MM-dd HH.mm.ss") format (java.util.Date.)))
(defn AWT_TK[] (java.awt.Toolkit/getDefaultToolkit))
(defn SCREEN_SIZE[] (d t ← (. (AWT_TK) getScreenSize) [(. t getWidth) (. t getHeight)]))
(def _robot (java.awt.Robot.))
(defn print-screen[] (d [x y] ← (SCREEN_SIZE) (. _robot createScreenCapture (java.awt.Rectangle. 0 0 x y))))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; specific utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn bi=[a b] (d
	[a b] ← (map #(. (. (. % getRaster) getDataBuffer) getData) [a b])
	(java.util.Arrays/equals a b)))
(defn bi-merge=r[a b] (image.transform/px_array_merge_Er (bi-pixels a) (bi-pixels b)) b)
(defn bi-mask[v mask] (d r ← (bi (bi-x v) (bi-y v)) (image.transform/px_array_mask (bi-pixels v) mask (bi-pixels r)) r))
(defn bi-mask=[v mask] (image.transform/px_array_mask_E (bi-pixels v) mask) v)
(defn bi-diff-mask[a b] (image.transform/px_array_diff_mask (bi-pixels a) (bi-pixels b)))
(defn mask-add-borders[mask] (d [X Y] ← (SCREEN_SIZE) (image.transform/mask_add_borders mask X Y)))

(defn read-image-int[path] (bi-ensure-int-array (read-image path)))

; scale pixel sizes for different screens
(defn px[v] v)
(defn px2[v] v)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; main ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def screens-dir (str (System/getenv "SKRYL")"/history/screens/"))

(defn capture[] (write-image (print-screen) (str screens-dir (datestr)".png")))

(defn realign[ai bf] (d
	bi ← (read-image-int bf)
	del ← #(d (. (file bf) delete) ai)
	(if ‹ai bi= bi›
		(del)
		(d	mask ← (bi-diff-mask ai bi)
			sum ← (image.transform/bool_array_sum mask)
			(cond
				‹sum < (px2 100000)› (del)
				‹sum < (px2 500000)› (d (write-image (bi-mask bi (mask-add-borders mask)) bf) bi)
				:else bi
				)))))
;(defn realign-f[af bf] (realign (read-image-int af) bf))
(defn realign-all[] (d
	i ← (atom 0)
	ai ← (atom nil)
	(doseq [bf (vec (. (file (str screens-dir"../screens0")) listFiles))]
		(println "realigning" (swap! i inc))
		(if ‹@ai is nil› (reset! ai (read-image-int bf)) (reset! ai (realign @ai bf))))
	))
(defn realign-last[] );(apply realign-f (slice (sort (map #(. % getAbsolutePath) (. (file screens-dir) listFiles))) -2 / /)))

(defn main[] (init-loops) (swap! loops conj (run/repeat 10 #(d (capture) (realign-last)))) nil)

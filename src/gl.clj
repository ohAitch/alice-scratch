(ns gl)
(require '[clojure.string :as str])
(use 'batteries)
;(require '[gl.texture :as tex])
;(use 'penbra.opengl.core)

(System/setProperty "org.lwjgl.input.Mouse.allowNegativeMouseCoords" "true")

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; swing utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

;(defn intersect-1d [[x x2] [x' x2']] ‹‹x ≤ x2'› and ‹x' ≤ x2››)
;(defn intersect-2d [[x x2 y y2] [x' x2' y' y2']] ‹(intersect-1d [x y] [x' y']) and (intersect-1d [x2 y2] [x2' y2'])›)

(defn screen-size[] (d v ← (-> (java.awt.Toolkit/getDefaultToolkit) (.getScreenSize)) [(. v width) (. v height)]))
(defn- inset-borders [v] (d v ← (. v getInsets) [‹(. v right) + (. v left)› ‹(. v top) + (. v bottom)›]))
(defn- inset-topleft [v] (d v ← (. v getInsets) [(. v left) (. v top)]))
(defn inner-size [container] ‹[(. container getWidth) (. container getHeight)] -+ (inset-borders container)›)
(defn inner-size! [container size] (d [w h] ← ‹size ++ (inset-borders container)›) (. container setSize w h)))
(defn center-window-on-screen! [window] (d
	[x y] ← ‹(screen-size) D+ 2› -+ (inner-size window) D+ 2› -+ (inset-topleft window)›
	(. window setLocation x y)))

;;;
; basic drawing fns
(def basic-font-tex
  (let [v (cache (atom nil))]
    (fn
      ([] ‹@v or (reset! v (tex/mk "font.png"))›)
      ([name] (reset! v (tex/mk name)))
      )))
(defn basic-draw-rect! [dims & {:keys [with]}]
  (gl,disable :texture-2d) ;! use tex properly
  (if with (gl,push-matrix))
    (if with (with))
    (gl,begin :quads)
      (gl,vertex-3f 0        0        0)
      (gl,vertex-3f (dims 0) 0        0)
      (gl,vertex-3f (dims 0) (dims 1) 0)
      (gl,vertex-3f 0        (dims 1) 0)
    (gl,end)
  (if with (gl,pop-matrix))
  (gl,enable :texture-2d)
  )
(defn basic-draw-string! [s & {:keys [with]}]
  (doseq-indexed [y line (split-lines s)]
    (if with (gl,push-matrix))
      (if with (with))
      (dotimes [i (len line)]
        (let [td [7 12]
              dst (sid ‹[i y] *+ td›)
              c (. line charAt i)
              idxs (remquot (int c) 16)
              src1 (sid ‹idxs *+ td›)
              src [src1 ‹src1 ++ td›]]
          (tex/basic-draw! (basic-font-tex) src :with #(gl,translatef (dst 0) (dst 1) 0))
          ))
    (if with (gl,pop-matrix))
    ))
(defn basic-draw-ansi-colored-string! [s colors & {:keys [with]}]
  (if with (gl,push-matrix))
    (if with (with))
    (dotimes [i (len s)]
      (let [td [7 12]
            dst ‹[i 0] *+ td›
            c ‹s .charAt i›
            idxs (remquot (int c) 16)
            src1 ‹idxs *+ td›
            src [src1 ‹src1 ++ td›]
            col (colors i)
            col-fg (if col (col 0) [0.75 0.75 0.75])
            col-bg (if col (col 1))]
        (gl,push-matrix)
        (gl,translatef (dst 0) (dst 1) 0)
          (do-if col-bg
            (gl,color3f (col-bg 0) (col-bg 1) (col-bg 2))
            (basic-draw-rect! td))
          (gl,color3f (col-fg 0) (col-fg 1) (col-fg 2))
          (tex/basic-draw! (basic-font-tex) src)
        (gl,pop-matrix)
        ))
  (if with (gl,pop-matrix))
  )
;;;
; this section is kinda penumbra.app
(def-atom rqueue empty-queue)
(defn queue-gl [f] (swap! rqueue conj f))

(defn reshape []
	(gl,viewport 0 0 (@→window-dims 0) (@window-dims 1))
	(→use-projection @current-projection)
	)

(def-atom current-projection) ; type: atom<atom<?>>
(def-atom default-3d-projection)
(def-atom default-2d-projection)
(defn use-projection [acode]
  (reset! current-projection acode)
  (gl,matrix-mode :projection)
  (gl,load-identity)
  (@acode)
  (gl,matrix-mode :modelview)
  )
(defn use-3d-projection [] (use-projection default-3d-projection))
(defn use-2d-projection [] (use-projection default-2d-projection))

(defn glclj-init[]
	(reset! →current-projection →default-3d-projection)
	(reset! gl.window/size-dirty true)

	(gl,enable :blend)
	(gl,blend-func :src-alpha :one-minus-src-alpha) ; "standard transparency blending function"
	(gl,enable :alpha-test)
	(gl,alpha-func :greater 0)
	(gl,fogi :fog-mode :exp2)
	(gl,depth-func :lequal)
	)
(defn glclj-draw[]
	(if (get-set! gl.window/size-dirty false)
		(gl,viewport 0 0 (@→gl.window/size 0) (@gl.window/size 1))
		(→use-projection @current-projection)
		)
	
	(org.lwjgl.opengl.Display/update false)
	(org.lwjgl.opengl.Display/processMessages) ; separated from call to org.lwjgl.opengl.Display/update because the idea was to allow for faster keyboard polling than main rendering fps
	;ukuku.gfx.KeyIn.poll()
	;ukuku.gfx.Mice.poll()
	;ukuku.gfx.KeyIn.flushEventQueue()
	
	;(gl,clear ‹(enum :color-buffer-bit) bit| (enum :depth-buffer-bit)›)
	;;
	;(while (peek @rqueue)
	;	((peek @rqueue))
	;	(swap! rqueue pop))
	)

(ns gl.window)
	(def size (atom [800 600]))
	(def title "gl app")
	(def init #())
	(def draw #())
	(def size-dirty (atom false))
(ns gl) (require 'gl.window)

(defn window[& {:keys [init draw size title]}] (d
	(.? gl.window/jframe dispose)

	(if size (def' gl.window/size (atom size)))
	(if title (def' gl.window/title title))
	(if init (def' gl.window/init init))
	(if draw (def' gl.window/draw draw))

	;(reset! default-3d-projection #(do (gl,enable  :depth-test) (glu,perspective 85 ‹(@(@r :size) 0) dD (@(@r :size) 1)› 0.1 4000)))
	;(reset! default-2d-projection #(do (gl,disable :depth-test) (gl,ortho 0 (@(@r :size) 0) (@(@r :size) 1) 0 -1000 1000)))
	;(reset! current-projection default-3d-projection)

	quit-gl ← (atom false)
	jcanvas ← (d
		$ ← (proxy [java.awt.Canvas] []
			(addNotify[] (proxy-super addNotify) (. gl.window/thread start))
			(removeNotify[] (reset! quit-gl true) (. gl.window/thread join) (proxy-super removeNotify)))
		(. $ setIgnoreRepaint true) ; is cargoculty (tho it shouldn't hurt)
		$)
	(def' gl.window/thread (d
		$ ← (Thread.
			#(if (¬ @quit-gl) (d
				(org.lwjgl.opengl.Display/setParent jcanvas)
				(org.lwjgl.opengl.Display/create)
				(glclj-init) (gl.window/init)
				;! implement fps limit and counter and stuff with better stuff later ; e.g. the while loop right there would probably be better less imperative
				(while (not @quit-gl)
					(glclj-draw) (gl.window/draw))
				(org.lwjgl.opengl.Display/destroy)
				))
			"Thread-OpenGL")
		(. $ setDaemon true)
		$))
	(def' gl.window/jframe (d
		$ ← (java.awt.Frame. gl.window/title)
		(. $ addWindowListener
			(proxy [java.awt.event.WindowAdapter] []
				(windowClosing[event] (reset! quit-gl true) (. gl.window/thread join) (. $ dispose))))
		(. $ add jcanvas)
		(. $ setVisible true)
		; now that the OS has made the window and given us insets for the window, we can size it accurately:
		(inner-size! $ @gl.window/size)
		(center-window-on-screen! $)
		; now that the window has been sized:
		(. $ addComponentListener
			(proxy [java.awt.event.ComponentAdapter] []
				(componentResized[event] (reset! gl.window/size (inner-size $)) (reset! gl.window/size-dirty true))))
		$))
	r))
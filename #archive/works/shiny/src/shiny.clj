(ns shiny
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  
  (:use penbra.opengl.core)
  (:require [shiny.texture :as tex])
  )
;;;
;! current: OKAY WHAT SHOULD WE DO ABOUT PREMULTIPLICATION
;! penbra /defdoc.*nil/ ; maybe even /def.*nil/
;;;
; pointers to brain
;    ACM meeting shiny screen with lights and pretty
;    soaring 3d built on lisp
;    built on lisp built on Unsafe
;    lisp-funge (wut)
;    beautiful caves and forests and... well, I don't think of pandora, i think of beautiful minecraft classic levels, like those caves and that jungle and those cities
;;;
(System/setProperty "org.lwjgl.input.Mouse.allowNegativeMouseCoords" "true")
;;;
; misc
(defn screen-size [] (let [v (-> (java.awt.Toolkit/getDefaultToolkit) (.getScreenSize))] [(. v width) (. v height)]))
;
(defn intersect-1d [[x x2] [x' x2']] ‹‹x <= x2'› and ‹x' <= x2››)
(defn intersect-2d [[x x2 y y2] [x' x2' y' y2']] ‹(intersect-1d [x y] [x' y']) and (intersect-1d [x2 y2] [x2' y2'])›)
;
(defn- inset-borders [v] [‹‹v .right› + ‹v .left›› ‹‹v .top› + ‹v .bottom››])
(defn- inset-topleft [v] [‹v .left› ‹v .top›])
(defn inner-size [container] ‹[‹container .getWidth› ‹container .getHeight›] -+ (inset-borders ‹container .getInsets›)›)
(defn inner-size! [container dims] (let [[w h] (sid ‹dims ++ (inset-borders ‹container .getInsets›)›)] ‹container .setSize w h›))
(defn center-window-on-screen! [window]
  (let [[x y] (sid ‹‹(screen-size) D+ 2› -+
                    ‹(inner-size window) D+ 2› -+
                    (inset-topleft ‹window .getInsets›)›)]
    (. window setLocation x y)))
;;;
; basic drawing fns
(def basic-font-tex
  (let [v (cache (atom nil))]
    (fn
      ([] ‹@v or (aset! v (tex/mk "font.png"))›)
      ([name] (aset! v (tex/mk name)))
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
(def-atom window-is-dirty false)
(def-atom rqueue empty-queue)
(defn queue-gl [f] (swap! rqueue conj f))
;
(defn init-fn []
  (if-not (-> (org.lwjgl.opengl.GLContext/getCapabilities) (.GL_ARB_vertex_buffer_object))
    (print "It says that VBOs are not supported. Oh my!"))

  (aset! #>current-projection #>default-3d-projection)
  (aset! window-is-dirty true)

  (gl,enable :blend)
  (gl,blend-func :src-alpha :one-minus-src-alpha) ; "standard transparency blending function"
  (gl,enable :alpha-test)
  (gl,alpha-func :greater 0)
  (gl,fogi :fog-mode :exp2)
  (gl,depth-func :lequal)
 
  ;GL-NEAREST, GL-LINEAR, GL-LINEAR_MIPMAP_NEAREST
  ;makeShader()
  )
(defn reshape []
  (gl,viewport 0 0 (@#>window-dims 0) (@window-dims 1))
  (#>use-projection @current-projection)
  )
(defn draw-fn []
  (if (get-set! window-is-dirty false) (reshape))
  ;
  (org.lwjgl.opengl.Display/update false)
  (org.lwjgl.opengl.Display/processMessages) ; separated from call to org.lwjgl.opengl.Display/update because the idea was to allow for faster keyboard polling than main rendering fps
  ;ukuku.gfx.KeyIn.poll()
  ;ukuku.gfx.Mice.poll()
  ;ukuku.gfx.KeyIn.flushEventQueue()
  ;
  (gl,clear ‹(enum :color-buffer-bit) bit| (enum :depth-buffer-bit)›)
  ;
  (while (peek @rqueue)
    ((peek @rqueue))
    (swap! rqueue pop))
  ;
  ;(gl,disable :texture-2d)
  ;(gl,color-4f 0.5 0.3 0.4 1)
  ;(gl,begin :triangles)
  ;  (gl,vertex-3f 0 0 0)
  ;  (gl,vertex-3f 260 50 0)
  ;  (gl,vertex-3f 200 300 0)
  ;(gl,end)
  ;(gl,color-4f 1 1 1 1)
  ;(gl,enable :texture-2d)
  ;
  ;(tex/basic-draw! font-tex [0 0] [[7 12] [‹7 + 7› ‹12 + 12›]] [1 1])
  ;(tex/bind-none!)
  )
;
(def-atom current-projection) ; type: atom<atom<?>>
(def-atom default-3d-projection)
(def-atom default-2d-projection)
(defn use-projection [acode]
  (aset! current-projection acode)
  (gl,matrix-mode :projection)
  (gl,load-identity)
  (@acode)
  (gl,matrix-mode :modelview)
  )
(defn use-3d-projection [] (use-projection default-3d-projection))
(defn use-2d-projection [] (use-projection default-2d-projection))
;
(defn run
  "params:
   :init fn[]
   :draw fn[]
   :dims
   :title"
  [& {:keys [init draw dims title]}] (dool
  
  (-?> @(defonce window nil) (.dispose))

  (def-atom window-dims ‹dims or [800 600]›)
  (aset! default-3d-projection #(do (gl,enable  :depth-test) (glu,perspective 85 ‹(@window-dims 0) dD (@window-dims 1)› 0.1 4000)))
  (aset! default-2d-projection #(do (gl,disable :depth-test) (gl,ortho 0 (@window-dims 0) (@window-dims 1) 0 -1000 1000)))
  (aset! current-projection default-3d-projection)

  init <- ‹init or init-fn›
  draw <- ‹draw or draw-fn›
  quit-rt <- (atom false)

  gl-canvas <-
    (proxy [java.awt.Canvas] []
      (addNotify [] (proxy-super addNotify) (. #>render-thread start))
      (removeNotify [] (aset! quit-rt true) (. render-thread join) (proxy-super removeNotify)))
  (. gl-canvas setIgnoreRepaint true) ; shouldn't hurt, might increase fps slightly, but i don't really know what this is for

  (def render-thread
    (Thread.
      #(do-if-not @quit-rt
         (org.lwjgl.opengl.Display/setParent gl-canvas)
         (org.lwjgl.opengl.Display/create)
         (init)
         ;! implement fps limit and counter and stuff with better stuff later ; e.g. the while loop right there would probably be better less imperative
         (while (not @quit-rt)
           (draw))
         (org.lwjgl.opengl.Display/destroy)
         )
      "Thread-OpenGL"))
  (. render-thread setDaemon true)

  (def window (java.awt.Frame. ‹title or "Star Whistle"›))
  (. window addWindowListener
    (proxy [java.awt.event.WindowAdapter] []
      (windowClosing [event] (aset! quit-rt true) (. render-thread join) (. window dispose))))
  (. window add gl-canvas)
  (. window setVisible true)
  ; now that the OS has made the window and given us insets for the window, we can size it accurately:
  (inner-size! window @window-dims)
  (center-window-on-screen! window)
  ; now that the window has been sized:
  (. window addComponentListener
    (proxy [java.awt.event.ComponentAdapter] []
      (componentResized [event] (aset! window-dims (inner-size window)) (aset! window-is-dirty true))))
  ))
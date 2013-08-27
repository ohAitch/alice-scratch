(ns gl)
(require '[clojure.string :as str])
(use 'batteries)

(System/setProperty "org.lwjgl.input.Mouse.allowNegativeMouseCoords" "true")

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; swing utils ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

;- (defn intersect-1d [[x x2] [x' x2']] ‹‹x ≤ x2'› and ‹x' ≤ x2››)
;- (defn intersect-2d [[x x2 y y2] [x' x2' y' y2']] ‹(intersect-1d [x y] [x' y']) and (intersect-1d [x2 y2] [x2' y2'])›)

(defn screen-size[] (d v ← (. (java.awt.Toolkit/getDefaultToolkit) getScreenSize) [(. v width) (. v height)]))
(defn _inset-borders [v] (d v ← (. v getInsets) [‹(. v right) + (. v left)› ‹(. v top) + (. v bottom)›]))
(defn _inset-topleft [v] (d v ← (. v getInsets) [(. v left) (. v top)]))
(defn inner-size [container] ‹[(. container getWidth) (. container getHeight)] -+ (_inset-borders container)›)
(defn inner-size! [container size] (d [w h] ← ‹size ++ (_inset-borders container)› (. container setSize w h)))
(defn center-window-on-screen! [window] (d
	[x y] ← ‹‹(screen-size) D+ 2› -+ ‹(inner-size window) D+ 2› -+ (_inset-topleft window)›
	(. window setLocation x y)))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; gl macro ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def gl-containers (concat
	(map #(eval (symbol (str "org.lwjgl.opengl."%))) '[
		GL20 GL15 GL14 GL13 GL12 GL11 GL30 GL31 GL32 GL33 GL40 GL41 GL42 GL43
		APPLEFloatPixels
		ARBDrawBuffers
		ARBTextureFloat
		ARBHalfFloatPixel
		ARBFramebufferObject
		EXTFramebufferObject
		NVFloatBuffer
		ATITextureFloat
		EXTTextureRectangle
		ARBTextureRectangle
		EXTTransformFeedback
		EXTGeometryShader4
		])
	(map #(eval (symbol (str "org.lwjgl.util.glu."%))) '[GLU Project Registry MipMap])
	))
(def gl-enum      (into {} (map #‹[(. % getName) (. % get nil)          ]› (mapcat #(. % getFields ) gl-containers)))) ; name=name implies value=value
(def gl-container (into {} (map #‹[(. % getName) (. % getDeclaringClass)]› (mapcat #(. % getMethods) gl-containers)))) ; name=name implies value=value
(defmacro gl[name & …] (d
	name ← (str "gl"name)
	c ← ‹(gl-container name) or (throw (ex "did not find gl function" name))›
	`(. ~c ~(symbol name) ~@(map #‹(gl-enum %) or (gl-enum (str "GL_"%)) or %› …))))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; window code ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

;- (def-atom rqueue empty-queue)
;- (defn queue-gl [f] (swap! rqueue conj f))

(defn glclj-init[]
	(reset! →projection-current →projection-3d')
	(reset! →window-size-dirty true)

	(gl,Enable BLEND)
	(gl,BlendFunc SRC_ALPHA ONE_MINUS_SRC_ALPHA) ; "standard transparency blending function"
	(gl,Enable ALPHA_TEST)
	(gl,AlphaFunc GREATER 0)
	(gl,Fogi FOG_MODE EXP2)
	(gl,DepthFunc LEQUAL)
	)
(defn glclj-draw[]
	(if (get-set! window-size-dirty false)
		(gl,Viewport 0 0 (@→window-size 0) (@window-size 1))
		(→projection-run @→projection-current)
		)
	
	(org.lwjgl.opengl.Display/update false)
	(org.lwjgl.opengl.Display/processMessages) ; separated from call to org.lwjgl.opengl.Display/update because the idea was to allow for faster keyboard polling than main rendering fps
	;- ukuku.gfx.KeyIn.poll()
	;- ukuku.gfx.Mice.poll()
	;- ukuku.gfx.KeyIn.flushEventQueue()
	
	;- (gl,Clear ‹(gl-enum GL_COLOR_BUFFER_BIT) bit| (gl-enum GL_DEPTH_BUFFER_BIT)›)
	;- ;
	;- (while (peek @rqueue)
	;- 	((peek @rqueue))
	;- 	(swap! rqueue pop))
	)

(def window-size (atom [800 600]))
(def window-title "gl app")
(def window-init #())
(def window-draw #())
(def window-size-dirty (atom false))

(def projection-3d' #(d (gl,Enable  DEPTH_TEST) (gl,uPerspective 85 (double ‹(@window-size 0) / (@window-size 1)›) 0.1 4000)))
(def projection-2d' #(d (gl,Disable DEPTH_TEST) (gl,Ortho 0 (@window-size 0) (@window-size 1) 0 -1000 1000)))
(def projection-current (atom projection-3d'))
(defn projection-run[f]
	(reset! projection-current f)
	(gl,MatrixMode PROJECTION)
	(gl,LoadIdentity)
	(f)
	(gl,MatrixMode MODELVIEW)
	)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; window api ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn projection-3d[] (projection-run projection-3d'))
(defn projection-2d[] (projection-run projection-2d'))

(defn window[& {:keys [init draw size title]}] (d
	(.? →window-jframe dispose)

	(if size (def window-size (atom size)))
	(if title (def window-title title))
	(if init (def window-init init))
	(if draw (def window-draw draw))

	quit-gl ← (atom false)
	gl-thread ← (atom nil) ; forward-declared
	jcanvas ← (d
		$ ← (proxy [java.awt.Canvas] []
			(addNotify[] (proxy-super addNotify) (. @gl-thread start))
			(removeNotify[] (reset! quit-gl true) (. @gl-thread join) (proxy-super removeNotify)))
		(. $ setIgnoreRepaint true) ; is cargoculty (tho it shouldn't hurt)
		$)
	(reset! gl-thread (d
		$ ← (Thread.
			#(if (¬ @quit-gl) (d
				(org.lwjgl.opengl.Display/setParent jcanvas)
				(org.lwjgl.opengl.Display/create)
				(glclj-init)
				(window-init)
				;! implement fps limit and counter and stuff with better stuff later ; e.g. the while loop right there would probably be better less imperative
				(while (not @quit-gl)
					(glclj-draw)
					(window-draw))
				(org.lwjgl.opengl.Display/destroy)
				)))
		(. $ setName "Thread-OpenGL")
		(. $ setDaemon true)
		$))
	(def window-jframe (d
		$ ← (java.awt.Frame. window-title)
		(. $ addWindowListener
			(proxy [java.awt.event.WindowAdapter] []
				(windowClosing[event] (reset! quit-gl true) (. @gl-thread join) (. $ dispose))))
		(. $ add jcanvas)
		(. $ setVisible true)
		; now that the OS has made the window and given us insets for the window, we can size it accurately:
		(inner-size! $ @window-size)
		(center-window-on-screen! $)
		; now that the window has been sized:
		(. $ addComponentListener
			(proxy [java.awt.event.ComponentAdapter] []
				(componentResized[event] (reset! window-size (inner-size $)) (reset! window-size-dirty true))))
		$))
	nil))
(ns gl)
(require '[clojure.string :as str])
(use 'batteries)
(use '[clojure.walk :only (postwalk)])

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

; private
(def gl-containers (concat
	(map #(eval (symbol (str "org.lwjgl.opengl."%))) '[GL20 GL15 GL14 GL13 GL12 GL11 GL30 GL31 GL32 GL33 GL40 GL41 GL42 GL43 APPLEFloatPixels ARBDrawBuffers ARBFramebufferObject ARBHalfFloatPixel ARBTextureFloat ARBTextureRectangle ATITextureFloat EXTFramebufferObject EXTGeometryShader4 EXTTextureRectangle EXTTransformFeedback NVFloatBuffer])
	(map #(eval (symbol (str "org.lwjgl.util.glu."%))) '[GLU Project Registry MipMap])
	))
(def gl-enum (into {} (map #‹[(. % getName) (. % get nil)          ]› (mapcat #(. % getFields ) gl-containers)))) ; name=name implies value=value
(def gl-fn   (into {} (map #‹[(. % getName) (. % getDeclaringClass)]› (mapcat #(. % getMethods) gl-containers)))) ; name=name implies value=value

; api
(defn GLf[%] ‹(gl-enum %) or (gl-enum (str "GL_"%)) or %›)
(defmacro GL[%] (GLf %))
(defmacro gl[name & …] (d
	name ← (str "gl"name)
	c ← ‹(gl-fn name) or (throw (ex "did not find gl function" name))›
	`(. ~c ~(symbol name) ~@(postwalk #(if (symbol? %) (GLf %) %) …))))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; buffers ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

; private
(def primitive-type-table [
	[:byte   java.nio.ByteBuffer   #(org.lwjgl.BufferUtils/createByteBuffer   %) (Class/forName "[B") byte-array  ]
	[:char   java.nio.CharBuffer   #(org.lwjgl.BufferUtils/createCharBuffer   %) (Class/forName "[C") char-array  ]
	[:short  java.nio.ShortBuffer  #(org.lwjgl.BufferUtils/createShortBuffer  %) (Class/forName "[S") short-array ]
	[:int    java.nio.IntBuffer    #(org.lwjgl.BufferUtils/createIntBuffer    %) (Class/forName "[I") int-array   ]
	[:long   java.nio.LongBuffer   #(org.lwjgl.BufferUtils/createLongBuffer   %) (Class/forName "[J") long-array  ]
	[:float  java.nio.FloatBuffer  #(org.lwjgl.BufferUtils/createFloatBuffer  %) (Class/forName "[F") float-array ]
	[:double java.nio.DoubleBuffer #(org.lwjgl.BufferUtils/createDoubleBuffer %) (Class/forName "[D") double-array]])
(def arr-class-to-buf-ctor (into {} (map #‹[(% 3) (% 2)]› primitive-type-table)))
(def name-to-buf-ctor      (into {} (map #‹[(% 0) (% 2)]› primitive-type-table)))
(def buf-class-to-arr-ctor (into {} (map #‹[(% 1) (% 4)]› primitive-type-table)))

; api
(defn buf0[type len] ((name-to-buf-ctor type) len))
(defn buf[array] (doto ((arr-class-to-buf-ctor (class array)) (count array)) (.put array) (.rewind)))
(defn unbuf[buf] (d r ← ((buf-class-to-arr-ctor (class buf)) (. buf capacity)) (. buf get r) r))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; window private ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

;- (def-atom rqueue empty-queue)
;- (defn queue-gl [f] (swap! rqueue conj f))

(defn base-init[]
	(gl,Enable BLEND)
	(gl,BlendFunc SRC_ALPHA ONE_MINUS_SRC_ALPHA) ; "standard transparency blending function"
	(gl,Enable ALPHA_TEST)
	(gl,AlphaFunc GREATER 0)
	(gl,Fogi FOG_MODE EXP2)
	(gl,DepthFunc LEQUAL)
	)
(defn pre-draw[]
	(if (get-set! →window-size-dirty false) (d
		(gl,Viewport 0 0 (@→window-size 0) (@window-size 1))
		(@→projection-current)
		))
	
	;- (gl,Clear ‹COLOR_BUFFER_BIT bit| DEPTH_BUFFER_BIT›)
	
	;- (while (peek @rqueue)
	;- 	((peek @rqueue))
	;- 	(swap! rqueue pop))
	)
(defn post-draw[]
	(org.lwjgl.opengl.Display/update false)
	(org.lwjgl.opengl.Display/processMessages) ; separated from call to org.lwjgl.opengl.Display/update because the idea was to allow for faster keyboard polling than main rendering fps
	;- ukuku.gfx.KeyIn.poll()
	;- ukuku.gfx.Mice.poll()
	;- ukuku.gfx.KeyIn.flushEventQueue()
	)

(def window-size (atom [800 600]))
(def window-title "gl app")
(def window-init #())
(def window-draw #())
(def window-size-dirty (atom false))

(defn projection[f] (λ me[]
	(reset! →projection-current me)
	(gl,MatrixMode PROJECTION)
	(gl,LoadIdentity)
	(f)
	(gl,MatrixMode MODELVIEW)
	))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; window api ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(def projection-3d (projection (λ[] (gl,Enable  DEPTH_TEST) (gl,uPerspective 85 (double ‹(@window-size 0) / (@window-size 1)›) 0.1 4000))))
(def projection-2d (projection (λ[] (gl,Disable DEPTH_TEST) (gl,Ortho 0 (@window-size 0) (@window-size 1) 0 -1 1))))
(def projection-current (atom projection-2d))

(defn window[& {:keys [init draw size title]}] (d
	(.? →window-jframe dispose)
	(.? →window-thread join) ;! ?

	(if size (def window-size (atom size)))
	(if title (def window-title title))
	(if init (def window-init init))
	(if draw (def window-draw draw))

	quit-gl ← (atom false)
	jcanvas ← (d
		t ← (proxy [java.awt.Canvas] []
			(addNotify[] (proxy-super addNotify) (. window-thread start))
			(removeNotify[] (reset! quit-gl true) (. window-thread join) (proxy-super removeNotify)))
		(. t setIgnoreRepaint true) ; is cargoculty (tho it shouldn't hurt)
		t)
	(def window-thread (d
		t ← (Thread.
			#(if (¬ @quit-gl) (d
				(org.lwjgl.opengl.Display/setParent jcanvas)
				(org.lwjgl.opengl.Display/create)
				(base-init)
				(window-init)
				;! implement fps limit and counter and stuff with better stuff later ; e.g. the while loop right there would probably be better less imperative
				(while (not @quit-gl)
					(pre-draw)
					(window-draw)
					(post-draw))
				(org.lwjgl.opengl.Display/destroy)
				)))
		(. t setName "opengl")
		(. t setDaemon true)
		t))
	(def window-jframe (d
		t ← (java.awt.Frame. window-title)
		(. t addWindowListener
			(proxy [java.awt.event.WindowAdapter] []
				(windowClosing[event] (reset! quit-gl true) (. window-thread join) (. t dispose))))
		(. t add jcanvas)
		(. t setVisible true)
		; now that the OS has made the window and given us insets for the window, we can size it accurately:
		(inner-size! t @window-size)
		(center-window-on-screen! t)
		; now that the window has been sized:
		(. t addComponentListener
			(proxy [java.awt.event.ComponentAdapter] []
				(componentResized[event] (reset! window-size (inner-size t)) (reset! window-size-dirty true))))
		t))
	nil))
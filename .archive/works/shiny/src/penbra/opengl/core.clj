(ns penbra.opengl.core
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  )
;;;
;! you know that pretty lispy syntax we made for gl calls? yeah... that sucks. Standards are actually useful and stuff, and the algol syntax isn't even really bad at all.
;;;
(defmacro dep
  ([name] `(defn ~name [& any#] (throw (Exception. "DEP"))))
  ([name & rest] `(do (dep ~name) (dep ~@rest))))
;! kill `?
;;;
(defdoc ^:dynamic *program* nil "The current program bound by with-program")
;(defdoc ^:dynamic *uniforms* nil "Cached integer locations for uniforms (bound on a per-program basis)")
(defdoc ^:dynamic *attributes* nil "Cached integer locations for attributes (bound on a per-program basis)")
;;;
;(defdoc ^:dynamic *texture-pool* nil "A list of all allocated textures.  Unused textures can be overwritten, thus avoiding allocation.")
;;;
(def ^:dynamic *renderer* nil)
;(defdoc ^:dynamic *display-list* nil "Display list for framebuffer/blit rendering.")
;(defdoc ^:dynamic *frame-buffer* nil "The currently bound frame buffer")
;(defdoc ^:dynamic *read-format* nil "A function which returns the proper read format for a sequence type and tuple.")
;(defdoc ^:dynamic *render-to-screen?* false "Whether the current renderer only targets the screen.")
;(defdoc ^:dynamic *render-target* nil "The texture which is the main render target (GL_COLOR_ATTACHMENT0)")
;(defdoc ^:dynamic *layered-target?* false "Is the render target a layered texture?")
;(defdoc ^:dynamic *z-offset* nil "2-D slice of 3-D texture to render into.")
;;;
;(defdoc ^:dynamic *font-cache* nil "Where all the fonts are kept")
;(defdoc ^:dynamic *font* nil "Current font")
;;;
(defmacro tmp [] ;! need package import ;! need local import
  (mapv #(symstr "org.lwjgl.opengl."%)
    '(GL20 GL15 GL14 GL13 GL12 GL11 GL30 GL31 GL32 GL33 GL40 GL41 GL42
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
      )))
(def- gl-containers (tmp))
(def- glu-containers [org.lwjgl.util.glu.GLU org.lwjgl.util.glu.Project org.lwjgl.util.glu.Registry org.lwjgl.util.glu.MipMap])
(def- all-containers (vec (concat gl-containers glu-containers)))
;
(def- enums-gl (into {} (map #‹[‹% .getName› %]› (map-cat #‹% .getFields› all-containers)))) ; if two gl fields have the same name we know they have the same value
(defn-memo- enum' [k] (let [r (enums-gl (-> (str "GL_"(name k)) (.replace \- \_) (.toUpperCase)))] ‹r and (jcall r)›))
(ddefn enum [v] ":enum-name -> GL_ENUM_NAME"
  (if-not (keyword? v) v ‹(enum' v) or (throw (ex "did not find a gl enum for "v))›))
(def- methods-gl  (group-by #‹% .getName› (map-cat #‹% .getMethods› gl-containers )))
(def- methods-glu (group-by #‹% .getName› (map-cat #‹% .getMethods› glu-containers)))
;;;
(ddefmacro gl [name & args] "(gl,function-name :enum-name) -> (glFunctionName GL_ENUM_NAME)"
  (let [gl-name (#>dashes-to-camel-case (str "gl-"name))
        method ‹(first (methods-gl gl-name)) or (throw (ex "did not find gl function "gl-name))›] ; may not get the right method, but all we need it for is its getDeclaringClass
    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@(map enum args))))
(ddefmacro glu [name & args] "(glu,function-name :enum-name) -> (gluFunctionName GL_ENUM_NAME)"
  (let [gl-name (#>dashes-to-camel-case (str "glu-"name))
        method ‹(first (methods-glu gl-name)) or (throw (ex "did not find glu function "gl-name))›] ; may not get the right method, but all we need it for is its getDeclaringClass
    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@(map enum args))))
;;;
;! kill this section
(defn enum'' [k] ;! remove after verifying okay to
  (if-not (keyword? k) (throw (ex "wut "k)))
  (enum k))
(defmacro gl' [gl-name & args]
  (let [gl-name (name gl-name)
        method (sid ‹(first (methods-gl gl-name)) or (throw (ex "did not find gl function "gl-name))›)]
    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@(map enum args))))
(defmacro gl-import' ;! remove after verifying okay to
  "defs a macro named ~import-as that passes its args to the gl function ~import-from"
  [import-from import-as]
  `(defmacro ~import-as [& args#]
    `(gl' ~'~import-from ~@args#)))
(defmacro gl-import'- [import-from import-as] `(gl-import' ~import-from ~(assoc-meta import-as :private true))) ;! remove after verifying okay to
(defmacro gl-import'+ [import-from import-as] `(gl-import' ~import-from ~(assoc-meta import-as :skip-wiki nil))) ;! remove after verifying okay to
(defmacro gl-import [name] `(defmacro ~(symstr "gl-"name) [& args#] `(gl' ~'~name ~@args#)))
(defmacro gl-import- [import-from import-as] `(gl-import' ~import-from ~(assoc-meta import-as :private true)))
(defmacro gl-import+ [import-from import-as] `(gl-import' ~import-from ~(assoc-meta import-as :skip-wiki nil))) ;! remove after verifying okay to
;;;
;! move all these somewhere else
(defn dashes-to-camel-case [s] (-> s (str-replace #"-([a-zA-Z])" #‹(% 0) .toUpperCase›) (str-replace #"-" "")))
(defn camel-case-to-dashes [s] (-> s (str-replace #"([A-Z])" #(str "-"‹(% 0) .toLowerCase›)) (str-replace #"(\d)" #(str "-"(% 0)))))
(def type-buf-to-arr ;! need package import ;! need local import
  {java.nio.ByteBuffer   cla-bytes
   java.nio.CharBuffer   cla-chars
   java.nio.ShortBuffer  cla-shorts
   java.nio.IntBuffer    cla-ints
   java.nio.LongBuffer   cla-longs
   java.nio.FloatBuffer  cla-floats
   java.nio.DoubleBuffer cla-doubles})
(def type-arr-to-buf (into {} (map #‹[(second %) (first %)]› type-buf-to-arr)))
(defn buf-typed [array]
  (condp = (class array)
    cla-bytes   (org.lwjgl.BufferUtils/createByteBuffer   (len array))
    cla-chars   (org.lwjgl.BufferUtils/createCharBuffer   (len array))
    cla-shorts  (org.lwjgl.BufferUtils/createShortBuffer  (len array))
    cla-ints    (org.lwjgl.BufferUtils/createIntBuffer    (len array))
    cla-longs   (org.lwjgl.BufferUtils/createLongBuffer   (len array))
    cla-floats  (org.lwjgl.BufferUtils/createFloatBuffer  (len array))
    cla-doubles (org.lwjgl.BufferUtils/createDoubleBuffer (len array))
    ))
(defn buf [array] (doto (buf-typed array) (.put array) (.rewind)))
(defn buf-get [buf]
  (let [r (case (class buf)
            java.nio.ByteBuffer   (byte-array   ‹buf .capacity›)
            java.nio.CharBuffer   (char-array   ‹buf .capacity›)
            java.nio.ShortBuffer  (short-array  ‹buf .capacity›)
            java.nio.IntBuffer    (int-array    ‹buf .capacity›)
            java.nio.LongBuffer   (long-array   ‹buf .capacity›)
            java.nio.FloatBuffer  (float-array  ‹buf .capacity›)
            java.nio.DoubleBuffer (double-array ‹buf .capacity›)
            )]
    ‹buf .get r›
    r))
(defmacro gl-get [type pname arr-or-len]
  (let [; remember how case doesn't eval its keys.
        typea (case type, i 'int, f 'float, d 'double)
        typeb (case type, i 'integer, typea)
        got-array ‹(class arr-or-len) .isArray›
        len (if got-array (len arr-or-len) arr-or-len)]
    `(let [buf# (cache (buf (~(symstr typeb"-array") ~len)))]
       (gl,~(symstr "get-"typea) ~pname buf#)
       ~(if got-array
          `(do ‹buf .get arr-or-len› arr-or-len)
          `(buf-get buf)))))
;;;
; whyyyy did i waste my afternoon on this... it would have been beautiful... here's the remains...
;(defmacro gl [name & args] "(gl,function-name :enum-name) -> (glFunctionName (enum :enum-name)) ; only wraps in enum for glFunctionName's int params"
;  (let [gl-name (#>dashes-to-camel-case (str "gl-"name))
;        q (methods-gl gl-name)
;        _ (if (empty? q) (throw (ex "did not find gl function "gl-name)))
;        q (filter #‹(len (jparams %)) == (len args)› q)
;        _ (if (empty? q) (throw (ex "did not find gl function "gl-name" with "(len args)" params")))
;        qparams (tranpose (map jparams q))
;        args (map #(if ‹%2 has cla-int› `(enum ~%) %) args qparams)]
;    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~args)))
;(defmacro gl-fast [name & args] "only does argument type tests at compile-time"
;  (let [gl-name (#>dashes-to-camel-case (str "gl-"name))
;        method ‹(method-gl gl-name) or (throw (ex "did not find gl function "gl-name))›]
;    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@(map enum args))))
; ;;;
;(defmacro gl
;  "Call like (gl,get-double :modelview-matrix camera).
;   That goes to (GL11/glGetDouble GL11/GL_MODELVIEW_MATRIX camera).
;   If the slot for camera takes a java.nio.xxxBuffer, code is inserted so that if camera is an array stuff works."
;  [name & args]
;  (let [gl-name (#>dashes-to-camel-case (str "gl-"name))
;        q (methods-gl gl-name)
;        _ (if (empty? q) (throw (ex "did not find gl function "gl-name)))
;        q (filter #‹(len (jparams %)) == (len args)› q)
;        _ (if (empty? q) (throw (ex "did not find gl function "gl-name" with "(len args)" params")))
;        qparams (tranpose (map jparams q))
;        args (map #(if ‹%2 has cla-int› `(enum ~%) %) args qparams)]
;    (if (some is-buf (apply concat qparams))
;      ; then we have to hoist all the evaluation out of the gl call
;      (let [argpairs (map (fn [arg qparam]
;                            (let [arg-code ])
;                            [
;                              ; for each *potential* xxxBuffer, insert code to frob appropriate array
;                              (doseq [buf-type (filter-bufs qparam)]
;
;                                )
;                            ]
;                            )
;                       args qparams)
;            [argexps ends] (transpose argpairs)
;            names (apply gensym (range (len args)))]
;        `(let [~@(interleave names argexps)
;               r# (. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@names)]
;           ~@ends
;           r#))
;      ; else we don't (i feel like this is worth doing for efficiency, tho idk if compile-time or run-time)
;      `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~args))))
;; for each *potential* xxxBuffer, insert code to frob appropriate array
;_ (doseq-flat [qparam qparams
;               arg args]
;    (doseq [buf-type (filter-bufs qparam)]
;      (let [[sv sis-array sbuf] (apply gensym '(v is-array buf))]
;        (aset! code
;          `(let [~sv ~‹@arg›
;                 ~sis-array ‹~sv isa ...›
;                 ~sbuf (if ~sis-array (#>buf-typed ~sv) ~sv)
;                 r# ~‹@code›]
;             (if ~sis-array ‹~sbuf .get ~sv›)
;             r#))
;        (aset! arg sbuf)
;        alter arg.
;        )))
;(let [v# ~arg
;      is-array# ‹v# isa ...›
;      buf# (if is-array# (#>buf-typed v#) v#)
;      r (gl,...)]
;  (if is-array# ‹buf# .get v#›)
;  r)
;        (throw (ex "Warning: Boxing large ("num" elems) array into buffer."))
;        method ‹(method-gl gl-name) or (throw (ex "did not find gl function "gl-name))›]
;    `(. ~‹method .getDeclaringClass› ~(symbol gl-name) ~@(map enum args))))
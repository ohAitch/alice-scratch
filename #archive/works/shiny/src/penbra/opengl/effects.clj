(ns penbra.opengl.effects
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  (:use [penbra.opengl.core])
  (:import [org.lwjgl BufferUtils]))
;;;
(dep color light material fog render-mode with-render-mode)
;! this file needs more work
;;;
(defn gl-enable-high-quality-rendering!
  "Sets all flags and hints necessary for high quality rendering."
  []
  (gl,hint :point-smooth-hint :nicest)
  (gl,hint :line-smooth-hint :nicest)
  (gl,hint :polygon-smooth-hint :nicest)
  (gl,hint :fog-hint :nicest)
  (gl,hint :perspective-correction-hint :nicest)
  (gl,enable :point-smooth)
  (gl,enable :line-smooth)
  (gl,enable :polygon-smooth)
  (gl,blend-func :src-alpha-saturate :one))
;;;
(defn gl-color!
  "Calls glColor.  Values are normalized between 0 and 1."
  ([v] (apply color v))
  ([r g b] (gl,color-3d r g b))
  ([r g b a] (gl,color-4d r g b a)))
;;;
(defn gl-light!
  "Sets values for light 'num'.  Example:
   (light 0
     :position [1 1 1 0])"
  [num & params]
  (let [light-num (enum (keyword (str "light"num)))]
    (doseq [[property value] (partition 2 params)]
      (let [property (enum'' property)]
        (if (sequential? value)
          (gl,light light-num property (-> (BufferUtils/createFloatBuffer (len value)) (.put (float-array value)) .rewind))
          (gl,lightf light-num property value))))))
(defn gl-material!
  "Sets material values for 'side'.  Example:
   (material :front-and-back
     :ambient-and-diffuse [1 0.25 0.25 1])"
  [side & params]
  (let [side (enum'' side)]
    (doseq [[property value] (partition 2 params)]
      (let [property (enum'' property)]
        (if (sequential? value)
          (gl,material side property (-> (BufferUtils/createFloatBuffer (len value)) (.put (float-array value)) .rewind))
          (gl,materialf side property value))))))
(defn gl-fog!
  "Sets values for fog.  Example:
    (fog
     :fog-start 0
     :fog-end 10
     :fog-color [0 0 0 0])"
  [& params]
  (doseq [[property value] (partition 2 params)]
    (if (sequential? value)
      (gl,fog (enum'' property) (-> (BufferUtils/createFloatBuffer (len value)) (.put (float-array (map #(or (enum'' %) %) value))) .rewind))
      (gl,fogf (enum'' property) (if (keyword? value) (enum'' value) value)))))
;;;
;https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/Symbol.java
(defmacro def-with-gl [name get set] ; rename to def-with ;! move to lust?
  `(defmacro ~name [param# & body#]
    `(let [~'prev# ~'~get]
      ~(list ~@(map #(if ‹% = '%› 'param# (quote-fn %)) (do (print "hey you sexy girl~" set) (def j set) set)))
      (try
        ~@body#
        (finally
          ~'~(replace {'% `prev#} set))))))
;;;
(def-with-gl with-polygon-mode
  (gl,get-integer :polygon-mode)
  (gl,polygon-mode :front-and-back %))
  ; [mode] ... mode ?
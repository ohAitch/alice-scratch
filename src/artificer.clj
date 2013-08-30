(ns artificer)
(require '[clojure.string :as str])
(use 'batteries)
(use '[gl :only (gl GL buf0 buf unbuf)])

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; async ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

; private
(def timer-name (atom 0))
(def timer-pool (java.util.concurrent.Executors/newScheduledThreadPool 10
	(proxy [java.util.concurrent.ThreadFactory] [] (newThread[f] (d r ← (Thread. f (str "pool timer - "(swap! timer-name inc))) (. r setDaemon true) r)))))
(defn ex-wrap[f] (misc.$/_c_ex_wrap_ f (λ[ex] (d
	here ← (atom nil)
	(. ex setStackTrace (into-array (take-while #(d r ← (. (. % getClassName) endsWith "_c_ex_wrap_") (if r (reset! here %)) r) (vec (. ex getStackTrace)))))
	(print (str "Exception in thread \""(. (Thread/currentThread) getName)"\" "))
	(. ex printStackTrace)
	(println (str "\t at <pool> ("here")"))
	))))
; api
(defn run-in    [sec f] (. timer-pool schedule               (ex-wrap f)   (long ‹sec * 1000000000›) java.util.concurrent.TimeUnit/NANOSECONDS))
(defn run-repeat[sec f] (. timer-pool scheduleAtFixedRate    (ex-wrap f) 0 (long ‹sec * 1000000000›) java.util.concurrent.TimeUnit/NANOSECONDS))
(defn run-every [sec f] (. timer-pool scheduleWithFixedDelay (ex-wrap f) 0 (long ‹sec * 1000000000›) java.util.concurrent.TimeUnit/NANOSECONDS))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; <edge> ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn sys-time[] ‹(double (System/nanoTime)) / 1000000000›)
(def load-time (sys-time))
(defn app-time[] ‹(sys-time) - load-time›)

; skipped: mipmaps

(def hello-gl-v-glsl (str/join "\n" [
	"#version 110"
	"attribute vec2 position;"
	"varying vec2 texcoord;"
	"void main() {"
	"    gl_Position = vec4(position, 0.0, 1.0);"
	"    texcoord = position * vec2(0.5) + vec2(0.5);"
	"}"
	]))
(def hello-gl-f-glsl (str/join "\n" [
	"#version 110"
	"uniform float fade_factor;"
	"uniform sampler2D textures[2];"
	"varying vec2 texcoord;"
	"void main() {"
	"    gl_FragColor = mix("
	"        texture2D(textures[0], texcoord),"
	"        texture2D(textures[1], texcoord),"
	"        fade_factor);"
	"}"
	]))

; buffer
(def g-resources-vertex-buffer-id (atom 0))
(def g-resources-element-buffer-id (atom 0))
; texture
(def g-resources-texture-ids (atom [0 0]))
; shader
(def g-resources-vertex-shader (atom 0))
(def g-resources-fragment-shader (atom 0))
(def g-resources-program (atom 0))
(def g-resources-uniforms-fade-factor (atom 0))
(def g-resources-uniforms-textures (atom [0 0]))
(def g-resources-attributes-position (atom 0))
(def g-resources-fade-factor (atom 0.0))

(defn make-buffer[target buffer] (d
	id ← (gl,GenBuffers)
	(gl,BindBuffer target id)
	(gl,BufferData target buffer STATIC_DRAW)
	id))

;(def g-vertex-buffer-data (buf (float-array [-1 -1, 1 -1, -1 1, 1 1])))
(def g-vertex-buffer-data (buf (float-array [0 0, 400 0, 400 300, 0 300])))
(def g-element-buffer-data (buf (short-array (map short [0 1 2 3]))))

(require '[clojure.java.io :as io])
(defn read-image[file] (javax.imageio.ImageIO/read (io/file file)))

(defn make-texture[file] (d
	img ← (read-image file)
	[w h] ← [(. img getWidth) (. img getHeight)]
	data ← (buf (. img getRGB 0 0 w h nil 0 w))
	id ← (gl,GenTextures)
	(gl,BindTexture TEXTURE_2D id)
    (gl,TexParameteri TEXTURE_2D TEXTURE_MIN_FILTER LINEAR) ; options: NEAREST, LINEAR, mipmap stuff
    (gl,TexParameteri TEXTURE_2D TEXTURE_MAG_FILTER LINEAR)
    (gl,TexParameteri TEXTURE_2D TEXTURE_WRAP_S CLAMP_TO_EDGE) ; options: CLAMP_TO_EDGE, REPEAT
    (gl,TexParameteri TEXTURE_2D TEXTURE_WRAP_T CLAMP_TO_EDGE)
    (gl,TexImage2D TEXTURE_2D 0 RGBA8 w h 0 BGRA UNSIGNED_BYTE data)
    id))

(defn make-shader[type code] (d
	id ← (gl,CreateShader type)
	(gl,ShaderSource id code)
	(gl,CompileShader id)
	(if (= (gl,GetShaderi id COMPILE_STATUS) 0)
		(d	(println "shader compilation error")
			(println (gl,GetShaderInfoLog id 4096))
			(gl,DeleteShader id)
			0)
		id)))

(defn make-program[vertex-shader fragment-shader] (d
	id ← (gl,CreateProgram)
	(gl,AttachShader id vertex-shader)
	(gl,AttachShader id fragment-shader)
	(gl,LinkProgram id)
	(if (= (gl,GetProgrami id LINK_STATUS) 0)
		(d	(println "shader linking error")
			(println (gl,GetProgramInfoLog id 4096))
			(gl,DeleteProgram id)
			0)
		id)))

(defn make-resources[]
	; buffers
	(reset! g-resources-vertex-buffer-id (make-buffer (GL,ARRAY_BUFFER) g-vertex-buffer-data))
	(reset! g-resources-element-buffer-id (make-buffer (GL,ELEMENT_ARRAY_BUFFER) g-element-buffer-data))

	; textures
	(reset! g-resources-texture-ids [(make-texture "res/hello1.png") (make-texture "res/hello2.png")])

	; shaders
	(reset! g-resources-vertex-shader (make-shader (GL,VERTEX_SHADER) hello-gl-v-glsl))
	(reset! g-resources-fragment-shader (make-shader (GL,FRAGMENT_SHADER) hello-gl-f-glsl))
	(reset! g-resources-program (make-program @g-resources-vertex-shader @g-resources-fragment-shader))
	(reset! g-resources-uniforms-textures [(gl,GetUniformLocation @g-resources-program "textures[0]")
										   (gl,GetUniformLocation @g-resources-program "textures[1]")])
	(reset! g-resources-attributes-position (gl,GetUniformLocation @g-resources-program "position"))
	)

(defn render[] (d
    (gl,Enable TEXTURE_2D)
    (gl,BindTexture TEXTURE_2D (@g-resources-texture-ids 0))
	(gl,PushMatrix)
		(gl,Begin QUADS)
			(gl,TexCoord2f 0 0) (gl,Vertex2f 0   0  )
			(gl,TexCoord2f 1 0) (gl,Vertex2f 400 0  )
			(gl,TexCoord2f 1 1) (gl,Vertex2f 400 300)
			(gl,TexCoord2f 0 1) (gl,Vertex2f 0   300)
		(gl,End)
	(gl,PopMatrix)
	;(gl,UseProgram @g-resources-program)

	;(gl,Uniform1f @g-resources-uniforms-fade-factor @g-resources-fade-factor)

	;(gl,ActiveTexture TEXTURE0)
	;(gl,BindTexture TEXTURE_2D (@g-resources-texture-ids 0))
	;(gl,Uniform1i (@g-resources-uniforms-textures 0) 0)
	;(gl,ActiveTexture TEXTURE1)
	;(gl,BindTexture TEXTURE_2D (@g-resources-texture-ids 1))
	;(gl,Uniform1i (@g-resources-uniforms-textures 1) 1)

	;(gl,BindBuffer ARRAY_BUFFER @g-resources-vertex-buffer-id)
	;(gl,VertexAttribPointer @g-resources-attributes-position 2 FLOAT false ‹4 * 2› 0)
	;(gl,EnableVertexAttribArray @g-resources-attributes-position)

	;(gl,BindBuffer ELEMENT_ARRAY_BUFFER @g-resources-element-buffer-id)
	;(gl,DrawElements TRIANGLE_STRIP 4 UNSIGNED_SHORT 0)

	;(gl,DisableVertexAttribArray @g-resources-attributes-position)
	))

(defn main[] (d
	(def app-token (Object.)) ;! horrible hack
	t ← app-token
	(run-every 0.01 (λ[] (if ‹app-token ≡ t› (reset! g-resources-fade-factor ‹‹(Math/sin (app-time)) / 2› + 0.5›))))
	(gl/window :size [400 300] :title "@_@"
		:init (λ[]
			(make-resources)
			)
		:draw (λ[]
			(gl,Clear ‹COLOR_BUFFER_BIT bit| DEPTH_BUFFER_BIT›)
			(render)
			))
	))
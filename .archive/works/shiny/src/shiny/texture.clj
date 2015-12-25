(ns shiny.texture
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  
  (:use penbra.opengl.core)
  (:use [clojure.java.io :only (input-stream)])
  )
;;;
;! do we really need to align textures with get2fold?
;! integrate into openumbra (or similar if openumbra is not a goal)
;;;
; state
(def-atom- bound-tex)
;;;
; helper fns
(defn-memo- color-model [alpha]
  (java.awt.image.ComponentColorModel.
    (java.awt.color.ColorSpace/getInstance java.awt.color.ColorSpace/CS_sRGB)
    (int-array [8 8 8 (if alpha 8 0)])
    alpha
    false
    (if alpha
      java.awt.image.ComponentColorModel/TRANSLUCENT
      java.awt.image.ComponentColorModel/OPAQUE)
    java.awt.image.DataBuffer/TYPE_BYTE))
;;;
; mk
(defn- mk' [buffer width height depth]
  (let [id (gl,gen-textures)
        tex-w (get2fold width )
        tex-h (get2fold height)
        r (zutil.Texture. id height width [tex-w tex-h] depth)]
    (#>bind! r)
		(gl,tex-image-2D
			:texture-2d
			0
			(enum (if ‹depth == 32› :rgba :rgb)) ;! wut :rgba8 ;! should possibly be BGRA on windows?
			tex-w
			tex-h
			0
			(enum (if ‹depth == 32› :rgba :rgb)) ;! should we ever use :rgb?
			:unsigned-byte
			buffer)
    (#>filters! r :nearest)
    (gl,tex-parameteri :texture-2d :texture-wrap-s :repeat)
    (gl,tex-parameteri :texture-2d :texture-wrap-t :repeat)
    r      
    ))
(defn mk [in]
  (let [img (javax.imageio.ImageIO/read (input-stream in))
        w (. img getWidth)
        h (. img getHeight)
        tex-w (get2fold w)
        tex-h (get2fold h)
        alpha (-> img (.getColorModel) (.hasAlpha)) ;! do we even want to ever do non-alpha?
        depth (if alpha 32 24)
        raster (java.awt.image.Raster/createInterleavedRaster
                 java.awt.image.DataBuffer/TYPE_BYTE
                 tex-w
                 tex-h
                 (if alpha 4 3)
                 nil)
        tex-img (java.awt.image.BufferedImage. (color-model alpha) raster false (java.util.Hashtable.))
        ;! for bi ctor: false:isRasterPremultiplied - should we be doing premultiplication?
        g (. tex-img getGraphics)
        ;! // only need to blank the image for mac compatibility if we're using alpha
        ; if (useAlpha) {
        ;     g.setColor(new Color(0f,0f,0f,0f));
        ;     g.fillRect(0,0,get2Fold(width),get2Fold(height));
        ; }
        _ (. g drawImage img 0 0 nil) ; if this looks weird, it used to check if we were flipping on y axis
        ;! if (/*edging*/true) {
        ;     if (height < get2Fold(height) - 1) {
        ;         copyArea(texImage, 0, 0, width, 1, 0, get2Fold(height)-1);
        ;         copyArea(texImage, 0, height-1, width, 1, 0, 1);
        ;     }
        ;     if (width < get2Fold(width) - 1) {
        ;         copyArea(texImage, 0,0,1,height,get2Fold(width)-1,0);
        ;         copyArea(texImage, width-1,0,1,height,1,0);
        ;     }
        ; }
        data (-> tex-img (.getRaster) (.getDataBuffer) (.getData)) ; "build a byte buffer from the temporary image that be used by OpenGL to produce a texture"
        img-buf (java.nio.ByteBuffer/allocateDirect (len data))
        _ (doto img-buf
            (.order (java.nio.ByteOrder/nativeOrder))
            (.put data 0 (len data))
            (.flip))
        _ (. g dispose)]
    (mk' img-buf w h depth)
    ))
(defn mk-empty [width height]
  (mk'
    (org.lwjgl.BufferUtils/createByteBuffer ‹(get2fold width) * (get2fold height) * 4›)
    width
    height
    32))
;;;
; misc
(defn bind! [tex]
  (do-if ‹tex is-not @bound-tex›
    (aset! bound-tex tex)
    (gl,enable :texture-2d)
    (gl,bind-texture :texture-2d ‹tex .id›)
    ))
(defn bind-none! []
  (gl,disable :texture-2d))
(defn destroy! [tex]
  (gl,delete-textures ‹tex .id›)
  (set! ‹tex .id› 0))
(defn min-filter! [tex v]
  (bind! tex)
  (gl,tex-parameteri :texture-2d :texture-min-filter (enum v)))
(defn mag-filter! [tex v]
  (bind! tex)
  (gl,tex-parameteri :texture-2d :texture-mag-filter (enum v)))
(defn filters! [tex v]
  (min-filter! tex v)
  (mag-filter! tex v))
(;(defn to-array [tex]
;public byte[] getTextureData() {
;  java.nio.ByteBuffer buffer = org.lwjgl.BufferUtils.createByteBuffer((hasAlpha() ? 4 : 3) * get2Fold(width) * get2Fold(height));
;  bind();
;  GL11.glGetTexImage(GL11.GL_TEXTURE_2D, 0, hasAlpha()? GL11.GL_RGBA : GL11.GL_RGB, GL11.GL_UNSIGNED_BYTE, buffer);
;  byte[] data = new byte[buffer.limit()];
;  buffer.get(data);
;  buffer.clear();
;  return data;}
)
;;;
; extras
(defn basic-draw! [tex src & {:keys [with]}]
  (bind! tex)
  (if with (gl,push-matrix))
    (if with (with))
    (gl,begin :quads)
      (let [[dX dY] ‹(src 1) -+ (src 0)›
            [tc1 tc2] ‹src D+ ‹tex .gl-dims››]
        (gl,tex-coord-2f (tc1 0) (tc1 1)) (gl,vertex-2f 0  0 )
        (gl,tex-coord-2f (tc2 0) (tc1 1)) (gl,vertex-2f dX 0 )
        (gl,tex-coord-2f (tc2 0) (tc2 1)) (gl,vertex-2f dX dY)
        (gl,tex-coord-2f (tc1 0) (tc2 1)) (gl,vertex-2f 0  dY)
        )
    (gl,end)
  (if with (gl,pop-matrix))
  )
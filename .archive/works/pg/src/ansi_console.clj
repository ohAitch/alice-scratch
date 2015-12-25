(ns ansi-console
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  )
;;;
; does maintain state - reqd for handling bright colors
; uses [jansi](http://jansi.fusesource.org/index.html) to install the coloring to System/out
; doesn't yet use jansi to do anything else
;;;
(org.fusesource.jansi.AnsiConsole/systemInstall)
(alter-var-root #'*out* (fn [_] (java.io.OutputStreamWriter. System/out)))
;;;
(defn go-to [line col] (str "\u001b["line";"col"H"))
(defn up    [v] (str "\u001b["v"A"))
(defn down  [v] (str "\u001b["v"B"))
(defn right [v] (str "\u001b["v"C"))
(defn left  [v] (str "\u001b["v"D"))
(def save "\u001b[s")
(def restore "\u001b[u")
(def clear "\u001b[2J")
(def clear-line "\u001b[K")
(defn color
  ([fg bg]
    (let [split+ (fn [color] (if ‹(last (name color)) = \+› [(keyword (subs (name color) 0 ‹(len (name color)) - 1›)) true] [color false]))
          num #(case %
                 :black   "0"
                 :red     "1"
                 :green   "2"
                 :yellow  "3"
                 :blue    "4"
                 :magenta "5"
                 :cyan    "6"
                 :grey    "7")
          old-fg (cache (atom [:grey false]))
          old-bg (cache (atom :black))
          was-bright (@old-fg 1)
          [fg bright] (if-not fg @old-fg (aset! old-fg (split+ fg)))
          bg          (if-not bg @old-bg (aset! old-bg bg))]
      (str "\u001b["(if was-bright "0;" "")(if bright "1;" "")"3"(num fg)";4"(num bg)"m")))
  ([] (color :grey :black)))
;;;
(def home (go-to 0 0))
(defn go-x [v] (if ‹v == 0› "" (if ‹v < 0› (left (- v)) (right v))))
(defn go-y [v] (if ‹v == 0› "" (if ‹v < 0› (up   (- v)) (down  v))))
(defn go-by [[x y]] (str (go-x x) (go-y y)))
(defn fg [v] (color v nil))
(defn bg [v] (color nil v))
(defn p [& args] (print' (apply str args)))
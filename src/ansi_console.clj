; simple, clear functions for generating ansi escape code strings that work reliably

;;; intro

(ns ansi_console
  (:require [clojure.string :as str]))

(org.fusesource.jansi.AnsiConsole/systemInstall) ; make colors work ; see http://jansi.fusesource.org/index.html
(alter-var-root #'*out* (fn [_] (java.io.OutputStreamWriter. System/out))) ; make clojure use the the new System/out

; hacky utils
(defn _kstr [v] (str (if (keyword? v) (name v) v)))
(defn assert_fail [v s] (throw (Exception. (str"expected "s" but got '"v"'"))))

;;; NASTY SECTION: COPIED DIRECTLY FROM kxlq.clj

  (defn isa [v class] (instance? class v))
  (defn i [v] (int v))

  ; downright hacky utils
  (deftype OStr [s] Object (toString [me] s)) ; ideally should be inside defn of `object`
  (defn object ([] (Object.)) ([v] (OStr. (str v))))
  ;(defn ae [& args] (AssertionError. (str/join " " args)))
  (defn ex [& args] (Exception. (str/join " " args)))
  (defn derx "derp ex" [& args] (apply ex "(UNPOLISHED)" args))
  (defmacro static [exp] (let [sym (gensym)] (eval `(def ~sym ~exp)) sym)) ; ISSUE: no-eval
  (defn _dl_helper [body] ;! not inside defn of dl
    (if (empty? body)
      body
      (let [v (first body)
            body (rest body)]
        (cond
          (= (first body) '<-)
            (list
              `(let [~v ~(second body)]
                 ~@(_dl_helper (rest (rest body)))))
          (= v 'if<-)
            (list
              `(let [~(first body) (if ~(second body) ~(nth body 2) ~(first body))]
                 ~@(_dl_helper (rest (rest (rest body))))))
          :else
            (cons v (_dl_helper body)))
        )))
  (defmacro dl [& body] `(do ~@(_dl_helper body)))
  (defn many_to_one [& args] (apply merge (map (fn [[ks v]] (zipmap ks (repeat v))) (partition 2 args))))

  ; unpolished utils
  (defn transpose [coll_of_colls] (apply mapv vector coll_of_colls))
  (defn windows [n sq] (lazy-seq (if (empty? (drop n sq)) '() (cons (take n sq) (windows n (rest sq))))))
  (defmacro doseq_indexed [[iname name coll] & rest]
    `(doseq [[~iname ~name] (map vector (range) ~coll)] ~@rest))
  (defmacro doseq_flat [let_exprs & body] (dl
    q <- (transpose (partition 2 let_exprs))
    `(doseq [~(vec (q 0)) (map vector ~@(q 1))] ~@body)))
  (defn jcall [member & args]
    (let [static (or (isa member java.lang.reflect.Constructor) (not (== (bit-and (. member getModifiers) java.lang.reflect.Modifier/STATIC) 0)))
          obj  (if static nil (first args))
          args (if static args (rest args))]
      (condp instance? member
        java.lang.reflect.Field
          (case (count args)
            0 (. member get obj)
            1 (let [v (first args)] (. member set obj v) v)
            )
        java.lang.reflect.Method
          (. member invoke obj (object-array args))
        java.lang.reflect.Constructor
          (. member newInstance (object-array args))
        )))
  (defn dot_priv [obj name & args]
    (let [static (isa obj Class)
          cla (if static obj (class obj))
          args (if static args (cons obj args))
          field (try (doto (. cla getDeclaredField name) (.setAccessible true)) (catch NoSuchFieldException e))
          method (let [s (filter #(= (. % getName) name) (. cla getDeclaredMethods))]
                   (case (count s)
                     0 nil
                     1 (doto (first s) (.setAccessible true))
                     ))
          member (or field method)]
      (if member
        (apply jcall member args)
        (throw (derx "dot_priv fail: "obj"|"name"|"static"|"cla"|"args"|"member)))))
  (defn new_priv [cla & args]
    (let [ctor (let [s (. cla getDeclaredConstructors)]
                 (case (count s)
                   0 nil
                   1 (doto (first s) (.setAccessible true))
                   ))]
      (apply jcall ctor args)))

  ; #>sym declares the sym so it's not an error if it hasn't been declared yet! such a hacky reader macro.
  (aset (dot_priv clojure.lang.LispReader "dispatchMacros") (i\>)
    (fn [rdr cu16] (let [sym (clojure.lang.LispReader/read rdr true nil true)] (eval `(declare ~sym)) sym)))

;;; api

(defn go_to_x [x] (str"["x"G"))
(defn go_to [x y] (str"["y";"x"H"))
(def save_cursor "[s")
(def restore_cursor "[u")
(defn go_by_x [i] (if (== i 0) "" (str"["(Math/abs i)(if (>= i 0) "C" "D"))))
(defn go_by_y [i] (if (== i 0) "" (str"["(Math/abs i)(if (>= i 0) "B" "A"))))
(defn go_by [[x y]] (str (go_by_x x) (go_by_y y)))
(def clear "[2J")
(def clear_head "[1J")
(def clear_tail "[0J")
(def clear_line "[2K")
(def clear_line_head "[1K")
(def clear_line_tail "[0K")

; doesn't work on windows/jansi but won't hurt
(def hide_cursor "[?25l")
(def show_cursor "[?25h")

; colors
(def default_color "[0m")
(defn fg [v] (let [[bright v] (#>_ansi_color_16 v)] (str "["(if bright "1" "22")"m[3"v"m")))
(defn bg [v] (str"[4"(#>_ansi_color_8 v)"m"))

;;; ansi color name tables

(defn _ansi_color_8 [v] (or (#>_ansi_color_table_8 (_kstr v)) (assert_fail v "a color name")))
(defn _ansi_color_16 [v] (or (#>_ansi_color_table_16 (_kstr v)) [false (_ansi_color_8 v)]))

; tables
(def _ansi_color_table_8 (many_to_one
  ["0" "black"           ] 0
  ["1" "red"             ] 1
  ["2" "green"           ] 2
  ["3" "yellow" "brown"  ] 3
  ["4" "blue"            ] 4
  ["5" "magenta" "purple"] 5
  ["6" "cyan"            ] 6
  ["7" "grey" "white"    ] 7))
(def _ansi_color_table_16 (merge
  ; take _ansi_color_table_8 entries and make `"light red" 9, "bright red" 9, "red+" 9` from `"red" 1`
  (apply hash-map (apply concat (mapcat (fn [[k v]] (let [v [true v]] [[(str "light "k) v] [(str "bright "k) v] [(str k"+") v]])) _ansi_color_table_8)))
  (many_to_one
    ["8" "darkgrey" "dark grey" "dark_grey" "dark-grey"] [true 0]
    ["9"                                               ] [true 1]
    ["10"                                              ] [true 2]
    ["11"                                              ] [true 3]
    ["12"                                              ] [true 4]
    ["13"                                              ] [true 5]
    ["14"                                              ] [true 6]
    ["15" "white"                                      ] [true 7])))
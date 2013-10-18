; simple, clear functions for generating the ansi escape code strings that work reliably

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; intro ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(ns ansi_console)
(require '[clojure.string :as str])
(use 'batteries)

(org.fusesource.jansi.AnsiConsole/systemInstall) ; make colors work ; see http://jansi.fusesource.org/index.html
(alter-var-root #'*out* (λ[_] (java.io.OutputStreamWriter. System/out))) ; make clojure use the the new System/out

; hacky utils
(defn _kstr[v] (str (if (keyword? v) (name v) v)))
(defn assert-fail[v s] (throw (Exception. (str"expected "s" but got '"v"'"))))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; api ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn go-to-x[x] (str"["x"G"))
(defn go-to[x y] (str"["y";"x"H"))
(def save-cursor "[s")
(def restore-cursor "[u")
(defn go-by-x[i] (if ‹i = 0› "" (str"["(Math/abs i)(if ‹i ≥ 0› "C" "D"))))
(defn go-by-y[i] (if ‹i = 0› "" (str"["(Math/abs i)(if ‹i ≥ 0› "B" "A"))))
(defn go-by[[x y]] (str (go-by-x x) (go-by-y y)))
(def clear "[2J")
(def clear-head "[1J")
(def clear-tail "[0J")
(def clear-line "[2K")
(def clear-line-head "[1K")
(def clear-line-tail "[0K")

; doesn't work on windows/jansi but won't hurt
(def hide-cursor "[?25l")
(def show-cursor "[?25h")

; colors
(def default-color "[0m")
(defn fg[v] (d [bright v] ← (→_ansi-color-16 v) (str "["(if bright "1" "22")"m[3"v"m")))
(defn bg[v] (str"[4"(→_ansi-color-8 v)"m"))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; ansi color name tables ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn _ansi-color-8 [v] ‹(→_ansi-color-table-8  (_kstr v)) or (assert-fail v "a color name")›)
(defn _ansi-color-16[v] ‹(→_ansi-color-table-16 (_kstr v)) or [false (_ansi-color-8 v)]›)

; tables
(def _ansi-color-table-8 (many-to-one
  ["0" "black"           ] 0
  ["1" "red"             ] 1
  ["2" "green"           ] 2
  ["3" "yellow" "brown"  ] 3
  ["4" "blue"            ] 4
  ["5" "magenta" "purple"] 5
  ["6" "cyan"            ] 6
  ["7" "grey" "white"    ] 7))
(def _ansi-color-table-16 (merge
  ; take _ansi-color-table-8 entries and make `"light red" 9, "bright red" 9, "red+" 9` from `"red" 1`
  (apply hash-map (apply concat (mapcat (fn [[k v]] (let [v [true v]] [[(str "light "k) v] [(str "bright "k) v] [(str k"+") v]])) _ansi-color-table-8)))
  (many-to-one
    ["8" "darkgrey" "dark grey" "dark_grey" "dark-grey"] [true 0]
    ["9"                                               ] [true 1]
    ["10"                                              ] [true 2]
    ["11"                                              ] [true 3]
    ["12"                                              ] [true 4]
    ["13"                                              ] [true 5]
    ["14"                                              ] [true 6]
    ["15" "white"                                      ] [true 7])))
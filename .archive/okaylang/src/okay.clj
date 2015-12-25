;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; intro ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(ns okay)
(import 'clojure.lang.LispReader)
(require 'clojure.main)
(require '[clojure.string :as str])
(use 'clojure.walk)

; renamings
(def & comp)
(def i int)
(defn c[s] (i (. s charAt 0)))
(defn smi[v] (set (map int v)))
(defn isa[v class] (instance? class v))
(def is identical?)
(def is_not (& not is))
(def != (& not =))
(def !== (& not ==))

; hacky utils to work around clojure lameness

(defmacro dl[& body] `(do ~@((fn _dl_helper[body] ;! should be inside defn of dl
  (if (empty? body)
    body
    (let [v (first body)
          body (rest body)]
      (if (= (first body) '<-)
        (list `(let [~v ~(second body)] ~@(_dl_helper (rest (rest body)))))
        (cons v (_dl_helper body)))
      ))) body)))
(defn static-form[form] (dl sym <- (gensym) (eval `(def ~sym ~form)) sym)) ; ISSUE: no-eval
(defmacro static[exp] (static-form exp))
(defmacro doto?[v & rest] `(if (nil? ~v) nil (doto ~v ~@rest)))
(defmacro break[] `(throw ~(static-form `(jutil.$$Break.)))) ; wtf, why do we need static-form
(defmacro label[& body] `(try (dl ~@body) (catch jutil.$$Break e#)))

; other hacky utils
(defn ex[& args] (Exception. (str/join " " args)))
(defn derp[& args] (apply ex "(UNPOLISHED)" args))
(defn slot[get set] (fn ([] (get)) ([v] (set v))))
(defn aslot[v idx] (slot #(aget v idx) #(aset v idx %)))
(defn =gbindf[slot f](dl t <- (slot) (slot #(dl (slot t) (apply f %&))))) ; assign global binding callback-style
(defn println'[& vs] (apply println vs) (last vs))
(defn conj_if [c v] (if v (conj c v) c))

; unpolished utils
(defn dict_by[f & vs] (zipmap (map f vs) vs))
(defn many_to_one[& args] (apply merge (map (fn [[ks v]] (zipmap ks (repeat v))) (partition 2 args))))
(defn transpose[coll_of_colls] (apply mapv vector coll_of_colls))
(defn windows[n sq] (lazy-seq (if (empty? (drop n sq)) '() (cons (take n sq) (windows n (rest sq))))))

; reflection utils (all unpolished)
(defn jclass[v] (if (isa v Class) v (. v getClass)))
(defn jisstatic[v] (java.lang.reflect.Modifier/isStatic (. v getModifiers)))
(defn jsupers[c] (if (nil? c) '() (cons c (lazy-seq (jsupers (. c getSuperclass))))))
; TODO change to jfields or even jmembers or even jmap
(defn jfield[c name] (try (doto? (. c getDeclaredField name) (.setAccessible true)) (catch NoSuchFieldException e)))
(defn jmethods[c name] (filter #(= name (. % getName)) (mapcat #(. % getDeclaredMethods) (reverse (jsupers c)))))
(defn jmethod1[c name] (doto? (first (jmethods c name)) (.setAccessible true)))
; picks an arbitrary member out of the methods and fields named name
(defn jdot[o name & args](dl
  c <- (jclass o)
  jf <- (jfield c name)
  jm <- (jmethod1 c name)
  jargs <- (object-array (if (and (is_not o c) (jisstatic (or jf jm))) (cons o args) args))
  (if jm (. jm invoke o jargs)
  (if jf (case (count jargs)
           0 (. jf get o)
           1 (dl t <- (first args) (. jf set o t) t)
           (throw (ex)))
  (throw (ex)) )) ))

; #>sym declares the sym so it's not an error if it hasn't been declared yet! such a hacky reader macro.
(aset (jdot clojure.lang.LispReader "dispatchMacros") (i\>)
  (fn [rdr cu16] (let [sym (clojure.lang.LispReader/read rdr true nil true)] (eval `(declare ~sym)) sym)))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; <edge> ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defn read1 [^java.io.PushbackReader rdr] (. rdr read))
(defn unread1 [^java.io.PushbackReader rdr ch] (if (not (== ch -1)) (. rdr unread ch))) ; if you call unread with -1, it is truncated to 65535 !!
(defn adapt_clj_reader [f] #(f % (char %2)))

(def reader_macros (atom {})) (defn reader_macro[v] (or (@reader_macros v) (@reader_macros :default))) ; fuck you rich hickey

(defn manydef[dict names v] (dorun (map dict names (repeat v))))
(defn defparse[body] (if (== (count body) 1) (first body) `(fn ~'this ~(first body) (dl ~@(rest body)))))
(defmacro rmdef[names & body] `(manydef #(swap! reader_macros assoc %1 %2) ~(if (string? names) (mapv int names) names) ~(defparse body)))

;(rmdef (mi"+-*/%&|=<>!?:@~") (_t))
;(rmdef (mi"'`^.()[]{}")[rdr ch] (ksymbol (str (char ch))))

(def SP (symbol ""))

(rmdef "\"" (adapt_clj_reader (clojure.lang.LispReader$StringReader.)))
(rmdef ";"[rdr ch]
  (loop [ch 0]
    (cond
      (== ch -1) nil
      ((smi"\n\r") ch) nil
      :else (recur (read1 rdr))
      )))
(rmdef "#"[rdr ch]
  ch <- (read1 rdr)
  (case (char ch)
    \" ((adapt_clj_reader (clojure.lang.LispReader$RegexReader.)) rdr ch)
    \( (symbol "#(")
    \{ (symbol "#{")
    \' (symbol "#'")
    (dl (unread1 rdr ch) (symbol "#"))))
(rmdef "~"[rdr ch] ch <- (read1 rdr) (if (== ch (i\@)) (symbol "~@") (dl (unread1 rdr ch) (symbol "~"))))
(rmdef "\n\r \t\u000b\u000c"[rdr ch] SP)
(rmdef "([{)]}.'@`^,"[rdr ch] (symbol (str (char ch))))
(defn _t[] (fn this[rdr ch](dl
  r <- (StringBuilder.)
  (loop [ch ch](dl
    (. r append (char ch))
    ch <- (read1 rdr)
    (if (and (is (reader_macro ch) this) (!== ch -1))
      (recur ch)
      (dl (unread1 rdr ch) (symbol (str r)))))))))
(rmdef [:default] (_t))

(defn read_rm ([rdr ch] ((reader_macro ch) rdr ch)) ([rdr] (read_rm rdr (read1 rdr))))
(defn parse_walk[f forms]
  (if (empty? forms) forms
    (dl t <- (f forms)
      (if (empty? t) t (dl
        a <- (first t)
        a <- (if (seq? a) (parse_walk f a) a)
        (cons a (lazy-seq (parse_walk f (rest t)))))))))

(defn parse_literal[v]
  (if (symbol? v)
    (dl n <- (name v) (cond
      (= n "nil") nil
      (= n "true") true
      (= n "false") false
      :else
        (if (. n startsWith ":")
          (keyword (subs n 1))
          (try (Integer/parseInt n) (catch NumberFormatException e v)))
      ))
    v))

(defmacro lit_list[& body] (list* body))
(defmacro lit_vec [& body] (vec body))
(defmacro lit_map [& body] (apply hash-map body))
(defmacro lit_set [& body] (set body))
(def group_table {
  (symbol "(")  [(symbol ")") 'lit_list]
  (symbol "[")  [(symbol "]") 'lit_vec]
  (symbol "{")  [(symbol "}") 'lit_map]
  (symbol "#{") [(symbol "}") 'lit_set]
  (symbol "#(") [(symbol ")") 'lit_fn]
  })
(defn parse_group[forms](dl
  a <- (first forms)
  [delim conv] <- (group_table a)
  (if delim
    (loop [r [] forms (rest forms)](dl
      forms <- (parse_group forms)
      (if (= (first forms) delim)
        (cons (list* conv SP r) (rest forms))
        (recur (conj r (first forms)) (rest forms)))))
    forms)))
(defn pa1[forms](dl
  a <- (first forms)
  b <- (second forms)
  (if (!= b SP)
    (cond
      (= a (symbol "@" )) (cons (list 'deref SP b) (rest (rest forms)))
      (= a (symbol "#'")) (cons (list 'var   SP b) (rest (rest forms)))
      :else forms)
    forms)))
(defn pa2[forms](dl
  a <- (first forms)
  b <- (second forms)
  (if (not (and (symbol? a) (#{"" "'" "`" "~" "^" "~@"} (name a))))
    (cond
      (and (seq? b) (= (first b) 'lit_list)) (cons (list* 'lit_list  SP a (rest b)) (rest (rest forms)))
      (and (seq? b) (= (first b) 'lit_vec )) (cons (list* 'subscript SP a (rest b)) (rest (rest forms)))
      :else forms)
    forms)))
(defn remove_whitespace[forms] (drop-while #(= % SP) forms))
(defn pa3[forms](dl
  a <- (first forms)
  b <- (second forms)
  (if (and (!= b SP) (symbol? a))
    (cond
      (= (name a) "'" ) (cons (list 'quote b) (rest (rest forms)))
      (= (name a) "~" ) (cons (list 'clojure.core/unquote b) (rest (rest forms)))
      (= (name a) "~@") (cons (list 'clojure.core/unquote-splicing b) (rest (rest forms)))
      ;(= (name a) "^" ) (cons (list ? b) (rest (rest forms)))
      :else forms)
    forms)))
(defn pa4[forms](dl
  a <- (first forms)
  b <- (second forms)
  (if (and (!= b SP) (symbol? a))
    (cond
      (= (name a) "`") (cons (jdot clojure.lang.LispReader$SyntaxQuoteReader "syntaxQuote" b) (rest (rest forms)))
      :else forms)
    forms)))
(defn fix_groups[forms](dl a <- (first forms) (if (and (seq? a) (#{'lit_list 'lit_vec 'lit_map 'lit_set} (first a))) (cons (macroexpand-1 a) (rest forms)) forms)))

; ergh ... `println("fun")` needs to go from `println ("fun")` to `(println "fun")` AFTER macros get called
; omg ... how is this even possible

; OKAY . the exact semantics of priority of postfix and prefix things needs to be hammered out better.

(defn parse_walks([v f & rest] (apply parse_walks (cons (parse_walk f v) rest)))([v] v))

(defn okay_parser[rdr]
  (println'
  (time (cons 'do
    (parse_walks
      (map parse_literal (take-while #(is_not % nil) (repeatedly
        #(loop [] (dl ch <- (read1 rdr) (if (== ch -1) nil (or (read_rm rdr ch) (recur)))))
        )))
      parse_group pa1 pa2 remove_whitespace pa3 fix_groups pa4
      )
    ))))

; rough spec:
; FILE = { FORM | WHITESPACE }
; FORM = STRING | REGEX | SYMBOL | SPECIAL
; SPECIAL = ( [ { ) ] } #{ #(    ' ` ~ ^ ~@     #' @    . ,
; and then build GROUPs and PREFIXes and POSTFIXes and DOTs out of SPECIALs
; GROUP = groupstart { FORM | WHITESPACE } groupend
; PREFIX = prefixsymbol FORM
; POSTFIX = FORM ( VEC | LIST )
; TODO DOT = FORM . SYMBOL
; and then remove all WHITESPACE

; hacks the clojure reader to give the rest of the file to f; call with (use_parser f):
(defn use_parser[f] (=gbindf (aslot (jdot clojure.lang.LispReader "macros") (i\:)) (fn [rdr cu16] (f rdr))))

(defn repl[] (clojure.main/repl))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; bootstrapping ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
(use_parser okay_parser):

(defmacro lit_fn [& body]dl(
  argsyms <- atom([])  as <- fn([i] while(<=(count(@argsyms) i) swap!(argsyms conj gensym())) @argsyms(i))
  restsym <- atom(nil) rs <- fn([] or(@restsym reset!(restsym gensym())))
  args <- fn([] concat(@argsyms if(@restsym cons('& [@restsym]) [])))
  body <- postwalk(
    fn([v]dl(n <- if(symbol?(v) name(v))
      cond(
        =(n "%&") rs()
        =(n "%") as(0)
        #{"%1""%2""%3""%4""%5""%6""%7""%8""%9"}(n) as(-((. n charAt 1) c("0") 1))
        :else v)))
    body)
  `fn([~@(args)] ~body)))

(defmacro subscript [& body] body)

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; test code ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(defmacro qm [v vs] `println(~@vs ~v))
qm("string" [465 {"map" "literal"} #{"set" 9 2 println} '1 #(conj ["5"] %)("banana")])
(def me atom(#"re")) println(#'me @me)

println(@(atom ["fun"])[0])
println('("hey you")[0])
println(#(dl 5)())
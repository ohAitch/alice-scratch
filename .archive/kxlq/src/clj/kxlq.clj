;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; intro ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

(ns kxlq
  (:require clojure.main)
  (:require [clojure.string :as str])
  (:import java.util.ArrayDeque)
  (:import java.util.Deque)
  )

; jargon / basicly-renamings
; rdr: reader
; cu16: UTF-16 code unit
; ch: unicode code point
(defn i [v] (int v))
(defn mi [v] (map int v))
(defn smi [v] (set (map int v)))
(defn isa [v class] (instance? class v))
;(def repr pr-str)
(def is identical?)
(defn aget_set [atom v] (clojure.lang.$/Atom_state_getAndSet atom v)) ; doesn't respect validators but meh

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
(def _BREAK (jutil.$$Break.))
(defmacro break [] `(throw _BREAK))
(defmacro label [& body] `(try (dl ~@body) (catch jutil.$$Break e#)))
(defmacro doseq_indexed [[iname name coll] & rest]
  `(doseq [[~iname ~name] (map vector (range) ~coll)] ~@rest))
(defmacro doseq_flat [let_exprs & body] (dl
  q <- (#>transpose (partition 2 let_exprs))
  `(doseq [~(vec (q 0)) (map vector ~@(q 1))] ~@body)))
(defmacro for' [vec & body] `(let [r# (atom [])] (doseq ~vec (swap! r# conj (dl ~@body))) @r#))

; unpolished utils
(defn dict_by [f & vs] (zipmap (map f vs) vs))
(defn many_to_one [& args] (apply merge (map (fn [[ks v]] (zipmap ks (repeat v))) (partition 2 args))))
(defn transpose [coll_of_colls] (apply mapv vector coll_of_colls))
(defn windows [n sq] (lazy-seq (if (empty? (drop n sq)) '() (cons (take n sq) (windows n (rest sq))))))
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

; and a bunch of reasonable names for working with deques
(defn dq
  ([] (ArrayDeque.))
  ([sq] (if (isa sq ArrayDeque) sq (#>dq_add_all (dq) sq)))
  )
(defn dq_push       [^ArrayDeque me v] (. me addLast v))
(defn dq_pop        [^ArrayDeque me] (. me removeLast))
(defn dq_peek       [^ArrayDeque me] (. me getLast))
(defn dq_push_tail  [^ArrayDeque me v] (. me addFirst v))
(defn dq_pop_tail   [^ArrayDeque me] (. me removeFirst))
(defn dq_peek_tail  [^ArrayDeque me] (. me getFirst))
(defn dq_pop_       [^ArrayDeque me] (. me pollLast))
(defn dq_peek_      [^ArrayDeque me] (. me peekLast))
(defn dq_pop_tail_  [^ArrayDeque me] (. me pollFirst))
(defn dq_peek_tail_ [^ArrayDeque me] (. me peekFirst))
(defn dq_empty      [^ArrayDeque me] (. me isEmpty))
(defn dq_add_all    [^ArrayDeque me sq] (doseq [v sq] (dq_push me v)) me)
(defn dq_len        [^ArrayDeque me] (. me size))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; `read` and reader macros ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

; tokens
(deftype KSymbol [name] Object
  (toString [me]
    (if (= name "\n")
      "<NL>"
      (if (every? #{\t \space} name)
        (str "<"(-> name (.replace " " "_") (.replace "\t" "t"))">")
        name
        )))
  (equals [me other] (and (isa other KSymbol) (is name (. other name)))) ; simple for now; ideally intern the symbols themselves? idk.
  (hashCode [me] (+ (. name hashCode) 0x1234))
  )
(defn ksymbol [name] (KSymbol. (. name intern)))
(def SPACE (ksymbol " "))
(def NEWLINE (ksymbol "\n"))
(defn line_separator? [v] (and (isa v KSymbol) (not (is v SPACE)) (every? #{\t \space} (. v name))))

; helpers
(defn read1 [^java.io.PushbackReader rdr] (. rdr read))
(defn unread1 [^java.io.PushbackReader rdr ch] (if (not (== ch -1)) (. rdr unread ch))) ; if you call unread with -1, it is truncated to 65535 !!
(defn _a_assoc_many [a sq v] (doseq [k sq] (swap! a assoc k v)))
(defn _adapt_clj_reader [f] #(f % (char %2)))
(defmacro _k_pop [] `(dl v <- (last @~'stack) (swap! ~'stack pop) v))
(defmacro _k_push [v] `(swap! ~'stack conj ~v))
(defmacro _k_last_len [] '(first (last @stack)))
(defmacro _k_concat_last [& vs] `(dl t <- (_k_pop) (_k_push [(first t) (concat (second t) ~@vs)])))

; read. calls reader macros in a loop, then has whitespace symbols convert stuff into lists (INDENT/DEDENT, but a tree instead of flat)
(defn k_read "reads a single form" [rdr] (dl
  ; read a line, then read lines until the first nonindented line
  forms <- (cons ((#>reader_macro (i\newline)) rdr (i\newline))
             (take-while
               #(not (and (isa % KSymbol) (== (. (. % name) length) 0)))
               (repeatedly (fn me [] (dl ch <- (read1 rdr)
                                         v <- ((reader_macro ch) rdr ch)
                                         (if (is v rdr) (me) v))))
               ))

  ; ensure tabs and spaces are not too mixed
  pairs <- (map (fn [[[a] b]] [(. a name) b]) (partition 2 (partition-by line_separator? forms)))
  (doseq [[a b] (windows 2 (map first pairs))]
    (if (not (or (. b startsWith a) (. a startsWith b))) (throw (derx "bad mixed tabs and spaces"))))

  ; convert indentation to lists
  pairs <- (map (fn [[a b]] [(. a length) b]) pairs)
  stack <- (atom [])
  (doseq [[len sq] (concat pairs [[0 '()]])]
    (while (and (seq @stack) (< len (_k_last_len))) (dl
      t <- (_k_pop)
      (if (or (empty? stack) (> len (_k_last_len)))
        (_k_push [len `(~(second t))])
        (_k_concat_last [(second (_k_pop))])
        )
      ))
    (if (or (empty? @stack) (> len (first prev)))
      (_k_push [len sq])
      (_k_concat_last [NEWLINE] sq))
    )

  (assert (= (len @stack) 1))
  (first @stack)))

; reader macro data
(def reader_macros (atom {}))
(defn reader_macro [v] (or (reader_macros v) (reader_macros :default)))

; spec: ?except we want it to be extensible?
; unused: ,\
; "whenever asked to read, start with a newline" doesn't work when you have multiple forms on the same line
; um. WHAT TO DO???
; OH DEAR, THIS IS HORRIBLE, I FORGOT SOMETHING MAJOR: python "def f():\n return [\n]\n" is legal!
; FILE = { WHITESPACE | SYMBOL | STRING } EOF
  ; WHITESPACE = ( /[ \t\u000b\u000c\n\r]/ | ? /* until */ or EOF (nestable) ? | ? // or # or ; until /(\n|\r|EOF)/ ? )+
    ; if this did not contain any /[\n\r]/: return SPACE
    ; else: return a symbol of (match /.*[\n\r]([ \t]*).*/ all the whitespace)
    ; later, we'll interpret this symbols to give us python-style indentation
    ; except, interprets lines `SPACE a` then `b` as `INDENT a DEDENT b` instead of error
    ; and, mixed tabs and spaces is an error if it causes dependence on the width of a tab (like python -tt)
  ; STRING = '"' { ? string body stuff ? } '"'
  ; SYMBOL = ALPHA | OTHER | SPECIAL
    ; ALPHA = /[0-9A-Za-z$_ UNICODE_BEYOND_0xff]+/
    ; OTHER = /[+-*/%&|=<>!?:@~]+/
    ; SPECIAL = /['`^.()[\]{}]/

; FILE = { LINE_SEPARATOR | SYMBOL | STRING | SPACE } EOF
  ; LINE_SEPARATOR = ( [ SPACE ] /[\n\r]+/ )+ INDENTATION [ SPACE ]
    ; INDENTATION = /[ \t]+/
      ; python-style, except:
      ; mixed tabs and spaces is an error if it causes dependence on the width of a tab (like python -tt)
      ; instead of error, interprets lines `SPACE a` then `b` as `INDENT a DEDENT b`
  ; SPACE = ( /[ \t\u000b\u000c]/ | ? /* until */ or EOF (nestable) ? | ? // or # or ; until /(\n|\r|EOF)/ (non-consuming) ? )+
  ; STRING = '"' { ? string body stuff ? } '"'
  ; SYMBOL = ALPHA | OTHER | SPECIAL
    ; ALPHA = /[0-9A-Za-z$_ UNICODE_BEYOND_0xff]+/
    ; OTHER = /[+-*/%&|=<>!?:@~]+/
    ; SPECIAL = /['`^.()[\]{}]/

; initial reader macro defs
(defmacro rmdef [names & args] (dl
  t <-
  (if (and (vector? (first args)) (every? symbol? (first args)))
    `(fn ~'this ~(first args) (dl ~@(rest args)))
    `(dl ~@args))
  `(_a_assoc_many reader_macros (map #(if (keyword? %) % (int %)) ~names) ~t)))
(rmdef ",\\" [rdr ch] (throw (derx "characters ,\\ are currently unused")))
(rmdef "\n\r" [rdr ch]
  dent <- (gobble #{\space \t })
  nls <- (gobble #{\n \r })
  ch <- (read1 rdr)
  (if (is (reader_macro ch) this) )
  )
(rmdef " \t\u000b\u000c" [rdr ch]
  ; eat whitespace and comments
  (loop [ch ch]
    (if (is (reader_macro ch) this)
      (recur (read1 rdr))
      (if (== ch (i\/)) (dl
        ch2 <- (read1 rdr)
        (if (== ch2 (i\*))
          (loop [ch1 0 ch2 0 nested 1]
            (cond
              (or (and (== ch1 (i\*)) (== ch2 (i\/))) (== ch2 -1))
                (if (> nested 1)
                  (recur ch2 (read1 rdr) (- nested 1))
                  nil)
              (and (== ch1 (i\/)) (== ch2 (i\*)))
                (recur ch2 (read1 rdr) (+ nested 1))
              :else
                (recur ch2 (read1 rdr) nested)
              ))
          (dl (unread1 rdr ch2) (unread1 rdr ch)))
        ) (unread1 rdr ch))))
  ; return SPACE only if 
  ch <- (read1 rdr)
  (if (is (reader_macro ch) (reader_macro (i\n)))
    ((reader_macro ch) rdr ch)
    (dl (unread1 rdr ch) SPACE)
    ))
("DO SOMETHING FOR /")
("ALSO # AND ;")
;(rmdef "/" [rdr ch] ((reader_macro (i\space)) rdr ch))
(rmdef "\"" (_adapt_clj_reader (clojure.lang.LispReader$StringReader.)))
(defn _t [] (fn this [rdr ch] (dl
  (loop [ch ch r (StringBuilder.)] (dl
    (. r append (char ch))
    ch <- (read1 rdr)
    (if (is (reader_macro ch) this)
      (recur ch r)
      (dl (unread1 ch) (ksymbol (str r)))))))))
(rmdef [:default] (_t))
(rmdef "+-*/%&|=<>!?:@~" (_t))
(rmdef "'`^.()[]{}" [rdr ch] (ksymbol (str (char ch))))

(defn parse_W_S_EOL_COMMENT [rdr] (dl
  ch <- (read1 rdr)
  (if (== ch (i\;))
    (loop [ch 0]
      (cond
        (== ch -1) NEWLINE
        ((static (smi"\n\r")) ch) (dl (unread1 rdr ch) NEWLINE)
        :else (recur (read1 rdr))))
    (dl (unread1 rdr ch) nil)
    )))


; rudimentary-but-usable implementations FTW
(defn launch_repl_and_load [file]
  ;(remove-ns 'user)
  ;(ns user
  ;  (:refer-clojure :only [])
  ;  (:require [clojure.core :as c]) ; temporary
  ;  (:use kxlq))
  ;(println "hey" file)
  (clojure.main/repl)
  )

; hacks the clojure reader to read the rest of the file as kxlq; call with (activate_kxlq_mode):
(defn activate_kxlq_mode [] (dl
  ms <- (dot_priv clojure.lang.LispReader "macros")
  t <- (aget ms (i\:))
  (aset ms (i\:)
    (fn [rdr cu16]
      (aset ms (i\:) t)
      (time (dl
        t <- (dq (parse_PROGRAM (java.io.PushbackReader. rdr 10)))
        ;t <- (#>expand_foundation_macros t)
        ;t <- (#>discard_whitespace t)
        ;t <- (#>expand_normal_macros t)
        ;t <- (#>eval_sans_macros t)
        (println)
        (apply println "info:" (mapv str t))
        ))
      nil))))

;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~; kxlq ;~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
(activate_kxlq_mode):

/*
/*jo+three
***
jo +three
;j0-argle*/
*/

; test: bad mixed tabs and spaces
; test: indentation of all sorts

rprint add_val(add_val(6 7 8) 9)
[2 [3 4] "kimchi" inc 9.05 7] -> list
rprint list
rprint [[1 2] [3 4]][0][1]

;alpha[5]
;{ ansible    rotunda,
;}
;"str"

;not-a-comment

;a,b

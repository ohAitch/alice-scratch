;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;     THIS FILE HAS A NEWER VERSION IN ANOTHER REPO
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; This file is part of <project> which is released under <license>. See file <filename> or go to <url> for full license details.
(ns lust
  (:refer-clojure :exclude [print file-seq])
  (:import clojure.lang.LispReader)
  (:require clojure.string))
;;;
;! write a proper assert macro that basically prints the code on failure or smth
;(set! *warn-on-reflection* true)
;;;
(def id identity)
(def sid id) ; used occasionally to make sublime-text's syntax coloring work better
(def & comp)
(def cmp compare)
(def <=> compare)
(def len count)
(def len' count) ; "len" is an ideal param name sometimes
(def fold reduce)
(def scan reductions)
(defn hgroup ; opt-args
  ([v] (partition-by identity v))
  ([f v] (partition-by f v)))
(def map-cat mapcat)
(defn abs [^double v] (Math/abs v))
(defn sin [^double v] (Math/sin v))
(defn cos [^double v] (Math/cos v))
(defn tan [^double v] (Math/tan v))
(def sqrt #(Math/sqrt %))
(def floor #(int (Math/floor %)))
(def ceil #(int (Math/ceil %)))
(def print' clojure.core/print)
(def print println) ;! copy python-style print sometime: print([object, ...], *, sep=' ', end='\n', file=sys.stdout)
(defmacro ? [test a b] `(if ~test ~a ~b)) ; (def ^:macro ? #'if)
(def ^:macro do-if #'when)
(def ^:macro do-if-not #'when-not)
(def ^:macro do-if-let #'when-let)
(def me macroexpand)
(def me1 macroexpand-1)
(defn sum [v] (apply + v))
(def aset! reset!)
(def str-replace clojure.string/replace)
(def str-join clojure.string/join)
(def split-re clojure.string/split)
(defn isa [v class] (instance? class v))
(def empty-queue clojure.lang.PersistentQueue/EMPTY)
(def filter-not remove)
(def vec? vector?)
(defn third [v] (nth v 2))
(def cla-boolean Boolean/TYPE)
(def cla-byte    Byte/TYPE)
(def cla-char    Character/TYPE)
(def cla-short   Short/TYPE)
(def cla-int     Integer/TYPE)
(def cla-long    Long/TYPE)
(def cla-float   Float/TYPE)
(def cla-double  Double/TYPE)
(def cla-booleans (Class/forName "[Z"))
(def cla-bytes    (Class/forName "[B"))
(def cla-chars    (Class/forName "[C"))
(def cla-shorts   (Class/forName "[S"))
(def cla-ints     (Class/forName "[I"))
(def cla-longs    (Class/forName "[J"))
(def cla-floats   (Class/forName "[F"))
(def cla-doubles  (Class/forName "[D"))
;;;
(def i+ unchecked-add-int)
(def i- unchecked-subtract-int)
(def i* unchecked-multiply-int)
(def iD unchecked-divide-int)
(def irem unchecked-remainder-int)
(def i_ unchecked-negate-int)
(defn l+   [a b] (zutil.Unchecked/l-add a b))
(defn l-   [a b] (zutil.Unchecked/l-sub a b))
(defn l*   [a b] (zutil.Unchecked/l-mul a b))
(defn lD   [a b] (zutil.Unchecked/l-div a b))
(defn lrem [a b] (zutil.Unchecked/l-rem a b))
(defn l_   [a  ] (zutil.Unchecked/l-neg a  ))
(defn d+   [a b] (zutil.Unchecked/d-add a b))
(defn d-   [a b] (zutil.Unchecked/d-sub a b))
(defn d*   [a b] (zutil.Unchecked/d-mul a b))
(defn dD   [a b] (zutil.Unchecked/d-div a b))
(defn drem [a b] (zutil.Unchecked/d-rem a b))
(defn d_   [a  ] (zutil.Unchecked/d-neg a  ))
(defn f+   [a b] (zutil.Unchecked/f-add a b))
(defn f-   [a b] (zutil.Unchecked/f-sub a b))
(defn f*   [a b] (zutil.Unchecked/f-mul a b))
(defn fD   [a b] (zutil.Unchecked/f-div a b))
(defn frem [a b] (zutil.Unchecked/f-rem a b))
(defn f_   [a  ] (zutil.Unchecked/f-neg a  ))
(def bit& bit-and)
(def bit| bit-or)
;(def bit^ bit-xor)
;(def bit~ bit-not)
(def bit! bit-not)
(def bit>> bit-shift-right)
(def bit<< bit-shift-left)
;;;
(defn ae [& args] (throw (AssertionError. (str-join " " args))))
(defn ex [& args] (Exception. (str-join " " (cons "(the throwing code is not done)" args))))
(defmacro cache [exp] (let [sym (gensym)] (eval `(def ~sym ~exp)) sym)) ; no-eval
(defn jcall [member & args]
  (let [static (or (isa member java.lang.reflect.Constructor) (not (== (bit& (. member getModifiers) java.lang.reflect.Modifier/STATIC) 0)))
        obj  (if static nil (first args))
        args (if static args (rest args))]
    (condp instance? member
      java.lang.reflect.Field
        (case (len args)
          0 (. member get obj)
          1 (let [v (first args)] (. member set obj v) v)
          )
      java.lang.reflect.Method
        (. member invoke obj (object-array args))
      java.lang.reflect.Constructor
        (. member newInstance (object-array args))
      )))
(defn dot-priv [obj name & args]
  (let [static (isa obj Class)
        cla (if static obj (class obj))
        args (if static args (cons obj args))
        field (try (doto (. cla getDeclaredField name) (.setAccessible true)) (catch NoSuchFieldException e))
        method (let [s (filter #(= (. % getName) name) (. cla getDeclaredMethods))]
                 (case (len s)
                   0 nil
                   1 (doto (first s) (.setAccessible true))
                   ))
        member (or field method)]
    (if member
      (apply jcall member args)
      (throw (ex "dot-priv fail: "obj"|"name"|"static"|"cla"|"args"|"member)))))
(defn new-priv [cla & args]
  (let [ctor (let [s (. cla getDeclaredConstructors)]
               (case (len s)
                 0 nil
                 1 (doto (first s) (.setAccessible true))
                 ))]
    (apply jcall ctor args)))
;;;
(defn curly-infix-fn [f] (fn [reader char] (f (vec (LispReader/readDelimitedList \› reader true)))))
(def lr-macros  (make-array clojure.lang.IFn (+ (int \›) 10)))
(def lr-#macros (make-array clojure.lang.IFn (+ (int \›) 10)))
(doseq [[k v] {
    \' (clojure.lang.LispReader$VarReader.)
    \" (clojure.lang.LispReader$RegexReader.)
    \{ (clojure.lang.LispReader$SetReader.)

    \> (fn [reader char] (let [sym (LispReader/read reader true nil true)] (eval `(declare ~sym)) sym))
    \( (clojure.lang.$$FnReader.)
    \‹ (clojure.lang.$$FnReader.)
    \\ (fn [rdr ch] (int ((cache (clojure.lang.LispReader$CharacterReader.)) rdr ch)))
    }]
  (aset lr-#macros (int k) v))
(doseq [[k v] {
    \" (clojure.lang.LispReader$StringReader.)
    \; (clojure.lang.LispReader$CommentReader.)
    \' (clojure.lang.LispReader$WrappingReader. 'quote)
    \@ (clojure.lang.LispReader$WrappingReader. 'clojure.core/deref)
    \^ (clojure.lang.LispReader$MetaReader.)
    \` (clojure.lang.LispReader$SyntaxQuoteReader.)
    \~ (new-priv clojure.lang.LispReader$UnquoteReader)
    \( (clojure.lang.LispReader$ListReader.)
    \[ (clojure.lang.LispReader$VectorReader.)
    \{ (clojure.lang.LispReader$MapReader.)
    \\ (clojure.lang.LispReader$CharacterReader.)
    \% (new-priv clojure.lang.LispReader$ArgReader)
    \# (clojure.lang.LispReader$DispatchReader.)

    \‹ (curly-infix-fn (fn [[lh op rh]] `(~op ~lh ~rh)))
    ;\& (fn [reader char]
    ;     (if-not (= (clojure.lang.LispReader/read1 reader) (int \())
    ;       (ex))
    ;     (let [l (clojure.lang.$/readAnyDelimitedList reader true)]
    ;       l)) ; (let [l ...] l) done to emphasize that 'l just happens to be the right form of the data that we want
    ; EXCEPT YOUR COMMMENT IS WRONG! macros take lists and return lists, but we want to take contents and return contents?
    ; BUT WE MAYBE WANT THE STUFF BEFORE THE & FORM! HOWS CAN WE DO THAT??
    ;postfix-macro
    ;prefix-macro

    \) (clojure.lang.LispReader$UnmatchedDelimiterReader.)
    \] (clojure.lang.LispReader$UnmatchedDelimiterReader.)
    \} (clojure.lang.LispReader$UnmatchedDelimiterReader.)
    \› (clojure.lang.LispReader$UnmatchedDelimiterReader.)
    }]
  (aset lr-macros (int k) v))
(dot-priv LispReader "dispatchMacros" lr-#macros)
(dot-priv LispReader "macros" lr-macros)
;
(defn slice-fn [coll start end step] ; should be named slice? but isn't because we're still using `slice` for the macro?
  (let [start (if ‹start = 0› nil start)
        step (if ‹step = 1› nil step)]
    (if ‹(vector? coll) and (not step)›
      (if end
        (subvec coll start end)
        (subvec coll start))
      (let [t coll
            t (if start (drop start t) t)
            t (if end (take ‹end - ‹start or 0›› t) t)
            t (if step (take-nth step t) t)]
        t))))
(defmacro slice
    ;! a bunch of hardcoding because i'm too lame to implement split-all
    ; or maybe using parsing tools would be better?
    ;(defn split-all [v coll] (map-cat #(if ‹(first %) = v› (repeat ‹(len %) - 1› ()) [%]) (partition-by #‹% = v› coll)))
    ;(defn partition-by' [f coll]
    ;  (if-let [s (seq coll)]
    ;    (let [ffs (f (first s))
    ;          run (take-while #‹ffs = (f %)› s)]
    ;      (cons run (partition-by' f (drop (len run) s))))))
    ;[coll & rest] `(slice-fn ~coll ~@(map first (split-all '/ rest))))
  ([coll] coll)
  ([coll a]
    (if ‹a = '/›
      coll ; /
      `(slice-fn ~coll ~a nil nil))) ; start
  ([coll a b]
    ‹(if ‹a = '/›
      (if ‹b = '/›
        coll ; / /
        `(slice-fn ~coll nil ~b nil)) ; / end
      (if ‹b = '/› `(slice-fn ~coll ~a nil nil))) ; start /
    or (ae)›)
  ([coll a b c]
    ‹(if ‹a = '/›
      (if ‹b = '/›
        `(slice-fn ~coll nil nil ~c) ; / / step
        (if ‹c = '/› `(slice-fn ~coll nil ~b nil))) ; / end /
      (if ‹b = '/›
        (if ‹c = '/›
          `(slice-fn ~coll ~a ) ; start / /
          `(slice-fn ~coll nil ~b nil)))) ; start / end
    or (ae)›)
  ([coll a b c d]
    ‹(if ‹a = '/›
      (if ‹c = '/› `(slice-fn ~coll nil ~b ~d)) ; / end / step
      (if ‹b = '/›
        (if ‹c = '/›
          `(slice-fn ~coll ~a nil ~d) ; start / / step
          (if ‹d = '/› `(slice-fn ~coll ~a ~c nil))))) ; start / end /
    or (ae)›)
  ([coll a b c d e]
    (if ‹‹b = '/› and ‹d = '/››
      `(slice-fn ~coll ~a ~c ~e) ; start / end / step
      (ae))))
;
(aset (dot-priv LispReader "macros") #\‹
  (curly-infix-fn (fn [v]
    (cond
      ‹(len v) == 0› nil
      ‹(len v) == 1› (v 0)
      ‹(odd? (len v)) and (apply = (slice v 1 / / 2))›
        `(~(v 1) ~@(slice v / / 2))
      :else
        `(~(v 1) ~(v 0) ~@(slice v 2))
      ))))
;;;
(defn symstr [& args] (symbol (apply str args)))
(defmacro reqd [ns name] (require ns) (symstr ns"/"name))
;;;
(def sq #‹% * %›)
(def ^:dynamic ** #‹% Math/pow %2›) (alter-meta! #'** dissoc :dynamic)
(defn quotrem [a b] [‹a iD b› ‹a irem b›])
(defn remquot [a b] [‹a irem b› ‹a iD b›])
(def nano-time #(System/nanoTime))
(defn sec-time [] ‹(nano-time) / 1000000000.0›) ; primitives
(defn idx      [^String v c] ‹v .indexOf     (int c)›)
(defn last-idx [^String v c] ‹v .lastIndexOf (int c)›)
(def != not=)
(def !== ‹not & ==›)
(def is identical?)
(def is-not ‹not & is›)
(def file (reqd clojure.java.io file))
(def split-lines (reqd clojure.string split-lines))
;;;
(defn range-incl [a b] (range a ‹b + 1›))
(def JUMP (zutil.Jump.))
(defmacro label [& body] `(try (do ~@body) (catch zutil.Jump e#)))
(defmacro defmulti' [name dispatch-fn & cases]
  `(do
     (defmulti ~name ~dispatch-fn)
     ~@(map #‹`(defmethod ~name ~@%)› cases)))
(defn before      [^String v c] (let [i (idx      v c)] (if ‹i == -1› v  (subs v 0 i))))
(defn before-last [^String v c] (let [i (last-idx v c)] (if ‹i == -1› v  (subs v 0 i))))
(defn  after      [^String v c] (let [i (idx      v c)] (if ‹i == -1› "" (subs v ‹i + 1›))))
(defn  after-last [^String v c] (let [i (last-idx v c)] (if ‹i == -1› "" (subs v ‹i + 1›))))
(defmacro def-vecmap:helper [as len get-a get-b]
  `(let [lim# ~len]
     (loop [r# (transient [])
            ~'i 0]
       (if ‹~'i == lim#›
         (persistent! r#)
         (recur
           (conj! r# (~as ~get-a ~get-b))
           ‹~'i + 1›)))))
(defmacro def-vecmap [as f]
  `(defn ~as
     ([a# b#]
       (if ‹a# and b#›
         (if (vec? a#)
           (if (vec? b#)
             (if ‹(len a#) !== (len b#)›
               (ae "error: calling vecmap with" a# b# "which are vecs of different lengths")
               (def-vecmap:helper ~as (len a#) (a# ~'i) (b# ~'i)))
             (def-vecmap:helper ~as (len a#) (a# ~'i) b#))
           (if (vec? b#)
             (def-vecmap:helper ~as (len b#) a# (b# ~'i))
             (~f a# b#))
           )))
     ([a# b# & rest#] (apply ~as (~as a# b#) rest#))
     ))
(def-vecmap ++ +)
(def-vecmap -+ -)
(def-vecmap *+ *)
(def-vecmap D+ /)
(def-vecmap min+ min)
(def-vecmap max+ max)
(defn avg+ [& args] ‹(apply ++ args) D+ (len args)›)
(defn file-seq [v] (clojure.core/file-seq (file v)))
(defn has [coll v] (some #{v} coll))
(defn dist [a b] (sqrt (sum (map sq ‹a -+ b›))))
(defn quote-fn [x] `(quote ~x))
(defn re-fn [re] #(re-find re %))
(defn- dool:helper [body]
  (if (empty? body)
    body
    (let [v (first body)
          body (rest body)]
      (cond
        ‹(first body) = '<- ›
          (list
            `(let [~v ~(second body)]
               ~@(dool:helper (rest (rest body)))))
        :else
          (cons v (dool:helper body)))
      )))
(defmacro dool [& body]
  `(do ~@(dool:helper body)))
(defn min-val-map [map] (apply min-key #‹% .val› map))
(defn exec [cmd & {:keys [then]}] (dool ; safe-kwargs
  ;! check out http://docs.oracle.com/javase/1.4.2/docs/api/java/lang/Runtime.html#exec(java.lang.String, java.lang.String[], java.io.File)
    ; expose envp param
    ; expose dir param
  cmd <- (if (coll? cmd) (into-array String (map str cmd)) cmd)
  proc <- (. (Runtime/getRuntime) exec cmd nil nil)
  (if then (-> (Thread. #(let [t (. proc waitFor)] (then {:exit-status t}))) (.start)))
  {:destroy #(. proc destroy)
   :in (. proc getOutputStream)
   :out (. proc getInputStream)
   :err (. proc getErrorStream)}))
(defn clamp [x min' max'] (max min' (min x max')))
(defn transpose [coll-of-colls] (apply mapv vector coll-of-colls)) ; could be much more efficient; encapsulates idea for now
(defn hex [v] (format "%x" v))
(defn print- [v] (print "info:" v) v)
(defmacro map' [& args] `(doall (map ~@args)))
(defn rep [val num] (vec (repeat num val)))
(defn long' [v] (if ‹v isa Character› (long (int v)) (long v)))
(defn digit? [c] ‹‹#\0 <= c› and ‹c <= #\9››)
(defn array? [v] (-> v (class) (.isArray)))
(defn apop! [atom] (dool, r <- (last @atom), (swap! atom pop), r))
(defn word-wrap [at s]
  (str-join "\n"
    (for [s (split-lines s)]
      (loop [r []
             s s]
        (if ‹(len s) > at›
          (recur (conj r (subs s 0 at)) (str "    "(subs s at)))
          (str-join "\n" (conj r s)))))))
(defmacro redef [sym v] `(alter-var-root #'~sym (fn [_#] ~v)))
(defmacro do-while [test & body]
  `(loop []
     ~@body
     (if ~test (recur))))
(defmacro doseq-indexed [[iname name coll] & rest] ; could be much more efficient; encapsulates idea for now
  `(doseq [[~iname ~name] (map vector (range) ~coll)] ~@rest))
(defmacro doseq-flat [let-exprs & body] (dool; could be much more efficient; encapsulates idea for now
  q <- (transpose (partition 2 let-exprs))
  `(doseq [~(vec (q 0)) (map vector ~@(q 1))] ~@body)))
(defn del [fl]
  (if (. fl isDirectory) (mapv del (. fl listFiles)))
  (if ‹(. fl exists) and (not (. fl delete))› (throw (java.io.IOException. (str "Couldn't delete file "fl))))
  )
(defmacro swallow [ex-class exp] `(try ~exp (catch ~ex-class e#)))
(defmacro undef [name] `(ns-unmap *ns* '~name))
(defmacro assoc-meta [name & rest] `(with-meta ~name (assoc (meta ~name) ~@rest))) ;! really should be a defn? ;! improve to allow (assoc-meta name :private) (like ^Integer and ^:private)
(defmacro def-atom ; opt-args
  ([name]     `(def ~name (atom nil)))
  ([name val] `(def ~name (atom ~val))))
(defmacro defdoc ; opt-args ?
  "def plus a docstring"
  ([name doc]      `(def ~(assoc-meta name :doc doc)))
  ([name init doc] `(def ~(assoc-meta name :doc doc) ~init)))
(defmacro defn-memo
  "defn plus memoizes with clojure.core/memoize"
  [& rest]
  `(doto (defn ~@rest) (alter-var-root memoize)))
(defmacro ddefn [name args docs & rest] `(defn ~name ~docs ~args ~@rest))
(defmacro ddefmacro [name args docs & rest] `(defmacro ~name ~docs ~args ~@rest))
(defmacro def-       [name & rest] `(def       ~(assoc-meta name :private true) ~@rest))
(defmacro defdoc-    [name & rest] `(defdoc    ~(assoc-meta name :private true) ~@rest))
(defmacro defmacro-  [name & rest] `(defmacro  ~(assoc-meta name :private true) ~@rest))
(defmacro defn-memo- [name & rest] `(defn-memo ~(assoc-meta name :private true) ~@rest))
(defmacro def-atom-  [name & rest] `(def-atom  ~(assoc-meta name :private true) ~@rest))
;! interesting. delete? or use?
;(defmacro exval [exp] `(try ~exp (catch Throwable e# e#)))
;(defmacro unexval [exp] `(if (isa ~exp Throwable) (throw ~exp) ~exp))
(defmacro if' [& body]
  (if ‹(len body) <= 3›
    `(if ~@body)
    `(cond ~@(if (even? (len body)) body (concat (butlast body) [:else (last body)])))))
(defn read-image [path] (javax.imageio.ImageIO/read (file path)))
(defn write-png [bi path] (javax.imageio.ImageIO/write bi "png" (file path)))
(defn get-set! [atom v] (clojure.lang.$/atomGetAndSet atom v)) ; doesn't respect validators but meh ; in clojure.lang to access the `state` field
(defmacro fortimes [bindings & body] (dool
  [i n] <- bindings
  n' <- (gensym)
  `(dool
     ~n' ~'<- (long ~n)
     (loop [~i 0
            r# (transient [])]
       (if ‹~i < ~n'›
         (recur
           (unchecked-inc ~i)
           (conj! r# (do ~@body))
           )
         (persistent! r#)
         ))
     )
  ))
(defn jfield [^Class class name'] (doto ‹class .getDeclaredField (name name')› (.setAccessible true)))
(defn jmethod [^Class class name'] (dool
  v <- (filter #‹‹% .getName› = (name name')› ‹class .getDeclaredMethods›)
  v <- (if ‹(len v) > 1› (ae) (first v))
  (. v setAccessible true)
  v))
(defn jparams [method] (vec ‹method .getParameterTypes›))
;;;
; could be put in a math namespace
(defn get2fold [^long n]
  (if ‹n == 0›
    0
    (loop [r 1]
      (if ‹r < n›
        (recur ‹r * 2›)
        r))))
;;;
; clojure.contrib misc
(defn separate [f coll] [(filter f coll) (filter (complement f) coll)])
(defmacro- defnilsafe [nil-safe-name non-safe-name]
  `(defmacro ~nil-safe-name
     {:arglists '([~'x ~'form] [~'x ~'form ~'& ~'forms])}
     ([x# form#]
       `(let [~'i# ~x#] (when-not (nil? ~'i#) (~'~non-safe-name ~'i# ~form#))))
     ([x# form# & more#]
       `(~'~nil-safe-name (~'~nil-safe-name ~x# ~form#) ~@more#))))
(defnilsafe .?. ..)
(defnilsafe -?> ->)
(defnilsafe -?>> ->>)
(defnilsafe doto? doto)
(defmacro defalias ; opt-args ;! use this
  "Defines an alias for a var: a new var with the same root binding (if
  any) and similar metadata. The metadata of the alias is its initial
  metadata (as provided by def) merged into the metadata of the original."
  ([name orig]
    `(do
       (alter-meta!
        (if ‹#'~orig .hasRoot›
          (def ~name ‹#'~orig .getRoot›)
          (def ~name))
        ;! this, no. undo this.
        ;; When copying metadata, disregard {:macro false}.
        ;; Workaround for http://www.assembla.com/spaces/clojure/tickets/273
        #(conj (dissoc % :macro)
               (apply dissoc (meta #'~orig) (remove #{:macro} (keys %)))))
       #'~name))
  ([name orig doc]
    `(defalias ~(assoc-meta name :doc doc) ~orig)))
(defmacro import-static
  "Imports the named static fields and/or static methods of the class
  as (private) symbols in the current namespace.

  Example: 
      user=> (import-static java.lang.Math PI sqrt)
      nil
      user=> PI
      3.141592653589793
      user=> (sqrt 16)
      4.0

  Note: Static methods are defined as MACROS, not first-class fns."
  [cla & fields-and-methods]
  (let [only (set (map str fields-and-methods))
        statics #(set (map (memfn getName) (filter #(java.lang.reflect.Modifier/isStatic (. % getModifiers)) %)))
        fields-to-do  ((reqd clojure.set intersection) only (statics (. cla getFields )))
        methods-to-do ((reqd clojure.set intersection) only (statics (. cla getMethods)))
        import-field  #(sid `(def-      ~(symbol %) (. ~class ~(symbol %))))
        import-method #(sid `(defmacro- ~(symbol %) [& args#] `(. ~'~class ~'~(symbol %) ~args#)))
        ]
    `(do ~@(map import-field fields-to-do)
         ~@(map import-method methods-to-do))))
;;;
; because whatevs
(defn rl ; opt-args
  ([] (rl #>working-ns))
  ([v] (use v :reload)))
(defn rla ; opt-args
  ([] (rla working-ns))
  ([v] (use v :reload-all)))
;
(def repl-user-code (dool
  it <- ‹(first *command-line-args*) or ""›
  it <- (re-find #"src\\(.+)\.clj$" it)
  (if it (def working-ns (-> (second it) (.replace \\ \.) (symbol))))
  ‹it ? #(use working-ns) #‹››))
;;;
(ns temporary-ns
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  )
(require 'brand-z)
;;;
;! misc that i'm not still using but that I don't want to throw away entirely
;(defmacro fn' [name params & rest] `(fn ~name ~params (~@rest)))
;(defn assoc-v [vec k v]
;  (let [k (int k)
;        l (len vec)]
;    (cond
;      (< k l)
;        (assoc vec k v)
;      (== k l)
;        (conj vec v)
;      :else
;        (recur (conj vec nil) k v))))
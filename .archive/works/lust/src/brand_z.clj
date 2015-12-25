;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
;;;;; THIS FILE HAS A NEWER VERSION IN ANOTHER REPO 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 

(ns brand_z
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  (:require [clojure.set :as cs])
  )
;;;
; docs
; so I looked at the top 60 clojure projects on github, and, while special characters are common in symbols, /\w+[^\s\w]+\w+/ is *rare* except for -
; unfinished:
;   still decide: #-,./ #{ #"
;   have an exception for "-foobar": lex it as "- foobar"?
;   oh my gosh operator precedence WHAT TO DO??
;   okay, i think if you just let . be a normal part of symbols and then do dynamic symbol tabling you can make java.lang.String work
;     WAIT NEVERMIND you want it for v.x sigh...
;     ARGH there's also numbers
;     what if . is an infix macro where (. 'java 'lang) -> 'java.lang but (. 'java.lang 'String) -> class object for java.lang.String?
;       first check for being-a-class, next check for lhs-exists (and then access its member), else concatenate symbols with a . in the middle
;   thinking about how/if to give meaning to newlines and how to use , since clojure has it as whitespace. Maybe make , and newline equivalent?
;   symbol resolution:
;     i mean you already have a process for symbol resolution; it's namespaces. The only issue is that you have to def each possibilty beforehand; you can't do it lazily. So make it lazyable?
;     since symbol resolution is custom and stuff, symbols containing such chars as / *can* resolve specially
;     numbers are just symbols that macro-resolution-time (or possibly some other time) resolve to numbers
;     ditto for % %1 %2 etc in #(...)
; quotes:
;   confused: # people DO use it in the middle, but rarely
;   foo-bar is DEEPLY used, and foobar- -foobar are pretty common
;   access to intepret-token (as interpret-symbol)
; lexical grammar:
;   READER_MACRO: "\ ()[]{} ; ‹whitespace› 
;   SPECIAL: `~@^'
;   SYMBOLY: +*% &| =<> !?: SPECIAL
;   ALPHA: everything else, notably _ $ 0-9
;   walk through the chars
;   at each char, if EOF (if A (yield (concat A B)))
;   at each char, if READER_MACRO[it] {v:=(do-the-rmacro), (if v is VOID (if A (yield (concat A B))) {yield A, if B yield B}), yield v}
;   gather SYMBOLY into A
;   gather ALPHA into A
;   gather SYMBOLY into B
;   yield A, yield B ; we must be at ALPHA now
;   furthermore, yield will look somewhat like (defn yield [s] SPECIAL[v:=s[:1]]? {yield* v, yield s[1:]} : yield* s)
;;;
(def reader-macro? #(#>reader-macros %))
(def special? #{#\` #\~ #\@ #\^ #\'})
(def symboly? (cs/union special? #{#\+ #\* #\% #\& #\| #\= #\< #\> #\! #\? #\:}))
(def alpha? #(not ‹(reader-macro? %) or (symboly? %)›))
;;;
; rdr = reader
; ch = character
(def eof-throw #(throw (ex "oh no! eof! baaaaad.")))
(def VOID (Object.))
(defn adapt-lr-rm [f] (fn [rdr ch] (dool v <- (f rdr ch) (if ‹v is rdr› VOID v))))
(def- group-signals (zipmap [#\( #\[ #\{ #\) #\] #\}] (cycle [(Object.) (Object.) (Object.)])))
(defmacro keys-with-same-value-map [& args] `(merge ~@(map (fn [[ks v]] `(zipmap ~ks (repeat ~v))) (partition 2 args))))
(def reader-macros (keys-with-same-value-map ; anon_macros
  [#\u0009 #\u000a #\u000b #\u000c #\u000d #\space] (fn [rdr ch] VOID)
  [#\( #\[ #\{]
    (fn [rdr ch] (dool
      gs <- (group-signals ch)
      r <- (atom [])
      (label (while true (dool
        (doseq [v (#>read-tokens rdr eof-throw)]
          (if ‹v is gs› (throw JUMP))
          (swap! r conj v))
        )))
      @r
      ))
  [#\) #\] #\}] (fn [rdr ch] (group-signals ch))
  [#\"] (adapt-lr-rm (clojure.lang.LispReader$StringReader.))
  [#\\] (adapt-lr-rm (clojure.lang.LispReader$CharacterReader.))
  [#\;] (adapt-lr-rm (clojure.lang.LispReader$CommentReader.))
  ))
(def reader-macro-whitespace-like? #{#\space #\t #\n #\u000b #\u000c #\r #\) #\] #\} #\;})
;;;
(defn interpret-token [s]
  (case s
    "nil" nil
    "true" true
    "false" false
    ;"/" '/
    ;"//" 'slashslash
    ;"lust///" 'lust/slashslash
    ;"clojure.core//" 'clojure.core//
    ;actually matchSymbol takes care of this (if (. s startsWith ":")
    (or
      (dot-priv clojure.lang.LispReader "matchSymbol" s)
      (dot-priv clojure.lang.LispReader "matchNumber" s)
      (throw (ex "invalid token: {" s "}")))))
(ddefn rtit [& vs] "read-tokens interpret-token" (dool
  v <- (apply str vs)
  (if ‹v = ""›
    []
    (dool
      v0 <- (subs v 0 1)
      (if (special? (int (. v0 charAt 0)))
        (cons (interpret-token v0) (rtit (subs v 1)))
        [(interpret-token v)])))))
(def- eof? #‹‹% == -1› or ‹% == 0xffff››)
(defn read-tokens [rdr on-eof] (dool
  ;!~ may resolve tokens in a different order than written
  ;! i wish i could write this as a generator - that would be SO nice
    ; it's safe to do that! i mean, you never really properly read more than one /[ALPHA|SYMBOLY]+/ or other thing at once
  A <- (StringBuilder.)
  B <- (StringBuilder.)
  (loop [state :symboly-A] (dool
    c <- (. rdr read)
    (if (eof? c)
      (concat (rtit A B) [(on-eof)])
      (dool
        rmacro <- (reader-macros c)
        (if rmacro
          (if ‹(. A length) == 0›
            (dool v <- (rmacro rdr c), (if ‹v is VOID› (recur :symboly-A) v))
            (if (reader-macro-whitespace-like? c)
              (dool v1 <- (rtit A B), v2 <- (rmacro rdr c), (if ‹v2 is VOID› v1 (concat v1 [v2])))
              (do (. rdr unread c) (concat (rtit A) (rtit B)))
              ))
          (case state
            :symboly-A (if (symboly? c)
                         (do (. A append (char c)) (recur state))
                         (do (. rdr unread c) (recur :alpha-A)))
            :alpha-A   (if (alpha? c)
                         (do (. A append (char c)) (recur state))
                         (do (. rdr unread c) (recur :symboly-B)))
            :symboly-B (if (symboly? c)
                         (do (. B append (char c)) (recur state))
                         (do (. rdr unread c) (recur :yield)))
            :yield (concat (rtit A) (rtit B))
            )
          )
        ))
    ))))
(aset lr-#macros #\&
  (fn [^java.io.PushbackReader rdr ch] (dool
    woo <- " FRIENDSHIP RAINBOW GO &"
    t <- (char-array (len woo))
    (. rdr read t)
    (if-not ‹woo = (String. t)› (throw (ex "yeah just fix this so it only goes ahead on friendship rainbow")))

    tokens <- (atom [])
    EOF <- (Object.)
    (label (while true
      (doseq [v (read-tokens rdr #‹EOF›)]
        (if ‹v is EOF› (throw JUMP))
        (swap! tokens conj v))
      ))
    `(print ~(str (mapv #‹[% (class %)]› @tokens)))
    ;`(print ~(str @tokens))
    )))
;;;
#& FRIENDSHIP RAINBOW GO &
so then 6 7 8 9.51
jo+three
jo +three
j0-argle
alpha[5]

;IMPORTANT READ NOW: CRAP, YOU TOTALLY PHAILED WITH POSTFIX MACRO THINGY WITH [ and list[idx];
(ns runesmith
  (:refer-clojure :exclude [print file-seq])
  (:use lust)
  (:use clojure.java.io)
  (:import java.awt.image.BufferedImage)
  (:import zutil.Jump)
  (:import zutil.DerpyIntCast))
;
; define "fix": location, size, rotation; all such info; currently defined as [[x y] [w h]]
;
(defn ex [] (eval '(pst *e)))
;
(defn bi-mk          [x y] (BufferedImage. x y BufferedImage/TYPE_INT_ARGB))
(defn bi-g          ([^BufferedImage me x y] ‹me .getRGB x y›)
                    ([^BufferedImage me [x y]] ‹me .getRGB x y›))
(defn bi-s           [^BufferedImage me x y v] ‹me .setRGB x y v›)
(defn bi-size        [^BufferedImage me] [‹me .getWidth› ‹me .getHeight›])
(defn bi-x           [^BufferedImage me] ‹me .getWidth›)
(defn bi-y           [^BufferedImage me] ‹me .getHeight›)
(defn bi-pixels ^ints[^BufferedImage me] (-> me (.getRaster) (.getDataBuffer) (.getData)))
(defn bi-seq         [^BufferedImage me] (seq (bi-pixels me)))
(defn bi-draw-square [^BufferedImage me x y rgb radi]
  (doseq [x' (range ‹‹x - radi› + 1› ‹x + radi›)
          y' (range ‹‹y - radi› + 1› ‹y + radi›)]
    (bi-s me x' y' rgb)))
(defn bi-ensure-:D   [^BufferedImage me]
  (if ‹(-> me (.getRaster) (.getDataBuffer) (.getData)) isa (Class/forName "[I")›
    me
    (let [r (bi-mk (bi-x me) (bi-y me))]
      ‹me .getRGB 0 0 (bi-x me) (bi-y me) (bi-pixels r) 0 (bi-x me)›
      r)))
;
(defprotocol Panel-P ;! whyyy do i need a protocol? :( | ;! extend-protocol??
  (sub [this offset] [this offset dims'])
  (reback [this])
  (refetch [this panel] [this])
  (refetch-at [this panel loc]))
(deftype Panel [fix
                ^BufferedImage img ; backing
                offset]
  Panel-P clojure.lang.IFn clojure.lang.Seqable
  (invoke [this [x y]] ‹this .invoke x y›)
  (invoke [this x y] (bi-g img ‹x + (offset 0)› ‹y + (offset 1)›))
  (applyTo [this args] (clojure.lang.AFn/applyToHelper this args))
  (seq [this] (bi-seq ‹‹this .reback› .img›))
  (toString [this] (#>write-std this "debug") "Panel")
  
  (sub [this offset'] (sub this offset' ‹(fix 1) -'' offset'›))
  (sub [this offset' size'] (Panel. [‹(fix 0) +'' offset'› size'] img ‹offset +'' offset'›))
  (reback [this] (if ‹(fix 1) = (bi-size img)› this (mk-panel
    (let [[sx sy] (fix 1)
          r (bi-mk sx sy)]
      (dotimes [y sy] (dotimes [x sx] ‹r .setRGB x y (this x y)›))
      ;(dotimes [y sy] ‹bi .setRGB 0 y sx 1 ‹img .pixels› ‹‹oy * stride› + ox› stride›) ;~ aaaargh this line borkly :(
      r)
    (fix 0))))
  (refetch [this] (#>mk-panel (#>create-screen-capture fix) (fix 0)))
  (refetch [this panel] ‹this .refetch-at ‹(fix 0) -'' (‹panel .fix› 0)››)
  (refetch-at [this panel loc] ‹‹panel .sub loc (fix 1)› .reback›))
(defn mk-panel [img screen-loc] (Panel. [screen-loc (bi-size img)] img [0 0]))
(defn nil-panel [size] (Panel. [[0 0] size] nil [0 0]))
;
(defprotocol Pattern-P
  (matches-now [this panel]) ;! remove?
  (matches [this panel])
  (find-in' [this panel last-at])
  (find-in [this panel])
  (find-all-in [this panel])
  (color= [this a b]))
(deftype Pattern [^BufferedImage img
                  ret-loc
                  ^ints misc ; [check-first-x check-first-y check-first-rgb fuzzy]
                  okay-errors
                  is-text] ; only works for matches... sigh...
  ;! better pixel-checking-order algo? (maybe: check three; check more if no good)
  Pattern-P
  (matches-now [this panel] ‹this .matches (-> panel (sub [0 0] (bi-size img)) (refetch))›)
  (matches [this panel']
    ;(#>write-std' img ‹panel' .img›)
    (let [^Panel panel panel']
      (if (color= this (aget misc 2) (panel (aget misc 0) (aget misc 1)))
        (if is-text ; sigh; code dup; but i feel like this is best since this stuff sucks
          (ae)
          ;(loop [errors 0
          ;       x 2
          ;       y 0]
          ;  (if'
          ;    ‹y >= (bi-y img)› true
          ;    ‹x >= ‹(bi-x img) - 2›› (recur errors 2 ‹y + 1›)
          ;    ‹errors > okay-errors› nil
          ;    (not (or
          ;        ‹‹(bi-g img x y) bit& 0xffffff› == 0xff00ff›
          ;        (color= this (bi-g img x y) (panel ‹x - 2› y))
          ;        (color= this (bi-g img x y) (panel ‹x - 1› y))
          ;        (color= this (bi-g img x y) (panel  x      y))
          ;        (color= this (bi-g img x y) (panel ‹x + 1› y))
          ;        (color= this (bi-g img x y) (panel ‹x + 2› y))))
          ;      (recur ‹errors + 1› ‹x + 1› y)
          ;    :else (recur errors ‹x + 1› y)))
          (loop [errors 0
                 x 0
                 y 0]
            (if'
              ‹y >= (bi-y img)› true
              ‹x >= (bi-x img)› (recur errors 0 ‹y + 1›)
              ‹errors > okay-errors› nil
              ‹‹‹(bi-g img x y) bit& 0xffffff› !== 0xff00ff› and (not (color= this (bi-g img x y) (panel x y)))›
                (recur ‹errors + 1› ‹x + 1› y)
              :else (recur errors ‹x + 1› y)))
          ))))
  (find-in' [this panel' last-at]
    ;(#>write-std' img ‹panel' .img)
    (let [^Panel panel panel'
          bound-x ‹‹((‹panel .fix› 1) 0) - (bi-x img)› + 1›
          bound-y ‹‹((‹panel .fix› 1) 1) - (bi-y img)› + 1›]
      (loop [x ‹(last-at 0) + 1›
             y (last-at 1)]
        (if'
          ‹y >= bound-y› nil
          ‹x >= bound-x› (recur 0 ‹y + 1›)
          :else
            (or
              (if (color= this (aget misc 2) (panel ‹x + (aget misc 0)› ‹y + (aget misc 1)›))
                (loop [errors 0
                       x' 0
                       y' 0]
                  (if'
                    ‹y' >= (bi-y img)› [x y]
                    ‹x' >= (bi-x img)› (recur errors 0 ‹y' + 1›)
                    ‹errors > okay-errors› nil
                    ‹‹‹(bi-g img x' y') bit& 0xffffff› !== 0xff00ff› and (not (color= this (bi-g img x' y') (panel ‹x + x'› ‹y + y'›)))›
                      (recur ‹errors + 1› ‹x' + 1› y')
                    :else (recur errors ‹x' + 1› y'))))
              (recur ‹x + 1› y))))))
  (find-in [this big-img] ‹(find-in' this big-img [-1 0]) +'' ret-loc›)
  (find-all-in [this big-img]
    (loop [r []
           last-at [-1 0]]
      (if-let [pt (find-in' this big-img last-at)]
        (recur (conj r ‹pt +'' ret-loc›) pt)
        r)))
  (color= [this a b] ‹(#>rgb-dist a b) < (aget misc 3)›))
(defn mk-pattern [^BufferedImage img {:keys [ret-loc fuzzy check-first okayerr is-text]}]
  (Pattern.
    img
    (vec (map int ‹‹ret-loc or [0.5 0.5]› *'' (bi-size img)›))
    (let [fuzzy' (int ‹‹fuzzy or 2.6› * 256›)]
      (if check-first
        (int-array (conj check-first (bi-g img check-first) fuzzy'))
        (let [v ((min-val-map (frequencies (bi-seq img))) 0) ;! seriously needs to be a better way to find minimums and locations than this
              [x y] (loop [x 0 y 0]
                      (if'
                        ‹y >= (bi-y img)› (recur ‹x + 1› 0)
                        ‹v == (bi-g img x y)› [x y]
                        :else (recur x ‹y + 1›)))]
          (if ‹‹v bit& 0xffffff› == 0xff00ff› (ae))
          (int-array [x y v fuzzy']))))
    (if-not okayerr 0 (int (if ‹okayerr >= 1› okayerr ‹okayerr * (len (filter #‹‹% bit& 0xffffff› !== 0xff00ff› (bi-seq img)))›)))
    is-text))
;
(defn nw [vec] [0 0])
(defn ne [[a b]] [a 0])
(defn sw [[a b]] [0 b])
(defn se [vec] vec)
(defn center [panel] ‹(‹panel .fix› 1) D'' [2 2]›)
;
(def rs-default (nil-panel [765 503]))
(def screen-size [1366 768])
;
(def-atom is-paused false)
(def-atom rs-visible)
(def-atom ^Panel rs rs-default)
(def-atom ^Panel radar)
(def-atom ^String world)
(def-atom flaggy)
(def-atom ticks 0)
;
(def ui-NW (nw (‹@rs .fix› 1)))
(def ui-NE (ne (‹@rs .fix› 1)))
(def ui-SW (sw (‹@rs .fix› 1)))
(def ui-SE (se (‹@rs .fix› 1)))
;
(def JUMP (Jump.))
(defmacro label [& body] `(try (do ~@body) (catch Jump e#)))
;
(let timer (java.util.Timer. true))
(let mk-task #(proxy [java.util.TimerTask] [] (run [] (%))))
(defn run-in           [delay  task] (. timer schedule            (mk-task task) (long delay)))
(defn run-repeat       [period task] (. timer schedule            (mk-task task) 0 (long period)))
(defn run-repeat-fixed [period task] (. timer scheduleAtFixedRate (mk-task task) 0 (long period)))
(let [timer (java.util.Timer. true) ;! remove, sigh...
      mk-task #(proxy [java.util.TimerTask] [] (run [] (%)))]
  (defn run-in'           [delay  task] ‹timer .schedule            (mk-task task) (long delay)›)
  (defn run-repeat'       [period task] ‹timer .schedule            (mk-task task) 0 (long period)›)
  (defn run-repeat-fixed' [period task] ‹timer .scheduleAtFixedRate (mk-task task) 0 (long period)›))
(defn sleep [ms] (if ‹ms != 0› (Thread/sleep ms)))
(defn approx ; opt-args
  ([x] (approx x nil nil))
  ([x min max]
    ‹x +
      (clamp
        ‹‹(cache (do (Math/random) (dot-priv Math "randomNumberGenerator"))) .nextGaussian› * x * 0.1›
        ‹min or ‹(abs x) * -0.25››
        ‹max or ‹(abs x) * 0.25››)›))
;(doto (Thread. #(loki "{loop sleepQuietly(Long.MAX-VALUE)}") "Thread-InterruptPeriodSetter") (.setDaemon true) (.start))
(defn msg-is-last [v] ‹v .matches ‹@rs .sub [9 444]››)
(defn inv-slot [idx] ‹@rs .sub ‹[557 210] +'' ‹(remquot idx 4) *'' [42 36]›› [42 36]›)
(defn past [time] ‹(sec-time) > time›)
;
(defn write [imgoid name] (write-png (if ‹imgoid isa BufferedImage› imgoid ‹‹imgoid .reback› .img›) (str "log/"name".png")))
(defn write-std [imgoid name]
  (let [secs (sid ‹‹(nano-time) - #>start-time› lD 1000000000›)]
    (write imgoid (str ‹secs iD 3600›"_"‹‹secs iD 60› mod 60›"_"‹secs mod 60›" "name))))
(defn write-std' [& imgs] (let [r (rand-nth (range 100 1000))] (dotimes [i (len imgs)] (write-std (nth imgs i) (str "debug"r"-"i)))))
(defn rgb-dist [a b]
  (let [ar (sid ‹(bit>> a 16) bit& 0xff›)
        ag (sid ‹(bit>> a  8) bit& 0xff›)
        ab (sid ‹       a     bit& 0xff›)
        br (sid ‹(bit>> b 16) bit& 0xff›)
        bg (sid ‹(bit>> b  8) bit& 0xff›)
        bb (sid ‹       b     bit& 0xff›)]
    ‹(sq ‹ar - br›) + (sq ‹ag - bg›) + (sq ‹ab - bb›)›))
; generate patterns from ./patterns/
(doseq [f ‹(file "patterns") .listFiles›]
  ;! Wrapping a macro in a function, like say (fn [& args] (eval `(def ~@args))): is there any clean way to avoid the eval?
  ;! any better way than just prefixing with ik?
  (let [[name tokens] (split-re (str-replace ‹‹f .getName› before-last \.› ";" ":") #"\s+" 2)
        kwargs (load-string (str "{"tokens"}"))]
    (if ‹‹name .charAt 0› != \~›
      (eval `(def ~(symbol (str "ik-"name)) (mk-pattern (bi-ensure-:D (read-image ~f)) ~kwargs))))))
;
(let ^java.awt.Robot robot (java.awt.Robot.))
(defn create-screen-capture [rect] ‹robot .createScreenCapture (let [[[a b] [c d]] rect] (java.awt.Rectangle. a b c d))›)
(defn get-screen-pixel ([x y] (-> robot (.getPixelColor x y) (.getRGB)))
  ([[x y]] (get-screen-pixel x y)))
(defn key-press   [keycode] ‹robot .keyPress   keycode›)
(defn key-release [keycode] ‹robot .keyRelease keycode›)
(defn mouse-move ([x y] ‹robot .mouseMove x y›)
  ([[x y]] (mouse-move x y)))
(let button-conv #(case %
                    1 java.awt.event.InputEvent/BUTTON1_MASK
                    2 java.awt.event.InputEvent/BUTTON2_MASK
                    3 java.awt.event.InputEvent/BUTTON3_MASK))
(defn mouse-press   ([button] ‹robot .mousePress   (button-conv button)›) ([] (mouse-press   1))) ; opt-args
(defn mouse-release ([button] ‹robot .mouseRelease (button-conv button)›) ([] (mouse-release 1))) ; opt-args
(defn mouse-wheel [amount] ‹robot .mouseWheel amount›)
(defn mouse-loc [] (#‹[‹% .x› ‹% .y›]› ‹(java.awt.MouseInfo/getPointerInfo) .getLocation›))
(defn mouse-move-by [loc] (mouse-move ‹loc +'' (mouse-loc)›))
(defn click ([button] (mouse-press button) (mouse-release button))
  ([] (click 1)))
(defn click-at
  ([loc] (let [t (mouse-loc)] (mouse-move loc) (click) (run-in' 15 #(mouse-move t))))
  ([panel loc] (click-at ‹(‹panel .fix› 0) +'' loc›)))
(defn drag-mouse [from to] (if ‹from != to› (let [t (mouse-loc)] (mouse-move from) (mouse-press) (mouse-move to) (mouse-release) (mouse-move t))))
(defn key-tap ([key ms] (key-press key) (run-in ms #(key-release key)))
  ([key] (key-tap key 15)))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; main
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(def start-time (nano-time))
;
(run-repeat-fixed 5000 #(if @rs-visible (write-std @rs "rs-scr")))
(zutil.KeyCallback/on-press \P #(swap! is-paused not))
;
(defn main []
  (swap! ticks inc)
  (label
    (if @rs-visible (swap! rs refetch))
    (if-not ‹@rs-visible and ‹ik-rs-anchor .matches ‹@rs .sub ‹ui-NE -'' [(bi-x ‹ik-rs-anchor .img›) 0]› (bi-x ‹ik-rs-anchor .img›)›››
      (let [scr (. (nil-panel screen-size) refetch)]
        (if (aset! rs-visible ‹‹ik-rs-anchor .find-in scr› and true›)
          (do
            (swap! rs refetch-at scr ‹ne -'' ui-NE›)
            ;! current: i wish i could just move rs to the new location and then let the refetching be handled by the earlier check?
            (print "found rs loc:" ‹@rs .fix›))
          (aset! rs rs-default))))
    (do-if @rs-visible
      (aset! world ‹@rs .sub [4 4] [512 334]›)
      (aset! radar ‹‹@rs .sub [551 9] [152 152]› .refetch›)
      (aset! flaggy ‹ik-radar-flag .find-in @radar›))
    (do-if @rs-visible
      (do-if (compare-and-set! (cache (atom nil)) nil true) ; reposition the window just once
        (drag-mouse ‹(‹@rs .fix› 0) +'' [319 -76]› ‹‹screen-size -'' (‹@rs .fix› 1)› +'' [319 -76]›)
        (throw JUMP))
      (let [t ((fn [[x y]] [x (- y)]) ‹(mouse-loc) -'' ‹(‹@radar .fix› 0) +'' (center @radar)››)] ;! clean up use of fix
        (if (every? #‹‹-80 <= %› and ‹% <= 80›› t)
          (print "mouse-loc" t)))
      (do-if ‹(rand) < 0.01›
        (click-at @rs [543 24])
        (key-tap java.awt.event.KeyEvent/VK_UP (approx 1000 950 nil)))
  ;    (doseq [[x y] ‹ik-tree find-all-in @radar›]
  ;      ‹‹@radar .img› .draw-square x y 0x00ffff 2›)
  ;    (write @radar (str "tree"@ticks))
  ;    (refresh)
      (do-if ‹(not @is-paused) and (seq @#>tasks)›
        (loop [r ((first @tasks))]
   ;`       (print "loop!" r (first @tasks))
          (if'
            ‹r = :done› (swap! tasks #(slice % 1))
            (fn? r) (recur [r])
            (vector? r) (do (swap! tasks #(vec (concat r (rest %)))) (recur ((first r))))
          )))))
  (run-in (approx 400) main))
;
(defn mkt-go-to-icon [pattern name]
  #(let [loc ‹pattern find-in @radar›]
    (if-not loc
      (print "help! I need to go to" name "icon")
      (if ‹(dist loc [76 76]) >= 15›
        (click-at @radar loc)
        (do
          (print "got to" name "icon")
          :done)))))
(defn mkt-go-by [[x y]]
  #(do
    (print "clicking on radar at" [x y])
    (click-at @radar ‹(center @radar) +'' [x (- y)]›) ; safe limit: (dist [0 0] [x y]) ** 2 < 4500
    (sleep 500) ;! bad :(
    #(if @flaggy #(if-not @flaggy :done))))
(defn mkt-click-wait-for-ore [loc mining-success-ore]
  #(let [lim ‹(sec-time) + (approx 3)›]
    (click-at @world ‹(center @world) +'' loc›)
    #(if'
      (past lim) :done
      (msg-is-last ik-swing-your-pick)
        #(if ‹(past lim) or (msg-is-last mining-success-ore)› :done)
      (msg-is-last ik-no-ore-available)
        (do (sleep (approx 1000)) :done)
      )))
;
(def task-falador-mine-iron
  ((fn me [tasks']
    #(if ‹ik-empty-inv-slot .matches (inv-slot 27)›
      (do
        (print "inventory: not-full")
        [(first tasks') (me (rest tasks'))])
      (do (print "inventory: probably-full") :done)))
    (cycle [
      (mkt-click-wait-for-ore [40 0] ik-mining-success-iron)
      (mkt-click-wait-for-ore [0 40] ik-mining-success-iron)
      ])))
(def-atom tasks [
    (mkt-go-by [-42 -59])
    (mkt-go-by [-8 -70])
    (mkt-go-by [0 -70])
    (mkt-go-by [0 -70])
    (mkt-go-by [0 -70])
    (mkt-go-by [-50 -50])
    (mkt-go-by [-50 -50])
    (mkt-go-by [0 -70])
    :start
;`    #(do (println "um hi...") :done)
;`    (mkt-go-by [0 10])
    task-falador-mine-iron ;! why is this not doing this after the go-bys finish? (note: ;`)
    (mkt-go-to-icon ik-icon-mine "mine")
    (mkt-go-by [0 65])
    (mkt-go-by [48 48])
    (mkt-go-by [48 48])
    (mkt-go-by [0 50])
    (mkt-go-to-icon ik-icon-clan "clan")
    (mkt-go-by [10 50])
    (mkt-go-to-icon ik-icon-tree "tree")
    (mkt-go-by [20 60])
    (mkt-go-by [18 60])
    (mkt-go-to-icon ik-icon-bank "bank")
 ])
(swap! tasks #(vec (slice (drop-while #‹% != :start› %) 1)))

;! deal with this trash:
;//if at mining zone
;//  if see ore on ground
;//    grab ore
;//  else
;//    if at mining spot
;//      mine
;//    else
;//      goto mining spot
;//else
;//  goto mining zone
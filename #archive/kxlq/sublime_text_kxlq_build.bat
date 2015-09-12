echo off

cd C:/Users/vuntic/skryl/code/kxlq/

set _1=%1
if "%1"=="" set _1=cljfix.clj

set R=C:/Users/vuntic/skryl/code/
set JAR_PATH=%R%/lwjgl-2.8.4/jar/lwjgl-debug.jar;%R%/lwjgl-2.8.4/jar/lwjgl_util.jar;%R%/clojure-1.4.0/clojure-1.4.0.jar;bin/*
set CLJ_PATH=src/clj
set NATIVE_PATH=%R%/lwjgl-2.8.4/native/windows
java -cp %JAR_PATH%;%CLJ_PATH% -Djava.library.path=%NATIVE_PATH% clojure.main -e "(require 'kxlq) (kxlq/launch_repl_and_load """%_1:\=/%""")"

pause
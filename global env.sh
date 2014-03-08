#!/bin/bash
pause() { read -p 'Press [Enter] to continue . . .'; }

lwjgl_version=2.9.0
ali="$USERPROFILE/ali"

setx ALI "$ali"
setx CLOJURE "$ali/code/#libs/clojure-1.5.1/clojure-1.5.1-slim.jar"
setx LWJGL "$ali/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl-debug.jar;$ali/code/#libs/lwjgl-$lwjgl_version/jar/lwjgl_util.jar"
setx LWJGL_NATIVE "$ali/code/#libs/lwjgl-$lwjgl_version/native/windows"
setx JAVA_LWJGL_NATIVE "-Djava.library.path=$LWJGL_NATIVE"
setx LOMBOK "$ali/code/#libs/lombok.jar"

pause
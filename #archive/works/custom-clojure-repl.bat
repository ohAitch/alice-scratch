echo off

cd C:\code\works\

cd zutil
::call build 0
cd ..

set JAR_CP=C:/code/bin/*;C:/code/lwjgl-2.8.3/jar/lwjgl-debug.jar;C:/code/lwjgl-2.8.3/jar/lwjgl_util.jar;C:/code/jbullet-plus/*;bin/*
set CLJ_CP=lust/src;shiny/src;pg/src

::start /B
"C:\Program Files\Java\jre7\bin\java.exe" -cp %JAR_CP%;%CLJ_CP% -Djava.library.path=C:/code/lwjgl-2.8.3/native/windows clojure.main -e "(ns-unmap *ns* 'print) (ns-unmap *ns* 'file-seq) (use 'lust) (repl-user-code)" -r %1

pause
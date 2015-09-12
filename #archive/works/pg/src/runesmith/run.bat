echo off

cd log
del *.png
cd ..

java -cp clojure-1.3.0.jar;zutil/zutil.jar;C:/code/jna-3.4.0/*;. clojure.main -e "(use 'runesmith) (main)" -r
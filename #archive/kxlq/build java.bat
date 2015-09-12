set R=../../..
set JAR_PATH=%R%/*;%R%/clojure-1.4.0/clojure-1.4.0.jar

mkdir tmp

cd src/jvm
javac -cp %JAR_PATH% -d ../../tmp jutil/*.java clojure/lang/$.java
cd ../..

cd tmp
jar cf ../jutil.jar *
cd ..

if 5%1 equ 5 pause

move /Y jutil.jar bin

rmdir tmp /S /Q
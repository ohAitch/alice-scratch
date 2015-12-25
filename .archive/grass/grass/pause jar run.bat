cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;
javac grass/*.java
jar.exe -cvfm grass/grass.jar grass/manifest.txt grass/*.class grass/res/*
pause
cd grass
grass.html

rem set CLASSPATH=C:\lwjgl-2.4.2;C:\lwjgl-2.4.2\res;C:\lwjgl-2.4.2\jar\*;
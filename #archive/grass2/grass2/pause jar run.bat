cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;grass2\classpath\lombok.jar;
javac grass2/*.java
rem jar.exe -cvfm grass2/grass.jar grass2/manifest.mf grass2/*.class grass2/res/* grass2/dat/*
jar.exe -cvf grass2/grass.jar grass2/*.class grass2/res/* grass2/dat/*
pause
cd grass2
grass.html

rem set CLASSPATH=C:\lwjgl-2.4.2;C:\lwjgl-2.4.2\res;C:\lwjgl-2.4.2\jar\*;
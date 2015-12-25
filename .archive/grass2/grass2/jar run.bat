cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;grass2\classpath\lombok.jar;
javac grass2/*.java
jar.exe -cvf grass2/grass.jar grass2/*.class grass2/res/* grass2/dat/*
cd grass2
grass.html
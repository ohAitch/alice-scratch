cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;
javac grass/*.java
jar.exe -cvfm grass/grass.jar grass/manifest.txt grass/*.class grass/res/*
cd grass
grass.html
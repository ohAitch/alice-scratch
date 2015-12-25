cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;
javac dirt/*.java
jar.exe -cvf dirt/dirt.jar dirt/*.class
pause
cd dirt
del *.class
appletloader.html
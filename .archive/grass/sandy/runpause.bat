cd ..
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;
javac sandy\*.java
java -Djava.library.path=C:\lwjgl-2.4.2\native\windows sandy.G
pause

cd sandy
del *.class
rem set CLASSPATH=C:\lwjgl-2.4.2;C:\lwjgl-2.4.2\res;C:\lwjgl-2.4.2\jar\*;
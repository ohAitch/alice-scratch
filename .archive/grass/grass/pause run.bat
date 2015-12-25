cd ..
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;
javac grass/*.java
java -Djava.library.path=C:\lwjgl-2.4.2\native\windows grass.M
pause
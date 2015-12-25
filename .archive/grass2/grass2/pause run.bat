cd ..
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;grass2\classpath\lombok.jar;
javac grass2/*.java
java -Djava.library.path=C:\lwjgl-2.4.2\native\windows grass2.M
pause
cd grass2
del *.class
cd C:\code\works
set CLASSPATH=C:\lwjgl-2.4.2\jar\*;grass2\classpath\lombok.jar;
javac grass2/*.java
java -Xmx1800m -Djava.library.path=C:\lwjgl-2.4.2\native\windows grass2.M
cd grass2
del *.class
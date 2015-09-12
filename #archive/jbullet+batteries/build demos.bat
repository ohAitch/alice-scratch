del jbullet-demos.jar

mkdir bin

cd src
javac -cp C:/code/jna-3.4.0/*;C:/code/lwjgl-2.8.3/jar/*;C:/code/jbullet-plus/*;. -d ../bin com/bulletphysics/demos/applet/*.java com/bulletphysics/demos/basic/*.java com/bulletphysics/demos/bsp/*.java com/bulletphysics/demos/character/*.java com/bulletphysics/demos/concave/*.java com/bulletphysics/demos/concaveconvexcast/*.java com/bulletphysics/demos/dynamiccontrol/*.java com/bulletphysics/demos/forklift/*.java com/bulletphysics/demos/genericjoint/*.java com/bulletphysics/demos/helloworld/*.java com/bulletphysics/demos/movingconcave/*.java com/bulletphysics/demos/opengl/*.java com/bulletphysics/demos/vehicle/*.java
cd ..

cd bin
jar cf ../jbullet-demos.jar *
cd ..

if 5%1 neq 50 pause

rmdir bin /S /Q
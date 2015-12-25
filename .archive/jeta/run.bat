::@echo off
cd lib
del vrelta.jar
del jcommander-1.18-Z.jar
cd ..
cd ../vrelta
copy vrelta.jar "../jeta/lib" > NUL
cd ../jcommander
copy jcommander-1.18-Z.jar "../jeta/lib" > NUL
cd ../jeta

java -cp "lib/*" vrelta.comp.Vreltac -cp "lib/vrelta.jar" -src src -bin bin -conwidth 80
if %ERRORLEVEL% geq 1 goto err
cd bin
jar -cf ../jeta.jar ./*
cd ..

java -cp "lib/*;jeta.jar" jeta.Main

:err
rmdir /S /Q bin
pause
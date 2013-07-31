id=`date +%s`
clang++ src/main.cpp -O1 -o $id.exe
$id
rm $id.exe
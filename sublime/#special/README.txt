if still on sublime build 3126, current.zip is a replacement for sublime's builtin Default.sublime-package
* removes autocomplete for ' and "
* enables comment syntax definition with a trailing space

# if a new sublime version, diff it with Default.sublime-package.bak and merge into the new sublime builtin


root='/Applications/Sublime Text.app/Contents/MacOS/Packages'
unzip Default.sublime-package -d edit; unzip Default.sublime-package.bak -d base
cp "$root/"Default.sublime-package .
unzip Default.sublime-package -d base
cd base; zip ../current.zip *; cd ..; cp current.zip "$root/"Default.sublime-package

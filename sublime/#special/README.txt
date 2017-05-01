if still on sublime build 3126, current.zip is a replacement for sublime's builtin Default.sublime-package
* removes autocomplete for '' and ""
* enables comment syntax definition with a trailing space

# if a new sublime version, diff it with base.zip and merge into the new sublime builtin

# some commands
root='/Applications/Sublime Text.app/Contents/MacOS/Packages'

unzip Default.sublime-package -d current; unzip base.zip -d base
unzip Default.sublime-package -d base
cd base; zip ../current.zip *; cd ..; cp current.zip "$root/"Default.sublime-package

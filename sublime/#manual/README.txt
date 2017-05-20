if still on sublime build 3126, current.zip is a replacement for sublime's builtin Default.sublime-package
* removes autocomplete for '' and ""
* enables comment syntax definition with a trailing space

# some commands
root='/Applications/Sublime Text.app/Contents/MacOS/Packages'
unzip "$root"/Default.sublime-package -d base
‡ merge base and current, name it merge, delete all except base and merge
cd base; zip ../base.zip *; cd ..; rm -r base
cd merge; zip ../current.zip *; cd ..; rm -r merge
cp current.zip "$root/"Default.sublime-package
‡ reboot sublime

‡ !! oops, this trashes send2trash !! ‡ um, reinstall sublime to fix that? it is not like we were actually using that functionality but

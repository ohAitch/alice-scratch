if still on sublime build 3154, my.zip is a replacement for sublime's builtin Default.sublime-package
* removes autocomplete for '' and ""
* enables comment syntax definition with a trailing space

# some commands
root='/Applications/Sublime Text.app/Contents/MacOS/Packages'
unzip base.zip -d base
unzip my.zip -d my
unzip "$root/Theme - Default.sublime-package" -d theme
‡ merge base into my, delete base
cd base; zip ../base.zip *; cd ..; rm -r base
cd my; zip ../my.zip *; cd ..; rm -r my
cp my.zip "$root/"Default.sublime-package
‡ reboot sublime

‡ !! oops, this trashes send2trash !! ‡ um, reinstall sublime to fix that? it is not like we were actually using that functionality but

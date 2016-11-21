```
install:
  brew cask install karabiner
  npm -g i keyrc
	keyrc start
bonus:
  if you want to remap the power key, install https://github.com/pkamb/PowerKey/issues/39 and set it to the script ~/Documents/keyrc_power_key.sh
```

* will overwrite any existing private.xml (ignore if that means nothing to you)
* bug workaround: extraplanar characters count as two characters; if in a ┌┐└┘ grid, remove the space following them

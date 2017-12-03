U=user ;H=/home/$U
add_pubkey(){ mkdir -p $H/.ssh ;echo "$1" >> $H/.ssh/authorized_keys ;chown -R $U:$U $H/.ssh ;}

rm /etc/update-motd.d/{00-header,10-help-text}

apt-get update

adduser $U --disabled-password --gecos ""

add_pubkey 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDLxg6/nQjzUbYozJ+9gl/rjA2NVjW60Fmq+pbU9Sj0Kbb9Q4mWp0zCQ1GqlksEoW/eNpsXD3JGy6LSeyE9cjc7Icn9uwfH4OpDsEoD7e/kxslPpCYZ8vvzwWF+Ma00eauSlrEYhBsCYF6YDzIP1UbgOl1j2F8X/4q+C+KkMq73LjHuz9JKxMle7UTAXj7Lb+PzUEiMeJ4X9ldsta8rMFQfmiHv4leVRGcv6MaQzd+ii3h3kzqUL1B0DeyIPvRasqhO7n51Mdb6Q1eskEhkupO5juO4vrmOHU8BlppQ35vkGoyh/haYP23yHp826e0l/jJIkyPwwIS0HJwETrJ29/HXIe8y/6HjlmAE9saWqnx2pUgLqqqo5y938drUHJuprkd7AdIx6lcSwiD9UkMSRGfR6HpOGaIj7zD+NpeyHS5tfsFDHQFHfubjjkg3HngEHEUGTm9pPbnchMYo+6wAKVlrpDSMQ0tsHwjmHQ1+rmfx0MTX6jFNyfLV8z7NQWb7E+o4kPa43N5zA1sJFdvl/FVH6gxILgVkFWlCj9TeCd+yCXqrFKW+EWHL7w5IsKpy5NXELhWh+ONecbpYYAlrvmRv5NWZmicQ26BbuaCzdPLKpwoOJAqakDqB3jtUWDWbDNnexiXEedef30kx9IiUSEsHJwwlb9xgE5Y7x7NsaE0n3w== alice0meta@gmail.com'

# sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config ;service ssh restart # disable root ssh

# used sudo for these, but let's not this time - possibly because we are running as root already?
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs

apt-get install tmux

echo '
# if not in tmux and there are tmux sessions, enter the first tmux session
[ -z "$TMUX" ] && if [ -z "$(tmux ls 2>/dev/null)" ]; then echo "$(tput setaf 1)$(tput bold)no tmuxs online$(tput sgr0)"; else tmux attach -t 0; fi
' >> $H/.bashrc

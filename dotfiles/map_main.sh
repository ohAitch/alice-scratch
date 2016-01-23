# primary_ip(){ ifconfig eth0 | awk -F: '/inet addr:/ {print $2}' | awk '{ print $1 }'; }
# set_hostname(){ echo "$1" > /etc/hostname; hostname -F /etc/hostname; }
add_pubkey(){ mkdir -p ~alice/.ssh; echo "$1" >> ~alice/.ssh/authorized_keys; chown -R alice:alice ~alice/.ssh; }

apt-get update
# set_hostname map0
# echo "$(primary_ip) $FQDN" >> /etc/hosts
adduser alice --disabled-password --gecos ""
add_pubkey 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCe3mZJTfS6h34PgINtgILevMC4mvHToqf3gYqq2TEpY2yCyQ7/P5yXQyrPU9CVN6oQaYhYtlpfmzjPHegaAMY5OEqQm/hg7nluTN8zqs+WHtWcrtwnFxL42BND66k1BHxOBFXqnnBGQkiMQYH6wNYcsIprvlr1gGeLwTY+1kQFGjmbd6u1pFffMMHTesM8cha8B8kE2klskW/X9KVY7qYd+VgHyC0/aLrpvaF2HLGGv5gE9S3DNVVedkZJ6biQlGwqENCpja33NTKLKSmOa8O+ClmokiHd+VR9Z7Xox9mGLS+90aodo2/2H64gWsMS+33azRyx00K9yMB1vGS6QQD1 alice0meta@gmail.com'
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config; service ssh restart # disable root ssh

curl -sL https://deb.nodesource.com/setup_5.x | bash -; apt-get install -y nodejs
apt-get install -y nginx

chown -R alice /var/log/nginx/
echo include ~alice/nginx.conf > /etc/nginx/nginx.conf 

# fail2ban? firewall? sudomail? server oom reboot? http://feross.org/how-to-setup-your-linode/

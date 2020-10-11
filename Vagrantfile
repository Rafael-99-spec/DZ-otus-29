# -*- mode: ruby -*-
# vim: set ft=ruby :
# -*- mode: ruby -*-
# vim: set ft=ruby :

MACHINES = {
  :R1 => {
        :box_name => "centos/7",
        #:public => {:ip => '10.10.10.1', :adapter => 1},
        :net => [
                   {ip: '1.1.1.2', adapter: 2, netmask: "255.255.255.0", virtualbox__intnet: "network-1"},
                   {ip: '2.2.2.1', adapter: 3, netmask: "255.255.255.0", virtualbox__intnet: "network-2"},
                ]
  },
  :R2 => {
        :box_name => "centos/7",
        :net => [
                   {ip: '2.2.2.2', adapter: 2, netmask: "255.255.255.0", virtualbox__intnet: "network-2"},
                   {ip: '3.3.3.1', adapter: 3, netmask: "255.255.255.0", virtualbox__intnet: "network-3"},
                ]
  },
  
  :R3 => {
        :box_name => "centos/7",
        :net => [
                   {ip: '3.3.3.2', adapter: 2, netmask: "255.255.255.0", virtualbox__intnet: "network-3"},
                   {ip: '1.1.1.1', adapter: 3, netmask: "255.255.255.0", virtualbox__intnet: "network-1"},
                ]
  },
}

Vagrant.configure("2") do |config|

  MACHINES.each do |boxname, boxconfig|

    config.vm.define boxname do |box|

        box.vm.box = boxconfig[:box_name]
        box.vm.host_name = boxname.to_s

        boxconfig[:net].each do |ipconf|
          box.vm.network "private_network", ipconf
        end
        
        if boxconfig.key?(:public)
          box.vm.network "public_network", boxconfig[:public]
        end

        box.vm.provision "shell", inline: <<-SHELL
          mkdir -p ~root/.ssh
                cp ~vagrant/.ssh/auth* ~root/.ssh
        SHELL
        
        case boxname.to_s
        when "R1"
          box.vm.provision "shell", run: "always", inline: <<-SHELL
            yum install epel-release -y && yum install net-tools tcpdump nano vim quagga -y
            echo "toor" | sudo passwd root --stdin
            cp /usr/share/doc/quagga-0.99.22.4/zebra.conf.sample /etc/quagga/zebra.conf
            systemctl start quagga
            systemctl enable quagga
            setsebool -P zebra_write_config 1
            cp /usr/share/doc/quagga-0.99.22.4/ospfd.conf.sample /etc/quagga/ospfd.conf
            chown quagga:quaggavt /etc/quagga/ospfd.conf
            systemctl strat ospfd.service 
            systemctl enable ospfd.service 
            SHELL
        when "R2"
          box.vm.provision "shell", run: "always", inline: <<-SHELL
            yum install epel-release -y && yum install net-tools tcpdump nano vim quagga -y
            echo "toor" | sudo passwd root --stdin
            cp /usr/share/doc/quagga-0.99.22.4/zebra.conf.sample /etc/quagga/zebra.conf
            systemctl start quagga
            systemctl enable quagga
            setsebool -P zebra_write_config 1
            cp /usr/share/doc/quagga-0.99.22.4/ospfd.conf.sample /etc/quagga/ospfd.conf
            chown quagga:quaggavt /etc/quagga/ospfd.conf
            systemctl strat ospfd.service 
            systemctl enable ospfd.service 
            SHELL
        when "R3"
          box.vm.provision "shell", run: "always", inline: <<-SHELL
            yum install epel-release -y && yum install net-tools tcpdump nano vim quagga -y
            echo "toor" | sudo passwd root --stdin
            cp /usr/share/doc/quagga-0.99.22.4/zebra.conf.sample /etc/quagga/zebra.conf
            systemctl start quagga
            systemctl enable quagga
            setsebool -P zebra_write_config 1
            cp /usr/share/doc/quagga-0.99.22.4/ospfd.conf.sample /etc/quagga/ospfd.conf
            chown quagga:quaggavt /etc/quagga/ospfd.conf
            systemctl strat ospfd.service 
            systemctl enable ospfd.service 
            SHELL
        end

    end

  end
  
  
end

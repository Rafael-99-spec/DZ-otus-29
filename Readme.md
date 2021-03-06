# ДЗ №24 Статическая и динамическая маршрутизация, OSPF
### OSPF
- Поднять три виртуалки
- Объединить их разными vlan
1. Поднять OSPF между машинами на базе Quagga
2. Изобразить ассиметричный роутинг
3. Сделать один из линков "дорогим", но что бы при этом роутинг был симметричным
--------------------------------------------------------------------------------------------

Для разворачинвания рабочего стенда необходимо склонировать на локальное хранилище, зайти в папку репозитоия и запустить стенд командой - ```vagrant up```


### Практическая часть
- Создан специальный ansible-плейбук + Vagrantfile, с помощью которого разворачиваются 3 ВМ(Router-ы). Каждый Router предположим имеет за собой локальную(частную) сеть, и перед нами стоит задача настроить доступ между этими сетями путем настройки динамической маршрутизации. Развернут доступ между сетями путем настройки динамической маршрутизации OSPF, с помощью linux-пакета quagga. 

![image](https://github.com/Rafael-99-spec/DZ-otus-29/blob/main/OSPF.PNG)

Описание маршрутов
```
[vagrant@r1 ~]$ ip route show
default via 10.0.2.2 dev eth0 proto dhcp metric 100 
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100 
172.20.10.0/24 dev eth1 proto kernel scope link src 172.20.10.1 metric 101 
172.20.20.0/24 via 192.168.0.2 dev eth2 proto zebra metric 20 
172.20.30.0/24 via 192.168.200.2 dev eth3 proto zebra metric 20 
192.168.0.0/30 dev eth2 proto kernel scope link src 192.168.0.1 metric 102 
192.168.100.0/30 proto zebra metric 20 
	nexthop via 192.168.0.2 dev eth2 weight 1 
	nexthop via 192.168.200.2 dev eth3 weight 1 
192.168.200.0/30 dev eth3 proto kernel scope link src 192.168.200.1 metric 103 


[vagrant@r2 ~]$ ip route show
default via 10.0.2.2 dev eth0 proto dhcp metric 101 
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 101 
172.20.10.0/24 via 192.168.0.1 dev eth2 proto zebra metric 20 
172.20.20.0/24 dev eth1 proto kernel scope link src 172.20.20.1 metric 100 
172.20.30.0/24 via 192.168.100.1 dev eth3 proto zebra metric 20 
192.168.0.0/30 dev eth2 proto kernel scope link src 192.168.0.2 metric 102 
192.168.100.0/30 dev eth3 proto kernel scope link src 192.168.100.2 metric 103 
192.168.200.0/30 proto zebra metric 20 
	nexthop via 192.168.0.1 dev eth2 weight 1 
	nexthop via 192.168.100.1 dev eth3 weight 1 

    
[vagrant@r3 ~]$ ip route show
default via 10.0.2.2 dev eth0 proto dhcp metric 100 
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100 
172.20.10.0/24 via 192.168.200.1 dev eth2 proto zebra metric 20 
172.20.20.0/24 via 192.168.100.2 dev eth3 proto zebra metric 20 
172.20.30.0/24 dev eth1 proto kernel scope link src 172.20.30.1 metric 101 
192.168.0.0/30 proto zebra metric 20 
	nexthop via 192.168.200.1 dev eth2 weight 1 
	nexthop via 192.168.100.2 dev eth3 weight 1 
192.168.100.0/30 dev eth3 proto kernel scope link src 192.168.100.1 metric 103 
192.168.200.0/30 dev eth2 proto kernel scope link src 192.168.200.2 metric 102 
```
Симметричная маршрутизация:
```
[vagrant@r1 ~]$ ip a | grep 172
    inet 172.20.10.1/24 brd 172.20.10.255 scope global noprefixroute eth1
[vagrant@r1 ~]$ tracepath 172.20.20.1
 1?: [LOCALHOST]                                         pmtu 1500
 1:  172.20.20.1                                           1.034ms reached
 1:  172.20.20.1                                           1.018ms reached
     Resume: pmtu 1500 hops 1 back 1 
```

Меняя вес пути в подсети 192.168.0.0/30(которая связывает r1 и r2), для интерфейса 192.168.0.1 роутера r1, например до 1000, получим ассиметричную маршрутизацию:
```
r1# conf t 
r1(config)# int eth2
r1(config-if)# ip ospf cost 1000
r1(config-if)# exit
r1(config)# exit
r1# exit
[root@r1 vagrant]# tracepath 172.20.20.1
 1?: [LOCALHOST]                                         pmtu 1500
 1:  192.168.200.2                                         0.855ms 
 1:  192.168.200.2                                         2.295ms 
 2:  172.20.20.1                                           6.034ms reached
     Resume: pmtu 1500 hops 2 back 2 
```
Вернуть симметричность маршрутизирования можно путем увеличения веса пути до 1000 в подсети 192.168.100.0/30 для интерфейса 192.168.100.1 роутера r3.
```
[root@r3 vagrant]# vtysh

Hello, this is Quagga (version 0.99.22.4).
Copyright 1996-2005 Kunihiro Ishiguro, et al.

r3# conf t
r3(config)# int eth3
r3(config-if)# ip ospf  cost 1000
r3(config-if)# exit
r3(config)# exit
r3# exit

[root@r1 vagrant]# tracepath 172.20.20.1
 1?: [LOCALHOST]                                         pmtu 1500
 1:  172.20.20.1                                           0.916ms reached
 1:  172.20.20.1                                           0.877ms reached
     Resume: pmtu 1500 hops 1 back 1
```

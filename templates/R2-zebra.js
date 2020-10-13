!
hostname Router
password zebra
enable password zebra
!
interface eth0
 ipv6 nd suppress-ra
!
interface eth1
 ipv6 nd suppress-ra
!
interface eth2
 ipv6 nd suppress-ra
!
interface lo
!
ip forwarding
!
!
line vty
!

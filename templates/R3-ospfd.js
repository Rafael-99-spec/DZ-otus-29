!
hostname ospfd
password zebra
log stdout
!
!
!
interface eth0
!
interface eth1
!
interface eth2
!
interface lo
!
router ospf
 network 1.1.1.0/24 area 0.0.0.0
 network 2.2.2.0/24 area 0.0.0.0
 network 3.3.3.0/24 area 0.0.0.0
 neighbor 1.1.1.2
 neighbor 3.3.3.1
!
line vty
!

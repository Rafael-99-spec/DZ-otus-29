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

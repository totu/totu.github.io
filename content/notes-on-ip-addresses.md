title: Notes on IP addresses
date: 2018-08-01
# Notes on IP addresses
These are some wonky ways IP addresses are handles in different applications. Using one (or many) of these could get through that pesky firewall.
## You can shorten IP addresses by dropping zeroes

```py
1.0.0.1 == 1.1
192.168.0.1 == 192.168.1
```

## Hexadecimals are valid addresses

```py
0xC0A80001 == 3232235521 == 192.168.0.1
```

## You can also utilize overflows

```py
192.168.257 => 192.168.1.1
192.168.516 => 192.168.2.4
```

## In C -based programs 0 is same as localhost

```sh
$ ping 0
PING 0 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl᠔ timeɢ.052 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl᠔ timeɢ.048 ms
^C
--- 0 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1027ms
rtt min/avg/max/mdev = 0.048/0.050/0.052/0.002 ms
```

## Left bitwise shift operator works as well

```py
>>> (127<<24) + (0<<16) + (0<<8) + 1
2130706433
```
<p></p>
```sh
$ ping 2130706433
PING 2130706433 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl᠔ timeɢ.039 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl᠔ timeɢ.052 ms
^C
--- 2130706433 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1025ms
rtt min/avg/max/mdev = 0.039/0.045/0.052/0.009 ms
```
~I've [made a tool](/ip/) that helps mangle IP addresses.~

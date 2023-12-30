title: Pi-Hole - Local Ad blocking DNS
date: 2021-06-25
# PiHole - Local Ad blocking DNS

I've been using a [Pi-Hole][1] as my primary DNS for well over 6 years and I must say that is works wonderfully. Recently I introduced a colleague to it, I've somehow always thought that this was a trivial solution - something that everyone had already implemented on their own or if they hadn't they simply didn't care. However it just might be that this is one of those topics I just assume everyone has researched while it might just be my niche interest.

## What is DNS?

Let's start from the basic. [DNS][2] or Domain Name System is how computers turn human readable [domain names][3] (such as topituulensuu.com) into [IP addresses][4] so you don't have to remember addresses such as 185.199.110.153 (the address I get at the moment of writting this for topituulensuu.com). Your [ISP][5] (Internet Service Provider) provides you with a set of DNS servers as part of the deal, but this is one way your ISP can both monitor and censor you and your opinions. With easy denial of serving some domain names (such as https://thepiratebay.org/) your Internet usage can be controlled. For decades I used external DNS (back then I used [Google's famous 8.8.8.8 server][6]) however Pi-Hole came to my life partly because I wanted to de-google myself. You didn't think Google was giving you fast DNS for free, right? If all of your DNS queries go to the world's largest advertisement company it might reveal something about you and your browsing habbits, don't you think?

## Public solutions

I've already brushed on the Google's public DNS, but there are several others who are more or less reliable and doing more or less shady stuff with your data. Obviously which ever DNS server you are using as your source of truth gets to know a lot about you via the domains you visit / your devices talk with.

For absolute best performance you might want to look at [GRC's DNS benchmark utility][7]. With it you can race different public DNS providers (as well as your ISPs) and see which delivers fastest responses. If you don't care about the privacy / security aspects this could provide noticeable difference in your browsing speed.

Then if you want more privacy / security my current favorite is [quad9][8]. They provide DNS with some privacy and extra security by [sinkholing][9] known malicious domains.

## Why run your own?

Running your own DNS that still is based on a public one doesn't really bring any benefits. Yes with caching you can reach sites you visit often faster, but the real benefit of running a Pi-Hole is their extra Ad blocking list(s). Meaning it sinkholes you domains that are known to servce ads. At first I was skeptical about this working, but I hadn't actually set my switch to override my ISPs DNS servers so I was still using my ISPs servers. This is why my stance for long time was that you should still run ad blocker like [uBlock Origin][10] on top of Pi-Hole, but I recently noticed that this is no longer necessary, however I still recommend doing so and I am still going to be running both.

Final note about reliability: I used to run my Pi-Hole on RPi3 that was also running [OctoPrint][12], however when I moved my 3D printer into storage I didn't want to disassemble the pi, so I just threw together RPi Zero W with Ethernet hat which is just as sketchy as it sounds like, however it has served me well for past 3+ years only today as I was installing another RPi to serve as [SMB][13] share did I install a secondary Pi-Hole. So I would call that reliable, but your mileage may vary.

I will leave you with a check list of sorts for things to remember when setting up your own Pi-Hole.

1. General Raspian note: remove `/etc/sudoers.d/010_pi-nopasswd` & remove `pi` user from `sudo` group
2. [Clone the repo and run the installer][11]
3. Open `http` and `dns` in `ufw` (install / enable `ufw` if you don't have it)
4. Set admin password for the web UI
5. Change your default DNS server from your switch's / router's settings
6. If you can't do above change your machine's DNS server (this however means your phone and other devices won't gain benefits)
7. Verify your new Pi-Hole is working (`dig topituulensuu.com` you should see something like this)

```sh
$ dig topituulensuu.com

; <<>> DiG 9.10.6 <<>> topituulensuu.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 62392
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;topituulensuu.com.		IN	A

;; ANSWER SECTION:
topituulensuu.com.	900	IN	A	185.199.109.153
topituulensuu.com.	900	IN	A	185.199.110.153

;; Query time: 165 msec
;; SERVER: 192.168.0.6#53(192.168.0.6)
;; WHEN: Fri Jun 25 08:02:16 EEST 2021
;; MSG SIZE  rcvd: 78
```

Note the `SERVER: 192.168.0.6#53(192.168.0.6)` that is the IP address of one of my Pi-Holes in my intranet.

[1]: https://pi-hole.net/ "pihole"
[2]: https://en.wikipedia.org/wiki/Domain_Name_System "Wikipedia - Domain Name System"
[3]: https://en.wikipedia.org/wiki/Domain_name "Wikipedia - Domain name"
[4]: https://en.wikipedia.org/wiki/IP_address "Wikipedia - IP address"
[5]: https://en.wikipedia.org/wiki/Internet_service_provider "Wikipedia - Internet service provider"
[6]: https://developers.google.com/speed/public-dns/ "Google's public DNS"
[7]: https://www.grc.com/dns/benchmark.htm "GRC's DNS Benchmark"
[8]: https://www.quad9.net/ "quad9"
[9]: https://en.wikipedia.org/wiki/DNS_sinkhole "Wikipedia - DNS sinkhole"
[10]: https://ublockorigin.com/ "uBlock Origin"
[11]: https://github.com/pi-hole/pi-hole/#method-1-clone-our-repository-and-run "Pi-Hole installation methods"
[12]: https://octoprint.org/ "OctoPrint"
[13]: https://en.wikipedia.org/wiki/Server_Message_Block "Wikipedia - Server Message Block"

title: Raspian is broken AF!
date: 2021-06-24
# Raspian is broken AF!"
I was repurposing a useless RPi4 board to serve as SMB server. I started by installing [latest Raspberry Pi OS Lite][1]. Steps to enable networking and headless SSH worked fine. I also found instructions on how to setup external drive to serve as samba share. Cool! Everything is fine, right? Wrong.

## Case of excess privileges

After making sure my share worked with Windows, OS X, and iOS I started to harden my new pi. I did normal shit install &amp; enable `ufw`. Then install and setup `fail2ban`. Setup SSH keys, disable password login, cool - cool. Next I removed `pi` user from `sudo` group, but I forgot to add my own user... Shit... Maybe I still have my sudoes privileges since I haven't logged out yet.
```sh
pi@jakorasia:~ $ sudo su
root@jakorasia:/home/pi#
```

Nice! But I felt like that shouldn't have worked. Let's check groups just in case I misstyped `usermod` or something

```sh
pi@jakorasia:~ $ groups
pi
```

WTF... That doesn't look correct. Is the sudoers file somehow broken?

```conf
#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
# See the man page for details on how to write a sudoers file.
#
Defaults    env_reset
Defaults    mail_badpass
Defaults    secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Host alias specification
# User alias specification
# Cmnd alias specification

# User privilege specification
root    ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo    ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "#include" directives:
#includedir /etc/sudoers.d
```

Looks fine to me

Anyways at this point I setup my own account. Rebooted. Verified that the SMB share still worked. Flawless! But I just had to make sure and...

```sh
pi@jakorasia:~ $ groups
pi
pi@jakorasia:~ $ sudo su
root@jakorasia:/home/pi#
```

So what the hell is going on? After some more staring at `/etc/sudoers` and fiddling with the groups I realized that the last line (`#includedir /etc/sudoers.d`) isn't a comment. Let's check it out.

```sh
root@jakorasia:/home/pi# ls /etc/sudoers.d/
010_at-export  010_pi-nopasswd    010_proxy  README
```

That `010_pi-nopasswd` looks pretty suspicious, don't you think?

```sh
root@jakorasia:/home/pi# cat /etc/sudoers.d/010_pi-nopasswd
pi ALL=(ALL) NOPASSWD: ALL
```

**NO. FUCKING. WAY!** Rasbian ships with literally **no root password** for the **default** user. I guess this is fine, but how many people are running their RPis absolutely clueless about this `NOPASSWD` default? Maybe it is just me, but this kind of default seems almost heretical. Why even ship `sudo` if you are just going to bypass it? I guess the take away is that you really need to change that `pi` password to something secure or just install something else than Rasbian.

[1]: https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit "Rasberry Pi OS"

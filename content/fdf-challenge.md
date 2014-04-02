title: Finnish Defence Forces recruitment challenge
date: 2020-05-05
# FDF Recruitment Challenge
On 17th of Appril FDF (Finnish Defence Forces) tweeted this:

<blockquote class="twitter-tweet"><p lang="fi" dir="ltr">Onko assembly yksi kielistäsi? Osaatko kokea kyberin verkot, uskallatko sukeltaa kyberin Mariaanien hautaan tietämättä mikä pohjalla odottaa? Ovatko poikittaiset bitit este vai haaste - ratkaise <a href="https://twitter.com/hashtag/pvhakuhaaste2020?src=hash&amp;ref_src=twsrc%5Etfw">#pvhakuhaaste2020</a> ja hae tehtäviä! <a href="https://t.co/z7YoYRQYBd">pic.twitter.com/z7YoYRQYBd</a></p>&mdash; Puolustusvoimat (@Puolustusvoimat) <a href="https://twitter.com/Puolustusvoimat/status/1251139182111739904?ref_src=twsrc%5Etfw">April 17, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Decoding the QR code

Well, this wasn't hard. For one QR codes are pretty common thing these days and the world is full of QR code decoders (every smartphone's stock camera app can do it) and secondly I have [some experience][1] with making and decoding them. The text contained in it was:

```
HFCUKQKENFPF4SCIJBOUOMR5IU5EAPJ5GZOTOOS6G45FY5LYLY5D2PSAHJCUMRDOHI2WYYLGLRQWQZ24MFPWC
XYKBI4UKRKBNFPF4YDFMROWCYK5MBSV2YDHM5PECRZZGI6EMOJSGJCEKNTBL5QV6XJTHI7QUCRHYOSEISSFJJ
CDSSWDWY6DZQ5EJJCELQ5EEBLTGQ2GIU3FYN2AIM2DMWBAGY5CARJSINDTURJSEA3DUPGDUQQEIMRSEBCTMOJ
VYOSCAPR2IRCMHJGDUQ7SARZSHI4TMNSEIQZF2CQK
```

## Getting stuck

I know this is pretty early to get stuck, but I couldn't for the life of me figure out what encoding this was. First I threw it into my [string transformer][2], but nothing made any sense. Thankfully my good friend [Temme][3] (who posted the tweet on discord) came to rescue. He figured out this was [Base32][4] encoded text and he was right. Even though I had never even heard of base32 it is part of [RFC 4648][5]. When decoded the coding transforms to this:

```
9EEADi^^HHH]G2=E:@==6]7:^7:\ux^:=>@:EFDn:5laf\ahg\a_a_
9EEAi^^`ed]aa]`e]`gg^AG92<F922DE6a_a_]3:?
'äDJEJD9Jö<<äJDEä W3CFE6Ο@C46X 6: E2CG:E2 6:<ä D22 E695ä >:DDää?G2:966DD2]
```

## Answers from unexpected place

This had stompped Temme, so it was my time to shine. As is apparent the first two lines start with **`9EEA`**, so that is where I focued my Googling. First result was one of thous encrypted message subreddits with no upvotes or comments, so no help. Second was some typing game fandom wiki. From there it became obvious that they had encoded URL with this scheme, but no suggestion what scheme was used. Third result was to Finnish astrology forum's music section. They were sharing URL to youtube again encoded with our mystery scheme, but now with helpfully saying to use rot47 to decode the hidden message. I tried rot47 and this was the result:

```
https://www.valtiolle.fi/fi-FI/ilmoitus?id=27-298-2020
http://165.22.16.188/pvhakuhaaste2020.bin
Väsytyshyökkäystä (brute-force) ei tarvita eikä saa tehdä missään vaiheessa.
```

A link to the recruitment page for FDF for the position, a link to a *.bin file, and little message: "Brute-force not necessary and forbidden during the challenge". This is looking better. NOTE: I've since added both Base32 and rot47 into my transformer.

## Peek inside

First thing I did on the binary file was simple `file` command

```sh
$ file pvhakuhaaste2020.bin
pvhakuhaaste2020.bin: ELF 64-bit LSB executable, x86-64, version 1 (SYSV),
statically linked, BuildID[sha1]=37e8a0e3a6e3c1ac779c4663798467f607ced9ec,
for GNU/Linux 3.2.0, stripped
```

Nothing special, but at least it is ELF file for Linux, so I don't need to spin up Windows machine. Next I ran `strings` on it.

```sh
$ file pvhakuhaaste2020.bin
...
Pick any number between 0 and 99:
Secret key: %s
Next step is %i.%i.%i.%i:%i
IP is valid until May 6 2020 2159Z
Your secret is %s
%s %s
%02x
Valid until May 6 2020 2159Z
Is this correct path?:
Bye..
...
```

I've left in only the interesting part I found from the dump. Obviously there is a **secret** burried somewhere in the binary. At this point I triend running it, but it didn't result anything interesting,

## Taming the dragon

Now I knew I was going to have to jump in the deep end and I installed `Ghidra`. I had never tried reverse engineering anything nor had I used any dissasembler, so this step was mostly blidly stumbling around. Eventually I found the search functionality (shortcut is `s` btw) and searched for **secret**.

<img style="width:90%;margin-left:5%;" src="/img/pv2020ghidra-variables.png">


Here is my _cleaned_ version of the function call that uses that string.

```c
undefined8 printSecret(uint param_1)
{
  undefined8 uVar1;
  undefined local_28 [24];
  uint local_10;
  uint local_c;

  if (param_1 == 1) {
    local_10 = 0;
    takeUserArgument("Pick any number between 0 and 99: ");
    stupidLockFunction(local_28,4,PTR_DAT_004a7128);
    local_10 = FUN_004073a0(local_28);
    if (local_10 == DAT_004a6ad4) {
      secretChanger(SECRET,(ulong)local_10);
    }
    takeUserArgument("Secret key: %s\n",SECRET);
    printIP(1);
    uVar1 = 0;
  }
  else {
    local_c = param_1 ^ 0xc;
    uVar1 = FUN_004013e5((ulong)(param_1 * local_c));
  }
  return uVar1;
}
```

Eventually I figured out that the **secrect** variable pointed to value **`FAD^U_$H%`**. However as you can see from above I also determined that the secret got changed by the `secretChanger()` function. Here's its dissassembly:

```c
void secretChanger(long secret,byte param_2)
{
  ulong uVar1;
  int local_1c;

  local_1c = 0;
  while( true ) {
    uVar1 = thunk_FUN_0040047e(secret);
    if (uVar1 <= (ulong)(long)local_1c) break;
    *(char *)(secret + local_1c) = (*(byte *)(secret + local_1c) ^ param_2) - 2;
    local_1c = local_1c + 1;
  }
  return;
}
```

I was very confused about the `while` loop, but now I think that it probably isn't a `while` loop, it probably is a `for` loop. What it does is loop over the **secret** then it `XORs` every byte of it with `param_2` and substracts `2` then turns it back into a `character` and as we can see from the `printSecret()` function this code is called with `local_10` as the second parameter, but only if `local_10` equals the value of address `004a6ad4` which happens to be `0x00000011` (`7` in decimal).

<img style="width:90%;margin-left:5%;" src="/img/pv2020-11.png">

Now we can take the **secret** loop it over with some `XOR` and math and well come up with...

```py
>>> "".join([chr((ord(x)^0x11)-2) for x in "FAD^U_$H%"])
'UNSMBL3W2'
```

## On to the IP

As the strings showed before this secret has something to do with an IP address (one that is valid only until May 6th of 2020). So lets figure that one out as well

```c
ulong printIP(uint param_1)
{
  int iVar1;
  ulong uVar2;
  undefined local_11 [5];
  uint local_c;

  if (param_1 == 1) {
    local_c = 0;
    stupidLockFunction(local_11,4,PTR_DAT_004a7128);
    local_c = FUN_004073a0(local_11);
    if (local_c == DAT_0x02) {
      ipChanger(&ip1,(ulong)local_c);
    }
    takeUserArgument("Next step is %i.%i.%i.%i:%i\n",(ulong)ip1,(ulong)ip2,(ulong)ip3,(ulong)ip4,
                     (ulong)port);
    print("IP is valid until May 6 2020 2159Z");
    uVar2 = 0;
  }
  else {
    iVar1 = printSecret((ulong)param_1);
    uVar2 = (ulong)(iVar1 + 2);
  }
  return uVar2;
}
```

From this `cleanedprintIP()` function we can dig up the IP and port: **178.62.90.158:80**, but if you visited that URL you just go following message:

<img style="width:90%;margin-left:5%;" src="/img/deadend.png">

What I missed the first time around was that IP is also manipulated with `XOR`

```c
void ipChanger(uint *IP1,uint 0x02)
{
  *IP1 = 0xd8 ^ *IP1 ^ 0x02;
  IP1[1] = 0xc4 ^ IP1[1] ^ 0x02;
  IP1[2] = 0x0e ^ IP1[2] ^ 0x02;
  IP1[3] = 0xec ^ IP1[3] ^ 0x02;
  IP1[4] = 0x02 ^ IP1[4] ^ 0x02;
  return;
}
```

Let's do the math again in python

```py
>>> offsets = [0xd8, 0xc4, 0x0e, 0xec, 0x02]
>>> ip = [178, 62, 90, 158, 80]
>>> [a^b^0x02 for a,b in zip(offsets, ip)]
[104, 248, 86, 112, 80]
```

And when we visit **http://104.248.86.112:80** we get following page

<img style="width:90%;margin-left:5%;" src="/img/pv2020last.png">

As per instructions lets make a pythong script that GETs the page first, scrapes the **code** and POSTs the **code** along with the **secret** to the given IP.

```py
#!/usr/bin/env python3
import requests
ip = "104.248.86.112"
secret = "UNSMBL3W2"

first = requests.get("http://" + ip)
challenge = first.text.split("<b>")[1].split("</b>")[0]
second_ip = first.text.split("<b>")[2].split("</b>")[0]
print(secret, challenge, second_ip)

data = {"secret": secret, "key": challenge}
second = requests.post("http://" + second_ip, data=data)
print(second.status_code, second.text)
```

As a result we get:

<img style="width:90%;margin-left:5%;" src="/img/pv2020final.png">

[1]: https://topituulensuu.com/archive/qrxfl/ "QRXFL"
[2]: https://topituulensuu.com/transformer/ "Transformer"
[3]: https://temme.dy.fi/ "Temme's homepage"
[4]: https://en.wikipedia.org/wiki/Base32 "Wikipedia - Base32"
[5]: https://tools.ietf.org/html/rfc4648 "RFC 4658"

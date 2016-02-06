---
layout: post
title: "PVCC #5: Binäärejä"
date: 2015-07-21T21:16:32+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Viidennessä kysymys ei ole niinkään kysymys, kuin kasa ykkösiä ja nollia.


>00101001 00111000 00110111 00101010 00111011 00101011
01111000 01101111 01110010 01011000 01001111 01010010


Selkeästi kyseessä on binäärejä.

Käydään nopeasti lävitse bitin ja tavun ero. Bitti on tietokoneiden perusyksikkö, se on numero joka voi olla joko 1 tai 0. Tavu on kahdeksan bittiä. Kuten nokkelimmat jo huomasivat, binäärimme on jaettu kahdeksaan kahdeksan bitin sarjaan, eli kahdeksaan tavuun.

Ensimmäinen tavu on `00101001`. Bitit luetaan oikealta vasemmalle ja niiden arvot aina tuplaantuu, eli ensimmäinen tavu aivan oikealla vastaa numeroa 1. Seuraava vasemmalle, eli toinen tavu vastaa numeroa 2. Kolmas vasemmalle vastaa numeroa 4. Seuraava on 8 ja sitten 16 jne. Koska tavussa on kahdeksan bittiä voi se saada arvon väliltä 0 - 255. Kyseinen tavu siis vastaa \\(00101001 = 1 + 8 + 32 = 41\\).

Koska tehtävässä ei erikseen mainita mitä binäärillä tulee tehdä, oletan että kyseessä on jonkinlainen ASCII jono. [ASCII table](http://www.asciitable.com/) -sivun mukaan numero 41 vastaa merkkiä ")". Nyt tietty voidaan laskea kaikki tavut käsin yhteen ja etsiä ne tuolta taulusta, taikka sitten voidaan kokeilla jotain muuta.

~~~ python
>>> import binascii
>>> b = "00101001 00111000 00110111 00101010 00111011 00101011 01111000 01101111 01110010 01011000 01001111 01010010".replace(" ", "")
>>> n = int('0b'+b, 2)
>>> binascii.unhexlify('%x' % n)
b')87*;+xorXOR'
~~~

Ja siinä saatiin vastaus joka näyttää olevan: `)87*;+xorXOR`.

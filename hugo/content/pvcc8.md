---
layout: post
title: "PVCC #8: Salasanojen varjostusta"
date: 2015-07-23T09:50:51+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Kahdeksannessa kysymyksessä meille annetaan seuraava rivi `/etc/shaow` tiedostosta

~~~ bash
admin:65kKfJ.oFg1/Y:16615:0:99999:7:::
~~~

Sekä kaksi kysymystä

1. Mikä on salasana?
2. Miltä rivi näyttäisi jos salasana generoitaisiin 5000 kierroksella sha512 ja käytettäisiin salttina/suolana jonoa `saltsaltsaltsalt`?

Käydään ekana vähän läpi `/etc/shadow` tiedoston koostomusta. Jokainen rivi on jaettu osiin kaksoispisteellä (:). Ensimmäinen osa on käyttäjätunnus. Toinen osa on salasanan hash. Kolmas kertoo milloin salasana on viimeksi vaihdettu. Neljäs numero kertoo milloin salasanan saa seuraavaksi vaihtaa. Viides numero kertoo milloin salasana pitää viimeistään vaihtaa. Kuudes numero kertoo kuinka kauan ennen salasanan vanhenemista käyttäjää varoitetaan. Seitsemäs kertoo kuinka monta päivää salasanan vanhenemisen jälkeen käyttäjätunnus pystyy aktiivisena. Viimeinen luku kertoo päivän milloin käyttäjä tunnukselle ei enää voi kirjautua.

Aluksi meidän tulee tunnistaa mitä hashia salasanassa käytetään, joten löin salasanan [Hash Identifier](https://code.google.com/p/hash-identifier/) skriptin lävitse.

~~~ python
HASH: 65kKfJ.oFg1/Y

Possible Hashs:
[+]  DES(Unix)
~~~

Tässä kohtaa itseltä lähti vähän homma lapasesta. Vaikka DES on ollutkin "rikki" jo kymmeniä vuosia menee sen brute forcaukseen silti tunteja hyvällä laitteistolla ja päiviä huonolla laitteistolla. Päätin silti koittaa brute forcausta ja kirjoitin seuraavan hyvin naivin ohjelman ja pistin pyörimään.

~~~ python
import itertools
import crypt
import hmac

def brute(chars, hash):
    chars = 'abcdefghijklmnopqrstuvwtxyz'
    for length in range(1, 9):
        attempt = itertools.product(chars, repeat=length)
        for a in attempt:
            password = ''.join(a)
            if hmac.compare_digest(crypt.crypt(password, hash), hash):
                print('%s = %s' % (hash, password))
                return
~~~

Kun kyseinen skripti oli pyörinyt pari tuntia, eikä ollut vielä päässyt lähellekään lyhyttä loppuaan aloin huolestua hyökkäyksestä. IRCin puolella jo ehdotettiin että koettaisin ajaa skriptiä nVidian Cuda kirjaston päällä, näin saaden paljon enemmän laskenta tehoa irti koneesta, mutta sain paremman idea: Sanakirja hyökkäys! Googletin erinäköisiä salasana kirjastoja ja päädyin käyttämään [Stricture Groupin Top 100 Adobe salasana listaa](http://stricture-group.com/files/adobe-top100.txt). Ja kirjoitin seuraavan hyökkäys skriptin.

~~~ python
import crypt
import hmac

def dictionaryAttack(wordlist, hash):
    passwords = open(wordlist, encoding='utf-8')

    for password in passwords:
        if hmac.compare_digest(crypt.crypt(password, hash), hash):
            print('%s = %s' % (hash, password))
            return
~~~

Mikä löysi tuloksen lähes välittömästi, mutta lähinnä koska salasana oli `password` ja se sattui olemaan kolmanneksi yleisin salasana kyseisellä listalla. En oikein tiedä olinko vain onnellinen vai oliko tämä suunniteltu lopputulos, mutta salasana on nyt tiedossa joten kohti seuraavaa kysymystä: Hashataan salasana `password` 5000 kertaa käyttäen `SHA512` kryptausta ja `saltsaltsaltsalt` merkkijonoa suolana.

~~~ python
import hashlib

password = 'password'

for i in range(5000):
    h = hashlib.new('sha512')
    h.update(b'saltsaltsaltsalt')
    h.update(bytes(password, 'utf-8'))
    password = h.hexdigest()
    print(password)
~~~

Loppu tuloksena on aikamoinen hirviö `243b5bee3315ce38400393d5965116260e6ec99f1648179a14f3b33ac3d8d46c8e03a99a4196fffa591aabb89e6fc8a41d3e3c3982a9c7277cc1e375e3100d7c`. Oikea kysymys oli kuitenkin miltä `/etc/shadow` tiedoston rivi näyttää uuden salasanan kanssa. Jos Shadow tiedostossa on tarvetta useammalle kentälle salasana kenttä sisällä käytetään `$` merkkiä erottamaan eri kentät toisistaan. Ensimmäinen kenttä kertoo mitä hashia käytetään. Unix käyttöjärjestelmien salasanoissa `6` tarkoittaa `SHA512` kryptausta. Toisessa kentässä on suolaus, eli `saltsaltsaltsalt`. Kolmannessa kentässä on itse salasanan hash.

~~~ bash
admin:$6$saltsaltsaltsalt$243b5bee3315ce38400393d5965116260e6ec99f1648179a14f3b33ac3d8d46c8e03a99a4196fffa591aabb89e6fc8a41d3e3c3982a9c7277cc1e375e3100d7c:16615:0:99999:7:::
~~~

Tässä meni yllättävän kauan aikaa, aluksi en tiennyt toimiko brute force skripti (toimi, mutta hitaasti) ja olin jo luopua toivosta ja maksaa pilvi cräkkäys palvelusta kuten [Hashcrack](http://hashcrack.org/), mutta onneksi tuli mieleen tuo sanakirja hyökkäys.

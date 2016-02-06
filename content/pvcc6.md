---
layout: post
title: "PVCC #6: Ethernet kehys"
date: 2015-07-22T11:31:28+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Kuudennessa kysymyksessä käsitellään Ethernet kehystä. Meille annettiin vain seuraava hexa dumppi ja muutama kysymys.

>5254 0012 3502 0800
274A A3B1 0800 4500
0034 DA63 0000 4011
8A37 0A00 020F 0808
0808 DD7C 0035 0020
1C50 519F 0100 0001
0000 0000 0000 036D
696C 0266 6900 0001
0001

Ennen kuin mennään kysymyksiin pitää meidän kuitenkin dekoodata kehys. Koska itseltä löytyy heikosti tietoa Ethernet kehysten purkamisesta, ensi vaistoni oli lyödä hexa [Wiresharkkiin](https://www.wireshark.org/) ja tökkiä sitä kunnes se paljastaa salaisuutensa. Wireshark ei kuitenkaan suostunut avaamaan kyseistä dumppia, en tiedä onko kehys puukotettu toimimattomaksi Wiresharkin kanssa, vai pitäisikö sille tehdä jotain erikoista ennen kun Wireshark suosuu syömään sen, mutta ei hätä ole tämän näköinen. Aina voidaan dekoodata kehys käsin speksistä.

# MAC-otsikko

Ethernet kehys alkaa 20 tavun MAC-otsikolla, josta ensinmäiset 12 tavua kertoo kohteen ja lähteen MAC-osoitteet.

~~~ code
Kohde MAC:      52 54 00 12 35 02
Lähde MAC:      08 00 27 4A A3 B1
~~~

Seuraavat kaksi tavua kertovat kehyksen tyypin ja merkkaavat otsikon lopun.

~~~ code
EtherType:      08 00
~~~

Ether tyyppi `0x0800` kertoo meille että kyseessä on IPv4 paketti, joten seuraavaksi tulee IP-otsikko.

# IP-otsikko

IPv4-otsikon ensinmäinen tavu kertoo meille version ja otsikon pituuden.


~~~ code
IP Versio:      45
~~~

Seuraava tavu on hieman erikoinen, ennen se oli "Type of Service (ToS)", mutta nykyään se on jaettu kahtia "Differentiated Services Code Poit (DSCP)" ja "Exokicit Congestion Notification (ECN)" kesken. DSCP käyttää ensinmäiset 6 tavua ja ECN loput kaks. Niitä käytetään verkon laadun monitorointiin.

~~~ code
QoS:             00
~~~

Seuraavat kaksi tavua kertoo koko paketin (otsikko + data) koon. Minimi on 20 tavua, koska se on otsikon koko. the header.

~~~ code
IP Koko:         00 34
~~~

Seuraavia kahta tavua käytetään paketti osan uniikkiin tunnistamiseen.

~~~ code
ID:              DA 63
~~~

Seuraavat kaksi tavua on jaettu ns. lippujen (flags) ja osoittamaan kyseisen paketin osuuden sijainti ensinmäisestä paketista (fragment offset). Lipput käyttävät ensimmäiset kolme bittiä ja fragment offset loput.
~~~ code
Liput/Offset     00 00  
~~~

Seuraava tavu osoittaa paketin eloajan (Time to Live)

~~~ code
TTL:             40
~~~

Seuraava tavu kertoo mikä protokola on kyseessä.

~~~ code
Protocol:        11
~~~

Ja jos tutkitaan mikä ihme paketti on `0x11` se osoittautuu User Datagram Protokolaksi (UDP) [tämän IP protokola numer listan](https://en.wikipedia.org/wiki/List_of_IP_protocol_numbers) mukaan.

Seuraavat kaksi tavua ovat tarkistus summa otsikolle.

~~~ code
Checksum:        8A 37
~~~

Seuraavat kahdeksan tavua kertoo lähde ja kohde IP-osoitteet.

~~~ code
Lähde IP:        0A 00 02 0F
Kohde IP:        08 08 08 08
~~~

Muutetaan IP-osoitteet hieman tutumpaan muotoon.

~~~ python
>>> res = ''
>>> source = '0A 00 02 0F'.split(' ')
>>> for s in source:
...   res += str(int('0x'+s, 0)) + '.'
>>> print(res)
10.0.2.15.
~~~

Kohde osoitetta ei tarvitse edes ajaa skriptistä lävitse, sillä `0x08` = 8, joten kohde IP näyttää olevan Googlen DNS palvelin `8.8.8.8`. Tähän myös loppuu IP osio. Seuraavaksi tulee itse protokolan otsikko, joka on tässä tapauksessa UDP.

# UDP-otsikko

UDP-otsikko koostuu kahdeksasta tavusta. Ensimmäiset neljä kuvaa lähde ja kohde portteja.

~~~ code
Lähde Portti:   DD 7C
Kohde Portti:   00 35
~~~

Dekoodataan portit.

~~~ python
>>> print(int('0xdd7c',0))
56700
>>> print(int('0x0035',0))
53
~~~

Seuraavat kaksi tavua kertoo UDP paketin koon (otsikko + data)

~~~ code
UDP koko:        00 20
~~~

Viimeiset kaksi tavua on taas tarkistus summa

~~~
UDP checksum:    1C 50
~~~

# DNS-otsikko

Koska kyseinen kehys on menossa Googlen DNS palvelimelle ja vielä porttiin 53 (DNS oletus portti on 53), oletan että meillä on tässä käsissä DNS kysely.

Ensimmäisiä kahta tavua käytetään tunnistautumiseen.

~~~ code
ID:              51 9F
~~~

Kaksi seuraavilla kahdella tavulla on monta tehtävää, mutta lyhyesti se on vastaus koodi, joka kertoo mitä seuraavaksi tulee tehdä.

~~~ code
Vastaus koodi:   01 00
~~~

Seuraavat kahdeksan tavua pitää kirjaa paketin sisällöstä. QDCount kertoo montako kysymystä paketissa on. ANCount kertoo vastausten määrän. NSCount kertoo nimipalveluiden resurssien määrän mitkä ovat "auktoriitti" osiossa. ARCount kertoo jos paketissa on ylimäärästä tietoa.

~~~ code
Qdcount:         00 01
Ancount:         00 00
Nscount:         00 00
Arcount:         00 00
~~~

# Data

Vihdoinkin päästään käsiksi itse dataan. Dekoodataan loput 12 tavua tekstiksi.

~~~ python
>>> bytes.fromhex('036D 696C 0266 6900 0001 0001').decode('utf-8')
'\x03mil\x02fi\x00\x00\x01\x00\x01'
~~~

Ensimmäinen hexa tavu `0x03` kertoo kuinka monta kirjainta sitä seuraa, eli 3. Ensimmäinen osa DNS kyselyä on siis `mil`. Seuraava hexa tavu `0x02` kertoo jälleen seuraavaksi tulevien kirjain määrän, eli 2, joten toinen osa kyselyä on `fi`. Loput tavut kyselyssä kertovat kyselyn lopun palvelimelle. Kun kyselyn osat yhdistetään pisteellä saadaan `mil.fi`, joka on puolustusvoimien vanha verkko-osoite.

Kerätään vielä kaikki data yhdeksi tauluksi tähän loppuun.

~~~ code
Kohde MAC:       52 54 00 12 35 02
Lähde MAC:       08 00 27 4A A3 B1
EtherType:       08 00
IP Versio:       45
QoS:             00
IP koko:         00 34
ID:              DA 63
Liput/Offset     00 00  
TTL:             40
Protokola:       11
Checksum:        8A 37
Lähde IP:        0A 00 02 0F
Kohde IP:        08 08 08 08
Lähde Portti:    DD 7C
Kohde Portti:    00 35
UDP koko:        00 20
Checksum:        1C 50
ID:              51 9F
Vastaus koodi:   01 00
Qdcount:         00 01
Ancount:         00 00
Nscount:         00 00
Arcount:         00 00
Data:            03 6D 69 6C 02 66 69 00 00 01 00 01
~~~

Vastataanpa nyt niihin kysymyksiin.

>Mikä on kehyksen tarkoitus?

Näyttäisi olevan DNS kehys.

>Mitä protokolia käytetään?

IPv4, UDP ja DNS

>Mihin L3 (verkkokerros) ja L4 (kuljetuskerros) osoitteisiin kehys on matkalla?

IP on verkkokerroksen protokola, eli L3 osoite on 8.8.8.8. Aluksi oletin että kysymys oli väärin muotoiltu, sillä MAC osoite on siirtokerroksen (L2) protokola, mutta oletan että kysymys on portista, eli L4 osoite on 53.

>Pääseekö paketti kohteeseen? Jos ei, niin miksi?

Koska kysymys on tässä muodossa voisin helposti olettaa että paketti ei pääse kohteeseensa, mutten löydä siitä mitään vikaa. Ehkä checksummat ovat väärin, mutten jaksa alkaa tarkistamaan niitä, joten vastaan: **kyllä** paketti pääsee kohteeseensa.

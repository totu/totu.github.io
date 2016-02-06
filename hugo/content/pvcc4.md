---
layout: post
title: "PVCC #4: Logiikkaa!"
date: 2015-07-21T17:05:09+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Neljäs kysymys on logiikka puzzle, jossa kaksi toisistaan eristettyä ohjelmaa luovat sattumanvaraisesti bitin. Generoituaan bitin ohjelmat arvaavat mikä toisen ohjelman bitti oli. Ohjelmat voivat olla erilaisia ja voivat käyttää eri strategioita. Jos yhden kierroksen jälkeen edes toinen ohjelma arvaa oikein voittavat ohjelmat palkinnon.

Kysymys kuuluu:

>"Onko mahdollista luoda strategia joka tuottaa aina voiton?"

Kartoitetaan aluksi kaikki mahdolliset outputit näistä ohjelmista, olkoon ohjelmien nimet `A` ja `B`


~~~ bash
 | A | 0 | 1 | 0 | 1 |
 | B | 0 | 0 | 1 | 1 |
~~~

Vaikka yllä oleva totuustaulukko näyttääkin kaikki mahdolliset tulokset, ajetaan vielä varmuudeksi pieni simulaatio.

~~~ python
>>> import random
>>> for i in range(10):
...   rand1 = random.randint(0,2)
...   rand2 = random.randint(0,2)
...   print(rand1, rand2)
...
1 0
0 0
1 1
0 0
0 1
1 1
0 0
0 1
0 1
0 0
~~~

Tehtävänä on siis arvata ohjelmien tulokset yhden loopin jälkeen, mutta vain yhden arvon täytyy olla oikein. Tehtävään on helppo ratkaisu: toinen ohjelmista arvaa tuloksensa vastakohdan ja toinen arvaa saman kuin oma tuloksensa. Varmistetaan tämä vielä tekemällä totuustaulukko, jossa `T` on tulos ja `R` on arvaus.

~~~ bash
    | T | R |           | T | R |           | T | R |           | T | R |
| A | 0 | 0 |       | A | 1 | 1 |       | A | 0 | 0 |       | A | 1 | 1 |
| B | 0 | 1 |       | B | 0 | 1 |       | B | 1 | 0 |       | B | 1 | 0 |
~~~

Kuten taulukosta käyt ilmi aina toinen, joko `A` tai `B`, ohjelma arvaa toisen tuloksen oikein. Näin voimme 100% varmuudella voittaa palkinnon joka kerta.
Jos joku tahtoo itse kokeilla tätä ohjelmallisesti, tässä on lyhyt Python pätkä.

~~~ python
import random
for i in range(10):
    rand1  = random.randint(0, 2)
    rand2  = random.randint(0, 2)
    quess1 = rand1
    guess2 = 1 - rand2

print(rand1, ":", quess1, "|", rand2, ":", guess2)
~~~

Tässä esimerkki tuloste:

~~~ bash
py question3.py
1 : 1 | 1 : 0
0 : 0 | 0 : 1
1 : 1 | 0 : 1
1 : 1 | 0 : 1
1 : 1 | 0 : 1
1 : 1 | 1 : 0
1 : 1 | 0 : 1
1 : 1 | 0 : 1
0 : 0 | 0 : 1
0 : 0 | 0 : 1
~~~

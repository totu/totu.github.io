---
layout: post
title: "PVCC #10: Regex"
date: 2015-07-25T14:02:58+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

10\. kysymys käsittelee yleisön suosikkia: Regular Expressioneja!

Meidän tulee tehdä Regex, joka sopii sanoihin jotka alkaa ja loppuu samalla konsonantilla ja joiden pituus on jaollinen kolmella. Regex ei saa olla yli 40 merkkiä pitkä ja jokaisesta merkistä 30 jälkeen sakotetaan.

Ensimmäinen yritys oli aika karkea, kuten yleensä.

~~~ python
^([cdhjklmnnprstvbfgz])+.+([cdhjklmnnprstvbfgz])$
~~~

Mikä ei ihan tehnyt mikä piti.

~~~ python
>>> import regex
>>> strings = ['test', 'teeest', 'asd', 'lol', 'dead', 'cat']
>>> for s in strings:
...   if regex.match(r'^([cdhjklmnnprstvbfgz])+.+([cdhjklmnnprstvbfgz])$', s):
...     print(s)
...
test
teeest
lol
dead
cat
~~~

Lisäksi `len('^([cdhjklmnnprstvbfgz])+.+([cdhjklmnnprstvbfgz])$')` on 49, eli regex on aivan liian pitkä. Sitten aloin lukemaan POSIX regular expressionin dokumentaatiota ja löysin regexp ryhmät. Ryhmä on regex jok on sulkujen välissä ja niihin voi viitata ryhmän järjestysluvulla esim. `\1`. Pistetään käytäntöön.

~~~ python
^([cdhjklmnnprstvbfgz]).*\1$
~~~

Mikä on jo parempi, kuten seuraavasta voidaan huomata sana `cat` on kadonnut, eikä pituus ole enään kuin 27 merkkiä.

~~~ python
>>> import regex
>>> strings = ['test', 'teeest', 'asd', 'lol', 'dead', 'cat']
>>> for s in strings:
...   if regex.match(r'^([cdhjklmnnprstvbfgz]).*\1$', s):
...     print(s)
...
test
teeest
lol
dead
~~~

Tässä kohtaa jäin vähän jumiin. Koetin erilaisia juttuja `(){3}` tyylisellä syntaksilla, muttei mikään ottanut tuulta alleen. Onneksi olin heittänyt tämän pallon jo alkuvaiheella myös kaverilleni joka keksi seuraavan parannuksen.

~~~ python
^([dhjklmnnprstvbfgz]).(...)*\1$
~~~

Ja se toimii täydellisesti.

~~~ python
>>> import regex
>>> strings = ['test', 'teeest', 'asd', 'lol', 'dead', 'cat']
>>> for s in strings:
...   if regex.match(r'^([dhjklmnnprstvbfgz]).(...)*\1$', s):
...     print(s)
...
teeest
lol
~~~

Mutta meillä on nyt pienehkö pulma. Pituus regexillä on 31 merkkiä, mikä on toki alta 40 merkkiä, mutta juuri yli 30 merkin. Sitten saimme sellaisen "Ahaa!" ajatuksen, koska regexiä ajetaan kasaa suomenkielisiä sanoa vastaan meidän ei kannata etsiä konsonantteja vaan sulkea pois vokaaleja ja saamme seuraavan.

~~~ python
^([^aeiouy]).(...)*\1$
~~~

Tämä regex toimii aivan kuten edellinen, mutta on vain 21 merkkiä pitkä, mikä on reippaasti tehtävän 30 merkki rajan alapuolella.

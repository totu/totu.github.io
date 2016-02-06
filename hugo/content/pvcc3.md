---
layout: post
title: "PVCC #3: Base64"
date: 2015-07-21T10:04:09+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Kolmannessa kysymyksessä meille annettiin ainoastaan merkkijono `TG9yZW1+SXBzdW0=` mikä vaikuttaa joltain hashilta? Oikeastaan ei, kyseinen jono näyttää base64 pätkältä.

Miten base64 tarkistetaan? No sen voisi vaan rykästä jollekkin Googlesta löytyvälle decodaus sivustolle, mutta tarkistetaan itse, niin opitaan jotain. Tässä on yksinkertainen tarkistuslista base64 merkkijonolle:

- Jono alkaa millä tahansa määrällä neljän (4) merkin ryhmiä jotka voivat olla väliltä `[A-Za-z0-9+]`
- Jota seuraa yksi seuraavista tai ei mitään:
  - Neljä merkkiä joista
    - Ensimmäinen ja toinen sopivat `[A-Za-z0-9+]`
    - Kolmas merkki sopii `[AEIMQUYcgkosw048]`
    - Viimeinen merkki on `=`
  - Neljä merkkiä joista
    - Ensimmäinen sopii `[A-Za-z0-9+]`
    - Toinen sopii `[AQgw]`
    - Kolmas ja neljäs ovat molemmat `=`

# Regular Expressions

Kuten heti edellä mainitusta listasta voidaan huomata base64 jonot voidaan jakaa neljän merkin jonoihin, joten ensimmäinen tarkistus tulee olla tarkistaa jakautuuko meidän jono neljällä.

~~~ python
>>> len('TG9yZW1+SXBzdW0=') % 4 == 0
True
~~~

Hyvältä näyttää. Seuraavaksi tarkistetaan löytyvätkö ensimmäiset neljä merkkiä `TG9y` seuraavasta regular expressionista `[A-Za-z0-9+]`, mikä sopii isoihin ja pieniin kirjaimiin väliltä A - Z, numeroihin 0 - 9 sekä + -merkkiin. Jono näyttää sopivan, mutta tarkistetaan vielä.

~~~ python
>>> import re
>>> re.match('^[A-Za-z0-9+]{4}$', 'TG9y')
<_sre.SRE_Match object; span=(0, 4), match='TG9y'>
~~~


Seuraavat neljä merkkiä `ZW1+` pitäisi löytyä samalla regexillä

~~~ python
>>> import re
>>> re.match('^[A-Za-z0-9+]{4}$', 'ZW1+')
<_sre.SRE_Match object; span=(0, 4), match='ZW1+'>
~~~


Ja löytyyhän ne! Seuraavat neljä `SXBz` pitäisi löytyä myös.

~~~ python
>>> import re
>>> re.match('^[A-Za-z0-9+]{4}$', 'SXBz')
<_sre.SRE_Match object; span=(0, 4), match='SXBz'>
~~~


Kas kummaa ne löytyvät. Nyt ollaan neljässä viimeisessä merkissä `dW0=` joista ensimmäisen tulisi sopia vanhaan tuttuun `[A-Za-z0-9+]`, toisen merkin tulisi sopia joko `[A-Za-z0-9+]` tai `[AQgw]`, kolmas merkki tulisi sopia `[AEIMQUYcgkosw048]` tai `=` ja viimeinen merkki tulisi olla `=`.

~~~ python
>>> import re
>>> re.match('^[A-Za-z0-9+]([A-Za-z0-9+]|[AQgw])([AEIMQUYcgkosw048]|=)=$', 'dW0=')
<_sre.SRE_Match object; span=(0, 4), match='dW0='>
~~~


Jopa viimeinen osa sopii. Nyt yhdistetään kaikki yllä olevat regular expressionit yhteen.

~~~ python
>>> import re
>>> re.match('^([A-Za-z0-9+])*([A-Za-z0-9+]([A-Za-z0-9+]|[AQgw])([AEIMQUYcgkosw048]|=)=)$', 'TG9yZW1+SXBzdW0=')
<_sre.SRE_Match object; span=(0, 16), match='TG9yZW1+SXBzdW0='>
~~~


Ja siinä meillä on yksinkertainen tarkistus skripti base64 jonoille, jonka mukaan kyseessä on base64 jono.

# Dekoodaus

Nyt kun tiedetään että meillä on base64 jono, voidaan se dekoodata. Tämäkin voitaisiin tehdä manuaalisesti, [Base64 Wikipedia artikkelista](https://en.wikipedia.org/wiki/Base64) löytyy jopa koodi esimerkki, mutta se olisi tylsää copy-pastea ja tämä postaus alkaa jo olemaan vähän liiankin pitkä. Joten on aika ripotella vähän Pythonia päälle ja pyyhkiä kyseinen ongelma pois päiväjärjestyksestä.

~~~ python
>>> import base64
>>> base64.b64decode(bytes('TG9yZW1+SXBzdW0=', 'utf-8'))
b'Lorem~Ipsum'
~~~


Siinä meillä on vastaus `Lorem~Ipsum`.

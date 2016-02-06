---
layout: post
title: "PVCC #21: Assemblya"
date: 2015-08-01T10:40:40+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

21\. tehtävässä meille annetaan lyhyt Assembly pätkä, jonka kerrotaan saapuneen kollegalta jonka palvelinta haittaohjelma pitää vankina. Ja kysymys kuuluu:

>Kykenetkö auttamaan kollegaa löytämään oikean salasanan?

~~~ bash
xor    ebx, ebx
push    ebx
pop     eax
inc     eax
mov     edx, [esi]
xor     edx, 0x31415926
cmp     edx, 0x452f2c4e
cmovnz  eax, ebx
mov     edx, [esi + 4]
not     edx
cmp     edx, 0xcdcb8d9a
cmovne    eax, ebx
ret
~~~

# Purkaminen
Tehtävän kannalta tärkeimmät osat on `edx` käsittely, sillä `edx` saa arvonsa `esi` osoittamasta muistista. Lisäksi se on ainoa osa koodista, minkä arvo tiedetään ajoittain. Otetaan aluksi käsittelyyn.

~~~ bash
mov     edx, [esi]
xor     edx, 0x31415926
cmp     edx, 0x452f2c4e
~~~

`mov` komento hakee datan `esi` osoittamasta muistista ja siirtää sen `edx` arvoksi. Seuraavaksi `edx` arvo vedetään loogisesta XOR funktiosta läpi `0x31415926` kanssa. Lopuksi `edx` arvoa verrataan `cmp` komennolla arvoon `0x452f2c4e` jonka tulisi olla tosi.

Nyt voidaan kulkea logiikkaa läpi takaperin. Jos `edx` on `0x452f2c4e` XOR funktion jälkeen, jos XOR tehdään toisinpäin, saadaan `edx` alkuperäinen arvo. `0x452f2c4e` \\(\oplus\\) `0x31415926` \\(=\\) `0x746e7568`. Ennen dekoodausta otetaan selvää seuraavasta kohdasta.

~~~ bash
mov     edx, [esi + 4]
not     edx
cmp     edx, 0xcdcb8d9a
~~~

`edx` saa uuden arvon mikä on `esi` osoittama muisti plus neljä tavua, `esi` arvoa siirretään neljällä koska `mov` palauttaa neljä tavua dataa. Seuraavaksi `edx` menee lävitse loogisesta NOT funktiosta joka kääntää jokaisen bitin, eli `1` tulee `0` ja `0` tulee `1`. Ja lopputuloksena `edx` on sama kuin `0xcdcb8d9a`. Taas logiikkaa kulkea toiseen suuntaan. Jos `[esi + 4]` arvo on `0xcdcb8d9a` loogisen NOT jälkeen, on `0xcdcb8d9a` arvo loogisen NOT jälkeen sama kuin `[esi + 4]`.  `~0xcdcb8d9a` \\(=\\) `0x32347265`.

# Dekoodaus
Käännetään hexat ascii arvoiksi.

~~~ python
>>> from binascii import *
>>> unhexlify(bytes('746e7568', 'utf-8')).decode('utf-8')
'tnuh'
>>> unhexlify(bytes('32347265', 'utf-8')).decode('utf-8')
'24re'
~~~

Koska Assemblyssä muistia luetaan vähiten merkitsevästä tavusta alkaen, eli takaperin. Joten salasana on `hunter42`.

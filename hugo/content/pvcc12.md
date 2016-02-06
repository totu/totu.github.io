---
layout: post
title: "PVCC #12: 128 sattumanvaraista bittiä"
date: 2015-07-27T14:39:22+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

12\. tehtävässä meille annetaan 128 merkkinen täysin sattumanvarainen bittijono, josta saamme flipata yhden bitin ympäri. Kysymys kuuluu:

>Kuinka monta bittiä informaatiota voidaan siirtää tällä bitti jonolla?

Tämä alkaa jo olemaan suhteellisen haastava matemaattinen kysymys, mutta samalla viimeinen "teoria" kysymys.

Aloitetaan helposta. Tehtävässä tulee käyttää pariteettia. Jos meillä on sattumanvarainen neljän bitin jono, kuten `0110` voidaan sillä koodata kaksi bittiä informaatiota. Pariteetti bitit lasketaan kahden potenssien väliltä, eli \\(2^0\\) askelväli on 1, \\(2^1\\) askelväli on 2, mikä on suurin askelväli, mitä neljän bitin jonossa voidaan suorittaa.

\\(2^0\\) vastaa loogista AND funktiota 01 kanssa.
\\(2^1\\) vastaa loogista AND funktiota 10 kanssa.
Ja niin edelleen.

Pariteetti saadaan laskemalla kaikki alueen `1`, jos niitä on parilline määrä aroksi tulee `0` jos pariton `1`.

Esimerkiksi jonossa `0110` \\(2^0\\) pariteetti on `1` koska se saa arvon `01`. Jonon \\(2^1\\) pariteetti on myös `1` koska se saa myös arvon `01`. Näin ollen loogisten AND funktioiden jälkeen pariteetti jonolle on `11`. Jos nyt halutaan osoittaa jotain arvoa mikä voidaan jonolla koodata (koska jono on sattumanvarainen voidaan sillä koodata vain kahden bitin arvo, eli 0-3), esim. numero 2, käytetään vedetään arvo `10` loogisella XOR functiolla lävitse jonon pariteetista: \\(10 \oplus 11 = 01\\). Näin ollen bitti kohdassa `01` tulee kääntää, eli saamme arvon `0100` (koska ensimmäinen bitti on arvo `00`). Nyt kun bittijonoa dekoodataan, eli yritetään saada se arvo ulos jonka lähetimme (numero 2), lasketaan uudesta jonosta pariteetti ja se vedetään lävitse itse jonosta. Jonon `0100` \\(2^0\\) pariteetti on `0` koska se saa arvon `00`. Jonon \\(2^1\\) pariteetti on `1` koska se saa arvoksi `10`. Loogisten AND funktioiden jälkeen saamme arvon `10`. Kun käännetään bitti kohdasta `01` saadaan uudeksi jonoksi `0110`, kun nyt tämä uusi arvo ja pöydän arvo vedetään lävitse loogisesta XOR funktiosta saadaan selville lähetetty arvo. \\(0100 \oplus 0110 = 0010\\), eli 2.

Tällä logiikalla aina kun satunnaisen bittijonon, josta saadaan kääntää yksi bitti mielivaltaisesti, pituus tuplaantuu voidaan sillä siirtää yksi bitti lisää informaatiota, eli kahdeksalla satunnaisella bitillä voidaan siirtää kolme bittiä informaatiota. Näin ollen 128 merkkiä pitkällä sattumanvaraisella bitti jonolla voidaan siirtää seitsemän bittiä informaatiota.

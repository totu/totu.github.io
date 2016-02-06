---
layout: post
title: "PVCC2 #2: 700 miljardia salasanaa sekunnissa"
date: 2015-07-20T20:33:43+03:00
---

_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Tokassa kysymyksessä cräkätään salasanoja. Tarkoitus on laskea teoreettinen maksimi aika kahdella eri tavalla luodulle salasanalle. Ensimmäinen salasana luodaan liittämällä yhteen sattumanvaraisesti neljä sanaa 31337 sanan tiedetystä listasta. Toinen salasana luodaan yhdeksästä sattumanvaraisesta printattavasta ASCII merkistä. Molemmat salasanat puretaan koneella joka pystyy tekemään 700 miljardia hash operaatiota sekunnissa. Nyt matikkamyssyt päähän ja cräkkäämään.

Neljä sanaa 31337 sanan listasta täysin sattuman varaisesti tuottaa \\(3133^4\\) mahdollista yhdistelmää, kun se jaetaan 700 miljardilla saadaan tulokseksi \\(31337^4 / 700 \times 10^9\\) mikä on sama kuin \\(1.38 \times 10^6\\) sekuntia. Vastaus pitää kuitenkin antaa päivän tarkkuudella joten lopullinen yhtälö näyttää tältä:

$$ \dfrac{3133^4}{700 \times 10^9 \times 3600 \times 24} \approx 16 $$

Toka salasana on perinteisempi ongelma. [Wikipedian](https://fi.wikipedia.org/wiki/ASCII) mukaan ASCII sisältää 95 näkyvää merkkiä. Mikä tarkoittaa meillä voi olla \\(95^9\\) mahdollista salasanaa ja koska meillä on käytössä sama kone kuin edellisen salasanan kanssa lopullinen yhtälö on:

$$ \dfrac{95^9}{700 \times 10^9 \times 3600 \times 24} \approx 10 $$

Tehtävän vastaukset ovat siis **a)** 16 päivää ja **b)** 10 päivää.

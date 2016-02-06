---
layout: post
title: "PVCC #7: Ämpärillä päähän"
date: 2015-07-22T22:39:42+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Seitsemännessä kysymyksessä meille annetaan vesihana ja kaksi ämpäriä (4.3l ja 4.7l). Meidän tehtävänä on mitata tarkkaan 4.6l vettä. Ja ämpäreissä ei ole mitään merkintöjä.

Kyseessä on logiikka ongelma, mutta itselle tuttu. Kun tämän pulman tuntee, on se suhteellisen helppo suorittaa.

Ideana on kaataa pienemmästä ämpäristä vettä suurempaan ja tyhjätä suurempi aina kun se täyttyy. Näin pienempään asiaan jää joka toisella kaato kerralla vähemmän ja vähemmän vettä kunnes pohjalle jää 0.3l ja koska \\(0.3 + 4.3 = 4.6\\) saamme oikean määrän vettä isompaan ämpäriin.

Alla on lista tarvittavaista askeleista toteuttaa mittaus.

~~~ python
A: 4.3 B: 0.0
A: 0.0 B: 4.3
A: 4.3 B: 4.3
A: 3.9 B: 4.7
A: 3.9 B: 0.0
A: 0.0 B: 3.9
A: 4.3 B: 3.9
A: 3.5 B: 4.7
A: 3.5 B: 0.0
A: 0.0 B: 3.5
A: 4.3 B: 3.5
A: 3.1 B: 4.7
A: 3.1 B: 0.0
A: 0.0 B: 3.1
A: 4.3 B: 3.1
A: 2.7 B: 4.7
A: 2.7 B: 0.0
A: 0.0 B: 2.7
A: 4.3 B: 2.7
A: 2.3 B: 4.7
A: 2.3 B: 0.0
A: 0.0 B: 2.3
A: 4.3 B: 2.3
A: 1.9 B: 4.7
A: 1.9 B: 0.0
A: 0.0 B: 1.9
A: 4.3 B: 1.9
A: 1.5 B: 4.7
A: 1.5 B: 0.0
A: 0.0 B: 1.5
A: 4.3 B: 1.5
A: 1.1 B: 4.7
A: 1.1 B: 0.0
A: 0.0 B: 1.1
A: 4.3 B: 1.1
A: 0.7 B: 4.7
A: 0.7 B: 0.0
A: 0.0 B: 0.7
A: 4.3 B: 0.7
A: 0.3 B: 4.7
A: 0.3 B: 0.0
A: 0.0 B: 0.3
A: 4.3 B: 0.3
A: 0.0 B: 4.6
~~~

Tämä oli vähän tylsä tehtävä, koska suurin osa on tekemistä. Tietenkin tehtävän ratkaisuun voisi kehittää skriptin joka brute frocaisin vastauksen, mutta näin pienissä luvuissa tämä on nopeampaa tehdä käsin.

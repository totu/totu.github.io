---
layout: post
title: "PVCC #11: Todennäköisyys"
date: 2015-07-25T20:17:46+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

11\. kysymyksessä on pitkä tekstinpätkä josta puolet voi heti heittää menemään. Oikea kysymys kuuluu:

>"Jos huoneessa on kolme tietokonetta, joilla kaikilla on yhtäläinen mahdollisuus pyörittää Windows, Linux tai OS X käyttöjärjestelmää, mikä on todennäköisyys että huoneessa on vähintään kaksi Linux konetta?"

Koska vaihtoehtoja on vähän, aloitetaan totuustaulukolla selventämään tilannetta, tässä taulukossa on kaikki tilat jotka täyttävät kysymyksen kriteerit.

~~~ None
L, L, L       L = Linux
L, L, W       W = Windows
W, L, L       X = OSX
L, W, L
L, L, X
X, L, L
L, X, L
~~~

Kuten huomataan kokoonpanoja, joissa on vähintään kaksi Linux konetta, on \\(7\\). Kaiken kaikkiaan mahdollisia kokoonpanoja on \\(3^3\\), eli \\(27\\), joten todennäköisyys \\(P\\) on.

$$P = 7/27 \approx 0.2593$$

Mikä tarkoittaa että todennäköisyys sille, että huoneessa on vähintään kaksi Linux konetta, on \\( \approx 26 \%\\).

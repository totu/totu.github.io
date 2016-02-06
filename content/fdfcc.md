---
layout: post
title: "Puollustusvoimien Cyberchallenge"
date: 2015-07-20T16:18:26+03:00
---
Viime viikonloppuna bongasin HackerNewsitä [tämän linkin](http://erityistehtavat.puolustusvoimat.fi/cyberchallenge.html).

Näköjään PV etsii porukkaa uuteen kyber yksikköön. En ole oikein varma onko tämä oikein tarkoitettu siviileille vai vain sisäiseen hakuun, mutta aion käydä haasteen lävitse kysymys kysymykseltä ja avata niitä niin paljon kun näen tarpeelliseksi. Osa kysymyksistä vaikuttaa haastavilta, osa taas lähes triviaaleja. Katsotaan kuinka pitkälle päästään.

# PVCC #1: Mikä epäilyttää?

Ekassa tehtävässä annetaan kuva prosessipuusta ja kysymys kuuluu kaikessa yksinkertaisuudessaan:

>"Onko listalla mitään epäilyttävää?"

Aluksi Googletin kaikki \*.exet jotka eivät näyttäneet tutuilta ja löysin pari epäilyttävää prosessia.

![prosessit](process.jpg "Epäilyttävät prosessit")

En väitä tietäväni ihan tarkkaan miten Internet Explorer toimii, mutta tuo `cmd.exe` vaikuttaa jokseenkin epäilyttävältä tuolla `iexeplre.exe` alla. Toinen outous on tuo `rundll322.exe` jossa näyttää olevan extra `2` ja se ei ole ryhmitelty tuonne alemmas muiden `rundll32.exe` kanssa.

# Eikä tässä vielä kaikki!

Tutkiessa noita eri \*.exejä huomasin että ne saattaa kertoa vähän enemmän tästä kohde koneesta. Nuo `igfcEM.exe` ja `igfxHK.exe` on osa Intelin Graphics ajureita. `iusb3mon.exe` on osa Intelin USB3 ajureita. `RCIMGDIR.exe` on osana jotain webcamera ajureita. Lopuksi `SynTPHelper.exe` on Synapticsin trackpad ajuri. Näitä voidaan päätellä että kyseessä on kannettava tietokone ja koska kaikki maininnat tuosta `RCIMGDIR.exe` löytyi ThinkPad foorumeilta uskallan väittää että kyseessä on Lenovon ThinkPadi. ThinkPadit on myös aika yleisiä "business" läppäreitä, joten en yllättyisi ollenkaan vaikka olisin oikeassa.

*P.S. Tuolla saataa olla vielä jotain outoa koska `Monitor.exe` ja `RCIMGDIR.exe` on molemmat webcam ajureita, mutten voi sanoa varman päälle*

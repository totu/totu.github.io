+++
date = "2016-02-06T13:39:37+02:00"
title = "Aika vierii ja alustat kulahtaa"

+++

Niin siinä sitten kävi että työllistyttyäni jäi blogin päivittely hieman sikseen, mutta nyt alaa elämä pikkuhiljaa laantua ja arjen keskeltä löytyy taas tarpeeksi luppoaikaa tylsyydelle joten: here we are again!

Alusta ei ole vaihtunut, blogi pyörii edelleen näppärästi [Gihubin](https://github.com/) tarjoaman ilmaisen [Pages](https://pages.github.com/) palvelun päällä, mutta softa taustalla on hieman kokemus parannuksia. Edellinen versio pyöri [Ocotopress](http://octopress.org/) alustalla joka taas oli eräänlainen wrapperi [Jekyll](https://jekyllrb.com/) blogi alustan päälle. Homma toimi ihan kivasti, mutta tässä välissä on kone vaihtunut ja vaikka [Rubystä](https://www.ruby-lang.org/en/) kielenä pidänkin, on sen asentaminen ja dependencyjen hanskaus verrattuna tukalaa joten heitin Octopressin kannalta lusikat nurkkaan ja lähdin etsimään uutta staattista generaattoria.

Lyhyen etsinnän jälkeen huomasin että nykyään staattisia generaattoreita löytyy monia ja kaikille mahdollisille kielille joten suht summamutikassa valitsin [Hugon](http://gohugo.io/). Hugo on [Googlen Go -kielen](https://golang.org/) päälle rakennettu simppeli blogi alusta ja se on todella simppeli. Asennukseen meni noin 5 minuuttia. Hugo syö samaa markdown formaattia kuten Ocotpress joten vanhojen postauksien siirto oli yksinkertaista eikä mitään erikoista reititystä tarvinnut kyhäillä Hugo päätteli ihan itse että `content` nimisen kansion alta löytyy postaukset ja teema osasi ne pistää listaksi tuohon etusivulle.

Näin lyhyen pilotin jälkeen olen kyllä valmis suosittelemaan Hugoa kaikille ketkä tahtovat staattisen sivuston, taikka eivät halua hämmästellä tietokantoja ja muita turhuuksia sivuillaan. Vielä on kyllä pieniä aukkoja kaiken pienen näpräyksessä, mutta syy on enemmänkin oma tuntemattomuus Go -kielen kanssa kuin alustan kyvyttömyys.

Ehkä tästä samalla irtoaa enemmän intoa kirjoitella taas päättömiä.

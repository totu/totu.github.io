---
layout: post
title: "Lukko"
date: 2015-08-03T09:49:00+03:00
---
Viime viikolla tuli eteen fyysisen turvallisuuden puolelta projekti. Matkalaukun lukon yhdistelmä oli unohtunut. Lukko oli yleinen kolmen numeron yhdistelmälukko. Aluksi harkitsin brute forcausta, mutta en tahtonut viettää loppu iltaa lukon kanssa, joten irroitin lukon ja avasin sen.

![Kuva lukon sisälmyksistä](/lukko.jpg "Lukon sisälmykset")

Kuvassa alhaalla on lukon numeroyhdistelmän kiekot, jotka oikeassa asennossa antavat salvan liikkua vasemmalle, salpa jousen ansiosta, ja näin antavat kuvan keskiosassa olevan keltaisen lukon painautua alaspäin.

Lukko on suunniteltu turvallisuuden kannalta suhteellisen hyvin, mutta siinä on yksi suunnitteluvirhe minkä takia lukon yhdistelmä on alunperinkin päässyt unohtumaan/hukkumaan.

# Hyvät

Koska salpa on yhtenäinen kaikille kiekoille, eli yhtä kiekkoa pyörittämällä tunne hampaiden paikkaa. Lisäksi kun lukon painaa alas salvan ollessa lukittuna estää se salvan liikkumisen, eli brute forcattaessa lukon avaus pitää suorittaa joka yhdistelmän kanssa erikseen, lukkoa ei voi vain pitää pohjassa ja pyöritellä kiekkoja.

# Huonot

Koska lukon yhdistelmä on tehty vaihdettavaksi koostuvat lukon numero kiekot kahdesta osasta. Itse kiekosta jota pyöritetään, sekä hammas kiekosta jota numero kiekko pyörittää. Hammas kiekon päällä olevien jousien on tarkoitus pitää kiekot yhdessä, mutta kiekon numero 1. jousi ei ole tarpeeksi vahva pitämään kiekkoa paikallaan jos kiekkoa käännetään numerojärjestyksessä (kuvassa alaspäin). Kun 1. kiekkoa käännetään alaspäin, salvan ollessa auki, aiheutuu salpa jousesta, sekä salvan hampaasta enemmän kitkaa kuin hammas kiekon jousesta jolloin hammas kiekko hyppää numeron ylitse, joka vaihtaa yhdistelmää. Oletettavasti tämä on se syy miksi yhdistelmä on alunperinkin unohtunut.

# Korjaus

Ensimmäinen kiekon hyppäys on suunnitteluvirhe, muut kiekot toimivat normaalisti ja 1. kiekko toimii normaalisti käännettäessä ylöspäin, eikä alaspäin käännettäessä ole ongelmia kunhan salpa ei ole auki, eli jos salpa numero 2. tai 3. käännetään ensiksi. Ongelman "korjaus" on käytön muuttaminen, nopea nyrkkisääntö on: "lukitse lukko aina ensiksi keskimmäisellä numerolla", mikä on aika huono korjaus, muttei lukolle oikein voi muuta tehdä.

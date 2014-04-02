title: Stegosauruksen salaisuus
date: 2016-03-01
# Stegosauruksen salaisuus
[Pottuplaneetan crypto puzzlet][1] saavat jatkoa ([edellinen postaus aiheesta][2]). Tänään käsittelyssä on sivuston kakkos challenge. Edellinen haaste ja ratkaisu löytyy vanhemmasta postauksesta.

Toka haaste tarjoaa hieman levottoman sivun jossa seuraava kuva nykii edestakaisin.

![stegosaurus](/img/stego.saurus.jpg)

Kuvassa itsessään on useampi vihje. Ne meistä ketkä tykkäsi dinosauruksista lapsina tunnistavat kuvan dinon stegosaurukseksi, lisäksi kuvan alaoikealla esiintyvä “Stego saurus” antaa tästä vinkkiä. Stego on kuitenkin jostain syystä selkeästi erotettu saurus sanasta, mutta ennen kuin paneudutaan kuvaan sen syvemmin tutkitaan vähän loppua sivusta.

Sivun lähdekoodista löytyy seuraava, hieman erikoinen pätkä:

```html
<a href="md5.exe" title="09befc1adae47967363beb8603b3bc72">
Are you lost?
</a>
```

Itse linkki ei toimi, muttamd5.exe ja hashi on aika hyviä vinkkejä. Kun edellämainitun hashin iskee Googleen saa vastaukseksi: “outguess”. Outguessia hakemalla löytyy nopeasti viittauksia “stegonographyyn”. Nyt kuvan “stego `<väli>` saurus” on selkeämpi, tai olisi jos tiedettäisiin mitä stegonografia on. [Wikipedia Stegonografia][3], hyvä nyt voidaan edetä. Ensiksi pitää hankkia outguess. Linuxilla apt-get hoiti homman mallikkaasti ja OS X:llä homebrew selvisi myyös moitteetta.

Joten eiköhän decryptata kuva!

```sh
$ outguess -r stego.saurus.jpg out.txt
Reading stego.saurus.jpg....
Extracting usable bits:   102736 bits
Steg retrieve: seed: 43428, len: 32592
Extracted datalen is too long: 32592 > 12842
```

…ei kai sitten. Outguessin manuaalia sivua lukiessa kävi ilmi että se myös syö “kryptausavaimen”. Mitähän toi teksti tuossa kuvassa oikeen tarkoittaa?

Kun kyseisen pätkän: “Salvation? Do not look for happiness outside yourself. The awakened seek happiness inside.” pistää Googleen niin se näyttää olevan Peter Deunovilta lainattu. Joten koitetaan Peterin nimeä avaimena.

```sh
$ outguess -r -k "Peter Deunov" stego.saurus.jpg out.txt
Reading stego.saurus.jpg....
Extracting usable bits:   102736 bits
Steg retrieve: seed: 17, len: 101
```

No sehän onnistui

```sh
$ cat out.txt
we have lost the key to salvation. to win this challenge,
find the key that prevents the end of time.
```

Olishan se ollut liian helppoa. Tätä pätkää googlailin pitkään, mutta en löytänyt pitää fiksua tähän liittyvää. Koska kuva antoi jo toisen (tai kolmannen) vihjeen, ehkä se antaa vielä lisää? Mitähän sen metadata sanoo?

```sh
$ exiftool stego.saurus.jpg
ExifTool Version Number         : 10.20
File Name                       : stego.saurus.jpg
Directory                       : .
File Size                       : 103 kB
File Modification Date/Time     : 2016:09:29 15:39:57+03:00
File Access Date/Time           : 2016:09:29 15:45:40+03:00
File Inode Change Date/Time     : 2016:09:29 15:39:57+03:00
File Permissions                : rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 96
Y Resolution                    : 96
Exif Byte Order                 : Big-endian (Motorola, MM)
XP Comment                      : the+enlightened+must+dig+deeper.txt
Image Width                     : 867
Image Height                    : 425
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 867x425
Megapixels                      : 0.368
```

Muusta en tiedä, mutta toi kommentti näyttää vähän oudolta. Kun haasteen URL:iin lisää `/the+enlightened+must+dig+deeper.txt` löytyy polusta teksti tiedosto jossa lukee:

```sh
64 times 2 is
aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVBvQUFBQ0ZDQUlBQUFEOStuSitBQUFBQm1
KTFIwUUEvd0UFiMDBsRVFWUjRuTzFkYTNQaVJ0Y2NDUkNTUU54c3MvWm1ONXV0eWxaK
...
Y1UG43ZVo0TEkyWU1uZ2FGdTl3TkR2OUxhd2Q2emFGZEdib2JIQTY1SG5KbjE0TjYvU
Bd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd0
TURBd01EQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNREo3Ry93RTlQWG5yWHF4ZHZ
```

_HUOM! Tuosta välistä on poistettu rivitolkulla tuota tuubaa koska muuten tätä ei editoi millään_

Vihjehän edellisessä on tuo: _“64 times 2 is”_. Varmaan on joku hyvä tapa todeta koodauksen olevan Base64 enkoodattua kamaa, mutta vihjeen 64 plus tekstin struktuuri toi tämän itselle heti mieleen. Jos tekstin decryptaa kuitenkin vain kerran ei asiat paljon parane. Onneksi uusikin teksti on aivan selkeästi Base64, koska sen lopussa ton tuttu padding käyttäen yhtäsuuruusmerkkejä (lisäksi vihje saoi “times 2”). Kun uudenkin pätkän dekryptaa jää jäljelle kasa binäärimössöä, mutta headerin “PNG” stringi paljastaa kyseessä olevan Base64 enkoodattu PNG kuva, joka näyttää tältä:

<img style="width:90%;margin-left:5%;" src="/img/lost.png">

Tässä kohtaa ei vielä itsellä sytyttänyt joten lähdin etsimään lisää vihjeitä. Haastesivun otsikosta löytyy seuraava (ainakin minulle) kryptinen pätkä:

```
96 485.3365 c mol-1
```

No, okei, “mol” sanasta päättelin, että ehkä kyseessä on jotenkin kemiasta. Eikä veikkaus nyt loputtoman kauas osunut, Google nimittän osasi kertoa, että kysessä on Faradayn vakio.

Nyt on aika yhdistää vihjeet ja googlata “lost faraday” ja mitäs sieltä löytyykään? [Wikipedia: Daniel Faraday][4] Lost TV sarjassa oli hahmo nimeltä Daniel Faraday ja nyt jos mietitään sitä alkuperäistä salattua viestiä Stegosaurus kuvassa: “we have lost the key to salvation. to win this challenge,find the key that prevents the end of time.” Varmasti kaikki Lost sarjaa katsoneet muistavat, että sarjan yksi suurimmista selittämättömistä mysteereistä oli merkillinen numerosarja: 4, 8, 15, 16, 23, ja 42. Kun näiden yhdistelmän lisää haasteen URL:in jatkoksi saa seuraavan viestin:

```sh
Congrats, you beat the challenge.

Submit the following flag.
{POISTETTU}
```

Ja näin ollaan taas yksi haaste ratkaistu

[1]: http://potatopla.net/crypto/ "Potatoplanet Crypto"
[2]: ../archive/royal-messages
[3]: https://fi.wikipedia.org/wiki/Steganografia "Wikipedia - Stenanografia"
[4]: https://en.wikipedia.org/wiki/Daniel_Faraday "Wikipedia - Daniel Faraday"

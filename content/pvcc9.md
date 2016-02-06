---
layout: post
title: "PVCC #9: Leo, Adi ja Ron"
date: 2015-07-24T09:18:46+03:00
---
_Etkö tiedä mikä on PVCC? [Klikkaa tästä](/fdfcc)._

Yhdeksäs kysymys oli hieman erikoinen.


>Leonard: N = 779191667  
Adi: e = 65537  
Ron: 706790887 ?


Aluksi ei ollut mitään hajua mitä tässä oikein kysyttiin. Aluksi luulin että \\(n\\) ja \\(e\\) voisi olla koordinaatteja, mutta [sitten päätin tätä vastaan](https://www.google.com/maps/place/77%C2%B055'09.0%22N+6%C2%B033'13.3%22E/@77.9192819,6.5534358,4.42z/data=!4m2!3m1!1s0x0:0x0?hl=fi). Joten seuraava looginen askel oli Googlettaa nimet. Ensimmäiset tulokset käsitteli RSAta kuten [tämä Wikipedia artikkeli](https://en.wikipedia.org/wiki/RSA_%28cryptosystem%29). Julkisella avaimella salaus kuulostaa ihan järkevältä aiheelta kysymykselle. Kun äkkiä silmäilin tekstin lävitse, osui silmään *Encryption* kohdan alta. "Alice transmits her public key \\((n, e)\\) to Bob and keeps the private key \\(d\\) secret". Ehkä tuo viimeinen arvo on \\(d\\)?

# RSA

Käydään lävitse hieman, miten RSA toimii. Perus idea julkisen avaimen suojauksen takana on kahden avaimen pari, julkinen ja yksityinen. Kun viesti salataan käyttämällä julkista avainta sen voi avata ainoastaan julkisen avaimen yksityisellä parilla ja päin vastoin. Julkisella avaimella salatessa vain yksityinen avain tulee pitää salassa, viestit salataan aina toisen henkilön julkisella avaimella. Omalla yksityisavaimella voi kuitenkin allekirjoittaa viestin, ja näin todentaa viestin lähettäjän.

# Avainten luonti

Ensiksi tarvitaan kaksi jaotonta, eli prime, lukua (\\(p\\) ja \\(q\\)) joilla on samanlainen bittipituus.

Seuraavaksi lasketaan \\(n\\) kertomalla \\(p\\) ja \\(q\\). \\(n\\) käytetään jakojäännös, eli modulo operaattorina molemmissa avaimissa \\(\pmod{n}\\).

Seuraavaksi lasketaan \\(φ(n)\\) mikä on sama kuin \\((p − 1)(q − 1)\\).

Sitten valitaan \\(e\\) niin että se on positiivinen numero \\(1\\) ja \\(φ(n)\\) väliltä. \\(e\\) ja \\(φ(n)\\) suurin

\\(e\\) ja \\(φ(n)\\) suurin yhteinen tekijä (greatest common divisor, eli gcd) tulee olla \\(1\\) (\\(gcd(e, φ(n)) = 1\\)). Meidän tapauksessa \\(e = 65537\\) Mikä on [Pythonin RSA moduulin dokumentaation](https://www.dlitz.net/software/pycrypto/api/current/Crypto.PublicKey.RSA-module.html) mukaan "turvallinen" valinta.

Lopuksi lasketaan \\(d\\) kaavasta \\(d = e^{-1}\pmod{φ(n)}\\)

Kuten huomataan, jotta voidaan tarkistaa onko meidän mysteeri numero \\(d\\) tulee ensiksi saada selville alkuperäiset prime luvut. (\\(p\\) ja \\(q\\)).

# Revitään luvut osiin

Onneksi meidän \\(n\\) on suhteellisen pieni luku, niin [WolframAlphan](https://www.wolframalpha.com/input/?i=x*y%3D779191667) ] voi suoraan pyytää jakamaan sen komponentteihinsa. Mitkä ovat.

$$p = 25523, q = 30529$$

Nyt voidaan laskea loput yhtälöt.

$$n = pq = 25523 \times 30529 = 779191667$$

\\(n\\) oletetusti näyttää hyvältä. Lasketaanpas \\(\phi(n)\\).

$$φ(n) = (p − 1)(q − 1) = (30529 - 1)(25523 - 1) = 779135616$$

Sitten muistetaan tarkistaa että \\(φ(n)\\) ja \\(e\\) suurin yhteinen tekijä on \\(1\\).

$$gcd(φ(n), e) = gcd(779135616, 65537) = 1$$

Näyttää toimivan, joten nyt voidaan laskea \\(d\\).

$$e^{−1} \pmod{φ(n)} = 65537^{-1} \pmod{779135616} = 728918657$$

Nyt ei näytä enää toimivan, koska \\(728918657 \neq 706790887\\) joten vastaus ei voi olla "\\(d\\)", mutta RSA salauksessa on vielä kaksi muuttuja joita ei olla käyty lävitse. Itse salattu viesti. Salattu viesti \\(c\\)  viestin \\(M\\) desimaaliksi muunnos \\(m\\) potenssiin \\(e\\) kertaa modulus \\(n\\).

$$ c = m^e \pmod{n} $$

Julkisella avaamilla salatessa \\(m\\) tulee myös sopia sääntöön \\(gcd(m, n) = 1\\), joten ensiksi meidän tulee saada selville \\(m\\) jos mysteeri lukumme `706790887` on \\(c\\).

$$c = m^e \pmod{n} = m^65537 \times \pmod{779191667}, m = 3141592$$

Eli jos `706790887` olisi \\(c\\) \\(m\\) olisi \\(3141592\\). Tarkistetaan \\(gcd(m, n)\\).

$$gcd(m, n) = gcd(3141592, 779135616) = 8$$

Valitettavasti \\(8\\) on suurempi kuin \\(1\\), joten `706790887` ei voi olla \\(c\\), no entä \\(m\\)?

$$gcd(m, n) = gcd(706790887, 779191667) = 1$$

Nyt `706790887` sopii yhtälöön ja koska \\(m\\) on viimeinen muuttuja, RSA salauksessa se on pakko olla tehtävän vastaus.

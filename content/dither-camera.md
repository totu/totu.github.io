title: Dither Camera
date: 2024-03-11
# Dither Camera

## Film photography

We all know someone who is into photography and swears by how much better [film][1] cameras are compares to their digital conter parts and I must admit; the comparisons I have seen are convincing. However whenever I have toyed with the idea of getting into photography the entry price seems way too high and especially film feels like the deep end to start from, but I do find the idea of imperfect capture of reality interesting.

## Dithering

On unrelated note: we are all aware of [dithering][2]. It was very succesflly used in [Return of the Obra Dinn][3] and a while back I played around with it and created [a web tool][4] to dither images.

## What do these have to do with each other?

Glad you asked. In my mind dithering scartches the same place as film. It is older "format" with limits on how it can represent reality and it captures the "mood" of the image very well. Dithering digital images also gets around paying multiple euros per developed film picture and if you get rid of the original image the moment is as ephemeral as with film.

## Existing solutions

There are plenty of apps for your phone to dither images and there are even more computer software and websites that can do it for you as well. However you have to first take a image (or a dozen) and the manipulate them to get to the desired end result. I feel this fights against the whole premis of taking photographs of moments and moods. What if there was a way to just take dithered images, maybe with a dedicated device?

## My solution
<img class="normal-image" width="40%" desc="front of the camera" src="/img/dithercam-front.jpg" />
<img class="normal-image" width="40%" desc="back of the camera" src="/img/dithercam-back.jpg" />

With this tiny device I can take dithered pictures and view the image off of this 250x122 1bit e-Ink display. It has a battery so I can take it to places and it takes pictures that are more about the feeling and mood than anything else

## Images

<img class="text-on-right small-image" src="/img/2024-03-05-09_19_06.png" />
<img class="small-image" src="/img/2024-03-01-15-25-27.png" />
<img class="small-image" src="/img/2024-03-01-15-18-43.png" />
<img class="small-image" src="/img/2024-03-05-09_17_28.png" />
<img class="small-image" src="/img/2024-03-01-15-28-29.png" />
<img class="small-image" src="/img/2024-03-05-09_19_53.png" />
<img class="small-image" src="/img/2024-03-01-15-33-43.png" />
<img class="small-image" src="/img/2024-03-05-09_20_27.png" />

<div class="full-break"></div>

## Parts

As you may have guessed from the initial pictures this is built on top of Raspberry Pi Zero.

<p class="disclaimer">Following links are to Amazon.de, but not affiliate links</p>
<img class="text-on-right normal-image" width="40%" desc="guts of the camera" src="/img/dithercam-guts.jpeg" />

1. [OV5647 camera module][5]
2. [7mm momentary push button][6]
3. [UPS HAT][7]
4. [Raspberry Pi Zero W][8]
5. [2.13 inch e-Paper Hat][9]
6. [Toggle Slide Switch][10]

<div class="full-break"></div>

## Software

All source code is available at [totu/dithercamera][11]. However there is nothing magical about it. It leverages the rapsberry pi's built in PiCamera module to get the image bytes and just feeds them into Waveshare's epd2in13_V4 demo library. Then saves the same bytes as BMP on the disk.

Only even slightly fancy part is the XSLT image gallery to show taken pictures in a Web UI.

## Improvements

As per usual I have a laundry list of improvement ideas

- printing proper case
- writing custom dither options and implementing some way of changing dither method on the fly
- creating wifi access point on the RPi so I can download images off of it elsewhere than just at home
- figuring out what the hell takes 45+ seconds the boot on the RPi

But I most likely won't get to any of these. I feel that the itch has been scratched and I even have parts of future V2 using ESP32 and a bit larger e-Ink display, but we shall see if I ever get to that project.

However I am planning on upgrading the current [web ditherer][4] I have to include some new dithering modes, but I think I should now spend more time going outside and taking some pictures so I can better asses the future needs.

[1]: https://en.wikipedia.org/wiki/Photographic_film
[2]: https://en.wikipedia.org/wiki/Dither
[3]: https://store.steampowered.com/app/653530/Return_of_the_Obra_Dinn/
[4]: /dither.html
[5]: https://www.amazon.de/-/en/dp/B09XHZCV1R
[6]: https://www.amazon.de/-/en/dp/B08P482QH3
[7]: https://www.amazon.de/-/en/dp/B09511KKD5
[8]: https://www.raspberrypi.com/products/raspberry-pi-zero-w/
[9]: https://www.amazon.de/-/en/dp/B07J3FHJVP
[10]: https://www.amazon.de/-/en/dp/B0BTM3WQXN
[11]: https://github.com/totu/dithercamera

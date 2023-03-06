title: Notes on iPad as terminal
date: 2023-03-05
# Notes on iPad as terminal

I bought my first iPad couple years back. It was [3rd generation Air][1], I mainly bought it as TV remote and drawing machine. I've since used it as a bit as second display with [Apple's side car][3] which also works fine. However some time ago while rearranging my bedroom it had a fall and the screen shattered. It still works fine as audio player and I can even tolerate watching some videos off of it on weekends when I don't want to get up. However the drawing part was pretty much kaput.

I've been using [MacBook Air M1][4] as my primary work machine (truth be told it is too only just fancy terminal and teams machine since all actual work is done on a Linux desktop over [SSH][5]) and since I haven't had my own laptop for a while I wanted to buy one, but buying another MacBook Air M1 felt weird - since I already have access to one - and dropping 1600€ on the base model [MacBook Air M2][6] is just way too much money I decided to on a weird compromise of buying [iPad Air M1 (5th Gen)][2].

## Performance

As you'd expect on any M1 device it is blazingly fast at everything it can do.

## But as a developing machine?

This is the part I glossed over and probably had I thought about it more I would have skipped the iPad for actual computer: iPad is just glorified iPhone. Meaning you can't actually write and run code on the iPad, as in I can't just install [homebrew][7] or and then get [NeoVim][8] and start writing Python code - however I am writing this very post on my iPad, but with some extra steps...

## Extra steps

As you might know from my previous posts I run an PiHole with Ruuvi collector (currently on [RPi 4][9] in case you are curious) so I tried to just import all of my tools over and see if it worked out and it pretty much did.

[tmux][10] and NeoVim installed without an issue, so did [python3][11], but my Pi only has 3.7 in its repos and my new web page compiling script was using new stuff from [`shutil`][12] which the 3.7 didn't support so I had to compile 3.11 myself. Only issue I had initially were missing [`ctype`][13] package, but that got fixed when I first installed [`libtiff-dev`][14] (no idea why ctypes would require tiff support) and [`libsodium-dev`][15] and re-compiled.

<img style="width:100%;margin-top:1em;margin-bottom:1em;margin-left:0%;border:dotted 1px var(--yellow)" src="/img/ipad-workflow.png" alt="NeoVim in tmux in Blink on iPad">

With the [Apple's Smart Keyboard Folio][16] typing is good enough that I don't mind using it over any other laptop keyboard. However I am a bit tempted to buy some kind of bluetooth mechanical keyboard, but that will have to wait to see if I will keep this up. Only noteable problem is lack of `Esc` key, so I had to map `§` to `<Esc>` in insert mode (probably should map it in other modes as well now that I think about it)

## Website development flow

Standard affare. Run my `make.py` one tmux panel, run `python3 -m http.server` in another panel, open Safari to rasperripi.local:8000, and open neovim in the `content/` folder and start writing.

## Accessories

I already mentioned I have Apple's Smart Keyboard Folio, which I do (soft) recommend. It works just fine. It is not amazing. It is not crap. I think Apple has something newer out as well that might be better. I've also read good things about Logitech's keyboard - however the dude who sold me my iPad recommended using Apple's keyboard and I (maybe foolishly) believed him.

I also bought new 2nd generation Apple Pen clone. The official pencil is a bit pricy so I skimped out on it and bought something at half the price that the dude recommended - however with the pencil I think I should have paid the full price. I don't have the touch charging nor pressure sensitivity and I am pretty sure within a month I will be buying the official pen anyway. And depending on the price I might buy the Logitech keyboard just to try it out.

## Apps

Really the only relevant application for using iPad as SSH terminal [Blink][17]. I bought it years ago so I could manage my PiHole from my phone and it looks like there is a new version - I got the impression that it has new nice features, but also I think it now operates on a subscription and I think that is unreasonable so I reverted back to the legacy version as soon as it started to nag me for money. So unless you are also legacy use you might need to look for another solution.

## Thoughts

It is pretty surprising how often I've used my iPad even though my MacBook is right plugged into my big monitor and has all my usual work accessories already attached, but something about just wipping out my pad and turning it into "laptop mode" and working purely on hardware I own feels right for the stupid shit I do on my own time. Also the janky parts of the workflow feel more like a feature than a bug currently - I am doing this as a hobby after all, so having to compile a tool or a library is part for the course and there is just something about using nice Apple-y interface to make and run code on a Raspberry Pi that just tiggles me. Like this is definitely **my** setup and there probably aren't (m)any like it!

[1]: https://en.wikipedia.org/wiki/IPad_Air_(3rd_generation) "iPad Air (3rd generation) - Wikipedia"
[2]: https://en.wikipedia.org/wiki/IPad_Air_(5th_generation) "iPad Air M1 (5th generation) - Wikipedia"
[3]: https://support.apple.com/en-us/HT210380 "Use an iPad as a second display for a Mac"
[4]: https://en.wikipedia.org/wiki/MacBook_Air_(Apple_silicon)#M1_(2020) "MacBook Air M1 - Wikipedia"
[5]: https://en.wikipedia.org/wiki/Secure_Shell "SSH - Wikipedia"
[6]: https://en.wikipedia.org/wiki/MacBook_Air_(Apple_silicon)#M2_(2022) "MacBook Air M2 - Wikipedia"
[7]: https://brew.sh/ "Homebrew"
[8]: https://neovim.io/ "NeoVim"
[9]: https://en.wikipedia.org/wiki/Raspberry_Pi "Raspberry Pi - Wikipedia"
[10]: https://github.com/tmux/tmux/wiki "tmux"
[11]: https://www.python.org/ "Python"
[12]: https://docs.python.org/3/library/shutil.html "shutil documentation"
[13]: https://docs.python.org/3/library/ctypes.html "ctypes documentation"
[14]: http://www.libtiff.org/ "libtiff"
[15]: https://doc.libsodium.org/ "libsodium"
[16]: https://apple.fandom.com/wiki/Smart_Keyboard_Folio "Smart Keyboard Folio"
[17]: https://blink.sh/ "Blinkshell"

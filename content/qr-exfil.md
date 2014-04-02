title: QR Exfiltration tool
date: 2020-02-02
# QR Exfiltration tool aka QRXFL
Hak5 made a [video][1] about exfiltrating data off of an airgapped computer using QR codes. A program encodes files into QR codes, the QR codes are displayed on the screen and captured on video camera. Later the data can be extracted from the video. Initial infection is done with badusb/bashbunny

## Problem - SPEED!

In the video Darren describes problems with image blurring when speed in increased. You probably can not reliably exfiltrate even 30 QR codes per second. In normal networking this wouldn't be a huge issues, since you would just resend the corrupted bits, but since we are recording everything at once and then decoding at later date the data has to be perfect on the first try.

## Solution?

Instead of blindly flashing QR codes on the screen lets have client/server communication. Victim's computer acts as server -- running software that find interesting files and creates QR codes out of them to display for the client -- attacker's phone acts as client, it records the QR codes with face camera and when it succesfully reads QR code it will display QR code back to server acknowledging that it received and decoded the message. The server (using its webcam) generates a new QR code to exfiltrate, after it reads a QR code from the client acknowledging the reception of last QR code.

## Idea

Basic scenario is to run piece of software on the victim PC that would gather valuable data (whatever that might be) and then start displaying that data as QR codes on its screen. Then it would begin monitoring its webcam for a confirmation from the attacker's client (mostlikely a smartphone) that it had received the data before proceeding to the next QR code

Attacker's phone acts as a proxy for the attacker's server. The victim PC encodes as much data as it can to a single QR code, the attacker's phone reads the QR code and sends it to his/her server, the server ACKs back on data delivery and the phone displays that ACK as a QR code on its screen. When the software on the victim PC received the ACK it will encode the next QR code and begin the cycle again.

## Setup

My proof of concept assumes that the attacker has some form of access to the machine and is able to run code on it. I can already hear you asking; "why not use anything else, the game is already over if you have code execution privileges?" to which I have no answer, except my mind wondered back to this concept again and again.

The "victim" code can be found [here][2]. It is the `qrxfl.py`. In it's current version it doesn't actually dig up data, it just waits for a QR code from the web camera, decodes the string, adds "asd" in the end, and displays the new string as a QR code

The attacker code is actually a web page, the code can be found in the Github project as well, but it is also live at `/qrxfl`. It works exactly like the victim client currently.

## Demo
<iframe width="660" height="365" src="https://www.youtube.com/embed/HW_Q7selJMM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In the video the left QR code is capured off of the screen of the vicim PC. The image from the right is captured from the web camera of that same PC.

As you can see the idea works, however as the demo goes on and both parties keep adding to the text, so it takes longer and longer for them to read the data off of each other

## Retrospective

It would seem that this concept works. However it isn't the most practical. The speed presents an issue as well as need for good lighting to create enough contrast on the bright screen so webcameras can pick up the codes. More over only reason to use this method is if you have no alternatives, like for some reason you have the exflitration software running on the machive, but for some reason you can't use any of its ports or Internet access AND it has a screen AND a camera attached.

There probably won't be further development on this, since the silly demo has scratched my itch on the topic and due to the above mentioned restrictions I do not think further development will bear any meaningful fruit.

## TODOs

Here is a list of things that should be considered if someone is interested in this project:

- Teach the Python script to read files
- Teach the JavaScript to decode and save the received data
- How to deal with reflections on phone?
- How to deal with positioning problems?
- How to deal with low-light etc focusing issues?
- Do we need feedback (audio, visual, haptic)?


[1]: https://www.youtube.com/watch?v=WBkNgb-iPGE "[PAYLOAD] Steal files with  QR  codes? Yes - Hak5 2322"
[2]: https://github.com/totu/qrxfl "Github - QRXFL"

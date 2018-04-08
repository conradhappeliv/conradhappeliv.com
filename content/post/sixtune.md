+++
author = "Conrad Henry Appel, IV"
date = 2016-04-19T00:00:00Z
description = ""
draft = false
slug = "sixtune"
title = "Sixtune"

+++

Sixtune is a unique guitar tuner - not only can you access it from anywhere, you can also tune all six strings at once.

[![Sixtune](/img/sixtune.png)](https://sixtune.conradhappeliv.com)

Beginnings
----------

Over the past weekend, I was given the opportunity to participate in [HackDFW 2016][hackdfw], a 24-hour [hackathon] hosted by a group of universities around the DFW area. I, along with partner [Sam Hunter][samhunter], decided to create a web application accessible from anywhere that allows you to tune your guitar easily. However, this would be no normal guitar tuner - it would be one that allows you to tune all six strings at once.

At first, I thought this wouldn't be too difficult. I mean, we could simply listen for each of the six fundamental frequencies and calculate how far away they are from what the actual frequencies should be, right?

Wrong. _Very_ wrong, unfortunately.

In the back of my head, I knew it couldn't be as easy as it sounded. I mean, if it were, why weren't six-string guitar tuners more widespread? I also knew that guitars generate a series of [overtones] along with the fundamental frequency of the note that is struck, but I didn't think they would be so pronounced. Additionally, after calculating them out, I noticed that many of the overtones actually overlap exactly or almost exactly with the fundamental frequencies of some of the strings, which is a problem when you're trying to tune those strings. The more I read about it and tried different things, the closer I would get to scrapping the project.

But I kept with it. I started reading about [pitch detection algorithms][PDA] (specifically for polyphonic signals - that is, with multiple notes played at once). In the end, I used a variety of techniques to achieve the product.

Technical Implementation
------------------------

![Guitar Spectrum](/img/guitarspectrum.png)

First, for the frequency spectrum of each buffer, I would find the local peaks of the frequency spectrum by finding the frequencies that were higher in amplitude than the surrounding ones. From these, I would filter out "bad" peaks by checking to see if they were actually much higher in amplitude than the surrounding frequencies. From each of the remaining peaks, I calculate the frequency in Hertz by averaging each of the frequency buckets given by the FFT that were part of the peaks, and then multiplying the resulting bucket number by the sampling rate, and dividing by the FFT size. Finally, using a list of frequencies that the guitar strings _should_ match, I found the closest match to each and calculated the difference between the two to find how far away each guitar string was from its ideal frequency. Then, in order to give the user a more consistent result (instead of flickering between sharp and flat results due to noise or sound wave interference), I chose to calculate a moving average over the last 20 buffers' final results.

The code repository for the project is hosted on [github][sixtunecode].

Some Final Notes
----------------

* While the application does "work", it currently takes longer than I would like to tune a guitar fully and accurately.
* Due to the aforementioned overtones being close to the guitar's fundamental pitches, the implemented solution may never lead to complete product. Instead, a solution that actually takes the overtones into account (by calculating where they should land or using a snapshot of a fully tuned guitar's spectrum to compare the peaks to) would be necessary.
* Spectral leakage leads to a loss of accuracy (especially where peaks are very close) and unnecessary computation.

Next Steps
----------

* Performance optimizations are going to be very necessary to make this work well on other devices. Currently, even on early 2010's Macbooks, the application runs very sluggishly. The main performance gains will be in decreasing the size of the FFT. However, accuracy issues need to be addressed before doing so.
* Accuracy is currently very lacking. Individual strings work very well, but when you add in the overtones of other strings, it becomes much more difficult to tune.
* Code refactoring. Mostly for ease of reading and making it easier to find problem areas (Currently everything happens in the `draw()` function when it shouldn't - oops...)

Quick shout-out to all of the awesome new APIs introduced into browsers recently: Web Audio, Web MIDI, Gamepads, and so many more that I haven't even touched yet.


[hackathon]: https://en.wikipedia.org/wiki/Hackathon "Hackathon"
[sixtune]: /sixtune/ "Sixtune"
[sixtunecode]: https://github.com/conradhappeliv/sixtune "Sixtune's Source Code"
[webaudioapi]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API "Web Audio API"
[hackdfw]: http://hackdfw.com/ "HackDFW"
[samhunter]: https://www.linkedin.com/in/samwhunter "Samuel Hunter"
[guitarharmonics]: https://en.wikipedia.org/wiki/Guitar_harmonics "Guitar Harmonics"
[overtones]: https://en.wikipedia.org/wiki/Overtone "Overtones"
[PDA]: https://en.wikipedia.org/wiki/Pitch_detection_algorithm "Pitch Detection Algorithms"
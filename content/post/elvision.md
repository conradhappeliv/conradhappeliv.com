+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning"]
date = 2016-03-28T00:00:00Z
description = ""
draft = false
slug = "elvision"
tags = ["Engaged Learning"]
title = "Engaged Learning Vision"

+++

In the past few months, I decided to begin to take a big step in my learning by designing an individual Engaged Learning project that encompasses multiple areas of study. As my three primary courses of study are Computer Science, Electrical Engineering, and Music, I devised a proposal that clearly encompasses all three: designing hardware and software digital music synthesizers.

Through this project, I will be forced to explore many aspects of product design that I have not been exposed to in my classes (at least as of yet), including, but not limited to:

* digital circuits
* semi-realtime DSP programming (specifically in the Linux audio stack)
* 3D printing/prototyping
* electronic debugging equipment (such as oscilloscopes)

First Steps
-----------

Now that my submitted proposal was approved by SMU's Engaged Learning office, I can begin work on the project. For the first phase of the project, I'm going to focus on creating a software synthesizer that can be "played" using a game controller of some kind (most likely a wired Xbox 360 Controller). 

My first steps will mostly involve setting up the nuts and bolts of the project including modules that...

* handle any generic controllers via the [Linux Joystick API][joystickapi]
* allow me to visualize generated signals in the time and frequency domains
* allow me to save audio snippets

Next Steps
----------

After having all of the initial components set up, my focus will be to experiment, experiment, and experiment some more. The main focus of this project is to create something innovative and new, rather than creating another synthesizer with a piano-style keyboard and with the same knobs and buttons you can find on any synth at a music store.

Here is my approved proposal: [Design of Digital Music Synthesizers][proposal]

[proposal]: /pdf/SynthesizerProposal.pdf "SynthesizerProposal.pdf"
[joystickapi]: https://www.kernel.org/doc/Documentation/input/joystick-api.txt "Linux Joystick API"
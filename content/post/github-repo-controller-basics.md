+++
author = "Conrad Henry Appel, IV"
categories = ["Engaged Learning"]
date = 2016-04-03T00:00:00Z
description = ""
draft = false
slug = "github-repo-controller-basics"
tags = ["Engaged Learning"]
title = "Github Repo & Controller Basics"

+++

I've now begun work on the nuts and bolts of the program - specifically setting up a public code repository and writing a library for handling the controllers.<!--more-->

Github Repository
-----------------

The code repository for my EL project is hosted on Github: https://github.com/conradhappeliv/joysynth/

Controller API
--------------

For the first control scheme, I'm going to focus on Microsoft's Xbox 360 Controller. This is one of many so-called "joysticks" supported by the Linux Joystick API, so I will be using that to handle the controller's input. As of now, I wrote a [C++ abstraction class](https://github.com/conradhappeliv/joysynth/blob/master/Controller.h) on top of the Joystick API that should make handling any number of controllers easy from here on out. To get the value of an axis or a button, all I'll have to do is call `button(button_num)` or `axis(axis_num)`.

In order to make this work, I use a separate controller thread that reads the controller's messages from the buffer whenever they arrive and then stores them into memory for easy access whenever they're requested. Each message is 8 bytes and of the format (as provided by the API docs; translated into C++):

    struct {
        unsigned int time;    /* event timestamp in milliseconds */
        short value;          /* value */
        unsigned char type;   /* event type */
        unsigned char number; /* axis/button number */
    } js_event;
    
Because I will only be returning the controller's values to the main program when requested (instead of, say, queueing up music events based on every received event), I don't have to do anything with the timing data. I save the rest of the data (button/axis number & value) into C++'s `unordered_map` for fast storage and retrieval.
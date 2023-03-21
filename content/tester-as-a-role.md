title: Should "Tester" be a role?
date: 2023-03-23
# Should "Tester" be a role?

For past seven years I have worked as professional tester. First I worked as a subcontractor under title "Engineer, SW Testing". Then later I joined the company as "Test Automation Developer" and since then I've become "Senior Test Automation Specialist".

However my role inside the various teams hasn't changed much (expect my short stint as a Scum Master) essentially I serve as CI pipeline maintainer and interface test writer for 4 to 12 C++ developers.

## Current task division

Just to bring us on same page how my company splits testing (at least in the teams I've been part of) is that the "developers" write unittests for their code and then "testers" upkeep our test libraries (written in python) and use them in cojunction with Robot Framework to test our application's different interfaces using both public and proprietary protocols as well as do _light_ end to end testing against the actual hardware we ship with other applications and services.

## Problems

Recently we've had quite a few people in these "tester" roles have moved to different roles or quit. Meaning there is lack of testing support and newbies to be trained. In turn I've been more occupied with reviewing testing code than writing new tests and well as maintaining our CI pipeline and improving speed and reliablity of our pipeline.

This has made me think: why do we even have this "tester" role? Why aren't the developers writing the Robot Tests? Whenever developers need to write Robot tests there seems to be friction. I'm sure it is partly because Robot has weird syntax, but if these people can come to grips with C++ Robot Framework should be a walk in the park.

Another part is that "tester" is seen by many as a lesser role to "developer". Less technical. Less capable. Less worthy. This is where I have the biggest problem: testing is most imporant part of software development (imagine someone calling themselves a "tester" having this take). Many people can write tests, but writing tests that actually test something and test it properly is hard. Especially negative cases are often completely forgotten by the devs and maybe that is natural since you focus on building the new function/feature/system so you have to have a tester's mindset to (try to) tear it into pieces.

## New role?

As much as I don't like "Quality Assurance" as a term (you aren't [_assuring_][1] shit), maybe transforming the current "tester" role into something like "QA Coach" would be the play. Someone who focuses on the quality of the product. Someone who is knowledgeable about testing frameworks, tools, and pipelines in use and capable of helping the developers in best ways of testing their products via reviews and making new tools and improving test base.


[1]: https://www.merriam-webster.com/dictionary/assure "to make sure or certain"

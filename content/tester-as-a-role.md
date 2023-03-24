title: Should "Tester" be a role?
date: 2023-03-21
# Should "Tester" be a Role?

For the past seven years, I have worked as a professional tester. Initially, I worked as a subcontractor with the title "Engineer, SW Testing." Later, I joined my current company as a "Test Automation Developer," and since then, I've become a "Senior Test Automation Specialist." However, my role within the various teams hasn't changed much (except for my short stint as a Scrum Master). Essentially, I serve as the CI pipeline maintainer and interface test writer for 4 to 12 C++ developers.

## Current Task Division

To bring us on the same page, my company splits testing (at least in the teams I've been a part of) by having "developers" write unit tests for their code, while "testers" maintain our test libraries (written in Python) and write tests with Robot Framework for our application. We also perform light end-to-end testing between our application and other applications and services we deliver using actual hardware we ship to customers.

## Problems

Recently, several people in these "tester" roles have moved to different roles or quit, resulting in a lack of testing support and newbies to be trained. Consequently, I've been more occupied with reviewing testing code than writing new tests, as well as maintaining our CI pipeline and improving its speed and reliability.

This has made me wonder: why do we even have this "tester" role? Why aren't the developers writing the Robot Tests? Whenever developers need to write Robot tests, there seems to be friction. I'm sure it's partly because Robot has weird syntax, but if these people can come to grips with C++, Robot Framework should be a walk in the park.

Another issue is that "tester" is seen by many as a lesser role to "developer." It's considered less technical, less capable, and less worthy. This is where I have the biggest problem: testing is the most important part of software development (imagine someone calling themselves a "tester" having this take). Many people can write tests, but writing tests that actually test something and test it properly is hard. Especially negative cases are often completely forgotten by developers, and maybe that's natural since you focus on building the new function/feature/system. Still, you have to have a tester's mindset to (try to) tear it into pieces.

## New role?

As much as I don't like "Quality Assurance" as a term (you aren't [_assuring_][1] shit), maybe transforming the current "tester" role into something like "QA Coach" would be the play. Someone who focuses on the quality of the product. Someone who is knowledgeable about testing frameworks, tools, and pipelines in use and capable of helping the developers in best ways of testing their products via reviews and making new tools and improving test base.


[1]: https://www.merriam-webster.com/dictionary/assure "to make sure or certain"

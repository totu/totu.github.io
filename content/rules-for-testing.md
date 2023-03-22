title: Rules for testing
date: 2023-03-22
# Rules for testing

Here are some rules in no particular order for new-friends who want to test their (or someone elses) code.

Obviously these are very much colored by my work history working with industrial embedded software, but I think most if not all of these rules should be applicable for pretty much any software project.

## Use your brain
There is no way for me to predict every single edge case in every single product you run into, so take every rule with grain of salt.

I here by grant you the power to break any and all rules listed here, however the definity of the language used in each rule is directly proportional to the amount of justification you need to use when breaking the rule during code review.

## Happy cases are not interesting
You should never learn anything new about your product from your happy test(s). What happy case does tell you is that your test libraries and keywords work as expected.

Never have I been given piece of code to test that didn't pass happy case, but passed edge/negative cases.

## Most of your tests should test for failures
Testing for failures a.k.a. negative tests tell you much more about your product than happy tests. These tests actually define how any given feature can be used and how it interacts with other features.

Remember your job when testing is to break the product.

## Push your boundaries
Boundaries for every value are important to test. Common mistake is to make some number not have reasonable maximum and minimum e.g. start up watch dog probably shouldn't be set to 0 or 1 second.

Before even writing some tests you should think if the configuration makes sense. Even if you can configure something nonsensical doesn't mean it should be allowed. Discuss with your collegues when you find the such values from implementation or specification.

## Every Send needs a Wait
Sending multiple messages to different interfaces (sometimes with multiple different protocols), but never waiting any kind of response for these messages can cause a insidious problem: it might look like your sequence is correct, but you might have an error that is somehow recovered from by the time you Wait for whatever you actually wanted to test after several successive Send Messages.

## Never use Sleep
Sleeping just wastes everyone's time.

If you find yourself using Sleep keyword you probably are thinking your problem in wrong way. Consider following:

- If you want to wait until the system is in state X instead of waiting for Y seconds until you are (pretty) sure the system is in that state just do the work and go through the sequence until you are in state X
- If you don't have any signal in your protocol that system has reached state X think if you could use another protocol to confirm that the system is in state X
- If no protocol can be used to confirm system's state consider if your taste makes sense. How is this going to happen in real world if you can not detect the state in anyway?
- If nothing else helps add more istrumentation. You can't test whan you can't see. Add a way to see what you need to see.

## One start is plenty

You should only ever need to start your applications once. One of the longest time wastes in our tests is time spent starting applications. Remember that just because some setup only takes 4 seconds on your development machine does not mean the same restart won't take 30+ seconds on the actual deployment hardware.

If you find yourself restarting anything to clean state instead just put in the work and clean the state properly.

## Do not hide your keywords

You will have a temptation of renaming some keyword or perhaps hardcoding some argument's value and hiding this change behind a keyword that literally just calls one keyworda. This makes reading test logs harder than it needs to be. Just call the keyword you want to call.

Suite Setup, Suite Teardown, Test Setup, and Test Teardown keywords are optional - meaning if for some reason you do not need to use one there is no need to define one with No Operations inside it. These can and should be ommitted when necessary.

## Search before you write new keywords

We have a lot of tests with even more keywords. Unless you are writing brand new stuff  there probably already exists a keyword that does what you need or at least with small modification it can be made to also do what you need.

Don't just look at files use tools like grep (preferably with fuzzy finding) and use variations.

Nothing is worse than coming across second worse implementation of a keyword you have lovingly crafted.

## Do not copy-paste keywords

When you find yourself in a situation where some suite has implemented a keyword you wish to use instead of copying it over and now having two identical keywords move the keyword to appropriate resource file and refactor the old suite to use that resource.

## Separate your parameter tests

There is absolutely no reason a feature test suite's keywords should check and re-check that configuration of that feature took place. You should instead write separate interface tests where you excercise the parameter handling, so your feature tests can configure with confidence.

## You will never think of everything

You will miss sometimes retrospectively obvious things in your test coverage. We only have limited amount of time to dedicate to any product or feature. Identify and focus on important things. Covering 100% of one specific function that delivers no value to end user means nothing.

Be willing to admit your mistakes and do not hesitate writing new tests (and improving old tests) for old features and you come up with them.

## Set up yourself for success

Often I see people write tests without any kind of syntax highlighting or LSP for their testing framework. Do not be one of these people! Get to know your editor and install appropriate extensions.

For NeoVim with Robot Framework I can recommend following:

- [totu/robotframework-vim][1]
- [robocorp/robotframework-lsp][2]

[1]: https://github.com/totu/robotframework-vim "totu/robotframework-vim"
[2]: https://github.com/robocorp/robotframework-lsp "robocorp/robotframework-lsp"


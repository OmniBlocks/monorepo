# Contributing to OmniBlocks

Most of the information you need is in the [README](README.md), but we'll reiterate it here for you to understand better as well as some more specific details for contributing.

Contributions are welcome! 

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Code your feature (make sure to follow our super strict style guide below)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to the branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request.
7. Sit and wait as it gets reviewed :)

## Languages

To contribute to OmniBlocks, you must know JavaScript, and prefferably, React too. If you don't know what these are, well, go ahead and learn it! There are many resources online for you to learn any languages. If you feel stuck, feel free to reach out in the Discussions tab and we might help you a little.

For other packages, such as scratch-vm or scratch-blocks, you might need to install some other runtimes, such as Python, but it isn't strictly necessary to know them.

## Development Environment

This is also explained in the README, but this explains different things.
OmniBlocks is a very large app, so please make sure you use your storage wisely. This is why we recommend using Github Codespaces. Github Codespaces allow you to create a full cloud coding environment + VS Code, allowing you access to a quite powerful computer _for free_ and from any device, even a phone! In fact, it is how most, if not all, of OmniBlocks' maintainers work too!



## 📝 The Super Strict Style Guide of Doom 😈
As you may know from the earlier parts of the readme, this is all made in React JS, a modular JavaScript framework. We're pretty laid back, so we don't have a super strict style guide or coding conventions, just know the following:

-  Go all out on your code! It doesn't matter if you don't use proper indentation, or other stuff like that, just make sure to add comments explaining it. After all, this is JavaScript, not Python we're talking about, so any valid syntax is valid syntax.
-  Make sure your variables are readable. While everyone loves fun code, please make sure your variables are legible. For example, if you need a variable for a new multi-backpack feature you're planning to add (not quite sure what the feature would do, but it's just an example), we'd prefer "multibackpack" or even "backpackthing" over "qwnpvoitwegjk".
- Absolutely NO profanity. I have seen other repos have profanity in commit messages or comments, and while it is relatable and even hilarious to see how miserably we fail at code sometimes, there is no need to use profanity. Since our project is for All Ages and open source, we assume anyone of all ages will also see the code. Some words, however, are not considered profanity, such as crap or heck. If you snoop in _OUR_ commit messages, we have some pretty hilarious frustrations in there too! Just no bad words.
Other than that, Code On! We don't require much other than these rules. Have fun!

## Following the Code of Conduct

While we are quite laid back, as I said earlier, this does not exempt anyone from not following the [Code of Conduct](https://github.com/OmniBlocks/.github/blob/main/CODE_OF_CONDUCT.md). Please make sure your contributions follow that, or they may get rejected.

## Joke features

Haha! Funny! yes..............
Joke features for April Fools are allowed, just don't spam PRs for joke features, although that applies for any kind of PR.</br>
No, really don't. Or else this is what we have to deal with:</br>
<img width="300" height="64" alt="A pull request counter, showing 98 PR's open." src="https://github.com/user-attachments/assets/3f8e9d66-2a67-40df-bb31-dfbea5e61ed8" />

## Code Review

When you submit a PR, you might realize we have several bots for code review and testing. This is a good thing, as it allows us to test and review your PRs faster, find things we otherwise might not find, and overall speed up things. Do not worry either, since a human always has the final say in merging or not.


## Commits

Your commits can be whatever as long as they follow the Code of Conduct, but we prefer this style:
- fix: for fixes
- docs: for changes to markdown files or documentation
- feat: for new features
... and so on.
This helps us categorize commits better for future reference. Again, though, this isn't going to be enforced but rather simply encouraged so as to not be a burden on anyone when contributing.

### Branches

This is a big one. If you are a member of OmniBlocks (@OmniBlocks/coders), please make sure to create a new branch for any significant feature you might add. You can push to main for quick fixes such as typoes, documentation, workflows, or even small errors in the source files. For anything bigger, however, such as a new button, a new tab, a new addon, or anything else, please create a new branch so that the code can be reviewed and tested before merging.

## What can I contribute?

A: Anything! If we believe it is helpful or fun and good for the overall future of OmniBlocks, we will add it! There are some caveats, though:
- **Bad code**. Even if the feature is well intentioned, please try to make functioning code. This is NOT reffering to code formatting, as we have established you have a lot of freedom in this realm. This is refferring to non-functional or flawed code, especially code generated by AI, which tends to have misconceptions about the codebase, hallucinations, or blatant, gaping oversights. We will try to fix any broken code for the sake of the feature, but sometimes, we may just close a PR if we believe the code is unsalvageable and it would be better to try reimplementing the feature in another way or to try again. This does not mean you can't ever contribute to OmniBlocks, because you can always reach out for help with code!
- **Rejected features or features not aligning with OmniBlocks' vision.** Pull requests adding features that would be considered good but otherwise unsuitable for OmniBlocks. This is a very rare case, but for an example, this is features like full, heavy analytics or live collab. This is done in the name of privacy and safety, especially for children, but overall for any user. Features like this seem great on the surface for app creators or corporate CEOs, but ask yourself this question: if you had to use this feature or have to use this software with such code, would you use it yourself?

## Upstream

For issues with upstream repositories (especially security issues), we recommend letting them know or making an issue there instead. If you feel like they wouldn't bother to add such a feature, (e.g. too time consuming, unnecessary), and you know it can be fixed statically (does not require backend), reach out to us! We might consider adding that feature. An example is more advanced extensions. Scratch might not bother or care about adding a new extension with cool advanced blocks and more freedom or functionality. For us, that's what we are about! OmniBlocks is _meant_ to have advanced features and functionality!

We hope you have fun here at OmniBlocks, and don't forget to **keep coding!**

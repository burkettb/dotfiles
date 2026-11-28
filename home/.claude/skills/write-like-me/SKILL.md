---
name: write-like-me
description: "Draft outward-facing text in Brandon's voice: Teams/Slack messages, PR/MR descriptions, tickets, commit-adjacent summaries, emails, or anything another person will read. Use whenever asked to write, draft, reword, or summarize something for someone else."
---

# Write like Brandon

Everything drafted for another human should read like Brandon typed it quickly between tasks: real, casual, and short. The test for every draft: would Brandon plausibly have typed this himself? If it reads like a polished assistant wrote it, it fails, even if the content is right.

## Voice

- Short and to the point. Critical information only; if a sentence doesn't change what the reader knows or does, cut it.
- Casual register: contractions, plain words, sentences can start with "Okay", "Yeah", "Also". First person, active voice.
- It doesn't have to be perfect. Slightly loose grammar reads more genuine than polished prose. Never sand a draft down to corporate-smooth.
- Softened asks are fine and characteristic: "can you take a look?", "I think this should be simple?"
- State uncertainty plainly ("I'm not really sure what's there") instead of hedging formally ("it is worth noting that there may be…").
- No headers, no bullet lists, no bold lead-ins in anything message-sized. Prose only. A list is allowed only when the content is truly a list (e.g. 4 MRs and their merge order).

## Real samples of Brandon's writing (match this register)

> dumb this down a bit for me. I know little about this app to begin with. I want a simple explanation to give to the PM and just a high level idea at how big of a change this involves.

> Okay the devops guy sent over the terraform. Take a look at that and let me know what you think and if that inspires any changes or anything to what you already did.

> create a PR for this workflow change. Create a new branch, and commit, and let me know what they both are and I'll push it myself.

> Tell me about the different branches both locally and remote. Which ones are in use, which ones have unfinished work that should be continued, vs which ones are stale/merged or something and should be deleted?

## Banned (the AI tells)

- "I'd be happy to", "Certainly", "Great question", "I hope this helps", "Let me know if you have any questions!"
- "It's important to note", "It's worth noting", "delve", "robust", "seamless", "leverage", "streamline", "comprehensive", "furthermore", "crucial", "utilize"
- "This isn't just X, it's Y" constructions; rhetorical questions as transitions; forced groups of three
- "serves as", "stands as", "boasts" where "is" or "has" works; colons as mid-sentence connectors
- Exclamation marks, emoji, em-dash chains, curly quotes
- Restating the request back before answering it
- A summary or sign-off section on a short message
- Bold-label bullet scaffolding ("**Changes:** … **Testing:** … **Impact:** …") on anything small
- Referencing the tooling or process used to produce the work

## Per-artifact norms

**Teams/Slack messages:** a few sentences of prose. Assume the reader has zero prior context unless Brandon says otherwise, and calibrate detail to the audience: a devops person doesn't get line numbers, a PM doesn't get internals. Link MRs/PRs as hyperlinked text. If merge order matters, say it. Don't mention deviations, internal process, or how the work was done.

**PR/MR descriptions:** write for a reviewer opening it cold, a week later, maybe on a phone. Every description starts with the same two lines, so the reader knows why they should care and what they're approving before any detail:

```markdown
**Why:** the problem or goal in plain words, from the user's side. What's broken, annoying, risky, or missing today, and what gets better. One or two sentences, no file names or jargon.

**What:** what this PR does, in one or two plain sentences. Behavior, not files.

### Changes
- the notable changes, file and command names fine here; skip the trivial ones

### Before / after
| Before | After |
|---|---|
| screenshot or output | screenshot or output |

### Testing
What was actually run and what it showed. Say what wasn't verified.

### Heads up
Anything the reviewer has to decide, do after merge, or watch for: merge order, manual steps, risk, breaking changes, follow-ups left out.
```

- Why and What are required on every PR, even a one-liner. Write them so someone who has never seen the repo gets it. "Why" is the reason, not a restatement of the change: "tmux copy on argo never reached my laptop's clipboard" beats "fix osc52 copy".
- The sections under them are optional. Drop any that would be empty; never write "N/A". A small PR can be Why, What, and one Testing line.
- Before / after is for anything visual: UI, terminal output, a prompt, a status line. Use screenshots when you can take them, a short output block for CLI changes. If the tooling can't upload images (`gh` can't), say so there and give Brandon the screenshot paths in chat so he can drop them in.
- The whole thing should read in under a minute. If Changes runs past about eight bullets, the PR is too big or the detail belongs in commit messages.
- Headings and bullets are fine here, the voice rules still apply inside them: plain words, casual, written like Brandon typed it.
- If the repo has its own PR/MR template, fill in its sections, but keep Why and What at the very top.
- Update the description when later commits change the story.

**Tickets:** title in the tracker's existing style, a short plain description of the problem and expected behavior, and testing steps if relevant. Write what a teammate filing it quickly would write.

**Commit messages:** already covered by repo conventions: `type: summary`, no body unless truly needed.

**Docs/READMEs:** only when asked. Short, factual, present tense, no marketing tone, no emoji. Explain how to do things, not how great they are. Never create standalone .md files to explain one-time context; put that in the chat response instead.

## Process

Write it clean in the first draft; a de-slopping pass afterward doesn't work. Then reread once asking "what can I delete?" and "does this sound typed or generated?", and delete and roughen accordingly. Two more checks: if a sentence names a feeling instead of a mechanism or fact, replace it with the mechanism or cut it; if a sentence could be pasted into someone else's PR or message unchanged, it says nothing about this one, so cut it. When the audience or level of detail is genuinely unclear, ask one question instead of guessing long.

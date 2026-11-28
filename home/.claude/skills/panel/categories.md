# Category menus

Starting points, not fixed lists. Each line is `name: boundary`. The boundary is what the category covers, so two categories never score the same problem. Must-track categories stay unless the report says why they were dropped.

## Code

- Correctness: does what it claims, including edge cases and error paths
- Security and data safety: untrusted input, secrets, authz, destructive or irreversible operations
- Tests: a regression would be caught; tests check behavior, not implementation details
- Structure: boundaries, coupling, abstraction at the right level, no speculative layers
- Readability: naming, size, a newcomer could change it safely (absorbs "cleanliness" and "maintainability")
- Operability: failure modes, logs and errors someone can act on, performance where it matters
- Fit: follows repo conventions; scope matches the ask

Must-track: correctness, security and data safety, tests.

## UX and product

- First-use clarity: a new user knows what it is and what to do first
- Task efficiency: steps and friction for the common jobs
- Findability: where things live; a user can get back to them
- Safety and trust: the user can't be misled or harmed, mistakes can be undone, state is honest
- Accessibility: keyboard, screen reader, contrast, motion, target size
- Visual craft: hierarchy, spacing, type, consistency
- Native fit: follows the platform's conventions
- Distinctiveness: reasons to pick this over existing tools
- Power-user depth: shortcuts, customization, room to grow

Must-track: safety and trust, accessibility.

## Visual design and illustration

- Spatial realism: perspective, scale and contact are physically plausible
- Object fidelity: things read as real objects, not symbols for them
- Composition and hierarchy: where the eye goes first and in what order
- Style craft: the chosen style is executed consistently and well
- Genuineness: feels made for this, not generic or templated
- Type: legibility and pairing
- Mobile: holds up at phone width and in crops

## Plan or architecture

- Problem fit: solves the actual problem, at the right size
- Simplicity: fewest moving parts that meet the requirements
- Risk and reversibility: what fails, what's hard to undo, blast radius
- Operability: who runs it, how it fails, what it costs to keep alive
- Migration path: how to get there from here in shippable steps
- Cost: money, time, maintenance

Must-track: risk and reversibility.

## Writing

- Clarity: the reader gets the point on the first read
- Accuracy: claims are true and checkable
- Concision: nothing the reader could skip
- Voice: matches the intended author and audience
- Actionability: the reader knows what to do next

# Swift and Apple platform checks

Use the scheme, destination and flags the project already uses, from CI, a Makefile, scripts or the README. Fall back to `xcodebuild -list` to find them, or `swift build` for plain packages. If Xcode or the needed SDK isn't installed, record the Swift checks as not run. Builds go to `-derivedDataPath "$TMPDIR/dd-<repo>"` so they don't touch the real DerivedData.

- **swift.build**: Run the project's build command, or `xcodebuild -scheme <app> -destination 'platform=macOS' build`, or the iOS simulator equivalent, or `swift build`. Finding: the build fails. Severity: high.
- **swift.tests**: Run `xcodebuild test` for the test scheme, or `swift test`. Finding: failing tests. Severity: high. Also a finding: no test target at all for an app with core logic. Severity: medium.
- **swift.warnings**: Count the warnings in the build log. Finding: deprecation warnings for APIs removed or deprecated in the current SDK, Swift 6 concurrency warnings in code that touches shared state, or more than 25 warnings in total. Group them by kind. Severity: medium for concurrency, otherwise low.
- **swift.deps**: Read `Package.resolved`. For each direct dependency, compare it with the latest tag (`git ls-remote --tags <url>` when online). Finding: two or more majors behind, or a known security fix missed (Sparkle above all). Severity: medium, or high for Sparkle security releases.
- **swift.release**: Judgment for apps that ship. Finding: hardened runtime off, entitlements broader than what the app uses, a missing or unreachable `SUFeedURL`, a missing `SUPublicEDKey`, a version or build number that isn't bumped by the release process, or Info.plist privacy strings missing for APIs in use. Severity: high when it blocks notarization or updates, otherwise medium.
- **swift.keychain**: Judgment. Finding: secrets written to UserDefaults, files or logs instead of Keychain, or Keychain items with weaker accessibility than needed. Severity: high.
- **swift.main-thread**: Judgment. Finding: UI updated off the main actor, blocking network or disk work on the main thread, or timers and observers that never get invalidated. Severity: medium.

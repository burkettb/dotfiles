#!/usr/bin/env bash
# Runs argo-setup and argo-health against stub pmset, fdesetup, launchctl,
# defaults, t3, sudo and friends on PATH, so nothing real is read or changed.
# Each stub answers from files in $state, which each case rewrites.
#   tests/argo-setup.test.sh
set -u
bin="$(cd "$(dirname "$0")/.." && pwd)/hosts/argo/.local/bin"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/argo-test.XXXX")
trap 'rm -rf "$tmp"' EXIT
export HOME="$tmp/home" state="$tmp/state"
unset SANDBOX_RUNTIME
mkdir -p "$HOME" "$state" "$tmp/stubs"
stubs="$tmp/stubs"

stub() { # stub <name> <body>
    printf '#!/bin/bash\n%s\n' "$2" > "$stubs/$1"
    chmod +x "$stubs/$1"
}
stub pmset 'cat "$state/pmset"'
stub fdesetup 'case $1 in status) cat "$state/fv" ;; supportsauthrestart) cat "$state/authrestart" ;; esac'
stub defaults '[[ $1 == read ]] && cat "$state/swu" 2>/dev/null && [[ -s $state/swu ]]'
stub launchctl 'case $1 in
    print-disabled) cat "$state/disabled" ;;
    print) case $2 in
        */com.t3tools.t3code.service) cat "$state/t3" ;;
        */com.burkettb.dotsync) [[ -f $state/dotsync-loaded ]] ;;
        *) exit 113 ;; esac ;;
esac'
stub t3 'case $1 in
    --version) echo "t3 v9.9.9" ;;
    service) printf "T3 Code service\n  Status: %s\n" "$(cat "$state/t3-status")" ;;
esac'
stub sysctl 'echo "{ sec = $(( $(date +%s) - 90000 )), usec = 12 } Mon Jan  1 00:00:00 2026"'
stub stat 'cat "$state/console"'
stub df 'printf "Filesystem 1024-blocks Used Available Capacity\n/dev/disk3s5 1 1 %s 1%%\n" "$(cat "$state/free_kb")"'
stub dotfiles-status 'cat "$state/dotfiles" 2>/dev/null'
stub agent-doctor 'cat "$state/doctor"; [[ $(head -1 "$state/doctor") != FAIL* ]]'
stub sudo 'printf "%s\n" "$*" >> "$state/sudo.log"'
# The real dotsync is the only thing on PATH without --install-agent
printf '#!/bin/bash\n# dotsync --install-agent\nprintf "installed\\n" > "$state/dotsync-loaded"\n' > "$stubs/dotsync"
chmod +x "$stubs/dotsync"
# ~/.dotfiles/install.sh: --check exits by $state/links, a real run by $state/install-rc
mkdir -p "$HOME/.dotfiles" "$HOME/Library/LaunchAgents"
cat > "$HOME/.dotfiles/install.sh" <<'EOS'
#!/bin/bash
if [[ ${1:-} == --check ]]; then
    [[ ! -s $state/links ]] || { cat "$state/links"; exit 1; }
    exit 0
fi
printf '%s\n' "$*" >> "$state/install.log"
exit "$(cat "$state/install-rc" 2>/dev/null || echo 0)"
EOS
chmod +x "$HOME/.dotfiles/install.sh"
export PATH="$stubs:/usr/bin:/bin"

good() {
    mkdir -p "$HOME/.config/dotfiles"
    echo argo > "$HOME/.config/dotfiles/host"
    printf 'System-wide power settings:\nCustom settings:\nAC Power:\n sleep                0\n disksleep            0\n autorestart          1\n womp                 1\n ttyskeepawake        1\n displaysleep         10\n' > "$state/pmset"
    echo 'FileVault is On.' > "$state/fv"
    echo true > "$state/authrestart"
    echo 0 > "$state/swu"
    printf 'disabled services = {\n\t"com.openssh.sshd" => enabled\n}\n' > "$state/disabled"
    printf 'gui/501/com.t3tools.t3code.service = {\n\tstate = running\n\tprogram = /Users/x/.t3/runtime/versions/1.2.3-nightly/t3\n}\n' > "$state/t3"
    echo 'installed · t3@9.9.9' > "$state/t3-status"
    echo brandon > "$state/console"
    echo 100000000 > "$state/free_kb"
    : > "$state/dotfiles"
    echo 'PASS  everything' > "$state/doctor"
    echo installed > "$state/dotsync-loaded"
    touch "$HOME/Library/LaunchAgents/com.burkettb.dotsync.plist"
    : > "$state/links"
    rm -f "$state/sudo.log" "$state/install.log" "$state/install-rc"
}

fail=0
expect() { # expect <description> <want substring> <got>
    if [[ $3 == *"$2"* ]]; then
        echo "ok    $1"
    else
        printf 'FAIL  %s: want %s, got:\n%s\n' "$1" "'$2'" "$3"
        fail=1
    fi
}
expect_rc() { # expect_rc <description> <want> <got>
    [[ $2 == "$3" ]] && echo "ok    $1" || { echo "FAIL  $1: exit $3, want $2"; fail=1; }
}
setup() { "$bin/argo-setup" "$@" 2>&1; }
health() { "$bin/argo-health" 2>&1; }

good
out=$(setup); rc=$?
expect_rc "check passes when all is set" 0 "$rc"
expect "no change lines" "ok      agent-doctor --profile agent-box passes" "$out"
[[ $out != *change* && $out != *manual* ]] && echo "ok    nothing flagged" || { echo "FAIL  flagged: $out"; fail=1; }
out=$(health); rc=$?
expect_rc "health passes when all is set" 0 "$rc"
expect "health shows uptime" "ok    up 1d 1h" "$out"
expect "health shows T3 version" "T3 service running (1.2.3-nightly)" "$out"
expect "health shows disk" "95 GB free" "$out"

good
rm "$HOME/.config/dotfiles/host"
sed -i '' 's/sleep                0/sleep                1/; s/autorestart          1/autorestart          0/' "$state/pmset"
printf 'disabled services = {\n\t"com.openssh.sshd" => disabled\n}\n' > "$state/disabled"
echo 1 > "$state/swu"
echo 'FileVault is Off.' > "$state/fv"
echo false > "$state/authrestart"
printf 'gui/501/com.t3tools.t3code.service = {\n\tstate = not running\n}\n' > "$state/t3"
rm "$HOME/Library/LaunchAgents/com.burkettb.dotsync.plist"
printf 'FAIL  permission hardening is missing\n' > "$state/doctor"
out=$(setup --check); rc=$?
expect_rc "check fails when settings are off" 1 "$rc"
expect "flags host file" "change  host file says 'nothing'" "$out"
expect "flags sleep" "change  pmset sleep is 1, want 0" "$out"
expect "flags autorestart" "change  pmset autorestart is 0, want 1" "$out"
expect "flags remote login" "change  Remote Login off" "$out"
expect "flags auto installs" "change  automatic macOS update installs on (1)" "$out"
expect "flags FileVault" "manual  FileVault is not on" "$out"
expect "flags authrestart" "manual  fdesetup authrestart not supported" "$out"
expect "flags T3" "change  T3 service installed · t3@9.9.9, not running" "$out"
expect "flags dotsync agent without a plist" "change  dotsync agent not installed or not loaded" "$out"
expect "shows agent-doctor failures" "        FAIL  permission hardening is missing" "$out"
[[ ! -e $state/sudo.log && ! -e $state/install.log ]] && echo "ok    check runs no sudo and no install" || { echo "FAIL  check changed something"; fail=1; }

echo argo > "$HOME/.config/dotfiles/host"
echo 'not linked: ~/.zshrc' > "$state/links"
expect "host file alone isn't enough" "change  host file says argo, but not linked: ~/.zshrc" "$(setup)"
expect "health fails on missing links" "FAIL  dotfiles: not linked: ~/.zshrc" "$(health)"
: > "$state/links"

: > "$state/swu"
expect "unset auto install counts as on" "installs on (not set" "$(setup)"

stub dotsync 'echo no agent here'
expect "dotsync without --install-agent is skipped" "ok      dotsync has no --install-agent yet, skipped" "$(setup)"

out=$(health); rc=$?
expect_rc "health fails when T3 is down" 1 "$rc"
expect "health flags T3" "FAIL  T3 service not running" "$out"
expect "health flags pmset" "FAIL  pmset sleep 1 (want 0), autorestart 0 (want 1)" "$out"
echo root > "$state/console"
echo 1000 > "$state/free_kb"
echo '1 uncommitted: .zshrc' > "$state/dotfiles"
out=$(health)
expect "health flags the login window" "FAIL  no one logged in to the GUI (console: root)" "$out"
expect "health flags low disk" "FAIL  disk: 0 GB free" "$out"
expect "health reports dotfiles as info" "info  dotfiles: 1 uncommitted: .zshrc" "$out"

# --apply with sudo stubbed to a log: only the system settings go through sudo,
# each printed before it runs
good
sed -i '' 's/sleep                0/sleep                1/' "$state/pmset"
printf 'disabled services = {\n\t"com.openssh.sshd" => disabled\n}\n' > "$state/disabled"
echo 1 > "$state/swu"
out=$(setup --apply)
expect "apply prints the pmset sudo" "+ sudo pmset -c sleep 0" "$out"
expect "apply prints the ssh sudo" "+ sudo systemsetup -setremotelogin on" "$out"
expect "apply prints the update sudo" "+ sudo defaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false" "$out"
expect "apply rechecks" "after --apply:" "$out"
want=$'pmset -c sleep 0\nsystemsetup -setremotelogin on\ndefaults write /Library/Preferences/com.apple.SoftwareUpdate AutomaticallyInstallMacOSUpdates -bool false'
expect_rc "sudo ran exactly those three" "$want" "$(cat "$state/sudo.log")"

good
rm "$HOME/.config/dotfiles/host"
echo 1 > "$state/install-rc"
echo 'not linked: ~/.zshrc' > "$state/links"
out=$(setup --apply); rc=$?
expect "apply runs install.sh --host argo" "+ $HOME/.dotfiles/install.sh --host argo" "$out"
expect "apply reports the failed install" "  failed (exit 1)" "$out"
expect_rc "a failed install fails --apply" 1 "$rc"

good
out=$(setup --apply); rc=$?
expect_rc "apply on a good box changes nothing" 0 "$rc"
[[ ! -e $state/sudo.log && $out != *"+ "* ]] && echo "ok    apply is a no-op when all is set" || { echo "FAIL  apply did something: $out"; fail=1; }

expect_rc "bad flag" 2 "$(setup --nope >/dev/null; echo $?)"
exit $fail

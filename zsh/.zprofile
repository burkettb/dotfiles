# Set PATH, MANPATH, etc., for Homebrew.
eval "$(/opt/homebrew/bin/brew shellenv)"
eval $(/opt/homebrew/bin/brew shellenv)

# Setting PATH for NPM global packages
export PATH=$PATH:/Users/brandon/.npm-global/bin

# Setting PATH for Python 3.7
# The original version is saved in .bash_profile.pysave
PATH="/Library/Frameworks/Python.framework/Versions/3.7/bin:${PATH}"
export PATH

# Setting PATH for Java 11
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.12.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:/$PATH"export JAVA_HOME=$(/usr/libexec/java_home)

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/brandon/anaconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/brandon/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/brandon/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/brandon/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# # <<< conda initialize <<<
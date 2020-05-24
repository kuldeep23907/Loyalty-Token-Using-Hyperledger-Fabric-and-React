#!/bin/bash

function printHelp() {
    echo "Usage: "
    echo "  prepare.sh <mode> [-u <user name>] [-S | -s <size>]"
    echo "    <mode> - One of 'all', 'light', 'webapp', 'fabric', 'setenv', 'check'"
    echo "      - 'all'       - Prepare all prerequisites and install fabric"
    echo "      - 'light'     - Prepare fabric prerequisites and install fabric"
    echo "      - 'webapp'    - Prepare webapp prerequisites"
    echo "      - 'fabric'    - Install only fabric"
    echo "      - 'envfile'   - Make fabric environment file for user"
    echo "      - 'check'     - Check version of prerequisites"
    echo "    -u <user name>  - Owner of the home directory to which the fabric-samples will be installed (defaults to current user)"
    echo "    -S              - Add 2GB swap partition with swapfile"
    echo "    -s <size>       - Add # size swap partition with swapfile"
    echo "  prepare.sh -h (print this message)"
}

function installFabricPrereqs() {
    set -x
    apt-get update
    # install golang
    wget https://dl.google.com/go/go1.11.linux-amd64.tar.gz
    tar -xvf go1.11.linux-amd64.tar.gz
    mv go /usr/local
    rm -rf go1.11.linux-amd64.tar.gz
    # install docker and docker-compose
    apt-get install -y docker.io docker-compose
    set +x
}



function checkPrereqs() {
    set -x
    node -v
    npm -v
    go version
    docker -v
    docker-compose -v
    set +x
}

function installFabric() {
    # install fabric binary and fabric-samples directory in user home
    curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.6
    mv fabric-samples/ $USER_HOME
}

function makeEnvironment() {
    export GOROOT=/usr/local/go
    export GOPATH=$USER_HOME/go
    export PATH=$USER_HOME/go/bin:/usr/local/go/bin:$USER_HOME/fabric-samples/bin:$PATH
    export PUBLIC_IP=$(curl ifconfig.me)

    touch $ENV_FILE
    echo "export GOROOT=$GOROOT" >>$ENV_FILE
    echo "export GOPATH=$GOPATH" >>$ENV_FILE
    echo "export PATH=$PATH" >>$ENV_FILE
    echo "" >>$ENV_FILE
    echo "export PUBLIC_IP=$PUBLIC_IP" >>$ENV_FILE
    echo "alias sudo=\"sudo env PATH=$PATH PUBLIC_IP=$PUBLIC_IP\"" >>$ENV_FILE
}

SWAP_SIZE="2GB"
USER_HOME=$HOME
ENV_FILE="environment"
# Parse commandline args
MODE=$1
shift

while getopts "h?s:Su:" opt; do
    case "$opt" in
    h | \?)
        printHelp
        exit 1
        ;;
    u)
        USER_HOME=/home/$OPTARG
        ;;
    S)
        allocateSwap
        ;;
    s)
        SWAP_SIZE=$OPTARG
        allocateSwap
        ;;
    esac
done

if [ $MODE == "all" ]; then
    installFabricPrereqs
    installFabric
    makeEnvironment
    checkPrereqs
elif [ $MODE == "light" ]; then
    installFabricPrereqs
    installFabric
    makeEnvironment
    checkPrereqs
elif [ $MODE == "webapp" ]; then
    installWebAppPrereqs
    checkPrereqs
elif [ $MODE == "fabric" ]; then
    installFabric
elif [ $MODE == "envfile" ]; then
    makeEnvironment
elif [ $MODE == "check" ]; then
    checkPrereqs
else
    printHelp
    exit 1
fi

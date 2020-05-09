#!/bin/bash

#########################################################
# Function declarations:
#########################################################

failure_notice () {
    echo -e "\e[31mFailure\e[0m: $1"
}

success_notice () {
    echo -e "\e[32mSuccess\e[0m: $1"
}

check_command() {
    # command success failure 
    if ! [ -x "$(command -v $1)" ]; then
        failure_notice "$3"
        exit 1
    else
        success_notice "$2"
    fi
}

check_exit_code() {
    # success_message failure_message
    if [ $? -eq 0 ]; then
        success_notice "$1"
    else
        failure_notice "$2 with code $?"
    fi
}

install_packages() {
    cd $1 && npm install && cd ..
}

#########################################################
# Prequisite Checks:
#########################################################

echo -e "\nChecking prerequisites...\n"
check_command "docker" "Docker is installed $(docker -v)" "Docker is not installed or is not in your \$PATH."
check_command "node" "Node is installed with version $(node -v)." "Node is not installed or is not in your \$PATH."
check_command "npm" "npm is installed with version $(npm -v)." "npm is not installed or is not in your \$PATH."
echo -e "\nPrerequiresites satisfied!\n"


#########################################################
# Package installation:
#########################################################

echo -e "\nInstalling packages for the frontend...\n"
if [ -d "./frontend/node_modules" ]; then rm -Rf ./frontend/node_modules; fi
install_packages "frontend"
check_exit_code "installed frontend packages." "installation of frontend packages exited"

echo -e "\nInstalling packages for the backend...\n"
if [ -d "./backend/node_modules" ]; then rm -Rf ./backend/node_modules; fi
install_packages "backend"
check_exit_code "installed backend packages." "installation of backend packages exited"

#########################################################
# Container Build:
#########################################################

echo -e "\nBuilding Docker containers...\n"
docker-compose build
check_exit_code "built Docker containers." "Docker container build process exited"

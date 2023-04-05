# PM-Backend

# Appointments Management System
This project is part of academic course - Project management in SCE College.
This project is an example for interacting with an external web API using CICD development methods.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Installation](#Installation)
* [Running The Application](#Running-The-Application)
* [Authors](#Authors)

## General info
This project creats a web page in mythology of circleCi\Cd 

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js -[Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. 


## Technologies
Project is created with:
* visual studio code
* node.js 18.15.0
	
## Installation
* Open a folder for this project and clone this repository by writing the following command in command-line:
```
git clone https://github.com/Nitzantomer1998/PM-Backend.git
```
After clone the project run this command in the project folder from the command-line:
```
npm install
```

## Running The Application

To run the application use this command in the project folder from the command-line:
```
npm start
```

After that, go to on the repository : https://github.com/Nitzantomer1998/PM-Frontend and follow the instruction

Your application should run on port 3000 with the development environment configuration, so in your browser just go to http://localhost:3000 (this should happen automatically after performing the last command)

That's it! Your application should be running. 

### Project Structure 

The tree below displays the main files and folders structure.
```textile                               
├── .Circleci    // folder for the CI process 
    ├── config.yml               
├── controllers  // the components that handle user interaction                      
├── model   // contains model class files that include the properties of the objects
    ├── user //User functionality
├── public
    ├── pages //User functionality
    ├── partials //For the partials that we want to include in the pages
├── views // contains HTML files for the application
├── src 
    ├── index // For the server
├── test 
├── .eslintrc.json  //configuration file 
├── .gitignore     //Contains the files we don't want to track in git
├── .nodemon.json  //contains the environmental variables 
├── .package-lock.json //For version management of our project
├── .package.json //Includes all dependencies and devDependepncies
├── README.md
```

## Authors

* Gad Nadjar
* Nitsan Tomer
* Zaccharie Attias
* Guy Shabtay
* Rudy Haddad

# A MEAN CI/CD-driven Application

## Summary

This project endeavors to implement the following:
 - a Docker-native local application development environment
 - a Kubernetes-native cloud application staging and production environment
 - a robust, multi-facetted testing harness leveraging MEAN-friendly frameworks
 - a modern, fully-fledged CI/CD pipeline, from local development to production deployment
 - a mature, declarative infrastructural configuration through infrastructure-as-code (IaC)
 - a MEAN-stack app demonstrating the value of syntactic parity between a stack embodying ECMA principles


## Project Status:
&emsp;&emsp;[![Build Status](https://cloud.drone.io/api/badges/jrcasso/mean-demo/status.svg?ref=refs/heads/develop)](https://cloud.drone.io/jrcasso/mean-demo)
&emsp;&emsp;![](https://img.shields.io/github/issues/jrcasso/mean-demo)
&emsp;&emsp;![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/jrcasso/mean-demo?include_prereleases)

---
## Application Stack: MongoDB, Express, Angular, and Nodejs (MEAN)

![](https://i.imgur.com/RYWrMBq.png)<br>
&emsp;&emsp;![MongoDB Version](https://img.shields.io/badge/MongoDB-v4.2.3-brightgreen)
&emsp;&emsp;&ensp;![ExpressJS Version](https://img.shields.io/badge/ExpressJS-v4.17.1-yellow)
&emsp;&emsp;&emsp;![Angular Version](https://img.shields.io/badge/Angular-v9.0.6-red)
&emsp;&emsp;&ensp;![NodeJS Version](https://img.shields.io/badge/NodsJS-v13.10.1-green)

---
## DevOps Technologies:

| DevOps Aspect | Component | Technology | Description |
| -------------| ------------- | ------------- | ------------------------------ |
|Local development|Local development|Docker|Container orchestration to mimick the staging environment configuration|
|Continuous Integration|Pipeline|Drone|Provides a self-service delivery platform to implement various parellelizable continuous integration and continuous deployment pipelines|
||Testing: unit|Karma|Provides a generic HTTP server for various browsers providing a testing platform for other frameworks|
||Testing: unit|Jasmine|Provides a dependency-free behavior-driven development framework for testing JavaScript code|
||Testing: e2e|Protractor|Provides Angular-assisted tests against the application running in a real browser, interacting with it as a user would.|
||Linting: TypeScript|tslint|Provides basic quality control and a standardization of style|
||IaC|Terraform|(WIP) Provides a mature, cloud-provider friendly interface to describe complex infrastructures in code|
|Continuous Deployment|Pipeline|Drone|Provides a self-service delivery platform to implement various parellelizable continuous integration and continuous deployment pipelines|
||Image Repo|DockerHub| Provides an image repository for building containers|
||Deploy Agent|Helm|(WIP) Provides an release-managed deployment process for k8s-native applications|
||Deploy Target|Kubernetes|(WIP) Provides deployment automation, scaling, and management of containerized applications|
||Testing: regress|Protractor|(WIP) Provides Angular-assisted tests against the application running in a real browser, interacting with it as a user would.|
|Continuous Monitoring|TBD|TBD|(WIP)

# Development Setup

Ensure you have the following prerequisites satisfied:
 - Install Docker for Desktop
 - Install npm

```sh
git clone git@github.com:jrcasso/mean-demo
cd mean-demo/
./setup.sh
 docker-compose run --service-ports <service> bash # or docker-compose up, shelling into container as needed
```

For angular, you would then execute:
```sh
./node_modules/.bin/ng serve --host 0.0.0.0
```

For express, you would then execute:
```sh
./node_modules/.bin/nodemon app.js
```

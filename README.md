<div style="display: flex; justify-content: space-between; align-content: center;align-items: center ">
  <img src="https://files.outworld.fr/wl/?id=Wd6lzdQQuHyo0FFnv0Mxk6OSUjDrF2Ix" alt="Logo" width="140">
  <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
</div>


## Description

Javascript api for klxoon.

## Live
You can interact with live api at https://arthur-klaxoon-api.outworld.fr/api-docs

## Requirements

* Local run
    * NodeJs >= 10.19.0
    * NPM >= 6.14.4
* Docker
    * Docker >= 2.10.1
    * Docker-compose 1.27.4

## Docker

### Configuration

First step is to open _docker-compose.yml_
Take a look at the _environments variables_. You can edit them as much as you want.

If you want to edit mongo variables, don't forget to apply them to api container.

### Run

use

```bash
$ docker-compose up -d
```

to create MongoDb and api containers.

### Usage

Api HTTP url is http://localhost:8080/
A fully described documentation is available at http://localhost:8080/api-docs

## Local

You can run this api locally. By using this method, you will be able to edit code and see modifications in live mode.

### Environment

First step is to create the _.env_ file. This api is using **dotenv** file to supply configuration variables. You can
take a look at _.env.example_ to see all variables.

```dotenv
# DEFAULT
PORT=8080
URL=http://localhost:8080
# MONGO
MONGO_DATABASE=even
#MONGO_ADDRESS=MONGO_IP
#MONGO_USER=MONGO_USER
#MONGO_PASSWORD=MONGO_PASSWORD
```

### Dependencies

To install all dependencies, run

```bash
$ npm i
```

### Build & Run

You have 2 ways to run the api.

**Single run**
Api will be build and start.

```bash
$ npm run start
```

**Run with file watcher**

Api will be build & run. If any source file is modified, api will be re-build and re-run

```bash
$ npm run start:dev
```

## Development

### Linter

This api use eslint linter. Use

```bash
$ npm run lint
```

to run it.

### tests
This api is covered by jest tests.
**UT**
```bash
$ npm run test
```
**e2e**
```bash
$ npm run test:e2e
```
If you want to run e2e tests, please take a look at __.env.test__. You should define a running db.
Tests will create a custom db and remove it after tests.

**coverage**
```bash
$ npm run test:cov
```
### Data structure
<img alt="test" src="https://files.outworld.fr/wl/?id=WpMe5Zd4iN2lrBh58RLbMs2XgIid45TN"/>

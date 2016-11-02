# OpenInfRA WebApp

The OpenInfRA WebApp is an AngularJS based browser application using the JSON REST API of the OpenInfRA core.

## Prerequisites

The app is build with `gulp`. You'll need to install it first.

All other dependencies are defined within `package.json` and can be easily installed with the help of npm.

```sh
$ npm install
```

## configuration

gulp uses `OpenInfRA.json` to configure the different build tasks. Copy `OpenInfRA.json.sample` and edit the file as needed.

## build

With `OpenInfRA.json` properly configured you can run gulp to create your own version of the app.

```sh
$ gulp
```

The app consists of a `index.html` file and hidden `.app` directory with all necessary assets. It can be found in the `dist/` directory.

## deploy

If you have configured the OpenInfRA.json `dest` key with a local directory, you can also automatically deploy the app.

```sh
$ gulp deploy
```

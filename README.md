# Koala

The work was conducted in the scope of [AngularAttack](https://www.angularattack.com) 2016.

## Team

- [Simon Harrer](https://github.com/simonharrer)
- [Linus Dietz](https://github.com/lynyus)
- [Oliver Kopp](https://github.com/koppor)
- [Peter Dingler](https://github.com/synergycigar)

## Background

This thing bases on [angular-cli](https://cli.angular.io/).
Overview available there: https://github.com/angular/angular-cli

### Other templates, mostly not convenient enough

 * [Angular 2 JumpStart with TypeScript](https://github.com/DanWahlin/Angular2-JumpStart).
 * https://github.com/mgechev/angular2-seed
 * https://www.npmjs.com/package/generator-modern-web-dev
 * https://cli.angular.io/

## Setup

Clone this repo locally, and make sure all your team members have access to it.

* Install the latest stable [Node / NPM](https://nodejs.org).

* `npm install -g angular-cli`

* `git clone git@github.com:rumblex/angularattack2016-json-snow.git`

* `cd angularattack2016-json-snow`

* `npm install`

## Developing

* `ng serve` - Windows: execute this as Administrator. Reason and discussion: https://github.com/angular/angular-cli/issues/641#issuecomment-217430171.
Workaround: http://ember-cli.com/user-guide/#symlinks-on-windows

* `ng lint`

* `ng format`

* [Adding a new library](https://github.com/angular/angular-cli/wiki/3rd-party-libs)

## Implementation notes

### Google maps integration
 * http://stackoverflow.com/q/24246403/873282
 * Google Maps is loaded directly instead of using the thin wrapper [google-maps](https://www.npmjs.com/package/google-maps).

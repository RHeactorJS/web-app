# web-app

[![Greenkeeper badge](https://badges.greenkeeper.io/RHeactorJS/web-app.svg)](https://greenkeeper.io/)

[![npm version](https://img.shields.io/npm/v/@rheactorjs/web-app.svg)](https://www.npmjs.com/package/@rheactorjs/web-app)
[![Build Status](https://travis-ci.org/RHeactorJS/web-app.svg?branch=master)](https://travis-ci.org/RHeactorJS/web-app)
[![monitored by greenkeeper.io](https://img.shields.io/badge/greenkeeper.io-monitored-brightgreen.svg)](http://greenkeeper.io/) 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Test Coverage](https://codeclimate.com/github/RHeactorJS/web-app/badges/coverage.svg)](https://codeclimate.com/github/RHeactorJS/web-app/coverage)
[![Code Climate](https://codeclimate.com/github/RHeactorJS/web-app/badges/gpa.svg)](https://codeclimate.com/github/RHeactorJS/web-app)

This library contains the typical building blocks for a Angular 1 web application in the Resourceful Humans Bootstrap 4 design.

HTML views for

 - Registration
 - Activation
 - Lost Password
 - Login
 - Profile settings (Name, Email)
 - Avatar
 - Admin area for managing users
 - and other parts like
  - webfonts
  - Google Analytics
  - Favicon
  - Update warning
  - error tracking
 - *[see all views](https://github.com/RHeactorJS/web-app/tree/master/includes)*
 
[Styles](https://github.com/RHeactorJS/web-app/tree/master/scss) adapting Bootstrap 4 to RH design principles.

Controllers for

 - above views
 - [managing errors](https://github.com/RHeactorJS/web-app/blob/master/js/controller/bluebird.js)
 - *[see all controllers](https://github.com/RHeactorJS/web-app/tree/master/js/controller)* 

Directives for

 - [managing Bootstrap error states on input elements](https://github.com/RHeactorJS/web-app/blob/master/js/directives/bootstrap-error-states.js)
 - *[see all directives](https://github.com/RHeactorJS/web-app/blob/master/js/directives/)*
 
Services

 - a [Generic Service](https://github.com/RHeactorJS/web-app/blob/master/js/services/generic.js) for accessing the RESTful, [JSON-LD](http://json-ld.org/) inspired API of [RHeactorJS applications](https://github.com/RHeactorJS).
 - *[see all services](https://github.com/RHeactorJS/web-app/blob/master/js/services/)*
 
Utilities
 
 - that [handle live-updates](https://github.com/RHeactorJS/web-app/blob/master/js/util/live-collection.js) via [EventSource connections](https://github.com/RHeactorJS/web-app/blob/master/js/util/event-source-connection.js)
 - that can [wait for](https://github.com/RHeactorJS/web-app/blob/master/js/util/wait-for.js) dependencies to *appear* on the parent scope
 - *[see all utilities](https://github.com/RHeactorJS/web-app/tree/master/js/util)*

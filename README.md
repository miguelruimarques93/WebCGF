WebCGRA
=======

To execute launch an http server in the root of the repository.

## Using Node's http-server:

Install node following the instructions in http://www.nodejs.org/.

To install http-server execute `npm install -g http-server`.

To run the server simply execute `http-server` in the command line in the root of the repository.

## Using Node's lr-http-server:

Install node following the instructions in http://www.nodejs.org/.

To install lr-http-server execute `npm install -g lr-http-server`.

To run the server simply execute `lr-http-server` in the command line in the root of the repository.

## Using python:

Install python following the instructions in http://www.python.org/.

For python 2 execute: `python -m SimpleHTTPServer` in the root of the repository.

For python 3 execute: `python -m http.server` in the root of the repository.

## Using grunt in development

Install node following the instructions in http://www.nodejs.org/.

Install grunt-cli executing `npm install grunt-cli`.

Execute `npm install` to install project dependencies.

To build CGF library execute `grunt build`.

To generate docs execute `grunt docs`.

The default task (executing `grunt`) does the two tasks above.

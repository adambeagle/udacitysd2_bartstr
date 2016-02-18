# bartstr
##### *Udacity Senior Web Developer Project 2*

Author: [Adam Beagle](https://github.com/adambeagle)

### Overview

This project will be a mobile-installable web app which reports departure/arrival/alert information for San Francisco's BART system. It is being built for Udacity's Senior Web Developer nanodegree. The emphasis of the project is on offline usability. [Knockout](http://knockoutjs.com/) is used for front-end data binding.

### Requirements

1. NPM (nodeJS)
2. Bower
3. An [api.bart.gov API key](http://www.bart.gov/schedules/developers/api). Note the linked page provides a key that may be used without registration. Please respect the bart.gov developers by only using this key for light usage.

All other requirements (Knockout, Gulp, etc.) are fetched by NPM and Bower.

### Installation/Build

To build and run the application:

1. Clone this repository (`git clone https://github.com/adambeagle/udacitysd2_bartstr`)

1. Navigate to the root directory of the repository and run `npm install`, then `bower install`. This may take a few minutes.

1. Place your Bart API key in `app/config.js`:

        var CONFIG = {
          // ...
          keys: {
            bart: "XXXX-XXXX-XXXX-XXXX"
          }
        }

1. From here there are two options:

    * To run in **production mode** (minified js/css, etc.), build with `gulp dist`, then start the server with `npm start`. 
    
    * To run in **dev mode**, run `gulp`, which should automatically open a browser (via browser-sync), or at minimum will output an HTTP address at which to find the application. Running in dev mode will continue to watch application files for changes until gulp is stopped (with e.g. CTRL-C).

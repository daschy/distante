# Linux/Mac OSX

## Install

1. `npm i`

1. `touch .env`

1. add env vars
  ```
  export COMMAND="python"
  export ARGUMENTS="SickBeard.py"

  export MONGO_URL="[mongo url]"

  ```

### Install on Raspbian (armv7)

1. Install node >= 6.x
https://raspberrypi.stackexchange.com/questions/4194/getting-npm-installed-on-raspberry-pi-wheezy-image/37976#37976


## Run

1. `source .env && node agenda.js`


## Run as daemon

1. `sudo npm i -g pm2` (http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

1. `pm2 start agenda.js`





# demo-issuer-integration

This package provides a demonstration verifiable credential issuer.

## Installation
```bash
npm install
```

## Run Back-end the Server

This serves the production build of the front-end.

```bash
npm start

# server at https://localhost:18443
```

## Front-end Development

### Symlink private assets
```bash
cd vue-components
# the public folder is not tracked by git in this repo
rm -rf public
ln -s ../../path/to/private/assets/public
```

### Start the back-end server as described above.

```bash
cd vue-components
npm install
# the webpack bundle will be rebuild automatically on changes
npm run serve

# the webpack-dev-server is at https://localhost:19443
```
## Build the Front-end Bundle
```bash
npm build
# run the server
cd ..
npm start
```


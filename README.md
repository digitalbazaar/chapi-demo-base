![Issuer Authentication](https://github.com/digitalbazaar/demo-issuer-integration/raw/add-public-files/images/auth-1.png)

# demo-issuer-integration

This package provides a demonstration verifiable credential issuer.

## Prerequisites
This demo expects node 10 or greater.

## Install
Install should be as easy as:
```
npm install
```

A postinstall script should run `npm install` in vue-components.
If this happens to fail you will need to cd into vue-components,
fix any errors, and do an install yourself.

## Setup

The demo issuer needs several different other sites running
in order to issue a credential.

First you need a credential handler polyfill.

You can get one by visiting [authn.io](https://authn.io/).

You will also need to a wallet. This can be your wallet or a veres-wallet.

You will need to create a config.js file in the root dir of this repo.

This file sets the host and port for the backend server.

That file should look like this:

```js
module.exports = {
  host: 'localhost',
  port: 18443
};
```

## Running the demo

If all the install steps have succeeded and you have visited
[authn.io](https://authn.io/) and your wallet is setup and in the browser
then you should be able to run:

```
npm run start-production
```

This will start the backend server and the front end server
in production mode. In production mode they will use `authn.io`
for the Authentication and your wallet.

The front end server will run on [https://localhost:19443](https://localhost:19443)

### Steps

[Login steps.](https://github.com/digitalbazaar/demo-issuer-integration/blob/add-public-files/LOGIN.md)
[Store Credential steps.](https://github.com/digitalbazaar/demo-issuer-integration/blob/add-public-files/STORE.md)

---

## Development Instructions
The remaining instructions require libraries private to Digital Bazaar.


### Run Back-end the Server

This serves the production build of the front-end.

```bash
npm start

# server at https://localhost:18443
```

### Front-end Development

#### Ignore changes to the public folder
```bash
# prevent assets in the public folder from showing as changed
git update-index --assume-unchanged vue-components/public/
```

#### Symlink private assets
```bash
cd vue-components
# the public folder is not tracked by git in this repo
rm -rf public
ln -s ../../path/to/private/assets/public
```

#### Start the back-end server as described above.

```bash
cd vue-components
npm install
# the webpack bundle will be rebuild automatically on changes
npm run serve

# the webpack-dev-server is at https://localhost:19443
```
### Build the Front-end Bundle
```bash
# in vue-components folder
npm run build
# run the server
cd ..
npm start
```

### Packaging
```bash
rm -rf vue-components/public
# modify the lines below to link to your project packaging directory
ln -sf .../demo-issuer-integration-private/PROJECT/packaging .
cp -a .../demo-issuer-integration-private/PROJECT/public vue-components/
cp packaging/config.sh.example packaging/config.
# Add the cloud service provider API access tokens
vi config.sh
# these lines can be run unmodified
npm i --package-lock=true && rm -rf node_modules
cd vue-components && npm i --package-lock=true && rm -rf node_modules
../veres-product-packager/build-vm -s true -c packaging/config.sh
# To boot production server, read instructions in packaging/README.md
```

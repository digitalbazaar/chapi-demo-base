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

### Ignore changes to the public folder
```bash
# prevent assets in the public folder from showing as changed
git update-index --assume-unchanged vue-components/public/
```

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
# in vue-components folder
npm run build
# run the server
cd ..
npm start
```

## Packaging
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

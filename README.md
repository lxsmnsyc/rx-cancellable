# rx-disposable
Reactive Extensions - represents a state of disposition

# rx-disposable

Reactive Extensions - represents a deferred computation with an indication for a disposable value or exception.

[![NPM](https://nodei.co/npm/rx-disposable.png)](https://nodei.co/npm/rx-disposable/)

[![](https://data.jsdelivr.com/v1/package/npm/rx-disposable/badge)](https://www.jsdelivr.com/package/npm/rx-disposable)
[![HitCount](http://hits.dwyl.io/lxsmnsyc/rx-disposable.svg)](http://hits.dwyl.io/lxsmnsyc/rx-disposable)

| Platform | Build Status |
| --- | --- |
| Linux | [![Build Status](https://travis-ci.org/LXSMNSYC/rx-disposable.svg?branch=master)](https://travis-ci.org/LXSMNSYC/rx-disposable) |
| Windows | [![Build status](https://ci.appveyor.com/api/projects/status/mkjwe462uk80axx4?svg=true)](https://ci.appveyor.com/project/LXSMNSYC/rx-disposable) |


[![codecov](https://codecov.io/gh/LXSMNSYC/rx-disposable/branch/master/graph/badge.svg)](https://codecov.io/gh/LXSMNSYC/rx-disposable)
[![Known Vulnerabilities](https://snyk.io/test/github/LXSMNSYC/rx-disposable/badge.svg?targetFile=package.json)](https://snyk.io/test/github/LXSMNSYC/rx-disposable?targetFile=package.json)

## Install

NPM

```bash
npm i rx-disposable
```

CDN

* jsDelivr
```html
<script src="https://cdn.jsdelivr.net/npm/rx-disposable/dist/index.min.js"></script>
```

* unpkg
```html
<script src="https://unpkg.com/rx-disposable/dist/index.min.js"></script>
```

## Usage

### Loading the module

#### CommonJS

```js
const Disposable = require('rx-disposable');
```

Loading the CommonJS module provides the Disposable class.

#### Browser

Loading the JavaScript file for the rx-disposable provides the Disposable class

## Documentation

You can read the documentation at the [official doc site](https://lxsmnsyc.github.io/rx-disposable/)

## Build

Clone the repo first, then run the following to install the dependencies

```bash
npm install
```

To build the coverages, run the test suite, the docs, and the distributable modules:

```bash
npm run build
```
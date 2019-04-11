# rx-cancellable

Reactive Extensions - represents a state of cancellation

[![NPM](https://nodei.co/npm/rx-cancellable.png)](https://nodei.co/npm/rx-cancellable/)

[![](https://data.jsdelivr.com/v1/package/npm/rx-cancellable/badge)](https://www.jsdelivr.com/package/npm/rx-cancellable)
[![HitCount](http://hits.dwyl.io/lxsmnsyc/rx-cancellable.svg)](http://hits.dwyl.io/lxsmnsyc/rx-cancellable)

| Platform | Build Status |
| --- | --- |
| Linux | [![Build Status](https://travis-ci.org/LXSMNSYC/rx-cancellable.svg?branch=master)](https://travis-ci.org/LXSMNSYC/rx-cancellable) |
| Windows | [![Build status](https://ci.appveyor.com/api/projects/status/mkjwe462uk80axx4?svg=true)](https://ci.appveyor.com/project/LXSMNSYC/rx-cancellable) |


[![codecov](https://codecov.io/gh/LXSMNSYC/rx-cancellable/branch/master/graph/badge.svg)](https://codecov.io/gh/LXSMNSYC/rx-cancellable)
[![Known Vulnerabilities](https://snyk.io/test/github/LXSMNSYC/rx-cancellable/badge.svg?targetFile=package.json)](https://snyk.io/test/github/LXSMNSYC/rx-cancellable?targetFile=package.json)

## Install

NPM

```bash
npm i rx-cancellable
```

CDN

* jsDelivr
```html
<script src="https://cdn.jsdelivr.net/npm/rx-cancellable/dist/index.min.js"></script>
```

* unpkg
```html
<script src="https://unpkg.com/rx-cancellable/dist/index.min.js"></script>
```

## Usage

### Loading the module

#### CommonJS

```js
const Disposable = require('rx-cancellable');
```

Loading the CommonJS module provides the Disposable class.

#### Browser

Loading the JavaScript file for the rx-cancellable provides the Disposable class

## Documentation

You can read the documentation at the [official doc site](https://lxsmnsyc.github.io/rx-cancellable/)

## Build

Clone the repo first, then run the following to install the dependencies

```bash
npm install
```

To build the coverages, run the test suite, the docs, and the distributable modules:

```bash
npm run build
```
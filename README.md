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
const {
  Cancellable,
  CANCELLED,
  UNCANCELLED,
  BooleanCancellable,
  CompositeCancellable,
  LinkedCancellable
} = require('rx-cancellable');
```

#### Browser

Loading the JavaScript file for the rx-cancellable the classes:
  - Cancellable
  - CANCELLED,
  - UNCANCELLED,
  - BooleanCancellable,
  - CompositeCancellable,
  - LinkedCancellable

## Types

There are 3 types of Cancellables provided:

| Type | Description |
| --- | --- |
| BooleanCancellable | Basic implementation of a Cancellable that represents a boolean state. |
| CompositeCancellable | An implementation of a Cancellable that allows composition of multiple Cancellable instances into a single Cancellable instance. |
| LinkedCancellable | A Cancellable whose state relies upon another Cancellable. If a LinkedCancellable has no link, it is treated as a BooleanCancellable. |

And provides 2 Singleton instance:

| Type | Description |
| --- | --- |
| CANCELLED | A Cancellable instance that is always cancelled. |
| UNCANCELLED | A Cancellable instance that is always uncancelled. |

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

## Changelogs
0.3.0
- Removed privacy of cancellable states. The decision of replacement is due to performance issues with WeakMaps.
0.2.0
- Introduces 3 Cancellable classes instead of a tree-structured Cancellable.
- Introduces 2 singleton instances of Cancellable
0.1.0
- Release
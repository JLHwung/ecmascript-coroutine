# ecmascript-coroutine
[![Build Status](https://travis-ci.org/JLHwung/ecmascript-coroutine.svg?branch=master)](https://travis-ci.org/JLHwung/ecmascript-coroutine)

An ecmascript-coroutine implementation for practice.

## Requirements
node.js >= 6

## Usage
```javascript
const co = require("ecmascript-coroutine")
co(function* (){
    const response = yield fetch("https://example.com")
    const result = yield writeToDatabase(response)
})()
```

## Feature
- Stupid: only support yielding standard promise
- Simple: only support node.js >= 6
- Sensitive: throw error if it is not a generator
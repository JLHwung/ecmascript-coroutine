/**
 * Test whether value is a standard promise
 * @param value
 * @return {boolean}
 */
const isPromise = value => {
  return value instanceof Promise;
};

/**
 * Test whether obj is a valid generator
 * @param obj
 * @return {boolean}
 */
const isGenerator = obj => {
  return (
    typeof obj === "object" &&
    typeof obj.next === "function" &&
    typeof obj.throw === "function"
  );
};

/**
 * Apple coroutine transformation on a generator function
 * @param gen {GeneratorFunction}
 * @return {Promise}
 */
const coroutine = function(gen) {
  return new Promise((resolve, reject) => {
    if (!isGenerator(gen)) {
      return reject(
        new TypeError("The type of coroutine input should be a generator")
      );
    }

    const onFulfilled = res => {
      let ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        reject(e);
      }
      next(ret);
      return null;
    };

    const onRejected = res => {
      let ret;
      try {
        ret = gen.throw(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    };

    const next = ({ done, value }) => {
      if (done) {
        return resolve(value);
      }
      if (isPromise(value)) {
        return value.then(onFulfilled, onRejected);
      }
      return onRejected(
        new TypeError(
          `The yielded expression ${value} can not evaluate to standard promise`
        )
      );
    };

    onFulfilled();
  });
};

/**
 * wrap coroutine into a promise factory
 * @param gen
 * @return {Function}
 */
const co = function(gen) {
  const context = this;
  return function(...args) {
    return coroutine.call(context, gen.apply(this, args));
  };
};

module.exports = co;

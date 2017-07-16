const toPromise = value => {
  if (isPromise(value)) {
    return value;
  }
  return null;
};

const isPromise = value => {
  return value instanceof Promise;
};

const isGenerator = obj => {
  return (
    typeof obj === "object" &&
    typeof obj.next === "function" &&
    typeof obj.throw === "function"
  );
};

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

    const next = ret => {
      if (ret.done) {
        return resolve(ret.value);
      }
      const value = toPromise(ret.value);
      if (value !== null && isPromise(value)) {
        return value.then(onFulfilled, onRejected);
      }
      return onRejected(
        new TypeError(
          `The yielded expression ${ret.value} can not evaluate to standard promise`
        )
      );
    };

    onFulfilled();
  });
};

const co = function(gen) {
  const context = this;
  return function(...args) {
    return coroutine.call(context, gen.apply(this, args));
  };
};

module.exports = co;

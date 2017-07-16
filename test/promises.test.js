const co = require("..");

function getPromise(val, err) {
  return new Promise(function(resolve, reject) {
    if (err) reject(err);
    else resolve(val);
  });
}

describe("co(* -> yield <promise>)", () => {
  describe("with one promise yield", () => {
    it("should work", () => {
      return co(function*() {
        const a = yield getPromise(1);
        expect(a).toBe(1);
      })();
    });
  });

  describe("with several promise yields", () => {
    it("should work", () => {
      return co(function*() {
        const a = yield getPromise(1);
        const b = yield getPromise(2);
        const c = yield getPromise(3);
        expect([a, b, c]).toEqual([1, 2, 3]);
      })();
    });
  });

  describe("when a promise is rejected", () => {
    it("should throw and resume", () => {
      let error;

      return co(function*() {
        try {
          yield getPromise(1, new Error("boom"));
        } catch (err) {
          error = err;
        }

        expect(error.message).toBe("boom");
        const ret = yield getPromise(1);
        expect(ret).toBe(1);
      })();
    });
  });
});

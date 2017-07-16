const co = require("..");

function getPromise(val, err) {
    return new Promise(function(resolve, reject) {
        if (err) reject(err);
        else resolve(val);
    });
}

function* getGenerator(val) {
    const x = yield getPromise(val);
    return val + 1;
}

describe("co(* -> yield* <generator>)", () => {
    describe("with one generator yield*", () => {
        it("should work", () => {
            return co(function*() {
                const a = yield* getGenerator(0);
                expect(a).toBe(1);
            })();
        });
    });

    describe("with multiple generator yield*", ()=>{
        it("should work", ()=>{
            return co(function*(){
                const a = yield* getGenerator(0);
                const b = yield* getGenerator(a);
                const c = yield* getGenerator(b);
                expect(c).toBe(3);
            })()
        })
    })
});

const co = require("..");

describe("co(invalid -> throw)", () => {
    describe("with invalid type parameters", () => {
        it("should throw", () =>{
            return co(() => {})().catch(err => {
                expect(err.message).toBe("The type of coroutine input should be a generator")
            })
        })
    })
    describe("with error throw inside generator", () => {
        it("should throw", () => {
            return co(function* (err) {
                if (err !== undefined) {
                    throw err;
                }
                yield Promise.resolve(1);
                return null;
            })(new Error("boom")).catch(err => {
                expect(err.message).toBe("boom")
            })
        })
    })
})

describe("co(* -> yield invalid)", () => {
    describe("with non-standard promise", () => {
        it("should throw",()=>{
            return co(function* () {
                yield { then: () => {} }
                return null
            })().catch(err => {
                expect(err.message).toBe("The yielded expression [object Object] can not evaluate to standard promise")
            })
        })
    })
    describe("with non-promise", () => {
        it("should throw",()=>{
            return co(function* () {
                yield 43
                return null
            })().catch(err => {
                expect(err.message).toBe("The yielded expression 43 can not evaluate to standard promise")
            })
        })
    })
})
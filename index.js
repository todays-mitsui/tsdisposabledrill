// from: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
function loggy(id) {
    var _a;
    console.log("Creating ".concat(id));
    return _a = {},
        _a[Symbol.dispose] = function () {
            console.log("Disposing ".concat(id));
        },
        _a;
}
function func() {
    var env_1 = { stack: [], error: void 0, hasError: false };
    try {
        var a = __addDisposableResource(env_1, loggy("a"), false);
        var b = __addDisposableResource(env_1, loggy("b"), false);
        {
            var env_2 = { stack: [], error: void 0, hasError: false };
            try {
                var c = __addDisposableResource(env_2, loggy("c"), false);
                var d = __addDisposableResource(env_2, loggy("d"), false);
            }
            catch (e_1) {
                env_2.error = e_1;
                env_2.hasError = true;
            }
            finally {
                __disposeResources(env_2);
            }
        }
        var e = __addDisposableResource(env_1, loggy("e"), false);
        return;
        // Unreachable.
        // Never created, never disposed.
        var f = __addDisposableResource(env_1, loggy("f"), false);
    }
    catch (e_2) {
        env_1.error = e_2;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
}
func();

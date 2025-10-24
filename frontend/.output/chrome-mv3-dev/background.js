var background = (function() {
  "use strict";
  function defineBackground(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  const browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
  const browser = browser$1;
  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }
  const { toString } = Object.prototype;
  const { getPrototypeOf } = Object;
  const { iterator, toStringTag } = Symbol;
  const kindOf = /* @__PURE__ */ ((cache) => (thing) => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(/* @__PURE__ */ Object.create(null));
  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type;
  };
  const typeOfTest = (type) => (thing) => typeof thing === type;
  const { isArray } = Array;
  const isUndefined = typeOfTest("undefined");
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }
  const isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    let result2;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result2 = ArrayBuffer.isView(val);
    } else {
      result2 = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result2;
  }
  const isString = typeOfTest("string");
  const isFunction$1 = typeOfTest("function");
  const isNumber = typeOfTest("number");
  const isObject = (thing) => thing !== null && typeof thing === "object";
  const isBoolean = (thing) => thing === true || thing === false;
  const isPlainObject = (val) => {
    if (kindOf(val) !== "object") {
      return false;
    }
    const prototype2 = getPrototypeOf(val);
    return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
  };
  const isEmptyObject = (val) => {
    if (!isObject(val) || isBuffer(val)) {
      return false;
    }
    try {
      return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
    } catch (e) {
      return false;
    }
  };
  const isDate = kindOfTest("Date");
  const isFile = kindOfTest("File");
  const isBlob = kindOfTest("Blob");
  const isFileList = kindOfTest("FileList");
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
  const isFormData = (thing) => {
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
  };
  const isURLSearchParams = kindOfTest("URLSearchParams");
  const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
  const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function forEach(obj, fn, { allOwnKeys = false } = {}) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    let i;
    let l;
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      if (isBuffer(obj)) {
        return;
      }
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;
      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }
  function findKey(obj, key) {
    if (isBuffer(obj)) {
      return null;
    }
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }
  const _global = (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
  })();
  const isContextDefined = (context) => !isUndefined(context) && context !== _global;
  function merge() {
    const { caseless, skipUndefined } = isContextDefined(this) && this || {};
    const result2 = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result2, key) || key;
      if (isPlainObject(result2[targetKey]) && isPlainObject(val)) {
        result2[targetKey] = merge(result2[targetKey], val);
      } else if (isPlainObject(val)) {
        result2[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result2[targetKey] = val.slice();
      } else if (!skipUndefined || !isUndefined(val)) {
        result2[targetKey] = val;
      }
    };
    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result2;
  }
  const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, { allOwnKeys });
    return a;
  };
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  };
  const inherits = (constructor, superConstructor, props, descriptors2) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    if (sourceObj == null) return destObj;
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  };
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };
  const isTypedArray = /* @__PURE__ */ ((TypedArray) => {
    return (thing) => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[iterator];
    const _iterator = generator.call(obj);
    let result2;
    while ((result2 = _iterator.next()) && !result2.done) {
      const pair = result2.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];
    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }
    return arr;
  };
  const isHTMLForm = kindOfTest("HTMLFormElement");
  const toCamelCase = (str) => {
    return str.toLowerCase().replace(
      /[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };
  const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
  const isRegExp = kindOfTest("RegExp");
  const reduceDescriptors = (obj, reducer) => {
    const descriptors2 = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors2, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });
    Object.defineProperties(obj, reducedDescriptors);
  };
  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      if (isFunction$1(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
        return false;
      }
      const value = obj[name];
      if (!isFunction$1(value)) return;
      descriptor.enumerable = false;
      if ("writable" in descriptor) {
        descriptor.writable = false;
        return;
      }
      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error("Can not rewrite read-only method '" + name + "'");
        };
      }
    });
  };
  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};
    const define = (arr) => {
      arr.forEach((value) => {
        obj[value] = true;
      });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
  };
  const noop = () => {
  };
  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
  }
  const toJSONObject = (obj) => {
    const stack = new Array(10);
    const visit = (source, i) => {
      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }
        if (isBuffer(source)) {
          return source;
        }
        if (!("toJSON" in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};
          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });
          stack[i] = void 0;
          return target;
        }
      }
      return source;
    };
    return visit(obj, 0);
  };
  const isAsyncFn = kindOfTest("AsyncFunction");
  const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
  const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
    if (setImmediateSupported) {
      return setImmediate;
    }
    return postMessageSupported ? ((token, callbacks) => {
      _global.addEventListener("message", ({ source, data }) => {
        if (source === _global && data === token) {
          callbacks.length && callbacks.shift()();
        }
      }, false);
      return (cb) => {
        callbacks.push(cb);
        _global.postMessage(token, "*");
      };
    })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
  })(
    typeof setImmediate === "function",
    isFunction$1(_global.postMessage)
  );
  const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
  const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
  const utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isEmptyObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty,
    // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable,
    setImmediate: _setImmediate,
    asap,
    isIterable
  };
  function AxiosError$1(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    if (response) {
      this.response = response;
      this.status = response.status ? response.status : null;
    }
  }
  utils$1.inherits(AxiosError$1, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      };
    }
  });
  const prototype$1 = AxiosError$1.prototype;
  const descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
    // eslint-disable-next-line func-names
  ].forEach((code) => {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$1, descriptors);
  Object.defineProperty(prototype$1, "isAxiosError", { value: true });
  AxiosError$1.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);
    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, (prop) => {
      return prop !== "isAxiosError";
    });
    const msg = error && error.message ? error.message : "Error";
    const errCode = code == null && error ? error.code : code;
    AxiosError$1.call(axiosError, msg, errCode, config, request, response);
    if (error && axiosError.cause == null) {
      Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
    }
    axiosError.name = error && error.name || "Error";
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  const httpAdapter = null;
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }
  function removeBrackets(key) {
    return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
  }
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      token = removeBrackets(token);
      return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
  }
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }
  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });
  function toFormData$1(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError("target must be an object");
    }
    formData = formData || new FormData();
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      return !utils$1.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);
    if (!utils$1.isFunction(visitor)) {
      throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
      if (value === null) return "";
      if (utils$1.isDate(value)) {
        return value.toISOString();
      }
      if (utils$1.isBoolean(value)) {
        return value.toString();
      }
      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError$1("Blob is not supported. Use a Buffer instead.");
      }
      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function defaultVisitor(value, key, path) {
      let arr = value;
      if (value && !path && typeof value === "object") {
        if (utils$1.endsWith(key, "{}")) {
          key = metaTokens ? key : key.slice(0, -2);
          value = JSON.stringify(value);
        } else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
          key = removeBrackets(key);
          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
              convertValue(el)
            );
          });
          return false;
        }
      }
      if (isVisitable(value)) {
        return true;
      }
      formData.append(renderKey(path, key, dots), convertValue(value));
      return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });
    function build(value, path) {
      if (utils$1.isUndefined(value)) return;
      if (stack.indexOf(value) !== -1) {
        throw Error("Circular reference detected in " + path.join("."));
      }
      stack.push(value);
      utils$1.forEach(value, function each(el, key) {
        const result2 = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData,
          el,
          utils$1.isString(key) ? key.trim() : key,
          path,
          exposedHelpers
        );
        if (result2 === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });
      stack.pop();
    }
    if (!utils$1.isObject(obj)) {
      throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
  }
  function encode$1(str) {
    const charMap = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && toFormData$1(params, this, options);
  }
  const prototype = AxiosURLSearchParams.prototype;
  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };
  prototype.toString = function toString2(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;
    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
  };
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
  }
  function buildURL(url, params, options) {
    if (!params) {
      return url;
    }
    const _encode = options && options.encode || encode;
    if (utils$1.isFunction(options)) {
      options = {
        serialize: options
      };
    }
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  }
  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }
    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }
    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }
  const transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
  const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
  const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
  const platform$1 = {
    isBrowser: true,
    classes: {
      URLSearchParams: URLSearchParams$1,
      FormData: FormData$1,
      Blob: Blob$1
    },
    protocols: ["http", "https", "file", "blob", "url", "data"]
  };
  const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
  const _navigator = typeof navigator === "object" && navigator || void 0;
  const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
  const hasStandardBrowserWebWorkerEnv = (() => {
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
  })();
  const origin = hasBrowserEnv && window?.location?.href || "http://localhost";
  const utils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    hasBrowserEnv,
    hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv,
    navigator: _navigator,
    origin
  }, Symbol.toStringTag, { value: "Module" }));
  const platform = {
    ...utils,
    ...platform$1
  };
  function toURLEncodedForm(data, options) {
    return toFormData$1(data, new platform.classes.URLSearchParams(), {
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString("base64"));
          return false;
        }
        return helpers.defaultVisitor.apply(this, arguments);
      },
      ...options
    });
  }
  function parsePropPath(name) {
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
      return match[0] === "[]" ? "" : match[1] || match[0];
    });
  }
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];
      if (name === "__proto__") return true;
      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;
      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }
        return !isNumericKey;
      }
      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }
      const result2 = buildPath(path, value, target[name], index);
      if (result2 && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }
      return !isNumericKey;
    }
    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};
      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });
      return obj;
    }
    return null;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  const defaults = {
    transitional: transitionalDefaults,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || "";
      const hasJSONContentType = contentType.indexOf("application/json") > -1;
      const isObjectPayload = utils$1.isObject(data);
      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }
      const isFormData2 = utils$1.isFormData(data);
      if (isFormData2) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }
      if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
        return data.toString();
      }
      let isFileList2;
      if (isObjectPayload) {
        if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }
        if ((isFileList2 = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
          const _FormData = this.env && this.env.FormData;
          return toFormData$1(
            isFileList2 ? { "files[]": data } : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }
      if (isObjectPayload || hasJSONContentType) {
        headers.setContentType("application/json", false);
        return stringifySafely(data);
      }
      return data;
    }],
    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === "json";
      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }
      if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;
        try {
          return JSON.parse(data, this.parseReviver);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": void 0
      }
    }
  };
  utils$1.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
    defaults.headers[method] = {};
  });
  const ignoreDuplicateOf = utils$1.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ]);
  const parseHeaders = (rawHeaders) => {
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
      i = line.indexOf(":");
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();
      if (!key || parsed[key] && ignoreDuplicateOf[key]) {
        return;
      }
      if (key === "set-cookie") {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    });
    return parsed;
  };
  const $internals = Symbol("internals");
  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }
  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }
    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }
  function parseTokens(str) {
    const tokens = /* @__PURE__ */ Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while (match = tokensRE.exec(str)) {
      tokens[match[1]] = match[2];
    }
    return tokens;
  }
  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
      value = header;
    }
    if (!utils$1.isString(value)) return;
    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }
    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }
  function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
  }
  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(" " + header);
    ["get", "set", "has"].forEach((methodName) => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }
  let AxiosHeaders$1 = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      const self2 = this;
      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);
        if (!lHeader) {
          throw new Error("header name must be a non-empty string");
        }
        const key = utils$1.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
          self2[key || _header] = normalizeValue(_value);
        }
      }
      const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
        let obj = {}, dest, key;
        for (const entry of header) {
          if (!utils$1.isArray(entry)) {
            throw TypeError("Object iterator must return a key-value pair");
          }
          obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }
      return this;
    }
    get(header, parser) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        if (key) {
          const value = this[key];
          if (!parser) {
            return value;
          }
          if (parser === true) {
            return parseTokens(value);
          }
          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }
          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      header = normalizeHeader(header);
      if (header) {
        const key = utils$1.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return false;
    }
    delete(header, matcher) {
      const self2 = this;
      let deleted = false;
      function deleteHeader(_header) {
        _header = normalizeHeader(_header);
        if (_header) {
          const key = utils$1.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
            delete self2[key];
            deleted = true;
          }
        }
      }
      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }
      return deleted;
    }
    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;
      while (i--) {
        const key = keys[i];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }
      return deleted;
    }
    normalize(format) {
      const self2 = this;
      const headers = {};
      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value);
          delete self2[header];
          return;
        }
        const normalized = format ? formatHeader(header) : String(header).trim();
        if (normalized !== header) {
          delete self2[header];
        }
        self2[normalized] = normalizeValue(value);
        headers[normalized] = true;
      });
      return this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      const obj = /* @__PURE__ */ Object.create(null);
      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
      });
      return obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      const computed = new this(first);
      targets.forEach((target) => computed.set(target));
      return computed;
    }
    static accessor(header) {
      const internals = this[$internals] = this[$internals] = {
        accessors: {}
      };
      const accessors = internals.accessors;
      const prototype2 = this.prototype;
      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);
        if (!accessors[lHeader]) {
          buildAccessors(prototype2, _header);
          accessors[lHeader] = true;
        }
      }
      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
      return this;
    }
  };
  AxiosHeaders$1.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
  utils$1.reduceDescriptors(AxiosHeaders$1.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils$1.freezeMethods(AxiosHeaders$1);
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders$1.from(context.headers);
    let data = context.data;
    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
    });
    headers.normalize();
    return data;
  }
  function isCancel$1(value) {
    return !!(value && value.__CANCEL__);
  }
  function CanceledError$1(message, config, request) {
    AxiosError$1.call(this, message == null ? "canceled" : message, AxiosError$1.ERR_CANCELED, config, request);
    this.name = "CanceledError";
  }
  utils$1.inherits(CanceledError$1, AxiosError$1, {
    __CANCEL__: true
  });
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$1(
        "Request failed with status code " + response.status,
        [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }
  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  }
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== void 0 ? min : 1e3;
    return function push(chunkLength) {
      const now = Date.now();
      const startedAt = timestamps[tail];
      if (!firstSampleTS) {
        firstSampleTS = now;
      }
      bytes[head] = chunkLength;
      timestamps[head] = now;
      let i = tail;
      let bytesCount = 0;
      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }
      head = (head + 1) % samplesCount;
      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }
      if (now - firstSampleTS < min) {
        return;
      }
      const passed = startedAt && now - startedAt;
      return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
    };
  }
  function throttle(fn, freq) {
    let timestamp = 0;
    let threshold = 1e3 / freq;
    let lastArgs;
    let timer;
    const invoke = (args, now = Date.now()) => {
      timestamp = now;
      lastArgs = null;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn(...args);
    };
    const throttled = (...args) => {
      const now = Date.now();
      const passed = now - timestamp;
      if (passed >= threshold) {
        invoke(args, now);
      } else {
        lastArgs = args;
        if (!timer) {
          timer = setTimeout(() => {
            timer = null;
            invoke(lastArgs);
          }, threshold - passed);
        }
      }
    };
    const flush = () => lastArgs && invoke(lastArgs);
    return [throttled, flush];
  }
  const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);
    return throttle((e) => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : void 0;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;
      bytesNotified = loaded;
      const data = {
        loaded,
        total,
        progress: total ? loaded / total : void 0,
        bytes: progressBytes,
        rate: rate ? rate : void 0,
        estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
        event: e,
        lengthComputable: total != null,
        [isDownloadStream ? "download" : "upload"]: true
      };
      listener(data);
    }, freq);
  };
  const progressEventDecorator = (total, throttled) => {
    const lengthComputable = total != null;
    return [(loaded) => throttled[0]({
      lengthComputable,
      total,
      loaded
    }), throttled[1]];
  };
  const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
  const isURLSameOrigin = platform.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
    url = new URL(url, platform.origin);
    return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
  })(
    new URL(platform.origin),
    platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
  ) : () => true;
  const cookies = platform.hasStandardBrowserEnv ? (
    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + "=" + encodeURIComponent(value)];
        utils$1.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils$1.isString(path) && cookie.push("path=" + path);
        utils$1.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
      },
      read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    }
  ) : (
    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {
      },
      read() {
        return null;
      },
      remove() {
      }
    }
  );
  function isAbsoluteURL(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }
  function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  }
  function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
    let isRelativeUrl = !isAbsoluteURL(requestedURL);
    if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }
  const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
  function mergeConfig$1(config1, config2) {
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, prop, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({ caseless }, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(a, b, prop, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, prop, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a, prop, caseless);
      }
    }
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      }
    }
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(void 0, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(void 0, a);
      }
    }
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(void 0, a);
      }
    }
    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
    };
    utils$1.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
      const merge2 = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge2(config1[prop], config2[prop], prop);
      utils$1.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  }
  const resolveConfig = (config) => {
    const newConfig = mergeConfig$1({}, config);
    let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
    newConfig.headers = headers = AxiosHeaders$1.from(headers);
    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
    if (auth) {
      headers.set(
        "Authorization",
        "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
      );
    }
    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(void 0);
      } else if (utils$1.isFunction(data.getHeaders)) {
        const formHeaders = data.getHeaders();
        const allowedHeaders = ["content-type", "content-length"];
        Object.entries(formHeaders).forEach(([key, val]) => {
          if (allowedHeaders.includes(key.toLowerCase())) {
            headers.set(key, val);
          }
        });
      }
    }
    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
      if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }
    return newConfig;
  };
  const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
  const xhrAdapter = isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
      let { responseType, onUploadProgress, onDownloadProgress } = _config;
      let onCanceled;
      let uploadThrottled, downloadThrottled;
      let flushUpload, flushDownload;
      function done() {
        flushUpload && flushUpload();
        flushDownload && flushDownload();
        _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
        _config.signal && _config.signal.removeEventListener("abort", onCanceled);
      }
      let request = new XMLHttpRequest();
      request.open(_config.method.toUpperCase(), _config.url, true);
      request.timeout = _config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        const responseHeaders = AxiosHeaders$1.from(
          "getAllResponseHeaders" in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$1("Request aborted", AxiosError$1.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError(event) {
        const msg = event && event.message ? event.message : "Network Error";
        const err = new AxiosError$1(msg, AxiosError$1.ERR_NETWORK, config, request);
        err.event = event || null;
        reject(err);
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError$1(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      requestData === void 0 && requestHeaders.setContentType(null);
      if ("setRequestHeader" in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = _config.responseType;
      }
      if (onDownloadProgress) {
        [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
        request.addEventListener("progress", downloadThrottled);
      }
      if (onUploadProgress && request.upload) {
        [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
        request.upload.addEventListener("progress", uploadThrottled);
        request.upload.addEventListener("loadend", flushUpload);
      }
      if (_config.cancelToken || _config.signal) {
        onCanceled = (cancel) => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
          request.abort();
          request = null;
        };
        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
        }
      }
      const protocol = parseProtocol(_config.url);
      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError$1("Unsupported protocol " + protocol + ":", AxiosError$1.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData || null);
    });
  };
  const composeSignals = (signals, timeout) => {
    const { length } = signals = signals ? signals.filter(Boolean) : [];
    if (timeout || length) {
      let controller = new AbortController();
      let aborted;
      const onabort = function(reason) {
        if (!aborted) {
          aborted = true;
          unsubscribe();
          const err = reason instanceof Error ? reason : this.reason;
          controller.abort(err instanceof AxiosError$1 ? err : new CanceledError$1(err instanceof Error ? err.message : err));
        }
      };
      let timer = timeout && setTimeout(() => {
        timer = null;
        onabort(new AxiosError$1(`timeout ${timeout} of ms exceeded`, AxiosError$1.ETIMEDOUT));
      }, timeout);
      const unsubscribe = () => {
        if (signals) {
          timer && clearTimeout(timer);
          timer = null;
          signals.forEach((signal2) => {
            signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
          });
          signals = null;
        }
      };
      signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
      const { signal } = controller;
      signal.unsubscribe = () => utils$1.asap(unsubscribe);
      return signal;
    }
  };
  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;
    if (len < chunkSize) {
      yield chunk;
      return;
    }
    let pos = 0;
    let end;
    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };
  const readBytes = async function* (iterable, chunkSize) {
    for await (const chunk of readStream(iterable)) {
      yield* streamChunk(chunk, chunkSize);
    }
  };
  const readStream = async function* (stream) {
    if (stream[Symbol.asyncIterator]) {
      yield* stream;
      return;
    }
    const reader = stream.getReader();
    try {
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        yield value;
      }
    } finally {
      await reader.cancel();
    }
  };
  const trackStream = (stream, chunkSize, onProgress, onFinish) => {
    const iterator2 = readBytes(stream, chunkSize);
    let bytes = 0;
    let done;
    let _onFinish = (e) => {
      if (!done) {
        done = true;
        onFinish && onFinish(e);
      }
    };
    return new ReadableStream({
      async pull(controller) {
        try {
          const { done: done2, value } = await iterator2.next();
          if (done2) {
            _onFinish();
            controller.close();
            return;
          }
          let len = value.byteLength;
          if (onProgress) {
            let loadedBytes = bytes += len;
            onProgress(loadedBytes);
          }
          controller.enqueue(new Uint8Array(value));
        } catch (err) {
          _onFinish(err);
          throw err;
        }
      },
      cancel(reason) {
        _onFinish(reason);
        return iterator2.return();
      }
    }, {
      highWaterMark: 2
    });
  };
  const DEFAULT_CHUNK_SIZE = 64 * 1024;
  const { isFunction } = utils$1;
  const globalFetchAPI = (({ Request, Response }) => ({
    Request,
    Response
  }))(utils$1.global);
  const {
    ReadableStream: ReadableStream$1,
    TextEncoder
  } = utils$1.global;
  const test = (fn, ...args) => {
    try {
      return !!fn(...args);
    } catch (e) {
      return false;
    }
  };
  const factory = (env) => {
    env = utils$1.merge.call({
      skipUndefined: true
    }, globalFetchAPI, env);
    const { fetch: envFetch, Request, Response } = env;
    const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
    const isRequestSupported = isFunction(Request);
    const isResponseSupported = isFunction(Response);
    if (!isFetchSupported) {
      return false;
    }
    const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
    const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
    const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
      let duplexAccessed = false;
      const hasContentType = new Request(platform.origin, {
        body: new ReadableStream$1(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("Content-Type");
      return duplexAccessed && !hasContentType;
    });
    const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
    const resolvers = {
      stream: supportsResponseStream && ((res) => res.body)
    };
    isFetchSupported && (() => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
        !resolvers[type] && (resolvers[type] = (res, config) => {
          let method = res && res[type];
          if (method) {
            return method.call(res);
          }
          throw new AxiosError$1(`Response type '${type}' is not supported`, AxiosError$1.ERR_NOT_SUPPORT, config);
        });
      });
    })();
    const getBodyLength = async (body) => {
      if (body == null) {
        return 0;
      }
      if (utils$1.isBlob(body)) {
        return body.size;
      }
      if (utils$1.isSpecCompliantForm(body)) {
        const _request = new Request(platform.origin, {
          method: "POST",
          body
        });
        return (await _request.arrayBuffer()).byteLength;
      }
      if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
        return body.byteLength;
      }
      if (utils$1.isURLSearchParams(body)) {
        body = body + "";
      }
      if (utils$1.isString(body)) {
        return (await encodeText(body)).byteLength;
      }
    };
    const resolveBodyLength = async (headers, body) => {
      const length = utils$1.toFiniteNumber(headers.getContentLength());
      return length == null ? getBodyLength(body) : length;
    };
    return async (config) => {
      let {
        url,
        method,
        data,
        signal,
        cancelToken,
        timeout,
        onDownloadProgress,
        onUploadProgress,
        responseType,
        headers,
        withCredentials = "same-origin",
        fetchOptions
      } = resolveConfig(config);
      let _fetch = envFetch || fetch;
      responseType = responseType ? (responseType + "").toLowerCase() : "text";
      let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
      let request = null;
      const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
        composedSignal.unsubscribe();
      });
      let requestContentLength;
      try {
        if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
          let _request = new Request(url, {
            method: "POST",
            body: data,
            duplex: "half"
          });
          let contentTypeHeader;
          if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
            headers.setContentType(contentTypeHeader);
          }
          if (_request.body) {
            const [onProgress, flush] = progressEventDecorator(
              requestContentLength,
              progressEventReducer(asyncDecorator(onUploadProgress))
            );
            data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
          }
        }
        if (!utils$1.isString(withCredentials)) {
          withCredentials = withCredentials ? "include" : "omit";
        }
        const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
        const resolvedOptions = {
          ...fetchOptions,
          signal: composedSignal,
          method: method.toUpperCase(),
          headers: headers.normalize().toJSON(),
          body: data,
          duplex: "half",
          credentials: isCredentialsSupported ? withCredentials : void 0
        };
        request = isRequestSupported && new Request(url, resolvedOptions);
        let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
        const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
        if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
          const options = {};
          ["status", "statusText", "headers"].forEach((prop) => {
            options[prop] = response[prop];
          });
          const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
          const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
            responseContentLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true)
          ) || [];
          response = new Response(
            trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
              flush && flush();
              unsubscribe && unsubscribe();
            }),
            options
          );
        }
        responseType = responseType || "text";
        let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
        !isStreamResponse && unsubscribe && unsubscribe();
        return await new Promise((resolve, reject) => {
          settle(resolve, reject, {
            data: responseData,
            headers: AxiosHeaders$1.from(response.headers),
            status: response.status,
            statusText: response.statusText,
            config,
            request
          });
        });
      } catch (err) {
        unsubscribe && unsubscribe();
        if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
          throw Object.assign(
            new AxiosError$1("Network Error", AxiosError$1.ERR_NETWORK, config, request),
            {
              cause: err.cause || err
            }
          );
        }
        throw AxiosError$1.from(err, err && err.code, config, request);
      }
    };
  };
  const seedCache = /* @__PURE__ */ new Map();
  const getFetch = (config) => {
    let env = config ? config.env : {};
    const { fetch: fetch2, Request, Response } = env;
    const seeds = [
      Request,
      Response,
      fetch2
    ];
    let len = seeds.length, i = len, seed, target, map = seedCache;
    while (i--) {
      seed = seeds[i];
      target = map.get(seed);
      target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
      map = target;
    }
    return target;
  };
  getFetch();
  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: {
      get: getFetch
    }
  };
  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {
      }
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  const renderReason = (reason) => `- ${reason}`;
  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
  const adapters = {
    getAdapter: (adapters2, config) => {
      adapters2 = utils$1.isArray(adapters2) ? adapters2 : [adapters2];
      const { length } = adapters2;
      let nameOrAdapter;
      let adapter;
      const rejectedReasons = {};
      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters2[i];
        let id;
        adapter = nameOrAdapter;
        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
          if (adapter === void 0) {
            throw new AxiosError$1(`Unknown adapter '${id}'`);
          }
        }
        if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
          break;
        }
        rejectedReasons[id || "#" + i] = adapter;
      }
      if (!adapter) {
        const reasons = Object.entries(rejectedReasons).map(
          ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
        );
        let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
        throw new AxiosError$1(
          `There is no suitable adapter to dispatch the request ` + s,
          "ERR_NOT_SUPPORT"
        );
      }
      return adapter;
    },
    adapters: knownAdapters
  };
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError$1(null, config);
    }
  }
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = AxiosHeaders$1.from(config.headers);
    config.data = transformData.call(
      config,
      config.transformRequest
    );
    if (["post", "put", "patch"].indexOf(config.method) !== -1) {
      config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter, config);
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );
      response.headers = AxiosHeaders$1.from(response.headers);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel$1(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
        }
      }
      return Promise.reject(reason);
    });
  }
  const VERSION$1 = "1.12.2";
  const validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  const deprecatedWarnings = {};
  validators$1.transitional = function transitional(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator2 === false) {
        throw new AxiosError$1(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError$1.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  validators$1.spelling = function spelling(correctSpelling) {
    return (value, opt) => {
      console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
      return true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError$1("options must be an object", AxiosError$1.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator2 = schema[opt];
      if (validator2) {
        const value = options[opt];
        const result2 = value === void 0 || validator2(value, opt, options);
        if (result2 !== true) {
          throw new AxiosError$1("option " + opt + " must be " + result2, AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError$1("Unknown option " + opt, AxiosError$1.ERR_BAD_OPTION);
      }
    }
  }
  const validator = {
    assertOptions,
    validators: validators$1
  };
  const validators = validator.validators;
  let Axios$1 = class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig || {};
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }
    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy = {};
          Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
          try {
            if (!err.stack) {
              err.stack = stack;
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
              err.stack += "\n" + stack;
            }
          } catch (e) {
          }
        }
        throw err;
      }
    }
    _request(configOrUrl, config) {
      if (typeof configOrUrl === "string") {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig$1(this.defaults, config);
      const { transitional, paramsSerializer, headers } = config;
      if (transitional !== void 0) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }
      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }
      if (config.allowAbsoluteUrls !== void 0) ;
      else if (this.defaults.allowAbsoluteUrls !== void 0) {
        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
      } else {
        config.allowAbsoluteUrls = true;
      }
      validator.assertOptions(config, {
        baseUrl: validators.spelling("baseURL"),
        withXsrfToken: validators.spelling("withXSRFToken")
      }, true);
      config.method = (config.method || this.defaults.method || "get").toLowerCase();
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );
      headers && utils$1.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );
      config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
          return;
        }
        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });
      let promise;
      let i = 0;
      let len;
      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), void 0];
        chain.unshift(...requestInterceptorChain);
        chain.push(...responseInterceptorChain);
        len = chain.length;
        promise = Promise.resolve(config);
        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }
        return promise;
      }
      len = requestInterceptorChain.length;
      let newConfig = config;
      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }
      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      i = 0;
      len = responseInterceptorChain.length;
      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }
      return promise;
    }
    getUri(config) {
      config = mergeConfig$1(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  };
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  let CancelToken$1 = class CancelToken2 {
    constructor(executor) {
      if (typeof executor !== "function") {
        throw new TypeError("executor must be a function.");
      }
      let resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      const token = this;
      this.promise.then((cancel) => {
        if (!token._listeners) return;
        let i = token._listeners.length;
        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = (onfulfilled) => {
        let _resolve;
        const promise = new Promise((resolve) => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message, config, request) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError$1(message, config, request);
        resolvePromise(token.reason);
      });
    }
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }
    toAbortSignal() {
      const controller = new AbortController();
      const abort = (err) => {
        controller.abort(err);
      };
      this.subscribe(abort);
      controller.signal.unsubscribe = () => this.unsubscribe(abort);
      return controller.signal;
    }
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken2(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  };
  function spread$1(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }
  function isAxiosError$1(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  }
  const HttpStatusCode$1 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
  };
  Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
    HttpStatusCode$1[value] = key;
  });
  function createInstance(defaultConfig) {
    const context = new Axios$1(defaultConfig);
    const instance = bind(Axios$1.prototype.request, context);
    utils$1.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
    utils$1.extend(instance, context, null, { allOwnKeys: true });
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
    };
    return instance;
  }
  const axios = createInstance(defaults);
  axios.Axios = Axios$1;
  axios.CanceledError = CanceledError$1;
  axios.CancelToken = CancelToken$1;
  axios.isCancel = isCancel$1;
  axios.VERSION = VERSION$1;
  axios.toFormData = toFormData$1;
  axios.AxiosError = AxiosError$1;
  axios.Cancel = axios.CanceledError;
  axios.all = function all2(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread$1;
  axios.isAxiosError = isAxiosError$1;
  axios.mergeConfig = mergeConfig$1;
  axios.AxiosHeaders = AxiosHeaders$1;
  axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
  axios.getAdapter = adapters.getAdapter;
  axios.HttpStatusCode = HttpStatusCode$1;
  axios.default = axios;
  const {
    Axios,
    AxiosError,
    CanceledError,
    isCancel,
    CancelToken,
    VERSION,
    all,
    Cancel,
    isAxiosError,
    spread,
    toFormData,
    AxiosHeaders,
    HttpStatusCode,
    formToJSON,
    getAdapter,
    mergeConfig
  } = axios;
  function getYoutubeVideoId(url) {
    if (!url) return null;
    const videoUrl = new URL(url);
    const videoId = videoUrl.searchParams.get("v");
    return videoId;
  }
  const definition = defineBackground(() => {
    console.log("Hello background!", { id: browser.runtime.id });
  });
  chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
    if (msg?.type === "CHATYT_URL_UPDATE" && typeof msg.url === "string") {
      const url = msg.url;
      const vId = getYoutubeVideoId(url);
      chrome.storage.local.set({
        lastChatYtUrl: url,
        lastChatYtVideoId: vId,
        lastChatYtAt: Date.now()
      });
    }
  });
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type !== "LLM_QUERY") return;
    (async function() {
      try {
        const { key } = await chrome.storage.local.get("key");
        if (!key)
          return sendResponse({
            ok: false,
            error: "Missing API Key"
          });
        const { query, videoId, url } = msg.payload;
        const r = await axios.post(
          `http://localhost:3000/api/v1/query`,
          {
            query,
            videoId,
            url
          },
          {
            headers: {
              Authorization: `Bearer ${key}`
            }
          }
        );
        if (!r || r.status !== 200 && r.status !== 201) {
          return sendResponse({
            ok: false,
            error: `LLM Error ${r.status} `
          });
        }
        sendResponse({
          ok: true,
          data: r.data
        });
      } catch (e) {
        return sendResponse({
          ok: false,
          error: e?.message ?? `Request failed`
        });
      }
    })();
    return true;
  });
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type !== "TRANSCRIBE_VIDEO") return;
    (async function() {
      try {
        const { key } = await chrome.storage.local.get("key");
        if (!key)
          return sendResponse({
            ok: false,
            error: "Missing API Key"
          });
        const { url, videoId } = msg.payload;
        const r = await axios.post(
          `http://localhost:3000/api/v1/transcribe-video`,
          {
            url,
            videoId
          },
          {
            headers: {
              Authorization: `Bearer ${key}`
            }
          }
        );
        if (!r || r.status !== 200 && r.status !== 201) {
          return sendResponse({
            ok: false,
            error: `LLM Error ${r.status} `
          });
        }
        sendResponse({
          ok: true,
          data: r.data
        });
      } catch (e) {
        return sendResponse({
          ok: false,
          error: e?.message ?? `Request failed`
        });
      }
    })();
    return true;
  });
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "SAVE_API_KEYS") {
      const { model, apiKey } = msg.payload;
      chrome.storage.local.set(
        {
          model,
          key: apiKey,
          lastKeySavedAt: Date.now()
        },
        () => {
          sendResponse({
            ok: true,
            data: msg
          });
        }
      );
      return true;
    }
  });
  function initPlugins() {
  }
  var _MatchPattern = class {
    constructor(matchPattern) {
      if (matchPattern === "<all_urls>") {
        this.isAllUrls = true;
        this.protocolMatches = [..._MatchPattern.PROTOCOLS];
        this.hostnameMatch = "*";
        this.pathnameMatch = "*";
      } else {
        const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
        if (groups == null)
          throw new InvalidMatchPattern(matchPattern, "Incorrect format");
        const [_, protocol, hostname, pathname] = groups;
        validateProtocol(matchPattern, protocol);
        validateHostname(matchPattern, hostname);
        this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
        this.hostnameMatch = hostname;
        this.pathnameMatch = pathname;
      }
    }
    includes(url) {
      if (this.isAllUrls)
        return true;
      const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
      return !!this.protocolMatches.find((protocol) => {
        if (protocol === "http")
          return this.isHttpMatch(u);
        if (protocol === "https")
          return this.isHttpsMatch(u);
        if (protocol === "file")
          return this.isFileMatch(u);
        if (protocol === "ftp")
          return this.isFtpMatch(u);
        if (protocol === "urn")
          return this.isUrnMatch(u);
      });
    }
    isHttpMatch(url) {
      return url.protocol === "http:" && this.isHostPathMatch(url);
    }
    isHttpsMatch(url) {
      return url.protocol === "https:" && this.isHostPathMatch(url);
    }
    isHostPathMatch(url) {
      if (!this.hostnameMatch || !this.pathnameMatch)
        return false;
      const hostnameMatchRegexs = [
        this.convertPatternToRegex(this.hostnameMatch),
        this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))
      ];
      const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
      return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
    }
    isFileMatch(url) {
      throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
    }
    isFtpMatch(url) {
      throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
    }
    isUrnMatch(url) {
      throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
    }
    convertPatternToRegex(pattern) {
      const escaped = this.escapeForRegex(pattern);
      const starsReplaced = escaped.replace(/\\\*/g, ".*");
      return RegExp(`^${starsReplaced}$`);
    }
    escapeForRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  };
  var MatchPattern = _MatchPattern;
  MatchPattern.PROTOCOLS = ["http", "https", "file", "ftp", "urn"];
  var InvalidMatchPattern = class extends Error {
    constructor(matchPattern, reason) {
      super(`Invalid match pattern "${matchPattern}": ${reason}`);
    }
  };
  function validateProtocol(matchPattern, protocol) {
    if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*")
      throw new InvalidMatchPattern(
        matchPattern,
        `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`
      );
  }
  function validateHostname(matchPattern, hostname) {
    if (hostname.includes(":"))
      throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
    if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*."))
      throw new InvalidMatchPattern(
        matchPattern,
        `If using a wildcard (*), it must go at the start of the hostname`
      );
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  let ws;
  function getDevServerWebSocket() {
    if (ws == null) {
      const serverUrl = "ws://localhost:5173";
      logger.debug("Connecting to dev server @", serverUrl);
      ws = new WebSocket(serverUrl, "vite-hmr");
      ws.addWxtEventListener = ws.addEventListener.bind(ws);
      ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({ type: "custom", event, payload }));
      ws.addEventListener("open", () => {
        logger.debug("Connected to dev server");
      });
      ws.addEventListener("close", () => {
        logger.debug("Disconnected from dev server");
      });
      ws.addEventListener("error", (event) => {
        logger.error("Failed to connect to dev server", event);
      });
      ws.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data);
          if (message.type === "custom") {
            ws?.dispatchEvent(
              new CustomEvent(message.event, { detail: message.data })
            );
          }
        } catch (err) {
          logger.error("Failed to handle message", err);
        }
      });
    }
    return ws;
  }
  function keepServiceWorkerAlive() {
    setInterval(async () => {
      await browser.runtime.getPlatformInfo();
    }, 5e3);
  }
  function reloadContentScript(payload) {
    const manifest = browser.runtime.getManifest();
    if (manifest.manifest_version == 2) {
      void reloadContentScriptMv2();
    } else {
      void reloadContentScriptMv3(payload);
    }
  }
  async function reloadContentScriptMv3({
    registration,
    contentScript
  }) {
    if (registration === "runtime") {
      await reloadRuntimeContentScriptMv3(contentScript);
    } else {
      await reloadManifestContentScriptMv3(contentScript);
    }
  }
  async function reloadManifestContentScriptMv3(contentScript) {
    const id = `wxt:${contentScript.js[0]}`;
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const existing = registered.find((cs) => cs.id === id);
    if (existing) {
      logger.debug("Updating content script", existing);
      await browser.scripting.updateContentScripts([
        {
          ...contentScript,
          id,
          css: contentScript.css ?? []
        }
      ]);
    } else {
      logger.debug("Registering new content script...");
      await browser.scripting.registerContentScripts([
        {
          ...contentScript,
          id,
          css: contentScript.css ?? []
        }
      ]);
    }
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadRuntimeContentScriptMv3(contentScript) {
    logger.log("Reloading content script:", contentScript);
    const registered = await browser.scripting.getRegisteredContentScripts();
    logger.debug("Existing scripts:", registered);
    const matches = registered.filter((cs) => {
      const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
      const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
      return hasJs || hasCss;
    });
    if (matches.length === 0) {
      logger.log(
        "Content script is not registered yet, nothing to reload",
        contentScript
      );
      return;
    }
    await browser.scripting.updateContentScripts(matches);
    await reloadTabsForContentScript(contentScript);
  }
  async function reloadTabsForContentScript(contentScript) {
    const allTabs = await browser.tabs.query({});
    const matchPatterns = contentScript.matches.map(
      (match) => new MatchPattern(match)
    );
    const matchingTabs = allTabs.filter((tab) => {
      const url = tab.url;
      if (!url) return false;
      return !!matchPatterns.find((pattern) => pattern.includes(url));
    });
    await Promise.all(
      matchingTabs.map(async (tab) => {
        try {
          await browser.tabs.reload(tab.id);
        } catch (err) {
          logger.warn("Failed to reload tab:", err);
        }
      })
    );
  }
  async function reloadContentScriptMv2(_payload) {
    throw Error("TODO: reloadContentScriptMv2");
  }
  {
    try {
      const ws2 = getDevServerWebSocket();
      ws2.addWxtEventListener("wxt:reload-extension", () => {
        browser.runtime.reload();
      });
      ws2.addWxtEventListener("wxt:reload-content-script", (event) => {
        reloadContentScript(event.detail);
      });
      if (true) {
        ws2.addEventListener(
          "open",
          () => ws2.sendCustom("wxt:background-initialized")
        );
        keepServiceWorkerAlive();
      }
    } catch (err) {
      logger.error("Failed to setup web socket connection with dev server", err);
    }
    browser.commands.onCommand.addListener((command) => {
      if (command === "wxt:reload-extension") {
        browser.runtime.reload();
      }
    });
  }
  let result;
  try {
    initPlugins();
    result = definition.main();
    if (result instanceof Promise) {
      console.warn(
        "The background's main() function return a promise, but it must be synchronous"
      );
    }
  } catch (err) {
    logger.error("The background crashed on startup!");
    throw err;
  }
  const result$1 = result;
  return result$1;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYmluZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvdXRpbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvQXhpb3NFcnJvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9udWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3RvRm9ybURhdGEuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvYnVpbGRVUkwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvSW50ZXJjZXB0b3JNYW5hZ2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy90cmFuc2l0aW9uYWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvY2xhc3Nlcy9VUkxTZWFyY2hQYXJhbXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvY2xhc3Nlcy9Gb3JtRGF0YS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vYnJvd3Nlci9jbGFzc2VzL0Jsb2IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2Jyb3dzZXIvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3BsYXRmb3JtL2NvbW1vbi91dGlscy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvcGxhdGZvcm0vaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdG9VUkxFbmNvZGVkRm9ybS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9mb3JtRGF0YVRvSlNPTi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvZGVmYXVsdHMvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zSGVhZGVycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS90cmFuc2Zvcm1EYXRhLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZVByb3RvY29sLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwZWVkb21ldGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Rocm90dGxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3Byb2dyZXNzRXZlbnRSZWR1Y2VyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzVVJMU2FtZU9yaWdpbi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9jb29raWVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvYnVpbGRGdWxsUGF0aC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9tZXJnZUNvbmZpZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9yZXNvbHZlQ29uZmlnLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tcG9zZVNpZ25hbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdHJhY2tTdHJlYW0uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL2ZldGNoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy9hZGFwdGVycy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2Vudi9kYXRhLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3ZhbGlkYXRvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY2FuY2VsL0NhbmNlbFRva2VuLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvSHR0cFN0YXR1c0NvZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2F4aW9zLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwiLi4vLi4vbGliL2hlbHBlci50cyIsIi4uLy4uL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQHdlYmV4dC1jb3JlL21hdGNoLXBhdHRlcm5zL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZGVmaW5lQmFja2dyb3VuZChhcmcpIHtcbiAgaWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG4gIHJldHVybiBhcmc7XG59XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIF9icm93c2VyIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbmV4cG9ydCBjb25zdCBicm93c2VyID0gX2Jyb3dzZXI7XG5leHBvcnQge307XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBiaW5kIGZyb20gJy4vaGVscGVycy9iaW5kLmpzJztcblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxuY29uc3Qge3RvU3RyaW5nfSA9IE9iamVjdC5wcm90b3R5cGU7XG5jb25zdCB7Z2V0UHJvdG90eXBlT2Z9ID0gT2JqZWN0O1xuY29uc3Qge2l0ZXJhdG9yLCB0b1N0cmluZ1RhZ30gPSBTeW1ib2w7XG5cbmNvbnN0IGtpbmRPZiA9IChjYWNoZSA9PiB0aGluZyA9PiB7XG4gICAgY29uc3Qgc3RyID0gdG9TdHJpbmcuY2FsbCh0aGluZyk7XG4gICAgcmV0dXJuIGNhY2hlW3N0cl0gfHwgKGNhY2hlW3N0cl0gPSBzdHIuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkpO1xufSkoT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbmNvbnN0IGtpbmRPZlRlc3QgPSAodHlwZSkgPT4ge1xuICB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKHRoaW5nKSA9PiBraW5kT2YodGhpbmcpID09PSB0eXBlXG59XG5cbmNvbnN0IHR5cGVPZlRlc3QgPSB0eXBlID0+IHRoaW5nID0+IHR5cGVvZiB0aGluZyA9PT0gdHlwZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IHtpc0FycmF5fSA9IEFycmF5O1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIHVuZGVmaW5lZFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHVuZGVmaW5lZCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzVW5kZWZpbmVkID0gdHlwZU9mVGVzdCgndW5kZWZpbmVkJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCdWZmZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgaXNGdW5jdGlvbih2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIpICYmIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlcih2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQXJyYXlCdWZmZXIgPSBraW5kT2ZUZXN0KCdBcnJheUJ1ZmZlcicpO1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIHZpZXcgb24gYW4gQXJyYXlCdWZmZXIsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyh2YWwpIHtcbiAgbGV0IHJlc3VsdDtcbiAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnKSAmJiAoQXJyYXlCdWZmZXIuaXNWaWV3KSkge1xuICAgIHJlc3VsdCA9IEFycmF5QnVmZmVyLmlzVmlldyh2YWwpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9ICh2YWwpICYmICh2YWwuYnVmZmVyKSAmJiAoaXNBcnJheUJ1ZmZlcih2YWwuYnVmZmVyKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJpbmcsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1N0cmluZyA9IHR5cGVPZlRlc3QoJ3N0cmluZycpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRnVuY3Rpb24gPSB0eXBlT2ZUZXN0KCdmdW5jdGlvbicpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgTnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIE51bWJlciwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzTnVtYmVyID0gdHlwZU9mVGVzdCgnbnVtYmVyJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYW4gT2JqZWN0XG4gKlxuICogQHBhcmFtIHsqfSB0aGluZyBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIE9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gKHRoaW5nKSA9PiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgQm9vbGVhblxuICpcbiAqIEBwYXJhbSB7Kn0gdGhpbmcgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQm9vbGVhbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzQm9vbGVhbiA9IHRoaW5nID0+IHRoaW5nID09PSB0cnVlIHx8IHRoaW5nID09PSBmYWxzZTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gKHZhbCkgPT4ge1xuICBpZiAoa2luZE9mKHZhbCkgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgcHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIChwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpID09PSBudWxsKSAmJiAhKHRvU3RyaW5nVGFnIGluIHZhbCkgJiYgIShpdGVyYXRvciBpbiB2YWwpO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGFuIGVtcHR5IG9iamVjdCAoc2FmZWx5IGhhbmRsZXMgQnVmZmVycylcbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIGVtcHR5IG9iamVjdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmNvbnN0IGlzRW1wdHlPYmplY3QgPSAodmFsKSA9PiB7XG4gIC8vIEVhcmx5IHJldHVybiBmb3Igbm9uLW9iamVjdHMgb3IgQnVmZmVycyB0byBwcmV2ZW50IFJhbmdlRXJyb3JcbiAgaWYgKCFpc09iamVjdCh2YWwpIHx8IGlzQnVmZmVyKHZhbCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKSA9PT0gT2JqZWN0LnByb3RvdHlwZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIEZhbGxiYWNrIGZvciBhbnkgb3RoZXIgb2JqZWN0cyB0aGF0IG1pZ2h0IGNhdXNlIFJhbmdlRXJyb3Igd2l0aCBPYmplY3Qua2V5cygpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIERhdGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0RhdGUgPSBraW5kT2ZUZXN0KCdEYXRlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEZpbGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0ZpbGUgPSBraW5kT2ZUZXN0KCdGaWxlJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhIEJsb2IsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Jsb2IgPSBraW5kT2ZUZXN0KCdCbG9iJyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlTGlzdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNGaWxlTGlzdCA9IGtpbmRPZlRlc3QoJ0ZpbGVMaXN0Jyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBTdHJlYW1cbiAqXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyZWFtLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNTdHJlYW0gPSAodmFsKSA9PiBpc09iamVjdCh2YWwpICYmIGlzRnVuY3Rpb24odmFsLnBpcGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgRm9ybURhdGFcbiAqXG4gKiBAcGFyYW0geyp9IHRoaW5nIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5jb25zdCBpc0Zvcm1EYXRhID0gKHRoaW5nKSA9PiB7XG4gIGxldCBraW5kO1xuICByZXR1cm4gdGhpbmcgJiYgKFxuICAgICh0eXBlb2YgRm9ybURhdGEgPT09ICdmdW5jdGlvbicgJiYgdGhpbmcgaW5zdGFuY2VvZiBGb3JtRGF0YSkgfHwgKFxuICAgICAgaXNGdW5jdGlvbih0aGluZy5hcHBlbmQpICYmIChcbiAgICAgICAgKGtpbmQgPSBraW5kT2YodGhpbmcpKSA9PT0gJ2Zvcm1kYXRhJyB8fFxuICAgICAgICAvLyBkZXRlY3QgZm9ybS1kYXRhIGluc3RhbmNlXG4gICAgICAgIChraW5kID09PSAnb2JqZWN0JyAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRvU3RyaW5nKSAmJiB0aGluZy50b1N0cmluZygpID09PSAnW29iamVjdCBGb3JtRGF0YV0nKVxuICAgICAgKVxuICAgIClcbiAgKVxufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgVVJMU2VhcmNoUGFyYW1zIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNVUkxTZWFyY2hQYXJhbXMgPSBraW5kT2ZUZXN0KCdVUkxTZWFyY2hQYXJhbXMnKTtcblxuY29uc3QgW2lzUmVhZGFibGVTdHJlYW0sIGlzUmVxdWVzdCwgaXNSZXNwb25zZSwgaXNIZWFkZXJzXSA9IFsnUmVhZGFibGVTdHJlYW0nLCAnUmVxdWVzdCcsICdSZXNwb25zZScsICdIZWFkZXJzJ10ubWFwKGtpbmRPZlRlc3QpO1xuXG4vKipcbiAqIFRyaW0gZXhjZXNzIHdoaXRlc3BhY2Ugb2ZmIHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byB0cmltXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIFN0cmluZyBmcmVlZCBvZiBleGNlc3Mgd2hpdGVzcGFjZVxuICovXG5jb25zdCB0cmltID0gKHN0cikgPT4gc3RyLnRyaW0gP1xuICBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLCAnJyk7XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFthbGxPd25LZXlzID0gZmFsc2VdXG4gKiBAcmV0dXJucyB7YW55fVxuICovXG5mdW5jdGlvbiBmb3JFYWNoKG9iaiwgZm4sIHthbGxPd25LZXlzID0gZmFsc2V9ID0ge30pIHtcbiAgLy8gRG9uJ3QgYm90aGVyIGlmIG5vIHZhbHVlIHByb3ZpZGVkXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaTtcbiAgbGV0IGw7XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpbaV0sIGksIG9iaik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEJ1ZmZlciBjaGVja1xuICAgIGlmIChpc0J1ZmZlcihvYmopKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgY29uc3Qga2V5cyA9IGFsbE93bktleXMgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBsZXQga2V5O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kS2V5KG9iaiwga2V5KSB7XG4gIGlmIChpc0J1ZmZlcihvYmopKXtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgbGV0IF9rZXk7XG4gIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgX2tleSA9IGtleXNbaV07XG4gICAgaWYgKGtleSA9PT0gX2tleS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gX2tleTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IF9nbG9iYWwgPSAoKCkgPT4ge1xuICAvKmVzbGludCBuby11bmRlZjowKi9cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gZ2xvYmFsVGhpcztcbiAgcmV0dXJuIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbClcbn0pKCk7XG5cbmNvbnN0IGlzQ29udGV4dERlZmluZWQgPSAoY29udGV4dCkgPT4gIWlzVW5kZWZpbmVkKGNvbnRleHQpICYmIGNvbnRleHQgIT09IF9nbG9iYWw7XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgY29uc3Qge2Nhc2VsZXNzLCBza2lwVW5kZWZpbmVkfSA9IGlzQ29udGV4dERlZmluZWQodGhpcykgJiYgdGhpcyB8fCB7fTtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGNvbnN0IGFzc2lnblZhbHVlID0gKHZhbCwga2V5KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0S2V5ID0gY2FzZWxlc3MgJiYgZmluZEtleShyZXN1bHQsIGtleSkgfHwga2V5O1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFt0YXJnZXRLZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2UocmVzdWx0W3RhcmdldEtleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFt0YXJnZXRLZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIGlmICghc2tpcFVuZGVmaW5lZCB8fCAhaXNVbmRlZmluZWQodmFsKSkge1xuICAgICAgcmVzdWx0W3RhcmdldEtleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYXJndW1lbnRzW2ldICYmIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbE93bktleXNdXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmNvbnN0IGV4dGVuZCA9IChhLCBiLCB0aGlzQXJnLCB7YWxsT3duS2V5c309IHt9KSA9PiB7XG4gIGZvckVhY2goYiwgKHZhbCwga2V5KSA9PiB7XG4gICAgaWYgKHRoaXNBcmcgJiYgaXNGdW5jdGlvbih2YWwpKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0sIHthbGxPd25LZXlzfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gY29udGVudCB2YWx1ZSB3aXRob3V0IEJPTVxuICovXG5jb25zdCBzdHJpcEJPTSA9IChjb250ZW50KSA9PiB7XG4gIGlmIChjb250ZW50LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDEpO1xuICB9XG4gIHJldHVybiBjb250ZW50O1xufVxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcHJvcHNdXG4gKiBAcGFyYW0ge29iamVjdH0gW2Rlc2NyaXB0b3JzXVxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5jb25zdCBpbmhlcml0cyA9IChjb25zdHJ1Y3Rvciwgc3VwZXJDb25zdHJ1Y3RvciwgcHJvcHMsIGRlc2NyaXB0b3JzKSA9PiB7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGRlc2NyaXB0b3JzKTtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3RvciwgJ3N1cGVyJywge1xuICAgIHZhbHVlOiBzdXBlckNvbnN0cnVjdG9yLnByb3RvdHlwZVxuICB9KTtcbiAgcHJvcHMgJiYgT2JqZWN0LmFzc2lnbihjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3BzKTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIG9iamVjdCB3aXRoIGRlZXAgcHJvdG90eXBlIGNoYWluIHRvIGEgZmxhdCBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2VPYmogc291cmNlIG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IFtkZXN0T2JqXVxuICogQHBhcmFtIHtGdW5jdGlvbnxCb29sZWFufSBbZmlsdGVyXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb3BGaWx0ZXJdXG4gKlxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuY29uc3QgdG9GbGF0T2JqZWN0ID0gKHNvdXJjZU9iaiwgZGVzdE9iaiwgZmlsdGVyLCBwcm9wRmlsdGVyKSA9PiB7XG4gIGxldCBwcm9wcztcbiAgbGV0IGk7XG4gIGxldCBwcm9wO1xuICBjb25zdCBtZXJnZWQgPSB7fTtcblxuICBkZXN0T2JqID0gZGVzdE9iaiB8fCB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gIGlmIChzb3VyY2VPYmogPT0gbnVsbCkgcmV0dXJuIGRlc3RPYmo7XG5cbiAgZG8ge1xuICAgIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlT2JqKTtcbiAgICBpID0gcHJvcHMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICBwcm9wID0gcHJvcHNbaV07XG4gICAgICBpZiAoKCFwcm9wRmlsdGVyIHx8IHByb3BGaWx0ZXIocHJvcCwgc291cmNlT2JqLCBkZXN0T2JqKSkgJiYgIW1lcmdlZFtwcm9wXSkge1xuICAgICAgICBkZXN0T2JqW3Byb3BdID0gc291cmNlT2JqW3Byb3BdO1xuICAgICAgICBtZXJnZWRbcHJvcF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2VPYmogPSBmaWx0ZXIgIT09IGZhbHNlICYmIGdldFByb3RvdHlwZU9mKHNvdXJjZU9iaik7XG4gIH0gd2hpbGUgKHNvdXJjZU9iaiAmJiAoIWZpbHRlciB8fCBmaWx0ZXIoc291cmNlT2JqLCBkZXN0T2JqKSkgJiYgc291cmNlT2JqICE9PSBPYmplY3QucHJvdG90eXBlKTtcblxuICByZXR1cm4gZGVzdE9iajtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBzdHJpbmcgZW5kcyB3aXRoIHRoZSBjaGFyYWN0ZXJzIG9mIGEgc3BlY2lmaWVkIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hTdHJpbmdcbiAqIEBwYXJhbSB7TnVtYmVyfSBbcG9zaXRpb249IDBdXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGVuZHNXaXRoID0gKHN0ciwgc2VhcmNoU3RyaW5nLCBwb3NpdGlvbikgPT4ge1xuICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQgfHwgcG9zaXRpb24gPiBzdHIubGVuZ3RoKSB7XG4gICAgcG9zaXRpb24gPSBzdHIubGVuZ3RoO1xuICB9XG4gIHBvc2l0aW9uIC09IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gIGNvbnN0IGxhc3RJbmRleCA9IHN0ci5pbmRleE9mKHNlYXJjaFN0cmluZywgcG9zaXRpb24pO1xuICByZXR1cm4gbGFzdEluZGV4ICE9PSAtMSAmJiBsYXN0SW5kZXggPT09IHBvc2l0aW9uO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyBuZXcgYXJyYXkgZnJvbSBhcnJheSBsaWtlIG9iamVjdCBvciBudWxsIGlmIGZhaWxlZFxuICpcbiAqIEBwYXJhbSB7Kn0gW3RoaW5nXVxuICpcbiAqIEByZXR1cm5zIHs/QXJyYXl9XG4gKi9cbmNvbnN0IHRvQXJyYXkgPSAodGhpbmcpID0+IHtcbiAgaWYgKCF0aGluZykgcmV0dXJuIG51bGw7XG4gIGlmIChpc0FycmF5KHRoaW5nKSkgcmV0dXJuIHRoaW5nO1xuICBsZXQgaSA9IHRoaW5nLmxlbmd0aDtcbiAgaWYgKCFpc051bWJlcihpKSkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShpKTtcbiAgd2hpbGUgKGktLSA+IDApIHtcbiAgICBhcnJbaV0gPSB0aGluZ1tpXTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG4vKipcbiAqIENoZWNraW5nIGlmIHRoZSBVaW50OEFycmF5IGV4aXN0cyBhbmQgaWYgaXQgZG9lcywgaXQgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmIHRoZVxuICogdGhpbmcgcGFzc2VkIGluIGlzIGFuIGluc3RhbmNlIG9mIFVpbnQ4QXJyYXlcbiAqXG4gKiBAcGFyYW0ge1R5cGVkQXJyYXl9XG4gKlxuICogQHJldHVybnMge0FycmF5fVxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuY29uc3QgaXNUeXBlZEFycmF5ID0gKFR5cGVkQXJyYXkgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gdGhpbmcgPT4ge1xuICAgIHJldHVybiBUeXBlZEFycmF5ICYmIHRoaW5nIGluc3RhbmNlb2YgVHlwZWRBcnJheTtcbiAgfTtcbn0pKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBnZXRQcm90b3R5cGVPZihVaW50OEFycmF5KSk7XG5cbi8qKlxuICogRm9yIGVhY2ggZW50cnkgaW4gdGhlIG9iamVjdCwgY2FsbCB0aGUgZnVuY3Rpb24gd2l0aCB0aGUga2V5IGFuZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdDxhbnksIGFueT59IG9iaiAtIFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gLSBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBlbnRyeS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuY29uc3QgZm9yRWFjaEVudHJ5ID0gKG9iaiwgZm4pID0+IHtcbiAgY29uc3QgZ2VuZXJhdG9yID0gb2JqICYmIG9ialtpdGVyYXRvcl07XG5cbiAgY29uc3QgX2l0ZXJhdG9yID0gZ2VuZXJhdG9yLmNhbGwob2JqKTtcblxuICBsZXQgcmVzdWx0O1xuXG4gIHdoaWxlICgocmVzdWx0ID0gX2l0ZXJhdG9yLm5leHQoKSkgJiYgIXJlc3VsdC5kb25lKSB7XG4gICAgY29uc3QgcGFpciA9IHJlc3VsdC52YWx1ZTtcbiAgICBmbi5jYWxsKG9iaiwgcGFpclswXSwgcGFpclsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhbmQgYSBzdHJpbmcsIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgbWF0Y2hlc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdFeHAgLSBUaGUgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGFnYWluc3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIHN0cmluZyB0byBzZWFyY2guXG4gKlxuICogQHJldHVybnMge0FycmF5PGJvb2xlYW4+fVxuICovXG5jb25zdCBtYXRjaEFsbCA9IChyZWdFeHAsIHN0cikgPT4ge1xuICBsZXQgbWF0Y2hlcztcbiAgY29uc3QgYXJyID0gW107XG5cbiAgd2hpbGUgKChtYXRjaGVzID0gcmVnRXhwLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICBhcnIucHVzaChtYXRjaGVzKTtcbiAgfVxuXG4gIHJldHVybiBhcnI7XG59XG5cbi8qIENoZWNraW5nIGlmIHRoZSBraW5kT2ZUZXN0IGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB3aGVuIHBhc3NlZCBhbiBIVE1MRm9ybUVsZW1lbnQuICovXG5jb25zdCBpc0hUTUxGb3JtID0ga2luZE9mVGVzdCgnSFRNTEZvcm1FbGVtZW50Jyk7XG5cbmNvbnN0IHRvQ2FtZWxDYXNlID0gc3RyID0+IHtcbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX1xcc10oW2EtelxcZF0pKFxcdyopL2csXG4gICAgZnVuY3Rpb24gcmVwbGFjZXIobSwgcDEsIHAyKSB7XG4gICAgICByZXR1cm4gcDEudG9VcHBlckNhc2UoKSArIHAyO1xuICAgIH1cbiAgKTtcbn07XG5cbi8qIENyZWF0aW5nIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGNoZWNrIGlmIGFuIG9iamVjdCBoYXMgYSBwcm9wZXJ0eS4gKi9cbmNvbnN0IGhhc093blByb3BlcnR5ID0gKCh7aGFzT3duUHJvcGVydHl9KSA9PiAob2JqLCBwcm9wKSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpKE9iamVjdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuY29uc3QgaXNSZWdFeHAgPSBraW5kT2ZUZXN0KCdSZWdFeHAnKTtcblxuY29uc3QgcmVkdWNlRGVzY3JpcHRvcnMgPSAob2JqLCByZWR1Y2VyKSA9PiB7XG4gIGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMob2JqKTtcbiAgY29uc3QgcmVkdWNlZERlc2NyaXB0b3JzID0ge307XG5cbiAgZm9yRWFjaChkZXNjcmlwdG9ycywgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICBsZXQgcmV0O1xuICAgIGlmICgocmV0ID0gcmVkdWNlcihkZXNjcmlwdG9yLCBuYW1lLCBvYmopKSAhPT0gZmFsc2UpIHtcbiAgICAgIHJlZHVjZWREZXNjcmlwdG9yc1tuYW1lXSA9IHJldCB8fCBkZXNjcmlwdG9yO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqLCByZWR1Y2VkRGVzY3JpcHRvcnMpO1xufVxuXG4vKipcbiAqIE1ha2VzIGFsbCBtZXRob2RzIHJlYWQtb25seVxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmNvbnN0IGZyZWV6ZU1ldGhvZHMgPSAob2JqKSA9PiB7XG4gIHJlZHVjZURlc2NyaXB0b3JzKG9iaiwgKGRlc2NyaXB0b3IsIG5hbWUpID0+IHtcbiAgICAvLyBza2lwIHJlc3RyaWN0ZWQgcHJvcHMgaW4gc3RyaWN0IG1vZGVcbiAgICBpZiAoaXNGdW5jdGlvbihvYmopICYmIFsnYXJndW1lbnRzJywgJ2NhbGxlcicsICdjYWxsZWUnXS5pbmRleE9mKG5hbWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZmFsc2U7XG5cbiAgICBpZiAoJ3dyaXRhYmxlJyBpbiBkZXNjcmlwdG9yKSB7XG4gICAgICBkZXNjcmlwdG9yLndyaXRhYmxlID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQgPSAoKSA9PiB7XG4gICAgICAgIHRocm93IEVycm9yKCdDYW4gbm90IHJld3JpdGUgcmVhZC1vbmx5IG1ldGhvZCBcXCcnICsgbmFtZSArICdcXCcnKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn1cblxuY29uc3QgdG9PYmplY3RTZXQgPSAoYXJyYXlPclN0cmluZywgZGVsaW1pdGVyKSA9PiB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuXG4gIGNvbnN0IGRlZmluZSA9IChhcnIpID0+IHtcbiAgICBhcnIuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICBvYmpbdmFsdWVdID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzQXJyYXkoYXJyYXlPclN0cmluZykgPyBkZWZpbmUoYXJyYXlPclN0cmluZykgOiBkZWZpbmUoU3RyaW5nKGFycmF5T3JTdHJpbmcpLnNwbGl0KGRlbGltaXRlcikpO1xuXG4gIHJldHVybiBvYmo7XG59XG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fVxuXG5jb25zdCB0b0Zpbml0ZU51bWJlciA9ICh2YWx1ZSwgZGVmYXVsdFZhbHVlKSA9PiB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSA9ICt2YWx1ZSkgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZTtcbn1cblxuXG5cbi8qKlxuICogSWYgdGhlIHRoaW5nIGlzIGEgRm9ybURhdGEgb2JqZWN0LCByZXR1cm4gdHJ1ZSwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZS5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IHRoaW5nIC0gVGhlIHRoaW5nIHRvIGNoZWNrLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1NwZWNDb21wbGlhbnRGb3JtKHRoaW5nKSB7XG4gIHJldHVybiAhISh0aGluZyAmJiBpc0Z1bmN0aW9uKHRoaW5nLmFwcGVuZCkgJiYgdGhpbmdbdG9TdHJpbmdUYWddID09PSAnRm9ybURhdGEnICYmIHRoaW5nW2l0ZXJhdG9yXSk7XG59XG5cbmNvbnN0IHRvSlNPTk9iamVjdCA9IChvYmopID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgQXJyYXkoMTApO1xuXG4gIGNvbnN0IHZpc2l0ID0gKHNvdXJjZSwgaSkgPT4ge1xuXG4gICAgaWYgKGlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIGlmIChzdGFjay5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vQnVmZmVyIGNoZWNrXG4gICAgICBpZiAoaXNCdWZmZXIoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgfVxuXG4gICAgICBpZighKCd0b0pTT04nIGluIHNvdXJjZSkpIHtcbiAgICAgICAgc3RhY2tbaV0gPSBzb3VyY2U7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGlzQXJyYXkoc291cmNlKSA/IFtdIDoge307XG5cbiAgICAgICAgZm9yRWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVkdWNlZFZhbHVlID0gdmlzaXQodmFsdWUsIGkgKyAxKTtcbiAgICAgICAgICAhaXNVbmRlZmluZWQocmVkdWNlZFZhbHVlKSAmJiAodGFyZ2V0W2tleV0gPSByZWR1Y2VkVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGFja1tpXSA9IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICByZXR1cm4gdmlzaXQob2JqLCAwKTtcbn1cblxuY29uc3QgaXNBc3luY0ZuID0ga2luZE9mVGVzdCgnQXN5bmNGdW5jdGlvbicpO1xuXG5jb25zdCBpc1RoZW5hYmxlID0gKHRoaW5nKSA9PlxuICB0aGluZyAmJiAoaXNPYmplY3QodGhpbmcpIHx8IGlzRnVuY3Rpb24odGhpbmcpKSAmJiBpc0Z1bmN0aW9uKHRoaW5nLnRoZW4pICYmIGlzRnVuY3Rpb24odGhpbmcuY2F0Y2gpO1xuXG4vLyBvcmlnaW5hbCBjb2RlXG4vLyBodHRwczovL2dpdGh1Yi5jb20vRGlnaXRhbEJyYWluSlMvQXhpb3NQcm9taXNlL2Jsb2IvMTZkZWFiMTM3MTBlYzA5Nzc5OTIyMTMxZjNmYTU5NTQzMjBmODNhYi9saWIvdXRpbHMuanMjTDExLUwzNFxuXG5jb25zdCBfc2V0SW1tZWRpYXRlID0gKChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQsIHBvc3RNZXNzYWdlU3VwcG9ydGVkKSA9PiB7XG4gIGlmIChzZXRJbW1lZGlhdGVTdXBwb3J0ZWQpIHtcbiAgICByZXR1cm4gc2V0SW1tZWRpYXRlO1xuICB9XG5cbiAgcmV0dXJuIHBvc3RNZXNzYWdlU3VwcG9ydGVkID8gKCh0b2tlbiwgY2FsbGJhY2tzKSA9PiB7XG4gICAgX2dsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCAoe3NvdXJjZSwgZGF0YX0pID0+IHtcbiAgICAgIGlmIChzb3VyY2UgPT09IF9nbG9iYWwgJiYgZGF0YSA9PT0gdG9rZW4pIHtcbiAgICAgICAgY2FsbGJhY2tzLmxlbmd0aCAmJiBjYWxsYmFja3Muc2hpZnQoKSgpO1xuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiAoY2IpID0+IHtcbiAgICAgIGNhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICAgIF9nbG9iYWwucG9zdE1lc3NhZ2UodG9rZW4sIFwiKlwiKTtcbiAgICB9XG4gIH0pKGBheGlvc0Ake01hdGgucmFuZG9tKCl9YCwgW10pIDogKGNiKSA9PiBzZXRUaW1lb3V0KGNiKTtcbn0pKFxuICB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLFxuICBpc0Z1bmN0aW9uKF9nbG9iYWwucG9zdE1lc3NhZ2UpXG4pO1xuXG5jb25zdCBhc2FwID0gdHlwZW9mIHF1ZXVlTWljcm90YXNrICE9PSAndW5kZWZpbmVkJyA/XG4gIHF1ZXVlTWljcm90YXNrLmJpbmQoX2dsb2JhbCkgOiAoIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLm5leHRUaWNrIHx8IF9zZXRJbW1lZGlhdGUpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKipcblxuXG5jb25zdCBpc0l0ZXJhYmxlID0gKHRoaW5nKSA9PiB0aGluZyAhPSBudWxsICYmIGlzRnVuY3Rpb24odGhpbmdbaXRlcmF0b3JdKTtcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyLFxuICBpc0Zvcm1EYXRhLFxuICBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmcsXG4gIGlzTnVtYmVyLFxuICBpc0Jvb2xlYW4sXG4gIGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0LFxuICBpc0VtcHR5T2JqZWN0LFxuICBpc1JlYWRhYmxlU3RyZWFtLFxuICBpc1JlcXVlc3QsXG4gIGlzUmVzcG9uc2UsXG4gIGlzSGVhZGVycyxcbiAgaXNVbmRlZmluZWQsXG4gIGlzRGF0ZSxcbiAgaXNGaWxlLFxuICBpc0Jsb2IsXG4gIGlzUmVnRXhwLFxuICBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXMsXG4gIGlzVHlwZWRBcnJheSxcbiAgaXNGaWxlTGlzdCxcbiAgZm9yRWFjaCxcbiAgbWVyZ2UsXG4gIGV4dGVuZCxcbiAgdHJpbSxcbiAgc3RyaXBCT00sXG4gIGluaGVyaXRzLFxuICB0b0ZsYXRPYmplY3QsXG4gIGtpbmRPZixcbiAga2luZE9mVGVzdCxcbiAgZW5kc1dpdGgsXG4gIHRvQXJyYXksXG4gIGZvckVhY2hFbnRyeSxcbiAgbWF0Y2hBbGwsXG4gIGlzSFRNTEZvcm0sXG4gIGhhc093blByb3BlcnR5LFxuICBoYXNPd25Qcm9wOiBoYXNPd25Qcm9wZXJ0eSwgLy8gYW4gYWxpYXMgdG8gYXZvaWQgRVNMaW50IG5vLXByb3RvdHlwZS1idWlsdGlucyBkZXRlY3Rpb25cbiAgcmVkdWNlRGVzY3JpcHRvcnMsXG4gIGZyZWV6ZU1ldGhvZHMsXG4gIHRvT2JqZWN0U2V0LFxuICB0b0NhbWVsQ2FzZSxcbiAgbm9vcCxcbiAgdG9GaW5pdGVOdW1iZXIsXG4gIGZpbmRLZXksXG4gIGdsb2JhbDogX2dsb2JhbCxcbiAgaXNDb250ZXh0RGVmaW5lZCxcbiAgaXNTcGVjQ29tcGxpYW50Rm9ybSxcbiAgdG9KU09OT2JqZWN0LFxuICBpc0FzeW5jRm4sXG4gIGlzVGhlbmFibGUsXG4gIHNldEltbWVkaWF0ZTogX3NldEltbWVkaWF0ZSxcbiAgYXNhcCxcbiAgaXNJdGVyYWJsZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtjb25maWddIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIEF4aW9zRXJyb3IobWVzc2FnZSwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuXG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICB9XG5cbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgdGhpcy5uYW1lID0gJ0F4aW9zRXJyb3InO1xuICBjb2RlICYmICh0aGlzLmNvZGUgPSBjb2RlKTtcbiAgY29uZmlnICYmICh0aGlzLmNvbmZpZyA9IGNvbmZpZyk7XG4gIHJlcXVlc3QgJiYgKHRoaXMucmVxdWVzdCA9IHJlcXVlc3QpO1xuICBpZiAocmVzcG9uc2UpIHtcbiAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgdGhpcy5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXMgPyByZXNwb25zZS5zdGF0dXMgOiBudWxsO1xuICB9XG59XG5cbnV0aWxzLmluaGVyaXRzKEF4aW9zRXJyb3IsIEVycm9yLCB7XG4gIHRvSlNPTjogZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHV0aWxzLnRvSlNPTk9iamVjdCh0aGlzLmNvbmZpZyksXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzXG4gICAgfTtcbiAgfVxufSk7XG5cbmNvbnN0IHByb3RvdHlwZSA9IEF4aW9zRXJyb3IucHJvdG90eXBlO1xuY29uc3QgZGVzY3JpcHRvcnMgPSB7fTtcblxuW1xuICAnRVJSX0JBRF9PUFRJT05fVkFMVUUnLFxuICAnRVJSX0JBRF9PUFRJT04nLFxuICAnRUNPTk5BQk9SVEVEJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFUlJfTkVUV09SSycsXG4gICdFUlJfRlJfVE9PX01BTllfUkVESVJFQ1RTJyxcbiAgJ0VSUl9ERVBSRUNBVEVEJyxcbiAgJ0VSUl9CQURfUkVTUE9OU0UnLFxuICAnRVJSX0JBRF9SRVFVRVNUJyxcbiAgJ0VSUl9DQU5DRUxFRCcsXG4gICdFUlJfTk9UX1NVUFBPUlQnLFxuICAnRVJSX0lOVkFMSURfVVJMJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbl0uZm9yRWFjaChjb2RlID0+IHtcbiAgZGVzY3JpcHRvcnNbY29kZV0gPSB7dmFsdWU6IGNvZGV9O1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEF4aW9zRXJyb3IsIGRlc2NyaXB0b3JzKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsICdpc0F4aW9zRXJyb3InLCB7dmFsdWU6IHRydWV9KTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbkF4aW9zRXJyb3IuZnJvbSA9IChlcnJvciwgY29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSwgY3VzdG9tUHJvcHMpID0+IHtcbiAgY29uc3QgYXhpb3NFcnJvciA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcblxuICB1dGlscy50b0ZsYXRPYmplY3QoZXJyb3IsIGF4aW9zRXJyb3IsIGZ1bmN0aW9uIGZpbHRlcihvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBFcnJvci5wcm90b3R5cGU7XG4gIH0sIHByb3AgPT4ge1xuICAgIHJldHVybiBwcm9wICE9PSAnaXNBeGlvc0Vycm9yJztcbiAgfSk7XG5cbiAgY29uc3QgbXNnID0gZXJyb3IgJiYgZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiAnRXJyb3InO1xuXG4gIC8vIFByZWZlciBleHBsaWNpdCBjb2RlOyBvdGhlcndpc2UgY29weSB0aGUgbG93LWxldmVsIGVycm9yJ3MgY29kZSAoZS5nLiBFQ09OTlJFRlVTRUQpXG4gIGNvbnN0IGVyckNvZGUgPSBjb2RlID09IG51bGwgJiYgZXJyb3IgPyBlcnJvci5jb2RlIDogY29kZTtcbiAgQXhpb3NFcnJvci5jYWxsKGF4aW9zRXJyb3IsIG1zZywgZXJyQ29kZSwgY29uZmlnLCByZXF1ZXN0LCByZXNwb25zZSk7XG5cbiAgLy8gQ2hhaW4gdGhlIG9yaWdpbmFsIGVycm9yIG9uIHRoZSBzdGFuZGFyZCBmaWVsZDsgbm9uLWVudW1lcmFibGUgdG8gYXZvaWQgSlNPTiBub2lzZVxuICBpZiAoZXJyb3IgJiYgYXhpb3NFcnJvci5jYXVzZSA9PSBudWxsKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGF4aW9zRXJyb3IsICdjYXVzZScsIHsgdmFsdWU6IGVycm9yLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gIH1cblxuICBheGlvc0Vycm9yLm5hbWUgPSAoZXJyb3IgJiYgZXJyb3IubmFtZSkgfHwgJ0Vycm9yJztcblxuICBjdXN0b21Qcm9wcyAmJiBPYmplY3QuYXNzaWduKGF4aW9zRXJyb3IsIGN1c3RvbVByb3BzKTtcblxuICByZXR1cm4gYXhpb3NFcnJvcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zRXJyb3I7XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc3RyaWN0XG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbi8vIHRlbXBvcmFyeSBob3RmaXggdG8gYXZvaWQgY2lyY3VsYXIgcmVmZXJlbmNlcyB1bnRpbCBBeGlvc1VSTFNlYXJjaFBhcmFtcyBpcyByZWZhY3RvcmVkXG5pbXBvcnQgUGxhdGZvcm1Gb3JtRGF0YSBmcm9tICcuLi9wbGF0Zm9ybS9ub2RlL2NsYXNzZXMvRm9ybURhdGEuanMnO1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIGdpdmVuIHRoaW5nIGlzIGEgYXJyYXkgb3IganMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGluZyAtIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gYmUgdmlzaXRlZC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNWaXNpdGFibGUodGhpbmcpIHtcbiAgcmV0dXJuIHV0aWxzLmlzUGxhaW5PYmplY3QodGhpbmcpIHx8IHV0aWxzLmlzQXJyYXkodGhpbmcpO1xufVxuXG4vKipcbiAqIEl0IHJlbW92ZXMgdGhlIGJyYWNrZXRzIGZyb20gdGhlIGVuZCBvZiBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBwYXJhbWV0ZXIuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGtleSB3aXRob3V0IHRoZSBicmFja2V0cy5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQnJhY2tldHMoa2V5KSB7XG4gIHJldHVybiB1dGlscy5lbmRzV2l0aChrZXksICdbXScpID8ga2V5LnNsaWNlKDAsIC0yKSA6IGtleTtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIHBhdGgsIGEga2V5LCBhbmQgYSBib29sZWFuLCBhbmQgcmV0dXJucyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHBhdGggdG8gdGhlIGN1cnJlbnQga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGJlaW5nIGl0ZXJhdGVkIG92ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZG90cyAtIElmIHRydWUsIHRoZSBrZXkgd2lsbCBiZSByZW5kZXJlZCB3aXRoIGRvdHMgaW5zdGVhZCBvZiBicmFja2V0cy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcGF0aCB0byB0aGUgY3VycmVudCBrZXkuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcktleShwYXRoLCBrZXksIGRvdHMpIHtcbiAgaWYgKCFwYXRoKSByZXR1cm4ga2V5O1xuICByZXR1cm4gcGF0aC5jb25jYXQoa2V5KS5tYXAoZnVuY3Rpb24gZWFjaCh0b2tlbiwgaSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHRva2VuID0gcmVtb3ZlQnJhY2tldHModG9rZW4pO1xuICAgIHJldHVybiAhZG90cyAmJiBpID8gJ1snICsgdG9rZW4gKyAnXScgOiB0b2tlbjtcbiAgfSkuam9pbihkb3RzID8gJy4nIDogJycpO1xufVxuXG4vKipcbiAqIElmIHRoZSBhcnJheSBpcyBhbiBhcnJheSBhbmQgbm9uZSBvZiBpdHMgZWxlbWVudHMgYXJlIHZpc2l0YWJsZSwgdGhlbiBpdCdzIGEgZmxhdCBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFyciAtIFRoZSBhcnJheSB0byBjaGVja1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc0ZsYXRBcnJheShhcnIpIHtcbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkoYXJyKSAmJiAhYXJyLnNvbWUoaXNWaXNpdGFibGUpO1xufVxuXG5jb25zdCBwcmVkaWNhdGVzID0gdXRpbHMudG9GbGF0T2JqZWN0KHV0aWxzLCB7fSwgbnVsbCwgZnVuY3Rpb24gZmlsdGVyKHByb3ApIHtcbiAgcmV0dXJuIC9eaXNbQS1aXS8udGVzdChwcm9wKTtcbn0pO1xuXG4vKipcbiAqIENvbnZlcnQgYSBkYXRhIG9iamVjdCB0byBGb3JtRGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7P09iamVjdH0gW2Zvcm1EYXRhXVxuICogQHBhcmFtIHs/T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnZpc2l0b3JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm1ldGFUb2tlbnMgPSB0cnVlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5kb3RzID0gZmFsc2VdXG4gKiBAcGFyYW0gez9Cb29sZWFufSBbb3B0aW9ucy5pbmRleGVzID0gZmFsc2VdXG4gKlxuICogQHJldHVybnMge09iamVjdH1cbiAqKi9cblxuLyoqXG4gKiBJdCBjb252ZXJ0cyBhbiBvYmplY3QgaW50byBhIEZvcm1EYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PGFueSwgYW55Pn0gb2JqIC0gVGhlIG9iamVjdCB0byBjb252ZXJ0IHRvIGZvcm0gZGF0YS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtRGF0YSAtIFRoZSBGb3JtRGF0YSBvYmplY3QgdG8gYXBwZW5kIHRvLlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBvcHRpb25zXG4gKlxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gdG9Gb3JtRGF0YShvYmosIGZvcm1EYXRhLCBvcHRpb25zKSB7XG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGZvcm1EYXRhID0gZm9ybURhdGEgfHwgbmV3IChQbGF0Zm9ybUZvcm1EYXRhIHx8IEZvcm1EYXRhKSgpO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBvcHRpb25zID0gdXRpbHMudG9GbGF0T2JqZWN0KG9wdGlvbnMsIHtcbiAgICBtZXRhVG9rZW5zOiB0cnVlLFxuICAgIGRvdHM6IGZhbHNlLFxuICAgIGluZGV4ZXM6IGZhbHNlXG4gIH0sIGZhbHNlLCBmdW5jdGlvbiBkZWZpbmVkKG9wdGlvbiwgc291cmNlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVxLW51bGwsZXFlcWVxXG4gICAgcmV0dXJuICF1dGlscy5pc1VuZGVmaW5lZChzb3VyY2Vbb3B0aW9uXSk7XG4gIH0pO1xuXG4gIGNvbnN0IG1ldGFUb2tlbnMgPSBvcHRpb25zLm1ldGFUb2tlbnM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICBjb25zdCB2aXNpdG9yID0gb3B0aW9ucy52aXNpdG9yIHx8IGRlZmF1bHRWaXNpdG9yO1xuICBjb25zdCBkb3RzID0gb3B0aW9ucy5kb3RzO1xuICBjb25zdCBpbmRleGVzID0gb3B0aW9ucy5pbmRleGVzO1xuICBjb25zdCBfQmxvYiA9IG9wdGlvbnMuQmxvYiB8fCB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgQmxvYjtcbiAgY29uc3QgdXNlQmxvYiA9IF9CbG9iICYmIHV0aWxzLmlzU3BlY0NvbXBsaWFudEZvcm0oZm9ybURhdGEpO1xuXG4gIGlmICghdXRpbHMuaXNGdW5jdGlvbih2aXNpdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3Zpc2l0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0VmFsdWUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiAnJztcblxuICAgIGlmICh1dGlscy5pc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9JU09TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodXRpbHMuaXNCb29sZWFuKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKCF1c2VCbG9iICYmIHV0aWxzLmlzQmxvYih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdCbG9iIGlzIG5vdCBzdXBwb3J0ZWQuIFVzZSBhIEJ1ZmZlciBpbnN0ZWFkLicpO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKHZhbHVlKSB8fCB1dGlscy5pc1R5cGVkQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdXNlQmxvYiAmJiB0eXBlb2YgQmxvYiA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBCbG9iKFt2YWx1ZV0pIDogQnVmZmVyLmZyb20odmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHZpc2l0b3IuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBrZXlcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmd8TnVtYmVyPn0gcGF0aFxuICAgKiBAdGhpcyB7Rm9ybURhdGF9XG4gICAqXG4gICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB0byB2aXNpdCB0aGUgZWFjaCBwcm9wIG9mIHRoZSB2YWx1ZSByZWN1cnNpdmVseVxuICAgKi9cbiAgZnVuY3Rpb24gZGVmYXVsdFZpc2l0b3IodmFsdWUsIGtleSwgcGF0aCkge1xuICAgIGxldCBhcnIgPSB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZSAmJiAhcGF0aCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodXRpbHMuZW5kc1dpdGgoa2V5LCAne30nKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAga2V5ID0gbWV0YVRva2VucyA/IGtleSA6IGtleS5zbGljZSgwLCAtMik7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICh1dGlscy5pc0FycmF5KHZhbHVlKSAmJiBpc0ZsYXRBcnJheSh2YWx1ZSkpIHx8XG4gICAgICAgICgodXRpbHMuaXNGaWxlTGlzdCh2YWx1ZSkgfHwgdXRpbHMuZW5kc1dpdGgoa2V5LCAnW10nKSkgJiYgKGFyciA9IHV0aWxzLnRvQXJyYXkodmFsdWUpKVxuICAgICAgICApKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBrZXkgPSByZW1vdmVCcmFja2V0cyhrZXkpO1xuXG4gICAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIGVhY2goZWwsIGluZGV4KSB7XG4gICAgICAgICAgISh1dGlscy5pc1VuZGVmaW5lZChlbCkgfHwgZWwgPT09IG51bGwpICYmIGZvcm1EYXRhLmFwcGVuZChcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgICAgICAgICAgaW5kZXhlcyA9PT0gdHJ1ZSA/IHJlbmRlcktleShba2V5XSwgaW5kZXgsIGRvdHMpIDogKGluZGV4ZXMgPT09IG51bGwgPyBrZXkgOiBrZXkgKyAnW10nKSxcbiAgICAgICAgICAgIGNvbnZlcnRWYWx1ZShlbClcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpc1Zpc2l0YWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZvcm1EYXRhLmFwcGVuZChyZW5kZXJLZXkocGF0aCwga2V5LCBkb3RzKSwgY29udmVydFZhbHVlKHZhbHVlKSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFjayA9IFtdO1xuXG4gIGNvbnN0IGV4cG9zZWRIZWxwZXJzID0gT2JqZWN0LmFzc2lnbihwcmVkaWNhdGVzLCB7XG4gICAgZGVmYXVsdFZpc2l0b3IsXG4gICAgY29udmVydFZhbHVlLFxuICAgIGlzVmlzaXRhYmxlXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGJ1aWxkKHZhbHVlLCBwYXRoKSB7XG4gICAgaWYgKHV0aWxzLmlzVW5kZWZpbmVkKHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgaWYgKHN0YWNrLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCBpbiAnICsgcGF0aC5qb2luKCcuJykpO1xuICAgIH1cblxuICAgIHN0YWNrLnB1c2godmFsdWUpO1xuXG4gICAgdXRpbHMuZm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gZWFjaChlbCwga2V5KSB7XG4gICAgICBjb25zdCByZXN1bHQgPSAhKHV0aWxzLmlzVW5kZWZpbmVkKGVsKSB8fCBlbCA9PT0gbnVsbCkgJiYgdmlzaXRvci5jYWxsKFxuICAgICAgICBmb3JtRGF0YSwgZWwsIHV0aWxzLmlzU3RyaW5nKGtleSkgPyBrZXkudHJpbSgpIDoga2V5LCBwYXRoLCBleHBvc2VkSGVscGVyc1xuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgICBidWlsZChlbCwgcGF0aCA/IHBhdGguY29uY2F0KGtleSkgOiBba2V5XSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIGlmICghdXRpbHMuaXNPYmplY3Qob2JqKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2RhdGEgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgfVxuXG4gIGJ1aWxkKG9iaik7XG5cbiAgcmV0dXJuIGZvcm1EYXRhO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0b0Zvcm1EYXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdG9Gb3JtRGF0YSBmcm9tICcuL3RvRm9ybURhdGEuanMnO1xuXG4vKipcbiAqIEl0IGVuY29kZXMgYSBzdHJpbmcgYnkgcmVwbGFjaW5nIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBpbiB0aGUgdW5yZXNlcnZlZCBzZXQgd2l0aFxuICogdGhlaXIgcGVyY2VudC1lbmNvZGVkIGVxdWl2YWxlbnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIFRoZSBzdHJpbmcgdG8gZW5jb2RlLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlbmNvZGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHN0cikge1xuICBjb25zdCBjaGFyTWFwID0ge1xuICAgICchJzogJyUyMScsXG4gICAgXCInXCI6ICclMjcnLFxuICAgICcoJzogJyUyOCcsXG4gICAgJyknOiAnJTI5JyxcbiAgICAnfic6ICclN0UnLFxuICAgICclMjAnOiAnKycsXG4gICAgJyUwMCc6ICdcXHgwMCdcbiAgfTtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpfl18JTIwfCUwMC9nLCBmdW5jdGlvbiByZXBsYWNlcihtYXRjaCkge1xuICAgIHJldHVybiBjaGFyTWFwW21hdGNoXTtcbiAgfSk7XG59XG5cbi8qKlxuICogSXQgdGFrZXMgYSBwYXJhbXMgb2JqZWN0IGFuZCBjb252ZXJ0cyBpdCB0byBhIEZvcm1EYXRhIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PHN0cmluZywgYW55Pn0gcGFyYW1zIC0gVGhlIHBhcmFtZXRlcnMgdG8gYmUgY29udmVydGVkIHRvIGEgRm9ybURhdGEgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3Q8c3RyaW5nLCBhbnk+fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgb2JqZWN0IHBhc3NlZCB0byB0aGUgQXhpb3MgY29uc3RydWN0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIEF4aW9zVVJMU2VhcmNoUGFyYW1zKHBhcmFtcywgb3B0aW9ucykge1xuICB0aGlzLl9wYWlycyA9IFtdO1xuXG4gIHBhcmFtcyAmJiB0b0Zvcm1EYXRhKHBhcmFtcywgdGhpcywgb3B0aW9ucyk7XG59XG5cbmNvbnN0IHByb3RvdHlwZSA9IEF4aW9zVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZTtcblxucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIGFwcGVuZChuYW1lLCB2YWx1ZSkge1xuICB0aGlzLl9wYWlycy5wdXNoKFtuYW1lLCB2YWx1ZV0pO1xufTtcblxucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoZW5jb2Rlcikge1xuICBjb25zdCBfZW5jb2RlID0gZW5jb2RlciA/IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGVuY29kZXIuY2FsbCh0aGlzLCB2YWx1ZSwgZW5jb2RlKTtcbiAgfSA6IGVuY29kZTtcblxuICByZXR1cm4gdGhpcy5fcGFpcnMubWFwKGZ1bmN0aW9uIGVhY2gocGFpcikge1xuICAgIHJldHVybiBfZW5jb2RlKHBhaXJbMF0pICsgJz0nICsgX2VuY29kZShwYWlyWzFdKTtcbiAgfSwgJycpLmpvaW4oJyYnKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zVVJMU2VhcmNoUGFyYW1zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IEF4aW9zVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4uL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMnO1xuXG4vKipcbiAqIEl0IHJlcGxhY2VzIGFsbCBpbnN0YW5jZXMgb2YgdGhlIGNoYXJhY3RlcnMgYDpgLCBgJGAsIGAsYCwgYCtgLCBgW2AsIGFuZCBgXWAgd2l0aCB0aGVpclxuICogVVJJIGVuY29kZWQgY291bnRlcnBhcnRzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbCBUaGUgdmFsdWUgdG8gYmUgZW5jb2RlZC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZW5jb2RlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZW5jb2RlKHZhbCkge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkuXG4gICAgcmVwbGFjZSgvJTNBL2dpLCAnOicpLlxuICAgIHJlcGxhY2UoLyUyNC9nLCAnJCcpLlxuICAgIHJlcGxhY2UoLyUyQy9naSwgJywnKS5cbiAgICByZXBsYWNlKC8lMjAvZywgJysnKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcGFyYW0gez8ob2JqZWN0fEZ1bmN0aW9uKX0gb3B0aW9uc1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdXJsXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBvcHRpb25zKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgXG4gIGNvbnN0IF9lbmNvZGUgPSBvcHRpb25zICYmIG9wdGlvbnMuZW5jb2RlIHx8IGVuY29kZTtcblxuICBpZiAodXRpbHMuaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBzZXJpYWxpemU6IG9wdGlvbnNcbiAgICB9O1xuICB9IFxuXG4gIGNvbnN0IHNlcmlhbGl6ZUZuID0gb3B0aW9ucyAmJiBvcHRpb25zLnNlcmlhbGl6ZTtcblxuICBsZXQgc2VyaWFsaXplZFBhcmFtcztcblxuICBpZiAoc2VyaWFsaXplRm4pIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gc2VyaWFsaXplRm4ocGFyYW1zLCBvcHRpb25zKTtcbiAgfSBlbHNlIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gdXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMocGFyYW1zKSA/XG4gICAgICBwYXJhbXMudG9TdHJpbmcoKSA6XG4gICAgICBuZXcgQXhpb3NVUkxTZWFyY2hQYXJhbXMocGFyYW1zLCBvcHRpb25zKS50b1N0cmluZyhfZW5jb2RlKTtcbiAgfVxuXG4gIGlmIChzZXJpYWxpemVkUGFyYW1zKSB7XG4gICAgY29uc3QgaGFzaG1hcmtJbmRleCA9IHVybC5pbmRleE9mKFwiI1wiKTtcblxuICAgIGlmIChoYXNobWFya0luZGV4ICE9PSAtMSkge1xuICAgICAgdXJsID0gdXJsLnNsaWNlKDAsIGhhc2htYXJrSW5kZXgpO1xuICAgIH1cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbmNsYXNzIEludGVyY2VwdG9yTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICAgKi9cbiAgdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmhhbmRsZXJzLnB1c2goe1xuICAgICAgZnVsZmlsbGVkLFxuICAgICAgcmVqZWN0ZWQsXG4gICAgICBzeW5jaHJvbm91czogb3B0aW9ucyA/IG9wdGlvbnMuc3luY2hyb25vdXMgOiBmYWxzZSxcbiAgICAgIHJ1bldoZW46IG9wdGlvbnMgPyBvcHRpb25zLnJ1bldoZW4gOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlcnMubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIFRoZSBJRCB0aGF0IHdhcyByZXR1cm5lZCBieSBgdXNlYFxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBpbnRlcmNlcHRvciB3YXMgcmVtb3ZlZCwgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIGVqZWN0KGlkKSB7XG4gICAgaWYgKHRoaXMuaGFuZGxlcnNbaWRdKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCBpbnRlcmNlcHRvcnMgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBjbGVhcigpIHtcbiAgICBpZiAodGhpcy5oYW5kbGVycykge1xuICAgICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICAgKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBmb3JFYWNoKGZuKSB7XG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLmhhbmRsZXJzLCBmdW5jdGlvbiBmb3JFYWNoSGFuZGxlcihoKSB7XG4gICAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgICBmbihoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2lsZW50SlNPTlBhcnNpbmc6IHRydWUsXG4gIGZvcmNlZEpTT05QYXJzaW5nOiB0cnVlLFxuICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zVVJMU2VhcmNoUGFyYW1zIGZyb20gJy4uLy4uLy4uL2hlbHBlcnMvQXhpb3NVUkxTZWFyY2hQYXJhbXMuanMnO1xuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIFVSTFNlYXJjaFBhcmFtcyAhPT0gJ3VuZGVmaW5lZCcgPyBVUkxTZWFyY2hQYXJhbXMgOiBBeGlvc1VSTFNlYXJjaFBhcmFtcztcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyA/IEZvcm1EYXRhIDogbnVsbDtcbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgPyBCbG9iIDogbnVsbFxuIiwiaW1wb3J0IFVSTFNlYXJjaFBhcmFtcyBmcm9tICcuL2NsYXNzZXMvVVJMU2VhcmNoUGFyYW1zLmpzJ1xuaW1wb3J0IEZvcm1EYXRhIGZyb20gJy4vY2xhc3Nlcy9Gb3JtRGF0YS5qcydcbmltcG9ydCBCbG9iIGZyb20gJy4vY2xhc3Nlcy9CbG9iLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGlzQnJvd3NlcjogdHJ1ZSxcbiAgY2xhc3Nlczoge1xuICAgIFVSTFNlYXJjaFBhcmFtcyxcbiAgICBGb3JtRGF0YSxcbiAgICBCbG9iXG4gIH0sXG4gIHByb3RvY29sczogWydodHRwJywgJ2h0dHBzJywgJ2ZpbGUnLCAnYmxvYicsICd1cmwnLCAnZGF0YSddXG59O1xuIiwiY29uc3QgaGFzQnJvd3NlckVudiA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XG5cbmNvbnN0IF9uYXZpZ2F0b3IgPSB0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3IgfHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB3ZSdyZSBydW5uaW5nIGluIGEgc3RhbmRhcmQgYnJvd3NlciBlbnZpcm9ubWVudFxuICpcbiAqIFRoaXMgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXIsIGFuZCByZWFjdC1uYXRpdmUuXG4gKiBCb3RoIGVudmlyb25tZW50cyBzdXBwb3J0IFhNTEh0dHBSZXF1ZXN0LCBidXQgbm90IGZ1bGx5IHN0YW5kYXJkIGdsb2JhbHMuXG4gKlxuICogd2ViIHdvcmtlcnM6XG4gKiAgdHlwZW9mIHdpbmRvdyAtPiB1bmRlZmluZWRcbiAqICB0eXBlb2YgZG9jdW1lbnQgLT4gdW5kZWZpbmVkXG4gKlxuICogcmVhY3QtbmF0aXZlOlxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdSZWFjdE5hdGl2ZSdcbiAqIG5hdGl2ZXNjcmlwdFxuICogIG5hdmlnYXRvci5wcm9kdWN0IC0+ICdOYXRpdmVTY3JpcHQnIG9yICdOUydcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaGFzU3RhbmRhcmRCcm93c2VyRW52ID0gaGFzQnJvd3NlckVudiAmJlxuICAoIV9uYXZpZ2F0b3IgfHwgWydSZWFjdE5hdGl2ZScsICdOYXRpdmVTY3JpcHQnLCAnTlMnXS5pbmRleE9mKF9uYXZpZ2F0b3IucHJvZHVjdCkgPCAwKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgd2ViV29ya2VyIGVudmlyb25tZW50XG4gKlxuICogQWx0aG91Z2ggdGhlIGBpc1N0YW5kYXJkQnJvd3NlckVudmAgbWV0aG9kIGluZGljYXRlcyB0aGF0XG4gKiBgYWxsb3dzIGF4aW9zIHRvIHJ1biBpbiBhIHdlYiB3b3JrZXJgLCB0aGUgV2ViV29ya2VyIHdpbGwgc3RpbGwgYmVcbiAqIGZpbHRlcmVkIG91dCBkdWUgdG8gaXRzIGp1ZGdtZW50IHN0YW5kYXJkXG4gKiBgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ2AuXG4gKiBUaGlzIGxlYWRzIHRvIGEgcHJvYmxlbSB3aGVuIGF4aW9zIHBvc3QgYEZvcm1EYXRhYCBpbiB3ZWJXb3JrZXJcbiAqL1xuY29uc3QgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52ID0gKCgpID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlICYmXG4gICAgdHlwZW9mIHNlbGYuaW1wb3J0U2NyaXB0cyA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufSkoKTtcblxuY29uc3Qgb3JpZ2luID0gaGFzQnJvd3NlckVudiAmJiB3aW5kb3c/LmxvY2F0aW9uPy5ocmVmIHx8ICdodHRwOi8vbG9jYWxob3N0JztcblxuZXhwb3J0IHtcbiAgaGFzQnJvd3NlckVudixcbiAgaGFzU3RhbmRhcmRCcm93c2VyV2ViV29ya2VyRW52LFxuICBoYXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIF9uYXZpZ2F0b3IgYXMgbmF2aWdhdG9yLFxuICBvcmlnaW5cbn1cbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuL25vZGUvaW5kZXguanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi9jb21tb24vdXRpbHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnV0aWxzLFxuICAuLi5wbGF0Zm9ybVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gdG9Gb3JtRGF0YShkYXRhLCBuZXcgcGxhdGZvcm0uY2xhc3Nlcy5VUkxTZWFyY2hQYXJhbXMoKSwge1xuICAgIHZpc2l0b3I6IGZ1bmN0aW9uKHZhbHVlLCBrZXksIHBhdGgsIGhlbHBlcnMpIHtcbiAgICAgIGlmIChwbGF0Zm9ybS5pc05vZGUgJiYgdXRpbHMuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGtleSwgdmFsdWUudG9TdHJpbmcoJ2Jhc2U2NCcpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVycy5kZWZhdWx0VmlzaXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgLi4ub3B0aW9uc1xuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcblxuLyoqXG4gKiBJdCB0YWtlcyBhIHN0cmluZyBsaWtlIGBmb29beF1beV1bel1gIGFuZCByZXR1cm5zIGFuIGFycmF5IGxpa2UgYFsnZm9vJywgJ3gnLCAneScsICd6J11cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKlxuICogQHJldHVybnMgQW4gYXJyYXkgb2Ygc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VQcm9wUGF0aChuYW1lKSB7XG4gIC8vIGZvb1t4XVt5XVt6XVxuICAvLyBmb28ueC55LnpcbiAgLy8gZm9vLXgteS16XG4gIC8vIGZvbyB4IHkgelxuICByZXR1cm4gdXRpbHMubWF0Y2hBbGwoL1xcdyt8XFxbKFxcdyopXS9nLCBuYW1lKS5tYXAobWF0Y2ggPT4ge1xuICAgIHJldHVybiBtYXRjaFswXSA9PT0gJ1tdJyA/ICcnIDogbWF0Y2hbMV0gfHwgbWF0Y2hbMF07XG4gIH0pO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gYXJyYXkgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8YW55Pn0gYXJyIC0gVGhlIGFycmF5IHRvIGNvbnZlcnQgdG8gYW4gb2JqZWN0LlxuICpcbiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleXMgYW5kIHZhbHVlcyBhcyB0aGUgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5VG9PYmplY3QoYXJyKSB7XG4gIGNvbnN0IG9iaiA9IHt9O1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYXJyKTtcbiAgbGV0IGk7XG4gIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoO1xuICBsZXQga2V5O1xuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBrZXkgPSBrZXlzW2ldO1xuICAgIG9ialtrZXldID0gYXJyW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBJdCB0YWtlcyBhIEZvcm1EYXRhIG9iamVjdCBhbmQgcmV0dXJucyBhIEphdmFTY3JpcHQgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1EYXRhIFRoZSBGb3JtRGF0YSBvYmplY3QgdG8gY29udmVydCB0byBKU09OLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3Q8c3RyaW5nLCBhbnk+IHwgbnVsbH0gVGhlIGNvbnZlcnRlZCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGZvcm1EYXRhVG9KU09OKGZvcm1EYXRhKSB7XG4gIGZ1bmN0aW9uIGJ1aWxkUGF0aChwYXRoLCB2YWx1ZSwgdGFyZ2V0LCBpbmRleCkge1xuICAgIGxldCBuYW1lID0gcGF0aFtpbmRleCsrXTtcblxuICAgIGlmIChuYW1lID09PSAnX19wcm90b19fJykgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCBpc051bWVyaWNLZXkgPSBOdW1iZXIuaXNGaW5pdGUoK25hbWUpO1xuICAgIGNvbnN0IGlzTGFzdCA9IGluZGV4ID49IHBhdGgubGVuZ3RoO1xuICAgIG5hbWUgPSAhbmFtZSAmJiB1dGlscy5pc0FycmF5KHRhcmdldCkgPyB0YXJnZXQubGVuZ3RoIDogbmFtZTtcblxuICAgIGlmIChpc0xhc3QpIHtcbiAgICAgIGlmICh1dGlscy5oYXNPd25Qcm9wKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgdGFyZ2V0W25hbWVdID0gW3RhcmdldFtuYW1lXSwgdmFsdWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAhaXNOdW1lcmljS2V5O1xuICAgIH1cblxuICAgIGlmICghdGFyZ2V0W25hbWVdIHx8ICF1dGlscy5pc09iamVjdCh0YXJnZXRbbmFtZV0pKSB7XG4gICAgICB0YXJnZXRbbmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBidWlsZFBhdGgocGF0aCwgdmFsdWUsIHRhcmdldFtuYW1lXSwgaW5kZXgpO1xuXG4gICAgaWYgKHJlc3VsdCAmJiB1dGlscy5pc0FycmF5KHRhcmdldFtuYW1lXSkpIHtcbiAgICAgIHRhcmdldFtuYW1lXSA9IGFycmF5VG9PYmplY3QodGFyZ2V0W25hbWVdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIWlzTnVtZXJpY0tleTtcbiAgfVxuXG4gIGlmICh1dGlscy5pc0Zvcm1EYXRhKGZvcm1EYXRhKSAmJiB1dGlscy5pc0Z1bmN0aW9uKGZvcm1EYXRhLmVudHJpZXMpKSB7XG4gICAgY29uc3Qgb2JqID0ge307XG5cbiAgICB1dGlscy5mb3JFYWNoRW50cnkoZm9ybURhdGEsIChuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgYnVpbGRQYXRoKHBhcnNlUHJvcFBhdGgobmFtZSksIHZhbHVlLCBvYmosIDApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtRGF0YVRvSlNPTjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4uL2NvcmUvQXhpb3NFcnJvci5qcyc7XG5pbXBvcnQgdHJhbnNpdGlvbmFsRGVmYXVsdHMgZnJvbSAnLi90cmFuc2l0aW9uYWwuanMnO1xuaW1wb3J0IHRvRm9ybURhdGEgZnJvbSAnLi4vaGVscGVycy90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCB0b1VSTEVuY29kZWRGb3JtIGZyb20gJy4uL2hlbHBlcnMvdG9VUkxFbmNvZGVkRm9ybS5qcyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAnLi4vcGxhdGZvcm0vaW5kZXguanMnO1xuaW1wb3J0IGZvcm1EYXRhVG9KU09OIGZyb20gJy4uL2hlbHBlcnMvZm9ybURhdGFUb0pTT04uanMnO1xuXG4vKipcbiAqIEl0IHRha2VzIGEgc3RyaW5nLCB0cmllcyB0byBwYXJzZSBpdCwgYW5kIGlmIGl0IGZhaWxzLCBpdCByZXR1cm5zIHRoZSBzdHJpbmdpZmllZCB2ZXJzaW9uXG4gKiBvZiB0aGUgaW5wdXRcbiAqXG4gKiBAcGFyYW0ge2FueX0gcmF3VmFsdWUgLSBUaGUgdmFsdWUgdG8gYmUgc3RyaW5naWZpZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwYXJzZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIGEgc3RyaW5nIGludG8gYSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVuY29kZXIgLSBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSB2YWx1ZSBhbmQgcmV0dXJucyBhIHN0cmluZy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZ2lmaWVkIHZlcnNpb24gb2YgdGhlIHJhd1ZhbHVlLlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTYWZlbHkocmF3VmFsdWUsIHBhcnNlciwgZW5jb2Rlcikge1xuICBpZiAodXRpbHMuaXNTdHJpbmcocmF3VmFsdWUpKSB7XG4gICAgdHJ5IHtcbiAgICAgIChwYXJzZXIgfHwgSlNPTi5wYXJzZSkocmF3VmFsdWUpO1xuICAgICAgcmV0dXJuIHV0aWxzLnRyaW0ocmF3VmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgIT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gKGVuY29kZXIgfHwgSlNPTi5zdHJpbmdpZnkpKHJhd1ZhbHVlKTtcbn1cblxuY29uc3QgZGVmYXVsdHMgPSB7XG5cbiAgdHJhbnNpdGlvbmFsOiB0cmFuc2l0aW9uYWxEZWZhdWx0cyxcblxuICBhZGFwdGVyOiBbJ3hocicsICdodHRwJywgJ2ZldGNoJ10sXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gaGVhZGVycy5nZXRDb250ZW50VHlwZSgpIHx8ICcnO1xuICAgIGNvbnN0IGhhc0pTT05Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSA+IC0xO1xuICAgIGNvbnN0IGlzT2JqZWN0UGF5bG9hZCA9IHV0aWxzLmlzT2JqZWN0KGRhdGEpO1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCAmJiB1dGlscy5pc0hUTUxGb3JtKGRhdGEpKSB7XG4gICAgICBkYXRhID0gbmV3IEZvcm1EYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRm9ybURhdGEgPSB1dGlscy5pc0Zvcm1EYXRhKGRhdGEpO1xuXG4gICAgaWYgKGlzRm9ybURhdGEpIHtcbiAgICAgIHJldHVybiBoYXNKU09OQ29udGVudFR5cGUgPyBKU09OLnN0cmluZ2lmeShmb3JtRGF0YVRvSlNPTihkYXRhKSkgOiBkYXRhO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0J1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNTdHJlYW0oZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzRmlsZShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCbG9iKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1JlYWRhYmxlU3RyZWFtKGRhdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc1VSTFNlYXJjaFBhcmFtcyhkYXRhKSkge1xuICAgICAgaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnLCBmYWxzZSk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGxldCBpc0ZpbGVMaXN0O1xuXG4gICAgaWYgKGlzT2JqZWN0UGF5bG9hZCkge1xuICAgICAgaWYgKGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRvVVJMRW5jb2RlZEZvcm0oZGF0YSwgdGhpcy5mb3JtU2VyaWFsaXplcikudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChpc0ZpbGVMaXN0ID0gdXRpbHMuaXNGaWxlTGlzdChkYXRhKSkgfHwgY29udGVudFR5cGUuaW5kZXhPZignbXVsdGlwYXJ0L2Zvcm0tZGF0YScpID4gLTEpIHtcbiAgICAgICAgY29uc3QgX0Zvcm1EYXRhID0gdGhpcy5lbnYgJiYgdGhpcy5lbnYuRm9ybURhdGE7XG5cbiAgICAgICAgcmV0dXJuIHRvRm9ybURhdGEoXG4gICAgICAgICAgaXNGaWxlTGlzdCA/IHsnZmlsZXNbXSc6IGRhdGF9IDogZGF0YSxcbiAgICAgICAgICBfRm9ybURhdGEgJiYgbmV3IF9Gb3JtRGF0YSgpLFxuICAgICAgICAgIHRoaXMuZm9ybVNlcmlhbGl6ZXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNPYmplY3RQYXlsb2FkIHx8IGhhc0pTT05Db250ZW50VHlwZSApIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nLCBmYWxzZSk7XG4gICAgICByZXR1cm4gc3RyaW5naWZ5U2FmZWx5KGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XSxcblxuICB0cmFuc2Zvcm1SZXNwb25zZTogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlc3BvbnNlKGRhdGEpIHtcbiAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbCB8fCBkZWZhdWx0cy50cmFuc2l0aW9uYWw7XG4gICAgY29uc3QgZm9yY2VkSlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLmZvcmNlZEpTT05QYXJzaW5nO1xuICAgIGNvbnN0IEpTT05SZXF1ZXN0ZWQgPSB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nO1xuXG4gICAgaWYgKHV0aWxzLmlzUmVzcG9uc2UoZGF0YSkgfHwgdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgJiYgdXRpbHMuaXNTdHJpbmcoZGF0YSkgJiYgKChmb3JjZWRKU09OUGFyc2luZyAmJiAhdGhpcy5yZXNwb25zZVR5cGUpIHx8IEpTT05SZXF1ZXN0ZWQpKSB7XG4gICAgICBjb25zdCBzaWxlbnRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuc2lsZW50SlNPTlBhcnNpbmc7XG4gICAgICBjb25zdCBzdHJpY3RKU09OUGFyc2luZyA9ICFzaWxlbnRKU09OUGFyc2luZyAmJiBKU09OUmVxdWVzdGVkO1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhLCB0aGlzLnBhcnNlUmV2aXZlcik7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlLCBBeGlvc0Vycm9yLkVSUl9CQURfUkVTUE9OU0UsIHRoaXMsIG51bGwsIHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIC8qKlxuICAgKiBBIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIHRvIGFib3J0IGEgcmVxdWVzdC4gSWYgc2V0IHRvIDAgKGRlZmF1bHQpIGFcbiAgICogdGltZW91dCBpcyBub3QgY3JlYXRlZC5cbiAgICovXG4gIHRpbWVvdXQ6IDAsXG5cbiAgeHNyZkNvb2tpZU5hbWU6ICdYU1JGLVRPS0VOJyxcbiAgeHNyZkhlYWRlck5hbWU6ICdYLVhTUkYtVE9LRU4nLFxuXG4gIG1heENvbnRlbnRMZW5ndGg6IC0xLFxuICBtYXhCb2R5TGVuZ3RoOiAtMSxcblxuICBlbnY6IHtcbiAgICBGb3JtRGF0YTogcGxhdGZvcm0uY2xhc3Nlcy5Gb3JtRGF0YSxcbiAgICBCbG9iOiBwbGF0Zm9ybS5jbGFzc2VzLkJsb2JcbiAgfSxcblxuICB2YWxpZGF0ZVN0YXR1czogZnVuY3Rpb24gdmFsaWRhdGVTdGF0dXMoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuICB9LFxuXG4gIGhlYWRlcnM6IHtcbiAgICBjb21tb246IHtcbiAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cbn07XG5cbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgKG1ldGhvZCkgPT4ge1xuICBkZWZhdWx0cy5oZWFkZXJzW21ldGhvZF0gPSB7fTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuXG4vLyBSYXdBeGlvc0hlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG5jb25zdCBpZ25vcmVEdXBsaWNhdGVPZiA9IHV0aWxzLnRvT2JqZWN0U2V0KFtcbiAgJ2FnZScsICdhdXRob3JpemF0aW9uJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ2NvbnRlbnQtdHlwZScsICdldGFnJyxcbiAgJ2V4cGlyZXMnLCAnZnJvbScsICdob3N0JywgJ2lmLW1vZGlmaWVkLXNpbmNlJywgJ2lmLXVubW9kaWZpZWQtc2luY2UnLFxuICAnbGFzdC1tb2RpZmllZCcsICdsb2NhdGlvbicsICdtYXgtZm9yd2FyZHMnLCAncHJveHktYXV0aG9yaXphdGlvbicsXG4gICdyZWZlcmVyJywgJ3JldHJ5LWFmdGVyJywgJ3VzZXItYWdlbnQnXG5dKTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd0hlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9IEhlYWRlcnMgcGFyc2VkIGludG8gYW4gb2JqZWN0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHJhd0hlYWRlcnMgPT4ge1xuICBjb25zdCBwYXJzZWQgPSB7fTtcbiAgbGV0IGtleTtcbiAgbGV0IHZhbDtcbiAgbGV0IGk7XG5cbiAgcmF3SGVhZGVycyAmJiByYXdIZWFkZXJzLnNwbGl0KCdcXG4nKS5mb3JFYWNoKGZ1bmN0aW9uIHBhcnNlcihsaW5lKSB7XG4gICAgaSA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIGkpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IGxpbmUuc3Vic3RyaW5nKGkgKyAxKS50cmltKCk7XG5cbiAgICBpZiAoIWtleSB8fCAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2Zba2V5XSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoa2V5ID09PSAnc2V0LWNvb2tpZScpIHtcbiAgICAgIGlmIChwYXJzZWRba2V5XSkge1xuICAgICAgICBwYXJzZWRba2V5XS5wdXNoKHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWRba2V5XSA9IFt2YWxdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyAnLCAnICsgdmFsIDogdmFsO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBhcnNlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5pbXBvcnQgcGFyc2VIZWFkZXJzIGZyb20gJy4uL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzJztcblxuY29uc3QgJGludGVybmFscyA9IFN5bWJvbCgnaW50ZXJuYWxzJyk7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlciAmJiBTdHJpbmcoaGVhZGVyKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHV0aWxzLmlzQXJyYXkodmFsdWUpID8gdmFsdWUubWFwKG5vcm1hbGl6ZVZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVG9rZW5zKHN0cikge1xuICBjb25zdCB0b2tlbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBjb25zdCB0b2tlbnNSRSA9IC8oW15cXHMsOz1dKylcXHMqKD86PVxccyooW14sO10rKSk/L2c7XG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdG9rZW5zUkUuZXhlYyhzdHIpKSkge1xuICAgIHRva2Vuc1ttYXRjaFsxXV0gPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59XG5cbmNvbnN0IGlzVmFsaWRIZWFkZXJOYW1lID0gKHN0cikgPT4gL15bLV9hLXpBLVowLTleYHx+LCEjJCUmJyorLl0rJC8udGVzdChzdHIudHJpbSgpKTtcblxuZnVuY3Rpb24gbWF0Y2hIZWFkZXJWYWx1ZShjb250ZXh0LCB2YWx1ZSwgaGVhZGVyLCBmaWx0ZXIsIGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICBpZiAodXRpbHMuaXNGdW5jdGlvbihmaWx0ZXIpKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMsIHZhbHVlLCBoZWFkZXIpO1xuICB9XG5cbiAgaWYgKGlzSGVhZGVyTmFtZUZpbHRlcikge1xuICAgIHZhbHVlID0gaGVhZGVyO1xuICB9XG5cbiAgaWYgKCF1dGlscy5pc1N0cmluZyh2YWx1ZSkpIHJldHVybjtcblxuICBpZiAodXRpbHMuaXNTdHJpbmcoZmlsdGVyKSkge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKGZpbHRlcikgIT09IC0xO1xuICB9XG5cbiAgaWYgKHV0aWxzLmlzUmVnRXhwKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmlsdGVyLnRlc3QodmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEhlYWRlcihoZWFkZXIpIHtcbiAgcmV0dXJuIGhlYWRlci50cmltKClcbiAgICAudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oW2EtelxcZF0pKFxcdyopL2csICh3LCBjaGFyLCBzdHIpID0+IHtcbiAgICAgIHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCkgKyBzdHI7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQWNjZXNzb3JzKG9iaiwgaGVhZGVyKSB7XG4gIGNvbnN0IGFjY2Vzc29yTmFtZSA9IHV0aWxzLnRvQ2FtZWxDYXNlKCcgJyArIGhlYWRlcik7XG5cbiAgWydnZXQnLCAnc2V0JywgJ2hhcyddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbWV0aG9kTmFtZSArIGFjY2Vzc29yTmFtZSwge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGFyZzEsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbbWV0aG9kTmFtZV0uY2FsbCh0aGlzLCBoZWFkZXIsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICAgICAgfSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbn1cblxuY2xhc3MgQXhpb3NIZWFkZXJzIHtcbiAgY29uc3RydWN0b3IoaGVhZGVycykge1xuICAgIGhlYWRlcnMgJiYgdGhpcy5zZXQoaGVhZGVycyk7XG4gIH1cblxuICBzZXQoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSwgcmV3cml0ZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gc2V0SGVhZGVyKF92YWx1ZSwgX2hlYWRlciwgX3Jld3JpdGUpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghbEhlYWRlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlYWRlciBuYW1lIG11c3QgYmUgYSBub24tZW1wdHkgc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkoc2VsZiwgbEhlYWRlcik7XG5cbiAgICAgIGlmKCFrZXkgfHwgc2VsZltrZXldID09PSB1bmRlZmluZWQgfHwgX3Jld3JpdGUgPT09IHRydWUgfHwgKF9yZXdyaXRlID09PSB1bmRlZmluZWQgJiYgc2VsZltrZXldICE9PSBmYWxzZSkpIHtcbiAgICAgICAgc2VsZltrZXkgfHwgX2hlYWRlcl0gPSBub3JtYWxpemVWYWx1ZShfdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNldEhlYWRlcnMgPSAoaGVhZGVycywgX3Jld3JpdGUpID0+XG4gICAgICB1dGlscy5mb3JFYWNoKGhlYWRlcnMsIChfdmFsdWUsIF9oZWFkZXIpID0+IHNldEhlYWRlcihfdmFsdWUsIF9oZWFkZXIsIF9yZXdyaXRlKSk7XG5cbiAgICBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChoZWFkZXIpIHx8IGhlYWRlciBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgIHNldEhlYWRlcnMoaGVhZGVyLCB2YWx1ZU9yUmV3cml0ZSlcbiAgICB9IGVsc2UgaWYodXRpbHMuaXNTdHJpbmcoaGVhZGVyKSAmJiAoaGVhZGVyID0gaGVhZGVyLnRyaW0oKSkgJiYgIWlzVmFsaWRIZWFkZXJOYW1lKGhlYWRlcikpIHtcbiAgICAgIHNldEhlYWRlcnMocGFyc2VIZWFkZXJzKGhlYWRlciksIHZhbHVlT3JSZXdyaXRlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzT2JqZWN0KGhlYWRlcikgJiYgdXRpbHMuaXNJdGVyYWJsZShoZWFkZXIpKSB7XG4gICAgICBsZXQgb2JqID0ge30sIGRlc3QsIGtleTtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgaGVhZGVyKSB7XG4gICAgICAgIGlmICghdXRpbHMuaXNBcnJheShlbnRyeSkpIHtcbiAgICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ09iamVjdCBpdGVyYXRvciBtdXN0IHJldHVybiBhIGtleS12YWx1ZSBwYWlyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBvYmpba2V5ID0gZW50cnlbMF1dID0gKGRlc3QgPSBvYmpba2V5XSkgP1xuICAgICAgICAgICh1dGlscy5pc0FycmF5KGRlc3QpID8gWy4uLmRlc3QsIGVudHJ5WzFdXSA6IFtkZXN0LCBlbnRyeVsxXV0pIDogZW50cnlbMV07XG4gICAgICB9XG5cbiAgICAgIHNldEhlYWRlcnMob2JqLCB2YWx1ZU9yUmV3cml0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZGVyICE9IG51bGwgJiYgc2V0SGVhZGVyKHZhbHVlT3JSZXdyaXRlLCBoZWFkZXIsIHJld3JpdGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0KGhlYWRlciwgcGFyc2VyKSB7XG4gICAgaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKGhlYWRlcik7XG5cbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHRoaXMsIGhlYWRlcik7XG5cbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzW2tleV07XG5cbiAgICAgICAgaWYgKCFwYXJzZXIpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5zKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcnNlcikpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VyLmNhbGwodGhpcywgdmFsdWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXRpbHMuaXNSZWdFeHAocGFyc2VyKSkge1xuICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhlYyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwYXJzZXIgbXVzdCBiZSBib29sZWFufHJlZ2V4cHxmdW5jdGlvbicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhcyhoZWFkZXIsIG1hdGNoZXIpIHtcbiAgICBoZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoaGVhZGVyKTtcblxuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGNvbnN0IGtleSA9IHV0aWxzLmZpbmRLZXkodGhpcywgaGVhZGVyKTtcblxuICAgICAgcmV0dXJuICEhKGtleSAmJiB0aGlzW2tleV0gIT09IHVuZGVmaW5lZCAmJiAoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlcikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBkZWxldGUoaGVhZGVyLCBtYXRjaGVyKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGRlbGV0ZWQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUhlYWRlcihfaGVhZGVyKSB7XG4gICAgICBfaGVhZGVyID0gbm9ybWFsaXplSGVhZGVyKF9oZWFkZXIpO1xuXG4gICAgICBpZiAoX2hlYWRlcikge1xuICAgICAgICBjb25zdCBrZXkgPSB1dGlscy5maW5kS2V5KHNlbGYsIF9oZWFkZXIpO1xuXG4gICAgICAgIGlmIChrZXkgJiYgKCFtYXRjaGVyIHx8IG1hdGNoSGVhZGVyVmFsdWUoc2VsZiwgc2VsZltrZXldLCBrZXksIG1hdGNoZXIpKSkge1xuICAgICAgICAgIGRlbGV0ZSBzZWxmW2tleV07XG5cbiAgICAgICAgICBkZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0FycmF5KGhlYWRlcikpIHtcbiAgICAgIGhlYWRlci5mb3JFYWNoKGRlbGV0ZUhlYWRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZUhlYWRlcihoZWFkZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgY2xlYXIobWF0Y2hlcikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICBsZXQgaSA9IGtleXMubGVuZ3RoO1xuICAgIGxldCBkZWxldGVkID0gZmFsc2U7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYoIW1hdGNoZXIgfHwgbWF0Y2hIZWFkZXJWYWx1ZSh0aGlzLCB0aGlzW2tleV0sIGtleSwgbWF0Y2hlciwgdHJ1ZSkpIHtcbiAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgZGVsZXRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbGV0ZWQ7XG4gIH1cblxuICBub3JtYWxpemUoZm9ybWF0KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgaGVhZGVycyA9IHt9O1xuXG4gICAgdXRpbHMuZm9yRWFjaCh0aGlzLCAodmFsdWUsIGhlYWRlcikgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gdXRpbHMuZmluZEtleShoZWFkZXJzLCBoZWFkZXIpO1xuXG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHNlbGZba2V5XSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub3JtYWxpemVkID0gZm9ybWF0ID8gZm9ybWF0SGVhZGVyKGhlYWRlcikgOiBTdHJpbmcoaGVhZGVyKS50cmltKCk7XG5cbiAgICAgIGlmIChub3JtYWxpemVkICE9PSBoZWFkZXIpIHtcbiAgICAgICAgZGVsZXRlIHNlbGZbaGVhZGVyXTtcbiAgICAgIH1cblxuICAgICAgc2VsZltub3JtYWxpemVkXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKTtcblxuICAgICAgaGVhZGVyc1tub3JtYWxpemVkXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNvbmNhdCguLi50YXJnZXRzKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY29uY2F0KHRoaXMsIC4uLnRhcmdldHMpO1xuICB9XG5cbiAgdG9KU09OKGFzU3RyaW5ncykge1xuICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICB1dGlscy5mb3JFYWNoKHRoaXMsICh2YWx1ZSwgaGVhZGVyKSA9PiB7XG4gICAgICB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiAob2JqW2hlYWRlcl0gPSBhc1N0cmluZ3MgJiYgdXRpbHMuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKCcsICcpIDogdmFsdWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLnRvSlNPTigpKVtTeW1ib2wuaXRlcmF0b3JdKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy50b0pTT04oKSkubWFwKChbaGVhZGVyLCB2YWx1ZV0pID0+IGhlYWRlciArICc6ICcgKyB2YWx1ZSkuam9pbignXFxuJyk7XG4gIH1cblxuICBnZXRTZXRDb29raWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KFwic2V0LWNvb2tpZVwiKSB8fCBbXTtcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ0F4aW9zSGVhZGVycyc7XG4gIH1cblxuICBzdGF0aWMgZnJvbSh0aGluZykge1xuICAgIHJldHVybiB0aGluZyBpbnN0YW5jZW9mIHRoaXMgPyB0aGluZyA6IG5ldyB0aGlzKHRoaW5nKTtcbiAgfVxuXG4gIHN0YXRpYyBjb25jYXQoZmlyc3QsIC4uLnRhcmdldHMpIHtcbiAgICBjb25zdCBjb21wdXRlZCA9IG5ldyB0aGlzKGZpcnN0KTtcblxuICAgIHRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiBjb21wdXRlZC5zZXQodGFyZ2V0KSk7XG5cbiAgICByZXR1cm4gY29tcHV0ZWQ7XG4gIH1cblxuICBzdGF0aWMgYWNjZXNzb3IoaGVhZGVyKSB7XG4gICAgY29uc3QgaW50ZXJuYWxzID0gdGhpc1skaW50ZXJuYWxzXSA9ICh0aGlzWyRpbnRlcm5hbHNdID0ge1xuICAgICAgYWNjZXNzb3JzOiB7fVxuICAgIH0pO1xuXG4gICAgY29uc3QgYWNjZXNzb3JzID0gaW50ZXJuYWxzLmFjY2Vzc29ycztcbiAgICBjb25zdCBwcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcblxuICAgIGZ1bmN0aW9uIGRlZmluZUFjY2Vzc29yKF9oZWFkZXIpIHtcbiAgICAgIGNvbnN0IGxIZWFkZXIgPSBub3JtYWxpemVIZWFkZXIoX2hlYWRlcik7XG5cbiAgICAgIGlmICghYWNjZXNzb3JzW2xIZWFkZXJdKSB7XG4gICAgICAgIGJ1aWxkQWNjZXNzb3JzKHByb3RvdHlwZSwgX2hlYWRlcik7XG4gICAgICAgIGFjY2Vzc29yc1tsSGVhZGVyXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHMuaXNBcnJheShoZWFkZXIpID8gaGVhZGVyLmZvckVhY2goZGVmaW5lQWNjZXNzb3IpIDogZGVmaW5lQWNjZXNzb3IoaGVhZGVyKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbkF4aW9zSGVhZGVycy5hY2Nlc3NvcihbJ0NvbnRlbnQtVHlwZScsICdDb250ZW50LUxlbmd0aCcsICdBY2NlcHQnLCAnQWNjZXB0LUVuY29kaW5nJywgJ1VzZXItQWdlbnQnLCAnQXV0aG9yaXphdGlvbiddKTtcblxuLy8gcmVzZXJ2ZWQgbmFtZXMgaG90Zml4XG51dGlscy5yZWR1Y2VEZXNjcmlwdG9ycyhBeGlvc0hlYWRlcnMucHJvdG90eXBlLCAoe3ZhbHVlfSwga2V5KSA9PiB7XG4gIGxldCBtYXBwZWQgPSBrZXlbMF0udG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKTsgLy8gbWFwIGBzZXRgID0+IGBTZXRgXG4gIHJldHVybiB7XG4gICAgZ2V0OiAoKSA9PiB2YWx1ZSxcbiAgICBzZXQoaGVhZGVyVmFsdWUpIHtcbiAgICAgIHRoaXNbbWFwcGVkXSA9IGhlYWRlclZhbHVlO1xuICAgIH1cbiAgfVxufSk7XG5cbnV0aWxzLmZyZWV6ZU1ldGhvZHMoQXhpb3NIZWFkZXJzKTtcblxuZXhwb3J0IGRlZmF1bHQgQXhpb3NIZWFkZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tICcuLi9jb3JlL0F4aW9zSGVhZGVycy5qcyc7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7P09iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShmbnMsIHJlc3BvbnNlKSB7XG4gIGNvbnN0IGNvbmZpZyA9IHRoaXMgfHwgZGVmYXVsdHM7XG4gIGNvbnN0IGNvbnRleHQgPSByZXNwb25zZSB8fCBjb25maWc7XG4gIGNvbnN0IGhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShjb250ZXh0LmhlYWRlcnMpO1xuICBsZXQgZGF0YSA9IGNvbnRleHQuZGF0YTtcblxuICB1dGlscy5mb3JFYWNoKGZucywgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgZGF0YSA9IGZuLmNhbGwoY29uZmlnLCBkYXRhLCBoZWFkZXJzLm5vcm1hbGl6ZSgpLCByZXNwb25zZSA/IHJlc3BvbnNlLnN0YXR1cyA6IHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGhlYWRlcnMubm9ybWFsaXplKCk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSAnLi4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy5qcyc7XG5cbi8qKlxuICogQSBgQ2FuY2VsZWRFcnJvcmAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge09iamVjdD19IHJlcXVlc3QgVGhlIHJlcXVlc3QuXG4gKlxuICogQHJldHVybnMge0NhbmNlbGVkRXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5mdW5jdGlvbiBDYW5jZWxlZEVycm9yKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXEtbnVsbCxlcWVxZXFcbiAgQXhpb3NFcnJvci5jYWxsKHRoaXMsIG1lc3NhZ2UgPT0gbnVsbCA/ICdjYW5jZWxlZCcgOiBtZXNzYWdlLCBBeGlvc0Vycm9yLkVSUl9DQU5DRUxFRCwgY29uZmlnLCByZXF1ZXN0KTtcbiAgdGhpcy5uYW1lID0gJ0NhbmNlbGVkRXJyb3InO1xufVxuXG51dGlscy5pbmhlcml0cyhDYW5jZWxlZEVycm9yLCBBeGlvc0Vycm9yLCB7XG4gIF9fQ0FOQ0VMX186IHRydWVcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDYW5jZWxlZEVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuL0F4aW9zRXJyb3IuanMnO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSByZXNwb25zZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgcmVzcG9uc2UpIHtcbiAgY29uc3QgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIFtBeGlvc0Vycm9yLkVSUl9CQURfUkVRVUVTVCwgQXhpb3NFcnJvci5FUlJfQkFEX1JFU1BPTlNFXVtNYXRoLmZsb29yKHJlc3BvbnNlLnN0YXR1cyAvIDEwMCkgLSA0XSxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlUHJvdG9jb2wodXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gL14oWy0rXFx3XXsxLDI1fSkoOj9cXC9cXC98OikvLmV4ZWModXJsKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdIHx8ICcnO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENhbGN1bGF0ZSBkYXRhIG1heFJhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc2FtcGxlc0NvdW50PSAxMF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbbWluPSAxMDAwXVxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBzcGVlZG9tZXRlcihzYW1wbGVzQ291bnQsIG1pbikge1xuICBzYW1wbGVzQ291bnQgPSBzYW1wbGVzQ291bnQgfHwgMTA7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IEFycmF5KHNhbXBsZXNDb3VudCk7XG4gIGNvbnN0IHRpbWVzdGFtcHMgPSBuZXcgQXJyYXkoc2FtcGxlc0NvdW50KTtcbiAgbGV0IGhlYWQgPSAwO1xuICBsZXQgdGFpbCA9IDA7XG4gIGxldCBmaXJzdFNhbXBsZVRTO1xuXG4gIG1pbiA9IG1pbiAhPT0gdW5kZWZpbmVkID8gbWluIDogMTAwMDtcblxuICByZXR1cm4gZnVuY3Rpb24gcHVzaChjaHVua0xlbmd0aCkge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG5cbiAgICBjb25zdCBzdGFydGVkQXQgPSB0aW1lc3RhbXBzW3RhaWxdO1xuXG4gICAgaWYgKCFmaXJzdFNhbXBsZVRTKSB7XG4gICAgICBmaXJzdFNhbXBsZVRTID0gbm93O1xuICAgIH1cblxuICAgIGJ5dGVzW2hlYWRdID0gY2h1bmtMZW5ndGg7XG4gICAgdGltZXN0YW1wc1toZWFkXSA9IG5vdztcblxuICAgIGxldCBpID0gdGFpbDtcbiAgICBsZXQgYnl0ZXNDb3VudCA9IDA7XG5cbiAgICB3aGlsZSAoaSAhPT0gaGVhZCkge1xuICAgICAgYnl0ZXNDb3VudCArPSBieXRlc1tpKytdO1xuICAgICAgaSA9IGkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaGVhZCA9IChoZWFkICsgMSkgJSBzYW1wbGVzQ291bnQ7XG5cbiAgICBpZiAoaGVhZCA9PT0gdGFpbCkge1xuICAgICAgdGFpbCA9ICh0YWlsICsgMSkgJSBzYW1wbGVzQ291bnQ7XG4gICAgfVxuXG4gICAgaWYgKG5vdyAtIGZpcnN0U2FtcGxlVFMgPCBtaW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXNzZWQgPSBzdGFydGVkQXQgJiYgbm93IC0gc3RhcnRlZEF0O1xuXG4gICAgcmV0dXJuIHBhc3NlZCA/IE1hdGgucm91bmQoYnl0ZXNDb3VudCAqIDEwMDAgLyBwYXNzZWQpIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBzcGVlZG9tZXRlcjtcbiIsIi8qKlxuICogVGhyb3R0bGUgZGVjb3JhdG9yXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IGZyZXFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmbiwgZnJlcSkge1xuICBsZXQgdGltZXN0YW1wID0gMDtcbiAgbGV0IHRocmVzaG9sZCA9IDEwMDAgLyBmcmVxO1xuICBsZXQgbGFzdEFyZ3M7XG4gIGxldCB0aW1lcjtcblxuICBjb25zdCBpbnZva2UgPSAoYXJncywgbm93ID0gRGF0ZS5ub3coKSkgPT4ge1xuICAgIHRpbWVzdGFtcCA9IG5vdztcbiAgICBsYXN0QXJncyA9IG51bGw7XG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgIH1cbiAgICBmbiguLi5hcmdzKTtcbiAgfVxuXG4gIGNvbnN0IHRocm90dGxlZCA9ICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBwYXNzZWQgPSBub3cgLSB0aW1lc3RhbXA7XG4gICAgaWYgKCBwYXNzZWQgPj0gdGhyZXNob2xkKSB7XG4gICAgICBpbnZva2UoYXJncywgbm93KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xuICAgICAgaWYgKCF0aW1lcikge1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICBpbnZva2UobGFzdEFyZ3MpXG4gICAgICAgIH0sIHRocmVzaG9sZCAtIHBhc3NlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZmx1c2ggPSAoKSA9PiBsYXN0QXJncyAmJiBpbnZva2UobGFzdEFyZ3MpO1xuXG4gIHJldHVybiBbdGhyb3R0bGVkLCBmbHVzaF07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRocm90dGxlO1xuIiwiaW1wb3J0IHNwZWVkb21ldGVyIGZyb20gXCIuL3NwZWVkb21ldGVyLmpzXCI7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSBcIi4vdGhyb3R0bGUuanNcIjtcbmltcG9ydCB1dGlscyBmcm9tIFwiLi4vdXRpbHMuanNcIjtcblxuZXhwb3J0IGNvbnN0IHByb2dyZXNzRXZlbnRSZWR1Y2VyID0gKGxpc3RlbmVyLCBpc0Rvd25sb2FkU3RyZWFtLCBmcmVxID0gMykgPT4ge1xuICBsZXQgYnl0ZXNOb3RpZmllZCA9IDA7XG4gIGNvbnN0IF9zcGVlZG9tZXRlciA9IHNwZWVkb21ldGVyKDUwLCAyNTApO1xuXG4gIHJldHVybiB0aHJvdHRsZShlID0+IHtcbiAgICBjb25zdCBsb2FkZWQgPSBlLmxvYWRlZDtcbiAgICBjb25zdCB0b3RhbCA9IGUubGVuZ3RoQ29tcHV0YWJsZSA/IGUudG90YWwgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcHJvZ3Jlc3NCeXRlcyA9IGxvYWRlZCAtIGJ5dGVzTm90aWZpZWQ7XG4gICAgY29uc3QgcmF0ZSA9IF9zcGVlZG9tZXRlcihwcm9ncmVzc0J5dGVzKTtcbiAgICBjb25zdCBpblJhbmdlID0gbG9hZGVkIDw9IHRvdGFsO1xuXG4gICAgYnl0ZXNOb3RpZmllZCA9IGxvYWRlZDtcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBsb2FkZWQsXG4gICAgICB0b3RhbCxcbiAgICAgIHByb2dyZXNzOiB0b3RhbCA/IChsb2FkZWQgLyB0b3RhbCkgOiB1bmRlZmluZWQsXG4gICAgICBieXRlczogcHJvZ3Jlc3NCeXRlcyxcbiAgICAgIHJhdGU6IHJhdGUgPyByYXRlIDogdW5kZWZpbmVkLFxuICAgICAgZXN0aW1hdGVkOiByYXRlICYmIHRvdGFsICYmIGluUmFuZ2UgPyAodG90YWwgLSBsb2FkZWQpIC8gcmF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGV2ZW50OiBlLFxuICAgICAgbGVuZ3RoQ29tcHV0YWJsZTogdG90YWwgIT0gbnVsbCxcbiAgICAgIFtpc0Rvd25sb2FkU3RyZWFtID8gJ2Rvd25sb2FkJyA6ICd1cGxvYWQnXTogdHJ1ZVxuICAgIH07XG5cbiAgICBsaXN0ZW5lcihkYXRhKTtcbiAgfSwgZnJlcSk7XG59XG5cbmV4cG9ydCBjb25zdCBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yID0gKHRvdGFsLCB0aHJvdHRsZWQpID0+IHtcbiAgY29uc3QgbGVuZ3RoQ29tcHV0YWJsZSA9IHRvdGFsICE9IG51bGw7XG5cbiAgcmV0dXJuIFsobG9hZGVkKSA9PiB0aHJvdHRsZWRbMF0oe1xuICAgIGxlbmd0aENvbXB1dGFibGUsXG4gICAgdG90YWwsXG4gICAgbG9hZGVkXG4gIH0pLCB0aHJvdHRsZWRbMV1dO1xufVxuXG5leHBvcnQgY29uc3QgYXN5bmNEZWNvcmF0b3IgPSAoZm4pID0+ICguLi5hcmdzKSA9PiB1dGlscy5hc2FwKCgpID0+IGZuKC4uLmFyZ3MpKTtcbiIsImltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiA/ICgob3JpZ2luLCBpc01TSUUpID0+ICh1cmwpID0+IHtcbiAgdXJsID0gbmV3IFVSTCh1cmwsIHBsYXRmb3JtLm9yaWdpbik7XG5cbiAgcmV0dXJuIChcbiAgICBvcmlnaW4ucHJvdG9jb2wgPT09IHVybC5wcm90b2NvbCAmJlxuICAgIG9yaWdpbi5ob3N0ID09PSB1cmwuaG9zdCAmJlxuICAgIChpc01TSUUgfHwgb3JpZ2luLnBvcnQgPT09IHVybC5wb3J0KVxuICApO1xufSkoXG4gIG5ldyBVUkwocGxhdGZvcm0ub3JpZ2luKSxcbiAgcGxhdGZvcm0ubmF2aWdhdG9yICYmIC8obXNpZXx0cmlkZW50KS9pLnRlc3QocGxhdGZvcm0ubmF2aWdhdG9yLnVzZXJBZ2VudClcbikgOiAoKSA9PiB0cnVlO1xuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJy4uL3BsYXRmb3JtL2luZGV4LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGxhdGZvcm0uaGFzU3RhbmRhcmRCcm93c2VyRW52ID9cblxuICAvLyBTdGFuZGFyZCBicm93c2VyIGVudnMgc3VwcG9ydCBkb2N1bWVudC5jb29raWVcbiAge1xuICAgIHdyaXRlKG5hbWUsIHZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSkge1xuICAgICAgY29uc3QgY29va2llID0gW25hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXTtcblxuICAgICAgdXRpbHMuaXNOdW1iZXIoZXhwaXJlcykgJiYgY29va2llLnB1c2goJ2V4cGlyZXM9JyArIG5ldyBEYXRlKGV4cGlyZXMpLnRvR01UU3RyaW5nKCkpO1xuXG4gICAgICB1dGlscy5pc1N0cmluZyhwYXRoKSAmJiBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG5cbiAgICAgIHV0aWxzLmlzU3RyaW5nKGRvbWFpbikgJiYgY29va2llLnB1c2goJ2RvbWFpbj0nICsgZG9tYWluKTtcblxuICAgICAgc2VjdXJlID09PSB0cnVlICYmIGNvb2tpZS5wdXNoKCdzZWN1cmUnKTtcblxuICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llLmpvaW4oJzsgJyk7XG4gICAgfSxcblxuICAgIHJlYWQobmFtZSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cCgnKF58O1xcXFxzKikoJyArIG5hbWUgKyAnKT0oW147XSopJykpO1xuICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICB9LFxuXG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgIHRoaXMud3JpdGUobmFtZSwgJycsIERhdGUubm93KCkgLSA4NjQwMDAwMCk7XG4gICAgfVxuICB9XG5cbiAgOlxuXG4gIC8vIE5vbi1zdGFuZGFyZCBicm93c2VyIGVudiAod2ViIHdvcmtlcnMsIHJlYWN0LW5hdGl2ZSkgbGFjayBuZWVkZWQgc3VwcG9ydC5cbiAge1xuICAgIHdyaXRlKCkge30sXG4gICAgcmVhZCgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgcmVtb3ZlKCkge31cbiAgfTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHNwZWNpZmllZCBVUkwgaXMgYWJzb2x1dGUsIG90aGVyd2lzZSBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0Fic29sdXRlVVJMKHVybCkge1xuICAvLyBBIFVSTCBpcyBjb25zaWRlcmVkIGFic29sdXRlIGlmIGl0IGJlZ2lucyB3aXRoIFwiPHNjaGVtZT46Ly9cIiBvciBcIi8vXCIgKHByb3RvY29sLXJlbGF0aXZlIFVSTCkuXG4gIC8vIFJGQyAzOTg2IGRlZmluZXMgc2NoZW1lIG5hbWUgYXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJlZ2lubmluZyB3aXRoIGEgbGV0dGVyIGFuZCBmb2xsb3dlZFxuICAvLyBieSBhbnkgY29tYmluYXRpb24gb2YgbGV0dGVycywgZGlnaXRzLCBwbHVzLCBwZXJpb2QsIG9yIGh5cGhlbi5cbiAgcmV0dXJuIC9eKFthLXpdW2EtelxcZCtcXC0uXSo6KT9cXC9cXC8vaS50ZXN0KHVybCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBzcGVjaWZpZWQgVVJMc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbGF0aXZlVVJMIFRoZSByZWxhdGl2ZSBVUkxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgVVJMXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8/XFwvJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgaXNBYnNvbHV0ZVVSTCBmcm9tICcuLi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMnO1xuaW1wb3J0IGNvbWJpbmVVUkxzIGZyb20gJy4uL2hlbHBlcnMvY29tYmluZVVSTHMuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5lZCBmdWxsIHBhdGhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwsIGFsbG93QWJzb2x1dGVVcmxzKSB7XG4gIGxldCBpc1JlbGF0aXZlVXJsID0gIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKTtcbiAgaWYgKGJhc2VVUkwgJiYgKGlzUmVsYXRpdmVVcmwgfHwgYWxsb3dBYnNvbHV0ZVVybHMgPT0gZmFsc2UpKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlcXVlc3RlZFVSTCk7XG4gIH1cbiAgcmV0dXJuIHJlcXVlc3RlZFVSTDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSBcIi4vQXhpb3NIZWFkZXJzLmpzXCI7XG5cbmNvbnN0IGhlYWRlcnNUb09iamVjdCA9ICh0aGluZykgPT4gdGhpbmcgaW5zdGFuY2VvZiBBeGlvc0hlYWRlcnMgPyB7IC4uLnRoaW5nIH0gOiB0aGluZztcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZUNvbmZpZyhjb25maWcxLCBjb25maWcyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICBjb25maWcyID0gY29uZmlnMiB8fCB7fTtcbiAgY29uc3QgY29uZmlnID0ge307XG5cbiAgZnVuY3Rpb24gZ2V0TWVyZ2VkVmFsdWUodGFyZ2V0LCBzb3VyY2UsIHByb3AsIGNhc2VsZXNzKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZS5jYWxsKHtjYXNlbGVzc30sIHRhcmdldCwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHV0aWxzLm1lcmdlKHt9LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gc291cmNlLnNsaWNlKCk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhhLCBiLCBwcm9wICwgY2FzZWxlc3MpIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGIpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoYSwgYiwgcHJvcCAsIGNhc2VsZXNzKTtcbiAgICB9IGVsc2UgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChhKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYSwgcHJvcCAsIGNhc2VsZXNzKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihhLCBiKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChiKSkge1xuICAgICAgcmV0dXJuIGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgYik7XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIoYSwgYikge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoYikpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGIpO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGEpKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBhKTtcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgZnVuY3Rpb24gbWVyZ2VEaXJlY3RLZXlzKGEsIGIsIHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICByZXR1cm4gZ2V0TWVyZ2VkVmFsdWUoYSwgYik7XG4gICAgfSBlbHNlIGlmIChwcm9wIGluIGNvbmZpZzEpIHtcbiAgICAgIHJldHVybiBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGEpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IG1lcmdlTWFwID0ge1xuICAgIHVybDogdmFsdWVGcm9tQ29uZmlnMixcbiAgICBtZXRob2Q6IHZhbHVlRnJvbUNvbmZpZzIsXG4gICAgZGF0YTogdmFsdWVGcm9tQ29uZmlnMixcbiAgICBiYXNlVVJMOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdHJhbnNmb3JtUmVzcG9uc2U6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgcGFyYW1zU2VyaWFsaXplcjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB0aW1lb3V0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRpbWVvdXRNZXNzYWdlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHdpdGhDcmVkZW50aWFsczogZGVmYXVsdFRvQ29uZmlnMixcbiAgICB3aXRoWFNSRlRva2VuOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGFkYXB0ZXI6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgcmVzcG9uc2VUeXBlOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHhzcmZDb29raWVOYW1lOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHhzcmZIZWFkZXJOYW1lOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIG9uVXBsb2FkUHJvZ3Jlc3M6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgb25Eb3dubG9hZFByb2dyZXNzOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGRlY29tcHJlc3M6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgbWF4Q29udGVudExlbmd0aDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBtYXhCb2R5TGVuZ3RoOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIGJlZm9yZVJlZGlyZWN0OiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHRyYW5zcG9ydDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBodHRwQWdlbnQ6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgaHR0cHNBZ2VudDogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBjYW5jZWxUb2tlbjogZGVmYXVsdFRvQ29uZmlnMixcbiAgICBzb2NrZXRQYXRoOiBkZWZhdWx0VG9Db25maWcyLFxuICAgIHJlc3BvbnNlRW5jb2Rpbmc6IGRlZmF1bHRUb0NvbmZpZzIsXG4gICAgdmFsaWRhdGVTdGF0dXM6IG1lcmdlRGlyZWN0S2V5cyxcbiAgICBoZWFkZXJzOiAoYSwgYiAsIHByb3ApID0+IG1lcmdlRGVlcFByb3BlcnRpZXMoaGVhZGVyc1RvT2JqZWN0KGEpLCBoZWFkZXJzVG9PYmplY3QoYikscHJvcCwgdHJ1ZSlcbiAgfTtcblxuICB1dGlscy5mb3JFYWNoKE9iamVjdC5rZXlzKHsuLi5jb25maWcxLCAuLi5jb25maWcyfSksIGZ1bmN0aW9uIGNvbXB1dGVDb25maWdWYWx1ZShwcm9wKSB7XG4gICAgY29uc3QgbWVyZ2UgPSBtZXJnZU1hcFtwcm9wXSB8fCBtZXJnZURlZXBQcm9wZXJ0aWVzO1xuICAgIGNvbnN0IGNvbmZpZ1ZhbHVlID0gbWVyZ2UoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSwgcHJvcCk7XG4gICAgKHV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZ1ZhbHVlKSAmJiBtZXJnZSAhPT0gbWVyZ2VEaXJlY3RLZXlzKSB8fCAoY29uZmlnW3Byb3BdID0gY29uZmlnVmFsdWUpO1xuICB9KTtcblxuICByZXR1cm4gY29uZmlnO1xufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IGlzVVJMU2FtZU9yaWdpbiBmcm9tIFwiLi9pc1VSTFNhbWVPcmlnaW4uanNcIjtcbmltcG9ydCBjb29raWVzIGZyb20gXCIuL2Nvb2tpZXMuanNcIjtcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gXCIuLi9jb3JlL2J1aWxkRnVsbFBhdGguanNcIjtcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tIFwiLi4vY29yZS9tZXJnZUNvbmZpZy5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCBidWlsZFVSTCBmcm9tIFwiLi9idWlsZFVSTC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnKSA9PiB7XG4gIGNvbnN0IG5ld0NvbmZpZyA9IG1lcmdlQ29uZmlnKHt9LCBjb25maWcpO1xuXG4gIGxldCB7IGRhdGEsIHdpdGhYU1JGVG9rZW4sIHhzcmZIZWFkZXJOYW1lLCB4c3JmQ29va2llTmFtZSwgaGVhZGVycywgYXV0aCB9ID0gbmV3Q29uZmlnO1xuXG4gIG5ld0NvbmZpZy5oZWFkZXJzID0gaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGhlYWRlcnMpO1xuXG4gIG5ld0NvbmZpZy51cmwgPSBidWlsZFVSTChidWlsZEZ1bGxQYXRoKG5ld0NvbmZpZy5iYXNlVVJMLCBuZXdDb25maWcudXJsLCBuZXdDb25maWcuYWxsb3dBYnNvbHV0ZVVybHMpLCBjb25maWcucGFyYW1zLCBjb25maWcucGFyYW1zU2VyaWFsaXplcik7XG5cbiAgLy8gSFRUUCBiYXNpYyBhdXRoZW50aWNhdGlvblxuICBpZiAoYXV0aCkge1xuICAgIGhlYWRlcnMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgK1xuICAgICAgYnRvYSgoYXV0aC51c2VybmFtZSB8fCAnJykgKyAnOicgKyAoYXV0aC5wYXNzd29yZCA/IHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChhdXRoLnBhc3N3b3JkKSkgOiAnJykpXG4gICAgKTtcbiAgfVxuXG4gIGlmICh1dGlscy5pc0Zvcm1EYXRhKGRhdGEpKSB7XG4gICAgaWYgKHBsYXRmb3JtLmhhc1N0YW5kYXJkQnJvd3NlckVudiB8fCBwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJXZWJXb3JrZXJFbnYpIHtcbiAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUodW5kZWZpbmVkKTsgLy8gYnJvd3NlciBoYW5kbGVzIGl0XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0Z1bmN0aW9uKGRhdGEuZ2V0SGVhZGVycykpIHtcbiAgICAgIC8vIE5vZGUuanMgRm9ybURhdGEgKGxpa2UgZm9ybS1kYXRhIHBhY2thZ2UpXG4gICAgICBjb25zdCBmb3JtSGVhZGVycyA9IGRhdGEuZ2V0SGVhZGVycygpO1xuICAgICAgLy8gT25seSBzZXQgc2FmZSBoZWFkZXJzIHRvIGF2b2lkIG92ZXJ3cml0aW5nIHNlY3VyaXR5IGhlYWRlcnNcbiAgICAgIGNvbnN0IGFsbG93ZWRIZWFkZXJzID0gWydjb250ZW50LXR5cGUnLCAnY29udGVudC1sZW5ndGgnXTtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGZvcm1IZWFkZXJzKS5mb3JFYWNoKChba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgIGlmIChhbGxvd2VkSGVhZGVycy5pbmNsdWRlcyhrZXkudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICBoZWFkZXJzLnNldChrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSAgXG5cbiAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAvLyBTcGVjaWZpY2FsbHkgbm90IGlmIHdlJ3JlIGluIGEgd2ViIHdvcmtlciwgb3IgcmVhY3QtbmF0aXZlLlxuXG4gIGlmIChwbGF0Zm9ybS5oYXNTdGFuZGFyZEJyb3dzZXJFbnYpIHtcbiAgICB3aXRoWFNSRlRva2VuICYmIHV0aWxzLmlzRnVuY3Rpb24od2l0aFhTUkZUb2tlbikgJiYgKHdpdGhYU1JGVG9rZW4gPSB3aXRoWFNSRlRva2VuKG5ld0NvbmZpZykpO1xuXG4gICAgaWYgKHdpdGhYU1JGVG9rZW4gfHwgKHdpdGhYU1JGVG9rZW4gIT09IGZhbHNlICYmIGlzVVJMU2FtZU9yaWdpbihuZXdDb25maWcudXJsKSkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgY29uc3QgeHNyZlZhbHVlID0geHNyZkhlYWRlck5hbWUgJiYgeHNyZkNvb2tpZU5hbWUgJiYgY29va2llcy5yZWFkKHhzcmZDb29raWVOYW1lKTtcblxuICAgICAgaWYgKHhzcmZWYWx1ZSkge1xuICAgICAgICBoZWFkZXJzLnNldCh4c3JmSGVhZGVyTmFtZSwgeHNyZlZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3Q29uZmlnO1xufVxuXG4iLCJpbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5pbXBvcnQgc2V0dGxlIGZyb20gJy4vLi4vY29yZS9zZXR0bGUuanMnO1xuaW1wb3J0IHRyYW5zaXRpb25hbERlZmF1bHRzIGZyb20gJy4uL2RlZmF1bHRzL3RyYW5zaXRpb25hbC5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSAnLi4vY2FuY2VsL0NhbmNlbGVkRXJyb3IuanMnO1xuaW1wb3J0IHBhcnNlUHJvdG9jb2wgZnJvbSAnLi4vaGVscGVycy9wYXJzZVByb3RvY29sLmpzJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICcuLi9wbGF0Zm9ybS9pbmRleC5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXJ9IGZyb20gJy4uL2hlbHBlcnMvcHJvZ3Jlc3NFdmVudFJlZHVjZXIuanMnO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuXG5jb25zdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgPSB0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09ICd1bmRlZmluZWQnO1xuXG5leHBvcnQgZGVmYXVsdCBpc1hIUkFkYXB0ZXJTdXBwb3J0ZWQgJiYgZnVuY3Rpb24gKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IF9jb25maWcgPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG4gICAgbGV0IHJlcXVlc3REYXRhID0gX2NvbmZpZy5kYXRhO1xuICAgIGNvbnN0IHJlcXVlc3RIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oX2NvbmZpZy5oZWFkZXJzKS5ub3JtYWxpemUoKTtcbiAgICBsZXQge3Jlc3BvbnNlVHlwZSwgb25VcGxvYWRQcm9ncmVzcywgb25Eb3dubG9hZFByb2dyZXNzfSA9IF9jb25maWc7XG4gICAgbGV0IG9uQ2FuY2VsZWQ7XG4gICAgbGV0IHVwbG9hZFRocm90dGxlZCwgZG93bmxvYWRUaHJvdHRsZWQ7XG4gICAgbGV0IGZsdXNoVXBsb2FkLCBmbHVzaERvd25sb2FkO1xuXG4gICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgIGZsdXNoVXBsb2FkICYmIGZsdXNoVXBsb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuICAgICAgZmx1c2hEb3dubG9hZCAmJiBmbHVzaERvd25sb2FkKCk7IC8vIGZsdXNoIGV2ZW50c1xuXG4gICAgICBfY29uZmlnLmNhbmNlbFRva2VuICYmIF9jb25maWcuY2FuY2VsVG9rZW4udW5zdWJzY3JpYmUob25DYW5jZWxlZCk7XG5cbiAgICAgIF9jb25maWcuc2lnbmFsICYmIF9jb25maWcuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25DYW5jZWxlZCk7XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIHJlcXVlc3Qub3BlbihfY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfY29uZmlnLnVybCwgdHJ1ZSk7XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgdGltZW91dCBpbiBNU1xuICAgIHJlcXVlc3QudGltZW91dCA9IF9jb25maWcudGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG9ubG9hZGVuZCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gQXhpb3NIZWFkZXJzLmZyb20oXG4gICAgICAgICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgJiYgcmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9ICFyZXNwb25zZVR5cGUgfHwgcmVzcG9uc2VUeXBlID09PSAndGV4dCcgfHwgcmVzcG9uc2VUeXBlID09PSAnanNvbicgP1xuICAgICAgICByZXF1ZXN0LnJlc3BvbnNlVGV4dCA6IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICByZXF1ZXN0XG4gICAgICB9O1xuXG4gICAgICBzZXR0bGUoZnVuY3Rpb24gX3Jlc29sdmUodmFsdWUpIHtcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIGZ1bmN0aW9uIF9yZWplY3QoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCByZXNwb25zZSk7XG5cbiAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICgnb25sb2FkZW5kJyBpbiByZXF1ZXN0KSB7XG4gICAgICAvLyBVc2Ugb25sb2FkZW5kIGlmIGF2YWlsYWJsZVxuICAgICAgcmVxdWVzdC5vbmxvYWRlbmQgPSBvbmxvYWRlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgcmVhZHkgc3RhdGUgdG8gZW11bGF0ZSBvbmxvYWRlbmRcbiAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlTG9hZCgpIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgICAvLyBoYW5kbGVkIGJ5IG9uZXJyb3IgaW5zdGVhZFxuICAgICAgICAvLyBXaXRoIG9uZSBleGNlcHRpb246IHJlcXVlc3QgdGhhdCB1c2luZyBmaWxlOiBwcm90b2NvbCwgbW9zdCBicm93c2Vyc1xuICAgICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMCAmJiAhKHJlcXVlc3QucmVzcG9uc2VVUkwgJiYgcmVxdWVzdC5yZXNwb25zZVVSTC5pbmRleE9mKCdmaWxlOicpID09PSAwKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWFkeXN0YXRlIGhhbmRsZXIgaXMgY2FsbGluZyBiZWZvcmUgb25lcnJvciBvciBvbnRpbWVvdXQgaGFuZGxlcnMsXG4gICAgICAgIC8vIHNvIHdlIHNob3VsZCBjYWxsIG9ubG9hZGVuZCBvbiB0aGUgbmV4dCAndGljaydcbiAgICAgICAgc2V0VGltZW91dChvbmxvYWRlbmQpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgYnJvd3NlciByZXF1ZXN0IGNhbmNlbGxhdGlvbiAoYXMgb3Bwb3NlZCB0byBhIG1hbnVhbCBjYW5jZWxsYXRpb24pXG4gICAgcmVxdWVzdC5vbmFib3J0ID0gZnVuY3Rpb24gaGFuZGxlQWJvcnQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEF4aW9zRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELCBjb25maWcsIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBsb3cgbGV2ZWwgbmV0d29yayBlcnJvcnNcbiAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXZlbnQpIHtcbiAgICAgICAvLyBCcm93c2VycyBkZWxpdmVyIGEgUHJvZ3Jlc3NFdmVudCBpbiBYSFIgb25lcnJvclxuICAgICAgIC8vIChtZXNzYWdlIG1heSBiZSBlbXB0eTsgd2hlbiBwcmVzZW50LCBzdXJmYWNlIGl0KVxuICAgICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3QvZXJyb3JfZXZlbnRcbiAgICAgICBjb25zdCBtc2cgPSBldmVudCAmJiBldmVudC5tZXNzYWdlID8gZXZlbnQubWVzc2FnZSA6ICdOZXR3b3JrIEVycm9yJztcbiAgICAgICBjb25zdCBlcnIgPSBuZXcgQXhpb3NFcnJvcihtc2csIEF4aW9zRXJyb3IuRVJSX05FVFdPUkssIGNvbmZpZywgcmVxdWVzdCk7XG4gICAgICAgLy8gYXR0YWNoIHRoZSB1bmRlcmx5aW5nIGV2ZW50IGZvciBjb25zdW1lcnMgd2hvIHdhbnQgZGV0YWlsc1xuICAgICAgIGVyci5ldmVudCA9IGV2ZW50IHx8IG51bGw7XG4gICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcbiAgICBcbiAgICAvLyBIYW5kbGUgdGltZW91dFxuICAgIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24gaGFuZGxlVGltZW91dCgpIHtcbiAgICAgIGxldCB0aW1lb3V0RXJyb3JNZXNzYWdlID0gX2NvbmZpZy50aW1lb3V0ID8gJ3RpbWVvdXQgb2YgJyArIF9jb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCcgOiAndGltZW91dCBleGNlZWRlZCc7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uYWwgPSBfY29uZmlnLnRyYW5zaXRpb25hbCB8fCB0cmFuc2l0aW9uYWxEZWZhdWx0cztcbiAgICAgIGlmIChfY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IF9jb25maWcudGltZW91dEVycm9yTWVzc2FnZTtcbiAgICAgIH1cbiAgICAgIHJlamVjdChuZXcgQXhpb3NFcnJvcihcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSxcbiAgICAgICAgdHJhbnNpdGlvbmFsLmNsYXJpZnlUaW1lb3V0RXJyb3IgPyBBeGlvc0Vycm9yLkVUSU1FRE9VVCA6IEF4aW9zRXJyb3IuRUNPTk5BQk9SVEVELFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIFJlbW92ZSBDb250ZW50LVR5cGUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgICByZXF1ZXN0RGF0YSA9PT0gdW5kZWZpbmVkICYmIHJlcXVlc3RIZWFkZXJzLnNldENvbnRlbnRUeXBlKG51bGwpO1xuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMudG9KU09OKCksIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCB3aXRoQ3JlZGVudGlhbHMgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKF9jb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIV9jb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAocmVzcG9uc2VUeXBlICYmIHJlc3BvbnNlVHlwZSAhPT0gJ2pzb24nKSB7XG4gICAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9IF9jb25maWcucmVzcG9uc2VUeXBlO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBwcm9ncmVzcyBpZiBuZWVkZWRcbiAgICBpZiAob25Eb3dubG9hZFByb2dyZXNzKSB7XG4gICAgICAoW2Rvd25sb2FkVGhyb3R0bGVkLCBmbHVzaERvd25sb2FkXSA9IHByb2dyZXNzRXZlbnRSZWR1Y2VyKG9uRG93bmxvYWRQcm9ncmVzcywgdHJ1ZSkpO1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGRvd25sb2FkVGhyb3R0bGVkKTtcbiAgICB9XG5cbiAgICAvLyBOb3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgdXBsb2FkIGV2ZW50c1xuICAgIGlmIChvblVwbG9hZFByb2dyZXNzICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICAoW3VwbG9hZFRocm90dGxlZCwgZmx1c2hVcGxvYWRdID0gcHJvZ3Jlc3NFdmVudFJlZHVjZXIob25VcGxvYWRQcm9ncmVzcykpO1xuXG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIHVwbG9hZFRocm90dGxlZCk7XG5cbiAgICAgIHJlcXVlc3QudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlbmQnLCBmbHVzaFVwbG9hZCk7XG4gICAgfVxuXG4gICAgaWYgKF9jb25maWcuY2FuY2VsVG9rZW4gfHwgX2NvbmZpZy5zaWduYWwpIHtcbiAgICAgIC8vIEhhbmRsZSBjYW5jZWxsYXRpb25cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgICBvbkNhbmNlbGVkID0gY2FuY2VsID0+IHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdCghY2FuY2VsIHx8IGNhbmNlbC50eXBlID8gbmV3IENhbmNlbGVkRXJyb3IobnVsbCwgY29uZmlnLCByZXF1ZXN0KSA6IGNhbmNlbCk7XG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9O1xuXG4gICAgICBfY29uZmlnLmNhbmNlbFRva2VuICYmIF9jb25maWcuY2FuY2VsVG9rZW4uc3Vic2NyaWJlKG9uQ2FuY2VsZWQpO1xuICAgICAgaWYgKF9jb25maWcuc2lnbmFsKSB7XG4gICAgICAgIF9jb25maWcuc2lnbmFsLmFib3J0ZWQgPyBvbkNhbmNlbGVkKCkgOiBfY29uZmlnLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQ2FuY2VsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHByb3RvY29sID0gcGFyc2VQcm90b2NvbChfY29uZmlnLnVybCk7XG5cbiAgICBpZiAocHJvdG9jb2wgJiYgcGxhdGZvcm0ucHJvdG9jb2xzLmluZGV4T2YocHJvdG9jb2wpID09PSAtMSkge1xuICAgICAgcmVqZWN0KG5ldyBBeGlvc0Vycm9yKCdVbnN1cHBvcnRlZCBwcm90b2NvbCAnICsgcHJvdG9jb2wgKyAnOicsIEF4aW9zRXJyb3IuRVJSX0JBRF9SRVFVRVNULCBjb25maWcpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEgfHwgbnVsbCk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IENhbmNlbGVkRXJyb3IgZnJvbSBcIi4uL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzXCI7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tIFwiLi4vY29yZS9BeGlvc0Vycm9yLmpzXCI7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vdXRpbHMuanMnO1xuXG5jb25zdCBjb21wb3NlU2lnbmFscyA9IChzaWduYWxzLCB0aW1lb3V0KSA9PiB7XG4gIGNvbnN0IHtsZW5ndGh9ID0gKHNpZ25hbHMgPSBzaWduYWxzID8gc2lnbmFscy5maWx0ZXIoQm9vbGVhbikgOiBbXSk7XG5cbiAgaWYgKHRpbWVvdXQgfHwgbGVuZ3RoKSB7XG4gICAgbGV0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cbiAgICBsZXQgYWJvcnRlZDtcblxuICAgIGNvbnN0IG9uYWJvcnQgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICBpZiAoIWFib3J0ZWQpIHtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGNvbnN0IGVyciA9IHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVhc29uIDogdGhpcy5yZWFzb247XG4gICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoZXJyIGluc3RhbmNlb2YgQXhpb3NFcnJvciA/IGVyciA6IG5ldyBDYW5jZWxlZEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBlcnIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdGltZXIgPSB0aW1lb3V0ICYmIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgb25hYm9ydChuZXcgQXhpb3NFcnJvcihgdGltZW91dCAke3RpbWVvdXR9IG9mIG1zIGV4Y2VlZGVkYCwgQXhpb3NFcnJvci5FVElNRURPVVQpKVxuICAgIH0sIHRpbWVvdXQpXG5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgIGlmIChzaWduYWxzKSB7XG4gICAgICAgIHRpbWVyICYmIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiB7XG4gICAgICAgICAgc2lnbmFsLnVuc3Vic2NyaWJlID8gc2lnbmFsLnVuc3Vic2NyaWJlKG9uYWJvcnQpIDogc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduYWxzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaWduYWxzLmZvckVhY2goKHNpZ25hbCkgPT4gc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25hYm9ydCkpO1xuXG4gICAgY29uc3Qge3NpZ25hbH0gPSBjb250cm9sbGVyO1xuXG4gICAgc2lnbmFsLnVuc3Vic2NyaWJlID0gKCkgPT4gdXRpbHMuYXNhcCh1bnN1YnNjcmliZSk7XG5cbiAgICByZXR1cm4gc2lnbmFsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2VTaWduYWxzO1xuIiwiXG5leHBvcnQgY29uc3Qgc3RyZWFtQ2h1bmsgPSBmdW5jdGlvbiogKGNodW5rLCBjaHVua1NpemUpIHtcbiAgbGV0IGxlbiA9IGNodW5rLmJ5dGVMZW5ndGg7XG5cbiAgaWYgKCFjaHVua1NpemUgfHwgbGVuIDwgY2h1bmtTaXplKSB7XG4gICAgeWllbGQgY2h1bms7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHBvcyA9IDA7XG4gIGxldCBlbmQ7XG5cbiAgd2hpbGUgKHBvcyA8IGxlbikge1xuICAgIGVuZCA9IHBvcyArIGNodW5rU2l6ZTtcbiAgICB5aWVsZCBjaHVuay5zbGljZShwb3MsIGVuZCk7XG4gICAgcG9zID0gZW5kO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWFkQnl0ZXMgPSBhc3luYyBmdW5jdGlvbiogKGl0ZXJhYmxlLCBjaHVua1NpemUpIHtcbiAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiByZWFkU3RyZWFtKGl0ZXJhYmxlKSkge1xuICAgIHlpZWxkKiBzdHJlYW1DaHVuayhjaHVuaywgY2h1bmtTaXplKTtcbiAgfVxufVxuXG5jb25zdCByZWFkU3RyZWFtID0gYXN5bmMgZnVuY3Rpb24qIChzdHJlYW0pIHtcbiAgaWYgKHN0cmVhbVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0pIHtcbiAgICB5aWVsZCogc3RyZWFtO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlYWRlciA9IHN0cmVhbS5nZXRSZWFkZXIoKTtcbiAgdHJ5IHtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBjb25zdCB7ZG9uZSwgdmFsdWV9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgeWllbGQgdmFsdWU7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IHJlYWRlci5jYW5jZWwoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdHJhY2tTdHJlYW0gPSAoc3RyZWFtLCBjaHVua1NpemUsIG9uUHJvZ3Jlc3MsIG9uRmluaXNoKSA9PiB7XG4gIGNvbnN0IGl0ZXJhdG9yID0gcmVhZEJ5dGVzKHN0cmVhbSwgY2h1bmtTaXplKTtcblxuICBsZXQgYnl0ZXMgPSAwO1xuICBsZXQgZG9uZTtcbiAgbGV0IF9vbkZpbmlzaCA9IChlKSA9PiB7XG4gICAgaWYgKCFkb25lKSB7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIG9uRmluaXNoICYmIG9uRmluaXNoKGUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgUmVhZGFibGVTdHJlYW0oe1xuICAgIGFzeW5jIHB1bGwoY29udHJvbGxlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qge2RvbmUsIHZhbHVlfSA9IGF3YWl0IGl0ZXJhdG9yLm5leHQoKTtcblxuICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgX29uRmluaXNoKCk7XG4gICAgICAgICAgY29udHJvbGxlci5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsZW4gPSB2YWx1ZS5ieXRlTGVuZ3RoO1xuICAgICAgICBpZiAob25Qcm9ncmVzcykge1xuICAgICAgICAgIGxldCBsb2FkZWRCeXRlcyA9IGJ5dGVzICs9IGxlbjtcbiAgICAgICAgICBvblByb2dyZXNzKGxvYWRlZEJ5dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBjb250cm9sbGVyLmVucXVldWUobmV3IFVpbnQ4QXJyYXkodmFsdWUpKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfb25GaW5pc2goZXJyKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH0sXG4gICAgY2FuY2VsKHJlYXNvbikge1xuICAgICAgX29uRmluaXNoKHJlYXNvbik7XG4gICAgICByZXR1cm4gaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgfVxuICB9LCB7XG4gICAgaGlnaFdhdGVyTWFyazogMlxuICB9KVxufVxuIiwiaW1wb3J0IHBsYXRmb3JtIGZyb20gXCIuLi9wbGF0Zm9ybS9pbmRleC5qc1wiO1xuaW1wb3J0IHV0aWxzIGZyb20gXCIuLi91dGlscy5qc1wiO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuaW1wb3J0IGNvbXBvc2VTaWduYWxzIGZyb20gXCIuLi9oZWxwZXJzL2NvbXBvc2VTaWduYWxzLmpzXCI7XG5pbXBvcnQge3RyYWNrU3RyZWFtfSBmcm9tIFwiLi4vaGVscGVycy90cmFja1N0cmVhbS5qc1wiO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi4vY29yZS9BeGlvc0hlYWRlcnMuanNcIjtcbmltcG9ydCB7cHJvZ3Jlc3NFdmVudFJlZHVjZXIsIHByb2dyZXNzRXZlbnREZWNvcmF0b3IsIGFzeW5jRGVjb3JhdG9yfSBmcm9tIFwiLi4vaGVscGVycy9wcm9ncmVzc0V2ZW50UmVkdWNlci5qc1wiO1xuaW1wb3J0IHJlc29sdmVDb25maWcgZnJvbSBcIi4uL2hlbHBlcnMvcmVzb2x2ZUNvbmZpZy5qc1wiO1xuaW1wb3J0IHNldHRsZSBmcm9tIFwiLi4vY29yZS9zZXR0bGUuanNcIjtcblxuY29uc3QgREVGQVVMVF9DSFVOS19TSVpFID0gNjQgKiAxMDI0O1xuXG5jb25zdCB7aXNGdW5jdGlvbn0gPSB1dGlscztcblxuY29uc3QgZ2xvYmFsRmV0Y2hBUEkgPSAoKHtSZXF1ZXN0LCBSZXNwb25zZX0pID0+ICh7XG4gIFJlcXVlc3QsIFJlc3BvbnNlXG59KSkodXRpbHMuZ2xvYmFsKTtcblxuY29uc3Qge1xuICBSZWFkYWJsZVN0cmVhbSwgVGV4dEVuY29kZXJcbn0gPSB1dGlscy5nbG9iYWw7XG5cblxuY29uc3QgdGVzdCA9IChmbiwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiAhIWZuKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuY29uc3QgZmFjdG9yeSA9IChlbnYpID0+IHtcbiAgZW52ID0gdXRpbHMubWVyZ2UuY2FsbCh7XG4gICAgc2tpcFVuZGVmaW5lZDogdHJ1ZVxuICB9LCBnbG9iYWxGZXRjaEFQSSwgZW52KTtcblxuICBjb25zdCB7ZmV0Y2g6IGVudkZldGNoLCBSZXF1ZXN0LCBSZXNwb25zZX0gPSBlbnY7XG4gIGNvbnN0IGlzRmV0Y2hTdXBwb3J0ZWQgPSBlbnZGZXRjaCA/IGlzRnVuY3Rpb24oZW52RmV0Y2gpIDogdHlwZW9mIGZldGNoID09PSAnZnVuY3Rpb24nO1xuICBjb25zdCBpc1JlcXVlc3RTdXBwb3J0ZWQgPSBpc0Z1bmN0aW9uKFJlcXVlc3QpO1xuICBjb25zdCBpc1Jlc3BvbnNlU3VwcG9ydGVkID0gaXNGdW5jdGlvbihSZXNwb25zZSk7XG5cbiAgaWYgKCFpc0ZldGNoU3VwcG9ydGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCA9IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgaXNGdW5jdGlvbihSZWFkYWJsZVN0cmVhbSk7XG5cbiAgY29uc3QgZW5jb2RlVGV4dCA9IGlzRmV0Y2hTdXBwb3J0ZWQgJiYgKHR5cGVvZiBUZXh0RW5jb2RlciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAoKGVuY29kZXIpID0+IChzdHIpID0+IGVuY29kZXIuZW5jb2RlKHN0cikpKG5ldyBUZXh0RW5jb2RlcigpKSA6XG4gICAgICBhc3luYyAoc3RyKSA9PiBuZXcgVWludDhBcnJheShhd2FpdCBuZXcgUmVxdWVzdChzdHIpLmFycmF5QnVmZmVyKCkpXG4gICk7XG5cbiAgY29uc3Qgc3VwcG9ydHNSZXF1ZXN0U3RyZWFtID0gaXNSZXF1ZXN0U3VwcG9ydGVkICYmIGlzUmVhZGFibGVTdHJlYW1TdXBwb3J0ZWQgJiYgdGVzdCgoKSA9PiB7XG4gICAgbGV0IGR1cGxleEFjY2Vzc2VkID0gZmFsc2U7XG5cbiAgICBjb25zdCBoYXNDb250ZW50VHlwZSA9IG5ldyBSZXF1ZXN0KHBsYXRmb3JtLm9yaWdpbiwge1xuICAgICAgYm9keTogbmV3IFJlYWRhYmxlU3RyZWFtKCksXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGdldCBkdXBsZXgoKSB7XG4gICAgICAgIGR1cGxleEFjY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuICdoYWxmJztcbiAgICAgIH0sXG4gICAgfSkuaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpO1xuXG4gICAgcmV0dXJuIGR1cGxleEFjY2Vzc2VkICYmICFoYXNDb250ZW50VHlwZTtcbiAgfSk7XG5cbiAgY29uc3Qgc3VwcG9ydHNSZXNwb25zZVN0cmVhbSA9IGlzUmVzcG9uc2VTdXBwb3J0ZWQgJiYgaXNSZWFkYWJsZVN0cmVhbVN1cHBvcnRlZCAmJlxuICAgIHRlc3QoKCkgPT4gdXRpbHMuaXNSZWFkYWJsZVN0cmVhbShuZXcgUmVzcG9uc2UoJycpLmJvZHkpKTtcblxuICBjb25zdCByZXNvbHZlcnMgPSB7XG4gICAgc3RyZWFtOiBzdXBwb3J0c1Jlc3BvbnNlU3RyZWFtICYmICgocmVzKSA9PiByZXMuYm9keSlcbiAgfTtcblxuICBpc0ZldGNoU3VwcG9ydGVkICYmICgoKCkgPT4ge1xuICAgIFsndGV4dCcsICdhcnJheUJ1ZmZlcicsICdibG9iJywgJ2Zvcm1EYXRhJywgJ3N0cmVhbSddLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAhcmVzb2x2ZXJzW3R5cGVdICYmIChyZXNvbHZlcnNbdHlwZV0gPSAocmVzLCBjb25maWcpID0+IHtcbiAgICAgICAgbGV0IG1ldGhvZCA9IHJlcyAmJiByZXNbdHlwZV07XG5cbiAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbChyZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoYFJlc3BvbnNlIHR5cGUgJyR7dHlwZX0nIGlzIG5vdCBzdXBwb3J0ZWRgLCBBeGlvc0Vycm9yLkVSUl9OT1RfU1VQUE9SVCwgY29uZmlnKTtcbiAgICAgIH0pXG4gICAgfSk7XG4gIH0pKCkpO1xuXG4gIGNvbnN0IGdldEJvZHlMZW5ndGggPSBhc3luYyAoYm9keSkgPT4ge1xuICAgIGlmIChib2R5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc0Jsb2IoYm9keSkpIHtcbiAgICAgIHJldHVybiBib2R5LnNpemU7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzU3BlY0NvbXBsaWFudEZvcm0oYm9keSkpIHtcbiAgICAgIGNvbnN0IF9yZXF1ZXN0ID0gbmV3IFJlcXVlc3QocGxhdGZvcm0ub3JpZ2luLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5LFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gKGF3YWl0IF9yZXF1ZXN0LmFycmF5QnVmZmVyKCkpLmJ5dGVMZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpIHx8IHV0aWxzLmlzQXJyYXlCdWZmZXIoYm9keSkpIHtcbiAgICAgIHJldHVybiBib2R5LmJ5dGVMZW5ndGg7XG4gICAgfVxuXG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpKSB7XG4gICAgICBib2R5ID0gYm9keSArICcnO1xuICAgIH1cblxuICAgIGlmICh1dGlscy5pc1N0cmluZyhib2R5KSkge1xuICAgICAgcmV0dXJuIChhd2FpdCBlbmNvZGVUZXh0KGJvZHkpKS5ieXRlTGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc29sdmVCb2R5TGVuZ3RoID0gYXN5bmMgKGhlYWRlcnMsIGJvZHkpID0+IHtcbiAgICBjb25zdCBsZW5ndGggPSB1dGlscy50b0Zpbml0ZU51bWJlcihoZWFkZXJzLmdldENvbnRlbnRMZW5ndGgoKSk7XG5cbiAgICByZXR1cm4gbGVuZ3RoID09IG51bGwgPyBnZXRCb2R5TGVuZ3RoKGJvZHkpIDogbGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIGFzeW5jIChjb25maWcpID0+IHtcbiAgICBsZXQge1xuICAgICAgdXJsLFxuICAgICAgbWV0aG9kLFxuICAgICAgZGF0YSxcbiAgICAgIHNpZ25hbCxcbiAgICAgIGNhbmNlbFRva2VuLFxuICAgICAgdGltZW91dCxcbiAgICAgIG9uRG93bmxvYWRQcm9ncmVzcyxcbiAgICAgIG9uVXBsb2FkUHJvZ3Jlc3MsXG4gICAgICByZXNwb25zZVR5cGUsXG4gICAgICBoZWFkZXJzLFxuICAgICAgd2l0aENyZWRlbnRpYWxzID0gJ3NhbWUtb3JpZ2luJyxcbiAgICAgIGZldGNoT3B0aW9uc1xuICAgIH0gPSByZXNvbHZlQ29uZmlnKGNvbmZpZyk7XG5cbiAgICBsZXQgX2ZldGNoID0gZW52RmV0Y2ggfHwgZmV0Y2g7XG5cbiAgICByZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGUgPyAocmVzcG9uc2VUeXBlICsgJycpLnRvTG93ZXJDYXNlKCkgOiAndGV4dCc7XG5cbiAgICBsZXQgY29tcG9zZWRTaWduYWwgPSBjb21wb3NlU2lnbmFscyhbc2lnbmFsLCBjYW5jZWxUb2tlbiAmJiBjYW5jZWxUb2tlbi50b0Fib3J0U2lnbmFsKCldLCB0aW1lb3V0KTtcblxuICAgIGxldCByZXF1ZXN0ID0gbnVsbDtcblxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gY29tcG9zZWRTaWduYWwgJiYgY29tcG9zZWRTaWduYWwudW5zdWJzY3JpYmUgJiYgKCgpID0+IHtcbiAgICAgIGNvbXBvc2VkU2lnbmFsLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcmVxdWVzdENvbnRlbnRMZW5ndGg7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKFxuICAgICAgICBvblVwbG9hZFByb2dyZXNzICYmIHN1cHBvcnRzUmVxdWVzdFN0cmVhbSAmJiBtZXRob2QgIT09ICdnZXQnICYmIG1ldGhvZCAhPT0gJ2hlYWQnICYmXG4gICAgICAgIChyZXF1ZXN0Q29udGVudExlbmd0aCA9IGF3YWl0IHJlc29sdmVCb2R5TGVuZ3RoKGhlYWRlcnMsIGRhdGEpKSAhPT0gMFxuICAgICAgKSB7XG4gICAgICAgIGxldCBfcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgICAgZHVwbGV4OiBcImhhbGZcIlxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgY29udGVudFR5cGVIZWFkZXI7XG5cbiAgICAgICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgJiYgKGNvbnRlbnRUeXBlSGVhZGVyID0gX3JlcXVlc3QuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSkge1xuICAgICAgICAgIGhlYWRlcnMuc2V0Q29udGVudFR5cGUoY29udGVudFR5cGVIZWFkZXIpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3JlcXVlc3QuYm9keSkge1xuICAgICAgICAgIGNvbnN0IFtvblByb2dyZXNzLCBmbHVzaF0gPSBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yKFxuICAgICAgICAgICAgcmVxdWVzdENvbnRlbnRMZW5ndGgsXG4gICAgICAgICAgICBwcm9ncmVzc0V2ZW50UmVkdWNlcihhc3luY0RlY29yYXRvcihvblVwbG9hZFByb2dyZXNzKSlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgZGF0YSA9IHRyYWNrU3RyZWFtKF9yZXF1ZXN0LmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Qcm9ncmVzcywgZmx1c2gpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdXRpbHMuaXNTdHJpbmcod2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgICB3aXRoQ3JlZGVudGlhbHMgPSB3aXRoQ3JlZGVudGlhbHMgPyAnaW5jbHVkZScgOiAnb21pdCc7XG4gICAgICB9XG5cbiAgICAgIC8vIENsb3VkZmxhcmUgV29ya2VycyB0aHJvd3Mgd2hlbiBjcmVkZW50aWFscyBhcmUgZGVmaW5lZFxuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jbG91ZGZsYXJlL3dvcmtlcmQvaXNzdWVzLzkwMlxuICAgICAgY29uc3QgaXNDcmVkZW50aWFsc1N1cHBvcnRlZCA9IGlzUmVxdWVzdFN1cHBvcnRlZCAmJiBcImNyZWRlbnRpYWxzXCIgaW4gUmVxdWVzdC5wcm90b3R5cGU7XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkT3B0aW9ucyA9IHtcbiAgICAgICAgLi4uZmV0Y2hPcHRpb25zLFxuICAgICAgICBzaWduYWw6IGNvbXBvc2VkU2lnbmFsLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZC50b1VwcGVyQ2FzZSgpLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLm5vcm1hbGl6ZSgpLnRvSlNPTigpLFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBkdXBsZXg6IFwiaGFsZlwiLFxuICAgICAgICBjcmVkZW50aWFsczogaXNDcmVkZW50aWFsc1N1cHBvcnRlZCA/IHdpdGhDcmVkZW50aWFscyA6IHVuZGVmaW5lZFxuICAgICAgfTtcblxuICAgICAgcmVxdWVzdCA9IGlzUmVxdWVzdFN1cHBvcnRlZCAmJiBuZXcgUmVxdWVzdCh1cmwsIHJlc29sdmVkT3B0aW9ucyk7XG5cbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IChpc1JlcXVlc3RTdXBwb3J0ZWQgPyBfZmV0Y2gocmVxdWVzdCwgZmV0Y2hPcHRpb25zKSA6IF9mZXRjaCh1cmwsIHJlc29sdmVkT3B0aW9ucykpO1xuXG4gICAgICBjb25zdCBpc1N0cmVhbVJlc3BvbnNlID0gc3VwcG9ydHNSZXNwb25zZVN0cmVhbSAmJiAocmVzcG9uc2VUeXBlID09PSAnc3RyZWFtJyB8fCByZXNwb25zZVR5cGUgPT09ICdyZXNwb25zZScpO1xuXG4gICAgICBpZiAoc3VwcG9ydHNSZXNwb25zZVN0cmVhbSAmJiAob25Eb3dubG9hZFByb2dyZXNzIHx8IChpc1N0cmVhbVJlc3BvbnNlICYmIHVuc3Vic2NyaWJlKSkpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIFsnc3RhdHVzJywgJ3N0YXR1c1RleHQnLCAnaGVhZGVycyddLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICAgICAgb3B0aW9uc1twcm9wXSA9IHJlc3BvbnNlW3Byb3BdO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXNwb25zZUNvbnRlbnRMZW5ndGggPSB1dGlscy50b0Zpbml0ZU51bWJlcihyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC1sZW5ndGgnKSk7XG5cbiAgICAgICAgY29uc3QgW29uUHJvZ3Jlc3MsIGZsdXNoXSA9IG9uRG93bmxvYWRQcm9ncmVzcyAmJiBwcm9ncmVzc0V2ZW50RGVjb3JhdG9yKFxuICAgICAgICAgIHJlc3BvbnNlQ29udGVudExlbmd0aCxcbiAgICAgICAgICBwcm9ncmVzc0V2ZW50UmVkdWNlcihhc3luY0RlY29yYXRvcihvbkRvd25sb2FkUHJvZ3Jlc3MpLCB0cnVlKVxuICAgICAgICApIHx8IFtdO1xuXG4gICAgICAgIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKFxuICAgICAgICAgIHRyYWNrU3RyZWFtKHJlc3BvbnNlLmJvZHksIERFRkFVTFRfQ0hVTktfU0laRSwgb25Qcm9ncmVzcywgKCkgPT4ge1xuICAgICAgICAgICAgZmx1c2ggJiYgZmx1c2goKTtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlICYmIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgb3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXNwb25zZVR5cGUgPSByZXNwb25zZVR5cGUgfHwgJ3RleHQnO1xuXG4gICAgICBsZXQgcmVzcG9uc2VEYXRhID0gYXdhaXQgcmVzb2x2ZXJzW3V0aWxzLmZpbmRLZXkocmVzb2x2ZXJzLCByZXNwb25zZVR5cGUpIHx8ICd0ZXh0J10ocmVzcG9uc2UsIGNvbmZpZyk7XG5cbiAgICAgICFpc1N0cmVhbVJlc3BvbnNlICYmIHVuc3Vic2NyaWJlICYmIHVuc3Vic2NyaWJlKCk7XG5cbiAgICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHtcbiAgICAgICAgICBkYXRhOiByZXNwb25zZURhdGEsXG4gICAgICAgICAgaGVhZGVyczogQXhpb3NIZWFkZXJzLmZyb20ocmVzcG9uc2UuaGVhZGVycyksXG4gICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogcmVzcG9uc2Uuc3RhdHVzVGV4dCxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgcmVxdWVzdFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHVuc3Vic2NyaWJlICYmIHVuc3Vic2NyaWJlKCk7XG5cbiAgICAgIGlmIChlcnIgJiYgZXJyLm5hbWUgPT09ICdUeXBlRXJyb3InICYmIC9Mb2FkIGZhaWxlZHxmZXRjaC9pLnRlc3QoZXJyLm1lc3NhZ2UpKSB7XG4gICAgICAgIHRocm93IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgbmV3IEF4aW9zRXJyb3IoJ05ldHdvcmsgRXJyb3InLCBBeGlvc0Vycm9yLkVSUl9ORVRXT1JLLCBjb25maWcsIHJlcXVlc3QpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhdXNlOiBlcnIuY2F1c2UgfHwgZXJyXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHRocm93IEF4aW9zRXJyb3IuZnJvbShlcnIsIGVyciAmJiBlcnIuY29kZSwgY29uZmlnLCByZXF1ZXN0KTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgc2VlZENhY2hlID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgY29uc3QgZ2V0RmV0Y2ggPSAoY29uZmlnKSA9PiB7XG4gIGxldCBlbnYgPSBjb25maWcgPyBjb25maWcuZW52IDoge307XG4gIGNvbnN0IHtmZXRjaCwgUmVxdWVzdCwgUmVzcG9uc2V9ID0gZW52O1xuICBjb25zdCBzZWVkcyA9IFtcbiAgICBSZXF1ZXN0LCBSZXNwb25zZSwgZmV0Y2hcbiAgXTtcblxuICBsZXQgbGVuID0gc2VlZHMubGVuZ3RoLCBpID0gbGVuLFxuICAgIHNlZWQsIHRhcmdldCwgbWFwID0gc2VlZENhY2hlO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBzZWVkID0gc2VlZHNbaV07XG4gICAgdGFyZ2V0ID0gbWFwLmdldChzZWVkKTtcblxuICAgIHRhcmdldCA9PT0gdW5kZWZpbmVkICYmIG1hcC5zZXQoc2VlZCwgdGFyZ2V0ID0gKGkgPyBuZXcgTWFwKCkgOiBmYWN0b3J5KGVudikpKVxuXG4gICAgbWFwID0gdGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbmNvbnN0IGFkYXB0ZXIgPSBnZXRGZXRjaCgpO1xuXG5leHBvcnQgZGVmYXVsdCBhZGFwdGVyO1xuIiwiaW1wb3J0IHV0aWxzIGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCBodHRwQWRhcHRlciBmcm9tICcuL2h0dHAuanMnO1xuaW1wb3J0IHhockFkYXB0ZXIgZnJvbSAnLi94aHIuanMnO1xuaW1wb3J0ICogYXMgZmV0Y2hBZGFwdGVyIGZyb20gJy4vZmV0Y2guanMnO1xuaW1wb3J0IEF4aW9zRXJyb3IgZnJvbSBcIi4uL2NvcmUvQXhpb3NFcnJvci5qc1wiO1xuXG5jb25zdCBrbm93bkFkYXB0ZXJzID0ge1xuICBodHRwOiBodHRwQWRhcHRlcixcbiAgeGhyOiB4aHJBZGFwdGVyLFxuICBmZXRjaDoge1xuICAgIGdldDogZmV0Y2hBZGFwdGVyLmdldEZldGNoLFxuICB9XG59XG5cbnV0aWxzLmZvckVhY2goa25vd25BZGFwdGVycywgKGZuLCB2YWx1ZSkgPT4ge1xuICBpZiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCAnbmFtZScsIHt2YWx1ZX0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1lbXB0eVxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sICdhZGFwdGVyTmFtZScsIHt2YWx1ZX0pO1xuICB9XG59KTtcblxuY29uc3QgcmVuZGVyUmVhc29uID0gKHJlYXNvbikgPT4gYC0gJHtyZWFzb259YDtcblxuY29uc3QgaXNSZXNvbHZlZEhhbmRsZSA9IChhZGFwdGVyKSA9PiB1dGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpIHx8IGFkYXB0ZXIgPT09IG51bGwgfHwgYWRhcHRlciA9PT0gZmFsc2U7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZ2V0QWRhcHRlcjogKGFkYXB0ZXJzLCBjb25maWcpID0+IHtcbiAgICBhZGFwdGVycyA9IHV0aWxzLmlzQXJyYXkoYWRhcHRlcnMpID8gYWRhcHRlcnMgOiBbYWRhcHRlcnNdO1xuXG4gICAgY29uc3Qge2xlbmd0aH0gPSBhZGFwdGVycztcbiAgICBsZXQgbmFtZU9yQWRhcHRlcjtcbiAgICBsZXQgYWRhcHRlcjtcblxuICAgIGNvbnN0IHJlamVjdGVkUmVhc29ucyA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgbmFtZU9yQWRhcHRlciA9IGFkYXB0ZXJzW2ldO1xuICAgICAgbGV0IGlkO1xuXG4gICAgICBhZGFwdGVyID0gbmFtZU9yQWRhcHRlcjtcblxuICAgICAgaWYgKCFpc1Jlc29sdmVkSGFuZGxlKG5hbWVPckFkYXB0ZXIpKSB7XG4gICAgICAgIGFkYXB0ZXIgPSBrbm93bkFkYXB0ZXJzWyhpZCA9IFN0cmluZyhuYW1lT3JBZGFwdGVyKSkudG9Mb3dlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGFkYXB0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKGBVbmtub3duIGFkYXB0ZXIgJyR7aWR9J2ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChhZGFwdGVyICYmICh1dGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpIHx8IChhZGFwdGVyID0gYWRhcHRlci5nZXQoY29uZmlnKSkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZWplY3RlZFJlYXNvbnNbaWQgfHwgJyMnICsgaV0gPSBhZGFwdGVyO1xuICAgIH1cblxuICAgIGlmICghYWRhcHRlcikge1xuXG4gICAgICBjb25zdCByZWFzb25zID0gT2JqZWN0LmVudHJpZXMocmVqZWN0ZWRSZWFzb25zKVxuICAgICAgICAubWFwKChbaWQsIHN0YXRlXSkgPT4gYGFkYXB0ZXIgJHtpZH0gYCArXG4gICAgICAgICAgKHN0YXRlID09PSBmYWxzZSA/ICdpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBlbnZpcm9ubWVudCcgOiAnaXMgbm90IGF2YWlsYWJsZSBpbiB0aGUgYnVpbGQnKVxuICAgICAgICApO1xuXG4gICAgICBsZXQgcyA9IGxlbmd0aCA/XG4gICAgICAgIChyZWFzb25zLmxlbmd0aCA+IDEgPyAnc2luY2UgOlxcbicgKyByZWFzb25zLm1hcChyZW5kZXJSZWFzb24pLmpvaW4oJ1xcbicpIDogJyAnICsgcmVuZGVyUmVhc29uKHJlYXNvbnNbMF0pKSA6XG4gICAgICAgICdhcyBubyBhZGFwdGVyIHNwZWNpZmllZCc7XG5cbiAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKFxuICAgICAgICBgVGhlcmUgaXMgbm8gc3VpdGFibGUgYWRhcHRlciB0byBkaXNwYXRjaCB0aGUgcmVxdWVzdCBgICsgcyxcbiAgICAgICAgJ0VSUl9OT1RfU1VQUE9SVCdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkYXB0ZXI7XG4gIH0sXG4gIGFkYXB0ZXJzOiBrbm93bkFkYXB0ZXJzXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB0cmFuc2Zvcm1EYXRhIGZyb20gJy4vdHJhbnNmb3JtRGF0YS5qcyc7XG5pbXBvcnQgaXNDYW5jZWwgZnJvbSAnLi4vY2FuY2VsL2lzQ2FuY2VsLmpzJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cy9pbmRleC5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuLi9jYW5jZWwvQ2FuY2VsZWRFcnJvci5qcyc7XG5pbXBvcnQgQXhpb3NIZWFkZXJzIGZyb20gJy4uL2NvcmUvQXhpb3NIZWFkZXJzLmpzJztcbmltcG9ydCBhZGFwdGVycyBmcm9tIFwiLi4vYWRhcHRlcnMvYWRhcHRlcnMuanNcIjtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgdGhhdCBpcyB0byBiZSB1c2VkIGZvciB0aGUgcmVxdWVzdFxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxuXG4gIGlmIChjb25maWcuc2lnbmFsICYmIGNvbmZpZy5zaWduYWwuYWJvcnRlZCkge1xuICAgIHRocm93IG5ldyBDYW5jZWxlZEVycm9yKG51bGwsIGNvbmZpZyk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFRoZSBQcm9taXNlIHRvIGJlIGZ1bGZpbGxlZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICBjb25maWcuaGVhZGVycyA9IEF4aW9zSGVhZGVycy5mcm9tKGNvbmZpZy5oZWFkZXJzKTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgIGNvbmZpZyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIGlmIChbJ3Bvc3QnLCAncHV0JywgJ3BhdGNoJ10uaW5kZXhPZihjb25maWcubWV0aG9kKSAhPT0gLTEpIHtcbiAgICBjb25maWcuaGVhZGVycy5zZXRDb250ZW50VHlwZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJywgZmFsc2UpO1xuICB9XG5cbiAgY29uc3QgYWRhcHRlciA9IGFkYXB0ZXJzLmdldEFkYXB0ZXIoY29uZmlnLmFkYXB0ZXIgfHwgZGVmYXVsdHMuYWRhcHRlciwgY29uZmlnKTtcblxuICByZXR1cm4gYWRhcHRlcihjb25maWcpLnRoZW4oZnVuY3Rpb24gb25BZGFwdGVyUmVzb2x1dGlvbihyZXNwb25zZSkge1xuICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgIC8vIFRyYW5zZm9ybSByZXNwb25zZSBkYXRhXG4gICAgcmVzcG9uc2UuZGF0YSA9IHRyYW5zZm9ybURhdGEuY2FsbChcbiAgICAgIGNvbmZpZyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgIHJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZXNwb25zZS5oZWFkZXJzKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICAgICAgY29uZmlnLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuZnJvbShyZWFzb24ucmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBcIjEuMTIuMlwiOyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtWRVJTSU9OfSBmcm9tICcuLi9lbnYvZGF0YS5qcyc7XG5pbXBvcnQgQXhpb3NFcnJvciBmcm9tICcuLi9jb3JlL0F4aW9zRXJyb3IuanMnO1xuXG5jb25zdCB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaCgodHlwZSwgaSkgPT4ge1xuICB2YWxpZGF0b3JzW3R5cGVdID0gZnVuY3Rpb24gdmFsaWRhdG9yKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gdHlwZSB8fCAnYScgKyAoaSA8IDEgPyAnbiAnIDogJyAnKSArIHR5cGU7XG4gIH07XG59KTtcblxuY29uc3QgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG5cbi8qKlxuICogVHJhbnNpdGlvbmFsIG9wdGlvbiB2YWxpZGF0b3JcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufGJvb2xlYW4/fSB2YWxpZGF0b3IgLSBzZXQgdG8gZmFsc2UgaWYgdGhlIHRyYW5zaXRpb25hbCBvcHRpb24gaGFzIGJlZW4gcmVtb3ZlZFxuICogQHBhcmFtIHtzdHJpbmc/fSB2ZXJzaW9uIC0gZGVwcmVjYXRlZCB2ZXJzaW9uIC8gcmVtb3ZlZCBzaW5jZSB2ZXJzaW9uXG4gKiBAcGFyYW0ge3N0cmluZz99IG1lc3NhZ2UgLSBzb21lIG1lc3NhZ2Ugd2l0aCBhZGRpdGlvbmFsIGluZm9cbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgVkVSU0lPTiArICddIFRyYW5zaXRpb25hbCBvcHRpb24gXFwnJyArIG9wdCArICdcXCcnICsgZGVzYyArIChtZXNzYWdlID8gJy4gJyArIG1lc3NhZ2UgOiAnJyk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuYy1uYW1lc1xuICByZXR1cm4gKHZhbHVlLCBvcHQsIG9wdHMpID0+IHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEF4aW9zRXJyb3IoXG4gICAgICAgIGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQnICsgKHZlcnNpb24gPyAnIGluICcgKyB2ZXJzaW9uIDogJycpKSxcbiAgICAgICAgQXhpb3NFcnJvci5FUlJfREVQUkVDQVRFRFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbiAmJiAhZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0pIHtcbiAgICAgIGRlcHJlY2F0ZWRXYXJuaW5nc1tvcHRdID0gdHJ1ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGZvcm1hdE1lc3NhZ2UoXG4gICAgICAgICAgb3B0LFxuICAgICAgICAgICcgaGFzIGJlZW4gZGVwcmVjYXRlZCBzaW5jZSB2JyArIHZlcnNpb24gKyAnIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5lYXIgZnV0dXJlJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3IgPyB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0cykgOiB0cnVlO1xuICB9O1xufTtcblxudmFsaWRhdG9ycy5zcGVsbGluZyA9IGZ1bmN0aW9uIHNwZWxsaW5nKGNvcnJlY3RTcGVsbGluZykge1xuICByZXR1cm4gKHZhbHVlLCBvcHQpID0+IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybihgJHtvcHR9IGlzIGxpa2VseSBhIG1pc3NwZWxsaW5nIG9mICR7Y29ycmVjdFNwZWxsaW5nfWApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG4vKipcbiAqIEFzc2VydCBvYmplY3QncyBwcm9wZXJ0aWVzIHR5cGVcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYVxuICogQHBhcmFtIHtib29sZWFuP30gYWxsb3dVbmtub3duXG4gKlxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBhc3NlcnRPcHRpb25zKG9wdGlvbnMsIHNjaGVtYSwgYWxsb3dVbmtub3duKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcsIEF4aW9zRXJyb3IuRVJSX0JBRF9PUFRJT05fVkFMVUUpO1xuICB9XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgbGV0IGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSA+IDApIHtcbiAgICBjb25zdCBvcHQgPSBrZXlzW2ldO1xuICAgIGNvbnN0IHZhbGlkYXRvciA9IHNjaGVtYVtvcHRdO1xuICAgIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9uc1tvcHRdO1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IodmFsdWUsIG9wdCwgb3B0aW9ucyk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgIHRocm93IG5ldyBBeGlvc0Vycm9yKCdvcHRpb24gJyArIG9wdCArICcgbXVzdCBiZSAnICsgcmVzdWx0LCBBeGlvc0Vycm9yLkVSUl9CQURfT1BUSU9OX1ZBTFVFKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoYWxsb3dVbmtub3duICE9PSB0cnVlKSB7XG4gICAgICB0aHJvdyBuZXcgQXhpb3NFcnJvcignVW5rbm93biBvcHRpb24gJyArIG9wdCwgQXhpb3NFcnJvci5FUlJfQkFEX09QVElPTik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXNzZXJ0T3B0aW9ucyxcbiAgdmFsaWRhdG9yc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vLi4vdXRpbHMuanMnO1xuaW1wb3J0IGJ1aWxkVVJMIGZyb20gJy4uL2hlbHBlcnMvYnVpbGRVUkwuanMnO1xuaW1wb3J0IEludGVyY2VwdG9yTWFuYWdlciBmcm9tICcuL0ludGVyY2VwdG9yTWFuYWdlci5qcyc7XG5pbXBvcnQgZGlzcGF0Y2hSZXF1ZXN0IGZyb20gJy4vZGlzcGF0Y2hSZXF1ZXN0LmpzJztcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tICcuL21lcmdlQ29uZmlnLmpzJztcbmltcG9ydCBidWlsZEZ1bGxQYXRoIGZyb20gJy4vYnVpbGRGdWxsUGF0aC5qcyc7XG5pbXBvcnQgdmFsaWRhdG9yIGZyb20gJy4uL2hlbHBlcnMvdmFsaWRhdG9yLmpzJztcbmltcG9ydCBBeGlvc0hlYWRlcnMgZnJvbSAnLi9BeGlvc0hlYWRlcnMuanMnO1xuXG5jb25zdCB2YWxpZGF0b3JzID0gdmFsaWRhdG9yLnZhbGlkYXRvcnM7XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmNsYXNzIEF4aW9zIHtcbiAgY29uc3RydWN0b3IoaW5zdGFuY2VDb25maWcpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWcgfHwge307XG4gICAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgICByZXF1ZXN0OiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKCksXG4gICAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBjb25maWdPclVybCBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gICAqIEBwYXJhbSB7P09iamVjdH0gY29uZmlnXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAgICovXG4gIGFzeW5jIHJlcXVlc3QoY29uZmlnT3JVcmwsIGNvbmZpZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBsZXQgZHVtbXkgPSB7fTtcblxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA/IEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KSA6IChkdW1teSA9IG5ldyBFcnJvcigpKTtcblxuICAgICAgICAvLyBzbGljZSBvZmYgdGhlIEVycm9yOiAuLi4gbGluZVxuICAgICAgICBjb25zdCBzdGFjayA9IGR1bW15LnN0YWNrID8gZHVtbXkuc3RhY2sucmVwbGFjZSgvXi4rXFxuLywgJycpIDogJyc7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFlcnIuc3RhY2spIHtcbiAgICAgICAgICAgIGVyci5zdGFjayA9IHN0YWNrO1xuICAgICAgICAgICAgLy8gbWF0Y2ggd2l0aG91dCB0aGUgMiB0b3Agc3RhY2sgbGluZXNcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YWNrICYmICFTdHJpbmcoZXJyLnN0YWNrKS5lbmRzV2l0aChzdGFjay5yZXBsYWNlKC9eLitcXG4uK1xcbi8sICcnKSkpIHtcbiAgICAgICAgICAgIGVyci5zdGFjayArPSAnXFxuJyArIHN0YWNrXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaWdub3JlIHRoZSBjYXNlIHdoZXJlIFwic3RhY2tcIiBpcyBhbiB1bi13cml0YWJsZSBwcm9wZXJ0eVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBfcmVxdWVzdChjb25maWdPclVybCwgY29uZmlnKSB7XG4gICAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gICAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICAgIGlmICh0eXBlb2YgY29uZmlnT3JVcmwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gICAgICBjb25maWcudXJsID0gY29uZmlnT3JVcmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IGNvbmZpZ09yVXJsIHx8IHt9O1xuICAgIH1cblxuICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG5cbiAgICBjb25zdCB7dHJhbnNpdGlvbmFsLCBwYXJhbXNTZXJpYWxpemVyLCBoZWFkZXJzfSA9IGNvbmZpZztcblxuICAgIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnModHJhbnNpdGlvbmFsLCB7XG4gICAgICAgIHNpbGVudEpTT05QYXJzaW5nOiB2YWxpZGF0b3JzLnRyYW5zaXRpb25hbCh2YWxpZGF0b3JzLmJvb2xlYW4pLFxuICAgICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKSxcbiAgICAgICAgY2xhcmlmeVRpbWVvdXRFcnJvcjogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuKVxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXNTZXJpYWxpemVyICE9IG51bGwpIHtcbiAgICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHBhcmFtc1NlcmlhbGl6ZXIpKSB7XG4gICAgICAgIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyID0ge1xuICAgICAgICAgIHNlcmlhbGl6ZTogcGFyYW1zU2VyaWFsaXplclxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWxpZGF0b3IuYXNzZXJ0T3B0aW9ucyhwYXJhbXNTZXJpYWxpemVyLCB7XG4gICAgICAgICAgZW5jb2RlOiB2YWxpZGF0b3JzLmZ1bmN0aW9uLFxuICAgICAgICAgIHNlcmlhbGl6ZTogdmFsaWRhdG9ycy5mdW5jdGlvblxuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgY29uZmlnLmFsbG93QWJzb2x1dGVVcmxzXG4gICAgaWYgKGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLmFsbG93QWJzb2x1dGVVcmxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyA9IHRoaXMuZGVmYXVsdHMuYWxsb3dBYnNvbHV0ZVVybHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZy5hbGxvd0Fic29sdXRlVXJscyA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFsaWRhdG9yLmFzc2VydE9wdGlvbnMoY29uZmlnLCB7XG4gICAgICBiYXNlVXJsOiB2YWxpZGF0b3JzLnNwZWxsaW5nKCdiYXNlVVJMJyksXG4gICAgICB3aXRoWHNyZlRva2VuOiB2YWxpZGF0b3JzLnNwZWxsaW5nKCd3aXRoWFNSRlRva2VuJylcbiAgICB9LCB0cnVlKTtcblxuICAgIC8vIFNldCBjb25maWcubWV0aG9kXG4gICAgY29uZmlnLm1ldGhvZCA9IChjb25maWcubWV0aG9kIHx8IHRoaXMuZGVmYXVsdHMubWV0aG9kIHx8ICdnZXQnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gICAgbGV0IGNvbnRleHRIZWFkZXJzID0gaGVhZGVycyAmJiB1dGlscy5tZXJnZShcbiAgICAgIGhlYWRlcnMuY29tbW9uLFxuICAgICAgaGVhZGVyc1tjb25maWcubWV0aG9kXVxuICAgICk7XG5cbiAgICBoZWFkZXJzICYmIHV0aWxzLmZvckVhY2goXG4gICAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICAgIChtZXRob2QpID0+IHtcbiAgICAgICAgZGVsZXRlIGhlYWRlcnNbbWV0aG9kXTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uZmlnLmhlYWRlcnMgPSBBeGlvc0hlYWRlcnMuY29uY2F0KGNvbnRleHRIZWFkZXJzLCBoZWFkZXJzKTtcblxuICAgIC8vIGZpbHRlciBvdXQgc2tpcHBlZCBpbnRlcmNlcHRvcnNcbiAgICBjb25zdCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICAgIGxldCBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSB0cnVlO1xuICAgIHRoaXMuaW50ZXJjZXB0b3JzLnJlcXVlc3QuZm9yRWFjaChmdW5jdGlvbiB1bnNoaWZ0UmVxdWVzdEludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICAgIHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnVuc2hpZnQoaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZUludGVyY2VwdG9yQ2hhaW4gPSBbXTtcbiAgICB0aGlzLmludGVyY2VwdG9ycy5yZXNwb25zZS5mb3JFYWNoKGZ1bmN0aW9uIHB1c2hSZXNwb25zZUludGVyY2VwdG9ycyhpbnRlcmNlcHRvcikge1xuICAgICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gICAgfSk7XG5cbiAgICBsZXQgcHJvbWlzZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbjtcblxuICAgIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgICBjb25zdCBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QuYmluZCh0aGlzKSwgdW5kZWZpbmVkXTtcbiAgICAgIGNoYWluLnVuc2hpZnQoLi4ucmVxdWVzdEludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgY2hhaW4ucHVzaCguLi5yZXNwb25zZUludGVyY2VwdG9yQ2hhaW4pO1xuICAgICAgbGVuID0gY2hhaW4ubGVuZ3RoO1xuXG4gICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oY2hhaW5baSsrXSwgY2hhaW5baSsrXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGxlbiA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLmxlbmd0aDtcblxuICAgIGxldCBuZXdDb25maWcgPSBjb25maWc7XG5cbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgY29uc3Qgb25GdWxmaWxsZWQgPSByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbltpKytdO1xuICAgICAgY29uc3Qgb25SZWplY3RlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluW2krK107XG4gICAgICB0cnkge1xuICAgICAgICBuZXdDb25maWcgPSBvbkZ1bGZpbGxlZChuZXdDb25maWcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgb25SZWplY3RlZC5jYWxsKHRoaXMsIGVycm9yKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHByb21pc2UgPSBkaXNwYXRjaFJlcXVlc3QuY2FsbCh0aGlzLCBuZXdDb25maWcpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuICAgIH1cblxuICAgIGkgPSAwO1xuICAgIGxlbiA9IHJlc3BvbnNlSW50ZXJjZXB0b3JDaGFpbi5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaSA8IGxlbikge1xuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihyZXNwb25zZUludGVyY2VwdG9yQ2hhaW5baSsrXSwgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluW2krK10pO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgZ2V0VXJpKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IG1lcmdlQ29uZmlnKHRoaXMuZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgY29uc3QgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsLCBjb25maWcuYWxsb3dBYnNvbHV0ZVVybHMpO1xuICAgIHJldHVybiBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpO1xuICB9XG59XG5cbi8vIFByb3ZpZGUgYWxpYXNlcyBmb3Igc3VwcG9ydGVkIHJlcXVlc3QgbWV0aG9kc1xudXRpbHMuZm9yRWFjaChbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdvcHRpb25zJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kLFxuICAgICAgdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSFRUUE1ldGhvZChpc0Zvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gaHR0cE1ldGhvZCh1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBoZWFkZXJzOiBpc0Zvcm0gPyB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ1xuICAgICAgICB9IDoge30sXG4gICAgICAgIHVybCxcbiAgICAgICAgZGF0YVxuICAgICAgfSkpO1xuICAgIH07XG4gIH1cblxuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGdlbmVyYXRlSFRUUE1ldGhvZCgpO1xuXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2QgKyAnRm9ybSddID0gZ2VuZXJhdGVIVFRQTWV0aG9kKHRydWUpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuL0NhbmNlbGVkRXJyb3IuanMnO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtDYW5jZWxUb2tlbn1cbiAqL1xuY2xhc3MgQ2FuY2VsVG9rZW4ge1xuICBjb25zdHJ1Y3RvcihleGVjdXRvcikge1xuICAgIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2V4ZWN1dG9yIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICBsZXQgcmVzb2x2ZVByb21pc2U7XG5cbiAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG9rZW4gPSB0aGlzO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB0aGlzLnByb21pc2UudGhlbihjYW5jZWwgPT4ge1xuICAgICAgaWYgKCF0b2tlbi5fbGlzdGVuZXJzKSByZXR1cm47XG5cbiAgICAgIGxldCBpID0gdG9rZW4uX2xpc3RlbmVycy5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICAgIHRva2VuLl9saXN0ZW5lcnNbaV0oY2FuY2VsKTtcbiAgICAgIH1cbiAgICAgIHRva2VuLl9saXN0ZW5lcnMgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgICB0aGlzLnByb21pc2UudGhlbiA9IG9uZnVsZmlsbGVkID0+IHtcbiAgICAgIGxldCBfcmVzb2x2ZTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG4gICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHRva2VuLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgICAgX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgfSkudGhlbihvbmZ1bGZpbGxlZCk7XG5cbiAgICAgIHByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gcmVqZWN0KCkge1xuICAgICAgICB0b2tlbi51bnN1YnNjcmliZShfcmVzb2x2ZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UsIGNvbmZpZywgcmVxdWVzdCkge1xuICAgICAgaWYgKHRva2VuLnJlYXNvbikge1xuICAgICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsZWRFcnJvcihtZXNzYWdlLCBjb25maWcsIHJlcXVlc3QpO1xuICAgICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBgQ2FuY2VsZWRFcnJvcmAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAgICovXG4gIHRocm93SWZSZXF1ZXN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIHRoZSBjYW5jZWwgc2lnbmFsXG4gICAqL1xuXG4gIHN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnJlYXNvbikge1xuICAgICAgbGlzdGVuZXIodGhpcy5yZWFzb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmUgZnJvbSB0aGUgY2FuY2VsIHNpZ25hbFxuICAgKi9cblxuICB1bnN1YnNjcmliZShsaXN0ZW5lcikge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHRvQWJvcnRTaWduYWwoKSB7XG4gICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblxuICAgIGNvbnN0IGFib3J0ID0gKGVycikgPT4ge1xuICAgICAgY29udHJvbGxlci5hYm9ydChlcnIpO1xuICAgIH07XG5cbiAgICB0aGlzLnN1YnNjcmliZShhYm9ydCk7XG5cbiAgICBjb250cm9sbGVyLnNpZ25hbC51bnN1YnNjcmliZSA9ICgpID0+IHRoaXMudW5zdWJzY3JpYmUoYWJvcnQpO1xuXG4gICAgcmV0dXJuIGNvbnRyb2xsZXIuc2lnbmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYSBuZXcgYENhbmNlbFRva2VuYCBhbmQgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCxcbiAgICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAgICovXG4gIHN0YXRpYyBzb3VyY2UoKSB7XG4gICAgbGV0IGNhbmNlbDtcbiAgICBjb25zdCB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgICBjYW5jZWwgPSBjO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbixcbiAgICAgIGNhbmNlbFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FuY2VsVG9rZW47XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3ludGFjdGljIHN1Z2FyIGZvciBpbnZva2luZyBhIGZ1bmN0aW9uIGFuZCBleHBhbmRpbmcgYW4gYXJyYXkgZm9yIGFyZ3VtZW50cy5cbiAqXG4gKiBDb21tb24gdXNlIGNhc2Ugd291bGQgYmUgdG8gdXNlIGBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHlgLlxuICpcbiAqICBgYGBqc1xuICogIGZ1bmN0aW9uIGYoeCwgeSwgeikge31cbiAqICB2YXIgYXJncyA9IFsxLCAyLCAzXTtcbiAqICBmLmFwcGx5KG51bGwsIGFyZ3MpO1xuICogIGBgYFxuICpcbiAqIFdpdGggYHNwcmVhZGAgdGhpcyBleGFtcGxlIGNhbiBiZSByZS13cml0dGVuLlxuICpcbiAqICBgYGBqc1xuICogIHNwcmVhZChmdW5jdGlvbih4LCB5LCB6KSB7fSkoWzEsIDIsIDNdKTtcbiAqICBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi8uLi91dGlscy5qcyc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvcywgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzQXhpb3NFcnJvcihwYXlsb2FkKSB7XG4gIHJldHVybiB1dGlscy5pc09iamVjdChwYXlsb2FkKSAmJiAocGF5bG9hZC5pc0F4aW9zRXJyb3IgPT09IHRydWUpO1xufVxuIiwiY29uc3QgSHR0cFN0YXR1c0NvZGUgPSB7XG4gIENvbnRpbnVlOiAxMDAsXG4gIFN3aXRjaGluZ1Byb3RvY29sczogMTAxLFxuICBQcm9jZXNzaW5nOiAxMDIsXG4gIEVhcmx5SGludHM6IDEwMyxcbiAgT2s6IDIwMCxcbiAgQ3JlYXRlZDogMjAxLFxuICBBY2NlcHRlZDogMjAyLFxuICBOb25BdXRob3JpdGF0aXZlSW5mb3JtYXRpb246IDIwMyxcbiAgTm9Db250ZW50OiAyMDQsXG4gIFJlc2V0Q29udGVudDogMjA1LFxuICBQYXJ0aWFsQ29udGVudDogMjA2LFxuICBNdWx0aVN0YXR1czogMjA3LFxuICBBbHJlYWR5UmVwb3J0ZWQ6IDIwOCxcbiAgSW1Vc2VkOiAyMjYsXG4gIE11bHRpcGxlQ2hvaWNlczogMzAwLFxuICBNb3ZlZFBlcm1hbmVudGx5OiAzMDEsXG4gIEZvdW5kOiAzMDIsXG4gIFNlZU90aGVyOiAzMDMsXG4gIE5vdE1vZGlmaWVkOiAzMDQsXG4gIFVzZVByb3h5OiAzMDUsXG4gIFVudXNlZDogMzA2LFxuICBUZW1wb3JhcnlSZWRpcmVjdDogMzA3LFxuICBQZXJtYW5lbnRSZWRpcmVjdDogMzA4LFxuICBCYWRSZXF1ZXN0OiA0MDAsXG4gIFVuYXV0aG9yaXplZDogNDAxLFxuICBQYXltZW50UmVxdWlyZWQ6IDQwMixcbiAgRm9yYmlkZGVuOiA0MDMsXG4gIE5vdEZvdW5kOiA0MDQsXG4gIE1ldGhvZE5vdEFsbG93ZWQ6IDQwNSxcbiAgTm90QWNjZXB0YWJsZTogNDA2LFxuICBQcm94eUF1dGhlbnRpY2F0aW9uUmVxdWlyZWQ6IDQwNyxcbiAgUmVxdWVzdFRpbWVvdXQ6IDQwOCxcbiAgQ29uZmxpY3Q6IDQwOSxcbiAgR29uZTogNDEwLFxuICBMZW5ndGhSZXF1aXJlZDogNDExLFxuICBQcmVjb25kaXRpb25GYWlsZWQ6IDQxMixcbiAgUGF5bG9hZFRvb0xhcmdlOiA0MTMsXG4gIFVyaVRvb0xvbmc6IDQxNCxcbiAgVW5zdXBwb3J0ZWRNZWRpYVR5cGU6IDQxNSxcbiAgUmFuZ2VOb3RTYXRpc2ZpYWJsZTogNDE2LFxuICBFeHBlY3RhdGlvbkZhaWxlZDogNDE3LFxuICBJbUFUZWFwb3Q6IDQxOCxcbiAgTWlzZGlyZWN0ZWRSZXF1ZXN0OiA0MjEsXG4gIFVucHJvY2Vzc2FibGVFbnRpdHk6IDQyMixcbiAgTG9ja2VkOiA0MjMsXG4gIEZhaWxlZERlcGVuZGVuY3k6IDQyNCxcbiAgVG9vRWFybHk6IDQyNSxcbiAgVXBncmFkZVJlcXVpcmVkOiA0MjYsXG4gIFByZWNvbmRpdGlvblJlcXVpcmVkOiA0MjgsXG4gIFRvb01hbnlSZXF1ZXN0czogNDI5LFxuICBSZXF1ZXN0SGVhZGVyRmllbGRzVG9vTGFyZ2U6IDQzMSxcbiAgVW5hdmFpbGFibGVGb3JMZWdhbFJlYXNvbnM6IDQ1MSxcbiAgSW50ZXJuYWxTZXJ2ZXJFcnJvcjogNTAwLFxuICBOb3RJbXBsZW1lbnRlZDogNTAxLFxuICBCYWRHYXRld2F5OiA1MDIsXG4gIFNlcnZpY2VVbmF2YWlsYWJsZTogNTAzLFxuICBHYXRld2F5VGltZW91dDogNTA0LFxuICBIdHRwVmVyc2lvbk5vdFN1cHBvcnRlZDogNTA1LFxuICBWYXJpYW50QWxzb05lZ290aWF0ZXM6IDUwNixcbiAgSW5zdWZmaWNpZW50U3RvcmFnZTogNTA3LFxuICBMb29wRGV0ZWN0ZWQ6IDUwOCxcbiAgTm90RXh0ZW5kZWQ6IDUxMCxcbiAgTmV0d29ya0F1dGhlbnRpY2F0aW9uUmVxdWlyZWQ6IDUxMSxcbn07XG5cbk9iamVjdC5lbnRyaWVzKEh0dHBTdGF0dXNDb2RlKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgSHR0cFN0YXR1c0NvZGVbdmFsdWVdID0ga2V5O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEh0dHBTdGF0dXNDb2RlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgYmluZCBmcm9tICcuL2hlbHBlcnMvYmluZC5qcyc7XG5pbXBvcnQgQXhpb3MgZnJvbSAnLi9jb3JlL0F4aW9zLmpzJztcbmltcG9ydCBtZXJnZUNvbmZpZyBmcm9tICcuL2NvcmUvbWVyZ2VDb25maWcuanMnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMvaW5kZXguanMnO1xuaW1wb3J0IGZvcm1EYXRhVG9KU09OIGZyb20gJy4vaGVscGVycy9mb3JtRGF0YVRvSlNPTi5qcyc7XG5pbXBvcnQgQ2FuY2VsZWRFcnJvciBmcm9tICcuL2NhbmNlbC9DYW5jZWxlZEVycm9yLmpzJztcbmltcG9ydCBDYW5jZWxUb2tlbiBmcm9tICcuL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyc7XG5pbXBvcnQgaXNDYW5jZWwgZnJvbSAnLi9jYW5jZWwvaXNDYW5jZWwuanMnO1xuaW1wb3J0IHtWRVJTSU9OfSBmcm9tICcuL2Vudi9kYXRhLmpzJztcbmltcG9ydCB0b0Zvcm1EYXRhIGZyb20gJy4vaGVscGVycy90b0Zvcm1EYXRhLmpzJztcbmltcG9ydCBBeGlvc0Vycm9yIGZyb20gJy4vY29yZS9BeGlvc0Vycm9yLmpzJztcbmltcG9ydCBzcHJlYWQgZnJvbSAnLi9oZWxwZXJzL3NwcmVhZC5qcyc7XG5pbXBvcnQgaXNBeGlvc0Vycm9yIGZyb20gJy4vaGVscGVycy9pc0F4aW9zRXJyb3IuanMnO1xuaW1wb3J0IEF4aW9zSGVhZGVycyBmcm9tIFwiLi9jb3JlL0F4aW9zSGVhZGVycy5qc1wiO1xuaW1wb3J0IGFkYXB0ZXJzIGZyb20gJy4vYWRhcHRlcnMvYWRhcHRlcnMuanMnO1xuaW1wb3J0IEh0dHBTdGF0dXNDb2RlIGZyb20gJy4vaGVscGVycy9IdHRwU3RhdHVzQ29kZS5qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJucyB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgY29uc3QgY29udGV4dCA9IG5ldyBBeGlvcyhkZWZhdWx0Q29uZmlnKTtcbiAgY29uc3QgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCwge2FsbE93bktleXM6IHRydWV9KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0LCBudWxsLCB7YWxsT3duS2V5czogdHJ1ZX0pO1xuXG4gIC8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbiAgaW5zdGFuY2UuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGluc3RhbmNlQ29uZmlnKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGRlZmF1bHRDb25maWcsIGluc3RhbmNlQ29uZmlnKSk7XG4gIH07XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbmNvbnN0IGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEV4cG9zZSBDYW5jZWwgJiBDYW5jZWxUb2tlblxuYXhpb3MuQ2FuY2VsZWRFcnJvciA9IENhbmNlbGVkRXJyb3I7XG5heGlvcy5DYW5jZWxUb2tlbiA9IENhbmNlbFRva2VuO1xuYXhpb3MuaXNDYW5jZWwgPSBpc0NhbmNlbDtcbmF4aW9zLlZFUlNJT04gPSBWRVJTSU9OO1xuYXhpb3MudG9Gb3JtRGF0YSA9IHRvRm9ybURhdGE7XG5cbi8vIEV4cG9zZSBBeGlvc0Vycm9yIGNsYXNzXG5heGlvcy5BeGlvc0Vycm9yID0gQXhpb3NFcnJvcjtcblxuLy8gYWxpYXMgZm9yIENhbmNlbGVkRXJyb3IgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbmF4aW9zLkNhbmNlbCA9IGF4aW9zLkNhbmNlbGVkRXJyb3I7XG5cbi8vIEV4cG9zZSBhbGwvc3ByZWFkXG5heGlvcy5hbGwgPSBmdW5jdGlvbiBhbGwocHJvbWlzZXMpIHtcbiAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbn07XG5cbmF4aW9zLnNwcmVhZCA9IHNwcmVhZDtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gaXNBeGlvc0Vycm9yO1xuXG4vLyBFeHBvc2UgbWVyZ2VDb25maWdcbmF4aW9zLm1lcmdlQ29uZmlnID0gbWVyZ2VDb25maWc7XG5cbmF4aW9zLkF4aW9zSGVhZGVycyA9IEF4aW9zSGVhZGVycztcblxuYXhpb3MuZm9ybVRvSlNPTiA9IHRoaW5nID0+IGZvcm1EYXRhVG9KU09OKHV0aWxzLmlzSFRNTEZvcm0odGhpbmcpID8gbmV3IEZvcm1EYXRhKHRoaW5nKSA6IHRoaW5nKTtcblxuYXhpb3MuZ2V0QWRhcHRlciA9IGFkYXB0ZXJzLmdldEFkYXB0ZXI7XG5cbmF4aW9zLkh0dHBTdGF0dXNDb2RlID0gSHR0cFN0YXR1c0NvZGU7XG5cbmF4aW9zLmRlZmF1bHQgPSBheGlvcztcblxuLy8gdGhpcyBtb2R1bGUgc2hvdWxkIG9ubHkgaGF2ZSBhIGRlZmF1bHQgZXhwb3J0XG5leHBvcnQgZGVmYXVsdCBheGlvc1xuIiwiaW1wb3J0IGF4aW9zIGZyb20gJy4vbGliL2F4aW9zLmpzJztcblxuLy8gVGhpcyBtb2R1bGUgaXMgaW50ZW5kZWQgdG8gdW53cmFwIEF4aW9zIGRlZmF1bHQgZXhwb3J0IGFzIG5hbWVkLlxuLy8gS2VlcCB0b3AtbGV2ZWwgZXhwb3J0IHNhbWUgd2l0aCBzdGF0aWMgcHJvcGVydGllc1xuLy8gc28gdGhhdCBpdCBjYW4ga2VlcCBzYW1lIHdpdGggZXMgbW9kdWxlIG9yIGNqc1xuY29uc3Qge1xuICBBeGlvcyxcbiAgQXhpb3NFcnJvcixcbiAgQ2FuY2VsZWRFcnJvcixcbiAgaXNDYW5jZWwsXG4gIENhbmNlbFRva2VuLFxuICBWRVJTSU9OLFxuICBhbGwsXG4gIENhbmNlbCxcbiAgaXNBeGlvc0Vycm9yLFxuICBzcHJlYWQsXG4gIHRvRm9ybURhdGEsXG4gIEF4aW9zSGVhZGVycyxcbiAgSHR0cFN0YXR1c0NvZGUsXG4gIGZvcm1Ub0pTT04sXG4gIGdldEFkYXB0ZXIsXG4gIG1lcmdlQ29uZmlnXG59ID0gYXhpb3M7XG5cbmV4cG9ydCB7XG4gIGF4aW9zIGFzIGRlZmF1bHQsXG4gIEF4aW9zLFxuICBBeGlvc0Vycm9yLFxuICBDYW5jZWxlZEVycm9yLFxuICBpc0NhbmNlbCxcbiAgQ2FuY2VsVG9rZW4sXG4gIFZFUlNJT04sXG4gIGFsbCxcbiAgQ2FuY2VsLFxuICBpc0F4aW9zRXJyb3IsXG4gIHNwcmVhZCxcbiAgdG9Gb3JtRGF0YSxcbiAgQXhpb3NIZWFkZXJzLFxuICBIdHRwU3RhdHVzQ29kZSxcbiAgZm9ybVRvSlNPTixcbiAgZ2V0QWRhcHRlcixcbiAgbWVyZ2VDb25maWdcbn1cbiIsImltcG9ydCB7IElkIH0gZnJvbSBcIkAvY29udmV4L19nZW5lcmF0ZWQvZGF0YU1vZGVsXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBSZWFjdE11dGF0aW9uIH0gZnJvbSBcImNvbnZleC9yZWFjdFwiO1xuaW1wb3J0IHsgRnVuY3Rpb25SZWZlcmVuY2UgfSBmcm9tIFwiY29udmV4L3NlcnZlclwiO1xuaW1wb3J0IHsgT1dORVJfSUQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlUXVlcnkocXVlcnk6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IHIgPSBhd2FpdCBheGlvcy5wb3N0KGBodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3YxL3F1ZXJ5YCwge1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgIH0pO1xuICAgIHJldHVybiByO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihgRXJyb3I6YCwgZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZVRpbWVzdGFtcENsaWNrKHNlY29uZHM6IG51bWJlciwgdmlkZW9Vcmw6IHN0cmluZykge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKHZpZGVvVXJsKTtcbiAgaWYgKHNlY29uZHMgJiYgc2Vjb25kcyA+IDApIHtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmRlbGV0ZShcInRcIik7XG4gICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoXCJ0XCIsIHNlY29uZHMudG9TdHJpbmcoKSk7XG4gIH1cbiAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xufVxuZnVuY3Rpb24gZ2V0WW91dHViZVZpZGVvSWQodXJsOiBzdHJpbmcpIHtcbiAgaWYgKCF1cmwpIHJldHVybiBudWxsO1xuICBjb25zdCB2aWRlb1VybCA9IG5ldyBVUkwodXJsKTtcbiAgY29uc3QgdmlkZW9JZCA9IHZpZGVvVXJsLnNlYXJjaFBhcmFtcy5nZXQoXCJ2XCIpO1xuICByZXR1cm4gdmlkZW9JZDtcbn1cbmZ1bmN0aW9uIGFza0xsbUluQmFja2dyb3VuZChcbiAgcXVlcnk6IHN0cmluZyxcbiAgdmlkZW9JZDogc3RyaW5nLFxuICB1cmw6IHN0cmluZyxcbik6IFByb21pc2U8e1xuICBvazogYm9vbGVhbjtcbiAgZGF0YTogeyBzdGF0dXM6IHN0cmluZzsgZGF0YTogc3RyaW5nIH07XG59PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxuICAgICAge1xuICAgICAgICB0eXBlOiBcIkxMTV9RVUVSWVwiLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgcXVlcnksXG4gICAgICAgICAgdmlkZW9JZCxcbiAgICAgICAgICB1cmwsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgKHJlcykgPT4ge1xuICAgICAgICBpZiAoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgICBlcnJvcjogKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIGFzIHN0cmluZykgPz8gYGxsbSBlcnJvcmAsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShcbiAgICAgICAgICAgIHJlcyA/PyB7XG4gICAgICAgICAgICAgIG9rOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufVxuZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4oZm46IFQsIG1zOiBudW1iZXIpIHtcbiAgbGV0IHQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcmV0dXJuICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB7XG4gICAgaWYgKHQpIGNsZWFyVGltZW91dCh0KTtcbiAgICB0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gZm4oLi4uYXJncyksIG1zKTtcbiAgfTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGZldGNoQ29udmVyc2F0aW9uKHtcbiAgc2V0Q29udklkLFxuICBjb252TXV0YXRlLFxuICB2aWRlb0lkLFxufToge1xuICBzZXRDb252SWQ6IFJlYWN0LkRpc3BhdGNoPFJlYWN0LlNldFN0YXRlQWN0aW9uPHN0cmluZyB8IHVuZGVmaW5lZD4+O1xuICBjb252TXV0YXRlOiBSZWFjdE11dGF0aW9uPFxuICAgIEZ1bmN0aW9uUmVmZXJlbmNlPFxuICAgICAgXCJtdXRhdGlvblwiLFxuICAgICAgXCJwdWJsaWNcIixcbiAgICAgIHtcbiAgICAgICAgdmlkZW9JZDogc3RyaW5nO1xuICAgICAgICBvd25lcklkOiBzdHJpbmc7XG4gICAgICB9LFxuICAgICAgfCBJZDxcImNvbnZlcnNhdGlvbnNcIj5cbiAgICAgIHwge1xuICAgICAgICAgIF9pZDogSWQ8XCJjb252ZXJzYXRpb25zXCI+O1xuICAgICAgICAgIF9jcmVhdGlvblRpbWU6IG51bWJlcjtcbiAgICAgICAgICB2aWRlb0lkOiBzdHJpbmc7XG4gICAgICAgICAgb3duZXJJZDogc3RyaW5nO1xuICAgICAgICAgIGNyZWF0ZWRBdDogc3RyaW5nO1xuICAgICAgICB9W10sXG4gICAgICBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICA+XG4gID47XG4gIHZpZGVvSWQ6IHN0cmluZztcbn0pIHtcbiAgY29uc3QgY29udmVyc2F0aW9ucyA9IGF3YWl0IGNvbnZNdXRhdGUoe1xuICAgIG93bmVySWQ6IE9XTkVSX0lELFxuICAgIHZpZGVvSWQ6IHZpZGVvSWQsXG4gIH0pO1xuICBjb25zdCBjb252SUQgPVxuICAgIGNvbnZlcnNhdGlvbnMgJiYgQXJyYXkuaXNBcnJheShjb252ZXJzYXRpb25zKSAmJiBjb252ZXJzYXRpb25zLmxlbmd0aCA+IDBcbiAgICAgID8gY29udmVyc2F0aW9uc1swXS5faWRcbiAgICAgIDogdW5kZWZpbmVkO1xuICBzZXRDb252SWQoY29udklEKTtcbiAgcmV0dXJuIGNvbnZJRDtcbn1cbmV4cG9ydCB7XG4gIGZldGNoQ29udmVyc2F0aW9uLFxuICByZXNvbHZlUXVlcnksXG4gIGhhbmRsZVRpbWVzdGFtcENsaWNrLFxuICBnZXRZb3V0dWJlVmlkZW9JZCxcbiAgYXNrTGxtSW5CYWNrZ3JvdW5kLFxuICBkZWJvdW5jZSxcbn07XG4iLCJpbXBvcnQgeyBnZXRZb3V0dWJlVmlkZW9JZCB9IGZyb20gXCJAL2xpYi9oZWxwZXJcIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKFwiSGVsbG8gYmFja2dyb3VuZCFcIiwgeyBpZDogYnJvd3Nlci5ydW50aW1lLmlkIH0pO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBfc2VuZGVyLCBfc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtc2c/LnR5cGUgPT09IFwiQ0hBVFlUX1VSTF9VUERBVEVcIiAmJiB0eXBlb2YgbXNnLnVybCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGNvbnN0IHVybCA9IG1zZy51cmw7XG5cbiAgICBjb25zdCB2SWQgPSBnZXRZb3V0dWJlVmlkZW9JZCh1cmwpO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgICBsYXN0Q2hhdFl0VXJsOiB1cmwsXG4gICAgICBsYXN0Q2hhdFl0VmlkZW9JZDogdklkLFxuICAgICAgbGFzdENoYXRZdEF0OiBEYXRlLm5vdygpLFxuICAgIH0pO1xuICB9XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIF9zZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobXNnLnR5cGUgIT09IFwiTExNX1FVRVJZXCIpIHJldHVybjtcblxuICAoYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IGtleSB9ID0gYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFwia2V5XCIpO1xuICAgICAgaWYgKCFrZXkpXG4gICAgICAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogXCJNaXNzaW5nIEFQSSBLZXlcIixcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHsgcXVlcnksIHZpZGVvSWQsIHVybCB9ID0gbXNnLnBheWxvYWQ7XG4gICAgICBjb25zdCByID0gYXdhaXQgYXhpb3MucG9zdChcbiAgICAgICAgYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjEvcXVlcnlgLFxuICAgICAgICB7XG4gICAgICAgICAgcXVlcnksXG4gICAgICAgICAgdmlkZW9JZCxcbiAgICAgICAgICB1cmwsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7a2V5fWAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgICBpZiAoIXIgfHwgKHIuc3RhdHVzICE9PSAyMDAgJiYgci5zdGF0dXMgIT09IDIwMSkpIHtcbiAgICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiBgTExNIEVycm9yICR7ci5zdGF0dXN9IGAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgb2s6IHRydWUsXG4gICAgICAgIGRhdGE6IHIuZGF0YSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSh7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGU/Lm1lc3NhZ2UgPz8gYFJlcXVlc3QgZmFpbGVkYCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkoKTtcbiAgcmV0dXJuIHRydWU7XG59KTtcblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csIF9zZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICBpZiAobXNnLnR5cGUgIT09IFwiVFJBTlNDUklCRV9WSURFT1wiKSByZXR1cm47XG5cbiAgKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBrZXkgfSA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChcImtleVwiKTtcblxuICAgICAgaWYgKCFrZXkpXG4gICAgICAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogXCJNaXNzaW5nIEFQSSBLZXlcIixcbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHsgdXJsLCB2aWRlb0lkIH0gPSBtc2cucGF5bG9hZDtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBheGlvcy5wb3N0KFxuICAgICAgICBgaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS92MS90cmFuc2NyaWJlLXZpZGVvYCxcbiAgICAgICAge1xuICAgICAgICAgIHVybCxcbiAgICAgICAgICB2aWRlb0lkLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke2tleX1gLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgaWYgKCFyIHx8IChyLnN0YXR1cyAhPT0gMjAwICYmIHIuc3RhdHVzICE9PSAyMDEpKSB7XG4gICAgICAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogYExMTSBFcnJvciAke3Iuc3RhdHVzfSBgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgIG9rOiB0cnVlLFxuICAgICAgICBkYXRhOiByLmRhdGEsXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlPy5tZXNzYWdlID8/IGBSZXF1ZXN0IGZhaWxlZGAsXG4gICAgICB9KTtcbiAgICB9XG4gIH0pKCk7XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1zZz8udHlwZSA9PT0gXCJTQVZFX0FQSV9LRVlTXCIpIHtcbiAgICBjb25zdCB7IG1vZGVsLCBhcGlLZXkgfSA9IG1zZy5wYXlsb2FkO1xuXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KFxuICAgICAge1xuICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgIGtleTogYXBpS2V5LFxuICAgICAgICBsYXN0S2V5U2F2ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgZGF0YTogbXNnLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG4iLCIvLyBzcmMvaW5kZXgudHNcbnZhciBfTWF0Y2hQYXR0ZXJuID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcbiAgICBpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuICAgICAgdGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uX01hdGNoUGF0dGVybi5QUk9UT0NPTFNdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gXCIqXCI7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBcIipcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ3JvdXBzID0gLyguKik6XFwvXFwvKC4qPykoXFwvLiopLy5leGVjKG1hdGNoUGF0dGVybik7XG4gICAgICBpZiAoZ3JvdXBzID09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgXCJJbmNvcnJlY3QgZm9ybWF0XCIpO1xuICAgICAgY29uc3QgW18sIHByb3RvY29sLCBob3N0bmFtZSwgcGF0aG5hbWVdID0gZ3JvdXBzO1xuICAgICAgdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKTtcbiAgICAgIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSk7XG4gICAgICB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcbiAgICB9XG4gIH1cbiAgaW5jbHVkZXModXJsKSB7XG4gICAgaWYgKHRoaXMuaXNBbGxVcmxzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuICAgIHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcbiAgICB9KTtcbiAgfVxuICBpc0h0dHBNYXRjaCh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0h0dHBzTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuICB9XG4gIGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcbiAgICBpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbXG4gICAgICB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLFxuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSlcbiAgICBdO1xuICAgIGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG4gICAgcmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuICB9XG4gIGlzRmlsZU1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmaWxlOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc0Z0cE1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGlzVXJuTWF0Y2godXJsKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IHVybjovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgY29udmVydFBhdHRlcm5Ub1JlZ2V4KHBhdHRlcm4pIHtcbiAgICBjb25zdCBlc2NhcGVkID0gdGhpcy5lc2NhcGVGb3JSZWdleChwYXR0ZXJuKTtcbiAgICBjb25zdCBzdGFyc1JlcGxhY2VkID0gZXNjYXBlZC5yZXBsYWNlKC9cXFxcXFwqL2csIFwiLipcIik7XG4gICAgcmV0dXJuIFJlZ0V4cChgXiR7c3RhcnNSZXBsYWNlZH0kYCk7XG4gIH1cbiAgZXNjYXBlRm9yUmVnZXgoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG4gIH1cbn07XG52YXIgTWF0Y2hQYXR0ZXJuID0gX01hdGNoUGF0dGVybjtcbk1hdGNoUGF0dGVybi5QUk9UT0NPTFMgPSBbXCJodHRwXCIsIFwiaHR0cHNcIiwgXCJmaWxlXCIsIFwiZnRwXCIsIFwidXJuXCJdO1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcbiAgICBzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuICB9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG4gIGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKFxuICAgICAgbWF0Y2hQYXR0ZXJuLFxuICAgICAgYCR7cHJvdG9jb2x9IG5vdCBhIHZhbGlkIHByb3RvY29sICgke01hdGNoUGF0dGVybi5QUk9UT0NPTFMuam9pbihcIiwgXCIpfSlgXG4gICAgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSkge1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpIHtcbiAgcmV0dXJuO1xufVxuZXhwb3J0IHtcbiAgSW52YWxpZE1hdGNoUGF0dGVybixcbiAgTWF0Y2hQYXR0ZXJuXG59O1xuIl0sIm5hbWVzIjpbImJyb3dzZXIiLCJfYnJvd3NlciIsImlzRnVuY3Rpb24iLCJyZXN1bHQiLCJwcm90b3R5cGUiLCJkZXNjcmlwdG9ycyIsImhhc093blByb3BlcnR5IiwiQXhpb3NFcnJvciIsInV0aWxzIiwidG9Gb3JtRGF0YSIsImVuY29kZSIsInRvU3RyaW5nIiwiVVJMU2VhcmNoUGFyYW1zIiwiRm9ybURhdGEiLCJCbG9iIiwicGxhdGZvcm0iLCJpc0Zvcm1EYXRhIiwiaXNGaWxlTGlzdCIsInNlbGYiLCJBeGlvc0hlYWRlcnMiLCJpc0NhbmNlbCIsIkNhbmNlbGVkRXJyb3IiLCJvcmlnaW4iLCJtZXJnZUNvbmZpZyIsIm1lcmdlIiwic2lnbmFsIiwiaXRlcmF0b3IiLCJkb25lIiwiUmVhZGFibGVTdHJlYW0iLCJmZXRjaCIsImZldGNoQWRhcHRlci5nZXRGZXRjaCIsImFkYXB0ZXJzIiwiVkVSU0lPTiIsInZhbGlkYXRvcnMiLCJ2YWxpZGF0b3IiLCJBeGlvcyIsIkNhbmNlbFRva2VuIiwic3ByZWFkIiwiaXNBeGlvc0Vycm9yIiwiSHR0cFN0YXR1c0NvZGUiLCJhbGwiXSwibWFwcGluZ3MiOiI7O0FBQU8sV0FBUyxpQkFBaUIsS0FBSztBQUNwQyxRQUFJLE9BQU8sUUFBUSxPQUFPLFFBQVEsV0FBWSxRQUFPLEVBQUUsTUFBTSxJQUFHO0FBQ2hFLFdBQU87QUFBQSxFQUNUO0FDRk8sUUFBTUEsWUFBVSxXQUFXLFNBQVMsU0FBUyxLQUNoRCxXQUFXLFVBQ1gsV0FBVztBQ0ZSLFFBQU0sVUFBVUM7QUNDUixXQUFTLEtBQUssSUFBSSxTQUFTO0FBQ3hDLFdBQU8sU0FBUyxPQUFPO0FBQ3JCLGFBQU8sR0FBRyxNQUFNLFNBQVMsU0FBUztB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O0FBQ2QsWUFBTSxNQUFNLG9FQUFvRTtBQUFBLElBQ2xGO0FBQUEsSUFDQSxzQkFBc0IsU0FBUztBQUM3QixZQUFNLFVBQVUsS0FBSyxlQUFlLE9BQU87QUFDM0MsWUFBTSxnQkFBZ0IsUUFBUSxRQUFRLFNBQVMsSUFBSTtBQUNuRCxhQUFPLE9BQU8sSUFBSSxhQUFhLEdBQUc7QUFBQSxJQUNwQztBQUFBLElBQ0EsZUFBZSxRQUFRO0FBQ3JCLGFBQU8sT0FBTyxRQUFRLHVCQUF1QixNQUFNO0FBQUEsSUFDckQ7QUFBQSxFQUNGO0FBQ0EsTUFBSSxlQUFlO0FBQ25CLGVBQWEsWUFBWSxDQUFDLFFBQVEsU0FBUyxRQUFRLE9BQU8sS0FBSztBQUMvRCxNQUFJLHNCQUFzQixjQUFjLE1BQU07QUFBQSxJQUM1QyxZQUFZLGNBQWMsUUFBUTtBQUNoQyxZQUFNLDBCQUEwQixZQUFZLE1BQU0sTUFBTSxFQUFFO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQ0EsV0FBUyxpQkFBaUIsY0FBYyxVQUFVO0FBQ2hELFFBQUksQ0FBQyxhQUFhLFVBQVUsU0FBUyxRQUFRLEtBQUssYUFBYTtBQUM3RCxZQUFNLElBQUk7QUFBQSxRQUNSO0FBQUEsUUFDQSxHQUFHLFFBQVEsMEJBQTBCLGFBQWEsVUFBVSxLQUFLLElBQUksQ0FBQztBQUFBLE1BQzVFO0FBQUEsRUFDQTtBQUNBLFdBQVMsaUJBQWlCLGNBQWMsVUFBVTtBQUNoRCxRQUFJLFNBQVMsU0FBUyxHQUFHO0FBQ3ZCLFlBQU0sSUFBSSxvQkFBb0IsY0FBYyxnQ0FBZ0M7QUFDOUUsUUFBSSxTQUFTLFNBQVMsR0FBRyxLQUFLLFNBQVMsU0FBUyxLQUFLLENBQUMsU0FBUyxXQUFXLElBQUk7QUFDNUUsWUFBTSxJQUFJO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxNQUNOO0FBQUEsRUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDMyLDMzLDM0LDM1LDM2LDM3LDM4LDM5LDQwLDQxLDQyLDQzLDQ0LDQ1LDQ2LDQ3LDQ4LDQ5LDUwLDUxLDUyLDU1XX0=

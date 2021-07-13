/*!
 * @qpaas/loader v0.1.16
 * @author blesstosam
 */
import Vue$1 from 'vue';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// 模块缓存
var LoadStatus = {
  NOT_LOAD: 'NOT_LOAD',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  LOADED_ERR: 'LOADED_ERR',
  EXECTED_ERR: 'EXECTED_ERR',
  // 插件运行报错
  // TODO 处理以下生命周期
  MOUNTING: 'MOUNTING',
  // 插件挂载中
  MOUNTED: 'MOUNTED',
  // 插件挂载成功
  MOUNTED_ERROR: 'MOUNTED_ERROR' // 插件挂载失败 => 调用mount报错

};
function createStore() {
  // {
  //  [name]: {
  //    mod: mod,                                    /* js模块 */
  //    cssMod: StyleNode                            /* css的stylenode */
  //    name: name,                                  /* 模块名 */
  //    modUrl: url                                  /* 模块的url（绝对路径）*/
  //    status: keyof LoadStatus,                    /* 状态 */
  //    category: 'component|subApp|subAppWithRoute' /* 模块类型 */
  //  }
  // }
  var store = Object.create(null);
  return {
    /**
     * 保存js模块(包括发起请求还没有返回的/已经返回的)
     * 在请求失败后需要删除模块 表示没有被加载过
     * @param {String} name
     * @param {Object | Function | String} modOrSrc 模块或者js的src
     * @param {boolean} isInit 是否是第一次记录模块信息
     * @return void
     */
    set: function set(name, modOrSrc) {
      var isInit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (store[name]) {
        if (modOrSrc && !isInit) {
          store[name].status = LoadStatus.LOADED;
          store[name].mod = modOrSrc;
        }
      } else {
        store[name] = {
          name: name,
          modUrl: modOrSrc,
          status: LoadStatus.NOT_LOAD
        };
      }
    },

    /**
     * 保存css模块 为stylenode
     * @param cssMod HTMLStyleElement
     */
    setCssMod: function setCssMod(name, cssMod) {
      if (cssMod && this.has(name)) {
        store[name].cssMod = cssMod;
      }
    },
    setStatus: function setStatus(name, status) {
      if (store[name]) {
        store[name].status = status;
      }
    },
    getStatus: function getStatus(name) {
      if (store[name]) return store[name].status;
    },
    get: function get(name) {
      if (name) return store[name];
      return store;
    },
    has: function has(name) {
      return store[name];
    },
    delete: function _delete(name) {
      if (store[name]) {
        store[name] = undefined;
      }
    },
    clear: function clear() {
      store = (_readOnlyError("store"), Object.create(null));
    }
  };
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function assocIndexOf(array, key) {
  var length = array.length;

  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */

var arrayProto = Array.prototype;
/** Built-in value references. */

var splice = arrayProto.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }

  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */

function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;
var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */

function stackClear() {
  this.__data__ = new _ListCache();
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = _freeGlobal || freeSelf || Function('return this')();
var _root = root;

/** Built-in value references. */

var Symbol$1 = _root.Symbol;
var _Symbol = Symbol$1;

/** Used for built-in method references. */

var objectProto$c = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$9 = objectProto$c.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1 = objectProto$c.toString;
/** Built-in value references. */

var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }

  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto$b.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */

var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag && symToStringTag in Object(value) ? _getRawTag(value) : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */

var asyncTag = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = _baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */

var coreJsData = _root['__core-js_shared__'];
var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */

var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1 = funcProto$1.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto = Function.prototype,
    objectProto$a = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }

  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */

function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */

var Map$1 = _getNative(_root, 'Map');
var _Map = Map$1;

/* Built-in method references that are verified to be native. */

var nativeCreate = _getNative(Object, 'create');
var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$9 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet(key) {
  var data = this.__data__;

  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }

  return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */

var objectProto$8 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? data[key] !== undefined : hasOwnProperty$6.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */

function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = _nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;
var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash(),
    'map': new (_Map || _ListCache)(),
    'string': new _Hash()
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */

function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */

function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;
var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */

var LARGE_ARRAY_SIZE = 200;
/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */

function stackSet(key, value) {
  var data = this.__data__;

  if (data instanceof _ListCache) {
    var pairs = data.__data__;

    if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new _MapCache(pairs);
  }

  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
} // Add methods to `Stack`.


Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;
var _Stack = Stack;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}

var _arrayEach = arrayEach;

var defineProperty = function () {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

var _defineProperty = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */

var objectProto$7 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$5.call(object, key) && eq_1(objValue, value)) || value === undefined && !(key in object)) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }

  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

var _baseTimes = baseTimes;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */

var argsTag$2 = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag$2;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */

var objectProto$6 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

var isArguments = _baseIsArguments(function () {
  return arguments;
}()) ? _baseIsArguments : function (value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
};
var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;
var isArray_1 = isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? _root.Buffer : undefined;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */

  var isBuffer = nativeIsBuffer || stubFalse_1;
  module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;
/** Used to detect unsigned integer values. */

var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */

function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */

var argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] = typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] = typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] = typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] = typedArrayTags[weakMapTag$2] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray(value) {
  return isObjectLike_1(value) && isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports && _freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      } // Legacy `process.binding('util')` for Node.js < 10.


      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  module.exports = nodeUtil;
});

/* Node.js helper references. */

var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */

var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;
var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */

var objectProto$5 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$3.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    _isIndex(key, length)))) {
      result.push(key);
    }
  }

  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$4;
  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeKeys = _overArg(Object.keys, Object);
var _nativeKeys = nativeKeys;

/** Used for built-in method references. */

var objectProto$3 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */

function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */

function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */

var objectProto$2 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }

  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$1.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */

function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Built-in value references. */

  var Buffer = moduleExports ? _root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */

  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }

  module.exports = cloneBuffer;
});

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}

var _copyArray = copyArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }

  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */

var objectProto$1 = Object.prototype;
/** Built-in value references. */

var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbols = !nativeGetSymbols$1 ? stubArray_1 : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return _arrayFilter(nativeGetSymbols$1(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */

function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

var _arrayPush = arrayPush;

/** Built-in value references. */

var getPrototype = _overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbolsIn = !nativeGetSymbols ? stubArray_1 : function (object) {
  var result = [];

  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }

  return result;
};
var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */

function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */

var DataView = _getNative(_root, 'DataView');
var _DataView = DataView;

/* Built-in method references that are verified to be native. */

var Promise$6 = _getNative(_root, 'Promise');
var _Promise = Promise$6;

/* Built-in method references that are verified to be native. */

var Set$1 = _getNative(_root, 'Set');
var _Set = Set$1;

/* Built-in method references that are verified to be native. */

var WeakMap = _getNative(_root, 'WeakMap');
var _WeakMap = WeakMap;

/** `Object#toString` result references. */

var mapTag$3 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$3 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$2 = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag = _baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2 || _Map && getTag(new _Map()) != mapTag$3 || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag$3 || _WeakMap && getTag(new _WeakMap()) != weakMapTag$1) {
  getTag = function (value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;

        case mapCtorString:
          return mapTag$3;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag$3;

        case weakMapCtorString:
          return weakMapTag$1;
      }
    }

    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */

function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

var _initCloneArray = initCloneArray;

/** Built-in value references. */

var Uint8Array = _root.Uint8Array;
var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */

function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */

var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */

function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/** `Object#toString` result references. */

var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';
/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$1:
      return _cloneDataView(object, isDeep);

    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor();

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor();

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** Built-in value references. */

var objectCreate = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject_1(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

var _baseCreate = baseCreate;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneObject(object) {
  return typeof object.constructor == 'function' && !_isPrototype(object) ? _baseCreate(_getPrototype(object)) : {};
}

var _initCloneObject = initCloneObject;

/** `Object#toString` result references. */

var mapTag$1 = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$1;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */

var nodeIsMap = _nodeUtil && _nodeUtil.isMap;
/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */

var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;
var isMap_1 = isMap;

/** `Object#toString` result references. */

var setTag$1 = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$1;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */

var nodeIsSet = _nodeUtil && _nodeUtil.isSet;
/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */

var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;
var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;
/** `Object#toString` result references. */

var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values supported by `_.clone`. */

var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */

function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$1,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject_1(value)) {
    return value;
  }

  var isArr = isArray_1(value);

  if (isArr) {
    result = _initCloneArray(value);

    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }

    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      result = isFlat || isFunc ? {} : _initCloneObject(value);

      if (!isDeep) {
        return isFlat ? _copySymbolsIn(value, _baseAssignIn(result, value)) : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }

      result = _initCloneByTag(value, tag, isDeep);
    }
  } // Check for circular references and return its corresponding clone.


  stack || (stack = new _Stack());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? _getAllKeysIn : _getAllKeys : isFlat ? keysIn_1 : keys_1;
  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    } // Recursively populate clone (susceptible to call stack limits).


    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;
/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */

function cloneDeep(value) {
  return _baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

var cloneDeep_1 = cloneDeep;

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function checkUriValid(uri) {
  // 包括 http://localhost
  var URI_REG = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
  return URI_REG.test(uri);
}

var globalState = {};
var subs = {};
var store = {
  initState: function initState(state) {
    if (!isPlainObject(state)) throw new Error('FetchLoader.store.initSatate: please pass a plain object');
    globalState = cloneDeep_1(state);
  },
  setState: function setState(key, val) {
    if (typeof key !== 'string') throw new Error("FetchLoader.store.setState: key must be a string");
    var oldVal = globalState[key];
    globalState[key] = cloneDeep_1(val);
    var sub = subs[key];

    if (sub && sub.length) {
      var _iterator = _createForOfIteratorHelper(sub),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var fn = _step.value;
          fn(cloneDeep_1(val), cloneDeep_1(oldVal));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  },
  getState: function getState(key) {
    if (!key) return cloneDeep_1(globalState);
    return cloneDeep_1(globalState[key]);
  },
  onStateChange: function onStateChange(key, cb, fireImmediately) {
    if (typeof key !== 'string') throw new Error("FetchLoader.store.onStateChange: key must be a string");

    if (typeof cb !== 'function') {
      console.error('FetchLoader.store.onStateChange: callback must be a function');
      return;
    }

    var sub = subs[key];

    if (sub) {
      if (!sub.find(function (i) {
        return i === cb;
      })) {
        subs[key] = [].concat(_toConsumableArray(sub), [cb]);
      }
    } else {
      subs[key] = [cb];
    }

    if (fireImmediately) {
      cb(cloneDeep_1(globalState[key]));
    }
  },
  offStateChange: function offStateChange(key, cb) {
    if (typeof key !== 'string') throw new Error("FetchLoader.store.offStateChange: key must be a string");
    var sub = subs[key];

    if (sub) {
      if (cb === undefined) {
        // 取消所有订阅
        subs[key] = undefined;
        return true;
      }

      var index = sub.findIndex(function (i) {
        return i === cb;
      });

      if (index > -1) {
        sub.splice(index, 1);
        return true;
      }
    }
  }
}; // 消息总线 用于插件之间，插件和平台之间的消息的传递
// event.on('customEvent', (param) => { // use param }) // 平台
// event.emit('customEvent', { user: 'sam', from: 'plugin-one' }) // 插件

var eventSubs = {};
var event = {
  on: function on(type, cb) {
    if (typeof cb !== 'function') {
      console.error('FetchLoader.event.on: callback must be a function');
      return;
    }

    var sub = eventSubs[type];

    if (sub) {
      if (!sub.find(function (i) {
        return i === cb;
      })) {
        eventSubs[type] = [].concat(_toConsumableArray(sub), [cb]);
      }
    } else {
      eventSubs[type] = [cb];
    }
  },
  off: function off(type, cb) {
    var sub = eventSubs[type];

    if (sub) {
      if (cb === undefined) {
        // 取消所有订阅
        eventSubs[type] = undefined;
        return true;
      }

      var index = sub.findIndex(function (i) {
        return i === cb;
      });

      if (index > -1) {
        sub.splice(index, 1);
        return true;
      }
    }
  },
  emit: function emit(type) {
    var sub = eventSubs[type];

    if (sub && sub.length) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iterator2 = _createForOfIteratorHelper(sub),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var fn = _step2.value;
          fn.apply(void 0, args);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }
};

function genPublicPathVarName(plugId) {
  return '__QYCLOUD_MOD_PUBLIC_PATH_' + plugId + '__';
}
function setPublicPath(plugId, publicPath) {
  window[genPublicPathVarName(plugId)] = publicPath;
}
function getPublicPath(plugId) {
  return window[genPublicPathVarName(plugId)];
}

// css 沙箱
// 1. 不会改写 @import @page @keyframes
// 2. 如果dom超出container之外，样式会丢失，所以建议避免这种情况发生
// TODO
// 1. 主应用全局样式可能会插件样式 通过class
// ```
// .main { color: red } // 主应用样式
// <div class="main"></div> // 插件的dom，并且插件并没有实现该class的样式，所以直接就使用了主应用的样式
// ```
var swapNode = null; // https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule

var RuleTypes = {
  // type: 被改写的样式类型
  // selector { prop1: val1; prop2: val2; }
  STYLE: 1,
  // @media screen and (max-width: 300px) { selector { prop1: val1; prop2: val2; } }
  MEDIA: 4,
  // @supports (display: grid) { div { display: grid; } }
  SUPPORTS: 12,
  // 会将css的ip拼接上去
  // @font-face { font-family: Helvetica; }
  FONT_FACE: 5,
  // type: 不会被改写的类型
  // @import url("style.css") screen
  IMPORT: 3,
  // @page { margin: 1cm }  分页 用于打印
  PAGE: 6,
  // @keyframes slidein {from { transform: translateX(0%);} to { transform: translateX(100%); }}
  KEYFRAMES: 7,
  // 同上
  KEYFRAME: 8
}; // 因为像一些框架将modal/select的下拉框这种dom直接插入到body 置于container之外 如果添加scope将不起作用
// 所以对于上述提到的classname，不对其添加scope
// TODO 但是对于放到modal里的button之类常规组件，也会有该问题，目前没有解决办法

var whiteMap = {
  // element-ui
  '.el-select-dropdown': 1,
  '.el-popper': 1,
  '.el-scrollbar': 1,
  '.popper__arrow': 1,
  '.time-select': 1,
  '.time-select-item': 1,
  '.el-color-dropdown': 1,
  '.el-message': 1,
  '.el-message-box': 1,
  '.el-notification': 1,
  '.el-dialog': 1,
  '.el-popover': 1,
  '.el-popconfirm': 1,
  // vant
  '.van-overflow-hidden': 1,
  '.van-overlay': 1,
  '.van-popup': 1,
  '.van-calendar': 1,
  '.van-cascader': 1,
  '.van-dialog': 1,
  '.van-toast': 1,
  '.van-notify': 1
};
var whiteRegArr = [// elemrnt-ui
/^\.el-select-dropdown/, /^\.el-scrollbar/, /^\.el-cascader/, /^\.el-picker/, /^\.el-data/, /^\.el-color/, /^\.el-message/, /^\.el-message-box/, /^\.el-notification/, /^\.el-dropdown/, /^\.el-dialog/, /^\.el-tooltip/, /^\.el-popover/, /^\.el-popconfirm/, // vant
/^\.van-popup/, /^\.van-calendar/, /^\.van-cascader/, /^\.van-action/, /^\.van-dialog/, /^\.van-hairline/, /^\.van-toast/, /^\.van-notify/];

function ruleStyle(rule, prefix) {
  var rootSelectorRE = /((html)|(body)|(:root))/g;

  if (rootSelectorRE.test(rule.selectorText)) {
    return rule.cssText.replace(rootSelectorRE, prefix);
  }

  if (whiteMap[rule.selectorText] || whiteRegArr.find(function (r) {
    return r.test(rule.selectorText);
  })) {
    return rule.cssText;
  }

  return "".concat(prefix, " ").concat(rule.cssText);
}

function ruleMedia(rule, prefix, relativeCssSrc, cssSrc) {
  var css = rewriteCss(rule.cssRules, prefix, relativeCssSrc, cssSrc);
  return "@media ".concat(rule.conditionText, " {").concat(css, "}");
}

function ruleSupport(rule, prefix, relativeCssSrc, cssSrc) {
  var css = rewriteCss(rule.cssRules, prefix, relativeCssSrc, cssSrc);
  return "@supports ".concat(rule.conditionText, " {").concat(css, "}");
}
/**
 *
 * @param {*} rule
 * @param {*} relativeCssSrc css相对路径
 * @param {*} cssSrc css绝对路径
 * @returns {string}
 */


function ruleFontFace(rule, relativeCssSrc, cssSrc) {
  return rule.cssText.replace(/url\(\"(.*?)\"\)/g, function (match, p1) {
    if (p1) {
      // base 64 or 绝对路径
      if (/base64/.test(p1) || /^https?/.test(p1)) return "url(\"".concat(p1, "\")"); // 相对路径第一个字符为/

      if (p1[0] === '/') {
        return "url(\"".concat(relativeCssSrc).concat(p1, "\")");
      } // 相对路径第一个字符不为/


      return "url(\"".concat(getAbsolutePath(cssSrc, p1), "\")");
    }

    return "url(\"".concat(p1, "\")");
  });
}
function rewriteCss(cssRules, prefixWithTag, relativeCssSrc, cssSrc) {
  var cssText = '';
  Object.keys(cssRules).forEach(function (k) {
    var rule = cssRules[k];

    switch (rule.type) {
      case RuleTypes.STYLE:
        cssText += ruleStyle(rule, prefixWithTag);
        break;

      case RuleTypes.MEDIA:
        cssText += ruleMedia(rule, prefixWithTag, relativeCssSrc, cssSrc);
        break;

      case RuleTypes.SUPPORTS:
        cssText += ruleSupport(rule, prefixWithTag, relativeCssSrc, cssSrc);
        break;

      case RuleTypes.FONT_FACE:
        cssText += ruleFontFace(rule, relativeCssSrc, cssSrc);
        break;

      default:
        cssText += rule.cssText;
        break;
    }
  });
  return cssText;
} // 创建style标签插入到body里 作为一个中间style标签 作用是生成sheet 用来遍历

function createStyleNode() {
  var styleNode = document.createElement('style');
  document.body.appendChild(styleNode);
  styleNode.sheet.disabled = true;
  return styleNode;
}
function process(_ref) {
  var container = _ref.container,
      styleText = _ref.styleText,
      prefix = _ref.prefix,
      cssSrc = _ref.cssSrc,
      _ref$styleIsolation = _ref.styleIsolation,
      styleIsolation = _ref$styleIsolation === void 0 ? false : _ref$styleIsolation,
      _ref$ignoreStyleRuleA = _ref.ignoreStyleRuleArray,
      ignoreStyleRuleArray = _ref$ignoreStyleRuleA === void 0 ? [] : _ref$ignoreStyleRuleA,
      store = _ref.store;
  swapNode = swapNode || createStyleNode();
  swapNode.textContent = styleText;
  swapNode.sheet.disabled = true;
  ignoreStyleRuleArray.forEach(function (c) {
    if (c instanceof RegExp) {
      whiteRegArr.push(c);
    } else if (typeof c === 'string') {
      whiteMap[c] = 1;
    }
  });
  var css = styleIsolation ? rewriteCss(swapNode.sheet.cssRules, prefix, genPublicPath(cssSrc), cssSrc) : styleText; // 插入一个新的stylenode到container里 ，放到里面是因为stylenode可以跟dom一起被移除

  var realStyleNode = document.createElement('style');
  container.appendChild(realStyleNode);
  realStyleNode.textContent = css; // cache css module

  storeCssMod(store, cssSrc, css); // 如果 index.css 是个空文件，swapNode就没有子节点

  swapNode.firstChild && swapNode.removeChild(swapNode.firstChild); // 每次对swapNode的操作都要重新设置disabled

  swapNode.sheet.disabled = true;
}

function storeCssMod(store, cssSrc, css) {
  // 添加缓存到store 必须创建一个新的 stylenode 因为插件dom节点有可能被移除
  var stylenode = document.createElement('style');
  stylenode.textContent = css;
  store.setCssMod(getModuleName(cssSrc), stylenode);
}

function genPublicPath(src) {
  var _urlParse = urlParse(src),
      pathname = _urlParse.pathname,
      protocol = _urlParse.protocol,
      host = _urlParse.host; // font的相对路径为 `${id}_${version}/fonts/xxx.ttf` 所以截取到这之前


  var rPathnameArr = pathname.split('/');
  var rPathname = rPathnameArr.slice(0, rPathnameArr.length - 2).join('/'); // important: 末尾不带 /

  return "".concat(protocol, "//").concat(host).concat(rPathname);
} // 通过绝对地址+相对路径算出 绝对地址
// eg: https://domain/lib/index.css + ../fonts/a.ttf => https://domain/fonts/a.ttf

function getAbsolutePath(aPath, rPath) {
  var rPathArr = rPath.split('../');
  var upTimes = rPathArr.length - 1;

  var _urlParse2 = urlParse(aPath),
      pathname = _urlParse2.pathname,
      protocol = _urlParse2.protocol,
      host = _urlParse2.host;

  var rPathnameArr = pathname.split('/');
  var rPathname = rPathnameArr.slice(0, rPathnameArr.length - 1 - upTimes).join('/');
  return "".concat(protocol, "//").concat(host).concat(rPathname, "/").concat(rPathArr.pop());
}
function getModuleName(src) {
  var r = src.split('/');
  return r[r.length - 2];
}

function urlParse(url) {
  var link = document.createElement('a');
  link.href = url;
  var pathname = link.pathname;

  if (/^\//.test(pathname) === false) {
    pathname = '/' + pathname;
  }

  return {
    pathname: pathname,
    protocol: link.protocol,
    host: link.host,
    port: link.port,
    hostname: link.hostname,
    hash: link.hash,
    search: link.search,
    href: url
  };
}

var factories = Object.create(null);
var Promise$5 = window.Promise;
var LoaderTypes = {
  SCRIPT: 'script',
  FETCH: 'fetch'
};

var ModuleLoader = /*#__PURE__*/function () {
  function ModuleLoader() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ModuleLoader);

    this.__loaderType__ = LoaderTypes.SCRIPT;
    this.opts = opts;
    opts.baseUrl && (this.baseUrl = opts.baseUrl);
    this.timeout = opts.timeout || 30;
    this.moduleStore = createStore(); // TODO 加上 cors 开关 如果远程代码不支持 cors 则不开启

    this.cors = opts.cors || true; // 默认使用 define

    this.useDefine = opts && opts.useDefine !== undefined ? opts.useDefine : true;
    if (this.useDefine) this._registerDefine();
  }

  _createClass(ModuleLoader, [{
    key: "getModule",
    value: function getModule(name) {
      return this.moduleStore.get(name);
    }
    /**
     * 预加载 在网络空闲的时候进行js的预加载
     */

  }, {
    key: "prefetch",
    value: function prefetch(moduleData) {
      if (!isPlainObject(moduleData)) {
        throw 'ModuleLoader: 请传入模块对象';
      }

      var _handleModuleSrc2 = _handleModuleSrc(moduleData, this.baseUrl),
          status = _handleModuleSrc2.status,
          data = _handleModuleSrc2.data;

      if (status === 'ok') {
        Object.keys(data).forEach(function (moduleName) {
          var link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'script';
          link.href = data[moduleName];
          document.head.appendChild(link);
        });
      } else {
        console.error(data);
      }
    }
    /**
     * 加载模块js
     * @param {*} moduleData
     * @param {*} opts
     * @param {*} cb 处理模块的回调
     * @param {*} errorCb 处理错误的回调
     */

  }, {
    key: "load",
    value: function load(moduleData, opts, cb, errorCb) {
      var _this = this;

      if (arguments.length === 2) {
        if (typeof arguments[1] !== 'function') {
          throw '第二个参数请传入回调函数';
        }

        cb = opts;
      }

      if (arguments.length === 3) {
        if (typeof arguments[1] === 'function') {
          errorCb = cb;
          cb = opts;
        } else if (!isPlainObject(arguments[1])) {
          throw '第二个参数请传入对象';
        }
      }

      if (!isPlainObject(moduleData)) {
        throw 'ModuleLoader: 请传入模块对象';
      }

      var _handleModuleSrc3 = _handleModuleSrc(moduleData, this.baseUrl),
          status = _handleModuleSrc3.status,
          data = _handleModuleSrc3.data;

      if (status === 'ok') {
        // 保存到 store 此时为 not_load
        Object.keys(data).forEach(function (name) {
          if (!_this.moduleStore.has(name)) {
            _this.moduleStore.set(name, data[name], true);
          }
        });

        this._load(data, opts).then(function (res) {
          cb && cb.apply(void 0, _toConsumableArray(res));
        }).catch(function (err) {
          if (errorCb) {
            errorCb(err);
          } else {
            console.error('ModuleLoader: ', err);
          }
        });
      } else {
        if (errorCb) {
          errorCb(err);
        } else {
          console.error('ModuleLoader: ', data);
        }
      }
    }
  }, {
    key: "loadCss",
    value: function loadCss(url, callback) {
      return _loadCss(url, callback);
    } // opts 暂时没用

  }, {
    key: "_load",
    value: function _load(moduleData, opts) {
      var _this2 = this;

      if (!Promise$5) throw new Error('FetchLoader: window.Promise not found, please polyfill it!'); // 如果是加载一个模块还比较好实现，如果是多个怎么处理 => 想到一个方法，是将callback调用多次(每次处理完一个模块就调用一次)
      // const { onReady, onLoad, onDestroy } = opts

      var moduleStore = this.moduleStore;
      var promiseArr = [];
      Object.keys(moduleData).forEach(function (moduleName) {
        // if module loaded
        if (moduleStore.getStatus(moduleName) === LoadStatus.LOADED) {
          promiseArr.push(Promise$5.resolve(moduleStore.get(moduleName).mod));
          return;
        } // if module is loading


        if (moduleStore.getStatus(moduleName) === LoadStatus.LOADING) {
          var p = new Promise$5(function (resolve) {
            // important: 当发现该模块已经在加载中的时候开启订阅，加载完成后触发该事件
            event.on("__load_module_".concat(moduleName, "__"), function (_mod) {
              resolve(_mod);
            });
          });
          promiseArr.push(p);
          return;
        } // if module not_load


        if (moduleStore.getStatus(moduleName) === LoadStatus.NOT_LOAD) {
          // 自动加载css
          var styleUrl = moduleData[moduleName].replace(/\.js$/, '.css');

          _this2.loadCss(styleUrl);

          moduleStore.setStatus(moduleName, LoadStatus.LOADING);
          promiseArr.push(new Promise$5(function (resolve, reject) {
            var scriptSrc = moduleData[moduleName];

            var script = _this2.createNode(scriptSrc, moduleName);

            var timeout; // to catch script runtime error
            // let scriptRuntimeErr;
            // function windowErrorListener(evt) {
            //   console.log(evt, 'evt');
            //   if (evt.filename === scriptSrc) {
            //     scriptRuntimeErr = evt.error;
            //   }
            //   return true;
            // }
            // window.addEventListener('error', windowErrorListener);

            script.onload = function () {
              script.onerror = script.onload = null;
              timeout && clearTimeout(timeout); // remove listener and reject runtime error, need cors support
              // window.removeEventListener('error', windowErrorListener);
              // if (scriptRuntimeErr) {
              //   reject(scriptRuntimeErr)
              // }

              var factory = factories[moduleName];
              var deps = factories.depends;
              var ctx = _this2;

              if (factories[moduleName]) {
                // amd
                if (deps) {
                  ctx.load(deps, function () {
                    // 模块可以直接返回 `值` (如果返回的值为函数，需要包一层函数)和 `工厂函数`
                    if (typeof factory === 'function') {
                      // important => 把依赖执行完获取的参数传递到上一层模块
                      factory = factory.apply(null, arguments);
                    }

                    ctx.moduleStore.set(moduleName, factory); // 发送事件，通知模块已经加载成功

                    event.emit("__load_module_".concat(moduleName, "__"), factory);
                    resolve(factory);
                    ctx.log(moduleName, '模块加载完成-define');
                  });
                } else {
                  if (typeof factory === 'function') {
                    factory = factory();
                  }

                  ctx.moduleStore.set(moduleName, factory);
                  event.emit("__load_module_".concat(moduleName, "__"), factory);
                  resolve(factory);

                  _this2.log(moduleName, '模块加载完成-define');
                }
              } else if (window[moduleName]) {
                // window
                var gFactory = window[moduleName];

                if (typeof gFactory === 'function') {
                  gFactory = gFactory();
                }

                ctx.moduleStore.set(moduleName, gFactory);
                event.emit("__load_module_".concat(moduleName, "__"), gFactory);
                resolve(gFactory);

                _this2.log(moduleName, '模块加载完成-window');
              } else {
                // fail
                ctx.moduleStore.setStatus(moduleName, LoadStatus.EXECTED_ERR);
                reject({
                  msg: "".concat(moduleName, ": \u6A21\u5757\u52A0\u8F7D\u5931\u8D25, \u8BF7\u786E\u4FDD\u4F7F\u7528\u4E86\u6B63\u786E\u7684\u6A21\u5757\u540D")
                });
              }
            }; // handle error


            script.onerror = function () {
              script.onerror = script.onload = null;
              timeout && clearTimeout(timeout);
              reject({
                msg: "".concat(moduleName, ": \u6A21\u5757\u811A\u672C\u52A0\u8F7D\u5931\u8D25")
              });

              _this2.moduleStore.setStatus(moduleName, LoadStatus.LOADED_ERR);
            }; // handle timeout


            timeout = setTimeout(function () {
              script.onerror = script.onload = null;
              reject({
                msg: "Timeout for loading module: ".concat(moduleName)
              });

              _this2.moduleStore.setStatus(moduleName, LoadStatus.LOADED_ERR);
            }, _this2.timeout * 1000);
            document.head.appendChild(script);
          }));
        }
      });
      return Promise$5.resolve(Promise$5.all(promiseArr));
    }
  }, {
    key: "_registerDefine",
    value: function _registerDefine() {
      var ctx = this; // avoid multiple define

      if (window.define && window.define.amd && window.define.__AY__) {
        return;
      }

      window.define = function (moduleName, deps, factory) {
        var node = ctx.getCurrentScript();

        if (arguments.length === 1) {
          // define(fn)
          factory = moduleName;
          deps = [];
        } else if (arguments.length === 2) {
          // define('name', fn) | define([], fn)
          factory = deps;
          deps = Array.isArray(deps) ? deps : [];
        }

        var modName = ctx._getModuleName(arguments, node);

        factories[modName] = factory;
        factories.depends = deps.length ? ctx._getDepsModuleData(deps, node) : null;
      };

      window.define.amd = {};
      window.define.__AY__ = true;
    }
    /**
     * 获取模块名
     * important => 如果 amd 定义的模块有模块名 就使用模块名 而且传入的必须要和定义的一样
     * important => 如果是匿名模块，则使用传入的模块名
     * @param {arguments} args
     * @param {Node} node
     * @return {String}
     */

  }, {
    key: "_getModuleName",
    value: function _getModuleName(args, node) {
      var modName; // 如果模块有模块名 使用模块自己的名称
      // 但是要保证传入的模块名和模块本身的模块名保持一致 因为 moduleStore 存的时候使用的是传入的模块名

      if (typeof args[0] === 'string') {
        // 如果定义了模块名 使用该名为模块名
        modName = args[0];
      } else {
        // 如果是匿名模块 使用传入的模块名
        // document.currentScript 为当前执行的脚本dom节点 用来获取外部传入的模块名
        if (node) {
          modName = node.getAttribute('data-modulename');
        } else {
          throw "Can't get current script";
        }
      }

      return modName;
    }
    /**
     * 根据依赖数组(字符串数组)，获取依赖对象 moduleData
     * @param {Array<string>} deps
     * @param {Node} node
     * @return {Object}
     */

  }, {
    key: "_getDepsModuleData",
    value: function _getDepsModuleData(deps, node) {
      var depsModuleData = {};
      deps.forEach(function (dep) {
        var reg = /(.*\/)*([^.]+).*/gi;

        if (/^https?/.test(dep)) {
          // 如果是一个完整的地址，将文件名作为其模块名
          var filename = dep.replace(reg, '$2');
          depsModuleData[filename] = dep;
        } else {
          // 如果是模块名 拼成完整路径
          // todo 需要考虑不在一个文件目录的情况吗
          depsModuleData[dep] = node.src.replace(reg, '$1') + dep + '.js';
        }
      });
      return depsModuleData;
    } // 安装模块 是由使用者自己去做？因为插件的注册方法不是一样的

  }, {
    key: "install",
    value: function install(moduleName, mod) {
      if (!options.doRegister) return;

      try {
        typeof mod === 'function' ? mod.call(this, Vue) : mod.install.call(this, Vue);
        this.log(moduleName, '模块注册完成');
      } catch (err) {
        console.warn("\u6A21\u5757\u6CE8\u518C\u5931\u8D25".concat(err));
      }
    }
  }, {
    key: "createNode",
    value: function createNode(src, name) {
      var node = document.createElement('script');
      node.type = 'text/javascript';
      node.async = true; // https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script
      // 为了通过 window.onerror 获取更多的报错信息 但是需要cors支持
      // node.crossOrigin = 'anonymous';

      src && (node.src = src);
      name && node.setAttribute('data-modulename', name);
      return node;
    } // 兼容ie11
    // steal from https://github.com/egoist/tiny-current-script/blob/master/src/index.ts

  }, {
    key: "getCurrentScript",
    value: function getCurrentScript() {
      if (typeof document === 'undefined') {
        return null;
      }

      if ('currentScript' in document && 1 < 2
      /* hack to trip TS' flow analysis */
      ) {
          return (
            /** @type {any} */
            document.currentScript
          );
        } // IE11 workaround
      // we'll get the src of the current script by parsing IE11's error stack trace
      // this will not work for inline scripts


      try {
        throw new Error();
      } catch (err) {
        // Get file src url from stack. Specifically works with the format of stack traces in IE.
        // A stack will look like this:
        //
        // Error
        //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
        //    at Global code (http://localhost/components/prism-core.js:606:1)
        var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];

        if (src) {
          var scripts = document.getElementsByTagName('script');

          for (var i in scripts) {
            if (scripts[i].src == src) {
              return scripts[i];
            }
          }
        }

        return null;
      }
    }
  }, {
    key: "log",
    value: function log(title, content) {
      console.log("%c".concat(title, "%c").concat(content), 'background: #00d1b2; padding: 5px; color: #fff; border-radius: 5px 0 0 5px', 'background: #555; padding: 5px; color: #fff; border-radius: 0 5px 5px 0');
    }
  }], [{
    key: "install",
    value: // 为vue暴露Vue.use方法
    function install(Vue, opts) {
      var Ctor = this;
      Vue.prototype.$moduleLoader = new Ctor(opts);
    }
  }]);

  return ModuleLoader;
}();
/**
 * 加载外部css文件
 * @param {String|Array} url url为字符串或数组
 * @param {Function} callback
 * @returns void
 */


function _loadCss(url, callback) {
  function createLink(uri) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';

    link.onload = function () {
      link.onload = link.onerror = null;

      link.onload = function () {}; // for style dimensions queries, a short delay can still be necessary


      callback && setTimeout(callback, 7);
    };

    link.onerror = function () {
      link.onload = link.onerror = null;
      console.error("loadCss: css \u52A0\u8F7D\u5931\u8D25\uFF0C".concat(uri));
    };

    link.href = uri;
    document.head.appendChild(link);
  }

  if (Array.isArray(url)) {
    var _iterator = _createForOfIteratorHelper(url),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;

        if (!/^https?/.test(item)) {
          console.error("loadCss: url '".concat(item, "' \u683C\u5F0F\u4E0D\u6B63\u786E"));
        } else {
          createLink(item);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    if (!/^https?/.test(url)) {
      console.error("loadCss: url '".concat(url, "' \u683C\u5F0F\u4E0D\u6B63\u786E"));
      return;
    }

    createLink(url);
  }
}
function _handleModuleSrc(moduleData, baseUrl) {
  var finalModuleData = {},
      errMsg = [];
  Object.keys(moduleData).forEach(function (moduleName) {
    var scriptSrc = moduleData[moduleName];

    if (!/^https?/.test(scriptSrc) && baseUrl) {
      scriptSrc = baseUrl + scriptSrc;
    }

    if (!checkUriValid(scriptSrc)) {
      errMsg.push("".concat(moduleName, ": url '").concat(scriptSrc, "' invalid!"));
    }

    finalModuleData[moduleName] = scriptSrc; // auto set publicPath

    var prefix = moduleName.split('_')[0]; // important genPublicPath 生成的路径末尾不带 / 这里需要加一下
    // 如果外面手动设置了 publicPath 则使用外面的

    if (!getPublicPath(prefix)) {
      setPublicPath(prefix, genPublicPath(scriptSrc) + '/');
    }
  });
  if (errMsg.length) return {
    status: 'error',
    data: errMsg.join('\n')
  };
  return {
    status: 'ok',
    data: finalModuleData
  };
}

// 参考链接1 https://segmentfault.com/a/1190000018425747?utm_source=sf-related
// 参考链接2 https://segmentfault.com/a/1190000020463234
// 一：沙箱的目的：让插件安全，稳定，高效的运行
// 1. 防止第三方的恶意代码，比如防止恶意篡改全局变量
//    -- 浏览器本身 window, self(window), globalThis(window), top(window), parent(window), document, location
//    -- 被暴露的框架，库变量 Vue, Element, Vuex, $, jQuery, BScroll, _
//    -- 普通的全局变量 globalConfig, $AY, AY, AYdialogs, AYlayer, AYmodalDialogs, Assets, ssrAssets
// 2. 防止第三方代码对全局环境的污染，比如第三方代码和平台，多个第三方代码之间的代码操作同一个数据，造成代码报错或非预期效果
//    由于代码的全局作用域被劫持，第三方对全局作用域的修改全部被限制在局部作用域内 这样问题就解决了
// 3. 每个插件都跑在不同的沙箱实例里 在 mount 阶段准备沙箱；在 unmount 阶段销毁沙箱 并清理全局状态
// 4. 稳定 - 插件不能拖慢 qycloud
// 二：使用 (new Funciton/eval)+with(可选，作用为劫持全局作用域)+Proxy 只能实现有限的沙箱
// "有限"的本质是因为第三方代码和当前应用的代码运行在同一个线程
// 1. 不能防止别人通过 ({}).__proto__ 来访问变量的原型对象，该hack方法被成为沙箱逃逸
//    可以通过freeze掉原型对象 防止对原型对象的篡改
// 2. 对于不支持 Proxy 的浏览器，使用 defineProperty 来修改 configurable & writable 为 false
// 3. 不能防止别人写的死循环代码来导致程序卡死 比如 while(true) {}
var SandboxTypes = {
  PROXY: 'proxy',
  DEFINE_PROPERTY: 'defineProperty'
}; // TODO 这些全局变量因为无法被重新给 可以不用受with影响?? 这些变量明明可以被重写啊！

var UNSCOPABLES = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
};
var FREEZE_GLOBAL_VAR_LIST = ['Vue', 'Vuex', 'ELEMENT', '$', 'jQuery', 'BScroll', '_', 'globalConfig', '$AY', 'AY', 'AYdialogs', 'AYlayer', 'AYmodalDialogs', 'Assets', 'ssrAssets']; // 从沙箱逃逸的属性

var whiteList = [// System.js used a indirect call with eval, which would make it scope escape to global
'System', // https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
'__cjsWrapper', // webpack 使用 webpackJsonp_name_ 来记录 code spliting 出去的代码
'webpackJsonp_name_'];
var activeSandboxCount = 0;

var ProxySandbox = /*#__PURE__*/function () {
  function ProxySandbox(name) {
    _classCallCheck(this, ProxySandbox);

    this.name = name;
    this.__IS_DESIGN_PLUGIN_SANDBOX__ = true;
    this.__TYPE__ = SandboxTypes.PROXY; // 用于保存沙箱内代码修改过的全局变量

    this.updatedValSet = new Set();
    this.sandboxRunning = true;
    this.proxy = this.createProxy(); // freezePrototype()
  }

  _createClass(ProxySandbox, [{
    key: "active",
    value: function active() {
      if (!this.sandboxRunning) activeSandboxCount++;
      this.sandboxRunning = true;
    }
    /**
     * 在最后一个沙箱关闭前
     * 删除所有白名单里的全局状态
     * 解除冻结的原型对象
     * 如果是冻结全局变量，则需要解除这些冻结
     */

  }, {
    key: "inactive",
    value: function inactive() {
      var _this = this;

      // TODO: 但是如果先打开proxy1，再打开proxy2，然后proxy2.a = 1，
      // 然后关闭proxy2，再关闭proxy1，这样window.a就不能被清理掉了
      if (--activeSandboxCount === 0) {
        // 把白名单里的属性删除，如果有的话
        whiteList.forEach(function (k) {
          if (_this.proxy.hasOwnProperty(k)) {
            delete window[k];
          }
        });
      }

      this.sandboxRunning = false;
    }
  }, {
    key: "runScript",
    value: function runScript(src) {
      if (this.sandboxRunning) {
        // TODO 如果要加hook可以参考 html-import-entry 的写法
        // https://github.com/kuitos/import-html-entry/blob/master/src/index.js#L158
        var fn = new Function('sandbox', "try {\n          with(sandbox){;".concat(src, "}\n        } catch(e) {\n          console.error('[plugin-sandbox: ").concat(this.name, "] catch error: ')\n          throw e\n        }")); // 用 proxy 代替函数里的 this 防止 this 访问 window

        fn.call(this.proxy, this.proxy);
      }
    }
  }, {
    key: "createProxy",
    value: function createProxy() {
      var rawWindow = window;

      var _createFakeWindow = createFakeWindow(window),
          fakeWindow = _createFakeWindow.fakeWindow,
          propertiesWithGetter = _createFakeWindow.propertiesWithGetter;

      var updatedValSet = this.updatedValSet,
          sandboxRunning = this.sandboxRunning;
      var descriptorTargetMap = new Map();

      var hasOwnProperty = function hasOwnProperty(key) {
        return fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
      };

      var proxy = new Proxy(fakeWindow, {
        // trap for `in` operator
        // 但是使用 window.xxx 还是会走到has里来 ???
        has: function has(target, key) {
          // console.log('in has =>  ', target, key)
          return key in UNSCOPABLES || key in target || key in rawWindow;
        },
        get: function get(target, key) {
          // Symbol.unscopables: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
          // TODO key 有时为 Symbol.unscopables ???
          // console.log('in get =>', target, key, target[Symbol.unscopables])
          if (key === Symbol.unscopables) return UNSCOPABLES; // 避免直接使用 window.xxx/self.xxx/globalThis.xxx 来修改全局属性

          if (key === 'window' || key === 'self' || key === 'globalThis') return proxy; // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/parent
          // window.parent => 返回当前窗口的父窗口对象 如果一个窗口没有父窗口,则它的 parent 属性为自身的引用
          // window.top => 返回窗口层级最顶层窗口的引用 如果一个窗口没有父窗口,则它的 top 属性为自身的引用

          if (key === 'top' || key === 'parent') {
            // 如果当前窗口没有父窗口
            if (rawWindow === rawWindow.parent) return proxy; // 如果有父窗口 即 window.top 和 当前 window 通过 iframe 隔离，可以放出沙箱

            return rawWindow[key];
          }

          if (key === 'hasOwnProperty') return hasOwnProperty; // document/window/location/top 这个属性是通过getter获取 如果使用 target[key] 会报 Illegal invocation

          var val = null;

          if (propertiesWithGetter.has(key)) {
            val = rawWindow[key];
          } else if (key in target) {
            // 说明是插件新加的属性
            val = target[key];
          } else {
            // 如果target上找不到则从window上找
            if (FREEZE_GLOBAL_VAR_LIST.indexOf(key) === -1) {
              val = rawWindow[key];
            }
          }

          return val;
        },
        set: function set(target, key, val) {
          // console.log('in set...', key, val)
          if (sandboxRunning) {
            // 1. fakeWindow有，window有    => 说明是用户自己加上的
            // 2. fakeWindow有，window没有   => 说明是用户自己加上的
            // 3. fakeWindow没有，window有   => 试图修改window上的原始属性
            // 4. fakeWindow没有，window没有  => 说明是用户自己加上的
            if (target.hasOwnProperty(key) && rawWindow.hasOwnProperty(key)) {
              // 将 set 操作移到 fakeWindow 上
              target[key] = val;
            } else if (target.hasOwnProperty(key) && !rawWindow.hasOwnProperty(key)) {
              target[key] = val;
            } else if (!target.hasOwnProperty(key) && rawWindow.hasOwnProperty(key)) {
              // console.warn(`who is trying change ${target[key]} to ${val}`);
              var descriptor = Object.getOwnPropertyDescriptor(rawWindow, key);

              var _ref = descriptor || {},
                  writable = _ref.writable,
                  configurable = _ref.configurable,
                  enumerable = _ref.enumerable; // 防止 strict-mode 报错


              if (writable) {
                Object.defineProperty(target, key, {
                  configurable: configurable,
                  enumerable: enumerable,
                  writable: writable,
                  value: val
                });
              }
            } else {
              target[key] = val;
            }

            if (whiteList.indexOf(key) > -1) {
              rawWindow[key] = val;
            }

            updatedValSet.add(key);
          } // 防止 strict-mode 抛出错误


          return true;
        },
        // delete proxy[foo] 和 delete proxy.foo
        deleteProperty: function deleteProperty(target, key) {
          if (target.hasOwnProperty(key)) {
            delete target[key];
            updatedValueSet.delete(key);
          }

          return true;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, p) {
          if (target.hasOwnProperty(p)) {
            var descriptor = Object.getOwnPropertyDescriptor(target, p);
            descriptorTargetMap.set(p, 'target');
            return descriptor;
          }

          if (rawWindow.hasOwnProperty(p)) {
            var _descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);

            descriptorTargetMap.set(p, 'rawWindow'); // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

            if (_descriptor && !_descriptor.configurable) {
              _descriptor.configurable = true;
            }

            return _descriptor;
          }

          return undefined;
        },
        // trap for Object.getOwnPropertyNames(),Object.getOwnPropertySymbols(),Object.keys(),Reflect.ownKeys()
        ownKeys: function ownKeys(target) {
          var keys = uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
          return keys;
        },
        defineProperty: function defineProperty(target, p, attributes) {
          var from = descriptorTargetMap.get(p);
          /*
           Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
           otherwise it would cause a TypeError with illegal invocation.
           */

          switch (from) {
            case 'rawWindow':
              return Reflect.defineProperty(rawWindow, p, attributes);

            default:
              return Reflect.defineProperty(target, p, attributes);
          }
        }
      }); // https://github.com/facebook/react/issues/16606 针对浏览器实现的api 避免TypeError
      // firefox: TypeError: xxx called on an object that does not implement interface Window.
      // chrome: TypeError: Illegal invocation

      var obj = {
        // eval: (code) => {
        //   return this.runScript(code)
        // },
        alert: alert.bind(window),
        confirm: confirm.bind(window),
        prompt: prompt.bind(window),
        open: open.bind(window),
        close: close.bind(window),
        print: print.bind(window),
        postMessage: postMessage.bind(window),
        fetch: fetch.bind(rawWindow),
        focus: focus.bind(window),
        setTimeout: setTimeout.bind(window),
        clearTimeout: clearTimeout.bind(window),
        setInterval: setInterval.bind(window),
        clearInterval: clearInterval.bind(window),
        requestAnimationFrame: requestAnimationFrame.bind(window),
        cancelAnimationFrame: cancelAnimationFrame.bind(window),
        addEventListener: addEventListener.bind(window),
        removeEventListener: removeEventListener.bind(window),
        matchMedia: matchMedia.bind(window),
        queueMicrotask: queueMicrotask.bind(window),
        getComputedStyle: getComputedStyle.bind(window),
        getSelection: getSelection.bind(window),
        resizeBy: resizeBy.bind(window),
        resizeTo: resizeTo.bind(window),
        scroll: scroll.bind(window),
        scrollBy: scrollBy.bind(window),
        scrollTo: scrollTo.bind(window)
      };

      for (var k in obj) {
        proxy[k] = obj[k];
      } // important: 这三个api safari 不支持，所以需要判断


      if (typeof window.createImageBitmap !== 'undefined') proxy['createImageBitmap'] = createImageBitmap.bind(window);
      if (typeof window.requestIdleCallback !== 'undefined') proxy['requestIdleCallback'] = requestIdleCallback.bind(window);
      if (typeof window.cancelIdleCallback !== 'undefined') proxy['cancelIdleCallback'] = cancelIdleCallback.bind(window);
      activeSandboxCount++;
      return proxy;
    }
  }]);

  return ProxySandbox;
}();

var Sandbox = /*#__PURE__*/function () {
  function Sandbox(name, freezeList) {
    _classCallCheck(this, Sandbox);

    this.name = name;
    this.__IS_DESIGN_PLUGIN_SANDBOX__ = true;
    this.__TYPE__ = SandboxTypes.DEFINE_PROPERTY;
    this.freezeList = freezeList; // freezePrototype()

    freezeGlobalVar(freezeList);
  }
  /**
   * @param {string} src 代码
   */


  _createClass(Sandbox, [{
    key: "runScript",
    value: function runScript(src) {
      var fn = new Function("try {\n        ;".concat(src, "\n      } catch(e) {\n        console.error('[plugin-sandbox: ").concat(this.name, "] catch error: ')\n        throw e\n      }"));
      fn.call(window);
    }
  }]);

  return Sandbox;
}();
/**
 * 冻结部分全局变量
 * - 浏览器本身 这些变量只有 globalThis & parent 是可写的，只需要处理这两个即可  window, self(window), globalThis(window), top(window), parent(window), document, location
 * - 被暴露的框架，库变量 Vue, Element, Vuex, $, jQuery, BScroll, _
 * - 普通的全局变量 globalConfig, $AY, AY, AYdialogs, AYlayer, AYmodalDialogs, Assets, ssrAssets
 */


function freezeGlobalVar() {
  var freezeList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  if (window.__GLOBAL_VAR_FREEZED__) return window;
  var rawObjectDefineProperty = Object.defineProperty;
  var mergedList = FREEZE_GLOBAL_VAR_LIST.concat(freezeList);
  mergedList.forEach(function (k) {
    // 只需要劫持window，self等是对window的引用
    var descriptor = Object.getOwnPropertyDescriptor(window, k);

    if (descriptor && descriptor.configurable) {
      // 不能将 configurable 修改为 false 否则无法解冻
      // descriptor.configurable = false;
      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get'); // parent 属性是 getter/setter 设置的 修改 writable 属性会报错
      // Uncaught TypeError: property descriptors must not specify a value or be writable when a getter or setter has been specified

      if (!hasGetter) {
        descriptor.writable = false;
      }

      rawObjectDefineProperty(window, k, descriptor);
    }
  });
  window.__GLOBAL_VAR_FREEZED__ = true;
}

function createFakeWindow(global) {
  var rawObjectDefineProperty = Object.defineProperty;
  var propertiesWithGetter = new Map();
  var fakeWindow = {};
  Object.getOwnPropertyNames(global).filter(function (p) {
    // 筛选不可修改描述符的属性 chrome 有以下几个
    // "Infinity"
    // "NaN"
    // "undefined"
    // "window"
    // "document"
    // "location"
    // "top"
    // "chrome"
    var descriptor = Object.getOwnPropertyDescriptor(global, p);
    return descriptor && !descriptor.configurable;
  }).forEach(function (p) {
    var descriptor = Object.getOwnPropertyDescriptor(global, p);

    if (descriptor) {
      // 是否有get属性
      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get'); // 修改部分特殊属性为可修改

      /*
      make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
      see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
      > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
      */

      if (p === 'top' || p === 'parent' || p === 'self' || p === 'window') {
        // 属性可delete，属性可修改其描述符
        descriptor.configurable = true;
        /*
        The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
        Example:
        Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
        Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
        */

        if (!hasGetter) {
          // 属性可修改
          descriptor.writable = true;
        }
      } // 记录可访问属性


      if (hasGetter) propertiesWithGetter.set(p, true); // 将属性绑定到新对象上，并冻结
      // freeze the descriptor to avoid being modified by zone.js
      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
    }
  }); // console.log(fakeWindow, propertiesWithGetter, 1)

  return {
    fakeWindow: fakeWindow,
    propertiesWithGetter: propertiesWithGetter
  };
}

function uniq(array) {
  var o = Object.create(null);
  return array.filter(function (element) {
    return element in o ? false : o[element] = true;
  });
}

function createSandbox(name, freezeList) {
  if (window.Proxy) {
    return new ProxySandbox(name);
  }

  return new Sandbox(name, freezeList);
}

var Promise$4 = window.Promise;

var getScopedCssPrefix = function getScopedCssPrefix(id) {
  return "data-qycloud-".concat(id);
};

var noop = function noop() {};

function genInnerContainer(container, prefix) {
  var innerContainer = document.createElement('div');
  container.setAttribute('class', "qycloud-micro-component-".concat(prefix));
  container.setAttribute(getScopedCssPrefix(prefix), '');
  container.appendChild(innerContainer); // TODO 是否需要监听此dom被移除事件 然后调用 unmount 方法
  // unmount 理应由使用者去调用，而不是在框架内部自动调用
  // const ob = new MutationObserver((mutationList, observer) => {
  //   console.log(mutationList)
  //   for (const i of mutationList) {
  //     console.log(typeof i.removedNodes,';')
  //     Object.keys(i.removedNodes).forEach(k => {
  //       if (i.removedNodes[k] === container) {
  //         console.log('111')
  //       }
  //     })
  //   }
  // })
  // ob.observe(document.body, { childList: true })

  return innerContainer;
}

function fetch$1(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!window.fetch) {
    throw new Error('FetchLoader: window.fetch not found, please polyfill it!');
  }

  return window.fetch(url, _objectSpread2({
    mode: 'cors'
  }, opts)).then(function (res) {
    if (res.ok) return res.text();
    throw res;
  });
}

var FetchLoader = /*#__PURE__*/function () {
  function FetchLoader() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        baseUrl = _ref.baseUrl,
        styleIsolation = _ref.styleIsolation,
        ignoreStyleRuleArray = _ref.ignoreStyleRuleArray;

    _classCallCheck(this, FetchLoader);

    this.__loaderType__ = LoaderTypes.FETCH;
    this.baseUrl = baseUrl || '';
    this.styleIsolation = !!styleIsolation;
    this.ignoreStyleRuleArray = ignoreStyleRuleArray;
    this.moduleStore = createStore();
  }

  _createClass(FetchLoader, [{
    key: "getModule",
    value: function getModule(name) {
      return this.moduleStore.get(name);
    }
  }, {
    key: "prefetch",
    value: function prefetch(moduleData) {
      if (!isPlainObject(moduleData)) throw new Error('FetchLoader.prefetch: moduleData 请传入对象');

      var _handleModuleSrc2 = _handleModuleSrc(moduleData, this.baseUrl),
          status = _handleModuleSrc2.status,
          data = _handleModuleSrc2.data;

      if (status === 'ok') {
        Object.keys(data).forEach(function (moduleName) {
          var link = document.createElement('link');
          link.rel = 'fetch';
          link.as = 'script';
          link.crossorigin = 'anonymous';
          link.href = data[moduleName];
          document.head.appendChild(link);
        });
      } else {
        console.error(data);
      }
    }
    /**
     * fetch 加载js，自动加载css
     * @param {*} moduleData
     * @param {*} cb 只作用于js的回调
     * @param {*} errorCb 分别作用于js和css
     */

  }, {
    key: "fetch",
    value: function fetch(moduleData, cb, errorCb) {
      var _this = this;

      if (!Promise$4) throw new Error('FetchLoader: window.Promise not found, please polyfill it!');
      if (!isPlainObject(moduleData)) throw new Error("FetchLoader.fetch: moduleData \u8BF7\u4F20\u5165\u5BF9\u8C61");

      var _handleModuleSrc3 = _handleModuleSrc(moduleData, this.baseUrl),
          status = _handleModuleSrc3.status,
          data = _handleModuleSrc3.data;

      if (status === 'ok') {
        // 保存到 store 此时为 not_load
        Object.keys(data).forEach(function (name) {
          if (!_this.moduleStore.has(name)) {
            _this.moduleStore.set(name, data[name], true);
          }
        });

        this._fetchScript(data).then(function (res) {
          cb && cb.apply(void 0, _toConsumableArray(res));
        }).catch(function (err) {
          _this._handleError(err, 'fetchScript', errorCb);
        });
      } else {
        this._handleError(data, 'fetch', errorCb);
      }
    }
    /**
     * @param {Object} moduleData eg: { 'A': 'http://domain/a.js', 'B': 'http://domain/b.js' }
     */

  }, {
    key: "_fetchScript",
    value: function _fetchScript(moduleData) {
      var _this2 = this;

      var promiseArr = [];
      Object.keys(moduleData).forEach(function (moduleName) {
        var scriptSrc = moduleData[moduleName];

        if (!checkUriValid(scriptSrc)) {
          promiseArr.push(Promise$4.reject("FetchLoader: ".concat(moduleName, " \u7684\u8BF7\u6C42\u5730\u5740 ").concat(scriptSrc, " \u4E0D\u6B63\u786E")));
        } else {
          // if module loaded or loaded error
          if (_this2.moduleStore.getStatus(moduleName) === LoadStatus.LOADED) {
            var mod = _this2.moduleStore.get(moduleName).mod;

            promiseArr.push(Promise$4.resolve(_this2._getRealMod({
              moduleName: moduleName,
              mod: mod
            })));
            return;
          } // if module is loading


          if (_this2.moduleStore.getStatus(moduleName) === LoadStatus.LOADING) {
            var p = new Promise$4(function (resolve) {
              // important: 当发现该模块已经在加载中的时候开启订阅，加载完成后触发该事件
              event.on("__fetch_module_".concat(moduleName, "__"), function (_mod) {
                resolve(_this2._getRealMod({
                  moduleName: moduleName,
                  mod: _mod
                }));
              });
            });
            promiseArr.push(p);
            return;
          } // if module not_load


          _this2.moduleStore.setStatus(moduleName, LoadStatus.LOADING);

          promiseArr.push(fetch$1(scriptSrc).then(function (res) {
            var sandbox = createSandbox(moduleName);
            sandbox.runScript(res);
            var mod = null;

            if (sandbox.__TYPE__ === SandboxTypes.PROXY) {
              mod = sandbox.proxy[moduleName];
            } else {
              // TODO 如何避免插件名冲突 使用iife即可 但是还没研究明白
              mod = window[moduleName];
            }

            if (!mod) throw new Error('FetchLoader: 微组件未暴露任何 API，请查看微组件开发文档');

            if (!mod.mount && !mod.component) {
              throw new Error('FetchLoader: 微组件需要暴露 mount 方法或 component属性，请查看微组件开发文档');
            } // 此时module已经加载 将状态修改为loaded


            _this2.moduleStore.set(moduleName, mod); // 发送事件，通知模块已经加载成功


            event.emit("__fetch_module_".concat(moduleName, "__"), mod);
            var cssSrc = scriptSrc.replace(/\.js$/, '.css');
            return _this2._fetchCss({
              moduleName: cssSrc
            }).then(function (styleArr) {
              var styleText = styleArr[0].styleText;
              return _this2._getRealMod({
                moduleName: moduleName,
                mod: mod,
                cssSrc: cssSrc,
                styleText: styleText
              });
            }).catch(function (cssErr) {
              console.error("FetchLoader.fetchCss: ", cssErr);
              return _this2._getRealMod({
                moduleName: moduleName,
                mod: mod
              });
            });
          }).catch(function (err) {
            if (err.status) {
              // fetch 报错 属于 loaded_err
              _this2.moduleStore.setStatus(moduleName, LoadStatus.LOADED_ERR);

              throw new Error("".concat(err.status, " ").concat(err.statusText));
            } // then 里面报错 属于 exected_err


            _this2.moduleStore.setStatus(moduleName, LoadStatus.EXECTED_ERR);

            throw err;
          }));
        }
      });
      return Promise$4.all(promiseArr);
    }
    /**
     * 使用fetch加载css
     * @param {Object} moduleData eg: { 'A': 'http://domain/index.css' }
     * @returns
     */

  }, {
    key: "_fetchCss",
    value: function _fetchCss(moduleData) {
      var promiseArr = [];
      Object.keys(moduleData).forEach(function (k) {
        var url = moduleData[k];

        if (!/^https?/.test(url)) {
          promiseArr.push(Promise$4.reject("FetchLoader.fetchCss: url '".concat(url, "' \u683C\u5F0F\u4E0D\u6B63\u786E")));
        } else {
          promiseArr.push(fetch$1(url).then(function (res) {
            // 去掉注释正则
            // const reg = /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g
            return {
              styleText: res
            };
          }));
        }
      });
      return Promise$4.all(promiseArr);
    }
  }, {
    key: "_getRealMod",
    value: function _getRealMod(_ref2) {
      var _this3 = this;

      var moduleName = _ref2.moduleName,
          mod = _ref2.mod,
          cssSrc = _ref2.cssSrc,
          styleText = _ref2.styleText;

      if (mod.mount) {
        return {
          mount: function mount(container) {
            var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            if (!container) throw new Error("mount requires a container"); // 处理css并mount 保证css在js之前被mount
            // 由于html属性不认下划线(_)和点(.) 所以去掉版本

            var prefix = moduleName.split('_')[0];

            if (cssSrc && styleText) {
              var currentContainerTag = (container.tagName || '').toLowerCase();
              var prefixWithTag = "".concat(currentContainerTag, "[").concat(getScopedCssPrefix(prefix), "]");
              process({
                container: container,
                styleText: styleText,
                prefix: prefixWithTag,
                cssSrc: cssSrc,
                styleIsolation: _this3.styleIsolation,
                ignoreStyleRuleArray: _this3.ignoreStyleRuleArray,
                store: _this3.moduleStore
              });
            } else {
              // use css cache
              var _mod2 = _this3.moduleStore.get(moduleName);

              if (_mod2 && _mod2.cssMod) {
                // 不能使用stylenode插入到新的容器 之前的stylenode会被移到新的容器
                var realStyleNode = document.createElement('style');
                container.appendChild(realStyleNode);
                realStyleNode.textContent = _mod2.cssMod.textContent;
              }
            }

            return {
              vm: mod.mount(genInnerContainer(container, prefix), _objectSpread2(_objectSpread2({}, payload), {}, {
                event: event
              })),
              el: container
            };
          },
          unmount: mod.unmount || noop
        };
      }

      return mod;
    }
  }, {
    key: "_handleError",
    value: function _handleError(err, fnName, errorCb) {
      if (errorCb) {
        errorCb(err);
      } else {
        console.error("FetchLoader.".concat(fnName, ": "), err);
      }
    }
  }]);

  return FetchLoader;
}();

var Promise$3 = window.Promise;
var ErrorComponent = {
  name: 'ErrorComponent',
  // 因为ErrorComponent生成的时候error还没拿到 所以用props传递
  props: ['error'],
  render: function render(h) {
    var error = this.error;
    var errStr = error instanceof Error ? error.message : JSON.stringify(error);
    return h('div', {
      style: {
        color: '#F56C6C'
      }
    }, errStr);
  }
};
var LoadingComponent = {
  name: 'LoadingComponent',
  render: function render(h) {
    return h('div', 'loading...');
  }
}; // delay 200ms to show loading

var DELAY_LOADING_TIME = 200;
var AsyncComponent = {
  name: 'AsyncComponent',
  created: function created() {
    this._loader = this.loader || new FetchLoader({
      styleIsolation: true
    });
    this.currentComponent = 'Custom';
    this.load();
  },
  data: function data() {
    return {
      currentComponent: '',
      error: null
    };
  },
  props: {
    loader: {
      type: Object,
      validator: function validator(obj) {
        return isPlainObject(obj) && (obj.__loaderType__ === LoaderTypes.FETCH || obj.__loaderType__ === LoaderTypes.SCRIPT);
      }
    },
    moduleData: {
      type: Object,
      validator: function validator(obj) {
        return isPlainObject(obj) && obj.js;
      }
    },
    timeout: {
      type: Number,
      default: 15000
    }
  },
  methods: {
    load: function load() {
      var _this = this;

      if (typeof Vue$1 !== 'function') throw new Error("Loader.AsyncComponent requires Vue, please install it!");
      Vue$1.component(this.currentComponent, function () {
        var AsyncHandler = {
          component: _this.loadComponent(),
          error: _this.generateComponent('error'),
          loading: _this.generateComponent('loading'),
          timeout: _this.timeout,
          delay: DELAY_LOADING_TIME
        };
        return AsyncHandler;
      });
    },
    loadComponent: function loadComponent() {
      var _this2 = this;

      if (!Promise$3) throw new Error('Loader.loadComponent: window.Promise not found, please polyfill it!');
      return new Promise$3(function (resolve, reject) {
        var cb = function cb(mod) {
          if (mod && mod.component) {
            resolve(mod.component);
          } else {
            _this2.error = {
              msg: 'mod or mod.component not found!'
            };
            reject(_this2.error);
          }
        };

        var errorCb = function errorCb(err) {
          _this2.error = err;
          reject(err);
        };

        if (_this2._loader.__loaderType__ === LoaderTypes.FETCH) {
          _this2._loader.fetch(_this2.moduleData.js, cb, errorCb); // TODO fetch css and process it and mount

        } else {
          _this2._loader.load(_this2.moduleData.js, cb, errorCb);
        }
      });
    },
    generateComponent: function generateComponent(type) {
      if (type === 'error') {
        // TODO 此时还没有拿到error 传入的永远是null
        // need use var to store vnode
        var vnode = this.$scopedSlots.error ? this.$scopedSlots.error(this.error) : null;
        return vnode ? {
          name: 'ErrorComponent',
          render: function render() {
            return vnode;
          }
        } : ErrorComponent;
      } else if (type === 'loading') {
        var _vnode = this.$scopedSlots.loading ? this.$scopedSlots.loading() : null;

        return _vnode ? {
          name: 'LoadingComponent',
          render: function render() {
            return _vnode;
          }
        } : LoadingComponent;
      }
    }
  },
  render: function render(h) {
    return h(this.currentComponent, {
      props: _objectSpread2(_objectSpread2({}, this.$props), {}, {
        error: this.error
      }),
      attrs: this.$attrs
    });
  }
};

// 加载子应用组件类型的微组件，接管一个位置的渲染行为，和路由无关
var Promise$2 = window.Promise; // 状态 delaying => loading => data/error

var AsyncApp = {
  name: 'AsyncApp',
  mounted: function mounted() {
    var _this = this;

    this._loader = this.loader || new FetchLoader({
      styleIsolation: true
    });

    if (this.moduleData.publicPath) {
      var modName = Object.keys(this.moduleData.js)[0].split('_')[0];
      setPublicPath(modName, this.moduleData.publicPath);
    }

    this.load().then(function (mod) {
      var instance = mod.mount(document.createElement('div'), _this.ctx);

      _this.$nextTick(function () {
        _this.$children[0].$refs.asyncAppWrap.append(instance.element || instance.el);
      });
    }).catch(function (err) {
      _this.loading = false;
      _this.timer && window.clearTimeout(_this.timer);
      _this.error = err;
    });
  },
  props: {
    loader: {
      type: Object,
      validator: function validator(obj) {
        return isPlainObject(obj) && (obj.__loaderType__ === LoaderTypes.FETCH || obj.__loaderType__ === LoaderTypes.SCRIPT);
      }
    },
    moduleData: {
      type: Object,
      validator: function validator(obj) {
        return isPlainObject(obj) && obj.js && obj.publicPath;
      }
    },
    ctx: {
      type: Object,
      default: function _default() {},
      validator: function validator(obj) {
        return isPlainObject(obj);
      }
    }
  },
  data: function data() {
    return {
      loading: false,
      delaying: true,
      error: null
    };
  },
  methods: {
    load: function load() {
      var _this2 = this;

      if (!Promise$2) throw new Error('Loader.load: window.Promise not found, please polyfill it!');
      this.timer = setTimeout(function () {
        _this2.loading = true;
        _this2.delaying = false;
      }, DELAY_LOADING_TIME);
      return new Promise$2(function (resolve, reject) {
        var cb = function cb(mod) {
          _this2.loading = false;
          _this2.timer && window.clearTimeout(_this2.timer);

          if (mod && mod.mount) {
            resolve(mod);
          } else {
            _this2.error = {
              msg: 'mod or mod.mount not found!'
            };
            reject(_this2.error);
          }
        };

        var errorCb = function errorCb(err) {
          _this2.loading = false;
          _this2.timer && window.clearTimeout(_this2.timer);
          _this2.error = err;
          reject(err);
        };

        if (_this2._loader.__loaderType__ === LoaderTypes.FETCH) {
          _this2._loader.fetch(_this2.moduleData.js, cb, errorCb);
        } else {
          _this2._loader.load(_this2.moduleData.js, cb, errorCb);
        }
      });
    },
    generateComponent: function generateComponent() {
      if (this.loading) {
        var vnode = this.$scopedSlots.loading ? this.$scopedSlots.loading() : null;
        return vnode ? {
          name: 'LoadingComponent',
          render: function render() {
            return vnode;
          }
        } : LoadingComponent;
      } else {
        if (this.error) {
          var _vnode = this.$scopedSlots.error ? this.$scopedSlots.error(this.error) : null;

          return _vnode ? {
            name: 'ErrorComponent',
            render: function render() {
              return _vnode;
            }
          } : ErrorComponent;
        }

        return {
          // delaying和data两个状态共享这个渲染逻辑
          // TODO 这里的inner可以去掉 少一层组件包装
          name: 'AsyncAppInner',
          render: function render(h) {
            return h('div', {
              ref: 'asyncAppWrap'
            });
          }
        };
      }
    }
  },
  render: function render(h) {
    return h(this.generateComponent(), {
      props: {
        error: this.error
      }
    });
  }
};

var Promise$1 = window.Promise;
var loader = null;

function lazyLoadView(AsyncView) {
  var AsyncHandler = function AsyncHandler() {
    return {
      component: AsyncView,
      loading: LoadingComponent,
      error: ErrorComponent,
      delay: 200,
      timeout: 15000
    };
  };

  return Promise$1.resolve({
    functional: true,
    render: function render(h, _ref) {
      var data = _ref.data,
          children = _ref.children;
      return h(AsyncHandler, _objectSpread2(_objectSpread2({}, data), {}, {
        props: data.props
      }), children);
    }
  });
}

function makePromise(moduleData, defaultModule) {
  if (!moduleData) {
    // tip: webpack 只能解析表达式 不能解析变量 import(path) 是不行的
    return defaultModule;
  }

  loader = loader || new ModuleLoader({
    useDefine: false
  });
  return new Promise$1(function (resolve, reject) {
    var cb = function cb(mod) {
      if (mod && mod.component) {
        resolve(mod.component);
      } else {
        reject({
          msg: 'mod or mod.component 未找到'
        });
      }
    };

    var errorCb = function errorCb(err) {
      reject(err);
    };

    if (loader.__loaderType__ === LoaderTypes.FETCH) {
      loader.fetch(moduleData.js, cb, errorCb);
    } else {
      loader.load(moduleData.js, cb, errorCb);
    }
  });
}

function loadComponent(moduleData, defaultModule) {
  return lazyLoadView(makePromise(moduleData, defaultModule));
} // 将loader作为参数传进来，默认loader为 ModuleLoader({useDefine: false})


export { AsyncApp, AsyncComponent, FetchLoader, ModuleLoader, event, loadComponent, _loadCss as loadCss, setPublicPath, store };
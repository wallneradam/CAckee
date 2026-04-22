(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	/*!
	 * Platform.js v1.3.6
	 * Copyright 2014-2020 Benjamin Tan
	 * Copyright 2011-2013 John-David Dalton
	 * Available under MIT license
	 */

	var platform = createCommonjsModule(function (module, exports) {
	(function() {

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Used as a reference to the global object. */
	  var root = (objectTypes[typeof window] && window) || this;

	  /** Detect free variable `exports`. */
	  var freeExports = exports;

	  /** Detect free variable `module`. */
	  var freeModule = module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
	  var freeGlobal = freeExports && freeModule && typeof commonjsGlobal == 'object' && commonjsGlobal;
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
	    root = freeGlobal;
	  }

	  /**
	   * Used as the maximum length of an array-like object.
	   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   */
	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  /** Regular expression to detect Opera. */
	  var reOpera = /\bOpera/;

	  /** Used for native method references. */
	  var objectProto = Object.prototype;

	  /** Used to check for own properties of an object. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /** Used to resolve the internal `[[Class]]` of values. */
	  var toString = objectProto.toString;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Capitalizes a string value.
	   *
	   * @private
	   * @param {string} string The string to capitalize.
	   * @returns {string} The capitalized string.
	   */
	  function capitalize(string) {
	    string = String(string);
	    return string.charAt(0).toUpperCase() + string.slice(1);
	  }

	  /**
	   * A utility function to clean up the OS name.
	   *
	   * @private
	   * @param {string} os The OS name to clean up.
	   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
	   * @param {string} [label] A label for the OS.
	   */
	  function cleanupOS(os, pattern, label) {
	    // Platform tokens are defined at:
	    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
	    var data = {
	      '10.0': '10',
	      '6.4':  '10 Technical Preview',
	      '6.3':  '8.1',
	      '6.2':  '8',
	      '6.1':  'Server 2008 R2 / 7',
	      '6.0':  'Server 2008 / Vista',
	      '5.2':  'Server 2003 / XP 64-bit',
	      '5.1':  'XP',
	      '5.01': '2000 SP1',
	      '5.0':  '2000',
	      '4.0':  'NT',
	      '4.90': 'ME'
	    };
	    // Detect Windows version from platform tokens.
	    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
	        (data = data[/[\d.]+$/.exec(os)])) {
	      os = 'Windows ' + data;
	    }
	    // Correct character case and cleanup string.
	    os = String(os);

	    if (pattern && label) {
	      os = os.replace(RegExp(pattern, 'i'), label);
	    }

	    os = format(
	      os.replace(/ ce$/i, ' CE')
	        .replace(/\bhpw/i, 'web')
	        .replace(/\bMacintosh\b/, 'Mac OS')
	        .replace(/_PowerPC\b/i, ' OS')
	        .replace(/\b(OS X) [^ \d]+/i, '$1')
	        .replace(/\bMac (OS X)\b/, '$1')
	        .replace(/\/(\d)/, ' $1')
	        .replace(/_/g, '.')
	        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
	        .replace(/\bx86\.64\b/gi, 'x86_64')
	        .replace(/\b(Windows Phone) OS\b/, '$1')
	        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
	        .split(' on ')[0]
	    );

	    return os;
	  }

	  /**
	   * An iteration utility for arrays and objects.
	   *
	   * @private
	   * @param {Array|Object} object The object to iterate over.
	   * @param {Function} callback The function called per iteration.
	   */
	  function each(object, callback) {
	    var index = -1,
	        length = object ? object.length : 0;

	    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
	      while (++index < length) {
	        callback(object[index], index, object);
	      }
	    } else {
	      forOwn(object, callback);
	    }
	  }

	  /**
	   * Trim and conditionally capitalize string values.
	   *
	   * @private
	   * @param {string} string The string to format.
	   * @returns {string} The formatted string.
	   */
	  function format(string) {
	    string = trim(string);
	    return /^(?:webOS|i(?:OS|P))/.test(string)
	      ? string
	      : capitalize(string);
	  }

	  /**
	   * Iterates over an object's own properties, executing the `callback` for each.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} callback The function executed per own property.
	   */
	  function forOwn(object, callback) {
	    for (var key in object) {
	      if (hasOwnProperty.call(object, key)) {
	        callback(object[key], key, object);
	      }
	    }
	  }

	  /**
	   * Gets the internal `[[Class]]` of a value.
	   *
	   * @private
	   * @param {*} value The value.
	   * @returns {string} The `[[Class]]`.
	   */
	  function getClassOf(value) {
	    return value == null
	      ? capitalize(value)
	      : toString.call(value).slice(8, -1);
	  }

	  /**
	   * Host objects can return type values that are different from their actual
	   * data type. The objects we are concerned with usually return non-primitive
	   * types of "object", "function", or "unknown".
	   *
	   * @private
	   * @param {*} object The owner of the property.
	   * @param {string} property The property to check.
	   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
	   */
	  function isHostType(object, property) {
	    var type = object != null ? typeof object[property] : 'number';
	    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
	      (type == 'object' ? !!object[property] : true);
	  }

	  /**
	   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
	   *
	   * @private
	   * @param {string} string The string to qualify.
	   * @returns {string} The qualified string.
	   */
	  function qualify(string) {
	    return String(string).replace(/([ -])(?!$)/g, '$1?');
	  }

	  /**
	   * A bare-bones `Array#reduce` like utility function.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} callback The function called per iteration.
	   * @returns {*} The accumulated result.
	   */
	  function reduce(array, callback) {
	    var accumulator = null;
	    each(array, function(value, index) {
	      accumulator = callback(accumulator, value, index, array);
	    });
	    return accumulator;
	  }

	  /**
	   * Removes leading and trailing whitespace from a string.
	   *
	   * @private
	   * @param {string} string The string to trim.
	   * @returns {string} The trimmed string.
	   */
	  function trim(string) {
	    return String(string).replace(/^ +| +$/g, '');
	  }

	  /*--------------------------------------------------------------------------*/

	  /**
	   * Creates a new platform object.
	   *
	   * @memberOf platform
	   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
	   *  context object.
	   * @returns {Object} A platform object.
	   */
	  function parse(ua) {

	    /** The environment context object. */
	    var context = root;

	    /** Used to flag when a custom context is provided. */
	    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

	    // Juggle arguments.
	    if (isCustomContext) {
	      context = ua;
	      ua = null;
	    }

	    /** Browser navigator object. */
	    var nav = context.navigator || {};

	    /** Browser user agent string. */
	    var userAgent = nav.userAgent || '';

	    ua || (ua = userAgent);

	    /** Used to detect if browser is like Chrome. */
	    var likeChrome = isCustomContext
	      ? !!nav.likeChrome
	      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

	    /** Internal `[[Class]]` value shortcuts. */
	    var objectClass = 'Object',
	        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
	        enviroClass = isCustomContext ? objectClass : 'Environment',
	        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
	        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

	    /** Detect Java environments. */
	    var java = /\bJava/.test(javaClass) && context.java;

	    /** Detect Rhino. */
	    var rhino = java && getClassOf(context.environment) == enviroClass;

	    /** A character to represent alpha. */
	    var alpha = java ? 'a' : '\u03b1';

	    /** A character to represent beta. */
	    var beta = java ? 'b' : '\u03b2';

	    /** Browser document object. */
	    var doc = context.document || {};

	    /**
	     * Detect Opera browser (Presto-based).
	     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
	     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
	     */
	    var opera = context.operamini || context.opera;

	    /** Opera `[[Class]]`. */
	    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
	      ? operaClass
	      : (opera = null);

	    /*------------------------------------------------------------------------*/

	    /** Temporary variable used over the script's lifetime. */
	    var data;

	    /** The CPU architecture. */
	    var arch = ua;

	    /** Platform description array. */
	    var description = [];

	    /** Platform alpha/beta indicator. */
	    var prerelease = null;

	    /** A flag to indicate that environment features should be used to resolve the platform. */
	    var useFeatures = ua == userAgent;

	    /** The browser/environment version. */
	    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

	    /** A flag to indicate if the OS ends with "/ Version" */
	    var isSpecialCasedOS;

	    /* Detectable layout engines (order is important). */
	    var layout = getLayout([
	      { 'label': 'EdgeHTML', 'pattern': 'Edge' },
	      'Trident',
	      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
	      'iCab',
	      'Presto',
	      'NetFront',
	      'Tasman',
	      'KHTML',
	      'Gecko'
	    ]);

	    /* Detectable browser names (order is important). */
	    var name = getName([
	      'Adobe AIR',
	      'Arora',
	      'Avant Browser',
	      'Breach',
	      'Camino',
	      'Electron',
	      'Epiphany',
	      'Fennec',
	      'Flock',
	      'Galeon',
	      'GreenBrowser',
	      'iCab',
	      'Iceweasel',
	      'K-Meleon',
	      'Konqueror',
	      'Lunascape',
	      'Maxthon',
	      { 'label': 'Microsoft Edge', 'pattern': '(?:Edge|Edg|EdgA|EdgiOS)' },
	      'Midori',
	      'Nook Browser',
	      'PaleMoon',
	      'PhantomJS',
	      'Raven',
	      'Rekonq',
	      'RockMelt',
	      { 'label': 'Samsung Internet', 'pattern': 'SamsungBrowser' },
	      'SeaMonkey',
	      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Sleipnir',
	      'SlimBrowser',
	      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
	      'Sunrise',
	      'Swiftfox',
	      'Vivaldi',
	      'Waterfox',
	      'WebPositive',
	      { 'label': 'Yandex Browser', 'pattern': 'YaBrowser' },
	      { 'label': 'UC Browser', 'pattern': 'UCBrowser' },
	      'Opera Mini',
	      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
	      'Opera',
	      { 'label': 'Opera', 'pattern': 'OPR' },
	      'Chromium',
	      'Chrome',
	      { 'label': 'Chrome', 'pattern': '(?:HeadlessChrome)' },
	      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
	      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
	      { 'label': 'Firefox for iOS', 'pattern': 'FxiOS' },
	      { 'label': 'IE', 'pattern': 'IEMobile' },
	      { 'label': 'IE', 'pattern': 'MSIE' },
	      'Safari'
	    ]);

	    /* Detectable products (order is important). */
	    var product = getProduct([
	      { 'label': 'BlackBerry', 'pattern': 'BB10' },
	      'BlackBerry',
	      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
	      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
	      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
	      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
	      { 'label': 'Galaxy S5', 'pattern': 'SM-G900' },
	      { 'label': 'Galaxy S6', 'pattern': 'SM-G920' },
	      { 'label': 'Galaxy S6 Edge', 'pattern': 'SM-G925' },
	      { 'label': 'Galaxy S7', 'pattern': 'SM-G930' },
	      { 'label': 'Galaxy S7 Edge', 'pattern': 'SM-G935' },
	      'Google TV',
	      'Lumia',
	      'iPad',
	      'iPod',
	      'iPhone',
	      'Kindle',
	      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
	      'Nexus',
	      'Nook',
	      'PlayBook',
	      'PlayStation Vita',
	      'PlayStation',
	      'TouchPad',
	      'Transformer',
	      { 'label': 'Wii U', 'pattern': 'WiiU' },
	      'Wii',
	      'Xbox One',
	      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
	      'Xoom'
	    ]);

	    /* Detectable manufacturers. */
	    var manufacturer = getManufacturer({
	      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
	      'Alcatel': {},
	      'Archos': {},
	      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
	      'Asus': { 'Transformer': 1 },
	      'Barnes & Noble': { 'Nook': 1 },
	      'BlackBerry': { 'PlayBook': 1 },
	      'Google': { 'Google TV': 1, 'Nexus': 1 },
	      'HP': { 'TouchPad': 1 },
	      'HTC': {},
	      'Huawei': {},
	      'Lenovo': {},
	      'LG': {},
	      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
	      'Motorola': { 'Xoom': 1 },
	      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
	      'Nokia': { 'Lumia': 1 },
	      'Oppo': {},
	      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
	      'Sony': { 'PlayStation': 1, 'PlayStation Vita': 1 },
	      'Xiaomi': { 'Mi': 1, 'Redmi': 1 }
	    });

	    /* Detectable operating systems (order is important). */
	    var os = getOS([
	      'Windows Phone',
	      'KaiOS',
	      'Android',
	      'CentOS',
	      { 'label': 'Chrome OS', 'pattern': 'CrOS' },
	      'Debian',
	      { 'label': 'DragonFly BSD', 'pattern': 'DragonFly' },
	      'Fedora',
	      'FreeBSD',
	      'Gentoo',
	      'Haiku',
	      'Kubuntu',
	      'Linux Mint',
	      'OpenBSD',
	      'Red Hat',
	      'SuSE',
	      'Ubuntu',
	      'Xubuntu',
	      'Cygwin',
	      'Symbian OS',
	      'hpwOS',
	      'webOS ',
	      'webOS',
	      'Tablet OS',
	      'Tizen',
	      'Linux',
	      'Mac OS X',
	      'Macintosh',
	      'Mac',
	      'Windows 98;',
	      'Windows '
	    ]);

	    /*------------------------------------------------------------------------*/

	    /**
	     * Picks the layout engine from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected layout engine.
	     */
	    function getLayout(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the manufacturer from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An object of guesses.
	     * @returns {null|string} The detected manufacturer.
	     */
	    function getManufacturer(guesses) {
	      return reduce(guesses, function(result, value, key) {
	        // Lookup the manufacturer by product or scan the UA for the manufacturer.
	        return result || (
	          value[product] ||
	          value[/^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
	          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
	        ) && key;
	      });
	    }

	    /**
	     * Picks the browser name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected browser name.
	     */
	    function getName(guesses) {
	      return reduce(guesses, function(result, guess) {
	        return result || RegExp('\\b' + (
	          guess.pattern || qualify(guess)
	        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
	      });
	    }

	    /**
	     * Picks the OS name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected OS name.
	     */
	    function getOS(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
	            )) {
	          result = cleanupOS(result, pattern, guess.label || guess);
	        }
	        return result;
	      });
	    }

	    /**
	     * Picks the product name from an array of guesses.
	     *
	     * @private
	     * @param {Array} guesses An array of guesses.
	     * @returns {null|string} The detected product name.
	     */
	    function getProduct(guesses) {
	      return reduce(guesses, function(result, guess) {
	        var pattern = guess.pattern || qualify(guess);
	        if (!result && (result =
	              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + ' *\\w+-[\\w]*', 'i').exec(ua) ||
	              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
	            )) {
	          // Split by forward slash and append product version if needed.
	          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
	            result[0] += ' ' + result[1];
	          }
	          // Correct character case and cleanup string.
	          guess = guess.label || guess;
	          result = format(result[0]
	            .replace(RegExp(pattern, 'i'), guess)
	            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
	            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
	        }
	        return result;
	      });
	    }

	    /**
	     * Resolves the version using an array of UA patterns.
	     *
	     * @private
	     * @param {Array} patterns An array of UA patterns.
	     * @returns {null|string} The detected version.
	     */
	    function getVersion(patterns) {
	      return reduce(patterns, function(result, pattern) {
	        return result || (RegExp(pattern +
	          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
	      });
	    }

	    /**
	     * Returns `platform.description` when the platform object is coerced to a string.
	     *
	     * @name toString
	     * @memberOf platform
	     * @returns {string} Returns `platform.description` if available, else an empty string.
	     */
	    function toStringPlatform() {
	      return this.description || '';
	    }

	    /*------------------------------------------------------------------------*/

	    // Convert layout to an array so we can add extra details.
	    layout && (layout = [layout]);

	    // Detect Android products.
	    // Browsers on Android devices typically provide their product IDS after "Android;"
	    // up to "Build" or ") AppleWebKit".
	    // Example:
	    // "Mozilla/5.0 (Linux; Android 8.1.0; Moto G (5) Plus) AppleWebKit/537.36
	    // (KHTML, like Gecko) Chrome/70.0.3538.80 Mobile Safari/537.36"
	    if (/\bAndroid\b/.test(os) && !product &&
	        (data = /\bAndroid[^;]*;(.*?)(?:Build|\) AppleWebKit)\b/i.exec(ua))) {
	      product = trim(data[1])
	        // Replace any language codes (eg. "en-US").
	        .replace(/^[a-z]{2}-[a-z]{2};\s*/i, '')
	        || null;
	    }
	    // Detect product names that contain their manufacturer's name.
	    if (manufacturer && !product) {
	      product = getProduct([manufacturer]);
	    } else if (manufacturer && product) {
	      product = product
	        .replace(RegExp('^(' + qualify(manufacturer) + ')[-_.\\s]', 'i'), manufacturer + ' ')
	        .replace(RegExp('^(' + qualify(manufacturer) + ')[-_.]?(\\w)', 'i'), manufacturer + ' $2');
	    }
	    // Clean up Google TV.
	    if ((data = /\bGoogle TV\b/.exec(product))) {
	      product = data[0];
	    }
	    // Detect simulators.
	    if (/\bSimulator\b/i.test(ua)) {
	      product = (product ? product + ' ' : '') + 'Simulator';
	    }
	    // Detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS.
	    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
	      description.push('running in Turbo/Uncompressed mode');
	    }
	    // Detect IE Mobile 11.
	    if (name == 'IE' && /\blike iPhone OS\b/.test(ua)) {
	      data = parse(ua.replace(/like iPhone OS/, ''));
	      manufacturer = data.manufacturer;
	      product = data.product;
	    }
	    // Detect iOS.
	    else if (/^iP/.test(product)) {
	      name || (name = 'Safari');
	      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
	        ? ' ' + data[1].replace(/_/g, '.')
	        : '');
	    }
	    // Detect Kubuntu.
	    else if (name == 'Konqueror' && /^Linux\b/i.test(os)) {
	      os = 'Kubuntu';
	    }
	    // Detect Android browsers.
	    else if ((manufacturer && manufacturer != 'Google' &&
	        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) ||
	        (/\bAndroid\b/.test(os) && /^Chrome/.test(name) && /\bVersion\//i.test(ua))) {
	      name = 'Android Browser';
	      os = /\bAndroid\b/.test(os) ? os : 'Android';
	    }
	    // Detect Silk desktop/accelerated modes.
	    else if (name == 'Silk') {
	      if (!/\bMobi/i.test(ua)) {
	        os = 'Android';
	        description.unshift('desktop mode');
	      }
	      if (/Accelerated *= *true/i.test(ua)) {
	        description.unshift('accelerated');
	      }
	    }
	    // Detect UC Browser speed mode.
	    else if (name == 'UC Browser' && /\bUCWEB\b/.test(ua)) {
	      description.push('speed mode');
	    }
	    // Detect PaleMoon identifying as Firefox.
	    else if (name == 'PaleMoon' && (data = /\bFirefox\/([\d.]+)\b/.exec(ua))) {
	      description.push('identifying as Firefox ' + data[1]);
	    }
	    // Detect Firefox OS and products running Firefox.
	    else if (name == 'Firefox' && (data = /\b(Mobile|Tablet|TV)\b/i.exec(ua))) {
	      os || (os = 'Firefox OS');
	      product || (product = data[1]);
	    }
	    // Detect false positives for Firefox/Safari.
	    else if (!name || (data = !/\bMinefield\b/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
	      // Escape the `/` for Firefox 1.
	      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
	        // Clear name of false positives.
	        name = null;
	      }
	      // Reassign a generic name.
	      if ((data = product || manufacturer || os) &&
	          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
	        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
	      }
	    }
	    // Add Chrome version to description for Electron.
	    else if (name == 'Electron' && (data = (/\bChrome\/([\d.]+)\b/.exec(ua) || 0)[1])) {
	      description.push('Chromium ' + data);
	    }
	    // Detect non-Opera (Presto-based) versions (order is important).
	    if (!version) {
	      version = getVersion([
	        '(?:Cloud9|CriOS|CrMo|Edge|Edg|EdgA|EdgiOS|FxiOS|HeadlessChrome|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|SamsungBrowser|Silk(?!/[\\d.]+$)|UCBrowser|YaBrowser)',
	        'Version',
	        qualify(name),
	        '(?:Firefox|Minefield|NetFront)'
	      ]);
	    }
	    // Detect stubborn layout engines.
	    if ((data =
	          layout == 'iCab' && parseFloat(version) > 3 && 'WebKit' ||
	          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
	          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && !/^(?:Trident|EdgeHTML)$/.test(layout) && 'WebKit' ||
	          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident') ||
	          layout == 'WebKit' && /\bPlayStation\b(?! Vita\b)/i.test(name) && 'NetFront'
	        )) {
	      layout = [data];
	    }
	    // Detect Windows Phone 7 desktop mode.
	    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
	      name += ' Mobile';
	      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
	      description.unshift('desktop mode');
	    }
	    // Detect Windows Phone 8.x desktop mode.
	    else if (/\bWPDesktop\b/i.test(ua)) {
	      name = 'IE Mobile';
	      os = 'Windows Phone 8.x';
	      description.unshift('desktop mode');
	      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
	    }
	    // Detect IE 11 identifying as other browsers.
	    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
	      if (name) {
	        description.push('identifying as ' + name + (version ? ' ' + version : ''));
	      }
	      name = 'IE';
	      version = data[1];
	    }
	    // Leverage environment features.
	    if (useFeatures) {
	      // Detect server-side environments.
	      // Rhino has a global function while others have a global object.
	      if (isHostType(context, 'global')) {
	        if (java) {
	          data = java.lang.System;
	          arch = data.getProperty('os.arch');
	          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
	        }
	        if (rhino) {
	          try {
	            version = context.require('ringo/engine').version.join('.');
	            name = 'RingoJS';
	          } catch(e) {
	            if ((data = context.system) && data.global.system == context.system) {
	              name = 'Narwhal';
	              os || (os = data[0].os || null);
	            }
	          }
	          if (!name) {
	            name = 'Rhino';
	          }
	        }
	        else if (
	          typeof context.process == 'object' && !context.process.browser &&
	          (data = context.process)
	        ) {
	          if (typeof data.versions == 'object') {
	            if (typeof data.versions.electron == 'string') {
	              description.push('Node ' + data.versions.node);
	              name = 'Electron';
	              version = data.versions.electron;
	            } else if (typeof data.versions.nw == 'string') {
	              description.push('Chromium ' + version, 'Node ' + data.versions.node);
	              name = 'NW.js';
	              version = data.versions.nw;
	            }
	          }
	          if (!name) {
	            name = 'Node.js';
	            arch = data.arch;
	            os = data.platform;
	            version = /[\d.]+/.exec(data.version);
	            version = version ? version[0] : null;
	          }
	        }
	      }
	      // Detect Adobe AIR.
	      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
	        name = 'Adobe AIR';
	        os = data.flash.system.Capabilities.os;
	      }
	      // Detect PhantomJS.
	      else if (getClassOf((data = context.phantom)) == phantomClass) {
	        name = 'PhantomJS';
	        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
	      }
	      // Detect IE compatibility modes.
	      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
	        // We're in compatibility mode when the Trident version + 4 doesn't
	        // equal the document mode.
	        version = [version, doc.documentMode];
	        if ((data = +data[1] + 4) != version[1]) {
	          description.push('IE ' + version[1] + ' mode');
	          layout && (layout[1] = '');
	          version[1] = data;
	        }
	        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
	      }
	      // Detect IE 11 masking as other browsers.
	      else if (typeof doc.documentMode == 'number' && /^(?:Chrome|Firefox)\b/.test(name)) {
	        description.push('masking as ' + name + ' ' + version);
	        name = 'IE';
	        version = '11.0';
	        layout = ['Trident'];
	        os = 'Windows';
	      }
	      os = os && format(os);
	    }
	    // Detect prerelease phases.
	    if (version && (data =
	          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
	          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
	          /\bMinefield\b/i.test(ua) && 'a'
	        )) {
	      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
	      version = version.replace(RegExp(data + '\\+?$'), '') +
	        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
	    }
	    // Detect Firefox Mobile.
	    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS|KaiOS)\b/.test(os)) {
	      name = 'Firefox Mobile';
	    }
	    // Obscure Maxthon's unreliable version.
	    else if (name == 'Maxthon' && version) {
	      version = version.replace(/\.[\d.]+/, '.x');
	    }
	    // Detect Xbox 360 and Xbox One.
	    else if (/\bXbox\b/i.test(product)) {
	      if (product == 'Xbox 360') {
	        os = null;
	      }
	      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
	        description.unshift('mobile mode');
	      }
	    }
	    // Add mobile postfix.
	    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
	        (os == 'Windows CE' || /Mobi/i.test(ua))) {
	      name += ' Mobile';
	    }
	    // Detect IE platform preview.
	    else if (name == 'IE' && useFeatures) {
	      try {
	        if (context.external === null) {
	          description.unshift('platform preview');
	        }
	      } catch(e) {
	        description.unshift('embedded');
	      }
	    }
	    // Detect BlackBerry OS version.
	    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
	    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
	          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
	          version
	        )) {
	      data = [data, /BB10/.test(ua)];
	      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
	      version = null;
	    }
	    // Detect Opera identifying/masking itself as another browser.
	    // http://www.opera.com/support/kb/view/843/
	    else if (this != forOwn && product != 'Wii' && (
	          (useFeatures && opera) ||
	          (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
	          (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
	          (name == 'IE' && (
	            (os && !/^Win/.test(os) && version > 5.5) ||
	            /\bWindows XP\b/.test(os) && version > 8 ||
	            version == 8 && !/\bTrident\b/.test(ua)
	          ))
	        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {
	      // When "identifying", the UA contains both Opera and the other browser's name.
	      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
	      if (reOpera.test(name)) {
	        if (/\bIE\b/.test(data) && os == 'Mac OS') {
	          os = null;
	        }
	        data = 'identify' + data;
	      }
	      // When "masking", the UA contains only the other browser's name.
	      else {
	        data = 'mask' + data;
	        if (operaClass) {
	          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
	        } else {
	          name = 'Opera';
	        }
	        if (/\bIE\b/.test(data)) {
	          os = null;
	        }
	        if (!useFeatures) {
	          version = null;
	        }
	      }
	      layout = ['Presto'];
	      description.push(data);
	    }
	    // Detect WebKit Nightly and approximate Chrome/Safari versions.
	    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	      // Correct build number for numeric comparison.
	      // (e.g. "532.5" becomes "532.05")
	      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
	      // Nightly builds are postfixed with a "+".
	      if (name == 'Safari' && data[1].slice(-1) == '+') {
	        name = 'WebKit Nightly';
	        prerelease = 'alpha';
	        version = data[1].slice(0, -1);
	      }
	      // Clear incorrect browser versions.
	      else if (version == data[1] ||
	          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
	        version = null;
	      }
	      // Use the full Chrome version when available.
	      data[1] = (/\b(?:Headless)?Chrome\/([\d.]+)/i.exec(ua) || 0)[1];
	      // Detect Blink layout engine.
	      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && layout == 'WebKit') {
	        layout = ['Blink'];
	      }
	      // Detect JavaScriptCore.
	      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
	      if (!useFeatures || (!likeChrome && !data[1])) {
	        layout && (layout[1] = 'like Safari');
	        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : data < 602 ? 9 : data < 604 ? 10 : data < 606 ? 11 : data < 608 ? 12 : '12');
	      } else {
	        layout && (layout[1] = 'like Chrome');
	        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
	      }
	      // Add the postfix of ".x" or "+" for approximate versions.
	      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
	      // Obscure version for some Safari 1-2 releases.
	      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
	        version = data;
	      } else if (name == 'Chrome' && /\bHeadlessChrome/i.test(ua)) {
	        description.unshift('headless');
	      }
	    }
	    // Detect Opera desktop modes.
	    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
	      name += ' ';
	      description.unshift('desktop mode');
	      if (data == 'zvav') {
	        name += 'Mini';
	        version = null;
	      } else {
	        name += 'Mobile';
	      }
	      os = os.replace(RegExp(' *' + data + '$'), '');
	    }
	    // Detect Chrome desktop mode.
	    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
	      description.unshift('desktop mode');
	      name = 'Chrome Mobile';
	      version = null;

	      if (/\bOS X\b/.test(os)) {
	        manufacturer = 'Apple';
	        os = 'iOS 4.3+';
	      } else {
	        os = null;
	      }
	    }
	    // Newer versions of SRWare Iron uses the Chrome tag to indicate its version number.
	    else if (/\bSRWare Iron\b/.test(name) && !version) {
	      version = getVersion('Chrome');
	    }
	    // Strip incorrect OS versions.
	    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
	        ua.indexOf('/' + data + '-') > -1) {
	      os = trim(os.replace(data, ''));
	    }
	    // Ensure OS does not include the browser name.
	    if (os && os.indexOf(name) != -1 && !RegExp(name + ' OS').test(os)) {
	      os = os.replace(RegExp(' *' + qualify(name) + ' *'), '');
	    }
	    // Add layout engine.
	    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
	        /Browser|Lunascape|Maxthon/.test(name) ||
	        name != 'Safari' && /^iOS/.test(os) && /\bSafari\b/.test(layout[1]) ||
	        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Samsung Internet|Sleipnir|SRWare Iron|Vivaldi|Web)/.test(name) && layout[1])) {
	      // Don't add layout details to description if they are falsey.
	      (data = layout[layout.length - 1]) && description.push(data);
	    }
	    // Combine contextual information.
	    if (description.length) {
	      description = ['(' + description.join('; ') + ')'];
	    }
	    // Append manufacturer to description.
	    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
	      description.push('on ' + manufacturer);
	    }
	    // Append product to description.
	    if (product) {
	      description.push((/^on /.test(description[description.length - 1]) ? '' : 'on ') + product);
	    }
	    // Parse the OS into an object.
	    if (os) {
	      data = / ([\d.+]+)$/.exec(os);
	      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
	      os = {
	        'architecture': 32,
	        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
	        'version': data ? data[1] : null,
	        'toString': function() {
	          var version = this.version;
	          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
	        }
	      };
	    }
	    // Add browser/OS architecture.
	    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
	      if (os) {
	        os.architecture = 64;
	        os.family = os.family.replace(RegExp(' *' + data), '');
	      }
	      if (
	          name && (/\bWOW64\b/i.test(ua) ||
	          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
	      ) {
	        description.unshift('32-bit');
	      }
	    }
	    // Chrome 39 and above on OS X is always 64-bit.
	    else if (
	        os && /^OS X/.test(os.family) &&
	        name == 'Chrome' && parseFloat(version) >= 39
	    ) {
	      os.architecture = 64;
	    }

	    ua || (ua = null);

	    /*------------------------------------------------------------------------*/

	    /**
	     * The platform object.
	     *
	     * @name platform
	     * @type Object
	     */
	    var platform = {};

	    /**
	     * The platform description.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.description = ua;

	    /**
	     * The name of the browser's layout engine.
	     *
	     * The list of common layout engines include:
	     * "Blink", "EdgeHTML", "Gecko", "Trident" and "WebKit"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.layout = layout && layout[0];

	    /**
	     * The name of the product's manufacturer.
	     *
	     * The list of manufacturers include:
	     * "Apple", "Archos", "Amazon", "Asus", "Barnes & Noble", "BlackBerry",
	     * "Google", "HP", "HTC", "LG", "Microsoft", "Motorola", "Nintendo",
	     * "Nokia", "Samsung" and "Sony"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.manufacturer = manufacturer;

	    /**
	     * The name of the browser/environment.
	     *
	     * The list of common browser names include:
	     * "Chrome", "Electron", "Firefox", "Firefox for iOS", "IE",
	     * "Microsoft Edge", "PhantomJS", "Safari", "SeaMonkey", "Silk",
	     * "Opera Mini" and "Opera"
	     *
	     * Mobile versions of some browsers have "Mobile" appended to their name:
	     * eg. "Chrome Mobile", "Firefox Mobile", "IE Mobile" and "Opera Mobile"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.name = name;

	    /**
	     * The alpha/beta release indicator.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.prerelease = prerelease;

	    /**
	     * The name of the product hosting the browser.
	     *
	     * The list of common products include:
	     *
	     * "BlackBerry", "Galaxy S4", "Lumia", "iPad", "iPod", "iPhone", "Kindle",
	     * "Kindle Fire", "Nexus", "Nook", "PlayBook", "TouchPad" and "Transformer"
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.product = product;

	    /**
	     * The browser's user agent string.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.ua = ua;

	    /**
	     * The browser/environment version.
	     *
	     * @memberOf platform
	     * @type string|null
	     */
	    platform.version = name && version;

	    /**
	     * The name of the operating system.
	     *
	     * @memberOf platform
	     * @type Object
	     */
	    platform.os = os || {

	      /**
	       * The CPU architecture the OS is built for.
	       *
	       * @memberOf platform.os
	       * @type number|null
	       */
	      'architecture': null,

	      /**
	       * The family of the OS.
	       *
	       * Common values include:
	       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
	       * "Windows XP", "OS X", "Linux", "Ubuntu", "Debian", "Fedora", "Red Hat",
	       * "SuSE", "Android", "iOS" and "Windows Phone"
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'family': null,

	      /**
	       * The version of the OS.
	       *
	       * @memberOf platform.os
	       * @type string|null
	       */
	      'version': null,

	      /**
	       * Returns the OS string.
	       *
	       * @memberOf platform.os
	       * @returns {string} The OS string.
	       */
	      'toString': function() { return 'null'; }
	    };

	    platform.parse = parse;
	    platform.toString = toStringPlatform;

	    if (platform.version) {
	      description.unshift(version);
	    }
	    if (platform.name) {
	      description.unshift(name);
	    }
	    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
	      description.push(product ? '(' + os + ')' : 'on ' + os);
	    }
	    if (description.length) {
	      platform.description = description.join(' ');
	    }
	    return platform;
	  }

	  /*--------------------------------------------------------------------------*/

	  // Export platform.
	  var platform = parse();

	  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
	  if (freeExports && freeModule) {
	    // Export for CommonJS support.
	    forOwn(platform, function(value, key) {
	      freeExports[key] = value;
	    });
	  }
	  else {
	    // Export to the global object.
	    root.platform = platform;
	  }
	}.call(commonjsGlobal));
	});

	const isBrowser = typeof window !== 'undefined';
	const VID_KEY = 'vid';

	let memoryVid;

	const validate = (options = {}) => ({
		detailed: options.detailed === true,
		ignoreLocalhost: options.ignoreLocalhost !== false,
		ignoreOwnVisits: options.ignoreOwnVisits !== false,
	});

	const isLocalhost = (hostname) => {
		return hostname === '' || hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
	};

	const isBot = (userAgent) => {
		return (/bot|crawler|spider|crawling/i).test(userAgent)
	};

	const isFakeId = (id) => {
		return id === '88888888-8888-8888-8888-888888888888'
	};

	const isInBackground = () => {
		return document.visibilityState === 'hidden'
	};

	const source = () => {
		const value = (location.search.split('source=')[1] || '').split('&')[0];
		return value === '' ? undefined : value
	};

	const randomPart = () => {
		if (window.crypto != null && typeof window.crypto.getRandomValues === 'function') {
			return [ ...window.crypto.getRandomValues(new Uint8Array(16)) ]
				.map((value) => value.toString(16).padStart(2, '0'))
				.join('')
		}

		return `${ Date.now().toString(36) }${ Math.random().toString(36)
		.slice(2) }`
	};

	const createVid = () => {
		if (window.crypto != null && typeof window.crypto.randomUUID === 'function') {
			return window.crypto.randomUUID()
		}

		return randomPart()
	};

	const vid = () => {
		if (memoryVid != null) return memoryVid

		try {
			const storedVid = window.localStorage.getItem(VID_KEY);
			if (storedVid != null && storedVid !== '') {
				memoryVid = storedVid;
				return memoryVid
			}

			memoryVid = createVid();
			window.localStorage.setItem(VID_KEY, memoryVid);
			return memoryVid
		} catch (error) {
			memoryVid = createVid();
			return memoryVid
		}
	};

	const attributes = (detailed = false) => {
		const defaultData = {
			vid: vid(),
			siteLocation: window.location.href,
			siteReferrer: document.referrer,
			source: source(),
		};

		const detailedData = {
			siteLanguage: (navigator.language || navigator.userLanguage).substr(0, 2),
			screenWidth: screen.width,
			screenHeight: screen.height,
			screenColorDepth: screen.colorDepth,
			deviceName: platform.product,
			deviceManufacturer: platform.manufacturer,
			osName: platform.os.family,
			osVersion: platform.os.version,
			browserName: platform.name,
			browserVersion: platform.version,
			browserWidth: window.outerWidth || window.innerWidth,
			browserHeight: window.outerHeight || window.innerHeight,
		};

		return {
			...defaultData,
			...(detailed === true ? detailedData : {}),
		}
	};

	const createRecordBody = (domainId, input) => ({
		query: `
		mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
			createRecord(domainId: $domainId, input: $input) {
				payload {
					id
				}
			}
		}
	`,
		variables: {
			domainId,
			input,
		},
	});

	const updateRecordBody = (recordId) => ({
		query: `
		mutation updateRecord($recordId: ID!) {
			updateRecord(id: $recordId) {
				success
			}
		}
	`,
		variables: {
			recordId,
		},
	});

	const createActionBody = (eventId, input) => ({
		query: `
		mutation createAction($eventId: ID!, $input: CreateActionInput!) {
			createAction(eventId: $eventId, input: $input) {
				payload {
					id
				}
			}
		}
	`,
		variables: {
			eventId,
			input,
		},
	});

	const updateActionBody = (actionId, input) => ({
		query: `
		mutation updateAction($actionId: ID!, $input: UpdateActionInput!) {
			updateAction(id: $actionId, input: $input) {
				success
			}
		}
	`,
		variables: {
			actionId,
			input,
		},
	});

	const endpoint = (server) => {
		const hasTrailingSlash = server.substr(-1) === '/';
		return server + (hasTrailingSlash === true ? '' : '/') + 'api'
	};

	const send = (url, body, options, next) => {
		const xhr = new XMLHttpRequest();

		xhr.open('POST', url);

		xhr.onload = () => {
			if (xhr.status !== 200) {
				throw new Error('Server returned with an unhandled status')
			}

			let json = null;

			try {
				json = JSON.parse(xhr.responseText);
			} catch (error) {
				throw new Error('Failed to parse response from server')
			}

			if (json.errors != null) {
				throw new Error(json.errors[0].message)
			}

			if (typeof next === 'function') {
				return next(json)
			}
		};

		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.withCredentials = options.ignoreOwnVisits;
		xhr.send(JSON.stringify(body));
	};

	const detect = () => {
		const elem = document.querySelector('[data-ackee-domain-id]');
		if (elem == null) return

		const server = elem.getAttribute('data-ackee-server') || '';
		const domainId = elem.getAttribute('data-ackee-domain-id');
		const options = elem.getAttribute('data-ackee-opts') || '{}';

		create(server, JSON.parse(options)).record(domainId);
	};

	const create = (server, options) => {
		options = validate(options);
		const url = endpoint(server);
		const noop = () => {};
		const fakeInstance = {
			record: () => ({ stop: noop }),
			updateRecord: () => ({ stop: noop }),
			action: noop,
			updateAction: noop,
		};

		if (options.ignoreLocalhost === true && isLocalhost(location.hostname) === true) {
			console.warn('Ackee ignores you because you are on localhost');
			return fakeInstance
		}

		if (isBot(navigator.userAgent) === true) {
			console.warn('Ackee ignores you because you are a bot');
			return fakeInstance
		}

		const _record = (domainId, attrs = attributes(options.detailed), next) => {
			let isStopped = false;
			const stop = () => {
				isStopped = true;
			};

			send(url, createRecordBody(domainId, attrs), options, (json) => {
				const recordId = json.data.createRecord.payload.id;

				if (isFakeId(recordId) === true) {
					return console.warn('Ackee ignores you because this is your own site')
				}

				const interval = setInterval(() => {
					if (isStopped === true) {
						clearInterval(interval);
						return
					}

					if (isInBackground() === true) return

					send(url, updateRecordBody(recordId), options);
				}, 15000);

				if (typeof next === 'function') {
					return next(recordId)
				}
			});

			return { stop }
		};

		const _updateRecord = (recordId) => {
			let isStopped = false;
			const stop = () => {
				isStopped = true;
			};

			if (isFakeId(recordId) === true) {
				console.warn('Ackee ignores you because this is your own site');
				return { stop }
			}

			const interval = setInterval(() => {
				if (isStopped === true) {
					clearInterval(interval);
					return
				}

				if (isInBackground() === true) return

				send(url, updateRecordBody(recordId), options);
			}, 15000);

			return { stop }
		};

		const _action = (eventId, attrs, next) => {
			send(url, createActionBody(eventId, attrs), options, (json) => {
				const actionId = json.data.createAction.payload.id;

				if (isFakeId(actionId) === true) {
					return console.warn('Ackee ignores you because this is your own site')
				}

				if (typeof next === 'function') {
					return next(actionId)
				}
			});
		};

		const _updateAction = (actionId, attrs) => {
			if (isFakeId(actionId) === true) {
				return console.warn('Ackee ignores you because this is your own site')
			}

			send(url, updateActionBody(actionId, attrs), options);
		};

		return {
			record: _record,
			updateRecord: _updateRecord,
			action: _action,
			updateAction: _updateAction,
		}
	};

	if (isBrowser === true) {
		window.ackeeTracker = {
			attributes,
			detect,
			create,
		};

		detect();
	}

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2tlci5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3BsYXRmb3JtL3BsYXRmb3JtLmpzIiwic3JjL3RyYWNrZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBQbGF0Zm9ybS5qcyB2MS4zLjZcbiAqIENvcHlyaWdodCAyMDE0LTIwMjAgQmVuamFtaW4gVGFuXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDEzIEpvaG4tRGF2aWQgRGFsdG9uXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgLiAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgb2xkUm9vdCA9IHJvb3Q7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAqIFNlZSB0aGUgW0VTNiBzcGVjXShodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aClcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkZXRlY3QgT3BlcmEuICovXG4gIHZhciByZU9wZXJhID0gL1xcYk9wZXJhLztcblxuICAvKiogUG9zc2libGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHRoaXNCaW5kaW5nID0gdGhpcztcblxuICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIGZvciBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QuICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIHZhbHVlcy4gKi9cbiAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENhcGl0YWxpemVzIGEgc3RyaW5nIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY2FwaXRhbGl6ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhcGl0YWxpemVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHV0aWxpdHkgZnVuY3Rpb24gdG8gY2xlYW4gdXAgdGhlIE9TIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcyBUaGUgT1MgbmFtZSB0byBjbGVhbiB1cC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXR0ZXJuXSBBIGBSZWdFeHBgIHBhdHRlcm4gbWF0Y2hpbmcgdGhlIE9TIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGFiZWxdIEEgbGFiZWwgZm9yIHRoZSBPUy5cbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFudXBPUyhvcywgcGF0dGVybiwgbGFiZWwpIHtcbiAgICAvLyBQbGF0Zm9ybSB0b2tlbnMgYXJlIGRlZmluZWQgYXQ6XG4gICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAwODExMjIwNTM5NTAvaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnMTAuMCc6ICcxMCcsXG4gICAgICAnNi40JzogICcxMCBUZWNobmljYWwgUHJldmlldycsXG4gICAgICAnNi4zJzogICc4LjEnLFxuICAgICAgJzYuMic6ICAnOCcsXG4gICAgICAnNi4xJzogICdTZXJ2ZXIgMjAwOCBSMiAvIDcnLFxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXG4gICAgICAnNS4yJzogICdTZXJ2ZXIgMjAwMyAvIFhQIDY0LWJpdCcsXG4gICAgICAnNS4xJzogICdYUCcsXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXG4gICAgICAnNS4wJzogICcyMDAwJyxcbiAgICAgICc0LjAnOiAgJ05UJyxcbiAgICAgICc0LjkwJzogJ01FJ1xuICAgIH07XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgdmVyc2lvbiBmcm9tIHBsYXRmb3JtIHRva2Vucy5cbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCAmJiAvXldpbi9pLnRlc3Qob3MpICYmICEvXldpbmRvd3MgUGhvbmUgL2kudGVzdChvcykgJiZcbiAgICAgICAgKGRhdGEgPSBkYXRhWy9bXFxkLl0rJC8uZXhlYyhvcyldKSkge1xuICAgICAgb3MgPSAnV2luZG93cyAnICsgZGF0YTtcbiAgICB9XG4gICAgLy8gQ29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cCBzdHJpbmcuXG4gICAgb3MgPSBTdHJpbmcob3MpO1xuXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwpIHtcbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG9zID0gZm9ybWF0KFxuICAgICAgb3MucmVwbGFjZSgvIGNlJC9pLCAnIENFJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYmhwdy9pLCAnd2ViJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hY2ludG9zaFxcYi8sICdNYWMgT1MnKVxuICAgICAgICAucmVwbGFjZSgvX1Bvd2VyUENcXGIvaSwgJyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoT1MgWCkgW14gXFxkXSsvaSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hYyAoT1MgWClcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFwvKFxcZCkvLCAnICQxJylcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICAucmVwbGFjZSgvKD86IEJlUEN8WyAuXSpmY1sgXFxkLl0rKSQvaSwgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJ4ODZcXC42NFxcYi9naSwgJ3g4Nl82NCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoV2luZG93cyBQaG9uZSkgT1NcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKENocm9tZSBPUyBcXHcrKSBbXFxkLl0rXFxiLywgJyQxJylcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIG9zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGl0ZXJhdGlvbiB1dGlsaXR5IGZvciBhcnJheXMgYW5kIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2gob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcblxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+IC0xICYmIGxlbmd0aCA8PSBtYXhTYWZlSW50ZWdlcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2luZGV4XSwgaW5kZXgsIG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck93bihvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nKTtcbiAgICByZXR1cm4gL14oPzp3ZWJPU3xpKD86T1N8UCkpLy50ZXN0KHN0cmluZylcbiAgICAgID8gc3RyaW5nXG4gICAgICA6IGNhcGl0YWxpemUoc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLCBleGVjdXRpbmcgdGhlIGBjYWxsYmFja2AgZm9yIGVhY2guXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgYSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsYXNzT2YodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBjYXBpdGFsaXplKHZhbHVlKVxuICAgICAgOiB0b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICAvKipcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHZhciB0eXBlID0gb2JqZWN0ICE9IG51bGwgPyB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA6ICdudW1iZXInO1xuICAgIHJldHVybiAhL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvLnRlc3QodHlwZSkgJiZcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZXMgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIGBSZWdFeHBgIGJ5IG1ha2luZyBoeXBoZW5zIGFuZCBzcGFjZXMgb3B0aW9uYWwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBxdWFsaWZ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcXVhbGlmaWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHF1YWxpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoLyhbIC1dKSg/ISQpL2csICckMT8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgYWNjdW11bGF0ZWQgcmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGFycmF5LCBjYWxsYmFjaykge1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG51bGw7XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGFycmF5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdHJpbW1lZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9eICt8ICskL2csICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsYXRmb3JtIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gW3VhPW5hdmlnYXRvci51c2VyQWdlbnRdIFRoZSB1c2VyIGFnZW50IHN0cmluZyBvclxuICAgKiAgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEEgcGxhdGZvcm0gb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcblxuICAgIC8qKiBUaGUgZW52aXJvbm1lbnQgY29udGV4dCBvYmplY3QuICovXG4gICAgdmFyIGNvbnRleHQgPSByb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGEgY3VzdG9tIGNvbnRleHQgaXMgcHJvdmlkZWQuICovXG4gICAgdmFyIGlzQ3VzdG9tQ29udGV4dCA9IHVhICYmIHR5cGVvZiB1YSA9PSAnb2JqZWN0JyAmJiBnZXRDbGFzc09mKHVhKSAhPSAnU3RyaW5nJztcblxuICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHVhO1xuICAgICAgdWEgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBCcm93c2VyIG5hdmlnYXRvciBvYmplY3QuICovXG4gICAgdmFyIG5hdiA9IGNvbnRleHQubmF2aWdhdG9yIHx8IHt9O1xuXG4gICAgLyoqIEJyb3dzZXIgdXNlciBhZ2VudCBzdHJpbmcuICovXG4gICAgdmFyIHVzZXJBZ2VudCA9IG5hdi51c2VyQWdlbnQgfHwgJyc7XG5cbiAgICB1YSB8fCAodWEgPSB1c2VyQWdlbnQpO1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGB0aGlzQmluZGluZ2AgaXMgdGhlIFtNb2R1bGVTY29wZV0uICovXG4gICAgdmFyIGlzTW9kdWxlU2NvcGUgPSBpc0N1c3RvbUNvbnRleHQgfHwgdGhpc0JpbmRpbmcgPT0gb2xkUm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBicm93c2VyIGlzIGxpa2UgQ2hyb21lLiAqL1xuICAgIHZhciBsaWtlQ2hyb21lID0gaXNDdXN0b21Db250ZXh0XG4gICAgICA/ICEhbmF2Lmxpa2VDaHJvbWVcbiAgICAgIDogL1xcYkNocm9tZVxcYi8udGVzdCh1YSkgJiYgIS9pbnRlcm5hbHxcXG4vaS50ZXN0KHRvU3RyaW5nLnRvU3RyaW5nKCkpO1xuXG4gICAgLyoqIEludGVybmFsIGBbW0NsYXNzXV1gIHZhbHVlIHNob3J0Y3V0cy4gKi9cbiAgICB2YXIgb2JqZWN0Q2xhc3MgPSAnT2JqZWN0JyxcbiAgICAgICAgYWlyUnVudGltZUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnU2NyaXB0QnJpZGdpbmdQcm94eU9iamVjdCcsXG4gICAgICAgIGVudmlyb0NsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnRW52aXJvbm1lbnQnLFxuICAgICAgICBqYXZhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIGNvbnRleHQuamF2YSkgPyAnSmF2YVBhY2thZ2UnIDogZ2V0Q2xhc3NPZihjb250ZXh0LmphdmEpLFxuICAgICAgICBwaGFudG9tQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdSdW50aW1lT2JqZWN0JztcblxuICAgIC8qKiBEZXRlY3QgSmF2YSBlbnZpcm9ubWVudHMuICovXG4gICAgdmFyIGphdmEgPSAvXFxiSmF2YS8udGVzdChqYXZhQ2xhc3MpICYmIGNvbnRleHQuamF2YTtcblxuICAgIC8qKiBEZXRlY3QgUmhpbm8uICovXG4gICAgdmFyIHJoaW5vID0gamF2YSAmJiBnZXRDbGFzc09mKGNvbnRleHQuZW52aXJvbm1lbnQpID09IGVudmlyb0NsYXNzO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBhbHBoYS4gKi9cbiAgICB2YXIgYWxwaGEgPSBqYXZhID8gJ2EnIDogJ1xcdTAzYjEnO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBiZXRhLiAqL1xuICAgIHZhciBiZXRhID0gamF2YSA/ICdiJyA6ICdcXHUwM2IyJztcblxuICAgIC8qKiBCcm93c2VyIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgICB2YXIgZG9jID0gY29udGV4dC5kb2N1bWVudCB8fCB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBPcGVyYSBicm93c2VyIChQcmVzdG8tYmFzZWQpLlxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXG4gICAgICogaHR0cDovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvdmlldy9vcGVyYS1taW5pLXdlYi1jb250ZW50LWF1dGhvcmluZy1ndWlkZWxpbmVzLyNvcGVyYW1pbmlcbiAgICAgKi9cbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xuXG4gICAgLyoqIE9wZXJhIGBbW0NsYXNzXV1gLiAqL1xuICAgIHZhciBvcGVyYUNsYXNzID0gcmVPcGVyYS50ZXN0KG9wZXJhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIG9wZXJhKSA/IG9wZXJhWydbW0NsYXNzXV0nXSA6IGdldENsYXNzT2Yob3BlcmEpKVxuICAgICAgPyBvcGVyYUNsYXNzXG4gICAgICA6IChvcGVyYSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqIFRlbXBvcmFyeSB2YXJpYWJsZSB1c2VkIG92ZXIgdGhlIHNjcmlwdCdzIGxpZmV0aW1lLiAqL1xuICAgIHZhciBkYXRhO1xuXG4gICAgLyoqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlLiAqL1xuICAgIHZhciBhcmNoID0gdWE7XG5cbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkuICovXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gW107XG5cbiAgICAvKiogUGxhdGZvcm0gYWxwaGEvYmV0YSBpbmRpY2F0b3IuICovXG4gICAgdmFyIHByZXJlbGVhc2UgPSBudWxsO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGVudmlyb25tZW50IGZlYXR1cmVzIHNob3VsZCBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHBsYXRmb3JtLiAqL1xuICAgIHZhciB1c2VGZWF0dXJlcyA9IHVhID09IHVzZXJBZ2VudDtcblxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLiAqL1xuICAgIHZhciB2ZXJzaW9uID0gdXNlRmVhdHVyZXMgJiYgb3BlcmEgJiYgdHlwZW9mIG9wZXJhLnZlcnNpb24gPT0gJ2Z1bmN0aW9uJyAmJiBvcGVyYS52ZXJzaW9uKCk7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBPUyBlbmRzIHdpdGggXCIvIFZlcnNpb25cIiAqL1xuICAgIHZhciBpc1NwZWNpYWxDYXNlZE9TO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBsYXlvdXQgZW5naW5lcyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgbGF5b3V0ID0gZ2V0TGF5b3V0KFtcbiAgICAgIHsgJ2xhYmVsJzogJ0VkZ2VIVE1MJywgJ3BhdHRlcm4nOiAnRWRnZScgfSxcbiAgICAgICdUcmlkZW50JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dlYktpdCcsICdwYXR0ZXJuJzogJ0FwcGxlV2ViS2l0JyB9LFxuICAgICAgJ2lDYWInLFxuICAgICAgJ1ByZXN0bycsXG4gICAgICAnTmV0RnJvbnQnLFxuICAgICAgJ1Rhc21hbicsXG4gICAgICAnS0hUTUwnLFxuICAgICAgJ0dlY2tvJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBicm93c2VyIG5hbWVzIChvcmRlciBpcyBpbXBvcnRhbnQpLiAqL1xuICAgIHZhciBuYW1lID0gZ2V0TmFtZShbXG4gICAgICAnQWRvYmUgQUlSJyxcbiAgICAgICdBcm9yYScsXG4gICAgICAnQXZhbnQgQnJvd3NlcicsXG4gICAgICAnQnJlYWNoJyxcbiAgICAgICdDYW1pbm8nLFxuICAgICAgJ0VsZWN0cm9uJyxcbiAgICAgICdFcGlwaGFueScsXG4gICAgICAnRmVubmVjJyxcbiAgICAgICdGbG9jaycsXG4gICAgICAnR2FsZW9uJyxcbiAgICAgICdHcmVlbkJyb3dzZXInLFxuICAgICAgJ2lDYWInLFxuICAgICAgJ0ljZXdlYXNlbCcsXG4gICAgICAnSy1NZWxlb24nLFxuICAgICAgJ0tvbnF1ZXJvcicsXG4gICAgICAnTHVuYXNjYXBlJyxcbiAgICAgICdNYXh0aG9uJyxcbiAgICAgIHsgJ2xhYmVsJzogJ01pY3Jvc29mdCBFZGdlJywgJ3BhdHRlcm4nOiAnKD86RWRnZXxFZGd8RWRnQXxFZGdpT1MpJyB9LFxuICAgICAgJ01pZG9yaScsXG4gICAgICAnTm9vayBCcm93c2VyJyxcbiAgICAgICdQYWxlTW9vbicsXG4gICAgICAnUGhhbnRvbUpTJyxcbiAgICAgICdSYXZlbicsXG4gICAgICAnUmVrb25xJyxcbiAgICAgICdSb2NrTWVsdCcsXG4gICAgICB7ICdsYWJlbCc6ICdTYW1zdW5nIEludGVybmV0JywgJ3BhdHRlcm4nOiAnU2Ftc3VuZ0Jyb3dzZXInIH0sXG4gICAgICAnU2VhTW9ua2V5JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NpbGsnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXG4gICAgICAnU2xlaXBuaXInLFxuICAgICAgJ1NsaW1Ccm93c2VyJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NSV2FyZSBJcm9uJywgJ3BhdHRlcm4nOiAnSXJvbicgfSxcbiAgICAgICdTdW5yaXNlJyxcbiAgICAgICdTd2lmdGZveCcsXG4gICAgICAnVml2YWxkaScsXG4gICAgICAnV2F0ZXJmb3gnLFxuICAgICAgJ1dlYlBvc2l0aXZlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1lhbmRleCBCcm93c2VyJywgJ3BhdHRlcm4nOiAnWWFCcm93c2VyJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnVUMgQnJvd3NlcicsICdwYXR0ZXJuJzogJ1VDQnJvd3NlcicgfSxcbiAgICAgICdPcGVyYSBNaW5pJyxcbiAgICAgIHsgJ2xhYmVsJzogJ09wZXJhIE1pbmknLCAncGF0dGVybic6ICdPUGlPUycgfSxcbiAgICAgICdPcGVyYScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYScsICdwYXR0ZXJuJzogJ09QUicgfSxcbiAgICAgICdDaHJvbWl1bScsXG4gICAgICAnQ2hyb21lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZScsICdwYXR0ZXJuJzogJyg/OkhlYWRsZXNzQ2hyb21lKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3gnLCAncGF0dGVybic6ICcoPzpGaXJlZm94fE1pbmVmaWVsZCknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdGaXJlZm94IGZvciBpT1MnLCAncGF0dGVybic6ICdGeGlPUycgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnSUVNb2JpbGUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ01TSUUnIH0sXG4gICAgICAnU2FmYXJpJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBwcm9kdWN0cyAob3JkZXIgaXMgaW1wb3J0YW50KS4gKi9cbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xuICAgICAgeyAnbGFiZWwnOiAnQmxhY2tCZXJyeScsICdwYXR0ZXJuJzogJ0JCMTAnIH0sXG4gICAgICAnQmxhY2tCZXJyeScsXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMyJywgJ3BhdHRlcm4nOiAnR1QtSTkxMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzMnLCAncGF0dGVybic6ICdHVC1JOTMwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM1JywgJ3BhdHRlcm4nOiAnU00tRzkwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNicsICdwYXR0ZXJuJzogJ1NNLUc5MjAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzYgRWRnZScsICdwYXR0ZXJuJzogJ1NNLUc5MjUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzcnLCAncGF0dGVybic6ICdTTS1HOTMwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM3IEVkZ2UnLCAncGF0dGVybic6ICdTTS1HOTM1JyB9LFxuICAgICAgJ0dvb2dsZSBUVicsXG4gICAgICAnTHVtaWEnLFxuICAgICAgJ2lQYWQnLFxuICAgICAgJ2lQb2QnLFxuICAgICAgJ2lQaG9uZScsXG4gICAgICAnS2luZGxlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0tpbmRsZSBGaXJlJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ05leHVzJyxcbiAgICAgICdOb29rJyxcbiAgICAgICdQbGF5Qm9vaycsXG4gICAgICAnUGxheVN0YXRpb24gVml0YScsXG4gICAgICAnUGxheVN0YXRpb24nLFxuICAgICAgJ1RvdWNoUGFkJyxcbiAgICAgICdUcmFuc2Zvcm1lcicsXG4gICAgICB7ICdsYWJlbCc6ICdXaWkgVScsICdwYXR0ZXJuJzogJ1dpaVUnIH0sXG4gICAgICAnV2lpJyxcbiAgICAgICdYYm94IE9uZScsXG4gICAgICB7ICdsYWJlbCc6ICdYYm94IDM2MCcsICdwYXR0ZXJuJzogJ1hib3gnIH0sXG4gICAgICAnWG9vbSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgbWFudWZhY3R1cmVycy4gKi9cbiAgICB2YXIgbWFudWZhY3R1cmVyID0gZ2V0TWFudWZhY3R1cmVyKHtcbiAgICAgICdBcHBsZSc6IHsgJ2lQYWQnOiAxLCAnaVBob25lJzogMSwgJ2lQb2QnOiAxIH0sXG4gICAgICAnQWxjYXRlbCc6IHt9LFxuICAgICAgJ0FyY2hvcyc6IHt9LFxuICAgICAgJ0FtYXpvbic6IHsgJ0tpbmRsZSc6IDEsICdLaW5kbGUgRmlyZSc6IDEgfSxcbiAgICAgICdBc3VzJzogeyAnVHJhbnNmb3JtZXInOiAxIH0sXG4gICAgICAnQmFybmVzICYgTm9ibGUnOiB7ICdOb29rJzogMSB9LFxuICAgICAgJ0JsYWNrQmVycnknOiB7ICdQbGF5Qm9vayc6IDEgfSxcbiAgICAgICdHb29nbGUnOiB7ICdHb29nbGUgVFYnOiAxLCAnTmV4dXMnOiAxIH0sXG4gICAgICAnSFAnOiB7ICdUb3VjaFBhZCc6IDEgfSxcbiAgICAgICdIVEMnOiB7fSxcbiAgICAgICdIdWF3ZWknOiB7fSxcbiAgICAgICdMZW5vdm8nOiB7fSxcbiAgICAgICdMRyc6IHt9LFxuICAgICAgJ01pY3Jvc29mdCc6IHsgJ1hib3gnOiAxLCAnWGJveCBPbmUnOiAxIH0sXG4gICAgICAnTW90b3JvbGEnOiB7ICdYb29tJzogMSB9LFxuICAgICAgJ05pbnRlbmRvJzogeyAnV2lpIFUnOiAxLCAgJ1dpaSc6IDEgfSxcbiAgICAgICdOb2tpYSc6IHsgJ0x1bWlhJzogMSB9LFxuICAgICAgJ09wcG8nOiB7fSxcbiAgICAgICdTYW1zdW5nJzogeyAnR2FsYXh5IFMnOiAxLCAnR2FsYXh5IFMyJzogMSwgJ0dhbGF4eSBTMyc6IDEsICdHYWxheHkgUzQnOiAxIH0sXG4gICAgICAnU29ueSc6IHsgJ1BsYXlTdGF0aW9uJzogMSwgJ1BsYXlTdGF0aW9uIFZpdGEnOiAxIH0sXG4gICAgICAnWGlhb21pJzogeyAnTWknOiAxLCAnUmVkbWknOiAxIH1cbiAgICB9KTtcblxuICAgIC8qIERldGVjdGFibGUgb3BlcmF0aW5nIHN5c3RlbXMgKG9yZGVyIGlzIGltcG9ydGFudCkuICovXG4gICAgdmFyIG9zID0gZ2V0T1MoW1xuICAgICAgJ1dpbmRvd3MgUGhvbmUnLFxuICAgICAgJ0thaU9TJyxcbiAgICAgICdBbmRyb2lkJyxcbiAgICAgICdDZW50T1MnLFxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE9TJywgJ3BhdHRlcm4nOiAnQ3JPUycgfSxcbiAgICAgICdEZWJpYW4nLFxuICAgICAgeyAnbGFiZWwnOiAnRHJhZ29uRmx5IEJTRCcsICdwYXR0ZXJuJzogJ0RyYWdvbkZseScgfSxcbiAgICAgICdGZWRvcmEnLFxuICAgICAgJ0ZyZWVCU0QnLFxuICAgICAgJ0dlbnRvbycsXG4gICAgICAnSGFpa3UnLFxuICAgICAgJ0t1YnVudHUnLFxuICAgICAgJ0xpbnV4IE1pbnQnLFxuICAgICAgJ09wZW5CU0QnLFxuICAgICAgJ1JlZCBIYXQnLFxuICAgICAgJ1N1U0UnLFxuICAgICAgJ1VidW50dScsXG4gICAgICAnWHVidW50dScsXG4gICAgICAnQ3lnd2luJyxcbiAgICAgICdTeW1iaWFuIE9TJyxcbiAgICAgICdocHdPUycsXG4gICAgICAnd2ViT1MgJyxcbiAgICAgICd3ZWJPUycsXG4gICAgICAnVGFibGV0IE9TJyxcbiAgICAgICdUaXplbicsXG4gICAgICAnTGludXgnLFxuICAgICAgJ01hYyBPUyBYJyxcbiAgICAgICdNYWNpbnRvc2gnLFxuICAgICAgJ01hYycsXG4gICAgICAnV2luZG93cyA5ODsnLFxuICAgICAgJ1dpbmRvd3MgJ1xuICAgIF0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGxheW91dCBlbmdpbmUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbGF5b3V0IGVuZ2luZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMYXlvdXQoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIG1hbnVmYWN0dXJlciBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gb2JqZWN0IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbWFudWZhY3R1cmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE1hbnVmYWN0dXJlcihndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgICAgICAvLyBMb29rdXAgdGhlIG1hbnVmYWN0dXJlciBieSBwcm9kdWN0IG9yIHNjYW4gdGhlIFVBIGZvciB0aGUgbWFudWZhY3R1cmVyLlxuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChcbiAgICAgICAgICB2YWx1ZVtwcm9kdWN0XSB8fFxuICAgICAgICAgIHZhbHVlWy9eW2Etel0rKD86ICtbYS16XStcXGIpKi9pLmV4ZWMocHJvZHVjdCldIHx8XG4gICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBxdWFsaWZ5KGtleSkgKyAnKD86XFxcXGJ8XFxcXHcqXFxcXGQpJywgJ2knKS5leGVjKHVhKVxuICAgICAgICApICYmIGtleTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBicm93c2VyIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgYnJvd3NlciBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE5hbWUoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIE9TIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgT1MgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRPUyhndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiAocmVzdWx0ID1cbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/Oi9bXFxcXGQuXSt8WyBcXFxcdy5dKiknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgcmVzdWx0ID0gY2xlYW51cE9TKHJlc3VsdCwgcGF0dGVybiwgZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgcHJvZHVjdCBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHByb2R1Y3QgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRQcm9kdWN0KGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnICpcXFxcZCtbLlxcXFx3X10qJywgJ2knKS5leGVjKHVhKSB8fFxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnICpcXFxcdystW1xcXFx3XSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzo7ICooPzpbYS16XStbXy1dKT9bYS16XStcXFxcZCt8W14gKCk7LV0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAvLyBTcGxpdCBieSBmb3J3YXJkIHNsYXNoIGFuZCBhcHBlbmQgcHJvZHVjdCB2ZXJzaW9uIGlmIG5lZWRlZC5cbiAgICAgICAgICBpZiAoKHJlc3VsdCA9IFN0cmluZygoZ3Vlc3MubGFiZWwgJiYgIVJlZ0V4cChwYXR0ZXJuLCAnaScpLnRlc3QoZ3Vlc3MubGFiZWwpKSA/IGd1ZXNzLmxhYmVsIDogcmVzdWx0KS5zcGxpdCgnLycpKVsxXSAmJiAhL1tcXGQuXSsvLnRlc3QocmVzdWx0WzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0WzBdICs9ICcgJyArIHJlc3VsdFsxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cCBzdHJpbmcuXG4gICAgICAgICAgZ3Vlc3MgPSBndWVzcy5sYWJlbCB8fCBndWVzcztcbiAgICAgICAgICByZXN1bHQgPSBmb3JtYXQocmVzdWx0WzBdXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgZ3Vlc3MpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJzsgKig/OicgKyBndWVzcyArICdbXy1dKT8nLCAnaScpLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJygnICsgZ3Vlc3MgKyAnKVstXy5dPyhcXFxcdyknLCAnaScpLCAnJDEgJDInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSB2ZXJzaW9uIHVzaW5nIGFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJucyBBbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFZlcnNpb24ocGF0dGVybnMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UocGF0dGVybnMsIGZ1bmN0aW9uKHJlc3VsdCwgcGF0dGVybikge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChSZWdFeHAocGF0dGVybiArXG4gICAgICAgICAgJyg/Oi1bXFxcXGQuXSsvfCg/OiBmb3IgW1xcXFx3LV0rKT9bIC8tXSkoW1xcXFxkLl0rW14gKCk7L18tXSopJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fCBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIHdoZW4gdGhlIHBsYXRmb3JtIG9iamVjdCBpcyBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgaWYgYXZhaWxhYmxlLCBlbHNlIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b1N0cmluZ1BsYXRmb3JtKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gQ29udmVydCBsYXlvdXQgdG8gYW4gYXJyYXkgc28gd2UgY2FuIGFkZCBleHRyYSBkZXRhaWxzLlxuICAgIGxheW91dCAmJiAobGF5b3V0ID0gW2xheW91dF0pO1xuXG4gICAgLy8gRGV0ZWN0IEFuZHJvaWQgcHJvZHVjdHMuXG4gICAgLy8gQnJvd3NlcnMgb24gQW5kcm9pZCBkZXZpY2VzIHR5cGljYWxseSBwcm92aWRlIHRoZWlyIHByb2R1Y3QgSURTIGFmdGVyIFwiQW5kcm9pZDtcIlxuICAgIC8vIHVwIHRvIFwiQnVpbGRcIiBvciBcIikgQXBwbGVXZWJLaXRcIi5cbiAgICAvLyBFeGFtcGxlOlxuICAgIC8vIFwiTW96aWxsYS81LjAgKExpbnV4OyBBbmRyb2lkIDguMS4wOyBNb3RvIEcgKDUpIFBsdXMpIEFwcGxlV2ViS2l0LzUzNy4zNlxuICAgIC8vIChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzcwLjAuMzUzOC44MCBNb2JpbGUgU2FmYXJpLzUzNy4zNlwiXG4gICAgaWYgKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSAmJiAhcHJvZHVjdCAmJlxuICAgICAgICAoZGF0YSA9IC9cXGJBbmRyb2lkW147XSo7KC4qPykoPzpCdWlsZHxcXCkgQXBwbGVXZWJLaXQpXFxiL2kuZXhlYyh1YSkpKSB7XG4gICAgICBwcm9kdWN0ID0gdHJpbShkYXRhWzFdKVxuICAgICAgICAvLyBSZXBsYWNlIGFueSBsYW5ndWFnZSBjb2RlcyAoZWcuIFwiZW4tVVNcIikuXG4gICAgICAgIC5yZXBsYWNlKC9eW2Etel17Mn0tW2Etel17Mn07XFxzKi9pLCAnJylcbiAgICAgICAgfHwgbnVsbDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHByb2R1Y3QgbmFtZXMgdGhhdCBjb250YWluIHRoZWlyIG1hbnVmYWN0dXJlcidzIG5hbWUuXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiAhcHJvZHVjdCkge1xuICAgICAgcHJvZHVjdCA9IGdldFByb2R1Y3QoW21hbnVmYWN0dXJlcl0pO1xuICAgIH0gZWxzZSBpZiAobWFudWZhY3R1cmVyICYmIHByb2R1Y3QpIHtcbiAgICAgIHByb2R1Y3QgPSBwcm9kdWN0XG4gICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnXignICsgcXVhbGlmeShtYW51ZmFjdHVyZXIpICsgJylbLV8uXFxcXHNdJywgJ2knKSwgbWFudWZhY3R1cmVyICsgJyAnKVxuICAgICAgICAucmVwbGFjZShSZWdFeHAoJ14oJyArIHF1YWxpZnkobWFudWZhY3R1cmVyKSArICcpWy1fLl0/KFxcXFx3KScsICdpJyksIG1hbnVmYWN0dXJlciArICcgJDInKTtcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgR29vZ2xlIFRWLlxuICAgIGlmICgoZGF0YSA9IC9cXGJHb29nbGUgVFZcXGIvLmV4ZWMocHJvZHVjdCkpKSB7XG4gICAgICBwcm9kdWN0ID0gZGF0YVswXTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHNpbXVsYXRvcnMuXG4gICAgaWYgKC9cXGJTaW11bGF0b3JcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgcHJvZHVjdCA9IChwcm9kdWN0ID8gcHJvZHVjdCArICcgJyA6ICcnKSArICdTaW11bGF0b3InO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgT3BlcmEgTWluaSA4KyBydW5uaW5nIGluIFR1cmJvL1VuY29tcHJlc3NlZCBtb2RlIG9uIGlPUy5cbiAgICBpZiAobmFtZSA9PSAnT3BlcmEgTWluaScgJiYgL1xcYk9QaU9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgncnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZScpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgTW9iaWxlIDExLlxuICAgIGlmIChuYW1lID09ICdJRScgJiYgL1xcYmxpa2UgaVBob25lIE9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGF0YSA9IHBhcnNlKHVhLnJlcGxhY2UoL2xpa2UgaVBob25lIE9TLywgJycpKTtcbiAgICAgIG1hbnVmYWN0dXJlciA9IGRhdGEubWFudWZhY3R1cmVyO1xuICAgICAgcHJvZHVjdCA9IGRhdGEucHJvZHVjdDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IGlPUy5cbiAgICBlbHNlIGlmICgvXmlQLy50ZXN0KHByb2R1Y3QpKSB7XG4gICAgICBuYW1lIHx8IChuYW1lID0gJ1NhZmFyaScpO1xuICAgICAgb3MgPSAnaU9TJyArICgoZGF0YSA9IC8gT1MgKFtcXGRfXSspL2kuZXhlYyh1YSkpXG4gICAgICAgID8gJyAnICsgZGF0YVsxXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgOiAnJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBLdWJ1bnR1LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0tvbnF1ZXJvcicgJiYgL15MaW51eFxcYi9pLnRlc3Qob3MpKSB7XG4gICAgICBvcyA9ICdLdWJ1bnR1JztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IEFuZHJvaWQgYnJvd3NlcnMuXG4gICAgZWxzZSBpZiAoKG1hbnVmYWN0dXJlciAmJiBtYW51ZmFjdHVyZXIgIT0gJ0dvb2dsZScgJiZcbiAgICAgICAgKCgvQ2hyb21lLy50ZXN0KG5hbWUpICYmICEvXFxiTW9iaWxlIFNhZmFyaVxcYi9pLnRlc3QodWEpKSB8fCAvXFxiVml0YVxcYi8udGVzdChwcm9kdWN0KSkpIHx8XG4gICAgICAgICgvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgJiYgL15DaHJvbWUvLnRlc3QobmFtZSkgJiYgL1xcYlZlcnNpb25cXC8vaS50ZXN0KHVhKSkpIHtcbiAgICAgIG5hbWUgPSAnQW5kcm9pZCBCcm93c2VyJztcbiAgICAgIG9zID0gL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiAnQW5kcm9pZCc7XG4gICAgfVxuICAgIC8vIERldGVjdCBTaWxrIGRlc2t0b3AvYWNjZWxlcmF0ZWQgbW9kZXMuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2lsaycpIHtcbiAgICAgIGlmICghL1xcYk1vYmkvaS50ZXN0KHVhKSkge1xuICAgICAgICBvcyA9ICdBbmRyb2lkJztcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB9XG4gICAgICBpZiAoL0FjY2VsZXJhdGVkICo9ICp0cnVlL2kudGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnYWNjZWxlcmF0ZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IFVDIEJyb3dzZXIgc3BlZWQgbW9kZS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdVQyBCcm93c2VyJyAmJiAvXFxiVUNXRUJcXGIvLnRlc3QodWEpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdzcGVlZCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBQYWxlTW9vbiBpZGVudGlmeWluZyBhcyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1BhbGVNb29uJyAmJiAoZGF0YSA9IC9cXGJGaXJlZm94XFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzIEZpcmVmb3ggJyArIGRhdGFbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBPUyBhbmQgcHJvZHVjdHMgcnVubmluZyBGaXJlZm94LlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIChkYXRhID0gL1xcYihNb2JpbGV8VGFibGV0fFRWKVxcYi9pLmV4ZWModWEpKSkge1xuICAgICAgb3MgfHwgKG9zID0gJ0ZpcmVmb3ggT1MnKTtcbiAgICAgIHByb2R1Y3QgfHwgKHByb2R1Y3QgPSBkYXRhWzFdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlcyBmb3IgRmlyZWZveC9TYWZhcmkuXG4gICAgZWxzZSBpZiAoIW5hbWUgfHwgKGRhdGEgPSAhL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmIC9cXGIoPzpGaXJlZm94fFNhZmFyaSlcXGIvLmV4ZWMobmFtZSkpKSB7XG4gICAgICAvLyBFc2NhcGUgdGhlIGAvYCBmb3IgRmlyZWZveCAxLlxuICAgICAgaWYgKG5hbWUgJiYgIXByb2R1Y3QgJiYgL1tcXC8sXXxeW14oXSs/XFwpLy50ZXN0KHVhLnNsaWNlKHVhLmluZGV4T2YoZGF0YSArICcvJykgKyA4KSkpIHtcbiAgICAgICAgLy8gQ2xlYXIgbmFtZSBvZiBmYWxzZSBwb3NpdGl2ZXMuXG4gICAgICAgIG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gUmVhc3NpZ24gYSBnZW5lcmljIG5hbWUuXG4gICAgICBpZiAoKGRhdGEgPSBwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCBvcykgJiZcbiAgICAgICAgICAocHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgL1xcYig/OkFuZHJvaWR8U3ltYmlhbiBPU3xUYWJsZXQgT1N8d2ViT1MpXFxiLy50ZXN0KG9zKSkpIHtcbiAgICAgICAgbmFtZSA9IC9bYS16XSsoPzogSGF0KT8vaS5leGVjKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogZGF0YSkgKyAnIEJyb3dzZXInO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGQgQ2hyb21lIHZlcnNpb24gdG8gZGVzY3JpcHRpb24gZm9yIEVsZWN0cm9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0VsZWN0cm9uJyAmJiAoZGF0YSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspXFxiLy5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0Nocm9taXVtICcgKyBkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IG5vbi1PcGVyYSAoUHJlc3RvLWJhc2VkKSB2ZXJzaW9ucyAob3JkZXIgaXMgaW1wb3J0YW50KS5cbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBnZXRWZXJzaW9uKFtcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfEVkZ2V8RWRnfEVkZ0F8RWRnaU9TfEZ4aU9TfEhlYWRsZXNzQ2hyb21lfElFTW9iaWxlfElyb258T3BlcmEgP01pbml8T1BpT1N8T1BSfFJhdmVufFNhbXN1bmdCcm93c2VyfFNpbGsoPyEvW1xcXFxkLl0rJCl8VUNCcm93c2VyfFlhQnJvd3NlciknLFxuICAgICAgICAnVmVyc2lvbicsXG4gICAgICAgIHF1YWxpZnkobmFtZSksXG4gICAgICAgICcoPzpGaXJlZm94fE1pbmVmaWVsZHxOZXRGcm9udCknXG4gICAgICBdKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHN0dWJib3JuIGxheW91dCBlbmdpbmVzLlxuICAgIGlmICgoZGF0YSA9XG4gICAgICAgICAgbGF5b3V0ID09ICdpQ2FiJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID4gMyAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XG4gICAgICAgICAgL1xcYig/Ok1pZG9yaXxOb29rfFNhZmFyaSlcXGIvaS50ZXN0KHVhKSAmJiAhL14oPzpUcmlkZW50fEVkZ2VIVE1MKSQvLnRlc3QobGF5b3V0KSAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgICFsYXlvdXQgJiYgL1xcYk1TSUVcXGIvaS50ZXN0KHVhKSAmJiAob3MgPT0gJ01hYyBPUycgPyAnVGFzbWFuJyA6ICdUcmlkZW50JykgfHxcbiAgICAgICAgICBsYXlvdXQgPT0gJ1dlYktpdCcgJiYgL1xcYlBsYXlTdGF0aW9uXFxiKD8hIFZpdGFcXGIpL2kudGVzdChuYW1lKSAmJiAnTmV0RnJvbnQnXG4gICAgICAgICkpIHtcbiAgICAgIGxheW91dCA9IFtkYXRhXTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdpbmRvd3MgUGhvbmUgNyBkZXNrdG9wIG1vZGUuXG4gICAgaWYgKG5hbWUgPT0gJ0lFJyAmJiAoZGF0YSA9ICgvOyAqKD86WEJMV1B8WnVuZVdQKShcXGQrKS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lICcgKyAoL1xcKyQvLnRlc3QoZGF0YSkgPyBkYXRhIDogZGF0YSArICcueCcpO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBXaW5kb3dzIFBob25lIDgueCBkZXNrdG9wIG1vZGUuXG4gICAgZWxzZSBpZiAoL1xcYldQRGVza3RvcFxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBuYW1lID0gJ0lFIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lIDgueCc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIHZlcnNpb24gfHwgKHZlcnNpb24gPSAoL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkgfHwgMClbMV0pO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgSUUgMTEgaWRlbnRpZnlpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgZWxzZSBpZiAobmFtZSAhPSAnSUUnICYmIGxheW91dCA9PSAnVHJpZGVudCcgJiYgKGRhdGEgPSAvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSkpIHtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzICcgKyBuYW1lICsgKHZlcnNpb24gPyAnICcgKyB2ZXJzaW9uIDogJycpKTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgdmVyc2lvbiA9IGRhdGFbMV07XG4gICAgfVxuICAgIC8vIExldmVyYWdlIGVudmlyb25tZW50IGZlYXR1cmVzLlxuICAgIGlmICh1c2VGZWF0dXJlcykge1xuICAgICAgLy8gRGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50cy5cbiAgICAgIC8vIFJoaW5vIGhhcyBhIGdsb2JhbCBmdW5jdGlvbiB3aGlsZSBvdGhlcnMgaGF2ZSBhIGdsb2JhbCBvYmplY3QuXG4gICAgICBpZiAoaXNIb3N0VHlwZShjb250ZXh0LCAnZ2xvYmFsJykpIHtcbiAgICAgICAgaWYgKGphdmEpIHtcbiAgICAgICAgICBkYXRhID0gamF2YS5sYW5nLlN5c3RlbTtcbiAgICAgICAgICBhcmNoID0gZGF0YS5nZXRQcm9wZXJ0eSgnb3MuYXJjaCcpO1xuICAgICAgICAgIG9zID0gb3MgfHwgZGF0YS5nZXRQcm9wZXJ0eSgnb3MubmFtZScpICsgJyAnICsgZGF0YS5nZXRQcm9wZXJ0eSgnb3MudmVyc2lvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyaGlubykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2ZXJzaW9uID0gY29udGV4dC5yZXF1aXJlKCdyaW5nby9lbmdpbmUnKS52ZXJzaW9uLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIG5hbWUgPSAnUmluZ29KUyc7XG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoKGRhdGEgPSBjb250ZXh0LnN5c3RlbSkgJiYgZGF0YS5nbG9iYWwuc3lzdGVtID09IGNvbnRleHQuc3lzdGVtKSB7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTmFyd2hhbCc7XG4gICAgICAgICAgICAgIG9zIHx8IChvcyA9IGRhdGFbMF0ub3MgfHwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgbmFtZSA9ICdSaGlubyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgIHR5cGVvZiBjb250ZXh0LnByb2Nlc3MgPT0gJ29iamVjdCcgJiYgIWNvbnRleHQucHJvY2Vzcy5icm93c2VyICYmXG4gICAgICAgICAgKGRhdGEgPSBjb250ZXh0LnByb2Nlc3MpXG4gICAgICAgICkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS52ZXJzaW9ucyA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnZlcnNpb25zLmVsZWN0cm9uID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ05vZGUgJyArIGRhdGEudmVyc2lvbnMubm9kZSk7XG4gICAgICAgICAgICAgIG5hbWUgPSAnRWxlY3Ryb24nO1xuICAgICAgICAgICAgICB2ZXJzaW9uID0gZGF0YS52ZXJzaW9ucy5lbGVjdHJvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGEudmVyc2lvbnMubncgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnQ2hyb21pdW0gJyArIHZlcnNpb24sICdOb2RlICcgKyBkYXRhLnZlcnNpb25zLm5vZGUpO1xuICAgICAgICAgICAgICBuYW1lID0gJ05XLmpzJztcbiAgICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGEudmVyc2lvbnMubnc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcbiAgICAgICAgICAgIGFyY2ggPSBkYXRhLmFyY2g7XG4gICAgICAgICAgICBvcyA9IGRhdGEucGxhdGZvcm07XG4gICAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKTtcbiAgICAgICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uID8gdmVyc2lvblswXSA6IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgQWRvYmUgQUlSLlxuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucnVudGltZSkpID09IGFpclJ1bnRpbWVDbGFzcykge1xuICAgICAgICBuYW1lID0gJ0Fkb2JlIEFJUic7XG4gICAgICAgIG9zID0gZGF0YS5mbGFzaC5zeXN0ZW0uQ2FwYWJpbGl0aWVzLm9zO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IFBoYW50b21KUy5cbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnBoYW50b20pKSA9PSBwaGFudG9tQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdQaGFudG9tSlMnO1xuICAgICAgICB2ZXJzaW9uID0gKGRhdGEgPSBkYXRhLnZlcnNpb24gfHwgbnVsbCkgJiYgKGRhdGEubWFqb3IgKyAnLicgKyBkYXRhLm1pbm9yICsgJy4nICsgZGF0YS5wYXRjaCk7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgSUUgY29tcGF0aWJpbGl0eSBtb2Rlcy5cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIChkYXRhID0gL1xcYlRyaWRlbnRcXC8oXFxkKykvaS5leGVjKHVhKSkpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxuICAgICAgICAvLyBlcXVhbCB0aGUgZG9jdW1lbnQgbW9kZS5cbiAgICAgICAgdmVyc2lvbiA9IFt2ZXJzaW9uLCBkb2MuZG9jdW1lbnRNb2RlXTtcbiAgICAgICAgaWYgKChkYXRhID0gK2RhdGFbMV0gKyA0KSAhPSB2ZXJzaW9uWzFdKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnSUUgJyArIHZlcnNpb25bMV0gKyAnIG1vZGUnKTtcbiAgICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICcnKTtcbiAgICAgICAgICB2ZXJzaW9uWzFdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB2ZXJzaW9uID0gbmFtZSA9PSAnSUUnID8gU3RyaW5nKHZlcnNpb25bMV0udG9GaXhlZCgxKSkgOiB2ZXJzaW9uWzBdO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IElFIDExIG1hc2tpbmcgYXMgb3RoZXIgYnJvd3NlcnMuXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAvXig/OkNocm9tZXxGaXJlZm94KVxcYi8udGVzdChuYW1lKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdtYXNraW5nIGFzICcgKyBuYW1lICsgJyAnICsgdmVyc2lvbik7XG4gICAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgICB2ZXJzaW9uID0gJzExLjAnO1xuICAgICAgICBsYXlvdXQgPSBbJ1RyaWRlbnQnXTtcbiAgICAgICAgb3MgPSAnV2luZG93cyc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XG4gICAgfVxuICAgIC8vIERldGVjdCBwcmVyZWxlYXNlIHBoYXNlcy5cbiAgICBpZiAodmVyc2lvbiAmJiAoZGF0YSA9XG4gICAgICAgICAgLyg/OlthYl18ZHB8cHJlfFthYl1cXGQrcHJlKSg/OlxcZCtcXCs/KT8kL2kuZXhlYyh2ZXJzaW9uKSB8fFxuICAgICAgICAgIC8oPzphbHBoYXxiZXRhKSg/OiA/XFxkKT8vaS5leGVjKHVhICsgJzsnICsgKHVzZUZlYXR1cmVzICYmIG5hdi5hcHBNaW5vclZlcnNpb24pKSB8fFxuICAgICAgICAgIC9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAnYSdcbiAgICAgICAgKSkge1xuICAgICAgcHJlcmVsZWFzZSA9IC9iL2kudGVzdChkYXRhKSA/ICdiZXRhJyA6ICdhbHBoYSc7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKFJlZ0V4cChkYXRhICsgJ1xcXFwrPyQnKSwgJycpICtcbiAgICAgICAgKHByZXJlbGVhc2UgPT0gJ2JldGEnID8gYmV0YSA6IGFscGhhKSArICgvXFxkK1xcKz8vLmV4ZWMoZGF0YSkgfHwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgRmlyZWZveCBNb2JpbGUuXG4gICAgaWYgKG5hbWUgPT0gJ0Zlbm5lYycgfHwgbmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYig/OkFuZHJvaWR8RmlyZWZveCBPU3xLYWlPUylcXGIvLnRlc3Qob3MpKSB7XG4gICAgICBuYW1lID0gJ0ZpcmVmb3ggTW9iaWxlJztcbiAgICB9XG4gICAgLy8gT2JzY3VyZSBNYXh0aG9uJ3MgdW5yZWxpYWJsZSB2ZXJzaW9uLlxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ01heHRob24nICYmIHZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFhib3ggMzYwIGFuZCBYYm94IE9uZS5cbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcpIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHByb2R1Y3QgPT0gJ1hib3ggMzYwJyAmJiAvXFxiSUVNb2JpbGVcXGIvLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ21vYmlsZSBtb2RlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFkZCBtb2JpbGUgcG9zdGZpeC5cbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxuICAgICAgICAob3MgPT0gJ1dpbmRvd3MgQ0UnIHx8IC9Nb2JpL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICB9XG4gICAgLy8gRGV0ZWN0IElFIHBsYXRmb3JtIHByZXZpZXcuXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnSUUnICYmIHVzZUZlYXR1cmVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoY29udGV4dC5leHRlcm5hbCA9PT0gbnVsbCkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ3BsYXRmb3JtIHByZXZpZXcnKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2VtYmVkZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIERldGVjdCBCbGFja0JlcnJ5IE9TIHZlcnNpb24uXG4gICAgLy8gaHR0cDovL2RvY3MuYmxhY2tiZXJyeS5jb20vZW4vZGV2ZWxvcGVycy9kZWxpdmVyYWJsZXMvMTgxNjkvSFRUUF9oZWFkZXJzX3NlbnRfYnlfQkJfQnJvd3Nlcl8xMjM0OTExXzExLmpzcFxuICAgIGVsc2UgaWYgKCgvXFxiQmxhY2tCZXJyeVxcYi8udGVzdChwcm9kdWN0KSB8fCAvXFxiQkIxMFxcYi8udGVzdCh1YSkpICYmIChkYXRhID1cbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxuICAgICAgICAgIHZlcnNpb25cbiAgICAgICAgKSkge1xuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xuICAgICAgb3MgPSAoZGF0YVsxXSA/IChwcm9kdWN0ID0gbnVsbCwgbWFudWZhY3R1cmVyID0gJ0JsYWNrQmVycnknKSA6ICdEZXZpY2UgU29mdHdhcmUnKSArICcgJyArIGRhdGFbMF07XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGlkZW50aWZ5aW5nL21hc2tpbmcgaXRzZWxmIGFzIGFub3RoZXIgYnJvd3Nlci5cbiAgICAvLyBodHRwOi8vd3d3Lm9wZXJhLmNvbS9zdXBwb3J0L2tiL3ZpZXcvODQzL1xuICAgIGVsc2UgaWYgKHRoaXMgIT0gZm9yT3duICYmIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiBvcGVyYSkgfHxcbiAgICAgICAgICAoL09wZXJhLy50ZXN0KG5hbWUpICYmIC9cXGIoPzpNU0lFfEZpcmVmb3gpXFxiL2kudGVzdCh1YSkpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XG4gICAgICAgICAgKG5hbWUgPT0gJ0lFJyAmJiAoXG4gICAgICAgICAgICAob3MgJiYgIS9eV2luLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gNS41KSB8fFxuICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XG4gICAgICAgICAgICB2ZXJzaW9uID09IDggJiYgIS9cXGJUcmlkZW50XFxiLy50ZXN0KHVhKVxuICAgICAgICAgICkpXG4gICAgICAgICkgJiYgIXJlT3BlcmEudGVzdCgoZGF0YSA9IHBhcnNlLmNhbGwoZm9yT3duLCB1YS5yZXBsYWNlKHJlT3BlcmEsICcnKSArICc7JykpKSAmJiBkYXRhLm5hbWUpIHtcbiAgICAgIC8vIFdoZW4gXCJpZGVudGlmeWluZ1wiLCB0aGUgVUEgY29udGFpbnMgYm90aCBPcGVyYSBhbmQgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lLlxuICAgICAgZGF0YSA9ICdpbmcgYXMgJyArIGRhdGEubmFtZSArICgoZGF0YSA9IGRhdGEudmVyc2lvbikgPyAnICcgKyBkYXRhIDogJycpO1xuICAgICAgaWYgKHJlT3BlcmEudGVzdChuYW1lKSkge1xuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpICYmIG9zID09ICdNYWMgT1MnKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSAnaWRlbnRpZnknICsgZGF0YTtcbiAgICAgIH1cbiAgICAgIC8vIFdoZW4gXCJtYXNraW5nXCIsIHRoZSBVQSBjb250YWlucyBvbmx5IHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZS5cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0gJ21hc2snICsgZGF0YTtcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcbiAgICAgICAgICBuYW1lID0gZm9ybWF0KG9wZXJhQ2xhc3MucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1c2VGZWF0dXJlcykge1xuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zLlxuICAgIGlmICgoZGF0YSA9ICgvXFxiQXBwbGVXZWJLaXRcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAvLyBDb3JyZWN0IGJ1aWxkIG51bWJlciBmb3IgbnVtZXJpYyBjb21wYXJpc29uLlxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcbiAgICAgIGRhdGEgPSBbcGFyc2VGbG9hdChkYXRhLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJykpLCBkYXRhXTtcbiAgICAgIC8vIE5pZ2h0bHkgYnVpbGRzIGFyZSBwb3N0Zml4ZWQgd2l0aCBhIFwiK1wiLlxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XG4gICAgICAgIG5hbWUgPSAnV2ViS2l0IE5pZ2h0bHknO1xuICAgICAgICBwcmVyZWxlYXNlID0gJ2FscGhhJztcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgLy8gQ2xlYXIgaW5jb3JyZWN0IGJyb3dzZXIgdmVyc2lvbnMuXG4gICAgICBlbHNlIGlmICh2ZXJzaW9uID09IGRhdGFbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uID09IChkYXRhWzJdID0gKC9cXGJTYWZhcmlcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gVXNlIHRoZSBmdWxsIENocm9tZSB2ZXJzaW9uIHdoZW4gYXZhaWxhYmxlLlxuICAgICAgZGF0YVsxXSA9ICgvXFxiKD86SGVhZGxlc3MpP0Nocm9tZVxcLyhbXFxkLl0rKS9pLmV4ZWModWEpIHx8IDApWzFdO1xuICAgICAgLy8gRGV0ZWN0IEJsaW5rIGxheW91dCBlbmdpbmUuXG4gICAgICBpZiAoZGF0YVswXSA9PSA1MzcuMzYgJiYgZGF0YVsyXSA9PSA1MzcuMzYgJiYgcGFyc2VGbG9hdChkYXRhWzFdKSA+PSAyOCAmJiBsYXlvdXQgPT0gJ1dlYktpdCcpIHtcbiAgICAgICAgbGF5b3V0ID0gWydCbGluayddO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IEphdmFTY3JpcHRDb3JlLlxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NzY4NDc0L2hvdy1jYW4taS1kZXRlY3Qtd2hpY2gtamF2YXNjcmlwdC1lbmdpbmUtdjgtb3ItanNjLWlzLXVzZWQtYXQtcnVudGltZS1pbi1hbmRyb2lcbiAgICAgIGlmICghdXNlRmVhdHVyZXMgfHwgKCFsaWtlQ2hyb21lICYmICFkYXRhWzFdKSkge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIFNhZmFyaScpO1xuICAgICAgICBkYXRhID0gKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNDAwID8gMSA6IGRhdGEgPCA1MDAgPyAyIDogZGF0YSA8IDUyNiA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQgPyAnNCsnIDogZGF0YSA8IDUzNSA/IDUgOiBkYXRhIDwgNTM3ID8gNiA6IGRhdGEgPCA1MzggPyA3IDogZGF0YSA8IDYwMSA/IDggOiBkYXRhIDwgNjAyID8gOSA6IGRhdGEgPCA2MDQgPyAxMCA6IGRhdGEgPCA2MDYgPyAxMSA6IGRhdGEgPCA2MDggPyAxMiA6ICcxMicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBDaHJvbWUnKTtcbiAgICAgICAgZGF0YSA9IGRhdGFbMV0gfHwgKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNTMwID8gMSA6IGRhdGEgPCA1MzIgPyAyIDogZGF0YSA8IDUzMi4wNSA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQuMDMgPyA1IDogZGF0YSA8IDUzNC4wNyA/IDYgOiBkYXRhIDwgNTM0LjEwID8gNyA6IGRhdGEgPCA1MzQuMTMgPyA4IDogZGF0YSA8IDUzNC4xNiA/IDkgOiBkYXRhIDwgNTM0LjI0ID8gMTAgOiBkYXRhIDwgNTM0LjMwID8gMTEgOiBkYXRhIDwgNTM1LjAxID8gMTIgOiBkYXRhIDwgNTM1LjAyID8gJzEzKycgOiBkYXRhIDwgNTM1LjA3ID8gMTUgOiBkYXRhIDwgNTM1LjExID8gMTYgOiBkYXRhIDwgNTM1LjE5ID8gMTcgOiBkYXRhIDwgNTM2LjA1ID8gMTggOiBkYXRhIDwgNTM2LjEwID8gMTkgOiBkYXRhIDwgNTM3LjAxID8gMjAgOiBkYXRhIDwgNTM3LjExID8gJzIxKycgOiBkYXRhIDwgNTM3LjEzID8gMjMgOiBkYXRhIDwgNTM3LjE4ID8gMjQgOiBkYXRhIDwgNTM3LjI0ID8gMjUgOiBkYXRhIDwgNTM3LjM2ID8gMjYgOiBsYXlvdXQgIT0gJ0JsaW5rJyA/ICcyNycgOiAnMjgnKTtcbiAgICAgIH1cbiAgICAgIC8vIEFkZCB0aGUgcG9zdGZpeCBvZiBcIi54XCIgb3IgXCIrXCIgZm9yIGFwcHJveGltYXRlIHZlcnNpb25zLlxuICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gKz0gJyAnICsgKGRhdGEgKz0gdHlwZW9mIGRhdGEgPT0gJ251bWJlcicgPyAnLngnIDogL1suK10vLnRlc3QoZGF0YSkgPyAnJyA6ICcrJykpO1xuICAgICAgLy8gT2JzY3VyZSB2ZXJzaW9uIGZvciBzb21lIFNhZmFyaSAxLTIgcmVsZWFzZXMuXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAoIXZlcnNpb24gfHwgcGFyc2VJbnQodmVyc2lvbikgPiA0NSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IGRhdGE7XG4gICAgICB9IGVsc2UgaWYgKG5hbWUgPT0gJ0Nocm9tZScgJiYgL1xcYkhlYWRsZXNzQ2hyb21lL2kudGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnaGVhZGxlc3MnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRGV0ZWN0IE9wZXJhIGRlc2t0b3AgbW9kZXMuXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XG4gICAgICBuYW1lICs9ICcgJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XG4gICAgICAgIG5hbWUgKz0gJ01pbmknO1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgKz0gJ01vYmlsZSc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xuICAgIH1cbiAgICAvLyBEZXRlY3QgQ2hyb21lIGRlc2t0b3AgbW9kZS5cbiAgICBlbHNlIGlmIChuYW1lID09ICdTYWZhcmknICYmIC9cXGJDaHJvbWVcXGIvLmV4ZWMobGF5b3V0ICYmIGxheW91dFsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgbmFtZSA9ICdDaHJvbWUgTW9iaWxlJztcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuXG4gICAgICBpZiAoL1xcYk9TIFhcXGIvLnRlc3Qob3MpKSB7XG4gICAgICAgIG1hbnVmYWN0dXJlciA9ICdBcHBsZSc7XG4gICAgICAgIG9zID0gJ2lPUyA0LjMrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9zID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gTmV3ZXIgdmVyc2lvbnMgb2YgU1JXYXJlIElyb24gdXNlcyB0aGUgQ2hyb21lIHRhZyB0byBpbmRpY2F0ZSBpdHMgdmVyc2lvbiBudW1iZXIuXG4gICAgZWxzZSBpZiAoL1xcYlNSV2FyZSBJcm9uXFxiLy50ZXN0KG5hbWUpICYmICF2ZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gZ2V0VmVyc2lvbignQ2hyb21lJyk7XG4gICAgfVxuICAgIC8vIFN0cmlwIGluY29ycmVjdCBPUyB2ZXJzaW9ucy5cbiAgICBpZiAodmVyc2lvbiAmJiB2ZXJzaW9uLmluZGV4T2YoKGRhdGEgPSAvW1xcZC5dKyQvLmV4ZWMob3MpKSkgPT0gMCAmJlxuICAgICAgICB1YS5pbmRleE9mKCcvJyArIGRhdGEgKyAnLScpID4gLTEpIHtcbiAgICAgIG9zID0gdHJpbShvcy5yZXBsYWNlKGRhdGEsICcnKSk7XG4gICAgfVxuICAgIC8vIEVuc3VyZSBPUyBkb2VzIG5vdCBpbmNsdWRlIHRoZSBicm93c2VyIG5hbWUuXG4gICAgaWYgKG9zICYmIG9zLmluZGV4T2YobmFtZSkgIT0gLTEgJiYgIVJlZ0V4cChuYW1lICsgJyBPUycpLnRlc3Qob3MpKSB7XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBxdWFsaWZ5KG5hbWUpICsgJyAqJyksICcnKTtcbiAgICB9XG4gICAgLy8gQWRkIGxheW91dCBlbmdpbmUuXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcbiAgICAgICAgL0Jyb3dzZXJ8THVuYXNjYXBlfE1heHRob24vLnRlc3QobmFtZSkgfHxcbiAgICAgICAgbmFtZSAhPSAnU2FmYXJpJyAmJiAvXmlPUy8udGVzdChvcykgJiYgL1xcYlNhZmFyaVxcYi8udGVzdChsYXlvdXRbMV0pIHx8XG4gICAgICAgIC9eKD86QWRvYmV8QXJvcmF8QnJlYWNofE1pZG9yaXxPcGVyYXxQaGFudG9tfFJla29ucXxSb2NrfFNhbXN1bmcgSW50ZXJuZXR8U2xlaXBuaXJ8U1JXYXJlIElyb258Vml2YWxkaXxXZWIpLy50ZXN0KG5hbWUpICYmIGxheW91dFsxXSkpIHtcbiAgICAgIC8vIERvbid0IGFkZCBsYXlvdXQgZGV0YWlscyB0byBkZXNjcmlwdGlvbiBpZiB0aGV5IGFyZSBmYWxzZXkuXG4gICAgICAoZGF0YSA9IGxheW91dFtsYXlvdXQubGVuZ3RoIC0gMV0pICYmIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIENvbWJpbmUgY29udGV4dHVhbCBpbmZvcm1hdGlvbi5cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IFsnKCcgKyBkZXNjcmlwdGlvbi5qb2luKCc7ICcpICsgJyknXTtcbiAgICB9XG4gICAgLy8gQXBwZW5kIG1hbnVmYWN0dXJlciB0byBkZXNjcmlwdGlvbi5cbiAgICBpZiAobWFudWZhY3R1cmVyICYmIHByb2R1Y3QgJiYgcHJvZHVjdC5pbmRleE9mKG1hbnVmYWN0dXJlcikgPCAwKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdvbiAnICsgbWFudWZhY3R1cmVyKTtcbiAgICB9XG4gICAgLy8gQXBwZW5kIHByb2R1Y3QgdG8gZGVzY3JpcHRpb24uXG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goKC9eb24gLy50ZXN0KGRlc2NyaXB0aW9uW2Rlc2NyaXB0aW9uLmxlbmd0aCAtIDFdKSA/ICcnIDogJ29uICcpICsgcHJvZHVjdCk7XG4gICAgfVxuICAgIC8vIFBhcnNlIHRoZSBPUyBpbnRvIGFuIG9iamVjdC5cbiAgICBpZiAob3MpIHtcbiAgICAgIGRhdGEgPSAvIChbXFxkLitdKykkLy5leGVjKG9zKTtcbiAgICAgIGlzU3BlY2lhbENhc2VkT1MgPSBkYXRhICYmIG9zLmNoYXJBdChvcy5sZW5ndGggLSBkYXRhWzBdLmxlbmd0aCAtIDEpID09ICcvJztcbiAgICAgIG9zID0ge1xuICAgICAgICAnYXJjaGl0ZWN0dXJlJzogMzIsXG4gICAgICAgICdmYW1pbHknOiAoZGF0YSAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyBvcy5yZXBsYWNlKGRhdGFbMF0sICcnKSA6IG9zLFxuICAgICAgICAndmVyc2lvbic6IGRhdGEgPyBkYXRhWzFdIDogbnVsbCxcbiAgICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgKCh2ZXJzaW9uICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/ICcgJyArIHZlcnNpb24gOiAnJykgKyAodGhpcy5hcmNoaXRlY3R1cmUgPT0gNjQgPyAnIDY0LWJpdCcgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIC8vIEFkZCBicm93c2VyL09TIGFyY2hpdGVjdHVyZS5cbiAgICBpZiAoKGRhdGEgPSAvXFxiKD86QU1EfElBfFdpbnxXT1d8eDg2X3x4KTY0XFxiL2kuZXhlYyhhcmNoKSkgJiYgIS9cXGJpNjg2XFxiL2kudGVzdChhcmNoKSkge1xuICAgICAgaWYgKG9zKSB7XG4gICAgICAgIG9zLmFyY2hpdGVjdHVyZSA9IDY0O1xuICAgICAgICBvcy5mYW1pbHkgPSBvcy5mYW1pbHkucmVwbGFjZShSZWdFeHAoJyAqJyArIGRhdGEpLCAnJyk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICAgbmFtZSAmJiAoL1xcYldPVzY0XFxiL2kudGVzdCh1YSkgfHxcbiAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgL1xcdyg/Ojg2fDMyKSQvLnRlc3QobmF2LmNwdUNsYXNzIHx8IG5hdi5wbGF0Zm9ybSkgJiYgIS9cXGJXaW42NDsgeDY0XFxiL2kudGVzdCh1YSkpKVxuICAgICAgKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJzMyLWJpdCcpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBDaHJvbWUgMzkgYW5kIGFib3ZlIG9uIE9TIFggaXMgYWx3YXlzIDY0LWJpdC5cbiAgICBlbHNlIGlmIChcbiAgICAgICAgb3MgJiYgL15PUyBYLy50ZXN0KG9zLmZhbWlseSkgJiZcbiAgICAgICAgbmFtZSA9PSAnQ2hyb21lJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID49IDM5XG4gICAgKSB7XG4gICAgICBvcy5hcmNoaXRlY3R1cmUgPSA2NDtcbiAgICB9XG5cbiAgICB1YSB8fCAodWEgPSBudWxsKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBwbGF0Zm9ybSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXRmb3JtIGRlc2NyaXB0aW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJyb3dzZXIncyBsYXlvdXQgZW5naW5lLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIGxheW91dCBlbmdpbmVzIGluY2x1ZGU6XG4gICAgICogXCJCbGlua1wiLCBcIkVkZ2VIVE1MXCIsIFwiR2Vja29cIiwgXCJUcmlkZW50XCIgYW5kIFwiV2ViS2l0XCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubGF5b3V0ID0gbGF5b3V0ICYmIGxheW91dFswXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0J3MgbWFudWZhY3R1cmVyLlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgbWFudWZhY3R1cmVycyBpbmNsdWRlOlxuICAgICAqIFwiQXBwbGVcIiwgXCJBcmNob3NcIiwgXCJBbWF6b25cIiwgXCJBc3VzXCIsIFwiQmFybmVzICYgTm9ibGVcIiwgXCJCbGFja0JlcnJ5XCIsXG4gICAgICogXCJHb29nbGVcIiwgXCJIUFwiLCBcIkhUQ1wiLCBcIkxHXCIsIFwiTWljcm9zb2Z0XCIsIFwiTW90b3JvbGFcIiwgXCJOaW50ZW5kb1wiLFxuICAgICAqIFwiTm9raWFcIiwgXCJTYW1zdW5nXCIgYW5kIFwiU29ueVwiXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm1hbnVmYWN0dXJlciA9IG1hbnVmYWN0dXJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyL2Vudmlyb25tZW50LlxuICAgICAqXG4gICAgICogVGhlIGxpc3Qgb2YgY29tbW9uIGJyb3dzZXIgbmFtZXMgaW5jbHVkZTpcbiAgICAgKiBcIkNocm9tZVwiLCBcIkVsZWN0cm9uXCIsIFwiRmlyZWZveFwiLCBcIkZpcmVmb3ggZm9yIGlPU1wiLCBcIklFXCIsXG4gICAgICogXCJNaWNyb3NvZnQgRWRnZVwiLCBcIlBoYW50b21KU1wiLCBcIlNhZmFyaVwiLCBcIlNlYU1vbmtleVwiLCBcIlNpbGtcIixcbiAgICAgKiBcIk9wZXJhIE1pbmlcIiBhbmQgXCJPcGVyYVwiXG4gICAgICpcbiAgICAgKiBNb2JpbGUgdmVyc2lvbnMgb2Ygc29tZSBicm93c2VycyBoYXZlIFwiTW9iaWxlXCIgYXBwZW5kZWQgdG8gdGhlaXIgbmFtZTpcbiAgICAgKiBlZy4gXCJDaHJvbWUgTW9iaWxlXCIsIFwiRmlyZWZveCBNb2JpbGVcIiwgXCJJRSBNb2JpbGVcIiBhbmQgXCJPcGVyYSBNb2JpbGVcIlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbHBoYS9iZXRhIHJlbGVhc2UgaW5kaWNhdG9yLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0IGhvc3RpbmcgdGhlIGJyb3dzZXIuXG4gICAgICpcbiAgICAgKiBUaGUgbGlzdCBvZiBjb21tb24gcHJvZHVjdHMgaW5jbHVkZTpcbiAgICAgKlxuICAgICAqIFwiQmxhY2tCZXJyeVwiLCBcIkdhbGF4eSBTNFwiLCBcIkx1bWlhXCIsIFwiaVBhZFwiLCBcImlQb2RcIiwgXCJpUGhvbmVcIiwgXCJLaW5kbGVcIixcbiAgICAgKiBcIktpbmRsZSBGaXJlXCIsIFwiTmV4dXNcIiwgXCJOb29rXCIsIFwiUGxheUJvb2tcIiwgXCJUb3VjaFBhZFwiIGFuZCBcIlRyYW5zZm9ybWVyXCJcbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJvZHVjdCA9IHByb2R1Y3Q7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3NlcidzIHVzZXIgYWdlbnQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS51YSA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udmVyc2lvbiA9IG5hbWUgJiYgdmVyc2lvbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpbmcgc3lzdGVtLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgcGxhdGZvcm0ub3MgPSBvcyB8fCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIENQVSBhcmNoaXRlY3R1cmUgdGhlIE9TIGlzIGJ1aWx0IGZvci5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIG51bWJlcnxudWxsXG4gICAgICAgKi9cbiAgICAgICdhcmNoaXRlY3R1cmUnOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBmYW1pbHkgb2YgdGhlIE9TLlxuICAgICAgICpcbiAgICAgICAqIENvbW1vbiB2YWx1ZXMgaW5jbHVkZTpcbiAgICAgICAqIFwiV2luZG93c1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggUjIgLyA3XCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCAvIFZpc3RhXCIsXG4gICAgICAgKiBcIldpbmRvd3MgWFBcIiwgXCJPUyBYXCIsIFwiTGludXhcIiwgXCJVYnVudHVcIiwgXCJEZWJpYW5cIiwgXCJGZWRvcmFcIiwgXCJSZWQgSGF0XCIsXG4gICAgICAgKiBcIlN1U0VcIiwgXCJBbmRyb2lkXCIsIFwiaU9TXCIgYW5kIFwiV2luZG93cyBQaG9uZVwiXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAnZmFtaWx5JzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAndmVyc2lvbic6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgT1Mgc3RyaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIE9TIHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgICB9O1xuXG4gICAgcGxhdGZvcm0ucGFyc2UgPSBwYXJzZTtcbiAgICBwbGF0Zm9ybS50b1N0cmluZyA9IHRvU3RyaW5nUGxhdGZvcm07XG5cbiAgICBpZiAocGxhdGZvcm0udmVyc2lvbikge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCh2ZXJzaW9uKTtcbiAgICB9XG4gICAgaWYgKHBsYXRmb3JtLm5hbWUpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQobmFtZSk7XG4gICAgfVxuICAgIGlmIChvcyAmJiBuYW1lICYmICEob3MgPT0gU3RyaW5nKG9zKS5zcGxpdCgnICcpWzBdICYmIChvcyA9PSBuYW1lLnNwbGl0KCcgJylbMF0gfHwgcHJvZHVjdCkpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKHByb2R1Y3QgPyAnKCcgKyBvcyArICcpJyA6ICdvbiAnICsgb3MpO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsYXRmb3JtO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gRXhwb3J0IHBsYXRmb3JtLlxuICB2YXIgcGxhdGZvcm0gPSBwYXJzZSgpO1xuXG4gIC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEV4cG9zZSBwbGF0Zm9ybSBvbiB0aGUgZ2xvYmFsIG9iamVjdCB0byBwcmV2ZW50IGVycm9ycyB3aGVuIHBsYXRmb3JtIGlzXG4gICAgLy8gbG9hZGVkIGJ5IGEgc2NyaXB0IHRhZyBpbiB0aGUgcHJlc2VuY2Ugb2YgYW4gQU1EIGxvYWRlci5cbiAgICAvLyBTZWUgaHR0cDovL3JlcXVpcmVqcy5vcmcvZG9jcy9lcnJvcnMuaHRtbCNtaXNtYXRjaCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgIHJvb3QucGxhdGZvcm0gPSBwbGF0Zm9ybTtcblxuICAgIC8vIERlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvIHBsYXRmb3JtIGNhbiBiZSBhbGlhc2VkIHRocm91Z2ggcGF0aCBtYXBwaW5nLlxuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwbGF0Zm9ybTtcbiAgICB9KTtcbiAgfVxuICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxuICBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gRXhwb3J0IGZvciBDb21tb25KUyBzdXBwb3J0LlxuICAgIGZvck93bihwbGF0Zm9ybSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgZnJlZUV4cG9ydHNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIEV4cG9ydCB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAgICByb290LnBsYXRmb3JtID0gcGxhdGZvcm07XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCJpbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nXG5cbmNvbnN0IGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5jb25zdCBWSURfS0VZID0gJ3ZpZCdcblxubGV0IG1lbW9yeVZpZFxuXG5jb25zdCB2YWxpZGF0ZSA9IChvcHRpb25zID0ge30pID0+ICh7XG5cdGRldGFpbGVkOiBvcHRpb25zLmRldGFpbGVkID09PSB0cnVlLFxuXHRpZ25vcmVMb2NhbGhvc3Q6IG9wdGlvbnMuaWdub3JlTG9jYWxob3N0ICE9PSBmYWxzZSxcblx0aWdub3JlT3duVmlzaXRzOiBvcHRpb25zLmlnbm9yZU93blZpc2l0cyAhPT0gZmFsc2UsXG59KVxuXG5jb25zdCBpc0xvY2FsaG9zdCA9IChob3N0bmFtZSkgPT4ge1xuXHRyZXR1cm4gaG9zdG5hbWUgPT09ICcnIHx8IGhvc3RuYW1lID09PSAnbG9jYWxob3N0JyB8fCBob3N0bmFtZSA9PT0gJzEyNy4wLjAuMScgfHwgaG9zdG5hbWUgPT09ICc6OjEnXG59XG5cbmNvbnN0IGlzQm90ID0gKHVzZXJBZ2VudCkgPT4ge1xuXHRyZXR1cm4gKC9ib3R8Y3Jhd2xlcnxzcGlkZXJ8Y3Jhd2xpbmcvaSkudGVzdCh1c2VyQWdlbnQpXG59XG5cbmNvbnN0IGlzRmFrZUlkID0gKGlkKSA9PiB7XG5cdHJldHVybiBpZCA9PT0gJzg4ODg4ODg4LTg4ODgtODg4OC04ODg4LTg4ODg4ODg4ODg4OCdcbn1cblxuY29uc3QgaXNJbkJhY2tncm91bmQgPSAoKSA9PiB7XG5cdHJldHVybiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nXG59XG5cbmNvbnN0IHNvdXJjZSA9ICgpID0+IHtcblx0Y29uc3QgdmFsdWUgPSAobG9jYXRpb24uc2VhcmNoLnNwbGl0KCdzb3VyY2U9JylbMV0gfHwgJycpLnNwbGl0KCcmJylbMF1cblx0cmV0dXJuIHZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6IHZhbHVlXG59XG5cbmNvbnN0IHJhbmRvbVBhcnQgPSAoKSA9PiB7XG5cdGlmICh3aW5kb3cuY3J5cHRvICE9IG51bGwgJiYgdHlwZW9mIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIFsgLi4ud2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoMTYpKSBdXG5cdFx0XHQubWFwKCh2YWx1ZSkgPT4gdmFsdWUudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpXG5cdFx0XHQuam9pbignJylcblx0fVxuXG5cdHJldHVybiBgJHsgRGF0ZS5ub3coKS50b1N0cmluZygzNikgfSR7IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpXG5cdFx0LnNsaWNlKDIpIH1gXG59XG5cbmNvbnN0IGNyZWF0ZVZpZCA9ICgpID0+IHtcblx0aWYgKHdpbmRvdy5jcnlwdG8gIT0gbnVsbCAmJiB0eXBlb2Ygd2luZG93LmNyeXB0by5yYW5kb21VVUlEID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIHdpbmRvdy5jcnlwdG8ucmFuZG9tVVVJRCgpXG5cdH1cblxuXHRyZXR1cm4gcmFuZG9tUGFydCgpXG59XG5cbmNvbnN0IHZpZCA9ICgpID0+IHtcblx0aWYgKG1lbW9yeVZpZCAhPSBudWxsKSByZXR1cm4gbWVtb3J5VmlkXG5cblx0dHJ5IHtcblx0XHRjb25zdCBzdG9yZWRWaWQgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oVklEX0tFWSlcblx0XHRpZiAoc3RvcmVkVmlkICE9IG51bGwgJiYgc3RvcmVkVmlkICE9PSAnJykge1xuXHRcdFx0bWVtb3J5VmlkID0gc3RvcmVkVmlkXG5cdFx0XHRyZXR1cm4gbWVtb3J5VmlkXG5cdFx0fVxuXG5cdFx0bWVtb3J5VmlkID0gY3JlYXRlVmlkKClcblx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oVklEX0tFWSwgbWVtb3J5VmlkKVxuXHRcdHJldHVybiBtZW1vcnlWaWRcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRtZW1vcnlWaWQgPSBjcmVhdGVWaWQoKVxuXHRcdHJldHVybiBtZW1vcnlWaWRcblx0fVxufVxuXG5jb25zdCBhdHRyaWJ1dGVzID0gKGRldGFpbGVkID0gZmFsc2UpID0+IHtcblx0Y29uc3QgZGVmYXVsdERhdGEgPSB7XG5cdFx0dmlkOiB2aWQoKSxcblx0XHRzaXRlTG9jYXRpb246IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuXHRcdHNpdGVSZWZlcnJlcjogZG9jdW1lbnQucmVmZXJyZXIsXG5cdFx0c291cmNlOiBzb3VyY2UoKSxcblx0fVxuXG5cdGNvbnN0IGRldGFpbGVkRGF0YSA9IHtcblx0XHRzaXRlTGFuZ3VhZ2U6IChuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZSkuc3Vic3RyKDAsIDIpLFxuXHRcdHNjcmVlbldpZHRoOiBzY3JlZW4ud2lkdGgsXG5cdFx0c2NyZWVuSGVpZ2h0OiBzY3JlZW4uaGVpZ2h0LFxuXHRcdHNjcmVlbkNvbG9yRGVwdGg6IHNjcmVlbi5jb2xvckRlcHRoLFxuXHRcdGRldmljZU5hbWU6IHBsYXRmb3JtLnByb2R1Y3QsXG5cdFx0ZGV2aWNlTWFudWZhY3R1cmVyOiBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIsXG5cdFx0b3NOYW1lOiBwbGF0Zm9ybS5vcy5mYW1pbHksXG5cdFx0b3NWZXJzaW9uOiBwbGF0Zm9ybS5vcy52ZXJzaW9uLFxuXHRcdGJyb3dzZXJOYW1lOiBwbGF0Zm9ybS5uYW1lLFxuXHRcdGJyb3dzZXJWZXJzaW9uOiBwbGF0Zm9ybS52ZXJzaW9uLFxuXHRcdGJyb3dzZXJXaWR0aDogd2luZG93Lm91dGVyV2lkdGggfHwgd2luZG93LmlubmVyV2lkdGgsXG5cdFx0YnJvd3NlckhlaWdodDogd2luZG93Lm91dGVySGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodCxcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Li4uZGVmYXVsdERhdGEsXG5cdFx0Li4uKGRldGFpbGVkID09PSB0cnVlID8gZGV0YWlsZWREYXRhIDoge30pLFxuXHR9XG59XG5cbmNvbnN0IGNyZWF0ZVJlY29yZEJvZHkgPSAoZG9tYWluSWQsIGlucHV0KSA9PiAoe1xuXHRxdWVyeTogYFxuXHRcdG11dGF0aW9uIGNyZWF0ZVJlY29yZCgkZG9tYWluSWQ6IElEISwgJGlucHV0OiBDcmVhdGVSZWNvcmRJbnB1dCEpIHtcblx0XHRcdGNyZWF0ZVJlY29yZChkb21haW5JZDogJGRvbWFpbklkLCBpbnB1dDogJGlucHV0KSB7XG5cdFx0XHRcdHBheWxvYWQge1xuXHRcdFx0XHRcdGlkXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdGAsXG5cdHZhcmlhYmxlczoge1xuXHRcdGRvbWFpbklkLFxuXHRcdGlucHV0LFxuXHR9LFxufSlcblxuY29uc3QgdXBkYXRlUmVjb3JkQm9keSA9IChyZWNvcmRJZCkgPT4gKHtcblx0cXVlcnk6IGBcblx0XHRtdXRhdGlvbiB1cGRhdGVSZWNvcmQoJHJlY29yZElkOiBJRCEpIHtcblx0XHRcdHVwZGF0ZVJlY29yZChpZDogJHJlY29yZElkKSB7XG5cdFx0XHRcdHN1Y2Nlc3Ncblx0XHRcdH1cblx0XHR9XG5cdGAsXG5cdHZhcmlhYmxlczoge1xuXHRcdHJlY29yZElkLFxuXHR9LFxufSlcblxuY29uc3QgY3JlYXRlQWN0aW9uQm9keSA9IChldmVudElkLCBpbnB1dCkgPT4gKHtcblx0cXVlcnk6IGBcblx0XHRtdXRhdGlvbiBjcmVhdGVBY3Rpb24oJGV2ZW50SWQ6IElEISwgJGlucHV0OiBDcmVhdGVBY3Rpb25JbnB1dCEpIHtcblx0XHRcdGNyZWF0ZUFjdGlvbihldmVudElkOiAkZXZlbnRJZCwgaW5wdXQ6ICRpbnB1dCkge1xuXHRcdFx0XHRwYXlsb2FkIHtcblx0XHRcdFx0XHRpZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRgLFxuXHR2YXJpYWJsZXM6IHtcblx0XHRldmVudElkLFxuXHRcdGlucHV0LFxuXHR9LFxufSlcblxuY29uc3QgdXBkYXRlQWN0aW9uQm9keSA9IChhY3Rpb25JZCwgaW5wdXQpID0+ICh7XG5cdHF1ZXJ5OiBgXG5cdFx0bXV0YXRpb24gdXBkYXRlQWN0aW9uKCRhY3Rpb25JZDogSUQhLCAkaW5wdXQ6IFVwZGF0ZUFjdGlvbklucHV0ISkge1xuXHRcdFx0dXBkYXRlQWN0aW9uKGlkOiAkYWN0aW9uSWQsIGlucHV0OiAkaW5wdXQpIHtcblx0XHRcdFx0c3VjY2Vzc1xuXHRcdFx0fVxuXHRcdH1cblx0YCxcblx0dmFyaWFibGVzOiB7XG5cdFx0YWN0aW9uSWQsXG5cdFx0aW5wdXQsXG5cdH0sXG59KVxuXG5jb25zdCBlbmRwb2ludCA9IChzZXJ2ZXIpID0+IHtcblx0Y29uc3QgaGFzVHJhaWxpbmdTbGFzaCA9IHNlcnZlci5zdWJzdHIoLTEpID09PSAnLydcblx0cmV0dXJuIHNlcnZlciArIChoYXNUcmFpbGluZ1NsYXNoID09PSB0cnVlID8gJycgOiAnLycpICsgJ2FwaSdcbn1cblxuY29uc3Qgc2VuZCA9ICh1cmwsIGJvZHksIG9wdGlvbnMsIG5leHQpID0+IHtcblx0Y29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuXHR4aHIub3BlbignUE9TVCcsIHVybClcblxuXHR4aHIub25sb2FkID0gKCkgPT4ge1xuXHRcdGlmICh4aHIuc3RhdHVzICE9PSAyMDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignU2VydmVyIHJldHVybmVkIHdpdGggYW4gdW5oYW5kbGVkIHN0YXR1cycpXG5cdFx0fVxuXG5cdFx0bGV0IGpzb24gPSBudWxsXG5cblx0XHR0cnkge1xuXHRcdFx0anNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dClcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gcGFyc2UgcmVzcG9uc2UgZnJvbSBzZXJ2ZXInKVxuXHRcdH1cblxuXHRcdGlmIChqc29uLmVycm9ycyAhPSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoanNvbi5lcnJvcnNbMF0ubWVzc2FnZSlcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIG5leHQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJldHVybiBuZXh0KGpzb24pXG5cdFx0fVxuXHR9XG5cblx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnKVxuXHR4aHIud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy5pZ25vcmVPd25WaXNpdHNcblx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoYm9keSkpXG59XG5cbmNvbnN0IGRldGVjdCA9ICgpID0+IHtcblx0Y29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFja2VlLWRvbWFpbi1pZF0nKVxuXHRpZiAoZWxlbSA9PSBudWxsKSByZXR1cm5cblxuXHRjb25zdCBzZXJ2ZXIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1hY2tlZS1zZXJ2ZXInKSB8fCAnJ1xuXHRjb25zdCBkb21haW5JZCA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWFja2VlLWRvbWFpbi1pZCcpXG5cdGNvbnN0IG9wdGlvbnMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1hY2tlZS1vcHRzJykgfHwgJ3t9J1xuXG5cdGNyZWF0ZShzZXJ2ZXIsIEpTT04ucGFyc2Uob3B0aW9ucykpLnJlY29yZChkb21haW5JZClcbn1cblxuY29uc3QgY3JlYXRlID0gKHNlcnZlciwgb3B0aW9ucykgPT4ge1xuXHRvcHRpb25zID0gdmFsaWRhdGUob3B0aW9ucylcblx0Y29uc3QgdXJsID0gZW5kcG9pbnQoc2VydmVyKVxuXHRjb25zdCBub29wID0gKCkgPT4ge31cblx0Y29uc3QgZmFrZUluc3RhbmNlID0ge1xuXHRcdHJlY29yZDogKCkgPT4gKHsgc3RvcDogbm9vcCB9KSxcblx0XHR1cGRhdGVSZWNvcmQ6ICgpID0+ICh7IHN0b3A6IG5vb3AgfSksXG5cdFx0YWN0aW9uOiBub29wLFxuXHRcdHVwZGF0ZUFjdGlvbjogbm9vcCxcblx0fVxuXG5cdGlmIChvcHRpb25zLmlnbm9yZUxvY2FsaG9zdCA9PT0gdHJ1ZSAmJiBpc0xvY2FsaG9zdChsb2NhdGlvbi5ob3N0bmFtZSkgPT09IHRydWUpIHtcblx0XHRjb25zb2xlLndhcm4oJ0Fja2VlIGlnbm9yZXMgeW91IGJlY2F1c2UgeW91IGFyZSBvbiBsb2NhbGhvc3QnKVxuXHRcdHJldHVybiBmYWtlSW5zdGFuY2Vcblx0fVxuXG5cdGlmIChpc0JvdChuYXZpZ2F0b3IudXNlckFnZW50KSA9PT0gdHJ1ZSkge1xuXHRcdGNvbnNvbGUud2FybignQWNrZWUgaWdub3JlcyB5b3UgYmVjYXVzZSB5b3UgYXJlIGEgYm90Jylcblx0XHRyZXR1cm4gZmFrZUluc3RhbmNlXG5cdH1cblxuXHRjb25zdCBfcmVjb3JkID0gKGRvbWFpbklkLCBhdHRycyA9IGF0dHJpYnV0ZXMob3B0aW9ucy5kZXRhaWxlZCksIG5leHQpID0+IHtcblx0XHRsZXQgaXNTdG9wcGVkID0gZmFsc2Vcblx0XHRjb25zdCBzdG9wID0gKCkgPT4ge1xuXHRcdFx0aXNTdG9wcGVkID0gdHJ1ZVxuXHRcdH1cblxuXHRcdHNlbmQodXJsLCBjcmVhdGVSZWNvcmRCb2R5KGRvbWFpbklkLCBhdHRycyksIG9wdGlvbnMsIChqc29uKSA9PiB7XG5cdFx0XHRjb25zdCByZWNvcmRJZCA9IGpzb24uZGF0YS5jcmVhdGVSZWNvcmQucGF5bG9hZC5pZFxuXG5cdFx0XHRpZiAoaXNGYWtlSWQocmVjb3JkSWQpID09PSB0cnVlKSB7XG5cdFx0XHRcdHJldHVybiBjb25zb2xlLndhcm4oJ0Fja2VlIGlnbm9yZXMgeW91IGJlY2F1c2UgdGhpcyBpcyB5b3VyIG93biBzaXRlJylcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRcdGlmIChpc1N0b3BwZWQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKVxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzSW5CYWNrZ3JvdW5kKCkgPT09IHRydWUpIHJldHVyblxuXG5cdFx0XHRcdHNlbmQodXJsLCB1cGRhdGVSZWNvcmRCb2R5KHJlY29yZElkKSwgb3B0aW9ucylcblx0XHRcdH0sIDE1MDAwKVxuXG5cdFx0XHRpZiAodHlwZW9mIG5leHQgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0cmV0dXJuIG5leHQocmVjb3JkSWQpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHJldHVybiB7IHN0b3AgfVxuXHR9XG5cblx0Y29uc3QgX3VwZGF0ZVJlY29yZCA9IChyZWNvcmRJZCkgPT4ge1xuXHRcdGxldCBpc1N0b3BwZWQgPSBmYWxzZVxuXHRcdGNvbnN0IHN0b3AgPSAoKSA9PiB7XG5cdFx0XHRpc1N0b3BwZWQgPSB0cnVlXG5cdFx0fVxuXG5cdFx0aWYgKGlzRmFrZUlkKHJlY29yZElkKSA9PT0gdHJ1ZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKCdBY2tlZSBpZ25vcmVzIHlvdSBiZWNhdXNlIHRoaXMgaXMgeW91ciBvd24gc2l0ZScpXG5cdFx0XHRyZXR1cm4geyBzdG9wIH1cblx0XHR9XG5cblx0XHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmIChpc1N0b3BwZWQgPT09IHRydWUpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChpc0luQmFja2dyb3VuZCgpID09PSB0cnVlKSByZXR1cm5cblxuXHRcdFx0c2VuZCh1cmwsIHVwZGF0ZVJlY29yZEJvZHkocmVjb3JkSWQpLCBvcHRpb25zKVxuXHRcdH0sIDE1MDAwKVxuXG5cdFx0cmV0dXJuIHsgc3RvcCB9XG5cdH1cblxuXHRjb25zdCBfYWN0aW9uID0gKGV2ZW50SWQsIGF0dHJzLCBuZXh0KSA9PiB7XG5cdFx0c2VuZCh1cmwsIGNyZWF0ZUFjdGlvbkJvZHkoZXZlbnRJZCwgYXR0cnMpLCBvcHRpb25zLCAoanNvbikgPT4ge1xuXHRcdFx0Y29uc3QgYWN0aW9uSWQgPSBqc29uLmRhdGEuY3JlYXRlQWN0aW9uLnBheWxvYWQuaWRcblxuXHRcdFx0aWYgKGlzRmFrZUlkKGFjdGlvbklkKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRyZXR1cm4gY29uc29sZS53YXJuKCdBY2tlZSBpZ25vcmVzIHlvdSBiZWNhdXNlIHRoaXMgaXMgeW91ciBvd24gc2l0ZScpXG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgbmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRyZXR1cm4gbmV4dChhY3Rpb25JZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblx0Y29uc3QgX3VwZGF0ZUFjdGlvbiA9IChhY3Rpb25JZCwgYXR0cnMpID0+IHtcblx0XHRpZiAoaXNGYWtlSWQoYWN0aW9uSWQpID09PSB0cnVlKSB7XG5cdFx0XHRyZXR1cm4gY29uc29sZS53YXJuKCdBY2tlZSBpZ25vcmVzIHlvdSBiZWNhdXNlIHRoaXMgaXMgeW91ciBvd24gc2l0ZScpXG5cdFx0fVxuXG5cdFx0c2VuZCh1cmwsIHVwZGF0ZUFjdGlvbkJvZHkoYWN0aW9uSWQsIGF0dHJzKSwgb3B0aW9ucylcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmVjb3JkOiBfcmVjb3JkLFxuXHRcdHVwZGF0ZVJlY29yZDogX3VwZGF0ZVJlY29yZCxcblx0XHRhY3Rpb246IF9hY3Rpb24sXG5cdFx0dXBkYXRlQWN0aW9uOiBfdXBkYXRlQWN0aW9uLFxuXHR9XG59XG5cbmlmIChpc0Jyb3dzZXIgPT09IHRydWUpIHtcblx0d2luZG93LmFja2VlVHJhY2tlciA9IHtcblx0XHRhdHRyaWJ1dGVzLFxuXHRcdGRldGVjdCxcblx0XHRjcmVhdGUsXG5cdH1cblxuXHRkZXRlY3QoKVxufSJdLCJuYW1lcyI6WyJnbG9iYWwiLCJ0aGlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FNQyxDQUFDLFdBQVc7QUFFYjtDQUNBO0NBQ0EsRUFBRSxJQUFJLFdBQVcsR0FBRztDQUNwQixJQUFJLFVBQVUsRUFBRSxJQUFJO0NBQ3BCLElBQUksUUFBUSxFQUFFLElBQUk7Q0FDbEIsR0FBRyxDQUFDO0FBQ0o7Q0FDQTtDQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDO0FBSTVEO0NBQ0E7Q0FDQSxFQUFFLElBQUksV0FBVyxHQUFrQyxPQUFPLENBQUM7QUFDM0Q7Q0FDQTtDQUNBLEVBQUUsSUFBSSxVQUFVLEdBQWlDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO0FBQ3RGO0NBQ0E7Q0FDQSxFQUFFLElBQUksVUFBVSxHQUFHLFdBQVcsSUFBSSxVQUFVLElBQUksT0FBT0EsY0FBTSxJQUFJLFFBQVEsSUFBSUEsY0FBTSxDQUFDO0NBQ3BGLEVBQUUsSUFBSSxVQUFVLEtBQUssVUFBVSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsRUFBRTtDQUM5SCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUM7Q0FDdEIsR0FBRztB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SUFBSSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0NBQ3JELEdBQUc7QUFDSDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0EsRUFBRSxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Q0FDM0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQ3pELEdBQUc7QUFDSDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQSxFQUFFLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Q0FDbkMsSUFBSSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7Q0FDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsS0FBSyxFQUFFLEtBQUssRUFBRTtDQUN2QyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7Q0FDL0QsS0FBSyxDQUFDLENBQUM7Q0FDUCxJQUFJLE9BQU8sV0FBVyxDQUFDO0NBQ3ZCLEdBQUc7QUFDSDtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0EsRUFBRSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUU7Q0FDeEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ2xELEdBQUc7QUFDSDtDQUNBO0FBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0E7Q0FDQTtDQUNBO0NBQ0EsRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUFFLEVBQUU7QUFDckI7Q0FDQTtDQUNBLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCO0NBQ0E7Q0FDQSxJQUFJLElBQUksZUFBZSxHQUFHLEVBQUUsSUFB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QUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0NBQ3pRLE9BQU8sTUFBTTtDQUNiLFFBQVEsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztDQUM5QyxRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxHQUFH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
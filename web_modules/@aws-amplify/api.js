import { e as AmplifyError, p as parseJsonError, r as ConsoleLogger, b as AmplifyUrl, F as AmplifyUrlSearchParams, G as authenticatedHandler, u as unauthenticatedHandler, g as getRetryDecider, j as jitteredBackoff, A as Amplify, R as Reachability, O as Observable, I as map, J as filter, K as amplifyUuid, U as USER_AGENT_HEADER$1, a as getAmplifyUserAgent, L as isNonRetryableError, M as base64Encoder, N as jitteredExponentialRetry, P as NonRetryableError, Q as fetchAuthSession, S as signRequest, H as Hub, o as AMPLIFY_SYMBOL, T as catchError, C as Category, V as ApiAction } from '../common/index-4e1d64bf.js';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Return true if `value` is object-like. A value is object-like if it's not
 * `null` and has a `typeof` result of "object".
 */
function isObjectLike(value) {
  return _typeof(value) == 'object' && value !== null;
}

// In ES2015 (or a polyfilled) environment, this will be Symbol.iterator

var SYMBOL_TO_STRING_TAG = typeof Symbol === 'function' && Symbol.toStringTag != null ? Symbol.toStringTag : '@@toStringTag';

/**
 * Represents a location in a Source.
 */

/**
 * Takes a Source and a UTF-8 character offset, and returns the corresponding
 * line and column as a SourceLocation.
 */
function getLocation(source, position) {
  var lineRegexp = /\r\n|[\n\r]/g;
  var line = 1;
  var column = position + 1;
  var match;

  while ((match = lineRegexp.exec(source.body)) && match.index < position) {
    line += 1;
    column = position + 1 - (match.index + match[0].length);
  }

  return {
    line: line,
    column: column
  };
}

/**
 * Render a helpful description of the location in the GraphQL Source document.
 */

function printLocation(location) {
  return printSourceLocation(location.source, getLocation(location.source, location.start));
}
/**
 * Render a helpful description of the location in the GraphQL Source document.
 */

function printSourceLocation(source, sourceLocation) {
  var firstLineColumnOffset = source.locationOffset.column - 1;
  var body = whitespace(firstLineColumnOffset) + source.body;
  var lineIndex = sourceLocation.line - 1;
  var lineOffset = source.locationOffset.line - 1;
  var lineNum = sourceLocation.line + lineOffset;
  var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
  var columnNum = sourceLocation.column + columnOffset;
  var locationStr = "".concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
  var lines = body.split(/\r\n|[\n\r]/g);
  var locationLine = lines[lineIndex]; // Special case for minified documents

  if (locationLine.length > 120) {
    var subLineIndex = Math.floor(columnNum / 80);
    var subLineColumnNum = columnNum % 80;
    var subLines = [];

    for (var i = 0; i < locationLine.length; i += 80) {
      subLines.push(locationLine.slice(i, i + 80));
    }

    return locationStr + printPrefixedLines([["".concat(lineNum), subLines[0]]].concat(subLines.slice(1, subLineIndex + 1).map(function (subLine) {
      return ['', subLine];
    }), [[' ', whitespace(subLineColumnNum - 1) + '^'], ['', subLines[subLineIndex + 1]]]));
  }

  return locationStr + printPrefixedLines([// Lines specified like this: ["prefix", "string"],
  ["".concat(lineNum - 1), lines[lineIndex - 1]], ["".concat(lineNum), locationLine], ['', whitespace(columnNum - 1) + '^'], ["".concat(lineNum + 1), lines[lineIndex + 1]]]);
}

function printPrefixedLines(lines) {
  var existingLines = lines.filter(function (_ref) {
    var _ = _ref[0],
        line = _ref[1];
    return line !== undefined;
  });
  var padLen = Math.max.apply(Math, existingLines.map(function (_ref2) {
    var prefix = _ref2[0];
    return prefix.length;
  }));
  return existingLines.map(function (_ref3) {
    var prefix = _ref3[0],
        line = _ref3[1];
    return leftPad(padLen, prefix) + (line ? ' | ' + line : ' |');
  }).join('\n');
}

function whitespace(len) {
  return Array(len + 1).join(' ');
}

function leftPad(len, str) {
  return whitespace(len - str.length) + str;
}

function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/**
 * A GraphQLError describes an Error found during the parse, validate, or
 * execute phases of performing a GraphQL operation. In addition to a message
 * and stack trace, it also includes information about the locations in a
 * GraphQL document and/or execution result that correspond to the Error.
 */

var GraphQLError = /*#__PURE__*/function (_Error) {
  _inherits(GraphQLError, _Error);

  var _super = _createSuper(GraphQLError);

  /**
   * An array of { line, column } locations within the source GraphQL document
   * which correspond to this error.
   *
   * Errors during validation often contain multiple locations, for example to
   * point out two things with the same name. Errors during execution include a
   * single location, the field which produced the error.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array describing the JSON-path into the execution response which
   * corresponds to this error. Only included for errors during execution.
   *
   * Enumerable, and appears in the result of JSON.stringify().
   */

  /**
   * An array of GraphQL AST Nodes corresponding to this error.
   */

  /**
   * The source GraphQL document for the first location of this error.
   *
   * Note that if this Error represents more than one node, the source may not
   * represent nodes after the first node.
   */

  /**
   * An array of character offsets within the source GraphQL document
   * which correspond to this error.
   */

  /**
   * The original error thrown from a field resolver during execution.
   */

  /**
   * Extension fields to add to the formatted error.
   */
  function GraphQLError(message, nodes, source, positions, path, originalError, extensions) {
    var _nodeLocations, _nodeLocations2, _nodeLocations3;

    var _this;

    _classCallCheck(this, GraphQLError);

    _this = _super.call(this, message);
    _this.name = 'GraphQLError';
    _this.originalError = originalError !== null && originalError !== void 0 ? originalError : undefined; // Compute list of blame nodes.

    _this.nodes = undefinedIfEmpty(Array.isArray(nodes) ? nodes : nodes ? [nodes] : undefined);
    var nodeLocations = [];

    for (var _i2 = 0, _ref3 = (_this$nodes = _this.nodes) !== null && _this$nodes !== void 0 ? _this$nodes : []; _i2 < _ref3.length; _i2++) {
      var _this$nodes;

      var _ref4 = _ref3[_i2];
      var loc = _ref4.loc;

      if (loc != null) {
        nodeLocations.push(loc);
      }
    }

    nodeLocations = undefinedIfEmpty(nodeLocations); // Compute locations in the source for the given nodes/positions.

    _this.source = source !== null && source !== void 0 ? source : (_nodeLocations = nodeLocations) === null || _nodeLocations === void 0 ? void 0 : _nodeLocations[0].source;
    _this.positions = positions !== null && positions !== void 0 ? positions : (_nodeLocations2 = nodeLocations) === null || _nodeLocations2 === void 0 ? void 0 : _nodeLocations2.map(function (loc) {
      return loc.start;
    });
    _this.locations = positions && source ? positions.map(function (pos) {
      return getLocation(source, pos);
    }) : (_nodeLocations3 = nodeLocations) === null || _nodeLocations3 === void 0 ? void 0 : _nodeLocations3.map(function (loc) {
      return getLocation(loc.source, loc.start);
    });
    _this.path = path !== null && path !== void 0 ? path : undefined;
    var originalExtensions = originalError === null || originalError === void 0 ? void 0 : originalError.extensions;

    if (extensions == null && isObjectLike(originalExtensions)) {
      _this.extensions = _objectSpread({}, originalExtensions);
    } else {
      _this.extensions = extensions !== null && extensions !== void 0 ? extensions : {};
    } // By being enumerable, JSON.stringify will include bellow properties in the resulting output.
    // This ensures that the simplest possible GraphQL service adheres to the spec.


    Object.defineProperties(_assertThisInitialized(_this), {
      message: {
        enumerable: true
      },
      locations: {
        enumerable: _this.locations != null
      },
      path: {
        enumerable: _this.path != null
      },
      extensions: {
        enumerable: _this.extensions != null && Object.keys(_this.extensions).length > 0
      },
      name: {
        enumerable: false
      },
      nodes: {
        enumerable: false
      },
      source: {
        enumerable: false
      },
      positions: {
        enumerable: false
      },
      originalError: {
        enumerable: false
      }
    }); // Include (non-enumerable) stack trace.

    if (originalError !== null && originalError !== void 0 && originalError.stack) {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: originalError.stack,
        writable: true,
        configurable: true
      });
      return _possibleConstructorReturn(_this);
    } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')


    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), GraphQLError);
    } else {
      Object.defineProperty(_assertThisInitialized(_this), 'stack', {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }

    return _this;
  }

  _createClass(GraphQLError, [{
    key: "toString",
    value: function toString() {
      return printError(this);
    } // FIXME: workaround to not break chai comparisons, should be remove in v16
    // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

  }, {
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Object';
    }
  }]);

  return GraphQLError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function undefinedIfEmpty(array) {
  return array === undefined || array.length === 0 ? undefined : array;
}
/**
 * Prints a GraphQLError to a string, representing useful location information
 * about the error's position in the source.
 */


function printError(error) {
  var output = error.message;

  if (error.nodes) {
    for (var _i4 = 0, _error$nodes2 = error.nodes; _i4 < _error$nodes2.length; _i4++) {
      var node = _error$nodes2[_i4];

      if (node.loc) {
        output += '\n\n' + printLocation(node.loc);
      }
    }
  } else if (error.source && error.locations) {
    for (var _i6 = 0, _error$locations2 = error.locations; _i6 < _error$locations2.length; _i6++) {
      var location = _error$locations2[_i6];
      output += '\n\n' + printSourceLocation(error.source, location);
    }
  }

  return output;
}

/**
 * Produces a GraphQLError representing a syntax error, containing useful
 * descriptive information about the syntax error's position in the source.
 */

function syntaxError(source, position, description) {
  return new GraphQLError("Syntax Error: ".concat(description), undefined, source, [position]);
}

/**
 * The set of allowed kind values for AST nodes.
 */
var Kind = Object.freeze({
  // Name
  NAME: 'Name',
  // Document
  DOCUMENT: 'Document',
  OPERATION_DEFINITION: 'OperationDefinition',
  VARIABLE_DEFINITION: 'VariableDefinition',
  SELECTION_SET: 'SelectionSet',
  FIELD: 'Field',
  ARGUMENT: 'Argument',
  // Fragments
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  FRAGMENT_DEFINITION: 'FragmentDefinition',
  // Values
  VARIABLE: 'Variable',
  INT: 'IntValue',
  FLOAT: 'FloatValue',
  STRING: 'StringValue',
  BOOLEAN: 'BooleanValue',
  NULL: 'NullValue',
  ENUM: 'EnumValue',
  LIST: 'ListValue',
  OBJECT: 'ObjectValue',
  OBJECT_FIELD: 'ObjectField',
  // Directives
  DIRECTIVE: 'Directive',
  // Types
  NAMED_TYPE: 'NamedType',
  LIST_TYPE: 'ListType',
  NON_NULL_TYPE: 'NonNullType',
  // Type System Definitions
  SCHEMA_DEFINITION: 'SchemaDefinition',
  OPERATION_TYPE_DEFINITION: 'OperationTypeDefinition',
  // Type Definitions
  SCALAR_TYPE_DEFINITION: 'ScalarTypeDefinition',
  OBJECT_TYPE_DEFINITION: 'ObjectTypeDefinition',
  FIELD_DEFINITION: 'FieldDefinition',
  INPUT_VALUE_DEFINITION: 'InputValueDefinition',
  INTERFACE_TYPE_DEFINITION: 'InterfaceTypeDefinition',
  UNION_TYPE_DEFINITION: 'UnionTypeDefinition',
  ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
  ENUM_VALUE_DEFINITION: 'EnumValueDefinition',
  INPUT_OBJECT_TYPE_DEFINITION: 'InputObjectTypeDefinition',
  // Directive Definitions
  DIRECTIVE_DEFINITION: 'DirectiveDefinition',
  // Type System Extensions
  SCHEMA_EXTENSION: 'SchemaExtension',
  // Type Extensions
  SCALAR_TYPE_EXTENSION: 'ScalarTypeExtension',
  OBJECT_TYPE_EXTENSION: 'ObjectTypeExtension',
  INTERFACE_TYPE_EXTENSION: 'InterfaceTypeExtension',
  UNION_TYPE_EXTENSION: 'UnionTypeExtension',
  ENUM_TYPE_EXTENSION: 'EnumTypeExtension',
  INPUT_OBJECT_TYPE_EXTENSION: 'InputObjectTypeExtension'
});
/**
 * The enum type representing the possible kind values of AST nodes.
 */

function invariant(condition, message) {
  var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(message != null ? message : 'Unexpected invariant triggered.');
  }
}

// istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
var nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;

/**
 * The `defineInspect()` function defines `inspect()` prototype method as alias of `toJSON`
 */

function defineInspect(classObject) {
  var fn = classObject.prototype.toJSON;
  typeof fn === 'function' || invariant(0);
  classObject.prototype.inspect = fn; // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2317')

  if (nodejsCustomInspectSymbol) {
    classObject.prototype[nodejsCustomInspectSymbol] = fn;
  }
}

/**
 * Contains a range of UTF-8 character offsets and token references that
 * identify the region of the source from which the AST derived.
 */
var Location = /*#__PURE__*/function () {
  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The Token at which this Node begins.
   */

  /**
   * The Token at which this Node ends.
   */

  /**
   * The Source document the AST represents.
   */
  function Location(startToken, endToken, source) {
    this.start = startToken.start;
    this.end = endToken.end;
    this.startToken = startToken;
    this.endToken = endToken;
    this.source = source;
  }

  var _proto = Location.prototype;

  _proto.toJSON = function toJSON() {
    return {
      start: this.start,
      end: this.end
    };
  };

  return Location;
}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

defineInspect(Location);
/**
 * Represents a range of characters represented by a lexical token
 * within a Source.
 */

var Token = /*#__PURE__*/function () {
  /**
   * The kind of Token.
   */

  /**
   * The character offset at which this Node begins.
   */

  /**
   * The character offset at which this Node ends.
   */

  /**
   * The 1-indexed line number on which this Token appears.
   */

  /**
   * The 1-indexed column number at which this Token begins.
   */

  /**
   * For non-punctuation tokens, represents the interpreted value of the token.
   */

  /**
   * Tokens exist as nodes in a double-linked-list amongst all tokens
   * including ignored tokens. <SOF> is always the first node and <EOF>
   * the last.
   */
  function Token(kind, start, end, line, column, prev, value) {
    this.kind = kind;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
    this.value = value;
    this.prev = prev;
    this.next = null;
  }

  var _proto2 = Token.prototype;

  _proto2.toJSON = function toJSON() {
    return {
      kind: this.kind,
      value: this.value,
      line: this.line,
      column: this.column
    };
  };

  return Token;
}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

defineInspect(Token);
/**
 * @internal
 */

function isNode(maybeNode) {
  return maybeNode != null && typeof maybeNode.kind === 'string';
}
/**
 * The list of all possible AST node types.
 */

/**
 * An exported enum describing the different kinds of tokens that the
 * lexer emits.
 */
var TokenKind = Object.freeze({
  SOF: '<SOF>',
  EOF: '<EOF>',
  BANG: '!',
  DOLLAR: '$',
  AMP: '&',
  PAREN_L: '(',
  PAREN_R: ')',
  SPREAD: '...',
  COLON: ':',
  EQUALS: '=',
  AT: '@',
  BRACKET_L: '[',
  BRACKET_R: ']',
  BRACE_L: '{',
  PIPE: '|',
  BRACE_R: '}',
  NAME: 'Name',
  INT: 'Int',
  FLOAT: 'Float',
  STRING: 'String',
  BLOCK_STRING: 'BlockString',
  COMMENT: 'Comment'
});
/**
 * The enum type representing the token kinds values.
 */

function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
var MAX_ARRAY_LENGTH = 10;
var MAX_RECURSIVE_DEPTH = 2;
/**
 * Used to print values in error messages.
 */

function inspect(value) {
  return formatValue(value, []);
}

function formatValue(value, seenValues) {
  switch (_typeof$2(value)) {
    case 'string':
      return JSON.stringify(value);

    case 'function':
      return value.name ? "[function ".concat(value.name, "]") : '[function]';

    case 'object':
      if (value === null) {
        return 'null';
      }

      return formatObjectValue(value, seenValues);

    default:
      return String(value);
  }
}

function formatObjectValue(value, previouslySeenValues) {
  if (previouslySeenValues.indexOf(value) !== -1) {
    return '[Circular]';
  }

  var seenValues = [].concat(previouslySeenValues, [value]);
  var customInspectFn = getCustomFn(value);

  if (customInspectFn !== undefined) {
    var customValue = customInspectFn.call(value); // check for infinite recursion

    if (customValue !== value) {
      return typeof customValue === 'string' ? customValue : formatValue(customValue, seenValues);
    }
  } else if (Array.isArray(value)) {
    return formatArray(value, seenValues);
  }

  return formatObject(value, seenValues);
}

function formatObject(object, seenValues) {
  var keys = Object.keys(object);

  if (keys.length === 0) {
    return '{}';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[' + getObjectTag(object) + ']';
  }

  var properties = keys.map(function (key) {
    var value = formatValue(object[key], seenValues);
    return key + ': ' + value;
  });
  return '{ ' + properties.join(', ') + ' }';
}

function formatArray(array, seenValues) {
  if (array.length === 0) {
    return '[]';
  }

  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
    return '[Array]';
  }

  var len = Math.min(MAX_ARRAY_LENGTH, array.length);
  var remaining = array.length - len;
  var items = [];

  for (var i = 0; i < len; ++i) {
    items.push(formatValue(array[i], seenValues));
  }

  if (remaining === 1) {
    items.push('... 1 more item');
  } else if (remaining > 1) {
    items.push("... ".concat(remaining, " more items"));
  }

  return '[' + items.join(', ') + ']';
}

function getCustomFn(object) {
  var customInspectFn = object[String(nodejsCustomInspectSymbol)];

  if (typeof customInspectFn === 'function') {
    return customInspectFn;
  }

  if (typeof object.inspect === 'function') {
    return object.inspect;
  }
}

function getObjectTag(object) {
  var tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');

  if (tag === 'Object' && typeof object.constructor === 'function') {
    var name = object.constructor.name;

    if (typeof name === 'string' && name !== '') {
      return name;
    }
  }

  return tag;
}

function devAssert(condition, message) {
  var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

  if (!booleanCondition) {
    throw new Error(message);
  }
}

function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }
/**
 * A replacement for instanceof which includes an error warning when multi-realm
 * constructors are detected.
 */

// See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
// See: https://webpack.js.org/guides/production/
var instanceOf =  // eslint-disable-next-line no-shadow
function instanceOf(value, constructor) {
  if (value instanceof constructor) {
    return true;
  }

  if (_typeof$3(value) === 'object' && value !== null) {
    var _value$constructor;

    var className = constructor.prototype[Symbol.toStringTag];
    var valueClassName = // We still need to support constructor's name to detect conflicts with older versions of this library.
    Symbol.toStringTag in value ? value[Symbol.toStringTag] : (_value$constructor = value.constructor) === null || _value$constructor === void 0 ? void 0 : _value$constructor.name;

    if (className === valueClassName) {
      var stringifiedValue = inspect(value);
      throw new Error("Cannot use ".concat(className, " \"").concat(stringifiedValue, "\" from another module or realm.\n\nEnsure that there is only one instance of \"graphql\" in the node_modules\ndirectory. If different versions of \"graphql\" are the dependencies of other\nrelied on modules, use \"resolutions\" to ensure only one version is installed.\n\nhttps://yarnpkg.com/en/docs/selective-version-resolutions\n\nDuplicate \"graphql\" modules cannot be used at the same time since different\nversions may have different capabilities and behavior. The data from one\nversion used in the function from another could produce confusing and\nspurious results."));
    }
  }

  return false;
};

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

/**
 * A representation of source input to GraphQL. The `name` and `locationOffset` parameters are
 * optional, but they are useful for clients who store GraphQL documents in source files.
 * For example, if the GraphQL input starts at line 40 in a file named `Foo.graphql`, it might
 * be useful for `name` to be `"Foo.graphql"` and location to be `{ line: 40, column: 1 }`.
 * The `line` and `column` properties in `locationOffset` are 1-indexed.
 */
var Source = /*#__PURE__*/function () {
  function Source(body) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GraphQL request';
    var locationOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      line: 1,
      column: 1
    };
    typeof body === 'string' || devAssert(0, "Body must be a string. Received: ".concat(inspect(body), "."));
    this.body = body;
    this.name = name;
    this.locationOffset = locationOffset;
    this.locationOffset.line > 0 || devAssert(0, 'line in locationOffset is 1-indexed and must be positive.');
    this.locationOffset.column > 0 || devAssert(0, 'column in locationOffset is 1-indexed and must be positive.');
  } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet


  _createClass$1(Source, [{
    key: SYMBOL_TO_STRING_TAG,
    get: function get() {
      return 'Source';
    }
  }]);

  return Source;
}();
/**
 * Test if the given value is a Source object.
 *
 * @internal
 */

// eslint-disable-next-line no-redeclare
function isSource(source) {
  return instanceOf(source, Source);
}

/**
 * The set of allowed directive location values.
 */
var DirectiveLocation = Object.freeze({
  // Request Definitions
  QUERY: 'QUERY',
  MUTATION: 'MUTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  FIELD: 'FIELD',
  FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
  FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
  INLINE_FRAGMENT: 'INLINE_FRAGMENT',
  VARIABLE_DEFINITION: 'VARIABLE_DEFINITION',
  // Type System Definitions
  SCHEMA: 'SCHEMA',
  SCALAR: 'SCALAR',
  OBJECT: 'OBJECT',
  FIELD_DEFINITION: 'FIELD_DEFINITION',
  ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
  INTERFACE: 'INTERFACE',
  UNION: 'UNION',
  ENUM: 'ENUM',
  ENUM_VALUE: 'ENUM_VALUE',
  INPUT_OBJECT: 'INPUT_OBJECT',
  INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
});
/**
 * The enum type representing the directive location values.
 */

/**
 * Produces the value of a block string from its parsed raw value, similar to
 * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
 *
 * This implements the GraphQL spec's BlockStringValue() static algorithm.
 *
 * @internal
 */
function dedentBlockStringValue(rawString) {
  // Expand a block string's raw value into independent lines.
  var lines = rawString.split(/\r\n|[\n\r]/g); // Remove common indentation from all lines but first.

  var commonIndent = getBlockStringIndentation(rawString);

  if (commonIndent !== 0) {
    for (var i = 1; i < lines.length; i++) {
      lines[i] = lines[i].slice(commonIndent);
    }
  } // Remove leading and trailing blank lines.


  var startLine = 0;

  while (startLine < lines.length && isBlank(lines[startLine])) {
    ++startLine;
  }

  var endLine = lines.length;

  while (endLine > startLine && isBlank(lines[endLine - 1])) {
    --endLine;
  } // Return a string of the lines joined with U+000A.


  return lines.slice(startLine, endLine).join('\n');
}

function isBlank(str) {
  for (var i = 0; i < str.length; ++i) {
    if (str[i] !== ' ' && str[i] !== '\t') {
      return false;
    }
  }

  return true;
}
/**
 * @internal
 */


function getBlockStringIndentation(value) {
  var _commonIndent;

  var isFirstLine = true;
  var isEmptyLine = true;
  var indent = 0;
  var commonIndent = null;

  for (var i = 0; i < value.length; ++i) {
    switch (value.charCodeAt(i)) {
      case 13:
        //  \r
        if (value.charCodeAt(i + 1) === 10) {
          ++i; // skip \r\n as one symbol
        }

      // falls through

      case 10:
        //  \n
        isFirstLine = false;
        isEmptyLine = true;
        indent = 0;
        break;

      case 9: //   \t

      case 32:
        //  <space>
        ++indent;
        break;

      default:
        if (isEmptyLine && !isFirstLine && (commonIndent === null || indent < commonIndent)) {
          commonIndent = indent;
        }

        isEmptyLine = false;
    }
  }

  return (_commonIndent = commonIndent) !== null && _commonIndent !== void 0 ? _commonIndent : 0;
}
/**
 * Print a block string in the indented block form by adding a leading and
 * trailing blank line. However, if a block string starts with whitespace and is
 * a single-line, adding a leading blank line would strip that whitespace.
 *
 * @internal
 */

function printBlockString(value) {
  var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var preferMultipleLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var isSingleLine = value.indexOf('\n') === -1;
  var hasLeadingSpace = value[0] === ' ' || value[0] === '\t';
  var hasTrailingQuote = value[value.length - 1] === '"';
  var hasTrailingSlash = value[value.length - 1] === '\\';
  var printAsMultipleLines = !isSingleLine || hasTrailingQuote || hasTrailingSlash || preferMultipleLines;
  var result = ''; // Format a multi-line block quote to account for leading space.

  if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
    result += '\n' + indentation;
  }

  result += indentation ? value.replace(/\n/g, '\n' + indentation) : value;

  if (printAsMultipleLines) {
    result += '\n';
  }

  return '"""' + result.replace(/"""/g, '\\"""') + '"""';
}

/**
 * Given a Source object, creates a Lexer for that source.
 * A Lexer is a stateful stream generator in that every time
 * it is advanced, it returns the next token in the Source. Assuming the
 * source lexes, the final Token emitted by the lexer will be of kind
 * EOF, after which the lexer will repeatedly return the same EOF token
 * whenever called.
 */

var Lexer = /*#__PURE__*/function () {
  /**
   * The previously focused non-ignored token.
   */

  /**
   * The currently focused non-ignored token.
   */

  /**
   * The (1-indexed) line containing the current token.
   */

  /**
   * The character offset at which the current line begins.
   */
  function Lexer(source) {
    var startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0, null);
    this.source = source;
    this.lastToken = startOfFileToken;
    this.token = startOfFileToken;
    this.line = 1;
    this.lineStart = 0;
  }
  /**
   * Advances the token stream to the next non-ignored token.
   */


  var _proto = Lexer.prototype;

  _proto.advance = function advance() {
    this.lastToken = this.token;
    var token = this.token = this.lookahead();
    return token;
  }
  /**
   * Looks ahead and returns the next non-ignored token, but does not change
   * the state of Lexer.
   */
  ;

  _proto.lookahead = function lookahead() {
    var token = this.token;

    if (token.kind !== TokenKind.EOF) {
      do {
        var _token$next;

        // Note: next is only mutable during parsing, so we cast to allow this.
        token = (_token$next = token.next) !== null && _token$next !== void 0 ? _token$next : token.next = readToken(this, token);
      } while (token.kind === TokenKind.COMMENT);
    }

    return token;
  };

  return Lexer;
}();
/**
 * @internal
 */

function isPunctuatorTokenKind(kind) {
  return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
}

function printCharCode(code) {
  return (// NaN/undefined represents access beyond the end of the file.
    isNaN(code) ? TokenKind.EOF : // Trust JSON for ASCII.
    code < 0x007f ? JSON.stringify(String.fromCharCode(code)) : // Otherwise print the escaped form.
    "\"\\u".concat(('00' + code.toString(16).toUpperCase()).slice(-4), "\"")
  );
}
/**
 * Gets the next token from the source starting at the given position.
 *
 * This skips over whitespace until it finds the next lexable token, then lexes
 * punctuators immediately or calls the appropriate helper function for more
 * complicated tokens.
 */


function readToken(lexer, prev) {
  var source = lexer.source;
  var body = source.body;
  var bodyLength = body.length;
  var pos = prev.end;

  while (pos < bodyLength) {
    var code = body.charCodeAt(pos);
    var _line = lexer.line;

    var _col = 1 + pos - lexer.lineStart; // SourceCharacter


    switch (code) {
      case 0xfeff: // <BOM>

      case 9: //   \t

      case 32: //  <space>

      case 44:
        //  ,
        ++pos;
        continue;

      case 10:
        //  \n
        ++pos;
        ++lexer.line;
        lexer.lineStart = pos;
        continue;

      case 13:
        //  \r
        if (body.charCodeAt(pos + 1) === 10) {
          pos += 2;
        } else {
          ++pos;
        }

        ++lexer.line;
        lexer.lineStart = pos;
        continue;

      case 33:
        //  !
        return new Token(TokenKind.BANG, pos, pos + 1, _line, _col, prev);

      case 35:
        //  #
        return readComment(source, pos, _line, _col, prev);

      case 36:
        //  $
        return new Token(TokenKind.DOLLAR, pos, pos + 1, _line, _col, prev);

      case 38:
        //  &
        return new Token(TokenKind.AMP, pos, pos + 1, _line, _col, prev);

      case 40:
        //  (
        return new Token(TokenKind.PAREN_L, pos, pos + 1, _line, _col, prev);

      case 41:
        //  )
        return new Token(TokenKind.PAREN_R, pos, pos + 1, _line, _col, prev);

      case 46:
        //  .
        if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
          return new Token(TokenKind.SPREAD, pos, pos + 3, _line, _col, prev);
        }

        break;

      case 58:
        //  :
        return new Token(TokenKind.COLON, pos, pos + 1, _line, _col, prev);

      case 61:
        //  =
        return new Token(TokenKind.EQUALS, pos, pos + 1, _line, _col, prev);

      case 64:
        //  @
        return new Token(TokenKind.AT, pos, pos + 1, _line, _col, prev);

      case 91:
        //  [
        return new Token(TokenKind.BRACKET_L, pos, pos + 1, _line, _col, prev);

      case 93:
        //  ]
        return new Token(TokenKind.BRACKET_R, pos, pos + 1, _line, _col, prev);

      case 123:
        // {
        return new Token(TokenKind.BRACE_L, pos, pos + 1, _line, _col, prev);

      case 124:
        // |
        return new Token(TokenKind.PIPE, pos, pos + 1, _line, _col, prev);

      case 125:
        // }
        return new Token(TokenKind.BRACE_R, pos, pos + 1, _line, _col, prev);

      case 34:
        //  "
        if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
          return readBlockString(source, pos, _line, _col, prev, lexer);
        }

        return readString(source, pos, _line, _col, prev);

      case 45: //  -

      case 48: //  0

      case 49: //  1

      case 50: //  2

      case 51: //  3

      case 52: //  4

      case 53: //  5

      case 54: //  6

      case 55: //  7

      case 56: //  8

      case 57:
        //  9
        return readNumber(source, pos, code, _line, _col, prev);

      case 65: //  A

      case 66: //  B

      case 67: //  C

      case 68: //  D

      case 69: //  E

      case 70: //  F

      case 71: //  G

      case 72: //  H

      case 73: //  I

      case 74: //  J

      case 75: //  K

      case 76: //  L

      case 77: //  M

      case 78: //  N

      case 79: //  O

      case 80: //  P

      case 81: //  Q

      case 82: //  R

      case 83: //  S

      case 84: //  T

      case 85: //  U

      case 86: //  V

      case 87: //  W

      case 88: //  X

      case 89: //  Y

      case 90: //  Z

      case 95: //  _

      case 97: //  a

      case 98: //  b

      case 99: //  c

      case 100: // d

      case 101: // e

      case 102: // f

      case 103: // g

      case 104: // h

      case 105: // i

      case 106: // j

      case 107: // k

      case 108: // l

      case 109: // m

      case 110: // n

      case 111: // o

      case 112: // p

      case 113: // q

      case 114: // r

      case 115: // s

      case 116: // t

      case 117: // u

      case 118: // v

      case 119: // w

      case 120: // x

      case 121: // y

      case 122:
        // z
        return readName(source, pos, _line, _col, prev);
    }

    throw syntaxError(source, pos, unexpectedCharacterMessage(code));
  }

  var line = lexer.line;
  var col = 1 + pos - lexer.lineStart;
  return new Token(TokenKind.EOF, bodyLength, bodyLength, line, col, prev);
}
/**
 * Report a message that an unexpected character was encountered.
 */


function unexpectedCharacterMessage(code) {
  if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
    return "Cannot contain the invalid character ".concat(printCharCode(code), ".");
  }

  if (code === 39) {
    // '
    return 'Unexpected single quote character (\'), did you mean to use a double quote (")?';
  }

  return "Cannot parse the unexpected character ".concat(printCharCode(code), ".");
}
/**
 * Reads a comment token from the source file.
 *
 * #[\u0009\u0020-\uFFFF]*
 */


function readComment(source, start, line, col, prev) {
  var body = source.body;
  var code;
  var position = start;

  do {
    code = body.charCodeAt(++position);
  } while (!isNaN(code) && ( // SourceCharacter but not LineTerminator
  code > 0x001f || code === 0x0009));

  return new Token(TokenKind.COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
}
/**
 * Reads a number token from the source file, either a float
 * or an int depending on whether a decimal point appears.
 *
 * Int:   -?(0|[1-9][0-9]*)
 * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
 */


function readNumber(source, start, firstCode, line, col, prev) {
  var body = source.body;
  var code = firstCode;
  var position = start;
  var isFloat = false;

  if (code === 45) {
    // -
    code = body.charCodeAt(++position);
  }

  if (code === 48) {
    // 0
    code = body.charCodeAt(++position);

    if (code >= 48 && code <= 57) {
      throw syntaxError(source, position, "Invalid number, unexpected digit after 0: ".concat(printCharCode(code), "."));
    }
  } else {
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 46) {
    // .
    isFloat = true;
    code = body.charCodeAt(++position);
    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  }

  if (code === 69 || code === 101) {
    // E e
    isFloat = true;
    code = body.charCodeAt(++position);

    if (code === 43 || code === 45) {
      // + -
      code = body.charCodeAt(++position);
    }

    position = readDigits(source, position, code);
    code = body.charCodeAt(position);
  } // Numbers cannot be followed by . or NameStart


  if (code === 46 || isNameStart(code)) {
    throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
  }

  return new Token(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, line, col, prev, body.slice(start, position));
}
/**
 * Returns the new position in the source after reading digits.
 */


function readDigits(source, start, firstCode) {
  var body = source.body;
  var position = start;
  var code = firstCode;

  if (code >= 48 && code <= 57) {
    // 0 - 9
    do {
      code = body.charCodeAt(++position);
    } while (code >= 48 && code <= 57); // 0 - 9


    return position;
  }

  throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
}
/**
 * Reads a string token from the source file.
 *
 * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
 */


function readString(source, start, line, col, prev) {
  var body = source.body;
  var position = start + 1;
  var chunkStart = position;
  var code = 0;
  var value = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position)) && // not LineTerminator
  code !== 0x000a && code !== 0x000d) {
    // Closing Quote (")
    if (code === 34) {
      value += body.slice(chunkStart, position);
      return new Token(TokenKind.STRING, start, position + 1, line, col, prev, value);
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    ++position;

    if (code === 92) {
      // \
      value += body.slice(chunkStart, position - 1);
      code = body.charCodeAt(position);

      switch (code) {
        case 34:
          value += '"';
          break;

        case 47:
          value += '/';
          break;

        case 92:
          value += '\\';
          break;

        case 98:
          value += '\b';
          break;

        case 102:
          value += '\f';
          break;

        case 110:
          value += '\n';
          break;

        case 114:
          value += '\r';
          break;

        case 116:
          value += '\t';
          break;

        case 117:
          {
            // uXXXX
            var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));

            if (charCode < 0) {
              var invalidSequence = body.slice(position + 1, position + 5);
              throw syntaxError(source, position, "Invalid character escape sequence: \\u".concat(invalidSequence, "."));
            }

            value += String.fromCharCode(charCode);
            position += 4;
            break;
          }

        default:
          throw syntaxError(source, position, "Invalid character escape sequence: \\".concat(String.fromCharCode(code), "."));
      }

      ++position;
      chunkStart = position;
    }
  }

  throw syntaxError(source, position, 'Unterminated string.');
}
/**
 * Reads a block string token from the source file.
 *
 * """("?"?(\\"""|\\(?!=""")|[^"\\]))*"""
 */


function readBlockString(source, start, line, col, prev, lexer) {
  var body = source.body;
  var position = start + 3;
  var chunkStart = position;
  var code = 0;
  var rawValue = '';

  while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
    // Closing Triple-Quote (""")
    if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
      rawValue += body.slice(chunkStart, position);
      return new Token(TokenKind.BLOCK_STRING, start, position + 3, line, col, prev, dedentBlockStringValue(rawValue));
    } // SourceCharacter


    if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
      throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
    }

    if (code === 10) {
      // new line
      ++position;
      ++lexer.line;
      lexer.lineStart = position;
    } else if (code === 13) {
      // carriage return
      if (body.charCodeAt(position + 1) === 10) {
        position += 2;
      } else {
        ++position;
      }

      ++lexer.line;
      lexer.lineStart = position;
    } else if ( // Escape Triple-Quote (\""")
    code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
      rawValue += body.slice(chunkStart, position) + '"""';
      position += 4;
      chunkStart = position;
    } else {
      ++position;
    }
  }

  throw syntaxError(source, position, 'Unterminated string.');
}
/**
 * Converts four hexadecimal chars to the integer that the
 * string represents. For example, uniCharCode('0','0','0','f')
 * will return 15, and uniCharCode('0','0','f','f') returns 255.
 *
 * Returns a negative number on error, if a char was invalid.
 *
 * This is implemented by noting that char2hex() returns -1 on error,
 * which means the result of ORing the char2hex() will also be negative.
 */


function uniCharCode(a, b, c, d) {
  return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
}
/**
 * Converts a hex character to its integer value.
 * '0' becomes 0, '9' becomes 9
 * 'A' becomes 10, 'F' becomes 15
 * 'a' becomes 10, 'f' becomes 15
 *
 * Returns -1 on error.
 */


function char2hex(a) {
  return a >= 48 && a <= 57 ? a - 48 // 0-9
  : a >= 65 && a <= 70 ? a - 55 // A-F
  : a >= 97 && a <= 102 ? a - 87 // a-f
  : -1;
}
/**
 * Reads an alphanumeric + underscore name from the source.
 *
 * [_A-Za-z][_0-9A-Za-z]*
 */


function readName(source, start, line, col, prev) {
  var body = source.body;
  var bodyLength = body.length;
  var position = start + 1;
  var code = 0;

  while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || // _
  code >= 48 && code <= 57 || // 0-9
  code >= 65 && code <= 90 || // A-Z
  code >= 97 && code <= 122) // a-z
  ) {
    ++position;
  }

  return new Token(TokenKind.NAME, start, position, line, col, prev, body.slice(start, position));
} // _ A-Z a-z


function isNameStart(code) {
  return code === 95 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
}

/**
 * Configuration options to control parser behavior
 */

/**
 * Given a GraphQL source, parses it into a Document.
 * Throws GraphQLError if a syntax error is encountered.
 */
function parse(source, options) {
  var parser = new Parser(source, options);
  return parser.parseDocument();
}
/**
 * This class is exported only to assist people in implementing their own parsers
 * without duplicating too much code and should be used only as last resort for cases
 * such as experimental syntax or if certain features could not be contributed upstream.
 *
 * It is still part of the internal API and is versioned, so any changes to it are never
 * considered breaking changes. If you still need to support multiple versions of the
 * library, please use the `versionInfo` variable for version detection.
 *
 * @internal
 */

var Parser = /*#__PURE__*/function () {
  function Parser(source, options) {
    var sourceObj = isSource(source) ? source : new Source(source);
    this._lexer = new Lexer(sourceObj);
    this._options = options;
  }
  /**
   * Converts a name lex token into a name parse node.
   */


  var _proto = Parser.prototype;

  _proto.parseName = function parseName() {
    var token = this.expectToken(TokenKind.NAME);
    return {
      kind: Kind.NAME,
      value: token.value,
      loc: this.loc(token)
    };
  } // Implements the parsing rules in the Document section.

  /**
   * Document : Definition+
   */
  ;

  _proto.parseDocument = function parseDocument() {
    var start = this._lexer.token;
    return {
      kind: Kind.DOCUMENT,
      definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF),
      loc: this.loc(start)
    };
  }
  /**
   * Definition :
   *   - ExecutableDefinition
   *   - TypeSystemDefinition
   *   - TypeSystemExtension
   *
   * ExecutableDefinition :
   *   - OperationDefinition
   *   - FragmentDefinition
   */
  ;

  _proto.parseDefinition = function parseDefinition() {
    if (this.peek(TokenKind.NAME)) {
      switch (this._lexer.token.value) {
        case 'query':
        case 'mutation':
        case 'subscription':
          return this.parseOperationDefinition();

        case 'fragment':
          return this.parseFragmentDefinition();

        case 'schema':
        case 'scalar':
        case 'type':
        case 'interface':
        case 'union':
        case 'enum':
        case 'input':
        case 'directive':
          return this.parseTypeSystemDefinition();

        case 'extend':
          return this.parseTypeSystemExtension();
      }
    } else if (this.peek(TokenKind.BRACE_L)) {
      return this.parseOperationDefinition();
    } else if (this.peekDescription()) {
      return this.parseTypeSystemDefinition();
    }

    throw this.unexpected();
  } // Implements the parsing rules in the Operations section.

  /**
   * OperationDefinition :
   *  - SelectionSet
   *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
   */
  ;

  _proto.parseOperationDefinition = function parseOperationDefinition() {
    var start = this._lexer.token;

    if (this.peek(TokenKind.BRACE_L)) {
      return {
        kind: Kind.OPERATION_DEFINITION,
        operation: 'query',
        name: undefined,
        variableDefinitions: [],
        directives: [],
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }

    var operation = this.parseOperationType();
    var name;

    if (this.peek(TokenKind.NAME)) {
      name = this.parseName();
    }

    return {
      kind: Kind.OPERATION_DEFINITION,
      operation: operation,
      name: name,
      variableDefinitions: this.parseVariableDefinitions(),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * OperationType : one of query mutation subscription
   */
  ;

  _proto.parseOperationType = function parseOperationType() {
    var operationToken = this.expectToken(TokenKind.NAME);

    switch (operationToken.value) {
      case 'query':
        return 'query';

      case 'mutation':
        return 'mutation';

      case 'subscription':
        return 'subscription';
    }

    throw this.unexpected(operationToken);
  }
  /**
   * VariableDefinitions : ( VariableDefinition+ )
   */
  ;

  _proto.parseVariableDefinitions = function parseVariableDefinitions() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
  }
  /**
   * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
   */
  ;

  _proto.parseVariableDefinition = function parseVariableDefinition() {
    var start = this._lexer.token;
    return {
      kind: Kind.VARIABLE_DEFINITION,
      variable: this.parseVariable(),
      type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
      defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseValueLiteral(true) : undefined,
      directives: this.parseDirectives(true),
      loc: this.loc(start)
    };
  }
  /**
   * Variable : $ Name
   */
  ;

  _proto.parseVariable = function parseVariable() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.DOLLAR);
    return {
      kind: Kind.VARIABLE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  }
  /**
   * SelectionSet : { Selection+ }
   */
  ;

  _proto.parseSelectionSet = function parseSelectionSet() {
    var start = this._lexer.token;
    return {
      kind: Kind.SELECTION_SET,
      selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  }
  /**
   * Selection :
   *   - Field
   *   - FragmentSpread
   *   - InlineFragment
   */
  ;

  _proto.parseSelection = function parseSelection() {
    return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
  }
  /**
   * Field : Alias? Name Arguments? Directives? SelectionSet?
   *
   * Alias : Name :
   */
  ;

  _proto.parseField = function parseField() {
    var start = this._lexer.token;
    var nameOrAlias = this.parseName();
    var alias;
    var name;

    if (this.expectOptionalToken(TokenKind.COLON)) {
      alias = nameOrAlias;
      name = this.parseName();
    } else {
      name = nameOrAlias;
    }

    return {
      kind: Kind.FIELD,
      alias: alias,
      name: name,
      arguments: this.parseArguments(false),
      directives: this.parseDirectives(false),
      selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : undefined,
      loc: this.loc(start)
    };
  }
  /**
   * Arguments[Const] : ( Argument[?Const]+ )
   */
  ;

  _proto.parseArguments = function parseArguments(isConst) {
    var item = isConst ? this.parseConstArgument : this.parseArgument;
    return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
  }
  /**
   * Argument[Const] : Name : Value[?Const]
   */
  ;

  _proto.parseArgument = function parseArgument() {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.ARGUMENT,
      name: name,
      value: this.parseValueLiteral(false),
      loc: this.loc(start)
    };
  };

  _proto.parseConstArgument = function parseConstArgument() {
    var start = this._lexer.token;
    return {
      kind: Kind.ARGUMENT,
      name: this.parseName(),
      value: (this.expectToken(TokenKind.COLON), this.parseValueLiteral(true)),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Fragments section.

  /**
   * Corresponds to both FragmentSpread and InlineFragment in the spec.
   *
   * FragmentSpread : ... FragmentName Directives?
   *
   * InlineFragment : ... TypeCondition? Directives? SelectionSet
   */
  ;

  _proto.parseFragment = function parseFragment() {
    var start = this._lexer.token;
    this.expectToken(TokenKind.SPREAD);
    var hasTypeCondition = this.expectOptionalKeyword('on');

    if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
      return {
        kind: Kind.FRAGMENT_SPREAD,
        name: this.parseFragmentName(),
        directives: this.parseDirectives(false),
        loc: this.loc(start)
      };
    }

    return {
      kind: Kind.INLINE_FRAGMENT,
      typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * FragmentDefinition :
   *   - fragment FragmentName on TypeCondition Directives? SelectionSet
   *
   * TypeCondition : NamedType
   */
  ;

  _proto.parseFragmentDefinition = function parseFragmentDefinition() {
    var _this$_options;

    var start = this._lexer.token;
    this.expectKeyword('fragment'); // Experimental support for defining variables within fragments changes
    // the grammar of FragmentDefinition:
    //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

    if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.experimentalFragmentVariables) === true) {
      return {
        kind: Kind.FRAGMENT_DEFINITION,
        name: this.parseFragmentName(),
        variableDefinitions: this.parseVariableDefinitions(),
        typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
        directives: this.parseDirectives(false),
        selectionSet: this.parseSelectionSet(),
        loc: this.loc(start)
      };
    }

    return {
      kind: Kind.FRAGMENT_DEFINITION,
      name: this.parseFragmentName(),
      typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
      directives: this.parseDirectives(false),
      selectionSet: this.parseSelectionSet(),
      loc: this.loc(start)
    };
  }
  /**
   * FragmentName : Name but not `on`
   */
  ;

  _proto.parseFragmentName = function parseFragmentName() {
    if (this._lexer.token.value === 'on') {
      throw this.unexpected();
    }

    return this.parseName();
  } // Implements the parsing rules in the Values section.

  /**
   * Value[Const] :
   *   - [~Const] Variable
   *   - IntValue
   *   - FloatValue
   *   - StringValue
   *   - BooleanValue
   *   - NullValue
   *   - EnumValue
   *   - ListValue[?Const]
   *   - ObjectValue[?Const]
   *
   * BooleanValue : one of `true` `false`
   *
   * NullValue : `null`
   *
   * EnumValue : Name but not `true`, `false` or `null`
   */
  ;

  _proto.parseValueLiteral = function parseValueLiteral(isConst) {
    var token = this._lexer.token;

    switch (token.kind) {
      case TokenKind.BRACKET_L:
        return this.parseList(isConst);

      case TokenKind.BRACE_L:
        return this.parseObject(isConst);

      case TokenKind.INT:
        this._lexer.advance();

        return {
          kind: Kind.INT,
          value: token.value,
          loc: this.loc(token)
        };

      case TokenKind.FLOAT:
        this._lexer.advance();

        return {
          kind: Kind.FLOAT,
          value: token.value,
          loc: this.loc(token)
        };

      case TokenKind.STRING:
      case TokenKind.BLOCK_STRING:
        return this.parseStringLiteral();

      case TokenKind.NAME:
        this._lexer.advance();

        switch (token.value) {
          case 'true':
            return {
              kind: Kind.BOOLEAN,
              value: true,
              loc: this.loc(token)
            };

          case 'false':
            return {
              kind: Kind.BOOLEAN,
              value: false,
              loc: this.loc(token)
            };

          case 'null':
            return {
              kind: Kind.NULL,
              loc: this.loc(token)
            };

          default:
            return {
              kind: Kind.ENUM,
              value: token.value,
              loc: this.loc(token)
            };
        }

      case TokenKind.DOLLAR:
        if (!isConst) {
          return this.parseVariable();
        }

        break;
    }

    throw this.unexpected();
  };

  _proto.parseStringLiteral = function parseStringLiteral() {
    var token = this._lexer.token;

    this._lexer.advance();

    return {
      kind: Kind.STRING,
      value: token.value,
      block: token.kind === TokenKind.BLOCK_STRING,
      loc: this.loc(token)
    };
  }
  /**
   * ListValue[Const] :
   *   - [ ]
   *   - [ Value[?Const]+ ]
   */
  ;

  _proto.parseList = function parseList(isConst) {
    var _this = this;

    var start = this._lexer.token;

    var item = function item() {
      return _this.parseValueLiteral(isConst);
    };

    return {
      kind: Kind.LIST,
      values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R),
      loc: this.loc(start)
    };
  }
  /**
   * ObjectValue[Const] :
   *   - { }
   *   - { ObjectField[?Const]+ }
   */
  ;

  _proto.parseObject = function parseObject(isConst) {
    var _this2 = this;

    var start = this._lexer.token;

    var item = function item() {
      return _this2.parseObjectField(isConst);
    };

    return {
      kind: Kind.OBJECT,
      fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R),
      loc: this.loc(start)
    };
  }
  /**
   * ObjectField[Const] : Name : Value[?Const]
   */
  ;

  _proto.parseObjectField = function parseObjectField(isConst) {
    var start = this._lexer.token;
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    return {
      kind: Kind.OBJECT_FIELD,
      name: name,
      value: this.parseValueLiteral(isConst),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Directives section.

  /**
   * Directives[Const] : Directive[?Const]+
   */
  ;

  _proto.parseDirectives = function parseDirectives(isConst) {
    var directives = [];

    while (this.peek(TokenKind.AT)) {
      directives.push(this.parseDirective(isConst));
    }

    return directives;
  }
  /**
   * Directive[Const] : @ Name Arguments[?Const]?
   */
  ;

  _proto.parseDirective = function parseDirective(isConst) {
    var start = this._lexer.token;
    this.expectToken(TokenKind.AT);
    return {
      kind: Kind.DIRECTIVE,
      name: this.parseName(),
      arguments: this.parseArguments(isConst),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Types section.

  /**
   * Type :
   *   - NamedType
   *   - ListType
   *   - NonNullType
   */
  ;

  _proto.parseTypeReference = function parseTypeReference() {
    var start = this._lexer.token;
    var type;

    if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
      type = this.parseTypeReference();
      this.expectToken(TokenKind.BRACKET_R);
      type = {
        kind: Kind.LIST_TYPE,
        type: type,
        loc: this.loc(start)
      };
    } else {
      type = this.parseNamedType();
    }

    if (this.expectOptionalToken(TokenKind.BANG)) {
      return {
        kind: Kind.NON_NULL_TYPE,
        type: type,
        loc: this.loc(start)
      };
    }

    return type;
  }
  /**
   * NamedType : Name
   */
  ;

  _proto.parseNamedType = function parseNamedType() {
    var start = this._lexer.token;
    return {
      kind: Kind.NAMED_TYPE,
      name: this.parseName(),
      loc: this.loc(start)
    };
  } // Implements the parsing rules in the Type Definition section.

  /**
   * TypeSystemDefinition :
   *   - SchemaDefinition
   *   - TypeDefinition
   *   - DirectiveDefinition
   *
   * TypeDefinition :
   *   - ScalarTypeDefinition
   *   - ObjectTypeDefinition
   *   - InterfaceTypeDefinition
   *   - UnionTypeDefinition
   *   - EnumTypeDefinition
   *   - InputObjectTypeDefinition
   */
  ;

  _proto.parseTypeSystemDefinition = function parseTypeSystemDefinition() {
    // Many definitions begin with a description and require a lookahead.
    var keywordToken = this.peekDescription() ? this._lexer.lookahead() : this._lexer.token;

    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaDefinition();

        case 'scalar':
          return this.parseScalarTypeDefinition();

        case 'type':
          return this.parseObjectTypeDefinition();

        case 'interface':
          return this.parseInterfaceTypeDefinition();

        case 'union':
          return this.parseUnionTypeDefinition();

        case 'enum':
          return this.parseEnumTypeDefinition();

        case 'input':
          return this.parseInputObjectTypeDefinition();

        case 'directive':
          return this.parseDirectiveDefinition();
      }
    }

    throw this.unexpected(keywordToken);
  };

  _proto.peekDescription = function peekDescription() {
    return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
  }
  /**
   * Description : StringValue
   */
  ;

  _proto.parseDescription = function parseDescription() {
    if (this.peekDescription()) {
      return this.parseStringLiteral();
    }
  }
  /**
   * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
   */
  ;

  _proto.parseSchemaDefinition = function parseSchemaDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
    return {
      kind: Kind.SCHEMA_DEFINITION,
      description: description,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  }
  /**
   * OperationTypeDefinition : OperationType : NamedType
   */
  ;

  _proto.parseOperationTypeDefinition = function parseOperationTypeDefinition() {
    var start = this._lexer.token;
    var operation = this.parseOperationType();
    this.expectToken(TokenKind.COLON);
    var type = this.parseNamedType();
    return {
      kind: Kind.OPERATION_TYPE_DEFINITION,
      operation: operation,
      type: type,
      loc: this.loc(start)
    };
  }
  /**
   * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
   */
  ;

  _proto.parseScalarTypeDefinition = function parseScalarTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.SCALAR_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ObjectTypeDefinition :
   *   Description?
   *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
   */
  ;

  _proto.parseObjectTypeDefinition = function parseObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * ImplementsInterfaces :
   *   - implements `&`? NamedType
   *   - ImplementsInterfaces & NamedType
   */
  ;

  _proto.parseImplementsInterfaces = function parseImplementsInterfaces() {
    var _this$_options2;

    if (!this.expectOptionalKeyword('implements')) {
      return [];
    }

    if (((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.allowLegacySDLImplementsInterfaces) === true) {
      var types = []; // Optional leading ampersand

      this.expectOptionalToken(TokenKind.AMP);

      do {
        types.push(this.parseNamedType());
      } while (this.expectOptionalToken(TokenKind.AMP) || this.peek(TokenKind.NAME));

      return types;
    }

    return this.delimitedMany(TokenKind.AMP, this.parseNamedType);
  }
  /**
   * FieldsDefinition : { FieldDefinition+ }
   */
  ;

  _proto.parseFieldsDefinition = function parseFieldsDefinition() {
    var _this$_options3;

    // Legacy support for the SDL?
    if (((_this$_options3 = this._options) === null || _this$_options3 === void 0 ? void 0 : _this$_options3.allowLegacySDLEmptyFields) === true && this.peek(TokenKind.BRACE_L) && this._lexer.lookahead().kind === TokenKind.BRACE_R) {
      this._lexer.advance();

      this._lexer.advance();

      return [];
    }

    return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
  }
  /**
   * FieldDefinition :
   *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
   */
  ;

  _proto.parseFieldDefinition = function parseFieldDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.FIELD_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      type: type,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ArgumentsDefinition : ( InputValueDefinition+ )
   */
  ;

  _proto.parseArgumentDefs = function parseArgumentDefs() {
    return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
  }
  /**
   * InputValueDefinition :
   *   - Description? Name : Type DefaultValue? Directives[Const]?
   */
  ;

  _proto.parseInputValueDef = function parseInputValueDef() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    this.expectToken(TokenKind.COLON);
    var type = this.parseTypeReference();
    var defaultValue;

    if (this.expectOptionalToken(TokenKind.EQUALS)) {
      defaultValue = this.parseValueLiteral(true);
    }

    var directives = this.parseDirectives(true);
    return {
      kind: Kind.INPUT_VALUE_DEFINITION,
      description: description,
      name: name,
      type: type,
      defaultValue: defaultValue,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * InterfaceTypeDefinition :
   *   - Description? interface Name Directives[Const]? FieldsDefinition?
   */
  ;

  _proto.parseInterfaceTypeDefinition = function parseInterfaceTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();
    return {
      kind: Kind.INTERFACE_TYPE_DEFINITION,
      description: description,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * UnionTypeDefinition :
   *   - Description? union Name Directives[Const]? UnionMemberTypes?
   */
  ;

  _proto.parseUnionTypeDefinition = function parseUnionTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();
    return {
      kind: Kind.UNION_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  }
  /**
   * UnionMemberTypes :
   *   - = `|`? NamedType
   *   - UnionMemberTypes | NamedType
   */
  ;

  _proto.parseUnionMemberTypes = function parseUnionMemberTypes() {
    return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
  }
  /**
   * EnumTypeDefinition :
   *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
   */
  ;

  _proto.parseEnumTypeDefinition = function parseEnumTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();
    return {
      kind: Kind.ENUM_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  }
  /**
   * EnumValuesDefinition : { EnumValueDefinition+ }
   */
  ;

  _proto.parseEnumValuesDefinition = function parseEnumValuesDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
  }
  /**
   * EnumValueDefinition : Description? EnumValue Directives[Const]?
   *
   * EnumValue : Name
   */
  ;

  _proto.parseEnumValueDefinition = function parseEnumValueDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    return {
      kind: Kind.ENUM_VALUE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * InputObjectTypeDefinition :
   *   - Description? input Name Directives[Const]? InputFieldsDefinition?
   */
  ;

  _proto.parseInputObjectTypeDefinition = function parseInputObjectTypeDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();
    return {
      kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
      description: description,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * InputFieldsDefinition : { InputValueDefinition+ }
   */
  ;

  _proto.parseInputFieldsDefinition = function parseInputFieldsDefinition() {
    return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
  }
  /**
   * TypeSystemExtension :
   *   - SchemaExtension
   *   - TypeExtension
   *
   * TypeExtension :
   *   - ScalarTypeExtension
   *   - ObjectTypeExtension
   *   - InterfaceTypeExtension
   *   - UnionTypeExtension
   *   - EnumTypeExtension
   *   - InputObjectTypeDefinition
   */
  ;

  _proto.parseTypeSystemExtension = function parseTypeSystemExtension() {
    var keywordToken = this._lexer.lookahead();

    if (keywordToken.kind === TokenKind.NAME) {
      switch (keywordToken.value) {
        case 'schema':
          return this.parseSchemaExtension();

        case 'scalar':
          return this.parseScalarTypeExtension();

        case 'type':
          return this.parseObjectTypeExtension();

        case 'interface':
          return this.parseInterfaceTypeExtension();

        case 'union':
          return this.parseUnionTypeExtension();

        case 'enum':
          return this.parseEnumTypeExtension();

        case 'input':
          return this.parseInputObjectTypeExtension();
      }
    }

    throw this.unexpected(keywordToken);
  }
  /**
   * SchemaExtension :
   *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
   *  - extend schema Directives[Const]
   */
  ;

  _proto.parseSchemaExtension = function parseSchemaExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('schema');
    var directives = this.parseDirectives(true);
    var operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);

    if (directives.length === 0 && operationTypes.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.SCHEMA_EXTENSION,
      directives: directives,
      operationTypes: operationTypes,
      loc: this.loc(start)
    };
  }
  /**
   * ScalarTypeExtension :
   *   - extend scalar Name Directives[Const]
   */
  ;

  _proto.parseScalarTypeExtension = function parseScalarTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('scalar');
    var name = this.parseName();
    var directives = this.parseDirectives(true);

    if (directives.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.SCALAR_TYPE_EXTENSION,
      name: name,
      directives: directives,
      loc: this.loc(start)
    };
  }
  /**
   * ObjectTypeExtension :
   *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend type Name ImplementsInterfaces? Directives[Const]
   *  - extend type Name ImplementsInterfaces
   */
  ;

  _proto.parseObjectTypeExtension = function parseObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('type');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();

    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.OBJECT_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * InterfaceTypeExtension :
   *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
   *  - extend interface Name ImplementsInterfaces? Directives[Const]
   *  - extend interface Name ImplementsInterfaces
   */
  ;

  _proto.parseInterfaceTypeExtension = function parseInterfaceTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('interface');
    var name = this.parseName();
    var interfaces = this.parseImplementsInterfaces();
    var directives = this.parseDirectives(true);
    var fields = this.parseFieldsDefinition();

    if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.INTERFACE_TYPE_EXTENSION,
      name: name,
      interfaces: interfaces,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * UnionTypeExtension :
   *   - extend union Name Directives[Const]? UnionMemberTypes
   *   - extend union Name Directives[Const]
   */
  ;

  _proto.parseUnionTypeExtension = function parseUnionTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('union');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var types = this.parseUnionMemberTypes();

    if (directives.length === 0 && types.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.UNION_TYPE_EXTENSION,
      name: name,
      directives: directives,
      types: types,
      loc: this.loc(start)
    };
  }
  /**
   * EnumTypeExtension :
   *   - extend enum Name Directives[Const]? EnumValuesDefinition
   *   - extend enum Name Directives[Const]
   */
  ;

  _proto.parseEnumTypeExtension = function parseEnumTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('enum');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var values = this.parseEnumValuesDefinition();

    if (directives.length === 0 && values.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.ENUM_TYPE_EXTENSION,
      name: name,
      directives: directives,
      values: values,
      loc: this.loc(start)
    };
  }
  /**
   * InputObjectTypeExtension :
   *   - extend input Name Directives[Const]? InputFieldsDefinition
   *   - extend input Name Directives[Const]
   */
  ;

  _proto.parseInputObjectTypeExtension = function parseInputObjectTypeExtension() {
    var start = this._lexer.token;
    this.expectKeyword('extend');
    this.expectKeyword('input');
    var name = this.parseName();
    var directives = this.parseDirectives(true);
    var fields = this.parseInputFieldsDefinition();

    if (directives.length === 0 && fields.length === 0) {
      throw this.unexpected();
    }

    return {
      kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
      name: name,
      directives: directives,
      fields: fields,
      loc: this.loc(start)
    };
  }
  /**
   * DirectiveDefinition :
   *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
   */
  ;

  _proto.parseDirectiveDefinition = function parseDirectiveDefinition() {
    var start = this._lexer.token;
    var description = this.parseDescription();
    this.expectKeyword('directive');
    this.expectToken(TokenKind.AT);
    var name = this.parseName();
    var args = this.parseArgumentDefs();
    var repeatable = this.expectOptionalKeyword('repeatable');
    this.expectKeyword('on');
    var locations = this.parseDirectiveLocations();
    return {
      kind: Kind.DIRECTIVE_DEFINITION,
      description: description,
      name: name,
      arguments: args,
      repeatable: repeatable,
      locations: locations,
      loc: this.loc(start)
    };
  }
  /**
   * DirectiveLocations :
   *   - `|`? DirectiveLocation
   *   - DirectiveLocations | DirectiveLocation
   */
  ;

  _proto.parseDirectiveLocations = function parseDirectiveLocations() {
    return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
  }
  /*
   * DirectiveLocation :
   *   - ExecutableDirectiveLocation
   *   - TypeSystemDirectiveLocation
   *
   * ExecutableDirectiveLocation : one of
   *   `QUERY`
   *   `MUTATION`
   *   `SUBSCRIPTION`
   *   `FIELD`
   *   `FRAGMENT_DEFINITION`
   *   `FRAGMENT_SPREAD`
   *   `INLINE_FRAGMENT`
   *
   * TypeSystemDirectiveLocation : one of
   *   `SCHEMA`
   *   `SCALAR`
   *   `OBJECT`
   *   `FIELD_DEFINITION`
   *   `ARGUMENT_DEFINITION`
   *   `INTERFACE`
   *   `UNION`
   *   `ENUM`
   *   `ENUM_VALUE`
   *   `INPUT_OBJECT`
   *   `INPUT_FIELD_DEFINITION`
   */
  ;

  _proto.parseDirectiveLocation = function parseDirectiveLocation() {
    var start = this._lexer.token;
    var name = this.parseName();

    if (DirectiveLocation[name.value] !== undefined) {
      return name;
    }

    throw this.unexpected(start);
  } // Core parsing utility functions

  /**
   * Returns a location object, used to identify the place in the source that created a given parsed object.
   */
  ;

  _proto.loc = function loc(startToken) {
    var _this$_options4;

    if (((_this$_options4 = this._options) === null || _this$_options4 === void 0 ? void 0 : _this$_options4.noLocation) !== true) {
      return new Location(startToken, this._lexer.lastToken, this._lexer.source);
    }
  }
  /**
   * Determines if the next token is of a given kind
   */
  ;

  _proto.peek = function peek(kind) {
    return this._lexer.token.kind === kind;
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  ;

  _proto.expectToken = function expectToken(kind) {
    var token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return token;
    }

    throw syntaxError(this._lexer.source, token.start, "Expected ".concat(getTokenKindDesc(kind), ", found ").concat(getTokenDesc(token), "."));
  }
  /**
   * If the next token is of the given kind, return that token after advancing the lexer.
   * Otherwise, do not change the parser state and return undefined.
   */
  ;

  _proto.expectOptionalToken = function expectOptionalToken(kind) {
    var token = this._lexer.token;

    if (token.kind === kind) {
      this._lexer.advance();

      return token;
    }

    return undefined;
  }
  /**
   * If the next token is a given keyword, advance the lexer.
   * Otherwise, do not change the parser state and throw an error.
   */
  ;

  _proto.expectKeyword = function expectKeyword(value) {
    var token = this._lexer.token;

    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();
    } else {
      throw syntaxError(this._lexer.source, token.start, "Expected \"".concat(value, "\", found ").concat(getTokenDesc(token), "."));
    }
  }
  /**
   * If the next token is a given keyword, return "true" after advancing the lexer.
   * Otherwise, do not change the parser state and return "false".
   */
  ;

  _proto.expectOptionalKeyword = function expectOptionalKeyword(value) {
    var token = this._lexer.token;

    if (token.kind === TokenKind.NAME && token.value === value) {
      this._lexer.advance();

      return true;
    }

    return false;
  }
  /**
   * Helper function for creating an error when an unexpected lexed token is encountered.
   */
  ;

  _proto.unexpected = function unexpected(atToken) {
    var token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
    return syntaxError(this._lexer.source, token.start, "Unexpected ".concat(getTokenDesc(token), "."));
  }
  /**
   * Returns a possibly empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.any = function any(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];

    while (!this.expectOptionalToken(closeKind)) {
      nodes.push(parseFn.call(this));
    }

    return nodes;
  }
  /**
   * Returns a list of parse nodes, determined by the parseFn.
   * It can be empty only if open token is missing otherwise it will always return non-empty list
   * that begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.optionalMany = function optionalMany(openKind, parseFn, closeKind) {
    if (this.expectOptionalToken(openKind)) {
      var nodes = [];

      do {
        nodes.push(parseFn.call(this));
      } while (!this.expectOptionalToken(closeKind));

      return nodes;
    }

    return [];
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list begins with a lex token of openKind and ends with a lex token of closeKind.
   * Advances the parser to the next lex token after the closing token.
   */
  ;

  _proto.many = function many(openKind, parseFn, closeKind) {
    this.expectToken(openKind);
    var nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (!this.expectOptionalToken(closeKind));

    return nodes;
  }
  /**
   * Returns a non-empty list of parse nodes, determined by the parseFn.
   * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
   * Advances the parser to the next lex token after last item in the list.
   */
  ;

  _proto.delimitedMany = function delimitedMany(delimiterKind, parseFn) {
    this.expectOptionalToken(delimiterKind);
    var nodes = [];

    do {
      nodes.push(parseFn.call(this));
    } while (this.expectOptionalToken(delimiterKind));

    return nodes;
  };

  return Parser;
}();
/**
 * A helper function to describe a token as a string for debugging.
 */

function getTokenDesc(token) {
  var value = token.value;
  return getTokenKindDesc(token.kind) + (value != null ? " \"".concat(value, "\"") : '');
}
/**
 * A helper function to describe a token kind as a string for debugging.
 */


function getTokenKindDesc(kind) {
  return isPunctuatorTokenKind(kind) ? "\"".concat(kind, "\"") : kind;
}

/**
 * A visitor is provided to visit, it contains the collection of
 * relevant functions to be called during the visitor's traversal.
 */

var QueryDocumentKeys = {
  Name: [],
  Document: ['definitions'],
  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
  Variable: ['name'],
  SelectionSet: ['selections'],
  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
  Argument: ['name', 'value'],
  FragmentSpread: ['name', 'directives'],
  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
  FragmentDefinition: ['name', // Note: fragment variable definitions are experimental and may be changed
  // or removed in the future.
  'variableDefinitions', 'typeCondition', 'directives', 'selectionSet'],
  IntValue: [],
  FloatValue: [],
  StringValue: [],
  BooleanValue: [],
  NullValue: [],
  EnumValue: [],
  ListValue: ['values'],
  ObjectValue: ['fields'],
  ObjectField: ['name', 'value'],
  Directive: ['name', 'arguments'],
  NamedType: ['name'],
  ListType: ['type'],
  NonNullType: ['type'],
  SchemaDefinition: ['description', 'directives', 'operationTypes'],
  OperationTypeDefinition: ['type'],
  ScalarTypeDefinition: ['description', 'name', 'directives'],
  ObjectTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
  InputValueDefinition: ['description', 'name', 'type', 'defaultValue', 'directives'],
  InterfaceTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
  EnumValueDefinition: ['description', 'name', 'directives'],
  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
  SchemaExtension: ['directives', 'operationTypes'],
  ScalarTypeExtension: ['name', 'directives'],
  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
  UnionTypeExtension: ['name', 'directives', 'types'],
  EnumTypeExtension: ['name', 'directives', 'values'],
  InputObjectTypeExtension: ['name', 'directives', 'fields']
};
var BREAK = Object.freeze({});
/**
 * visit() will walk through an AST using a depth-first traversal, calling
 * the visitor's enter function at each node in the traversal, and calling the
 * leave function after visiting that node and all of its child nodes.
 *
 * By returning different values from the enter and leave functions, the
 * behavior of the visitor can be altered, including skipping over a sub-tree of
 * the AST (by returning false), editing the AST by returning a value or null
 * to remove the value, or to stop the whole traversal by returning BREAK.
 *
 * When using visit() to edit an AST, the original AST will not be modified, and
 * a new version of the AST with the changes applied will be returned from the
 * visit function.
 *
 *     const editedAST = visit(ast, {
 *       enter(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: skip visiting this node
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       },
 *       leave(node, key, parent, path, ancestors) {
 *         // @return
 *         //   undefined: no action
 *         //   false: no action
 *         //   visitor.BREAK: stop visiting altogether
 *         //   null: delete this node
 *         //   any value: replace this node with the returned value
 *       }
 *     });
 *
 * Alternatively to providing enter() and leave() functions, a visitor can
 * instead provide functions named the same as the kinds of AST nodes, or
 * enter/leave visitors at a named key, leading to four permutations of the
 * visitor API:
 *
 * 1) Named visitors triggered when entering a node of a specific kind.
 *
 *     visit(ast, {
 *       Kind(node) {
 *         // enter the "Kind" node
 *       }
 *     })
 *
 * 2) Named visitors that trigger upon entering and leaving a node of
 *    a specific kind.
 *
 *     visit(ast, {
 *       Kind: {
 *         enter(node) {
 *           // enter the "Kind" node
 *         }
 *         leave(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 *
 * 3) Generic visitors that trigger upon entering and leaving any node.
 *
 *     visit(ast, {
 *       enter(node) {
 *         // enter any node
 *       },
 *       leave(node) {
 *         // leave any node
 *       }
 *     })
 *
 * 4) Parallel visitors for entering and leaving nodes of a specific kind.
 *
 *     visit(ast, {
 *       enter: {
 *         Kind(node) {
 *           // enter the "Kind" node
 *         }
 *       },
 *       leave: {
 *         Kind(node) {
 *           // leave the "Kind" node
 *         }
 *       }
 *     })
 */

function visit(root, visitor) {
  var visitorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : QueryDocumentKeys;

  /* eslint-disable no-undef-init */
  var stack = undefined;
  var inArray = Array.isArray(root);
  var keys = [root];
  var index = -1;
  var edits = [];
  var node = undefined;
  var key = undefined;
  var parent = undefined;
  var path = [];
  var ancestors = [];
  var newRoot = root;
  /* eslint-enable no-undef-init */

  do {
    index++;
    var isLeaving = index === keys.length;
    var isEdited = isLeaving && edits.length !== 0;

    if (isLeaving) {
      key = ancestors.length === 0 ? undefined : path[path.length - 1];
      node = parent;
      parent = ancestors.pop();

      if (isEdited) {
        if (inArray) {
          node = node.slice();
        } else {
          var clone = {};

          for (var _i2 = 0, _Object$keys2 = Object.keys(node); _i2 < _Object$keys2.length; _i2++) {
            var k = _Object$keys2[_i2];
            clone[k] = node[k];
          }

          node = clone;
        }

        var editOffset = 0;

        for (var ii = 0; ii < edits.length; ii++) {
          var editKey = edits[ii][0];
          var editValue = edits[ii][1];

          if (inArray) {
            editKey -= editOffset;
          }

          if (inArray && editValue === null) {
            node.splice(editKey, 1);
            editOffset++;
          } else {
            node[editKey] = editValue;
          }
        }
      }

      index = stack.index;
      keys = stack.keys;
      edits = stack.edits;
      inArray = stack.inArray;
      stack = stack.prev;
    } else {
      key = parent ? inArray ? index : keys[index] : undefined;
      node = parent ? parent[key] : newRoot;

      if (node === null || node === undefined) {
        continue;
      }

      if (parent) {
        path.push(key);
      }
    }

    var result = void 0;

    if (!Array.isArray(node)) {
      if (!isNode(node)) {
        throw new Error("Invalid AST Node: ".concat(inspect(node), "."));
      }

      var visitFn = getVisitFn(visitor, node.kind, isLeaving);

      if (visitFn) {
        result = visitFn.call(visitor, node, key, parent, path, ancestors);

        if (result === BREAK) {
          break;
        }

        if (result === false) {
          if (!isLeaving) {
            path.pop();
            continue;
          }
        } else if (result !== undefined) {
          edits.push([key, result]);

          if (!isLeaving) {
            if (isNode(result)) {
              node = result;
            } else {
              path.pop();
              continue;
            }
          }
        }
      }
    }

    if (result === undefined && isEdited) {
      edits.push([key, node]);
    }

    if (isLeaving) {
      path.pop();
    } else {
      var _visitorKeys$node$kin;

      stack = {
        inArray: inArray,
        index: index,
        keys: keys,
        edits: edits,
        prev: stack
      };
      inArray = Array.isArray(node);
      keys = inArray ? node : (_visitorKeys$node$kin = visitorKeys[node.kind]) !== null && _visitorKeys$node$kin !== void 0 ? _visitorKeys$node$kin : [];
      index = -1;
      edits = [];

      if (parent) {
        ancestors.push(parent);
      }

      parent = node;
    }
  } while (stack !== undefined);

  if (edits.length !== 0) {
    newRoot = edits[edits.length - 1][1];
  }

  return newRoot;
}
/**
 * Given a visitor instance, if it is leaving or not, and a node kind, return
 * the function the visitor runtime should call.
 */

function getVisitFn(visitor, kind, isLeaving) {
  var kindVisitor = visitor[kind];

  if (kindVisitor) {
    if (!isLeaving && typeof kindVisitor === 'function') {
      // { Kind() {} }
      return kindVisitor;
    }

    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;

    if (typeof kindSpecificVisitor === 'function') {
      // { Kind: { enter() {}, leave() {} } }
      return kindSpecificVisitor;
    }
  } else {
    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;

    if (specificVisitor) {
      if (typeof specificVisitor === 'function') {
        // { enter() {}, leave() {} }
        return specificVisitor;
      }

      var specificKindVisitor = specificVisitor[kind];

      if (typeof specificKindVisitor === 'function') {
        // { enter: { Kind() {} }, leave: { Kind() {} } }
        return specificKindVisitor;
      }
    }
  }
}

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */

function print(ast) {
  return visit(ast, {
    leave: printDocASTReducer
  });
}
var MAX_LINE_LENGTH = 80; // TODO: provide better type coverage in future

var printDocASTReducer = {
  Name: function Name(node) {
    return node.value;
  },
  Variable: function Variable(node) {
    return '$' + node.name;
  },
  // Document
  Document: function Document(node) {
    return join(node.definitions, '\n\n') + '\n';
  },
  OperationDefinition: function OperationDefinition(node) {
    var op = node.operation;
    var name = node.name;
    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
    var directives = join(node.directives, ' ');
    var selectionSet = node.selectionSet; // Anonymous queries with no directives or variable definitions can use
    // the query short form.

    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
  },
  VariableDefinition: function VariableDefinition(_ref) {
    var variable = _ref.variable,
        type = _ref.type,
        defaultValue = _ref.defaultValue,
        directives = _ref.directives;
    return variable + ': ' + type + wrap(' = ', defaultValue) + wrap(' ', join(directives, ' '));
  },
  SelectionSet: function SelectionSet(_ref2) {
    var selections = _ref2.selections;
    return block(selections);
  },
  Field: function Field(_ref3) {
    var alias = _ref3.alias,
        name = _ref3.name,
        args = _ref3.arguments,
        directives = _ref3.directives,
        selectionSet = _ref3.selectionSet;
    var prefix = wrap('', alias, ': ') + name;
    var argsLine = prefix + wrap('(', join(args, ', '), ')');

    if (argsLine.length > MAX_LINE_LENGTH) {
      argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
    }

    return join([argsLine, join(directives, ' '), selectionSet], ' ');
  },
  Argument: function Argument(_ref4) {
    var name = _ref4.name,
        value = _ref4.value;
    return name + ': ' + value;
  },
  // Fragments
  FragmentSpread: function FragmentSpread(_ref5) {
    var name = _ref5.name,
        directives = _ref5.directives;
    return '...' + name + wrap(' ', join(directives, ' '));
  },
  InlineFragment: function InlineFragment(_ref6) {
    var typeCondition = _ref6.typeCondition,
        directives = _ref6.directives,
        selectionSet = _ref6.selectionSet;
    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
  },
  FragmentDefinition: function FragmentDefinition(_ref7) {
    var name = _ref7.name,
        typeCondition = _ref7.typeCondition,
        variableDefinitions = _ref7.variableDefinitions,
        directives = _ref7.directives,
        selectionSet = _ref7.selectionSet;
    return (// Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      "fragment ".concat(name).concat(wrap('(', join(variableDefinitions, ', '), ')'), " ") + "on ".concat(typeCondition, " ").concat(wrap('', join(directives, ' '), ' ')) + selectionSet
    );
  },
  // Value
  IntValue: function IntValue(_ref8) {
    var value = _ref8.value;
    return value;
  },
  FloatValue: function FloatValue(_ref9) {
    var value = _ref9.value;
    return value;
  },
  StringValue: function StringValue(_ref10, key) {
    var value = _ref10.value,
        isBlockString = _ref10.block;
    return isBlockString ? printBlockString(value, key === 'description' ? '' : '  ') : JSON.stringify(value);
  },
  BooleanValue: function BooleanValue(_ref11) {
    var value = _ref11.value;
    return value ? 'true' : 'false';
  },
  NullValue: function NullValue() {
    return 'null';
  },
  EnumValue: function EnumValue(_ref12) {
    var value = _ref12.value;
    return value;
  },
  ListValue: function ListValue(_ref13) {
    var values = _ref13.values;
    return '[' + join(values, ', ') + ']';
  },
  ObjectValue: function ObjectValue(_ref14) {
    var fields = _ref14.fields;
    return '{' + join(fields, ', ') + '}';
  },
  ObjectField: function ObjectField(_ref15) {
    var name = _ref15.name,
        value = _ref15.value;
    return name + ': ' + value;
  },
  // Directive
  Directive: function Directive(_ref16) {
    var name = _ref16.name,
        args = _ref16.arguments;
    return '@' + name + wrap('(', join(args, ', '), ')');
  },
  // Type
  NamedType: function NamedType(_ref17) {
    var name = _ref17.name;
    return name;
  },
  ListType: function ListType(_ref18) {
    var type = _ref18.type;
    return '[' + type + ']';
  },
  NonNullType: function NonNullType(_ref19) {
    var type = _ref19.type;
    return type + '!';
  },
  // Type System Definitions
  SchemaDefinition: addDescription(function (_ref20) {
    var directives = _ref20.directives,
        operationTypes = _ref20.operationTypes;
    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
  }),
  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
    var operation = _ref21.operation,
        type = _ref21.type;
    return operation + ': ' + type;
  },
  ScalarTypeDefinition: addDescription(function (_ref22) {
    var name = _ref22.name,
        directives = _ref22.directives;
    return join(['scalar', name, join(directives, ' ')], ' ');
  }),
  ObjectTypeDefinition: addDescription(function (_ref23) {
    var name = _ref23.name,
        interfaces = _ref23.interfaces,
        directives = _ref23.directives,
        fields = _ref23.fields;
    return join(['type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  }),
  FieldDefinition: addDescription(function (_ref24) {
    var name = _ref24.name,
        args = _ref24.arguments,
        type = _ref24.type,
        directives = _ref24.directives;
    return name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + ': ' + type + wrap(' ', join(directives, ' '));
  }),
  InputValueDefinition: addDescription(function (_ref25) {
    var name = _ref25.name,
        type = _ref25.type,
        defaultValue = _ref25.defaultValue,
        directives = _ref25.directives;
    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
  }),
  InterfaceTypeDefinition: addDescription(function (_ref26) {
    var name = _ref26.name,
        interfaces = _ref26.interfaces,
        directives = _ref26.directives,
        fields = _ref26.fields;
    return join(['interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  }),
  UnionTypeDefinition: addDescription(function (_ref27) {
    var name = _ref27.name,
        directives = _ref27.directives,
        types = _ref27.types;
    return join(['union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
  }),
  EnumTypeDefinition: addDescription(function (_ref28) {
    var name = _ref28.name,
        directives = _ref28.directives,
        values = _ref28.values;
    return join(['enum', name, join(directives, ' '), block(values)], ' ');
  }),
  EnumValueDefinition: addDescription(function (_ref29) {
    var name = _ref29.name,
        directives = _ref29.directives;
    return join([name, join(directives, ' ')], ' ');
  }),
  InputObjectTypeDefinition: addDescription(function (_ref30) {
    var name = _ref30.name,
        directives = _ref30.directives,
        fields = _ref30.fields;
    return join(['input', name, join(directives, ' '), block(fields)], ' ');
  }),
  DirectiveDefinition: addDescription(function (_ref31) {
    var name = _ref31.name,
        args = _ref31.arguments,
        repeatable = _ref31.repeatable,
        locations = _ref31.locations;
    return 'directive @' + name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + (repeatable ? ' repeatable' : '') + ' on ' + join(locations, ' | ');
  }),
  SchemaExtension: function SchemaExtension(_ref32) {
    var directives = _ref32.directives,
        operationTypes = _ref32.operationTypes;
    return join(['extend schema', join(directives, ' '), block(operationTypes)], ' ');
  },
  ScalarTypeExtension: function ScalarTypeExtension(_ref33) {
    var name = _ref33.name,
        directives = _ref33.directives;
    return join(['extend scalar', name, join(directives, ' ')], ' ');
  },
  ObjectTypeExtension: function ObjectTypeExtension(_ref34) {
    var name = _ref34.name,
        interfaces = _ref34.interfaces,
        directives = _ref34.directives,
        fields = _ref34.fields;
    return join(['extend type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  },
  InterfaceTypeExtension: function InterfaceTypeExtension(_ref35) {
    var name = _ref35.name,
        interfaces = _ref35.interfaces,
        directives = _ref35.directives,
        fields = _ref35.fields;
    return join(['extend interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
  },
  UnionTypeExtension: function UnionTypeExtension(_ref36) {
    var name = _ref36.name,
        directives = _ref36.directives,
        types = _ref36.types;
    return join(['extend union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
  },
  EnumTypeExtension: function EnumTypeExtension(_ref37) {
    var name = _ref37.name,
        directives = _ref37.directives,
        values = _ref37.values;
    return join(['extend enum', name, join(directives, ' '), block(values)], ' ');
  },
  InputObjectTypeExtension: function InputObjectTypeExtension(_ref38) {
    var name = _ref38.name,
        directives = _ref38.directives,
        fields = _ref38.fields;
    return join(['extend input', name, join(directives, ' '), block(fields)], ' ');
  }
};

function addDescription(cb) {
  return function (node) {
    return join([node.description, cb(node)], '\n');
  };
}
/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */


function join(maybeArray) {
  var _maybeArray$filter$jo;

  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter(function (x) {
    return x;
  }).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : '';
}
/**
 * Given array, print each item on its own line, wrapped in an
 * indented "{ }" block.
 */


function block(array) {
  return wrap('{\n', indent(join(array, '\n')), '\n}');
}
/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
 */


function wrap(start, maybeString) {
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return maybeString != null && maybeString !== '' ? start + maybeString + end : '';
}

function indent(str) {
  return wrap('  ', str.replace(/\n/g, '\n  '));
}

function isMultiline(str) {
  return str.indexOf('\n') !== -1;
}

function hasMultilineItems(maybeArray) {
  return maybeArray != null && maybeArray.some(isMultiline);
}

var CONTROL_MSG;
(function (CONTROL_MSG) {
    CONTROL_MSG["CONNECTION_CLOSED"] = "Connection closed";
    CONTROL_MSG["CONNECTION_FAILED"] = "Connection failed";
    CONTROL_MSG["REALTIME_SUBSCRIPTION_INIT_ERROR"] = "AppSync Realtime subscription init error";
    CONTROL_MSG["SUBSCRIPTION_ACK"] = "Subscription ack";
    CONTROL_MSG["TIMEOUT_DISCONNECT"] = "Timeout disconnect";
})(CONTROL_MSG || (CONTROL_MSG = {}));
/** @enum {string} */
var ConnectionState;
(function (ConnectionState) {
    /*
     * The connection is alive and healthy
     */
    ConnectionState["Connected"] = "Connected";
    /*
     * The connection is alive, but the connection is offline
     */
    ConnectionState["ConnectedPendingNetwork"] = "ConnectedPendingNetwork";
    /*
     * The connection has been disconnected while in use
     */
    ConnectionState["ConnectionDisrupted"] = "ConnectionDisrupted";
    /*
     * The connection has been disconnected and the network is offline
     */
    ConnectionState["ConnectionDisruptedPendingNetwork"] = "ConnectionDisruptedPendingNetwork";
    /*
     * The connection is in the process of connecting
     */
    ConnectionState["Connecting"] = "Connecting";
    /*
     * The connection is not in use and is being disconnected
     */
    ConnectionState["ConnectedPendingDisconnect"] = "ConnectedPendingDisconnect";
    /*
     * The connection is not in use and has been disconnected
     */
    ConnectionState["Disconnected"] = "Disconnected";
    /*
     * The connection is alive, but a keep alive message has been missed
     */
    ConnectionState["ConnectedPendingKeepAlive"] = "ConnectedPendingKeepAlive";
})(ConnectionState || (ConnectionState = {}));

var GraphQLAuthError;
(function (GraphQLAuthError) {
    GraphQLAuthError["NO_API_KEY"] = "No api-key configured";
    GraphQLAuthError["NO_CURRENT_USER"] = "No current user";
    GraphQLAuthError["NO_CREDENTIALS"] = "No credentials";
    GraphQLAuthError["NO_FEDERATED_JWT"] = "No federated jwt";
    GraphQLAuthError["NO_AUTH_TOKEN"] = "No auth token specified";
})(GraphQLAuthError || (GraphQLAuthError = {}));
const __amplify = Symbol('amplify');
const __authMode = Symbol('authMode');
const __authToken = Symbol('authToken');
const __headers = Symbol('headers');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class RestApiError extends AmplifyError {
    constructor(params) {
        super(params);
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = RestApiError;
        Object.setPrototypeOf(this, RestApiError.prototype);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Internal-only class for CanceledError.
 *
 * @internal
 */
class CanceledError extends RestApiError {
    constructor(params = {}) {
        super({
            name: 'CanceledError',
            message: 'Request is canceled by user',
            ...params,
        });
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = CanceledError;
        Object.setPrototypeOf(this, CanceledError.prototype);
    }
}
/**
 * Check if an error is caused by user calling `cancel()` in REST API.
 *
 * @note This function works **ONLY** for errors thrown by REST API. For GraphQL APIs, use `client.isCancelError(error)`
 *   instead. `client` is generated from  `generateClient()` API from `aws-amplify/api`.
 */
const isCancelError = (error) => !!error && error instanceof CanceledError;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var RestApiValidationErrorCode;
(function (RestApiValidationErrorCode) {
    RestApiValidationErrorCode["InvalidApiName"] = "InvalidApiName";
})(RestApiValidationErrorCode || (RestApiValidationErrorCode = {}));
const validationErrorMap = {
    [RestApiValidationErrorCode.InvalidApiName]: {
        message: 'API name is invalid.',
        recoverySuggestion: 'Check if the API name matches the one in your configuration or `aws-exports.js`',
    },
};

/**
 * Internal-only method to create a new RestApiError from a service error.
 *
 * @internal
 */
const buildRestApiServiceError = (error) => {
    const restApiError = new RestApiError({
        name: error?.name,
        message: error.message,
        underlyingError: error,
    });
    return restApiError;
};
const parseRestApiServiceError = async (response) => {
    const parsedError = await parseJsonError(response);
    if (!parsedError) {
        // Response is not an error.
        return;
    }
    return Object.assign(buildRestApiServiceError(parsedError), {
        $metadata: parsedError.$metadata,
    });
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger = new ConsoleLogger('RestApis');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
function createCancellableOperation(handler, abortController) {
    const isInternalPost = (handler) => !!abortController;
    // For creating a cancellable operation for public REST APIs, we need to create an AbortController
    // internally. Whereas for internal POST APIs, we need to accept in the AbortController from the
    // callers.
    const publicApisAbortController = new AbortController();
    const publicApisAbortSignal = publicApisAbortController.signal;
    const internalPostAbortSignal = abortController?.signal;
    let abortReason;
    const job = async () => {
        try {
            const response = await (isInternalPost(handler)
                ? handler()
                : handler(publicApisAbortSignal));
            if (response.statusCode >= 300) {
                throw await parseRestApiServiceError(response);
            }
            return response;
        }
        catch (error) {
            const abortSignal = internalPostAbortSignal ?? publicApisAbortSignal;
            const message = abortReason ?? abortSignal.reason;
            if (error.name === 'AbortError' || abortSignal?.aborted === true) {
                const canceledError = new CanceledError({
                    ...(message && { message }),
                    underlyingError: error,
                });
                logger.debug(error);
                throw canceledError;
            }
            logger.debug(error);
            throw error;
        }
    };
    if (isInternalPost()) {
        return job();
    }
    else {
        const cancel = (abortMessage) => {
            if (publicApisAbortSignal.aborted === true) {
                return;
            }
            publicApisAbortController.abort(abortMessage);
            // If abort reason is not supported, set a scoped reasons instead. The reason property inside an
            // AbortSignal is a readonly property and trying to set it would throw an error.
            if (abortMessage && publicApisAbortSignal.reason !== abortMessage) {
                abortReason = abortMessage;
            }
        };
        return { response: job(), cancel };
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_REST_IAM_SIGNING_SERVICE = 'execute-api';
const DEFAULT_IAM_SIGNING_REGION = 'us-east-1';
/**
 * The REST endpoints generated by API Gateway
 * @see {@link https://docs.aws.amazon.com/general/latest/gr/apigateway.html#apigateway_region_data_plane}
 */
const APIG_HOSTNAME_PATTERN = /^.+\.([a-z0-9-]+)\.([a-z0-9-]+)\.amazonaws\.com/;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Infer the signing service and region from the given URL, and for REST API only, from the Amplify configuration.
 * It supports raw API Gateway endpoint and AppSync endpoint.
 *
 * @internal
 */
const parseSigningInfo = (url, restApiOptions) => {
    const { service: signingService = DEFAULT_REST_IAM_SIGNING_SERVICE, region: signingRegion = DEFAULT_IAM_SIGNING_REGION, } = restApiOptions?.amplify.getConfig()?.API?.REST?.[restApiOptions?.apiName] ??
        {};
    const { hostname } = url;
    const [, service, region] = APIG_HOSTNAME_PATTERN.exec(hostname) ?? [];
    if (service === DEFAULT_REST_IAM_SIGNING_SERVICE) {
        // The configured endpoint is an API Gateway endpoint
        // @see: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html
        return {
            service,
            region: region ?? signingRegion,
        };
    }
    else if (service === 'appsync-api') {
        // AppSync endpoint is internally supported because GraphQL operation will send request using POST handler.
        // example: https://xxxx.appsync-api.us-east-1.amazonaws.com/graphql
        return {
            service: 'appsync',
            region: region ?? signingRegion,
        };
    }
    else {
        return {
            service: signingService,
            region: signingRegion,
        };
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
function assertValidationError(assertion, name) {
    const { message, recoverySuggestion } = validationErrorMap[name];
    if (!assertion) {
        throw new RestApiError({ name, message, recoverySuggestion });
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Resolve the REST API request URL by:
 * 1. Loading the REST API endpoint from the Amplify configuration with corresponding API name.
 * 2. Appending the path to the endpoint.
 * 3. Merge the query parameters from path and the queryParameter argument which is taken from the public REST API
 *   options.
 * 4. Validating the resulting URL string.
 *
 * @internal
 */
const resolveApiUrl = (amplify, apiName, path, queryParams) => {
    const urlStr = amplify.getConfig()?.API?.REST?.[apiName]?.endpoint;
    assertValidationError(!!urlStr, RestApiValidationErrorCode.InvalidApiName);
    try {
        const url = new AmplifyUrl(urlStr + path);
        if (queryParams) {
            const mergedQueryParams = new AmplifyUrlSearchParams(url.searchParams);
            Object.entries(queryParams).forEach(([key, value]) => {
                mergedQueryParams.set(key, value);
            });
            url.search = new AmplifyUrlSearchParams(mergedQueryParams).toString();
        }
        return url;
    }
    catch (error) {
        throw new RestApiError({
            name: RestApiValidationErrorCode.InvalidApiName,
            ...validationErrorMap[RestApiValidationErrorCode.InvalidApiName],
            recoverySuggestion: `Please make sure the REST endpoint URL is a valid URL string. Got ${urlStr}`,
        });
    }
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const resolveHeaders = (headers, body) => {
    const normalizedHeaders = {};
    for (const key in headers) {
        normalizedHeaders[key.toLowerCase()] = headers[key];
    }
    if (body) {
        normalizedHeaders['content-type'] = 'application/json; charset=UTF-8';
        if (body instanceof FormData) {
            /**
             * If body is a FormData we should not allow setting content-type.
             * It's because runtime HTTP handlers(xhr, fetch, undici, node-fetch,
             * etc.) will modify the content-type value when setting multipart
             * boundary.
             */
            delete normalizedHeaders['content-type'];
        }
    }
    return normalizedHeaders;
};

/**
 * Make REST API call with best-effort IAM auth.
 * @param amplify Amplify instance to to resolve credentials and tokens. Should use different instance in client-side
 *   and SSR
 * @param options Options accepted from public API options when calling the handlers.
 * @param signingServiceInfo Internal-only options enable IAM auth as well as to to overwrite the IAM signing service
 *   and region. If specified, and NONE of API Key header or Auth header is present, IAM auth will be used.
 *
 * @internal
 */
const transferHandler = async (amplify, options, signingServiceInfo) => {
    const { url, method, headers, body, withCredentials, abortSignal } = options;
    const resolvedBody = body
        ? body instanceof FormData
            ? body
            : JSON.stringify(body ?? '')
        : undefined;
    const resolvedHeaders = resolveHeaders(headers, body);
    const request = {
        url,
        headers: resolvedHeaders,
        method,
        body: resolvedBody,
    };
    const baseOptions = {
        retryDecider: getRetryDecider(parseRestApiServiceError),
        computeDelay: jitteredBackoff,
        withCrossDomainCredentials: withCredentials,
        abortSignal,
    };
    const isIamAuthApplicable = iamAuthApplicable(request, signingServiceInfo);
    let response;
    const credentials = await resolveCredentials(amplify);
    if (isIamAuthApplicable && credentials) {
        const signingInfoFromUrl = parseSigningInfo(url);
        const signingService = signingServiceInfo?.service ?? signingInfoFromUrl.service;
        const signingRegion = signingServiceInfo?.region ?? signingInfoFromUrl.region;
        response = await authenticatedHandler(request, {
            ...baseOptions,
            credentials,
            region: signingRegion,
            service: signingService,
        });
    }
    else {
        response = await unauthenticatedHandler(request, {
            ...baseOptions,
        });
    }
    // Clean-up un-modeled properties from response.
    return {
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body,
    };
};
const iamAuthApplicable = ({ headers }, signingServiceInfo) => !headers.authorization && !headers['x-api-key'] && !!signingServiceInfo;
const resolveCredentials = async (amplify) => {
    try {
        const { credentials } = await amplify.Auth.fetchAuthSession();
        if (credentials) {
            return credentials;
        }
    }
    catch (e) {
        logger.debug('No credentials available, the request will be unsigned.');
    }
    return null;
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const publicHandler = (amplify, options, method) => createCancellableOperation(async (abortSignal) => {
    const { apiName, options: apiOptions = {}, path: apiPath } = options;
    const url = resolveApiUrl(amplify, apiName, apiPath, apiOptions?.queryParams);
    const libraryConfigHeaders = await amplify.libraryOptions?.API?.REST?.headers?.({
        apiName,
    });
    const { headers: invocationHeaders = {} } = apiOptions;
    const headers = {
        // custom headers from invocation options should precede library options
        ...libraryConfigHeaders,
        ...invocationHeaders,
    };
    const signingServiceInfo = parseSigningInfo(url, {
        amplify,
        apiName,
    });
    logger.debug(method, url, headers, `IAM signing options: ${JSON.stringify(signingServiceInfo)}`);
    return transferHandler(amplify, {
        ...apiOptions,
        url,
        method,
        headers,
        abortSignal,
    }, signingServiceInfo);
});
const get = (amplify, input) => publicHandler(amplify, input, 'GET');
const post = (amplify, input) => publicHandler(amplify, input, 'POST');
const put = (amplify, input) => publicHandler(amplify, input, 'PUT');
const del = (amplify, input) => publicHandler(amplify, input, 'DELETE');
const head = (amplify, input) => publicHandler(amplify, input, 'HEAD');
const patch = (amplify, input) => publicHandler(amplify, input, 'PATCH');

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * GET HTTP request
 * @param {GetInput} input - Input for GET operation
 * @returns {GetOperation} Operation for GET request
 * @throws - {@link RestApiError}
 * @example
 * Send a GET request
 * ```js
 * import { get, isCancelError } from '@aws-amplify/api';
 *
 * const { body } = await get({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     body, // Optional, JSON object or FormData
 *     queryParams, // Optional, A map of query strings
 *   }
 * }).response;
 * const data = await body.json();
 * ```
 * @example
 * Cancel a GET request
 *
 * ```js
 * import { get, isCancelError } from '@aws-amplify/api';
 *
 * const { response, cancel } = get({apiName, path, options});
 * cancel(message);
 * try {
 *   await response;
 * } cache (e) {
 *   if (isCancelError(e)) {
 *    // handle request cancellation
 *   }
 *   //...
 * }
 * ```
 */
const get$1 = (input) => get(Amplify, input);
/**
 * POST HTTP request
 * @param {PostInput} input - Input for POST operation
 * @returns {PostOperation} Operation for POST request
 * @throws - {@link RestApiError}
 * @example
 * Send a POST request
 * ```js
 * import { post, isCancelError } from '@aws-amplify/api';
 *
 * const { body } = await post({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     body, // Optional, JSON object or FormData
 *     queryParams, // Optional, A map of query strings
 *   }
 * }).response;
 * const data = await body.json();
 * ```
 * @example
 * Cancel a POST request
 *
 * ```js
 * import { post, isCancelError } from '@aws-amplify/api';
 *
 * const { response, cancel } = post({apiName, path, options});
 * cancel(message);
 * try {
 *   await response;
 * } cache (e) {
 *   if (isCancelError(e)) {
 *    // handle request cancellation
 *   }
 *   //...
 * }
 * ```
 */
const post$1 = (input) => post(Amplify, input);
/**
 * PUT HTTP request
 * @param {PutInput} input - Input for PUT operation
 * @returns {PutOperation} Operation for PUT request
 * @throws - {@link RestApiError}
 * @example
 * Send a PUT request
 * ```js
 * import { put, isCancelError } from '@aws-amplify/api';
 *
 * const { body } = await put({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     body, // Optional, JSON object or FormData
 *     queryParams, // Optional, A map of query strings
 *   }
 * }).response;
 * const data = await body.json();
 * ```
 * @example
 * Cancel a PUT request
 * ```js
 * import { put, isCancelError } from '@aws-amplify/api';
 *
 * const { response, cancel } = put({apiName, path, options});
 * cancel(message);
 * try {
 *  await response;
 * } cache (e) {
 *   if (isCancelError(e)) {
 *     // handle request cancellation
 *   }
 * //...
 * }
 * ```
 */
const put$1 = (input) => put(Amplify, input);
/**
 * DELETE HTTP request
 * @param {DeleteInput} input - Input for DELETE operation
 * @returns {DeleteOperation} Operation for DELETE request
 * @throws - {@link RestApiError}
 * @example
 * Send a DELETE request
 * ```js
 * import { del } from '@aws-amplify/api';
 *
 * const { statusCode } = await del({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     queryParams, // Optional, A map of query strings
 *   }
 * }).response;
 * ```
 */
const del$1 = (input) => del(Amplify, input);
/**
 * HEAD HTTP request
 * @param {HeadInput} input - Input for HEAD operation
 * @returns {HeadOperation} Operation for HEAD request
 * @throws - {@link RestApiError}
 * @example
 * Send a HEAD request
 * ```js
 * import { head, isCancelError } from '@aws-amplify/api';
 *
 * const { headers, statusCode } = await head({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     queryParams, // Optional, A map of query strings
 *   }
 * }),response;
 * ```
 *
 */
const head$1 = (input) => head(Amplify, input);
/**
 * PATCH HTTP request
 * @param {PatchInput} input - Input for PATCH operation
 * @returns {PatchOperation} Operation for PATCH request
 * @throws - {@link RestApiError}
 * @example
 * Send a PATCH request
 * ```js
 * import { patch } from '@aws-amplify/api';
 *
 * const { body } = await patch({
 *   apiName,
 *   path,
 *   options: {
 *     headers, // Optional, A map of custom header key/values
 *     body, // Optional, JSON object or FormData
 *     queryParams, // Optional, A map of query strings
 *   }
 * }).response;
 * const data = await body.json();
 * ```
 *
 * @example
 * Cancel a PATCH request
 * ```js
 * import { patch, isCancelError } from '@aws-amplify/api';
 *
 * const { response, cancel } = patch({apiName, path, options});
 * cancel(message);
 * try {
 *  await response;
 * } cache (e) {
 *  if (isCancelError(e)) {
 *   // handle request cancellation
 *  }
 * //...
 * }
 * ```
 */
const patch$1 = (input) => patch(Amplify, input);

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * This weak map provides functionality to cancel a request given the promise containing the `post` request.
 *
 * 1. For every GraphQL POST request, an abort controller is created and supplied to the request.
 * 2. The promise fulfilled by GraphGL POST request is then mapped to that abort controller.
 * 3. The promise is returned to the external caller.
 * 4. The caller can either wait for the promise to fulfill or call `cancel(promise)` to cancel the request.
 * 5. If `cancel(promise)` is called, then the corresponding abort controller is retrieved from the map below.
 * 6. GraphQL POST request will be rejected with the error message provided during cancel.
 * 7. Caller can check if the error is because of cancelling by calling `isCancelError(error)`.
 */
const cancelTokenMap = new WeakMap();
/**
 * @internal
 */
const post$2 = (amplify, { url, options, abortController }) => {
    const controller = abortController ?? new AbortController();
    const responsePromise = createCancellableOperation(async () => {
        const response = transferHandler(amplify, {
            url,
            method: 'POST',
            ...options,
            abortSignal: controller.signal,
        }, options?.signingServiceInfo);
        return response;
    }, controller);
    const responseWithCleanUp = responsePromise.finally(() => {
        cancelTokenMap.delete(responseWithCleanUp);
    });
    return responseWithCleanUp;
};
/**
 * Cancels a request given the promise returned by `post`.
 * If the request is already completed, this function does nothing.
 * It MUST be used after `updateRequestToBeCancellable` is called.
 */
const cancel = (promise, message) => {
    const controller = cancelTokenMap.get(promise);
    if (controller) {
        controller.abort(message);
        if (message && controller.signal.reason !== message) {
            // In runtimes where `AbortSignal.reason` is not supported, we track the reason ourselves.
            // @ts-expect-error reason is read-only property.
            controller.signal['reason'] = message;
        }
        return true;
    }
    return false;
};
/**
 * MUST be used to make a promise including internal `post` API call cancellable.
 */
const updateRequestToBeCancellable = (promise, controller) => {
    cancelTokenMap.set(promise, controller);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Internal-only REST POST handler to send GraphQL request to given endpoint. By default, it will use IAM to authorize
 * the request. In some auth modes, the IAM auth has to be disabled. Here's how to set up the request auth correctly:
 * * If auth mode is 'iam', you MUST NOT set 'authorization' header and 'x-api-key' header, since it would disable IAM
 *   auth. You MUST also set 'input.options.signingServiceInfo' option.
 *   * The including 'input.options.signingServiceInfo.service' and 'input.options.signingServiceInfo.region' are
 *     optional. If omitted, the signing service and region will be inferred from url.
 * * If auth mode is 'none', you MUST NOT set 'options.signingServiceInfo' option.
 * * If auth mode is 'apiKey', you MUST set 'x-api-key' custom header.
 * * If auth mode is 'oidc' or 'lambda' or 'userPool', you MUST set 'authorization' header.
 *
 * To make the internal post cancellable, you must also call `updateRequestToBeCancellable()` with the promise from
 * internal post call and the abort controller supplied to the internal post call.
 *
 * @internal
 */
const post$3 = (input) => {
    return post$2(Amplify, input);
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const MAX_DELAY_MS = 5000;
const NON_RETRYABLE_CODES = [400, 401, 403];
const CONNECTION_STATE_CHANGE = 'ConnectionStateChange';
var MESSAGE_TYPES;
(function (MESSAGE_TYPES) {
    /**
     * Client -> Server message.
     * This message type is the first message after handshake and this will initialize AWS AppSync RealTime communication
     */
    MESSAGE_TYPES["GQL_CONNECTION_INIT"] = "connection_init";
    /**
     * Server -> Client message
     * This message type is in case there is an issue with AWS AppSync RealTime when establishing connection
     */
    MESSAGE_TYPES["GQL_CONNECTION_ERROR"] = "connection_error";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_CONNECTION_INIT message
     */
    MESSAGE_TYPES["GQL_CONNECTION_ACK"] = "connection_ack";
    /**
     * Client -> Server message.
     * This message type is for register subscriptions with AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_START"] = "start";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_START message
     */
    MESSAGE_TYPES["GQL_START_ACK"] = "start_ack";
    /**
     * Server -> Client message.
     * This message type is for subscription message from AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_DATA"] = "data";
    /**
     * Server -> Client message.
     * This message type helps the client to know is still receiving messages from AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_CONNECTION_KEEP_ALIVE"] = "ka";
    /**
     * Client -> Server message.
     * This message type is for unregister subscriptions with AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_STOP"] = "stop";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_STOP message
     */
    MESSAGE_TYPES["GQL_COMPLETE"] = "complete";
    /**
     * Server -> Client message.
     * This message type is for sending error messages from AWS AppSync RealTime to the client
     */
    MESSAGE_TYPES["GQL_ERROR"] = "error";
})(MESSAGE_TYPES || (MESSAGE_TYPES = {}));
var SUBSCRIPTION_STATUS;
(function (SUBSCRIPTION_STATUS) {
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["PENDING"] = 0] = "PENDING";
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["CONNECTED"] = 1] = "CONNECTED";
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["FAILED"] = 2] = "FAILED";
})(SUBSCRIPTION_STATUS || (SUBSCRIPTION_STATUS = {}));
var SOCKET_STATUS;
(function (SOCKET_STATUS) {
    SOCKET_STATUS[SOCKET_STATUS["CLOSED"] = 0] = "CLOSED";
    SOCKET_STATUS[SOCKET_STATUS["READY"] = 1] = "READY";
    SOCKET_STATUS[SOCKET_STATUS["CONNECTING"] = 2] = "CONNECTING";
})(SOCKET_STATUS || (SOCKET_STATUS = {}));
const AWS_APPSYNC_REALTIME_HEADERS = {
    accept: 'application/json, text/javascript',
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=UTF-8',
};
/**
 * Time in milleseconds to wait for GQL_CONNECTION_INIT message
 */
const CONNECTION_INIT_TIMEOUT = 15000;
/**
 * Time in milleseconds to wait for GQL_START_ACK message
 */
const START_ACK_TIMEOUT = 15000;
/**
 * Default Time in milleseconds to wait for GQL_CONNECTION_KEEP_ALIVE message
 */
const DEFAULT_KEEP_ALIVE_TIMEOUT = 5 * 60 * 1000;
/**
 * Default Time in milleseconds to alert for missed GQL_CONNECTION_KEEP_ALIVE message
 */
const DEFAULT_KEEP_ALIVE_ALERT_TIMEOUT = 65 * 1000;
/**
 * Default delay time in milleseconds between when reconnect is triggered vs when it is attempted
 */
const RECONNECT_DELAY = 5 * 1000;
/**
 * Default interval time in milleseconds between when reconnect is re-attempted
 */
const RECONNECT_INTERVAL = 60 * 1000;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const ReachabilityMonitor = () => new Reachability().networkMonitor();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const CONNECTION_CHANGE = {
    KEEP_ALIVE_MISSED: { keepAliveState: 'unhealthy' },
    KEEP_ALIVE: { keepAliveState: 'healthy' },
    CONNECTION_ESTABLISHED: { connectionState: 'connected' },
    CONNECTION_FAILED: {
        intendedConnectionState: 'disconnected',
        connectionState: 'disconnected',
    },
    CLOSING_CONNECTION: { intendedConnectionState: 'disconnected' },
    OPENING_CONNECTION: {
        intendedConnectionState: 'connected',
        connectionState: 'connecting',
    },
    CLOSED: { connectionState: 'disconnected' },
    ONLINE: { networkState: 'connected' },
    OFFLINE: { networkState: 'disconnected' },
};
class ConnectionStateMonitor {
    constructor() {
        this._networkMonitoringSubscription = undefined;
        this._linkedConnectionState = {
            networkState: 'connected',
            connectionState: 'disconnected',
            intendedConnectionState: 'disconnected',
            keepAliveState: 'healthy',
        };
        // Attempt to update the state with the current actual network state
        this._initialNetworkStateSubscription = ReachabilityMonitor().subscribe(({ online }) => {
            this.record(online ? CONNECTION_CHANGE.ONLINE : CONNECTION_CHANGE.OFFLINE);
            this._initialNetworkStateSubscription?.unsubscribe();
        });
        this._linkedConnectionStateObservable =
            new Observable(connectionStateObserver => {
                connectionStateObserver.next(this._linkedConnectionState);
                this._linkedConnectionStateObserver = connectionStateObserver;
            });
    }
    /**
     * Turn network state monitoring on if it isn't on already
     */
    enableNetworkMonitoring() {
        // If no initial network state was discovered, stop trying
        this._initialNetworkStateSubscription?.unsubscribe();
        // Maintain the network state based on the reachability monitor
        if (this._networkMonitoringSubscription === undefined) {
            this._networkMonitoringSubscription = ReachabilityMonitor().subscribe(({ online }) => {
                this.record(online ? CONNECTION_CHANGE.ONLINE : CONNECTION_CHANGE.OFFLINE);
            });
        }
    }
    /**
     * Turn network state monitoring off if it isn't off already
     */
    disableNetworkMonitoring() {
        this._networkMonitoringSubscription?.unsubscribe();
        this._networkMonitoringSubscription = undefined;
    }
    /**
     * Get the observable that allows us to monitor the connection state
     *
     * @returns {Observable<ConnectionState>} - The observable that emits ConnectionState updates
     */
    get connectionStateObservable() {
        let previous;
        // The linked state aggregates state changes to any of the network, connection,
        // intendedConnection and keepAliveHealth. Some states will change these independent
        // states without changing the overall connection state.
        // After translating from linked states to ConnectionState, then remove any duplicates
        return this._linkedConnectionStateObservable
            .pipe(map(value => {
            return this.connectionStatesTranslator(value);
        }))
            .pipe(filter(current => {
            const toInclude = current !== previous;
            previous = current;
            return toInclude;
        }));
    }
    /*
     * Updates local connection state and emits the full state to the observer.
     */
    record(statusUpdates) {
        // Maintain the network monitor
        if (statusUpdates.intendedConnectionState === 'connected') {
            this.enableNetworkMonitoring();
        }
        else if (statusUpdates.intendedConnectionState === 'disconnected') {
            this.disableNetworkMonitoring();
        }
        // Maintain the socket state
        const newSocketStatus = {
            ...this._linkedConnectionState,
            ...statusUpdates,
        };
        this._linkedConnectionState = { ...newSocketStatus };
        this._linkedConnectionStateObserver?.next(this._linkedConnectionState);
    }
    /*
     * Translate the ConnectionState structure into a specific ConnectionState string literal union
     */
    connectionStatesTranslator({ connectionState, networkState, intendedConnectionState, keepAliveState, }) {
        if (connectionState === 'connected' && networkState === 'disconnected')
            return ConnectionState.ConnectedPendingNetwork;
        if (connectionState === 'connected' &&
            intendedConnectionState === 'disconnected')
            return ConnectionState.ConnectedPendingDisconnect;
        if (connectionState === 'disconnected' &&
            intendedConnectionState === 'connected' &&
            networkState === 'disconnected')
            return ConnectionState.ConnectionDisruptedPendingNetwork;
        if (connectionState === 'disconnected' &&
            intendedConnectionState === 'connected')
            return ConnectionState.ConnectionDisrupted;
        if (connectionState === 'connected' && keepAliveState === 'unhealthy')
            return ConnectionState.ConnectedPendingKeepAlive;
        // All remaining states directly correspond to the connection state
        if (connectionState === 'connecting')
            return ConnectionState.Connecting;
        if (connectionState === 'disconnected')
            return ConnectionState.Disconnected;
        return ConnectionState.Connected;
    }
}

var ReconnectEvent;
(function (ReconnectEvent) {
    ReconnectEvent["START_RECONNECT"] = "START_RECONNECT";
    ReconnectEvent["HALT_RECONNECT"] = "HALT_RECONNECT";
})(ReconnectEvent || (ReconnectEvent = {}));
/**
 * Captures the reconnect event logic used to determine when to reconnect to PubSub providers.
 *   Reconnnect attempts are delayed by 5 seconds to let the interface settle.
 *   Attempting to reconnect only once creates unrecoverable states when the network state isn't
 *   supported by the browser, so this keeps retrying every minute until halted.
 */
class ReconnectionMonitor {
    constructor() {
        this.reconnectObservers = [];
    }
    /**
     * Add reconnect observer to the list of observers to alert on reconnect
     */
    addObserver(reconnectObserver) {
        this.reconnectObservers.push(reconnectObserver);
    }
    /**
     * Given a reconnect event, start the appropriate behavior
     */
    record(event) {
        if (event === ReconnectEvent.START_RECONNECT) {
            // If the reconnection hasn't been started
            if (this.reconnectSetTimeoutId === undefined &&
                this.reconnectIntervalId === undefined) {
                this.reconnectSetTimeoutId = setTimeout(() => {
                    // Reconnect now
                    this._triggerReconnect();
                    // Retry reconnect every periodically until it works
                    this.reconnectIntervalId = setInterval(() => {
                        this._triggerReconnect();
                    }, RECONNECT_INTERVAL);
                }, RECONNECT_DELAY);
            }
        }
        if (event === ReconnectEvent.HALT_RECONNECT) {
            if (this.reconnectIntervalId) {
                clearInterval(this.reconnectIntervalId);
                this.reconnectIntervalId = undefined;
            }
            if (this.reconnectSetTimeoutId) {
                clearTimeout(this.reconnectSetTimeoutId);
                this.reconnectSetTimeoutId = undefined;
            }
        }
    }
    /**
     * Complete all reconnect observers
     */
    close() {
        this.reconnectObservers.forEach(reconnectObserver => {
            reconnectObserver.complete?.();
        });
    }
    _triggerReconnect() {
        this.reconnectObservers.forEach(reconnectObserver => {
            reconnectObserver.next?.();
        });
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$1 = new ConsoleLogger('AWSAppSyncRealTimeProvider');
const dispatchApiEvent = (payload) => {
    Hub.dispatch('api', payload, 'PubSub', AMPLIFY_SYMBOL);
};
const standardDomainPattern = /^https:\/\/\w{26}\.appsync\-api\.\w{2}(?:(?:\-\w{2,})+)\-\d\.amazonaws.com(?:\.cn)?\/graphql$/i;
const customDomainPath = '/realtime';
class AWSAppSyncRealTimeProvider {
    constructor(options = {}) {
        this.socketStatus = SOCKET_STATUS.CLOSED;
        this.keepAliveTimeout = DEFAULT_KEEP_ALIVE_TIMEOUT;
        this.subscriptionObserverMap = new Map();
        this.promiseArray = [];
        this.connectionStateMonitor = new ConnectionStateMonitor();
        this.reconnectionMonitor = new ReconnectionMonitor();
        // Monitor the connection state and pass changes along to Hub
        this.connectionStateMonitorSubscription =
            this.connectionStateMonitor.connectionStateObservable.subscribe(connectionState => {
                dispatchApiEvent({
                    event: CONNECTION_STATE_CHANGE,
                    data: {
                        provider: this,
                        connectionState,
                    },
                    message: `Connection state is ${connectionState}`,
                });
                this.connectionState = connectionState;
                // Trigger START_RECONNECT when the connection is disrupted
                if (connectionState === ConnectionState.ConnectionDisrupted) {
                    this.reconnectionMonitor.record(ReconnectEvent.START_RECONNECT);
                }
                // Trigger HALT_RECONNECT to halt reconnection attempts when the state is anything other than
                //   ConnectionDisrupted or Connecting
                if ([
                    ConnectionState.Connected,
                    ConnectionState.ConnectedPendingDisconnect,
                    ConnectionState.ConnectedPendingKeepAlive,
                    ConnectionState.ConnectedPendingNetwork,
                    ConnectionState.ConnectionDisruptedPendingNetwork,
                    ConnectionState.Disconnected,
                ].includes(connectionState)) {
                    this.reconnectionMonitor.record(ReconnectEvent.HALT_RECONNECT);
                }
            });
    }
    /**
     * Mark the socket closed and release all active listeners
     */
    close() {
        // Mark the socket closed both in status and the connection monitor
        this.socketStatus = SOCKET_STATUS.CLOSED;
        this.connectionStateMonitor.record(CONNECTION_CHANGE.CONNECTION_FAILED);
        // Turn off the subscription monitor Hub publishing
        this.connectionStateMonitorSubscription.unsubscribe();
        // Complete all reconnect observers
        this.reconnectionMonitor.close();
    }
    getNewWebSocket(url, protocol) {
        return new WebSocket(url, protocol);
    }
    getProviderName() {
        return 'AWSAppSyncRealTimeProvider';
    }
    // Check if url matches standard domain pattern
    isCustomDomain(url) {
        return url.match(standardDomainPattern) === null;
    }
    subscribe(options, customUserAgentDetails) {
        const { appSyncGraphqlEndpoint, region, query, variables, authenticationType, additionalHeaders, apiKey, authToken, libraryConfigHeaders, } = options || {};
        return new Observable(observer => {
            if (!options || !appSyncGraphqlEndpoint) {
                observer.error({
                    errors: [
                        {
                            ...new GraphQLError(`Subscribe only available for AWS AppSync endpoint`),
                        },
                    ],
                });
                observer.complete();
            }
            else {
                let subscriptionStartActive = false;
                const subscriptionId = amplifyUuid();
                const startSubscription = () => {
                    if (!subscriptionStartActive) {
                        subscriptionStartActive = true;
                        const startSubscriptionPromise = this._startSubscriptionWithAWSAppSyncRealTime({
                            options: {
                                query,
                                variables,
                                region,
                                authenticationType,
                                appSyncGraphqlEndpoint,
                                additionalHeaders,
                                apiKey,
                                authToken,
                                libraryConfigHeaders,
                            },
                            observer,
                            subscriptionId,
                            customUserAgentDetails,
                        }).catch(err => {
                            logger$1.debug(`${CONTROL_MSG.REALTIME_SUBSCRIPTION_INIT_ERROR}: ${err}`);
                            this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSED);
                        });
                        startSubscriptionPromise.finally(() => {
                            subscriptionStartActive = false;
                        });
                    }
                };
                let reconnectSubscription;
                // Add an observable to the reconnection list to manage reconnection for this subscription
                reconnectSubscription = new Observable(observer => {
                    this.reconnectionMonitor.addObserver(observer);
                }).subscribe(() => {
                    startSubscription();
                });
                startSubscription();
                return async () => {
                    // Cleanup reconnection subscription
                    reconnectSubscription?.unsubscribe();
                    // Cleanup after unsubscribing or observer.complete was called after _startSubscriptionWithAWSAppSyncRealTime
                    try {
                        // Waiting that subscription has been connected before trying to unsubscribe
                        await this._waitForSubscriptionToBeConnected(subscriptionId);
                        const { subscriptionState } = this.subscriptionObserverMap.get(subscriptionId) || {};
                        if (!subscriptionState) {
                            // subscription already unsubscribed
                            return;
                        }
                        if (subscriptionState === SUBSCRIPTION_STATUS.CONNECTED) {
                            this._sendUnsubscriptionMessage(subscriptionId);
                        }
                        else {
                            throw new Error('Subscription never connected');
                        }
                    }
                    catch (err) {
                        logger$1.debug(`Error while unsubscribing ${err}`);
                    }
                    finally {
                        this._removeSubscriptionObserver(subscriptionId);
                    }
                };
            }
        });
    }
    async _startSubscriptionWithAWSAppSyncRealTime({ options, observer, subscriptionId, customUserAgentDetails, }) {
        const { appSyncGraphqlEndpoint, authenticationType, query, variables, apiKey, region, libraryConfigHeaders = () => ({}), additionalHeaders = {}, authToken, } = options;
        let additionalCustomHeaders = {};
        if (typeof additionalHeaders === 'function') {
            const requestOptions = {
                url: appSyncGraphqlEndpoint || '',
                queryString: query || '',
            };
            additionalCustomHeaders = await additionalHeaders(requestOptions);
        }
        else {
            additionalCustomHeaders = additionalHeaders;
        }
        // if an authorization header is set, have the explicit authToken take precedence
        if (authToken) {
            additionalCustomHeaders = {
                ...additionalCustomHeaders,
                Authorization: authToken,
            };
        }
        const subscriptionState = SUBSCRIPTION_STATUS.PENDING;
        const data = {
            query,
            variables,
        };
        // Having a subscription id map will make it simple to forward messages received
        this.subscriptionObserverMap.set(subscriptionId, {
            observer,
            query: query ?? '',
            variables: variables ?? {},
            subscriptionState,
            startAckTimeoutId: undefined,
        });
        // Preparing payload for subscription message
        const dataString = JSON.stringify(data);
        const headerObj = {
            ...(await this._awsRealTimeHeaderBasedAuth({
                apiKey,
                appSyncGraphqlEndpoint,
                authenticationType,
                payload: dataString,
                canonicalUri: '',
                region,
                additionalCustomHeaders,
            })),
            ...(await libraryConfigHeaders()),
            ...additionalCustomHeaders,
            [USER_AGENT_HEADER$1]: getAmplifyUserAgent(customUserAgentDetails),
        };
        const subscriptionMessage = {
            id: subscriptionId,
            payload: {
                data: dataString,
                extensions: {
                    authorization: {
                        ...headerObj,
                    },
                },
            },
            type: MESSAGE_TYPES.GQL_START,
        };
        const stringToAWSRealTime = JSON.stringify(subscriptionMessage);
        try {
            this.connectionStateMonitor.record(CONNECTION_CHANGE.OPENING_CONNECTION);
            await this._initializeWebSocketConnection({
                apiKey,
                appSyncGraphqlEndpoint,
                authenticationType,
                region,
                additionalCustomHeaders,
            });
        }
        catch (err) {
            this._logStartSubscriptionError(subscriptionId, observer, err);
            return;
        }
        // Potential race condition can occur when unsubscribe is called during _initializeWebSocketConnection.
        // E.g.unsubscribe gets invoked prior to finishing WebSocket handshake or START_ACK.
        // Both subscriptionFailedCallback and subscriptionReadyCallback are used to synchronized this.
        const { subscriptionFailedCallback, subscriptionReadyCallback } = this.subscriptionObserverMap.get(subscriptionId) ?? {};
        // This must be done before sending the message in order to be listening immediately
        this.subscriptionObserverMap.set(subscriptionId, {
            observer,
            subscriptionState,
            query: query ?? '',
            variables: variables ?? {},
            subscriptionReadyCallback,
            subscriptionFailedCallback,
            startAckTimeoutId: setTimeout(() => {
                this._timeoutStartSubscriptionAck.call(this, subscriptionId);
            }, START_ACK_TIMEOUT),
        });
        if (this.awsRealTimeSocket) {
            this.awsRealTimeSocket.send(stringToAWSRealTime);
        }
    }
    // Log logic for start subscription failures
    _logStartSubscriptionError(subscriptionId, observer, err) {
        logger$1.debug({ err });
        const message = String(err.message ?? '');
        // Resolving to give the state observer time to propogate the update
        Promise.resolve(this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSED));
        // Capture the error only when the network didn't cause disruption
        if (this.connectionState !== ConnectionState.ConnectionDisruptedPendingNetwork) {
            // When the error is non-retriable, error out the observable
            if (isNonRetryableError(err)) {
                observer.error({
                    errors: [
                        {
                            ...new GraphQLError(`${CONTROL_MSG.CONNECTION_FAILED}: ${message}`),
                        },
                    ],
                });
            }
            else {
                logger$1.debug(`${CONTROL_MSG.CONNECTION_FAILED}: ${message}`);
            }
            const { subscriptionFailedCallback } = this.subscriptionObserverMap.get(subscriptionId) || {};
            // Notify concurrent unsubscription
            if (typeof subscriptionFailedCallback === 'function') {
                subscriptionFailedCallback();
            }
        }
    }
    // Waiting that subscription has been connected before trying to unsubscribe
    async _waitForSubscriptionToBeConnected(subscriptionId) {
        const subscriptionObserver = this.subscriptionObserverMap.get(subscriptionId);
        if (subscriptionObserver) {
            const { subscriptionState } = subscriptionObserver;
            // This in case unsubscribe is invoked before sending start subscription message
            if (subscriptionState === SUBSCRIPTION_STATUS.PENDING) {
                return new Promise((res, rej) => {
                    const { observer, subscriptionState, variables, query } = subscriptionObserver;
                    this.subscriptionObserverMap.set(subscriptionId, {
                        observer,
                        subscriptionState,
                        variables,
                        query,
                        subscriptionReadyCallback: res,
                        subscriptionFailedCallback: rej,
                    });
                });
            }
        }
    }
    _sendUnsubscriptionMessage(subscriptionId) {
        try {
            if (this.awsRealTimeSocket &&
                this.awsRealTimeSocket.readyState === WebSocket.OPEN &&
                this.socketStatus === SOCKET_STATUS.READY) {
                // Preparing unsubscribe message to stop receiving messages for that subscription
                const unsubscribeMessage = {
                    id: subscriptionId,
                    type: MESSAGE_TYPES.GQL_STOP,
                };
                const stringToAWSRealTime = JSON.stringify(unsubscribeMessage);
                this.awsRealTimeSocket.send(stringToAWSRealTime);
            }
        }
        catch (err) {
            // If GQL_STOP is not sent because of disconnection issue, then there is nothing the client can do
            logger$1.debug({ err });
        }
    }
    _removeSubscriptionObserver(subscriptionId) {
        this.subscriptionObserverMap.delete(subscriptionId);
        // Verifying 1000ms after removing subscription in case there are new subscription unmount/mount
        setTimeout(this._closeSocketIfRequired.bind(this), 1000);
    }
    _closeSocketIfRequired() {
        if (this.subscriptionObserverMap.size > 0) {
            // Active subscriptions on the WebSocket
            return;
        }
        if (!this.awsRealTimeSocket) {
            this.socketStatus = SOCKET_STATUS.CLOSED;
            return;
        }
        this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSING_CONNECTION);
        if (this.awsRealTimeSocket.bufferedAmount > 0) {
            // Still data on the WebSocket
            setTimeout(this._closeSocketIfRequired.bind(this), 1000);
        }
        else {
            logger$1.debug('closing WebSocket...');
            if (this.keepAliveTimeoutId) {
                clearTimeout(this.keepAliveTimeoutId);
            }
            if (this.keepAliveAlertTimeoutId) {
                clearTimeout(this.keepAliveAlertTimeoutId);
            }
            const tempSocket = this.awsRealTimeSocket;
            // Cleaning callbacks to avoid race condition, socket still exists
            tempSocket.onclose = null;
            tempSocket.onerror = null;
            tempSocket.close(1000);
            this.awsRealTimeSocket = undefined;
            this.socketStatus = SOCKET_STATUS.CLOSED;
            this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSED);
        }
    }
    _handleIncomingSubscriptionMessage(message) {
        if (typeof message.data !== 'string') {
            return;
        }
        logger$1.debug(`subscription message from AWS AppSync RealTime: ${message.data}`);
        const { id = '', payload, type, } = JSON.parse(String(message.data));
        const { observer = null, query = '', variables = {}, startAckTimeoutId, subscriptionReadyCallback, subscriptionFailedCallback, } = this.subscriptionObserverMap.get(id) || {};
        logger$1.debug({ id, observer, query, variables });
        if (type === MESSAGE_TYPES.GQL_DATA && payload && payload.data) {
            if (observer) {
                observer.next(payload);
            }
            else {
                logger$1.debug(`observer not found for id: ${id}`);
            }
            return;
        }
        if (type === MESSAGE_TYPES.GQL_START_ACK) {
            logger$1.debug(`subscription ready for ${JSON.stringify({ query, variables })}`);
            if (typeof subscriptionReadyCallback === 'function') {
                subscriptionReadyCallback();
            }
            if (startAckTimeoutId)
                clearTimeout(startAckTimeoutId);
            dispatchApiEvent({
                event: CONTROL_MSG.SUBSCRIPTION_ACK,
                data: { query, variables },
                message: 'Connection established for subscription',
            });
            const subscriptionState = SUBSCRIPTION_STATUS.CONNECTED;
            if (observer) {
                this.subscriptionObserverMap.set(id, {
                    observer,
                    query,
                    variables,
                    startAckTimeoutId: undefined,
                    subscriptionState,
                    subscriptionReadyCallback,
                    subscriptionFailedCallback,
                });
            }
            this.connectionStateMonitor.record(CONNECTION_CHANGE.CONNECTION_ESTABLISHED);
            return;
        }
        if (type === MESSAGE_TYPES.GQL_CONNECTION_KEEP_ALIVE) {
            if (this.keepAliveTimeoutId)
                clearTimeout(this.keepAliveTimeoutId);
            if (this.keepAliveAlertTimeoutId)
                clearTimeout(this.keepAliveAlertTimeoutId);
            this.keepAliveTimeoutId = setTimeout(() => this._errorDisconnect(CONTROL_MSG.TIMEOUT_DISCONNECT), this.keepAliveTimeout);
            this.keepAliveAlertTimeoutId = setTimeout(() => {
                this.connectionStateMonitor.record(CONNECTION_CHANGE.KEEP_ALIVE_MISSED);
            }, DEFAULT_KEEP_ALIVE_ALERT_TIMEOUT);
            this.connectionStateMonitor.record(CONNECTION_CHANGE.KEEP_ALIVE);
            return;
        }
        if (type === MESSAGE_TYPES.GQL_ERROR) {
            const subscriptionState = SUBSCRIPTION_STATUS.FAILED;
            if (observer) {
                this.subscriptionObserverMap.set(id, {
                    observer,
                    query,
                    variables,
                    startAckTimeoutId,
                    subscriptionReadyCallback,
                    subscriptionFailedCallback,
                    subscriptionState,
                });
                logger$1.debug(`${CONTROL_MSG.CONNECTION_FAILED}: ${JSON.stringify(payload)}`);
                observer.error({
                    errors: [
                        {
                            ...new GraphQLError(`${CONTROL_MSG.CONNECTION_FAILED}: ${JSON.stringify(payload)}`),
                        },
                    ],
                });
                if (startAckTimeoutId)
                    clearTimeout(startAckTimeoutId);
                if (typeof subscriptionFailedCallback === 'function') {
                    subscriptionFailedCallback();
                }
            }
        }
    }
    _errorDisconnect(msg) {
        logger$1.debug(`Disconnect error: ${msg}`);
        if (this.awsRealTimeSocket) {
            this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSED);
            this.awsRealTimeSocket.close();
        }
        this.socketStatus = SOCKET_STATUS.CLOSED;
    }
    _timeoutStartSubscriptionAck(subscriptionId) {
        const subscriptionObserver = this.subscriptionObserverMap.get(subscriptionId);
        if (subscriptionObserver) {
            const { observer, query, variables } = subscriptionObserver;
            if (!observer) {
                return;
            }
            this.subscriptionObserverMap.set(subscriptionId, {
                observer,
                query,
                variables,
                subscriptionState: SUBSCRIPTION_STATUS.FAILED,
            });
            this.connectionStateMonitor.record(CONNECTION_CHANGE.CLOSED);
            logger$1.debug('timeoutStartSubscription', JSON.stringify({ query, variables }));
        }
    }
    _initializeWebSocketConnection({ appSyncGraphqlEndpoint, authenticationType, apiKey, region, additionalCustomHeaders, }) {
        if (this.socketStatus === SOCKET_STATUS.READY) {
            return;
        }
        return new Promise(async (res, rej) => {
            this.promiseArray.push({ res, rej });
            if (this.socketStatus === SOCKET_STATUS.CLOSED) {
                try {
                    this.socketStatus = SOCKET_STATUS.CONNECTING;
                    const payloadString = '{}';
                    const authHeader = await this._awsRealTimeHeaderBasedAuth({
                        authenticationType,
                        payload: payloadString,
                        canonicalUri: '/connect',
                        apiKey,
                        appSyncGraphqlEndpoint,
                        region,
                        additionalCustomHeaders,
                    });
                    const headerString = authHeader ? JSON.stringify(authHeader) : '';
                    const headerQs = base64Encoder.convert(headerString);
                    const payloadQs = base64Encoder.convert(payloadString);
                    let discoverableEndpoint = appSyncGraphqlEndpoint ?? '';
                    if (this.isCustomDomain(discoverableEndpoint)) {
                        discoverableEndpoint =
                            discoverableEndpoint.concat(customDomainPath);
                    }
                    else {
                        discoverableEndpoint = discoverableEndpoint
                            .replace('appsync-api', 'appsync-realtime-api')
                            .replace('gogi-beta', 'grt-beta');
                    }
                    // Creating websocket url with required query strings
                    const protocol = 'wss://';
                    discoverableEndpoint = discoverableEndpoint
                        .replace('https://', protocol)
                        .replace('http://', protocol);
                    const awsRealTimeUrl = `${discoverableEndpoint}?header=${headerQs}&payload=${payloadQs}`;
                    await this._initializeRetryableHandshake(awsRealTimeUrl);
                    this.promiseArray.forEach(({ res }) => {
                        logger$1.debug('Notifying connection successful');
                        res();
                    });
                    this.socketStatus = SOCKET_STATUS.READY;
                    this.promiseArray = [];
                }
                catch (err) {
                    logger$1.debug('Connection exited with', err);
                    this.promiseArray.forEach(({ rej }) => rej(err));
                    this.promiseArray = [];
                    if (this.awsRealTimeSocket &&
                        this.awsRealTimeSocket.readyState === WebSocket.OPEN) {
                        this.awsRealTimeSocket.close(3001);
                    }
                    this.awsRealTimeSocket = undefined;
                    this.socketStatus = SOCKET_STATUS.CLOSED;
                }
            }
        });
    }
    async _initializeRetryableHandshake(awsRealTimeUrl) {
        logger$1.debug(`Initializaling retryable Handshake`);
        await jitteredExponentialRetry(this._initializeHandshake.bind(this), [awsRealTimeUrl], MAX_DELAY_MS);
    }
    async _initializeHandshake(awsRealTimeUrl) {
        logger$1.debug(`Initializing handshake ${awsRealTimeUrl}`);
        // Because connecting the socket is async, is waiting until connection is open
        // Step 1: connect websocket
        try {
            await (() => {
                return new Promise((res, rej) => {
                    const newSocket = this.getNewWebSocket(awsRealTimeUrl, 'graphql-ws');
                    newSocket.onerror = () => {
                        logger$1.debug(`WebSocket connection error`);
                    };
                    newSocket.onclose = () => {
                        rej(new Error('Connection handshake error'));
                    };
                    newSocket.onopen = () => {
                        this.awsRealTimeSocket = newSocket;
                        return res();
                    };
                });
            })();
            // Step 2: wait for ack from AWS AppSyncReaTime after sending init
            await (() => {
                return new Promise((res, rej) => {
                    if (this.awsRealTimeSocket) {
                        let ackOk = false;
                        this.awsRealTimeSocket.onerror = error => {
                            logger$1.debug(`WebSocket error ${JSON.stringify(error)}`);
                        };
                        this.awsRealTimeSocket.onclose = event => {
                            logger$1.debug(`WebSocket closed ${event.reason}`);
                            rej(new Error(JSON.stringify(event)));
                        };
                        this.awsRealTimeSocket.onmessage = (message) => {
                            if (typeof message.data !== 'string') {
                                return;
                            }
                            logger$1.debug(`subscription message from AWS AppSyncRealTime: ${message.data} `);
                            const data = JSON.parse(message.data);
                            const { type, payload: { connectionTimeoutMs = DEFAULT_KEEP_ALIVE_TIMEOUT, } = {}, } = data;
                            if (type === MESSAGE_TYPES.GQL_CONNECTION_ACK) {
                                ackOk = true;
                                if (this.awsRealTimeSocket) {
                                    this.keepAliveTimeout = connectionTimeoutMs;
                                    this.awsRealTimeSocket.onmessage =
                                        this._handleIncomingSubscriptionMessage.bind(this);
                                    this.awsRealTimeSocket.onerror = err => {
                                        logger$1.debug(err);
                                        this._errorDisconnect(CONTROL_MSG.CONNECTION_CLOSED);
                                    };
                                    this.awsRealTimeSocket.onclose = event => {
                                        logger$1.debug(`WebSocket closed ${event.reason}`);
                                        this._errorDisconnect(CONTROL_MSG.CONNECTION_CLOSED);
                                    };
                                }
                                res('Cool, connected to AWS AppSyncRealTime');
                                return;
                            }
                            if (type === MESSAGE_TYPES.GQL_CONNECTION_ERROR) {
                                const { payload: { errors: [{ errorType = '', errorCode = 0 } = {}] = [], } = {}, } = data;
                                rej({ errorType, errorCode });
                            }
                        };
                        const gqlInit = {
                            type: MESSAGE_TYPES.GQL_CONNECTION_INIT,
                        };
                        this.awsRealTimeSocket.send(JSON.stringify(gqlInit));
                        const checkAckOk = (ackOk) => {
                            if (!ackOk) {
                                this.connectionStateMonitor.record(CONNECTION_CHANGE.CONNECTION_FAILED);
                                rej(new Error(`Connection timeout: ack from AWSAppSyncRealTime was not received after ${CONNECTION_INIT_TIMEOUT} ms`));
                            }
                        };
                        setTimeout(() => checkAckOk(ackOk), CONNECTION_INIT_TIMEOUT);
                    }
                });
            })();
        }
        catch (err) {
            const { errorType, errorCode } = err;
            if (NON_RETRYABLE_CODES.includes(errorCode)) {
                throw new NonRetryableError(errorType);
            }
            else if (errorType) {
                throw new Error(errorType);
            }
            else {
                throw err;
            }
        }
    }
    async _awsRealTimeHeaderBasedAuth({ apiKey, authenticationType, payload, canonicalUri, appSyncGraphqlEndpoint, region, additionalCustomHeaders, }) {
        const headerHandler = {
            apiKey: this._awsRealTimeApiKeyHeader.bind(this),
            iam: this._awsRealTimeIAMHeader.bind(this),
            oidc: this._awsAuthTokenHeader.bind(this),
            userPool: this._awsAuthTokenHeader.bind(this),
            lambda: this._customAuthHeader,
            none: this._customAuthHeader,
        };
        if (!authenticationType || !headerHandler[authenticationType]) {
            logger$1.debug(`Authentication type ${authenticationType} not supported`);
            return undefined;
        }
        else {
            const handler = headerHandler[authenticationType];
            const host = appSyncGraphqlEndpoint
                ? new AmplifyUrl(appSyncGraphqlEndpoint).host
                : undefined;
            logger$1.debug(`Authenticating with ${JSON.stringify(authenticationType)}`);
            let resolvedApiKey;
            if (authenticationType === 'apiKey') {
                resolvedApiKey = apiKey;
            }
            const result = await handler({
                payload,
                canonicalUri,
                appSyncGraphqlEndpoint,
                apiKey: resolvedApiKey,
                region,
                host,
                additionalCustomHeaders,
            });
            return result;
        }
    }
    async _awsAuthTokenHeader({ host }) {
        const session = await fetchAuthSession();
        return {
            Authorization: session?.tokens?.accessToken?.toString(),
            host,
        };
    }
    async _awsRealTimeApiKeyHeader({ apiKey, host, }) {
        const dt = new Date();
        const dtStr = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '');
        return {
            host,
            'x-amz-date': dtStr,
            'x-api-key': apiKey,
        };
    }
    async _awsRealTimeIAMHeader({ payload, canonicalUri, appSyncGraphqlEndpoint, region, }) {
        const endpointInfo = {
            region,
            service: 'appsync',
        };
        const creds = (await fetchAuthSession()).credentials;
        const request = {
            url: `${appSyncGraphqlEndpoint}${canonicalUri}`,
            data: payload,
            method: 'POST',
            headers: { ...AWS_APPSYNC_REALTIME_HEADERS },
        };
        const signed_params = signRequest({
            headers: request.headers,
            method: request.method,
            url: new AmplifyUrl(request.url),
            body: request.data,
        }, {
            // TODO: What do we need to do to remove these !'s?
            credentials: creds,
            signingRegion: endpointInfo.region,
            signingService: endpointInfo.service,
        });
        return signed_params.headers;
    }
    _customAuthHeader({ host, additionalCustomHeaders, }) {
        /**
         * If `additionalHeaders` was provided to the subscription as a function,
         * the headers that are returned by that function will already have been
         * provided before this function is called.
         */
        if (!additionalCustomHeaders?.['Authorization']) {
            throw new Error('No auth token specified');
        }
        return {
            Authorization: additionalCustomHeaders.Authorization,
            host,
        };
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class APIError extends AmplifyError {
    constructor(params) {
        super(params);
        // Hack for making the custom error class work when transpiled to es5
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = APIError;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var APIValidationErrorCode;
(function (APIValidationErrorCode) {
    APIValidationErrorCode["NoAuthSession"] = "NoAuthSession";
    APIValidationErrorCode["NoRegion"] = "NoRegion";
    APIValidationErrorCode["NoCustomEndpoint"] = "NoCustomEndpoint";
})(APIValidationErrorCode || (APIValidationErrorCode = {}));
const validationErrorMap$1 = {
    [APIValidationErrorCode.NoAuthSession]: {
        message: 'Auth session should not be empty.',
    },
    // TODO: re-enable when working in all test environments:
    // [APIValidationErrorCode.NoEndpoint]: {
    // 	message: 'Missing endpoint',
    // },
    [APIValidationErrorCode.NoRegion]: {
        message: 'Missing region.',
    },
    [APIValidationErrorCode.NoCustomEndpoint]: {
        message: 'Custom endpoint region is present without custom endpoint.',
    },
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
function assertValidationError$1(assertion, name) {
    const { message, recoverySuggestion } = validationErrorMap$1[name];
    if (!assertion) {
        throw new APIError({ name, message, recoverySuggestion });
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const logger$2 = new ConsoleLogger('GraphQLAPI resolveConfig');
/**
 * @internal
 */
const resolveConfig = (amplify) => {
    const config = amplify.getConfig();
    if (!config.API?.GraphQL) {
        logger$2.warn('The API configuration is missing. This is likely due to Amplify.configure() not being called prior to generateClient().');
    }
    const { apiKey, customEndpoint, customEndpointRegion, defaultAuthMode, endpoint, region, } = config.API?.GraphQL ?? {};
    // TODO: re-enable when working in all test environments:
    // assertValidationError(!!endpoint, APIValidationErrorCode.NoEndpoint);
    assertValidationError$1(!(!customEndpoint && customEndpointRegion), APIValidationErrorCode.NoCustomEndpoint);
    return {
        apiKey,
        customEndpoint,
        customEndpointRegion,
        defaultAuthMode,
        endpoint,
        region,
    };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const resolveLibraryOptions = (amplify) => {
    const headers = amplify.libraryOptions?.API?.GraphQL?.headers;
    const withCredentials = amplify.libraryOptions?.API?.GraphQL?.withCredentials;
    return { headers, withCredentials };
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Checks to see if the given response or subscription message contains an
 * unauth error. If it does, it changes the error message to include instructions
 * for the app developer.
 */
function repackageUnauthError(content) {
    if (content.errors && Array.isArray(content.errors)) {
        content.errors.forEach(e => {
            if (isUnauthError(e)) {
                e.message = 'Unauthorized';
                e.recoverySuggestion =
                    `If you're calling an Amplify-generated API, make sure ` +
                        `to set the "authMode" in generateClient({ authMode: '...' }) to the backend authorization ` +
                        `rule's auth provider ('apiKey', 'userPool', 'iam', 'oidc', 'lambda')`;
            }
        });
    }
    return content;
}
function isUnauthError(error) {
    // Error pattern corresponding to appsync calls
    if (error?.['originalError']?.['name']?.startsWith('UnauthorizedException')) {
        return true;
    }
    // Error pattern corresponding to appsync subscriptions
    if (error.message?.startsWith('Connection failed:') &&
        error.message?.includes('Permission denied')) {
        return true;
    }
    return false;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const USER_AGENT_HEADER = 'x-amz-user-agent';
new ConsoleLogger('GraphQLAPI');
const isAmplifyInstance = (amplify) => {
    return typeof amplify !== 'function';
};
/**
 * Export Cloud Logic APIs
 */
class InternalGraphQLAPIClass {
    constructor() {
        /**
         * @private
         */
        this.appSyncRealTime = new AWSAppSyncRealTimeProvider();
        this._api = {
            post: post$3,
            cancelREST: cancel,
            isCancelErrorREST: isCancelError,
            updateRequestToBeCancellable,
        };
    }
    getModuleName() {
        return 'InternalGraphQLAPI';
    }
    async _headerBasedAuth(amplify, authMode, additionalHeaders = {}) {
        const { region: region, endpoint: appSyncGraphqlEndpoint, apiKey, } = resolveConfig(amplify);
        let headers = {};
        switch (authMode) {
            case 'apiKey':
                if (!apiKey) {
                    throw new Error(GraphQLAuthError.NO_API_KEY);
                }
                headers = {
                    'X-Api-Key': apiKey,
                };
                break;
            case 'iam':
                const session = await amplify.Auth.fetchAuthSession();
                if (session.credentials === undefined) {
                    throw new Error(GraphQLAuthError.NO_CREDENTIALS);
                }
                break;
            case 'oidc':
            case 'userPool':
                try {
                    let token;
                    token = (await amplify.Auth.fetchAuthSession()).tokens?.accessToken.toString();
                    if (!token) {
                        throw new Error(GraphQLAuthError.NO_FEDERATED_JWT);
                    }
                    headers = {
                        Authorization: token,
                    };
                }
                catch (e) {
                    throw new Error(GraphQLAuthError.NO_CURRENT_USER);
                }
                break;
            case 'lambda':
                if (typeof additionalHeaders === 'object' &&
                    !additionalHeaders.Authorization) {
                    throw new Error(GraphQLAuthError.NO_AUTH_TOKEN);
                }
                headers = {
                    Authorization: additionalHeaders.Authorization,
                };
                break;
        }
        return headers;
    }
    /**
     * to get the operation type
     * @param operation
     */
    getGraphqlOperationType(operation) {
        const doc = parse(operation);
        const definitions = doc.definitions;
        const [{ operation: operationType }] = definitions;
        return operationType;
    }
    /**
     * Executes a GraphQL operation
     *
     * @param options - GraphQL Options
     * @param [additionalHeaders] - headers to merge in after any `libraryConfigHeaders` set in the config
     * @returns An Observable if the query is a subscription query, else a promise of the graphql result.
     */
    graphql(amplify, { query: paramQuery, variables = {}, authMode, authToken }, additionalHeaders, customUserAgentDetails) {
        const query = typeof paramQuery === 'string'
            ? parse(paramQuery)
            : parse(print(paramQuery));
        const [operationDef = {}] = query.definitions.filter(def => def.kind === 'OperationDefinition');
        const { operation: operationType } = operationDef;
        const headers = additionalHeaders || {};
        switch (operationType) {
            case 'query':
            case 'mutation':
                const abortController = new AbortController();
                let responsePromise;
                if (isAmplifyInstance(amplify)) {
                    responsePromise = this._graphql(amplify, { query, variables, authMode }, headers, abortController, customUserAgentDetails, authToken);
                }
                else {
                    const wrapper = (amplifyInstance) => this._graphql(amplifyInstance, { query, variables, authMode }, headers, abortController, customUserAgentDetails, authToken);
                    responsePromise = amplify(wrapper);
                }
                this._api.updateRequestToBeCancellable(responsePromise, abortController);
                return responsePromise;
            case 'subscription':
                return this._graphqlSubscribe(amplify, { query, variables, authMode }, headers, customUserAgentDetails, authToken);
            default:
                throw new Error(`invalid operation type: ${operationType}`);
        }
    }
    async _graphql(amplify, { query, variables, authMode: explicitAuthMode }, additionalHeaders = {}, abortController, customUserAgentDetails, authToken) {
        const { region: region, endpoint: appSyncGraphqlEndpoint, customEndpoint, customEndpointRegion, defaultAuthMode, } = resolveConfig(amplify);
        const authMode = explicitAuthMode || defaultAuthMode || 'iam';
        /**
         * Retrieve library options from Amplify configuration.
         * `customHeaders` here are from the Amplify configuration options,
         * and are for non-AppSync endpoints only. These are *not* the same as
         * `additionalHeaders`, which are custom headers that are either 1)
         * included when configuring the API client or 2) passed along with
         * individual requests.
         */
        const { headers: customHeaders, withCredentials } = resolveLibraryOptions(amplify);
        /**
         * Client or request-specific custom headers that may or may not be
         * returned by a function:
         */
        let additionalCustomHeaders;
        if (typeof additionalHeaders === 'function') {
            const requestOptions = {
                method: 'POST',
                url: new AmplifyUrl(customEndpoint || appSyncGraphqlEndpoint || '').toString(),
                queryString: print(query),
            };
            additionalCustomHeaders = await additionalHeaders(requestOptions);
        }
        else {
            additionalCustomHeaders = additionalHeaders;
        }
        // if an authorization header is set, have the explicit authToken take precedence
        if (authToken) {
            additionalCustomHeaders = {
                ...additionalCustomHeaders,
                Authorization: authToken,
            };
        }
        // TODO: Figure what we need to do to remove `!`'s.
        const headers = {
            ...(!customEndpoint &&
                (await this._headerBasedAuth(amplify, authMode, additionalCustomHeaders))),
            /**
             * Custom endpoint headers.
             * If there is both a custom endpoint and custom region present, we get the headers.
             * If there is a custom endpoint but no region, we return an empty object.
             * If neither are present, we return an empty object.
             */
            ...((customEndpoint &&
                (customEndpointRegion
                    ? await this._headerBasedAuth(amplify, authMode, additionalCustomHeaders)
                    : {})) ||
                {}),
            // Custom headers included in Amplify configuration options:
            ...(customHeaders &&
                (await customHeaders({
                    query: print(query),
                    variables,
                }))),
            // Custom headers from individual requests or API client configuration:
            ...additionalCustomHeaders,
            // User agent headers:
            ...(!customEndpoint && {
                [USER_AGENT_HEADER]: getAmplifyUserAgent(customUserAgentDetails),
            }),
        };
        const body = {
            query: print(query),
            variables: variables || null,
        };
        let signingServiceInfo;
        /**
         * We do not send the signing service info to the REST API under the
         * following conditions (i.e. it will not sign the request):
         *   - there is a custom endpoint but no region
         *   - the auth mode is `none`, or `apiKey`
         *   - the auth mode is a type other than the types listed below
         */
        if ((customEndpoint && !customEndpointRegion) ||
            (authMode !== 'oidc' &&
                authMode !== 'userPool' &&
                authMode !== 'iam' &&
                authMode !== 'lambda')) {
            signingServiceInfo = undefined;
        }
        else {
            signingServiceInfo = {
                service: !customEndpointRegion ? 'appsync' : 'execute-api',
                region: !customEndpointRegion ? region : customEndpointRegion,
            };
        }
        const endpoint = customEndpoint || appSyncGraphqlEndpoint;
        if (!endpoint) {
            const error = new GraphQLError('No graphql endpoint provided.');
            throw {
                data: {},
                errors: [error],
            };
        }
        let response;
        try {
            const { body: responseBody } = await this._api.post({
                url: new AmplifyUrl(endpoint),
                options: {
                    headers,
                    body,
                    signingServiceInfo,
                    withCredentials,
                },
                abortController,
            });
            const result = await responseBody.json();
            response = result;
        }
        catch (err) {
            // If the exception is because user intentionally
            // cancelled the request, do not modify the exception
            // so that clients can identify the exception correctly.
            if (this.isCancelError(err)) {
                throw err;
            }
            response = {
                data: {},
                errors: [
                    new GraphQLError(err.message, null, null, null, null, err),
                ],
            };
        }
        const { errors } = response;
        if (errors && errors.length) {
            throw repackageUnauthError(response);
        }
        return response;
    }
    /**
     * Checks to see if an error thrown is from an api request cancellation
     * @param {any} error - Any error
     * @return {boolean} - A boolean indicating if the error was from an api request cancellation
     */
    isCancelError(error) {
        return this._api.isCancelErrorREST(error);
    }
    /**
     * Cancels an inflight request. Only applicable for graphql queries and mutations
     * @param {any} request - request to cancel
     * @returns - A boolean indicating if the request was cancelled
     */
    cancel(request, message) {
        return this._api.cancelREST(request, message);
    }
    _graphqlSubscribe(amplify, { query, variables, authMode }, additionalHeaders = {}, customUserAgentDetails, authToken) {
        const config = resolveConfig(amplify);
        /**
         * Retrieve library options from Amplify configuration.
         * `libraryConfigHeaders` are from the Amplify configuration options,
         * and will not be overwritten by other custom headers. These are *not*
         * the same as `additionalHeaders`, which are custom headers that are
         * either 1)included when configuring the API client or 2) passed along
         * with individual requests.
         */
        const { headers: libraryConfigHeaders } = resolveLibraryOptions(amplify);
        return this.appSyncRealTime
            .subscribe({
            query: print(query),
            variables,
            appSyncGraphqlEndpoint: config?.endpoint,
            region: config?.region,
            authenticationType: authMode || config?.defaultAuthMode,
            apiKey: config?.apiKey,
            additionalHeaders,
            authToken,
            libraryConfigHeaders,
        }, customUserAgentDetails)
            .pipe(catchError(e => {
            if (e.errors) {
                throw repackageUnauthError(e);
            }
            throw e;
        }));
    }
}
const InternalGraphQLAPI = new InternalGraphQLAPIClass();

/**
 * Export Cloud Logic APIs
 */
class GraphQLAPIClass extends InternalGraphQLAPIClass {
    getModuleName() {
        return 'GraphQLAPI';
    }
    /**
     * Executes a GraphQL operation
     *
     * @param options - GraphQL Options
     * @param [additionalHeaders] - headers to merge in after any `libraryConfigHeaders` set in the config
     * @returns An Observable if the query is a subscription query, else a promise of the graphql result.
     */
    graphql(amplify, options, additionalHeaders) {
        return super.graphql(amplify, options, additionalHeaders, {
            category: Category.API,
            action: ApiAction.GraphQl,
        });
    }
    /**
     * Checks to see if an error thrown is from an api request cancellation
     * @param error - Any error
     * @returns A boolean indicating if the error was from an api request cancellation
     */
    isCancelError(error) {
        return super.isCancelError(error);
    }
    /**
     * Cancels an inflight request. Only applicable for graphql queries and mutations
     * @param {any} request - request to cancel
     * @returns A boolean indicating if the request was cancelled
     */
    cancel(request, message) {
        return super.cancel(request, message);
    }
}
const GraphQLAPI = new GraphQLAPIClass();

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Invokes graphql operations against a graphql service, providing correct input and
 * output types if Amplify-generated graphql from a recent version of the CLI/codegen
 * are used *or* correct typing is provided via the type argument.
 *
 * Amplify-generated "branded" graphql queries will look similar to this:
 *
 * ```ts
 *                               //
 *                               // |-- branding
 *                               // v
 * export const getModel = `...` as GeneratedQuery<
 * 	GetModelQueryVariables,
 * 	GetModelQuery
 * >;
 * ```
 *
 * If this branding is not in your generated graphql, update to a newer version of
 * CLI/codegen and regenerate your graphql using `amplify codegen`.
 *
 * ## Using Amplify-generated graphql
 *
 * ```ts
 * import * as queries from './graphql/queries';
 *
 * //
 * //    |-- correctly typed graphql response containing a Widget
 * //    v
 * const queryResult = await graphql({
 * 	query: queries.getWidget,
 * 	variables: {
 * 		id: "abc", // <-- type hinted/enforced
 * 	},
 * });
 *
 * //
 * //    |-- a correctly typed Widget
 * //    v
 * const fetchedWidget = queryResult.data?.getWidget!;
 * ```
 *
 * ## Custom input + result types
 *
 * To provide input types (`variables`) and result types:
 *
 * ```ts
 * type GetById_NameOnly = {
 * 	variables: {
 * 		id: string
 * 	},
 * 	result: Promise<{
 * 		data: { getWidget: { name: string } }
 * 	}>
 * }
 *
 * //
 * //    |-- type is GetById_NameOnly["result"]
 * //    v
 * const result = graphql<GetById_NameOnly>({
 * 	query: "...",
 * 	variables: { id: "abc" }  // <-- type of GetById_NameOnly["variables"]
 * });
 * ```
 *
 * ## Custom result type only
 *
 * To specify result types only, use a type that is *not* in the `{variables, result}` shape:
 *
 * ```ts
 * type MyResultType = Promise<{
 * 	data: {
 * 		getWidget: { name: string }
 * 	}
 * }>
 *
 * //
 * //    |-- type is MyResultType
 * //    v
 * const result = graphql<MyResultType>({query: "..."});
 * ```
 *
 * @param options
 * @param additionalHeaders
 */
function graphql(options, additionalHeaders) {
    // inject client-level auth 
    options.authMode = options.authMode || this[__authMode];
    options.authToken = options.authToken || this[__authToken];
    /**
     * The correctness of these typings depends on correct string branding or overrides.
     * Neither of these can actually be validated at runtime. Hence, we don't perform
     * any validation or type-guarding here.
     */
    const result = GraphQLAPI.graphql(this[__amplify], options, additionalHeaders);
    return result;
}
/**
 * Cancels an inflight request. Only applicable for graphql queries and mutations
 * @param {any} request - request to cancel
 * @returns - A boolean indicating if the request was cancelled
 */
function cancel$1(promise, message) {
    return GraphQLAPI.cancel(promise, message);
}
/**
 * Checks to see if an error thrown is from an api request cancellation
 * @param {any} error - Any error
 * @returns - A boolean indicating if the error was from an api request cancellation
 */
function isCancelError$1(error) {
    return GraphQLAPI.isCancelError(error);
}

/**
 * Given an introspection schema model, returns all owner fields.
 *
 * @param model Model from an introspection schema
 * @returns List of owner field names
 */
function resolveOwnerFields(model) {
    const ownerFields = new Set();
    for (const attr of model.attributes || []) {
        if (isAuthAttribute(attr)) {
            for (const rule of attr.properties.rules) {
                if (rule.allow === 'owner') {
                    ownerFields.add(rule.ownerField || 'owner');
                }
            }
        }
    }
    return Array.from(ownerFields);
}
/**
 * Type guard that identifies an auth attribute with an attached rules list that
 * specifies an `allow` attribute at a minimum.
 *
 * @param attribute Any object. Ideally a model introspection schema model attribute
 * @returns True if given object is an auth attribute
 */
function isAuthAttribute(attribute) {
    if (attribute?.type === 'auth') {
        if (typeof attribute?.properties === 'object') {
            if (Array.isArray(attribute?.properties?.rules)) {
                return (attribute?.properties?.rules).every(rule => !!rule.allow);
            }
        }
    }
    return false;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const connectionType = {
    HAS_ONE: 'HAS_ONE',
    HAS_MANY: 'HAS_MANY',
    BELONGS_TO: 'BELONGS_TO',
};
/**
 *
 * @param GraphQL response object
 * @returns response object with `items` properties flattened
 */
const flattenItems = (obj) => {
    const res = {};
    Object.entries(obj).forEach(([prop, value]) => {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            if (value.items !== undefined) {
                res[prop] = value.items.map((item) => flattenItems(item));
                return;
            }
            res[prop] = flattenItems(value);
            return;
        }
        res[prop] = value;
    });
    return res;
};
// TODO: this should accept single result to support CRUD methods; create helper for array/list
function initializeModel(client, modelName, result, modelIntrospection, authMode, authToken, context = false) {
    const introModel = modelIntrospection.models[modelName];
    const introModelFields = introModel.fields;
    const modelFields = Object.entries(introModelFields)
        .filter(([_, field]) => field?.type?.model !== undefined)
        .map(([fieldName]) => fieldName);
    return result.map(record => {
        const initializedRelationalFields = {};
        for (const fieldName of modelFields) {
            const modelField = introModelFields[fieldName];
            const modelFieldType = modelField?.type;
            const relatedModelName = modelFieldType.model;
            const relatedModel = modelIntrospection.models[relatedModelName];
            const relatedModelPKFieldName = relatedModel.primaryKeyInfo.primaryKeyFieldName;
            const relatedModelSKFieldNames = relatedModel.primaryKeyInfo.sortKeyFieldNames;
            const relationType = modelField.association?.connectionType;
            let connectionFields = [];
            if (modelField.association &&
                'associatedWith' in modelField.association) {
                connectionFields = modelField.association.associatedWith;
            }
            let targetNames = [];
            if (modelField.association && 'targetNames' in modelField.association) {
                targetNames = modelField.association.targetNames;
            }
            switch (relationType) {
                case connectionType.HAS_ONE:
                case connectionType.BELONGS_TO:
                    const sortKeyValues = relatedModelSKFieldNames.reduce((acc, curVal) => {
                        if (record[curVal]) {
                            return (acc[curVal] = record[curVal]);
                        }
                    }, {});
                    if (context) {
                        initializedRelationalFields[fieldName] = (contextSpec, options) => {
                            if (record[targetNames[0]]) {
                                return client.models[relatedModelName].get(contextSpec, {
                                    [relatedModelPKFieldName]: record[targetNames[0]],
                                    ...sortKeyValues,
                                }, {
                                    authMode: options?.authMode || authMode,
                                    authToken: options?.authToken || authToken,
                                });
                            }
                            return undefined;
                        };
                    }
                    else {
                        initializedRelationalFields[fieldName] = (options) => {
                            if (record[targetNames[0]]) {
                                return client.models[relatedModelName].get({
                                    [relatedModelPKFieldName]: record[targetNames[0]],
                                    ...sortKeyValues,
                                }, {
                                    authMode: options?.authMode || authMode,
                                    authToken: options?.authToken || authToken,
                                });
                            }
                            return undefined;
                        };
                    }
                    break;
                case connectionType.HAS_MANY:
                    const parentPk = introModel.primaryKeyInfo.primaryKeyFieldName;
                    const parentSK = introModel.primaryKeyInfo.sortKeyFieldNames;
                    // M:N check - TODO: refactor
                    const relatedModelField = relatedModel.fields[connectionFields[0]];
                    const relatedModelFieldType = relatedModelField.type;
                    if (relatedModelFieldType.model) {
                        let relatedTargetNames = [];
                        if (relatedModelField.association &&
                            'targetNames' in relatedModelField.association) {
                            relatedTargetNames = relatedModelField.association?.targetNames;
                        }
                        const hasManyFilter = relatedTargetNames.map((field, idx) => {
                            if (idx === 0) {
                                return { [field]: { eq: record[parentPk] } };
                            }
                            return { [field]: { eq: record[parentSK[idx - 1]] } };
                        });
                        if (context) {
                            initializedRelationalFields[fieldName] = (contextSpec, options) => {
                                if (record[parentPk]) {
                                    return client.models[relatedModelName].list(contextSpec, {
                                        filter: { and: hasManyFilter },
                                        limit: options?.limit,
                                        nextToken: options?.nextToken,
                                        authMode: options?.authMode || authMode,
                                        authToken: options?.authToken || authToken,
                                    });
                                }
                                return [];
                            };
                        }
                        else {
                            initializedRelationalFields[fieldName] = (options) => {
                                if (record[parentPk]) {
                                    return client.models[relatedModelName].list({
                                        filter: { and: hasManyFilter },
                                        limit: options?.limit,
                                        nextToken: options?.nextToken,
                                        authMode: options?.authMode || authMode,
                                        authToken: options?.authToken || authToken,
                                    });
                                }
                                return [];
                            };
                        }
                        break;
                    }
                    const hasManyFilter = connectionFields.map((field, idx) => {
                        if (idx === 0) {
                            return { [field]: { eq: record[parentPk] } };
                        }
                        return { [field]: { eq: record[parentSK[idx - 1]] } };
                    });
                    if (context) {
                        initializedRelationalFields[fieldName] = (contextSpec, options) => {
                            if (record[parentPk]) {
                                return client.models[relatedModelName].list(contextSpec, {
                                    filter: { and: hasManyFilter },
                                    limit: options?.limit,
                                    nextToken: options?.nextToken,
                                    authMode: options?.authMode || authMode,
                                    authToken: options?.authToken || authToken,
                                });
                            }
                            return [];
                        };
                    }
                    else {
                        initializedRelationalFields[fieldName] = (options) => {
                            if (record[parentPk]) {
                                return client.models[relatedModelName].list({
                                    filter: { and: hasManyFilter },
                                    limit: options?.limit,
                                    nextToken: options?.nextToken,
                                    authMode: options?.authMode || authMode,
                                    authToken: options?.authToken || authToken,
                                });
                            }
                            return [];
                        };
                    }
                    break;
            }
        }
        return { ...record, ...initializedRelationalFields };
    });
}
const graphQLOperationsInfo = {
    CREATE: { operationPrefix: 'create', usePlural: false },
    READ: { operationPrefix: 'get', usePlural: false },
    UPDATE: { operationPrefix: 'update', usePlural: false },
    DELETE: { operationPrefix: 'delete', usePlural: false },
    LIST: { operationPrefix: 'list', usePlural: true },
    ONCREATE: { operationPrefix: 'onCreate', usePlural: false },
    ONUPDATE: { operationPrefix: 'onUpdate', usePlural: false },
    ONDELETE: { operationPrefix: 'onDelete', usePlural: false },
    OBSERVE_QUERY: { operationPrefix: 'observeQuery', usePlural: false },
};
const graphQLDocumentsCache = new Map();
const SELECTION_SET_WILDCARD = '*';
function defaultSelectionSetForModel(modelDefinition) {
    // fields that are explicitly part of the graphql schema; not
    // inferred from owner auth rules.
    const { fields } = modelDefinition;
    const explicitFields = Object.values(fields)
        // Default selection set omits model fields
        .map(({ type, name }) => (typeof type === 'string' ||
        (typeof type === 'object' && typeof type?.enum === 'string')) &&
        name)
        .filter(Boolean);
    // fields used for owner auth rules that may or may not also
    // be explicit on the model.
    const ownerFields = resolveOwnerFields(modelDefinition);
    return Array.from(new Set(explicitFields.concat(ownerFields)));
}
const FIELD_IR = '';
/**
 * Generates nested Custom Selection Set IR from path
 *
 * @param modelDefinitions
 * @param modelName
 * @param selectionSet - array of object paths
 * @example
 * ### Given
 * `selectionSet = ['id', 'comments.post.id']`
 * ### Returns
 * ```ts
 * {
 *   id: '',
 *   comments: {
 *     items: { post: { id: '' } }
 *   }
 * }
 * ```
 */
function customSelectionSetToIR(modelDefinitions, modelName, selectionSet) {
    const dotNotationToObject = (path, modelName) => {
        const [fieldName, ...rest] = path.split('.');
        let result = {};
        if (rest.length === 0) {
            result = { [fieldName]: FIELD_IR };
        }
        else {
            const nested = rest[0];
            const modelDefinition = modelDefinitions[modelName];
            const modelFields = modelDefinition.fields;
            const relatedModel = modelFields[fieldName]?.type?.model;
            if (!relatedModel) {
                // TODO: may need to change this to support custom types
                throw Error(`${fieldName} is not a model field`);
            }
            if (nested === SELECTION_SET_WILDCARD) {
                const relatedModelDefinition = modelDefinitions[relatedModel];
                result = {
                    [fieldName]: defaultSelectionSetIR(relatedModelDefinition),
                };
            }
            else {
                const exists = Boolean(modelFields[fieldName]);
                if (!exists) {
                    throw Error(`${fieldName} is not a field of model ${modelName}`);
                }
                result = {
                    [fieldName]: dotNotationToObject(rest.join('.'), relatedModel),
                };
            }
            if (modelFields[fieldName]?.isArray) {
                result = {
                    [fieldName]: {
                        items: result[fieldName],
                    },
                };
            }
        }
        return result;
    };
    return selectionSet.reduce((resultObj, path) => deepMergeSelectionSetObjects(dotNotationToObject(path, modelName), resultObj), {});
}
const defaultSelectionSetIR = (relatedModelDefinition) => {
    const defaultSelectionSet = defaultSelectionSetForModel(relatedModelDefinition);
    const reduced = defaultSelectionSet.reduce((acc, curVal) => {
        acc[curVal] = FIELD_IR;
        return acc;
    }, {});
    return reduced;
};
/**
 * Stringifies selection set IR
 * * @example
 * ### Given
 * ```ts
 * {
 *   id: '',
 *   comments: {
 *     items: { post: { id: '' } }
 *   }
 * }
 * ```
 * ### Returns
 * `'id comments { items { post { id } } }'`
 */
function selectionSetIRToString(obj) {
    const res = [];
    Object.entries(obj).forEach(([fieldName, value]) => {
        if (value === FIELD_IR) {
            res.push(fieldName);
        }
        else if (typeof value === 'object' && value !== null) {
            if (value?.items) {
                res.push(fieldName, '{', 'items', '{', selectionSetIRToString(value.items), '}', '}');
            }
            else {
                res.push(fieldName, '{', selectionSetIRToString(value), '}');
            }
        }
    });
    return res.join(' ');
}
/**
 * Recursively merges selection set objects from `source` onto `target`.
 *
 * `target` will be updated. `source` will be left alone.
 *
 * @param source The object to merge into target.
 * @param target The object to be mutated.
 */
function deepMergeSelectionSetObjects(source, target) {
    const isObject = (obj) => obj && typeof obj === 'object';
    for (const key in source) {
        // This verification avoids 'Prototype Pollution' issue
        if (!source.hasOwnProperty(key))
            continue;
        if (target.hasOwnProperty(key) && isObject(target[key])) {
            deepMergeSelectionSetObjects(source[key], target[key]);
        }
        else {
            target[key] = source[key];
        }
    }
    return target;
}
function generateSelectionSet(modelDefinitions, modelName, selectionSet) {
    const modelDefinition = modelDefinitions[modelName];
    if (!selectionSet) {
        return defaultSelectionSetForModel(modelDefinition).join(' ');
    }
    const selSetIr = customSelectionSetToIR(modelDefinitions, modelName, selectionSet);
    const selSetString = selectionSetIRToString(selSetIr);
    return selSetString;
}
function generateGraphQLDocument(modelDefinitions, modelName, modelOperation, listArgs) {
    const modelDefinition = modelDefinitions[modelName];
    const { name, pluralName, fields, primaryKeyInfo: { isCustomPrimaryKey, primaryKeyFieldName, sortKeyFieldNames, }, } = modelDefinition;
    const { operationPrefix, usePlural } = graphQLOperationsInfo[modelOperation];
    const { selectionSet } = listArgs || {};
    const fromCache = graphQLDocumentsCache.get(name)?.get(modelOperation);
    if (fromCache !== undefined) {
        return fromCache;
    }
    if (!graphQLDocumentsCache.has(name)) {
        graphQLDocumentsCache.set(name, new Map());
    }
    const graphQLFieldName = `${operationPrefix}${usePlural ? pluralName : name}`;
    let graphQLOperationType;
    let graphQLSelectionSet;
    const selectionSetFields = generateSelectionSet(modelDefinitions, modelName, selectionSet);
    switch (modelOperation) {
        case 'CREATE':
        case 'UPDATE':
        case 'DELETE':
        case 'READ':
        case 'LIST':
        case 'ONCREATE':
        case 'ONUPDATE':
        case 'ONDELETE':
            break;
        case 'OBSERVE_QUERY':
        default:
            throw new Error('Internal error: Attempted to generate graphql document for observeQuery. Please report this error.');
    }
    const graphQLDocument = `${graphQLOperationType}${ ''} { ${graphQLFieldName}${ ''} { ${graphQLSelectionSet} } }`;
    graphQLDocumentsCache.get(name)?.set(modelOperation, graphQLDocument);
    return graphQLDocument;
}
function buildGraphQLVariables(modelDefinition, operation, arg, modelIntrospection) {
    const { fields, primaryKeyInfo: { isCustomPrimaryKey, primaryKeyFieldName, sortKeyFieldNames, }, } = modelDefinition;
    let variables = {};
    // TODO: process input
    switch (operation) {
        case 'CREATE':
            variables = {
                input: arg
                    ? normalizeMutationInput(arg, modelDefinition, modelIntrospection)
                    : {},
            };
            break;
        case 'UPDATE':
            // readonly fields are not  updated
            variables = {
                input: arg
                    ? Object.fromEntries(Object.entries(normalizeMutationInput(arg, modelDefinition, modelIntrospection)).filter(([fieldName]) => {
                        const { isReadOnly } = fields[fieldName];
                        return !isReadOnly;
                    }))
                    : {},
            };
            break;
        case 'READ':
        case 'DELETE':
            // only identifiers are sent
            if (arg) {
                variables = isCustomPrimaryKey
                    ? [primaryKeyFieldName, ...sortKeyFieldNames].reduce((acc, fieldName) => {
                        acc[fieldName] = arg[fieldName];
                        return acc;
                    }, {})
                    : { [primaryKeyFieldName]: arg[primaryKeyFieldName] };
            }
            if (operation === 'DELETE') {
                variables = { input: variables };
            }
            break;
        case 'LIST':
            if (arg?.filter) {
                variables.filter = arg.filter;
            }
            if (arg?.nextToken) {
                variables.nextToken = arg.nextToken;
            }
            if (arg?.limit) {
                variables.limit = arg.limit;
            }
            break;
        case 'ONCREATE':
        case 'ONUPDATE':
        case 'ONDELETE':
            if (arg?.filter) {
                variables = { filter: arg.filter };
            }
            break;
        case 'OBSERVE_QUERY':
            throw new Error('Internal error: Attempted to build variables for observeQuery. Please report this error.');
        default:
            const exhaustiveCheck = operation;
            throw new Error(`Unhandled operation case: ${exhaustiveCheck}`);
    }
    return variables;
}
/**
 * Iterates over mutation input values and resolves any model inputs to their corresponding join fields/values
 *
 * @example
 * ### Usage
 * ```ts
 * const result = normalizeMutationInput({ post: post }, model, modelDefinition);
 * ```
 * ### Result
 * ```ts
 * { postId: "abc123" }
 * ```
 *
 */
function normalizeMutationInput(mutationInput, model, modelIntrospection) {
    const { fields } = model;
    const normalized = {};
    Object.entries(mutationInput).forEach(([inputFieldName, inputValue]) => {
        const fieldType = fields[inputFieldName]?.type;
        const relatedModelName = fieldType?.model;
        if (relatedModelName) {
            const association = fields[inputFieldName]?.association;
            const relatedModelDef = modelIntrospection.models[relatedModelName];
            const relatedModelPkInfo = relatedModelDef.primaryKeyInfo;
            if (association?.connectionType === connectionType.HAS_ONE) {
                const associationHasOne = association;
                associationHasOne.targetNames.forEach((targetName, idx) => {
                    const associatedFieldName = associationHasOne.associatedWith[idx];
                    normalized[targetName] = inputValue[associatedFieldName];
                });
            }
            if (association?.connectionType === connectionType.BELONGS_TO) {
                const associationBelongsTo = association;
                associationBelongsTo.targetNames.forEach((targetName, idx) => {
                    if (idx === 0) {
                        const associatedFieldName = relatedModelPkInfo.primaryKeyFieldName;
                        normalized[targetName] = inputValue[associatedFieldName];
                    }
                    else {
                        const associatedFieldName = relatedModelPkInfo.sortKeyFieldNames[idx - 1];
                        normalized[targetName] = inputValue[associatedFieldName];
                    }
                });
            }
        }
        else {
            normalized[inputFieldName] = inputValue;
        }
    });
    return normalized;
}
/**
 * Produces a parameter object that can contains auth mode/token overrides
 * only if present in either `options` (first) or configured on the `client`
 * as a fallback.
 *
 * @param client Configured client from `generateClient`
 * @param options Args/Options obect from call site.
 * @returns
 */
function authModeParams(client, options = {}) {
    return {
        authMode: options.authMode || client[__authMode],
        authToken: options.authToken || client[__authToken],
    };
}
/**
 * Retrieves custom headers from either the client or request options.
 * @param {client} V6Client | V6ClientSSRRequest | V6ClientSSRCookies - for extracting client headers
 * @param {requestHeaders} [CustomHeaders] - request headers
 * @returns {CustomHeaders} - custom headers
 */
function getCustomHeaders(client, requestHeaders) {
    let headers = client[__headers] || {};
    // Individual request headers will take precedence over client headers.
    // We intentionally do *not* merge client and request headers.
    if (requestHeaders) {
        headers = requestHeaders;
    }
    return headers;
}

function listFactory(client, modelIntrospection, model, context = false) {
    const listWithContext = async (contextSpec, args) => {
        return _list(client, modelIntrospection, model, args, contextSpec);
    };
    const list = async (args) => {
        return _list(client, modelIntrospection, model, args);
    };
    return context ? listWithContext : list;
}
async function _list(client, modelIntrospection, model, args, contextSpec) {
    const { name } = model;
    const query = generateGraphQLDocument(modelIntrospection.models, name, 'LIST', args);
    const variables = buildGraphQLVariables(model, 'LIST', args, modelIntrospection);
    try {
        const auth = authModeParams(client, args);
        const headers = getCustomHeaders(client, args?.headers);
        const { data, extensions } = !!contextSpec
            ? (await client.graphql(contextSpec, {
                ...auth,
                query,
                variables,
            }, headers))
            : (await client.graphql({
                ...auth,
                query,
                variables,
            }, headers));
        // flatten response
        if (data !== undefined) {
            const [key] = Object.keys(data);
            if (data[key].items) {
                const flattenedResult = flattenItems(data)[key];
                // don't init if custom selection set
                if (args?.selectionSet) {
                    return {
                        data: flattenedResult,
                        nextToken: data[key].nextToken,
                        extensions,
                    };
                }
                else {
                    const initialized = initializeModel(client, name, flattenedResult, modelIntrospection, auth.authMode, auth.authToken, !!contextSpec);
                    return {
                        data: initialized,
                        nextToken: data[key].nextToken,
                        extensions,
                    };
                }
            }
            return {
                data: data[key],
                nextToken: data[key].nextToken,
                extensions,
            };
        }
    }
    catch (error) {
        if (error.errors) {
            // graphql errors pass through
            return error;
        }
        else {
            // non-graphql errors re re-thrown
            throw error;
        }
    }
}

function getFactory(client, modelIntrospection, model, operation, useContext = false) {
    const getWithContext = async (contextSpec, arg, options) => {
        return _get(client, modelIntrospection, model, arg, options, operation, contextSpec);
    };
    const get = async (arg, options) => {
        return _get(client, modelIntrospection, model, arg, options, operation);
    };
    return useContext ? getWithContext : get;
}
async function _get(client, modelIntrospection, model, arg, options, operation, context) {
    const { name } = model;
    const query = generateGraphQLDocument(modelIntrospection.models, name, operation, options);
    const variables = buildGraphQLVariables(model, operation, arg, modelIntrospection);
    try {
        const auth = authModeParams(client, options);
        const headers = getCustomHeaders(client, options?.headers);
        const { data, extensions } = context
            ? (await client.graphql(context, {
                ...auth,
                query,
                variables,
            }, headers))
            : (await client.graphql({
                ...auth,
                query,
                variables,
            }, headers));
        // flatten response
        if (data) {
            const [key] = Object.keys(data);
            const flattenedResult = flattenItems(data)[key];
            if (options?.selectionSet) {
                return { data: flattenedResult, extensions };
            }
            else {
                // TODO: refactor to avoid destructuring here
                const [initialized] = initializeModel(client, name, [flattenedResult], modelIntrospection, auth.authMode, auth.authToken, !!context);
                return { data: initialized, extensions };
            }
        }
        else {
            return { data: null, extensions };
        }
    }
    catch (error) {
        if (error.errors) {
            // graphql errors pass through
            return error;
        }
        else {
            // non-graphql errors re re-thrown
            throw error;
        }
    }
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function subscriptionFactory(client, modelIntrospection, model, operation) {
    const { name } = model;
    const subscription = (args) => {
        const query = generateGraphQLDocument(modelIntrospection.models, name, operation);
        const variables = buildGraphQLVariables(model, operation, args, modelIntrospection);
        const auth = authModeParams(client, args);
        const headers = getCustomHeaders(client, args?.headers);
        const observable = client.graphql({
            ...auth,
            query,
            variables,
        }, headers);
        return observable.pipe(map(value => {
            const [key] = Object.keys(value.data);
            const data = value.data[key];
            const [initialized] = initializeModel(client, name, [data], modelIntrospection, auth.authMode, auth.authToken);
            return initialized;
        }));
    };
    return subscription;
}

/**
 * Given a SchemaModel from a ModelIntrospectionSchema, returns the primary key
 * as an array of field names.
 *
 * @param model The model object
 * @returns Array of field names
 */
function resolvePKFields(model) {
    const { primaryKeyFieldName, sortKeyFieldNames } = model.primaryKeyInfo;
    return [primaryKeyFieldName, ...sortKeyFieldNames];
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Iterates through a collection to find a matching item and returns the index.
 *
 * @param needle The item to search for
 * @param haystack The collection to search
 * @param keyFields The fields used to indicate a match
 * @returns Index of `needle` in `haystack`, otherwise -1 if not found.
 */
function findIndexByFields(needle, haystack, keyFields) {
    const searchObject = Object.fromEntries(keyFields.map(fieldName => [fieldName, needle[fieldName]]));
    for (let i = 0; i < haystack.length; i++) {
        if (Object.keys(searchObject).every(k => searchObject[k] === haystack[i][k])) {
            return i;
        }
    }
    return -1;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function observeQueryFactory(models, model) {
    const { name } = model;
    const observeQuery = (arg) => new Observable(subscriber => {
        // what we'll be sending to our subscribers
        const items = [];
        // To enqueue subscription messages while we collect our initial
        // result set.
        const messageQueue = [];
        // operation to take when message(s) arrive.
        // this operation will be swapped out once initial "sync" is complete
        // to immediately ingest messsages.
        let receiveMessages = (...messages) => {
            return messageQueue.push(...messages);
        };
        // start subscriptions
        const onCreateSub = models[name].onCreate(arg).subscribe({
            next(item) {
                receiveMessages({ item, type: 'create' });
            },
            error(error) {
                subscriber.error({ type: 'onCreate', error });
            },
        });
        const onUpdateSub = models[name].onUpdate(arg).subscribe({
            next(item) {
                receiveMessages({ item, type: 'update' });
            },
            error(error) {
                subscriber.error({ type: 'onUpdate', error });
            },
        });
        const onDeleteSub = models[name].onDelete(arg).subscribe({
            next(item) {
                receiveMessages({ item, type: 'delete' });
            },
            error(error) {
                subscriber.error({ type: 'onDelete', error });
            },
        });
        // consumes a list of messages and sends a snapshot
        function ingestMessages(messages) {
            for (const message of messages) {
                const idx = findIndexByFields(message.item, items, pkFields);
                switch (message.type) {
                    case 'create':
                        if (idx < 0)
                            items.push(message.item);
                        break;
                    case 'update':
                        if (idx >= 0)
                            items[idx] = message.item;
                        break;
                    case 'delete':
                        if (idx >= 0)
                            items.splice(idx, 1);
                        break;
                    default:
                        console.error('Unrecognized message in observeQuery.', message);
                }
            }
            subscriber.next({
                items,
                isSynced: true,
            });
        }
        const pkFields = resolvePKFields(model);
        // initial results
        (async () => {
            let firstPage = true;
            let nextToken = null;
            while (!subscriber.closed && (firstPage || nextToken)) {
                firstPage = false;
                const { data: page, errors, nextToken: _nextToken, } = await models[name].list({ ...arg, nextToken });
                nextToken = _nextToken;
                items.push(...page);
                // if there are no more pages and no items we already know about
                // that need to be merged in from sub, we're "synced"
                const isSynced = messageQueue.length === 0 &&
                    (nextToken === null || nextToken === undefined);
                subscriber.next({
                    items,
                    isSynced,
                });
                if (Array.isArray(errors)) {
                    for (const error of errors) {
                        subscriber.error(error);
                    }
                }
            }
            // play through the queue
            if (messageQueue.length > 0) {
                ingestMessages(messageQueue);
            }
            // switch the queue to write directly to the items collection
            receiveMessages = (...messages) => {
                ingestMessages(messages);
                return items.length;
            };
        })();
        // when subscriber unsubscribes, tear down internal subs
        return () => {
            // 1. tear down internal subs
            onCreateSub.unsubscribe();
            onUpdateSub.unsubscribe();
            onDeleteSub.unsubscribe();
            // 2. there is no need to explicitly stop paging. instead, we
            // just check `subscriber.closed` above before fetching each page.
        };
    });
    return observeQuery;
}

function generateModelsProperty(client, params) {
    const models = {};
    const config = params.amplify.getConfig();
    if (!config.API?.GraphQL) {
        // breaks compatibility with certain bundler, e.g. Vite where component files are evaluated before
        // the entry point causing false positive errors. Revisit how to better handle this post-launch
        // throw new Error(
        // 	'The API configuration is missing. This is likely due to Amplify.configure() not being called
        // prior to generateClient().'
        // );
        return {};
    }
    const modelIntrospection = config.API.GraphQL.modelIntrospection;
    if (!modelIntrospection) {
        return {};
    }
    const SUBSCRIPTION_OPS = ['ONCREATE', 'ONUPDATE', 'ONDELETE'];
    for (const model of Object.values(modelIntrospection.models)) {
        const { name } = model;
        models[name] = {};
        Object.entries(graphQLOperationsInfo).forEach(([key, { operationPrefix }]) => {
            const operation = key;
            if (operation === 'LIST') {
                models[name][operationPrefix] = listFactory(client, modelIntrospection, model);
            }
            else if (SUBSCRIPTION_OPS.includes(operation)) {
                models[name][operationPrefix] = subscriptionFactory(client, modelIntrospection, model, operation);
            }
            else if (operation === 'OBSERVE_QUERY') {
                models[name][operationPrefix] = observeQueryFactory(models, model);
            }
            else {
                models[name][operationPrefix] = getFactory(client, modelIntrospection, model, operation);
            }
        });
    }
    return models;
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @private
 *
 * Creates a client that can be used to make GraphQL requests, using a provided `AmplifyClassV6`
 * compatible context object for config and auth fetching.
 *
 * @param params
 * @returns
 */
function generateClient(params) {
    const client = {
        [__amplify]: params.amplify,
        [__authMode]: params.authMode,
        [__authToken]: params.authToken,
        [__headers]: params.headers,
        graphql,
        cancel: cancel$1,
        isCancelError: isCancelError$1,
        models: {},
    };
    client.models = generateModelsProperty(client, params);
    return client;
}

/**
 * Generates an API client that can work with models or raw GraphQL
 */
function generateClient$1(options = {}) {
    return generateClient({
        ...options,
        amplify: Amplify,
    });
}

export { CONNECTION_STATE_CHANGE, ConnectionState, GraphQLAuthError, del$1 as del, generateClient$1 as generateClient, get$1 as get, head$1 as head, isCancelError, patch$1 as patch, post$1 as post, put$1 as put };

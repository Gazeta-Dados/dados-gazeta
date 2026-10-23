import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
  get: (a, b) => (typeof require < "u" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias"), DOC = Symbol.for("yaml.document"), MAP = Symbol.for("yaml.map"), PAIR = Symbol.for("yaml.pair"), SCALAR = Symbol.for("yaml.scalar"), SEQ = Symbol.for("yaml.seq"), NODE_TYPE = Symbol.for("yaml.node.type"), isAlias = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === ALIAS, isDocument = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === DOC, isMap = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === MAP, isPair = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === PAIR, isScalar = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === SCALAR, isSeq = (node) => !!node && typeof node == "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node == "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return !0;
        }
      return !1;
    }
    function isNode(node) {
      if (node && typeof node == "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return !0;
        }
      return !1;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity(), BREAK = Symbol("break visit"), SKIP = Symbol("skip children"), REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      let visitor_ = initVisitor(visitor);
      identity.isDocument(node) ? visit_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE && (node.contents = null) : visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      let ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl))
        return replaceNode(key, path, ctrl), visit_(key, ctrl, visitor, path);
      if (typeof ctrl != "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            let ci = visit_(i, node.items[i], visitor, path);
            if (typeof ci == "number")
              i = ci - 1;
            else {
              if (ci === BREAK)
                return BREAK;
              ci === REMOVE && (node.items.splice(i, 1), i -= 1);
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          let ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          ck === REMOVE && (node.key = null);
          let cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          cv === REMOVE && (node.value = null);
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      let visitor_ = initVisitor(visitor);
      identity.isDocument(node) ? await visitAsync_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE && (node.contents = null) : await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      let ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl))
        return replaceNode(key, path, ctrl), visitAsync_(key, ctrl, visitor, path);
      if (typeof ctrl != "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            let ci = await visitAsync_(i, node.items[i], visitor, path);
            if (typeof ci == "number")
              i = ci - 1;
            else {
              if (ci === BREAK)
                return BREAK;
              ci === REMOVE && (node.items.splice(i, 1), i -= 1);
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          let ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          ck === REMOVE && (node.key = null);
          let cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          cv === REMOVE && (node.value = null);
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      return typeof visitor == "object" && (visitor.Collection || visitor.Node || visitor.Value) ? Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor) : visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor == "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
    }
    function replaceNode(key, path, node) {
      let parent = path[path.length - 1];
      if (identity.isCollection(parent))
        parent.items[key] = node;
      else if (identity.isPair(parent))
        key === "key" ? parent.key = node : parent.value = node;
      else if (identity.isDocument(parent))
        parent.contents = node;
      else {
        let pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity(), visit = require_visit(), escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    }, escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]), Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, _Directives.defaultYaml, yaml), this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        let copy = new _Directives(this.yaml, this.tags);
        return copy.docStart = this.docStart, copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        let res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = !0;
            break;
          case "1.2":
            this.atNextDocument = !1, this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            }, this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        this.atNextDocument && (this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, _Directives.defaultTags), this.atNextDocument = !1);
        let parts = line.trim().split(/[ \t]+/), name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2 && (onError(0, "%TAG directive should contain exactly two parts"), parts.length < 2))
              return !1;
            let [handle, prefix] = parts;
            return this.tags[handle] = prefix, !0;
          }
          case "%YAML": {
            if (this.yaml.explicit = !0, parts.length !== 1)
              return onError(0, "%YAML directive should contain exactly one part"), !1;
            let [version] = parts;
            if (version === "1.1" || version === "1.2")
              return this.yaml.version = version, !0;
            {
              let isValid = /^\d+\.\d+$/.test(version);
              return onError(6, `Unsupported YAML version ${version}`, isValid), !1;
            }
          }
          default:
            return onError(0, `Unknown directive ${name}`, !0), !1;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!")
          return onError(`Not a valid tag: ${source}`), null;
        if (source[1] === "<") {
          let verbatim = source.slice(2, -1);
          return verbatim === "!" || verbatim === "!!" ? (onError(`Verbatim tags aren't resolved, so ${source} is invalid.`), null) : (source[source.length - 1] !== ">" && onError("Verbatim tags must end with a >"), verbatim);
        }
        let [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        suffix || onError(`The ${source} tag has no suffix`);
        let prefix = this.tags[handle];
        if (prefix)
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            return onError(String(error)), null;
          }
        return handle === "!" ? source : (onError(`Could not resolve tag: ${source}`), null);
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (let [handle, prefix] of Object.entries(this.tags))
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        let lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], tagEntries = Object.entries(this.tags), tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          let tags = {};
          visit.visit(doc.contents, (_key, node) => {
            identity.isNode(node) && node.tag && (tags[node.tag] = !0);
          }), tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (let [handle, prefix] of tagEntries)
          handle === "!!" && prefix === "tag:yaml.org,2002:" || (!doc || tagNames.some((tn) => tn.startsWith(prefix))) && lines.push(`%TAG ${handle} ${prefix}`);
        return lines.join(`
`);
      }
    };
    Directives.defaultYaml = { explicit: !1, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity(), visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        let msg = `Anchor must not contain whitespace or control characters: ${JSON.stringify(anchor)}`;
        throw new Error(msg);
      }
      return !0;
    }
    function anchorNames(root) {
      let anchors = /* @__PURE__ */ new Set();
      return visit.visit(root, {
        Value(_key, node) {
          node.anchor && anchors.add(node.anchor);
        }
      }), anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; ; ++i) {
        let name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      let aliasObjects = [], sourceObjects = /* @__PURE__ */ new Map(), prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source), prevAnchors ?? (prevAnchors = anchorNames(doc));
          let anchor = findNewAnchor(prefix, prevAnchors);
          return prevAnchors.add(anchor), anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (let source of aliasObjects) {
            let ref = sourceObjects.get(source);
            if (typeof ref == "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node)))
              ref.node.anchor = ref.anchor;
            else {
              let error = new Error("Failed to resolve repeated object (this should not happen)");
              throw error.source = source, error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val == "object")
        if (Array.isArray(val))
          for (let i = 0, len = val.length; i < len; ++i) {
            let v0 = val[i], v1 = applyReviver(reviver, val, String(i), v0);
            v1 === void 0 ? delete val[i] : v1 !== v0 && (val[i] = v1);
          }
        else if (val instanceof Map)
          for (let k of Array.from(val.keys())) {
            let v0 = val.get(k), v1 = applyReviver(reviver, val, k, v0);
            v1 === void 0 ? val.delete(k) : v1 !== v0 && val.set(k, v1);
          }
        else if (val instanceof Set)
          for (let v0 of Array.from(val)) {
            let v1 = applyReviver(reviver, val, v0, v0);
            v1 === void 0 ? val.delete(v0) : v1 !== v0 && (val.delete(v0), val.add(v1));
          }
        else
          for (let [k, v0] of Object.entries(val)) {
            let v1 = applyReviver(reviver, val, k, v0);
            v1 === void 0 ? delete val[k] : v1 !== v0 && (val[k] = v1);
          }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON == "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        let data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data), ctx.onCreate = (res2) => {
          data.res = res2, delete ctx.onCreate;
        };
        let res = value.toJSON(arg, ctx);
        return ctx.onCreate && ctx.onCreate(res), res;
      }
      return typeof value == "bigint" && !ctx?.keep ? Number(value) : value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver(), identity = require_identity(), toJS = require_toJS(), NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        let copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return this.range && (copy.range = this.range.slice()), copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        let ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: !0,
          mapAsMap: mapAsMap === !0,
          mapKeyWarned: !1,
          maxAliasCount: typeof maxAliasCount == "number" ? maxAliasCount : 100
        }, res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor == "function")
          for (let { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver == "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors(), visit = require_visit(), identity = require_identity(), Node = require_Node(), toJS = require_toJS(), Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS), this.source = source, Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        ctx?.aliasResolveCache ? nodes = ctx.aliasResolveCache : (nodes = [], visit.visit(doc, {
          Node: (_key, node) => {
            (identity.isAlias(node) || identity.hasAnchor(node)) && nodes.push(node);
          }
        }), ctx && (ctx.aliasResolveCache = nodes));
        let found;
        for (let node of nodes) {
          if (node === this)
            break;
          node.anchor === this.source && (found = node);
        }
        if (found && ctx) {
          let { anchors: anchors2, doc: doc2, maxAliasCount } = ctx, data = anchors2.get(found);
          if (data || (toJS.toJS(found, null, ctx), data = anchors2.get(found)), data?.res === void 0) {
            let msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0 && (data.count += 1, data.aliasCount === 0 && (data.aliasCount = getAliasCount(doc2, found, anchors2)), data.count * data.aliasCount > maxAliasCount)) {
            let msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        let source = this.resolve(ctx.doc, ctx);
        if (!source) {
          let msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        let src = `*${this.source}`;
        if (ctx) {
          if (anchors.anchorIsValid(this.source), ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            let msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        let source = node.resolve(doc), anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (let item of node.items) {
          let c = getAliasCount(doc, item, anchors2);
          c > count && (count = c);
        }
        return count;
      } else if (identity.isPair(node)) {
        let kc = getAliasCount(doc, node.key, anchors2), vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity(), Node = require_Node(), toJS = require_toJS(), isScalarValue = (value) => !value || typeof value != "function" && typeof value != "object", Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR), this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias(), identity = require_identity(), Scalar = require_Scalar(), defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        let match = tags.filter((t) => t.tag === tagName), tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value) && (value = value.contents), identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        let map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        return map.items.push(value), map;
      }
      (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt < "u" && value instanceof BigInt) && (value = value.valueOf());
      let { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx, ref;
      if (aliasDuplicateObjects && value && typeof value == "object") {
        if (ref = sourceObjects.get(value), ref)
          return ref.anchor ?? (ref.anchor = onAnchor(value)), new Alias.Alias(ref.anchor);
        ref = { anchor: null, node: null }, sourceObjects.set(value, ref);
      }
      tagName?.startsWith("!!") && (tagName = defaultTagPrefix + tagName.slice(2));
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON == "function" && (value = value.toJSON()), !value || typeof value != "object") {
          let node2 = new Scalar.Scalar(value);
          return ref && (ref.node = node2), node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      onTagObj && (onTagObj(tagObj), delete ctx.onTagObj);
      let node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from == "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      return tagName ? node.tag = tagName : tagObj.default || (node.tag = tagObj.tag), ref && (ref.node = node), node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode(), identity = require_identity(), Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v = value;
      for (let i = path.length - 1; i >= 0; --i) {
        let k = path[i];
        if (typeof k == "number" && Number.isInteger(k) && k >= 0) {
          let a = [];
          a[k] = v, v = a;
        } else
          v = /* @__PURE__ */ new Map([[k, v]]);
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: !1,
        keepUndefined: !1,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path == "object" && !!path[Symbol.iterator]().next().done, Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type), Object.defineProperty(this, "schema", {
          value: schema,
          configurable: !0,
          enumerable: !1,
          writable: !0
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        let copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return schema && (copy.schema = schema), copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it), this.range && (copy.range = this.range.slice()), copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          let [key, ...rest] = path, node = this.get(key, !0);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        let [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        let node = this.get(key, !0);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        let [key, ...rest] = path, node = this.get(key, !0);
        return rest.length === 0 ? !keepScalar && identity.isScalar(node) ? node.value : node : identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return !1;
          let n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        let [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        let node = this.get(key, !0);
        return identity.isCollection(node) ? node.hasIn(rest) : !1;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        let [key, ...rest] = path;
        if (rest.length === 0)
          this.set(key, value);
        else {
          let node = this.get(key, !0);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      return /^\n+$/.test(comment) ? comment.substring(1) : indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith(`
`) ? indentComment(comment, indent) : comment.includes(`
`) ? `
` + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow", FOLD_BLOCK = "block", FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      lineWidth < minContentWidth && (minContentWidth = 0);
      let endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      let folds = [], escapedFolds = {}, end = lineWidth - indent.length;
      typeof indentAtStart == "number" && (indentAtStart > lineWidth - Math.max(2, minContentWidth) ? folds.push(0) : end = lineWidth - indentAtStart);
      let split, prev, overflow = !1, i = -1, escStart = -1, escEnd = -1;
      mode === FOLD_BLOCK && (i = consumeMoreIndentedLines(text, i, indent.length), i !== -1 && (end = i + endStep));
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          switch (escStart = i, text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === `
`)
          mode === FOLD_BLOCK && (i = consumeMoreIndentedLines(text, i, indent.length)), end = i + indent.length + endStep, split = void 0;
        else {
          if (ch === " " && prev && prev !== " " && prev !== `
` && prev !== "	") {
            let next = text[i + 1];
            next && next !== " " && next !== `
` && next !== "	" && (split = i);
          }
          if (i >= end)
            if (split)
              folds.push(split), end = split + endStep, split = void 0;
            else if (mode === FOLD_QUOTED) {
              for (; prev === " " || prev === "	"; )
                prev = ch, ch = text[i += 1], overflow = !0;
              let j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j), escapedFolds[j] = !0, end = j + endStep, split = void 0;
            } else
              overflow = !0;
        }
        prev = ch;
      }
      if (overflow && onOverflow && onOverflow(), folds.length === 0)
        return text;
      onFold && onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        let fold = folds[i2], end2 = folds[i2 + 1] || text.length;
        fold === 0 ? res = `
${indent}${text.slice(0, end2)}` : (mode === FOLD_QUOTED && escapedFolds[fold] && (res += `${text[fold]}\\`), res += `
${indent}${text.slice(fold + 1, end2)}`);
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i, start = i + 1, ch = text[start];
      for (; ch === " " || ch === "	"; )
        if (i < start + indent)
          ch = text[++i];
        else {
          do
            ch = text[++i];
          while (ch && ch !== `
`);
          end = i, start = i + 1, ch = text[start];
        }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), foldFlowLines = require_foldFlowLines(), getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    }), containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return !1;
      let limit = lineWidth - indentLength, strLen = str.length;
      if (strLen <= limit)
        return !1;
      for (let i = 0, start = 0; i < strLen; ++i)
        if (str[i] === `
`) {
          if (i - start > limit)
            return !0;
          if (start = i + 1, strLen - start <= limit)
            return !1;
        }
      return !0;
    }
    function doubleQuotedString(value, ctx) {
      let json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      let { implicitKey } = ctx, minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength, indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), str = "", start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i])
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n" && (str += json.slice(start, i) + "\\ ", i += 1, start = i, ch = "\\"), ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                let code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    code.substr(0, 2) === "00" ? str += "\\x" + code.substr(2) : str += json.substr(i, 6);
                }
                i += 5, start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength)
                i += 1;
              else {
                for (str += json.slice(start, i) + `

`; json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"'; )
                  str += `
`, i += 2;
                str += indent, json[i + 2] === " " && (str += "\\"), i += 1, start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      return str = start ? str + json.slice(start) : json, implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, !1));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === !1 || ctx.implicitKey && value.includes(`
`) || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      let indent = ctx.indent || (containsDocumentMarker(value) ? "  " : ""), res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, !1));
    }
    function quotedString(value, ctx) {
      let { singleQuote } = ctx.options, qs;
      if (singleQuote === !1)
        qs = doubleQuotedString;
      else {
        let hasDouble = value.includes('"'), hasSingle = value.includes("'");
        hasDouble && !hasSingle ? qs = singleQuotedString : hasSingle && !hasDouble ? qs = doubleQuotedString : qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      let { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value))
        return quotedString(value, ctx);
      let indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : ""), literal = blockQuote === "literal" ? !0 : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? !1 : type === Scalar.Scalar.BLOCK_LITERAL ? !0 : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? `|
` : `>
`;
      let chomp, endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        let ch = value[endStart - 1];
        if (ch !== `
` && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart), endNlPos = end.indexOf(`
`);
      endNlPos === -1 ? chomp = "-" : value === end || endNlPos !== end.length - 1 ? (chomp = "+", onChompKeep && onChompKeep()) : chomp = "", end && (value = value.slice(0, -end.length), end[end.length - 1] === `
` && (end = end.slice(0, -1)), end = end.replace(blockEndNewlines, `$&${indent}`));
      let startWithSpace = !1, startEnd, startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        let ch = value[startEnd];
        if (ch === " ")
          startWithSpace = !0;
        else if (ch === `
`)
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      start && (value = value.substring(start.length), start = start.replace(/\n+/g, `$&${indent}`));
      let header = (startWithSpace ? indent ? "2" : "1" : "") + chomp;
      if (comment && (header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " ")), onComment && onComment()), !literal) {
        let foldedValue = value.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`), literalFallback = !1, foldOptions = getFoldOptions(ctx, !0);
        blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED && (foldOptions.onOverflow = () => {
          literalFallback = !0;
        });
        let body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      return value = value.replace(/\n+/g, `$&${indent}`), `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      let { type, value } = item, { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes(`
`) || inFlow && /[[\]{},]/.test(value))
        return quotedString(value, ctx);
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value))
        return implicitKey || inFlow || !value.includes(`
`) ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes(`
`))
        return blockString(item, ctx, onComment, onChompKeep);
      if (containsDocumentMarker(value)) {
        if (indent === "")
          return ctx.forceBlockIndent = !0, blockString(item, ctx, onComment, onChompKeep);
        if (implicitKey && indent === indentStep)
          return quotedString(value, ctx);
      }
      let str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        let test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str), { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, !1));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      let { implicitKey, inFlow } = ctx, ss = typeof item.value == "string" ? item : Object.assign({}, item, { value: String(item.value) }), { type } = item;
      type !== Scalar.Scalar.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value) && (type = Scalar.Scalar.QUOTE_DOUBLE);
      let _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      }, res = _stringify(type);
      if (res === null) {
        let { defaultKeyType, defaultStringType } = ctx.options, t = implicitKey && defaultKeyType || defaultStringType;
        if (res = _stringify(t), res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors(), identity = require_identity(), stringifyComment = require_stringifyComment(), stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      let opt = Object.assign({
        blockQuote: !0,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: !1,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: !0,
        indentSeq: !0,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: !1,
        singleQuote: null,
        trailingComma: !1,
        trueStr: "true",
        verifyAliasOrder: !0
      }, doc.schema.toStringOptions, options), inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = !1;
          break;
        case "flow":
          inFlow = !0;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent == "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        let match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj, obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          let testMatch = match.filter((t) => t.test);
          testMatch.length > 0 && (match = testMatch);
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else
        obj = item, tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      if (!tagObj) {
        let name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      let props = [], anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      anchor && anchors.anchorIsValid(anchor) && (anchors$1.add(anchor), props.push(`&${anchor}`));
      let tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      return tag && props.push(doc.directives.tagString(tag)), props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item))
          throw new TypeError("Cannot stringify circular structure without alias nodes");
        ctx.resolvedAliases ? ctx.resolvedAliases.add(item) : ctx.resolvedAliases = /* @__PURE__ */ new Set([item]), item = item.resolve(ctx.doc);
      }
      let tagObj, node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      let props = stringifyProps(node, tagObj, ctx);
      props.length > 0 && (ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1);
      let str = typeof tagObj.stringify == "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      return props ? identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}` : str;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity(), Scalar = require_Scalar(), stringify = require_stringify(), stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      let { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx, keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment)
          throw new Error("With simple keys, key nodes cannot have comments");
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key == "object") {
          let msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key == "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: !1,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = !1, chompKeep = !1, str = stringify.stringify(key, ctx, () => keyCommentDone = !0, () => chompKeep = !0);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = !0;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null)
          return keyCommentDone && onComment && onComment(), str === "" ? "?" : explicitKey ? `? ${str}` : str;
      } else if (allNullValues && !simpleKeys || value == null && explicitKey)
        return str = `? ${str}`, keyComment && !keyCommentDone ? str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment)) : chompKeep && onChompKeep && onChompKeep(), str;
      keyCommentDone && (keyComment = null), explicitKey ? (keyComment && (str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment))), str = `? ${str}
${indent}:`) : (str = `${str}:`, keyComment && (str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment))));
      let vsb, vcb, valueComment;
      identity.isNode(value) ? (vsb = !!value.spaceBefore, vcb = value.commentBefore, valueComment = value.comment) : (vsb = !1, vcb = null, valueComment = null, value && typeof value == "object" && (value = doc.createNode(value))), ctx.implicitKey = !1, !explicitKey && !keyComment && identity.isScalar(value) && (ctx.indentAtStart = str.length + 1), chompKeep = !1, !indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor && (ctx.indent = ctx.indent.substring(2));
      let valueCommentDone = !1, valueStr = stringify.stringify(value, ctx, () => valueCommentDone = !0, () => chompKeep = !0), ws = " ";
      if (keyComment || vsb || vcb) {
        if (ws = vsb ? `
` : "", vcb) {
          let cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        valueStr === "" && !ctx.inFlow ? ws === `
` && valueComment && (ws = `

`) : ws += `
${ctx.indent}`;
      } else if (!explicitKey && identity.isCollection(value)) {
        let vs0 = valueStr[0], nl0 = valueStr.indexOf(`
`), hasNewline = nl0 !== -1, flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = !1;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!" && (sp0 = valueStr.indexOf(" ", sp0 + 1)), (sp0 === -1 || nl0 < sp0) && (hasPropsLine = !0);
          }
          hasPropsLine || (ws = `
${ctx.indent}`);
        }
      } else (valueStr === "" || valueStr[0] === `
`) && (ws = "");
      return str += ws + valueStr, ctx.inFlow ? valueCommentDone && onComment && onComment() : valueComment && !valueCommentDone ? str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment)) : chompKeep && onChompKeep && onChompKeep(), str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      logLevel === "debug" && console.log(...messages);
    }
    function warn(logLevel, warning) {
      (logLevel === "debug" || logLevel === "warn") && (typeof node_process.emitWarning == "function" ? node_process.emitWarning(warning) : console.warn(warning));
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity(), Scalar = require_Scalar(), MERGE_KEY = "<<", merge = {
      identify: (value) => value === MERGE_KEY || typeof value == "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    }, isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      let source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (let it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (let it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      let source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      let srcMap = source.toJSON(null, ctx, Map);
      for (let [key, value2] of srcMap)
        map instanceof Map ? map.has(key) || map.set(key, value2) : map instanceof Set ? map.add(key) : Object.prototype.hasOwnProperty.call(map, key) || Object.defineProperty(map, key, {
          value: value2,
          writable: !0,
          enumerable: !0,
          configurable: !0
        });
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log(), merge = require_merge(), stringify = require_stringify(), identity = require_identity(), toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        let jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map)
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        else if (map instanceof Set)
          map.add(jsKey);
        else {
          let stringKey = stringifyKey(key, jsKey, ctx), jsValue = toJS.toJS(value, stringKey, ctx);
          stringKey in map ? Object.defineProperty(map, stringKey, {
            value: jsValue,
            writable: !0,
            enumerable: !0,
            configurable: !0
          }) : map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey != "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        let strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (let node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = !0, strCtx.inStringifyKey = !0;
        let strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          jsonStr.length > 40 && (jsonStr = jsonStr.substring(0, 36) + '..."'), log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`), ctx.mapKeyWarned = !0;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode(), stringifyPair = require_stringifyPair(), addPairToJSMap = require_addPairToJSMap(), identity = require_identity();
    function createPair(key, value, ctx) {
      let k = createNode.createNode(key, void 0, ctx), v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR }), this.key = key, this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        return identity.isNode(key) && (key = key.clone(schema)), identity.isNode(value) && (value = value.clone(schema)), new _Pair(key, value);
      }
      toJSON(_, ctx) {
        let pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity(), stringify = require_stringify(), stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      return (ctx.inFlow ?? collection.flow ? stringifyFlowCollection : stringifyBlockCollection)(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      let { indent, options: { commentString } } = ctx, itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null }), chompKeep = !1, lines = [];
      for (let i = 0; i < items.length; ++i) {
        let item = items[i], comment2 = null;
        if (identity.isNode(item))
          !chompKeep && item.spaceBefore && lines.push(""), addCommentBefore(ctx, lines, item.commentBefore, chompKeep), item.comment && (comment2 = item.comment);
        else if (identity.isPair(item)) {
          let ik = identity.isNode(item.key) ? item.key : null;
          ik && (!chompKeep && ik.spaceBefore && lines.push(""), addCommentBefore(ctx, lines, ik.commentBefore, chompKeep));
        }
        chompKeep = !1;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = !0);
        comment2 && (str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2))), chompKeep && comment2 && (chompKeep = !1), lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0)
        str = flowChars.start + flowChars.end;
      else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          let line = lines[i];
          str += line ? `
${indent}${line}` : `
`;
        }
      }
      return comment ? (str += `
` + stringifyComment.indentComment(commentString(comment), indent), onComment && onComment()) : chompKeep && onChompKeep && onChompKeep(), str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      let { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      let itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: !0,
        type: null
      }), reqNewline = !1, linesAtValue = 0, lines = [];
      for (let i = 0; i < items.length; ++i) {
        let item = items[i], comment = null;
        if (identity.isNode(item))
          item.spaceBefore && lines.push(""), addCommentBefore(ctx, lines, item.commentBefore, !1), item.comment && (comment = item.comment);
        else if (identity.isPair(item)) {
          let ik = identity.isNode(item.key) ? item.key : null;
          ik && (ik.spaceBefore && lines.push(""), addCommentBefore(ctx, lines, ik.commentBefore, !1), ik.comment && (reqNewline = !0));
          let iv = identity.isNode(item.value) ? item.value : null;
          iv ? (iv.comment && (comment = iv.comment), iv.commentBefore && (reqNewline = !0)) : item.value == null && ik?.comment && (comment = ik.comment);
        }
        comment && (reqNewline = !0);
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes(`
`)), i < items.length - 1 ? str += "," : ctx.options.trailingComma && (ctx.options.lineWidth > 0 && (reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth)), reqNewline && (str += ",")), comment && (str += stringifyComment.lineComment(str, itemIndent, commentString(comment))), lines.push(str), linesAtValue = lines.length;
      }
      let { start, end } = flowChars;
      if (lines.length === 0)
        return start + end;
      if (!reqNewline) {
        let len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (let line of lines)
          str += line ? `
${indentStep}${indent}${line}` : `
`;
        return `${str}
${indent}${end}`;
      } else
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep && (comment = comment.replace(/^\n+/, "")), comment) {
        let ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection(), addPairToJSMap = require_addPairToJSMap(), Collection = require_Collection(), identity = require_identity(), Pair = require_Pair(), Scalar = require_Scalar();
    function findPair(items, key) {
      let k = identity.isScalar(key) ? key.value : key;
      for (let it of items)
        if (identity.isPair(it) && (it.key === key || it.key === k || identity.isScalar(it.key) && it.key.value === k))
          return it;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema), this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        let { keepUndefined, replacer } = ctx, map = new this(schema), add = (key, value) => {
          if (typeof replacer == "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          (value !== void 0 || keepUndefined) && map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map)
          for (let [key, value] of obj)
            add(key, value);
        else if (obj && typeof obj == "object")
          for (let key of Object.keys(obj))
            add(key, obj[key]);
        return typeof schema.sortMapEntries == "function" && map.items.sort(schema.sortMapEntries), map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        identity.isPair(pair) ? _pair = pair : !pair || typeof pair != "object" || !("key" in pair) ? _pair = new Pair.Pair(pair, pair?.value) : _pair = new Pair.Pair(pair.key, pair.value);
        let prev = findPair(this.items, _pair.key), sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value) ? prev.value.value = _pair.value : prev.value = _pair.value;
        } else if (sortEntries) {
          let i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          i === -1 ? this.items.push(_pair) : this.items.splice(i, 0, _pair);
        } else
          this.items.push(_pair);
      }
      delete(key) {
        let it = findPair(this.items, key);
        return it ? this.items.splice(this.items.indexOf(it), 1).length > 0 : !1;
      }
      get(key, keepScalar) {
        let node = findPair(this.items, key)?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), !0);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        let map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        ctx?.onCreate && ctx.onCreate(map);
        for (let item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (let item of this.items)
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        return !ctx.allNullValues && this.hasAllNullValues(!1) && (ctx = Object.assign({}, ctx, { allNullValues: !0 })), stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity(), YAMLMap = require_YAMLMap(), map = {
      collection: "map",
      default: !0,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        return identity.isMap(map2) || onError("Expected a mapping for this tag"), map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode(), stringifyCollection = require_stringifyCollection(), Collection = require_Collection(), identity = require_identity(), Scalar = require_Scalar(), toJS = require_toJS(), YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema), this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        let idx = asItemIndex(key);
        return typeof idx != "number" ? !1 : this.items.splice(idx, 1).length > 0;
      }
      get(key, keepScalar) {
        let idx = asItemIndex(key);
        if (typeof idx != "number")
          return;
        let it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        let idx = asItemIndex(key);
        return typeof idx == "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        let idx = asItemIndex(key);
        if (typeof idx != "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        let prev = this.items[idx];
        identity.isScalar(prev) && Scalar.isScalarValue(value) ? prev.value = value : this.items[idx] = value;
      }
      toJSON(_, ctx) {
        let seq = [];
        ctx?.onCreate && ctx.onCreate(seq);
        let i = 0;
        for (let item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx ? stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        }) : JSON.stringify(this);
      }
      static from(schema, obj, ctx) {
        let { replacer } = ctx, seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer == "function") {
              let key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      return idx && typeof idx == "string" && (idx = Number(idx)), typeof idx == "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity(), YAMLSeq = require_YAMLSeq(), seq = {
      collection: "seq",
      default: !0,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        return identity.isSeq(seq2) || onError("Expected a sequence for this tag"), seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString(), string = {
      identify: (value) => typeof value == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        return ctx = Object.assign({ actualString: !0 }, ctx), stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source == "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), boolTag = {
      identify: (value) => typeof value == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          let sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value == "bigint")
        return String(value);
      let num = typeof value == "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        i < 0 && (i = n.length, n += ".");
        let d = minFractionDigits - (n.length - i - 1);
        for (; d-- > 0; )
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), stringifyNumber = require_stringifyNumber(), floatNaN = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    }, floatExp = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        let num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    }, float = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        let node = new Scalar.Scalar(parseFloat(str)), dot = str.indexOf(".");
        return dot !== -1 && str[str.length - 1] === "0" && (node.minFractionDigits = str.length - dot - 1), node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber(), intIdentify = (value) => typeof value == "bigint" || Number.isInteger(value), intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      let { value } = node;
      return intIdentify(value) && value >= 0 ? prefix + value.toString(radix) : stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    }, int = {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    }, intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map(), _null = require_null(), seq = require_seq(), string = require_string(), bool = require_bool(), float = require_float(), int = require_int(), schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), map = require_map(), seq = require_seq();
    function intIdentify(value) {
      return typeof value == "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value), jsonScalars = [
      {
        identify: (value) => typeof value == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ], jsonError = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        return onError(`Unresolved plain scalar ${JSON.stringify(str)}`), str;
      }
    }, schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer"), Scalar = require_Scalar(), stringifyString = require_stringifyString(), binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer == "function")
          return node_buffer.Buffer.from(src, "base64");
        if (typeof atob == "function") {
          let str = atob(src.replace(/[\n\r]/g, "")), buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else
          return onError("This environment does not support reading binary tags; either Buffer or atob is required"), src;
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        let buf = value, str;
        if (typeof node_buffer.Buffer == "function")
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if (type ?? (type = Scalar.Scalar.BLOCK_LITERAL), type !== Scalar.Scalar.QUOTE_DOUBLE) {
          let lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth), n = Math.ceil(str.length / lineWidth), lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth)
            lines[i] = str.substr(o, lineWidth);
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? `
` : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity(), Pair = require_Pair(), Scalar = require_Scalar(), YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq))
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (!identity.isPair(item)) {
            if (identity.isMap(item)) {
              item.items.length > 1 && onError("Each pair must have its own sequence indicator");
              let pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
              if (item.commentBefore && (pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore), item.comment) {
                let cn = pair.value ?? pair.key;
                cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
              }
              item = pair;
            }
            seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
          }
        }
      else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      let { replacer } = ctx, pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          typeof replacer == "function" && (it = replacer.call(iterable, String(i++), it));
          let key, value;
          if (Array.isArray(it))
            if (it.length === 2)
              key = it[0], value = it[1];
            else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          else if (it && it instanceof Object) {
            let keys = Object.keys(it);
            if (keys.length === 1)
              key = keys[0], value = it[key];
            else
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
          } else
            key = it;
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: !1,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity(), toJS = require_toJS(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), pairs = require_pairs(), YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super(), this.add = YAMLMap.YAMLMap.prototype.add.bind(this), this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this), this.get = YAMLMap.YAMLMap.prototype.get.bind(this), this.has = YAMLMap.YAMLMap.prototype.has.bind(this), this.set = YAMLMap.YAMLMap.prototype.set.bind(this), this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        let map = /* @__PURE__ */ new Map();
        ctx?.onCreate && ctx.onCreate(map);
        for (let pair of this.items) {
          let key, value;
          if (identity.isPair(pair) ? (key = toJS.toJS(pair.key, "", ctx), value = toJS.toJS(pair.value, key, ctx)) : key = toJS.toJS(pair, "", ctx), map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        let pairs$1 = pairs.createPairs(schema, iterable, ctx), omap2 = new this();
        return omap2.items = pairs$1.items, omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: !1,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        let pairs$1 = pairs.resolvePairs(seq, onError), seenKeys = [];
        for (let { key } of pairs$1.items)
          identity.isScalar(key) && (seenKeys.includes(key.value) ? onError(`Ordered maps must not include duplicate keys: ${key.value}`) : seenKeys.push(key.value));
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      return source && (value ? trueTag : falseTag).test.test(source) ? source : value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(!0),
      stringify: boolStringify
    }, falseTag = {
      identify: (value) => value === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(!1),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), stringifyNumber = require_stringifyNumber(), floatNaN = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    }, floatExp = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        let num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    }, float = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        let node = new Scalar.Scalar(parseFloat(str.replace(/_/g, ""))), dot = str.indexOf(".");
        if (dot !== -1) {
          let f = str.substring(dot + 1).replace(/_/g, "");
          f[f.length - 1] === "0" && (node.minFractionDigits = f.length);
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber(), intIdentify = (value) => typeof value == "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      let sign = str[0];
      if ((sign === "-" || sign === "+") && (offset += 1), str = str.substring(offset).replace(/_/g, ""), intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        let n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      let n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      let { value } = node;
      if (intIdentify(value)) {
        let str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    }, intOct = {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    }, int = {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    }, intHex = {
      identify: intIdentify,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity(), Pair = require_Pair(), YAMLMap = require_YAMLMap(), YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema), this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        identity.isPair(key) ? pair = key : key && typeof key == "object" && "key" in key && "value" in key && key.value === null ? pair = new Pair.Pair(key.key, null) : pair = new Pair.Pair(key, null), YAMLMap.findPair(this.items, pair.key) || this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        let pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        let prev = YAMLMap.findPair(this.items, key);
        prev && !value ? this.items.splice(this.items.indexOf(prev), 1) : !prev && value && this.items.push(new Pair.Pair(key));
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(!0))
          return super.toString(Object.assign({}, ctx, { allNullValues: !0 }), onComment, onChompKeep);
        throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        let { replacer } = ctx, set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable)
            typeof replacer == "function" && (value = replacer.call(iterable, value, value)), set2.items.push(Pair.createPair(value, null, ctx));
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: !1,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(!0))
            return Object.assign(new YAMLSet(), map);
          onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      let sign = str[0], parts = sign === "-" || sign === "+" ? str.substring(1) : str, num = (n) => asBigInt ? BigInt(n) : Number(n), res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node, num = (n) => n;
      if (typeof value == "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      value < 0 && (sign = "-", value *= num(-1));
      let _60 = num(60), parts = [value % _60];
      return value < 60 ? parts.unshift(0) : (value = (value - parts[0]) / _60, parts.unshift(value % _60), value >= 60 && (value = (value - parts[0]) / _60, parts.unshift(value))), sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value == "bigint" || Number.isInteger(value),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    }, floatTime = {
      identify: (value) => typeof value == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, !1),
      stringify: stringifySexagesimal
    }, timestamp = {
      identify: (value) => value instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        let match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, year, month, day, hour, minute, second] = match.map(Number), millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0, date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec), tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, !1);
          Math.abs(d) < 30 && (d *= 60), date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map(), _null = require_null(), seq = require_seq(), string = require_string(), binary = require_binary(), bool = require_bool2(), float = require_float2(), int = require_int2(), merge = require_merge(), omap = require_omap(), pairs = require_pairs(), set = require_set(), timestamp = require_timestamp(), schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map(), _null = require_null(), seq = require_seq(), string = require_string(), bool = require_bool(), float = require_float(), int = require_int(), schema = require_schema(), schema$1 = require_schema2(), binary = require_binary(), merge = require_merge(), omap = require_omap(), pairs = require_pairs(), schema$2 = require_schema3(), set = require_set(), timestamp = require_timestamp(), schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]), tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    }, coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      let schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags)
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      let tags = schemaTags;
      if (!tags)
        if (Array.isArray(customTags))
          tags = [];
        else {
          let keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      if (Array.isArray(customTags))
        for (let tag of customTags)
          tags = tags.concat(tag);
      else typeof customTags == "function" && (tags = customTags(tags.slice()));
      return addMergeTag && (tags = tags.concat(merge.merge)), tags.reduce((tags2, tag) => {
        let tagObj = typeof tag == "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          let tagName = JSON.stringify(tag), keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        return tags2.includes(tagObj) || tags2.push(tagObj), tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity(), map = require_map(), seq = require_seq(), string = require_string(), tags = require_tags(), sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0, Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null, this.name = typeof schema == "string" && schema || "core", this.knownTags = resolveKnownTags ? tags.coreKnownTags : {}, this.tags = tags.getTags(customTags, this.name, merge), this.toStringOptions = toStringDefaults ?? null, Object.defineProperty(this, identity.MAP, { value: map.map }), Object.defineProperty(this, identity.SCALAR, { value: string.string }), Object.defineProperty(this, identity.SEQ, { value: seq.seq }), this.sortMapEntries = typeof sortMapEntries == "function" ? sortMapEntries : sortMapEntries === !0 ? sortMapEntriesByKey : null;
      }
      clone() {
        let copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        return copy.tags = this.tags.slice(), copy;
      }
    };
    exports.Schema = Schema;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity(), stringify = require_stringify(), stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      let lines = [], hasDirectives = options.directives === !0;
      if (options.directives !== !1 && doc.directives) {
        let dir = doc.directives.toString(doc);
        dir ? (lines.push(dir), hasDirectives = !0) : doc.directives.docStart && (hasDirectives = !0);
      }
      hasDirectives && lines.push("---");
      let ctx = stringify.createStringifyContext(doc, options), { commentString } = ctx.options;
      if (doc.commentBefore) {
        lines.length !== 1 && lines.unshift("");
        let cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = !1, contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives && lines.push(""), doc.contents.commentBefore) {
            let cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment, contentComment = doc.contents.comment;
        }
        let onChompKeep = contentComment ? void 0 : () => chompKeep = !0, body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        contentComment && (body += stringifyComment.lineComment(body, "", commentString(contentComment))), (body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---" ? lines[lines.length - 1] = `--- ${body}` : lines.push(body);
      } else
        lines.push(stringify.stringify(doc.contents, ctx));
      if (doc.directives?.docEnd)
        if (doc.comment) {
          let cs = commentString(doc.comment);
          cs.includes(`
`) ? (lines.push("..."), lines.push(stringifyComment.indentComment(cs, ""))) : lines.push(`... ${cs}`);
        } else
          lines.push("...");
      else {
        let dc = doc.comment;
        dc && chompKeep && (dc = dc.replace(/^\n+/, "")), dc && ((!chompKeep || contentComment) && lines[lines.length - 1] !== "" && lines.push(""), lines.push(stringifyComment.indentComment(commentString(dc), "")));
      }
      return lines.join(`
`) + `
`;
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias(), Collection = require_Collection(), identity = require_identity(), Pair = require_Pair(), toJS = require_toJS(), Schema = require_Schema(), stringifyDocument = require_stringifyDocument(), anchors = require_anchors(), applyReviver = require_applyReviver(), createNode = require_createNode(), directives = require_directives(), Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        typeof replacer == "function" || Array.isArray(replacer) ? _replacer = replacer : options === void 0 && replacer && (options = replacer, replacer = void 0);
        let opt = Object.assign({
          intAsBigInt: !1,
          keepSourceTokens: !1,
          logLevel: "warn",
          prettyErrors: !0,
          strict: !0,
          stringKeys: !1,
          uniqueKeys: !0,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        options?._directives ? (this.directives = options._directives.atDocument(), this.directives.yaml.explicit && (version = this.directives.yaml.version)) : this.directives = new directives.Directives({ version }), this.setSchema(version, options), this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        let copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        return copy.commentBefore = this.commentBefore, copy.comment = this.comment, copy.errors = this.errors.slice(), copy.warnings = this.warnings.slice(), copy.options = Object.assign({}, this.options), this.directives && (copy.directives = this.directives.clone()), copy.schema = this.schema.clone(), copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents, this.range && (copy.range = this.range.slice()), copy;
      }
      /** Adds a value to the document. */
      add(value) {
        assertCollection(this.contents) && this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        assertCollection(this.contents) && this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          let prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer;
        if (typeof replacer == "function")
          value = replacer.call({ "": value }, "", value), _replacer = replacer;
        else if (Array.isArray(replacer)) {
          let keyToStr = (v) => typeof v == "number" || v instanceof String || v instanceof Number, asStr = replacer.filter(keyToStr).map(String);
          asStr.length > 0 && (replacer = replacer.concat(asStr)), _replacer = replacer;
        } else options === void 0 && replacer && (options = replacer, replacer = void 0);
        let { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {}, { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        ), ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? !0,
          keepUndefined: keepUndefined ?? !1,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        }, node = createNode.createNode(value, tag, ctx);
        return flow && identity.isCollection(node) && (node.flow = !0), setAnchors(), node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        let k = this.createNode(key, null, options), v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : !1;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        return Collection.isEmptyPath(path) ? this.contents == null ? !1 : (this.contents = null, !0) : assertCollection(this.contents) ? this.contents.deleteIn(path) : !1;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        return Collection.isEmptyPath(path) ? !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents : identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : !1;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        return Collection.isEmptyPath(path) ? this.contents !== void 0 : identity.isCollection(this.contents) ? this.contents.hasIn(path) : !1;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        this.contents == null ? this.contents = Collection.collectionFromPath(this.schema, [key], value) : assertCollection(this.contents) && this.contents.set(key, value);
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        Collection.isEmptyPath(path) ? this.contents = value : this.contents == null ? this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value) : assertCollection(this.contents) && this.contents.setIn(path, value);
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        typeof version == "number" && (version = String(version));
        let opt;
        switch (version) {
          case "1.1":
            this.directives ? this.directives.yaml.version = "1.1" : this.directives = new directives.Directives({ version: "1.1" }), opt = { resolveKnownTags: !1, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            this.directives ? this.directives.yaml.version = version : this.directives = new directives.Directives({ version }), opt = { resolveKnownTags: !0, schema: "core" };
            break;
          case null:
            this.directives && delete this.directives, opt = null;
            break;
          default: {
            let sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error("With a null YAML version, the { schema: Schema } option is required");
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        let ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === !0,
          mapKeyWarned: !1,
          maxAliasCount: typeof maxAliasCount == "number" ? maxAliasCount : 100
        }, res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor == "function")
          for (let { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver == "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: !0, jsonArg, mapAsMap: !1, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          let s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return !0;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super(), this.name = name, this.code = code, this.message = message, this.pos = pos;
      }
    }, YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    }, YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    }, prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      let { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1, lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        let trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart), ci -= trimStart - 1;
      }
      if (lineStr.length > 80 && (lineStr = lineStr.substring(0, 79) + "\u2026"), line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        prev.length > 80 && (prev = prev.substring(0, 79) + `\u2026
`), lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1, end = error.linePos[1];
        end?.line === line && end.col > col && (count = Math.max(1, Math.min(end.col - col, 80 - ci)));
        let pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = !1, atNewline = startOnNewline, hasSpace = startOnNewline, comment = "", commentSep = "", hasNewline = !1, reqSpace = !1, tab = null, anchor = null, tag = null, newlineAfterProp = null, comma = null, found = null, start = null;
      for (let token of tokens)
        switch (reqSpace && (token.type !== "space" && token.type !== "newline" && token.type !== "comma" && onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), reqSpace = !1), tab && (atNewline && token.type !== "comment" && token.type !== "newline" && onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), tab = null), token.type) {
          case "space":
            !flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	") && (tab = token), hasSpace = !0;
            break;
          case "comment": {
            hasSpace || onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let cb = token.source.substring(1) || " ";
            comment ? comment += commentSep + cb : comment = cb, commentSep = "", atNewline = !1;
            break;
          }
          case "newline":
            atNewline ? comment ? comment += token.source : (!found || indicator !== "seq-item-ind") && (spaceBefore = !0) : commentSep += token.source, atNewline = !0, hasNewline = !0, (anchor || tag) && (newlineAfterProp = token), hasSpace = !0;
            break;
          case "anchor":
            anchor && onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), token.source.endsWith(":") && onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), anchor = token, start ?? (start = token.offset), atNewline = !1, hasSpace = !1, reqSpace = !0;
            break;
          case "tag": {
            tag && onError(token, "MULTIPLE_TAGS", "A node can have at most one tag"), tag = token, start ?? (start = token.offset), atNewline = !1, hasSpace = !1, reqSpace = !0;
            break;
          }
          case indicator:
            (anchor || tag) && onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`), found && onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`), found = token, atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind", hasSpace = !1;
            break;
          case "comma":
            if (flow) {
              comma && onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`), comma = token, atNewline = !1, hasSpace = !1;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`), atNewline = !1, hasSpace = !1;
        }
      let last = tokens[tokens.length - 1], end = last ? last.offset + last.source.length : offset;
      return reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "") && onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq") && onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes(`
`))
            return !0;
          if (key.end) {
            for (let st of key.end)
              if (st.type === "newline")
                return !0;
          }
          return !1;
        case "flow-collection":
          for (let it of key.items) {
            for (let st of it.start)
              if (st.type === "newline")
                return !0;
            if (it.sep) {
              for (let st of it.sep)
                if (st.type === "newline")
                  return !0;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return !0;
          }
          return !1;
        default:
          return !0;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        let end = fc.end[0];
        end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc) && onError(end, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      let { uniqueKeys } = ctx.options;
      if (uniqueKeys === !1)
        return !1;
      let isEqual = typeof uniqueKeys == "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair(), YAMLMap = require_YAMLMap(), resolveProps = require_resolve_props(), utilContainsNewline = require_util_contains_newline(), utilFlowIndentCheck = require_util_flow_indent_check(), utilMapIncludes = require_util_map_includes(), startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      let NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap, map = new NodeClass(ctx.schema);
      ctx.atRoot && (ctx.atRoot = !1);
      let offset = bm.offset, commentEnd = null;
      for (let collItem of bm.items) {
        let { start, key, sep, value } = collItem, keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: !0
        }), implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key && (key.type === "block-seq" ? onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in key && key.indent !== bm.indent && onError(offset, "BAD_INDENT", startColMsg)), !keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end, keyProps.comment && (map.comment ? map.comment += `
` + keyProps.comment : map.comment = keyProps.comment);
            continue;
          }
          (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) && onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        } else keyProps.found?.indent !== bm.indent && onError(offset, "BAD_INDENT", startColMsg);
        ctx.atKey = !0;
        let keyStart = keyProps.end, keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        ctx.schema.compat && utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError), ctx.atKey = !1, utilMapIncludes.mapIncludes(ctx, map.items, keyNode) && onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        let valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        if (offset = valueProps.end, valueProps.found) {
          implicitKey && (value?.type === "block-map" && !valueProps.hasNewline && onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), ctx.options.strict && keyProps.start < valueProps.found.offset - 1024 && onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
          let valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          ctx.schema.compat && utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError), offset = valueNode.range[2];
          let pair = new Pair.Pair(keyNode, valueNode);
          ctx.options.keepSourceTokens && (pair.srcToken = collItem), map.items.push(pair);
        } else {
          implicitKey && onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), valueProps.comment && (keyNode.comment ? keyNode.comment += `
` + valueProps.comment : keyNode.comment = valueProps.comment);
          let pair = new Pair.Pair(keyNode);
          ctx.options.keepSourceTokens && (pair.srcToken = collItem), map.items.push(pair);
        }
      }
      return commentEnd && commentEnd < offset && onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content"), map.range = [bm.offset, offset, commentEnd ?? offset], map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq(), resolveProps = require_resolve_props(), utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      let NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq, seq = new NodeClass(ctx.schema);
      ctx.atRoot && (ctx.atRoot = !1), ctx.atKey && (ctx.atKey = !1);
      let offset = bs.offset, commentEnd = null;
      for (let { start, value } of bs.items) {
        let props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: !0
        });
        if (!props.found)
          if (props.anchor || props.tag || value)
            value?.type === "block-seq" ? onError(props.end, "BAD_INDENT", "All sequence items must start at the same column") : onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          else {
            commentEnd = props.end, props.comment && (seq.comment = props.comment);
            continue;
          }
        let node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        ctx.schema.compat && utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError), offset = node.range[2], seq.items.push(node);
      }
      return seq.range = [bs.offset, offset, commentEnd ?? offset], seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = !1, sep = "";
        for (let token of end) {
          let { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = !0;
              break;
            case "comment": {
              reqSpace && !hasSpace && onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              let cb = source.substring(1) || " ";
              comment ? comment += sep + cb : comment = cb, sep = "";
              break;
            }
            case "newline":
              comment && (sep += source), hasSpace = !0;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity(), Pair = require_Pair(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), resolveEnd = require_resolve_end(), resolveProps = require_resolve_props(), utilContainsNewline = require_util_contains_newline(), utilMapIncludes = require_util_map_includes(), blockMsg = "Block collections are not allowed within flow collections", isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      let isMap = fc.start.source === "{", fcName = isMap ? "flow map" : "flow sequence", NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq), coll = new NodeClass(ctx.schema);
      coll.flow = !0;
      let atRoot = ctx.atRoot;
      atRoot && (ctx.atRoot = !1), ctx.atKey && (ctx.atKey = !1);
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        let collItem = fc.items[i], { start, key, sep, value } = collItem, props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: !1
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            i === 0 && props.comma ? onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`) : i < fc.items.length - 1 && onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`), props.comment && (coll.comment ? coll.comment += `
` + props.comment : coll.comment = props.comment), offset = props.end;
            continue;
          }
          !isMap && ctx.options.strict && utilContainsNewline.containsNewline(key) && onError(
            key,
            // checked by containsNewline()
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys of flow sequence pairs need to be on a single line"
          );
        }
        if (i === 0)
          props.comma && onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        else if (props.comma || onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`), props.comment) {
          let prevItemComment = "";
          loop: for (let st of start)
            switch (st.type) {
              case "comma":
              case "space":
                break;
              case "comment":
                prevItemComment = st.source.substring(1);
                break loop;
              default:
                break loop;
            }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            identity.isPair(prev) && (prev = prev.value ?? prev.key), prev.comment ? prev.comment += `
` + prevItemComment : prev.comment = prevItemComment, props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
        if (!isMap && !sep && !props.found) {
          let valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode), offset = valueNode.range[2], isBlock(value) && onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = !0;
          let keyStart = props.end, keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          isBlock(key) && onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg), ctx.atKey = !1;
          let valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: !1
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (let st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              props.start < valueProps.found.offset - 1024 && onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else value && ("source" in value && value.source?.[0] === ":" ? onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`) : onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`));
          let valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          valueNode ? isBlock(value) && onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg) : valueProps.comment && (keyNode.comment ? keyNode.comment += `
` + valueProps.comment : keyNode.comment = valueProps.comment);
          let pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens && (pair.srcToken = collItem), isMap) {
            let map = coll;
            utilMapIncludes.mapIncludes(ctx, map.items, keyNode) && onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique"), map.items.push(pair);
          } else {
            let map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = !0, map.items.push(pair);
            let endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]], coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      let expectedEnd = isMap ? "}" : "]", [ce, ...ee] = fc.end, cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        let name = fcName[0].toUpperCase() + fcName.substring(1), msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg), ce && ce.source.length !== 1 && ee.unshift(ce);
      }
      if (ee.length > 0) {
        let end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        end.comment && (coll.comment ? coll.comment += `
` + end.comment : coll.comment = end.comment), coll.range = [fc.offset, cePos, end.offset];
      } else
        coll.range = [fc.offset, cePos, cePos];
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity(), Scalar = require_Scalar(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), resolveBlockMap = require_resolve_block_map(), resolveBlockSeq = require_resolve_block_seq(), resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      let coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag), Coll = coll.constructor;
      return tagName === "!" || tagName === Coll.tagName ? (coll.tag = Coll.tagName, coll) : (tagName && (coll.tag = tagName), coll);
    }
    function composeCollection(CN, ctx, token, props, onError) {
      let tagToken = props.tag, tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      if (token.type === "block-seq") {
        let { anchor, newlineAfterProp: nl } = props, lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        lastProp && (!nl || nl.offset < lastProp.offset) && onError(lastProp, "MISSING_CHAR", "Missing newline after block sequence props");
      }
      let expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq")
        return resolveCollection(CN, ctx, token, onError, tagName);
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        let kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType)
          ctx.schema.tags.push(Object.assign({}, kt, { default: !1 })), tag = kt;
        else
          return kt ? onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, !0) : onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, !0), resolveCollection(CN, ctx, token, onError, tagName);
      }
      let coll = resolveCollection(CN, ctx, token, onError, tagName, tag), res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll, node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      return node.range = coll.range, node.tag = tagName, tag?.format && (node.format = tag.format), node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      let start = scalar.offset, header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      let type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL, lines = scalar.source ? splitLines(scalar.source) : [], chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        let content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        let value2 = header.chomp === "+" && lines.length > 0 ? `
`.repeat(Math.max(1, lines.length - 1)) : "", end2 = start + header.length;
        return scalar.source && (end2 += scalar.source.length), { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent, offset = scalar.offset + header.length, contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        if (content === "" || content === "\r")
          header.indent === 0 && indent.length > trimIndent && (trimIndent = indent.length);
        else {
          indent.length < trimIndent && onError(offset + indent.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), header.indent === 0 && (trimIndent = indent.length), contentStart = i, trimIndent === 0 && !ctx.atRoot && onError(offset, "BAD_INDENT", "Block scalar values in collections must be indented");
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i)
        lines[i][0].length > trimIndent && (chompStart = i + 1);
      let value = "", sep = "", prevMoreIndented = !1;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + `
`;
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        let crlf = content[content.length - 1] === "\r";
        if (crlf && (content = content.slice(0, -1)), content && indent.length < trimIndent) {
          let message = `Block scalar lines must not be less indented than their ${header.indent ? "explicit indentation indicator" : "first line"}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message), indent = "";
        }
        type === Scalar.Scalar.BLOCK_LITERAL ? (value += sep + indent.slice(trimIndent) + content, sep = `
`) : indent.length > trimIndent || content[0] === "	" ? (sep === " " ? sep = `
` : !prevMoreIndented && sep === `
` && (sep = `

`), value += sep + indent.slice(trimIndent) + content, sep = `
`, prevMoreIndented = !0) : content === "" ? sep === `
` ? value += `
` : sep = `
` : (value += sep + content, sep = " ", prevMoreIndented = !1);
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += `
` + lines[i][0].slice(trimIndent);
          value[value.length - 1] !== `
` && (value += `
`);
          break;
        default:
          value += `
`;
      }
      let end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header")
        return onError(props[0], "IMPOSSIBLE", "Block scalar header not found"), null;
      let { source } = props[0], mode = source[0], indent = 0, chomp = "", error = -1;
      for (let i = 1; i < source.length; ++i) {
        let ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          let n = Number(ch);
          !indent && n ? indent = n : error === -1 && (error = offset + i);
        }
      }
      error !== -1 && onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = !1, comment = "", length = source.length;
      for (let i = 1; i < props.length; ++i) {
        let token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = !0;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            strict && !hasSpace && onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), length += token.source.length, comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message), length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            let message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            let ts = token.source;
            ts && typeof ts == "string" && (length += ts.length);
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      let split = source.split(/\n( *)/), first = split[0], m = first.match(/^( *)/), lines = [m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first]];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar(), resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      let { offset, type, source, end } = scalar, _type, value, _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN, value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE, value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE, value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          return onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`), {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      let valueEnd = offset + source.length, re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      return badChar && onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`), unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      return (source[source.length - 1] !== "'" || source.length === 1) && onError(source.length, "MISSING_CHAR", "Missing closing 'quote"), unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      let line = /(.*?)\r?\n/sy, match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$"), trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/, trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, ""), sep = " ", pos = line.lastIndex;
      for (; match = line.exec(source); ) {
        let lm = match[1].replace(trimBoth, "");
        lm === "" ? sep === `
` ? res += sep : sep = `
` : (res += sep + lm, sep = " "), pos = line.lastIndex;
      }
      let last = /[ \t]*(.*)/sy;
      return last.lastIndex = pos, match = last.exec(source), res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        let ch = source[i];
        if (!(ch === "\r" && source[i + 1] === `
`))
          if (ch === `
`) {
            let { fold, offset } = foldNewline(source, i);
            res += fold, i = offset;
          } else if (ch === "\\") {
            let next = source[++i], cc = escapeCodes[next];
            if (cc)
              res += cc;
            else if (next === `
`)
              for (next = source[i + 1]; next === " " || next === "	"; )
                next = source[++i + 1];
            else if (next === "\r" && source[i + 1] === `
`)
              for (next = source[++i + 1]; next === " " || next === "	"; )
                next = source[++i + 1];
            else if (next === "x" || next === "u" || next === "U") {
              let length = next === "x" ? 2 : next === "u" ? 4 : 8;
              res += parseCharCode(source, i + 1, length, onError), i += length;
            } else {
              let raw = source.substr(i - 1, 2);
              onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`), res += raw;
            }
          } else if (ch === " " || ch === "	") {
            let wsStart = i, next = source[i + 1];
            for (; next === " " || next === "	"; )
              next = source[++i + 1];
            next !== `
` && !(next === "\r" && source[i + 2] === `
`) && (res += i > wsStart ? source.slice(wsStart, i + 1) : ch);
          } else
            res += ch;
      }
      return (source[source.length - 1] !== '"' || source.length === 1) && onError(source.length, "MISSING_CHAR", 'Missing closing "quote'), res;
    }
    function foldNewline(source, offset) {
      let fold = "", ch = source[offset + 1];
      for (; (ch === " " || ch === "	" || ch === `
` || ch === "\r") && !(ch === "\r" && source[offset + 2] !== `
`); )
        ch === `
` && (fold += `
`), offset += 1, ch = source[offset + 1];
      return fold || (fold = " "), { fold, offset };
    }
    var escapeCodes = {
      0: "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: `
`,
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      let cc = source.substr(offset, length), code = cc.length === length && /^[0-9a-fA-F]+$/.test(cc) ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        let raw = source.substr(offset - 2, length + 2);
        return onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`), raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity(), Scalar = require_Scalar(), resolveBlockScalar = require_resolve_block_scalar(), resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      let { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError), tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null, tag;
      ctx.options.stringKeys && ctx.atKey ? tag = ctx.schema[identity.SCALAR] : tagName ? tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError) : token.type === "scalar" ? tag = findScalarTagByTest(ctx, value, token, onError) : tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        let res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        let msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), scalar = new Scalar.Scalar(value);
      }
      return scalar.range = range, scalar.source = value, type && (scalar.type = type), tagName && (scalar.tag = tagName), tag.format && (scalar.format = tag.format), comment && (scalar.comment = comment), scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      let matchWithTest = [];
      for (let tag of schema.tags)
        if (!tag.collection && tag.tag === tagName)
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
      for (let tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      let kt = schema.knownTags[tagName];
      return kt && !kt.collection ? (schema.tags.push(Object.assign({}, kt, { default: !1, test: void 0 })), kt) : (onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str"), schema[identity.SCALAR]);
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      let tag = schema.tags.find((tag2) => (tag2.default === !0 || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        let compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          let ts = directives.tagString(tag.tag), cs = directives.tagString(compat.tag), msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, !0);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          for (st = before[++i]; st?.type === "space"; )
            offset += st.source.length, st = before[++i];
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias(), identity = require_identity(), composeCollection = require_compose_collection(), composeScalar = require_compose_scalar(), resolveEnd = require_resolve_end(), utilEmptyScalarPosition = require_util_empty_scalar_position(), CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      let atKey = ctx.atKey, { spaceBefore, comment, anchor, tag } = props, node, isSrcToken = !0;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError), (anchor || tag) && onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError), anchor && (node.anchor = anchor.source.substring(1));
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError), anchor && (node.anchor = anchor.source.substring(1));
          } catch (error) {
            let message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          let message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message), isSrcToken = !1;
        }
      }
      return node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError)), anchor && node.anchor === "" && onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string"), atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value != "string" || node.tag && node.tag !== "tag:yaml.org,2002:str") && onError(tag ?? token, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), spaceBefore && (node.spaceBefore = !0), comment && (token.type === "scalar" && token.source === "" ? node.comment = comment : node.commentBefore = comment), ctx.options.keepSourceTokens && isSrcToken && (node.srcToken = token), node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      let token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      }, node = composeScalar.composeScalar(ctx, token, tag, onError);
      return anchor && (node.anchor = anchor.source.substring(1), node.anchor === "" && onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string")), spaceBefore && (node.spaceBefore = !0), comment && (node.comment = comment, node.range[2] = end), node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      let alias = new Alias.Alias(source.substring(1));
      alias.source === "" && onError(offset, "BAD_ALIAS", "Alias cannot be an empty string"), alias.source.endsWith(":") && onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
      let valueEnd = offset + source.length, re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      return alias.range = [offset, valueEnd, re.offset], re.comment && (alias.comment = re.comment), alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document(), composeNode = require_compose_node(), resolveEnd = require_resolve_end(), resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      let opts = Object.assign({ _directives: directives }, options), doc = new Document.Document(void 0, opts), ctx = {
        atKey: !1,
        atRoot: !0,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      }, props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: !0
      });
      props.found && (doc.directives.docStart = !0, value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline && onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      let contentEnd = doc.contents.range[2], re = resolveEnd.resolveEnd(end, contentEnd, !1, onError);
      return re.comment && (doc.comment = re.comment), doc.range = [offset, contentEnd, re.offset], doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process"), directives = require_directives(), Document = require_Document(), errors = require_errors(), identity = require_identity(), composeDoc = require_compose_doc(), resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src == "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      let { offset, source } = src;
      return [offset, offset + (typeof source == "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "", atComment = !1, afterEmptyLine = !1;
      for (let i = 0; i < prelude.length; ++i) {
        let source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? `

` : `
`) + (source.substring(1) || " "), atComment = !0, afterEmptyLine = !1;
            break;
          case "%":
            prelude[i + 1]?.[0] !== "#" && (i += 1), atComment = !1;
            break;
          default:
            atComment || (afterEmptyLine = !0), atComment = !1;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (source, code, message, warning) => {
          let pos = getErrorPos(source);
          warning ? this.warnings.push(new errors.YAMLWarning(pos, code, message)) : this.errors.push(new errors.YAMLParseError(pos, code, message));
        }, this.directives = new directives.Directives({ version: options.version || "1.2" }), this.options = options;
      }
      decorate(doc, afterDoc) {
        let { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          let dc = doc.contents;
          if (afterDoc)
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          else if (afterEmptyLine || doc.directives.docStart || !dc)
            doc.commentBefore = comment;
          else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            identity.isPair(it) && (it = it.key);
            let cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            let cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else
          doc.errors = this.errors, doc.warnings = this.warnings;
        this.prelude = [], this.errors = [], this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = !1, endOffset = -1) {
        for (let token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        switch (node_process.env.LOG_STREAM && console.dir(token, { depth: null }), token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              let pos = getErrorPos(token);
              pos[0] += offset, this.onError(pos, "BAD_DIRECTIVE", message, warning);
            }), this.prelude.push(token.source), this.atDirectives = !0;
            break;
          case "document": {
            let doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            this.atDirectives && !doc.directives.docStart && this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(doc, !1), this.doc && (yield this.doc), this.doc = doc, this.atDirectives = !1;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            let msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message, error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            this.atDirectives || !this.doc ? this.errors.push(error) : this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              let msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = !0;
            let end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            if (this.decorate(this.doc, !0), end.comment) {
              let dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = !1, endOffset = -1) {
        if (this.doc)
          this.decorate(this.doc, !0), yield this.doc, this.doc = null;
        else if (forceDoc) {
          let opts = Object.assign({ _directives: this.directives }, this.options), doc = new Document.Document(void 0, opts);
          this.atDirectives && this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line"), doc.range = [0, endOffset, endOffset], this.decorate(doc, !1), yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar(), resolveFlowScalar = require_resolve_flow_scalar(), errors = require_errors(), stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = !0, onError) {
      if (token) {
        let _onError = (pos, code, message) => {
          let offset = typeof pos == "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      let { implicitKey = !1, indent, inFlow = !1, offset = -1, type = "PLAIN" } = context, source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: !0, lineWidth: -1 }
      }), end = context.end ?? [
        { type: "newline", offset: -1, indent, source: `
` }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          let he = source.indexOf(`
`), head = source.substring(0, he), body = source.substring(he + 1) + `
`, props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          return addEndtoBlockProps(props, end) || props.push({ type: "newline", offset: -1, indent, source: `
` }), { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = !1, implicitKey = !1, inFlow = !1, type } = context, indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent == "number" && (indent += 2), !type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            let header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      let source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: !0, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      let he = source.indexOf(`
`), head = source.substring(0, he), body = source.substring(he + 1) + `
`;
      if (token.type === "block-scalar") {
        let header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head, token.source = body;
      } else {
        let { offset } = token, indent = "indent" in token ? token.indent : -1, props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        addEndtoBlockProps(props, "end" in token ? token.end : void 0) || props.push({ type: "newline", offset: -1, indent, source: `
` });
        for (let key of Object.keys(token))
          key !== "type" && key !== "offset" && delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (let st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              return props.push(st), !0;
          }
      return !1;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type, token.source = source;
          break;
        case "block-scalar": {
          let end = token.props.slice(1), oa = source.length;
          token.props[0].type === "block-scalar-header" && (oa -= token.props[0].source.length);
          for (let tok of end)
            tok.offset += oa;
          delete token.props, Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          let nl = { type: "newline", offset: token.offset + source.length, indent: token.indent, source: `
` };
          delete token.items, Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          let indent = "indent" in token ? token.indent : -1, end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (let key of Object.keys(token))
            key !== "type" && key !== "offset" && delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (let tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (let item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (let item of token.items)
            res += stringifyItem(item);
          for (let st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (let st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (let st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (let st of start)
        res += st.source;
      if (key && (res += stringifyToken(key)), sep)
        for (let st of sep)
          res += st.source;
      return value && (res += stringifyToken(value)), res;
    }
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit"), SKIP = Symbol("skip children"), REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      "type" in cst && cst.type === "document" && (cst = { start: cst.start, value: cst.value }), _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (let [field, index] of path) {
        let tok = item?.[field];
        if (tok && "items" in tok)
          item = tok.items[index];
        else
          return;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      let parent = visit.itemAtPath(cst, path.slice(0, -1)), field = path[path.length - 1][0], coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl == "symbol")
        return ctrl;
      for (let field of ["key", "value"]) {
        let token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            let ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci == "number")
              i = ci - 1;
            else {
              if (ci === BREAK)
                return BREAK;
              ci === REMOVE && (token.items.splice(i, 1), i -= 1);
            }
          }
          typeof ctrl == "function" && field === "key" && (ctrl = ctrl(item, path));
        }
      }
      return typeof ctrl == "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar(), cstStringify = require_cst_stringify(), cstVisit = require_cst_visit(), BOM = "\uFEFF", DOCUMENT = "", FLOW_END = "", SCALAR = "", isCollection = (token) => !!token && "items" in token, isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case `
`:
        case `\r
`:
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case `
`:
        case "\r":
        case "	":
          return !0;
        default:
          return !1;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef"), tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), flowIndicatorChars = new Set(",[]{}"), invalidAnchorChars = new Set(` ,[]{}
\r	`), isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch), Lexer = class {
      constructor() {
        this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = !1) {
        if (source) {
          if (typeof source != "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source, this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        for (; next && (incomplete || this.hasChars(1)); )
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos, ch = this.buffer[i];
        for (; ch === " " || ch === "	"; )
          ch = this.buffer[++i];
        return !ch || ch === "#" || ch === `
` ? !0 : ch === "\r" ? this.buffer[i + 1] === `
` : !1;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          for (; ch === " "; )
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            let next = this.buffer[indent + offset + 1];
            if (next === `
` || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === `
` || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          let dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        return (typeof end != "number" || end !== -1 && end < this.pos) && (end = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = end), end === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[end - 1] === "\r" && (end -= 1), this.buffer.substring(this.pos, end));
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = state, null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM && (yield* this.pushCount(1), line = line.substring(1)), line[0] === "%") {
          let dirEnd = line.length, cs = line.indexOf("#");
          for (; cs !== -1; ) {
            let ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else
              cs = line.indexOf("#", cs + 1);
          }
          for (; ; ) {
            let ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          let n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(!0));
          return yield* this.pushCount(line.length - n), this.pushNewline(), "stream";
        }
        if (this.atLineEnd()) {
          let sp = yield* this.pushSpaces(!0);
          return yield* this.pushCount(line.length - sp), yield* this.pushNewline(), "stream";
        }
        return yield cst.DOCUMENT, yield* this.parseLineStart();
      }
      *parseLineStart() {
        let ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          let s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3)))
            return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, s === "---" ? "doc" : "stream";
        }
        return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !isEmpty(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        let [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          let n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
          return this.indentNext = this.indentValue + 1, this.indentValue += n, "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(!0);
        let line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            return yield* this.pushNewline(), yield* this.parseLineStart();
          case "{":
          case "[":
            return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
          case "}":
          case "]":
            return yield* this.pushCount(1), "doc";
          case "*":
            return yield* this.pushUntil(isNotAnchorChar), "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            return n += yield* this.parseBlockScalarHeader(), n += yield* this.pushSpaces(!0), yield* this.pushCount(line.length - n), yield* this.pushNewline(), yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp, indent = -1;
        do
          nl = yield* this.pushNewline(), nl > 0 ? (sp = yield* this.pushSpaces(!1), this.indentValue = indent = sp) : sp = 0, sp += yield* this.pushSpaces(!0);
        while (nl + sp > 0);
        let line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if ((indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) && !(indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}")))
          return this.flowLevel = 0, yield cst.FLOW_END, yield* this.parseLineStart();
        let n = 0;
        for (; line[n] === ","; )
          n += yield* this.pushCount(1), n += yield* this.pushSpaces(!0), this.flowKey = !1;
        switch (n += yield* this.pushIndicators(), line[n]) {
          case void 0:
            return "flow";
          case "#":
            return yield* this.pushCount(line.length - n), "flow";
          case "{":
          case "[":
            return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
          case "}":
          case "]":
            return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
          case "*":
            return yield* this.pushUntil(isNotAnchorChar), "flow";
          case '"':
          case "'":
            return this.flowKey = !0, yield* this.parseQuotedScalar();
          case ":": {
            let next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",")
              return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
          }
          // fallthrough
          default:
            return this.flowKey = !1, yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        let quote = this.charAt(0), end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'")
          for (; end !== -1 && this.buffer[end + 1] === "'"; )
            end = this.buffer.indexOf("'", end + 2);
        else
          for (; end !== -1; ) {
            let n = 0;
            for (; this.buffer[end - 1 - n] === "\\"; )
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        let qb = this.buffer.substring(0, end), nl = qb.indexOf(`
`, this.pos);
        if (nl !== -1) {
          for (; nl !== -1; ) {
            let cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf(`
`, cs);
          }
          nl !== -1 && (end = nl - (qb[nl - 1] === "\r" ? 2 : 1));
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        return yield* this.pushToIndex(end + 1, !1), this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1, this.blockScalarKeep = !1;
        let i = this.pos;
        for (; ; ) {
          let ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = !0;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1, indent = 0, ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2)
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case `
`:
              nl = i2, indent = 0;
              break;
            case "\r": {
              let next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === `
`)
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          this.blockScalarIndent === -1 ? this.indentNext = indent : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          do {
            let cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf(`
`, cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        for (ch = this.buffer[i]; ch === " "; )
          ch = this.buffer[++i];
        if (ch === "	") {
          for (; ch === "	" || ch === " " || ch === "\r" || ch === `
`; )
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep)
          do {
            let i2 = nl - 1, ch2 = this.buffer[i2];
            ch2 === "\r" && (ch2 = this.buffer[--i2]);
            let lastChar = i2;
            for (; ch2 === " "; )
              ch2 = this.buffer[--i2];
            if (ch2 === `
` && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (!0);
        return yield cst.SCALAR, yield* this.pushToIndex(nl + 1, !0), yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        let inFlow = this.flowLevel > 0, end = this.pos - 1, i = this.pos - 1, ch;
        for (; ch = this.buffer[++i]; )
          if (ch === ":") {
            let next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r" && (next === `
` ? (i += 1, ch = `
`, next = this.buffer[i + 1]) : end = i), next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === `
`) {
              let cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        return !ch && !this.atEnd ? this.setNext("plain-scalar") : (yield cst.SCALAR, yield* this.pushToIndex(end + 1, !0), inFlow ? "flow" : "doc");
      }
      *pushCount(n) {
        return n > 0 ? (yield this.buffer.substr(this.pos, n), this.pos += n, n) : 0;
      }
      *pushToIndex(i, allowEmpty) {
        let s = this.buffer.slice(this.pos, i);
        return s ? (yield s, this.pos += s.length, s.length) : (allowEmpty && (yield ""), 0);
      }
      *pushIndicators() {
        let n = 0;
        loop: for (; ; ) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag(), n += yield* this.pushSpaces(!0);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar), n += yield* this.pushSpaces(!0);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              let inFlow = this.flowLevel > 0, ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                inFlow ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, n += yield* this.pushCount(1), n += yield* this.pushSpaces(!0);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2, ch = this.buffer[i];
          for (; !isEmpty(ch) && ch !== ">"; )
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, !1);
        } else {
          let i = this.pos + 1, ch = this.buffer[i];
          for (; ch; )
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2]))
              ch = this.buffer[i += 3];
            else
              break;
          return yield* this.pushToIndex(i, !1);
        }
      }
      *pushNewline() {
        let ch = this.buffer[this.pos];
        return ch === `
` ? yield* this.pushCount(1) : ch === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1, ch;
        do
          ch = this.buffer[++i];
        while (ch === " " || allowTabs && ch === "	");
        let n = i - this.pos;
        return n > 0 && (yield this.buffer.substr(this.pos, n), this.pos = i), n;
      }
      *pushUntil(test) {
        let i = this.pos, ch = this.buffer[i];
        for (; !test(ch); )
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, !1);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [], this.addNewLine = (offset) => this.lineStarts.push(offset), this.linePos = (offset) => {
          let low = 0, high = this.lineStarts.length;
          for (; low < high; ) {
            let mid = low + high >> 1;
            this.lineStarts[mid] < offset ? low = mid + 1 : high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          let start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process"), cst = require_cst(), lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return !0;
      return !1;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i)
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return !0;
        default:
          return !1;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          let it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: for (; --i >= 0; )
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      for (; prev[++i]?.type === "space"; )
        ;
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start")
        for (let it of fc.items)
          it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind") && (it.key && (it.value = it.key), delete it.key, isFlowToken(it.value) ? it.value.end ? arrayPushArray(it.value.end, it.sep) : it.value.end = it.sep : arrayPushArray(it.start, it.sep), delete it.sep);
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new lexer.Lexer(), this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = !1) {
        this.onNewLine && this.offset === 0 && this.onNewLine(0);
        for (let lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        incomplete || (yield* this.end());
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        if (this.source = source, node_process.env.LOG_TOKENS && console.log("|", cst.prettyToken(source)), this.atScalar) {
          this.atScalar = !1, yield* this.step(), this.offset += source.length;
          return;
        }
        let type = cst.tokenType(source);
        if (type)
          if (type === "scalar")
            this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
          else {
            switch (this.type = type, yield* this.step(), type) {
              case "newline":
                this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + source.length);
                break;
              case "space":
                this.atNewLine && source[0] === " " && (this.indent += source.length);
                break;
              case "explicit-key-ind":
              case "map-value-ind":
              case "seq-item-ind":
                this.atNewLine && (this.indent += source.length);
                break;
              case "doc-mode":
              case "flow-error-end":
                return;
              default:
                this.atNewLine = !1;
            }
            this.offset += source.length;
          }
        else {
          let message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source }), this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        for (; this.stack.length > 0; )
          yield* this.pop();
      }
      get sourceToken() {
        return {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      *step() {
        let top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          for (; this.stack.length > 0; )
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        let token = error ?? this.stack.pop();
        if (!token)
          yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
        else if (this.stack.length === 0)
          yield token;
        else {
          let top = this.peek(1);
          switch (token.type === "block-scalar" ? token.indent = "indent" in top ? top.indent : 0 : token.type === "flow-collection" && top.type === "document" && (token.indent = 0), token.type === "flow-collection" && fixFlowSeqItems(token), top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              let it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] }), this.onKeyLine = !0;
                return;
              } else if (it.sep)
                it.value = token;
              else {
                Object.assign(it, { key: token, sep: [] }), this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              let it = top.items[top.items.length - 1];
              it.value ? top.items.push({ start: [], value: token }) : it.value = token;
              break;
            }
            case "flow-collection": {
              let it = top.items[top.items.length - 1];
              !it || it.value ? top.items.push({ start: [], key: token, sep: [] }) : it.sep ? it.value = token : Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop(), yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            let last = token.items[token.items.length - 1];
            last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent)) && (top.type === "document" ? top.end = last.start : top.items.push({ start: last.start }), token.items.splice(-1, 1));
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            let doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            this.type === "doc-start" && doc.start.push(this.sourceToken), this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            findNonEmptyIndex(doc.start) !== -1 ? (yield* this.pop(), yield* this.step()) : doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        let bv = this.startBlockValue(doc);
        bv ? this.stack.push(bv) : yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          let prev = getPrevProps(this.peek(2)), start = getFirstKeyStartProps(prev), sep;
          scalar.end ? (sep = scalar.end, sep.push(this.sourceToken), delete scalar.end) : sep = [this.sourceToken];
          let map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = !0, this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            if (scalar.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
              let nl = this.source.indexOf(`
`) + 1;
              for (; nl !== 0; )
                this.onNewLine(this.offset + nl), nl = this.source.indexOf(`
`, nl) + 1;
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop(), yield* this.step();
        }
      }
      *blockMap(map) {
        let it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            if (this.onKeyLine = !1, it.value) {
              let end = "end" in it.value ? it.value.end : void 0;
              (Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment" ? end?.push(this.sourceToken) : map.items.push({ start: [this.sourceToken] });
            } else it.sep ? it.sep.push(this.sourceToken) : it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              map.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else {
              if (this.atIndentedComment(it.start, map.indent)) {
                let end = map.items[map.items.length - 2]?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start), end.push(this.sourceToken), map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          let atMapIndent = !this.onKeyLine && this.indent === map.indent, atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind", start = [];
          if (atNextItem && it.sep && !it.value) {
            let nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              let st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  st.indent > map.indent && (nl.length = 0);
                  break;
                default:
                  nl.length = 0;
              }
            }
            nl.length >= 2 && (start = it.sep.splice(nl[1]));
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              atNextItem || it.value ? (start.push(this.sourceToken), map.items.push({ start }), this.onKeyLine = !0) : it.sep ? it.sep.push(this.sourceToken) : it.start.push(this.sourceToken);
              return;
            case "explicit-key-ind":
              !it.sep && !it.explicitKey ? (it.start.push(this.sourceToken), it.explicitKey = !0) : atNextItem || it.value ? (start.push(this.sourceToken), map.items.push({ start, explicitKey: !0 })) : this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: !0 }]
              }), this.onKeyLine = !0;
              return;
            case "map-value-ind":
              if (it.explicitKey)
                if (it.sep)
                  if (it.value)
                    map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                  else if (includesToken(it.sep, "map-value-ind"))
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start, key: null, sep: [this.sourceToken] }]
                    });
                  else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                    let start2 = getFirstKeyStartProps(it.start), key = it.key, sep = it.sep;
                    sep.push(this.sourceToken), delete it.key, delete it.sep, this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key, sep }]
                    });
                  } else start.length > 0 ? it.sep = it.sep.concat(start, this.sourceToken) : it.sep.push(this.sourceToken);
                else if (includesToken(it.start, "newline"))
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                else {
                  let start2 = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                  });
                }
              else
                it.sep ? it.value || atNextItem ? map.items.push({ start, key: null, sep: [this.sourceToken] }) : includesToken(it.sep, "map-value-ind") ? this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [], key: null, sep: [this.sourceToken] }]
                }) : it.sep.push(this.sourceToken) : Object.assign(it, { key: null, sep: [this.sourceToken] });
              this.onKeyLine = !0;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              let fs = this.flowScalar(this.type);
              atNextItem || it.value ? (map.items.push({ start, key: fs, sep: [] }), this.onKeyLine = !0) : it.sep ? this.stack.push(fs) : (Object.assign(it, { key: fs, sep: [] }), this.onKeyLine = !0);
              return;
            }
            default: {
              let bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else atMapIndent && map.items.push({ start });
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop(), yield* this.step();
      }
      *blockSequence(seq) {
        let it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              let end = "end" in it.value ? it.value.end : void 0;
              (Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment" ? end?.push(this.sourceToken) : seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                let end = seq.items[seq.items.length - 2]?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start), end.push(this.sourceToken), seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            it.value || includesToken(it.start, "seq-item-ind") ? seq.items.push({ start: [this.sourceToken] }) : it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          let bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop(), yield* this.step();
      }
      *flowCollection(fc) {
        let it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do
            yield* this.pop(), top = this.peek(1);
          while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              !it || it.sep ? fc.items.push({ start: [this.sourceToken] }) : it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              !it || it.value ? fc.items.push({ start: [], key: null, sep: [this.sourceToken] }) : it.sep ? it.sep.push(this.sourceToken) : Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              !it || it.value ? fc.items.push({ start: [this.sourceToken] }) : it.sep ? it.sep.push(this.sourceToken) : it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              let fs = this.flowScalar(this.type);
              !it || it.value ? fc.items.push({ start: [], key: fs, sep: [] }) : it.sep ? this.stack.push(fs) : Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          let bv = this.startBlockValue(fc);
          bv ? this.stack.push(bv) : (yield* this.pop(), yield* this.step());
        } else {
          let parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep))
            yield* this.pop(), yield* this.step();
          else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            let sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            let map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = !0, this.stack[this.stack.length - 1] = map;
          } else
            yield* this.lineEnd(fc);
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf(`
`) + 1;
          for (; nl !== 0; )
            this.onNewLine(this.offset + nl), nl = this.source.indexOf(`
`, nl) + 1;
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = !0;
            let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
            return start.push(this.sourceToken), {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: !0 }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = !0;
            let prev = getPrevProps(parent), start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        return this.type !== "comment" || this.indent <= indent ? !1 : start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        this.type !== "doc-mode" && (docEnd.end ? docEnd.end.push(this.sourceToken) : docEnd.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop(), yield* this.step();
            break;
          case "newline":
            this.onKeyLine = !1;
          // fallthrough
          case "space":
          case "comment":
          default:
            token.end ? token.end.push(this.sourceToken) : token.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer(), Document = require_Document(), errors = require_errors(), log = require_log(), identity = require_identity(), lineCounter = require_line_counter(), parser = require_parser();
    function parseOptions(options) {
      let prettyErrors = options.prettyErrors !== !1;
      return { lineCounter: options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      let { lineCounter: lineCounter2, prettyErrors } = parseOptions(options), parser$1 = new parser.Parser(lineCounter2?.addNewLine), composer$1 = new composer.Composer(options), docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (let doc of docs)
          doc.errors.forEach(errors.prettifyError(source, lineCounter2)), doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      return docs.length > 0 ? docs : Object.assign([], { empty: !0 }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      let { lineCounter: lineCounter2, prettyErrors } = parseOptions(options), parser$1 = new parser.Parser(lineCounter2?.addNewLine), composer$1 = new composer.Composer(options), doc = null;
      for (let _doc of composer$1.compose(parser$1.parse(source), !0, source.length))
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      return prettyErrors && lineCounter2 && (doc.errors.forEach(errors.prettifyError(source, lineCounter2)), doc.warnings.forEach(errors.prettifyError(source, lineCounter2))), doc;
    }
    function parse2(src, reviver, options) {
      let _reviver;
      typeof reviver == "function" ? _reviver = reviver : options === void 0 && reviver && typeof reviver == "object" && (options = reviver);
      let doc = parseDocument(src, options);
      if (!doc)
        return null;
      if (doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning)), doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer == "function" || Array.isArray(replacer) ? _replacer = replacer : options === void 0 && replacer && (options = replacer), typeof options == "string" && (options = options.length), typeof options == "number") {
        let indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        let { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return;
      }
      return identity.isDocument(value) && !_replacer ? value.toString(options) : new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse2;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer(), Document = require_Document(), Schema = require_Schema(), errors = require_errors(), Alias = require_Alias(), identity = require_identity(), Pair = require_Pair(), Scalar = require_Scalar(), YAMLMap = require_YAMLMap(), YAMLSeq = require_YAMLSeq(), cst = require_cst(), lexer = require_lexer(), lineCounter = require_line_counter(), parser = require_parser(), publicApi = require_public_api(), visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// node_modules/papaparse/papaparse.js
var require_papaparse = __commonJS({
  "node_modules/papaparse/papaparse.js"(exports, module) {
    (function(root, factory) {
      typeof define == "function" && define.amd ? define([], factory) : typeof module == "object" && typeof exports < "u" ? module.exports = factory() : root.Papa = factory();
    })(exports, function moduleFactory() {
      "use strict";
      var global2 = /* @__PURE__ */ (function() {
        return typeof self < "u" ? self : typeof window < "u" ? window : typeof global2 < "u" ? global2 : {};
      })();
      function getWorkerBlob() {
        var URL2 = global2.URL || global2.webkitURL || null, code = moduleFactory.toString();
        return Papa3.BLOB_URL || (Papa3.BLOB_URL = URL2.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", code, ")();"], { type: "text/javascript" })));
      }
      var IS_WORKER = !global2.document && !!global2.postMessage, IS_PAPA_WORKER = global2.IS_PAPA_WORKER || !1, workers = {}, workerIdCounter = 0, Papa3 = {};
      Papa3.parse = CsvToJson, Papa3.unparse = JsonToCsv, Papa3.RECORD_SEP = "", Papa3.UNIT_SEP = "", Papa3.BYTE_ORDER_MARK = "\uFEFF", Papa3.BAD_DELIMITERS = ["\r", `
`, '"', Papa3.BYTE_ORDER_MARK], Papa3.WORKERS_SUPPORTED = !IS_WORKER && !!global2.Worker, Papa3.NODE_STREAM_INPUT = 1, Papa3.LocalChunkSize = 1024 * 1024 * 10, Papa3.RemoteChunkSize = 1024 * 1024 * 5, Papa3.DefaultDelimiter = ",", Papa3.Parser = Parser, Papa3.ParserHandle = ParserHandle, Papa3.NetworkStreamer = NetworkStreamer, Papa3.FileStreamer = FileStreamer, Papa3.StringStreamer = StringStreamer, Papa3.ReadableStreamStreamer = ReadableStreamStreamer, typeof PAPA_BROWSER_CONTEXT > "u" && (Papa3.DuplexStreamStreamer = DuplexStreamStreamer), IS_PAPA_WORKER && (global2.onmessage = workerThreadReceivedMessage);
      function stripBom(string) {
        return string.charCodeAt(0) === 65279 ? string.slice(1) : string;
      }
      function CsvToJson(_input, _config) {
        _config = _config || {};
        var dynamicTyping = _config.dynamicTyping || !1;
        if (isFunction(dynamicTyping) && (_config.dynamicTypingFunction = dynamicTyping, dynamicTyping = {}), _config.dynamicTyping = dynamicTyping, _config.transform = isFunction(_config.transform) ? _config.transform : !1, _config.downloadTimeout !== void 0) {
          var downloadTimeout = parseInt(_config.downloadTimeout);
          if (isNaN(downloadTimeout))
            throw new Error("Config downloadTimeout value (" + _config.downloadTimeout + ") not parsable by parseInt(val).");
          _config.downloadTimeout = downloadTimeout;
        }
        if (_config.worker && Papa3.WORKERS_SUPPORTED) {
          var w = newWorker();
          w.userStep = _config.step, w.userChunk = _config.chunk, w.userComplete = _config.complete, w.userError = _config.error, _config.step = isFunction(_config.step), _config.chunk = isFunction(_config.chunk), _config.complete = isFunction(_config.complete), _config.error = isFunction(_config.error), delete _config.worker, w.postMessage({
            input: _input,
            config: _config,
            workerId: w.id
          });
          return;
        }
        var streamer = null;
        return _input === Papa3.NODE_STREAM_INPUT && typeof PAPA_BROWSER_CONTEXT > "u" ? (streamer = new DuplexStreamStreamer(_config), streamer.getStream()) : (typeof _input == "string" ? (_input = stripBom(_input), _config.download ? streamer = new NetworkStreamer(_config) : streamer = new StringStreamer(_config)) : _input.readable === !0 && isFunction(_input.read) && isFunction(_input.on) ? streamer = new ReadableStreamStreamer(_config) : (global2.File && _input instanceof File || _input instanceof Object) && (streamer = new FileStreamer(_config)), streamer.stream(_input));
      }
      function JsonToCsv(_input, _config) {
        var _quotes = !1, _writeHeader = !0, _delimiter = ",", _newline = `\r
`, _quoteChar = '"', _escapedQuote = _quoteChar + _quoteChar, _skipEmptyLines = !1, _columns = null, _escapeFormulae = !1;
        unpackConfig();
        var quoteCharRegex = new RegExp(escapeRegExp(_quoteChar), "g");
        if (typeof _input == "string" && (_input = JSON.parse(_input)), Array.isArray(_input)) {
          if (!_input.length || Array.isArray(_input[0]))
            return serialize(null, _input, _skipEmptyLines);
          if (typeof _input[0] == "object")
            return serialize(_columns || Object.keys(_input[0]), _input, _skipEmptyLines);
        } else if (typeof _input == "object")
          return typeof _input.data == "string" && (_input.data = JSON.parse(_input.data)), Array.isArray(_input.data) && (_input.fields || (_input.fields = _input.meta && _input.meta.fields || _columns), _input.fields || (_input.fields = Array.isArray(_input.data[0]) ? _input.fields : typeof _input.data[0] == "object" ? Object.keys(_input.data[0]) : []), !Array.isArray(_input.data[0]) && typeof _input.data[0] != "object" && (_input.data = [_input.data])), serialize(_input.fields || [], _input.data || [], _skipEmptyLines);
        throw new Error("Unable to serialize unrecognized input");
        function unpackConfig() {
          if (typeof _config == "object") {
            if (typeof _config.delimiter == "string" && !Papa3.BAD_DELIMITERS.filter(function(value) {
              return _config.delimiter.indexOf(value) !== -1;
            }).length && (_delimiter = _config.delimiter), (typeof _config.quotes == "boolean" || typeof _config.quotes == "function" || Array.isArray(_config.quotes)) && (_quotes = _config.quotes), (typeof _config.skipEmptyLines == "boolean" || typeof _config.skipEmptyLines == "string") && (_skipEmptyLines = _config.skipEmptyLines), typeof _config.newline == "string" && (_newline = _config.newline), typeof _config.quoteChar == "string" && (_quoteChar = _config.quoteChar, _escapedQuote = _quoteChar + _quoteChar), typeof _config.header == "boolean" && (_writeHeader = _config.header), Array.isArray(_config.columns)) {
              if (_config.columns.length === 0) throw new Error("Option columns is empty");
              _columns = _config.columns;
            }
            _config.escapeChar !== void 0 && (_escapedQuote = _config.escapeChar + _quoteChar), _config.escapeFormulae instanceof RegExp ? _escapeFormulae = _config.escapeFormulae : typeof _config.escapeFormulae == "boolean" && _config.escapeFormulae && (_escapeFormulae = /^[=+\-@\t\r].*$/);
          }
        }
        function serialize(fields, data, skipEmptyLines) {
          var csv = "";
          typeof fields == "string" && (fields = JSON.parse(fields)), typeof data == "string" && (data = JSON.parse(data));
          var hasHeader = Array.isArray(fields) && fields.length > 0, dataKeyedByField = !Array.isArray(data[0]);
          if (hasHeader && _writeHeader) {
            for (var i = 0; i < fields.length; i++)
              i > 0 && (csv += _delimiter), csv += safe(fields[i], i);
            data.length > 0 && (csv += _newline);
          }
          for (var row = 0; row < data.length; row++) {
            var maxCol = hasHeader ? fields.length : data[row].length, emptyLine = !1, nullLine = hasHeader ? Object.keys(data[row]).length === 0 : data[row].length === 0;
            if (skipEmptyLines && !hasHeader && (emptyLine = skipEmptyLines === "greedy" ? data[row].join("").trim() === "" : data[row].length === 1 && data[row][0].length === 0), skipEmptyLines === "greedy" && hasHeader) {
              for (var line = [], c = 0; c < maxCol; c++) {
                var cx = dataKeyedByField ? fields[c] : c;
                line.push(data[row][cx]);
              }
              emptyLine = line.join("").trim() === "";
            }
            if (!emptyLine) {
              for (var col = 0; col < maxCol; col++) {
                col > 0 && !nullLine && (csv += _delimiter);
                var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
                csv += safe(data[row][colIdx], col);
              }
              row < data.length - 1 && (!skipEmptyLines || maxCol > 0 && !nullLine) && (csv += _newline);
            }
          }
          return csv;
        }
        function safe(str, col) {
          if (typeof str > "u" || str === null)
            return "";
          if (str.constructor === Date)
            return isNaN(str.getTime()) ? "" : str.toISOString();
          var needsQuotes = !1;
          _escapeFormulae && typeof str == "string" && _escapeFormulae.test(str) && (str = "'" + str, needsQuotes = !0);
          var strValue = str.toString(), escapedQuoteStr = strValue.replace(quoteCharRegex, _escapedQuote);
          return needsQuotes = needsQuotes || _quotes === !0 || typeof _quotes == "function" && _quotes(str, col) || Array.isArray(_quotes) && _quotes[col] || hasAny(escapedQuoteStr, Papa3.BAD_DELIMITERS) || escapedQuoteStr.indexOf(_delimiter) > -1 || strValue.indexOf(_quoteChar) > -1 || escapedQuoteStr.charAt(0) === " " || escapedQuoteStr.charAt(escapedQuoteStr.length - 1) === " ", needsQuotes ? _quoteChar + escapedQuoteStr + _quoteChar : escapedQuoteStr;
        }
        function hasAny(str, substrings) {
          for (var i = 0; i < substrings.length; i++)
            if (str.indexOf(substrings[i]) > -1)
              return !0;
          return !1;
        }
      }
      function ChunkStreamer(config) {
        this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = {
          data: [],
          errors: [],
          meta: {}
        }, replaceConfig.call(this, config), this.parseChunk = function(chunk, isFakeChunk) {
          let skipFirstNLines = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && skipFirstNLines > 0) {
            let _newline = this._config.newline;
            if (!_newline) {
              let quoteChar = this._config.quoteChar || '"';
              _newline = this._handle.guessLineEndings(chunk, quoteChar);
            }
            chunk = [...chunk.split(_newline).slice(skipFirstNLines)].join(_newline);
          }
          if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk)) {
            var modifiedChunk = this._config.beforeFirstChunk(chunk);
            modifiedChunk !== void 0 && (chunk = modifiedChunk);
          }
          this.isFirstChunk = !1, this._halted = !1;
          var aggregate = this._partialLine + chunk;
          this._partialLine = "";
          var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);
          if (this._handle.paused() || this._handle.aborted()) {
            this._halted = !0;
            return;
          }
          var lastIndex = results.meta.cursor;
          this._finished || (this._partialLine = aggregate.substring(lastIndex - this._baseIndex), this._baseIndex = lastIndex), results && results.data && (this._rowCount += results.data.length);
          var finishedIncludingPreview = this._finished || this._config.preview && this._rowCount >= this._config.preview;
          if (IS_PAPA_WORKER)
            global2.postMessage({
              results,
              workerId: Papa3.WORKER_ID,
              finished: finishedIncludingPreview
            });
          else if (isFunction(this._config.chunk) && !isFakeChunk) {
            if (this._config.chunk(results, this._handle), this._handle.paused() || this._handle.aborted()) {
              this._halted = !0;
              return;
            }
            results = void 0, this._completeResults = void 0;
          }
          return !this._config.step && !this._config.chunk && (this._completeResults.data = this._completeResults.data.concat(results.data), this._completeResults.errors = this._completeResults.errors.concat(results.errors), this._completeResults.meta = results.meta), !this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted) && (this._config.complete(this._completeResults, this._input), this._completed = !0), !finishedIncludingPreview && (!results || !results.meta.paused) && this._nextChunk(), results;
        }, this._sendError = function(error) {
          isFunction(this._config.error) ? this._config.error(error) : IS_PAPA_WORKER && this._config.error && global2.postMessage({
            workerId: Papa3.WORKER_ID,
            error,
            finished: !1
          });
        };
        function replaceConfig(config2) {
          var configCopy = copy(config2);
          configCopy.chunkSize = parseInt(configCopy.chunkSize), !config2.step && !config2.chunk && (configCopy.chunkSize = null), this._handle = new ParserHandle(configCopy), this._handle.streamer = this, this._config = configCopy;
        }
      }
      function NetworkStreamer(config) {
        config = config || {}, config.chunkSize || (config.chunkSize = Papa3.RemoteChunkSize), ChunkStreamer.call(this, config);
        var xhr;
        IS_WORKER ? this._nextChunk = function() {
          this._readChunk(), this._chunkLoaded();
        } : this._nextChunk = function() {
          this._readChunk();
        }, this.stream = function(url) {
          this._input = url, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) {
            this._chunkLoaded();
            return;
          }
          if (xhr = new XMLHttpRequest(), this._config.withCredentials && (xhr.withCredentials = this._config.withCredentials), IS_WORKER || (xhr.onload = bindFunction(this._chunkLoaded, this), xhr.onerror = bindFunction(this._chunkError, this)), xhr.ontimeout = bindFunction(this._chunkTimeout, this), xhr.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !IS_WORKER), this._config.downloadTimeout && !IS_WORKER && (xhr.timeout = this._config.downloadTimeout), this._config.downloadRequestHeaders) {
            var headers = this._config.downloadRequestHeaders;
            for (var headerName in headers)
              xhr.setRequestHeader(headerName, headers[headerName]);
          }
          if (this._config.chunkSize) {
            var end = this._start + this._config.chunkSize - 1;
            xhr.setRequestHeader("Range", "bytes=" + this._start + "-" + end);
          }
          try {
            xhr.send(this._config.downloadRequestBody);
          } catch (err) {
            this._chunkError(err.message);
          }
          IS_WORKER && xhr.status === 0 && this._chunkError();
        }, this._chunkLoaded = function() {
          if (xhr.readyState === 4) {
            if (xhr.status < 200 || xhr.status >= 400) {
              this._chunkError();
              return;
            }
            this._start += this._config.chunkSize ? this._config.chunkSize : xhr.responseText.length, this._finished = !this._config.chunkSize || this._start >= getFileSize(xhr), this.parseChunk(xhr.responseText);
          }
        }, this._chunkError = function(errorMessage) {
          var errorText = xhr.statusText || errorMessage;
          this._sendError(new Error(errorText));
        }, this._chunkTimeout = function() {
          this._chunkError("Request timed out after " + this._config.downloadTimeout + "ms");
        };
        function getFileSize(xhr2) {
          var contentRange = xhr2.getResponseHeader("Content-Range");
          return contentRange === null ? -1 : parseInt(contentRange.substring(contentRange.lastIndexOf("/") + 1));
        }
      }
      NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype), NetworkStreamer.prototype.constructor = NetworkStreamer;
      function FileStreamer(config) {
        config = config || {}, config.chunkSize || (config.chunkSize = Papa3.LocalChunkSize), ChunkStreamer.call(this, config);
        var reader, slice, usingAsyncReader = typeof FileReader < "u";
        this.stream = function(file) {
          this._input = file, slice = file.slice || file.webkitSlice || file.mozSlice, usingAsyncReader ? (reader = new FileReader(), reader.onload = bindFunction(this._chunkLoaded, this), reader.onerror = bindFunction(this._chunkError, this)) : reader = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          !this._finished && (!this._config.preview || this._rowCount < this._config.preview) && this._readChunk();
        }, this._readChunk = function() {
          var input = this._input;
          if (this._config.chunkSize) {
            var end = Math.min(this._start + this._config.chunkSize, this._input.size);
            input = slice.call(input, this._start, end);
          }
          var txt = reader.readAsText(input, this._config.encoding);
          usingAsyncReader || this._chunkLoaded({ target: { result: txt } });
        }, this._chunkLoaded = function(event) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(event.target.result);
        }, this._chunkError = function() {
          this._sendError(reader.error);
        };
      }
      FileStreamer.prototype = Object.create(ChunkStreamer.prototype), FileStreamer.prototype.constructor = FileStreamer;
      function StringStreamer(config) {
        config = config || {}, ChunkStreamer.call(this, config);
        var remaining;
        this.stream = function(s) {
          return remaining = s, this._nextChunk();
        }, this._nextChunk = function() {
          if (!this._finished) {
            var size = this._config.chunkSize, chunk;
            return size ? (chunk = remaining.substring(0, size), remaining = remaining.substring(size)) : (chunk = remaining, remaining = ""), this._finished = !remaining, this.parseChunk(chunk);
          }
        };
      }
      StringStreamer.prototype = Object.create(StringStreamer.prototype), StringStreamer.prototype.constructor = StringStreamer;
      function ReadableStreamStreamer(config) {
        config = config || {}, ChunkStreamer.call(this, config);
        var queue = [], parseOnData = !0, streamHasEnded = !1;
        this.pause = function() {
          ChunkStreamer.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          ChunkStreamer.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(stream) {
          this._input = stream, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          streamHasEnded && queue.length === 1 && (this._finished = !0);
        }, this._nextChunk = function() {
          this._checkIsFinished(), queue.length ? this.parseChunk(queue.shift()) : parseOnData = !0;
        }, this._streamData = bindFunction(function(chunk) {
          try {
            queue.push(typeof chunk == "string" ? chunk : chunk.toString(this._config.encoding)), parseOnData && (parseOnData = !1, this._checkIsFinished(), this.parseChunk(queue.shift()));
          } catch (error) {
            this._streamError(error);
          }
        }, this), this._streamError = bindFunction(function(error) {
          this._streamCleanUp(), this._sendError(error);
        }, this), this._streamEnd = bindFunction(function() {
          this._streamCleanUp(), streamHasEnded = !0, this._streamData("");
        }, this), this._streamCleanUp = bindFunction(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype), ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;
      function DuplexStreamStreamer(_config) {
        var Duplex = __require("stream").Duplex, config = copy(_config), parseOnWrite = !0, writeStreamHasFinished = !1, parseCallbackQueue = [], stream = null;
        this._onCsvData = function(results) {
          var data = results.data;
          !stream.push(data) && !this._handle.paused() && this._handle.pause();
        }, this._onCsvComplete = function() {
          stream.push(null);
        }, config.step = bindFunction(this._onCsvData, this), config.complete = bindFunction(this._onCsvComplete, this), ChunkStreamer.call(this, config), this._nextChunk = function() {
          writeStreamHasFinished && parseCallbackQueue.length === 1 && (this._finished = !0), parseCallbackQueue.length ? parseCallbackQueue.shift()() : parseOnWrite = !0;
        }, this._addToParseQueue = function(chunk, callback) {
          parseCallbackQueue.push(bindFunction(function() {
            if (this.parseChunk(typeof chunk == "string" ? chunk : chunk.toString(config.encoding)), isFunction(callback))
              return callback();
          }, this)), parseOnWrite && (parseOnWrite = !1, this._nextChunk());
        }, this._onRead = function() {
          this._handle.paused() && this._handle.resume();
        }, this._onWrite = function(chunk, encoding, callback) {
          this._addToParseQueue(chunk, callback);
        }, this._onWriteComplete = function() {
          writeStreamHasFinished = !0, this._addToParseQueue("");
        }, this.getStream = function() {
          return stream;
        }, stream = new Duplex({
          readableObjectMode: !0,
          decodeStrings: !1,
          read: bindFunction(this._onRead, this),
          write: bindFunction(this._onWrite, this)
        }), stream.once("finish", bindFunction(this._onWriteComplete, this));
      }
      typeof PAPA_BROWSER_CONTEXT > "u" && (DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype), DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer);
      function ParserHandle(_config) {
        var MAX_FLOAT = Math.pow(2, 53), MIN_FLOAT = -MAX_FLOAT, FLOAT = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, ISO_DATE = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, self2 = this, _stepCounter = 0, _rowCounter = 0, _input, _parser, _paused = !1, _aborted = !1, _delimiterError, _fields = [], _results = {
          // The last results returned from the parser
          data: [],
          errors: [],
          meta: {}
        };
        if (isFunction(_config.step)) {
          var userStep = _config.step;
          _config.step = function(results) {
            if (_results = results, needsHeaderRow())
              processResults();
            else {
              if (processResults(), _results.data.length === 0)
                return;
              _stepCounter += results.data.length, _config.preview && _stepCounter > _config.preview ? _parser.abort() : (_results.data = _results.data[0], userStep(_results, self2));
            }
          };
        }
        this.parse = function(input, baseIndex, ignoreLastRow) {
          var quoteChar = _config.quoteChar || '"';
          if (_config.newline || (_config.newline = this.guessLineEndings(input, quoteChar)), _delimiterError = !1, _config.delimiter)
            isFunction(_config.delimiter) && (_config.delimiter = _config.delimiter(input), _results.meta.delimiter = _config.delimiter);
          else {
            var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments, _config.delimitersToGuess);
            delimGuess.successful ? _config.delimiter = delimGuess.bestDelimiter : (_delimiterError = !0, _config.delimiter = Papa3.DefaultDelimiter), _results.meta.delimiter = _config.delimiter;
          }
          var parserConfig = copy(_config);
          return parserConfig.header = needsHeaderRow(), _config.preview && _config.header && parserConfig.preview++, _input = input, _parser = new Parser(parserConfig), _results = _parser.parse(_input, baseIndex, ignoreLastRow), processResults(), _paused ? { meta: { paused: !0 } } : _results || { meta: { paused: !1 } };
        }, this.paused = function() {
          return _paused;
        }, this.pause = function() {
          _paused = !0, _parser.abort(), _input = isFunction(_config.chunk) ? "" : _input.substring(_parser.getCharIndex());
        }, this.resume = function() {
          self2.streamer._halted ? (_paused = !1, self2.streamer.parseChunk(_input, !0)) : setTimeout(self2.resume, 3);
        }, this.aborted = function() {
          return _aborted;
        }, this.abort = function() {
          _aborted = !0, _parser.abort(), _results.meta.aborted = !0, isFunction(_config.complete) && _config.complete(_results), _input = "";
        }, this.guessLineEndings = function(input, quoteChar) {
          input = input.substring(0, 1024 * 1024);
          var re = new RegExp(escapeRegExp(quoteChar) + "([^]*?)" + escapeRegExp(quoteChar), "gm");
          input = input.replace(re, "");
          var r = input.split("\r"), n = input.split(`
`), nAppearsFirst = n.length > 1 && n[0].length < r[0].length;
          if (r.length === 1 || nAppearsFirst)
            return `
`;
          for (var numWithN = 0, i = 0; i < r.length; i++)
            r[i][0] === `
` && numWithN++;
          return numWithN >= r.length / 2 ? `\r
` : "\r";
        };
        function testEmptyLine(s) {
          return _config.skipEmptyLines === "greedy" ? s.join("").trim() === "" : s.length === 1 && s[0].length === 0;
        }
        function testFloat(s) {
          if (FLOAT.test(s)) {
            var floatValue = parseFloat(s);
            if (floatValue > MIN_FLOAT && floatValue < MAX_FLOAT)
              return !0;
          }
          return !1;
        }
        function processResults() {
          return _results && _delimiterError && (addError("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + Papa3.DefaultDelimiter + "'"), _delimiterError = !1), _config.skipEmptyLines && (_results.data = _results.data.filter(function(d) {
            return !testEmptyLine(d);
          })), needsHeaderRow() && fillHeaderFields(), applyHeaderAndDynamicTypingAndTransformation();
        }
        function needsHeaderRow() {
          return _config.header && _fields.length === 0;
        }
        function fillHeaderFields() {
          if (!_results)
            return;
          function addHeader(header) {
            _fields.push(header);
          }
          if (Array.isArray(_results.data[0])) {
            for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
              _results.data[i].forEach(addHeader);
            _results.data.splice(0, 1);
          } else
            _results.data.forEach(addHeader);
        }
        function shouldApplyDynamicTyping(field) {
          return _config.dynamicTypingFunction && _config.dynamicTyping[field] === void 0 && (_config.dynamicTyping[field] = _config.dynamicTypingFunction(field)), (_config.dynamicTyping[field] || _config.dynamicTyping) === !0;
        }
        function parseDynamic(field, value) {
          return shouldApplyDynamicTyping(field) ? value === "true" || value === "TRUE" ? !0 : value === "false" || value === "FALSE" ? !1 : testFloat(value) ? parseFloat(value) : ISO_DATE.test(value) ? new Date(value) : value === "" ? null : value : value;
        }
        function applyHeaderAndDynamicTypingAndTransformation() {
          if (!_results || !_config.header && !_config.dynamicTyping && !_config.transform)
            return _results;
          function processRow(rowSource, i) {
            var row = _config.header ? {} : [], j;
            for (j = 0; j < rowSource.length; j++) {
              var field = j, value = rowSource[j];
              _config.header && (field = j >= _fields.length ? "__parsed_extra" : _fields[j]), _config.transform && (value = _config.transform(value, field)), value = parseDynamic(field, value), field === "__parsed_extra" ? (row[field] = row[field] || [], row[field].push(value)) : row[field] = value;
            }
            return _config.header && (j > _fields.length ? addError("FieldMismatch", "TooManyFields", "Too many fields: expected " + _fields.length + " fields but parsed " + j, _rowCounter + i) : j < _fields.length && addError("FieldMismatch", "TooFewFields", "Too few fields: expected " + _fields.length + " fields but parsed " + j, _rowCounter + i)), row;
          }
          var incrementBy = 1;
          return !_results.data.length || Array.isArray(_results.data[0]) ? (_results.data = _results.data.map(processRow), incrementBy = _results.data.length) : _results.data = processRow(_results.data, 0), _config.header && _results.meta && (_results.meta.fields = _fields), _rowCounter += incrementBy, _results;
        }
        function guessDelimiter(input, newline, skipEmptyLines, comments, delimitersToGuess) {
          var bestDelim, bestDelta, fieldCountPrevRow, maxFieldCount;
          delimitersToGuess = delimitersToGuess || [",", "	", "|", ";", Papa3.RECORD_SEP, Papa3.UNIT_SEP];
          for (var i = 0; i < delimitersToGuess.length; i++) {
            var delim = delimitersToGuess[i], delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
            fieldCountPrevRow = void 0;
            for (var preview = new Parser({
              comments,
              delimiter: delim,
              newline,
              preview: 10
            }).parse(input), j = 0; j < preview.data.length; j++) {
              if (skipEmptyLines && testEmptyLine(preview.data[j])) {
                emptyLinesCount++;
                continue;
              }
              var fieldCount = preview.data[j].length;
              if (avgFieldCount += fieldCount, typeof fieldCountPrevRow > "u") {
                fieldCountPrevRow = fieldCount;
                continue;
              } else fieldCount > 0 && (delta += Math.abs(fieldCount - fieldCountPrevRow), fieldCountPrevRow = fieldCount);
            }
            preview.data.length > 0 && (avgFieldCount /= preview.data.length - emptyLinesCount), avgFieldCount > 1.99 && (typeof bestDelta > "u" || delta < bestDelta || delta === bestDelta && avgFieldCount > maxFieldCount) && (bestDelta = delta, bestDelim = delim, maxFieldCount = avgFieldCount);
          }
          return _config.delimiter = bestDelim, {
            successful: !!bestDelim,
            bestDelimiter: bestDelim
          };
        }
        function addError(type, code, msg, row) {
          var error = {
            type,
            code,
            message: msg
          };
          row !== void 0 && (error.row = row), _results.errors.push(error);
        }
      }
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function Parser(config) {
        config = config || {};
        var delim = config.delimiter, newline = config.newline, comments = config.comments, step = config.step, preview = config.preview, fastMode = config.fastMode, quoteChar, renamedHeaders = null, headerParsed = !1;
        config.quoteChar === void 0 || config.quoteChar === null ? quoteChar = '"' : quoteChar = config.quoteChar;
        var escapeChar = quoteChar;
        if (config.escapeChar !== void 0 && (escapeChar = config.escapeChar), (typeof delim != "string" || Papa3.BAD_DELIMITERS.indexOf(delim) > -1) && (delim = ","), comments === delim)
          throw new Error("Comment character same as delimiter");
        comments === !0 ? comments = "#" : (typeof comments != "string" || Papa3.BAD_DELIMITERS.indexOf(comments) > -1) && (comments = !1), newline !== `
` && newline !== "\r" && newline !== `\r
` && (newline = `
`);
        var cursor = 0, aborted = !1;
        this.parse = function(input, baseIndex, ignoreLastRow) {
          if (typeof input != "string")
            throw new Error("Input must be a string");
          var inputLen = input.length, delimLen = delim.length, newlineLen = newline.length, commentsLen = comments.length, stepIsFunction = isFunction(step);
          cursor = 0;
          var data = [], errors = [], row = [], lastCursor = 0;
          if (!input)
            return returnable();
          if (fastMode || fastMode !== !1 && input.indexOf(quoteChar) === -1) {
            for (var rows = input.split(newline), i = 0; i < rows.length; i++) {
              if (row = rows[i], cursor += row.length, i !== rows.length - 1)
                cursor += newline.length;
              else if (ignoreLastRow)
                return returnable();
              if (!(comments && row.substring(0, commentsLen) === comments)) {
                if (stepIsFunction) {
                  if (data = [], pushRow(row.split(delim)), doStep(), aborted)
                    return returnable();
                } else
                  pushRow(row.split(delim));
                if (preview && i >= preview)
                  return data = data.slice(0, preview), returnable(!0);
              }
            }
            return returnable();
          }
          for (var nextDelim = input.indexOf(delim, cursor), nextNewline = input.indexOf(newline, cursor), quoteCharRegex = new RegExp(escapeRegExp(escapeChar) + escapeRegExp(quoteChar), "g"), quoteSearch = input.indexOf(quoteChar, cursor); ; ) {
            if (input[cursor] === quoteChar) {
              for (quoteSearch = cursor, cursor++; ; ) {
                if (quoteSearch = input.indexOf(quoteChar, quoteSearch + 1), quoteSearch === -1)
                  return ignoreLastRow || errors.push({
                    type: "Quotes",
                    code: "MissingQuotes",
                    message: "Quoted field unterminated",
                    row: data.length,
                    // row has yet to be inserted
                    index: cursor
                  }), finish();
                if (quoteSearch === inputLen - 1) {
                  var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
                  return finish(value);
                }
                if (quoteChar === escapeChar && input[quoteSearch + 1] === escapeChar) {
                  quoteSearch++;
                  continue;
                }
                if (!(quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar)) {
                  nextDelim !== -1 && nextDelim < quoteSearch + 1 && (nextDelim = input.indexOf(delim, quoteSearch + 1)), nextNewline !== -1 && nextNewline < quoteSearch + 1 && (nextNewline = input.indexOf(newline, quoteSearch + 1));
                  var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline), spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);
                  if (input.substr(quoteSearch + 1 + spacesBetweenQuoteAndDelimiter, delimLen) === delim) {
                    row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar)), cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen, input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen] !== quoteChar && (quoteSearch = input.indexOf(quoteChar, cursor)), nextDelim = input.indexOf(delim, cursor), nextNewline = input.indexOf(newline, cursor);
                    break;
                  }
                  var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);
                  if (input.substring(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen) === newline) {
                    if (row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar)), saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen), nextDelim = input.indexOf(delim, cursor), quoteSearch = input.indexOf(quoteChar, cursor), stepIsFunction && (doStep(), aborted))
                      return returnable();
                    if (preview && data.length >= preview)
                      return returnable(!0);
                    break;
                  }
                  errors.push({
                    type: "Quotes",
                    code: "InvalidQuotes",
                    message: "Trailing quote on quoted field is malformed",
                    row: data.length,
                    // row has yet to be inserted
                    index: cursor
                  }), quoteSearch++;
                }
              }
              continue;
            }
            if (comments && row.length === 0 && input.substring(cursor, cursor + commentsLen) === comments) {
              if (nextNewline === -1)
                return returnable();
              cursor = nextNewline + newlineLen, nextNewline = input.indexOf(newline, cursor), nextDelim = input.indexOf(delim, cursor);
              continue;
            }
            if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1)) {
              row.push(input.substring(cursor, nextDelim)), cursor = nextDelim + delimLen, nextDelim = input.indexOf(delim, cursor);
              continue;
            }
            if (nextNewline !== -1) {
              if (row.push(input.substring(cursor, nextNewline)), saveRow(nextNewline + newlineLen), stepIsFunction && (doStep(), aborted))
                return returnable();
              if (preview && data.length >= preview)
                return returnable(!0);
              continue;
            }
            break;
          }
          return finish();
          function pushRow(row2) {
            data.push(row2), lastCursor = cursor;
          }
          function extraSpaces(index) {
            var spaceLength = 0;
            if (index !== -1) {
              var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
              textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === "" && (spaceLength = textBetweenClosingQuoteAndIndex.length);
            }
            return spaceLength;
          }
          function finish(value2) {
            return ignoreLastRow || (typeof value2 > "u" && (value2 = input.substring(cursor)), row.push(value2), cursor = inputLen, pushRow(row), stepIsFunction && doStep()), returnable();
          }
          function saveRow(newCursor) {
            cursor = newCursor, pushRow(row), row = [], nextNewline = input.indexOf(newline, cursor);
          }
          function returnable(stopped) {
            if (config.header && !baseIndex && data.length && !headerParsed) {
              let result = data[0], headerCount = /* @__PURE__ */ Object.create(null), usedHeaders = new Set(result), duplicateHeaders = !1;
              for (let i2 = 0; i2 < result.length; i2++) {
                let header = stripBom(result[i2]);
                if (isFunction(config.transformHeader) && (header = config.transformHeader(header, i2)), !headerCount[header])
                  headerCount[header] = 1, result[i2] = header;
                else {
                  let newHeader, suffixCount = headerCount[header];
                  do
                    newHeader = `${header}_${suffixCount}`, suffixCount++;
                  while (usedHeaders.has(newHeader));
                  usedHeaders.add(newHeader), result[i2] = newHeader, headerCount[header]++, duplicateHeaders = !0, renamedHeaders === null && (renamedHeaders = {}), renamedHeaders[newHeader] = header;
                }
                usedHeaders.add(header);
              }
              duplicateHeaders && console.warn("Duplicate headers found and renamed."), headerParsed = !0;
            }
            return {
              data,
              errors,
              meta: {
                delimiter: delim,
                linebreak: newline,
                aborted,
                truncated: !!stopped,
                cursor: lastCursor + (baseIndex || 0),
                renamedHeaders
              }
            };
          }
          function doStep() {
            step(returnable()), data = [], errors = [];
          }
        }, this.abort = function() {
          aborted = !0;
        }, this.getCharIndex = function() {
          return cursor;
        };
      }
      function newWorker() {
        if (!Papa3.WORKERS_SUPPORTED)
          return !1;
        var workerUrl = getWorkerBlob(), w = new global2.Worker(workerUrl);
        return w.onmessage = mainThreadReceivedMessage, w.id = workerIdCounter++, workers[w.id] = w, w;
      }
      function mainThreadReceivedMessage(e) {
        var msg = e.data, worker = workers[msg.workerId], aborted = !1;
        if (msg.error)
          worker.userError(msg.error, msg.file);
        else if (msg.results && msg.results.data) {
          var abort = function() {
            aborted = !0, completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: !0 } });
          }, handle = {
            abort,
            pause: notImplemented,
            resume: notImplemented
          };
          if (isFunction(worker.userStep)) {
            for (var i = 0; i < msg.results.data.length && (worker.userStep({
              data: msg.results.data[i],
              errors: msg.results.errors,
              meta: msg.results.meta
            }, handle), !aborted); i++)
              ;
            delete msg.results;
          } else isFunction(worker.userChunk) && (worker.userChunk(msg.results, handle, msg.file), delete msg.results);
        }
        msg.finished && !aborted && completeWorker(msg.workerId, msg.results);
      }
      function completeWorker(workerId, results) {
        var worker = workers[workerId];
        isFunction(worker.userComplete) && worker.userComplete(results), worker.terminate(), delete workers[workerId];
      }
      function notImplemented() {
        throw new Error("Not implemented.");
      }
      function workerThreadReceivedMessage(e) {
        var msg = e.data;
        if (typeof Papa3.WORKER_ID > "u" && msg && (Papa3.WORKER_ID = msg.workerId), typeof msg.input == "string")
          global2.postMessage({
            workerId: Papa3.WORKER_ID,
            results: Papa3.parse(msg.input, msg.config),
            finished: !0
          });
        else if (global2.File && msg.input instanceof File || msg.input instanceof Object) {
          var results = Papa3.parse(msg.input, msg.config);
          results && global2.postMessage({
            workerId: Papa3.WORKER_ID,
            results,
            finished: !0
          });
        }
      }
      function copy(obj) {
        if (typeof obj != "object" || obj === null)
          return obj;
        var cpy = Array.isArray(obj) ? [] : {};
        for (var key in obj)
          cpy[key] = copy(obj[key]);
        return cpy;
      }
      function bindFunction(f, self2) {
        return function() {
          f.apply(self2, arguments);
        };
      }
      function isFunction(func) {
        return typeof func == "function";
      }
      return Papa3;
    });
  }
});

// node_modules/process-nextick-args/index.js
var require_process_nextick_args = __commonJS({
  "node_modules/process-nextick-args/index.js"(exports, module) {
    "use strict";
    typeof process > "u" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0 ? module.exports = { nextTick } : module.exports = process;
    function nextTick(fn, arg1, arg2, arg3) {
      if (typeof fn != "function")
        throw new TypeError('"callback" argument must be a function');
      var len = arguments.length, args, i;
      switch (len) {
        case 0:
        case 1:
          return process.nextTick(fn);
        case 2:
          return process.nextTick(function() {
            fn.call(null, arg1);
          });
        case 3:
          return process.nextTick(function() {
            fn.call(null, arg1, arg2);
          });
        case 4:
          return process.nextTick(function() {
            fn.call(null, arg1, arg2, arg3);
          });
        default:
          for (args = new Array(len - 1), i = 0; i < args.length; )
            args[i++] = arguments[i];
          return process.nextTick(function() {
            fn.apply(null, args);
          });
      }
    }
  }
});

// node_modules/isarray/index.js
var require_isarray = __commonJS({
  "node_modules/isarray/index.js"(exports, module) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/stream.js
var require_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream.js"(exports, module) {
    module.exports = __require("stream");
  }
});

// node_modules/readable-stream/node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/readable-stream/node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require("buffer"), Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src)
        dst[key] = src[key];
    }
    Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow ? module.exports = buffer : (copyProps(buffer, exports), exports.Buffer = SafeBuffer);
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg == "number")
        throw new TypeError("Argument must not be a number");
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      var buf = Buffer2(size);
      return fill !== void 0 ? typeof encoding == "string" ? buf.fill(fill, encoding) : buf.fill(fill) : buf.fill(0), buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/core-util-is/lib/util.js
var require_util = __commonJS({
  "node_modules/core-util-is/lib/util.js"(exports) {
    function isArray(arg) {
      return Array.isArray ? Array.isArray(arg) : objectToString(arg) === "[object Array]";
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg == "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg == "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg == "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg == "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg == "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    function isError(e) {
      return objectToString(e) === "[object Error]" || e instanceof Error;
    }
    exports.isError = isError;
    function isFunction(arg) {
      return typeof arg == "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg == "boolean" || typeof arg == "number" || typeof arg == "string" || typeof arg == "symbol" || // ES6 symbol
      typeof arg > "u";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = __require("buffer").Buffer.isBuffer;
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    typeof Object.create == "function" ? module.exports = function(ctor, superCtor) {
      superCtor && (ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : module.exports = function(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor(), ctor.prototype.constructor = ctor;
      }
    };
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module) {
    try {
      if (util = __require("util"), typeof util.inherits != "function") throw "";
      module.exports = util.inherits;
    } catch {
      module.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/readable-stream/lib/internal/streams/BufferList.js
var require_BufferList = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/BufferList.js"(exports, module) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    var Buffer2 = require_safe_buffer().Buffer, util = __require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = (function() {
      function BufferList() {
        _classCallCheck(this, BufferList), this.head = null, this.tail = null, this.length = 0;
      }
      return BufferList.prototype.push = function(v) {
        var entry = { data: v, next: null };
        this.length > 0 ? this.tail.next = entry : this.head = entry, this.tail = entry, ++this.length;
      }, BufferList.prototype.unshift = function(v) {
        var entry = { data: v, next: this.head };
        this.length === 0 && (this.tail = entry), this.head = entry, ++this.length;
      }, BufferList.prototype.shift = function() {
        if (this.length !== 0) {
          var ret = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, ret;
        }
      }, BufferList.prototype.clear = function() {
        this.head = this.tail = null, this.length = 0;
      }, BufferList.prototype.join = function(s) {
        if (this.length === 0) return "";
        for (var p = this.head, ret = "" + p.data; p = p.next; )
          ret += s + p.data;
        return ret;
      }, BufferList.prototype.concat = function(n) {
        if (this.length === 0) return Buffer2.alloc(0);
        for (var ret = Buffer2.allocUnsafe(n >>> 0), p = this.head, i = 0; p; )
          copyBuffer(p.data, ret, i), i += p.data.length, p = p.next;
        return ret;
      }, BufferList;
    })();
    util && util.inspect && util.inspect.custom && (module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({ length: this.length });
      return this.constructor.name + " " + obj;
    });
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    function destroy(err, cb) {
      var _this = this, readableDestroyed = this._readableState && this._readableState.destroyed, writableDestroyed = this._writableState && this._writableState.destroyed;
      return readableDestroyed || writableDestroyed ? (cb ? cb(err) : err && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, pna.nextTick(emitErrorNT, this, err)) : pna.nextTick(emitErrorNT, this, err)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(err || null, function(err2) {
        !cb && err2 ? _this._writableState ? _this._writableState.errorEmitted || (_this._writableState.errorEmitted = !0, pna.nextTick(emitErrorNT, _this, err2)) : pna.nextTick(emitErrorNT, _this, err2) : cb && cb(err2);
      }), this);
    }
    function undestroy() {
      this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy
    };
  }
});

// node_modules/util-deprecate/node.js
var require_node = __commonJS({
  "node_modules/util-deprecate/node.js"(exports, module) {
    module.exports = __require("util").deprecate;
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null, this.entry = null, this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var asyncWrite = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick, Duplex;
    Writable.WritableState = WritableState;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var internalUtil = {
      deprecate: require_node()
    }, Stream = require_stream(), Buffer2 = require_safe_buffer().Buffer, OurUint8Array = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    util.inherits(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream) {
      Duplex = Duplex || require_stream_duplex(), options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode, isDuplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
      var hwm = options.highWaterMark, writableHwm = options.writableHighWaterMark, defaultHwm = this.objectMode ? 16 : 16 * 1024;
      hwm || hwm === 0 ? this.highWaterMark = hwm : isDuplex && (writableHwm || writableHwm === 0) ? this.highWaterMark = writableHwm : this.highWaterMark = defaultHwm, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
      var noDecode = options.decodeStrings === !1;
      this.decodeStrings = !noDecode, this.defaultEncoding = options.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(er) {
        onwrite(stream, er);
      }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function() {
      for (var current = this.bufferedRequest, out = []; current; )
        out.push(current), current = current.next;
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch {
      }
    })();
    var realHasInstance;
    typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (realHasInstance = Function.prototype[Symbol.hasInstance], Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function(object) {
        return realHasInstance.call(this, object) ? !0 : this !== Writable ? !1 : object && object._writableState instanceof WritableState;
      }
    })) : realHasInstance = function(object) {
      return object instanceof this;
    };
    function Writable(options) {
      if (Duplex = Duplex || require_stream_duplex(), !realHasInstance.call(Writable, this) && !(this instanceof Duplex))
        return new Writable(options);
      this._writableState = new WritableState(options, this), this.writable = !0, options && (typeof options.write == "function" && (this._write = options.write), typeof options.writev == "function" && (this._writev = options.writev), typeof options.destroy == "function" && (this._destroy = options.destroy), typeof options.final == "function" && (this._final = options.final)), Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    function writeAfterEnd(stream, cb) {
      var er = new Error("write after end");
      stream.emit("error", er), pna.nextTick(cb, er);
    }
    function validChunk(stream, state, chunk, cb) {
      var valid = !0, er = !1;
      return chunk === null ? er = new TypeError("May not write null values to stream") : typeof chunk != "string" && chunk !== void 0 && !state.objectMode && (er = new TypeError("Invalid non-string/buffer chunk")), er && (stream.emit("error", er), pna.nextTick(cb, er), valid = !1), valid;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState, ret = !1, isBuf = !state.objectMode && _isUint8Array(chunk);
      return isBuf && !Buffer2.isBuffer(chunk) && (chunk = _uint8ArrayToBuffer(chunk)), typeof encoding == "function" && (cb = encoding, encoding = null), isBuf ? encoding = "buffer" : encoding || (encoding = state.defaultEncoding), typeof cb != "function" && (cb = nop), state.ended ? writeAfterEnd(this, cb) : (isBuf || validChunk(this, state, chunk, cb)) && (state.pendingcb++, ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb)), ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      state.corked && (state.corked--, !state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest && clearBuffer(this, state));
    };
    Writable.prototype.setDefaultEncoding = function(encoding) {
      if (typeof encoding == "string" && (encoding = encoding.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
      return this._writableState.defaultEncoding = encoding, this;
    };
    function decodeChunk(state, chunk, encoding) {
      return !state.objectMode && state.decodeStrings !== !1 && typeof chunk == "string" && (chunk = Buffer2.from(chunk, encoding)), chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: !1,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        chunk !== newChunk && (isBuf = !0, encoding = "buffer", chunk = newChunk);
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (ret || (state.needDrain = !0), state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        }, last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest, state.bufferedRequestCount += 1;
      } else
        doWrite(stream, state, !1, len, chunk, encoding, cb);
      return ret;
    }
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len, state.writecb = cb, state.writing = !0, state.sync = !0, writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite), state.sync = !1;
    }
    function onwriteError(stream, state, sync, er, cb) {
      --state.pendingcb, sync ? (pna.nextTick(cb, er), pna.nextTick(finishMaybe, stream, state), stream._writableState.errorEmitted = !0, stream.emit("error", er)) : (cb(er), stream._writableState.errorEmitted = !0, stream.emit("error", er), finishMaybe(stream, state));
    }
    function onwriteStateUpdate(state) {
      state.writing = !1, state.writecb = null, state.length -= state.writelen, state.writelen = 0;
    }
    function onwrite(stream, er) {
      var state = stream._writableState, sync = state.sync, cb = state.writecb;
      if (onwriteStateUpdate(state), er) onwriteError(stream, state, sync, er, cb);
      else {
        var finished = needFinish(state);
        !finished && !state.corked && !state.bufferProcessing && state.bufferedRequest && clearBuffer(stream, state), sync ? asyncWrite(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb);
      }
    }
    function afterWrite(stream, state, finished, cb) {
      finished || onwriteDrain(stream, state), state.pendingcb--, cb(), finishMaybe(stream, state);
    }
    function onwriteDrain(stream, state) {
      state.length === 0 && state.needDrain && (state.needDrain = !1, stream.emit("drain"));
    }
    function clearBuffer(stream, state) {
      state.bufferProcessing = !0;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount, buffer = new Array(l), holder = state.corkedRequestsFree;
        holder.entry = entry;
        for (var count = 0, allBuffers = !0; entry; )
          buffer[count] = entry, entry.isBuf || (allBuffers = !1), entry = entry.next, count += 1;
        buffer.allBuffers = allBuffers, doWrite(stream, state, !0, state.length, buffer, "", holder.finish), state.pendingcb++, state.lastBufferedRequest = null, holder.next ? (state.corkedRequestsFree = holder.next, holder.next = null) : state.corkedRequestsFree = new CorkedRequest(state), state.bufferedRequestCount = 0;
      } else {
        for (; entry; ) {
          var chunk = entry.chunk, encoding = entry.encoding, cb = entry.callback, len = state.objectMode ? 1 : chunk.length;
          if (doWrite(stream, state, !1, len, chunk, encoding, cb), entry = entry.next, state.bufferedRequestCount--, state.writing)
            break;
        }
        entry === null && (state.lastBufferedRequest = null);
      }
      state.bufferedRequest = entry, state.bufferProcessing = !1;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("_write() is not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      typeof chunk == "function" ? (cb = chunk, chunk = null, encoding = null) : typeof encoding == "function" && (cb = encoding, encoding = null), chunk != null && this.write(chunk, encoding), state.corked && (state.corked = 1, this.uncork()), state.ending || endWritable(this, state, cb);
    };
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--, err && stream.emit("error", err), state.prefinished = !0, stream.emit("prefinish"), finishMaybe(stream, state);
      });
    }
    function prefinish(stream, state) {
      !state.prefinished && !state.finalCalled && (typeof stream._final == "function" ? (state.pendingcb++, state.finalCalled = !0, pna.nextTick(callFinal, stream, state)) : (state.prefinished = !0, stream.emit("prefinish")));
    }
    function finishMaybe(stream, state) {
      var need = needFinish(state);
      return need && (prefinish(stream, state), state.pendingcb === 0 && (state.finished = !0, stream.emit("finish"))), need;
    }
    function endWritable(stream, state, cb) {
      state.ending = !0, finishMaybe(stream, state), cb && (state.finished ? pna.nextTick(cb) : stream.once("finish", cb)), state.ended = !0, stream.writable = !1;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      for (corkReq.entry = null; entry; ) {
        var cb = entry.callback;
        state.pendingcb--, cb(err), entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      get: function() {
        return this._writableState === void 0 ? !1 : this._writableState.destroyed;
      },
      set: function(value) {
        this._writableState && (this._writableState.destroyed = value);
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      this.end(), cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args(), objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj)
        keys2.push(key);
      return keys2;
    };
    module.exports = Duplex;
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var Readable2 = require_stream_readable(), Writable = require_stream_writable();
    util.inherits(Duplex, Readable2);
    for (keys = objectKeys(Writable.prototype), v = 0; v < keys.length; v++)
      method = keys[v], Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
    var keys, method, v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable2.call(this, options), Writable.call(this, options), options && options.readable === !1 && (this.readable = !1), options && options.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, options && options.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: !1,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      this.allowHalfOpen || this._writableState.ended || pna.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = value, this._writableState.destroyed = value);
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null), this.end(), pna.nextTick(cb, err);
    };
  }
});

// node_modules/string_decoder/node_modules/safe-buffer/index.js
var require_safe_buffer2 = __commonJS({
  "node_modules/string_decoder/node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = __require("buffer"), Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src)
        dst[key] = src[key];
    }
    Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow ? module.exports = buffer : (copyProps(buffer, exports), exports.Buffer = SafeBuffer);
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg == "number")
        throw new TypeError("Argument must not be a number");
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      var buf = Buffer2(size);
      return fill !== void 0 ? typeof encoding == "string" ? buf.fill(fill, encoding) : buf.fill(fill) : buf.fill(0), buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size != "number")
        throw new TypeError("Argument must be a number");
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    var Buffer2 = require_safe_buffer2().Buffer, isEncoding = Buffer2.isEncoding || function(encoding) {
      switch (encoding = "" + encoding, encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return !0;
        default:
          return !1;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      for (var retried; ; )
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried) return;
            enc = ("" + enc).toLowerCase(), retried = !0;
        }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc != "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text, this.end = utf16End, nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast, nb = 4;
          break;
        case "base64":
          this.text = base64Text, this.end = base64End, nb = 3;
          break;
        default:
          this.write = simpleWrite, this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = Buffer2.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (buf.length === 0) return "";
      var r, i;
      if (this.lastNeed) {
        if (r = this.fillLast(buf), r === void 0) return "";
        i = this.lastNeed, this.lastNeed = 0;
      } else
        i = 0;
      return i < buf.length ? r ? r + this.text(buf, i) : this.text(buf, i) : r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length)
        return buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length), this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      return byte <= 127 ? 0 : byte >> 5 === 6 ? 2 : byte >> 4 === 14 ? 3 : byte >> 3 === 30 ? 4 : byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      return nb >= 0 ? (nb > 0 && (self2.lastNeed = nb - 1), nb) : --j < i || nb === -2 ? 0 : (nb = utf8CheckByte(buf[j]), nb >= 0 ? (nb > 0 && (self2.lastNeed = nb - 2), nb) : --j < i || nb === -2 ? 0 : (nb = utf8CheckByte(buf[j]), nb >= 0 ? (nb > 0 && (nb === 2 ? nb = 0 : self2.lastNeed = nb - 3), nb) : 0));
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128)
        return self2.lastNeed = 0, "\uFFFD";
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128)
          return self2.lastNeed = 1, "\uFFFD";
        if (self2.lastNeed > 2 && buf.length > 2 && (buf[2] & 192) !== 128)
          return self2.lastNeed = 2, "\uFFFD";
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed, r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0) return r;
      if (this.lastNeed <= buf.length)
        return buf.copy(this.lastChar, p, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      buf.copy(this.lastChar, p, 0, buf.length), this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      return buf.copy(this.lastChar, 0, end), buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      return this.lastNeed ? r + "\uFFFD" : r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319)
            return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = buf[buf.length - 2], this.lastChar[1] = buf[buf.length - 1], r.slice(0, -1);
        }
        return r;
      }
      return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = buf[buf.length - 1], buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      return n === 0 ? buf.toString("base64", i) : (this.lastNeed = 3 - n, this.lastTotal = 3, n === 1 ? this.lastChar[0] = buf[buf.length - 1] : (this.lastChar[0] = buf[buf.length - 2], this.lastChar[1] = buf[buf.length - 1]), buf.toString("base64", i, buf.length - n));
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      return this.lastNeed ? r + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    var pna = require_process_nextick_args();
    module.exports = Readable2;
    var isArray = require_isarray(), Duplex;
    Readable2.ReadableState = ReadableState;
    var EE = __require("events").EventEmitter, EElistenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    }, Stream = require_stream(), Buffer2 = require_safe_buffer().Buffer, OurUint8Array = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var util = Object.create(require_util());
    util.inherits = require_inherits();
    var debugUtil = __require("util"), debug = void 0;
    debugUtil && debugUtil.debuglog ? debug = debugUtil.debuglog("stream") : debug = function() {
    };
    var BufferList = require_BufferList(), destroyImpl = require_destroy(), StringDecoder;
    util.inherits(Readable2, Stream);
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener == "function") return emitter.prependListener(event, fn);
      !emitter._events || !emitter._events[event] ? emitter.on(event, fn) : isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream) {
      Duplex = Duplex || require_stream_duplex(), options = options || {};
      var isDuplex = stream instanceof Duplex;
      this.objectMode = !!options.objectMode, isDuplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
      var hwm = options.highWaterMark, readableHwm = options.readableHighWaterMark, defaultHwm = this.objectMode ? 16 : 16 * 1024;
      hwm || hwm === 0 ? this.highWaterMark = hwm : isDuplex && (readableHwm || readableHwm === 0) ? this.highWaterMark = readableHwm : this.highWaterMark = defaultHwm, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new BufferList(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = options.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, options.encoding && (StringDecoder || (StringDecoder = require_string_decoder().StringDecoder), this.decoder = new StringDecoder(options.encoding), this.encoding = options.encoding);
    }
    function Readable2(options) {
      if (Duplex = Duplex || require_stream_duplex(), !(this instanceof Readable2)) return new Readable2(options);
      this._readableState = new ReadableState(options, this), this.readable = !0, options && (typeof options.read == "function" && (this._read = options.read), typeof options.destroy == "function" && (this._destroy = options.destroy)), Stream.call(this);
    }
    Object.defineProperty(Readable2.prototype, "destroyed", {
      get: function() {
        return this._readableState === void 0 ? !1 : this._readableState.destroyed;
      },
      set: function(value) {
        this._readableState && (this._readableState.destroyed = value);
      }
    });
    Readable2.prototype.destroy = destroyImpl.destroy;
    Readable2.prototype._undestroy = destroyImpl.undestroy;
    Readable2.prototype._destroy = function(err, cb) {
      this.push(null), cb(err);
    };
    Readable2.prototype.push = function(chunk, encoding) {
      var state = this._readableState, skipChunkCheck;
      return state.objectMode ? skipChunkCheck = !0 : typeof chunk == "string" && (encoding = encoding || state.defaultEncoding, encoding !== state.encoding && (chunk = Buffer2.from(chunk, encoding), encoding = ""), skipChunkCheck = !0), readableAddChunk(this, chunk, encoding, !1, skipChunkCheck);
    };
    Readable2.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, !0, !1);
    };
    function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
      var state = stream._readableState;
      if (chunk === null)
        state.reading = !1, onEofChunk(stream, state);
      else {
        var er;
        skipChunkCheck || (er = chunkInvalid(state, chunk)), er ? stream.emit("error", er) : state.objectMode || chunk && chunk.length > 0 ? (typeof chunk != "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype && (chunk = _uint8ArrayToBuffer(chunk)), addToFront ? state.endEmitted ? stream.emit("error", new Error("stream.unshift() after end event")) : addChunk(stream, state, chunk, !0) : state.ended ? stream.emit("error", new Error("stream.push() after EOF")) : (state.reading = !1, state.decoder && !encoding ? (chunk = state.decoder.write(chunk), state.objectMode || chunk.length !== 0 ? addChunk(stream, state, chunk, !1) : maybeReadMore(stream, state)) : addChunk(stream, state, chunk, !1))) : addToFront || (state.reading = !1);
      }
      return needMoreData(state);
    }
    function addChunk(stream, state, chunk, addToFront) {
      state.flowing && state.length === 0 && !state.sync ? (stream.emit("data", chunk), stream.read(0)) : (state.length += state.objectMode ? 1 : chunk.length, addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk), state.needReadable && emitReadable(stream)), maybeReadMore(stream, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      return !_isUint8Array(chunk) && typeof chunk != "string" && chunk !== void 0 && !state.objectMode && (er = new TypeError("Invalid non-string/buffer chunk")), er;
    }
    function needMoreData(state) {
      return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
    }
    Readable2.prototype.isPaused = function() {
      return this._readableState.flowing === !1;
    };
    Readable2.prototype.setEncoding = function(enc) {
      return StringDecoder || (StringDecoder = require_string_decoder().StringDecoder), this._readableState.decoder = new StringDecoder(enc), this._readableState.encoding = enc, this;
    };
    var MAX_HWM = 8388608;
    function computeNewHighWaterMark(n) {
      return n >= MAX_HWM ? n = MAX_HWM : (n--, n |= n >>> 1, n |= n >>> 2, n |= n >>> 4, n |= n >>> 8, n |= n >>> 16, n++), n;
    }
    function howMuchToRead(n, state) {
      return n <= 0 || state.length === 0 && state.ended ? 0 : state.objectMode ? 1 : n !== n ? state.flowing && state.length ? state.buffer.head.data.length : state.length : (n > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n)), n <= state.length ? n : state.ended ? state.length : (state.needReadable = !0, 0));
    }
    Readable2.prototype.read = function(n) {
      debug("read", n), n = parseInt(n, 10);
      var state = this._readableState, nOrig = n;
      if (n !== 0 && (state.emittedReadable = !1), n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended))
        return debug("read: emitReadable", state.length, state.ended), state.length === 0 && state.ended ? endReadable(this) : emitReadable(this), null;
      if (n = howMuchToRead(n, state), n === 0 && state.ended)
        return state.length === 0 && endReadable(this), null;
      var doRead = state.needReadable;
      debug("need readable", doRead), (state.length === 0 || state.length - n < state.highWaterMark) && (doRead = !0, debug("length less than watermark", doRead)), state.ended || state.reading ? (doRead = !1, debug("reading or ended", doRead)) : doRead && (debug("do read"), state.reading = !0, state.sync = !0, state.length === 0 && (state.needReadable = !0), this._read(state.highWaterMark), state.sync = !1, state.reading || (n = howMuchToRead(nOrig, state)));
      var ret;
      return n > 0 ? ret = fromList(n, state) : ret = null, ret === null ? (state.needReadable = !0, n = 0) : state.length -= n, state.length === 0 && (state.ended || (state.needReadable = !0), nOrig !== n && state.ended && endReadable(this)), ret !== null && this.emit("data", ret), ret;
    };
    function onEofChunk(stream, state) {
      if (!state.ended) {
        if (state.decoder) {
          var chunk = state.decoder.end();
          chunk && chunk.length && (state.buffer.push(chunk), state.length += state.objectMode ? 1 : chunk.length);
        }
        state.ended = !0, emitReadable(stream);
      }
    }
    function emitReadable(stream) {
      var state = stream._readableState;
      state.needReadable = !1, state.emittedReadable || (debug("emitReadable", state.flowing), state.emittedReadable = !0, state.sync ? pna.nextTick(emitReadable_, stream) : emitReadable_(stream));
    }
    function emitReadable_(stream) {
      debug("emit readable"), stream.emit("readable"), flow(stream);
    }
    function maybeReadMore(stream, state) {
      state.readingMore || (state.readingMore = !0, pna.nextTick(maybeReadMore_, stream, state));
    }
    function maybeReadMore_(stream, state) {
      for (var len = state.length; !state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark && (debug("maybeReadMore read 0"), stream.read(0), len !== state.length); )
        len = state.length;
      state.readingMore = !1;
    }
    Readable2.prototype._read = function(n) {
      this.emit("error", new Error("_read() is not implemented"));
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      var src = this, state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1, debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== !1) && dest !== process.stdout && dest !== process.stderr, endFn = doEnd ? onend : unpipe;
      state.endEmitted ? pna.nextTick(endFn) : src.once("end", endFn), dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe"), readable === src && unpipeInfo && unpipeInfo.hasUnpiped === !1 && (unpipeInfo.hasUnpiped = !0, cleanup());
      }
      function onend() {
        debug("onend"), dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = !1;
      function cleanup() {
        debug("cleanup"), dest.removeListener("close", onclose), dest.removeListener("finish", onfinish), dest.removeListener("drain", ondrain), dest.removeListener("error", onerror), dest.removeListener("unpipe", onunpipe), src.removeListener("end", onend), src.removeListener("end", unpipe), src.removeListener("data", ondata), cleanedUp = !0, state.awaitDrain && (!dest._writableState || dest._writableState.needDrain) && ondrain();
      }
      var increasedAwaitDrain = !1;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata"), increasedAwaitDrain = !1;
        var ret = dest.write(chunk);
        ret === !1 && !increasedAwaitDrain && ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp && (debug("false write response, pause", state.awaitDrain), state.awaitDrain++, increasedAwaitDrain = !0), src.pause());
      }
      function onerror(er) {
        debug("onerror", er), unpipe(), dest.removeListener("error", onerror), EElistenerCount(dest, "error") === 0 && dest.emit("error", er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish), unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish"), dest.removeListener("close", onclose), unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe"), src.unpipe(dest);
      }
      return dest.emit("pipe", src), state.flowing || (debug("pipe resume"), src.resume()), dest;
    };
    function pipeOnDrain(src) {
      return function() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain), state.awaitDrain && state.awaitDrain--, state.awaitDrain === 0 && EElistenerCount(src, "data") && (state.flowing = !0, flow(src));
      };
    }
    Readable2.prototype.unpipe = function(dest) {
      var state = this._readableState, unpipeInfo = { hasUnpiped: !1 };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1)
        return dest && dest !== state.pipes ? this : (dest || (dest = state.pipes), state.pipes = null, state.pipesCount = 0, state.flowing = !1, dest && dest.emit("unpipe", this, unpipeInfo), this);
      if (!dest) {
        var dests = state.pipes, len = state.pipesCount;
        state.pipes = null, state.pipesCount = 0, state.flowing = !1;
        for (var i = 0; i < len; i++)
          dests[i].emit("unpipe", this, { hasUnpiped: !1 });
        return this;
      }
      var index = indexOf(state.pipes, dest);
      return index === -1 ? this : (state.pipes.splice(index, 1), state.pipesCount -= 1, state.pipesCount === 1 && (state.pipes = state.pipes[0]), dest.emit("unpipe", this, unpipeInfo), this);
    };
    Readable2.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      if (ev === "data")
        this._readableState.flowing !== !1 && this.resume();
      else if (ev === "readable") {
        var state = this._readableState;
        !state.endEmitted && !state.readableListening && (state.readableListening = state.needReadable = !0, state.emittedReadable = !1, state.reading ? state.length && emitReadable(this) : pna.nextTick(nReadingNextTick, this));
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0"), self2.read(0);
    }
    Readable2.prototype.resume = function() {
      var state = this._readableState;
      return state.flowing || (debug("resume"), state.flowing = !0, resume(this, state)), this;
    };
    function resume(stream, state) {
      state.resumeScheduled || (state.resumeScheduled = !0, pna.nextTick(resume_, stream, state));
    }
    function resume_(stream, state) {
      state.reading || (debug("resume read 0"), stream.read(0)), state.resumeScheduled = !1, state.awaitDrain = 0, stream.emit("resume"), flow(stream), state.flowing && !state.reading && stream.read(0);
    }
    Readable2.prototype.pause = function() {
      return debug("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (debug("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
    };
    function flow(stream) {
      var state = stream._readableState;
      for (debug("flow", state.flowing); state.flowing && stream.read() !== null; )
        ;
    }
    Readable2.prototype.wrap = function(stream) {
      var _this = this, state = this._readableState, paused = !1;
      stream.on("end", function() {
        if (debug("wrapped end"), state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          chunk && chunk.length && _this.push(chunk);
        }
        _this.push(null);
      }), stream.on("data", function(chunk) {
        if (debug("wrapped data"), state.decoder && (chunk = state.decoder.write(chunk)), !(state.objectMode && chunk == null) && !(!state.objectMode && (!chunk || !chunk.length))) {
          var ret = _this.push(chunk);
          ret || (paused = !0, stream.pause());
        }
      });
      for (var i in stream)
        this[i] === void 0 && typeof stream[i] == "function" && (this[i] = /* @__PURE__ */ (function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        })(i));
      for (var n = 0; n < kProxyEvents.length; n++)
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      return this._read = function(n2) {
        debug("wrapped _read", n2), paused && (paused = !1, stream.resume());
      }, this;
    };
    Object.defineProperty(Readable2.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: !1,
      get: function() {
        return this._readableState.highWaterMark;
      }
    });
    Readable2._fromList = fromList;
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      return state.objectMode ? ret = state.buffer.shift() : !n || n >= state.length ? (state.decoder ? ret = state.buffer.join("") : state.buffer.length === 1 ? ret = state.buffer.head.data : ret = state.buffer.concat(state.length), state.buffer.clear()) : ret = fromListPartial(n, state.buffer, state.decoder), ret;
    }
    function fromListPartial(n, list, hasStrings) {
      var ret;
      return n < list.head.data.length ? (ret = list.head.data.slice(0, n), list.head.data = list.head.data.slice(n)) : n === list.head.data.length ? ret = list.shift() : ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list), ret;
    }
    function copyFromBufferString(n, list) {
      var p = list.head, c = 1, ret = p.data;
      for (n -= ret.length; p = p.next; ) {
        var str = p.data, nb = n > str.length ? str.length : n;
        if (nb === str.length ? ret += str : ret += str.slice(0, n), n -= nb, n === 0) {
          nb === str.length ? (++c, p.next ? list.head = p.next : list.head = list.tail = null) : (list.head = p, p.data = str.slice(nb));
          break;
        }
        ++c;
      }
      return list.length -= c, ret;
    }
    function copyFromBuffer(n, list) {
      var ret = Buffer2.allocUnsafe(n), p = list.head, c = 1;
      for (p.data.copy(ret), n -= p.data.length; p = p.next; ) {
        var buf = p.data, nb = n > buf.length ? buf.length : n;
        if (buf.copy(ret, ret.length - n, 0, nb), n -= nb, n === 0) {
          nb === buf.length ? (++c, p.next ? list.head = p.next : list.head = list.tail = null) : (list.head = p, p.data = buf.slice(nb));
          break;
        }
        ++c;
      }
      return list.length -= c, ret;
    }
    function endReadable(stream) {
      var state = stream._readableState;
      if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
      state.endEmitted || (state.ended = !0, pna.nextTick(endReadableNT, state, stream));
    }
    function endReadableNT(state, stream) {
      !state.endEmitted && state.length === 0 && (state.endEmitted = !0, stream.readable = !1, stream.emit("end"));
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++)
        if (xs[i] === x) return i;
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    module.exports = Transform;
    var Duplex = require_stream_duplex(), util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = !1;
      var cb = ts.writecb;
      if (!cb)
        return this.emit("error", new Error("write callback called multiple times"));
      ts.writechunk = null, ts.writecb = null, data != null && this.push(data), cb(er);
      var rs = this._readableState;
      rs.reading = !1, (rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options), this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: !1,
        transforming: !1,
        writecb: null,
        writechunk: null,
        writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, options && (typeof options.transform == "function" && (this._transform = options.transform), typeof options.flush == "function" && (this._flush = options.flush)), this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      typeof this._flush == "function" ? this._flush(function(er, data) {
        done(_this, er, data);
      }) : done(this, null, null);
    }
    Transform.prototype.push = function(chunk, encoding) {
      return this._transformState.needTransform = !1, Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      if (ts.writecb = cb, ts.writechunk = chunk, ts.writeencoding = encoding, !ts.transforming) {
        var rs = this._readableState;
        (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      ts.writechunk !== null && ts.writecb && !ts.transforming ? (ts.transforming = !0, this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)) : ts.needTransform = !0;
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2), _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      if (data != null && stream.push(data), stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform(), util = Object.create(require_util());
    util.inherits = require_inherits();
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/readable.js"(exports, module) {
    var Stream = __require("stream");
    process.env.READABLE_STREAM === "disable" && Stream ? (module.exports = Stream, exports = module.exports = Stream.Readable, exports.Readable = Stream.Readable, exports.Writable = Stream.Writable, exports.Duplex = Stream.Duplex, exports.Transform = Stream.Transform, exports.PassThrough = Stream.PassThrough, exports.Stream = Stream) : (exports = module.exports = require_stream_readable(), exports.Stream = Stream || exports, exports.Readable = exports, exports.Writable = require_stream_writable(), exports.Duplex = require_stream_duplex(), exports.Transform = require_stream_transform(), exports.PassThrough = require_stream_passthrough());
  }
});

// node_modules/jszip/lib/support.js
var require_support = __commonJS({
  "node_modules/jszip/lib/support.js"(exports) {
    "use strict";
    exports.base64 = !0;
    exports.array = !0;
    exports.string = !0;
    exports.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u";
    exports.nodebuffer = typeof Buffer < "u";
    exports.uint8array = typeof Uint8Array < "u";
    if (typeof ArrayBuffer > "u")
      exports.blob = !1;
    else {
      buffer = new ArrayBuffer(0);
      try {
        exports.blob = new Blob([buffer], {
          type: "application/zip"
        }).size === 0;
      } catch {
        try {
          Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder, builder = new Builder(), builder.append(buffer), exports.blob = builder.getBlob("application/zip").size === 0;
        } catch {
          exports.blob = !1;
        }
      }
    }
    var buffer, Builder, builder;
    try {
      exports.nodestream = !!require_readable().Readable;
    } catch {
      exports.nodestream = !1;
    }
  }
});

// node_modules/jszip/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/jszip/lib/base64.js"(exports) {
    "use strict";
    var utils = require_utils(), support = require_support(), _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    exports.encode = function(input) {
      for (var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, len = input.length, remainingBytes = len, isArray = utils.getTypeOf(input) !== "string"; i < input.length; )
        remainingBytes = len - i, isArray ? (chr1 = input[i++], chr2 = i < len ? input[i++] : 0, chr3 = i < len ? input[i++] : 0) : (chr1 = input.charCodeAt(i++), chr2 = i < len ? input.charCodeAt(i++) : 0, chr3 = i < len ? input.charCodeAt(i++) : 0), enc1 = chr1 >> 2, enc2 = (chr1 & 3) << 4 | chr2 >> 4, enc3 = remainingBytes > 1 ? (chr2 & 15) << 2 | chr3 >> 6 : 64, enc4 = remainingBytes > 2 ? chr3 & 63 : 64, output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
      return output.join("");
    };
    exports.decode = function(input) {
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, resultIndex = 0, dataUrlPrefix = "data:";
      if (input.substr(0, dataUrlPrefix.length) === dataUrlPrefix)
        throw new Error("Invalid base64 input, it looks like a data url.");
      input = input.replace(/[^A-Za-z0-9+/=]/g, "");
      var totalLength = input.length * 3 / 4;
      if (input.charAt(input.length - 1) === _keyStr.charAt(64) && totalLength--, input.charAt(input.length - 2) === _keyStr.charAt(64) && totalLength--, totalLength % 1 !== 0)
        throw new Error("Invalid base64 input, bad content length.");
      var output;
      for (support.uint8array ? output = new Uint8Array(totalLength | 0) : output = new Array(totalLength | 0); i < input.length; )
        enc1 = _keyStr.indexOf(input.charAt(i++)), enc2 = _keyStr.indexOf(input.charAt(i++)), enc3 = _keyStr.indexOf(input.charAt(i++)), enc4 = _keyStr.indexOf(input.charAt(i++)), chr1 = enc1 << 2 | enc2 >> 4, chr2 = (enc2 & 15) << 4 | enc3 >> 2, chr3 = (enc3 & 3) << 6 | enc4, output[resultIndex++] = chr1, enc3 !== 64 && (output[resultIndex++] = chr2), enc4 !== 64 && (output[resultIndex++] = chr3);
      return output;
    };
  }
});

// node_modules/jszip/lib/nodejsUtils.js
var require_nodejsUtils = __commonJS({
  "node_modules/jszip/lib/nodejsUtils.js"(exports, module) {
    "use strict";
    module.exports = {
      /**
       * True if this is running in Nodejs, will be undefined in a browser.
       * In a browser, browserify won't include this file and the whole module
       * will be resolved an empty object.
       */
      isNode: typeof Buffer < "u",
      /**
       * Create a new nodejs Buffer from an existing content.
       * @param {Object} data the data to pass to the constructor.
       * @param {String} encoding the encoding to use.
       * @return {Buffer} a new Buffer.
       */
      newBufferFrom: function(data, encoding) {
        if (Buffer.from && Buffer.from !== Uint8Array.from)
          return Buffer.from(data, encoding);
        if (typeof data == "number")
          throw new Error('The "data" argument must not be a number');
        return new Buffer(data, encoding);
      },
      /**
       * Create a new nodejs Buffer with the specified size.
       * @param {Integer} size the size of the buffer.
       * @return {Buffer} a new Buffer.
       */
      allocBuffer: function(size) {
        if (Buffer.alloc)
          return Buffer.alloc(size);
        var buf = new Buffer(size);
        return buf.fill(0), buf;
      },
      /**
       * Find out if an object is a Buffer.
       * @param {Object} b the object to test.
       * @return {Boolean} true if the object is a Buffer, false otherwise.
       */
      isBuffer: function(b) {
        return Buffer.isBuffer(b);
      },
      isStream: function(obj) {
        return obj && typeof obj.on == "function" && typeof obj.pause == "function" && typeof obj.resume == "function";
      }
    };
  }
});

// node_modules/immediate/lib/index.js
var require_lib = __commonJS({
  "node_modules/immediate/lib/index.js"(exports, module) {
    "use strict";
    var Mutation = global.MutationObserver || global.WebKitMutationObserver, scheduleDrain;
    process.browser ? Mutation ? (called = 0, observer = new Mutation(nextTick), element = global.document.createTextNode(""), observer.observe(element, {
      characterData: !0
    }), scheduleDrain = function() {
      element.data = called = ++called % 2;
    }) : !global.setImmediate && typeof global.MessageChannel < "u" ? (channel = new global.MessageChannel(), channel.port1.onmessage = nextTick, scheduleDrain = function() {
      channel.port2.postMessage(0);
    }) : "document" in global && "onreadystatechange" in global.document.createElement("script") ? scheduleDrain = function() {
      var scriptEl = global.document.createElement("script");
      scriptEl.onreadystatechange = function() {
        nextTick(), scriptEl.onreadystatechange = null, scriptEl.parentNode.removeChild(scriptEl), scriptEl = null;
      }, global.document.documentElement.appendChild(scriptEl);
    } : scheduleDrain = function() {
      setTimeout(nextTick, 0);
    } : scheduleDrain = function() {
      process.nextTick(nextTick);
    };
    var called, observer, element, channel, draining, queue = [];
    function nextTick() {
      draining = !0;
      for (var i, oldQueue, len = queue.length; len; ) {
        for (oldQueue = queue, queue = [], i = -1; ++i < len; )
          oldQueue[i]();
        len = queue.length;
      }
      draining = !1;
    }
    module.exports = immediate;
    function immediate(task) {
      queue.push(task) === 1 && !draining && scheduleDrain();
    }
  }
});

// node_modules/lie/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/lie/lib/index.js"(exports, module) {
    "use strict";
    var immediate = require_lib();
    function INTERNAL() {
    }
    var handlers = {}, REJECTED = ["REJECTED"], FULFILLED = ["FULFILLED"], PENDING = ["PENDING"];
    process.browser || (UNHANDLED = ["UNHANDLED"]);
    var UNHANDLED;
    module.exports = Promise2;
    function Promise2(resolver) {
      if (typeof resolver != "function")
        throw new TypeError("resolver must be a function");
      this.state = PENDING, this.queue = [], this.outcome = void 0, process.browser || (this.handled = UNHANDLED), resolver !== INTERNAL && safelyResolveThenable(this, resolver);
    }
    Promise2.prototype.finally = function(callback) {
      if (typeof callback != "function")
        return this;
      var p = this.constructor;
      return this.then(resolve2, reject2);
      function resolve2(value) {
        function yes() {
          return value;
        }
        return p.resolve(callback()).then(yes);
      }
      function reject2(reason) {
        function no() {
          throw reason;
        }
        return p.resolve(callback()).then(no);
      }
    };
    Promise2.prototype.catch = function(onRejected) {
      return this.then(null, onRejected);
    };
    Promise2.prototype.then = function(onFulfilled, onRejected) {
      if (typeof onFulfilled != "function" && this.state === FULFILLED || typeof onRejected != "function" && this.state === REJECTED)
        return this;
      var promise = new this.constructor(INTERNAL);
      if (process.browser || this.handled === UNHANDLED && (this.handled = null), this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise, typeof onFulfilled == "function" && (this.onFulfilled = onFulfilled, this.callFulfilled = this.otherCallFulfilled), typeof onRejected == "function" && (this.onRejected = onRejected, this.callRejected = this.otherCallRejected);
    }
    QueueItem.prototype.callFulfilled = function(value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function(value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function(value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function(value) {
      unwrap(this.promise, this.onRejected, value);
    };
    function unwrap(promise, func, value) {
      immediate(function() {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        returnValue === promise ? handlers.reject(promise, new TypeError("Cannot resolve promise with itself")) : handlers.resolve(promise, returnValue);
      });
    }
    handlers.resolve = function(self2, value) {
      var result = tryCatch(getThen, value);
      if (result.status === "error")
        return handlers.reject(self2, result.value);
      var thenable = result.value;
      if (thenable)
        safelyResolveThenable(self2, thenable);
      else {
        self2.state = FULFILLED, self2.outcome = value;
        for (var i = -1, len = self2.queue.length; ++i < len; )
          self2.queue[i].callFulfilled(value);
      }
      return self2;
    };
    handlers.reject = function(self2, error) {
      self2.state = REJECTED, self2.outcome = error, process.browser || self2.handled === UNHANDLED && immediate(function() {
        self2.handled === UNHANDLED && process.emit("unhandledRejection", error, self2);
      });
      for (var i = -1, len = self2.queue.length; ++i < len; )
        self2.queue[i].callRejected(error);
      return self2;
    };
    function getThen(obj) {
      var then = obj && obj.then;
      if (obj && (typeof obj == "object" || typeof obj == "function") && typeof then == "function")
        return function() {
          then.apply(obj, arguments);
        };
    }
    function safelyResolveThenable(self2, thenable) {
      var called = !1;
      function onError(value) {
        called || (called = !0, handlers.reject(self2, value));
      }
      function onSuccess(value) {
        called || (called = !0, handlers.resolve(self2, value));
      }
      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }
      var result = tryCatch(tryToUnwrap);
      result.status === "error" && onError(result.value);
    }
    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value), out.status = "success";
      } catch (e) {
        out.status = "error", out.value = e;
      }
      return out;
    }
    Promise2.resolve = resolve;
    function resolve(value) {
      return value instanceof this ? value : handlers.resolve(new this(INTERNAL), value);
    }
    Promise2.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }
    Promise2.all = all;
    function all(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]")
        return this.reject(new TypeError("must be an array"));
      var len = iterable.length, called = !1;
      if (!len)
        return this.resolve([]);
      for (var values = new Array(len), resolved = 0, i = -1, promise = new this(INTERNAL); ++i < len; )
        allResolver(iterable[i], i);
      return promise;
      function allResolver(value, i2) {
        self2.resolve(value).then(resolveFromAll, function(error) {
          called || (called = !0, handlers.reject(promise, error));
        });
        function resolveFromAll(outValue) {
          values[i2] = outValue, ++resolved === len && !called && (called = !0, handlers.resolve(promise, values));
        }
      }
    }
    Promise2.race = race;
    function race(iterable) {
      var self2 = this;
      if (Object.prototype.toString.call(iterable) !== "[object Array]")
        return this.reject(new TypeError("must be an array"));
      var len = iterable.length, called = !1;
      if (!len)
        return this.resolve([]);
      for (var i = -1, promise = new this(INTERNAL); ++i < len; )
        resolver(iterable[i]);
      return promise;
      function resolver(value) {
        self2.resolve(value).then(function(response) {
          called || (called = !0, handlers.resolve(promise, response));
        }, function(error) {
          called || (called = !0, handlers.reject(promise, error));
        });
      }
    }
  }
});

// node_modules/jszip/lib/external.js
var require_external = __commonJS({
  "node_modules/jszip/lib/external.js"(exports, module) {
    "use strict";
    var ES6Promise = null;
    typeof Promise < "u" ? ES6Promise = Promise : ES6Promise = require_lib2();
    module.exports = {
      Promise: ES6Promise
    };
  }
});

// node_modules/setimmediate/setImmediate.js
var require_setImmediate = __commonJS({
  "node_modules/setimmediate/setImmediate.js"(exports) {
    (function(global2, undefined2) {
      "use strict";
      if (global2.setImmediate)
        return;
      var nextHandle = 1, tasksByHandle = {}, currentlyRunningATask = !1, doc = global2.document, registerImmediate;
      function setImmediate2(callback) {
        typeof callback != "function" && (callback = new Function("" + callback));
        for (var args = new Array(arguments.length - 1), i = 0; i < args.length; i++)
          args[i] = arguments[i + 1];
        var task = { callback, args };
        return tasksByHandle[nextHandle] = task, registerImmediate(nextHandle), nextHandle++;
      }
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function run(task) {
        var callback = task.callback, args = task.args;
        switch (args.length) {
          case 0:
            callback();
            break;
          case 1:
            callback(args[0]);
            break;
          case 2:
            callback(args[0], args[1]);
            break;
          case 3:
            callback(args[0], args[1], args[2]);
            break;
          default:
            callback.apply(undefined2, args);
            break;
        }
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask)
          setTimeout(runIfPresent, 0, handle);
        else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = !0;
            try {
              run(task);
            } finally {
              clearImmediate(handle), currentlyRunningATask = !1;
            }
          }
        }
      }
      function installNextTickImplementation() {
        registerImmediate = function(handle) {
          process.nextTick(function() {
            runIfPresent(handle);
          });
        };
      }
      function canUsePostMessage() {
        if (global2.postMessage && !global2.importScripts) {
          var postMessageIsAsynchronous = !0, oldOnMessage = global2.onmessage;
          return global2.onmessage = function() {
            postMessageIsAsynchronous = !1;
          }, global2.postMessage("", "*"), global2.onmessage = oldOnMessage, postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$", onGlobalMessage = function(event) {
          event.source === global2 && typeof event.data == "string" && event.data.indexOf(messagePrefix) === 0 && runIfPresent(+event.data.slice(messagePrefix.length));
        };
        global2.addEventListener ? global2.addEventListener("message", onGlobalMessage, !1) : global2.attachEvent("onmessage", onGlobalMessage), registerImmediate = function(handle) {
          global2.postMessage(messagePrefix + handle, "*");
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        }, registerImmediate = function(handle) {
          channel.port2.postMessage(handle);
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
          var script = doc.createElement("script");
          script.onreadystatechange = function() {
            runIfPresent(handle), script.onreadystatechange = null, html.removeChild(script), script = null;
          }, html.appendChild(script);
        };
      }
      function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
          setTimeout(runIfPresent, 0, handle);
        };
      }
      var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global2);
      attachTo = attachTo && attachTo.setTimeout ? attachTo : global2, {}.toString.call(global2.process) === "[object process]" ? installNextTickImplementation() : canUsePostMessage() ? installPostMessageImplementation() : global2.MessageChannel ? installMessageChannelImplementation() : doc && "onreadystatechange" in doc.createElement("script") ? installReadyStateChangeImplementation() : installSetTimeoutImplementation(), attachTo.setImmediate = setImmediate2, attachTo.clearImmediate = clearImmediate;
    })(typeof self > "u" ? typeof global > "u" ? exports : global : self);
  }
});

// node_modules/jszip/lib/utils.js
var require_utils = __commonJS({
  "node_modules/jszip/lib/utils.js"(exports) {
    "use strict";
    var support = require_support(), base64 = require_base64(), nodejsUtils = require_nodejsUtils(), external = require_external();
    require_setImmediate();
    function string2binary(str) {
      var result = null;
      return support.uint8array ? result = new Uint8Array(str.length) : result = new Array(str.length), stringToArrayLike(str, result);
    }
    exports.newBlob = function(part, type) {
      exports.checkSupport("blob");
      try {
        return new Blob([part], {
          type
        });
      } catch {
        try {
          var Builder = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder, builder = new Builder();
          return builder.append(part), builder.getBlob(type);
        } catch {
          throw new Error("Bug : can't construct the Blob.");
        }
      }
    };
    function identity(input) {
      return input;
    }
    function stringToArrayLike(str, array) {
      for (var i = 0; i < str.length; ++i)
        array[i] = str.charCodeAt(i) & 255;
      return array;
    }
    var arrayToStringHelper = {
      /**
       * Transform an array of int into a string, chunk by chunk.
       * See the performances notes on arrayLikeToString.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @param {String} type the type of the array.
       * @param {Integer} chunk the chunk size.
       * @return {String} the resulting string.
       * @throws Error if the chunk is too big for the stack.
       */
      stringifyByChunk: function(array, type, chunk) {
        var result = [], k = 0, len = array.length;
        if (len <= chunk)
          return String.fromCharCode.apply(null, array);
        for (; k < len; )
          type === "array" || type === "nodebuffer" ? result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len)))) : result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len)))), k += chunk;
        return result.join("");
      },
      /**
       * Call String.fromCharCode on every item in the array.
       * This is the naive implementation, which generate A LOT of intermediate string.
       * This should be used when everything else fail.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      stringifyByChar: function(array) {
        for (var resultStr = "", i = 0; i < array.length; i++)
          resultStr += String.fromCharCode(array[i]);
        return resultStr;
      },
      applyCanBeUsed: {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array: (function() {
          try {
            return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        })(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer: (function() {
          try {
            return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        })()
      }
    };
    function arrayLikeToString(array) {
      var chunk = 65536, type = exports.getTypeOf(array), canUseApply = !0;
      if (type === "uint8array" ? canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array : type === "nodebuffer" && (canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer), canUseApply)
        for (; chunk > 1; )
          try {
            return arrayToStringHelper.stringifyByChunk(array, type, chunk);
          } catch {
            chunk = Math.floor(chunk / 2);
          }
      return arrayToStringHelper.stringifyByChar(array);
    }
    exports.applyFromCharCode = arrayLikeToString;
    function arrayLikeToArrayLike(arrayFrom, arrayTo) {
      for (var i = 0; i < arrayFrom.length; i++)
        arrayTo[i] = arrayFrom[i];
      return arrayTo;
    }
    var transform = {};
    transform.string = {
      string: identity,
      array: function(input) {
        return stringToArrayLike(input, new Array(input.length));
      },
      arraybuffer: function(input) {
        return transform.string.uint8array(input).buffer;
      },
      uint8array: function(input) {
        return stringToArrayLike(input, new Uint8Array(input.length));
      },
      nodebuffer: function(input) {
        return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
      }
    };
    transform.array = {
      string: arrayLikeToString,
      array: identity,
      arraybuffer: function(input) {
        return new Uint8Array(input).buffer;
      },
      uint8array: function(input) {
        return new Uint8Array(input);
      },
      nodebuffer: function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform.arraybuffer = {
      string: function(input) {
        return arrayLikeToString(new Uint8Array(input));
      },
      array: function(input) {
        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
      },
      arraybuffer: identity,
      uint8array: function(input) {
        return new Uint8Array(input);
      },
      nodebuffer: function(input) {
        return nodejsUtils.newBufferFrom(new Uint8Array(input));
      }
    };
    transform.uint8array = {
      string: arrayLikeToString,
      array: function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      arraybuffer: function(input) {
        return input.buffer;
      },
      uint8array: identity,
      nodebuffer: function(input) {
        return nodejsUtils.newBufferFrom(input);
      }
    };
    transform.nodebuffer = {
      string: arrayLikeToString,
      array: function(input) {
        return arrayLikeToArrayLike(input, new Array(input.length));
      },
      arraybuffer: function(input) {
        return transform.nodebuffer.uint8array(input).buffer;
      },
      uint8array: function(input) {
        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
      },
      nodebuffer: identity
    };
    exports.transformTo = function(outputType, input) {
      if (input || (input = ""), !outputType)
        return input;
      exports.checkSupport(outputType);
      var inputType = exports.getTypeOf(input), result = transform[inputType][outputType](input);
      return result;
    };
    exports.resolve = function(path) {
      for (var parts = path.split("/"), result = [], index = 0; index < parts.length; index++) {
        var part = parts[index];
        part === "." || part === "" && index !== 0 && index !== parts.length - 1 || (part === ".." ? result.pop() : result.push(part));
      }
      return result.join("/");
    };
    exports.getTypeOf = function(input) {
      if (typeof input == "string")
        return "string";
      var proto = Object.prototype.toString.call(input);
      if (proto === "[object Array]")
        return "array";
      if (support.nodebuffer && nodejsUtils.isBuffer(input))
        return "nodebuffer";
      if (support.uint8array && proto === "[object Uint8Array]")
        return "uint8array";
      if (support.arraybuffer && proto === "[object ArrayBuffer]")
        return "arraybuffer";
    };
    exports.checkSupport = function(type) {
      var supported = support[type.toLowerCase()];
      if (!supported)
        throw new Error(type + " is not supported by this platform");
    };
    exports.MAX_VALUE_16BITS = 65535;
    exports.MAX_VALUE_32BITS = -1;
    exports.pretty = function(str) {
      var res = "", code, i;
      for (i = 0; i < (str || "").length; i++)
        code = str.charCodeAt(i), res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
      return res;
    };
    exports.delay = function(callback, args, self2) {
      setImmediate(function() {
        callback.apply(self2 || null, args || []);
      });
    };
    exports.inherits = function(ctor, superCtor) {
      var Obj = function() {
      };
      Obj.prototype = superCtor.prototype, ctor.prototype = new Obj();
    };
    exports.extend = function() {
      var result = {}, i, attr;
      for (i = 0; i < arguments.length; i++)
        for (attr in arguments[i])
          Object.prototype.hasOwnProperty.call(arguments[i], attr) && typeof result[attr] > "u" && (result[attr] = arguments[i][attr]);
      return result;
    };
    exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
      var promise = external.Promise.resolve(inputData).then(function(data) {
        var isBlob = support.blob && (data instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(data)) !== -1);
        return isBlob ? typeof Blob.prototype.arrayBuffer < "u" ? data.arrayBuffer() : typeof FileReader < "u" ? new external.Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(e) {
            resolve(e.target.result);
          }, reader.onerror = function(e) {
            reject(e.target.error);
          }, reader.readAsArrayBuffer(data);
        }) : external.Promise.reject(
          new Error(name + " is a Blob, but we have no way of reading it.")
        ) : data;
      });
      return promise.then(function(data) {
        var dataType = exports.getTypeOf(data);
        return dataType ? (dataType === "arraybuffer" ? data = exports.transformTo("uint8array", data) : dataType === "string" && (isBase64 ? data = base64.decode(data) : isBinary && isOptimizedBinaryString !== !0 && (data = string2binary(data))), data) : external.Promise.reject(
          new Error("Can't read the data of '" + name + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
        );
      });
    };
  }
});

// node_modules/jszip/lib/stream/GenericWorker.js
var require_GenericWorker = __commonJS({
  "node_modules/jszip/lib/stream/GenericWorker.js"(exports, module) {
    "use strict";
    function GenericWorker(name) {
      this.name = name || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
        data: [],
        end: [],
        error: []
      }, this.previous = null;
    }
    GenericWorker.prototype = {
      /**
       * Push a chunk to the next workers.
       * @param {Object} chunk the chunk to push
       */
      push: function(chunk) {
        this.emit("data", chunk);
      },
      /**
       * End the stream.
       * @return {Boolean} true if this call ended the worker, false otherwise.
       */
      end: function() {
        if (this.isFinished)
          return !1;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = !0;
        } catch (e) {
          this.emit("error", e);
        }
        return !0;
      },
      /**
       * End the stream with an error.
       * @param {Error} e the error which caused the premature end.
       * @return {Boolean} true if this call ended the worker with an error, false otherwise.
       */
      error: function(e) {
        return this.isFinished ? !1 : (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
      },
      /**
       * Add a callback on an event.
       * @param {String} name the name of the event (data, end, error)
       * @param {Function} listener the function to call when the event is triggered
       * @return {GenericWorker} the current object for chainability
       */
      on: function(name, listener) {
        return this._listeners[name].push(listener), this;
      },
      /**
       * Clean any references when a worker is ending.
       */
      cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      },
      /**
       * Trigger an event. This will call registered callback with the provided arg.
       * @param {String} name the name of the event (data, end, error)
       * @param {Object} arg the argument to call the callback with.
       */
      emit: function(name, arg) {
        if (this._listeners[name])
          for (var i = 0; i < this._listeners[name].length; i++)
            this._listeners[name][i].call(this, arg);
      },
      /**
       * Chain a worker with an other.
       * @param {Worker} next the worker receiving events from the current one.
       * @return {worker} the next worker for chainability
       */
      pipe: function(next) {
        return next.registerPrevious(this);
      },
      /**
       * Same as `pipe` in the other direction.
       * Using an API with `pipe(next)` is very easy.
       * Implementing the API with the point of view of the next one registering
       * a source is easier, see the ZipFileWorker.
       * @param {Worker} previous the previous worker, sending events to this one
       * @return {Worker} the current worker for chainability
       */
      registerPrevious: function(previous) {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = previous.streamInfo, this.mergeStreamInfo(), this.previous = previous;
        var self2 = this;
        return previous.on("data", function(chunk) {
          self2.processChunk(chunk);
        }), previous.on("end", function() {
          self2.end();
        }), previous.on("error", function(e) {
          self2.error(e);
        }), this;
      },
      /**
       * Pause the stream so it doesn't send events anymore.
       * @return {Boolean} true if this call paused the worker, false otherwise.
       */
      pause: function() {
        return this.isPaused || this.isFinished ? !1 : (this.isPaused = !0, this.previous && this.previous.pause(), !0);
      },
      /**
       * Resume a paused stream.
       * @return {Boolean} true if this call resumed the worker, false otherwise.
       */
      resume: function() {
        if (!this.isPaused || this.isFinished)
          return !1;
        this.isPaused = !1;
        var withError = !1;
        return this.generatedError && (this.error(this.generatedError), withError = !0), this.previous && this.previous.resume(), !withError;
      },
      /**
       * Flush any remaining bytes as the stream is ending.
       */
      flush: function() {
      },
      /**
       * Process a chunk. This is usually the method overridden.
       * @param {Object} chunk the chunk to process.
       */
      processChunk: function(chunk) {
        this.push(chunk);
      },
      /**
       * Add a key/value to be added in the workers chain streamInfo once activated.
       * @param {String} key the key to use
       * @param {Object} value the associated value
       * @return {Worker} the current worker for chainability
       */
      withStreamInfo: function(key, value) {
        return this.extraStreamInfo[key] = value, this.mergeStreamInfo(), this;
      },
      /**
       * Merge this worker's streamInfo into the chain's streamInfo.
       */
      mergeStreamInfo: function() {
        for (var key in this.extraStreamInfo)
          Object.prototype.hasOwnProperty.call(this.extraStreamInfo, key) && (this.streamInfo[key] = this.extraStreamInfo[key]);
      },
      /**
       * Lock the stream to prevent further updates on the workers chain.
       * After calling this method, all calls to pipe will fail.
       */
      lock: function() {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = !0, this.previous && this.previous.lock();
      },
      /**
       *
       * Pretty print the workers chain.
       */
      toString: function() {
        var me = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + me : me;
      }
    };
    module.exports = GenericWorker;
  }
});

// node_modules/jszip/lib/utf8.js
var require_utf8 = __commonJS({
  "node_modules/jszip/lib/utf8.js"(exports) {
    "use strict";
    var utils = require_utils(), support = require_support(), nodejsUtils = require_nodejsUtils(), GenericWorker = require_GenericWorker(), _utf8len = new Array(256);
    for (i = 0; i < 256; i++)
      _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
    var i;
    _utf8len[254] = _utf8len[254] = 1;
    var string2buf = function(str) {
      var buf, c, c2, m_pos, i2, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++)
        c = str.charCodeAt(m_pos), (c & 64512) === 55296 && m_pos + 1 < str_len && (c2 = str.charCodeAt(m_pos + 1), (c2 & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (c2 - 56320), m_pos++)), buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      for (support.uint8array ? buf = new Uint8Array(buf_len) : buf = new Array(buf_len), i2 = 0, m_pos = 0; i2 < buf_len; m_pos++)
        c = str.charCodeAt(m_pos), (c & 64512) === 55296 && m_pos + 1 < str_len && (c2 = str.charCodeAt(m_pos + 1), (c2 & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (c2 - 56320), m_pos++)), c < 128 ? buf[i2++] = c : c < 2048 ? (buf[i2++] = 192 | c >>> 6, buf[i2++] = 128 | c & 63) : c < 65536 ? (buf[i2++] = 224 | c >>> 12, buf[i2++] = 128 | c >>> 6 & 63, buf[i2++] = 128 | c & 63) : (buf[i2++] = 240 | c >>> 18, buf[i2++] = 128 | c >>> 12 & 63, buf[i2++] = 128 | c >>> 6 & 63, buf[i2++] = 128 | c & 63);
      return buf;
    }, utf8border = function(buf, max) {
      var pos;
      for (max = max || buf.length, max > buf.length && (max = buf.length), pos = max - 1; pos >= 0 && (buf[pos] & 192) === 128; )
        pos--;
      return pos < 0 || pos === 0 ? max : pos + _utf8len[buf[pos]] > max ? pos : max;
    }, buf2string = function(buf) {
      var i2, out, c, c_len, len = buf.length, utf16buf = new Array(len * 2);
      for (out = 0, i2 = 0; i2 < len; ) {
        if (c = buf[i2++], c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        if (c_len = _utf8len[c], c_len > 4) {
          utf16buf[out++] = 65533, i2 += c_len - 1;
          continue;
        }
        for (c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7; c_len > 1 && i2 < len; )
          c = c << 6 | buf[i2++] & 63, c_len--;
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        c < 65536 ? utf16buf[out++] = c : (c -= 65536, utf16buf[out++] = 55296 | c >> 10 & 1023, utf16buf[out++] = 56320 | c & 1023);
      }
      return utf16buf.length !== out && (utf16buf.subarray ? utf16buf = utf16buf.subarray(0, out) : utf16buf.length = out), utils.applyFromCharCode(utf16buf);
    };
    exports.utf8encode = function(str) {
      return support.nodebuffer ? nodejsUtils.newBufferFrom(str, "utf-8") : string2buf(str);
    };
    exports.utf8decode = function(buf) {
      return support.nodebuffer ? utils.transformTo("nodebuffer", buf).toString("utf-8") : (buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf), buf2string(buf));
    };
    function Utf8DecodeWorker() {
      GenericWorker.call(this, "utf-8 decode"), this.leftOver = null;
    }
    utils.inherits(Utf8DecodeWorker, GenericWorker);
    Utf8DecodeWorker.prototype.processChunk = function(chunk) {
      var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
      if (this.leftOver && this.leftOver.length) {
        if (support.uint8array) {
          var previousData = data;
          data = new Uint8Array(previousData.length + this.leftOver.length), data.set(this.leftOver, 0), data.set(previousData, this.leftOver.length);
        } else
          data = this.leftOver.concat(data);
        this.leftOver = null;
      }
      var nextBoundary = utf8border(data), usableData = data;
      nextBoundary !== data.length && (support.uint8array ? (usableData = data.subarray(0, nextBoundary), this.leftOver = data.subarray(nextBoundary, data.length)) : (usableData = data.slice(0, nextBoundary), this.leftOver = data.slice(nextBoundary, data.length))), this.push({
        data: exports.utf8decode(usableData),
        meta: chunk.meta
      });
    };
    Utf8DecodeWorker.prototype.flush = function() {
      this.leftOver && this.leftOver.length && (this.push({
        data: exports.utf8decode(this.leftOver),
        meta: {}
      }), this.leftOver = null);
    };
    exports.Utf8DecodeWorker = Utf8DecodeWorker;
    function Utf8EncodeWorker() {
      GenericWorker.call(this, "utf-8 encode");
    }
    utils.inherits(Utf8EncodeWorker, GenericWorker);
    Utf8EncodeWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: exports.utf8encode(chunk.data),
        meta: chunk.meta
      });
    };
    exports.Utf8EncodeWorker = Utf8EncodeWorker;
  }
});

// node_modules/jszip/lib/stream/ConvertWorker.js
var require_ConvertWorker = __commonJS({
  "node_modules/jszip/lib/stream/ConvertWorker.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker(), utils = require_utils();
    function ConvertWorker(destType) {
      GenericWorker.call(this, "ConvertWorker to " + destType), this.destType = destType;
    }
    utils.inherits(ConvertWorker, GenericWorker);
    ConvertWorker.prototype.processChunk = function(chunk) {
      this.push({
        data: utils.transformTo(this.destType, chunk.data),
        meta: chunk.meta
      });
    };
    module.exports = ConvertWorker;
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js
var require_NodejsStreamOutputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamOutputAdapter.js"(exports, module) {
    "use strict";
    var Readable2 = require_readable().Readable, utils = require_utils();
    utils.inherits(NodejsStreamOutputAdapter, Readable2);
    function NodejsStreamOutputAdapter(helper, options, updateCb) {
      Readable2.call(this, options), this._helper = helper;
      var self2 = this;
      helper.on("data", function(data, meta) {
        self2.push(data) || self2._helper.pause(), updateCb && updateCb(meta);
      }).on("error", function(e) {
        self2.emit("error", e);
      }).on("end", function() {
        self2.push(null);
      });
    }
    NodejsStreamOutputAdapter.prototype._read = function() {
      this._helper.resume();
    };
    module.exports = NodejsStreamOutputAdapter;
  }
});

// node_modules/jszip/lib/stream/StreamHelper.js
var require_StreamHelper = __commonJS({
  "node_modules/jszip/lib/stream/StreamHelper.js"(exports, module) {
    "use strict";
    var utils = require_utils(), ConvertWorker = require_ConvertWorker(), GenericWorker = require_GenericWorker(), base64 = require_base64(), support = require_support(), external = require_external(), NodejsStreamOutputAdapter = null;
    if (support.nodestream)
      try {
        NodejsStreamOutputAdapter = require_NodejsStreamOutputAdapter();
      } catch {
      }
    function transformZipOutput(type, content, mimeType) {
      switch (type) {
        case "blob":
          return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
        case "base64":
          return base64.encode(content);
        default:
          return utils.transformTo(type, content);
      }
    }
    function concat(type, dataArray) {
      var i, index = 0, res = null, totalLength = 0;
      for (i = 0; i < dataArray.length; i++)
        totalLength += dataArray[i].length;
      switch (type) {
        case "string":
          return dataArray.join("");
        case "array":
          return Array.prototype.concat.apply([], dataArray);
        case "uint8array":
          for (res = new Uint8Array(totalLength), i = 0; i < dataArray.length; i++)
            res.set(dataArray[i], index), index += dataArray[i].length;
          return res;
        case "nodebuffer":
          return Buffer.concat(dataArray);
        default:
          throw new Error("concat : unsupported type '" + type + "'");
      }
    }
    function accumulate(helper, updateCallback) {
      return new external.Promise(function(resolve, reject) {
        var dataArray = [], chunkType = helper._internalType, resultType = helper._outputType, mimeType = helper._mimeType;
        helper.on("data", function(data, meta) {
          dataArray.push(data), updateCallback && updateCallback(meta);
        }).on("error", function(err) {
          dataArray = [], reject(err);
        }).on("end", function() {
          try {
            var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
            resolve(result);
          } catch (e) {
            reject(e);
          }
          dataArray = [];
        }).resume();
      });
    }
    function StreamHelper(worker, outputType, mimeType) {
      var internalType = outputType;
      switch (outputType) {
        case "blob":
        case "arraybuffer":
          internalType = "uint8array";
          break;
        case "base64":
          internalType = "string";
          break;
      }
      try {
        this._internalType = internalType, this._outputType = outputType, this._mimeType = mimeType, utils.checkSupport(internalType), this._worker = worker.pipe(new ConvertWorker(internalType)), worker.lock();
      } catch (e) {
        this._worker = new GenericWorker("error"), this._worker.error(e);
      }
    }
    StreamHelper.prototype = {
      /**
       * Listen a StreamHelper, accumulate its content and concatenate it into a
       * complete block.
       * @param {Function} updateCb the update callback.
       * @return Promise the promise for the accumulation.
       */
      accumulate: function(updateCb) {
        return accumulate(this, updateCb);
      },
      /**
       * Add a listener on an event triggered on a stream.
       * @param {String} evt the name of the event
       * @param {Function} fn the listener
       * @return {StreamHelper} the current helper.
       */
      on: function(evt, fn) {
        var self2 = this;
        return evt === "data" ? this._worker.on(evt, function(chunk) {
          fn.call(self2, chunk.data, chunk.meta);
        }) : this._worker.on(evt, function() {
          utils.delay(fn, arguments, self2);
        }), this;
      },
      /**
       * Resume the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      resume: function() {
        return utils.delay(this._worker.resume, [], this._worker), this;
      },
      /**
       * Pause the flow of chunks.
       * @return {StreamHelper} the current helper.
       */
      pause: function() {
        return this._worker.pause(), this;
      },
      /**
       * Return a nodejs stream for this helper.
       * @param {Function} updateCb the update callback.
       * @return {NodejsStreamOutputAdapter} the nodejs stream.
       */
      toNodejsStream: function(updateCb) {
        if (utils.checkSupport("nodestream"), this._outputType !== "nodebuffer")
          throw new Error(this._outputType + " is not supported by this method");
        return new NodejsStreamOutputAdapter(this, {
          objectMode: this._outputType !== "nodebuffer"
        }, updateCb);
      }
    };
    module.exports = StreamHelper;
  }
});

// node_modules/jszip/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/jszip/lib/defaults.js"(exports) {
    "use strict";
    exports.base64 = !1;
    exports.binary = !1;
    exports.dir = !1;
    exports.createFolders = !0;
    exports.date = null;
    exports.compression = null;
    exports.compressionOptions = null;
    exports.comment = null;
    exports.unixPermissions = null;
    exports.dosPermissions = null;
  }
});

// node_modules/jszip/lib/stream/DataWorker.js
var require_DataWorker = __commonJS({
  "node_modules/jszip/lib/stream/DataWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils(), GenericWorker = require_GenericWorker(), DEFAULT_BLOCK_SIZE = 16 * 1024;
    function DataWorker(dataP) {
      GenericWorker.call(this, "DataWorker");
      var self2 = this;
      this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, dataP.then(function(data) {
        self2.dataIsReady = !0, self2.data = data, self2.max = data && data.length || 0, self2.type = utils.getTypeOf(data), self2.isPaused || self2._tickAndRepeat();
      }, function(e) {
        self2.error(e);
      });
    }
    utils.inherits(DataWorker, GenericWorker);
    DataWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this), this.data = null;
    };
    DataWorker.prototype.resume = function() {
      return GenericWorker.prototype.resume.call(this) ? (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, utils.delay(this._tickAndRepeat, [], this)), !0) : !1;
    };
    DataWorker.prototype._tickAndRepeat = function() {
      this._tickScheduled = !1, !(this.isPaused || this.isFinished) && (this._tick(), this.isFinished || (utils.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
    };
    DataWorker.prototype._tick = function() {
      if (this.isPaused || this.isFinished)
        return !1;
      var size = DEFAULT_BLOCK_SIZE, data = null, nextIndex = Math.min(this.max, this.index + size);
      if (this.index >= this.max)
        return this.end();
      switch (this.type) {
        case "string":
          data = this.data.substring(this.index, nextIndex);
          break;
        case "uint8array":
          data = this.data.subarray(this.index, nextIndex);
          break;
        case "array":
        case "nodebuffer":
          data = this.data.slice(this.index, nextIndex);
          break;
      }
      return this.index = nextIndex, this.push({
        data,
        meta: {
          percent: this.max ? this.index / this.max * 100 : 0
        }
      });
    };
    module.exports = DataWorker;
  }
});

// node_modules/jszip/lib/crc32.js
var require_crc32 = __commonJS({
  "node_modules/jszip/lib/crc32.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function makeTable() {
      for (var c, table = [], n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++)
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++)
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      return crc ^ -1;
    }
    function crc32str(crc, str, len, pos) {
      var t = crcTable, end = pos + len;
      crc = crc ^ -1;
      for (var i = pos; i < end; i++)
        crc = crc >>> 8 ^ t[(crc ^ str.charCodeAt(i)) & 255];
      return crc ^ -1;
    }
    module.exports = function(input, crc) {
      if (typeof input > "u" || !input.length)
        return 0;
      var isArray = utils.getTypeOf(input) !== "string";
      return isArray ? crc32(crc | 0, input, input.length, 0) : crc32str(crc | 0, input, input.length, 0);
    };
  }
});

// node_modules/jszip/lib/stream/Crc32Probe.js
var require_Crc32Probe = __commonJS({
  "node_modules/jszip/lib/stream/Crc32Probe.js"(exports, module) {
    "use strict";
    var GenericWorker = require_GenericWorker(), crc32 = require_crc32(), utils = require_utils();
    function Crc32Probe() {
      GenericWorker.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
    }
    utils.inherits(Crc32Probe, GenericWorker);
    Crc32Probe.prototype.processChunk = function(chunk) {
      this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0), this.push(chunk);
    };
    module.exports = Crc32Probe;
  }
});

// node_modules/jszip/lib/stream/DataLengthProbe.js
var require_DataLengthProbe = __commonJS({
  "node_modules/jszip/lib/stream/DataLengthProbe.js"(exports, module) {
    "use strict";
    var utils = require_utils(), GenericWorker = require_GenericWorker();
    function DataLengthProbe(propName) {
      GenericWorker.call(this, "DataLengthProbe for " + propName), this.propName = propName, this.withStreamInfo(propName, 0);
    }
    utils.inherits(DataLengthProbe, GenericWorker);
    DataLengthProbe.prototype.processChunk = function(chunk) {
      if (chunk) {
        var length = this.streamInfo[this.propName] || 0;
        this.streamInfo[this.propName] = length + chunk.data.length;
      }
      GenericWorker.prototype.processChunk.call(this, chunk);
    };
    module.exports = DataLengthProbe;
  }
});

// node_modules/jszip/lib/compressedObject.js
var require_compressedObject = __commonJS({
  "node_modules/jszip/lib/compressedObject.js"(exports, module) {
    "use strict";
    var external = require_external(), DataWorker = require_DataWorker(), Crc32Probe = require_Crc32Probe(), DataLengthProbe = require_DataLengthProbe();
    function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
      this.compressedSize = compressedSize, this.uncompressedSize = uncompressedSize, this.crc32 = crc32, this.compression = compression, this.compressedContent = data;
    }
    CompressedObject.prototype = {
      /**
       * Create a worker to get the uncompressed content.
       * @return {GenericWorker} the worker.
       */
      getContentWorker: function() {
        var worker = new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length")), that = this;
        return worker.on("end", function() {
          if (this.streamInfo.data_length !== that.uncompressedSize)
            throw new Error("Bug : uncompressed data size mismatch");
        }), worker;
      },
      /**
       * Create a worker to get the compressed content.
       * @return {GenericWorker} the worker.
       */
      getCompressedWorker: function() {
        return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      }
    };
    CompressedObject.createWorkerFrom = function(uncompressedWorker, compression, compressionOptions) {
      return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression", compression);
    };
    module.exports = CompressedObject;
  }
});

// node_modules/jszip/lib/zipObject.js
var require_zipObject = __commonJS({
  "node_modules/jszip/lib/zipObject.js"(exports, module) {
    "use strict";
    var StreamHelper = require_StreamHelper(), DataWorker = require_DataWorker(), utf8 = require_utf8(), CompressedObject = require_compressedObject(), GenericWorker = require_GenericWorker(), ZipObject = function(name, data, options) {
      this.name = name, this.dir = options.dir, this.date = options.date, this.comment = options.comment, this.unixPermissions = options.unixPermissions, this.dosPermissions = options.dosPermissions, this._data = data, this._dataBinary = options.binary, this.options = {
        compression: options.compression,
        compressionOptions: options.compressionOptions
      };
    };
    ZipObject.prototype = {
      /**
       * Create an internal stream for the content of this object.
       * @param {String} type the type of each chunk.
       * @return StreamHelper the stream.
       */
      internalStream: function(type) {
        var result = null, outputType = "string";
        try {
          if (!type)
            throw new Error("No output type specified.");
          outputType = type.toLowerCase();
          var askUnicodeString = outputType === "string" || outputType === "text";
          (outputType === "binarystring" || outputType === "text") && (outputType = "string"), result = this._decompressWorker();
          var isUnicodeString = !this._dataBinary;
          isUnicodeString && !askUnicodeString && (result = result.pipe(new utf8.Utf8EncodeWorker())), !isUnicodeString && askUnicodeString && (result = result.pipe(new utf8.Utf8DecodeWorker()));
        } catch (e) {
          result = new GenericWorker("error"), result.error(e);
        }
        return new StreamHelper(result, outputType, "");
      },
      /**
       * Prepare the content in the asked type.
       * @param {String} type the type of the result.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Promise the promise of the result.
       */
      async: function(type, onUpdate) {
        return this.internalStream(type).accumulate(onUpdate);
      },
      /**
       * Prepare the content as a nodejs stream.
       * @param {String} type the type of each chunk.
       * @param {Function} onUpdate a function to call on each internal update.
       * @return Stream the stream.
       */
      nodeStream: function(type, onUpdate) {
        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
      },
      /**
       * Return a worker for the compressed content.
       * @private
       * @param {Object} compression the compression object to use.
       * @param {Object} compressionOptions the options to use when compressing.
       * @return Worker the worker.
       */
      _compressWorker: function(compression, compressionOptions) {
        if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic)
          return this._data.getCompressedWorker();
        var result = this._decompressWorker();
        return this._dataBinary || (result = result.pipe(new utf8.Utf8EncodeWorker())), CompressedObject.createWorkerFrom(result, compression, compressionOptions);
      },
      /**
       * Return a worker for the decompressed content.
       * @private
       * @return Worker the worker.
       */
      _decompressWorker: function() {
        return this._data instanceof CompressedObject ? this._data.getContentWorker() : this._data instanceof GenericWorker ? this._data : new DataWorker(this._data);
      }
    };
    var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], removedFn = function() {
      throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
    };
    for (i = 0; i < removedMethods.length; i++)
      ZipObject.prototype[removedMethods[i]] = removedFn;
    var i;
    module.exports = ZipObject;
  }
});

// node_modules/pako/lib/utils/common.js
var require_common = __commonJS({
  "node_modules/pako/lib/utils/common.js"(exports) {
    "use strict";
    var TYPED_OK = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
    function _has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
    exports.assign = function(obj) {
      for (var sources = Array.prototype.slice.call(arguments, 1); sources.length; ) {
        var source = sources.shift();
        if (source) {
          if (typeof source != "object")
            throw new TypeError(source + "must be non-object");
          for (var p in source)
            _has(source, p) && (obj[p] = source[p]);
        }
      }
      return obj;
    };
    exports.shrinkBuf = function(buf, size) {
      return buf.length === size ? buf : buf.subarray ? buf.subarray(0, size) : (buf.length = size, buf);
    };
    var fnTyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        if (src.subarray && dest.subarray) {
          dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
          return;
        }
        for (var i = 0; i < len; i++)
          dest[dest_offs + i] = src[src_offs + i];
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        var i, l, len, pos, chunk, result;
        for (len = 0, i = 0, l = chunks.length; i < l; i++)
          len += chunks[i].length;
        for (result = new Uint8Array(len), pos = 0, i = 0, l = chunks.length; i < l; i++)
          chunk = chunks[i], result.set(chunk, pos), pos += chunk.length;
        return result;
      }
    }, fnUntyped = {
      arraySet: function(dest, src, src_offs, len, dest_offs) {
        for (var i = 0; i < len; i++)
          dest[dest_offs + i] = src[src_offs + i];
      },
      // Join array of chunks to single array.
      flattenChunks: function(chunks) {
        return [].concat.apply([], chunks);
      }
    };
    exports.setTyped = function(on) {
      on ? (exports.Buf8 = Uint8Array, exports.Buf16 = Uint16Array, exports.Buf32 = Int32Array, exports.assign(exports, fnTyped)) : (exports.Buf8 = Array, exports.Buf16 = Array, exports.Buf32 = Array, exports.assign(exports, fnUntyped));
    };
    exports.setTyped(TYPED_OK);
  }
});

// node_modules/pako/lib/zlib/trees.js
var require_trees = __commonJS({
  "node_modules/pako/lib/zlib/trees.js"(exports) {
    "use strict";
    var utils = require_common(), Z_FIXED = 4, Z_BINARY = 0, Z_TEXT = 1, Z_UNKNOWN = 2;
    function zero(buf) {
      for (var len = buf.length; --len >= 0; )
        buf[len] = 0;
    }
    var STORED_BLOCK = 0, STATIC_TREES = 1, DYN_TREES = 2, MIN_MATCH = 3, MAX_MATCH = 258, LENGTH_CODES = 29, LITERALS = 256, L_CODES = LITERALS + 1 + LENGTH_CODES, D_CODES = 30, BL_CODES = 19, HEAP_SIZE = 2 * L_CODES + 1, MAX_BITS = 15, Buf_size = 16, MAX_BL_BITS = 7, END_BLOCK = 256, REP_3_6 = 16, REPZ_3_10 = 17, REPZ_11_138 = 18, extra_lbits = (
      /* extra bits for each length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    ), extra_dbits = (
      /* extra bits for each distance code */
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    ), extra_blbits = (
      /* extra bits for each bit length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    ), bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], DIST_CODE_LEN = 512, static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree, this.extra_bits = extra_bits, this.extra_base = extra_base, this.elems = elems, this.max_length = max_length, this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc, static_d_desc, static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree, this.max_code = 0, this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255, s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value, length) {
      s.bi_valid > Buf_size - length ? (s.bi_buf |= value << s.bi_valid & 65535, put_short(s, s.bi_buf), s.bi_buf = value >> Buf_size - s.bi_valid, s.bi_valid += length - Buf_size) : (s.bi_buf |= value << s.bi_valid & 65535, s.bi_valid += length);
    }
    function send_code(s, c, tree) {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }
    function bi_reverse(code, len) {
      var res = 0;
      do
        res |= code & 1, code >>>= 1, res <<= 1;
      while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      s.bi_valid === 16 ? (put_short(s, s.bi_buf), s.bi_buf = 0, s.bi_valid = 0) : s.bi_valid >= 8 && (s.pending_buf[s.pending++] = s.bi_buf & 255, s.bi_buf >>= 8, s.bi_valid -= 8);
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree, max_code = desc.max_code, stree = desc.stat_desc.static_tree, has_stree = desc.stat_desc.has_stree, extra = desc.stat_desc.extra_bits, base = desc.stat_desc.extra_base, max_length = desc.stat_desc.max_length, h, n, m, bits, xbits, f, overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++)
        s.bl_count[bits] = 0;
      for (tree[s.heap[s.heap_max] * 2 + 1] = 0, h = s.heap_max + 1; h < HEAP_SIZE; h++)
        n = s.heap[h], bits = tree[tree[n * 2 + 1] * 2 + 1] + 1, bits > max_length && (bits = max_length, overflow++), tree[n * 2 + 1] = bits, !(n > max_code) && (s.bl_count[bits]++, xbits = 0, n >= base && (xbits = extra[n - base]), f = tree[n * 2], s.opt_len += f * (bits + xbits), has_stree && (s.static_len += f * (stree[n * 2 + 1] + xbits)));
      if (overflow !== 0) {
        do {
          for (bits = max_length - 1; s.bl_count[bits] === 0; )
            bits--;
          s.bl_count[bits]--, s.bl_count[bits + 1] += 2, s.bl_count[max_length]--, overflow -= 2;
        } while (overflow > 0);
        for (bits = max_length; bits !== 0; bits--)
          for (n = s.bl_count[bits]; n !== 0; )
            m = s.heap[--h], !(m > max_code) && (tree[m * 2 + 1] !== bits && (s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2], tree[m * 2 + 1] = bits), n--);
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1), code = 0, bits, n;
      for (bits = 1; bits <= MAX_BITS; bits++)
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        len !== 0 && (tree[n * 2] = bi_reverse(next_code[len]++, len));
      }
    }
    function tr_static_init() {
      var n, bits, length, code, dist, bl_count = new Array(MAX_BITS + 1);
      for (length = 0, code = 0; code < LENGTH_CODES - 1; code++)
        for (base_length[code] = length, n = 0; n < 1 << extra_lbits[code]; n++)
          _length_code[length++] = code;
      for (_length_code[length - 1] = code, dist = 0, code = 0; code < 16; code++)
        for (base_dist[code] = dist, n = 0; n < 1 << extra_dbits[code]; n++)
          _dist_code[dist++] = code;
      for (dist >>= 7; code < D_CODES; code++)
        for (base_dist[code] = dist << 7, n = 0; n < 1 << extra_dbits[code] - 7; n++)
          _dist_code[256 + dist++] = code;
      for (bits = 0; bits <= MAX_BITS; bits++)
        bl_count[bits] = 0;
      for (n = 0; n <= 143; )
        static_ltree[n * 2 + 1] = 8, n++, bl_count[8]++;
      for (; n <= 255; )
        static_ltree[n * 2 + 1] = 9, n++, bl_count[9]++;
      for (; n <= 279; )
        static_ltree[n * 2 + 1] = 7, n++, bl_count[7]++;
      for (; n <= 287; )
        static_ltree[n * 2 + 1] = 8, n++, bl_count[8]++;
      for (gen_codes(static_ltree, L_CODES + 1, bl_count), n = 0; n < D_CODES; n++)
        static_dtree[n * 2 + 1] = 5, static_dtree[n * 2] = bi_reverse(n, 5);
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS), static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS), static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++)
        s.dyn_ltree[n * 2] = 0;
      for (n = 0; n < D_CODES; n++)
        s.dyn_dtree[n * 2] = 0;
      for (n = 0; n < BL_CODES; n++)
        s.bl_tree[n * 2] = 0;
      s.dyn_ltree[END_BLOCK * 2] = 1, s.opt_len = s.static_len = 0, s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      s.bi_valid > 8 ? put_short(s, s.bi_buf) : s.bi_valid > 0 && (s.pending_buf[s.pending++] = s.bi_buf), s.bi_buf = 0, s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s), header && (put_short(s, len), put_short(s, ~len)), utils.arraySet(s.pending_buf, s.window, buf, len, s.pending), s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2, _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k) {
      for (var v = s.heap[k], j = k << 1; j <= s.heap_len && (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth) && j++, !smaller(tree, v, s.heap[j], s.depth)); )
        s.heap[k] = s.heap[j], k = j, j <<= 1;
      s.heap[k] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist, lc, lx = 0, code, extra;
      if (s.last_lit !== 0)
        do
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1], lc = s.pending_buf[s.l_buf + lx], lx++, dist === 0 ? send_code(s, lc, ltree) : (code = _length_code[lc], send_code(s, code + LITERALS + 1, ltree), extra = extra_lbits[code], extra !== 0 && (lc -= base_length[code], send_bits(s, lc, extra)), dist--, code = d_code(dist), send_code(s, code, dtree), extra = extra_dbits[code], extra !== 0 && (dist -= base_dist[code], send_bits(s, dist, extra)));
        while (lx < s.last_lit);
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree, stree = desc.stat_desc.static_tree, has_stree = desc.stat_desc.has_stree, elems = desc.stat_desc.elems, n, m, max_code = -1, node;
      for (s.heap_len = 0, s.heap_max = HEAP_SIZE, n = 0; n < elems; n++)
        tree[n * 2] !== 0 ? (s.heap[++s.heap_len] = max_code = n, s.depth[n] = 0) : tree[n * 2 + 1] = 0;
      for (; s.heap_len < 2; )
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0, tree[node * 2] = 1, s.depth[node] = 0, s.opt_len--, has_stree && (s.static_len -= stree[node * 2 + 1]);
      for (desc.max_code = max_code, n = s.heap_len >> 1; n >= 1; n--)
        pqdownheap(s, tree, n);
      node = elems;
      do
        n = s.heap[
          1
          /*SMALLEST*/
        ], s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--], pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        ), m = s.heap[
          1
          /*SMALLEST*/
        ], s.heap[--s.heap_max] = n, s.heap[--s.heap_max] = m, tree[node * 2] = tree[n * 2] + tree[m * 2], s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1, tree[n * 2 + 1] = tree[m * 2 + 1] = node, s.heap[
          1
          /*SMALLEST*/
        ] = node++, pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ], gen_bitlen(s, desc), gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n, prevlen = -1, curlen, nextlen = tree[1], count = 0, max_count = 7, min_count = 4;
      for (nextlen === 0 && (max_count = 138, min_count = 3), tree[(max_code + 1) * 2 + 1] = 65535, n = 0; n <= max_code; n++)
        curlen = nextlen, nextlen = tree[(n + 1) * 2 + 1], !(++count < max_count && curlen === nextlen) && (count < min_count ? s.bl_tree[curlen * 2] += count : curlen !== 0 ? (curlen !== prevlen && s.bl_tree[curlen * 2]++, s.bl_tree[REP_3_6 * 2]++) : count <= 10 ? s.bl_tree[REPZ_3_10 * 2]++ : s.bl_tree[REPZ_11_138 * 2]++, count = 0, prevlen = curlen, nextlen === 0 ? (max_count = 138, min_count = 3) : curlen === nextlen ? (max_count = 6, min_count = 3) : (max_count = 7, min_count = 4));
    }
    function send_tree(s, tree, max_code) {
      var n, prevlen = -1, curlen, nextlen = tree[1], count = 0, max_count = 7, min_count = 4;
      for (nextlen === 0 && (max_count = 138, min_count = 3), n = 0; n <= max_code; n++)
        if (curlen = nextlen, nextlen = tree[(n + 1) * 2 + 1], !(++count < max_count && curlen === nextlen)) {
          if (count < min_count)
            do
              send_code(s, curlen, s.bl_tree);
            while (--count !== 0);
          else curlen !== 0 ? (curlen !== prevlen && (send_code(s, curlen, s.bl_tree), count--), send_code(s, REP_3_6, s.bl_tree), send_bits(s, count - 3, 2)) : count <= 10 ? (send_code(s, REPZ_3_10, s.bl_tree), send_bits(s, count - 3, 3)) : (send_code(s, REPZ_11_138, s.bl_tree), send_bits(s, count - 11, 7));
          count = 0, prevlen = curlen, nextlen === 0 ? (max_count = 138, min_count = 3) : curlen === nextlen ? (max_count = 6, min_count = 3) : (max_count = 7, min_count = 4);
        }
    }
    function build_bl_tree(s) {
      var max_blindex;
      for (scan_tree(s, s.dyn_ltree, s.l_desc.max_code), scan_tree(s, s.dyn_dtree, s.d_desc.max_code), build_tree(s, s.bl_desc), max_blindex = BL_CODES - 1; max_blindex >= 3 && s.bl_tree[bl_order[max_blindex] * 2 + 1] === 0; max_blindex--)
        ;
      return s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4, max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      for (send_bits(s, lcodes - 257, 5), send_bits(s, dcodes - 1, 5), send_bits(s, blcodes - 4, 4), rank = 0; rank < blcodes; rank++)
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      send_tree(s, s.dyn_ltree, lcodes - 1), send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447, n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1)
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0)
          return Z_BINARY;
      if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0)
        return Z_TEXT;
      for (n = 32; n < LITERALS; n++)
        if (s.dyn_ltree[n * 2] !== 0)
          return Z_TEXT;
      return Z_BINARY;
    }
    var static_init_done = !1;
    function _tr_init(s) {
      static_init_done || (tr_static_init(), static_init_done = !0), s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc), s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc), s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc), s.bi_buf = 0, s.bi_valid = 0, init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3), copy_block(s, buf, stored_len, !0);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3), send_code(s, END_BLOCK, static_ltree), bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb, max_blindex = 0;
      s.level > 0 ? (s.strm.data_type === Z_UNKNOWN && (s.strm.data_type = detect_data_type(s)), build_tree(s, s.l_desc), build_tree(s, s.d_desc), max_blindex = build_bl_tree(s), opt_lenb = s.opt_len + 3 + 7 >>> 3, static_lenb = s.static_len + 3 + 7 >>> 3, static_lenb <= opt_lenb && (opt_lenb = static_lenb)) : opt_lenb = static_lenb = stored_len + 5, stored_len + 4 <= opt_lenb && buf !== -1 ? _tr_stored_block(s, buf, stored_len, last) : s.strategy === Z_FIXED || static_lenb === opt_lenb ? (send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3), compress_block(s, static_ltree, static_dtree)) : (send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3), send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1), compress_block(s, s.dyn_ltree, s.dyn_dtree)), init_block(s), last && bi_windup(s);
    }
    function _tr_tally(s, dist, lc) {
      return s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255, s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255, s.pending_buf[s.l_buf + s.last_lit] = lc & 255, s.last_lit++, dist === 0 ? s.dyn_ltree[lc * 2]++ : (s.matches++, dist--, s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++, s.dyn_dtree[d_code(dist) * 2]++), s.last_lit === s.lit_bufsize - 1;
    }
    exports._tr_init = _tr_init;
    exports._tr_stored_block = _tr_stored_block;
    exports._tr_flush_block = _tr_flush_block;
    exports._tr_tally = _tr_tally;
    exports._tr_align = _tr_align;
  }
});

// node_modules/pako/lib/zlib/adler32.js
var require_adler32 = __commonJS({
  "node_modules/pako/lib/zlib/adler32.js"(exports, module) {
    "use strict";
    function adler32(adler, buf, len, pos) {
      for (var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0; len !== 0; ) {
        n = len > 2e3 ? 2e3 : len, len -= n;
        do
          s1 = s1 + buf[pos++] | 0, s2 = s2 + s1 | 0;
        while (--n);
        s1 %= 65521, s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    module.exports = adler32;
  }
});

// node_modules/pako/lib/zlib/crc32.js
var require_crc322 = __commonJS({
  "node_modules/pako/lib/zlib/crc32.js"(exports, module) {
    "use strict";
    function makeTable() {
      for (var c, table = [], n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++)
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i = pos; i < end; i++)
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      return crc ^ -1;
    }
    module.exports = crc32;
  }
});

// node_modules/pako/lib/zlib/messages.js
var require_messages = __commonJS({
  "node_modules/pako/lib/zlib/messages.js"(exports, module) {
    "use strict";
    module.exports = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
  }
});

// node_modules/pako/lib/zlib/deflate.js
var require_deflate = __commonJS({
  "node_modules/pako/lib/zlib/deflate.js"(exports) {
    "use strict";
    var utils = require_common(), trees = require_trees(), adler32 = require_adler32(), crc32 = require_crc322(), msg = require_messages(), Z_NO_FLUSH = 0, Z_PARTIAL_FLUSH = 1, Z_FULL_FLUSH = 3, Z_FINISH = 4, Z_BLOCK = 5, Z_OK = 0, Z_STREAM_END = 1, Z_STREAM_ERROR = -2, Z_DATA_ERROR = -3, Z_BUF_ERROR = -5, Z_DEFAULT_COMPRESSION = -1, Z_FILTERED = 1, Z_HUFFMAN_ONLY = 2, Z_RLE = 3, Z_FIXED = 4, Z_DEFAULT_STRATEGY = 0, Z_UNKNOWN = 2, Z_DEFLATED = 8, MAX_MEM_LEVEL = 9, MAX_WBITS = 15, DEF_MEM_LEVEL = 8, LENGTH_CODES = 29, LITERALS = 256, L_CODES = LITERALS + 1 + LENGTH_CODES, D_CODES = 30, BL_CODES = 19, HEAP_SIZE = 2 * L_CODES + 1, MAX_BITS = 15, MIN_MATCH = 3, MAX_MATCH = 258, MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1, PRESET_DICT = 32, INIT_STATE = 42, EXTRA_STATE = 69, NAME_STATE = 73, COMMENT_STATE = 91, HCRC_STATE = 103, BUSY_STATE = 113, FINISH_STATE = 666, BS_NEED_MORE = 1, BS_BLOCK_DONE = 2, BS_FINISH_STARTED = 3, BS_FINISH_DONE = 4, OS_CODE = 3;
    function err(strm, errorCode) {
      return strm.msg = msg[errorCode], errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      for (var len = buf.length; --len >= 0; )
        buf[len] = 0;
    }
    function flush_pending(strm) {
      var s = strm.state, len = s.pending;
      len > strm.avail_out && (len = strm.avail_out), len !== 0 && (utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out), strm.next_out += len, s.pending_out += len, strm.total_out += len, strm.avail_out -= len, s.pending -= len, s.pending === 0 && (s.pending_out = 0));
    }
    function flush_block_only(s, last) {
      trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last), s.block_start = s.strstart, flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255, s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      return len > size && (len = size), len === 0 ? 0 : (strm.avail_in -= len, utils.arraySet(buf, strm.input, strm.next_in, len, start), strm.state.wrap === 1 ? strm.adler = adler32(strm.adler, buf, len, start) : strm.state.wrap === 2 && (strm.adler = crc32(strm.adler, buf, len, start)), strm.next_in += len, strm.total_in += len, len);
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length, scan = s.strstart, match, len, best_len = s.prev_length, nice_match = s.nice_match, limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0, _win = s.window, wmask = s.w_mask, prev = s.prev, strend = s.strstart + MAX_MATCH, scan_end1 = _win[scan + best_len - 1], scan_end = _win[scan + best_len];
      s.prev_length >= s.good_match && (chain_length >>= 2), nice_match > s.lookahead && (nice_match = s.lookahead);
      do
        if (match = cur_match, !(_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1])) {
          scan += 2, match++;
          do
            ;
          while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
          if (len = MAX_MATCH - (strend - scan), scan = strend - MAX_MATCH, len > best_len) {
            if (s.match_start = cur_match, best_len = len, len >= nice_match)
              break;
            scan_end1 = _win[scan + best_len - 1], scan_end = _win[scan + best_len];
          }
        }
      while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      return best_len <= s.lookahead ? best_len : s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size, p, n, m, more, str;
      do {
        if (more = s.window_size - s.lookahead - s.strstart, s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0), s.match_start -= _w_size, s.strstart -= _w_size, s.block_start -= _w_size, n = s.hash_size, p = n;
          do
            m = s.head[--p], s.head[p] = m >= _w_size ? m - _w_size : 0;
          while (--n);
          n = _w_size, p = n;
          do
            m = s.prev[--p], s.prev[p] = m >= _w_size ? m - _w_size : 0;
          while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0)
          break;
        if (n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more), s.lookahead += n, s.lookahead + s.insert >= MIN_MATCH)
          for (str = s.strstart - s.insert, s.ins_h = s.window[str], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask; s.insert && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask, s.prev[str & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = str, str++, s.insert--, !(s.lookahead + s.insert < MIN_MATCH)); )
            ;
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      for (max_block_size > s.pending_buf_size - 5 && (max_block_size = s.pending_buf_size - 5); ; ) {
        if (s.lookahead <= 1) {
          if (fill_window(s), s.lookahead === 0 && flush === Z_NO_FLUSH)
            return BS_NEED_MORE;
          if (s.lookahead === 0)
            break;
        }
        s.strstart += s.lookahead, s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if ((s.strstart === 0 || s.strstart >= max_start) && (s.lookahead = s.strstart - max_start, s.strstart = max_start, flush_block_only(s, !1), s.strm.avail_out === 0) || s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD && (flush_block_only(s, !1), s.strm.avail_out === 0))
          return BS_NEED_MORE;
      }
      return s.insert = 0, flush === Z_FINISH ? (flush_block_only(s, !0), s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE) : (s.strstart > s.block_start && (flush_block_only(s, !1), s.strm.avail_out === 0), BS_NEED_MORE);
    }
    function deflate_fast(s, flush) {
      for (var hash_head, bflush; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          if (fill_window(s), s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH)
            return BS_NEED_MORE;
          if (s.lookahead === 0)
            break;
        }
        if (hash_head = 0, s.lookahead >= MIN_MATCH && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD && (s.match_length = longest_match(s, hash_head)), s.match_length >= MIN_MATCH)
          if (bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH), s.lookahead -= s.match_length, s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do
              s.strstart++, s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart;
            while (--s.match_length !== 0);
            s.strstart++;
          } else
            s.strstart += s.match_length, s.match_length = 0, s.ins_h = s.window[s.strstart], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
        else
          bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++;
        if (bflush && (flush_block_only(s, !1), s.strm.avail_out === 0))
          return BS_NEED_MORE;
      }
      return s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1, flush === Z_FINISH ? (flush_block_only(s, !0), s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE) : s.last_lit && (flush_block_only(s, !1), s.strm.avail_out === 0) ? BS_NEED_MORE : BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      for (var hash_head, bflush, max_insert; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          if (fill_window(s), s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH)
            return BS_NEED_MORE;
          if (s.lookahead === 0)
            break;
        }
        if (hash_head = 0, s.lookahead >= MIN_MATCH && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), s.prev_length = s.match_length, s.prev_match = s.match_start, s.match_length = MIN_MATCH - 1, hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD && (s.match_length = longest_match(s, hash_head), s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096) && (s.match_length = MIN_MATCH - 1)), s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH, bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH), s.lookahead -= s.prev_length - 1, s.prev_length -= 2;
          do
            ++s.strstart <= max_insert && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask, hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart);
          while (--s.prev_length !== 0);
          if (s.match_available = 0, s.match_length = MIN_MATCH - 1, s.strstart++, bflush && (flush_block_only(s, !1), s.strm.avail_out === 0))
            return BS_NEED_MORE;
        } else if (s.match_available) {
          if (bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]), bflush && flush_block_only(s, !1), s.strstart++, s.lookahead--, s.strm.avail_out === 0)
            return BS_NEED_MORE;
        } else
          s.match_available = 1, s.strstart++, s.lookahead--;
      }
      return s.match_available && (bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]), s.match_available = 0), s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1, flush === Z_FINISH ? (flush_block_only(s, !0), s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE) : s.last_lit && (flush_block_only(s, !1), s.strm.avail_out === 0) ? BS_NEED_MORE : BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      for (var bflush, prev, scan, strend, _win = s.window; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          if (fill_window(s), s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH)
            return BS_NEED_MORE;
          if (s.lookahead === 0)
            break;
        }
        if (s.match_length = 0, s.lookahead >= MIN_MATCH && s.strstart > 0 && (scan = s.strstart - 1, prev = _win[scan], prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan])) {
          strend = s.strstart + MAX_MATCH;
          do
            ;
          while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan), s.match_length > s.lookahead && (s.match_length = s.lookahead);
        }
        if (s.match_length >= MIN_MATCH ? (bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH), s.lookahead -= s.match_length, s.strstart += s.match_length, s.match_length = 0) : (bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++), bflush && (flush_block_only(s, !1), s.strm.avail_out === 0))
          return BS_NEED_MORE;
      }
      return s.insert = 0, flush === Z_FINISH ? (flush_block_only(s, !0), s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE) : s.last_lit && (flush_block_only(s, !1), s.strm.avail_out === 0) ? BS_NEED_MORE : BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      for (var bflush; ; ) {
        if (s.lookahead === 0 && (fill_window(s), s.lookahead === 0)) {
          if (flush === Z_NO_FLUSH)
            return BS_NEED_MORE;
          break;
        }
        if (s.match_length = 0, bflush = trees._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++, bflush && (flush_block_only(s, !1), s.strm.avail_out === 0))
          return BS_NEED_MORE;
      }
      return s.insert = 0, flush === Z_FINISH ? (flush_block_only(s, !0), s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE) : s.last_lit && (flush_block_only(s, !1), s.strm.avail_out === 0) ? BS_NEED_MORE : BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length, this.max_lazy = max_lazy, this.nice_length = nice_length, this.max_chain = max_chain, this.func = func;
    }
    var configuration_table;
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size, zero(s.head), s.max_lazy_match = configuration_table[s.level].max_lazy, s.good_match = configuration_table[s.level].good_length, s.nice_match = configuration_table[s.level].nice_length, s.max_chain_length = configuration_table[s.level].max_chain, s.strstart = 0, s.block_start = 0, s.lookahead = 0, s.insert = 0, s.match_length = s.prev_length = MIN_MATCH - 1, s.match_available = 0, s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z_DEFLATED, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2), this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2), this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2), zero(this.dyn_ltree), zero(this.dyn_dtree), zero(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new utils.Buf16(MAX_BITS + 1), this.heap = new utils.Buf16(2 * L_CODES + 1), zero(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new utils.Buf16(2 * L_CODES + 1), zero(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      return !strm || !strm.state ? err(strm, Z_STREAM_ERROR) : (strm.total_in = strm.total_out = 0, strm.data_type = Z_UNKNOWN, s = strm.state, s.pending = 0, s.pending_out = 0, s.wrap < 0 && (s.wrap = -s.wrap), s.status = s.wrap ? INIT_STATE : BUSY_STATE, strm.adler = s.wrap === 2 ? 0 : 1, s.last_flush = Z_NO_FLUSH, trees._tr_init(s), Z_OK);
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      return ret === Z_OK && lm_init(strm.state), ret;
    }
    function deflateSetHeader(strm, head) {
      return !strm || !strm.state || strm.state.wrap !== 2 ? Z_STREAM_ERROR : (strm.state.gzhead = head, Z_OK);
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm)
        return Z_STREAM_ERROR;
      var wrap = 1;
      if (level === Z_DEFAULT_COMPRESSION && (level = 6), windowBits < 0 ? (wrap = 0, windowBits = -windowBits) : windowBits > 15 && (wrap = 2, windowBits -= 16), memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED)
        return err(strm, Z_STREAM_ERROR);
      windowBits === 8 && (windowBits = 9);
      var s = new DeflateState();
      return strm.state = s, s.strm = strm, s.wrap = wrap, s.gzhead = null, s.w_bits = windowBits, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = memLevel + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH), s.window = new utils.Buf8(s.w_size * 2), s.head = new utils.Buf16(s.hash_size), s.prev = new utils.Buf16(s.w_size), s.lit_bufsize = 1 << memLevel + 6, s.pending_buf_size = s.lit_bufsize * 4, s.pending_buf = new utils.Buf8(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = level, s.strategy = strategy, s.method = method, deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate(strm, flush) {
      var old_flush, s, beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0)
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      if (s = strm.state, !strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH)
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      if (s.strm = strm, old_flush = s.last_flush, s.last_flush = flush, s.status === INIT_STATE)
        if (s.wrap === 2)
          strm.adler = 0, put_byte(s, 31), put_byte(s, 139), put_byte(s, 8), s.gzhead ? (put_byte(
            s,
            (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0)
          ), put_byte(s, s.gzhead.time & 255), put_byte(s, s.gzhead.time >> 8 & 255), put_byte(s, s.gzhead.time >> 16 & 255), put_byte(s, s.gzhead.time >> 24 & 255), put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0), put_byte(s, s.gzhead.os & 255), s.gzhead.extra && s.gzhead.extra.length && (put_byte(s, s.gzhead.extra.length & 255), put_byte(s, s.gzhead.extra.length >> 8 & 255)), s.gzhead.hcrc && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0)), s.gzindex = 0, s.status = EXTRA_STATE) : (put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, 0), put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0), put_byte(s, OS_CODE), s.status = BUSY_STATE);
        else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8, level_flags = -1;
          s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? level_flags = 0 : s.level < 6 ? level_flags = 1 : s.level === 6 ? level_flags = 2 : level_flags = 3, header |= level_flags << 6, s.strstart !== 0 && (header |= PRESET_DICT), header += 31 - header % 31, s.status = BUSY_STATE, putShortMSB(s, header), s.strstart !== 0 && (putShortMSB(s, strm.adler >>> 16), putShortMSB(s, strm.adler & 65535)), strm.adler = 1;
        }
      if (s.status === EXTRA_STATE)
        if (s.gzhead.extra) {
          for (beg = s.pending; s.gzindex < (s.gzhead.extra.length & 65535) && !(s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending === s.pending_buf_size)); )
            put_byte(s, s.gzhead.extra[s.gzindex] & 255), s.gzindex++;
          s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), s.gzindex === s.gzhead.extra.length && (s.gzindex = 0, s.status = NAME_STATE);
        } else
          s.status = NAME_STATE;
      if (s.status === NAME_STATE)
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending === s.pending_buf_size)) {
              val = 1;
              break;
            }
            s.gzindex < s.gzhead.name.length ? val = s.gzhead.name.charCodeAt(s.gzindex++) & 255 : val = 0, put_byte(s, val);
          } while (val !== 0);
          s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), val === 0 && (s.gzindex = 0, s.status = COMMENT_STATE);
        } else
          s.status = COMMENT_STATE;
      if (s.status === COMMENT_STATE)
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), flush_pending(strm), beg = s.pending, s.pending === s.pending_buf_size)) {
              val = 1;
              break;
            }
            s.gzindex < s.gzhead.comment.length ? val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255 : val = 0, put_byte(s, val);
          } while (val !== 0);
          s.gzhead.hcrc && s.pending > beg && (strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg)), val === 0 && (s.status = HCRC_STATE);
        } else
          s.status = HCRC_STATE;
      if (s.status === HCRC_STATE && (s.gzhead.hcrc ? (s.pending + 2 > s.pending_buf_size && flush_pending(strm), s.pending + 2 <= s.pending_buf_size && (put_byte(s, strm.adler & 255), put_byte(s, strm.adler >> 8 & 255), strm.adler = 0, s.status = BUSY_STATE)) : s.status = BUSY_STATE), s.pending !== 0) {
        if (flush_pending(strm), strm.avail_out === 0)
          return s.last_flush = -1, Z_OK;
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH)
        return err(strm, Z_BUF_ERROR);
      if (s.status === FINISH_STATE && strm.avail_in !== 0)
        return err(strm, Z_BUF_ERROR);
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if ((bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) && (s.status = FINISH_STATE), bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED)
          return strm.avail_out === 0 && (s.last_flush = -1), Z_OK;
        if (bstate === BS_BLOCK_DONE && (flush === Z_PARTIAL_FLUSH ? trees._tr_align(s) : flush !== Z_BLOCK && (trees._tr_stored_block(s, 0, 0, !1), flush === Z_FULL_FLUSH && (zero(s.head), s.lookahead === 0 && (s.strstart = 0, s.block_start = 0, s.insert = 0))), flush_pending(strm), strm.avail_out === 0))
          return s.last_flush = -1, Z_OK;
      }
      return flush !== Z_FINISH ? Z_OK : s.wrap <= 0 ? Z_STREAM_END : (s.wrap === 2 ? (put_byte(s, strm.adler & 255), put_byte(s, strm.adler >> 8 & 255), put_byte(s, strm.adler >> 16 & 255), put_byte(s, strm.adler >> 24 & 255), put_byte(s, strm.total_in & 255), put_byte(s, strm.total_in >> 8 & 255), put_byte(s, strm.total_in >> 16 & 255), put_byte(s, strm.total_in >> 24 & 255)) : (putShortMSB(s, strm.adler >>> 16), putShortMSB(s, strm.adler & 65535)), flush_pending(strm), s.wrap > 0 && (s.wrap = -s.wrap), s.pending !== 0 ? Z_OK : Z_STREAM_END);
    }
    function deflateEnd(strm) {
      var status;
      return !strm || !strm.state ? Z_STREAM_ERROR : (status = strm.state.status, status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE ? err(strm, Z_STREAM_ERROR) : (strm.state = null, status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK));
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length, s, str, n, wrap, avail, next, input, tmpDict;
      if (!strm || !strm.state || (s = strm.state, wrap = s.wrap, wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead))
        return Z_STREAM_ERROR;
      for (wrap === 1 && (strm.adler = adler32(strm.adler, dictionary, dictLength, 0)), s.wrap = 0, dictLength >= s.w_size && (wrap === 0 && (zero(s.head), s.strstart = 0, s.block_start = 0, s.insert = 0), tmpDict = new utils.Buf8(s.w_size), utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0), dictionary = tmpDict, dictLength = s.w_size), avail = strm.avail_in, next = strm.next_in, input = strm.input, strm.avail_in = dictLength, strm.next_in = 0, strm.input = dictionary, fill_window(s); s.lookahead >= MIN_MATCH; ) {
        str = s.strstart, n = s.lookahead - (MIN_MATCH - 1);
        do
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask, s.prev[str & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = str, str++;
        while (--n);
        s.strstart = str, s.lookahead = MIN_MATCH - 1, fill_window(s);
      }
      return s.strstart += s.lookahead, s.block_start = s.strstart, s.insert = s.lookahead, s.lookahead = 0, s.match_length = s.prev_length = MIN_MATCH - 1, s.match_available = 0, strm.next_in = next, strm.input = input, strm.avail_in = avail, s.wrap = wrap, Z_OK;
    }
    exports.deflateInit = deflateInit;
    exports.deflateInit2 = deflateInit2;
    exports.deflateReset = deflateReset;
    exports.deflateResetKeep = deflateResetKeep;
    exports.deflateSetHeader = deflateSetHeader;
    exports.deflate = deflate;
    exports.deflateEnd = deflateEnd;
    exports.deflateSetDictionary = deflateSetDictionary;
    exports.deflateInfo = "pako deflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/utils/strings.js
var require_strings = __commonJS({
  "node_modules/pako/lib/utils/strings.js"(exports) {
    "use strict";
    var utils = require_common(), STR_APPLY_OK = !0, STR_APPLY_UIA_OK = !0;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch {
      STR_APPLY_OK = !1;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch {
      STR_APPLY_UIA_OK = !1;
    }
    var _utf8len = new utils.Buf8(256);
    for (q = 0; q < 256; q++)
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    var q;
    _utf8len[254] = _utf8len[254] = 1;
    exports.string2buf = function(str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++)
        c = str.charCodeAt(m_pos), (c & 64512) === 55296 && m_pos + 1 < str_len && (c2 = str.charCodeAt(m_pos + 1), (c2 & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (c2 - 56320), m_pos++)), buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      for (buf = new utils.Buf8(buf_len), i = 0, m_pos = 0; i < buf_len; m_pos++)
        c = str.charCodeAt(m_pos), (c & 64512) === 55296 && m_pos + 1 < str_len && (c2 = str.charCodeAt(m_pos + 1), (c2 & 64512) === 56320 && (c = 65536 + (c - 55296 << 10) + (c2 - 56320), m_pos++)), c < 128 ? buf[i++] = c : c < 2048 ? (buf[i++] = 192 | c >>> 6, buf[i++] = 128 | c & 63) : c < 65536 ? (buf[i++] = 224 | c >>> 12, buf[i++] = 128 | c >>> 6 & 63, buf[i++] = 128 | c & 63) : (buf[i++] = 240 | c >>> 18, buf[i++] = 128 | c >>> 12 & 63, buf[i++] = 128 | c >>> 6 & 63, buf[i++] = 128 | c & 63);
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534 && (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK))
        return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
      for (var result = "", i = 0; i < len; i++)
        result += String.fromCharCode(buf[i]);
      return result;
    }
    exports.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    exports.binstring2buf = function(str) {
      for (var buf = new utils.Buf8(str.length), i = 0, len = buf.length; i < len; i++)
        buf[i] = str.charCodeAt(i);
      return buf;
    };
    exports.buf2string = function(buf, max) {
      var i, out, c, c_len, len = max || buf.length, utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        if (c = buf[i++], c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        if (c_len = _utf8len[c], c_len > 4) {
          utf16buf[out++] = 65533, i += c_len - 1;
          continue;
        }
        for (c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7; c_len > 1 && i < len; )
          c = c << 6 | buf[i++] & 63, c_len--;
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        c < 65536 ? utf16buf[out++] = c : (c -= 65536, utf16buf[out++] = 55296 | c >> 10 & 1023, utf16buf[out++] = 56320 | c & 1023);
      }
      return buf2binstring(utf16buf, out);
    };
    exports.utf8border = function(buf, max) {
      var pos;
      for (max = max || buf.length, max > buf.length && (max = buf.length), pos = max - 1; pos >= 0 && (buf[pos] & 192) === 128; )
        pos--;
      return pos < 0 || pos === 0 ? max : pos + _utf8len[buf[pos]] > max ? pos : max;
    };
  }
});

// node_modules/pako/lib/zlib/zstream.js
var require_zstream = __commonJS({
  "node_modules/pako/lib/zlib/zstream.js"(exports, module) {
    "use strict";
    function ZStream() {
      this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
    }
    module.exports = ZStream;
  }
});

// node_modules/pako/lib/deflate.js
var require_deflate2 = __commonJS({
  "node_modules/pako/lib/deflate.js"(exports) {
    "use strict";
    var zlib_deflate = require_deflate(), utils = require_common(), strings = require_strings(), msg = require_messages(), ZStream = require_zstream(), toString = Object.prototype.toString, Z_NO_FLUSH = 0, Z_FINISH = 4, Z_OK = 0, Z_STREAM_END = 1, Z_SYNC_FLUSH = 2, Z_DEFAULT_COMPRESSION = -1, Z_DEFAULT_STRATEGY = 0, Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate)) return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      opt.raw && opt.windowBits > 0 ? opt.windowBits = -opt.windowBits : opt.gzip && opt.windowBits > 0 && opt.windowBits < 16 && (opt.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ZStream(), this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK)
        throw new Error(msg[status]);
      if (opt.header && zlib_deflate.deflateSetHeader(this.strm, opt.header), opt.dictionary) {
        var dict;
        if (typeof opt.dictionary == "string" ? dict = strings.string2buf(opt.dictionary) : toString.call(opt.dictionary) === "[object ArrayBuffer]" ? dict = new Uint8Array(opt.dictionary) : dict = opt.dictionary, status = zlib_deflate.deflateSetDictionary(this.strm, dict), status !== Z_OK)
          throw new Error(msg[status]);
        this._dict_set = !0;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm, chunkSize = this.options.chunkSize, status, _mode;
      if (this.ended)
        return !1;
      _mode = mode === ~~mode ? mode : mode === !0 ? Z_FINISH : Z_NO_FLUSH, typeof data == "string" ? strm.input = strings.string2buf(data) : toString.call(data) === "[object ArrayBuffer]" ? strm.input = new Uint8Array(data) : strm.input = data, strm.next_in = 0, strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0 && (strm.output = new utils.Buf8(chunkSize), strm.next_out = 0, strm.avail_out = chunkSize), status = zlib_deflate.deflate(strm, _mode), status !== Z_STREAM_END && status !== Z_OK)
          return this.onEnd(status), this.ended = !0, !1;
        (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) && (this.options.to === "string" ? this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out))) : this.onData(utils.shrinkBuf(strm.output, strm.next_out)));
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      return _mode === Z_FINISH ? (status = zlib_deflate.deflateEnd(this.strm), this.onEnd(status), this.ended = !0, status === Z_OK) : (_mode === Z_SYNC_FLUSH && (this.onEnd(Z_OK), strm.avail_out = 0), !0);
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      status === Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = utils.flattenChunks(this.chunks)), this.chunks = [], this.err = status, this.msg = this.strm.msg;
    };
    function deflate(input, options) {
      var deflator = new Deflate(options);
      if (deflator.push(input, !0), deflator.err)
        throw deflator.msg || msg[deflator.err];
      return deflator.result;
    }
    function deflateRaw(input, options) {
      return options = options || {}, options.raw = !0, deflate(input, options);
    }
    function gzip(input, options) {
      return options = options || {}, options.gzip = !0, deflate(input, options);
    }
    exports.Deflate = Deflate;
    exports.deflate = deflate;
    exports.deflateRaw = deflateRaw;
    exports.gzip = gzip;
  }
});

// node_modules/pako/lib/zlib/inffast.js
var require_inffast = __commonJS({
  "node_modules/pako/lib/zlib/inffast.js"(exports, module) {
    "use strict";
    var BAD = 30, TYPE = 12;
    module.exports = function(strm, start) {
      var state, _in, last, _out, beg, end, dmax, wsize, whave, wnext, s_window, hold, bits, lcode, dcode, lmask, dmask, here, op, len, dist, from, from_source, input, output;
      state = strm.state, _in = strm.next_in, input = strm.input, last = _in + (strm.avail_in - 5), _out = strm.next_out, output = strm.output, beg = _out - (start - strm.avail_out), end = _out + (strm.avail_out - 257), dmax = state.dmax, wsize = state.wsize, whave = state.whave, wnext = state.wnext, s_window = state.window, hold = state.hold, bits = state.bits, lcode = state.lencode, dcode = state.distcode, lmask = (1 << state.lenbits) - 1, dmask = (1 << state.distbits) - 1;
      top:
        do {
          bits < 15 && (hold += input[_in++] << bits, bits += 8, hold += input[_in++] << bits, bits += 8), here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              if (op = here >>> 24, hold >>>= op, bits -= op, op = here >>> 16 & 255, op === 0)
                output[_out++] = here & 65535;
              else if (op & 16) {
                len = here & 65535, op &= 15, op && (bits < op && (hold += input[_in++] << bits, bits += 8), len += hold & (1 << op) - 1, hold >>>= op, bits -= op), bits < 15 && (hold += input[_in++] << bits, bits += 8, hold += input[_in++] << bits, bits += 8), here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    if (op = here >>> 24, hold >>>= op, bits -= op, op = here >>> 16 & 255, op & 16) {
                      if (dist = here & 65535, op &= 15, bits < op && (hold += input[_in++] << bits, bits += 8, bits < op && (hold += input[_in++] << bits, bits += 8)), dist += hold & (1 << op) - 1, dist > dmax) {
                        strm.msg = "invalid distance too far back", state.mode = BAD;
                        break top;
                      }
                      if (hold >>>= op, bits -= op, op = _out - beg, dist > op) {
                        if (op = dist - op, op > whave && state.sane) {
                          strm.msg = "invalid distance too far back", state.mode = BAD;
                          break top;
                        }
                        if (from = 0, from_source = s_window, wnext === 0) {
                          if (from += wsize - op, op < len) {
                            len -= op;
                            do
                              output[_out++] = s_window[from++];
                            while (--op);
                            from = _out - dist, from_source = output;
                          }
                        } else if (wnext < op) {
                          if (from += wsize + wnext - op, op -= wnext, op < len) {
                            len -= op;
                            do
                              output[_out++] = s_window[from++];
                            while (--op);
                            if (from = 0, wnext < len) {
                              op = wnext, len -= op;
                              do
                                output[_out++] = s_window[from++];
                              while (--op);
                              from = _out - dist, from_source = output;
                            }
                          }
                        } else if (from += wnext - op, op < len) {
                          len -= op;
                          do
                            output[_out++] = s_window[from++];
                          while (--op);
                          from = _out - dist, from_source = output;
                        }
                        for (; len > 2; )
                          output[_out++] = from_source[from++], output[_out++] = from_source[from++], output[_out++] = from_source[from++], len -= 3;
                        len && (output[_out++] = from_source[from++], len > 1 && (output[_out++] = from_source[from++]));
                      } else {
                        from = _out - dist;
                        do
                          output[_out++] = output[from++], output[_out++] = output[from++], output[_out++] = output[from++], len -= 3;
                        while (len > 2);
                        len && (output[_out++] = output[from++], len > 1 && (output[_out++] = output[from++]));
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code", state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code", state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3, _in -= len, bits -= len << 3, hold &= (1 << bits) - 1, strm.next_in = _in, strm.next_out = _out, strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last), strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end), state.hold = hold, state.bits = bits;
    };
  }
});

// node_modules/pako/lib/zlib/inftrees.js
var require_inftrees = __commonJS({
  "node_modules/pako/lib/zlib/inftrees.js"(exports, module) {
    "use strict";
    var utils = require_common(), MAXBITS = 15, ENOUGH_LENS = 852, ENOUGH_DISTS = 592, CODES = 0, LENS = 1, DISTS = 2, lbase = [
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ], lext = [
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ], dbase = [
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ], dext = [
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    module.exports = function(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits, len = 0, sym = 0, min = 0, max = 0, root = 0, curr = 0, drop = 0, left = 0, used = 0, huff = 0, incr, fill, low, mask, next, base = null, base_index = 0, end, count = new utils.Buf16(MAXBITS + 1), offs = new utils.Buf16(MAXBITS + 1), extra = null, extra_index = 0, here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++)
        count[len] = 0;
      for (sym = 0; sym < codes; sym++)
        count[lens[lens_index + sym]]++;
      for (root = bits, max = MAXBITS; max >= 1 && count[max] === 0; max--)
        ;
      if (root > max && (root = max), max === 0)
        return table[table_index++] = 1 << 24 | 64 << 16 | 0, table[table_index++] = 1 << 24 | 64 << 16 | 0, opts.bits = 1, 0;
      for (min = 1; min < max && count[min] === 0; min++)
        ;
      for (root < min && (root = min), left = 1, len = 1; len <= MAXBITS; len++)
        if (left <<= 1, left -= count[len], left < 0)
          return -1;
      if (left > 0 && (type === CODES || max !== 1))
        return -1;
      for (offs[1] = 0, len = 1; len < MAXBITS; len++)
        offs[len + 1] = offs[len] + count[len];
      for (sym = 0; sym < codes; sym++)
        lens[lens_index + sym] !== 0 && (work[offs[lens[lens_index + sym]]++] = sym);
      if (type === CODES ? (base = extra = work, end = 19) : type === LENS ? (base = lbase, base_index -= 257, extra = lext, extra_index -= 257, end = 256) : (base = dbase, extra = dext, end = -1), huff = 0, sym = 0, len = min, next = table_index, curr = root, drop = 0, low = -1, used = 1 << root, mask = used - 1, type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS)
        return 1;
      for (; ; ) {
        here_bits = len - drop, work[sym] < end ? (here_op = 0, here_val = work[sym]) : work[sym] > end ? (here_op = extra[extra_index + work[sym]], here_val = base[base_index + work[sym]]) : (here_op = 96, here_val = 0), incr = 1 << len - drop, fill = 1 << curr, min = fill;
        do
          fill -= incr, table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        while (fill !== 0);
        for (incr = 1 << len - 1; huff & incr; )
          incr >>= 1;
        if (incr !== 0 ? (huff &= incr - 1, huff += incr) : huff = 0, sym++, --count[len] === 0) {
          if (len === max)
            break;
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          for (drop === 0 && (drop = root), next += min, curr = len - drop, left = 1 << curr; curr + drop < max && (left -= count[curr + drop], !(left <= 0)); )
            curr++, left <<= 1;
          if (used += 1 << curr, type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS)
            return 1;
          low = huff & mask, table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      return huff !== 0 && (table[next + huff] = len - drop << 24 | 64 << 16 | 0), opts.bits = root, 0;
    };
  }
});

// node_modules/pako/lib/zlib/inflate.js
var require_inflate = __commonJS({
  "node_modules/pako/lib/zlib/inflate.js"(exports) {
    "use strict";
    var utils = require_common(), adler32 = require_adler32(), crc32 = require_crc322(), inflate_fast = require_inffast(), inflate_table = require_inftrees(), CODES = 0, LENS = 1, DISTS = 2, Z_FINISH = 4, Z_BLOCK = 5, Z_TREES = 6, Z_OK = 0, Z_STREAM_END = 1, Z_NEED_DICT = 2, Z_STREAM_ERROR = -2, Z_DATA_ERROR = -3, Z_MEM_ERROR = -4, Z_BUF_ERROR = -5, Z_DEFLATED = 8, HEAD = 1, FLAGS = 2, TIME = 3, OS = 4, EXLEN = 5, EXTRA = 6, NAME = 7, COMMENT = 8, HCRC = 9, DICTID = 10, DICT = 11, TYPE = 12, TYPEDO = 13, STORED = 14, COPY_ = 15, COPY = 16, TABLE = 17, LENLENS = 18, CODELENS = 19, LEN_ = 20, LEN = 21, LENEXT = 22, DIST = 23, DISTEXT = 24, MATCH = 25, LIT = 26, CHECK = 27, LENGTH = 28, DONE = 29, BAD = 30, MEM = 31, SYNC = 32, ENOUGH_LENS = 852, ENOUGH_DISTS = 592, MAX_WBITS = 15, DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new utils.Buf16(320), this.work = new utils.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      return !strm || !strm.state ? Z_STREAM_ERROR : (state = strm.state, strm.total_in = strm.total_out = state.total = 0, strm.msg = "", state.wrap && (strm.adler = state.wrap & 1), state.mode = HEAD, state.last = 0, state.havedict = 0, state.dmax = 32768, state.head = null, state.hold = 0, state.bits = 0, state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS), state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS), state.sane = 1, state.back = -1, Z_OK);
    }
    function inflateReset(strm) {
      var state;
      return !strm || !strm.state ? Z_STREAM_ERROR : (state = strm.state, state.wsize = 0, state.whave = 0, state.wnext = 0, inflateResetKeep(strm));
    }
    function inflateReset2(strm, windowBits) {
      var wrap, state;
      return !strm || !strm.state || (state = strm.state, windowBits < 0 ? (wrap = 0, windowBits = -windowBits) : (wrap = (windowBits >> 4) + 1, windowBits < 48 && (windowBits &= 15)), windowBits && (windowBits < 8 || windowBits > 15)) ? Z_STREAM_ERROR : (state.window !== null && state.wbits !== windowBits && (state.window = null), state.wrap = wrap, state.wbits = windowBits, inflateReset(strm));
    }
    function inflateInit2(strm, windowBits) {
      var ret, state;
      return strm ? (state = new InflateState(), strm.state = state, state.window = null, ret = inflateReset2(strm, windowBits), ret !== Z_OK && (strm.state = null), ret) : Z_STREAM_ERROR;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = !0, lenfix, distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        for (lenfix = new utils.Buf32(512), distfix = new utils.Buf32(32), sym = 0; sym < 144; )
          state.lens[sym++] = 8;
        for (; sym < 256; )
          state.lens[sym++] = 9;
        for (; sym < 280; )
          state.lens[sym++] = 7;
        for (; sym < 288; )
          state.lens[sym++] = 8;
        for (inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 }), sym = 0; sym < 32; )
          state.lens[sym++] = 5;
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 }), virgin = !1;
      }
      state.lencode = lenfix, state.lenbits = 9, state.distcode = distfix, state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy) {
      var dist, state = strm.state;
      return state.window === null && (state.wsize = 1 << state.wbits, state.wnext = 0, state.whave = 0, state.window = new utils.Buf8(state.wsize)), copy >= state.wsize ? (utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0), state.wnext = 0, state.whave = state.wsize) : (dist = state.wsize - state.wnext, dist > copy && (dist = copy), utils.arraySet(state.window, src, end - copy, dist, state.wnext), copy -= dist, copy ? (utils.arraySet(state.window, src, end - copy, copy, 0), state.wnext = copy, state.whave = state.wsize) : (state.wnext += dist, state.wnext === state.wsize && (state.wnext = 0), state.whave < state.wsize && (state.whave += dist))), 0;
    }
    function inflate(strm, flush) {
      var state, input, output, next, put, have, left, hold, bits, _in, _out, copy, from, from_source, here = 0, here_bits, here_op, here_val, last_bits, last_op, last_val, len, ret, hbuf = new utils.Buf8(4), opts, n, order = (
        /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
      );
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0)
        return Z_STREAM_ERROR;
      state = strm.state, state.mode === TYPE && (state.mode = TYPEDO), put = strm.next_out, output = strm.output, left = strm.avail_out, next = strm.next_in, input = strm.input, have = strm.avail_in, hold = state.hold, bits = state.bits, _in = have, _out = left, ret = Z_OK;
      inf_leave:
        for (; ; )
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              for (; bits < 16; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0, hbuf[0] = hold & 255, hbuf[1] = hold >>> 8 & 255, state.check = crc32(state.check, hbuf, 2, 0), hold = 0, bits = 0, state.mode = FLAGS;
                break;
              }
              if (state.flags = 0, state.head && (state.head.done = !1), !(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check", state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method", state.mode = BAD;
                break;
              }
              if (hold >>>= 4, bits -= 4, len = (hold & 15) + 8, state.wbits === 0)
                state.wbits = len;
              else if (len > state.wbits) {
                strm.msg = "invalid window size", state.mode = BAD;
                break;
              }
              state.dmax = 1 << len, strm.adler = state.check = 1, state.mode = hold & 512 ? DICTID : TYPE, hold = 0, bits = 0;
              break;
            case FLAGS:
              for (; bits < 16; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if (state.flags = hold, (state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method", state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set", state.mode = BAD;
                break;
              }
              state.head && (state.head.text = hold >> 8 & 1), state.flags & 512 && (hbuf[0] = hold & 255, hbuf[1] = hold >>> 8 & 255, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0, state.mode = TIME;
            /* falls through */
            case TIME:
              for (; bits < 32; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              state.head && (state.head.time = hold), state.flags & 512 && (hbuf[0] = hold & 255, hbuf[1] = hold >>> 8 & 255, hbuf[2] = hold >>> 16 & 255, hbuf[3] = hold >>> 24 & 255, state.check = crc32(state.check, hbuf, 4, 0)), hold = 0, bits = 0, state.mode = OS;
            /* falls through */
            case OS:
              for (; bits < 16; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              state.head && (state.head.xflags = hold & 255, state.head.os = hold >> 8), state.flags & 512 && (hbuf[0] = hold & 255, hbuf[1] = hold >>> 8 & 255, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0, state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                for (; bits < 16; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                state.length = hold, state.head && (state.head.extra_len = hold), state.flags & 512 && (hbuf[0] = hold & 255, hbuf[1] = hold >>> 8 & 255, state.check = crc32(state.check, hbuf, 2, 0)), hold = 0, bits = 0;
              } else state.head && (state.head.extra = null);
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024 && (copy = state.length, copy > have && (copy = have), copy && (state.head && (len = state.head.extra_len - state.length, state.head.extra || (state.head.extra = new Array(state.head.extra_len)), utils.arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              )), state.flags & 512 && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, state.length -= copy), state.length))
                break inf_leave;
              state.length = 0, state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0)
                  break inf_leave;
                copy = 0;
                do
                  len = input[next + copy++], state.head && len && state.length < 65536 && (state.head.name += String.fromCharCode(len));
                while (len && copy < have);
                if (state.flags & 512 && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, len)
                  break inf_leave;
              } else state.head && (state.head.name = null);
              state.length = 0, state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0)
                  break inf_leave;
                copy = 0;
                do
                  len = input[next + copy++], state.head && len && state.length < 65536 && (state.head.comment += String.fromCharCode(len));
                while (len && copy < have);
                if (state.flags & 512 && (state.check = crc32(state.check, input, copy, next)), have -= copy, next += copy, len)
                  break inf_leave;
              } else state.head && (state.head.comment = null);
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                for (; bits < 16; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch", state.mode = BAD;
                  break;
                }
                hold = 0, bits = 0;
              }
              state.head && (state.head.hcrc = state.flags >> 9 & 1, state.head.done = !0), strm.adler = state.check = 0, state.mode = TYPE;
              break;
            case DICTID:
              for (; bits < 32; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              strm.adler = state.check = zswap32(hold), hold = 0, bits = 0, state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0)
                return strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, Z_NEED_DICT;
              strm.adler = state.check = 1, state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES)
                break inf_leave;
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7, bits -= bits & 7, state.mode = CHECK;
                break;
              }
              for (; bits < 3; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              switch (state.last = hold & 1, hold >>>= 1, bits -= 1, hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  if (fixedtables(state), state.mode = LEN_, flush === Z_TREES) {
                    hold >>>= 2, bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type", state.mode = BAD;
              }
              hold >>>= 2, bits -= 2;
              break;
            case STORED:
              for (hold >>>= bits & 7, bits -= bits & 7; bits < 32; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths", state.mode = BAD;
                break;
              }
              if (state.length = hold & 65535, hold = 0, bits = 0, state.mode = COPY_, flush === Z_TREES)
                break inf_leave;
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              if (copy = state.length, copy) {
                if (copy > have && (copy = have), copy > left && (copy = left), copy === 0)
                  break inf_leave;
                utils.arraySet(output, input, next, copy, put), have -= copy, next += copy, left -= copy, put += copy, state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              for (; bits < 14; ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if (state.nlen = (hold & 31) + 257, hold >>>= 5, bits -= 5, state.ndist = (hold & 31) + 1, hold >>>= 5, bits -= 5, state.ncode = (hold & 15) + 4, hold >>>= 4, bits -= 4, state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols", state.mode = BAD;
                break;
              }
              state.have = 0, state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              for (; state.have < state.ncode; ) {
                for (; bits < 3; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7, hold >>>= 3, bits -= 3;
              }
              for (; state.have < 19; )
                state.lens[order[state.have++]] = 0;
              if (state.lencode = state.lendyn, state.lenbits = 7, opts = { bits: state.lenbits }, ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts), state.lenbits = opts.bits, ret) {
                strm.msg = "invalid code lengths set", state.mode = BAD;
                break;
              }
              state.have = 0, state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              for (; state.have < state.nlen + state.ndist; ) {
                for (; here = state.lencode[hold & (1 << state.lenbits) - 1], here_bits = here >>> 24, here_op = here >>> 16 & 255, here_val = here & 65535, !(here_bits <= bits); ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                if (here_val < 16)
                  hold >>>= here_bits, bits -= here_bits, state.lens[state.have++] = here_val;
                else {
                  if (here_val === 16) {
                    for (n = here_bits + 2; bits < n; ) {
                      if (have === 0)
                        break inf_leave;
                      have--, hold += input[next++] << bits, bits += 8;
                    }
                    if (hold >>>= here_bits, bits -= here_bits, state.have === 0) {
                      strm.msg = "invalid bit length repeat", state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1], copy = 3 + (hold & 3), hold >>>= 2, bits -= 2;
                  } else if (here_val === 17) {
                    for (n = here_bits + 3; bits < n; ) {
                      if (have === 0)
                        break inf_leave;
                      have--, hold += input[next++] << bits, bits += 8;
                    }
                    hold >>>= here_bits, bits -= here_bits, len = 0, copy = 3 + (hold & 7), hold >>>= 3, bits -= 3;
                  } else {
                    for (n = here_bits + 7; bits < n; ) {
                      if (have === 0)
                        break inf_leave;
                      have--, hold += input[next++] << bits, bits += 8;
                    }
                    hold >>>= here_bits, bits -= here_bits, len = 0, copy = 11 + (hold & 127), hold >>>= 7, bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat", state.mode = BAD;
                    break;
                  }
                  for (; copy--; )
                    state.lens[state.have++] = len;
                }
              }
              if (state.mode === BAD)
                break;
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block", state.mode = BAD;
                break;
              }
              if (state.lenbits = 9, opts = { bits: state.lenbits }, ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts), state.lenbits = opts.bits, ret) {
                strm.msg = "invalid literal/lengths set", state.mode = BAD;
                break;
              }
              if (state.distbits = 6, state.distcode = state.distdyn, opts = { bits: state.distbits }, ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts), state.distbits = opts.bits, ret) {
                strm.msg = "invalid distances set", state.mode = BAD;
                break;
              }
              if (state.mode = LEN_, flush === Z_TREES)
                break inf_leave;
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, inflate_fast(strm, _out), put = strm.next_out, output = strm.output, left = strm.avail_out, next = strm.next_in, input = strm.input, have = strm.avail_in, hold = state.hold, bits = state.bits, state.mode === TYPE && (state.back = -1);
                break;
              }
              for (state.back = 0; here = state.lencode[hold & (1 << state.lenbits) - 1], here_bits = here >>> 24, here_op = here >>> 16 & 255, here_val = here & 65535, !(here_bits <= bits); ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                for (last_bits = here_bits, last_op = here_op, last_val = here_val; here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)], here_bits = here >>> 24, here_op = here >>> 16 & 255, here_val = here & 65535, !(last_bits + here_bits <= bits); ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                hold >>>= last_bits, bits -= last_bits, state.back += last_bits;
              }
              if (hold >>>= here_bits, bits -= here_bits, state.back += here_bits, state.length = here_val, here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1, state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code", state.mode = BAD;
                break;
              }
              state.extra = here_op & 15, state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                for (n = state.extra; bits < n; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1, hold >>>= state.extra, bits -= state.extra, state.back += state.extra;
              }
              state.was = state.length, state.mode = DIST;
            /* falls through */
            case DIST:
              for (; here = state.distcode[hold & (1 << state.distbits) - 1], here_bits = here >>> 24, here_op = here >>> 16 & 255, here_val = here & 65535, !(here_bits <= bits); ) {
                if (have === 0)
                  break inf_leave;
                have--, hold += input[next++] << bits, bits += 8;
              }
              if ((here_op & 240) === 0) {
                for (last_bits = here_bits, last_op = here_op, last_val = here_val; here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)], here_bits = here >>> 24, here_op = here >>> 16 & 255, here_val = here & 65535, !(last_bits + here_bits <= bits); ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                hold >>>= last_bits, bits -= last_bits, state.back += last_bits;
              }
              if (hold >>>= here_bits, bits -= here_bits, state.back += here_bits, here_op & 64) {
                strm.msg = "invalid distance code", state.mode = BAD;
                break;
              }
              state.offset = here_val, state.extra = here_op & 15, state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                for (n = state.extra; bits < n; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1, hold >>>= state.extra, bits -= state.extra, state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back", state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0)
                break inf_leave;
              if (copy = _out - left, state.offset > copy) {
                if (copy = state.offset - copy, copy > state.whave && state.sane) {
                  strm.msg = "invalid distance too far back", state.mode = BAD;
                  break;
                }
                copy > state.wnext ? (copy -= state.wnext, from = state.wsize - copy) : from = state.wnext - copy, copy > state.length && (copy = state.length), from_source = state.window;
              } else
                from_source = output, from = put - state.offset, copy = state.length;
              copy > left && (copy = left), left -= copy, state.length -= copy;
              do
                output[put++] = from_source[from++];
              while (--copy);
              state.length === 0 && (state.mode = LEN);
              break;
            case LIT:
              if (left === 0)
                break inf_leave;
              output[put++] = state.length, left--, state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                for (; bits < 32; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold |= input[next++] << bits, bits += 8;
                }
                if (_out -= left, strm.total_out += _out, state.total += _out, _out && (strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out)), _out = left, (state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check", state.mode = BAD;
                  break;
                }
                hold = 0, bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                for (; bits < 32; ) {
                  if (have === 0)
                    break inf_leave;
                  have--, hold += input[next++] << bits, bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check", state.mode = BAD;
                  break;
                }
                hold = 0, bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
      return strm.next_out = put, strm.avail_out = left, strm.next_in = next, strm.avail_in = have, state.hold = hold, state.bits = bits, (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) && updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out) ? (state.mode = MEM, Z_MEM_ERROR) : (_in -= strm.avail_in, _out -= strm.avail_out, strm.total_in += _in, strm.total_out += _out, state.total += _out, state.wrap && _out && (strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out)), strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0), (_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK && (ret = Z_BUF_ERROR), ret);
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state)
        return Z_STREAM_ERROR;
      var state = strm.state;
      return state.window && (state.window = null), strm.state = null, Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      return !strm || !strm.state || (state = strm.state, (state.wrap & 2) === 0) ? Z_STREAM_ERROR : (state.head = head, head.done = !1, Z_OK);
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length, state, dictid, ret;
      return !strm || !strm.state || (state = strm.state, state.wrap !== 0 && state.mode !== DICT) ? Z_STREAM_ERROR : state.mode === DICT && (dictid = 1, dictid = adler32(dictid, dictionary, dictLength, 0), dictid !== state.check) ? Z_DATA_ERROR : (ret = updatewindow(strm, dictionary, dictLength, dictLength), ret ? (state.mode = MEM, Z_MEM_ERROR) : (state.havedict = 1, Z_OK));
    }
    exports.inflateReset = inflateReset;
    exports.inflateReset2 = inflateReset2;
    exports.inflateResetKeep = inflateResetKeep;
    exports.inflateInit = inflateInit;
    exports.inflateInit2 = inflateInit2;
    exports.inflate = inflate;
    exports.inflateEnd = inflateEnd;
    exports.inflateGetHeader = inflateGetHeader;
    exports.inflateSetDictionary = inflateSetDictionary;
    exports.inflateInfo = "pako inflate (from Nodeca project)";
  }
});

// node_modules/pako/lib/zlib/constants.js
var require_constants = __commonJS({
  "node_modules/pako/lib/zlib/constants.js"(exports, module) {
    "use strict";
    module.exports = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
  }
});

// node_modules/pako/lib/zlib/gzheader.js
var require_gzheader = __commonJS({
  "node_modules/pako/lib/zlib/gzheader.js"(exports, module) {
    "use strict";
    function GZheader() {
      this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
    }
    module.exports = GZheader;
  }
});

// node_modules/pako/lib/inflate.js
var require_inflate2 = __commonJS({
  "node_modules/pako/lib/inflate.js"(exports) {
    "use strict";
    var zlib_inflate = require_inflate(), utils = require_common(), strings = require_strings(), c = require_constants(), msg = require_messages(), ZStream = require_zstream(), GZheader = require_gzheader(), toString = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate)) return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      opt.raw && opt.windowBits >= 0 && opt.windowBits < 16 && (opt.windowBits = -opt.windowBits, opt.windowBits === 0 && (opt.windowBits = -15)), opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits) && (opt.windowBits += 32), opt.windowBits > 15 && opt.windowBits < 48 && (opt.windowBits & 15) === 0 && (opt.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ZStream(), this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== c.Z_OK)
        throw new Error(msg[status]);
      if (this.header = new GZheader(), zlib_inflate.inflateGetHeader(this.strm, this.header), opt.dictionary && (typeof opt.dictionary == "string" ? opt.dictionary = strings.string2buf(opt.dictionary) : toString.call(opt.dictionary) === "[object ArrayBuffer]" && (opt.dictionary = new Uint8Array(opt.dictionary)), opt.raw && (status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary), status !== c.Z_OK)))
        throw new Error(msg[status]);
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm, chunkSize = this.options.chunkSize, dictionary = this.options.dictionary, status, _mode, next_out_utf8, tail, utf8str, allowBufError = !1;
      if (this.ended)
        return !1;
      _mode = mode === ~~mode ? mode : mode === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof data == "string" ? strm.input = strings.binstring2buf(data) : toString.call(data) === "[object ArrayBuffer]" ? strm.input = new Uint8Array(data) : strm.input = data, strm.next_in = 0, strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0 && (strm.output = new utils.Buf8(chunkSize), strm.next_out = 0, strm.avail_out = chunkSize), status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH), status === c.Z_NEED_DICT && dictionary && (status = zlib_inflate.inflateSetDictionary(this.strm, dictionary)), status === c.Z_BUF_ERROR && allowBufError === !0 && (status = c.Z_OK, allowBufError = !1), status !== c.Z_STREAM_END && status !== c.Z_OK)
          return this.onEnd(status), this.ended = !0, !1;
        strm.next_out && (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (next_out_utf8 = strings.utf8border(strm.output, strm.next_out), tail = strm.next_out - next_out_utf8, utf8str = strings.buf2string(strm.output, next_out_utf8), strm.next_out = tail, strm.avail_out = chunkSize - tail, tail && utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0), this.onData(utf8str)) : this.onData(utils.shrinkBuf(strm.output, strm.next_out))), strm.avail_in === 0 && strm.avail_out === 0 && (allowBufError = !0);
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      return status === c.Z_STREAM_END && (_mode = c.Z_FINISH), _mode === c.Z_FINISH ? (status = zlib_inflate.inflateEnd(this.strm), this.onEnd(status), this.ended = !0, status === c.Z_OK) : (_mode === c.Z_SYNC_FLUSH && (this.onEnd(c.Z_OK), strm.avail_out = 0), !0);
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      status === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = utils.flattenChunks(this.chunks)), this.chunks = [], this.err = status, this.msg = this.strm.msg;
    };
    function inflate(input, options) {
      var inflator = new Inflate(options);
      if (inflator.push(input, !0), inflator.err)
        throw inflator.msg || msg[inflator.err];
      return inflator.result;
    }
    function inflateRaw(input, options) {
      return options = options || {}, options.raw = !0, inflate(input, options);
    }
    exports.Inflate = Inflate;
    exports.inflate = inflate;
    exports.inflateRaw = inflateRaw;
    exports.ungzip = inflate;
  }
});

// node_modules/pako/index.js
var require_pako = __commonJS({
  "node_modules/pako/index.js"(exports, module) {
    "use strict";
    var assign = require_common().assign, deflate = require_deflate2(), inflate = require_inflate2(), constants = require_constants(), pako = {};
    assign(pako, deflate, inflate, constants);
    module.exports = pako;
  }
});

// node_modules/jszip/lib/flate.js
var require_flate = __commonJS({
  "node_modules/jszip/lib/flate.js"(exports) {
    "use strict";
    var USE_TYPEDARRAY = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", pako = require_pako(), utils = require_utils(), GenericWorker = require_GenericWorker(), ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
    exports.magic = "\b\0";
    function FlateWorker(action, options) {
      GenericWorker.call(this, "FlateWorker/" + action), this._pako = null, this._pakoAction = action, this._pakoOptions = options, this.meta = {};
    }
    utils.inherits(FlateWorker, GenericWorker);
    FlateWorker.prototype.processChunk = function(chunk) {
      this.meta = chunk.meta, this._pako === null && this._createPako(), this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), !1);
    };
    FlateWorker.prototype.flush = function() {
      GenericWorker.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
    };
    FlateWorker.prototype.cleanUp = function() {
      GenericWorker.prototype.cleanUp.call(this), this._pako = null;
    };
    FlateWorker.prototype._createPako = function() {
      this._pako = new pako[this._pakoAction]({
        raw: !0,
        level: this._pakoOptions.level || -1
        // default compression
      });
      var self2 = this;
      this._pako.onData = function(data) {
        self2.push({
          data,
          meta: self2.meta
        });
      };
    };
    exports.compressWorker = function(compressionOptions) {
      return new FlateWorker("Deflate", compressionOptions);
    };
    exports.uncompressWorker = function() {
      return new FlateWorker("Inflate", {});
    };
  }
});

// node_modules/jszip/lib/compressions.js
var require_compressions = __commonJS({
  "node_modules/jszip/lib/compressions.js"(exports) {
    "use strict";
    var GenericWorker = require_GenericWorker();
    exports.STORE = {
      magic: "\0\0",
      compressWorker: function() {
        return new GenericWorker("STORE compression");
      },
      uncompressWorker: function() {
        return new GenericWorker("STORE decompression");
      }
    };
    exports.DEFLATE = require_flate();
  }
});

// node_modules/jszip/lib/signature.js
var require_signature = __commonJS({
  "node_modules/jszip/lib/signature.js"(exports) {
    "use strict";
    exports.LOCAL_FILE_HEADER = "PK";
    exports.CENTRAL_FILE_HEADER = "PK";
    exports.CENTRAL_DIRECTORY_END = "PK";
    exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
    exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
    exports.DATA_DESCRIPTOR = "PK\x07\b";
  }
});

// node_modules/jszip/lib/generate/ZipFileWorker.js
var require_ZipFileWorker = __commonJS({
  "node_modules/jszip/lib/generate/ZipFileWorker.js"(exports, module) {
    "use strict";
    var utils = require_utils(), GenericWorker = require_GenericWorker(), utf8 = require_utf8(), crc32 = require_crc32(), signature = require_signature(), decToHex = function(dec, bytes) {
      var hex = "", i;
      for (i = 0; i < bytes; i++)
        hex += String.fromCharCode(dec & 255), dec = dec >>> 8;
      return hex;
    }, generateUnixExternalFileAttr = function(unixPermissions, isDir) {
      var result = unixPermissions;
      return unixPermissions || (result = isDir ? 16893 : 33204), (result & 65535) << 16;
    }, generateDosExternalFileAttr = function(dosPermissions) {
      return (dosPermissions || 0) & 63;
    }, generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
      var file = streamInfo.file, compression = streamInfo.compression, useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment, encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir = file.dir, date = file.date, dataInfo = {
        crc32: 0,
        compressedSize: 0,
        uncompressedSize: 0
      };
      (!streamedContent || streamingEnded) && (dataInfo.crc32 = streamInfo.crc32, dataInfo.compressedSize = streamInfo.compressedSize, dataInfo.uncompressedSize = streamInfo.uncompressedSize);
      var bitflag = 0;
      streamedContent && (bitflag |= 8), !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) && (bitflag |= 2048);
      var extFileAttr = 0, versionMadeBy = 0;
      dir && (extFileAttr |= 16), platform === "UNIX" ? (versionMadeBy = 798, extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir)) : (versionMadeBy = 20, extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir)), dosTime = date.getUTCHours(), dosTime = dosTime << 6, dosTime = dosTime | date.getUTCMinutes(), dosTime = dosTime << 5, dosTime = dosTime | date.getUTCSeconds() / 2, dosDate = date.getUTCFullYear() - 1980, dosDate = dosDate << 4, dosDate = dosDate | date.getUTCMonth() + 1, dosDate = dosDate << 5, dosDate = dosDate | date.getUTCDate(), useUTF8ForFileName && (unicodePathExtraField = // Version
      decToHex(1, 1) + // NameCRC32
      decToHex(crc32(encodedFileName), 4) + // UnicodeName
      utfEncodedFileName, extraFields += // Info-ZIP Unicode Path Extra Field
      "up" + // size
      decToHex(unicodePathExtraField.length, 2) + // content
      unicodePathExtraField), useUTF8ForComment && (unicodeCommentExtraField = // Version
      decToHex(1, 1) + // CommentCRC32
      decToHex(crc32(encodedComment), 4) + // UnicodeName
      utfEncodedComment, extraFields += // Info-ZIP Unicode Path Extra Field
      "uc" + // size
      decToHex(unicodeCommentExtraField.length, 2) + // content
      unicodeCommentExtraField);
      var header = "";
      header += `
\0`, header += decToHex(bitflag, 2), header += compression.magic, header += decToHex(dosTime, 2), header += decToHex(dosDate, 2), header += decToHex(dataInfo.crc32, 4), header += decToHex(dataInfo.compressedSize, 4), header += decToHex(dataInfo.uncompressedSize, 4), header += decToHex(encodedFileName.length, 2), header += decToHex(extraFields.length, 2);
      var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields, dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
      decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
      header + // file comment length
      decToHex(encodedComment.length, 2) + // disk number start
      "\0\0\0\0" + // external file attributes
      decToHex(extFileAttr, 4) + // relative offset of local header
      decToHex(offset, 4) + // file name
      encodedFileName + // extra field
      extraFields + // file comment
      encodedComment;
      return {
        fileRecord,
        dirRecord
      };
    }, generateCentralDirectoryEnd = function(entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
      var dirEnd = "", encodedComment = utils.transformTo("string", encodeFileName(comment));
      return dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
      "\0\0\0\0" + // total number of entries in the central directory on this disk
      decToHex(entriesCount, 2) + // total number of entries in the central directory
      decToHex(entriesCount, 2) + // size of the central directory   4 bytes
      decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
      decToHex(localDirLength, 4) + // .ZIP file comment length
      decToHex(encodedComment.length, 2) + // .ZIP file comment
      encodedComment, dirEnd;
    }, generateDataDescriptors = function(streamInfo) {
      var descriptor = "";
      return descriptor = signature.DATA_DESCRIPTOR + // crc-32                          4 bytes
      decToHex(streamInfo.crc32, 4) + // compressed size                 4 bytes
      decToHex(streamInfo.compressedSize, 4) + // uncompressed size               4 bytes
      decToHex(streamInfo.uncompressedSize, 4), descriptor;
    };
    function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
      GenericWorker.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = comment, this.zipPlatform = platform, this.encodeFileName = encodeFileName, this.streamFiles = streamFiles, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
    }
    utils.inherits(ZipFileWorker, GenericWorker);
    ZipFileWorker.prototype.push = function(chunk) {
      var currentFilePercent = chunk.meta.percent || 0, entriesCount = this.entriesCount, remainingFiles = this._sources.length;
      this.accumulate ? this.contentBuffer.push(chunk) : (this.bytesWritten += chunk.data.length, GenericWorker.prototype.push.call(this, {
        data: chunk.data,
        meta: {
          currentFile: this.currentFile,
          percent: entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
        }
      }));
    };
    ZipFileWorker.prototype.openedSource = function(streamInfo) {
      this.currentSourceOffset = this.bytesWritten, this.currentFile = streamInfo.file.name;
      var streamedContent = this.streamFiles && !streamInfo.file.dir;
      if (streamedContent) {
        var record = generateZipParts(streamInfo, streamedContent, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        });
      } else
        this.accumulate = !0;
    };
    ZipFileWorker.prototype.closedSource = function(streamInfo) {
      this.accumulate = !1;
      var streamedContent = this.streamFiles && !streamInfo.file.dir, record = generateZipParts(streamInfo, streamedContent, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
      if (this.dirRecords.push(record.dirRecord), streamedContent)
        this.push({
          data: generateDataDescriptors(streamInfo),
          meta: { percent: 100 }
        });
      else
        for (this.push({
          data: record.fileRecord,
          meta: { percent: 0 }
        }); this.contentBuffer.length; )
          this.push(this.contentBuffer.shift());
      this.currentFile = null;
    };
    ZipFileWorker.prototype.flush = function() {
      for (var localDirLength = this.bytesWritten, i = 0; i < this.dirRecords.length; i++)
        this.push({
          data: this.dirRecords[i],
          meta: { percent: 100 }
        });
      var centralDirLength = this.bytesWritten - localDirLength, dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
      this.push({
        data: dirEnd,
        meta: { percent: 100 }
      });
    };
    ZipFileWorker.prototype.prepareNextSource = function() {
      this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
    };
    ZipFileWorker.prototype.registerPrevious = function(previous) {
      this._sources.push(previous);
      var self2 = this;
      return previous.on("data", function(chunk) {
        self2.processChunk(chunk);
      }), previous.on("end", function() {
        self2.closedSource(self2.previous.streamInfo), self2._sources.length ? self2.prepareNextSource() : self2.end();
      }), previous.on("error", function(e) {
        self2.error(e);
      }), this;
    };
    ZipFileWorker.prototype.resume = function() {
      if (!GenericWorker.prototype.resume.call(this))
        return !1;
      if (!this.previous && this._sources.length)
        return this.prepareNextSource(), !0;
      if (!this.previous && !this._sources.length && !this.generatedError)
        return this.end(), !0;
    };
    ZipFileWorker.prototype.error = function(e) {
      var sources = this._sources;
      if (!GenericWorker.prototype.error.call(this, e))
        return !1;
      for (var i = 0; i < sources.length; i++)
        try {
          sources[i].error(e);
        } catch {
        }
      return !0;
    };
    ZipFileWorker.prototype.lock = function() {
      GenericWorker.prototype.lock.call(this);
      for (var sources = this._sources, i = 0; i < sources.length; i++)
        sources[i].lock();
    };
    module.exports = ZipFileWorker;
  }
});

// node_modules/jszip/lib/generate/index.js
var require_generate = __commonJS({
  "node_modules/jszip/lib/generate/index.js"(exports) {
    "use strict";
    var compressions = require_compressions(), ZipFileWorker = require_ZipFileWorker(), getCompression = function(fileCompression, zipCompression) {
      var compressionName = fileCompression || zipCompression, compression = compressions[compressionName];
      if (!compression)
        throw new Error(compressionName + " is not a valid compression method !");
      return compression;
    };
    exports.generateWorker = function(zip, options, comment) {
      var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName), entriesCount = 0;
      try {
        zip.forEach(function(relativePath, file) {
          entriesCount++;
          var compression = getCompression(file.options.compression, options.compression), compressionOptions = file.options.compressionOptions || options.compressionOptions || {}, dir = file.dir, date = file.date;
          file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
            name: relativePath,
            dir,
            date,
            comment: file.comment || "",
            unixPermissions: file.unixPermissions,
            dosPermissions: file.dosPermissions
          }).pipe(zipFileWorker);
        }), zipFileWorker.entriesCount = entriesCount;
      } catch (e) {
        zipFileWorker.error(e);
      }
      return zipFileWorker;
    };
  }
});

// node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js
var require_NodejsStreamInputAdapter = __commonJS({
  "node_modules/jszip/lib/nodejs/NodejsStreamInputAdapter.js"(exports, module) {
    "use strict";
    var utils = require_utils(), GenericWorker = require_GenericWorker();
    function NodejsStreamInputAdapter(filename, stream) {
      GenericWorker.call(this, "Nodejs stream input adapter for " + filename), this._upstreamEnded = !1, this._bindStream(stream);
    }
    utils.inherits(NodejsStreamInputAdapter, GenericWorker);
    NodejsStreamInputAdapter.prototype._bindStream = function(stream) {
      var self2 = this;
      this._stream = stream, stream.pause(), stream.on("data", function(chunk) {
        self2.push({
          data: chunk,
          meta: {
            percent: 0
          }
        });
      }).on("error", function(e) {
        self2.isPaused ? this.generatedError = e : self2.error(e);
      }).on("end", function() {
        self2.isPaused ? self2._upstreamEnded = !0 : self2.end();
      });
    };
    NodejsStreamInputAdapter.prototype.pause = function() {
      return GenericWorker.prototype.pause.call(this) ? (this._stream.pause(), !0) : !1;
    };
    NodejsStreamInputAdapter.prototype.resume = function() {
      return GenericWorker.prototype.resume.call(this) ? (this._upstreamEnded ? this.end() : this._stream.resume(), !0) : !1;
    };
    module.exports = NodejsStreamInputAdapter;
  }
});

// node_modules/jszip/lib/object.js
var require_object = __commonJS({
  "node_modules/jszip/lib/object.js"(exports, module) {
    "use strict";
    var utf8 = require_utf8(), utils = require_utils(), GenericWorker = require_GenericWorker(), StreamHelper = require_StreamHelper(), defaults = require_defaults(), CompressedObject = require_compressedObject(), ZipObject = require_zipObject(), generate = require_generate(), nodejsUtils = require_nodejsUtils(), NodejsStreamInputAdapter = require_NodejsStreamInputAdapter(), fileAdd = function(name, data, originalOptions) {
      var dataType = utils.getTypeOf(data), parent, o = utils.extend(originalOptions || {}, defaults);
      o.date = o.date || /* @__PURE__ */ new Date(), o.compression !== null && (o.compression = o.compression.toUpperCase()), typeof o.unixPermissions == "string" && (o.unixPermissions = parseInt(o.unixPermissions, 8)), o.unixPermissions && o.unixPermissions & 16384 && (o.dir = !0), o.dosPermissions && o.dosPermissions & 16 && (o.dir = !0), o.dir && (name = forceTrailingSlash(name)), o.createFolders && (parent = parentFolder(name)) && folderAdd.call(this, parent, !0);
      var isUnicodeString = dataType === "string" && o.binary === !1 && o.base64 === !1;
      (!originalOptions || typeof originalOptions.binary > "u") && (o.binary = !isUnicodeString);
      var isCompressedEmpty = data instanceof CompressedObject && data.uncompressedSize === 0;
      (isCompressedEmpty || o.dir || !data || data.length === 0) && (o.base64 = !1, o.binary = !0, data = "", o.compression = "STORE", dataType = "string");
      var zipObjectContent = null;
      data instanceof CompressedObject || data instanceof GenericWorker ? zipObjectContent = data : nodejsUtils.isNode && nodejsUtils.isStream(data) ? zipObjectContent = new NodejsStreamInputAdapter(name, data) : zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
      var object = new ZipObject(name, zipObjectContent, o);
      this.files[name] = object;
    }, parentFolder = function(path) {
      path.slice(-1) === "/" && (path = path.substring(0, path.length - 1));
      var lastSlash = path.lastIndexOf("/");
      return lastSlash > 0 ? path.substring(0, lastSlash) : "";
    }, forceTrailingSlash = function(path) {
      return path.slice(-1) !== "/" && (path += "/"), path;
    }, folderAdd = function(name, createFolders) {
      return createFolders = typeof createFolders < "u" ? createFolders : defaults.createFolders, name = forceTrailingSlash(name), this.files[name] || fileAdd.call(this, name, null, {
        dir: !0,
        createFolders
      }), this.files[name];
    };
    function isRegExp(object) {
      return Object.prototype.toString.call(object) === "[object RegExp]";
    }
    var out = {
      /**
       * @see loadAsync
       */
      load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Call a callback function for each entry at this folder level.
       * @param {Function} cb the callback function:
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       */
      forEach: function(cb) {
        var filename, relativePath, file;
        for (filename in this.files)
          file = this.files[filename], relativePath = filename.slice(this.root.length, filename.length), relativePath && filename.slice(0, this.root.length) === this.root && cb(relativePath, file);
      },
      /**
       * Filter nested files/folders with the specified function.
       * @param {Function} search the predicate to use :
       * function (relativePath, file) {...}
       * It takes 2 arguments : the relative path and the file.
       * @return {Array} An array of matching elements.
       */
      filter: function(search) {
        var result = [];
        return this.forEach(function(relativePath, entry) {
          search(relativePath, entry) && result.push(entry);
        }), result;
      },
      /**
       * Add a file to the zip file, or search a file.
       * @param   {string|RegExp} name The name of the file to add (if data is defined),
       * the name of the file to find (if no data) or a regex to match files.
       * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
       * @param   {Object} o     File options
       * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
       * a file (when searching by string) or an array of files (when searching by regex).
       */
      file: function(name, data, o) {
        if (arguments.length === 1)
          if (isRegExp(name)) {
            var regexp = name;
            return this.filter(function(relativePath, file) {
              return !file.dir && regexp.test(relativePath);
            });
          } else {
            var obj = this.files[this.root + name];
            return obj && !obj.dir ? obj : null;
          }
        else
          name = this.root + name, fileAdd.call(this, name, data, o);
        return this;
      },
      /**
       * Add a directory to the zip file, or search.
       * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
       * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
       */
      folder: function(arg) {
        if (!arg)
          return this;
        if (isRegExp(arg))
          return this.filter(function(relativePath, file) {
            return file.dir && arg.test(relativePath);
          });
        var name = this.root + arg, newFolder = folderAdd.call(this, name), ret = this.clone();
        return ret.root = newFolder.name, ret;
      },
      /**
       * Delete a file, or a directory and all sub-files, from the zip
       * @param {string} name the name of the file to delete
       * @return {JSZip} this JSZip object
       */
      remove: function(name) {
        name = this.root + name;
        var file = this.files[name];
        if (file || (name.slice(-1) !== "/" && (name += "/"), file = this.files[name]), file && !file.dir)
          delete this.files[name];
        else
          for (var kids = this.filter(function(relativePath, file2) {
            return file2.name.slice(0, name.length) === name;
          }), i = 0; i < kids.length; i++)
            delete this.files[kids[i].name];
        return this;
      },
      /**
       * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
       */
      generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      },
      /**
       * Generate the complete zip file as an internal stream.
       * @param {Object} options the options to generate the zip file :
       * - compression, "STORE" by default.
       * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
       * @return {StreamHelper} the streamed zip file.
       */
      generateInternalStream: function(options) {
        var worker, opts = {};
        try {
          if (opts = utils.extend(options || {}, {
            streamFiles: !1,
            compression: "STORE",
            compressionOptions: null,
            type: "",
            platform: "DOS",
            comment: null,
            mimeType: "application/zip",
            encodeFileName: utf8.utf8encode
          }), opts.type = opts.type.toLowerCase(), opts.compression = opts.compression.toUpperCase(), opts.type === "binarystring" && (opts.type = "string"), !opts.type)
            throw new Error("No output type specified.");
          utils.checkSupport(opts.type), (opts.platform === "darwin" || opts.platform === "freebsd" || opts.platform === "linux" || opts.platform === "sunos") && (opts.platform = "UNIX"), opts.platform === "win32" && (opts.platform = "DOS");
          var comment = opts.comment || this.comment || "";
          worker = generate.generateWorker(this, opts, comment);
        } catch (e) {
          worker = new GenericWorker("error"), worker.error(e);
        }
        return new StreamHelper(worker, opts.type || "string", opts.mimeType);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateAsync: function(options, onUpdate) {
        return this.generateInternalStream(options).accumulate(onUpdate);
      },
      /**
       * Generate the complete zip file asynchronously.
       * @see generateInternalStream
       */
      generateNodeStream: function(options, onUpdate) {
        return options = options || {}, options.type || (options.type = "nodebuffer"), this.generateInternalStream(options).toNodejsStream(onUpdate);
      }
    };
    module.exports = out;
  }
});

// node_modules/jszip/lib/reader/DataReader.js
var require_DataReader = __commonJS({
  "node_modules/jszip/lib/reader/DataReader.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    function DataReader(data) {
      this.data = data, this.length = data.length, this.index = 0, this.zero = 0;
    }
    DataReader.prototype = {
      /**
       * Check that the offset will not go too far.
       * @param {string} offset the additional offset to check.
       * @throws {Error} an Error if the offset is out of bounds.
       */
      checkOffset: function(offset) {
        this.checkIndex(this.index + offset);
      },
      /**
       * Check that the specified index will not be too far.
       * @param {string} newIndex the index to check.
       * @throws {Error} an Error if the index is out of bounds.
       */
      checkIndex: function(newIndex) {
        if (this.length < this.zero + newIndex || newIndex < 0)
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
      },
      /**
       * Change the index.
       * @param {number} newIndex The new index.
       * @throws {Error} if the new index is out of the data.
       */
      setIndex: function(newIndex) {
        this.checkIndex(newIndex), this.index = newIndex;
      },
      /**
       * Skip the next n bytes.
       * @param {number} n the number of bytes to skip.
       * @throws {Error} if the new index is out of the data.
       */
      skip: function(n) {
        this.setIndex(this.index + n);
      },
      /**
       * Get the byte at the specified index.
       * @param {number} i the index to use.
       * @return {number} a byte.
       */
      byteAt: function() {
      },
      /**
       * Get the next number with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {number} the corresponding number.
       */
      readInt: function(size) {
        var result = 0, i;
        for (this.checkOffset(size), i = this.index + size - 1; i >= this.index; i--)
          result = (result << 8) + this.byteAt(i);
        return this.index += size, result;
      },
      /**
       * Get the next string with a given byte size.
       * @param {number} size the number of bytes to read.
       * @return {string} the corresponding string.
       */
      readString: function(size) {
        return utils.transformTo("string", this.readData(size));
      },
      /**
       * Get raw data without conversion, <size> bytes.
       * @param {number} size the number of bytes to read.
       * @return {Object} the raw data, implementation specific.
       */
      readData: function() {
      },
      /**
       * Find the last occurrence of a zip signature (4 bytes).
       * @param {string} sig the signature to find.
       * @return {number} the index of the last occurrence, -1 if not found.
       */
      lastIndexOfSignature: function() {
      },
      /**
       * Read the signature (4 bytes) at the current position and compare it with sig.
       * @param {string} sig the expected signature
       * @return {boolean} true if the signature matches, false otherwise.
       */
      readAndCheckSignature: function() {
      },
      /**
       * Get the next date.
       * @return {Date} the date.
       */
      readDate: function() {
        var dostime = this.readInt(4);
        return new Date(Date.UTC(
          (dostime >> 25 & 127) + 1980,
          // year
          (dostime >> 21 & 15) - 1,
          // month
          dostime >> 16 & 31,
          // day
          dostime >> 11 & 31,
          // hour
          dostime >> 5 & 63,
          // minute
          (dostime & 31) << 1
        ));
      }
    };
    module.exports = DataReader;
  }
});

// node_modules/jszip/lib/reader/ArrayReader.js
var require_ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/ArrayReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader(), utils = require_utils();
    function ArrayReader(data) {
      DataReader.call(this, data);
      for (var i = 0; i < this.data.length; i++)
        data[i] = data[i] & 255;
    }
    utils.inherits(ArrayReader, DataReader);
    ArrayReader.prototype.byteAt = function(i) {
      return this.data[this.zero + i];
    };
    ArrayReader.prototype.lastIndexOfSignature = function(sig) {
      for (var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), i = this.length - 4; i >= 0; --i)
        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3)
          return i - this.zero;
      return -1;
    };
    ArrayReader.prototype.readAndCheckSignature = function(sig) {
      var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
      return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
    };
    ArrayReader.prototype.readData = function(size) {
      if (this.checkOffset(size), size === 0)
        return [];
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      return this.index += size, result;
    };
    module.exports = ArrayReader;
  }
});

// node_modules/jszip/lib/reader/StringReader.js
var require_StringReader = __commonJS({
  "node_modules/jszip/lib/reader/StringReader.js"(exports, module) {
    "use strict";
    var DataReader = require_DataReader(), utils = require_utils();
    function StringReader(data) {
      DataReader.call(this, data);
    }
    utils.inherits(StringReader, DataReader);
    StringReader.prototype.byteAt = function(i) {
      return this.data.charCodeAt(this.zero + i);
    };
    StringReader.prototype.lastIndexOfSignature = function(sig) {
      return this.data.lastIndexOf(sig) - this.zero;
    };
    StringReader.prototype.readAndCheckSignature = function(sig) {
      var data = this.readData(4);
      return sig === data;
    };
    StringReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      return this.index += size, result;
    };
    module.exports = StringReader;
  }
});

// node_modules/jszip/lib/reader/Uint8ArrayReader.js
var require_Uint8ArrayReader = __commonJS({
  "node_modules/jszip/lib/reader/Uint8ArrayReader.js"(exports, module) {
    "use strict";
    var ArrayReader = require_ArrayReader(), utils = require_utils();
    function Uint8ArrayReader(data) {
      ArrayReader.call(this, data);
    }
    utils.inherits(Uint8ArrayReader, ArrayReader);
    Uint8ArrayReader.prototype.readData = function(size) {
      if (this.checkOffset(size), size === 0)
        return new Uint8Array(0);
      var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
      return this.index += size, result;
    };
    module.exports = Uint8ArrayReader;
  }
});

// node_modules/jszip/lib/reader/NodeBufferReader.js
var require_NodeBufferReader = __commonJS({
  "node_modules/jszip/lib/reader/NodeBufferReader.js"(exports, module) {
    "use strict";
    var Uint8ArrayReader = require_Uint8ArrayReader(), utils = require_utils();
    function NodeBufferReader(data) {
      Uint8ArrayReader.call(this, data);
    }
    utils.inherits(NodeBufferReader, Uint8ArrayReader);
    NodeBufferReader.prototype.readData = function(size) {
      this.checkOffset(size);
      var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
      return this.index += size, result;
    };
    module.exports = NodeBufferReader;
  }
});

// node_modules/jszip/lib/reader/readerFor.js
var require_readerFor = __commonJS({
  "node_modules/jszip/lib/reader/readerFor.js"(exports, module) {
    "use strict";
    var utils = require_utils(), support = require_support(), ArrayReader = require_ArrayReader(), StringReader = require_StringReader(), NodeBufferReader = require_NodeBufferReader(), Uint8ArrayReader = require_Uint8ArrayReader();
    module.exports = function(data) {
      var type = utils.getTypeOf(data);
      return utils.checkSupport(type), type === "string" && !support.uint8array ? new StringReader(data) : type === "nodebuffer" ? new NodeBufferReader(data) : support.uint8array ? new Uint8ArrayReader(utils.transformTo("uint8array", data)) : new ArrayReader(utils.transformTo("array", data));
    };
  }
});

// node_modules/jszip/lib/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/jszip/lib/zipEntry.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor(), utils = require_utils(), CompressedObject = require_compressedObject(), crc32fn = require_crc32(), utf8 = require_utf8(), compressions = require_compressions(), support = require_support(), MADE_BY_DOS = 0, MADE_BY_UNIX = 3, findCompression = function(compressionMethod) {
      for (var method in compressions)
        if (Object.prototype.hasOwnProperty.call(compressions, method) && compressions[method].magic === compressionMethod)
          return compressions[method];
      return null;
    };
    function ZipEntry(options, loadOptions) {
      this.options = options, this.loadOptions = loadOptions;
    }
    ZipEntry.prototype = {
      /**
       * say if the file is encrypted.
       * @return {boolean} true if the file is encrypted, false otherwise.
       */
      isEncrypted: function() {
        return (this.bitFlag & 1) === 1;
      },
      /**
       * say if the file has utf-8 filename/comment.
       * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
       */
      useUTF8: function() {
        return (this.bitFlag & 2048) === 2048;
      },
      /**
       * Read the local part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readLocalPart: function(reader) {
        var compression, localExtraFieldsLength;
        if (reader.skip(22), this.fileNameLength = reader.readInt(2), localExtraFieldsLength = reader.readInt(2), this.fileName = reader.readData(this.fileNameLength), reader.skip(localExtraFieldsLength), this.compressedSize === -1 || this.uncompressedSize === -1)
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if (compression = findCompression(this.compressionMethod), compression === null)
          throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readCentralPart: function(reader) {
        this.versionMadeBy = reader.readInt(2), reader.skip(2), this.bitFlag = reader.readInt(2), this.compressionMethod = reader.readString(2), this.date = reader.readDate(), this.crc32 = reader.readInt(4), this.compressedSize = reader.readInt(4), this.uncompressedSize = reader.readInt(4);
        var fileNameLength = reader.readInt(2);
        if (this.extraFieldsLength = reader.readInt(2), this.fileCommentLength = reader.readInt(2), this.diskNumberStart = reader.readInt(2), this.internalFileAttributes = reader.readInt(2), this.externalFileAttributes = reader.readInt(4), this.localHeaderOffset = reader.readInt(4), this.isEncrypted())
          throw new Error("Encrypted zip are not supported");
        reader.skip(fileNameLength), this.readExtraFields(reader), this.parseZIP64ExtraField(reader), this.fileComment = reader.readData(this.fileCommentLength);
      },
      /**
       * Parse the external file attributes and get the unix/dos permissions.
       */
      processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var madeBy = this.versionMadeBy >> 8;
        this.dir = !!(this.externalFileAttributes & 16), madeBy === MADE_BY_DOS && (this.dosPermissions = this.externalFileAttributes & 63), madeBy === MADE_BY_UNIX && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), !this.dir && this.fileNameStr.slice(-1) === "/" && (this.dir = !0);
      },
      /**
       * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
       * @param {DataReader} reader the reader to use.
       */
      parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var extraReader = readerFor(this.extraFields[1].value);
          this.uncompressedSize === utils.MAX_VALUE_32BITS && (this.uncompressedSize = extraReader.readInt(8)), this.compressedSize === utils.MAX_VALUE_32BITS && (this.compressedSize = extraReader.readInt(8)), this.localHeaderOffset === utils.MAX_VALUE_32BITS && (this.localHeaderOffset = extraReader.readInt(8)), this.diskNumberStart === utils.MAX_VALUE_32BITS && (this.diskNumberStart = extraReader.readInt(4));
        }
      },
      /**
       * Read the central part of a zip file and add the info in this object.
       * @param {DataReader} reader the reader to use.
       */
      readExtraFields: function(reader) {
        var end = reader.index + this.extraFieldsLength, extraFieldId, extraFieldLength, extraFieldValue;
        for (this.extraFields || (this.extraFields = {}); reader.index + 4 < end; )
          extraFieldId = reader.readInt(2), extraFieldLength = reader.readInt(2), extraFieldValue = reader.readData(extraFieldLength), this.extraFields[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
        reader.setIndex(end);
      },
      /**
       * Apply an UTF8 transformation if needed.
       */
      handleUTF8: function() {
        var decodeParamType = support.uint8array ? "uint8array" : "array";
        if (this.useUTF8())
          this.fileNameStr = utf8.utf8decode(this.fileName), this.fileCommentStr = utf8.utf8decode(this.fileComment);
        else {
          var upath = this.findExtraFieldUnicodePath();
          if (upath !== null)
            this.fileNameStr = upath;
          else {
            var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
          }
          var ucomment = this.findExtraFieldUnicodeComment();
          if (ucomment !== null)
            this.fileCommentStr = ucomment;
          else {
            var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
          }
        }
      },
      /**
       * Find the unicode path declared in the extra field, if any.
       * @return {String} the unicode path, null otherwise.
       */
      findExtraFieldUnicodePath: function() {
        var upathField = this.extraFields[28789];
        if (upathField) {
          var extraReader = readerFor(upathField.value);
          return extraReader.readInt(1) !== 1 || crc32fn(this.fileName) !== extraReader.readInt(4) ? null : utf8.utf8decode(extraReader.readData(upathField.length - 5));
        }
        return null;
      },
      /**
       * Find the unicode comment declared in the extra field, if any.
       * @return {String} the unicode comment, null otherwise.
       */
      findExtraFieldUnicodeComment: function() {
        var ucommentField = this.extraFields[25461];
        if (ucommentField) {
          var extraReader = readerFor(ucommentField.value);
          return extraReader.readInt(1) !== 1 || crc32fn(this.fileComment) !== extraReader.readInt(4) ? null : utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
        }
        return null;
      }
    };
    module.exports = ZipEntry;
  }
});

// node_modules/jszip/lib/zipEntries.js
var require_zipEntries = __commonJS({
  "node_modules/jszip/lib/zipEntries.js"(exports, module) {
    "use strict";
    var readerFor = require_readerFor(), utils = require_utils(), sig = require_signature(), ZipEntry = require_zipEntry(), support = require_support();
    function ZipEntries(loadOptions) {
      this.files = [], this.loadOptions = loadOptions;
    }
    ZipEntries.prototype = {
      /**
       * Check that the reader is on the specified signature.
       * @param {string} expectedSignature the expected signature.
       * @throws {Error} if it is an other signature.
       */
      checkSignature: function(expectedSignature) {
        if (!this.reader.readAndCheckSignature(expectedSignature)) {
          this.reader.index -= 4;
          var signature = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
        }
      },
      /**
       * Check if the given signature is at the given index.
       * @param {number} askedIndex the index to check.
       * @param {string} expectedSignature the signature to expect.
       * @return {boolean} true if the signature is here, false otherwise.
       */
      isSignature: function(askedIndex, expectedSignature) {
        var currentIndex = this.reader.index;
        this.reader.setIndex(askedIndex);
        var signature = this.reader.readString(4), result = signature === expectedSignature;
        return this.reader.setIndex(currentIndex), result;
      },
      /**
       * Read the end of the central directory.
       */
      readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var zipComment = this.reader.readData(this.zipCommentLength), decodeParamType = support.uint8array ? "uint8array" : "array", decodeContent = utils.transformTo(decodeParamType, zipComment);
        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
      },
      /**
       * Read the end of the Zip 64 central directory.
       * Not merged with the method readEndOfCentral :
       * The end of central can coexist with its Zip64 brother,
       * I don't want to read the wrong number of bytes !
       */
      readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var extraDataSize = this.zip64EndOfCentralSize - 44, index = 0, extraFieldId, extraFieldLength, extraFieldValue; index < extraDataSize; )
          extraFieldId = this.reader.readInt(2), extraFieldLength = this.reader.readInt(4), extraFieldValue = this.reader.readData(extraFieldLength), this.zip64ExtensibleData[extraFieldId] = {
            id: extraFieldId,
            length: extraFieldLength,
            value: extraFieldValue
          };
      },
      /**
       * Read the end of the Zip 64 central directory locator.
       */
      readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1)
          throw new Error("Multi-volumes zip are not supported");
      },
      /**
       * Read the local files, based on the offset read in the central part.
       */
      readLocalFiles: function() {
        var i, file;
        for (i = 0; i < this.files.length; i++)
          file = this.files[i], this.reader.setIndex(file.localHeaderOffset), this.checkSignature(sig.LOCAL_FILE_HEADER), file.readLocalPart(this.reader), file.handleUTF8(), file.processAttributes();
      },
      /**
       * Read the central directory.
       */
      readCentralDir: function() {
        var file;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER); )
          file = new ZipEntry({
            zip64: this.zip64
          }, this.loadOptions), file.readCentralPart(this.reader), this.files.push(file);
        if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
          throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      },
      /**
       * Read the end of central directory.
       */
      readEndOfCentral: function() {
        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
        if (offset < 0) {
          var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
          throw isGarbage ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
        }
        this.reader.setIndex(offset);
        var endOfCentralDirOffset = offset;
        if (this.checkSignature(sig.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
          if (this.zip64 = !0, offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR), offset < 0)
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(offset), this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (expectedEndOfCentralDirOffset += 20, expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize);
        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
        if (extraBytes > 0)
          this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER) || (this.reader.zero = extraBytes);
        else if (extraBytes < 0)
          throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
      },
      prepareReader: function(data) {
        this.reader = readerFor(data);
      },
      /**
       * Read a zip file and create ZipEntries.
       * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
       */
      load: function(data) {
        this.prepareReader(data), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      }
    };
    module.exports = ZipEntries;
  }
});

// node_modules/jszip/lib/load.js
var require_load = __commonJS({
  "node_modules/jszip/lib/load.js"(exports, module) {
    "use strict";
    var utils = require_utils(), external = require_external(), utf8 = require_utf8(), ZipEntries = require_zipEntries(), Crc32Probe = require_Crc32Probe(), nodejsUtils = require_nodejsUtils();
    function checkEntryCRC32(zipEntry) {
      return new external.Promise(function(resolve, reject) {
        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
        worker.on("error", function(e) {
          reject(e);
        }).on("end", function() {
          worker.streamInfo.crc32 !== zipEntry.decompressed.crc32 ? reject(new Error("Corrupted zip : CRC32 mismatch")) : resolve();
        }).resume();
      });
    }
    module.exports = function(data, options) {
      var zip = this;
      return options = utils.extend(options || {}, {
        base64: !1,
        checkCRC32: !1,
        optimizedBinaryString: !1,
        createFolders: !1,
        decodeFileName: utf8.utf8decode
      }), nodejsUtils.isNode && nodejsUtils.isStream(data) ? external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : utils.prepareContent("the loaded zip file", data, !0, options.optimizedBinaryString, options.base64).then(function(data2) {
        var zipEntries = new ZipEntries(options);
        return zipEntries.load(data2), zipEntries;
      }).then(function(zipEntries) {
        var promises = [external.Promise.resolve(zipEntries)], files = zipEntries.files;
        if (options.checkCRC32)
          for (var i = 0; i < files.length; i++)
            promises.push(checkEntryCRC32(files[i]));
        return external.Promise.all(promises);
      }).then(function(results) {
        for (var zipEntries = results.shift(), files = zipEntries.files, i = 0; i < files.length; i++) {
          var input = files[i], unsafeName = input.fileNameStr, safeName = utils.resolve(input.fileNameStr);
          zip.file(safeName, input.decompressed, {
            binary: !0,
            optimizedBinaryString: !0,
            date: input.date,
            dir: input.dir,
            comment: input.fileCommentStr.length ? input.fileCommentStr : null,
            unixPermissions: input.unixPermissions,
            dosPermissions: input.dosPermissions,
            createFolders: options.createFolders
          }), input.dir || (zip.file(safeName).unsafeOriginalName = unsafeName);
        }
        return zipEntries.zipComment.length && (zip.comment = zipEntries.zipComment), zip;
      });
    };
  }
});

// node_modules/jszip/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/jszip/lib/index.js"(exports, module) {
    "use strict";
    function JSZip3() {
      if (!(this instanceof JSZip3))
        return new JSZip3();
      if (arguments.length)
        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
      this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
        var newObj = new JSZip3();
        for (var i in this)
          typeof this[i] != "function" && (newObj[i] = this[i]);
        return newObj;
      };
    }
    JSZip3.prototype = require_object();
    JSZip3.prototype.loadAsync = require_load();
    JSZip3.support = require_support();
    JSZip3.defaults = require_defaults();
    JSZip3.version = "3.10.2";
    JSZip3.loadAsync = function(content, options) {
      return new JSZip3().loadAsync(content, options);
    };
    JSZip3.external = require_external();
    module.exports = JSZip3;
  }
});

// src/lib/ibgeFormatos.ts
function ehIbgeAgregados(d) {
  return Array.isArray(d) && d.length > 0 && d.every((v) => v && typeof v == "object" && "variavel" in v && Array.isArray(v.resultados));
}
function valorIbge(v) {
  if (v == null) return null;
  let s = String(v).trim();
  if (s === "-") return 0;
  if (s === "" || s === "..." || s === ".." || /^x$/i.test(s)) return null;
  let n = Number(s);
  return isFinite(n) ? n : null;
}
function achatarIbgeAgregados(d) {
  let linhas = [];
  for (let variavel of d)
    for (let r of variavel.resultados || []) {
      let cats = {};
      for (let c of r.classificacoes || []) {
        let valores = Object.values(c.categoria || {});
        c.nome && (cats[c.nome] = valores.length === 1 ? valores[0] : valores.join(" / "));
      }
      for (let s of r.series || []) {
        let loc = s.localidade || {}, nivel = loc.nivel?.nome || loc.nivel?.id || "", nome = String(loc.nome || "");
        for (let [periodo, valor] of Object.entries(s.serie || {})) {
          let p = String(periodo), linha = {
            cod_ibge: String(loc.id ?? ""),
            localidade: nome,
            .../munic/i.test(nivel) || loc.nivel?.id === "N6" ? { municipio: nome.replace(/\s+-\s+[A-Z]{2}$/, "") } : {},
            nivel,
            variavel: variavel.variavel,
            unidade: variavel.unidade,
            periodo: p,
            .../^\d{4}$/.test(p) ? { ano: Number(p) } : /^\d{6}$/.test(p) ? { ano: Number(p.slice(0, 4)), mes: Number(p.slice(4)) } : {},
            ...cats,
            valor: valorIbge(valor),
            ...valorIbge(valor) === null && valor !== null && valor !== void 0 && String(valor).trim() !== "" ? { valor_simbolo: String(valor).trim() } : {}
          };
          linhas.push(linha);
        }
      }
    }
  return linhas;
}
function achatarObjetos(registros) {
  if (!registros.some((r) => r && Object.values(r).some((v) => ehObjetoSimples(v) || Array.isArray(v)))) return registros;
  let achatar = (obj, prefixo, saida, nivel) => {
    for (let [k, v] of Object.entries(obj)) {
      let chave = prefixo ? `${prefixo}_${k}` : k;
      ehObjetoSimples(v) && nivel < 6 ? achatar(v, chave, saida, nivel + 1) : Array.isArray(v) ? saida[chave] = v.every((x) => !ehObjetoSimples(x)) ? v.join(", ") : JSON.stringify(v) : saida[chave] = v;
    }
    return saida;
  };
  return registros.map((r) => r && typeof r == "object" ? achatar(r, "", {}, 1) : r);
}
function ehIbgePesquisas(d) {
  return Array.isArray(d) && d.length > 0 && d.every((v) => v && typeof v == "object" && "id" in v && Array.isArray(v.res) && v.res.every((r) => r && typeof r == "object" && "localidade" in r && r.res && typeof r.res == "object"));
}
function achatarIbgePesquisas(d) {
  let linhas = [];
  for (let ind of d) {
    let id = String(ind.id);
    for (let r of ind.res || [])
      for (let [periodo, valor] of Object.entries(r.res || {})) {
        let p = String(periodo), v = valorIbge(valor);
        linhas.push({
          indicador_id: id,
          indicador: INDICADORES_CONHECIDOS[id] || `Indicador ${id}`,
          cod_ibge: String(r.localidade ?? ""),
          periodo: p,
          .../^\d{4}$/.test(p) ? { ano: Number(p) } : {},
          valor: v,
          ...v === null && valor !== null && valor !== void 0 && String(valor).trim() !== "" ? { valor_simbolo: String(valor).trim() } : {}
        });
      }
  }
  return linhas;
}
var ehObjetoSimples, INDICADORES_CONHECIDOS, init_ibgeFormatos = __esm({
  "src/lib/ibgeFormatos.ts"() {
    ehObjetoSimples = (v) => v !== null && typeof v == "object" && !Array.isArray(v) && !(v instanceof Date);
    INDICADORES_CONHECIDOS = {
      30255: "IDEB \u2013 Anos iniciais do ensino fundamental (rede p\xFAblica)",
      30256: "IDEB \u2013 Anos finais do ensino fundamental (rede p\xFAblica)"
    };
  }
});

// src/lib/datadashPackage.ts
function ehPacoteDatadash(d) {
  return !!d && typeof d == "object" && !Array.isArray(d) && Array.isArray(d.registros) && Array.isArray(d.colunas) && d.meta && typeof d.meta == "object" && d.colunas.every((c) => c && typeof c.chave == "string");
}
function metaDoPacote(p) {
  let m = p.meta || {}, txt = (v) => typeof v == "string" && v.trim() ? v.trim().slice(0, 500) : void 0;
  return JSON.parse(JSON.stringify({
    fonte: txt(m.fonte),
    credito: txt(m.credito),
    dadosAte: txt(m.dados_ate),
    coletadoEm: txt(m.coletado_em),
    urlOrigem: txt(m.url_origem),
    geradoPor: txt(m.gerado_por)
  }));
}
function aplicarColunasDoPacote(columns, p, opts = {}) {
  let porChave = new Map(p.colunas.map((c) => [c.chave, c]));
  return columns.map((col) => {
    let c = porChave.get(col.key);
    if (!c || opts.somenteNovas && !opts.somenteNovas.has(col.key)) return col;
    let tipo = TIPOS.includes(c.tipo) ? c.tipo : col.type;
    return { ...col, type: tipo, ...opts.rotulos && c.rotulo ? { label: c.rotulo } : {} };
  });
}
function textoNasColunasDeTexto(records, columns) {
  let texto = columns.filter((c) => c.type === "category" || c.type === "string").map((c) => c.key);
  if (!texto.length) return records;
  for (let r of records) for (let k of texto) typeof r[k] == "number" && (r[k] = String(r[k]));
  return records;
}
var TIPOS, init_datadashPackage = __esm({
  "src/lib/datadashPackage.ts"() {
    TIPOS = ["number", "string", "date", "boolean", "category"];
  }
});

// src/lib/dataParser.ts
function parseCSV(csvText) {
  return new Promise((resolve, reject) => {
    import_papaparse.default.parse(csvText, {
      header: !0,
      skipEmptyLines: "greedy",
      dynamicTyping: !0,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
function extractJsonRecords(data, manualPath) {
  if ((!manualPath || !manualPath.trim()) && ehIbgeAgregados(data)) {
    let records = achatarIbgeAgregados(data);
    return { records, detectedPath: "IBGE (agregados)", candidatePaths: [{ path: "IBGE (agregados)", count: records.length }] };
  }
  if ((!manualPath || !manualPath.trim()) && ehIbgePesquisas(data)) {
    let records = achatarIbgePesquisas(data);
    return { records, detectedPath: "IBGE (pesquisas/indicadores)", candidatePaths: [{ path: "IBGE (pesquisas/indicadores)", count: records.length }] };
  }
  let r = extrairRegistrosJson(data, manualPath);
  return { ...r, records: achatarObjetos(r.records) };
}
function extrairRegistrosJson(data, manualPath) {
  if (!data)
    return { records: [], detectedPath: "", candidatePaths: [] };
  if (Array.isArray(data)) {
    let valid = data.filter((item) => typeof item == "object" && item !== null);
    return {
      records: valid,
      detectedPath: "raiz (array)",
      candidatePaths: [{ path: "raiz (array)", count: valid.length }]
    };
  }
  if ((!manualPath || !manualPath.trim()) && ehPacoteDatadash(data))
    return { records: data.registros, detectedPath: "registros", candidatePaths: [{ path: "registros", count: data.registros.length }] };
  if (manualPath && manualPath.trim()) {
    let parts = manualPath.trim().replace(/^\[|\]$/g, "").split(".").map((p) => p.trim()).filter(Boolean), current = data;
    for (let part of parts)
      if (current && typeof current == "object" && part in current)
        current = current[part];
      else {
        current = void 0;
        break;
      }
    if (Array.isArray(current)) {
      let valid = current.filter((item) => typeof item == "object" && item !== null);
      return {
        records: valid,
        detectedPath: manualPath.trim(),
        candidatePaths: [{ path: manualPath.trim(), count: valid.length }]
      };
    }
  }
  let candidateList = [];
  function scan(obj, currentPath, depth) {
    if (!(depth > 4 || !obj || typeof obj != "object")) {
      if (Array.isArray(obj)) {
        let validObjects = obj.filter((item) => typeof item == "object" && item !== null);
        if (validObjects.length > 0) {
          let lastPart = currentPath.split(".").pop()?.toLowerCase() || "", score = validObjects.length;
          lastPart === "records" ? score += 1e3 : ["data", "items", "rows", "results", "elements", "list"].includes(lastPart) ? score += 500 : ["fields", "columns", "schema", "headers", "meta", "links"].includes(lastPart) && (score -= 200), candidateList.push({
            path: currentPath,
            array: validObjects,
            score
          });
        }
        return;
      }
      for (let key of Object.keys(obj)) {
        let nextPath = currentPath ? `${currentPath}.${key}` : key;
        scan(obj[key], nextPath, depth + 1);
      }
    }
  }
  if (scan(data, "", 0), candidateList.sort((a, b) => b.score - a.score), candidateList.length > 0) {
    let best = candidateList[0];
    return {
      records: best.array,
      detectedPath: best.path,
      candidatePaths: candidateList.map((c) => ({ path: c.path, count: c.array.length }))
    };
  }
  if (typeof data == "object" && data !== null)
    return {
      records: [data],
      detectedPath: "objeto \xFAnico",
      candidatePaths: [{ path: "objeto \xFAnico", count: 1 }]
    };
  throw new Error("N\xE3o foi poss\xEDvel identificar uma lista de dados no formato JSON.");
}
function parseJSON(jsonText, manualPath) {
  try {
    let parsed = JSON.parse(jsonText), extracted = extractJsonRecords(parsed, manualPath);
    if (!extracted.records || extracted.records.length === 0)
      throw new Error("A resposta JSON n\xE3o cont\xE9m registros utiliz\xE1veis.");
    return extracted.records;
  } catch (err) {
    throw new Error(`Erro ao interpretar JSON: ${err.message}`);
  }
}
function parseNumericValue(val) {
  if (val == null) return null;
  if (typeof val == "number") return isNaN(val) ? null : val;
  let str = String(val).trim();
  if (!str) return null;
  if (!isNaN(Number(str))) return Number(str);
  let cleaned = str.replace(/[R$\s]/g, "").trim();
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    let n2 = Number(cleaned);
    return isNaN(n2) ? null : n2;
  }
  if (cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "");
    let n2 = Number(cleaned);
    return isNaN(n2) ? null : n2;
  }
  let n = Number(cleaned);
  return isNaN(n) ? null : n;
}
function inferColumnType(values) {
  let nonNulls = values.filter((v) => v != null && v !== "");
  if (nonNulls.length === 0) return "string";
  let numberCount = 0, dateCount = 0, boolCount = 0;
  for (let val of nonNulls.slice(0, 100))
    if (typeof val == "number" && !isNaN(val))
      numberCount++;
    else if (typeof val == "boolean")
      boolCount++;
    else if (typeof val == "string") {
      let trimmed = val.trim();
      parseNumericValue(trimmed) !== null ? numberCount++ : isDateString(trimmed) ? dateCount++ : (trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "false" || trimmed.toLowerCase() === "sim" || trimmed.toLowerCase() === "n\xE3o") && boolCount++;
    }
  let threshold = nonNulls.length * 0.7;
  return numberCount >= threshold ? "number" : dateCount >= threshold ? "date" : boolCount >= threshold ? "boolean" : new Set(nonNulls.map((v) => String(v).trim())).size <= Math.min(25, Math.ceil(nonNulls.length * 0.4)) ? "category" : "string";
}
function isDateString(str) {
  if (str.length < 4 || str.length > 35) return !1;
  if (/^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{4}\/\d{2}\/\d{2}/.test(str)) {
    let timestamp = Date.parse(str);
    return !isNaN(timestamp);
  }
  return !1;
}
function recalculateColumnSchema(col, newType, records, newLabel) {
  let key = col.key, validValuesSet = /* @__PURE__ */ new Set(), validNumbers = [];
  records.forEach((r) => {
    let val = r[key];
    if (val != null && val !== "")
      if (validValuesSet.add(String(val)), newType === "number") {
        let num = parseNumericValue(val);
        num !== null && (validNumbers.push(num), r[key] = num);
      } else (newType === "string" || newType === "category") && (r[key] = String(val));
  });
  let updated = {
    key,
    label: newLabel !== void 0 && newLabel.trim() ? newLabel.trim() : col.label,
    type: newType,
    uniqueCount: validValuesSet.size,
    sampleValues: Array.from(validValuesSet).slice(0, 5)
  };
  if (newType === "number" && validNumbers.length > 0) {
    let sum = validNumbers.reduce((a, b) => a + b, 0);
    updated.min = Math.min(...validNumbers), updated.max = Math.max(...validNumbers), updated.sum = Math.round(sum * 100) / 100, updated.avg = Math.round(sum / validNumbers.length * 100) / 100;
  }
  return updated;
}
function analyzeDataset(name, records, ownerId) {
  if (!records || records.length === 0)
    throw new Error("O conjunto de dados est\xE1 vazio. Carregue um arquivo com pelo menos uma linha.");
  let keySet = /* @__PURE__ */ new Set();
  records.slice(0, 150).forEach((rec) => {
    Object.keys(rec).forEach((k) => {
      k && k.trim() !== "" && keySet.add(k.trim());
    });
  });
  let columns = [];
  for (let key of Array.from(keySet)) {
    let rawValues = records.map((r) => r[key]), type = inferColumnType(rawValues), validNumbers = [], validValuesSet = /* @__PURE__ */ new Set();
    records.forEach((r) => {
      let val = r[key];
      if (val != null && val !== "" && (validValuesSet.add(String(val)), type === "number")) {
        let num = parseNumericValue(val);
        num !== null && (validNumbers.push(num), r[key] = num);
      }
    });
    let colSchema = {
      key,
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type,
      uniqueCount: validValuesSet.size,
      sampleValues: Array.from(validValuesSet).slice(0, 5)
    };
    if (type === "number" && validNumbers.length > 0) {
      let sum = validNumbers.reduce((a, b) => a + b, 0);
      colSchema.min = Math.min(...validNumbers), colSchema.max = Math.max(...validNumbers), colSchema.sum = Math.round(sum * 100) / 100, colSchema.avg = Math.round(sum / validNumbers.length * 100) / 100;
    }
    columns.push(colSchema);
  }
  let temporal = detectDatasetTemporalInfo(records, columns), id = "ds_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7), now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id,
    name,
    description: `Dataset com ${records.length} registros e ${columns.length} colunas estruturadas.${temporal.temporalSummary ? ` Per\xEDodo: ${temporal.temporalSummary}.` : ""}`,
    ownerId,
    rowCount: records.length,
    columnCount: columns.length,
    columns,
    records,
    yearsDetected: temporal.yearsDetected,
    primaryYearColumn: temporal.primaryYearColumn,
    temporalSummary: temporal.temporalSummary,
    selectedColumnKeys: columns.map((c) => c.key),
    createdAt: now,
    updatedAt: now,
    isPublic: !1
  };
}
function detectDatasetTemporalInfo(records, columns) {
  if (!records || records.length === 0 || !columns || columns.length === 0)
    return { yearsDetected: [], yearBreakdown: [] };
  let yearKeyPatterns = [
    /^(ano|exercicio|ano_exercicio|year|ano_ref|ano_exerc|exercicio_fiscal|ano_orcamento)$/i,
    /(ano|exercicio|year)/i,
    /(data|periodo|competencia|vigencia|dt_)/i
  ], bestYearCol;
  for (let pattern of yearKeyPatterns) {
    let match = columns.find((c) => pattern.test(c.key));
    if (match) {
      bestYearCol = match;
      break;
    }
  }
  bestYearCol || (bestYearCol = columns.find(
    (c) => c.type === "number" && c.min && c.min >= 1990 && c.max && c.max <= 2099
  ));
  let yearCounts = /* @__PURE__ */ new Map();
  if (bestYearCol) {
    let key = bestYearCol.key;
    for (let r of records) {
      let val = r[key];
      if (val == null || val === "") continue;
      let extractedYear = null;
      if (typeof val == "number" && val >= 1990 && val <= 2099)
        extractedYear = Math.floor(val);
      else {
        let fourDigitsMatch = String(val).trim().match(/\b(19\d{2}|20\d{2})\b/);
        if (fourDigitsMatch) {
          let parsed = parseInt(fourDigitsMatch[1], 10);
          parsed >= 1990 && parsed <= 2099 && (extractedYear = parsed);
        }
      }
      extractedYear !== null && yearCounts.set(extractedYear, (yearCounts.get(extractedYear) || 0) + 1);
    }
  }
  if (yearCounts.size === 0) {
    let dateCols = columns.filter((c) => c.type === "date" || c.type === "string");
    for (let c of dateCols) {
      for (let r of records.slice(0, 100)) {
        let val = r[c.key];
        if (!val) continue;
        let match = String(val).match(/\b(19\d{2}|20\d{2})\b/);
        if (match) {
          let y = parseInt(match[1], 10);
          y >= 1990 && y <= 2099 && (yearCounts.set(y, (yearCounts.get(y) || 0) + 1), bestYearCol || (bestYearCol = c));
        }
      }
      if (yearCounts.size > 0) break;
    }
  }
  let sortedYears = Array.from(yearCounts.keys()).sort((a, b) => a - b), yearBreakdown = sortedYears.map((y) => ({ year: y, count: yearCounts.get(y) || 0 })), temporalSummary;
  if (sortedYears.length === 1)
    temporalSummary = `Ano ${sortedYears[0]}`;
  else if (sortedYears.length > 1) {
    let min = sortedYears[0], max = sortedYears[sortedYears.length - 1];
    max - min === sortedYears.length - 1 ? temporalSummary = `${min} a ${max} (${sortedYears.length} anos)` : temporalSummary = `${sortedYears.join(", ")} (${sortedYears.length} anos)`;
  }
  return {
    yearsDetected: sortedYears,
    primaryYearColumn: bestYearCol?.key,
    temporalSummary,
    yearBreakdown
  };
}
function reconcileSyncedRecords(ds, incomingRecords) {
  let fresh = analyzeDataset(ds.name, incomingRecords, ds.ownerId), previousByKey = new Map(ds.columns.map((c) => [c.key, c])), allowedKeys = Array.isArray(ds.selectedColumnKeys) && ds.selectedColumnKeys.length > 0 ? new Set(ds.selectedColumnKeys) : null, columns = fresh.columns.filter((col) => !allowedKeys || allowedKeys.has(col.key)).map((col) => {
    let prev = previousByKey.get(col.key);
    return prev && (prev.type !== col.type || prev.label !== col.label) ? recalculateColumnSchema(col, prev.type, incomingRecords, prev.label) : col;
  }), keys = columns.map((c) => c.key);
  return { records: allowedKeys ? incomingRecords.map((row) => {
    let out = {};
    return keys.forEach((k) => {
      out[k] = row[k];
    }), out;
  }) : incomingRecords, columns, columnCount: columns.length };
}
var import_papaparse, init_dataParser = __esm({
  "src/lib/dataParser.ts"() {
    init_ibgeFormatos();
    init_datadashPackage();
    import_papaparse = __toESM(require_papaparse(), 1);
  }
});

// src/lib/syncCore.ts
async function recordsFromPayload(p, ds) {
  if (p.isZip && p.arrayBuffer) {
    let zip = await import_jszip2.default.loadAsync(p.arrayBuffer), entries = Object.entries(zip.files).filter(
      ([name, obj]) => !obj.dir && /\.(csv|tsv|json)$/i.test(name) && !name.startsWith("__MACOSX/")
    );
    if (entries.length === 0) throw new Error("Nenhum arquivo CSV/JSON compat\xEDvel encontrado no ZIP.");
    let target = entries[0];
    if (ds.zipInternalFile && ds.zipInternalFile.trim()) {
      let f = ds.zipInternalFile.trim().toLowerCase();
      target = entries.find(([name]) => name.toLowerCase().includes(f)) || target;
    }
    let [filename, fileObj] = target, text = await fileObj.async("string");
    return /\.(csv|tsv)$/i.test(filename) ? await parseCSV(text) : parseJSON(text, ds.jsonPath);
  }
  return p.isCsv ? await parseCSV(p.rawText) : p.data ? extractJsonRecords(p.data, ds.jsonPath).records : p.rawText ? parseJSON(p.rawText, ds.jsonPath) : [];
}
function pacoteDoPayload(p) {
  let d = p.data;
  if (d === void 0 && !p.isCsv && !p.isZip && p.rawText && p.rawText.trimStart().startsWith("{"))
    try {
      d = JSON.parse(p.rawText);
    } catch {
      d = void 0;
    }
  return ehPacoteDatadash(d) ? d : null;
}
function buildNextVersion(ds, incoming, pacote) {
  let finalRecords = incoming;
  if (ds.syncMode === "append") {
    let existing = new Set((ds.records || []).map((r) => JSON.stringify(r)));
    finalRecords = [...ds.records || [], ...incoming.filter((r) => !existing.has(JSON.stringify(r)))];
  }
  let reconciled = reconcileSyncedRecords(ds, finalRecords);
  if (!pacote) return { records: reconciled.records, columns: reconciled.columns, columnCount: reconciled.columnCount };
  let existentes = new Set((ds.columns || []).map((c) => c.key)), novas = new Set(reconciled.columns.map((c) => c.key).filter((k) => !existentes.has(k))), columns = aplicarColunasDoPacote(reconciled.columns, pacote, { rotulos: !0, somenteNovas: novas });
  return { records: textoNasColunasDeTexto(reconciled.records, columns), columns, columnCount: reconciled.columnCount, sourceMeta: metaDoPacote(pacote) };
}
function dataSignature(records) {
  return `${records.length}_${JSON.stringify(records.slice(0, 2))}_${JSON.stringify(records.slice(-2))}`;
}
function isAlreadyKnown(ds, next) {
  let sig = dataSignature(next);
  return sig === dataSignature(ds.records || []) || !!ds.pendingUpdate?.signature && ds.pendingUpdate.signature === sig;
}
var import_jszip2, init_syncCore = __esm({
  "src/lib/syncCore.ts"() {
    import_jszip2 = __toESM(require_lib3(), 1);
    init_dataParser();
    init_datadashPackage();
  }
});

// src/lib/syncSchedule.ts
function resolveDynamicUrl(urlPattern, date = /* @__PURE__ */ new Date()) {
  if (!urlPattern) return "";
  let year = date.getFullYear(), yearStr = String(year), shortYear = yearStr.slice(-2), prevYearStr = String(year - 1), nextYearStr = String(year + 1), monthNum = date.getMonth() + 1, monthStr = String(monthNum).padStart(2, "0"), shortMonthStr = String(monthNum), prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1), prevMonthNum = prevDate.getMonth() + 1, prevMonthStr = String(prevMonthNum).padStart(2, "0"), prevMonthYearStr = String(prevDate.getFullYear()), nextMonthNum = new Date(date.getFullYear(), date.getMonth() + 1, 1).getMonth() + 1, nextMonthStr = String(nextMonthNum).padStart(2, "0"), dayNum = date.getDate(), dayStr = String(dayNum).padStart(2, "0"), shortDayStr = String(dayNum), yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  let yDay = String(yesterday.getDate()).padStart(2, "0"), yMonth = String(yesterday.getMonth() + 1).padStart(2, "0"), yYear = String(yesterday.getFullYear()), todayIso = `${yearStr}-${monthStr}-${dayStr}`, yesterdayIso = `${yYear}-${yMonth}-${yDay}`, yearStart = `${yearStr}-01-01`, monthStart = `${yearStr}-${monthStr}-01`, yearMonth = `${yearStr}-${monthStr}`, yearMonthUnder = `${yearStr}_${monthStr}`, prevYearMonth = `${prevMonthYearStr}-${prevMonthStr}`, prevYearMonthUnder = `${prevMonthYearStr}_${prevMonthStr}`, timestamp = String(date.getTime()), timestampSec = String(Math.floor(date.getTime() / 1e3));
  return urlPattern.replace(/\{\{YYYY\}\}/gi, yearStr).replace(/\{\{YY\}\}/gi, shortYear).replace(/\{\{PREV_YYYY\}\}/gi, prevYearStr).replace(/\{\{PREV_YEAR\}\}/gi, prevYearStr).replace(/\{\{NEXT_YYYY\}\}/gi, nextYearStr).replace(/\{\{NEXT_YEAR\}\}/gi, nextYearStr).replace(/\{\{MM\}\}/gi, monthStr).replace(/\{\{M\}\}/gi, shortMonthStr).replace(/\{\{PREV_MM\}\}/gi, prevMonthStr).replace(/\{\{PREV_MONTH\}\}/gi, prevMonthStr).replace(/\{\{NEXT_MM\}\}/gi, nextMonthStr).replace(/\{\{NEXT_MONTH\}\}/gi, nextMonthStr).replace(/\{\{DD\}\}/gi, dayStr).replace(/\{\{D\}\}/gi, shortDayStr).replace(/\{\{TODAY\}\}/gi, todayIso).replace(/\{\{YESTERDAY\}\}/gi, yesterdayIso).replace(/\{\{YEAR_START\}\}/gi, yearStart).replace(/\{\{MONTH_START\}\}/gi, monthStart).replace(/\{\{YYYY[-_]MM\}\}/gi, yearMonth).replace(/\{\{YYYY_MM\}\}/gi, yearMonthUnder).replace(/\{\{PREV_YYYY[-_]MM\}\}/gi, prevYearMonth).replace(/\{\{PREV_YYYY_MM\}\}/gi, prevYearMonthUnder).replace(/\{\{TIMESTAMP_S\}\}/gi, timestampSec).replace(/\{\{TIMESTAMP\}\}/gi, timestamp);
}
function isDatasetDueForSync(ds, now = /* @__PURE__ */ new Date(), lastPolledAt) {
  if (!ds.sourceUrl && !ds.dynamicUrlPattern || !ds.autoSyncInterval || ds.autoSyncInterval === "none") return !1;
  let lastTime = lastPolledAt ? new Date(lastPolledAt).getTime() : ds.lastSyncedAt ? new Date(ds.lastSyncedAt).getTime() : 0, nowTime = now.getTime();
  switch (ds.autoSyncInterval) {
    case "fixed_date": {
      if (!ds.syncFixedDate) return !1;
      let targetTime = new Date(ds.syncFixedDate).getTime();
      return isNaN(targetTime) ? !1 : nowTime >= targetTime && lastTime < targetTime;
    }
    case "monthly": {
      let targetDay = ds.syncMonthlyDay || 1, [hStr, mStr] = (ds.syncHourTime || "06:00").split(":"), targetHour = parseInt(hStr || "6", 10), targetMin = parseInt(mStr || "0", 10), scheduledThisMonth = new Date(now.getFullYear(), now.getMonth(), targetDay, targetHour, targetMin, 0);
      return nowTime >= scheduledThisMonth.getTime() ? lastTime < scheduledThisMonth.getTime() : !1;
    }
    case "yearly": {
      let targetMonthIndex = (ds.syncYearlyMonth || 1) - 1, targetDay = ds.syncYearlyDay || 1, [hStr, mStr] = (ds.syncHourTime || "06:00").split(":"), targetHour = parseInt(hStr || "6", 10), targetMin = parseInt(mStr || "0", 10), scheduledThisYear = new Date(now.getFullYear(), targetMonthIndex, targetDay, targetHour, targetMin, 0);
      return nowTime >= scheduledThisYear.getTime() ? lastTime < scheduledThisYear.getTime() : !1;
    }
    case "weekly": {
      let targetWeekDay = ds.syncWeeklyDay ?? 1, [hStr, mStr] = (ds.syncHourTime || "06:00").split(":"), targetHour = parseInt(hStr || "6", 10), targetMin = parseInt(mStr || "0", 10), diffDays = (now.getDay() - targetWeekDay + 7) % 7, scheduledThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffDays, targetHour, targetMin, 0);
      return nowTime >= scheduledThisWeek.getTime() ? lastTime < scheduledThisWeek.getTime() : !1;
    }
    case "10s":
      return nowTime - lastTime >= 1e4;
    case "30s":
      return nowTime - lastTime >= 3e4;
    case "1m":
      return nowTime - lastTime >= 6e4;
    case "5m":
      return nowTime - lastTime >= 3e5;
    case "1h":
      return nowTime - lastTime >= 36e5;
    case "6h":
      return nowTime - lastTime >= 216e5;
    case "24h":
      return nowTime - lastTime >= 864e5;
    default:
      return !1;
  }
}
var init_syncSchedule = __esm({
  "src/lib/syncSchedule.ts"() {
  }
});

// src/lib/dashboardFilters.ts
function dashboardFilterKit() {
  let MONTHS2 = ["janeiro", "fevereiro", "mar\xE7o", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"], YEAR_KEY = "__ano";
  function extractYear3(v) {
    if (typeof v == "number" && isFinite(v)) return v >= 1900 && v <= 2100 ? Math.trunc(v) : null;
    if (v == null) return null;
    let m = String(v).match(/\b(19\d{2}|20\d{2}|2100)\b/);
    return m ? parseInt(m[1], 10) : null;
  }
  function parseMonth2(v) {
    if (v == null || v === "") return null;
    if (typeof v == "number") return v >= 1 && v <= 12 ? Math.trunc(v) : null;
    let s = String(v).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (/^\d{1,2}$/.test(s)) {
      let n = parseInt(s, 10);
      return n >= 1 && n <= 12 ? n : null;
    }
    let iso = s.match(/^\d{4}-(\d{2})/);
    if (iso) return parseInt(iso[1], 10);
    for (let i = 0; i < MONTHS2.length; i++) {
      let name = MONTHS2[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (s === name || s.startsWith(name.slice(0, 3))) return i + 1;
    }
    return null;
  }
  function parseDate(v) {
    if (v == null || v === "") return null;
    let s = String(v).trim(), m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    return m ? new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10)) : (m = s.match(/^(\d{4})-(\d{2})-(\d{2})/), m ? new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10)) : null);
  }
  function valueKey(v) {
    return v != null && String(v).trim() !== "" ? String(v) : "(Vazio)";
  }
  function hasColumn(records, col) {
    if (!col || !records || records.length === 0) return !1;
    for (let i = 0; i < Math.min(records.length, 50); i++)
      if (records[i] && Object.prototype.hasOwnProperty.call(records[i], col)) return !0;
    return !1;
  }
  function computeFilterModel(records, config, labels) {
    let model = { years: [], fieldOptions: [] }, recs = Array.isArray(records) ? records : [], yc = config && config.year && config.year.enabled ? config.year.column : void 0;
    if (yc) {
      let set = {};
      for (let r of recs) {
        let y = extractYear3(r[yc]);
        y !== null && (set[y] = !0);
      }
      model.years = Object.keys(set).map(Number).sort((a, b) => b - a), model.yearColumn = yc, model.latestYear = model.years[0];
    }
    for (let f of config && config.fields || []) {
      if (!f || !f.column) continue;
      let set = {};
      for (let r of recs) set[valueKey(r[f.column])] = !0;
      let values = Object.keys(set).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: !0, sensitivity: "base" }));
      model.fieldOptions.push({ column: f.column, label: f.label || labels && labels[f.column] || f.column, values });
    }
    let lu = config && config.lastUpdate;
    if (lu && lu.show) {
      if (lu.dateColumn) {
        let best = null;
        for (let r of recs) {
          let d = parseDate(r[lu.dateColumn]);
          d && (!best || d > best) && (best = d);
        }
        if (best) {
          let dd = String(best.getDate()).padStart(2, "0"), mm = String(best.getMonth() + 1).padStart(2, "0");
          model.lastData = { label: dd + "/" + mm + "/" + best.getFullYear(), year: best.getFullYear(), month: best.getMonth() + 1, date: best.toISOString().slice(0, 10) };
        }
      } else if (model.latestYear !== void 0 && yc) {
        let month = null;
        if (lu.monthColumn)
          for (let r of recs) {
            if (extractYear3(r[yc]) !== model.latestYear) continue;
            let m = parseMonth2(r[lu.monthColumn]);
            m !== null && (month === null || m > month) && (month = m);
          }
        model.lastData = month !== null ? { label: MONTHS2[month - 1] + " de " + model.latestYear, year: model.latestYear, month } : { label: String(model.latestYear), year: model.latestYear };
      }
    }
    return model;
  }
  function initialState(model, config) {
    let year;
    if (model.yearColumn && model.years.length > 0) {
      let def = config && config.year ? config.year.defaultYear : void 0;
      year = typeof def == "number" && model.years.indexOf(def) >= 0 ? def : model.latestYear;
    }
    return { year, fields: {} };
  }
  function applyFieldFilters(records, state) {
    if (!state || !state.fields) return records;
    let out = records;
    for (let col of Object.keys(state.fields)) {
      let sel = state.fields[col];
      if (!sel || sel.length === 0 || !hasColumn(out, col)) continue;
      let allowed = {};
      sel.forEach((v) => {
        allowed[v] = !0;
      }), out = out.filter((r) => allowed[valueKey(r[col])]);
    }
    return out;
  }
  function withYearKey(records, yc) {
    return records.map((r) => {
      let y = extractYear3(r[yc]), copy = {};
      for (let k in r) copy[k] = r[k];
      return copy[YEAR_KEY] = y === null ? null : String(y), copy;
    });
  }
  function resolveChart(records, chart, ctx) {
    let base = applyFieldFilters(Array.isArray(records) ? records : [], ctx && ctx.state), model = ctx && ctx.model, yc = model && model.yearColumn, mode = chart && chart.yearMode || "follow";
    if (!yc || !hasColumn(base, yc) || mode === "ignore") return { records: base };
    let selected = ctx && ctx.state ? ctx.state.year : void 0;
    if (mode === "follow")
      return selected === void 0 || selected === "all" ? { records: base } : { records: base.filter((r) => extractYear3(r[yc]) === selected), currentYear: selected };
    let current = typeof selected == "number" ? selected : model && model.latestYear;
    if (current === void 0) return { records: base };
    let previous = current - 1, currentRecords = base.filter((r) => extractYear3(r[yc]) === current), previousRecords = base.filter((r) => extractYear3(r[yc]) === previous), lu = ctx && ctx.config && ctx.config.lastUpdate, mc = lu && lu.monthColumn, dc = lu && lu.dateColumn, samePeriodMonth, periodLabel;
    if ((mc || dc) && !(chart && chart.xAxisKey && (chart.xAxisKey === mc || chart.xAxisKey === dc))) {
      let monthOf = (r) => {
        if (mc) return parseMonth2(r[mc]);
        let d = parseDate(r[dc]);
        return d ? d.getMonth() + 1 : null;
      }, maxMonth = 0;
      for (let r of currentRecords) {
        let m = monthOf(r);
        m !== null && m > maxMonth && (maxMonth = m);
      }
      maxMonth > 0 && maxMonth < 12 && previousRecords.some((r) => {
        let m = monthOf(r);
        return m !== null && m > maxMonth;
      }) && (previousRecords = previousRecords.filter((r) => {
        let m = monthOf(r);
        return m !== null && m <= maxMonth;
      }), samePeriodMonth = maxMonth, periodLabel = maxMonth === 1 ? "jan" : "jan\u2013" + MONTHS2[maxMonth - 1].slice(0, 3));
    }
    return { records: withYearKey(currentRecords.concat(previousRecords), yc), colKeyOverride: YEAR_KEY, currentYear: current, previousYear: previous, currentRecords, previousRecords, samePeriodMonth, periodLabel };
  }
  function fillText(text, resolved, ctx) {
    if (!text || text.indexOf("{") < 0) return text;
    let model = ctx && ctx.model, st = ctx && ctx.state, year = resolved && resolved.currentYear !== void 0 ? resolved.currentYear : st && typeof st.year == "number" ? st.year : model && model.latestYear, prev = resolved && resolved.previousYear !== void 0 ? resolved.previousYear : typeof year == "number" ? year - 1 : void 0;
    return text.replace(/\{ano\}/g, year !== void 0 ? String(year) : st && st.year === "all" ? "todos os anos" : "").replace(/\{ano_anterior\}/g, prev !== void 0 ? String(prev) : "").replace(/\{ultimo_dado\}/g, model && model.lastData ? model.lastData.label : "").replace(/\{periodo\}/g, resolved && resolved.periodLabel ? resolved.periodLabel : "ano completo");
  }
  return { extractYear: extractYear3, parseMonth: parseMonth2, computeFilterModel, initialState, applyFieldFilters, resolveChart, fillText, YEAR_KEY };
}
var filterKit, init_dashboardFilters = __esm({
  "src/lib/dashboardFilters.ts"() {
    filterKit = dashboardFilterKit();
  }
});

// src/lib/editionRevision.ts
function extractYear(v) {
  if (typeof v == "number" && v >= 1900 && v <= 2100) return Math.trunc(v);
  let m = v == null ? null : String(v).match(/\b(19\d{2}|20\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}
function parseMonth(v) {
  if (v == null || v === "") return null;
  if (typeof v == "number") return v >= 1 && v <= 12 ? Math.trunc(v) : null;
  let s = strip(String(v));
  if (/^\d{1,2}$/.test(s)) {
    let n = parseInt(s, 10);
    return n >= 1 && n <= 12 ? n : null;
  }
  let iso = s.match(/^\d{4}-(\d{2})/);
  if (iso) return parseInt(iso[1], 10);
  let i = MONTHS.findIndex((m) => s === strip(m) || s.startsWith(strip(m).slice(0, 3)));
  return i >= 0 ? i + 1 : null;
}
function toNumber(v) {
  if (typeof v == "number") return isFinite(v) ? v : null;
  if (v == null || v === "") return null;
  let s = String(v).trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
  (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^-?\d+,\d+$/.test(s)) && (s = s.replace(/\./g, "").replace(",", "."));
  let n = Number(s);
  return isFinite(n) ? n : null;
}
function withinCutoff(records, c) {
  return c ? records.filter((r) => {
    let y = extractYear(r[c.yearColumn]);
    if (y === null) return !1;
    if (y < c.maxYear) return !0;
    if (y > c.maxYear) return !1;
    if (!c.monthColumn || c.maxMonth === void 0) return !0;
    let m = parseMonth(r[c.monthColumn]);
    return m !== null && m <= c.maxMonth;
  }) : records;
}
function pickCategoryColumn(columns, exclude) {
  let ex = new Set(exclude.filter(Boolean)), cands = columns.filter((c) => !ex.has(c.key) && (c.type === "category" || c.type === "string") && (c.uniqueCount === void 0 || c.uniqueCount >= 2 && c.uniqueCount <= 300));
  return cands.sort((a, b) => (a.uniqueCount ?? 999) - (b.uniqueCount ?? 999)).find((c) => (c.uniqueCount ?? 0) >= 2)?.key || cands[0]?.key;
}
function diffEditionData(before, after, columns, opts = {}) {
  let numeric = columns.filter((c) => c.type === "number" && c.key !== opts.yearColumn && c.key !== opts.monthColumn).map((c) => c.key), cat = opts.categoryColumn ?? pickCategoryColumn(columns, [opts.yearColumn, opts.monthColumn]), tol = opts.tolerance ?? 5e-3, agg = (recs) => {
    let m = /* @__PURE__ */ new Map();
    for (let r of recs) {
      let y = opts.yearColumn ? extractYear(r[opts.yearColumn]) : null, c = cat ? String(r[cat] ?? "(Vazio)") : "";
      for (let col of numeric) {
        let k = `${y}${c}${col}`;
        m.set(k, (m.get(k) || 0) + (toNumber(r[col]) ?? 0));
      }
    }
    return m;
  }, a = agg(before), b = agg(after), keys = /* @__PURE__ */ new Set([...a.keys(), ...b.keys()]), changes = [];
  for (let k of keys) {
    let x = a.get(k) ?? 0, y = b.get(k) ?? 0, diff = Math.abs(y - x);
    if (diff === 0 || x !== 0 && diff / Math.abs(x) < tol) continue;
    let [yy, c, col] = k.split("");
    changes.push({ year: yy === "null" ? null : Number(yy), category: cat ? c : void 0, column: col, before: x, after: y });
  }
  return changes.sort((p, q) => Math.abs(q.after - q.before) - Math.abs(p.after - p.before)), { changes, rowsBefore: before.length, rowsAfter: after.length, categoryColumn: cat };
}
function describeChange(ch, labels = {}) {
  let f = (n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 }), where = [ch.year ?? "", ch.category ?? ""].filter((x) => x !== "").join(", ");
  return `${labels[ch.column] || ch.column}${where ? ` (${where})` : ""}: ${f(ch.before)} \u2192 ${f(ch.after)}`;
}
function latestEdition(editions = [], id) {
  let ed = editions.find((e) => e.id === id), seen = /* @__PURE__ */ new Set();
  for (; ed && ed.supersededBy && !seen.has(ed.id); ) {
    seen.add(ed.id);
    let next = editions.find((e) => e.id === ed.supersededBy);
    if (!next) break;
    ed = next;
  }
  return ed;
}
function detectEditionImpact(ds, nextRecords, now = /* @__PURE__ */ new Date()) {
  let labels = {};
  ds.columns.forEach((c) => {
    labels[c.key] = c.label || c.key;
  });
  let items = [];
  for (let ed of (ds.editions || []).filter((e) => !e.supersededBy)) {
    let recs = ds.editionData?.[ed.id];
    if (!recs || !ed.cutoff) continue;
    let diff = diffEditionData(recs, withinCutoff(nextRecords, ed.cutoff), ed.columns?.length ? ed.columns : ds.columns, {
      yearColumn: ed.cutoff.yearColumn,
      monthColumn: ed.cutoff.monthColumn
    });
    diff.changes.length && items.push({ editionId: ed.id, label: ed.label, count: diff.changes.length, sample: diff.changes.slice(0, 5).map((c) => describeChange(c, labels)) });
  }
  return items.length ? { detectedAt: now.toISOString(), items } : void 0;
}
function editionNoteText(ed) {
  let d = (iso) => new Date(iso).toLocaleDateString("pt-BR");
  return ed.revisionOf ? `${ed.label} \xB7 revisada em ${d(ed.frozenAt)}${ed.revisionReason ? `: ${ed.revisionReason}` : ""}` : `${ed.label} \xB7 congelada em ${d(ed.frozenAt)}`;
}
var MONTHS, strip, init_editionRevision = __esm({
  "src/lib/editionRevision.ts"() {
    MONTHS = ["janeiro", "fevereiro", "mar\xE7o", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"], strip = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
});

// src/lib/datasetVersions.ts
function splitIntoChunks(records) {
  let chunks = [], current = [], currentBytes = 0, totalBytes = 0, storedCount = 0;
  for (let rec of records) {
    let size = encoder.encode(JSON.stringify(rec)).length + 16;
    if (totalBytes + size > MAX_TOTAL_BYTES) break;
    currentBytes + size > CHUNK_TARGET_BYTES && current.length > 0 && (chunks.push(current), current = [], currentBytes = 0), current.push(rec), currentBytes += size, totalBytes += size, storedCount++;
  }
  return current.length > 0 && chunks.push(current), { chunks, storedCount };
}
function newVersionId() {
  return "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function versionsInUse(ds) {
  let keep = /* @__PURE__ */ new Set();
  return ds.chunkVersion && keep.add(ds.chunkVersion), ds.pendingUpdate?.chunkVersion && keep.add(ds.pendingUpdate.chunkVersion), (ds.editions || []).forEach((e) => e.chunkVersion && keep.add(e.chunkVersion)), keep;
}
function appendLog(log, entry) {
  return [JSON.parse(JSON.stringify(entry)), ...log || []].slice(0, MAX_LOG_ENTRIES);
}
function toNumber2(v) {
  if (typeof v == "number") return isFinite(v) ? v : null;
  if (v == null || v === "") return null;
  let s = String(v).trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
  (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^-?\d+,\d+$/.test(s)) && (s = s.replace(/\./g, "").replace(",", "."));
  let n = Number(s);
  return isFinite(n) ? n : null;
}
function extractYear2(v) {
  if (typeof v == "number" && v >= 1900 && v <= 2100) return Math.trunc(v);
  let m = v == null ? null : String(v).match(/\b(19\d{2}|20\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}
function validateDatasetUpdate(prev, next, opts = {}) {
  let checks = [], nRows = next.records.length;
  if (nRows === 0)
    return [{ level: "blocking", code: "empty", message: "A atualiza\xE7\xE3o veio vazia (0 linhas)." }];
  if (!prev || prev.records.length === 0)
    return [{ level: "info", code: "first_load", message: `Primeira carga: ${fmtInt(nRows)} linhas.` }];
  let pRows = prev.records.length, drop = (pRows - nRows) / pRows, warnAt = opts.rowDropWarning ?? 0.05, blockAt = opts.rowDropBlocking ?? 0.2;
  drop >= blockAt ? checks.push({ level: "blocking", code: "rows_drop", message: `N\xFAmero de linhas caiu ${(drop * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% (${fmtInt(pRows)} \u2192 ${fmtInt(nRows)}).` }) : drop >= warnAt ? checks.push({ level: "warning", code: "rows_drop", message: `N\xFAmero de linhas caiu ${(drop * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% (${fmtInt(pRows)} \u2192 ${fmtInt(nRows)}).` }) : nRows !== pRows && checks.push({ level: "info", code: "rows_change", message: `Linhas: ${fmtInt(pRows)} \u2192 ${fmtInt(nRows)}.` });
  let prevCols = new Map(prev.columns.map((c) => [c.key, c])), nextCols = new Map(next.columns.map((c) => [c.key, c])), removed = prev.columns.filter((c) => !nextCols.has(c.key)).map((c) => c.label || c.key), added = next.columns.filter((c) => !prevCols.has(c.key)).map((c) => c.label || c.key);
  removed.length && checks.push({ level: "blocking", code: "columns_removed", message: `Colunas sumiram: ${removed.join(", ")}. Gr\xE1ficos que as usam deixariam de funcionar.` }), added.length && checks.push({ level: "info", code: "columns_added", message: `Colunas novas: ${added.join(", ")}.` });
  let retyped = next.columns.filter((c) => prevCols.has(c.key) && prevCols.get(c.key).type !== c.type).map((c) => `${c.label || c.key} (${prevCols.get(c.key).type} \u2192 ${c.type})`);
  retyped.length && checks.push({ level: "warning", code: "columns_retyped", message: `Colunas mudaram de tipo: ${retyped.join(", ")}.` });
  let yc = opts.yearColumn;
  if (yc && prevCols.has(yc)) {
    let yearsOf = (recs) => {
      let m = /* @__PURE__ */ new Map();
      for (let r of recs) {
        let y = extractYear2(r[yc]);
        y !== null && (m.has(y) || m.set(y, []), m.get(y).push(r));
      }
      return m;
    }, py = yearsOf(prev.records), ny = yearsOf(next.records), missing = [...py.keys()].filter((y) => !ny.has(y)).sort();
    missing.length && checks.push({ level: "blocking", code: "years_missing", message: `Anos que existiam e sumiram: ${missing.join(", ")}.` });
    let newYears = [...ny.keys()].filter((y) => !py.has(y)).sort();
    newYears.length && checks.push({ level: "info", code: "years_added", message: `Anos novos: ${newYears.join(", ")}.` });
    let latestPrev = Math.max(...py.keys()), numericCols = next.columns.filter((c) => c.type === "number" && prevCols.get(c.key)?.type === "number" && c.key !== yc), threshold = opts.historyChangeWarning ?? 0.02, revisions = [];
    for (let [year, prevRecs] of py)
      if (!(year >= latestPrev || !ny.has(year)))
        for (let col of numericCols) {
          let sum = (recs) => recs.reduce((a2, r) => a2 + (toNumber2(r[col.key]) ?? 0), 0), a = sum(prevRecs), b = sum(ny.get(year));
          a !== 0 && Math.abs((b - a) / a) >= threshold && revisions.push(`${col.label || col.key} em ${year} (${fmtPct((b - a) / Math.abs(a) * 100)})`);
        }
    revisions.length && checks.push({
      level: "warning",
      code: "history_revised",
      message: `Totais de anos j\xE1 fechados foram revistos pela fonte: ${revisions.slice(0, 6).join("; ")}${revisions.length > 6 ? "\u2026" : ""}.`
    });
  }
  return checks;
}
function needsReview(checks, level = "strict") {
  return level === "none" ? !1 : level === "standard" ? checks.some((c) => c.level === "blocking") : checks.some((c) => c.level === "blocking" || c.level === "warning");
}
function publishSummary(checks, level = "strict") {
  let alerts = checks.filter((c) => c.level !== "info");
  return alerts.length ? `Publicado com alertas (${level === "none" ? "sem reten\xE7\xE3o" : "checagem padr\xE3o"}): ${alerts.map((c) => c.message).join(" ")}` : summarizeChecks(checks);
}
function summarizeChecks(checks) {
  let relevant = checks.filter((c) => c.level !== "info");
  return relevant.length ? relevant.map((c) => c.message).join(" ") : checks.length ? checks.map((c) => c.message).join(" ") : "Sem altera\xE7\xF5es relevantes.";
}
var CHUNK_TARGET_BYTES, MAX_TOTAL_BYTES, MAX_LOG_ENTRIES, encoder, fmtPct, fmtInt, init_datasetVersions = __esm({
  "src/lib/datasetVersions.ts"() {
    CHUNK_TARGET_BYTES = 6e5, MAX_TOTAL_BYTES = 40 * 1024 * 1024, MAX_LOG_ENTRIES = 50, encoder = new TextEncoder();
    fmtPct = (n) => (n > 0 ? "+" : "") + n.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%", fmtInt = (n) => n.toLocaleString("pt-BR");
  }
});

// serverSync.ts
var serverSync_exports = {};
__export(serverSync_exports, {
  createAdminContext: () => createAdminContext,
  isSchedulable: () => isSchedulable,
  runScheduledSync: () => runScheduledSync,
  runScheduledSyncWithAdmin: () => runScheduledSyncWithAdmin,
  syncOneDataset: () => syncOneDataset
});
function toPayload(body, finalUrl) {
  if (/\.zip(\?|$)/i.test(finalUrl) || body.length > 4 && body[0] === 80 && body[1] === 75)
    return { isZip: !0, arrayBuffer: body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength), isCsv: !1, rawText: "" };
  let rawText = body.toString("utf-8");
  try {
    return { isZip: !1, isCsv: !1, rawText, data: JSON.parse(rawText) };
  } catch {
    return { isZip: !1, isCsv: !0, rawText };
  }
}
async function syncOneDataset(ds, store, fetcher, now) {
  let nowIso = now.toISOString(), base = { datasetId: ds.id, name: ds.name };
  try {
    let url = resolveDynamicUrl((ds.sourceUrl || ds.dynamicUrlPattern || "").trim(), now), resp = await fetcher(url);
    if (resp.status >= 400) throw new Error(`a fonte respondeu HTTP ${resp.status}`);
    let payload = toPayload(resp.body, resp.finalUrl), incoming = await recordsFromPayload(payload, ds);
    if (!incoming.length) throw new Error("a fonte n\xE3o retornou registros");
    let published = await store.loadRecords(ds), current = { ...ds, records: published }, next = buildNextVersion(current, incoming, pacoteDoPayload(payload));
    if (isAlreadyKnown(current, next.records))
      return await store.updateDataset(ds.id, { lastSyncedAt: nowIso, lastSyncStatus: "success", lastSyncMessage: "Sem novidades na fonte", updatedAt: nowIso }), { ...base, result: "unchanged", message: "Sem novidades na fonte.", rowCount: next.records.length };
    let checks = validateDatasetUpdate({ records: published, columns: ds.columns }, next, { yearColumn: ds.primaryYearColumn }), version = newVersionId(), { chunks, storedCount } = splitIntoChunks(next.records);
    await store.writeChunks(ds.id, version, chunks);
    let truncated = storedCount < next.records.length ? { isPartial: !0, partialNote: `Base incompleta: s\xF3 ${storedCount.toLocaleString("pt-BR")} de ${next.records.length.toLocaleString("pt-BR")} linhas cabem no limite de armazenamento (40 MB).` } : {};
    if (needsReview(checks, ds.reviewLevel)) {
      let pending = clean({
        chunkVersion: version,
        chunkCount: chunks.length,
        storedRecordCount: storedCount,
        rowCount: next.records.length,
        columns: next.columns,
        checks,
        fetchedAt: nowIso,
        source: "scheduled",
        signature: dataSignature(next.records),
        sourceMeta: next.sourceMeta,
        ...truncated
      }), updateLog2 = appendLog(ds.updateLog, { at: nowIso, action: "held", source: "scheduled", rowCount: next.records.length, previousRowCount: ds.rowCount, summary: summarizeChecks(checks) });
      return await store.updateDataset(ds.id, { pendingUpdate: pending, updateLog: updateLog2, lastSyncedAt: nowIso, lastSyncStatus: "success", lastSyncMessage: "Atualiza\xE7\xE3o aguardando revis\xE3o", updatedAt: nowIso }), await store.deleteChunksNotIn(ds.id, versionsInUse({ ...ds, pendingUpdate: pending })), { ...base, result: "held", message: summarizeChecks(checks), rowCount: next.records.length };
    }
    let updateLog = appendLog(ds.updateLog, { at: nowIso, action: "auto_published", source: "scheduled", rowCount: next.records.length, previousRowCount: ds.rowCount, summary: publishSummary(checks, ds.reviewLevel) }), editionData = {};
    for (let ed of (ds.editions || []).filter((e) => !e.supersededBy && e.cutoff))
      try {
        editionData[ed.id] = await store.loadVersion(ds, ed.chunkVersion, ed.chunkCount);
      } catch {
      }
    let impact = detectEditionImpact({ ...ds, editionData }, next.records, now);
    return impact && (updateLog = appendLog(updateLog, { at: nowIso, action: "edition_impact", summary: impact.items.map((i) => `"${i.label}": ${i.count} valores diferentes da edi\xE7\xE3o (ex.: ${i.sample[0]})`).join(" ") })), await store.updateDataset(ds.id, clean({
      columns: next.columns,
      columnCount: next.columnCount,
      rowCount: next.records.length,
      chunkVersion: version,
      chunkCount: chunks.length,
      storedRecordCount: storedCount,
      storageMode: "chunked",
      isPartial: !!truncated.isPartial,
      ...truncated,
      updateLog,
      ...impact ? { editionImpact: impact } : {},
      ...next.sourceMeta ? { sourceMeta: next.sourceMeta } : {},
      lastSyncedAt: nowIso,
      lastSyncStatus: "success",
      lastSyncMessage: `Atualizado (${next.records.length} linhas)`,
      updatedAt: nowIso
    }), truncated.isPartial ? ["pendingUpdate"] : ["pendingUpdate", "partialNote"]), await store.deleteChunksNotIn(ds.id, versionsInUse({ ...ds, chunkVersion: version, pendingUpdate: void 0 })), { ...base, result: "published", message: summarizeChecks(checks) + (impact ? ` Aten\xE7\xE3o: altera dados de ${impact.items.map((i) => `"${i.label}"`).join(", ")}.` : ""), rowCount: next.records.length, editionImpact: !!impact };
  } catch (err) {
    let message = `Falha na sincroniza\xE7\xE3o agendada: ${err?.message || err}`;
    try {
      await store.updateDataset(ds.id, { lastSyncStatus: "error", lastSyncMessage: message.slice(0, 300), updatedAt: nowIso });
    } catch {
    }
    return { ...base, result: "error", message };
  }
}
async function runScheduledSync(opts) {
  let now = opts.now || /* @__PURE__ */ new Date(), items = [], candidates = (await opts.store.listCandidates()).filter((d) => !opts.datasetId || d.id === opts.datasetId);
  for (let ds of candidates) {
    if (!opts.force && !isDatasetDueForSync(ds, now, ds.lastSyncedAt)) {
      items.push({ datasetId: ds.id, name: ds.name, result: "skipped_not_due", message: "Fora do hor\xE1rio agendado." });
      continue;
    }
    items.push(await syncOneDataset(ds, opts.store, opts.fetcher, now));
  }
  return { startedAt: now.toISOString(), items };
}
function isSchedulable(d) {
  let interval = d.autoSyncInterval;
  return !!((d.sourceUrl || d.dynamicUrlPattern) && interval && !["none", "manual", "on_load"].includes(interval));
}
async function createAdminContext(opts) {
  let { initializeApp, getApps, applicationDefault } = await import("firebase-admin/app"), { getFirestore, FieldValue } = await import("firebase-admin/firestore"), credential = applicationDefault();
  try {
    await credential.getAccessToken();
  } catch (e) {
    throw new Error(
      'credenciais do Google Cloud indispon\xEDveis. No servidor: conceda \xE0 conta de servi\xE7o o papel "Cloud Datastore User" (ver SINCRONIZACAO.md). No GitHub: configure o segredo FIREBASE_SERVICE_ACCOUNT. Detalhe: ' + String(e?.message || e).slice(0, 160)
    );
  }
  let app = getApps()[0] || initializeApp({ projectId: opts.projectId, credential }), db = opts.databaseId && opts.databaseId !== "(default)" ? getFirestore(app, opts.databaseId) : getFirestore(app), col = db.collection("datasets");
  return { db, store: {
    async listCandidates() {
      return (await col.get()).docs.map((d) => d.data()).filter(isSchedulable);
    },
    async loadVersion(ds, version, chunkCount) {
      let out = [];
      for (let i = 0; i < chunkCount; i++) {
        let snap = await col.doc(ds.id).collection("chunks").doc(`${version}_${i}`).get();
        if (!snap.exists) throw new Error(`bloco ${i + 1}/${chunkCount} da vers\xE3o ${version} n\xE3o encontrado`);
        out.push(...snap.data()?.records || []);
      }
      return out;
    },
    async loadRecords(ds) {
      if (ds.storageMode !== "chunked" || !ds.chunkVersion || !ds.chunkCount) return ds.records || [];
      let out = [];
      for (let i = 0; i < ds.chunkCount; i++) {
        let snap = await col.doc(ds.id).collection("chunks").doc(`${ds.chunkVersion}_${i}`).get();
        if (!snap.exists) throw new Error(`bloco ${i + 1}/${ds.chunkCount} da vers\xE3o publicada n\xE3o encontrado`);
        out.push(...snap.data()?.records || []);
      }
      return out;
    },
    async writeChunks(datasetId, version, chunks) {
      for (let i = 0; i < chunks.length; i += 8) {
        let batch = db.batch();
        chunks.slice(i, i + 8).forEach((records, j) => {
          let index = i + j;
          batch.set(col.doc(datasetId).collection("chunks").doc(`${version}_${index}`), clean({ index, version, datasetId, records }));
        }), await batch.commit();
      }
    },
    async updateDataset(datasetId, patch, remove = []) {
      let data = { ...patch };
      remove.forEach((k) => {
        data[k] = FieldValue.delete();
      }), await col.doc(datasetId).update(data);
    },
    async deleteChunksNotIn(datasetId, keep) {
      let stale = (await col.doc(datasetId).collection("chunks").get()).docs.filter((d) => !keep.has(d.data().version));
      for (let i = 0; i < stale.length; i += 400) {
        let batch = db.batch();
        stale.slice(i, i + 400).forEach((d) => batch.delete(d.ref)), await batch.commit();
      }
    }
  }, FieldValue };
}
async function runScheduledSyncWithAdmin(opts) {
  let { store } = await createAdminContext(opts);
  return runScheduledSync({ store, fetcher: opts.fetcher, datasetId: opts.datasetId, force: opts.force });
}
var clean, init_serverSync = __esm({
  "serverSync.ts"() {
    init_syncSchedule();
    init_editionRevision();
    init_syncCore();
    init_datasetVersions();
    clean = (v) => JSON.parse(JSON.stringify(v));
  }
});

// src/lib/pivotEngine.ts
function computePivot(records, config) {
  let EMPTY = "(Vazio)", OTHERS = "Outros", AGG_LABELS = { sum: "Soma", avg: "M\xE9dia", count: "Contagem", min: "M\xEDn", max: "M\xE1x" }, toNumber3 = (raw) => {
    if (typeof raw == "number") return isFinite(raw) ? raw : null;
    if (raw == null || typeof raw == "boolean") return null;
    let s = String(raw).trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
    if (s === "" || s === "-") return null;
    /^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^-?\d+,\d+$/.test(s) ? s = s.replace(/\./g, "").replace(",", ".") : /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s) && (s = s.replace(/,/g, ""));
    let n = Number(s);
    return isFinite(n) ? n : null;
  }, groupValue = (raw) => raw != null && String(raw).trim() !== "" ? String(raw) : EMPTY, round2 = (n) => Math.round(n * 100) / 100, aggregate = (rowsInCell, metric, agg) => {
    if (agg === "count") return rowsInCell.length;
    let nums = [];
    for (let r of rowsInCell) {
      let n = toNumber3(r[metric]);
      n !== null && nums.push(n);
    }
    if (nums.length === 0) return agg === "sum" ? 0 : null;
    if (agg === "sum") return round2(nums.reduce((a, b) => a + b, 0));
    if (agg === "avg") return round2(nums.reduce((a, b) => a + b, 0) / nums.length);
    let m = nums[0];
    for (let n of nums) m = agg === "min" ? Math.min(m, n) : Math.max(m, n);
    return m;
  }, compareLabels = (a, b) => a === EMPTY || a === OTHERS ? 1 : b === EMPTY || b === OTHERS ? -1 : a.localeCompare(b, "pt-BR", { numeric: !0, sensitivity: "base" }), values = (config.values || []).filter((v) => v && (v.metric || v.aggregation === "count")), rowKey = config.rowKey || void 0, colKey = config.colKey && config.colKey !== rowKey ? config.colKey : void 0, labels = config.labels || {}, metricLabel = (m) => labels[m] || m, source = Array.isArray(records) ? records : [];
  if (rowKey && config.selectedRowValues && config.selectedRowValues.length > 0) {
    let allowed = new Set(config.selectedRowValues);
    source = source.filter((r) => allowed.has(groupValue(r[rowKey])));
  }
  let columnValues = [], otherColumns = 0, colBucket = {};
  if (colKey) {
    let freq = {};
    for (let r of source) {
      let v = groupValue(r[colKey]);
      freq[v] = (freq[v] || 0) + 1;
    }
    let byFrequency = Object.keys(freq).sort((a, b) => freq[b] - freq[a] || compareLabels(a, b)), colLimit = config.colLimit && config.colLimit > 0 ? config.colLimit : 8, kept = byFrequency.slice(0, colLimit);
    otherColumns = Math.max(0, byFrequency.length - kept.length);
    for (let v of byFrequency) colBucket[v] = kept.indexOf(v) >= 0 ? v : OTHERS;
    columnValues = kept.sort(compareLabels), otherColumns > 0 && columnValues.push(OTHERS);
  }
  let metricCount = {};
  for (let v of values) metricCount[v.metric] = (metricCount[v.metric] || 0) + 1;
  let series = [];
  for (let v of values) {
    let repeated = metricCount[v.metric] > 1, baseKey = repeated ? v.metric + "__" + v.aggregation : v.metric, baseLabel = (v.metric ? metricLabel(v.metric) : "Registros") + (repeated || v.aggregation !== "sum" ? " (" + AGG_LABELS[v.aggregation] + ")" : "");
    if (colKey)
      for (let cv of columnValues)
        series.push({
          key: baseKey + "::" + cv,
          label: values.length > 1 ? baseLabel + " \xB7 " + cv : cv,
          metric: v.metric,
          aggregation: v.aggregation,
          colValue: cv
        });
    else
      series.push({ key: baseKey, label: baseLabel, metric: v.metric, aggregation: v.aggregation });
  }
  let order = [], cells = {};
  for (let r of source) {
    let rv = rowKey ? groupValue(r[rowKey]) : "Total", cv = colKey ? colBucket[groupValue(r[colKey])] : "";
    cells[rv] || (cells[rv] = {}, order.push(rv)), cells[rv][cv] || (cells[rv][cv] = []), cells[rv][cv].push(r);
  }
  !rowKey && order.length === 0 && (cells.Total = { "": [] }, order.push("Total"));
  let rows = order.map((rv) => {
    let row = { name: rv };
    rowKey && (row[rowKey] = rv);
    for (let s of series) {
      let cellRows = colKey ? cells[rv][s.colValue] || [] : cells[rv][""] || [];
      row[s.key] = colKey && cellRows.length === 0 && s.aggregation !== "sum" && s.aggregation !== "count" ? null : aggregate(cellRows, s.metric, s.aggregation);
    }
    return row;
  }), firstMetricKeys = series.filter((s) => values.length > 0 && s.metric === values[0].metric && s.aggregation === values[0].aggregation).map((s) => s.key), primary = (row) => firstMetricKeys.reduce((acc, k) => acc + (typeof row[k] == "number" ? row[k] : 0), 0);
  config.sortBy === "value_desc" ? rows.sort((a, b) => primary(b) - primary(a)) : config.sortBy === "value_asc" ? rows.sort((a, b) => primary(a) - primary(b)) : config.sortBy === "label_asc" ? rows.sort((a, b) => compareLabels(String(a.name), String(b.name))) : config.sortBy === "label_desc" && rows.sort((a, b) => compareLabels(String(b.name), String(a.name)));
  let totalRowGroups = rows.length;
  return config.limit && config.limit > 0 && rows.length > config.limit && (rows = rows.slice(0, config.limit)), {
    rows,
    series,
    rowKey,
    colKey,
    columnValues,
    totalRowGroups,
    hiddenRowGroups: totalRowGroups - rows.length,
    otherColumns
  };
}
function pivotConfigFromChart(chart, options = {}) {
  let columnTypes = ["bar", "horizontal_bar", "line", "area", "radar", "table"], allowColumns = !!chart.type && columnTypes.indexOf(chart.type) >= 0;
  return {
    rowKey: options.ignoreRowKey ? void 0 : chart.xAxisKey,
    colKey: allowColumns && !options.ignoreRowKey && chart.pivotColKey || void 0,
    colLimit: chart.pivotColLimit,
    values: (chart.yAxisKeys || []).map((m) => ({
      metric: m,
      aggregation: chart.metricAggregations && chart.metricAggregations[m] || chart.aggregation || "sum"
    })),
    sortBy: chart.sortBy,
    limit: options.ignoreRowKey ? void 0 : chart.limit || options.defaultLimit,
    selectedRowValues: chart.selectedCategoryValues,
    labels: options.labels
  };
}
var init_pivotEngine = __esm({
  "src/lib/pivotEngine.ts"() {
  }
});

// src/lib/chartCalculators.ts
function getPaletteColors(paletteKey) {
  return paletteKey && COLOR_PALETTES[paletteKey] ? COLOR_PALETTES[paletteKey] : COLOR_PALETTES.modern;
}
function formatMetricValue(val, prefix = "", suffix = "") {
  if (val == null) return "-";
  if (typeof val == "number") {
    let formatted = "";
    return Math.abs(val) >= 1e6 ? formatted = (val / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "M" : Math.abs(val) >= 1e4 ? formatted = val.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : formatted = val.toLocaleString("pt-BR", { maximumFractionDigits: 2 }), `${prefix ? prefix + " " : ""}${formatted}${suffix ? " " + suffix : ""}`.trim();
  }
  return `${prefix ? prefix + " " : ""}${val}${suffix ? " " + suffix : ""}`.trim();
}
var COLOR_PALETTES, init_chartCalculators = __esm({
  "src/lib/chartCalculators.ts"() {
    init_pivotEngine();
    init_pivotEngine();
    COLOR_PALETTES = {
      modern: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f43f5e"],
      emerald: ["#10b981", "#059669", "#34d399", "#047857", "#6ee7b7", "#065f46", "#a7f3d0"],
      cyber: ["#38bdf8", "#a855f7", "#ec4899", "#f43f5e", "#eab308", "#22c55e", "#06b6d4"],
      sunset: ["#f97316", "#ef4444", "#f59e0b", "#ec4899", "#fbbf24", "#b91c1c", "#ea580c"],
      ocean: ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#0369a1", "#075985"],
      violet: ["#8b5cf6", "#7c3aed", "#a78bfa", "#c4b5fd", "#6d28d9", "#5b21b6", "#4c1d95"]
    };
  }
});

// src/lib/designSystem.ts
var DEFAULT_DESIGN_CONFIG, DESIGN_PRESETS, init_designSystem = __esm({
  "src/lib/designSystem.ts"() {
    DEFAULT_DESIGN_CONFIG = {
      primaryColor: "#6366f1",
      accentColor: "#06b6d4",
      paletteName: "modern",
      fontFamily: "Plus Jakarta Sans",
      backgroundStyle: "dark_slate",
      cardRadius: "2xl",
      glassmorphism: !0,
      showCardBorderGlow: !1,
      watermark: {
        enabled: !1,
        text: "CONFIDENCIAL",
        opacity: 0.12,
        position: "center_diagonal"
      }
    }, DESIGN_PRESETS = [
      {
        id: "modern_dark",
        name: "Modern Dark Indigo (Padr\xE3o)",
        description: "Visual escuro sofisticado com tons de \xEDndigo, ciano e vidro sutil",
        config: {
          ...DEFAULT_DESIGN_CONFIG
        }
      },
      {
        id: "midnight_violet",
        name: "Midnight Violet & Neon",
        description: "Fundo escuro profundo com toques violeta, magenta e bordas glow",
        config: {
          primaryColor: "#a855f7",
          accentColor: "#ec4899",
          paletteName: "violet",
          fontFamily: "Space Grotesk",
          backgroundStyle: "glass_mesh",
          cardRadius: "2xl",
          glassmorphism: !0,
          showCardBorderGlow: !0,
          watermark: {
            enabled: !1,
            text: "EXCLUSIVO",
            opacity: 0.15,
            position: "center_diagonal"
          }
        }
      },
      {
        id: "emerald_fintech",
        name: "Emerald Fintech Pro",
        description: "Estilo verde esmeralda financeiro com alta precis\xE3o e clareza",
        config: {
          primaryColor: "#10b981",
          accentColor: "#14b8a6",
          paletteName: "emerald",
          fontFamily: "Inter",
          backgroundStyle: "pure_black",
          cardRadius: "xl",
          glassmorphism: !1,
          showCardBorderGlow: !1,
          watermark: {
            enabled: !1,
            text: "RELAT\xD3RIO FINANCEIRO",
            opacity: 0.1,
            position: "bottom_right"
          }
        }
      },
      {
        id: "anuario_editorial",
        name: "Anu\xE1rio Editorial & Governamental (Modelo)",
        description: "Design id\xEAntico ao modelo Anu\xE1rio: fundo limpo suave, cart\xF5es brancos refinados, azul real e tipografia marcante",
        config: {
          primaryColor: "#1d4ed8",
          accentColor: "#f59e0b",
          paletteName: "modern",
          fontFamily: "Plus Jakarta Sans",
          backgroundStyle: "light_corporate",
          cardRadius: "2xl",
          glassmorphism: !1,
          showCardBorderGlow: !1,
          watermark: {
            enabled: !1,
            text: "ANU\xC1RIO 2025",
            opacity: 0.08,
            position: "header"
          }
        }
      },
      {
        id: "corporate_clean",
        name: "Corporate Light & Clean",
        description: "Interface clara executiva, perfeita para relat\xF3rios formais e impress\xE3o",
        config: {
          primaryColor: "#2563eb",
          accentColor: "#0ea5e9",
          paletteName: "cyan",
          fontFamily: "Outfit",
          backgroundStyle: "light_corporate",
          cardRadius: "xl",
          glassmorphism: !1,
          showCardBorderGlow: !1,
          watermark: {
            enabled: !1,
            text: "INTERNO",
            opacity: 0.08,
            position: "header"
          }
        }
      },
      {
        id: "blueprint_grid",
        name: "Blueprint Technical Grid",
        description: "Grade de engenharia t\xE9cnica com fonte monoespa\xE7ada e pontos",
        config: {
          primaryColor: "#06b6d4",
          accentColor: "#3b82f6",
          paletteName: "cyan",
          fontFamily: "JetBrains Mono",
          backgroundStyle: "grid_dots",
          cardRadius: "lg",
          glassmorphism: !0,
          showCardBorderGlow: !0,
          watermark: {
            enabled: !1,
            text: "PROJETO T\xC9CNICO",
            opacity: 0.12,
            position: "center_diagonal"
          }
        }
      }
    ];
  }
});

// src/lib/seoManager.ts
function getResolvedSEO(project, dashboard) {
  let projectSEO = project?.seoConfig || {}, dashSEO = dashboard?.seoConfig || {}, brandName = project?.headerConfig?.brandName || project?.name || "DataDash CMS", dashTitle = dashboard?.title || "Dashboard", metaTitle = dashSEO.metaTitle || (dashboard ? `${dashboard.title} | ${brandName}` : projectSEO.metaTitle || brandName), metaDescription = dashSEO.metaDescription || dashboard?.subtitle || dashboard?.description || projectSEO.metaDescription || project?.description || `An\xE1lise interativa e m\xE9tricas em tempo real de ${dashTitle}.`, keywords = dashSEO.keywords || projectSEO.keywords || "dashboard, analytics, m\xE9tricas, dados, relat\xF3rios, intelig\xEAncia de dados", ogImageUrl = dashSEO.ogImageUrl || projectSEO.ogImageUrl || "", authorByline = dashSEO.authorByline || dashboard?.authorByline || projectSEO.authorByline || brandName, canonicalUrl = dashSEO.canonicalUrl || (dashboard ? "" : projectSEO.canonicalUrl || ""), siteName = dashSEO.siteName || projectSEO.siteName || brandName, jsonLdType = dashSEO.jsonLdType || projectSEO.jsonLdType || "WebApplication";
  return {
    metaTitle,
    metaDescription,
    keywords,
    ogImageUrl,
    authorByline,
    canonicalUrl,
    siteName,
    jsonLdType
  };
}
function generateHTMLHeadSEOTags(project, dashboard) {
  let seo = getResolvedSEO(project, dashboard), escapeHTML = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  return `
    <!-- SEO & Social Meta Tags (Configura\xE7\xE3o Global / P\xE1gina) -->
    <title>${escapeHTML(seo.metaTitle || "DataDash")}</title>
    <meta name="description" content="${escapeHTML(seo.metaDescription || "")}" />
    <meta name="keywords" content="${escapeHTML(seo.keywords || "")}" />
    <meta name="author" content="${escapeHTML(seo.authorByline || "")}" />

    <!-- OpenGraph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHTML(seo.metaTitle || "")}" />
    <meta property="og:description" content="${escapeHTML(seo.metaDescription || "")}" />
    ${seo.ogImageUrl ? `<meta property="og:image" content="${escapeHTML(seo.ogImageUrl)}" />` : ""}
    <meta property="og:site_name" content="${escapeHTML(seo.siteName || "")}" />
    ${seo.canonicalUrl ? `<meta property="og:url" content="${escapeHTML(seo.canonicalUrl)}" />` : ""}

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="${seo.ogImageUrl ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escapeHTML(seo.metaTitle || "")}" />
    <meta name="twitter:description" content="${escapeHTML(seo.metaDescription || "")}" />
    ${seo.ogImageUrl ? `<meta name="twitter:image" content="${escapeHTML(seo.ogImageUrl)}" />` : ""}

    <!-- Schema.org Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    ${JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": seo.jsonLdType || "WebApplication",
      name: seo.metaTitle,
      description: seo.metaDescription,
      author: {
        "@type": "Organization",
        name: seo.authorByline || seo.siteName
      },
      publisher: {
        "@type": "Organization",
        name: seo.siteName
      }
    },
    null,
    2
  ).replace(/</g, "\\u003c")}
    </script>
  `.trim();
}
var init_seoManager = __esm({
  "src/lib/seoManager.ts"() {
  }
});

// src/lib/infographicBlocks.ts
function infographicBlock(chart, records, ctx, labels, kit, pivot, pivotCfg, fmt) {
  let COLUMN_TYPES = ["bar", "horizontal_bar", "line", "area", "radar", "table"], STRUCTURAL = ["text_block", "callout", "divider", "html_embed"], res = kit && ctx ? kit.resolveChart(records || [], chart, ctx) : { records: records || [] }, hasCols = COLUMN_TYPES.indexOf(chart.type) >= 0, use = res.colKeyOverride && !hasCols && res.currentRecords ? res.currentRecords : res.records, c2 = Object.assign({}, chart, { pivotColKey: res.colKeyOverride && hasCols ? res.colKeyOverride : chart.pivotColKey }), fill = (t) => kit && ctx ? kit.fillText(t || "", res, ctx) : t || "", out = { id: chart.id, type: chart.type, title: fill(chart.title), description: fill(chart.description) };
  if (STRUCTURAL.indexOf(chart.type) >= 0)
    return out.content = fill(chart.content || chart.description || ""), out;
  if (chart.type === "kpi") {
    let pv2 = pivot(use, pivotCfg(c2, { ignoreRowKey: !0 })), val = pv2.rows[0] && pv2.series[0] ? pv2.rows[0][pv2.series[0].key] : null;
    if (out.valueText = fmt(val, chart.prefix, chart.suffix), out.compare = null, res.previousRecords && res.previousYear !== void 0) {
      let pp = pivot(res.previousRecords, pivotCfg(c2, { ignoreRowKey: !0 })), prev = pp.rows[0] && pp.series[0] ? pp.rows[0][pp.series[0].key] : null, pct = typeof prev == "number" && typeof val == "number" && prev !== 0 ? (val - prev) / Math.abs(prev) * 100 : null, period = res.periodLabel ? " no mesmo per\xEDodo (" + res.periodLabel + ")" : "";
      out.compare = {
        trend: pct === null ? "none" : pct >= 0 ? "up" : "down",
        text: (pct !== null ? (pct >= 0 ? "\u25B2 " : "\u25BC ") + Math.abs(pct).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "% " : "") + "vs " + res.previousYear + period + (typeof prev == "number" ? " (" + fmt(prev, chart.prefix, chart.suffix) + ")" : ": sem dados")
      };
    }
    return out;
  }
  if (chart.type === "table") {
    if (chart.isPivotTable && chart.xAxisKey && chart.yAxisKeys && chart.yAxisKeys.length > 0) {
      let aggs = chart.pivotAggregations && chart.pivotAggregations.length ? chart.pivotAggregations : ["sum"], values = [];
      chart.yAxisKeys.forEach((m) => aggs.forEach((a) => values.push({ metric: m, aggregation: a })));
      let pv2 = pivot(use, {
        rowKey: chart.xAxisKey,
        colKey: c2.pivotColKey || void 0,
        colLimit: chart.pivotColLimit,
        values,
        labels,
        sortBy: chart.sortBy
      });
      out.headers = [labels[chart.xAxisKey] || chart.xAxisKey].concat(pv2.series.map((s) => s.label)), out.rows = pv2.rows.map((r) => [String(r.name)].concat(pv2.series.map((s) => typeof r[s.key] == "number" ? fmt(r[s.key], chart.prefix, chart.suffix) : r[s.key] === null || r[s.key] === void 0 ? "-" : String(r[s.key]))));
    } else {
      let keys = (chart.yAxisKeys && chart.yAxisKeys.length ? chart.yAxisKeys : Object.keys(use[0] || {})).filter((k) => k !== "__ano").slice(0, 7);
      out.headers = keys.map((k) => labels[k] || k), out.rows = use.slice(0, 30).map((r) => keys.map((k) => r[k] === null || r[k] === void 0 ? "-" : String(r[k])));
    }
    return out;
  }
  let pv = pivot(use, pivotCfg(c2, { labels, defaultLimit: 15 }));
  return out.labels = pv.rows.map((r) => String(r.name)), out.series = pv.series.map((s) => ({ label: s.label, data: pv.rows.map((r) => typeof r[s.key] == "number" ? r[s.key] : null) })), out;
}
var init_infographicBlocks = __esm({
  "src/lib/infographicBlocks.ts"() {
  }
});

// src/lib/brandTheme.ts
function safeColor(v) {
  return typeof v == "string" && COLOR_RE.test(v.trim()) ? v.trim() : void 0;
}
function parseBrandTheme(theme) {
  let result = { tokens: {}, errors: [], warnings: [] };
  if (!theme || !theme.tokensJson || !theme.tokensJson.trim()) return result;
  let raw;
  try {
    raw = JSON.parse(theme.tokensJson);
  } catch (e) {
    return result.errors.push("Tokens: JSON inv\xE1lido (" + (e?.message || "erro de sintaxe") + ")."), result;
  }
  if (!raw || typeof raw != "object")
    return result.errors.push("Tokens: o JSON precisa ser um objeto."), result;
  let t = {};
  if (raw.colors && typeof raw.colors == "object") {
    t.colors = {};
    for (let [k, v] of Object.entries(raw.colors)) {
      let c = safeColor(v);
      c ? t.colors[k] = c : result.warnings.push(`Cor "${k}" ignorada: valor inv\xE1lido.`);
    }
  }
  if (raw.fonts && typeof raw.fonts == "object") {
    t.fonts = {};
    for (let k of ["heading", "body"]) {
      let v = raw.fonts[k];
      typeof v == "string" && FONT_RE.test(v) ? t.fonts[k] = v : v !== void 0 && result.warnings.push(`Fonte "${k}" ignorada: use s\xF3 nomes de fontes.`);
    }
    let url = raw.fonts.googleFontsUrl;
    typeof url == "string" && (/^https:\/\/fonts\.googleapis\.com\/css2?\?[^"'<>\s]+$/.test(url) ? t.fonts.googleFontsUrl = url : result.warnings.push("googleFontsUrl ignorada: s\xF3 \xE9 aceito endere\xE7o https://fonts.googleapis.com/\u2026"));
  }
  if (raw.radius && typeof raw.radius == "object") {
    t.radius = {};
    for (let k of ["card", "control"]) {
      let v = raw.radius[k];
      typeof v == "string" && LENGTH_RE.test(v.trim()) ? t.radius[k] = v.trim() : v !== void 0 && result.warnings.push(`Raio "${k}" ignorado: use px, rem, em ou %.`);
    }
  }
  if (raw.chart && typeof raw.chart == "object") {
    if (t.chart = {}, Array.isArray(raw.chart.palette)) {
      let pal = raw.chart.palette.map(safeColor).filter(Boolean);
      pal.length > 0 && (t.chart.palette = pal.slice(0, 16)), pal.length !== raw.chart.palette.length && result.warnings.push("Algumas cores da paleta dos gr\xE1ficos foram ignoradas.");
    }
    t.chart.overridePalette = raw.chart.overridePalette !== !1;
    let g = safeColor(raw.chart.gridColor);
    g && (t.chart.gridColor = g);
  }
  return typeof raw.logoUrl == "string" && (/^https:\/\/[^"'<>\s]+$/.test(raw.logoUrl) ? t.logoUrl = raw.logoUrl : result.warnings.push("logoUrl ignorada: use um endere\xE7o https://.")), result.tokens = t, result;
}
function brandCssVariables(tokens) {
  let vars = {}, c = tokens.colors || {}, map = {
    "--dd-primary": c.primary,
    "--dd-accent": c.accent,
    "--dd-bg": c.background,
    "--dd-surface": c.surface,
    "--dd-border": c.border,
    "--dd-text": c.text,
    "--dd-text-muted": c.textMuted,
    "--dd-heading": c.heading || c.text,
    "--dd-positive": c.positive,
    "--dd-negative": c.negative,
    "--dd-font-heading": tokens.fonts?.heading,
    "--dd-font-body": tokens.fonts?.body,
    "--dd-radius-card": tokens.radius?.card,
    "--dd-radius-control": tokens.radius?.control,
    "--dd-grid": tokens.chart?.gridColor
  };
  for (let [k, v] of Object.entries(map)) v && (vars[k] = v);
  return vars;
}
function baseRules(tokens, scope) {
  let c = tokens.colors || {}, r = [], rule = (sel, decls) => {
    let d = decls.filter(Boolean);
    d.length && r.push(sel.split(",").map((s) => `${scope}${s.trim()}, ${scope} ${s.trim()}`).join(", ") + " { " + d.join(" ") + " }");
  }, vars = brandCssVariables(tokens);
  return r.push(`${scope} { ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(" ")} }`), rule(".dd-page", [c.background && "background: var(--dd-bg) !important;", c.text && "color: var(--dd-text);", tokens.fonts?.body && "font-family: var(--dd-font-body);"]), rule(".dd-card, .dd-header, .dd-filter-bar", [c.surface && "background: var(--dd-surface) !important;", c.border && "border-color: var(--dd-border) !important;", tokens.radius?.card && "border-radius: var(--dd-radius-card) !important;"]), rule(".dd-title, .dd-card-title, .dd-section-title", [c.heading || c.text ? "color: var(--dd-heading) !important;" : void 0, tokens.fonts?.heading && "font-family: var(--dd-font-heading);"]), rule(".dd-subtitle, .dd-card-description, .dd-source, .dd-filter-label", [c.textMuted && "color: var(--dd-text-muted) !important;"]), rule(".dd-kpi-value", [c.heading || c.text ? "color: var(--dd-heading) !important;" : void 0, tokens.fonts?.heading && "font-family: var(--dd-font-heading);"]), rule(".dd-filter-control", [tokens.radius?.control && "border-radius: var(--dd-radius-control) !important;", c.border && "border-color: var(--dd-border) !important;", c.surface && "background: var(--dd-surface) !important;", c.text && "color: var(--dd-text) !important;"]), rule(".dd-last-update", [c.primary && "background: var(--dd-primary) !important; color: #fff !important; border-color: transparent !important;"]), rule(".dd-kpi-compare.is-up", [c.positive && "color: var(--dd-positive) !important;"]), rule(".dd-kpi-compare.is-down", [c.negative && "color: var(--dd-negative) !important;"]), r.join(`
`);
}
function sanitizeCss(css) {
  let removed = [], out = String(css || ""), strip2 = (re, why) => {
    re.test(out) && (removed.push(why), out = out.replace(re, ""));
  };
  return strip2(/<\/?\s*style[^>]*>/gi, "tags <style>"), strip2(/</g, 'caracteres "<"'), strip2(/@import[^;]*;?/gi, "@import (use googleFontsUrl nos tokens)"), strip2(/expression\s*\(/gi, "expression()"), strip2(/javascript\s*:/gi, "javascript:"), strip2(/behavior\s*:/gi, "behavior:"), strip2(/-moz-binding/gi, "-moz-binding"), out = out.replace(/url\(\s*(['"]?)([^'")]*)\1\s*\)/gi, (m, _q, u) => /^data:image\//i.test(u) || /^https:\/\/fonts\.gstatic\.com\//i.test(u) ? m : (removed.push("url() externo: " + u.slice(0, 60)), "none")), { css: out, removed };
}
function scopeCss(css, scope) {
  let out = [], i = 0, src = css.replace(/\/\*[\s\S]*?\*\//g, ""), readBlock = (start) => {
    let depth = 0;
    for (let j = start; j < src.length; j++)
      if (src[j] === "{") depth++;
      else if (src[j] === "}" && (depth--, depth === 0))
        return j;
    return src.length - 1;
  }, prefix = (selectors) => selectors.split(",").map((s) => {
    let sel = s.trim();
    return sel ? sel === ":root" || sel === "html" || sel === "body" ? scope : /^(html|body)\b/.test(sel) ? scope + sel.replace(/^(html|body)/, "") : sel.startsWith(".dd-page") ? `${scope}${sel}, ${scope} ${sel}` : `${scope} ${sel}` : "";
  }).filter(Boolean).join(", ");
  for (; i < src.length; ) {
    let open = src.indexOf("{", i);
    if (open < 0) break;
    let head = src.slice(i, open).trim(), close = readBlock(open), body = src.slice(open + 1, close);
    /^@(media|supports|container)/i.test(head) ? out.push(`${head} {
${scopeCss(body, scope)}
}`) : /^@(font-face|keyframes|-webkit-keyframes|page)/i.test(head) ? out.push(`${head} {${body}}`) : head.startsWith("@") || head && out.push(`${prefix(head)} {${body}}`), i = close + 1;
  }
  return out.join(`
`);
}
function buildBrandCss(theme, scope = "." + BRAND_SCOPE_CLASS) {
  let parsed = parseBrandTheme(theme);
  if (!theme || theme.enabled === !1) return { css: "", parsed, removed: [] };
  let base = baseRules(parsed.tokens, scope), { css: clean2, removed } = sanitizeCss(theme.customCss || ""), custom = clean2.trim() ? scopeCss(clean2, scope) : "";
  return { css: [base, custom].filter(Boolean).join(`
`), parsed, removed };
}
function brandPalette(theme) {
  if (!theme || theme.enabled === !1) return;
  let p = parseBrandTheme(theme).tokens.chart;
  return p && p.palette && p.palette.length > 0 && p.overridePalette !== !1 ? p.palette : void 0;
}
var COLOR_RE, LENGTH_RE, FONT_RE, BRAND_SCOPE_CLASS, init_brandTheme = __esm({
  "src/lib/brandTheme.ts"() {
    COLOR_RE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|[a-z]{3,20})$/i, LENGTH_RE = /^\d{1,3}(\.\d+)?(px|rem|em|%)$|^0$/, FONT_RE = /^[\w\s'",.-]{1,200}$/;
    BRAND_SCOPE_CLASS = "dd-brand-scope";
  }
});

// src/lib/cdnLibs.ts
function libScriptTag(lib, mode = "cdn") {
  let l = PAGE_LIBS[lib];
  return mode === "vendor" ? `<script src="./${l.file}"></script>` : `<script src="${l.cdn}" integrity="${l.integrity}" crossorigin="anonymous"></script>`;
}
var PAGE_LIBS, init_cdnLibs = __esm({
  "src/lib/cdnLibs.ts"() {
    PAGE_LIBS = {
      chartjs: {
        version: "4.5.1",
        cdn: "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js",
        integrity: "sha384-jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ",
        file: "vendor/chart.umd.min.js"
      },
      tailwind: {
        version: "4.3.3",
        cdn: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3/dist/index.global.js",
        integrity: "sha384-2ql948lIdLcGEE0/qxNiudyTjgauA3RDJERu5xW75kFCvSl5a9odyQYCb6tEjnmB",
        file: "vendor/tailwind-browser.js"
      }
    };
  }
});

// firebase-applet-config.json
var firebase_applet_config_default, init_firebase_applet_config = __esm({
  "firebase-applet-config.json"() {
    firebase_applet_config_default = {
      projectId: "datadash-mika",
      appId: "1:165065424855:web:0a2fb6bdab15d6c1c81592",
      apiKey: "AIzaSyBfP8f7VLzEkZetFJ-YFH6kehPPTDOUpxs",
      authDomain: "datadash-mika.firebaseapp.com",
      firestoreDatabaseId: "ai-studio-3a095309-81b5-45d1-88e0-8af1d80e6fd9",
      storageBucket: "datadash-mika.firebasestorage.app",
      messagingSenderId: "165065424855",
      measurementId: "",
      oAuthClientId: "165065424855-9tf72gfdo6518tcdult0pb8a9bdqu35l.apps.googleusercontent.com",
      recaptchaSiteKey: ""
    };
  }
});

// src/lib/htmlGenerator.ts
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeMultiline(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}
function safeUrl(value) {
  let url = String(value ?? "").trim();
  return /^(https?:|data:image\/|\/|\.\/|#)/i.test(url) || /^[\w.-]+\.html?$/i.test(url) ? escapeHtml(url) : "#";
}
function safeJson(value) {
  return JSON.stringify(value ?? null).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function resolveExportDataViews(dashboard, dataset, liveRecords) {
  let dv = dashboard.dataView, ed = dv && dv.mode !== "live" ? latestEdition(dataset.editions, dv.editionId) : void 0, edRecords = ed ? dataset.editionData?.[ed.id] : void 0;
  if (!dv || !ed || !edRecords)
    return { mode: "live", views: null, initialView: "live", records: liveRecords, editionNote: void 0, edition: void 0 };
  let editionNote = editionNoteText(ed);
  if (dv.mode === "edition")
    return { mode: "edition", views: null, initialView: "edition", records: edRecords, editionNote, edition: ed };
  let initialView = dv.defaultView || "edition";
  return { mode: "both", views: {
    edition: { label: ed.label, note: editionNote, records: edRecords },
    live: { label: "Atualizado", note: "", records: liveRecords }
  }, initialView, records: initialView === "edition" ? edRecords : liveRecords, editionNote: void 0, edition: ed };
}
function ddEngineRuntime() {
  return `
    // Alguns transpiladores injetam __name() nas fun\xE7\xF5es; o shim mant\xE9m o c\xF3digo embutido funcionando.
    var __name = typeof __name === 'function' ? __name : function (f) { return f; };
    // Motor de tabela din\xE2mica: o MESMO c\xF3digo usado no editor do DataDash.
    const DD_PIVOT = (${computePivot.toString()});
    const DD_PIVOT_CONFIG = (${pivotConfigFromChart.toString()});

    function DD_LABELS(cols) { const m = {}; (cols || []).forEach(function (c) { m[c.key] = c.label || c.key; }); return m; }
    const DD_FMT = (${formatMetricValue.toString()});
`;
}
function ddFilterRuntime(o) {
  let isDark = o.isDark;
  return `
    // Filtros do painel: o MESMO kit usado no editor (ano, campos, \xFAltimo dado)
    const DD_FILTERS = (${dashboardFilterKit.toString()})();
    const DD_FILTER_CONFIG = ${safeJson(o.config || null)};
    const DD_LAST_SYNC = ${safeJson(o.lastSync || null)};
    // Vers\xF5es dos dados: edi\xE7\xE3o congelada \xD7 atualizado (null quando o painel mostra uma s\xF3)
    const DD_VIEWS = ${safeJson(o.views || null)};
    let DD_VIEW = ${safeJson(o.initialView || "live")};
    const DD_EDITION_NOTE = ${safeJson(o.editionNote || null)};
    function ddSetView(v) {
      if (!DD_VIEWS || !DD_VIEWS[v] || v === DD_VIEW) return;
      DD_VIEW = v;
      RAW_RECORDS = DD_VIEWS[v].records;
      DD_USER_PICKED_YEAR = false; // cada vers\xE3o abre no seu ano mais recente
      ddRefreshModel();
      if (typeof ddOnViewChange === 'function') ddOnViewChange(); else ddOnFilterChange();
    }
    const DD_COLUMN_TYPES = ['bar', 'horizontal_bar', 'line', 'area', 'radar', 'table'];
    let DD_MODEL = null;
    let DD_STATE = { fields: {} };
    let DD_USER_PICKED_YEAR = false;
    let DD_FILTERS_OPEN = false; // celular: filtros recolhidos at\xE9 o leitor abrir
    function ddCtx() { return DD_FILTER_CONFIG ? { config: DD_FILTER_CONFIG, state: DD_STATE, model: DD_MODEL } : undefined; }
    function ddRefreshModel() {
      if (!DD_FILTER_CONFIG) {
        DD_MODEL = { years: [], fieldOptions: [] };
        ddRenderFilterBar();
        return;
      }
      const cols = (typeof COLUMNS !== 'undefined') ? COLUMNS : [];
      DD_MODEL = DD_FILTERS.computeFilterModel(RAW_RECORDS, DD_FILTER_CONFIG, DD_LABELS(cols));
      const fresh = DD_FILTERS.initialState(DD_MODEL, DD_FILTER_CONFIG);
      // Mant\xE9m o ano escolhido pelo leitor; se n\xE3o escolheu, acompanha o mais recente.
      if (!DD_USER_PICKED_YEAR || (typeof DD_STATE.year === 'number' && DD_MODEL.years.indexOf(DD_STATE.year) < 0)) DD_STATE.year = fresh.year;
      DD_STATE.fields = DD_STATE.fields || {};
      ddRenderFilterBar();
    }
    function ddRenderFilterBar() {
      const bar = document.getElementById('ddFilterBar');
      if (!bar || !DD_MODEL) return;
      const cfg = DD_FILTER_CONFIG || {};
      const hasYear = !!(cfg.year && cfg.year.enabled && DD_MODEL.yearColumn && DD_MODEL.years.length);
      const showLast = !!(cfg.lastUpdate && cfg.lastUpdate.show && DD_MODEL.lastData);
      const viewNote = (DD_VIEWS && DD_VIEW === 'edition') ? DD_VIEWS.edition.note : DD_EDITION_NOTE;
      if (!hasYear && !DD_MODEL.fieldOptions.length && !showLast && !DD_VIEWS && !viewNote) { bar.classList.add('hidden'); return; }
      bar.classList.remove('hidden');
      const ctl = 'dd-filter-control rounded-xl border px-3 py-1.5 text-xs ${isDark ? "bg-slate-950 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-800"}';
      const lbl = 'dd-filter-label text-[10px] font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}';
      let html = '';
      // Celular: os filtros ficam recolhidos atr\xE1s de um resumo ("Filtros \xB7 2025 \xB7 1 filtro")
      const activeFields = Object.keys(DD_STATE.fields || {}).filter(function (k) { return (DD_STATE.fields[k] || []).length; }).length;
      const summary = [hasYear ? (DD_STATE.year === 'all' ? 'Todos os anos' : String(DD_STATE.year)) : '', activeFields ? (activeFields + (activeFields === 1 ? ' filtro' : ' filtros')) : ''].filter(Boolean).join(' \xB7 ');
      const hasControls = !!(DD_VIEWS || hasYear || DD_MODEL.fieldOptions.length);
      const hasSearch = !!document.getElementById('ddSearchToolbar');
      if (hasControls || hasSearch) {
        html += '<div class="sm:hidden flex items-center gap-2 w-full">';
        if (hasControls) html += '<button type="button" id="ddToggleFilters" aria-expanded="' + DD_FILTERS_OPEN + '" aria-controls="ddFilterControls" class="dd-filter-control flex-1 text-left rounded-xl border px-3 py-2 text-sm font-semibold ${isDark ? "bg-slate-950 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-800"}">Filtros' + (summary ? ' <span class="font-normal opacity-70">\xB7 ' + esc(summary) + '</span>' : '') + '<span aria-hidden="true" class="float-right">' + (DD_FILTERS_OPEN ? '\u25B4' : '\u25BE') + '</span></button>';
        if (hasSearch) html += '<button type="button" id="ddToggleSearch" aria-label="Buscar nos dados" class="dd-filter-control rounded-xl border px-3 py-2 text-sm ${isDark ? "bg-slate-950 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-800"}">\u{1F50D} Buscar</button>';
        html += '</div>';
      }
      html += '<div id="ddFilterControls" class="' + (DD_FILTERS_OPEN ? 'flex' : 'hidden') + ' sm:flex flex-wrap items-end gap-4 w-full sm:w-auto">';
      if (DD_VIEWS) {
        html += '<div class="flex flex-col gap-1"><span class="' + lbl + '">Vers\xE3o dos dados</span><div role="radiogroup" aria-label="Vers\xE3o dos dados" class="dd-view-switch inline-flex rounded-xl border p-0.5 ${isDark ? "border-slate-700 bg-slate-950" : "border-slate-300 bg-white"}">';
        ['edition', 'live'].forEach(function (v) {
          const on = DD_VIEW === v;
          html += '<button type="button" role="radio" aria-checked="' + on + '" data-dd-view="' + v + '" class="dd-filter-control px-3 py-1 text-xs rounded-lg font-semibold ' + (on ? 'bg-indigo-600 text-white' : '${isDark ? "text-slate-300" : "text-slate-600"}') + '">' + esc(DD_VIEWS[v].label) + '</button>';
        });
        html += '</div></div>';
      }
      if (hasYear) {
        html += '<label class="flex flex-col gap-1"><span class="' + lbl + '">Ano</span><select id="ddYear" class="' + ctl + '">';
        DD_MODEL.years.forEach(function (y) {
          html += '<option value="' + y + '"' + (DD_STATE.year === y ? ' selected' : '') + '>' + y + (y === DD_MODEL.latestYear ? ' (mais recente)' : '') + '</option>';
        });
        if (cfg.year.allowAll) html += '<option value="all"' + (DD_STATE.year === 'all' ? ' selected' : '') + '>Todos os anos</option>';
        html += '</select></label>';
      }
      DD_MODEL.fieldOptions.forEach(function (f, i) {
        const cur = (DD_STATE.fields[f.column] || [])[0] || '';
        html += '<label class="flex flex-col gap-1 min-w-[140px]"><span class="' + lbl + '">' + esc(f.label) + '</span><select data-dd-field="' + i + '" class="' + ctl + '"><option value="">Todos</option>';
        f.values.forEach(function (v) { html += '<option value="' + esc(v) + '"' + (cur === v ? ' selected' : '') + '>' + esc(v) + '</option>'; });
        html += '</select></label>';
      });
      html += '</div>';
      html += '<div class="hidden sm:block flex-1"></div>';
      if (showLast) {
        html += '<div class="flex flex-col items-start sm:items-end gap-1"><span class="dd-last-update inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${isDark ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border-indigo-200"}">\u{1F552} Dados at\xE9 ' + esc(DD_MODEL.lastData.label) + '</span>';
        if (viewNote) html += '<span class="' + lbl + '">' + esc(viewNote) + '</span>';
        else if (DD_LAST_SYNC) html += '<span class="' + lbl + '">Base atualizada em ' + esc(new Date(DD_LAST_SYNC).toLocaleDateString('pt-BR')) + '</span>';
        html += '</div>';
      }
      if (!showLast && viewNote) html += '<span class="' + lbl + '">' + esc(viewNote) + '</span>';
      bar.innerHTML = html;
      const tf = document.getElementById('ddToggleFilters');
      if (tf) tf.addEventListener('click', function () { DD_FILTERS_OPEN = !DD_FILTERS_OPEN; ddRenderFilterBar(); });
      const ts = document.getElementById('ddToggleSearch');
      if (ts) ts.addEventListener('click', function () {
        const tb = document.getElementById('ddSearchToolbar');
        if (!tb) return;
        const open = tb.classList.toggle('hidden') === false;
        if (open) { const inp = document.getElementById('globalSearch'); if (inp) inp.focus(); }
      });
      bar.querySelectorAll('[data-dd-view]').forEach(function (btn) {
        btn.addEventListener('click', function () { ddSetView(this.getAttribute('data-dd-view')); });
      });
      const ySel = document.getElementById('ddYear');
      if (ySel) ySel.addEventListener('change', function () {
        DD_USER_PICKED_YEAR = true;
        DD_STATE.year = this.value === 'all' ? 'all' : Number(this.value);
        ddRenderFilterBar(); // atualiza o resumo ("Filtros \xB7 2023")
        ddOnFilterChange();
      });
      bar.querySelectorAll('select[data-dd-field]').forEach(function (sel) {
        sel.addEventListener('change', function () {
          const f = DD_MODEL.fieldOptions[Number(this.getAttribute('data-dd-field'))];
          DD_STATE.fields[f.column] = this.value ? [this.value] : [];
          ddRenderFilterBar();
          ddOnFilterChange();
        });
      });
    }
`;
}
function generateStandaloneHtml(dashboard, dataset, records, options = {}) {
  if (options.viewFormat === "infographic")
    return generateStandaloneInfographicHtml(dashboard, dataset, records, {
      theme: options.infographicTheme || (options.theme === "light" ? "clean_white" : "editorial_paper"),
      headlineOverride: options.headlineOverride,
      projectName: options.projectName,
      availableDatasets: options.availableDatasets,
      project: options.project,
      assets: options.assets
    });
  let exportViews = resolveExportDataViews(dashboard, dataset, records);
  records = exportViews.records;
  let design = dashboard.designConfig || DEFAULT_DESIGN_CONFIG, isDark = design.backgroundStyle !== "light_corporate", isLive = options.syncMode !== "static" && exportViews.mode !== "edition", brandTheme = options.project?.brandTheme, brand = buildBrandCss(brandTheme, ".dd-brand-scope"), brandFontsUrl = brandTheme && brandTheme.enabled !== !1 ? parseBrandTheme(brandTheme).tokens.fonts?.googleFontsUrl : void 0, brandPal = brandPalette(brandTheme), projectName = options.projectName || "DataDash Project", customDatasetsRecords = {}, customDatasetsColumns = {};
  if (options.availableDatasets) {
    let referencedIds = new Set(
      (dashboard.charts || []).map((c) => c.datasetId).filter((id) => !!id && id !== dataset.id)
    );
    options.availableDatasets.filter((ds) => referencedIds.has(ds.id)).forEach((ds) => {
      customDatasetsRecords[ds.id] = ds.records || [], customDatasetsColumns[ds.id] = ds.columns || [];
    });
  }
  let chartsPayload = dashboard.charts.map((chart) => {
    let aggregated = [], isStructural = chart.type === "text_block" || chart.type === "callout" || chart.type === "divider", chartRecords = records;
    if (chart.datasetId && options.availableDatasets) {
      let customDataset = options.availableDatasets.find((d) => d.id === chart.datasetId);
      customDataset && (chartRecords = customDataset.records || []);
    }
    isStructural || (chart.type === "kpi" ? aggregated = computePivot(chartRecords, pivotConfigFromChart(chart, { ignoreRowKey: !0 })).rows : chart.type === "table" ? aggregated = chartRecords.slice(0, 50) : aggregated = computePivot(chartRecords, pivotConfigFromChart(chart, { defaultLimit: 15 })).rows);
    let palette = chart.colorPalette || design.paletteName || "modern";
    return {
      id: chart.id,
      title: chart.title,
      description: chart.description || "",
      type: chart.type,
      content: chart.content || "",
      calloutVariant: chart.calloutVariant || "info",
      htmlEmbedCode: chart.htmlEmbedCode || "",
      embedHeight: chart.embedHeight || 420,
      sourceCredit: chart.sourceCredit || "",
      xAxisKey: chart.xAxisKey,
      yAxisKeys: chart.yAxisKeys,
      aggregation: chart.aggregation || "sum",
      width: chart.width || "half",
      height: chart.height || "md",
      prefix: chart.prefix || "",
      suffix: chart.suffix || "",
      colors: brandPal || getPaletteColors(palette),
      data: aggregated,
      tab: chart.tab || "",
      subTab: chart.subTab || "",
      sectionTitle: chart.sectionTitle || "",
      datasetId: chart.datasetId,
      // Configuração da tabela dinâmica (o HTML recalcula com o mesmo motor do editor)
      sortBy: chart.sortBy,
      limit: chart.limit,
      selectedCategoryValues: chart.selectedCategoryValues,
      metricAggregations: chart.metricAggregations,
      pivotColKey: chart.pivotColKey,
      pivotColLimit: chart.pivotColLimit,
      isPivotTable: chart.isPivotTable,
      pivotAggregations: chart.pivotAggregations,
      yearMode: chart.yearMode
    };
  }), columnsJson = safeJson(dataset.columns), rawRecordsJson = safeJson(records), customDatasetsRecordsJson = safeJson(customDatasetsRecords), customDatasetsColumnsJson = safeJson(customDatasetsColumns), chartsJson = safeJson(chartsPayload), firebaseConfigJson = JSON.stringify({
    apiKey: firebase_applet_config_default.apiKey,
    authDomain: firebase_applet_config_default.authDomain,
    projectId: firebase_applet_config_default.projectId,
    storageBucket: firebase_applet_config_default.storageBucket,
    messagingSenderId: firebase_applet_config_default.messagingSenderId,
    appId: firebase_applet_config_default.appId
  }), bodyBgClass = "bg-slate-950 text-slate-100", bodyStyle = "";
  design.backgroundStyle === "pure_black" ? bodyBgClass = "bg-black text-slate-100" : design.backgroundStyle === "light_corporate" ? bodyBgClass = "bg-slate-100 text-slate-900" : design.backgroundStyle === "subtle_gradient" ? bodyBgClass = "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100" : design.backgroundStyle === "grid_dots" ? (bodyBgClass = "bg-slate-950 text-slate-100", bodyStyle = "background-image: radial-gradient(#1e293b 1px, transparent 1px); background-size: 16px 16px;") : design.backgroundStyle === "glass_mesh" && (bodyBgClass = "bg-slate-950 text-slate-100", bodyStyle = "background-image: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.25), rgba(255,255,255,0));");
  let radiusClass = "rounded-2xl";
  design.cardRadius === "none" ? radiusClass = "rounded-none" : design.cardRadius === "md" ? radiusClass = "rounded-md" : design.cardRadius === "xl" ? radiusClass = "rounded-xl" : design.cardRadius === "2xl" ? radiusClass = "rounded-2xl" : design.cardRadius === "3xl" && (radiusClass = "rounded-3xl");
  let cardBgClass = isDark ? design.glassmorphism ? `bg-slate-900/60 backdrop-blur-md border border-slate-800 ${radiusClass}` : `bg-slate-900 border border-slate-800 ${radiusClass}` : `bg-white border border-slate-200 ${radiusClass} shadow-sm`, hdr = options.headerConfig || dashboard.headerConfig || {
    enabled: !0,
    brandName: options.project?.name || options.projectName || dashboard.title,
    brandSubtitle: options.project?.description || "",
    navStyle: "dropdown",
    theme: "white_clean",
    sticky: !0
  }, headerIsWhite = hdr.theme !== "dark", pages = options.projectPages || [];
  return `<!DOCTYPE html>
<html lang="pt-BR" class="${isDark ? "dark" : ""}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${generateHTMLHeadSEOTags(options.project, dashboard)}
  <!-- Tailwind (mesma vers\xE3o 4 do app: editor e p\xE1gina publicada desenham igual) -->
  ${libScriptTag("tailwind", options.assets)}
  <script>
    ${RUNTIME_ESC}
  </script>
  <!-- Chart.js CDN for standalone interactive charts -->
  ${libScriptTag("chartjs", options.assets)}
  ${isLive ? `<!-- Firebase Compat SDK for real-time live data synchronization -->
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>` : ""}
  <!-- Google Fonts CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: '${design.fontFamily || "Plus Jakarta Sans"}', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    
    /* Mobile-Specific Adaptations & Accessibility Adjustments */
    @media (max-width: 640px) {
      ${hdr.mobileFontSize === "small" ? "html { font-size: 11px !important; }" : ""}
      ${hdr.mobileFontSize === "large" ? "html { font-size: 18px !important; }" : ""}
      
      ${hdr.mobileLayoutCompact ? `
        .p-4, .p-5, .p-6, .p-8, .p-12, .sm\\:p-8, .sm\\:p-6 { padding: 12px !important; }
        .rounded-2xl, .rounded-3xl { rounded-radius: 12px !important; }
        .space-y-6, .space-y-8 { margin-top: 12px !important; margin-bottom: 12px !important; }
      ` : ""}
      
      ${hdr.mobileStackedGrid ? `
        [class*="col-span-"] { grid-column: span 12 / span 12 !important; }
      ` : ""}
    }
  </style>
  ${brandFontsUrl ? `<link rel="stylesheet" href="${escapeHtml(brandFontsUrl)}">` : ""}
  ${brand.css ? `<style data-dd-brand>${brand.css}</style>` : ""}
</head>
<body class="dd-brand-scope dd-page ${bodyBgClass} min-h-screen antialiased relative" style="${bodyStyle}">

  <!-- Brand Navigation Header (Logotipo & Menu de Se\xE7\xF5es) -->
  ${hdr.enabled !== !1 ? `
  <header class="w-full ${headerIsWhite ? "bg-white border-b border-slate-200/90 text-slate-900" : "bg-slate-950 border-b border-slate-800 text-white"} shadow-xs ${hdr.sticky !== !1 ? "sticky top-0" : ""} z-50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <!-- Logo / Brand -->
      <a href="index.html" class="flex items-center gap-3 no-underline text-inherit cursor-pointer">
        ${hdr.logoUrl ? `
          <img src="${safeUrl(hdr.logoUrl)}" alt="${escapeHtml(hdr.brandName || "Logotipo")}" class="h-10 sm:h-12 w-auto object-contain" />
        ` : `
          <div class="flex flex-col">
            <span class="text-xl sm:text-2xl font-black tracking-tight leading-none ${headerIsWhite ? "text-blue-700" : "text-blue-400"}">
              ${escapeHtml(hdr.brandName || "")}
            </span>
            <span class="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-amber-500 uppercase mt-0.5">
              ${escapeHtml(hdr.brandSubtitle || "")}
            </span>
          </div>
        `}
      </a>

      <!-- Sections Menu ("Se\xE7\xF5es \u25BE") or Inline Links -->
      <div class="flex items-center gap-3">
        ${pages.length > 0 ? `
          <div class="relative inline-block text-left" id="sectionsMenuWrapper">
            <button 
              type="button" 
              onclick="var d = document.getElementById('sectionsDropdown'); d.classList.toggle('hidden');"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${headerIsWhite ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs" : "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700"}"
            >
              <span>Se\xE7\xF5es</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div id="sectionsDropdown" class="hidden absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-50 border ${headerIsWhite ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900 border-slate-800 text-slate-100"}">
              <div class="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b ${headerIsWhite ? "border-slate-100" : "border-slate-800"}">
                P\xE1ginas do Projeto (${pages.length})
              </div>
              <div class="max-h-80 overflow-y-auto py-1">
                ${pages.map((p) => `
                  <a href="${safeUrl(p.filename)}" class="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium no-underline transition-colors ${p.isCurrent ? headerIsWhite ? "bg-blue-50 text-blue-700 font-bold" : "bg-indigo-950/60 text-indigo-400 font-bold" : headerIsWhite ? "hover:bg-slate-50 text-slate-700" : "hover:bg-slate-800 text-slate-300"}">
                    <span class="truncate pr-2">${escapeHtml(p.title)}</span>
                    ${p.isCurrent ? '<span class="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>' : ""}
                  </a>
                `).join("")}
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    </div>
  </header>` : ""}

  <!-- Watermark if active -->
  ${design.watermark?.enabled && design.watermark?.text ? `
  <div style="opacity: ${design.watermark.opacity || 0.12};" class="pointer-events-none select-none z-0 ${design.watermark.position === "center_diagonal" ? "fixed inset-0 flex items-center justify-center -rotate-30 font-black text-6xl md:text-8xl tracking-widest text-slate-400 uppercase" : design.watermark.position === "bottom_right" ? "fixed bottom-6 right-6 font-bold text-sm tracking-wider uppercase text-slate-400" : design.watermark.position === "top_right" ? "fixed top-6 right-6 font-bold text-sm tracking-wider uppercase text-slate-400" : "w-full text-center py-2 font-bold text-xs tracking-wider uppercase text-slate-400"}">
    ${design.watermark.text}
  </div>` : ""}

  <div class="max-w-7xl mx-auto space-y-6 relative z-10 p-4 sm:p-6 lg:p-8">
    <!-- Header Banner -->
    <header class="dd-header ${cardBgClass} p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isDark ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border border-indigo-200"} uppercase tracking-wider">
            ${escapeHtml(dashboard.category || "Geral")}
          </span>
          <span class="text-xs text-slate-500">\u2022</span>
          <span class="text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}">Projeto: ${escapeHtml(projectName)}</span>
        </div>
        <h1 class="dd-title text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}">
          ${escapeHtml(dashboard.title)}
        </h1>
        ${dashboard.subtitle ? `
          <p class="text-sm sm:text-base ${isDark ? "text-slate-300" : "text-slate-700"} font-normal leading-relaxed mt-1 max-w-4xl">
            ${escapeHtml(dashboard.subtitle)}
          </p>
        ` : ""}
        ${dashboard.description ? `<p class="text-xs ${isDark ? "text-slate-400" : "text-slate-500"} mt-1">${escapeHtml(dashboard.description)}</p>` : ""}
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <!-- Selo para o leitor: s\xF3 no modo ao vivo (o modo est\xE1tico n\xE3o precisa de aviso) -->
        ${isLive ? `
        <div id="syncBadgeContainer" class="px-3 py-1.5 rounded-xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"} text-xs flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
          <span id="syncStatusText" class="font-medium ${isDark ? "text-slate-300" : "text-slate-700"}">Atualiza\xE7\xE3o autom\xE1tica</span>
        </div>` : ""}

        <button onclick="window.print()" class="no-print hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"} border transition-colors cursor-pointer">
          Imprimir / PDF
        </button>
      </div>
    </header>

    <!-- Live Toast Alert for auto-updates -->
    <div id="liveUpdateAlert" class="hidden transition-all duration-300 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
      <span class="flex items-center gap-2 font-semibold">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Dados atualizados agora. Os gr\xE1ficos j\xE1 mostram os n\xFAmeros novos.
      </span>
      <span id="updateTimestamp" class="font-mono text-[11px] text-emerald-300"></span>
    </div>

    <!-- Filtros do painel (ano, campos, "Dados at\xE9\u2026") -->
    <div id="ddFilterBar" role="region" aria-label="Filtros do painel" class="dd-filter-bar ${cardBgClass} px-4 py-3 shadow-lg flex flex-wrap items-end gap-4 hidden"></div>

    <!-- Busca nos dados (no celular, recolhida: abre pelo bot\xE3o "Buscar") -->
    <div id="ddSearchToolbar" class="${cardBgClass} p-4 shadow-lg hidden sm:flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        <input 
          id="globalSearch" 
          type="text" 
          placeholder="Buscar nos dados desta p\xE1gina..." 
          onkeyup="filterStandaloneData()"
          aria-label="Buscar nos dados desta p\xE1gina"
          class="${isDark ? "bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400"} border rounded-xl px-3.5 py-2 text-sm sm:text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
        />
        <span id="filteredBadge" aria-live="polite" class="hidden text-xs ${isDark ? "text-slate-400" : "text-slate-600"}"></span>
      </div>
      <div class="text-[11px] text-slate-500 font-mono">
        Fonte: <span id="datasetNameText">${escapeHtml(dataset.sourceMeta?.credito || dataset.name)}</span>
      </div>
      ${dataset.isPartial ? `<div role="note" class="mt-3 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-600 text-xs font-sans font-semibold">\u26A0\uFE0F ${escapeHtml(dataset.partialNote || "Base incompleta: totais podem n\xE3o representar a base inteira.")}</div>` : ""}
    </div>

    <!-- Dynamic Tab and Sub-Tab Navigation Bar Placeholder -->
    <div id="tabsBarContainer"></div>

    <!-- Dynamic Elements Grid -->
    <div id="chartsContainer" class="grid grid-cols-12 gap-5">
      <!-- Dynamic Charts & Structural Elements Injected via Script -->
    </div>

    <!-- Footer -->
    <footer class="pt-6 border-t ${isDark ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-400"} text-center text-xs">
      Dashboard com design personalizado \u2022 ${isLive ? "Atualiza\xE7\xE3o autom\xE1tica ativa via Firebase Firestore" : "Execu\xE7\xE3o offline"} \u2022 DataDash CMS
    </footer>
  </div>

  <!-- Embedded Data & Chart Rendering Engine -->
  <script>
    ${RUNTIME_ESC}
    let RAW_RECORDS = ${rawRecordsJson};
    const COLUMNS = ${columnsJson};
    const CHARTS_CONFIG = ${chartsJson};
    const CUSTOM_DATASETS_RECORDS = ${customDatasetsRecordsJson};
    const CUSTOM_DATASETS_COLUMNS = ${customDatasetsColumnsJson};
    const DASHBOARD_TABS = ${safeJson(dashboard.tabs || [])};
    const DASHBOARD_SUBTABS = ${safeJson(dashboard.subTabs || {})};
    let currentRecords = [...RAW_RECORDS];
    const IS_LIVE_SYNC = ${isLive ? "true" : "false"};

${ddEngineRuntime()}
${ddFilterRuntime({ config: dashboard.dashboardFilters, lastSync: dataset.lastSyncedAt, isDark, views: exportViews.views, initialView: exportViews.initialView, editionNote: exportViews.editionNote })}
    function ddOnFilterChange() { renderDashboard(); }
    function ddOnViewChange() { filterStandaloneData(); }

    function formatNumber(val, prefix = '', suffix = '') {
      if (val === undefined || val === null) return '-';
      if (typeof val === 'number') {
        let formatted = '';
        if (Math.abs(val) >= 1000000) {
          formatted = (val / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M';
        } else if (Math.abs(val) >= 10000) {
          formatted = val.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
        } else {
          formatted = val.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
        }
        return (prefix ? prefix + ' ' : '') + formatted + (suffix ? ' ' + suffix : '');
      }
      return (prefix ? prefix + ' ' : '') + val + (suffix ? ' ' + suffix : '');
    }

    function getGridWidthClass(width) {
      switch(width) {
        case 'third': return 'col-span-12 md:col-span-6 lg:col-span-4';
        case 'half': return 'col-span-12 lg:col-span-6';
        case 'two-thirds': return 'col-span-12 lg:col-span-8';
        case 'full':
        default: return 'col-span-12';
      }
    }

    const chartInstances = {};
    let activeTab = 'Geral';
    let activeSubTab = 'Geral';
    const activeChartCardTabs = {}; // Map of chart.id -> 'visual' | 'data'

    function getUniqueTabs() {
      const tabsSet = new Set();
      if (Array.isArray(DASHBOARD_TABS)) {
        DASHBOARD_TABS.forEach(t => {
          if (t && t.trim() !== '') tabsSet.add(t.trim());
        });
      }
      CHARTS_CONFIG.forEach(c => {
        if (c.tab && c.tab.trim() !== '') {
          tabsSet.add(c.tab.trim());
        }
      });
      const list = Array.from(tabsSet);
      const hasUntabbed = CHARTS_CONFIG.some(c => !c.tab || c.tab.trim() === '');
      if (hasUntabbed || list.length === 0) {
        if (!list.includes('Geral')) {
          list.unshift('Geral');
        }
      }
      return list;
    }

    function getUniqueSubTabsForTab(currentTab) {
      const subSet = new Set();
      if (DASHBOARD_SUBTABS && DASHBOARD_SUBTABS[currentTab] && Array.isArray(DASHBOARD_SUBTABS[currentTab])) {
        DASHBOARD_SUBTABS[currentTab].forEach(st => {
          if (st && st.trim() !== '') subSet.add(st.trim());
        });
      }
      CHARTS_CONFIG.forEach(c => {
        const isCurrentTab = (currentTab === 'Geral' && (!c.tab || c.tab.trim() === '')) || (c.tab === currentTab);
        if (isCurrentTab && c.subTab && c.subTab.trim() !== '') {
          subSet.add(c.subTab.trim());
        }
      });
      const list = Array.from(subSet);
      const hasUnsubtabbed = CHARTS_CONFIG.some(c => {
        const isCurrentTab = (currentTab === 'Geral' && (!c.tab || c.tab.trim() === '')) || (c.tab === currentTab);
        return isCurrentTab && (!c.subTab || c.subTab.trim() === '');
      });
      if (hasUnsubtabbed && list.length > 0 && !list.includes('Geral')) {
        list.unshift('Geral');
      }
      return list;
    }

    function renderTabsBar() {
      const tabsBar = document.getElementById('tabsBarContainer');
      if (!tabsBar) return;
      const tabsList = getUniqueTabs();
      if (tabsList.length <= 1) {
        tabsBar.innerHTML = '';
        tabsBar.className = 'hidden';
        return;
      }

      const isLight = !${isDark ? "true" : "false"};
      tabsBar.className = isLight 
        ? "relative z-10 flex flex-col gap-3.5 mb-6 bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm"
        : "relative z-10 flex flex-col gap-3.5 mb-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4.5 shadow-sm";

      const activeTabSubTabs = getUniqueSubTabsForTab(activeTab);

      // Render Tabs
      let tabsHtml = \`
        <div class="flex flex-wrap items-center gap-2 border-b \${isLight ? 'border-slate-100' : 'border-slate-800/50'} pb-2.5">
          <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-2">Guias:</span>
          \${tabsList.map(tabName => \`
            <button
              onclick="selectActiveTab('\${esc(tabName)}')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                activeTab === tabName
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }"
            >\${esc(tabName)}</button>
          \`).join('')}
        </div>
      \`;

      // Render Subtabs
      if (activeTabSubTabs.length > 1) {
        tabsHtml += \`
          <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span class="text-[9px] uppercase font-bold text-slate-500 tracking-wider mr-2">Sub-Guias:</span>
            \${activeTabSubTabs.map(subName => \`
              <button
                onclick="selectActiveSubTab('\${esc(subName)}')"
                class="px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer \${
                  activeSubTab === subName
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }"
              >\${esc(subName)}</button>
            \`).join('')}
          </div>
        \`;
      }

      tabsBar.innerHTML = tabsHtml;
    }

    function selectActiveTab(tabName) {
      activeTab = tabName;
      activeSubTab = 'Geral';
      renderTabsBar();
      renderDashboard();
    }

    function selectActiveSubTab(subName) {
      activeSubTab = subName;
      renderTabsBar();
      renderDashboard();
    }

    function toggleChartCardTab(chartId, tabState) {
      activeChartCardTabs[chartId] = tabState;
      renderDashboard();
    }

    function renderDashboard() {
      renderTabsBar();
      const container = document.getElementById('chartsContainer');
      container.innerHTML = '';

      const tabsList = getUniqueTabs();
      const activeTabSubTabs = getUniqueSubTabsForTab(activeTab);

      CHARTS_CONFIG.forEach((chart, idx) => {
        // Filter by tab
        if (tabsList.length > 1) {
          const matchesTab = (activeTab === 'Geral' && (!chart.tab || chart.tab.trim() === '')) || (chart.tab === activeTab);
          const matchesSubTab = activeTabSubTabs.length === 0 || 
            (activeSubTab === 'Geral' && (!chart.subTab || chart.subTab.trim() === '')) || 
            (chart.subTab === activeSubTab);
          if (!matchesTab || !matchesSubTab) return;
        }

        let chartRecords = currentRecords;
        let chartColumns = COLUMNS;
        if (chart.datasetId && CUSTOM_DATASETS_RECORDS[chart.datasetId]) {
          const rawCustom = CUSTOM_DATASETS_RECORDS[chart.datasetId];
          const term = document.getElementById('globalSearch')?.value?.trim()?.toLowerCase();
          if (term) {
            chartRecords = rawCustom.filter(r =>
              Object.values(r).some(v => String(v).toLowerCase().includes(term))
            );
          } else {
            chartRecords = rawCustom;
          }
          chartColumns = CUSTOM_DATASETS_COLUMNS[chart.datasetId] || COLUMNS;
        }

        // Filtros do painel + modo de ano do gr\xE1fico (seguir / comparar com anterior / ignorar)
        const ddRes = DD_FILTERS.resolveChart(chartRecords, chart, ddCtx());
        const ddCols = DD_COLUMN_TYPES.indexOf(chart.type) >= 0;
        chartRecords = (ddRes.colKeyOverride && !ddCols && ddRes.currentRecords) ? ddRes.currentRecords : ddRes.records;
        chart = Object.assign({}, chart, {
          title: DD_FILTERS.fillText(chart.title, ddRes, ddCtx()),
          description: DD_FILTERS.fillText(chart.description, ddRes, ddCtx()),
          pivotColKey: (ddRes.colKeyOverride && ddCols) ? ddRes.colKeyOverride : chart.pivotColKey
        });

        // Render Section title if defined
        if (chart.sectionTitle && chart.sectionTitle.trim() !== '') {
          const separatorCard = document.createElement('div');
          separatorCard.className = 'col-span-12 pt-6 pb-2';
          separatorCard.innerHTML = \`
            <div class="flex items-center gap-3">
              <h2 class="text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border \${
                !${isDark ? "true" : "false"}
                  ? 'bg-indigo-5 border-indigo-100 text-indigo-700'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }">
                \${esc(chart.sectionTitle)}
              </h2>
              <div class="h-[1px] flex-1 \${!${isDark ? "true" : "false"} ? 'bg-slate-200' : 'bg-slate-800/80'}"></div>
            </div>
          \`;
          container.appendChild(separatorCard);
        }

        const widthClass = getGridWidthClass(chart.width);
        const card = document.createElement('div');
        card.className = widthClass;

        if (chart.type === 'divider') {
          card.innerHTML = \`
            <div class="py-2 flex items-center gap-3">
              <div class="h-[1px] flex-1 ${isDark ? "bg-slate-800" : "bg-slate-200"}"></div>
              \${chart.title ? \`<span class="text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400 bg-slate-950 border-slate-800" : "text-slate-600 bg-slate-100 border-slate-200"} px-2.5 py-0.5 rounded-md border">\${esc(chart.title)}</span>\` : ''}
              <div class="h-[1px] flex-1 ${isDark ? "bg-slate-800" : "bg-slate-200"}"></div>
            </div>
          \`;
          container.appendChild(card);
          return;
        }

        const elemHeight = chart.height === 'sm' ? 220 : (chart.height === 'lg' ? 440 : (chart.height === 'xl' ? 580 : (typeof chart.height === 'number' ? chart.height : 320)));
        const contentMaxHeight = Math.max(120, elemHeight - 80);

        if (chart.type === 'callout') {
          const variant = chart.calloutVariant || 'info';
          let borderBg = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200';
          if (variant === 'success') borderBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
          else if (variant === 'warning') borderBg = 'bg-amber-500/10 border-amber-500/30 text-amber-200';
          else if (variant === 'purple') borderBg = 'bg-purple-500/10 border-purple-500/30 text-purple-200';

          card.innerHTML = \`
            <div class="border ${radiusClass} p-5 shadow-lg \${borderBg} flex flex-col justify-between" style="min-height: \${elemHeight}px;">
              <div>
                <h4 class="text-sm font-bold text-white tracking-tight">\${esc(chart.title)}</h4>
                <div class="text-xs ${isDark ? "text-slate-300" : "text-slate-700"} mt-2 leading-relaxed whitespace-pre-wrap overflow-y-auto" style="max-height: \${contentMaxHeight}px;">\${escMl(chart.content || chart.description)}</div>
              </div>
            </div>
          \`;
          container.appendChild(card);
          return;
        }

        if (chart.type === 'text_block') {
          card.innerHTML = \`
            <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between" style="min-height: \${elemHeight}px;">
              <div>
                <h3 class="dd-card-title text-sm font-bold ${isDark ? "text-slate-100" : "text-slate-800"} mb-2 border-b ${isDark ? "border-slate-800" : "border-slate-100"} pb-2">\${esc(chart.title)}</h3>
                <div class="text-xs ${isDark ? "text-slate-300" : "text-slate-600"} leading-relaxed whitespace-pre-wrap overflow-y-auto" style="max-height: \${contentMaxHeight}px;">\${escMl(chart.content || chart.description)}</div>
              </div>
            </div>
          \`;
          container.appendChild(card);
          return;
        }

        if (chart.type === 'html_embed') {
          const height = chart.embedHeight || elemHeight;
          card.innerHTML = \`
            <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between" style="min-height: \${elemHeight}px;">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="dd-card-title text-sm font-bold \${isDark ? 'text-slate-100' : 'text-slate-800'}">\${esc(chart.title)}</h3>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-full \${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}">Embed</span>
                </div>
                \${chart.description ? \`<p class="text-xs \${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2">\${esc(chart.description)}</p>\` : ''}
                <div class="w-full rounded-xl overflow-hidden my-2 relative" style="height: \${height}px;">
                  <iframe
                    title="\${esc(chart.title)}"
                    srcdoc="\${esc(chart.htmlEmbedCode || '')}"
                    class="w-full h-full border-0 rounded-xl"
                    sandbox="allow-scripts allow-popups allow-forms"
                  ></iframe>
                </div>
              </div>
              \${chart.sourceCredit ? \`<div class="text-[10px] text-slate-500 pt-2 border-t \${isDark ? 'border-slate-800' : 'border-slate-100'}">\${esc(chart.sourceCredit)}</div>\` : ''}
            </div>
          \`;
          container.appendChild(card);
          return;
        }

        if (chart.type === 'kpi') {
          const yKey = chart.yAxisKeys[0];
          const kpiPivot = DD_PIVOT(chartRecords, DD_PIVOT_CONFIG(chart, { ignoreRowKey: true }));
          const val = kpiPivot.rows[0] && kpiPivot.series[0] ? kpiPivot.rows[0][kpiPivot.series[0].key] : null;
          const rangePivot = DD_PIVOT(chartRecords, { values: [{ metric: yKey, aggregation: 'min' }, { metric: yKey, aggregation: 'max' }] });
          const min = rangePivot.rows[0] ? rangePivot.rows[0][yKey + '__min'] : null;
          const max = rangePivot.rows[0] ? rangePivot.rows[0][yKey + '__max'] : null;
          let kpiCompareHtml = '';
          if (ddRes.previousRecords && ddRes.previousYear !== undefined) {
            const pp = DD_PIVOT(ddRes.previousRecords, DD_PIVOT_CONFIG(chart, { ignoreRowKey: true }));
            const prev = pp.rows[0] && pp.series[0] ? pp.rows[0][pp.series[0].key] : null;
            const pct = (typeof prev === 'number' && typeof val === 'number' && prev !== 0) ? ((val - prev) / Math.abs(prev)) * 100 : null;
            const cls = pct === null ? 'text-slate-400' : (pct >= 0 ? 'is-up text-emerald-500' : 'is-down text-rose-500');
            kpiCompareHtml = '<div class="dd-kpi-compare text-[11px] font-semibold ' + cls + '">' +
              (pct !== null ? (pct >= 0 ? '\u25B2 ' : '\u25BC ') + Math.abs(pct).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '% ' : '') +
              'vs ' + ddRes.previousYear + (ddRes.periodLabel ? ' no mesmo per\xEDodo (' + ddRes.periodLabel + ')' : '') + (typeof prev === 'number' ? ' (' + esc(formatNumber(prev, chart.prefix, chart.suffix)) + ')' : ': sem dados') + '</div>';
          }

          card.innerHTML = \`
            <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between gap-3 sm:min-h-[\${elemHeight}px]">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="dd-card-title text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"} uppercase tracking-wider">\${esc(chart.title)}</h3>
                </div>
                <div class="dd-kpi-value text-3xl font-extrabold ${isDark ? "text-white" : "text-slate-900"} font-mono my-2">
                  \${esc(formatNumber(val, chart.prefix, chart.suffix))}
                </div>
                \${kpiCompareHtml}
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t ${isDark ? "border-slate-800" : "border-slate-100"}">
                <span>M\xEDn: \${esc(formatNumber(min, chart.prefix, chart.suffix))}</span>
                <span>M\xE1x: \${esc(formatNumber(max, chart.prefix, chart.suffix))}</span>
              </div>
            </div>
          \`;
        } else if (chart.type === 'table') {
          const labelsMap = DD_LABELS(chartColumns);
          const isPivotTbl = !!(chart.isPivotTable && chart.xAxisKey && chart.yAxisKeys.length > 0);
          let displayCols, rows;
          let headerLabels = labelsMap;
          if (isPivotTbl) {
            const aggs = (chart.pivotAggregations && chart.pivotAggregations.length) ? chart.pivotAggregations : ['sum'];
            const vals = [];
            chart.yAxisKeys.forEach(function (m) { aggs.forEach(function (a) { vals.push({ metric: m, aggregation: a }); }); });
            const pv = DD_PIVOT(chartRecords, { rowKey: chart.xAxisKey, colKey: chart.pivotColKey || undefined, colLimit: chart.pivotColLimit, values: vals, labels: labelsMap, sortBy: chart.sortBy });
            displayCols = [chart.xAxisKey].concat(pv.series.map(function (s) { return s.key; }));
            headerLabels = {};
            headerLabels[chart.xAxisKey] = labelsMap[chart.xAxisKey] || chart.xAxisKey;
            pv.series.forEach(function (s) { headerLabels[s.key] = s.label; });
            rows = pv.rows;
          } else {
            displayCols = chart.yAxisKeys.length > 0 ? chart.yAxisKeys : chartColumns.slice(0, 6).map(c => c.key);
            rows = chartRecords.slice(0, 10);
          }
          let tableHtml = \`
            <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between" style="min-height: \${elemHeight}px;">
              <div>
                <h3 class="dd-card-title text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"} mb-3">\${esc(chart.title)}</h3>
                <div class="overflow-x-auto overflow-y-auto rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"}" style="max-height: \${contentMaxHeight}px;">
                  <table class="w-full text-left text-xs">
                    <thead class="${isDark ? "bg-slate-950 text-slate-400" : "bg-slate-100 text-slate-600"} uppercase text-[10px] font-bold">
                      <tr>
                        <th class="py-2.5 px-3">#</th>
                        \${displayCols.map(c => \`<th class="py-2.5 px-3 whitespace-nowrap">\${esc(headerLabels[c] || c)}</th>\`).join('')}
                      </tr>
                    </thead>
                    <tbody class="divide-y ${isDark ? "divide-slate-800 text-slate-300" : "divide-slate-200 text-slate-700"} font-mono">
                      \${rows.map((row, i) => \`
                        <tr>
                          <td class="py-2 px-3 text-slate-500">\${i+1}</td>
                          \${displayCols.map(c => \`<td class="py-2 px-3 whitespace-nowrap">\${esc(row[c] === undefined || row[c] === null ? '-' : (isPivotTbl && typeof row[c] === 'number' ? formatNumber(row[c], chart.prefix, chart.suffix) : row[c]))}</td>\`).join('')}
                        </tr>
                      \`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          \`;
          card.innerHTML = tableHtml;
        } else {
          // Mesmo c\xE1lculo do editor: linhas \xD7 colunas \xD7 valores, com ordena\xE7\xE3o e limite
          const pivot = DD_PIVOT(chartRecords, DD_PIVOT_CONFIG(chart, { labels: DD_LABELS(chartColumns), defaultLimit: 15 }));
          const labels = pivot.rows.map(function (r) { return String(r.name); });
          const cardTabState = activeChartCardTabs[chart.id] || 'visual';

          // Chart.js Canvas or tabular aggregate list
          const canvasId = 'chart_canvas_' + idx;
          if (cardTabState === 'data') {
            card.innerHTML = \`
              <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between" style="min-height: \${elemHeight}px;">
                <div class="mb-3">
                  <h3 class="dd-card-title text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}">\${esc(chart.title)}</h3>
                  <p class="text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}">\${esc(chart.description)}</p>
                </div>

                <!-- Inner Tabs -->
                <div class="flex items-center gap-1.5 mb-3 border-b pb-1.5 text-[10px] ${isDark ? "border-slate-800" : "border-slate-100"}">
                  <button onclick="toggleChartCardTab('\${chart.id}', 'visual')" class="px-2.5 py-1 rounded-lg font-bold transition-all bg-transparent text-slate-400 hover:text-slate-200 cursor-pointer">\u{1F4CA} Visual (Gr\xE1fico)</button>
                  <button onclick="toggleChartCardTab('\${chart.id}', 'data')" class="px-2.5 py-1 rounded-lg font-bold transition-all bg-indigo-500/15 text-indigo-500 border border-indigo-500/20 cursor-pointer">\u{1F4CB} Dados (Tabela)</button>
                </div>

                <div class="overflow-y-auto rounded-xl border ${isDark ? "border-slate-800" : "border-slate-200"} text-[11px] font-mono" style="max-height: \${contentMaxHeight}px;">
                  <table class="w-full text-left text-xs">
                    <thead class="${isDark ? "bg-slate-950 text-slate-400 border-b border-slate-800" : "bg-slate-100 text-slate-600 border-b border-slate-200"} uppercase text-[9px] font-bold">
                      <tr>
                        <th class="py-2 px-2.5">Eixo X / Nome</th>
                        \${pivot.series.map(sr => \`<th class="py-2 px-2.5 text-right">\${esc(sr.label)}</th>\`).join('')}
                      </tr>
                    </thead>
                    <tbody class="divide-y ${isDark ? "divide-slate-800 text-slate-300" : "divide-slate-200 text-slate-700"}">
                      \${pivot.rows.map(row => \`
                          <tr>
                            <td class="py-1.5 px-2.5 font-sans font-semibold text-slate-400 truncate max-w-[120px]">\${esc(row.name)}</td>
                            \${pivot.series.map(sr => \`<td class="py-1.5 px-2.5 text-right font-medium text-indigo-500 font-mono">\${esc(formatNumber(row[sr.key], chart.prefix, chart.suffix))}</td>\`).join('')}
                          </tr>
                        \`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            \`;
            container.appendChild(card);
            return;
          } else {
            const chartHeightPx = typeof chart.height === 'number' ? (chart.height + 'px') : (chart.height === 'sm' ? '220px' : (chart.height === 'lg' ? '440px' : (chart.height === 'xl' ? '580px' : '320px')));
            card.innerHTML = \`
              <div class="dd-card ${cardBgClass} p-5 shadow-lg flex flex-col justify-between" style="min-height: \${elemHeight}px;">
                <div class="mb-3">
                  <h3 class="dd-card-title text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}">\${esc(chart.title)}</h3>
                  <p class="text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}">\${esc(chart.description)}</p>
                </div>

                <!-- Inner Tabs -->
                <div class="flex items-center gap-1.5 mb-3 border-b pb-1.5 text-[10px] ${isDark ? "border-slate-800" : "border-slate-100"}">
                  <button onclick="toggleChartCardTab('\${chart.id}', 'visual')" class="px-2.5 py-1 rounded-lg font-bold transition-all bg-indigo-500/15 text-indigo-500 border border-indigo-500/20 cursor-pointer">\u{1F4CA} Visual (Gr\xE1fico)</button>
                  <button onclick="toggleChartCardTab('\${chart.id}', 'data')" class="px-2.5 py-1 rounded-lg font-bold transition-all bg-transparent text-slate-400 hover:text-slate-200 cursor-pointer">\u{1F4CB} Dados (Tabela)</button>
                </div>

                <div style="height: \${chartHeightPx}" class="relative w-full">
                  <canvas id="\${canvasId}"></canvas>
                </div>
              </div>
            \`;
            container.appendChild(card);
          }
          const datasets = pivot.series.map((sr, yIdx) => {
            const color = chart.colors[yIdx % chart.colors.length];
            const data = pivot.rows.map(function (r) { return r[sr.key]; });

            return {
              label: sr.label,
              data: data,
              backgroundColor: (chart.type === 'pie' || chart.type === 'donut') ? chart.colors : color,
              borderColor: color,
              borderWidth: 1.5,
              borderRadius: (chart.type === 'bar' || chart.type === 'horizontal_bar') ? 6 : 0,
              fill: chart.type === 'area'
            };
          });

          const ctx = document.getElementById(canvasId).getContext('2d');
          let chartType = 'bar';
          let options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: '${isDark ? "#94a3b8" : "#475569"}', font: { size: 10 } }
              }
            },
            scales: {
              x: { ticks: { color: '${isDark ? "#94a3b8" : "#475569"}', font: { size: 10 } }, grid: { color: '${isDark ? "#1e293b" : "#f1f5f9"}' } },
              y: { ticks: { color: '${isDark ? "#94a3b8" : "#475569"}', font: { size: 10 } }, grid: { color: '${isDark ? "#1e293b" : "#f1f5f9"}' } }
            }
          };

          if (chart.type === 'horizontal_bar') {
            options.indexAxis = 'y';
          } else if (chart.type === 'line' || chart.type === 'area') {
            chartType = 'line';
          } else if (chart.type === 'donut') {
            chartType = 'doughnut';
            delete options.scales;
          } else if (chart.type === 'pie') {
            chartType = 'pie';
            delete options.scales;
          } else if (chart.type === 'radar') {
            chartType = 'radar';
            delete options.scales;
          }

          if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
          chartInstances[canvasId] = new Chart(ctx, {
            type: chartType,
            data: { labels, datasets },
            options
          });
          return;
        }

        container.appendChild(card);
      });
    }

    function filterStandaloneData() {
      const term = (document.getElementById('globalSearch')?.value || '').toLowerCase().trim();
      if (!term) {
        currentRecords = [...RAW_RECORDS];
      } else {
        currentRecords = RAW_RECORDS.filter(r => 
          Object.values(r).some(v => String(v).toLowerCase().includes(term))
        );
      }
      // Contagem s\xF3 aparece durante uma busca (resultado da busca, n\xE3o informa\xE7\xE3o t\xE9cnica)
      const fb = document.getElementById('filteredBadge');
      if (fb) {
        fb.innerText = term ? (currentRecords.length.toLocaleString('pt-BR') + (currentRecords.length === 1 ? ' resultado' : ' resultados')) : '';
        fb.classList.toggle('hidden', !term);
      }
      renderDashboard();
    }

    // Set up Live Sync with Firebase Firestore if enabled
    if (IS_LIVE_SYNC && typeof firebase !== 'undefined') {
      try {
        const config = ${firebaseConfigJson};
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        const db = firebase.app().firestore("${firebase_applet_config_default.firestoreDatabaseId}");
        const datasetId = "${isLive ? dataset.id : ""}"; // s\xF3 usado no modo ao vivo

        db.collection("datasets").doc(datasetId).onSnapshot(async (docSnapshot) => {
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            // Registros completos ficam em blocos (datasets/{id}/chunks/{versao}_{n}).
            if (data && data.storageMode === 'chunked' && data.chunkVersion && data.chunkCount > 0) {
              try {
                const chunkRefs = [];
                for (let i = 0; i < data.chunkCount; i++) {
                  chunkRefs.push(db.collection("datasets").doc(datasetId).collection("chunks").doc(data.chunkVersion + '_' + i).get());
                }
                const snaps = await Promise.all(chunkRefs);
                // Vers\xE3o trocada no meio da leitura: aguarda o pr\xF3ximo snapshot.
                if (snaps.some((sn) => !sn.exists)) return;
                data.records = snaps.reduce((acc, sn) => acc.concat(sn.data().records || []), []);
              } catch (chunkErr) {
                console.warn("Live sync: falha ao ler blocos do dataset", chunkErr);
                return;
              }
            }
            if (data && data.records && Array.isArray(data.records) && data.records.length > 0) {
              // Live Sync s\xF3 altera a vers\xE3o "Atualizado"; a edi\xE7\xE3o congelada nunca muda.
              if (DD_VIEWS) {
                DD_VIEWS.live.records = data.records;
                if (DD_VIEW !== 'live') return;
              }
              RAW_RECORDS = data.records;
              ddRefreshModel(); // novos anos/\xFAltimo dado vindos da API
              currentRecords = [...RAW_RECORDS];

              const nowStr = new Date().toLocaleTimeString('pt-BR');
              const alertBox = document.getElementById('liveUpdateAlert');
              const timeElem = document.getElementById('updateTimestamp');
              if (alertBox && timeElem) {
                timeElem.innerText = 'Recebido \xE0s ' + nowStr + ' (' + RAW_RECORDS.length + ' registros)';
                alertBox.classList.remove('hidden');
                setTimeout(() => { alertBox.classList.add('hidden'); }, 6000);
              }

              const badgeText = document.getElementById('syncStatusText');
              if (badgeText) {
                badgeText.innerText = 'Atualizado \xE0s ' + nowStr;
              }
              const datasetNameElem = document.getElementById('datasetNameText');
              if (datasetNameElem && (data.sourceMeta?.credito || data.name)) {
                datasetNameElem.innerText = data.sourceMeta?.credito || data.name;
              }

              filterStandaloneData();
            }
          }
        }, (err) => {
          console.warn("Live sync warning:", err);
          const badgeText = document.getElementById('syncStatusText');
          if (badgeText) badgeText.innerText = 'Sem conex\xE3o: exibindo a \xFAltima vers\xE3o';
        });
      } catch (e) {
        console.warn("Could not start live sync listener:", e);
      }
    }

    // Initial render
    window.addEventListener('DOMContentLoaded', function () { ddRefreshModel(); renderDashboard(); });
  </script>
</body>
</html>`;
}
function generateProjectCoverHtml(project, pages, headerConfig, assets = "cdn") {
  let hdr = headerConfig || project.headerConfig || {
    enabled: !0,
    brandName: project.name,
    brandSubtitle: project.category || "",
    navStyle: "dropdown",
    theme: "white_clean",
    sticky: !0
  }, headerIsWhite = hdr.theme !== "dark", bodyBgClass = headerIsWhite ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(project.name)} - Portal de Apresenta\xE7\xE3o</title>
  ${libScriptTag("tailwind", assets)}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    
    /* Mobile-Specific Adaptations & Accessibility Adjustments */
    @media (max-width: 640px) {
      ${hdr.mobileFontSize === "small" ? "html { font-size: 11px !important; }" : ""}
      ${hdr.mobileFontSize === "large" ? "html { font-size: 18px !important; }" : ""}
      
      ${hdr.mobileLayoutCompact ? `
        .p-4, .p-6, .p-8, .py-12, .py-20 { padding: 12px !important; }
        .rounded-2xl, .rounded-3xl { border-radius: 12px !important; }
        .space-y-6, .space-y-12 { margin-top: 12px !important; margin-bottom: 12px !important; }
      ` : ""}
      
      ${hdr.mobileStackedGrid ? `
        [class*="grid-cols-"] { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
      ` : ""}
    }
  </style>
</head>
<body class="${bodyBgClass} min-h-screen antialiased flex flex-col justify-between relative">

  <!-- Header Navigation -->
  ${hdr.enabled !== !1 ? `
  <header class="w-full ${headerIsWhite ? "bg-white border-b border-slate-200/90 text-slate-900" : "bg-slate-950 border-b border-slate-800 text-white"} shadow-xs ${hdr.sticky !== !1 ? "sticky top-0" : ""} z-50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <!-- Logo / Brand -->
      <a href="index.html" class="flex items-center gap-3 no-underline text-inherit cursor-pointer">
        ${hdr.logoUrl ? `
          <img src="${safeUrl(hdr.logoUrl)}" alt="${escapeHtml(hdr.brandName || "Logotipo")}" class="h-10 sm:h-12 w-auto object-contain" />
        ` : `
          <div class="flex flex-col">
            <span class="text-xl sm:text-2xl font-black tracking-tight leading-none ${headerIsWhite ? "text-blue-700" : "text-blue-400"}">
              ${escapeHtml(hdr.brandName || "")}
            </span>
            <span class="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-amber-500 uppercase mt-0.5">
              ${escapeHtml(hdr.brandSubtitle || "")}
            </span>
          </div>
        `}
      </a>

      <!-- Sections Dropdown Menu -->
      <div class="flex items-center gap-3">
        ${pages.length > 0 ? `
          <div class="relative inline-block text-left" id="sectionsMenuWrapper">
            <button 
              type="button" 
              onclick="var d = document.getElementById('sectionsDropdown'); d.classList.toggle('hidden');"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${headerIsWhite ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm" : "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700"}"
            >
              <span>Menu</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div id="sectionsDropdown" class="hidden absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-50 border ${headerIsWhite ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900 border-slate-800 text-slate-100"}">
              <div class="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b ${headerIsWhite ? "border-slate-100" : "border-slate-800"}">
                P\xE1ginas do Projeto (${pages.length})
              </div>
              <div class="max-h-80 overflow-y-auto py-1">
                ${pages.map((p) => `
                  <a href="${safeUrl(p.filename)}" class="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium no-underline transition-colors ${headerIsWhite ? "hover:bg-slate-50 text-slate-700" : "hover:bg-slate-800 text-slate-300"}">
                    <span class="truncate pr-2">${escapeHtml(p.title)}</span>
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                `).join("")}
              </div>
            </div>
          </div>
        ` : ""}

        ${hdr.externalLinkUrl ? `
          <a 
            href="${safeUrl(hdr.externalLinkUrl)}" 
            target="_blank"
            class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shadow-blue-500/10 no-underline cursor-pointer"
          >
            <span>${escapeHtml(hdr.externalLinkText || "Acessar Portal")}</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ` : ""}
      </div>
    </div>
  </header>
  ` : ""}

  <!-- Main Hero Area -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col justify-center space-y-12">
    
    <!-- Editorial Title & Intro -->
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${headerIsWhite ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-blue-950/60 text-blue-400 border border-blue-900/50"}">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        <span>PORTAL DE APRESENTA\xC7\xC3O OFICIAL</span>
      </div>
      
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight ${headerIsWhite ? "text-slate-900" : "text-white"}">
        ${escapeHtml(project.name)}
      </h1>
      
      <p class="text-sm sm:text-base md:text-lg leading-relaxed ${headerIsWhite ? "text-slate-600" : "text-slate-400"}">
        ${project.description || "Bem-vindo ao portal de relat\xF3rios, an\xE1lises de dados e dashboards executivos. Explore as se\xE7\xF5es abaixo para conferir as m\xE9tricas de performance compiladas."}
      </p>
    </div>

    <!-- Section Index Grid (Os relat\xF3rios em si!) -->
    <div class="space-y-6">
      <h2 class="text-xs font-black tracking-widest uppercase text-slate-500 text-center">
        P\xE1ginas e Editorias Dispon\xEDveis (${pages.length})
      </h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${pages.map((p, idx) => `
          <a 
            href="${safeUrl(p.filename)}" 
            class="group block p-6 sm:p-8 rounded-3xl border transition-all no-underline ${headerIsWhite ? "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-blue-500/40 hover:shadow-xl" : "bg-slate-900 hover:bg-slate-900/80 border-slate-800 hover:border-blue-500/40 hover:shadow-2xl"} flex flex-col justify-between h-full"
          >
            <div class="space-y-4">
              <!-- Folder index bubble -->
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono px-2.5 py-1 rounded-full ${headerIsWhite ? "bg-slate-100 text-slate-500" : "bg-slate-950 text-slate-400 border border-slate-800"}">
                  0${idx + 1} / Se\xE7\xE3o
                </span>
                <span class="text-[10px] font-bold text-blue-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Acessar 
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              
              <div class="space-y-2">
                <h3 class="text-lg sm:text-xl font-bold ${headerIsWhite ? "text-slate-950" : "text-slate-100"} group-hover:text-blue-500 transition-colors">
                  ${escapeHtml(p.title)}
                </h3>
                <p class="text-xs ${headerIsWhite ? "text-slate-500" : "text-slate-400"} line-clamp-3 leading-relaxed">
                  Confira as conclus\xF5es, gr\xE1ficos e base de dados vinculada a esta editoria.
                </p>
              </div>
            </div>

            <!-- Footer indicator bar inside card -->
            <div class="mt-6 pt-4 border-t ${headerIsWhite ? "border-slate-100" : "border-slate-800"} flex items-center justify-between text-[11px] text-slate-400">
              <span class="font-semibold text-blue-500">Explorar Relat\xF3rio</span>
              <span class="text-[10px] font-mono">HTML Standalone</span>
            </div>
          </a>
        `).join("")}
      </div>
    </div>

  </main>

  <!-- Footer block -->
  <footer class="w-full py-8 text-center text-xs border-t ${headerIsWhite ? "border-slate-200/90 text-slate-500 bg-white" : "border-slate-800 text-slate-500 bg-slate-950"}">
    <div class="max-w-7xl mx-auto px-4">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${escapeHtml(hdr.brandName || "")}. Todos os direitos reservados.</p>
      <p class="text-[10px] text-slate-400 mt-1">Gerado com o DataDash CMS \u2014 Intelig\xEAncia Anal\xEDtica Governamental e Corporativa</p>
    </div>
  </footer>

  <script>
    ${RUNTIME_ESC}
    // Close sections menu on outside click
    window.addEventListener('click', function(e) {
      var dropdown = document.getElementById('sectionsDropdown');
      var menuWrapper = document.getElementById('sectionsMenuWrapper');
      if (dropdown && menuWrapper && !menuWrapper.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  </script>
</body>
</html>`;
}
function generateStandaloneInfographicHtml(dashboard, dataset, records, options = {}) {
  let exportViews = resolveExportDataViews(dashboard, dataset, records);
  records = exportViews.records;
  let theme = options.theme || "editorial_paper", headline = options.headlineOverride || dashboard.title, projectName = options.projectName || "", themeMeta = {
    editorial_paper: {
      bodyBg: "bg-[#faf8f4] text-[#1e293b]",
      cardBg: "bg-white border border-[#e2dcd2] shadow-sm",
      kicker: "text-amber-800 font-bold",
      title: "font-serif text-slate-900",
      subtitle: "font-serif text-slate-600",
      meta: "text-slate-500",
      kpiBox: "bg-[#f5f0e6] border border-[#e6ddd0] text-slate-900",
      divider: "border-[#e2dcd2]",
      tagline: "",
      chartTextColor: "#334155",
      chartGridColor: "#e2dcd2"
    },
    clean_white: {
      bodyBg: "bg-slate-50 text-slate-900",
      cardBg: "bg-white border border-slate-200 shadow-md",
      kicker: "text-indigo-600 font-bold",
      title: "font-sans text-slate-950 font-black",
      subtitle: "font-sans text-slate-600",
      meta: "text-slate-400",
      kpiBox: "bg-indigo-50/60 border border-indigo-100 text-slate-900",
      divider: "border-slate-200",
      tagline: "",
      chartTextColor: "#0f172a",
      chartGridColor: "#e2e8f0"
    },
    dark_story: {
      bodyBg: "bg-[#090d16] text-slate-100",
      cardBg: "bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md",
      kicker: "text-cyan-400 font-bold",
      title: "font-sans text-white font-extrabold tracking-tight",
      subtitle: "font-sans text-slate-300",
      meta: "text-slate-400",
      kpiBox: "bg-slate-950/80 border border-slate-800 text-white",
      divider: "border-slate-800",
      tagline: "",
      chartTextColor: "#94a3b8",
      chartGridColor: "#1e293b"
    }
  }[theme], kpis = dashboard.charts.filter((c) => c.type === "kpi"), narratives = dashboard.charts.filter((c) => c.type !== "kpi"), ifConfig = dashboard.dashboardFilters, columnLabelsFor = (cols = []) => {
    let m = { __ano: "Ano" };
    return cols.forEach((c) => {
      m[c.key] = c.label || c.key;
    }), m;
  }, mainLabels = columnLabelsFor(dataset.columns), ifModel = filterKit.computeFilterModel(records, ifConfig, mainLabels), ifCtx = ifConfig ? { config: ifConfig, state: filterKit.initialState(ifModel, ifConfig), model: ifModel } : void 0, brandTheme = options.project?.brandTheme, brand = buildBrandCss(brandTheme, ".dd-brand-scope"), brandFontsUrl = brandTheme && brandTheme.enabled !== !1 ? parseBrandTheme(brandTheme).tokens.fonts?.googleFontsUrl : void 0, brandPal = brandPalette(brandTheme), isDarkTheme = theme === "dark_story", customDatasets = {};
  dashboard.charts.forEach((c) => {
    if (c.datasetId && c.datasetId !== dataset.id && options.availableDatasets) {
      let d = options.availableDatasets.find((x) => x.id === c.datasetId);
      d && (customDatasets[d.id] = d);
    }
  });
  let recordsFor = (c) => c.datasetId && customDatasets[c.datasetId] ? customDatasets[c.datasetId].records || [] : records, labelsFor = (c) => c.datasetId && customDatasets[c.datasetId] ? columnLabelsFor(customDatasets[c.datasetId].columns) : mainLabels, defaultPalette = theme === "editorial_paper" ? "amber" : theme === "clean_white" ? "modern" : "cyan", blockConfigs = dashboard.charts.map((c) => ({
    id: c.id,
    type: c.type,
    title: c.title,
    description: c.description || "",
    content: c.content || "",
    xAxisKey: c.xAxisKey,
    yAxisKeys: c.yAxisKeys || [],
    aggregation: c.aggregation || "sum",
    metricAggregations: c.metricAggregations,
    pivotColKey: c.pivotColKey,
    pivotColLimit: c.pivotColLimit,
    sortBy: c.sortBy,
    limit: c.limit,
    selectedCategoryValues: c.selectedCategoryValues,
    isPivotTable: c.isPivotTable,
    pivotAggregations: c.pivotAggregations,
    yearMode: c.yearMode,
    datasetId: c.datasetId && customDatasets[c.datasetId] ? c.datasetId : void 0,
    prefix: c.prefix || "",
    suffix: c.suffix || ""
  })), blockById = {};
  blockConfigs.forEach((bc, i) => {
    let c = dashboard.charts[i];
    blockById[bc.id] = infographicBlock(bc, recordsFor(c), ifCtx, labelsFor(c), filterKit, computePivot, pivotConfigFromChart, formatMetricValue);
  });
  let colorsById = {};
  dashboard.charts.forEach((c) => {
    colorsById[c.id] = brandPal || getPaletteColors(c.colorPalette || defaultPalette);
  });
  let kpiData = kpis.map((kpi) => ({ kpi, block: blockById[kpi.id] })), narrativeChartsPayload = narratives.map((chart) => ({
    id: chart.id,
    type: chart.type,
    tab: chart.tab || "",
    sectionTitle: chart.sectionTitle || "",
    sourceCredit: chart.sourceCredit || "",
    htmlEmbedCode: chart.htmlEmbedCode || "",
    calloutVariant: chart.calloutVariant || "info",
    block: blockById[chart.id]
  })), nowFormatted = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(headline)} | Infogr\xE1fico Especial</title>
  ${libScriptTag("tailwind", options.assets)}
  ${libScriptTag("chartjs", options.assets)}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
      .print-border { border-color: #ccc !important; }
    }
  </style>
  ${brandFontsUrl ? `<link rel="stylesheet" href="${escapeHtml(brandFontsUrl)}">` : ""}
  ${brand.css ? `<style data-dd-brand>${brand.css}</style>` : ""}
</head>
<body class="dd-brand-scope dd-page ${themeMeta.bodyBg} min-h-screen py-8 px-4 sm:px-6 lg:px-8 antialiased selection:bg-amber-500/20">

  <!-- Floating Print & Actions Header (Hidden in Print) -->
  <div class="no-print max-w-4xl mx-auto mb-6 hidden sm:flex items-center justify-end">
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-3 py-1.5 rounded-xl border ${themeMeta.divider} ${themeMeta.cardBg} text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer" title="Imprimir em papel ou salvar como PDF">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
        <span>Imprimir / PDF</span>
      </button>
    </div>
  </div>

  <article class="max-w-4xl mx-auto space-y-12">
    <!-- 1. Editorial Header -->
    <header class="dd-header border-b ${themeMeta.divider} pb-8 text-center space-y-4">
      <div class="flex items-center justify-center gap-2">
        ${[projectName, dashboard.category].filter(Boolean).length ? `<span class="text-[11px] font-extrabold uppercase tracking-widest ${themeMeta.kicker}">
          ${escapeHtml([projectName, dashboard.category].filter(Boolean).join(" \xB7 "))}
        </span>` : ""}
      </div>

      <h1 class="dd-title text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] ${themeMeta.title}">
        ${escapeHtml(headline)}
      </h1>

      ${dashboard.subtitle ? `<p class="dd-subtitle text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed italic ${themeMeta.subtitle}">${escapeHtml(dashboard.subtitle)}</p>` : ""}

      <div class="flex flex-wrap items-center justify-center gap-2.5 text-xs pt-3 font-sans ${themeMeta.meta}">
        <span>Por ${escapeHtml(dashboard.authorByline || "Reda\xE7\xE3o de Dados")}</span>
        <span aria-hidden="true">\xB7</span>
        <span>Fonte: <strong>${escapeHtml(dataset.sourceMeta?.credito || dataset.name)}</strong></span>
        <span aria-hidden="true">\xB7</span>
        <span>Publicado em ${nowFormatted}</span>
      </div>
      ${dataset.isPartial ? `<div role="note" class="mt-3 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-600 text-xs font-sans font-semibold">\u26A0\uFE0F ${escapeHtml(dataset.partialNote || "Base incompleta: totais podem n\xE3o representar a base inteira.")}</div>` : ""}
    </header>

    <!-- Filtros do painel (ano, campos, "Dados at\xE9\u2026") -->
    <div id="ddFilterBar" role="region" aria-label="Filtros do infogr\xE1fico" class="dd-filter-bar rounded-2xl ${themeMeta.cardBg} px-4 py-3 flex flex-wrap items-end gap-4 hidden"></div>

    <!-- 2. Highlights / KPIs -->
    ${kpiData.length > 0 ? `
    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-extrabold uppercase tracking-wider ${themeMeta.kicker}">
          Destaques em N\xFAmeros
        </span>
        <div class="h-[1px] flex-1 ${themeMeta.divider} border-t"></div>
      </div>
      <div class="grid gap-4 ${kpiData.length === 1 ? "grid-cols-1 max-w-md mx-auto" : kpiData.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}">
        ${kpiData.map(({ kpi, block }) => `
          <div class="dd-card rounded-2xl p-5 ${themeMeta.kpiBox} shadow-xs">
            <span class="dd-card-title text-xs uppercase font-bold tracking-wider opacity-70 block mb-1" data-dd-title="${escapeHtml(kpi.id)}">${escapeHtml(block.title)}</span>
            <div class="dd-kpi-value text-3xl sm:text-4xl font-black font-mono tracking-tight my-1" data-dd-kpi="${escapeHtml(kpi.id)}">${escapeHtml(block.valueText)}</div>
            <div class="dd-kpi-compare text-xs font-semibold ${block.compare ? block.compare.trend === "up" ? "is-up text-emerald-600" : block.compare.trend === "down" ? "is-down text-rose-600" : "opacity-70" : "hidden"}" data-dd-compare="${escapeHtml(kpi.id)}">${block.compare ? escapeHtml(block.compare.text) : ""}</div>
            <p class="dd-card-description text-xs opacity-80 mt-2 leading-relaxed ${block.description ? "" : "hidden"}" data-dd-desc="${escapeHtml(kpi.id)}">${escapeHtml(block.description)}</p>
          </div>
        `).join("")}
      </div>
    </section>
    ` : ""}

    <!-- 3. Narrative Story Chapters -->
    <section class="space-y-12">
      ${narrativeChartsPayload.map((chart, idx) => {
    let b = chart.block, chapterNum = String(idx + 1).padStart(2, "0"), idAttr = escapeHtml(chart.id);
    if (chart.type === "divider")
      return `
            <div class="py-4 flex items-center gap-3">
              <div class="h-[1px] flex-1 ${themeMeta.divider} border-t"></div>
              ${b.title ? `<span class="dd-section-title text-xs font-bold uppercase tracking-wider ${themeMeta.kicker} px-3 py-1 rounded-full ${themeMeta.cardBg}" data-dd-title="${idAttr}">${escapeHtml(b.title)}</span>` : ""}
              <div class="h-[1px] flex-1 ${themeMeta.divider} border-t"></div>
            </div>
          `;
    if (chart.type === "callout" || chart.type === "text_block") {
      let isCallout = chart.type === "callout";
      return `
            <div class="dd-card rounded-3xl ${isCallout ? "p-6 border-l-4 border-l-amber-600 space-y-2" : "p-6 md:p-8 space-y-3"} ${themeMeta.cardBg}">
              <h3 class="dd-card-title ${isCallout ? "text-lg" : "text-xl"} font-bold ${themeMeta.title}" data-dd-title="${idAttr}">${escapeHtml(b.title)}</h3>
              <div class="dd-card-description text-sm leading-relaxed ${isCallout ? "" : "prose max-w-none"} ${themeMeta.subtitle}" data-dd-content="${idAttr}">${escapeMultiline(b.content)}</div>
            </div>
          `;
    }
    let visual = "";
    return chart.type === "table" ? visual = `
              <div class="overflow-x-auto max-h-96">
                <table class="dd-table w-full text-xs text-left">
                  <thead class="border-b ${themeMeta.divider} uppercase font-bold text-[10px] opacity-70" data-dd-thead="${idAttr}">
                    <tr>${(b.headers || []).map((h) => `<th class="py-2 px-3">${escapeHtml(h)}</th>`).join("")}</tr>
                  </thead>
                  <tbody class="divide-y ${themeMeta.divider}" data-dd-tbody="${idAttr}">
                    ${(b.rows || []).map((row) => `<tr>${row.map((v) => `<td class="py-2 px-3 whitespace-nowrap">${escapeHtml(v)}</td>`).join("")}</tr>`).join("")}
                  </tbody>
                </table>
              </div>` : chart.type === "html_embed" ? visual = `<iframe title="${escapeHtml(b.title || "Conte\xFAdo incorporado")}" class="w-full rounded-xl border-0" style="height: 420px" sandbox="allow-scripts allow-popups allow-forms" srcdoc="${escapeHtml(chart.htmlEmbedCode)}"></iframe>` : visual = `
              <div class="relative w-full h-80 sm:h-96">
                <canvas id="canvas_${idAttr}" role="img" aria-label="${escapeHtml(b.title)}"></canvas>
              </div>`, `
          <div class="dd-card rounded-3xl p-6 md:p-8 ${themeMeta.cardBg} space-y-6">
            <div class="border-b ${themeMeta.divider} pb-4 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold tracking-widest uppercase ${themeMeta.kicker}">
                  ${chapterNum}. ${escapeHtml(chart.tab || "Panorama")}
                </span>
                ${chart.sectionTitle ? `<span class="dd-section-title text-[10px] font-semibold text-slate-400">${escapeHtml(chart.sectionTitle)}</span>` : ""}
              </div>
              <h3 class="dd-card-title text-xl sm:text-2xl font-bold tracking-tight ${themeMeta.title}" data-dd-title="${idAttr}">${escapeHtml(b.title)}</h3>
              <p class="dd-card-description text-xs sm:text-sm leading-relaxed max-w-2xl ${themeMeta.subtitle} ${b.description ? "" : "hidden"}" data-dd-desc="${idAttr}">${escapeHtml(b.description)}</p>
            </div>
            ${visual}
            <div class="pt-3 border-t ${themeMeta.divider} flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <span class="dd-source font-mono text-[10px] opacity-75">${escapeHtml(chart.sourceCredit || `Fonte: ${dataset.name}`)}</span>
            </div>
          </div>
        `;
  }).join("")}
    </section>

    <!-- 4. Editorial Footer -->
    <footer class="dd-footer border-t ${themeMeta.divider} pt-10 pb-16 text-center space-y-4">
      <div class="flex items-center justify-center gap-2">
        <span class="text-[11px] font-bold uppercase tracking-wider ${themeMeta.kicker}">
          DataDash Studio \xB7 Intelig\xEAncia Visual & Dados P\xFAblicos
        </span>
      </div>
      <p class="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
        Este infogr\xE1fico foi gerado a partir da base <strong>${escapeHtml(dataset.name)}</strong>. As m\xE9tricas s\xE3o calculadas automaticamente; confira os valores na fonte original.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2">
        <span>Fonte: ${escapeHtml(dataset.sourceMeta?.credito || dataset.name)}</span>
        <span>\xB7</span>
        <span>Publicado em ${nowFormatted}</span>
      </div>
    </footer>
  </article>

  <script>
    ${RUNTIME_ESC}
    // Dados e configura\xE7\xE3o dos blocos (a p\xE1gina recalcula tudo ao trocar os filtros)
    let RAW_RECORDS = ${safeJson(records)};
    const COLUMNS = ${safeJson(dataset.columns || [])};
    const IF_CUSTOM = ${safeJson(Object.fromEntries(Object.values(customDatasets).map((d) => [d.id, { records: d.records || [], columns: d.columns || [] }])))};
    const IF_BLOCKS = ${safeJson(blockConfigs)};
    const IF_COLORS = ${safeJson(colorsById)};
    const TEXT_COLOR = '${themeMeta.chartTextColor}';
    const GRID_COLOR = '${themeMeta.chartGridColor}';
${ddEngineRuntime()}
${ddFilterRuntime({ config: ifConfig, lastSync: dataset.lastSyncedAt, isDark: isDarkTheme, views: exportViews.views, initialView: exportViews.initialView, editionNote: exportViews.editionNote })}
    const IF_BLOCK = (${infographicBlock.toString()});
    const IF_CHARTS = {};

    function ifRecords(c) { return c.datasetId && IF_CUSTOM[c.datasetId] ? IF_CUSTOM[c.datasetId].records : RAW_RECORDS; }
    function ifLabels(c) {
      const m = DD_LABELS(c.datasetId && IF_CUSTOM[c.datasetId] ? IF_CUSTOM[c.datasetId].columns : COLUMNS);
      m.__ano = 'Ano';
      return m;
    }
    function ifSetText(attr, id, text, hideWhenEmpty) {
      document.querySelectorAll('[' + attr + '="' + id + '"]').forEach(function (el) {
        el.textContent = text || '';
        if (hideWhenEmpty) el.classList.toggle('hidden', !text);
      });
    }
    function ifDraw(c, b) {
      const canvas = document.getElementById('canvas_' + c.id);
      if (!canvas || !b.series) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let chartType = 'bar';
      if (c.type === 'line' || c.type === 'area') chartType = 'line';
      else if (c.type === 'pie') chartType = 'pie';
      else if (c.type === 'donut' || c.type === 'doughnut') chartType = 'doughnut';
      else if (c.type === 'radar') chartType = 'radar';
      const colors = IF_COLORS[c.id] || ['#4f46e5'];
      const datasets = b.series.map(function (sr, idx) {
        const color = colors[idx % colors.length];
        return {
          label: sr.label,
          data: sr.data,
          backgroundColor: (chartType === 'pie' || chartType === 'doughnut') ? colors : (c.type === 'area' ? color + '40' : color + 'cc'),
          borderColor: (chartType === 'pie' || chartType === 'doughnut') ? '#ffffff' : color,
          borderWidth: 2,
          fill: c.type === 'area',
          tension: 0.35
        };
      });
      if (IF_CHARTS[c.id]) IF_CHARTS[c.id].destroy();
      IF_CHARTS[c.id] = new Chart(ctx, {
        type: chartType,
        data: { labels: b.labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: c.type === 'horizontal_bar' ? 'y' : 'x',
          plugins: {
            legend: {
              display: b.series.length > 1 || chartType === 'pie' || chartType === 'doughnut',
              labels: { color: TEXT_COLOR, font: { family: 'Inter', size: 11, weight: '600' } }
            },
            tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: 10, cornerRadius: 8 }
          },
          scales: (chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar') ? undefined : {
            x: { grid: { color: GRID_COLOR, drawBorder: false }, ticks: { color: TEXT_COLOR, font: { family: 'Inter', size: 10, weight: '500' } } },
            y: { grid: { color: GRID_COLOR, drawBorder: false }, ticks: { color: TEXT_COLOR, font: { family: 'JetBrains Mono', size: 10 } } }
          }
        }
      });
    }
    function ifRenderAll() {
      IF_BLOCKS.forEach(function (c) {
        const b = IF_BLOCK(c, ifRecords(c), ddCtx(), ifLabels(c), DD_FILTERS, DD_PIVOT, DD_PIVOT_CONFIG, DD_FMT);
        ifSetText('data-dd-title', c.id, b.title, false);
        ifSetText('data-dd-desc', c.id, b.description, true);
        if (b.content !== undefined) {
          document.querySelectorAll('[data-dd-content="' + c.id + '"]').forEach(function (el) { el.innerHTML = escMl(b.content); });
        }
        if (c.type === 'kpi') {
          ifSetText('data-dd-kpi', c.id, b.valueText, false);
          document.querySelectorAll('[data-dd-compare="' + c.id + '"]').forEach(function (el) {
            el.classList.remove('is-up', 'is-down', 'text-emerald-600', 'text-rose-600', 'opacity-70', 'hidden');
            if (!b.compare) { el.textContent = ''; el.classList.add('hidden'); return; }
            el.textContent = b.compare.text;
            if (b.compare.trend === 'up') el.classList.add('is-up', 'text-emerald-600');
            else if (b.compare.trend === 'down') el.classList.add('is-down', 'text-rose-600');
            else el.classList.add('opacity-70');
          });
        } else if (c.type === 'table') {
          document.querySelectorAll('[data-dd-thead="' + c.id + '"]').forEach(function (el) {
            el.innerHTML = '<tr>' + (b.headers || []).map(function (h) { return '<th class="py-2 px-3">' + esc(h) + '</th>'; }).join('') + '</tr>';
          });
          document.querySelectorAll('[data-dd-tbody="' + c.id + '"]').forEach(function (el) {
            el.innerHTML = (b.rows || []).map(function (row) {
              return '<tr>' + row.map(function (v) { return '<td class="py-2 px-3 whitespace-nowrap">' + esc(v) + '</td>'; }).join('') + '</tr>';
            }).join('');
          });
        } else if (b.series) {
          ifDraw(c, b);
        }
      });
    }
    function ddOnFilterChange() { ifRenderAll(); }

    window.addEventListener('DOMContentLoaded', function () { ddRefreshModel(); ifRenderAll(); });
  </script>
</body>
</html>`;
}
var RUNTIME_ESC, init_htmlGenerator = __esm({
  "src/lib/htmlGenerator.ts"() {
    init_chartCalculators();
    init_designSystem();
    init_seoManager();
    init_dashboardFilters();
    init_infographicBlocks();
    init_editionRevision();
    init_brandTheme();
    init_cdnLibs();
    init_firebase_applet_config();
    RUNTIME_ESC = `function esc(v){return String(v===undefined||v===null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
    function escMl(v){return esc(v).replace(/\\n/g,'<br>');}`;
  }
});

// src/lib/projectSite.ts
function normalizeBaseUrl(raw) {
  let s = (raw || "").trim();
  if (!s) return "";
  try {
    let u = new URL(s);
    return u.protocol !== "https:" ? "" : u.toString().replace(/[?#].*$/, "").replace(/\/?$/, "/");
  } catch {
    return "";
  }
}
function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function projectPageFilenames(dashboards, headerConfig) {
  let used = new Set(headerConfig?.includeCover ? ["index.html"] : []), out = /* @__PURE__ */ new Map();
  return dashboards.forEach((dash, index) => {
    let name;
    if (!headerConfig?.includeCover && (headerConfig?.coverDashboardId ? headerConfig.coverDashboardId === dash.id : index === 0)) name = "index.html";
    else {
      let base = slugify(dash.slug || dash.title || "") || `pagina-${index + 1}`;
      name = `${base}.html`;
      let n = 2;
      for (; used.has(name); ) name = `${base}-${n++}.html`;
    }
    used.add(name), out.set(dash.id, name);
  }), out;
}
function brandColors(project) {
  let tokens = project.brandTheme && project.brandTheme.enabled !== !1 ? parseBrandTheme(project.brandTheme).tokens : {};
  return {
    theme: tokens.colors?.primary || "#1d4ed8",
    background: tokens.colors?.background || "#ffffff"
  };
}
function initials(name) {
  let words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return (words.length >= 2 ? words[0][0] + words[1][0] : (words[0] || "DD").slice(0, 2)).toUpperCase();
}
function fallbackIconSvg(name, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="${esc(color)}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-weight="700" font-size="220" fill="#fff">${esc(initials(name))}</text></svg>`;
}
function dataUrlToBase64(dataUrl) {
  let m = (dataUrl || "").match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
  return m ? m[1] : null;
}
function buildManifest(project, entry, hasPng) {
  let { theme, background } = brandColors(project), shortName = (project.publishConfig?.shortName || project.name).slice(0, 24), icons = hasPng ? [
    { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ] : [{ src: "icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }];
  return JSON.stringify({
    name: project.name,
    short_name: shortName,
    description: project.description || project.seoConfig?.metaDescription || "",
    lang: "pt-BR",
    dir: "ltr",
    start_url: `./${entry}`,
    scope: "./",
    display: "standalone",
    background_color: background,
    theme_color: theme,
    icons
  }, null, 2);
}
function buildServiceWorker(cachePrefix, buildId, coreFiles) {
  return `/* Service worker do projeto (gerado pelo DataDash Studio). */
const PREFIX = ${JSON.stringify(cachePrefix)};
const CACHE = PREFIX + ${JSON.stringify(buildId)};
const CORE = ${JSON.stringify(coreFiles)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isPage(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && isPage(request)) {
    // Rede primeiro: o leitor sempre recebe os dados mais novos quando h\xE1 conex\xE3o.
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('offline.html')))
    );
    return;
  }

  // Demais arquivos (scripts, fontes, \xEDcones, inclusive de CDNs): cache com atualiza\xE7\xE3o em segundo plano.
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((hit) => {
        const update = fetch(request).then((res) => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
          return res;
        }).catch(() => hit);
        return hit || update;
      })
    )
  );
});
`;
}
function buildSiteRuntime() {
  return `/* Runtime do site do projeto (gerado pelo DataDash Studio). */
(function () {
  var inFrame = window.parent !== window;
  var page = (location.pathname.split('/').pop() || 'index.html');

  // 1) Embed: informa a altura e a p\xE1gina atual a quem incorporou (embed.js)
  if (inFrame) {
    var last = 0;
    var send = function () {
      var h = Math.ceil(Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0));
      if (Math.abs(h - last) > 2) { last = h; window.parent.postMessage({ source: 'datadash', type: 'height', height: h }, '*'); }
    };
    window.parent.postMessage({ source: 'datadash', type: 'page', page: page, title: document.title }, '*');
    window.addEventListener('load', send);
    if (window.ResizeObserver) new ResizeObserver(send).observe(document.documentElement);
    setInterval(send, 1500);
  }

  // 2) PWA: s\xF3 na p\xE1gina aberta diretamente, com HTTPS (regra dos navegadores)
  var secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!inFrame && secure && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); });
  }

  // 3) Faixa "Instalar app": discreta, no rodap\xE9, sem cobrir o conte\xFAdo; "Agora n\xE3o" vale por 30 dias
  if (!inFrame) {
    var KEY = 'dd-install-dispensado';
    var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
    var dismissed = false;
    try { dismissed = Date.now() - Number(localStorage.getItem(KEY) || 0) < 30 * 864e5; } catch (e) {}
    var deferred = null;
    var close = function (remember) {
      var bar = document.getElementById('dd-install');
      if (bar) { bar.remove(); document.body.style.paddingBottom = ''; }
      if (remember) { dismissed = true; try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
    };
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      try { dismissed = dismissed || Date.now() - Number(localStorage.getItem(KEY) || 0) < 30 * 864e5; } catch (e2) {}
      if (standalone || dismissed || document.getElementById('dd-install')) return;
      var bar = document.createElement('div');
      bar.id = 'dd-install';
      bar.className = 'dd-install no-print';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Instalar como aplicativo');
      bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:rgba(255,255,255,.97);border-top:1px solid #e2e8f0;box-shadow:0 -4px 16px rgba(15,23,42,.08);font:500 14px system-ui,sans-serif;color:#1e293b';
      var txt = document.createElement('span');
      txt.textContent = 'Acesse mais r\xE1pido pelo celular';
      txt.style.cssText = 'flex:0 1 auto;min-width:0';
      var ok = document.createElement('button');
      ok.type = 'button';
      ok.textContent = 'Instalar app';
      ok.style.cssText = 'padding:8px 14px;border-radius:999px;border:0;font:600 14px system-ui,sans-serif;color:#fff;background:var(--dd-primary,#1d4ed8);cursor:pointer';
      ok.onclick = function () { if (!deferred) return; deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; close(false); }); };
      var no = document.createElement('button');
      no.type = 'button';
      no.textContent = 'Agora n\xE3o';
      no.style.cssText = 'padding:8px 10px;border:0;background:transparent;font:500 14px system-ui,sans-serif;color:#475569;cursor:pointer';
      no.onclick = function () { close(true); };
      bar.appendChild(txt); bar.appendChild(ok); bar.appendChild(no);
      document.body.appendChild(bar);
      // Reserva espa\xE7o no fim da p\xE1gina para a faixa n\xE3o cobrir o conte\xFAdo
      document.body.style.paddingBottom = bar.offsetHeight + 'px';
    });
    window.addEventListener('appinstalled', function () { close(false); });
  }
})();
`;
}
function buildEmbedScript() {
  return `/* Embed do projeto (gerado pelo DataDash Studio).
   Uso no CMS:
   <div class="dd-embed" data-pagina="receitas.html"></div>
   <script src="https://ENDERECO-DO-PROJETO/embed.js" async></script>
   data-pagina \xE9 opcional (padr\xE3o: index.html). O par\xE2metro ?pagina=arquivo.html na URL do CMS tamb\xE9m funciona. */
(function () {
  var script = document.currentScript || (function () { var s = document.querySelectorAll('script[src*="embed.js"]'); return s[s.length - 1]; })();
  if (!script) return;
  var base = new URL('.', script.src);
  var valid = /^[a-z0-9_-]+\\.html$/i;

  function init(el) {
    if (el.getAttribute('data-dd-ready')) return;
    el.setAttribute('data-dd-ready', '1');
    var fromUrl = new URLSearchParams(location.search).get('pagina') || (location.hash.match(/pagina=([^&]+)/) || [])[1];
    var page = el.getAttribute('data-pagina') || fromUrl || 'index.html';
    if (!valid.test(page)) page = 'index.html';
    var iframe = document.createElement('iframe');
    iframe.src = new URL(page, base).toString();
    iframe.title = el.getAttribute('data-titulo') || 'Conte\xFAdo interativo';
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'width:100%;border:0;display:block;min-height:' + (el.getAttribute('data-altura-minima') || '600') + 'px';
    el.appendChild(iframe);
    window.addEventListener('message', function (ev) {
      if (ev.origin !== base.origin || ev.source !== iframe.contentWindow || !ev.data || ev.data.source !== 'datadash') return;
      if (ev.data.type === 'height' && ev.data.height > 0) iframe.style.height = ev.data.height + 'px';
      if (ev.data.type === 'page' && el.getAttribute('data-sincronizar-url') === 'true' && valid.test(ev.data.page)) {
        history.replaceState(null, '', '#pagina=' + ev.data.page);
      }
    });
  }
  document.querySelectorAll('.dd-embed').forEach(init);
})();
`;
}
function injectSiteTags(html, o) {
  let out = html, abs = o.baseUrl ? new URL(o.file === "index.html" ? "" : o.file, o.baseUrl).toString() : "";
  abs && (out = out.replace(/<meta property="og:url"[^>]*>\s*/g, ""));
  let head = [
    `<meta name="theme-color" content="${esc(o.themeColor)}">`,
    o.pwa ? '<link rel="manifest" href="./manifest.webmanifest">' : "",
    o.pwa ? o.hasPngIcon ? '<link rel="apple-touch-icon" href="./icons/icon-192.png">' : '<link rel="icon" href="./icons/icon.svg" type="image/svg+xml">' : "",
    o.pwa ? '<meta name="apple-mobile-web-app-capable" content="yes">' : "",
    abs ? `<link rel="canonical" href="${esc(abs)}">` : "",
    abs ? `<meta property="og:url" content="${esc(abs)}">` : ""
  ].filter(Boolean).join(`
  `);
  out = out.includes("</head>") ? out.replace("</head>", `  ${head}
</head>`) : head + out;
  let body = '<script src="./dd-site.js" defer></script>';
  return out = out.includes("</body>") ? out.replace(/<\/body>(?![\s\S]*<\/body>)/, `${body}
</body>`) : out + body, out;
}
function sitemapXml(baseUrl, files, now) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((f) => `  <url><loc>${esc(new URL(f === "index.html" ? "" : f, baseUrl).toString())}</loc><lastmod>${now.slice(0, 10)}</lastmod></url>`).join(`
`)}
</urlset>
`;
}
function embedCodesText(baseUrl, pages) {
  let b = baseUrl || "https://ENDERECO-DO-PROJETO/";
  return `C\xD3DIGOS DE INCORPORA\xC7\xC3O (cole numa p\xE1gina em branco do CMS)
${baseUrl ? "" : `
\u26A0 Endere\xE7o de publica\xE7\xE3o ainda n\xE3o definido: troque "https://ENDERECO-DO-PROJETO/" pelo endere\xE7o final
   (ou defina-o em Configura\xE7\xF5es do projeto \u2192 Publica\xE7\xE3o e gere o pacote de novo).
`}
1) PROJETO INTEIRO (capa + navega\xE7\xE3o entre p\xE1ginas, altura autom\xE1tica)

<div class="dd-embed"></div>
<script src="${b}embed.js" async></script>

2) UMA P\xC1GINA ESPEC\xCDFICA

${pages.map((p) => `\u2022 ${p.title}
<div class="dd-embed" data-pagina="${p.filename}"></div>
<script src="${b}embed.js" async></script>`).join(`

`)}

OP\xC7\xD5ES
\u2022 data-titulo="\u2026"            t\xEDtulo do quadro (acessibilidade)
\u2022 data-altura-minima="800"   altura inicial em pixels (padr\xE3o 600)
\u2022 data-sincronizar-url="true" mostra a p\xE1gina atual na URL do CMS (#pagina=\u2026), \xFAtil para compartilhar
\u2022 Link direto: a URL do CMS com ?pagina=arquivo.html abre o projeto j\xE1 naquela p\xE1gina.

APP INSTAL\xC1VEL (PWA)
O projeto pode ser instalado no celular a partir do endere\xE7o pr\xF3prio: ${b}
O bot\xE3o "Instalar app" aparece sozinho quando o navegador permite. Dentro do quadro do CMS a instala\xE7\xE3o n\xE3o \xE9 poss\xEDvel (regra dos navegadores);
por isso, vale incluir na p\xE1gina do CMS um link "Abrir o app" para ${b}
`;
}
function buildProjectSite(project, dashboards, datasets, recordsMap, headerConfig, opts = {}) {
  let now = opts.now || /* @__PURE__ */ new Date(), buildId = now.getTime().toString(36), pub = project.publishConfig || {}, baseUrl = normalizeBaseUrl(pub.baseUrl), pwa = pub.pwa !== !1, { theme } = brandColors(project), assets = opts.vendor ? "vendor" : "cdn", names = projectPageFilenames(dashboards, headerConfig), p192 = pwa ? dataUrlToBase64(opts.icons?.png192 || pub.iconPng192) : null, p512 = pwa ? dataUrlToBase64(opts.icons?.png512 || pub.iconPng512) : null, hasPng = !!(p192 && p512), projectPages = dashboards.map((d) => ({ id: d.id, title: d.title, slug: d.slug, filename: names.get(d.id) })), files = [], pages = [];
  for (let dash of dashboards) {
    let filename = names.get(dash.id), dataset = datasets.find((d) => d.id === dash.datasetId) || datasets[0] || { id: "default", name: "Base", columns: [], records: [], ownerId: "", rowCount: 0, columnCount: 0, createdAt: "", updatedAt: "" }, records = recordsMap[dash.datasetId] || dataset.records || [], html = generateStandaloneHtml(dash, dataset, records, {
      projectName: project.name,
      project,
      syncMode: "static",
      headerConfig: headerConfig || project.headerConfig,
      projectPages: projectPages.map((p) => ({ ...p, isCurrent: p.id === dash.id })),
      availableDatasets: datasets,
      assets,
      // Páginas criadas como infográfico saem como infográfico (antes, tudo virava painel)
      viewFormat: dash.kind === "infographic" ? "infographic" : "dashboard"
    });
    files.push({ path: filename, content: injectSiteTags(html, { file: filename, baseUrl, pwa, themeColor: theme, title: dash.title, hasPngIcon: hasPng }) }), pages.push({ title: dash.title, filename, dashboardId: dash.id });
  }
  if (headerConfig?.includeCover) {
    let cover = generateProjectCoverHtml(project, projectPages, headerConfig, assets);
    files.push({ path: "index.html", content: injectSiteTags(cover, { file: "index.html", baseUrl, pwa, themeColor: theme, title: project.name, hasPngIcon: hasPng }) });
  }
  let htmlFiles = files.map((f) => f.path);
  if (files.push({ path: "dd-site.js", content: buildSiteRuntime() }), opts.vendor && (files.push({ path: PAGE_LIBS.chartjs.file, content: opts.vendor.chartJs }), files.push({ path: PAGE_LIBS.tailwind.file, content: opts.vendor.tailwind })), files.push({ path: "embed.js", content: buildEmbedScript() }), pwa) {
    hasPng && (files.push({ path: "icons/icon-192.png", content: p192, base64: !0 }), files.push({ path: "icons/icon-512.png", content: p512, base64: !0 })), files.push({ path: "icons/icon.svg", content: fallbackIconSvg(project.name, theme) }), files.push({ path: "manifest.webmanifest", content: buildManifest(project, "index.html", hasPng) }), files.push({ path: "offline.html", content: OFFLINE_HTML(project.name, theme) });
    let core = [
      ...htmlFiles,
      "offline.html",
      "dd-site.js",
      "manifest.webmanifest",
      ...opts.vendor ? [PAGE_LIBS.chartjs.file, PAGE_LIBS.tailwind.file] : [],
      ...hasPng ? ["icons/icon-192.png", "icons/icon-512.png"] : ["icons/icon.svg"]
    ];
    files.push({ path: "sw.js", content: buildServiceWorker(`dd-site-${slugify(project.id || project.name)}-`, buildId, core) });
  }
  return baseUrl && (files.push({ path: "sitemap.xml", content: sitemapXml(baseUrl, htmlFiles, now.toISOString()) }), files.push({ path: "robots.txt", content: `User-agent: *
Allow: /
Sitemap: ${baseUrl}sitemap.xml
` })), files.push({ path: "CODIGOS-DE-EMBED.txt", content: embedCodesText(baseUrl, pages) }), { files, pages, entry: "index.html", buildId };
}
var esc, OFFLINE_HTML, init_projectSite = __esm({
  "src/lib/projectSite.ts"() {
    init_htmlGenerator();
    init_brandTheme();
    init_cdnLibs();
    esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    OFFLINE_HTML = (name, color) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sem conex\xE3o \xB7 ${esc(name)}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f7f7f5;color:#1f2933}main{max-width:420px;padding:24px;text-align:center}h1{font-size:20px;color:${esc(color)}}</style></head>
<body><main><h1>Voc\xEA est\xE1 sem conex\xE3o</h1><p>Esta p\xE1gina de <strong>${esc(name)}</strong> ainda n\xE3o foi aberta neste aparelho. As p\xE1ginas j\xE1 visitadas continuam dispon\xEDveis offline.</p><p><a href="./index.html">Voltar ao in\xEDcio</a></p></main></body></html>`;
  }
});

// automation/publish.ts
var publish_exports = {};
__export(publish_exports, {
  adminPublishSource: () => adminPublishSource,
  carregarVendor: () => carregarVendor,
  publicarProjetos: () => publicarProjetos,
  slugProjeto: () => slugProjeto
});
import { createHash as createHash2 } from "crypto";
import { existsSync as existsSync3, mkdirSync as mkdirSync2, readFileSync as readFileSync3, rmSync, writeFileSync as writeFileSync2 } from "fs";
import { dirname as dirname2, join as join3 } from "path";
function slugProjeto(p) {
  return (p.slug || p.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || p.id;
}
function carregarVendor(appDir) {
  let nm = join3(appDir, "node_modules");
  return {
    chartJs: readFileSync3(join3(nm, "chart.js/dist/chart.umd.min.js"), "utf-8"),
    tailwind: readFileSync3(join3(nm, "@tailwindcss/browser/dist/index.global.js"), "utf-8")
  };
}
async function publicarProjetos(opts) {
  let alvo = (await opts.source.listProjects()).filter((p) => opts.ids && opts.ids.length ? opts.ids.includes(p.id) : p.publishConfig?.autoPublish === !0), anterior = existsSync3(opts.estadoPath) ? JSON.parse(readFileSync3(opts.estadoPath, "utf-8")) : {}, novo = {}, res = { projetos: [], mudou: !1 };
  rmSync(opts.saida, { recursive: !0, force: !0 }), mkdirSync2(opts.saida, { recursive: !0 });
  for (let p of alvo) {
    let dashboards = (await opts.source.listDashboards(p.id)).filter((d) => d.status !== "draft" && d.status !== "archived");
    if (!dashboards.length) continue;
    let ids = /* @__PURE__ */ new Set();
    dashboards.forEach((d) => {
      ids.add(d.datasetId), (d.charts || []).forEach((c) => c.datasetId && ids.add(c.datasetId));
    });
    let datasets = (await Promise.all([...ids].map((id) => opts.source.loadDataset(id)))).filter(Boolean), recordsMap = Object.fromEntries(datasets.map((d) => [d.id, d.records || []])), marcas = [p.updatedAt, ...dashboards.map((d) => d.updatedAt), ...datasets.map((d) => d.lastSyncedAt || d.updatedAt)].filter(Boolean).sort(), now = new Date(marcas[marcas.length - 1] || "2026-01-01T00:00:00Z"), site = buildProjectSite(p, dashboards, datasets, recordsMap, p.headerConfig, { vendor: opts.vendor, now }), slug2 = slugProjeto(p), h = createHash2("sha256");
    for (let f of site.files.sort((a, b) => a.path.localeCompare(b.path))) {
      let path = join3(opts.saida, slug2, f.path);
      mkdirSync2(dirname2(path), { recursive: !0 }), writeFileSync2(path, f.base64 ? Buffer.from(f.content, "base64") : f.content), h.update(f.path).update(f.content);
    }
    novo[slug2] = h.digest("hex");
    let mudou = anterior[slug2] !== novo[slug2];
    res.mudou = res.mudou || mudou, res.projetos.push({ id: p.id, nome: p.name, slug: slug2, paginas: site.pages.length, mudou });
  }
  Object.keys(anterior).some((k) => !(k in novo)) && (res.mudou = !0);
  let esc2 = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return writeFileSync2(join3(opts.saida, "index.html"), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Projetos publicados</title>
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#1f2933}a{color:#1d4ed8}li{margin:8px 0}</style></head>
<body><h1>Projetos publicados</h1><ul>${res.projetos.map((p) => `<li><a href="./${p.slug}/">${esc2(p.nome)}</a> (${p.paginas} p\xE1ginas)</li>`).join("")}</ul></body></html>
`), writeFileSync2(join3(opts.saida, ".nojekyll"), ""), mkdirSync2(dirname2(opts.estadoPath), { recursive: !0 }), writeFileSync2(opts.estadoPath, JSON.stringify(novo, null, 2) + `
`), res;
}
function adminPublishSource(db, store) {
  return {
    async listProjects() {
      return (await db.collection("projects").get()).docs.map((d) => d.data());
    },
    async listDashboards(projectId) {
      return (await db.collection("dashboards").where("projectId", "==", projectId).get()).docs.map((d) => d.data());
    },
    async loadDataset(id) {
      let snap = await db.collection("datasets").doc(id).get();
      if (!snap.exists) return null;
      let ds = snap.data(), records = await store.loadRecords(ds), editionData = {};
      for (let e of ds.editions || [])
        try {
          editionData[e.id] = e.chunkVersion === ds.chunkVersion ? records : await store.loadVersion(ds, e.chunkVersion, e.chunkCount);
        } catch {
        }
      return { ...ds, records, editionData };
    }
  };
}
var init_publish = __esm({
  "automation/publish.ts"() {
    init_projectSite();
  }
});

// automation/conferir.ts
var conferir_exports = {};
__export(conferir_exports, {
  conferirConjuntos: () => conferirConjuntos,
  relatorioConferencia: () => relatorioConferencia
});
function sugerir(arquivos) {
  let dados = arquivos.filter((a) => /^(csv|json|zip|xlsx?|txt)$/i.test(a.formato) || /\.(csv|json|zip|xlsx?)(\?|$)/i.test(a.url));
  if (!dados.length) return "Nenhum arquivo de dados (CSV, JSON, ZIP ou Excel) no conjunto.";
  let comAno = dados.filter((a) => a.ano !== null), anos = new Set(comAno.map((a) => a.ano));
  return comAno.length >= 2 && anos.size === comAno.length && comAno.length >= dados.length - 1 ? `Um arquivo por ano (${Math.min(...anos)}\u2013${Math.max(...anos)}): use "Juntar todos os arquivos".` : dados.length === 1 ? "Um \xFAnico arquivo: n\xE3o \xE9 preciso juntar." : `${dados.length} arquivos de assuntos diferentes: cadastre uma fonte para cada, com a parte do nome do arquivo.`;
}
async function conferirConjuntos(itens, fetcher) {
  let vistos = /* @__PURE__ */ new Set(), res = [];
  for (let it of itens) {
    let chave = `${it.portal}|${it.conjunto}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    let base = { id: it.id, nome: it.nome, conjunto: it.conjunto, portal: it.portal, arquivos: [] };
    try {
      let api = `${it.portal.replace(/\/$/, "")}/api/3/action/package_show?id=${encodeURIComponent(it.conjunto)}`, r = await fetcher(api, { totalMs: 6e4 }), json = null;
      try {
        json = JSON.parse(r.body.toString("utf-8"));
      } catch {
      }
      if (r.status === 404 || json && json.success === !1) {
        res.push({ ...base, situacao: "nao_encontrado" });
        continue;
      }
      if (r.status >= 400 || !json?.result) {
        res.push({ ...base, situacao: "erro", erro: `o portal respondeu HTTP ${r.status}` });
        continue;
      }
      let arquivos = (json.result.resources || []).map((x) => ({
        nome: String(x.name || String(x.url || "").split("/").pop() || "?"),
        formato: String(x.format || "").toUpperCase(),
        ano: anoDe2(String(x.name || "")) ?? anoDe2(String(x.url || "")),
        tamanhoMB: typeof x.size == "number" && x.size > 0 ? Math.round(x.size / 1048576 * 10) / 10 : null,
        atualizado: String(x.last_modified || x.metadata_modified || x.created || "").slice(0, 10),
        url: String(x.url || "")
      })).sort((a, b) => (a.ano ?? 9999) - (b.ano ?? 9999) || a.nome.localeCompare(b.nome));
      res.push({ ...base, situacao: "existe", titulo: json.result.title, arquivos, sugestao: sugerir(arquivos) });
    } catch (e) {
      res.push({ ...base, situacao: "erro", erro: String(e?.message || e) });
    }
  }
  return res;
}
function relatorioConferencia(res, quando) {
  let esc2 = (s) => s.replace(/\|/g, "/").replace(/\n/g, " "), ok = res.filter((r) => r.situacao === "existe").length, linhas = [
    "## Confer\xEAncia do cat\xE1logo de fontes",
    "",
    `${quando.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} \xB7 ${res.length} ${res.length === 1 ? "conjunto consultado" : "conjuntos consultados"} \xB7 encontrados: ${ok} \xB7 n\xE3o encontrados: ${res.filter((r) => r.situacao === "nao_encontrado").length} \xB7 com erro: ${res.filter((r) => r.situacao === "erro").length}`,
    ""
  ];
  for (let r of res) {
    if (r.situacao === "nao_encontrado") {
      linhas.push(`### \u274C ${esc2(r.nome)}`, "", `Conjunto **${r.conjunto}** n\xE3o encontrado no portal. Confira o endere\xE7o.`, "");
      continue;
    }
    if (r.situacao === "erro") {
      linhas.push(`### \u26A0\uFE0F ${esc2(r.nome)}`, "", `N\xE3o foi poss\xEDvel consultar **${r.conjunto}**: ${esc2(r.erro || "")}`, "");
      continue;
    }
    linhas.push(`### \u2705 ${esc2(r.nome)}`, "", `Conjunto **${r.conjunto}**${r.titulo ? ` (\u201C${esc2(r.titulo)}\u201D)` : ""}. ${r.sugestao}`, ""), linhas.push("| Arquivo | Formato | Ano | Tamanho | Atualizado |", "|---|---|---|---|---|");
    for (let a of r.arquivos.slice(0, 40))
      linhas.push(`| ${esc2(a.nome)} | ${a.formato || "\u2014"} | ${a.ano ?? "\u2014"} | ${a.tamanhoMB !== null ? `${String(a.tamanhoMB).replace(".", ",")} MB` : "\u2014"} | ${a.atualizado || "\u2014"} |`);
    r.arquivos.length > 40 && linhas.push(`| \u2026 e mais ${r.arquivos.length - 40} arquivos | | | | |`), linhas.push("");
  }
  return linhas.join(`
`);
}
var anoDe2, init_conferir = __esm({
  "automation/conferir.ts"() {
    anoDe2 = (s) => {
      let m = s.match(/(?:^|\D)(19\d{2}|20\d{2})(?:\D|$)/);
      return m ? Number(m[1]) : null;
    };
  }
});

// src/lib/apiCatalog.ts
var apiCatalog_exports = {};
__export(apiCatalog_exports, {
  PUBLIC_API_CATALOG: () => PUBLIC_API_CATALOG,
  conjuntosDoCatalogo: () => conjuntosDoCatalogo
});
function palavraChaveDoArquivo(arquivo) {
  let MESES = /* @__PURE__ */ new Set(["jan", "fev", "feb", "mar", "abr", "apr", "mai", "may", "jun", "jul", "ago", "aug", "set", "sep", "out", "oct", "nov", "dez", "dec"]), SIGLAS = /* @__PURE__ */ new Set(["subeo", "getad", "seger", "sep", "ge", "es", "loa", "csv", "json", "zip", "xlsx", "xls"]);
  return decodeURIComponent(arquivo).toLowerCase().split(/[^a-z0-9à-ú]+/).filter((w) => w && !/^\d+$/.test(w) && !MESES.has(w) && !SIGLAS.has(w)).slice(0, 2).join("-");
}
function revisar(item) {
  let r = REVISAO[item.id];
  if (r === null) return null;
  let avisos = [], base = { ...item, verificacao: "nao_verificado", importavelNoApp: !0 }, m = item.url.match(/^https:\/\/dados\.es\.gov\.br\/dataset\/([^/]+)\/resource\/[^/]+\/download\/([^/?#]+)$/);
  if (m) {
    let formato = (m[2].match(/\.(csv|json|zip|xlsx)$/i) || [])[1]?.toLowerCase();
    base.pagina = `https://dados.es.gov.br/dataset/${m[1]}`, base.ckan = { portal: "https://dados.es.gov.br", conjunto: m[1], recurso: palavraChaveDoArquivo(m[2]), ...formato ? { formato } : {}, combinar: !1 }, /(19|20)\d{2}/.test(m[2]) && avisos.push("O endere\xE7o aponta para um arquivo de data fixa: importado no app, n\xE3o acompanha os anos seguintes. Como fonte autom\xE1tica, a busca \xE9 feita no conjunto do portal.");
  }
  let final = { ...base, ...r || {} };
  return final.avisos = [...avisos, ...r && r.avisos || [], ...final.verificacao === "nao_verificado" ? [NAO_VERIFICADO] : []], final;
}
function conjuntosDoCatalogo() {
  return PUBLIC_API_CATALOG.filter((x) => x.ckan).map((x) => ({ id: x.id, nome: x.shortTitle, portal: x.ckan.portal, conjunto: x.ckan.conjunto, verificacao: x.verificacao }));
}
var CATALOGO_ORIGINAL, NAO_VERIFICADO, SERIE_BCB, REVISAO, ORIGEM_LISTA, LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, ORIGEM_TEMPO_REAL, ORIGEM_COMEX, CERT_COMEX, AGENDA_COMEX, SINAL_COMEX, ORIGEM_EDU, ORIGEM_IBGE, AGREGADOS, LINK_CONFERIDO, ckanES, LINK_CONFERIDO_AREA, portalES, CATALOGO_ACRESCIMOS, PUBLIC_API_CATALOG, init_apiCatalog = __esm({
  "src/lib/apiCatalog.ts"() {
    CATALOGO_ORIGINAL = [
      // ==========================================
      // GOVERNO DO ESTADO DO ESPÍRITO SANTO (SEFAZ / SEP / TRANSPARÊNCIA ES)
      // ==========================================
      {
        id: "es_receitas_arrecadadas",
        name: "Receitas Arrecadadas e Realizadas do Estado do ES (Portal da Transpar\xEAncia / SEFAZ)",
        shortTitle: "Receitas Arrecadadas do ES (SEFAZ)",
        category: "Receitas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia ES / SEFAZ (portal-da-transparencia-receitas7)",
        url: "https://dados.es.gov.br/dataset/portal-da-transparencia-receitas7",
        format: "CSV",
        description: "Arrecada\xE7\xE3o e realiza\xE7\xE3o de receitas tribut\xE1rias (ICMS, IPVA, ITCMD, taxas e repasses constitucionais) da SEFAZ m\xEAs a m\xEAs.",
        columnsPreview: ["codigoUG", "descricaoUG", "descricaoNatureza", "descricaoCategoria", "descricaoOrigem", "valorPrevista", "valorArrecadada", "valorRecolhida", "valorPrevistaLiquida", "valorArrecadadaLiquida", "ano", "dataContabilizacao"],
        yearsPreview: "2023 a 2026 (Mensal / Anual)",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal (ap\xF3s apura\xE7\xE3o do fechamento cont\xE1bil da SEFAZ)",
        suggestedName: "Governo ES - Receitas Realizadas SEFAZ",
        tags: ["receitas", "arrecada\xE7\xE3o", "sefaz", "impostos", "icms", "ipva", "tributos"]
      },
      {
        id: "es_receitas_loa",
        name: "Receitas Or\xE7ament\xE1rias do Estado do ES (Previs\xE3o LOA & Execu\xE7\xE3o)",
        shortTitle: "Receitas Or\xE7ament\xE1rias do ES (LOA)",
        category: "Receitas do Estado",
        sphere: "es_estadual",
        source: "Portal de Transpar\xEAncia ES / SEFAZ-SEP",
        url: "https://dados.es.gov.br/dataset/d0a090d4-4a50-443d-84cc-aca6ac3d321c/resource/0ca05e19-afe1-4cbb-82cc-78614948aa4f/download/10.-sep-2025-receita-orcamentaria-loa-subeo-19.05.2026.csv",
        format: "CSV",
        description: "Previs\xE3o bruta e l\xEDquida de arrecada\xE7\xE3o de tributos e receitas estaduais por \xD3rg\xE3o, Unidade Gestora, Fonte e Natureza de Receita.",
        columnsPreview: ["\xD3rg\xE3o da UG", "UG", "Fonte", "Categoria da Receita", "Natureza da Receita", "Previs\xE3o Inicial L\xEDquida"],
        yearsPreview: "2024 e 2025 (LOA)",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual (em maio na consolida\xE7\xE3o da LOA) ou Mensal",
        suggestedName: "Governo ES - Receitas Or\xE7ament\xE1rias LOA",
        tags: ["receitas", "arrecada\xE7\xE3o", "sefaz", "impostos", "loa", "or\xE7amento"]
      },
      {
        id: "es_despesas_execucoes",
        name: "Execu\xE7\xE3o de Despesas do Estado por Unidade Gestora (Empenhos, Liquida\xE7\xF5es e Pagamentos)",
        shortTitle: "Execu\xE7\xE3o de Despesas do ES (Resumo UG)",
        category: "Despesas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do ES",
        url: "https://dados.es.gov.br/dataset/99e16b13-0e6f-4504-8544-00de842ab1fd/resource/538b6477-dbc6-4183-9b73-adcc18867369/download/orcamentosexecucoes-2025.csv",
        format: "CSV",
        description: "Valores mensais de empenhos, liquida\xE7\xF5es, pagamentos e valores or\xE7ados de todos os \xF3rg\xE3os e secretarias do Governo do Estado.",
        columnsPreview: ["Data", "ValorEmpenho", "ValorLiquidado", "ValorPago", "ValorRap", "ValorOrcadoInicial", "ValorOrcado", "UnidadeGestora", "SiglaUnidadeGestora"],
        yearsPreview: "2024 a 2026",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal (ap\xF3s fechamento cont\xE1bil dia 10)",
        suggestedName: "Governo ES - Execu\xE7\xE3o das Despesas",
        tags: ["empenho", "liquida\xE7\xE3o", "pagamentos", "execu\xE7\xE3o", "despesas", "secretarias"]
      },
      {
        id: "es_despesas_detalhadas",
        name: "Despesas Detalhadas do Estado por Favorecido, Fun\xE7\xE3o e Programa (Portal da Transpar\xEAncia)",
        shortTitle: "Despesas Detalhadas do ES (Favorecidos)",
        category: "Despesas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do ES",
        url: "https://dados.es.gov.br/dataset/99e16b13-0e6f-4504-8544-00de842ab1fd/resource/b9c229f8-884c-4fa6-85a9-15469172d6a8/download/despesas-2025.csv",
        format: "CSV",
        description: "Rela\xE7\xE3o completa de empenhos, liquida\xE7\xF5es e ordens banc\xE1rias pagas com nome/CNPJ do favorecido, a\xE7\xE3o e elemento de despesa.",
        columnsPreview: ["Ano", "Data", "ValorEmpenho", "ValorLiquidado", "ValorPago", "Favorecido", "Orgao", "Funcao", "SubFuncao", "Programa", "ElementoDespesa"],
        yearsPreview: "2024 e 2025 (Execu\xE7\xE3o Cont\xEDnua)",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Governo ES - Despesas por Favorecido",
        tags: ["favorecido", "fornecedores", "pagamentos", "despesas", "programas"]
      },
      {
        id: "es_despesas_orcamento",
        name: "Or\xE7amento de Despesas do Estado do Esp\xEDrito Santo (Dota\xE7\xF5es LOA)",
        shortTitle: "Or\xE7amento de Despesas do ES (Dota\xE7\xF5es)",
        category: "Despesas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do ES",
        url: "https://dados.es.gov.br/dataset/99e16b13-0e6f-4504-8544-00de842ab1fd/resource/c98132b7-a2ce-431f-be7b-1ba5998a62b9/download/orcamentosdespesa-2025.csv",
        format: "CSV",
        description: "Dota\xE7\xF5es or\xE7ament\xE1rias iniciais e atualizadas por Secretaria, Fun\xE7\xE3o, Subfun\xE7\xE3o e Programa Governamental.",
        columnsPreview: ["Ano", "\xD3rg\xE3o", "Unidade Or\xE7ament\xE1ria", "Fun\xE7\xE3o", "Subfun\xE7\xE3o", "Programa", "Dota\xE7\xE3o Inicial", "Dota\xE7\xE3o Atualizada"],
        yearsPreview: "2024 e 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal (acompanhamento de altera\xE7\xF5es or\xE7ament\xE1rias)",
        suggestedName: "Governo ES - Or\xE7amento de Despesas",
        tags: ["despesas", "or\xE7amento", "fun\xE7\xF5es", "secretarias", "dota\xE7\xE3o"]
      },
      {
        id: "es_divida_ativa",
        name: "D\xEDvida Ativa do Estado do Esp\xEDrito Santo (SEFAZ / PGE)",
        shortTitle: "D\xEDvida Ativa Estadual (SEFAZ)",
        category: "Receitas do Estado",
        sphere: "es_estadual",
        source: "SEFAZ-ES / Portal da Transpar\xEAncia",
        url: "https://dados.es.gov.br/dataset/3210df25-0dfe-414b-aed4-844ddcdf87bb/resource/016bbc36-15fb-476b-b249-d9726426c82c/download/dividaativa.csv",
        format: "CSV",
        description: "Cr\xE9ditos tribut\xE1rios e n\xE3o-tribut\xE1rios inscritos em D\xEDvida Ativa a serem recuperados pelo Estado.",
        columnsPreview: ["Ano", "NumeroInscricao", "NaturezaTributaria", "ValorTotal", "Situacao", "UnidadeInscricao"],
        yearsPreview: "2020 a 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal ou Semestral",
        suggestedName: "Governo ES - D\xEDvida Ativa",
        tags: ["d\xEDvida ativa", "sefaz", "pge", "cr\xE9ditos", "arrecada\xE7\xE3o"]
      },
      {
        id: "es_convenios_estado",
        name: "Conv\xEAnios e Repasses de Recursos do Estado do ES",
        shortTitle: "Conv\xEAnios e Repasses Estaduais",
        category: "Receitas e Repasses",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do ES",
        url: "https://dados.es.gov.br/dataset/577b5d48-3770-4b5c-8202-384d969b40fb/resource/d23575f9-af45-4306-a4b1-4a4dcaf74cfa/download/conveniosexecucaoorcamentaria-2025.csv",
        format: "CSV",
        description: "Transfer\xEAncias volunt\xE1rias e conv\xEAnios firmados com prefeituras capixabas e entidades civis.",
        columnsPreview: ["N\xFAmero Conv\xEAnio", "Concedente", "Proponente", "Objeto", "Valor Conv\xEAnio", "Valor Liberado"],
        yearsPreview: "2024 a 2026",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Governo ES - Conv\xEAnios e Repasses",
        tags: ["conv\xEAnios", "repasses", "prefeituras", "transfer\xEAncias"]
      },
      {
        id: "es_indicadores_estrategicos",
        name: "Metas e Indicadores Estrat\xE9gicos das Secretarias do ES",
        shortTitle: "Indicadores Estrat\xE9gicos do ES",
        category: "Gest\xE3o e Metas",
        sphere: "es_estadual",
        source: "SEP / Governo do ES",
        url: "https://dados.es.gov.br/dataset/83a6fb14-7820-448b-9b4f-45a23ad30209/resource/3290f262-14e2-4ecd-ae51-b9f15db9a3f0/download/6.-sep-2025-indicadores-estrategicos-subeo-11.06.2026.csv",
        format: "CSV",
        description: "Acompanhamento de metas do Plano Plurianual (PPA) e programas estrat\xE9gicos do governo capixaba.",
        columnsPreview: ["Secretaria", "Programa", "Indicador", "Meta Prevista", "Realizado", "Percentual Atingido"],
        yearsPreview: "2024 e 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal ou Trimestral",
        suggestedName: "Governo ES - Indicadores Estrat\xE9gicos",
        tags: ["metas", "indicadores", "planejamento", "ppa", "resultados"]
      },
      {
        id: "es_veiculos_oficiais",
        name: "Frota Oficial de Ve\xEDculos da Administra\xE7\xE3o Estadual",
        shortTitle: "Ve\xEDculos Oficiais do Estado",
        category: "Patrim\xF4nio e Gest\xE3o",
        sphere: "es_estadual",
        source: "SEP / GETAD",
        url: "https://dados.es.gov.br/dataset/535b4513-5317-42f7-89f5-a9aef871c5ef/resource/dff68bfb-cdb2-4f33-b4a1-aaacc938c97d/download/4.-sep-2025-veiculos-oficiais-getad-14.05.2026.csv",
        format: "CSV",
        description: "Rela\xE7\xE3o de todos os ve\xEDculos oficiais em opera\xE7\xE3o nos \xF3rg\xE3os do Estado do Esp\xEDrito Santo.",
        columnsPreview: ["\xD3rg\xE3o", "Placa", "Marca/Modelo", "Ano Fabrica\xE7\xE3o", "Combust\xEDvel", "Situa\xE7\xE3o"],
        yearsPreview: "2024 e 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Governo ES - Frota de Ve\xEDculos",
        tags: ["ve\xEDculos", "patrim\xF4nio", "frota", "transportes"]
      },
      {
        id: "es_terceirizados",
        name: "Prestadores de Servi\xE7os Terceirizados no Estado do ES",
        shortTitle: "Servidores Terceirizados do ES",
        category: "Gest\xE3o e Pessoal",
        sphere: "es_estadual",
        source: "SEP / GETAD",
        url: "https://dados.es.gov.br/dataset/768762f9-e9c1-445e-95c5-754f48fa216f/resource/2a08571a-6aeb-4734-88de-2ce926e4ffc8/download/3.-sep-2025-servidores-terceirizados-getad-14.05.2026.csv",
        format: "CSV",
        description: "Contratos e quantitativo de colaboradores terceirizados ativos na administra\xE7\xE3o p\xFAblica estadual.",
        columnsPreview: ["\xD3rg\xE3o", "Empresa Contratada", "Cargo/Fun\xE7\xE3o", "Quantitativo", "Valor Mensal"],
        yearsPreview: "2024 e 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Governo ES - Prestadores Terceirizados",
        tags: ["terceirizados", "pessoal", "contratos", "servidores"]
      },
      // ==========================================
      // MUNICÍPIOS DO ESPÍRITO SANTO (TCE-ES / CidadES)
      // ==========================================
      {
        id: "tce_rcl_municipios",
        name: "Receita Corrente L\xEDquida (RCL) dos 78 Munic\xEDpios do ES",
        shortTitle: "Receita Corrente L\xEDquida dos Munic\xEDpios (TCE-ES)",
        category: "Receitas dos Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES (Tribunal de Contas) / CidadES",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/4bbc4025-d96f-437d-837f-acc1089e5fa5/download/rcl.csv",
        format: "CSV",
        description: "S\xE9rie hist\xF3rica oficial da Receita Corrente L\xEDquida (RCL) de todos os 78 munic\xEDpios capixabas auditada pelo Tribunal de Contas.",
        columnsPreview: ["Ano", "Mes", "Munic\xEDpio", "Receita Corrente Liquida", "Receita Corrente Liquida Ajustada Pessoal"],
        yearsPreview: "2018 a 2025 (Todos os anos)",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal (acompanhamento cont\xE1bil do TCE-ES)",
        suggestedName: "TCE-ES - Receita Corrente L\xEDquida dos Munic\xEDpios",
        tags: ["munic\xEDpios", "receitas", "tce-es", "rcl", "cidades", "arrecada\xE7\xE3o"]
      },
      {
        id: "tce_despesas_saude_municipios",
        name: "Gastos dos Munic\xEDpios Capixabas com Sa\xFAde (TCE-ES)",
        shortTitle: "Gastos dos Munic\xEDpios com Sa\xFAde",
        category: "Despesas dos Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES (Tribunal de Contas) / CidadES",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/f472ae45-a039-4d10-b029-fe6a2367b2a6/download/municipios-saude.csv",
        format: "CSV",
        description: "Valores liquidados em a\xE7\xF5es e servi\xE7os p\xFAblicos de sa\xFAde em cada um dos 78 munic\xEDpios do ES e cumprimento do m\xEDnimo constitucional.",
        columnsPreview: ["Ano", "Mes", "Munic\xEDpio", "Despesa com Sa\xFAde", "Percentual Aplicado", "Limite M\xEDnimo Constitucional"],
        yearsPreview: "2018 a 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "TCE-ES - Gastos dos Munic\xEDpios com Sa\xFAde",
        tags: ["sa\xFAde", "munic\xEDpios", "tce-es", "despesas", "sus"]
      },
      {
        id: "tce_despesas_educacao_municipios",
        name: "Gastos dos Munic\xEDpios Capixabas com Educa\xE7\xE3o (TCE-ES)",
        shortTitle: "Gastos dos Munic\xEDpios com Educa\xE7\xE3o",
        category: "Despesas dos Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES (Tribunal de Contas) / CidadES",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/015c1dad-5842-44e8-a307-68eafe6de28e/download/municipios-educacao.csv",
        format: "CSV",
        description: "Investimento em Manuten\xE7\xE3o e Desenvolvimento do Ensino (MDE) e Fundeb realizado pelos 78 munic\xEDpios capixabas.",
        columnsPreview: ["Ano", "Mes", "Munic\xEDpio", "Despesa com Educa\xE7\xE3o", "MDE", "Fundeb", "Percentual Aplicado"],
        yearsPreview: "2018 a 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "TCE-ES - Gastos dos Munic\xEDpios com Educa\xE7\xE3o",
        tags: ["educa\xE7\xE3o", "munic\xEDpios", "tce-es", "mde", "fundeb", "escolas"]
      },
      {
        id: "tce_despesas_pessoal_municipios",
        name: "Gastos com Folha de Pessoal dos Munic\xEDpios do ES (LRF)",
        shortTitle: "Gastos com Pessoal dos Munic\xEDpios (LRF)",
        category: "Despesas dos Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES (Tribunal de Contas) / CidadES",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/45c257a8-5b35-4486-af5c-5bfbc453304a/download/municipios-pessoal.csv",
        format: "CSV",
        description: "Despesa Total com Pessoal (DTP) de cada prefeitura e c\xE2mara municipal frente ao limite legal da Lei de Responsabilidade Fiscal (54%).",
        columnsPreview: ["Ano", "Mes", "Munic\xEDpio", "Despesa Total Pessoal", "Percentual sobre RCL", "Limite M\xE1ximo LRF"],
        yearsPreview: "2018 a 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal ou Quadrimestral",
        suggestedName: "TCE-ES - Despesas com Pessoal dos Munic\xEDpios",
        tags: ["pessoal", "folha", "munic\xEDpios", "lrf", "tce-es", "servidores"]
      },
      {
        id: "tce_endividamento_municipios",
        name: "D\xEDvida Consolidada e Endividamento dos Munic\xEDpios do ES",
        shortTitle: "Endividamento dos Munic\xEDpios (TCE-ES)",
        category: "Finan\xE7as dos Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES (Tribunal de Contas) / CidadES",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/359ca7d9-dea6-4741-a137-210b2cb63961/download/endividamento.csv",
        format: "CSV",
        description: "D\xEDvida Consolidada L\xEDquida (DCL) e opera\xE7\xF5es de cr\xE9dito vigentes de cada munic\xEDpio do Esp\xEDrito Santo.",
        columnsPreview: ["Ano", "Mes", "Munic\xEDpio", "D\xEDvida Consolidada", "DCL", "Percentual Endividamento"],
        yearsPreview: "2018 a 2025",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "TCE-ES - Endividamento dos Munic\xEDpios",
        tags: ["d\xEDvida", "endividamento", "cr\xE9dito", "munic\xEDpios", "tce-es"]
      },
      // ==========================================
      // GOVERNO FEDERAL (TESOURO NACIONAL / SICONFI / IBGE / BANCO CENTRAL)
      // ==========================================
      {
        id: "fed_siconfi_dca_es",
        name: "Tesouro Nacional / SICONFI: Balan\xE7o Anual das Prefeituras do ES (DCA)",
        shortTitle: "Tesouro Nacional: Contas dos Munic\xEDpios do ES",
        category: "Finan\xE7as P\xFAblicas Federais",
        sphere: "federal",
        source: "Tesouro Nacional / SICONFI API",
        url: "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/dca?an_exercicio=2024&id_ente=32",
        format: "JSON",
        jsonPath: "items",
        description: "Declara\xE7\xE3o de Contas Anuais (DCA) oficial com balan\xE7os patrimoniais e or\xE7ament\xE1rios de todos os entes do Esp\xEDrito Santo.",
        columnsPreview: ["exercicio", "cod_ibge", "instituicao", "conta", "coluna", "valor"],
        yearsPreview: "2023 e 2024",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual (ap\xF3s entrega das contas ao Tesouro)",
        suggestedName: "Tesouro Nacional - Contas Anuais dos Munic\xEDpios do ES",
        tags: ["siconfi", "tesouro nacional", "balan\xE7o", "munic\xEDpios", "contabilidade"]
      },
      {
        id: "fed_ibge_municipios_es",
        name: "IBGE: Estrutura Geogr\xE1fica e Microrregi\xF5es dos 78 Munic\xEDpios do ES",
        shortTitle: "IBGE: 78 Munic\xEDpios do Esp\xEDrito Santo",
        category: "Demografia e Territ\xF3rio",
        sphere: "federal",
        source: "IBGE Localidades API",
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/32/municipios",
        format: "JSON",
        description: "Rela\xE7\xE3o oficial do IBGE com c\xF3digos, mesorregi\xF5es, microrregi\xF5es e regi\xF5es imediatas de todos os 78 munic\xEDpios capixabas.",
        columnsPreview: ["id (C\xF3digo IBGE)", "nome (Munic\xEDpio)", "microrregiao", "mesorregiao"],
        yearsPreview: "2024 a 2026",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "IBGE - Munic\xEDpios do Esp\xEDrito Santo",
        tags: ["ibge", "munic\xEDpios", "cidades", "es", "mapa", "popula\xE7\xE3o"]
      },
      {
        id: "fed_ibge_noticias",
        name: "IBGE: Not\xEDcias Econ\xF4micas, Infla\xE7\xE3o e Estat\xEDsticas Oficiais",
        shortTitle: "IBGE: Not\xEDcias e Comunicados",
        category: "Not\xEDcias & Estat\xEDsticas",
        sphere: "federal",
        source: "IBGE Not\xEDcias API",
        url: "https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=50",
        format: "JSON",
        jsonPath: "items",
        description: "Divulga\xE7\xF5es oficiais sobre PIB, infla\xE7\xE3o (IPCA/INPC), taxa de desemprego (PNAD Cont\xEDnua) e pesquisas setoriais do IBGE.",
        columnsPreview: ["id", "titulo", "introducao", "data_publicacao", "editorias", "link"],
        yearsPreview: "2025 e 2026",
        recommendedSchedule: "24h",
        recommendedScheduleDesc: "Di\xE1ria (a cada 24 horas)",
        suggestedName: "IBGE - Not\xEDcias e Estat\xEDsticas Nacionais",
        tags: ["ibge", "not\xEDcias", "economia", "pib", "infla\xE7\xE3o", "comunicados"]
      },
      {
        id: "fed_bcb_ptax",
        name: "Banco Central do Brasil: Cota\xE7\xE3o Oficial Di\xE1ria do D\xF3lar (PTAX)",
        shortTitle: "Banco Central: C\xE2mbio D\xF3lar PTAX",
        category: "Macroeconomia e C\xE2mbio",
        sphere: "federal",
        source: "Banco Central do Brasil (BCB OData API)",
        url: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='10-16-2026'&$top=100&$format=json",
        format: "JSON",
        jsonPath: "value",
        description: "Taxa de c\xE2mbio oficial de compra e venda apurada pelo Banco Central para fechamento de balan\xE7os e contratos internacionais.",
        columnsPreview: ["cotacaoCompra", "cotacaoVenda", "dataHoraCotacao"],
        yearsPreview: "2026",
        recommendedSchedule: "24h",
        recommendedScheduleDesc: "Di\xE1ria (fechamento de mercado \xE0s 17h)",
        suggestedName: "Banco Central - D\xF3lar Comercial PTAX",
        tags: ["d\xF3lar", "c\xE2mbio", "ptax", "banco central", "moeda"]
      },
      {
        id: "fed_bcb_selic",
        name: "Banco Central do Brasil: Hist\xF3rico da Taxa de Juros Selic (SGS)",
        shortTitle: "Banco Central: Taxa Selic Di\xE1ria",
        category: "Macroeconomia e Juros",
        sphere: "federal",
        source: "Banco Central do Brasil (SGS)",
        url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/30?formato=json",
        format: "JSON",
        description: "S\xE9rie temporal di\xE1ria da taxa de juros b\xE1sica da economia brasileira (Selic Over).",
        columnsPreview: ["data", "valor (Taxa Selic % a.a.)"],
        yearsPreview: "2025 e 2026",
        recommendedSchedule: "24h",
        recommendedScheduleDesc: "Di\xE1ria",
        suggestedName: "Banco Central - Taxa Selic",
        tags: ["selic", "juros", "banco central", "economia", "sgs"]
      },
      {
        id: "fed_bcb_ipca",
        name: "Banco Central do Brasil: \xCDndice Oficial de Infla\xE7\xE3o IPCA Mensal",
        shortTitle: "Banco Central: Infla\xE7\xE3o IPCA Mensal",
        category: "Macroeconomia e Infla\xE7\xE3o",
        sphere: "federal",
        source: "Banco Central do Brasil (SGS)",
        url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/24?formato=json",
        format: "JSON",
        description: "Varia\xE7\xE3o percentual mensal do IPCA (\xCDndice Nacional de Pre\xE7os ao Consumidor Amplo) apurado pelo IBGE e catalogado pelo BCB.",
        columnsPreview: ["data", "valor (Varia\xE7\xE3o % mensal do IPCA)"],
        yearsPreview: "2024 a 2026",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal (divulga\xE7\xE3o dia 10 de cada m\xEAs)",
        suggestedName: "Banco Central - Infla\xE7\xE3o IPCA Mensal",
        tags: ["ipca", "infla\xE7\xE3o", "pre\xE7os", "banco central", "economia"]
      }
    ], NAO_VERIFICADO = "Sugest\xE3o gerada automaticamente e ainda n\xE3o conferida: abra a p\xE1gina do portal e confira se o arquivo existe, de quando \xE9 e quais colunas tem antes de usar.", SERIE_BCB = (serie, n = 24) => ({
      url: `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/${n}?formato=json`,
      formato: "json",
      agenda: { frequencia: "semanal", dia_da_semana: 4, hora: "06:00" },
      tratamento: { decimal: "ponto", numeros: ["valor"] }
    }), REVISAO = {
      // Conferido: a coleta automática real funcionou com este conjunto em 22/10/2026
      es_receitas_arrecadadas: {
        name: "Receitas do Estado do ES (Portal da Transpar\xEAncia / SEFAZ)",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: "https://dados.es.gov.br/dataset/portal-da-transparencia-receitas",
        pagina: "https://dados.es.gov.br/dataset/portal-da-transparencia-receitas",
        ckan: { portal: "https://dados.es.gov.br", conjunto: "portal-da-transparencia-receitas", recurso: "receitas", formato: "csv", combinar: !0 },
        importavelNoApp: !1,
        verificacao: "verificado",
        verificadoEm: "22/10/2026",
        columnsPreview: ["CodUnidadeGestora", "UnidadeGestora", "Ano", "Mes", "CategoriaEconomica", "Origem", "Especie", "Rubrica", "Fonte", "TipoArquivo", "PrevistaBruta", "ArrecadadaBruta", "ArrecadadaDeducao", "ArrecadadaLiquida", "RecolhidaBruta", "\u2026 (56 colunas)"],
        yearsPreview: "2019 em diante (um arquivo por ano)",
        avisos: [
          "Um arquivo CSV por ano, de 150 MB a 1 GB, com uma linha por lan\xE7amento: grande demais para importar no app. Use como fonte autom\xE1tica, somando por categorias.",
          "Cada lan\xE7amento preenche s\xF3 a coluna do seu tipo (TipoArquivo). Defina com a editoria qual medida publicar (arrecadada bruta, dedu\xE7\xF5es ou l\xEDquida) e confira um total mensal com o relat\xF3rio da SEFAZ."
        ]
      },
      // Os 5 itens do TCE-ES do catálogo original ERAM REAIS: os códigos dos arquivos são os mesmos
      // dos links conferidos pela redação. Foram substituídos pelos itens "tce_municipios_*" (um por
      // área), que usam esses mesmos endereços; aqui saem só para não duplicar.
      tce_rcl_municipios: null,
      tce_despesas_saude_municipios: null,
      tce_despesas_educacao_municipios: null,
      tce_despesas_pessoal_municipios: null,
      tce_endividamento_municipios: null,
      fed_siconfi_dca_es: {
        name: "Tesouro Nacional / SICONFI: Balan\xE7o Anual do Estado do ES (DCA)",
        shortTitle: "Balan\xE7o anual do Estado (SICONFI/DCA)",
        url: "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/dca?an_exercicio={{PREV_YYYY}}&id_ente=32",
        avisos: ["O c\xF3digo id_ente=32 \xE9 o do Estado do Esp\xEDrito Santo (n\xE3o das prefeituras). Cada munic\xEDpio tem o pr\xF3prio c\xF3digo do IBGE.", "Usa o ano anterior ({{PREV_YYYY}}): o balan\xE7o do ano s\xF3 sai no ano seguinte."]
      },
      fed_ibge_municipios_es: {
        shortTitle: "Munic\xEDpios do ES (IBGE)",
        avisos: ["Lista oficial dos 78 munic\xEDpios com o c\xF3digo do IBGE de 7 d\xEDgitos: a chave para cruzar tabelas e mapas. As regi\xF5es v\xEAm em colunas (microrregiao_nome, microrregiao_mesorregiao_nome\u2026)."]
      },
      fed_ibge_noticias: { avisos: ["S\xE3o not\xEDcias do IBGE, n\xE3o uma s\xE9rie estat\xEDstica: n\xE3o servem como base de dados para pain\xE9is."] },
      fed_bcb_ptax: {
        url: "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='01-01-{{YYYY}}'&@dataFinalCotacao='12-31-{{YYYY}}'&$format=json",
        avisos: ["O endere\xE7o original tinha uma data fixa (sempre o mesmo dia). Agora traz as cota\xE7\xF5es do ano corrente."]
      },
      fed_bcb_selic: { fonteSugerida: SERIE_BCB(11, 30), avisos: ["Traz s\xF3 os 30 registros mais recentes. Para uma s\xE9rie anual, pe\xE7a a s\xE9rie por per\xEDodo."] },
      fed_bcb_ipca: { fonteSugerida: SERIE_BCB(433, 24), avisos: ["Traz s\xF3 os 24 meses mais recentes. Para uma s\xE9rie mais longa, pe\xE7a a s\xE9rie por per\xEDodo."] },
      es_terceirizados: {
        dadosPessoais: !0,
        avisos: ["Pode conter nomes de pessoas (LGPD). Antes de usar, consulte o DPO; n\xE3o publique esses dados em reposit\xF3rio p\xFAblico."]
      }
    };
    ORIGEM_LISTA = "Indicado na lista de fontes enviada pela reda\xE7\xE3o (out/2026), ainda n\xE3o conferido.", LINK_SEGURANCA = "Link do conjunto informado pela reda\xE7\xE3o (out/2026). Antes de usar, rode a confer\xEAncia autom\xE1tica do cat\xE1logo para ver os arquivos (um por ano? um s\xF3?) e confira as colunas.", SENSIVEL_SEGURANCA = "Tema sens\xEDvel (seguran\xE7a p\xFAblica): pela pol\xEDtica de IA da Gazeta, o uso na publica\xE7\xE3o passa pelo editor-chefe.", VITIMAS = "Se o arquivo for de microdados (uma linha por ocorr\xEAncia, com data, bairro, idade\u2026), o cruzamento pode identificar v\xEDtimas, sobretudo em munic\xEDpios pequenos. Para o anu\xE1rio, publique s\xF3 totais agregados (por munic\xEDpio, ano, m\xEAs) e consulte o DPO antes de guardar os microdados.", ORIGEM_TEMPO_REAL = "Indicado na lista de fontes de com\xE9rcio exterior em tempo real enviada pela reda\xE7\xE3o (out/2026), ainda n\xE3o conferido.", ORIGEM_COMEX = "Indicado na lista enviada pela reda\xE7\xE3o (out/2026). Endere\xE7os e colunas conforme a documenta\xE7\xE3o do Comex Stat, ainda n\xE3o conferidos.", CERT_COMEX = "Se a coleta falhar com erro de certificado, avise: o servidor do governo usa a cadeia ICP-Brasil, e a automa\xE7\xE3o precisar\xE1 inclu\xED-la.", AGENDA_COMEX = { frequencia: "diaria", hora: "06:00" }, SINAL_COMEX = "https://api-comexstat.mdic.gov.br/general/dates/updated", ORIGEM_EDU = "Indicado na lista de fontes de educa\xE7\xE3o enviada pela reda\xE7\xE3o (out/2026). Endere\xE7o e c\xF3digos ainda n\xE3o conferidos.", ORIGEM_IBGE = "API oficial do IBGE, indicada na lista enviada pela reda\xE7\xE3o (out/2026). Endere\xE7o, tabela e vari\xE1vel ainda n\xE3o conferidos.", AGREGADOS = 'Resposta da API de Agregados do IBGE: o app e a automa\xE7\xE3o j\xE1 transformam em tabela (uma linha por munic\xEDpio e ano, com cod_ibge, municipio, variavel, unidade, ano e valor). S\xEDmbolos do IBGE ("...", "X" sigiloso) viram vazio.', LINK_CONFERIDO = 'Link do conjunto informado pela reda\xE7\xE3o (out/2026). Antes de usar, confira os arquivos: se houver um por ano, marque "Juntar todos os arquivos"; se houver arquivos de assuntos diferentes, informe a parte do nome do arquivo desejado. A confer\xEAncia autom\xE1tica do cat\xE1logo lista os arquivos de cada conjunto.', ckanES = (conjunto, combinar = !1) => ({ portal: "https://dados.es.gov.br", conjunto, combinar }), LINK_CONFERIDO_AREA = "Arquivo confirmado pela reda\xE7\xE3o (out/2026): o conjunto tem um CSV por \xE1rea (Educa\xE7\xE3o, Pessoal, Sa\xFAde, Receita Corrente L\xEDquida (RCL), Endividamento). Pode ser importado direto no app ou virar fonte autom\xE1tica. Falta conferir as colunas: cole as primeiras linhas do arquivo na tela de colunas antes de usar.", portalES = (conjunto) => `https://dados.es.gov.br/dataset/${conjunto}`, CATALOGO_ACRESCIMOS = [
      // ── Segurança pública do ES (links informados pela redação, out/2026) ──
      {
        id: "seg_homicidios_de_mulheres_e_feminicidios_2017_2025",
        name: "Seguran\xE7a p\xFAblica do ES: Homic\xEDdios de mulheres e feminic\xEDdios (2017\u20132025)",
        shortTitle: "Feminic\xEDdios 2017\u20132025",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto homicidios-de-mulheres-e-feminicidios_2017_2025)",
        url: portalES("homicidios-de-mulheres-e-feminicidios_2017_2025"),
        pagina: portalES("homicidios-de-mulheres-e-feminicidios_2017_2025"),
        ckan: ckanES("homicidios-de-mulheres-e-feminicidios_2017_2025"),
        format: "CSV",
        description: "Homic\xEDdios de mulheres e feminic\xEDdios no ES de 2017 a 2025.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Feminic\xEDdios 2017\u20132025",
        tags: ["feminic\xEDdio", "homic\xEDdio", "mulheres", "viol\xEAncia de g\xEAnero", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, "A s\xE9rie completa soma este conjunto (2017\u20132025) com o do ano corrente (2026), que \xE9 publicado em separado.", "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_homicidios_de_mulheres_e_feminicidios_2026",
        name: "Seguran\xE7a p\xFAblica do ES: Homic\xEDdios de mulheres e feminic\xEDdios (2026)",
        shortTitle: "Feminic\xEDdios 2026",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto homicidios-de-mulheres-e-feminicidios_2026)",
        url: portalES("homicidios-de-mulheres-e-feminicidios_2026"),
        pagina: portalES("homicidios-de-mulheres-e-feminicidios_2026"),
        ckan: ckanES("homicidios-de-mulheres-e-feminicidios_2026"),
        format: "CSV",
        description: "Homic\xEDdios de mulheres e feminic\xEDdios no ES em 2026 (ano corrente).",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Feminic\xEDdios 2026",
        tags: ["feminic\xEDdio", "homic\xEDdio", "mulheres", "viol\xEAncia de g\xEAnero", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, "Ano corrente em conjunto pr\xF3prio: em 2027, o endere\xE7o provavelmente muda. Para a s\xE9rie, some com o conjunto 2017\u20132025.", "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_homicido_feminicidio",
        name: "Seguran\xE7a p\xFAblica do ES: Homic\xEDdio e feminic\xEDdio",
        shortTitle: "Homic\xEDdio e feminic\xEDdio",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto homicido-feminicidio)",
        url: portalES("homicido-feminicidio"),
        pagina: portalES("homicido-feminicidio"),
        ckan: ckanES("homicido-feminicidio"),
        format: "CSV",
        description: "Conjunto de homic\xEDdios e feminic\xEDdios (confira o per\xEDodo e se repete os conjuntos acima).",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Homic\xEDdio e feminic\xEDdio",
        tags: ["feminic\xEDdio", "homic\xEDdio", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, "Pode ser uma vers\xE3o anterior ou mais ampla dos conjuntos de feminic\xEDdios: compare antes de usar, para n\xE3o contar em dobro.", "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_violencia_contra_mulher_lei_maria_da_penha_2026",
        name: "Seguran\xE7a p\xFAblica do ES: Viol\xEAncia contra a mulher: Lei Maria da Penha (2026)",
        shortTitle: "Lei Maria da Penha 2026",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto violencia-contra-mulher_lei-maria-da-penha_2026)",
        url: portalES("violencia-contra-mulher_lei-maria-da-penha_2026"),
        pagina: portalES("violencia-contra-mulher_lei-maria-da-penha_2026"),
        ckan: ckanES("violencia-contra-mulher_lei-maria-da-penha_2026"),
        format: "CSV",
        description: "Ocorr\xEAncias de viol\xEAncia contra a mulher enquadradas na Lei Maria da Penha em 2026.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Lei Maria da Penha 2026",
        tags: ["viol\xEAncia contra a mulher", "maria da penha", "viol\xEAncia dom\xE9stica", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, "Ano corrente em conjunto pr\xF3prio: em 2027, o endere\xE7o provavelmente muda.", "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_violencia_domestica",
        name: "Seguran\xE7a p\xFAblica do ES: Viol\xEAncia dom\xE9stica",
        shortTitle: "Viol\xEAncia dom\xE9stica",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto violencia-domestica)",
        url: portalES("violencia-domestica"),
        pagina: portalES("violencia-domestica"),
        ckan: ckanES("violencia-domestica"),
        format: "CSV",
        description: "Ocorr\xEAncias de viol\xEAncia dom\xE9stica no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Viol\xEAncia dom\xE9stica",
        tags: ["viol\xEAncia dom\xE9stica", "viol\xEAncia contra a mulher", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, VITIMAS, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_crimes_informaticos",
        name: "Seguran\xE7a p\xFAblica do ES: Crimes inform\xE1ticos",
        shortTitle: "Crimes inform\xE1ticos",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto crimes-informaticos)",
        url: portalES("crimes-informaticos"),
        pagina: portalES("crimes-informaticos"),
        ckan: ckanES("crimes-informaticos"),
        format: "CSV",
        description: "Ocorr\xEAncias de crimes inform\xE1ticos (golpes e invas\xF5es pela internet) no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Crimes inform\xE1ticos",
        tags: ["crimes inform\xE1ticos", "internet", "golpes", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_estelionato_fraude",
        name: "Seguran\xE7a p\xFAblica do ES: Estelionato e fraude",
        shortTitle: "Estelionato e fraude",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto estelionato-fraude)",
        url: portalES("estelionato-fraude"),
        pagina: portalES("estelionato-fraude"),
        ckan: ckanES("estelionato-fraude"),
        format: "CSV",
        description: "Ocorr\xEAncias de estelionato e fraude no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Estelionato e fraude",
        tags: ["estelionato", "fraude", "golpes", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_roubo_a_pessoa",
        name: "Seguran\xE7a p\xFAblica do ES: Roubo a pessoa",
        shortTitle: "Roubo a pessoa",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto roubo-a-pessoa)",
        url: portalES("roubo-a-pessoa"),
        pagina: portalES("roubo-a-pessoa"),
        ckan: ckanES("roubo-a-pessoa"),
        format: "CSV",
        description: "Ocorr\xEAncias de roubo a pessoa no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Roubo a pessoa",
        tags: ["roubo", "pessoa", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_roubo_em_residecia",
        name: "Seguran\xE7a p\xFAblica do ES: Roubo em resid\xEAncia",
        shortTitle: "Roubo em resid\xEAncia",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto roubo-em-residecia)",
        url: portalES("roubo-em-residecia"),
        pagina: portalES("roubo-em-residecia"),
        ckan: ckanES("roubo-em-residecia"),
        format: "CSV",
        description: "Ocorr\xEAncias de roubo em resid\xEAncia no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Roubo em resid\xEAncia",
        tags: ["roubo", "resid\xEAncia", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, 'O endere\xE7o do conjunto tem "residecia" (sem o n), como informado; se a confer\xEAncia n\xE3o o encontrar, confira a grafia no portal.', "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_roubo_em_comercio",
        name: "Seguran\xE7a p\xFAblica do ES: Roubo em com\xE9rcio",
        shortTitle: "Roubo em com\xE9rcio",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto roubo-em-comercio)",
        url: portalES("roubo-em-comercio"),
        pagina: portalES("roubo-em-comercio"),
        ckan: ckanES("roubo-em-comercio"),
        format: "CSV",
        description: "Ocorr\xEAncias de roubo em estabelecimentos comerciais no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Roubo em com\xE9rcio",
        tags: ["roubo", "com\xE9rcio", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_roubo_em_transporte_coletivo",
        name: "Seguran\xE7a p\xFAblica do ES: Roubo em transporte coletivo",
        shortTitle: "Roubo em transporte coletivo",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto roubo-em-transporte-coletivo)",
        url: portalES("roubo-em-transporte-coletivo"),
        pagina: portalES("roubo-em-transporte-coletivo"),
        ckan: ckanES("roubo-em-transporte-coletivo"),
        format: "CSV",
        description: "Ocorr\xEAncias de roubo em \xF4nibus e outros transportes coletivos no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Roubo em transporte coletivo",
        tags: ["roubo", "\xF4nibus", "transporte coletivo", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_roubo_bicicleta",
        name: "Seguran\xE7a p\xFAblica do ES: Roubo de bicicleta",
        shortTitle: "Roubo de bicicleta",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto roubo-bicicleta)",
        url: portalES("roubo-bicicleta"),
        pagina: portalES("roubo-bicicleta"),
        ckan: ckanES("roubo-bicicleta"),
        format: "CSV",
        description: "Ocorr\xEAncias de roubo de bicicleta no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Roubo de bicicleta",
        tags: ["roubo", "bicicleta", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_furto_a_pessoa",
        name: "Seguran\xE7a p\xFAblica do ES: Furto a pessoa",
        shortTitle: "Furto a pessoa",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto furto-a-pessoa)",
        url: portalES("furto-a-pessoa"),
        pagina: portalES("furto-a-pessoa"),
        ckan: ckanES("furto-a-pessoa"),
        format: "CSV",
        description: "Ocorr\xEAncias de furto a pessoa no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Furto a pessoa",
        tags: ["furto", "pessoa", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_furto_em_residencia",
        name: "Seguran\xE7a p\xFAblica do ES: Furto em resid\xEAncia",
        shortTitle: "Furto em resid\xEAncia",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto furto-em-residencia)",
        url: portalES("furto-em-residencia"),
        pagina: portalES("furto-em-residencia"),
        ckan: ckanES("furto-em-residencia"),
        format: "CSV",
        description: "Ocorr\xEAncias de furto em resid\xEAncia no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Furto em resid\xEAncia",
        tags: ["furto", "resid\xEAncia", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_furto_em_comercio",
        name: "Seguran\xE7a p\xFAblica do ES: Furto em com\xE9rcio",
        shortTitle: "Furto em com\xE9rcio",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto furto-em-comercio)",
        url: portalES("furto-em-comercio"),
        pagina: portalES("furto-em-comercio"),
        ckan: ckanES("furto-em-comercio"),
        format: "CSV",
        description: "Ocorr\xEAncias de furto em estabelecimentos comerciais no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Furto em com\xE9rcio",
        tags: ["furto", "com\xE9rcio", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "seg_furto_veiculo",
        name: "Seguran\xE7a p\xFAblica do ES: Furto de ve\xEDculo",
        shortTitle: "Furto de ve\xEDculo",
        category: "Seguran\xE7a p\xFAblica",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto furto-veiculo)",
        url: portalES("furto-veiculo"),
        pagina: portalES("furto-veiculo"),
        ckan: ckanES("furto-veiculo"),
        format: "CSV",
        description: "Ocorr\xEAncias de furto de ve\xEDculos no ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Furto de ve\xEDculo",
        tags: ["furto", "ve\xEDculos", "seguran\xE7a p\xFAblica"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_SEGURANCA, SENSIVEL_SEGURANCA, "Marque a coluna do munic\xEDpio (se houver) para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      // ── Obras federais ──
      {
        id: "obrasgov_projetos",
        name: "Obrasgov.br: API de projetos de investimento e obras federais",
        shortTitle: "Obras federais (Obrasgov.br)",
        category: "Gest\xE3o e Metas",
        sphere: "federal",
        source: "Minist\xE9rio da Gest\xE3o e da Inova\xE7\xE3o: Obrasgov.br",
        url: "https://api.obrasgov.gestao.gov.br/obrasgov/api/swagger-ui/index.html",
        pagina: "https://api.obrasgov.gestao.gov.br/obrasgov/api/swagger-ui/index.html",
        format: "API",
        description: "Cadastro nacional de projetos de investimento e obras com recursos federais: situa\xE7\xE3o, executor, valores e localiza\xE7\xE3o (\xE9 poss\xEDvel filtrar pelo ES).",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Obras federais",
        tags: ["obras", "investimento", "federal", "projetos"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: ["Indicado pela reda\xE7\xE3o (out/2026), ainda n\xE3o conferido.", "A consulta de projetos costuma devolver os resultados em p\xE1ginas: a automa\xE7\xE3o ainda n\xE3o percorre p\xE1ginas. Confira na documenta\xE7\xE3o (Swagger) os par\xE2metros de UF e de p\xE1gina; d\xE1 para acrescentar a leitura por p\xE1ginas, se for \xFAtil."]
      },
      // ── Comércio exterior: acompanhamento antes do fechamento mensal (lista da redação, out/2026) ──
      {
        id: "mdic_balanca_semanal",
        name: "MDIC: balan\xE7a comercial preliminar (dados semanais e m\xE9dias di\xE1rias do m\xEAs em curso)",
        shortTitle: "Balan\xE7a comercial semanal (MDIC)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: balan\xE7a comercial preliminar",
        url: "https://balanca.economia.gov.br/balanca/SH/TOTAL.xlsx",
        pagina: "https://balanca.economia.gov.br/balanca/pg_principal_bc/principais_resultados.html",
        format: "XLSX",
        description: "Planilha regravada toda segunda-feira (por volta das 15h) com o acumulado do m\xEAs em curso, m\xE9dias di\xE1rias e varia\xE7\xE3o por setor.",
        columnsPreview: [],
        yearsPreview: "M\xEAs em curso",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal, segunda-feira \xE0s 16h",
        suggestedName: "Balan\xE7a comercial semanal",
        tags: ["balan\xE7a comercial", "semanal", "preliminar", "exporta\xE7\xF5es", "importa\xE7\xF5es"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/SH/TOTAL.xlsx", formato: "xlsx", agenda: { frequencia: "semanal", dia_da_semana: 1, hora: "16:00" } },
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "Dado do Brasil, n\xE3o do ES: a pr\xE9via semanal n\xE3o tem recorte por estado. O dado do ES s\xF3 vem com o fechamento mensal (Comex Stat).", "O layout da planilha (aba e linha do cabe\xE7alho) precisa ser conferido: mande as primeiras linhas que eu configuro.", CERT_COMEX]
      },
      {
        id: "bcb_cambio_exportacoes",
        name: "Banco Central: c\xE2mbio contratado, exporta\xE7\xF5es",
        shortTitle: "C\xE2mbio contratado: exporta\xE7\xF5es (BC)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "Banco Central do Brasil (SGS, s\xE9rie 22707)",
        url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.22707/dados/ultimos/24?formato=json",
        pagina: "https://www3.bcb.gov.br/sgspub/",
        format: "JSON",
        description: "Movimento de c\xE2mbio contratado comercial de exporta\xE7\xF5es: o dinheiro das vendas externas entrando no pa\xEDs.",
        columnsPreview: ["data", "valor"],
        yearsPreview: "24 registros mais recentes",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal (o BC atualiza \xE0s quartas-feiras)",
        suggestedName: "C\xE2mbio contratado: exporta\xE7\xF5es (BC)",
        tags: ["c\xE2mbio", "exporta\xE7\xF5es", "importa\xE7\xF5es", "banco central", "balan\xE7a comercial"],
        fonteSugerida: SERIE_BCB(22707),
        avisos: [ORIGEM_TEMPO_REAL, "Confira o nome e a periodicidade da s\xE9rie 22707 no SGS do Banco Central antes de usar: o n\xFAmero veio da lista. Dado do Brasil, n\xE3o do ES."]
      },
      {
        id: "bcb_cambio_importacoes",
        name: "Banco Central: c\xE2mbio contratado, importa\xE7\xF5es",
        shortTitle: "C\xE2mbio contratado: importa\xE7\xF5es (BC)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "Banco Central do Brasil (SGS, s\xE9rie 22709)",
        url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.22709/dados/ultimos/24?formato=json",
        pagina: "https://www3.bcb.gov.br/sgspub/",
        format: "JSON",
        description: "Movimento de c\xE2mbio contratado comercial de importa\xE7\xF5es.",
        columnsPreview: ["data", "valor"],
        yearsPreview: "24 registros mais recentes",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal (o BC atualiza \xE0s quartas-feiras)",
        suggestedName: "C\xE2mbio contratado: importa\xE7\xF5es (BC)",
        tags: ["c\xE2mbio", "exporta\xE7\xF5es", "importa\xE7\xF5es", "banco central", "balan\xE7a comercial"],
        fonteSugerida: SERIE_BCB(22709),
        avisos: [ORIGEM_TEMPO_REAL, "Confira o nome e a periodicidade da s\xE9rie 22709 no SGS do Banco Central antes de usar: o n\xFAmero veio da lista. Dado do Brasil, n\xE3o do ES."]
      },
      {
        id: "bcb_saldo_comercial",
        name: "Banco Central: saldo da balan\xE7a comercial",
        shortTitle: "Saldo da balan\xE7a comercial (BC)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "Banco Central do Brasil (SGS, s\xE9rie 22704)",
        url: "https://api.bcb.gov.br/dados/serie/bcdata.sgs.22704/dados/ultimos/24?formato=json",
        pagina: "https://www3.bcb.gov.br/sgspub/",
        format: "JSON",
        description: "Saldo da balan\xE7a comercial segundo a s\xE9rie do Banco Central.",
        columnsPreview: ["data", "valor"],
        yearsPreview: "24 registros mais recentes",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal (o BC atualiza \xE0s quartas-feiras)",
        suggestedName: "Saldo da balan\xE7a comercial (BC)",
        tags: ["c\xE2mbio", "exporta\xE7\xF5es", "importa\xE7\xF5es", "banco central", "balan\xE7a comercial"],
        fonteSugerida: SERIE_BCB(22704),
        avisos: [ORIGEM_TEMPO_REAL, "Confira o nome e a periodicidade da s\xE9rie 22704 no SGS do Banco Central antes de usar: o n\xFAmero veio da lista. Dado do Brasil, n\xE3o do ES."]
      },
      {
        id: "mdic_balanca_paginas",
        name: "MDIC: p\xE1ginas dos resultados preliminares da balan\xE7a (semana e m\xEAs em curso)",
        shortTitle: "Resultados preliminares (MDIC)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX",
        url: "https://balanca.economia.gov.br/balanca/pg_principal_bc/principais_resultados.html",
        pagina: "https://balanca.economia.gov.br/balanca/pg_principal_bc/principais_resultados.html",
        format: "API",
        description: "P\xE1ginas com os resultados preliminares e por setor/produto da semana.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Resultados preliminares (MDIC)",
        tags: ["balan\xE7a comercial", "preliminar"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "P\xE1ginas da web (sem arquivo de dados): para a coleta autom\xE1tica, use a planilha semanal."]
      },
      {
        id: "comex_sinal_atualizacao",
        name: "Comex Stat: data da \xFAltima atualiza\xE7\xE3o (\xFAltimo m\xEAs fechado)",
        shortTitle: "Atualiza\xE7\xE3o do Comex Stat",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://api-comexstat.mdic.gov.br/general/dates/updated",
        pagina: "https://api-comexstat.mdic.gov.br/general/dates/updated",
        format: "API",
        description: "Endere\xE7o leve que informa o \xFAltimo m\xEAs fechado na base do Comex Stat.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Atualiza\xE7\xE3o do Comex Stat",
        tags: ["comex", "atualiza\xE7\xE3o"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "J\xE1 usado pelas fontes do Comex Stat do cat\xE1logo como sinal de atualiza\xE7\xE3o: elas verificam todo dia e s\xF3 baixam quando o m\xEAs muda."]
      },
      {
        id: "pucomex",
        name: "Portal \xDAnico Siscomex (PUCOMEX): API operacional de despachos (DU-E, DUIMP, carga)",
        shortTitle: "Portal \xDAnico Siscomex",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "Receita Federal / SECEX",
        url: "https://docs.portalunico.siscomex.gov.br/",
        pagina: "https://docs.portalunico.siscomex.gov.br/",
        format: "API",
        description: "API transacional dos despachos aduaneiros em tempo real.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Portal \xDAnico Siscomex",
        tags: ["siscomex", "despachos", "du-e", "duimp"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "N\xE3o \xE9 dado aberto: exige certificado digital ICP-Brasil (e-CPF/e-CNPJ) de quem opera com\xE9rcio exterior. N\xE3o pode ser usada pela automa\xE7\xE3o."]
      },
      {
        id: "vports_lineup",
        name: "Vports (Autoridade Portu\xE1ria do ES): line-up e atraca\xE7\xF5es de navios",
        shortTitle: "Line-up de navios (Vports)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "Vports",
        url: "https://vports.com.br/",
        pagina: "https://vports.com.br/",
        format: "API",
        description: "Navios atracados, fundeados e programados nos portos capixabas, com tipo de carga e tonelagem prevista.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Line-up de navios (Vports)",
        tags: ["portos", "navios", "line-up", "vit\xF3ria"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "P\xE1gina da web (Opera\xE7\xF5es > Programa\xE7\xE3o de navios), sem arquivo de dados aberto conhecido."]
      },
      {
        id: "antaq_estatistico",
        name: "ANTAQ: Estat\xEDstico Aquavi\xE1rio (cargas e atraca\xE7\xF5es por porto)",
        shortTitle: "Estat\xEDstico Aquavi\xE1rio (ANTAQ)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "ANTAQ",
        url: "https://web3.antaq.gov.br/ea/sense/index.html",
        pagina: "https://web3.antaq.gov.br/ea/sense/index.html",
        format: "API",
        description: "Movimenta\xE7\xE3o de cargas e atraca\xE7\xF5es por instala\xE7\xE3o portu\xE1ria e mercadoria, com cerca de 30 dias de defasagem.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Estat\xEDstico Aquavi\xE1rio (ANTAQ)",
        tags: ["antaq", "portos", "cargas", "atraca\xE7\xF5es"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_TEMPO_REAL, "Painel. Os microdados anuais (Carga e Atraca\xE7\xE3o) podem virar fonte: procure os arquivos no dados.gov.br (antaq) e mande o endere\xE7o."]
      },
      // ── Comércio exterior: Comex Stat (lista enviada pela redação, out/2026) ──
      {
        id: "comex_exp_municipios_es",
        name: "Comex Stat: Exporta\xE7\xF5es dos munic\xEDpios do ES por produto (SH4) e pa\xEDs",
        shortTitle: "Exporta\xE7\xF5es dos munic\xEDpios do ES (Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/mun/EXP_{{ANO}}_MUN.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Exporta\xE7\xF5es das empresas de cada munic\xEDpio capixaba, por produto e pa\xEDs de destino, m\xEAs a m\xEAs.",
        columnsPreview: ["CO_ANO", "CO_MES", "SH4", "CO_PAIS", "SG_UF_MUN", "CO_MUN", "KG_LIQUIDO", "VL_FOB"],
        yearsPreview: "2015 em diante",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Verifica\xE7\xE3o di\xE1ria pelo sinal de atualiza\xE7\xE3o (o MDIC libera o m\xEAs na primeira semana)",
        suggestedName: "Exporta\xE7\xF5es dos munic\xEDpios do ES (Comex)",
        tags: ["exporta\xE7\xF5es", "munic\xEDpios", "com\xE9rcio exterior", "comex"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/mun/EXP_{{ANO}}_MUN.csv", anos: { de: 2015 }, formato: "csv", agenda: AGENDA_COMEX, sinal_de_novidade: SINAL_COMEX, colunas_tempo: { ano: "ano", mes: "mes" }, tratamento: { filtrar: { SG_UF_MUN: "ES" }, renomear: { CO_ANO: "ano", CO_MES: "mes", SH4: "sh4", CO_PAIS: "cod_pais", CO_MUN: "cod_mun_comex", KG_LIQUIDO: "kg_liquido", VL_FOB: "valor_fob_usd" }, inteiros: ["ano", "mes"], numeros: ["kg_liquido", "valor_fob_usd"], tipos: { sh4: "category", cod_pais: "category", cod_mun_comex: "category" }, agrupar: { por: ["ano", "mes", "cod_mun_comex", "sh4", "cod_pais"], somar: ["valor_fob_usd", "kg_liquido"] } } },
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX, "Arquivo do Brasil inteiro, um por ano (dezenas de MB): a automa\xE7\xE3o filtra s\xF3 o ES (SG_UF_MUN = ES) e soma por m\xEAs, munic\xEDpio, produto (SH4) e pa\xEDs. Valores em d\xF3lares (US$ FOB) e quilos.", "O munic\xEDpio \xE9 o domic\xEDlio fiscal da empresa, n\xE3o onde o produto foi feito. O c\xF3digo de munic\xEDpio do Comex (CO_MUN) pode n\xE3o ser o do IBGE: use a tabela de munic\xEDpios do Comex (CO_MUN_GEO) para a correspond\xEAncia.", CERT_COMEX]
      },
      {
        id: "comex_imp_municipios_es",
        name: "Comex Stat: Importa\xE7\xF5es dos munic\xEDpios do ES por produto (SH4) e pa\xEDs",
        shortTitle: "Importa\xE7\xF5es dos munic\xEDpios do ES (Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/mun/IMP_{{ANO}}_MUN.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Importa\xE7\xF5es das empresas de cada munic\xEDpio capixaba, por produto e pa\xEDs de origem, m\xEAs a m\xEAs.",
        columnsPreview: ["CO_ANO", "CO_MES", "SH4", "CO_PAIS", "SG_UF_MUN", "CO_MUN", "KG_LIQUIDO", "VL_FOB"],
        yearsPreview: "2015 em diante",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Verifica\xE7\xE3o di\xE1ria pelo sinal de atualiza\xE7\xE3o (o MDIC libera o m\xEAs na primeira semana)",
        suggestedName: "Importa\xE7\xF5es dos munic\xEDpios do ES (Comex)",
        tags: ["importa\xE7\xF5es", "munic\xEDpios", "com\xE9rcio exterior", "comex"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/mun/IMP_{{ANO}}_MUN.csv", anos: { de: 2015 }, formato: "csv", agenda: AGENDA_COMEX, sinal_de_novidade: SINAL_COMEX, colunas_tempo: { ano: "ano", mes: "mes" }, tratamento: { filtrar: { SG_UF_MUN: "ES" }, renomear: { CO_ANO: "ano", CO_MES: "mes", SH4: "sh4", CO_PAIS: "cod_pais", CO_MUN: "cod_mun_comex", KG_LIQUIDO: "kg_liquido", VL_FOB: "valor_fob_usd" }, inteiros: ["ano", "mes"], numeros: ["kg_liquido", "valor_fob_usd"], tipos: { sh4: "category", cod_pais: "category", cod_mun_comex: "category" }, agrupar: { por: ["ano", "mes", "cod_mun_comex", "sh4", "cod_pais"], somar: ["valor_fob_usd", "kg_liquido"] } } },
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX, "Arquivo do Brasil inteiro, um por ano (dezenas de MB): a automa\xE7\xE3o filtra s\xF3 o ES (SG_UF_MUN = ES) e soma por m\xEAs, munic\xEDpio, produto (SH4) e pa\xEDs. Valores em d\xF3lares (US$ FOB) e quilos.", "O munic\xEDpio \xE9 o domic\xEDlio fiscal da empresa, n\xE3o onde o produto foi feito. O c\xF3digo de munic\xEDpio do Comex (CO_MUN) pode n\xE3o ser o do IBGE: use a tabela de munic\xEDpios do Comex (CO_MUN_GEO) para a correspond\xEAncia.", CERT_COMEX]
      },
      {
        id: "comex_exp_ncm_es",
        name: "Comex Stat: Exporta\xE7\xF5es do ES por produto (NCM), pa\xEDs, via e porto",
        shortTitle: "Exporta\xE7\xF5es do ES por produto e porto (Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/ncm/EXP_{{ANO}}.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Exporta\xE7\xF5es do Esp\xEDrito Santo por produto detalhado (NCM 8 d\xEDgitos), pa\xEDs de destino, via de transporte e porto/alf\xE2ndega.",
        columnsPreview: ["CO_ANO", "CO_MES", "CO_NCM", "CO_UNID", "CO_PAIS", "SG_UF_NCM", "CO_VIA", "CO_URF", "QT_ESTAT", "KG_LIQUIDO", "VL_FOB"],
        yearsPreview: "2015 em diante",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Verifica\xE7\xE3o di\xE1ria pelo sinal de atualiza\xE7\xE3o (o MDIC libera o m\xEAs na primeira semana)",
        suggestedName: "Exporta\xE7\xF5es do ES por produto e porto (Comex)",
        tags: ["exporta\xE7\xF5es", "ncm", "portos", "caf\xE9", "min\xE9rio", "rochas", "celulose"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/ncm/EXP_{{ANO}}.csv", anos: { de: 2015 }, formato: "csv", agenda: AGENDA_COMEX, sinal_de_novidade: SINAL_COMEX, colunas_tempo: { ano: "ano", mes: "mes" }, tratamento: { filtrar: { SG_UF_NCM: "ES" }, renomear: { CO_ANO: "ano", CO_MES: "mes", CO_NCM: "ncm", CO_PAIS: "cod_pais", CO_VIA: "cod_via", CO_URF: "cod_urf", KG_LIQUIDO: "kg_liquido", VL_FOB: "valor_fob_usd" }, inteiros: ["ano", "mes"], numeros: ["kg_liquido", "valor_fob_usd"], tipos: { ncm: "category", cod_pais: "category", cod_via: "category", cod_urf: "category" }, agrupar: { por: ["ano", "mes", "ncm", "cod_pais", "cod_via", "cod_urf"], somar: ["valor_fob_usd", "kg_liquido"] } } },
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX, "Arquivo do Brasil inteiro, um por ano (centenas de MB): a automa\xE7\xE3o filtra s\xF3 o ES (SG_UF_NCM = ES) e soma por m\xEAs, produto (NCM), pa\xEDs, via de transporte e porto/alf\xE2ndega (URF). Valores em US$ FOB e quilos. A primeira carga pode levar mais de uma execu\xE7\xE3o.", CERT_COMEX]
      },
      {
        id: "comex_imp_ncm_es",
        name: "Comex Stat: Importa\xE7\xF5es do ES por produto (NCM), pa\xEDs, via e porto",
        shortTitle: "Importa\xE7\xF5es do ES por produto e porto (Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/ncm/IMP_{{ANO}}.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Importa\xE7\xF5es do Esp\xEDrito Santo por produto detalhado (NCM 8 d\xEDgitos), pa\xEDs de origem, via de transporte e porto/alf\xE2ndega.",
        columnsPreview: ["CO_ANO", "CO_MES", "CO_NCM", "CO_UNID", "CO_PAIS", "SG_UF_NCM", "CO_VIA", "CO_URF", "QT_ESTAT", "KG_LIQUIDO", "VL_FOB", "VL_FRETE", "VL_SEGURO"],
        yearsPreview: "2015 em diante",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Verifica\xE7\xE3o di\xE1ria pelo sinal de atualiza\xE7\xE3o (o MDIC libera o m\xEAs na primeira semana)",
        suggestedName: "Importa\xE7\xF5es do ES por produto e porto (Comex)",
        tags: ["importa\xE7\xF5es", "ncm", "portos"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/comexstat-bd/ncm/IMP_{{ANO}}.csv", anos: { de: 2015 }, formato: "csv", agenda: AGENDA_COMEX, sinal_de_novidade: SINAL_COMEX, colunas_tempo: { ano: "ano", mes: "mes" }, tratamento: { filtrar: { SG_UF_NCM: "ES" }, renomear: { CO_ANO: "ano", CO_MES: "mes", CO_NCM: "ncm", CO_PAIS: "cod_pais", CO_VIA: "cod_via", CO_URF: "cod_urf", KG_LIQUIDO: "kg_liquido", VL_FOB: "valor_fob_usd" }, inteiros: ["ano", "mes"], numeros: ["kg_liquido", "valor_fob_usd"], tipos: { ncm: "category", cod_pais: "category", cod_via: "category", cod_urf: "category" }, agrupar: { por: ["ano", "mes", "ncm", "cod_pais", "cod_via", "cod_urf"], somar: ["valor_fob_usd", "kg_liquido"] } } },
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX, "Arquivo do Brasil inteiro, um por ano (centenas de MB): a automa\xE7\xE3o filtra s\xF3 o ES (SG_UF_NCM = ES) e soma por m\xEAs, produto (NCM), pa\xEDs, via de transporte e porto/alf\xE2ndega (URF). Valores em US$ FOB e quilos. A primeira carga pode levar mais de uma execu\xE7\xE3o.", CERT_COMEX]
      },
      {
        id: "comex_tabela_pais",
        name: "Comex Stat: tabela de c\xF3digos PAIS",
        shortTitle: "Pa\xEDses (c\xF3digos do Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/tabelas/PAIS.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "C\xF3digos e nomes dos pa\xEDses usados pelo Comex Stat.",
        columnsPreview: ["CO_PAIS", "NO_PAIS"],
        yearsPreview: "Tabela vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Pa\xEDses (c\xF3digos do Comex)",
        tags: ["comex", "c\xF3digos", "tabela auxiliar"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/tabelas/PAIS.csv", formato: "csv", agenda: { frequencia: "anual", dia_do_mes: 15, mes: 2, hora: "06:00" } },
        importavelNoApp: !0,
        avisos: [ORIGEM_COMEX, "Tabela de refer\xEAncia (dicion\xE1rio), n\xE3o uma s\xE9rie: serve para trocar c\xF3digos por nomes. Colunas a conferir.", CERT_COMEX]
      },
      {
        id: "comex_tabela_uf_mun",
        name: "Comex Stat: tabela de c\xF3digos UF_MUN",
        shortTitle: "Munic\xEDpios (c\xF3digos do Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/tabelas/UF_MUN.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Correspond\xEAncia entre o c\xF3digo de munic\xEDpio do Comex (CO_MUN_GEO) e o nome; essencial para ligar ao IBGE.",
        columnsPreview: ["CO_MUN_GEO", "NO_MUN", "SG_UF"],
        yearsPreview: "Tabela vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Munic\xEDpios (c\xF3digos do Comex)",
        tags: ["comex", "c\xF3digos", "tabela auxiliar"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/tabelas/UF_MUN.csv", formato: "csv", agenda: { frequencia: "anual", dia_do_mes: 15, mes: 2, hora: "06:00" } },
        importavelNoApp: !0,
        avisos: [ORIGEM_COMEX, "Tabela de refer\xEAncia (dicion\xE1rio), n\xE3o uma s\xE9rie: serve para trocar c\xF3digos por nomes. Colunas a conferir.", CERT_COMEX]
      },
      {
        id: "comex_tabela_ncm_sh",
        name: "Comex Stat: tabela de c\xF3digos NCM_SH",
        shortTitle: "Produtos SH2, SH4 e SH6 (c\xF3digos do Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/tabelas/NCM_SH.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Descri\xE7\xE3o dos cap\xEDtulos (SH2), posi\xE7\xF5es (SH4) e subposi\xE7\xF5es (SH6) do Sistema Harmonizado.",
        columnsPreview: ["CO_SH6", "NO_SH6_POR", "CO_SH4", "NO_SH4_POR", "CO_SH2", "NO_SH2_POR"],
        yearsPreview: "Tabela vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Produtos SH2, SH4 e SH6 (c\xF3digos do Comex)",
        tags: ["comex", "c\xF3digos", "tabela auxiliar"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/tabelas/NCM_SH.csv", formato: "csv", agenda: { frequencia: "anual", dia_do_mes: 15, mes: 2, hora: "06:00" } },
        importavelNoApp: !0,
        avisos: [ORIGEM_COMEX, "Tabela de refer\xEAncia (dicion\xE1rio), n\xE3o uma s\xE9rie: serve para trocar c\xF3digos por nomes. Colunas a conferir.", CERT_COMEX]
      },
      {
        id: "comex_tabela_urf",
        name: "Comex Stat: tabela de c\xF3digos URF",
        shortTitle: "Portos e alf\xE2ndegas, URF (c\xF3digos do Comex)",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://balanca.economia.gov.br/balanca/bd/tabelas/URF.csv",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "CSV",
        description: "Unidades da Receita Federal (portos e alf\xE2ndegas), como Vit\xF3ria, Tubar\xE3o e Barra do Riacho.",
        columnsPreview: ["CO_URF", "NO_URF"],
        yearsPreview: "Tabela vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Portos e alf\xE2ndegas, URF (c\xF3digos do Comex)",
        tags: ["comex", "c\xF3digos", "tabela auxiliar"],
        fonteSugerida: { url: "https://balanca.economia.gov.br/balanca/bd/tabelas/URF.csv", formato: "csv", agenda: { frequencia: "anual", dia_do_mes: 15, mes: 2, hora: "06:00" } },
        importavelNoApp: !0,
        avisos: [ORIGEM_COMEX, "Tabela de refer\xEAncia (dicion\xE1rio), n\xE3o uma s\xE9rie: serve para trocar c\xF3digos por nomes. Colunas a conferir.", CERT_COMEX]
      },
      {
        id: "comex_api",
        name: "Comex Stat: API oficial (consultas por POST)",
        shortTitle: "API do Comex Stat",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://api-comexstat.mdic.gov.br/docs",
        pagina: "https://api-comexstat.mdic.gov.br/docs",
        format: "API",
        description: "Consultas por estado, munic\xEDpio, produto, pa\xEDs, via e porto; a \xFAltima data atualizada fica em /general/dates/updated.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "API do Comex Stat",
        tags: ["api", "comex"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX, "As consultas de dados usam POST (pacote JSON com per\xEDodo, filtros e detalhamentos); o app e a automa\xE7\xE3o usam os arquivos CSV anuais, que trazem os mesmos dados."]
      },
      {
        id: "comex_painel",
        name: "Comex Stat: painel web e dados abertos",
        shortTitle: "Painel Comex Stat",
        category: "Com\xE9rcio exterior",
        sphere: "federal",
        source: "MDIC / SECEX: Comex Stat",
        url: "https://comexstat.mdic.gov.br",
        pagina: "https://comexstat.mdic.gov.br/pt/dados-abertos",
        format: "API",
        description: "Consulta interativa e p\xE1gina dos arquivos de dados abertos (inclui a planilha TABELAS_AUXILIARES.xlsx com todos os c\xF3digos).",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Painel Comex Stat",
        tags: ["comex", "painel"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_COMEX]
      },
      // ── Educação (lista enviada pela redação, out/2026) ──
      {
        id: "fed_ibge_ideb_municipios",
        name: "IDEB dos munic\xEDpios do ES (anos iniciais e finais, rede p\xFAblica), pela API do IBGE",
        shortTitle: "IDEB dos munic\xEDpios (IBGE/INEP)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "INEP, via API de Pesquisas do IBGE (IBGE Cidades@)",
        url: "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/30255|30256/resultados/{{MUNICIPIOS_ES}}",
        pagina: "https://servicodados.ibge.gov.br/api/docs/pesquisas",
        format: "JSON",
        description: "S\xE9rie hist\xF3rica do IDEB (anos iniciais e anos finais do ensino fundamental, rede p\xFAblica) dos 78 munic\xEDpios capixabas.",
        columnsPreview: ["indicador", "cod_ibge", "municipio", "ano", "valor"],
        yearsPreview: "S\xE9rie hist\xF3rica (IDEB a cada 2 anos)",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual (o IDEB sai a cada dois anos)",
        suggestedName: "IDEB dos munic\xEDpios",
        tags: ["ideb", "educa\xE7\xE3o", "inep", "munic\xEDpios", "ensino fundamental"],
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Indicadores 30255 (anos iniciais) e 30256 (anos finais), conforme a lista. {{MUNICIPIOS_ES}} \xE9 trocado pela automa\xE7\xE3o pelos c\xF3digos dos 78 munic\xEDpios; por isso, use como fonte autom\xE1tica (a importa\xE7\xE3o direta no app n\xE3o monta esse endere\xE7o).", "A resposta traz s\xF3 o c\xF3digo do munic\xEDpio: a automa\xE7\xE3o acrescenta o nome oficial pela lista do IBGE."]
      },
      {
        id: "fed_pnad_analfabetismo_es",
        name: "IBGE/PNAD Cont\xEDnua: Taxa de analfabetismo no ES (meta 9 do PNE)",
        shortTitle: "Analfabetismo no ES (PNAD)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: PNAD Cont\xEDnua Educa\xE7\xE3o (SIDRA, tabela 7113)",
        url: "https://servicodados.ibge.gov.br/api/v3/agregados/7113/periodos/-5/variaveis/10267?localidades=N3[32]",
        pagina: "https://sidra.ibge.gov.br/tabela/7113",
        format: "JSON",
        description: "Taxa de analfabetismo das pessoas de 15 anos ou mais no Esp\xEDrito Santo, \xFAltimos 5 anos.",
        columnsPreview: ["cod_ibge", "localidade", "variavel", "unidade", "ano", "valor"],
        yearsPreview: "5 anos mais recentes",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Analfabetismo no ES",
        tags: ["analfabetismo", "pnad", "pne", "educa\xE7\xE3o"],
        avisos: [ORIGEM_EDU, AGREGADOS, "Dado do Estado (PNAD Cont\xEDnua n\xE3o tem recorte por munic\xEDpio)."]
      },
      {
        id: "fed_pnad_frequencia_escolar_es",
        name: "IBGE/PNAD Cont\xEDnua: Taxa ajustada de frequ\xEAncia escolar l\xEDquida no ES (metas 1, 2 e 3 do PNE)",
        shortTitle: "Frequ\xEAncia escolar l\xEDquida no ES (PNAD)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: PNAD Cont\xEDnua Educa\xE7\xE3o (SIDRA, tabela 7126)",
        url: "https://servicodados.ibge.gov.br/api/v3/agregados/7126/periodos/-5/variaveis/10277?localidades=N3[32]",
        pagina: "https://sidra.ibge.gov.br/tabela/7126",
        format: "JSON",
        description: "Taxa ajustada de frequ\xEAncia escolar l\xEDquida por etapa de ensino no Esp\xEDrito Santo, \xFAltimos 5 anos.",
        columnsPreview: ["cod_ibge", "localidade", "variavel", "unidade", "ano", "valor"],
        yearsPreview: "5 anos mais recentes",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Frequ\xEAncia escolar no ES",
        tags: ["frequ\xEAncia escolar", "pnad", "pne", "educa\xE7\xE3o"],
        avisos: [ORIGEM_EDU, AGREGADOS, "Dado do Estado (PNAD Cont\xEDnua n\xE3o tem recorte por munic\xEDpio). A tabela pode ter classifica\xE7\xE3o por etapa de ensino: confira as colunas."]
      },
      {
        id: "fed_ibge_indicadores_educacao",
        name: "IBGE Cidades@: \xE1rvore de indicadores de educa\xE7\xE3o (matr\xEDculas, docentes, escolas, escolariza\xE7\xE3o)",
        shortTitle: "Indicadores de educa\xE7\xE3o (IBGE Cidades)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: API de Pesquisas",
        url: "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29168",
        pagina: "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/29168",
        format: "API",
        description: "Lista dos indicadores de educa\xE7\xE3o do IBGE Cidades, para escolher os c\xF3digos de outras fontes.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Indicadores de educa\xE7\xE3o (IBGE Cidades)",
        tags: ["educa\xE7\xE3o", "matr\xEDculas", "docentes", "escolas"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Use os c\xF3digos de indicador desta \xE1rvore no mesmo formato do IDEB (\u2026/indicadores/C\xD3DIGO/resultados/{{MUNICIPIOS_ES}})."]
      },
      {
        id: "inep_ideb_resultados",
        name: "INEP: resultados do IDEB por escola e munic\xEDpio (planilhas, com metas)",
        shortTitle: "IDEB por escola e metas (INEP)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "INEP",
        url: "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados",
        pagina: "https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/ideb/resultados",
        format: "API",
        description: "Planilhas oficiais com notas, fluxo e metas do IDEB por escola, rede e munic\xEDpio.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "IDEB por escola e metas (INEP)",
        tags: ["ideb", "metas", "escolas", "inep"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "S\xE3o planilhas para baixar (Excel/ZIP). Escolhida a planilha, ela pode virar fonte: a automa\xE7\xE3o j\xE1 l\xEA Excel e ZIP."]
      },
      {
        id: "inep_saeb_microdados",
        name: "INEP: microdados do SAEB",
        shortTitle: "Microdados do SAEB (INEP)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "INEP",
        url: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/saeb",
        pagina: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/saeb",
        format: "API",
        description: "Microdados das provas do SAEB (profici\xEAncia em portugu\xEAs e matem\xE1tica).",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Microdados do SAEB (INEP)",
        tags: ["saeb", "profici\xEAncia", "microdados"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Microdados muito grandes (v\xE1rios GB) e com documenta\xE7\xE3o pr\xF3pria: para o anu\xE1rio, prefira os resultados agregados por munic\xEDpio."]
      },
      {
        id: "inep_indicadores_educacionais",
        name: "INEP: indicadores educacionais (aprova\xE7\xE3o, reprova\xE7\xE3o, abandono)",
        shortTitle: "Rendimento escolar (INEP)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "INEP",
        url: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais",
        pagina: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/indicadores-educacionais",
        format: "API",
        description: "Taxas de rendimento e outros indicadores por munic\xEDpio e escola.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Rendimento escolar (INEP)",
        tags: ["aprova\xE7\xE3o", "reprova\xE7\xE3o", "abandono", "rendimento"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Planilhas por ano: escolhido o arquivo, ele pode virar fonte."]
      },
      {
        id: "qedu_api",
        name: "QEdu: API e exporta\xE7\xF5es (SAEB, IDEB, Censo Escolar)",
        shortTitle: "QEdu",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "QEdu (Funda\xE7\xE3o Lemann / Meritt), com base no INEP",
        url: "https://api.qedu.org.br/",
        pagina: "https://api.qedu.org.br/",
        format: "API",
        description: "Dados do INEP organizados; exporta\xE7\xE3o por munic\xEDpio do ES no site.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "QEdu",
        tags: ["qedu", "saeb", "ideb", "censo escolar"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "A API exige token (cadastro). N\xE3o \xE9 fonte oficial prim\xE1ria: para publicar, confira os n\xFAmeros com o INEP."]
      },
      {
        id: "basedosdados_inep",
        name: "Base dos Dados: IDEB e SAEB prontos para consulta (BigQuery)",
        shortTitle: "Base dos Dados (IDEB/SAEB)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "Base dos Dados, com base no INEP",
        url: "https://basedosdados.org/dataset/br-inep-ideb",
        pagina: "https://basedosdados.org/dataset/br-inep-ideb",
        format: "API",
        description: "Conjuntos do INEP tratados para consulta em SQL (IDEB: br-inep-ideb; SAEB: br-inep-saeb).",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Base dos Dados (IDEB/SAEB)",
        tags: ["base dos dados", "bigquery", "ideb", "saeb"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Exige conta no Google Cloud (BigQuery); a automa\xE7\xE3o n\xE3o usa esse caminho."]
      },
      {
        id: "inep_pne_monitoramento",
        name: "INEP: monitoramento das metas do PNE (por UF e munic\xEDpio)",
        shortTitle: "Monitoramento do PNE (INEP)",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "INEP",
        url: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/inep-data/monitoramento-do-pne",
        pagina: "https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/inep-data/monitoramento-do-pne",
        format: "API",
        description: "Base de dados do monitoramento das 20 metas do Plano Nacional de Educa\xE7\xE3o.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Monitoramento do PNE (INEP)",
        tags: ["pne", "metas", "educa\xE7\xE3o"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "P\xE1gina com arquivos para baixar: escolhido o arquivo, ele pode virar fonte."]
      },
      {
        id: "mec_simec_pne",
        name: "MEC/SIMEC: painel de monitoramento do PNE e dos planos estaduais e municipais",
        shortTitle: "SIMEC: metas do PNE",
        category: "Educa\xE7\xE3o",
        sphere: "federal",
        source: "MEC: SIMEC",
        url: "https://simec.mec.gov.br/pde/grafico_pne.php",
        pagina: "https://simec.mec.gov.br/pde/grafico_pne.php",
        format: "API",
        description: "Gr\xE1ficos das metas do PNE por estado e munic\xEDpio.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "SIMEC: metas do PNE",
        tags: ["pne", "simec", "metas"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "\xC9 um painel (gr\xE1ficos), n\xE3o uma API de dados."]
      },
      {
        id: "es_sedu_conjuntos",
        name: "Portal de Dados Abertos do ES: conjuntos da Secretaria da Educa\xE7\xE3o (SEDU)",
        shortTitle: "Conjuntos da SEDU no portal do ES",
        category: "Educa\xE7\xE3o",
        sphere: "es_estadual",
        source: "dados.es.gov.br (organiza\xE7\xE3o SEDU)",
        url: "https://dados.es.gov.br/organization/sedu",
        pagina: "https://dados.es.gov.br/organization/sedu",
        format: "API",
        description: "Lista de conjuntos publicados pela SEDU no portal do ES.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Conjuntos da SEDU no portal do ES",
        tags: ["sedu", "educa\xE7\xE3o", "es"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Dos conjuntos desta lista, mande os links que interessarem: entram como fontes, como os outros do portal."]
      },
      {
        id: "es_paebes",
        name: "SEDU: PAEBES e PAEBES Alfa (avalia\xE7\xE3o estadual anual)",
        shortTitle: "PAEBES (SEDU)",
        category: "Educa\xE7\xE3o",
        sphere: "es_estadual",
        source: "SEDU-ES",
        url: "https://sedu.es.gov.br/paebes",
        pagina: "https://sedu.es.gov.br/paebes",
        format: "API",
        description: "Resultados da avalia\xE7\xE3o estadual censit\xE1ria do ES.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "PAEBES (SEDU)",
        tags: ["paebes", "avalia\xE7\xE3o", "es"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "P\xE1gina da SEDU: confira se h\xE1 planilhas para baixar."]
      },
      {
        id: "es_idebes",
        name: "SEDU: IDEBES (\xEDndice estadual de educa\xE7\xE3o)",
        shortTitle: "IDEBES (SEDU)",
        category: "Educa\xE7\xE3o",
        sphere: "es_estadual",
        source: "SEDU-ES",
        url: "https://sedu.es.gov.br/idebes",
        pagina: "https://sedu.es.gov.br/idebes",
        format: "API",
        description: "\xCDndice de desenvolvimento da educa\xE7\xE3o b\xE1sica do ES.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "IDEBES (SEDU)",
        tags: ["idebes", "educa\xE7\xE3o", "es"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "P\xE1gina da SEDU: confira se h\xE1 planilhas para baixar."]
      },
      {
        id: "tce_cidades_educacao",
        name: "TCE-ES: painel CidadES, \xE1rea de Educa\xE7\xE3o (25% constitucional, Fundeb, creches, magist\xE9rio, IDEB)",
        shortTitle: "CidadES Educa\xE7\xE3o (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "TCE-ES: CidadES",
        url: "https://cidades.tcees.tc.br/",
        pagina: "https://cidades.tcees.tc.br/",
        format: "API",
        description: "Painel do TCE-ES que cruza gastos com educa\xE7\xE3o, Fundeb, vagas em creches e IDEB dos 78 munic\xEDpios.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "CidadES Educa\xE7\xE3o (TCE-ES)",
        tags: ["tce", "cidades", "educa\xE7\xE3o", "fundeb", "creches"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_EDU, "Painel com exporta\xE7\xE3o manual. Os gastos com educa\xE7\xE3o por munic\xEDpio j\xE1 est\xE3o no cat\xE1logo (TCE-ES, arquivo Educa\xE7\xE3o)."]
      },
      // ── IBGE (lista enviada pela redação, out/2026). APIs oficiais conhecidas; tabelas e variáveis a conferir ──
      {
        id: "fed_ibge_distritos_es",
        name: "IBGE: Distritos do Esp\xEDrito Santo",
        shortTitle: "Distritos do ES (IBGE)",
        category: "Refer\xEAncias territoriais",
        sphere: "federal",
        source: "IBGE: API de Localidades",
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/32/distritos",
        pagina: "https://servicodados.ibge.gov.br/api/docs/localidades",
        format: "JSON",
        description: "Distritos dos munic\xEDpios capixabas, com c\xF3digos do IBGE e o munic\xEDpio de cada um.",
        columnsPreview: ["id", "nome", "municipio_id", "municipio_nome"],
        yearsPreview: "Divis\xE3o territorial vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Distritos do ES",
        tags: ["distritos", "ibge", "territ\xF3rio"],
        avisos: [ORIGEM_IBGE]
      },
      {
        id: "fed_ibge_regioes_imediatas_es",
        name: "IBGE: Regi\xF5es Geogr\xE1ficas Imediatas do ES",
        shortTitle: "Regi\xF5es imediatas do ES (IBGE)",
        category: "Refer\xEAncias territoriais",
        sphere: "federal",
        source: "IBGE: API de Localidades",
        url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/32/regioes-imediatas",
        pagina: "https://servicodados.ibge.gov.br/api/docs/localidades",
        format: "JSON",
        description: "Regi\xF5es geogr\xE1ficas imediatas do ES (agrupamentos de munic\xEDpios usados pelo IBGE).",
        columnsPreview: ["id", "nome", "regiao-intermediaria_nome"],
        yearsPreview: "Divis\xE3o regional vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Regi\xF5es imediatas do ES",
        tags: ["regi\xF5es", "ibge", "territ\xF3rio"],
        avisos: [ORIGEM_IBGE]
      },
      {
        id: "fed_ibge_populacao_censo2022",
        name: "IBGE: Popula\xE7\xE3o residente dos munic\xEDpios do ES (Censo 2022)",
        shortTitle: "Popula\xE7\xE3o Censo 2022 (IBGE)",
        category: "Popula\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: Censo Demogr\xE1fico 2022 (SIDRA, tabela 4714)",
        url: "https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/2022/variaveis/93?localidades=N6[N3[32]]",
        pagina: "https://sidra.ibge.gov.br/tabela/4714",
        format: "JSON",
        description: "Popula\xE7\xE3o residente dos 78 munic\xEDpios no Censo 2022.",
        columnsPreview: ["cod_ibge", "municipio", "variavel", "unidade", "ano", "valor"],
        yearsPreview: "2022",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "N\xE3o muda (Censo); anual s\xF3 para conferir revis\xF5es",
        suggestedName: "Popula\xE7\xE3o Censo 2022",
        tags: ["popula\xE7\xE3o", "censo", "munic\xEDpios", "ibge"],
        avisos: [ORIGEM_IBGE, AGREGADOS]
      },
      {
        id: "fed_ibge_estimativa_populacao",
        name: "IBGE: Estimativas de popula\xE7\xE3o dos munic\xEDpios do ES",
        shortTitle: "Estimativas de popula\xE7\xE3o (IBGE)",
        category: "Popula\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: Estimativas da Popula\xE7\xE3o (SIDRA, tabela 6579)",
        url: "https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-10/variaveis/9324?localidades=N6[N3[32]]",
        pagina: "https://sidra.ibge.gov.br/tabela/6579",
        format: "JSON",
        description: "Popula\xE7\xE3o estimada dos munic\xEDpios, publicada pelo IBGE todo ano (os 10 per\xEDodos mais recentes).",
        columnsPreview: ["cod_ibge", "municipio", "variavel", "unidade", "ano", "valor"],
        yearsPreview: "10 per\xEDodos mais recentes",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual (o IBGE divulga em agosto)",
        suggestedName: "Estimativas de popula\xE7\xE3o",
        tags: ["popula\xE7\xE3o", "estimativa", "munic\xEDpios", "ibge"],
        avisos: [ORIGEM_IBGE, AGREGADOS, 'O exemplo da lista usava "periodos/-1" (s\xF3 o ano mais recente); aqui s\xE3o os 10 mais recentes, para a s\xE9rie hist\xF3rica.']
      },
      {
        id: "fed_ibge_pib_municipal",
        name: "IBGE: PIB dos munic\xEDpios do ES (pre\xE7os correntes)",
        shortTitle: "PIB municipal (IBGE)",
        category: "Economia",
        sphere: "federal",
        source: "IBGE: PIB dos Munic\xEDpios (SIDRA, tabela 5938)",
        url: "https://servicodados.ibge.gov.br/api/v3/agregados/5938/periodos/-10/variaveis/37?localidades=N6[N3[32]]",
        pagina: "https://sidra.ibge.gov.br/tabela/5938",
        format: "JSON",
        description: "Produto Interno Bruto dos munic\xEDpios a pre\xE7os correntes (mil reais), 10 anos mais recentes.",
        columnsPreview: ["cod_ibge", "municipio", "variavel", "unidade", "ano", "valor"],
        yearsPreview: "10 anos mais recentes",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual (o IBGE divulga com cerca de 2 anos de defasagem)",
        suggestedName: "PIB municipal",
        tags: ["pib", "economia", "munic\xEDpios", "ibge"],
        avisos: [ORIGEM_IBGE, AGREGADOS, "A vari\xE1vel 37 \xE9 o PIB a pre\xE7os correntes. O PIB per capita \xE9 outra vari\xE1vel da mesma tabela: confira o c\xF3digo nos metadados (\u2026/agregados/5938/metadados) e cadastre como outra fonte."]
      },
      {
        id: "fed_ibge_cnae_classes",
        name: "IBGE: Classifica\xE7\xE3o Nacional de Atividades Econ\xF4micas (CNAE), classes",
        shortTitle: "CNAE: classes de atividade (IBGE)",
        category: "Refer\xEAncias",
        sphere: "federal",
        source: "IBGE / CONCLA: API CNAE",
        url: "https://servicodados.ibge.gov.br/api/v2/cnae/classes",
        pagina: "https://servicodados.ibge.gov.br/api/docs/cnae?versao=2",
        format: "JSON",
        description: "Tabela de classes da CNAE com grupo, divis\xE3o e se\xE7\xE3o: \xFAtil para nomear atividades em dados de empresas (CNPJ).",
        columnsPreview: ["id", "descricao", "grupo_descricao", "grupo_divisao_secao_descricao"],
        yearsPreview: "Vers\xE3o vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "CNAE classes",
        tags: ["cnae", "atividades", "empresas", "ibge"],
        avisos: [ORIGEM_IBGE, "Tabela de refer\xEAncia (dicion\xE1rio), n\xE3o uma s\xE9rie: serve para juntar com outras bases."]
      },
      {
        id: "fed_ibge_malhas_es",
        name: "IBGE: Malhas territoriais do ES (mapa dos 78 munic\xEDpios, GeoJSON)",
        shortTitle: "Mapa dos munic\xEDpios do ES (IBGE)",
        category: "Refer\xEAncias territoriais",
        sphere: "federal",
        source: "IBGE: API de Malhas (v3)",
        url: "https://servicodados.ibge.gov.br/api/v3/malhas/estados/32?formato=application/vnd.geo+json&qualidade=intermediaria&intrarregiao=municipio",
        pagina: "https://servicodados.ibge.gov.br/api/docs/malhas?versao=3",
        format: "API",
        description: "Pol\xEDgonos dos 78 munic\xEDpios em GeoJSON. A liga\xE7\xE3o com as tabelas \xE9 feita pelo c\xF3digo do IBGE (properties.codarea).",
        columnsPreview: [],
        yearsPreview: "Malha vigente",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Mapa dos munic\xEDpios do ES",
        tags: ["mapa", "geojson", "munic\xEDpios", "ibge"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE, 'Dados de mapa, n\xE3o tabela: os pain\xE9is atuais ainda n\xE3o desenham mapas. Para web, a qualidade "intermediaria" ou "minima" carrega bem mais r\xE1pido que "maxima".']
      },
      {
        id: "fed_ibge_sidra",
        name: "IBGE: SIDRA e API de Agregados (todas as pesquisas: Censo, PNAD, PAM, IPCA\u2026)",
        shortTitle: "SIDRA / Agregados (IBGE)",
        category: "Refer\xEAncias",
        sphere: "federal",
        source: "IBGE: SIDRA",
        url: "https://apisidra.ibge.gov.br/",
        pagina: "https://servicodados.ibge.gov.br/api/docs/agregados?versao=3",
        format: "API",
        description: "Qualquer tabela do SIDRA pode virar fonte: monte a consulta no gerador de links e use o endere\xE7o da API de Agregados (servicodados.ibge.gov.br/api/v3/agregados/\u2026).",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "SIDRA",
        tags: ["sidra", "ibge", "censo", "pnad", "agregados"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE, "Para os munic\xEDpios do ES, use localidades=N6[N3[32]]. Endere\xE7os da API de Agregados s\xE3o lidos pelo app e pela automa\xE7\xE3o j\xE1 em formato de tabela."]
      },
      {
        id: "fed_ibge_cidades_indicadores",
        name: "IBGE Cidades@: indicadores municipais (IDEB, mortalidade infantil, sal\xE1rio m\xE9dio, frota\u2026)",
        shortTitle: "Indicadores IBGE Cidades",
        category: "Refer\xEAncias",
        sphere: "federal",
        source: "IBGE: API de Pesquisas",
        url: "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/",
        pagina: "https://servicodados.ibge.gov.br/api/docs/pesquisas",
        format: "API",
        description: "Indicadores consolidados dos pain\xE9is do IBGE Cidades@.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "IBGE Cidades",
        tags: ["ibge cidades", "ideb", "mortalidade", "sal\xE1rio", "frota"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE, "Os c\xF3digos de indicador da lista (29166, 29167\u2026) precisam ser conferidos no cat\xE1logo de indicadores; o formato da resposta tamb\xE9m, antes de virar fonte."]
      },
      {
        id: "fed_ibge_nomes",
        name: "IBGE: Nomes no Brasil (frequ\xEAncia e ranking por UF e munic\xEDpio)",
        shortTitle: "Nomes (IBGE)",
        category: "Refer\xEAncias",
        sphere: "federal",
        source: "IBGE: API de Nomes (Censo)",
        url: "https://servicodados.ibge.gov.br/api/v2/nomes/ranking?localidade=32",
        pagina: "https://servicodados.ibge.gov.br/api/docs/nomes?versao=2",
        format: "API",
        description: "Ranking de nomes mais comuns no ES e frequ\xEAncia de um nome por d\xE9cada. Bom para pautas leves.",
        columnsPreview: [],
        yearsPreview: "Censo",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Nomes IBGE",
        tags: ["nomes", "censo", "curiosidades"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE]
      },
      {
        id: "fed_ibge_calendario",
        name: "IBGE: Calend\xE1rio de divulga\xE7\xF5es (IPCA, PIB, PNAD\u2026)",
        shortTitle: "Calend\xE1rio de divulga\xE7\xF5es (IBGE)",
        category: "Refer\xEAncias",
        sphere: "federal",
        source: "IBGE: API de Calend\xE1rio",
        url: "https://servicodados.ibge.gov.br/api/v3/calendario/",
        pagina: "https://servicodados.ibge.gov.br/api/docs/calendario?versao=3",
        format: "API",
        description: "Datas das pr\xF3ximas divulga\xE7\xF5es do IBGE: \xFAtil para a pauta e para ajustar a agenda das fontes autom\xE1ticas.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Calend\xE1rio IBGE",
        tags: ["calend\xE1rio", "pauta", "divulga\xE7\xF5es"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE]
      },
      {
        id: "fed_ibge_projecao_populacao",
        name: "IBGE: Proje\xE7\xE3o da popula\xE7\xE3o do ES em tempo real",
        shortTitle: "Proje\xE7\xE3o da popula\xE7\xE3o (IBGE)",
        category: "Popula\xE7\xE3o",
        sphere: "federal",
        source: "IBGE: API de Proje\xE7\xF5es",
        url: "https://servicodados.ibge.gov.br/api/v1/projecoes/populacao/32",
        pagina: "https://servicodados.ibge.gov.br/api/docs/projecoes",
        format: "API",
        description: 'Proje\xE7\xE3o instant\xE2nea da popula\xE7\xE3o (o "rel\xF3gio da popula\xE7\xE3o").',
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Proje\xE7\xE3o da popula\xE7\xE3o",
        tags: ["popula\xE7\xE3o", "proje\xE7\xE3o"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_IBGE, "\xC9 um valor instant\xE2neo (um n\xFAmero), n\xE3o uma s\xE9rie por munic\xEDpio. Para o anu\xE1rio, use as estimativas anuais."]
      },
      // ── Links conferidos pela redação (out/2026) ──
      {
        id: "es_receitas_municipios",
        name: "Receitas dos Munic\xEDpios do ES",
        shortTitle: "Receitas dos munic\xEDpios",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "dados.es.gov.br (conjunto receitas-municipios)",
        url: portalES("receitas-municipios"),
        pagina: portalES("receitas-municipios"),
        ckan: ckanES("receitas-municipios"),
        format: "CSV",
        description: "Receitas das 78 prefeituras capixabas.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Receitas dos munic\xEDpios",
        tags: ["receitas", "munic\xEDpios", "prefeituras"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "es_despesas_municipios",
        name: "Despesas dos Munic\xEDpios do ES",
        shortTitle: "Despesas dos munic\xEDpios",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "dados.es.gov.br (conjunto despesas-municipios)",
        url: portalES("despesas-municipios"),
        pagina: portalES("despesas-municipios"),
        ckan: ckanES("despesas-municipios"),
        format: "CSV",
        description: "Despesas das 78 prefeituras capixabas.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Despesas dos munic\xEDpios",
        tags: ["despesas", "munic\xEDpios", "prefeituras"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "es_convenios_ckan",
        name: "Conv\xEAnios do Estado do ES (Portal da Transpar\xEAncia)",
        shortTitle: "Conv\xEAnios do Estado",
        category: "Receitas e Repasses",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-convenios-do-estado"),
        pagina: portalES("portal-da-transparencia-convenios-do-estado"),
        ckan: ckanES("portal-da-transparencia-convenios-do-estado"),
        format: "CSV",
        description: "Conv\xEAnios firmados pelo Estado e a execu\xE7\xE3o dos repasses.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Conv\xEAnios do Estado",
        tags: ["conv\xEAnios", "repasses"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO]
      },
      {
        id: "es_emendas_parlamentares",
        name: "Emendas Parlamentares do Estado do ES (Portal da Transpar\xEAncia)",
        shortTitle: "Emendas parlamentares estaduais",
        category: "Receitas e Repasses",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-emendas-parlamentares-do-estado"),
        pagina: portalES("portal-da-transparencia-emendas-parlamentares-do-estado"),
        ckan: ckanES("portal-da-transparencia-emendas-parlamentares-do-estado"),
        format: "CSV",
        description: "Emendas dos deputados estaduais: autor, destino, valores e execu\xE7\xE3o.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal",
        suggestedName: "Emendas parlamentares estaduais",
        tags: ["emendas", "deputados", "assembleia"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Tema sens\xEDvel em ano eleitoral: o uso na publica\xE7\xE3o passa pelo editor-chefe."]
      },
      {
        id: "es_obras_publicas",
        name: "Obras P\xFAblicas do Estado do ES",
        shortTitle: "Obras p\xFAblicas",
        category: "Gest\xE3o e Metas",
        sphere: "es_estadual",
        source: "dados.es.gov.br (conjunto obras-publicas)",
        url: portalES("obras-publicas"),
        pagina: portalES("obras-publicas"),
        ckan: ckanES("obras-publicas"),
        format: "CSV",
        description: "Obras p\xFAblicas: local, situa\xE7\xE3o, valores e prazos.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal",
        suggestedName: "Obras p\xFAblicas",
        tags: ["obras", "infraestrutura", "munic\xEDpios"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO]
      },
      {
        id: "tce_saneamento_basico",
        name: "TCE-ES: Saneamento B\xE1sico nos Munic\xEDpios do ES",
        shortTitle: "Saneamento b\xE1sico (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: portalES("tcees-saneamento-basico"),
        pagina: portalES("tcees-saneamento-basico"),
        ckan: ckanES("tcees-saneamento-basico"),
        format: "CSV",
        description: "Indicadores de saneamento b\xE1sico dos munic\xEDpios, levantados pelo TCE-ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Saneamento b\xE1sico (TCE-ES)",
        tags: ["saneamento", "\xE1gua", "esgoto", "munic\xEDpios", "tce"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "tce_municipios_saude",
        name: "TCE-ES: Sa\xFAde dos Munic\xEDpios do ES",
        shortTitle: "Sa\xFAde dos munic\xEDpios (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/f472ae45-a039-4d10-b029-fe6a2367b2a6/download/municipios-saude.csv",
        pagina: `${portalES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento")}/resource/f472ae45-a039-4d10-b029-fe6a2367b2a6`,
        ckan: { ...ckanES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento"), recurso: "saude" },
        format: "CSV",
        description: "Despesas com sa\xFAde dos munic\xEDpios (aplica\xE7\xE3o m\xEDnima constitucional de 15%).",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Sa\xFAde dos munic\xEDpios (TCE-ES)",
        tags: ["sa\xFAde", "asps", "limite constitucional", "munic\xEDpios", "tce"],
        importavelNoApp: !0,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO_AREA, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "tce_municipios_educacao",
        name: "TCE-ES: Educa\xE7\xE3o dos Munic\xEDpios do ES",
        shortTitle: "Educa\xE7\xE3o dos munic\xEDpios (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/015c1dad-5842-44e8-a307-68eafe6de28e/download/municipios-educacao.csv",
        pagina: `${portalES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento")}/resource/015c1dad-5842-44e8-a307-68eafe6de28e`,
        ckan: { ...ckanES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento"), recurso: "educacao" },
        format: "CSV",
        description: "Despesas com educa\xE7\xE3o dos munic\xEDpios (aplica\xE7\xE3o m\xEDnima de 25% e Fundeb).",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Educa\xE7\xE3o dos munic\xEDpios (TCE-ES)",
        tags: ["educa\xE7\xE3o", "mde", "fundeb", "limite constitucional", "munic\xEDpios", "tce"],
        importavelNoApp: !0,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO_AREA, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "tce_municipios_pessoal",
        name: "TCE-ES: Pessoal dos Munic\xEDpios do ES",
        shortTitle: "Pessoal dos munic\xEDpios (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/45c257a8-5b35-4486-af5c-5bfbc453304a/download/municipios-pessoal.csv",
        pagina: `${portalES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento")}/resource/45c257a8-5b35-4486-af5c-5bfbc453304a`,
        ckan: { ...ckanES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento"), recurso: "pessoal" },
        format: "CSV",
        description: "Despesas com pessoal dos munic\xEDpios em rela\xE7\xE3o ao limite da Lei de Responsabilidade Fiscal.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Pessoal dos munic\xEDpios (TCE-ES)",
        tags: ["pessoal", "folha", "lrf", "munic\xEDpios", "tce"],
        importavelNoApp: !0,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO_AREA, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "tce_municipios_rcl",
        name: "TCE-ES: Receita Corrente L\xEDquida dos Munic\xEDpios do ES",
        shortTitle: "Receita Corrente L\xEDquida dos munic\xEDpios (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/4bbc4025-d96f-437d-837f-acc1089e5fa5/download/rcl.csv",
        pagina: `${portalES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento")}/resource/4bbc4025-d96f-437d-837f-acc1089e5fa5`,
        ckan: { ...ckanES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento"), recurso: "receita corrente" },
        format: "CSV",
        description: "Receita corrente l\xEDquida (RCL) dos munic\xEDpios, base dos limites da LRF.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Receita Corrente L\xEDquida dos munic\xEDpios (TCE-ES)",
        tags: ["rcl", "receita corrente l\xEDquida", "lrf", "munic\xEDpios", "tce"],
        importavelNoApp: !0,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO_AREA, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "tce_municipios_endividamento",
        name: "TCE-ES: Endividamento dos Munic\xEDpios do ES",
        shortTitle: "Endividamento dos munic\xEDpios (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do ES (TCE-ES), no dados.es.gov.br",
        url: "https://dados.es.gov.br/dataset/c2d74fcf-5163-463c-9f5a-48e0e082c1b3/resource/359ca7d9-dea6-4741-a137-210b2cb63961/download/endividamento.csv",
        pagina: `${portalES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento")}/resource/359ca7d9-dea6-4741-a137-210b2cb63961`,
        ckan: { ...ckanES("tcees-despesas-com-saude-educacao-e-pessoal-receita-corrente-liquida-e-endividamento"), recurso: "endividamento" },
        format: "CSV",
        description: "D\xEDvida consolidada e endividamento dos munic\xEDpios.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "Anual",
        suggestedName: "Endividamento dos munic\xEDpios (TCE-ES)",
        tags: ["d\xEDvida", "endividamento", "lrf", "munic\xEDpios", "tce"],
        importavelNoApp: !0,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO_AREA, "Marque a coluna do munic\xEDpio para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "es_despesas_execucao_ckan",
        name: "Despesas do Estado do ES: Execu\xE7\xE3o Or\xE7ament\xE1ria e Financeira (Portal da Transpar\xEAncia)",
        shortTitle: "Despesas do Estado (execu\xE7\xE3o)",
        category: "Despesas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-despesas-execucao-orcamentaria-e-financeira"),
        pagina: portalES("portal-da-transparencia-despesas-execucao-orcamentaria-e-financeira"),
        ckan: { portal: "https://dados.es.gov.br", conjunto: "portal-da-transparencia-despesas-execucao-orcamentaria-e-financeira", formato: "csv", combinar: !0 },
        format: "CSV",
        description: "Empenhos, liquida\xE7\xF5es e pagamentos do Estado. Provavelmente um arquivo por ano, como nas receitas.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "24h",
        recommendedScheduleDesc: "Di\xE1ria (o ano corrente muda todo dia)",
        suggestedName: "Despesas do Estado (execu\xE7\xE3o)",
        tags: ["despesas", "empenho", "liquida\xE7\xE3o", "pagamento"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Se os arquivos forem t\xE3o grandes quanto os de receitas (centenas de MB por ano), use como fonte autom\xE1tica, somando por categorias."]
      },
      {
        id: "es_transferencias_municipios_ckan",
        name: "Transfer\xEAncias do Estado para os Munic\xEDpios do ES (Portal da Transpar\xEAncia)",
        shortTitle: "Transfer\xEAncias aos munic\xEDpios",
        category: "Receitas e Repasses",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-transferencias-para-municipios"),
        pagina: portalES("portal-da-transparencia-transferencias-para-municipios"),
        ckan: { portal: "https://dados.es.gov.br", conjunto: "portal-da-transparencia-transferencias-para-municipios", formato: "csv", combinar: !0 },
        format: "CSV",
        description: "Repasses do Estado aos 78 munic\xEDpios (constitucionais, conv\xEAnios e outros). \xDAtil para o anu\xE1rio por munic\xEDpio.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Transfer\xEAncias aos munic\xEDpios",
        tags: ["transfer\xEAncias", "repasses", "munic\xEDpios", "icms", "ipva"],
        importavelNoApp: !1,
        verificacao: "link_conferido",
        avisos: [LINK_CONFERIDO, "Marque a coluna do munic\xEDpio na tela de colunas para padronizar os nomes e acrescentar o c\xF3digo do IBGE."]
      },
      {
        id: "es_compras_ckan",
        name: "Compras e Contratos do Estado do ES (Portal da Transpar\xEAncia)",
        shortTitle: "Compras e contratos do Estado",
        category: "Gest\xE3o e Metas",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-compras"),
        pagina: portalES("portal-da-transparencia-compras"),
        ckan: { portal: "https://dados.es.gov.br", conjunto: "portal-da-transparencia-compras", formato: "csv", combinar: !0 },
        format: "CSV",
        description: "Licita\xE7\xF5es, contratos e fornecedores do Executivo estadual.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "weekly",
        recommendedScheduleDesc: "Semanal",
        suggestedName: "Compras e contratos do Estado",
        tags: ["compras", "licita\xE7\xF5es", "contratos", "fornecedores"],
        importavelNoApp: !1,
        avisos: [ORIGEM_LISTA, "Fornecedores pessoa f\xEDsica podem aparecer com nome e CPF: confira antes de publicar (LGPD)."]
      },
      {
        id: "es_servidores_ckan",
        name: "Servidores do Estado do ES e Remunera\xE7\xE3o (Portal da Transpar\xEAncia)",
        shortTitle: "Servidores e remunera\xE7\xE3o",
        category: "Gest\xE3o e Pessoal",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do Governo do ES (dados.es.gov.br)",
        url: portalES("portal-da-transparencia-servidores"),
        pagina: portalES("portal-da-transparencia-servidores"),
        ckan: { portal: "https://dados.es.gov.br", conjunto: "portal-da-transparencia-servidores", formato: "csv", combinar: !1 },
        format: "CSV",
        description: "Quadro de servidores e remunera\xE7\xF5es do Executivo.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "Mensal",
        suggestedName: "Servidores e remunera\xE7\xE3o",
        tags: ["servidores", "folha", "remunera\xE7\xE3o", "pessoal"],
        importavelNoApp: !1,
        dadosPessoais: !0,
        avisos: [ORIGEM_LISTA, "Cont\xE9m nomes e sal\xE1rios (LGPD). Consulte o DPO antes de usar; para o anu\xE1rio, prefira totais agregados (por \xF3rg\xE3o, cargo, faixa), sem identificar pessoas."]
      },
      {
        id: "es_transparencia_webservices",
        name: "WebServices do Portal da Transpar\xEAncia do ES (despesas por elemento, favorecidos)",
        shortTitle: "WebServices da Transpar\xEAncia ES",
        category: "Despesas do Estado",
        sphere: "es_estadual",
        source: "Portal da Transpar\xEAncia do ES (SECONT)",
        url: "https://transparencia.es.gov.br",
        pagina: "https://transparencia.es.gov.br",
        format: "API",
        description: "APIs em JSON: elementos e subelementos de despesa (empenhado, liquidado, pago) e favorecidos, por ano e unidade gestora.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "WebServices Transpar\xEAncia ES",
        tags: ["despesas", "favorecidos", "api"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_LISTA, "APIs paginadas (numeroPagina) e por unidade gestora: a automa\xE7\xE3o ainda n\xE3o percorre p\xE1ginas. Para os mesmos dados, prefira os conjuntos do dados.es.gov.br.", "A lista de favorecidos pode conter pessoas f\xEDsicas (LGPD)."]
      },
      {
        id: "tce_dados_abertos",
        name: "TCE-ES: Dados Abertos (contas do Estado e das 78 prefeituras e c\xE2maras)",
        shortTitle: "TCE-ES dados abertos",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do Estado do ES (TCE-ES)",
        url: "https://www.tcees.tc.br/portal-da-transparencia/dados-abertos/",
        pagina: "https://www.tcees.tc.br/portal-da-transparencia/dados-abertos/",
        format: "CSV",
        description: "Fonte para dados fiscais dos munic\xEDpios: receitas, despesas, pessoal, obras e licita\xE7\xF5es. Arquivos em ZIP (informado pela reda\xE7\xE3o).",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "TCE-ES dados abertos",
        tags: ["tce", "munic\xEDpios", "prefeituras", "c\xE2maras", "zip"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_LISTA, "A p\xE1gina re\xFAne v\xE1rios arquivos. Para virar fonte autom\xE1tica, escolha o arquivo e mande o endere\xE7o e as primeiras linhas: a automa\xE7\xE3o j\xE1 l\xEA ZIP."]
      },
      {
        id: "tce_cidades_api",
        name: "TCE-ES: API do CidadES (contrata\xE7\xF5es, admiss\xF5es, unidades gestoras)",
        shortTitle: "API do CidadES (TCE-ES)",
        category: "Munic\xEDpios",
        sphere: "es_municipal",
        source: "Tribunal de Contas do Estado do ES (TCE-ES)",
        url: "https://www.tcees.tc.br/ajuda/api-do-cidades/",
        pagina: "https://www.tcees.tc.br/ajuda/api-do-cidades/",
        format: "API",
        description: "Documenta\xE7\xE3o da API do sistema CidadES do TCE-ES.",
        columnsPreview: [],
        yearsPreview: "a conferir",
        recommendedSchedule: "monthly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "CidadES",
        tags: ["tce", "cidades", "munic\xEDpios", "api"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_LISTA, "Confira na documenta\xE7\xE3o se a API \xE9 paginada ou exige cadastro: isso decide se a automa\xE7\xE3o consegue us\xE1-la.", "Admiss\xF5es podem conter dados pessoais (LGPD)."]
      },
      {
        id: "es_geobases",
        name: "Geobases / IDE-ES: mapas (limites municipais, hidrografia, rodovias)",
        shortTitle: "Geobases (mapas do ES)",
        category: "Geografia",
        sphere: "es_estadual",
        source: "IJSN / PRODEST (Geobases)",
        url: "https://geobases.es.gov.br",
        pagina: "https://geobases.es.gov.br",
        format: "API",
        description: "Camadas geogr\xE1ficas (GeoJSON, Shapefile, KML, WMS/WFS) de limites municipais, hidrografia, rodovias e meio ambiente.",
        columnsPreview: [],
        yearsPreview: "\u2014",
        recommendedSchedule: "yearly",
        recommendedScheduleDesc: "\u2014",
        suggestedName: "Geobases",
        tags: ["mapas", "geojson", "limites municipais", "wfs"],
        apenasReferencia: !0,
        importavelNoApp: !1,
        avisos: [ORIGEM_LISTA, "S\xE3o dados de mapa, n\xE3o tabelas: \xFAteis para mapas por munic\xEDpio numa etapa futura; os pain\xE9is atuais n\xE3o usam essas camadas."]
      }
    ], PUBLIC_API_CATALOG = [
      ...CATALOGO_ORIGINAL.map(revisar).filter((x) => x !== null),
      ...CATALOGO_ACRESCIMOS.map((x) => x.verificacao === "link_conferido" ? x : { ...x, verificacao: "nao_verificado", avisos: [...x.avisos || [], NAO_VERIFICADO] })
    ];
  }
});

// automation/run.ts
import { existsSync as existsSync4, mkdirSync as mkdirSync3, readFileSync as readFileSync4, writeFileSync as writeFileSync3, appendFileSync, renameSync } from "fs";
import { join as join4, dirname as dirname3 } from "path";
import { fileURLToPath } from "url";

// automation/config.ts
var import_yaml = __toESM(require_dist(), 1);
import { existsSync, readdirSync, readFileSync } from "fs";
import { basename, join } from "path";
var ID_RE = /^[a-z0-9][a-z0-9-]{1,62}$/;
function validateConfig(raw) {
  let errs = [], fontes = Array.isArray(raw.fontes) ? raw.fontes : [];
  fontes.length || errs.push('fontes.yml: a lista "fontes" est\xE1 vazia.');
  let ids = /* @__PURE__ */ new Set();
  if (fontes.forEach((f, i) => {
    let where = `fontes[${i}]${f && f.id ? ` (${f.id})` : ""}`;
    if (!f || typeof f != "object") {
      errs.push(`${where}: item inv\xE1lido.`);
      return;
    }
    ID_RE.test(f.id || "") || errs.push(`${where}: "id" deve ter s\xF3 letras min\xFAsculas, n\xFAmeros e h\xEDfens.`), ids.has(f.id) && errs.push(`${where}: "id" repetido.`), ids.add(f.id), f.nome || errs.push(`${where}: falta "nome".`), [f.url ? 1 : 0, f.ckan ? 1 : 0, f.arquivo ? 1 : 0].reduce((a, b) => a + b, 0) > 1 && errs.push(`${where}: use s\xF3 uma origem: "url", "ckan" ou "arquivo".`), f.sinal_de_novidade !== void 0 && !/^https?:\/\//.test(String(f.sinal_de_novidade)) && errs.push(`${where}: sinal_de_novidade precisa ser um endere\xE7o http(s).`), f.anos && (Number(f.anos.de) >= 1990 && Number(f.anos.de) <= 2100 || errs.push(`${where}: anos.de deve ser um ano (ex.: 2015).`), (!f.url || !/\{\{(ANO|YYYY)\}\}/i.test(f.url)) && errs.push(`${where}: com "anos", a url precisa ter o marcador {{ANO}} no lugar do ano.`)), f.arquivo ? (!/^entrada\/[\w\-./ ]+\.(xlsx|csv|tsv|json|zip)$/i.test(f.arquivo) || f.arquivo.includes("..")) && errs.push(`${where}: "arquivo" deve estar na pasta entrada/ e terminar em .xlsx, .csv, .json ou .zip (ex.: entrada/anuario/pib.xlsx).`) : f.ckan ? (/^https:\/\//.test(f.ckan.portal || "") || errs.push(`${where}: ckan.portal precisa ser um endere\xE7o https:// (ex.: https://dados.es.gov.br).`), (!f.ckan.conjunto || /\//.test(f.ckan.conjunto)) && errs.push(`${where}: ckan.conjunto \xE9 o final do endere\xE7o do conjunto (sem barras), ex.: portal-da-transparencia-receitas.`)) : /^https?:\/\//.test(f.url || "") ? /\/dataset\/[^/]+\/?$/.test(f.url || "") && errs.push(`${where}: a "url" \xE9 a p\xE1gina de um conjunto CKAN, n\xE3o um arquivo. Use o bloco "ckan" (ver exemplo em fontes.yml).`) : errs.push(`${where}: informe a origem: "url" (http:// ou https://), um bloco "ckan" ou "arquivo" (planilha em entrada/).`), /(^|[^{])\{[A-Za-z_]+\}(?!\})/.test(f.url || "") && errs.push(`${where}: na "url", use chaves duplas nos marcadores, ex.: {{ANO}} (n\xE3o {ANO}).`);
    let fr = f.agenda && f.agenda.frequencia;
    ["horaria", "diaria", "semanal", "mensal", "anual"].includes(fr) || errs.push(`${where}: agenda.frequencia deve ser horaria, diaria, semanal, mensal ou anual.`), f.agenda?.hora && !/^\d{2}:\d{2}$/.test(f.agenda.hora) && errs.push(`${where}: agenda.hora no formato "06:00".`), fr === "mensal" && !(Number(f.agenda.dia_do_mes) >= 1 && Number(f.agenda.dia_do_mes) <= 31) && errs.push(`${where}: agenda.dia_do_mes (1\u201331) \xE9 obrigat\xF3rio na frequ\xEAncia mensal.`), fr === "semanal" && !(Number(f.agenda.dia_da_semana) >= 0 && Number(f.agenda.dia_da_semana) <= 6) && errs.push(`${where}: agenda.dia_da_semana (0\u20136) \xE9 obrigat\xF3rio na frequ\xEAncia semanal.`);
  }), errs.length) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- ` + errs.join(`
- `));
  return { fontes: fontes.map((f) => ({ ativo: !0, formato: "auto", ...f })), publicacao: raw.publicacao || {} };
}
var PROJETO_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
function loadConfigDir(dir, doApp = []) {
  let partes = [], raiz = join(dir, "fontes.yml");
  existsSync(raiz) && partes.push({ arquivo: "fontes.yml", raw: (0, import_yaml.parse)(readFileSync(raiz, "utf-8")) || {} });
  let pasta = join(dir, "fontes");
  if (existsSync(pasta))
    for (let nome of readdirSync(pasta).filter((n) => /\.ya?ml$/i.test(n)).sort()) {
      let projeto = basename(nome).replace(/\.ya?ml$/i, "");
      if (!PROJETO_RE.test(projeto)) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- fontes/${nome}: o nome do arquivo vira o nome do projeto; use s\xF3 letras min\xFAsculas, n\xFAmeros e h\xEDfens (ex.: anuario.yml).`);
      partes.push({ arquivo: `fontes/${nome}`, raw: (0, import_yaml.parse)(readFileSync(join(pasta, nome), "utf-8")) || {}, projeto });
    }
  if (!partes.length && !doApp.length) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- n\xE3o encontrei fontes.yml nem a pasta fontes/ (e nenhuma fonte cadastrada no app).`);
  let fontes = [], erros = [], publicacao = {};
  for (let p of partes) {
    try {
      let lista = Array.isArray(p.raw.fontes) ? p.raw.fontes : [];
      if (!lista.length) continue;
      let cfg = validateConfig({ fontes: lista });
      for (let f of cfg.fontes)
        p.projeto && (f.projeto = p.projeto), f.projeto && !PROJETO_RE.test(f.projeto) && erros.push(`${p.arquivo} (${f.id}): "projeto" s\xF3 com letras min\xFAsculas, n\xFAmeros e h\xEDfens.`), f.arquivo && f.projeto && !f.arquivo.startsWith(`entrada/${f.projeto}/`) && erros.push(`${p.arquivo} (${f.id}): a planilha deve ficar em entrada/${f.projeto}/ (est\xE1 em ${f.arquivo}).`), fontes.push(f);
    } catch (e) {
      erros.push(...String(e.message).replace(`Configura\xE7\xE3o inv\xE1lida:
- `, "").split(`
- `).map((m) => `${p.arquivo}: ${m}`));
    }
    p.raw.publicacao && (publicacao = { ...publicacao, ...p.raw.publicacao });
  }
  for (let f of doApp) fontes.push(f);
  let vistos = /* @__PURE__ */ new Map();
  for (let f of fontes) {
    let ja = vistos.get(f.id), onde = f.origem === "app" ? "tela Fontes autom\xE1ticas do app" : f.projeto || "fontes.yml";
    ja && erros.push(`o id "${f.id}" aparece em mais de uma fonte (${ja} e ${onde}); ids precisam ser \xFAnicos.`), vistos.set(f.id, onde);
  }
  if (erros.length) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- ` + erros.join(`
- `));
  if (!fontes.length) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- nenhuma fonte configurada.`);
  return { fontes, publicacao };
}
function validarFontesDoApp(docs) {
  let fontes = [], erros = [];
  for (let d of docs) {
    let cfg = { ...d.config || {}, id: d.id, ativo: d.ativo !== !1 };
    if (cfg.arquivo) {
      erros.push({ id: d.id, nome: cfg.nome || d.id, mensagem: "planilhas da pasta entrada/ s\xE3o configuradas nos arquivos do GitHub, n\xE3o no app" });
      continue;
    }
    try {
      let f = validateConfig({ fontes: [cfg] }).fontes[0];
      if (f.projeto && !PROJETO_RE.test(f.projeto)) throw new Error(`Configura\xE7\xE3o inv\xE1lida:
- "projeto" s\xF3 com letras min\xFAsculas, n\xFAmeros e h\xEDfens.`);
      fontes.push({ ...f, origem: "app" });
    } catch (e) {
      erros.push({ id: d.id, nome: cfg.nome || d.id, mensagem: String(e.message).replace(`Configura\xE7\xE3o inv\xE1lida:
- `, "").replace(/\n- /g, "; ").replace(/fontes\[0\] \([^)]*\): /g, "") });
    }
  }
  return { fontes, erros };
}
function pastaFonte(f) {
  return f.projeto ? `${f.projeto}/${f.id}` : f.id;
}

// automation/schedule.ts
var BRT_OFFSET_MIN = -180;
function brt(d) {
  let t = new Date(d.getTime() + BRT_OFFSET_MIN * 6e4);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate(), wd: t.getUTCDay(), h: t.getUTCHours(), min: t.getUTCMinutes() };
}
function fromBrt(y, m, d, h, min) {
  return new Date(Date.UTC(y, m, d, h, min) - BRT_OFFSET_MIN * 6e4);
}
function ultimoHorarioAgendado(f, now) {
  let [hh, mm] = (f.agenda.hora || "06:00").split(":").map(Number), n = brt(now), a = f.agenda;
  if (a.frequencia === "horaria") return fromBrt(n.y, n.m, n.d, n.h, mm);
  if (a.frequencia === "diaria") {
    let hoje = fromBrt(n.y, n.m, n.d, hh, mm);
    return hoje <= now ? hoje : fromBrt(n.y, n.m, n.d - 1, hh, mm);
  }
  if (a.frequencia === "semanal") {
    let alvo = Number(a.dia_da_semana), delta = (n.wd - alvo + 7) % 7, c2 = fromBrt(n.y, n.m, n.d - delta, hh, mm);
    return c2 > now && (c2 = fromBrt(n.y, n.m, n.d - delta - 7, hh, mm)), c2;
  }
  if (a.frequencia === "mensal") {
    let diaValido = (y, m) => Math.min(Number(a.dia_do_mes), new Date(Date.UTC(y, m + 1, 0)).getUTCDate()), c2 = fromBrt(n.y, n.m, diaValido(n.y, n.m), hh, mm);
    if (c2 > now) {
      let pm = n.m === 0 ? 11 : n.m - 1, py = n.m === 0 ? n.y - 1 : n.y;
      c2 = fromBrt(py, pm, diaValido(py, pm), hh, mm);
    }
    return c2;
  }
  let mes = (Number(a.mes) || 1) - 1, dia = Number(a.dia_do_mes) || 1, c = fromBrt(n.y, mes, dia, hh, mm);
  return c > now && (c = fromBrt(n.y - 1, mes, dia, hh, mm)), c;
}
function fonteDevida(f, estado, now, forcar = !1) {
  if (forcar) return "forcada";
  if (estado?.emAndamento) return "continuacao";
  let ciclo = ultimoHorarioAgendado(f, now), ultima = estado?.ultimaVerificacao ? new Date(estado.ultimaVerificacao) : null;
  if (!ultima || ultima < ciclo) return "agendada";
  if (estado?.ultimoErro && estado.ultimoErroEm && now.getTime() - new Date(estado.ultimoErroEm).getTime() >= 6 * 36e5) return "apos_erro";
  let dias = f.agenda.tentar_ate_novidade_dias || 0;
  if (dias > 0 && estado?.aguardandoNovidadeDesde && f.agenda.frequencia !== "horaria" && f.agenda.frequencia !== "diaria") {
    let desde = new Date(estado.aguardandoNovidadeDesde), limite = new Date(desde.getTime() + dias * 864e5);
    if (now > limite) return null;
    let [hh, mm] = (f.agenda.hora || "06:00").split(":").map(Number), n = brt(now), hojeNoHorario = fromBrt(n.y, n.m, n.d, hh, mm);
    if (hojeNoHorario > now && (hojeNoHorario = fromBrt(n.y, n.m, n.d - 1, hh, mm)), ultima < hojeNoHorario && hojeNoHorario > desde) return "nova_tentativa";
  }
  return null;
}
function fonteParada(f, estado, now) {
  let max = f.max_dias_sem_novidade;
  if (!max || !estado?.ultimaNovidade) return null;
  let dias = Math.floor((now.getTime() - new Date(estado.ultimaNovidade).getTime()) / 864e5);
  return dias > max ? `A fonte "${f.nome}" est\xE1 h\xE1 ${dias} dias sem dado novo (limite configurado: ${max}). Verifique se o endere\xE7o mudou.` : null;
}

// automation/pipeline.ts
var import_papaparse2 = __toESM(require_papaparse(), 1);
import { createHash } from "crypto";
import { gzipSync } from "zlib";
import { Readable } from "stream";
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync2, writeFileSync } from "fs";
import { basename as basename2, dirname, join as join2 } from "path";

// automation/xlsx.ts
var import_jszip = __toESM(require_lib3(), 1), ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
function decodificar(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENT[e.toLowerCase()] ?? m);
}
function textos(xml) {
  let out = "";
  for (let m of xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)) out += decodificar(m[1]);
  return out;
}
function colunaParaIndice(ref) {
  let letras = (ref.match(/^[A-Z]+/i) || ["A"])[0].toUpperCase(), n = 0;
  for (let c of letras) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}
var DATAS_PADRAO = /* @__PURE__ */ new Set([14, 15, 16, 17, 18, 19, 20, 21, 22, 27, 30, 36, 45, 46, 47, 50, 57]);
function formatoEhData(codigo) {
  let limpo = codigo.replace(/"[^"]*"/g, "").replace(/\[[^\]]*\]/g, "").replace(/\\./g, "");
  return /[dy]/i.test(limpo);
}
function serialParaData(n) {
  let ms = Math.round((n - 25569) * 86400 * 1e3), d = new Date(ms), dd = String(d.getUTCDate()).padStart(2, "0"), mm = String(d.getUTCMonth() + 1).padStart(2, "0"), hh = d.getUTCHours(), mi = d.getUTCMinutes(), base = `${dd}/${mm}/${d.getUTCFullYear()}`;
  return hh || mi ? `${base} ${String(hh).padStart(2, "0")}:${String(mi).padStart(2, "0")}` : base;
}
async function lerXlsx(buf, opts = {}) {
  let zip = await import_jszip.default.loadAsync(buf), wb = await zip.file("xl/workbook.xml")?.async("string");
  if (!wb) throw new Error("arquivo n\xE3o \xE9 uma planilha .xlsx v\xE1lida (falta xl/workbook.xml)");
  let abas = [...wb.matchAll(/<sheet\b([^>]*)\/?>/g)].map((m) => ({
    nome: decodificar((m[1].match(/\bname="([^"]*)"/) || [])[1] || ""),
    rid: (m[1].match(/\br:id="([^"]*)"/) || m[1].match(/\bid="([^"]*)"/) || [])[1]
  }));
  if (!abas.length) throw new Error("a planilha n\xE3o tem abas");
  let aba = opts.planilha ? abas.find((a) => a.nome.trim().toLowerCase() === opts.planilha.trim().toLowerCase()) : abas[0];
  if (!aba) throw new Error(`aba "${opts.planilha}" n\xE3o encontrada (abas: ${abas.map((a) => a.nome).join(", ")})`);
  let caminho = ([...(await zip.file("xl/_rels/workbook.xml.rels")?.async("string") || "").matchAll(/<Relationship\b([^>]*)\/?>/g)].map((m) => m[1]).find((r) => (r.match(/\bId="([^"]*)"/) || [])[1] === aba.rid)?.match(/\bTarget="([^"]*)"/) || [])[1] || `worksheets/sheet${abas.indexOf(aba) + 1}.xml`;
  caminho = caminho.startsWith("/") ? caminho.slice(1) : "xl/" + caminho.replace(/^\.\//, "");
  let folha = await zip.file(caminho)?.async("string");
  if (!folha) throw new Error(`n\xE3o foi poss\xEDvel abrir a aba "${aba.nome}"`);
  let compartilhados = [...(await zip.file("xl/sharedStrings.xml")?.async("string") || "").matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((m) => textos(m[1])), estilos = await zip.file("xl/styles.xml")?.async("string") || "", formatos = /* @__PURE__ */ new Map();
  for (let m of estilos.matchAll(/<numFmt\b[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"/g)) formatos.set(Number(m[1]), decodificar(m[2]));
  let estiloEhData = [...((estilos.match(/<cellXfs\b[^>]*>([\s\S]*?)<\/cellXfs>/) || [])[1] || "").matchAll(/<xf\b([^>]*)\/?>/g)].map((m) => {
    let id = Number((m[1].match(/numFmtId="(\d+)"/) || [])[1] || 0);
    return DATAS_PADRAO.has(id) || formatos.has(id) && formatoEhData(formatos.get(id));
  }), linhas = [], dados = (folha.match(/<sheetData\b[^>]*>([\s\S]*?)<\/sheetData>/) || [])[1] || "", numeroAnterior = 0;
  for (let rm of dados.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    let numero = Number((rm[1].match(/\br="(\d+)"/) || [])[1] || numeroAnterior + 1);
    numeroAnterior = numero;
    let valores = [], colAnterior = -1;
    for (let cm of (rm[2] || "").matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      let attrs = cm[1], ref = (attrs.match(/\br="([A-Z]+\d+)"/i) || [])[1], col = ref ? colunaParaIndice(ref) : colAnterior + 1;
      colAnterior = col;
      let tipo = (attrs.match(/\bt="([^"]*)"/) || [])[1] || "n", estilo = Number((attrs.match(/\bs="(\d+)"/) || [])[1] || 0), corpo = cm[2] || "", v = (corpo.match(/<v>([\s\S]*?)<\/v>/) || [])[1], valor = null;
      if (tipo === "s") valor = v !== void 0 ? compartilhados[Number(v)] ?? "" : null;
      else if (tipo === "inlineStr") valor = textos(corpo);
      else if (tipo === "str") valor = v !== void 0 ? decodificar(v) : null;
      else if (tipo === "b") valor = v === "1";
      else if (tipo === "e") valor = null;
      else if (tipo === "d") valor = v ?? null;
      else if (v !== void 0 && v !== "") {
        let n = Number(v);
        valor = estiloEhData[estilo] && isFinite(n) ? serialParaData(n) : n;
      }
      valores[col] = valor;
    }
    linhas.push({ numero, valores });
  }
  let preenchidas = (vs) => vs.filter((x) => x != null && String(x).trim() !== "").length, cab = opts.linhaCabecalho ? linhas.find((l) => l.numero === opts.linhaCabecalho) : linhas.find((l) => preenchidas(l.valores) >= 2);
  if (!cab) throw new Error(opts.linhaCabecalho ? `linha ${opts.linhaCabecalho} n\xE3o encontrada na aba "${aba.nome}"` : `a aba "${aba.nome}" est\xE1 vazia`);
  let usados = /* @__PURE__ */ new Map(), nomes = Array.from({ length: cab.valores.length }, (_, i) => {
    let nome = String(cab.valores[i] ?? "").replace(/\s+/g, " ").trim() || `coluna_${i + 1}`, k = nome.toLowerCase(), n = (usados.get(k) || 0) + 1;
    return usados.set(k, n), n > 1 && (nome = `${nome}_${n}`), nome;
  }), registros = [];
  for (let l of linhas) {
    if (l.numero <= cab.numero || !preenchidas(l.valores)) continue;
    let r = {};
    nomes.forEach((nome, i) => {
      r[nome] = l.valores[i] ?? null;
    }), registros.push(r);
  }
  return registros;
}

// automation/tratador.ts
function numeroPonto(v) {
  if (typeof v == "number") return isFinite(v) ? v : null;
  let s = String(v ?? "").trim();
  if (s === "") return null;
  let n = Number(s);
  return isFinite(n) ? n : null;
}
function numeroBr(v) {
  if (typeof v == "number") return isFinite(v) ? v : null;
  if (v == null) return null;
  let s = String(v).trim().replace(/^R\$\s*/i, "").replace(/\s|%/g, "");
  if (s === "" || s === "-") return null;
  /^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^-?\d+,\d+$/.test(s) ? s = s.replace(/\./g, "").replace(",", ".") : /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s) && (s = s.replace(/,/g, ""));
  let n = Number(s);
  return isFinite(n) ? n : null;
}
var normalizarNome = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(), Tratador = class {
  constructor(t, municipios = [], agora = /* @__PURE__ */ new Date()) {
    this.t = t;
    this.linhas = [];
    this.grupos = /* @__PURE__ */ new Map();
    this.naoReconhecidos = /* @__PURE__ */ new Set();
    this.codigos = /* @__PURE__ */ new Map();
    this.descartadosMes = 0;
    this.nLinhas = 0;
    this.porNome = new Map(municipios.map((m) => [normalizarNome(m.nome), m])), this.porCodigo = new Map(municipios.map((m) => [String(m.codigo), m]));
    let brt2 = new Date(agora.getTime() - 3 * 36e5);
    this.anoAtual = brt2.getUTCFullYear(), this.mesAtual = brt2.getUTCMonth() + 1;
  }
  /** Houve linhas do mês em andamento descartadas? (o resultado vale só neste mês) */
  get descartouMesEmAndamento() {
    return this.descartadosMes > 0;
  }
  /** Trata uma linha; devolve null se ela deve ser descartada. */
  linha(r) {
    let t = this.t;
    if (!t) return r;
    if (t.filtrar) {
      for (let [col, val] of Object.entries(t.filtrar))
        if (!(Array.isArray(val) ? val : [val]).map((x) => String(x)).includes(String(r[col] ?? "").trim())) return null;
    }
    let ren = t.renomear || {}, o = {};
    for (let k in r) o[ren[k] || k] = r[k];
    for (let c of t.texto || []) typeof o[c] == "string" && (o[c] = o[c].replace(/\s+/g, " ").trim());
    let paraNumero = t.decimal === "ponto" ? numeroPonto : numeroBr;
    for (let c of t.numeros || []) c in o && (o[c] = paraNumero(o[c]));
    for (let c of t.inteiros || []) if (c in o) {
      let n = paraNumero(o[c]);
      o[c] = n === null ? null : Math.round(n);
    }
    if (t.municipio && t.municipio.coluna in o) {
      let m = this.porNome.get(normalizarNome(o[t.municipio.coluna]));
      m ? (o[t.municipio.coluna] = m.nome, t.municipio.codigo_ibge && (o[t.municipio.codigo_ibge] = m.codigo)) : o[t.municipio.coluna] && (this.porNome.size && this.naoReconhecidos.add(String(o[t.municipio.coluna])), t.municipio.codigo_ibge && (o[t.municipio.codigo_ibge] = null)), t.municipio.codigo_ibge && this.codigos.set(String(o[t.municipio.coluna]), o[t.municipio.codigo_ibge] ?? null);
    }
    if (t.municipio_por_codigo && t.municipio_por_codigo.coluna in o) {
      let cod = String(o[t.municipio_por_codigo.coluna] ?? "").trim(), m = this.porCodigo.get(cod);
      o[t.municipio_por_codigo.nome] = m ? m.nome : null, !m && cod && this.porCodigo.size && /^\d{7}$/.test(cod) && this.naoReconhecidos.add(`c\xF3digo ${cod}`);
    }
    for (let c of t.descartar_vazias || []) if (o[c] === null || o[c] === void 0 || String(o[c]).trim() === "") return null;
    if (t.descartar_mes_em_andamento) {
      let { ano, mes } = t.descartar_mes_em_andamento;
      if (Number(o[ano]) === this.anoAtual && Number(o[mes]) === this.mesAtual)
        return this.descartadosMes++, null;
    }
    return o;
  }
  adicionar(o) {
    if (!o) return;
    this.nLinhas++;
    let g = this.t?.agrupar;
    if (!g || !g.por?.length) {
      this.linhas.push(o);
      return;
    }
    let chave = JSON.stringify(g.por.map((c) => o[c] ?? null)), e = this.grupos.get(chave);
    e || (e = { base: Object.fromEntries(g.por.map((c) => [c, o[c] ?? null])), soma: {}, nMedia: {}, n: 0 }, this.grupos.set(chave, e)), e.n++;
    for (let c of [...g.somar || [], ...g.media || []]) {
      let v = typeof o[c] == "number" ? o[c] : numeroBr(o[c]);
      v !== null && (e.soma[c] = (e.soma[c] || 0) + v, e.nMedia[c] = (e.nMedia[c] || 0) + 1);
    }
  }
  parcial() {
    return {
      versao: 1,
      ...this.t?.agrupar?.por?.length ? { grupos: [...this.grupos.entries()] } : { linhas: this.linhas },
      naoReconhecidos: [...this.naoReconhecidos],
      codigos: [...this.codigos.entries()],
      descartadosMes: this.descartadosMes,
      nLinhas: this.nLinhas
    };
  }
  mesclar(p) {
    for (let [chave, g] of p.grupos || []) {
      let e = this.grupos.get(chave);
      if (!e) {
        this.grupos.set(chave, { base: { ...g.base }, soma: { ...g.soma }, nMedia: { ...g.nMedia }, n: g.n });
        continue;
      }
      e.n += g.n;
      for (let c in g.soma) e.soma[c] = (e.soma[c] || 0) + g.soma[c];
      for (let c in g.nMedia) e.nMedia[c] = (e.nMedia[c] || 0) + g.nMedia[c];
    }
    for (let r of p.linhas || []) this.linhas.push(r);
    for (let n of p.naoReconhecidos) this.naoReconhecidos.add(n);
    for (let [k, v] of p.codigos) this.codigos.set(k, v);
    this.descartadosMes += p.descartadosMes, this.nLinhas += p.nLinhas;
  }
  finalizar() {
    let t = this.t, avisos = [], out, g = t?.agrupar;
    if (g && g.por?.length ? (out = [...this.grupos.values()].map((e) => {
      let o = { ...e.base };
      t.municipio?.codigo_ibge && !g.por.includes(t.municipio.codigo_ibge) && g.por.includes(t.municipio.coluna) && (o[t.municipio.codigo_ibge] = this.codigos.get(String(e.base[t.municipio.coluna])) ?? null);
      for (let c of g.somar || []) o[c] = Math.round((e.soma[c] || 0) * 100) / 100;
      for (let c of g.media || []) o[c] = e.nMedia[c] ? Math.round(e.soma[c] / e.nMedia[c] * 100) / 100 : null;
      return g.contar && (o[g.contar] = e.n), o;
    }), avisos.push(`Agrupado: ${this.nLinhas.toLocaleString("pt-BR")} linhas viraram ${out.length.toLocaleString("pt-BR")} (por ${g.por.join(", ")}).`)) : out = this.linhas, t?.manter && t.manter.length) {
      let keep = [...t.manter, ...t.municipio?.codigo_ibge ? [t.municipio.codigo_ibge] : []];
      out = out.map((r) => Object.fromEntries(keep.filter((k) => k in r).map((k) => [k, r[k]])));
    }
    if (this.descartadosMes && avisos.push(`Agrupado-info: ${this.descartadosMes} ${this.descartadosMes === 1 ? "lan\xE7amento" : "lan\xE7amentos"} do m\xEAs em andamento (${String(this.mesAtual).padStart(2, "0")}/${this.anoAtual}) ${this.descartadosMes === 1 ? "ficou" : "ficaram"} de fora.`), this.naoReconhecidos.size) {
      let lista = [...this.naoReconhecidos];
      avisos.push(`Munic\xEDpios n\xE3o reconhecidos (mantidos como vieram, sem c\xF3digo IBGE): ${lista.slice(0, 10).join(", ")}${lista.length > 10 ? "\u2026" : ""}`);
    }
    return { registros: out, avisos };
  }
};

// automation/pipeline.ts
init_syncCore();
init_syncSchedule();
init_dataParser();
init_dashboardFilters();
var MAX_BYTES = 3 * 1024 * 1024 * 1024, MAX_BRUTO_NO_REPO = 90 * 1024 * 1024;
function criarFetcher(opts = {}) {
  let inatividadeMs = opts.inatividadeMs ?? 12e4, totalMs = opts.totalMs ?? 45 * 6e4, tentativas = opts.tentativas ?? 5, esperaBase = opts.esperaMs ?? (process.env.DD_TESTE_RAPIDO ? 50 : 5e3), MB = (n) => (n / 1048576).toFixed(1).replace(".", ",");
  return async (url, o) => {
    let limite = o?.totalMs ?? totalMs, fim = Date.now() + limite, folga = Math.min(6e4, limite / 4), feitas = 0, partes = [], recebido = 0, esperado = 0, aceitaRetomar = !1, status = 200, finalUrl = url, ultimo;
    for (let i = 1; i <= tentativas; i++) {
      feitas = i;
      let ctrl = new AbortController(), motivo = "", parado, rearmar = () => {
        parado && clearTimeout(parado), parado = setTimeout(() => {
          motivo = `o servidor ficou ${Math.round(inatividadeMs / 1e3)} segundos sem enviar dados`, ctrl.abort();
        }, inatividadeMs);
      }, restante = Math.max(1e3, fim - Date.now()), teto = setTimeout(() => {
        motivo = `passou de ${Math.round(restante / 6e4)} minutos, o tempo que restava nesta execu\xE7\xE3o (o portal est\xE1 lento); a automa\xE7\xE3o tenta de novo na pr\xF3xima execu\xE7\xE3o`, ctrl.abort();
      }, restante);
      rearmar();
      try {
        let retomando = recebido > 0 && aceitaRetomar;
        recebido > 0 && !retomando && (partes.length = 0, recebido = 0);
        let headers = { "User-Agent": "DataDash-Automacao/1.0 (+jornalismo de dados)" };
        retomando && (headers.Range = `bytes=${recebido}-`);
        let res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers });
        if (retomando && res.status !== 206 && (partes.length = 0, recebido = 0), res.status !== 206 && (status = res.status, esperado = Number(res.headers.get("content-length") || 0), aceitaRetomar = /bytes/i.test(res.headers.get("accept-ranges") || "")), finalUrl = res.url || url, esperado > MAX_BYTES) throw new Error(`arquivo grande demais (${Math.round(esperado / 1048576)} MB; limite de ${Math.round(MAX_BYTES / 1048576)} MB)`);
        if (retomando && res.status === 206 && console.log(`  retomando o download a partir de ${MB(recebido)} MB`), res.body) {
          let leitor = res.body.getReader();
          for (; ; ) {
            let { done, value } = await leitor.read();
            if (done) break;
            if (rearmar(), recebido += value.length, recebido > MAX_BYTES)
              throw ctrl.abort(), new Error(`arquivo grande demais (mais de ${Math.round(MAX_BYTES / 1048576)} MB)`);
            partes.push(Buffer.from(value));
          }
        }
        if (esperado && recebido < esperado && status < 400) throw new Error("terminated");
        return { status, body: Buffer.concat(partes, recebido), finalUrl };
      } catch (e) {
        if (ultimo = motivo ? new Error(`download interrompido: ${motivo}`) : e, motivo.startsWith("passou de")) break;
        let msg2 = String(e?.message || "") + String(e?.cause?.code || "") + String(e?.cause?.message || "");
        if (!(!/ECONNREFUSED|ENOTFOUND|CERT_|certificate/i.test(msg2) && /fetch failed|terminated|other side closed|UND_ERR|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket|sem enviar dados/i.test(msg2 + (motivo || ""))) || i === tentativas || Date.now() > fim - folga) break;
        let espera = esperaBase * i;
        console.log(`  o download foi interrompido (${MB(recebido)} MB recebidos${esperado ? ` de ${MB(esperado)} MB` : ""}); tentativa ${i + 1} de ${tentativas} em ${Math.round(espera / 1e3)} s${aceitaRetomar ? ", retomando de onde parou" : ""}`), await new Promise((r) => setTimeout(r, espera));
      } finally {
        clearTimeout(teto), parado && clearTimeout(parado);
      }
    }
    let causa = ultimo?.cause?.code ? ` (${ultimo.cause.code})` : "", msg = String(ultimo?.message || ultimo);
    throw msg === "fetch failed" ? new Error(`n\xE3o foi poss\xEDvel conectar ao endere\xE7o${causa}`) : /^terminated$|other side closed/i.test(msg) ? new Error(`a conex\xE3o com o portal caiu durante o download (${MB(recebido)} MB recebidos${esperado ? ` de ${MB(esperado)} MB` : ""}, depois de ${feitas} ${feitas === 1 ? "tentativa" : "tentativas"}); a automa\xE7\xE3o tenta de novo na pr\xF3xima execu\xE7\xE3o`) : new Error(msg);
  };
}
var fetchPadrao = criarFetcher();
function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}
function detectarFormato(f, body, url) {
  if (f.formato && f.formato !== "auto") return f.formato;
  if (body.length > 4 && body[0] === 80 && body[1] === 75)
    return /\.xlsx(\?|$)/i.test(url) || body.includes("xl/workbook.xml") ? "xlsx" : "zip";
  let head = body.subarray(0, 200).toString("utf-8").trimStart();
  return head.startsWith("{") || head.startsWith("[") || /\.json(\?|$)/i.test(url) ? "json" : "csv";
}
function carimbo(now) {
  return new Date(now.getTime() - 108e5).toISOString().slice(0, 16).replace("T", "_").replace(":", "");
}
function resolverUrl(url, now, municipios = []) {
  if (/\{\{MUNICIPIOS_ES\}\}/i.test(url)) {
    if (municipios.length < 70) throw new Error("o endere\xE7o usa {{MUNICIPIOS_ES}}, mas a lista de munic\xEDpios do IBGE n\xE3o est\xE1 dispon\xEDvel nesta execu\xE7\xE3o");
    url = url.replace(/\{\{MUNICIPIOS_ES\}\}/gi, municipios.map((m) => m.codigo).join("|"));
  }
  let pt = url.replace(/\{\{ANO_ANTERIOR\}\}/gi, "{{PREV_YYYY}}").replace(/\{\{MES_ANTERIOR\}\}/gi, "{{PREV_MM}}").replace(/\{\{ANO\}\}/gi, "{{YYYY}}").replace(/\{\{MES\}\}/gi, "{{MM}}").replace(/\{\{DIA\}\}/gi, "{{DD}}");
  return resolveDynamicUrl(pt, now);
}
var anoDe = (s) => {
  let m = s.match(/(?:^|\D)(19\d{2}|20\d{2})(?:\D|$)/);
  return m ? Number(m[1]) : null;
};
async function recursosCkan(f, now, fetcher) {
  let c = f.ckan, api = `${c.portal.replace(/\/$/, "")}/api/3/action/package_show?id=${encodeURIComponent(c.conjunto)}`, res = await fetcher(api);
  if (res.status >= 400) throw new Error(`o portal respondeu HTTP ${res.status} ao listar o conjunto "${c.conjunto}"`);
  let json;
  try {
    json = JSON.parse(res.body.toString("utf-8"));
  } catch {
    throw new Error("o portal n\xE3o respondeu no formato da API CKAN");
  }
  if (!json?.success || !Array.isArray(json.result?.resources)) throw new Error(`conjunto "${c.conjunto}" n\xE3o encontrado no portal`);
  let alvo = c.recurso ? normalizarNome(resolverUrl(c.recurso, now)) : "", lista = json.result.resources.filter((r) => r && r.url).map((r) => ({ nome: String(r.name || r.url.split("/").pop()), url: String(r.url), formato: String(r.format || "").toLowerCase(), atualizadoEm: String(r.last_modified || r.metadata_modified || r.created || "") })).filter((r) => !c.formato || r.formato === c.formato.toLowerCase() || r.url.toLowerCase().split("?")[0].endsWith("." + c.formato.toLowerCase())).filter((r) => !alvo || normalizarNome(r.nome).includes(alvo) || normalizarNome(r.url.split("/").pop() || "").includes(alvo));
  if (c.combinar && c.ano_minimo && (lista = lista.filter((r) => {
    let a = anoDe(r.nome) ?? anoDe(r.url);
    return a === null || a >= c.ano_minimo;
  })), !lista.length) throw new Error(`nenhum arquivo do conjunto "${c.conjunto}" corresponde a ${c.recurso ? `"${resolverUrl(c.recurso, now)}"` : "o formato pedido"} (o portal pode ainda n\xE3o ter publicado)`);
  return lista.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm)), c.combinar ? lista.sort((a, b) => (anoDe(a.nome) ?? anoDe(a.url) ?? 0) - (anoDe(b.nome) ?? anoDe(b.url) ?? 0)) : [lista[0]];
}
async function baixarParte(f, nome, url, fetcher, totalMs) {
  let res = await fetcher(url, totalMs ? { totalMs } : void 0);
  if (res.status >= 400) throw new Error(`a fonte respondeu HTTP ${res.status} (${url})`);
  if (!res.body.length) throw new Error(`a fonte respondeu vazio (${nome})`);
  let head = res.body.subarray(0, 300).toString("utf-8").trimStart().toLowerCase();
  if (head.startsWith("<!doctype") || head.startsWith("<html"))
    throw new Error(`a URL devolveu uma p\xE1gina da web, n\xE3o um arquivo de dados (o endere\xE7o pode ter mudado): ${url}`);
  return { nome, body: res.body, formato: detectarFormato(f, res.body, res.finalUrl), finalUrl: res.finalUrl, hash: sha256(res.body) };
}
async function carregarMunicipios(dir, fetcher) {
  let path = join2(dir, "referencias", "municipios-es.json");
  if (existsSync2(path)) return JSON.parse(readFileSync2(path, "utf-8"));
  let res = await fetcher("https://servicodados.ibge.gov.br/api/v1/localidades/estados/32/municipios");
  if (res.status >= 400) throw new Error(`IBGE respondeu HTTP ${res.status}`);
  let lista = JSON.parse(res.body.toString("utf-8")).map((m) => ({ codigo: String(m.id), nome: m.nome }));
  if (lista.length < 70) throw new Error(`lista do IBGE incompleta (${lista.length} munic\xEDpios)`);
  return mkdirSync(dirname(path), { recursive: !0 }), writeFileSync(path, JSON.stringify(lista, null, 2)), lista;
}
function decodificar2(body) {
  let txt = body.toString(codificacao(body) === "utf-8" ? "utf-8" : "latin1");
  return txt.charCodeAt(0) === 65279 ? txt.slice(1) : txt;
}
function codificacao(body) {
  return (new TextDecoder("utf-8").decode(body.subarray(0, 2097152)).match(/\uFFFD/g) || []).length > 5 ? "windows-1252" : "utf-8";
}
function* pedacosDeTexto(body) {
  let dec = new TextDecoder(codificacao(body)), PEDACO = 8 * 1048576, primeiro = !0;
  for (let i = 0; i < body.length; i += PEDACO) {
    let t = dec.decode(body.subarray(i, Math.min(i + PEDACO, body.length)), { stream: i + PEDACO < body.length });
    primeiro && (t.charCodeAt(0) === 65279 && (t = t.slice(1)), primeiro = !1), t && (yield t);
  }
  let resto = dec.decode();
  resto && (yield resto);
}
function colunasDeTexto(f) {
  let t = f.tratamento || {}, inverso = {};
  for (let [orig, novo] of Object.entries(t.renomear || {})) inverso[String(novo)] = orig;
  let nomes = /* @__PURE__ */ new Set([
    ...t.texto || [],
    ...Object.entries(t.tipos || {}).filter(([, v]) => v === "category" || v === "string").map(([k]) => k),
    ...t.municipio_por_codigo ? [t.municipio_por_codigo.coluna] : []
  ]), saida = /* @__PURE__ */ new Set();
  for (let n of nomes)
    saida.add(n), inverso[n] && saida.add(inverso[n]);
  for (let k of Object.keys(t.filtrar || {})) saida.add(k);
  return saida;
}
async function lerLinhas(f, body, formato, aoLer) {
  let n = 0;
  if (formato === "csv") {
    let texto = colunasDeTexto(f);
    return await new Promise((resolve, reject) => {
      let falhou = !1;
      import_papaparse2.default.parse(Readable.from(pedacosDeTexto(body)), {
        header: !0,
        skipEmptyLines: "greedy",
        dynamicTyping: (campo) => !texto.has(String(campo)),
        delimitersToGuess: [";", "	", ",", "|"],
        transformHeader: (h) => h.trim(),
        step: (res, parser) => {
          if (!falhou)
            try {
              n++, aoLer(res.data);
            } catch (e) {
              falhou = !0, parser.abort(), reject(e);
            }
        },
        complete: () => {
          falhou || resolve();
        },
        error: (e) => {
          falhou || (falhou = !0, reject(e));
        }
      });
    }), n;
  }
  let recs;
  if (formato === "xlsx") recs = await lerXlsx(body, { planilha: f.planilha, linhaCabecalho: f.linha_cabecalho });
  else {
    let payload = formato === "zip" ? { isZip: !0, arrayBuffer: body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength), isCsv: !1, rawText: "" } : { isZip: !1, isCsv: !1, rawText: body.toString("utf-8"), data: JSON.parse(decodificar2(body)) };
    recs = await recordsFromPayload(payload, { zipInternalFile: f.arquivo_no_zip, jsonPath: f.caminho_json });
  }
  for (let r of recs)
    n++, aoLer(r);
  return n;
}
var slug = (s) => normalizarNome(s).replace(/ /g, "-").slice(0, 60) || "arquivo";
async function processarFonte(f, estado, dir, now, fetcher, municipios, opts = {}) {
  let inicio = opts.inicio ?? Date.now(), prazo = opts.prazoMs ?? 45 * 6e4, MINIMO_PARA_COMECAR = 10 * 6e4, salvar = () => {
    try {
      opts.aoConcluirArquivo?.();
    } catch {
    }
  }, log = (m) => console.log(`[${f.id}] ${m}`), brt2 = new Date(now.getTime() - 3 * 36e5), mesAtual = brt2.toISOString().slice(0, 7), cfg = sha256(JSON.stringify({ t: f.tratamento || null, planilha: f.planilha, cab: f.linha_cabecalho, zip: f.arquivo_no_zip, json: f.caminho_json, formato: f.formato })), podeReaproveitar = !!f.tratamento?.agrupar?.por?.length && !f.dados_pessoais, pastaCache = join2(dir, "estado", "cache", pastaFonte(f)), alvos;
  if (f.arquivo) alvos = [{ chave: slug(basename2(f.arquivo)), nome: basename2(f.arquivo), local: f.arquivo }];
  else if (f.ckan) alvos = (await recursosCkan(f, now, fetcher)).map((r) => ({ chave: slug(r.nome), nome: r.nome, url: r.url, atualizadoEm: r.atualizadoEm || void 0 }));
  else if (f.anos) {
    alvos = [];
    for (let ano = Number(f.anos.de); ano <= brt2.getUTCFullYear(); ano++) {
      let url = resolverUrl((f.url || "").replace(/\{\{(ANO|YYYY)\}\}/gi, String(ano)), now, municipios);
      alvos.push({ chave: slug(`${f.id}-${ano}`), nome: `${f.id}-${ano}`, url, ano });
    }
  } else alvos = [{ chave: slug(f.id), nome: f.id, url: resolverUrl(f.url || "", now, municipios) }];
  estado.partes = estado.partes || {};
  let global2 = new Tratador(f.tratamento, municipios, now), hashes = {}, arquivosBrutos = [], avisos = [], urls = [], baixados = 0, reaproveitados = 0, feitos = 0, lerCache = (chave) => {
    let arq = join2(pastaCache, `${chave}.json`);
    if (!podeReaproveitar || !existsSync2(arq)) return null;
    try {
      let c = JSON.parse(readFileSync2(arq, "utf-8"));
      return c.cfg !== cfg || c.mesAndamento && c.mesAndamento !== mesAtual ? null : c.parcial;
    } catch {
      return null;
    }
  };
  for (let a of alvos) {
    let prev = estado.partes[a.chave], anoArquivo = anoDe(a.nome) ?? anoDe(a.url || ""), fechado = anoArquivo !== null && anoArquivo < brt2.getUTCFullYear(), prazoConferencia = (a.atualizadoEm ? 30 : 90) * 864e5, conferidoHaPouco = !!prev?.verificadoEm && now.getTime() - new Date(prev.verificadoEm).getTime() < prazoConferencia, mesmaData = a.atualizadoEm ? prev?.atualizadoEm === a.atualizadoEm : !0;
    if (fechado && conferidoHaPouco && mesmaData && prev?.hash) {
      let c = lerCache(a.chave);
      if (c) {
        global2.mesclar(c), hashes[a.chave] = prev.hash, urls.push(a.url || a.local || ""), reaproveitados++, feitos++;
        continue;
      }
    }
    let restante = prazo - (Date.now() - inicio);
    if (!a.local && restante < MINIMO_PARA_COMECAR)
      return log(`tempo desta execu\xE7\xE3o esgotado; continua na pr\xF3xima (${feitos} de ${alvos.length} arquivos prontos)`), { mudou: !1, incompleto: { feitos, total: alvos.length }, avisos, hash: estado.hash || "", arquivosBrutos, baixados, reaproveitados };
    let body, finalUrl;
    if (a.local) {
      let caminho = join2(dir, a.local);
      if (!existsSync2(caminho)) throw new Error(`planilha n\xE3o encontrada em ${a.local}. Envie o arquivo pelo site do GitHub para essa pasta, com esse nome.`);
      if (body = readFileSync2(caminho), finalUrl = a.local, !body.length) throw new Error(`a planilha ${a.local} est\xE1 vazia`);
    } else {
      let t0 = Date.now();
      log(`baixando ${a.nome}\u2026`);
      let p;
      try {
        p = await baixarParte(f, a.nome, a.url, fetcher, Math.max(6e4, prazo - (Date.now() - inicio) - 6e4));
      } catch (e) {
        if (a.ano === brt2.getUTCFullYear() && /HTTP 404/.test(String(e?.message))) {
          log(`${a.nome}: ainda n\xE3o publicado (segue sem ele)`), feitos++;
          continue;
        }
        throw e;
      }
      body = p.body, finalUrl = p.finalUrl, baixados++;
      let seg = Math.round((Date.now() - t0) / 1e3);
      log(`${a.nome}: ${(body.length / 1048576).toFixed(1).replace(".", ",")} MB em ${seg < 90 ? `${seg} s` : `${Math.round(seg / 60)} min`}`);
    }
    let formato = detectarFormato(f, body, finalUrl), hash = sha256(body);
    if (hashes[a.chave] = hash, urls.push(finalUrl), prev?.hash === hash) {
      let c = lerCache(a.chave);
      if (c) {
        global2.mesclar(c), estado.partes[a.chave] = { ...prev, atualizadoEm: a.atualizadoEm, verificadoEm: now.toISOString() }, feitos++, salvar(), log(`${a.nome}: sem mudan\xE7a`);
        continue;
      }
    }
    if (!f.dados_pessoais && !a.local && prev?.hash !== hash) {
      let politica = f.bruto || "auto", comprimido = gzipSync(body), mensal = politica === "mensal" || politica === "auto" && comprimido.length > 5 * 1048576;
      if (politica !== "nunca" && !(mensal && prev?.brutoMes === mesAtual))
        if (comprimido.length > MAX_BRUTO_NO_REPO) avisos.push(`"${a.nome}" continua grande demais mesmo compactado (${Math.round(comprimido.length / 1048576)} MB); o bruto desta coleta n\xE3o foi arquivado.`);
        else {
          let stamp = carimbo(now), sufixo = alvos.length > 1 ? "__" + a.chave.slice(0, 40) : "", rel = join2("bruto", pastaFonte(f), stamp.slice(0, 4), `${stamp}${sufixo}.${formato}.gz`);
          mkdirSync(dirname(join2(dir, rel)), { recursive: !0 }), writeFileSync(join2(dir, rel), comprimido), arquivosBrutos.push(rel), estado.partes[a.chave] = { ...estado.partes[a.chave] || {}, brutoMes: mesAtual };
        }
    }
    a.local && arquivosBrutos.push(a.local);
    let tp = new Tratador(f.tratamento, municipios, now), lidas = await lerLinhas(f, body, formato, (r) => tp.adicionar(tp.linha(r)));
    if (!lidas) throw new Error(`nenhum registro lido de "${a.nome}"`);
    let parcial = tp.parcial();
    podeReaproveitar && (mkdirSync(pastaCache, { recursive: !0 }), writeFileSync(join2(pastaCache, `${a.chave}.json`), JSON.stringify({ cfg, mesAndamento: tp.descartouMesEmAndamento ? mesAtual : null, parcial }))), global2.mesclar(parcial), estado.partes[a.chave] = { ...estado.partes[a.chave] || {}, hash, atualizadoEm: a.atualizadoEm, verificadoEm: now.toISOString() }, feitos++, salvar(), log(`${a.nome}: tratado (${lidas.toLocaleString("pt-BR")} linhas lidas) e guardado`);
  }
  let assinatura = sha256(Object.keys(hashes).sort().map((k) => `${k}:${hashes[k]}`).join("|") + "|" + cfg + (f.tratamento?.descartar_mes_em_andamento ? "|" + mesAtual : ""));
  if (estado.hash === assinatura) return { mudou: !1, avisos, hash: assinatura, arquivosBrutos, baixados, reaproveitados };
  let { registros, avisos: avisosTrat } = global2.finalizar();
  if (!registros.length) throw new Error("nenhum registro restou depois do tratamento (confira o filtro e os nomes das colunas)");
  return { mudou: !0, final: montarFinal(f, registros, urls, assinatura, now.toISOString()), avisos: [...avisosTrat, ...avisos], hash: assinatura, arquivosBrutos, baixados, reaproveitados };
}
function montarFinal(f, registros, urls, hash, coletadoEm) {
  let amostra = registros.length > 5e3 ? registros.filter((_, i) => i % Math.ceil(registros.length / 5e3) === 0) : registros, analisado = analyzeDataset(f.nome, amostra.map((r) => ({ ...r })), "automacao"), forcar = { ...f.tratamento?.tipos || {} };
  f.tratamento?.municipio?.codigo_ibge && (forcar[f.tratamento.municipio.codigo_ibge] = "category");
  for (let c of analisado.columns) forcar[c.key] && (c.type = forcar[c.key]);
  for (let [col, tipo] of Object.entries(forcar))
    if (tipo === "category" || tipo === "string") for (let r of registros) r[col] !== null && r[col] !== void 0 && (r[col] = String(r[col]));
  let dadosAte, ct = f.colunas_tempo;
  return ct && (ct.ano || ct.data) && (dadosAte = filterKit.computeFilterModel(registros, {
    year: ct.ano ? { enabled: !0, column: ct.ano } : void 0,
    lastUpdate: { show: !0, monthColumn: ct.mes, dateColumn: ct.data }
  }).lastData?.label), {
    meta: {
      fonte: f.nome,
      credito: f.fonte_credito,
      url_origem: urls.join(" "),
      coletado_em: coletadoEm,
      dados_ate: dadosAte,
      linhas: registros.length,
      hash_bruto: hash,
      gerado_por: "DataDash Studio \xB7 automa\xE7\xE3o"
    },
    colunas: analisado.columns.map((c) => ({ chave: c.key, rotulo: c.label, tipo: c.type })),
    registros
  };
}
function gravarFinal(dir, pasta, final) {
  let path = join2(dir, "final", `${pasta}.json`), texto = JSON.stringify(final, null, 1) + `
`;
  return existsSync2(path) && readFileSync2(path, "utf-8") === texto ? !1 : (mkdirSync(dirname(path), { recursive: !0 }), writeFileSync(path, texto), !0);
}

// automation/alerts.ts
var ROTULO = "automacao", marca = (chave) => `<!-- dd-alerta:${chave} -->`, ROTULOS_GRAVIDADE = { revisao: "aguardando-revisao", erro: "erro-na-coleta", atencao: "atencao" };
async function sincronizarIssues(alertas, opts) {
  let f = opts.fetch || fetch, api = `https://api.github.com/repos/${opts.repo}`, h = { Authorization: `Bearer ${opts.token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "X-GitHub-Api-Version": "2022-11-28" }, quando = (opts.agora || /* @__PURE__ */ new Date()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }), call = async (url, method = "GET", body) => {
    let r = await f(url, { method, headers: h, body: body ? JSON.stringify(body) : void 0 });
    if (!r.ok) throw new Error(`GitHub ${method} ${url.replace(api, "")}: HTTP ${r.status}`);
    return r.json();
  }, abertas = await call(`${api}/issues?labels=${ROTULO}&state=open&per_page=100`), porChave = /* @__PURE__ */ new Map();
  for (let i of abertas) {
    let m = String(i.body || "").match(/<!-- dd-alerta:([^ ]+) -->/);
    m && porChave.set(m[1], i);
  }
  let resumo = { criadas: 0, atualizadas: 0, fechadas: 0, mantidas: 0 };
  for (let a of alertas) {
    let corpo = `${a.corpo}

${marca(a.chave)}`, existente = porChave.get(a.chave);
    existente ? String(existente.body || "").startsWith(a.corpo) ? resumo.mantidas++ : (await call(`${api}/issues/${existente.number}`, "PATCH", { title: a.projeto ? `[${a.projeto}] ${a.titulo}` : a.titulo, body: `${corpo}

_Atualizada pela automa\xE7\xE3o em ${quando}._` }), await call(`${api}/issues/${existente.number}/comments`, "POST", { body: `A situa\xE7\xE3o mudou (${quando}):

${a.corpo}` }), resumo.atualizadas++) : (await call(`${api}/issues`, "POST", { title: a.projeto ? `[${a.projeto}] ${a.titulo}` : a.titulo, body: `${corpo}

_Aberta pela automa\xE7\xE3o em ${quando}._`, labels: [ROTULO, ROTULOS_GRAVIDADE[a.gravidade], ...a.projeto ? [`projeto:${a.projeto}`] : []] }), resumo.criadas++), porChave.delete(a.chave);
  }
  for (let [, issue] of porChave)
    await call(`${api}/issues/${issue.number}/comments`, "POST", { body: `\u2705 Resolvido automaticamente: o problema n\xE3o apareceu na verifica\xE7\xE3o de ${quando}.` }), await call(`${api}/issues/${issue.number}`, "PATCH", { state: "closed", state_reason: "completed" }), resumo.fechadas++;
  return resumo;
}
function resumoMarkdown(linhas, alertas, extra = []) {
  let icone = { revisao: "\u{1F7E1}", erro: "\u{1F534}", atencao: "\u{1F7E0}" };
  return [
    "## Execu\xE7\xE3o da automa\xE7\xE3o",
    "",
    "| Fonte | Resultado | Detalhe |",
    "|---|---|---|",
    ...linhas.map((l) => `| ${l.fonte} | ${l.resultado} | ${(l.detalhe || "").replace(/\|/g, "/").replace(/\n/g, " ")} |`),
    "",
    alertas.length ? "### Avisos" : "### Nenhum aviso",
    ...alertas.map((a) => `- ${icone[a.gravidade]} **${a.titulo}**`),
    ...extra.length ? ["", ...extra] : []
  ].join(`
`);
}

// automation/run.ts
var rotulo = (f) => f.projeto ? `[${f.projeto}] ${f.nome}` : f.nome;
async function executar(opts, deps) {
  let now = opts.agora || /* @__PURE__ */ new Date(), inicio = Date.now(), prazoMs = (opts.prazoMinutos ?? 45) * 6e4, gravarEstado = () => {
    mkdirSync3(dirname3(estadoPath), { recursive: !0 }), writeFileSync3(estadoPath + ".tmp", JSON.stringify(estado, null, 2) + `
`), renameSync(estadoPath + ".tmp", estadoPath);
  }, docsApp = deps.firebase?.listarFontes ? await deps.firebase.listarFontes().catch((e) => (console.warn("N\xE3o foi poss\xEDvel ler as fontes do app:", e?.message || e), [])) : [], doApp = validarFontesDoApp(docsApp), config = loadConfigDir(opts.dados, doApp.fontes), estadoPath = join4(opts.dados, "estado", "fontes.json"), estado = existsSync4(estadoPath) ? JSON.parse(readFileSync4(estadoPath, "utf-8")) : {}, alertas = [];
  for (let e of doApp.erros)
    alertas.push({ chave: `config-app:${e.id}`, gravidade: "erro", titulo: `Fonte do app com configura\xE7\xE3o inv\xE1lida: ${e.nome}`, corpo: `A fonte "${e.nome}", cadastrada na tela Fontes autom\xE1ticas do app, n\xE3o p\xF4de ser usada.

**Motivo:** ${e.mensagem}

Corrija no app; as outras fontes continuam funcionando.` });
  let linhas = [], novosFinais = /* @__PURE__ */ new Map(), municipios = [];
  if (config.fontes.some((f) => f.ativo !== !1 && (f.tratamento?.municipio || f.tratamento?.municipio_por_codigo || /\{\{MUNICIPIOS_ES\}\}/i.test(f.url || ""))))
    try {
      municipios = await carregarMunicipios(opts.dados, deps.fetcher);
    } catch (e) {
      alertas.push({ chave: "referencia:municipios", gravidade: "atencao", titulo: "Lista de munic\xEDpios do IBGE indispon\xEDvel", corpo: `N\xE3o foi poss\xEDvel obter a lista oficial de munic\xEDpios do ES (${e.message}). Os nomes n\xE3o foram padronizados nesta execu\xE7\xE3o.` });
    }
  for (let f of config.fontes) {
    if (f.ativo === !1 || opts.fonte && f.id !== opts.fonte) continue;
    let st = estado[f.id] || {}, motivo = fonteDevida(f, st, now, opts.forcar);
    if (!motivo) {
      let parada = fonteParada(f, st, now);
      parada && alertas.push({ projeto: f.projeto, chave: `parada:${f.id}`, gravidade: "atencao", titulo: `Fonte sem dado novo: ${f.nome}`, corpo: parada });
      continue;
    }
    let sinal;
    if (f.sinal_de_novidade)
      try {
        let r = await deps.fetcher(resolverUrl(f.sinal_de_novidade, now), { totalMs: 6e4 });
        if (r.status < 400 && (sinal = sha256(r.body), !opts.forcar && st.hash && st.sinal === sinal)) {
          st.ultimaVerificacao = now.toISOString(), motivo === "agendada" && (f.agenda.tentar_ate_novidade_dias || 0) > 0 && !st.aguardandoNovidadeDesde && (st.aguardandoNovidadeDesde = ultimoHorarioAgendado(f, now).toISOString()), estado[f.id] = st, linhas.push({ fonte: rotulo(f), resultado: "\u2796 sem novidade", detalhe: "o sinal de atualiza\xE7\xE3o da fonte n\xE3o mudou (nada foi baixado)" });
          continue;
        }
      } catch {
      }
    try {
      estado[f.id] = st;
      let c = await processarFonte(f, st, opts.dados, now, deps.fetcher, municipios, { prazoMs, inicio, aoConcluirArquivo: gravarEstado });
      if (c.incompleto) {
        linhas.push({ fonte: rotulo(f), resultado: "\u23F3 em andamento", detalhe: `${c.incompleto.feitos} de ${c.incompleto.total} arquivos processados; continua na pr\xF3xima execu\xE7\xE3o` }), st.emAndamento = !0, estado[f.id] = st;
        continue;
      }
      st.ultimaVerificacao = now.toISOString(), delete st.emAndamento, sinal && (st.sinal = sinal), delete st.ultimoErro, delete st.ultimoErroEm;
      let extraArquivos = c.reaproveitados > 0 ? ` \xB7 ${c.baixados} ${c.baixados === 1 ? "arquivo baixado" : "arquivos baixados"}; ${c.reaproveitados} ${c.reaproveitados === 1 ? "ano fechado reaproveitado" : "anos fechados reaproveitados"} sem baixar` : "";
      if (c.mudou && c.final) {
        let coletadoEm = now.toISOString(), final = c.final, avisos = c.avisos;
        f.dados_pessoais && !deps.firebase ? (st.avisos = ["Fonte marcada com dados_pessoais: no modo simplificado (sem Firebase) ela n\xE3o \xE9 gravada em lugar nenhum. Ela s\xF3 funciona no modo completo, que envia os dados direto ao app."], linhas.push({ fonte: rotulo(f), resultado: "\u{1F512} ignorada no modo simplificado", detalhe: "dados pessoais" })) : f.dados_pessoais ? (novosFinais.set(f.id, final), linhas.push({ fonte: rotulo(f), resultado: "\u{1F512} dado novo (n\xE3o arquivado: dados pessoais)", detalhe: `${final.meta.linhas} linhas` })) : (gravarFinal(opts.dados, pastaFonte(f), final), novosFinais.set(f.id, final), linhas.push({ fonte: rotulo(f), resultado: "\u{1F195} dado novo", detalhe: `${final.meta.linhas} linhas${final.meta.dados_ate ? ` \xB7 dados at\xE9 ${final.meta.dados_ate}` : ""}${extraArquivos}` })), Object.assign(st, { hash: c.hash, ultimaNovidade: coletadoEm, arquivo: f.dados_pessoais ? void 0 : c.arquivosBrutos[c.arquivosBrutos.length - 1] }), delete st.hashes, delete st.aguardandoNovidadeDesde, st.avisos = avisos.filter((a) => !a.startsWith("Agrupado"));
        for (let info of avisos.filter((a) => a.startsWith("Agrupado"))) {
          let l = linhas[linhas.length - 1];
          l && (l.detalhe = `${l.detalhe || ""} \xB7 ${info.replace(/^Agrupado-info: /, "").replace(/^Agrupado: /, "agrupado: ")}`);
        }
      } else
        motivo === "agendada" && (f.agenda.tentar_ate_novidade_dias || 0) > 0 && !st.aguardandoNovidadeDesde && (st.aguardandoNovidadeDesde = ultimoHorarioAgendado(f, now).toISOString()), linhas.push({ fonte: rotulo(f), resultado: "\u2796 sem novidade", detalhe: ((motivo === "nova_tentativa" ? "nova tentativa (aguardando publica\xE7\xE3o da fonte)" : motivo === "apos_erro" ? "nova tentativa depois do erro anterior: funcionou" : "") + extraArquivos).replace(/^ · /, "") });
      let parada = fonteParada(f, st, now);
      parada && alertas.push({ projeto: f.projeto, chave: `parada:${f.id}`, gravidade: "atencao", titulo: `Fonte sem dado novo: ${f.nome}`, corpo: parada });
    } catch (e) {
      st.ultimaVerificacao = now.toISOString(), st.ultimoErro = String(e?.message || e), st.ultimoErroEm = now.toISOString(), linhas.push({ fonte: rotulo(f), resultado: "\u{1F534} erro", detalhe: st.ultimoErro });
    }
    estado[f.id] = st;
  }
  for (let f of config.fontes) {
    let st = estado[f.id];
    if (!(f.ativo === !1 || !st)) {
      if (st.ultimoErro) {
        let quando = st.ultimoErroEm ? new Date(st.ultimoErroEm).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "", endereco = f.arquivo ? `${f.arquivo} (planilha no reposit\xF3rio)` : f.ckan ? `${f.ckan.portal.replace(/\/$/, "")}/dataset/${f.ckan.conjunto}` : f.url;
        alertas.push({ projeto: f.projeto, chave: `coleta:${f.id}`, gravidade: "erro", titulo: `Falha na coleta: ${f.nome}`, corpo: `N\xE3o foi poss\xEDvel coletar ou ler a fonte (\xFAltima tentativa: ${quando}).

**Motivo:** ${st.ultimoErro}

**Endere\xE7o:** ${endereco}

Os pain\xE9is continuam com o \xFAltimo dado validado. A automa\xE7\xE3o tenta de novo no pr\xF3ximo hor\xE1rio agendado.` });
      }
      st.avisos?.length && alertas.push({ projeto: f.projeto, chave: `tratamento:${f.id}`, gravidade: "atencao", titulo: `Aten\xE7\xE3o no tratamento: ${f.nome}`, corpo: st.avisos.join(`

`) });
    }
  }
  if (deps.firebase)
    for (let f of config.fontes) {
      if (!f.dataset_id || f.ativo === !1) continue;
      let ds = await deps.firebase.loadDataset(f.dataset_id);
      if (!ds) {
        alertas.push({ projeto: f.projeto, chave: `base:${f.id}`, gravidade: "erro", titulo: `Base n\xE3o encontrada no app: ${f.dataset_id}`, corpo: `A fonte "${f.nome}" aponta para a base \`${f.dataset_id}\`, que n\xE3o existe no app. Corrija \`dataset_id\` em fontes.yml.` });
        continue;
      }
      let final = novosFinais.get(f.id);
      if (final) {
        let local = async () => ({ status: 200, body: Buffer.from(JSON.stringify(final)), finalUrl: "local:final.json" }), { syncOneDataset: syncOneDataset2 } = await Promise.resolve().then(() => (init_serverSync(), serverSync_exports)), r = await syncOneDataset2({ ...ds, jsonPath: "registros" }, deps.firebase.store, local, now), link = linhas.find((l) => l.fonte === rotulo(f));
        link && (link.detalhe = `${link.detalhe || ""} \xB7 app: ${{ published: "publicado", held: "retido para revis\xE3o", unchanged: "sem mudan\xE7a", error: "erro", skipped_not_due: "-" }[r.result]}`);
        let st = estado[f.id] || (estado[f.id] = {});
        r.result === "error" ? st.erroSync = r.message : delete st.erroSync;
      }
      let stSync = estado[f.id];
      stSync?.erroSync && alertas.push({ projeto: f.projeto, chave: `sync:${f.id}`, gravidade: "erro", titulo: `Falha ao atualizar a base no app: ${ds.name}`, corpo: stSync.erroSync });
      let atual = await deps.firebase.loadDataset(f.dataset_id);
      if (atual?.editionImpact?.items?.length && alertas.push({
        projeto: f.projeto,
        chave: `edicao:${f.id}`,
        gravidade: "atencao",
        titulo: `Fonte alterou dados de uma edi\xE7\xE3o: ${atual.name}`,
        corpo: atual.editionImpact.items.map((i) => `**${i.label}:** ${i.count} valores diferentes da edi\xE7\xE3o. Ex.: ${i.sample.slice(0, 3).join("; ")}`).join(`

`) + `

A edi\xE7\xE3o n\xE3o mudou. No app, abra Bases \u2192 "${atual.name}" \u2192 Vers\xF5es e edi\xE7\xF5es e escolha entre revisar a edi\xE7\xE3o ou mant\xEA-la como est\xE1.`
      }), atual?.pendingUpdate) {
        let p = atual.pendingUpdate;
        alertas.push({
          projeto: f.projeto,
          chave: `revisao:${f.id}`,
          gravidade: "revisao",
          titulo: `Dados novos aguardando revis\xE3o: ${atual.name}`,
          corpo: `Recebidos em ${new Date(p.fetchedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}: ${p.rowCount.toLocaleString("pt-BR")} linhas (publicada: ${atual.rowCount.toLocaleString("pt-BR")}).

${p.checks.filter((c) => c.level !== "info").map((c) => `- ${c.message}`).join(`
`)}

Os pain\xE9is continuam com a vers\xE3o anterior. No app: Bases \u2192 "${atual.name}" \u2192 Vers\xF5es e edi\xE7\xF5es \u2192 aprovar ou descartar.`
        });
      }
    }
  let publicacao = null;
  if (deps.firebase && !opts.semPublicar && config.publicacao?.github_pages !== !1)
    try {
      let { publicarProjetos: publicarProjetos2, carregarVendor: carregarVendor2 } = await Promise.resolve().then(() => (init_publish(), publish_exports));
      publicacao = await publicarProjetos2({
        source: deps.firebase.publishSource,
        saida: join4(opts.dados, "site"),
        estadoPath: join4(opts.dados, "estado", "publicacao.json"),
        vendor: carregarVendor2(deps.appDir),
        ids: config.publicacao?.projetos
      });
    } catch (e) {
      alertas.push({ chave: "publicacao", gravidade: "erro", titulo: "Falha ao gerar os sites publicados", corpo: String(e?.message || e) });
    }
  if (deps.firebase?.gravarSituacao) {
    let situacoes = [];
    for (let f of config.fontes.filter((x) => x.origem === "app")) {
      let st = estado[f.id] || {}, linha = linhas.find((l) => l.fonte === rotulo(f)), dadosAte, registros;
      try {
        let fin = JSON.parse(readFileSync4(join4(opts.dados, "final", `${pastaFonte(f)}.json`), "utf-8"));
        dadosAte = fin.meta?.dados_ate, registros = fin.meta?.linhas;
      } catch {
      }
      situacoes.push([f.id, JSON.parse(JSON.stringify({
        atualizadaEm: now.toISOString(),
        ultimaVerificacao: st.ultimaVerificacao,
        ultimaNovidade: st.ultimaNovidade,
        ultimoErro: st.ultimoErro || null,
        ultimoErroEm: st.ultimoErroEm || null,
        resultado: linha?.resultado,
        detalhe: linha?.detalhe,
        dadosAte,
        registros,
        arquivoFinal: `final/${pastaFonte(f)}.json`
      }))]);
    }
    for (let e of doApp.erros) situacoes.push([e.id, { atualizadaEm: now.toISOString(), ultimoErro: `configura\xE7\xE3o inv\xE1lida: ${e.mensagem}`, ultimoErroEm: now.toISOString(), resultado: "\u{1F534} configura\xE7\xE3o inv\xE1lida" }]);
    for (let [id, sit] of situacoes) await deps.firebase.gravarSituacao(id, sit).catch((e) => console.warn(`Situa\xE7\xE3o da fonte ${id} n\xE3o gravada:`, e?.message || e));
  }
  gravarEstado();
  let extra = publicacao ? [`**Publica\xE7\xE3o:** ${publicacao.projetos.map((p) => `${p.nome} (${p.paginas} p\xE1ginas${p.mudou ? ", atualizado" : ""})`).join("; ") || "nenhum projeto marcado"}${publicacao.mudou ? " \xB7 o site ser\xE1 republicado" : " \xB7 nada mudou no site"}`] : [], md = resumoMarkdown(linhas, alertas, extra), issues = null;
  if (deps.github)
    try {
      issues = await sincronizarIssues(alertas, { ...deps.github, agora: now });
    } catch (e) {
      console.warn("N\xE3o foi poss\xEDvel atualizar as issues:", e?.message || e);
    }
  return { linhas, alertas, publicacao, issues, resumo: md, siteMudou: !!publicacao?.mudou };
}
var VERSAO_AUTOMACAO = "2026-10-22.16 (coleta em andamento continua na execu\xE7\xE3o seguinte)";
async function cli() {
  console.log(`DataDash \xB7 automa\xE7\xE3o vers\xE3o ${VERSAO_AUTOMACAO}`);
  let args = process.argv.slice(2), val = (k) => {
    let i = args.indexOf(k);
    return i >= 0 ? args[i + 1] : void 0;
  }, has = (k) => args.includes(k);
  process.env.TZ = process.env.TZ || "America/Sao_Paulo";
  let appDir = join4(dirname3(fileURLToPath(import.meta.url)), ".."), dados = val("--dados") || ".";
  if (val("--fonte") === "conferir-catalogo") {
    let { conferirConjuntos: conferirConjuntos2, relatorioConferencia: relatorioConferencia2 } = await Promise.resolve().then(() => (init_conferir(), conferir_exports)), { conjuntosDoCatalogo: conjuntosDoCatalogo2 } = await Promise.resolve().then(() => (init_apiCatalog(), apiCatalog_exports)), itens = conjuntosDoCatalogo2();
    try {
      for (let f of loadConfigDir(dados).fontes) f.ckan && itens.push({ id: f.id, nome: f.nome, portal: f.ckan.portal, conjunto: f.ckan.conjunto });
    } catch {
    }
    console.log(`Conferindo ${itens.length} conjuntos no portal\u2026`);
    let res = await conferirConjuntos2(itens, fetchPadrao), md = relatorioConferencia2(res, /* @__PURE__ */ new Date());
    mkdirSync3(join4(dados, "estado"), { recursive: !0 }), writeFileSync3(join4(dados, "estado", "conferencia-catalogo.md"), md + `
`), writeFileSync3(join4(dados, "estado", "conferencia-catalogo.json"), JSON.stringify(res, null, 1) + `
`), console.log(md), process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + `
`), process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `site_mudou=false
`);
    return;
  }
  let firebase = null, comFirebase = !has("--sem-firebase") && !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (comFirebase || console.log("Modo simplificado: sem credenciais do Firebase. Coleta, hist\xF3rico, tratamento, JSON final e avisos funcionam; a atualiza\xE7\xE3o das bases \xE9 feita pelo app ao ler o JSON."), comFirebase) {
    let { createAdminContext: createAdminContext2 } = await Promise.resolve().then(() => (init_serverSync(), serverSync_exports)), { adminPublishSource: adminPublishSource2 } = await Promise.resolve().then(() => (init_publish(), publish_exports)), cfg = JSON.parse(readFileSync4(join4(appDir, "firebase-applet-config.json"), "utf-8")), ctx = await createAdminContext2({ projectId: cfg.projectId, databaseId: cfg.firestoreDatabaseId }), loadDataset = async (id) => {
      let s = await ctx.db.collection("datasets").doc(id).get();
      return s.exists ? s.data() : null;
    };
    firebase = {
      store: ctx.store,
      loadDataset,
      publishSource: adminPublishSource2(ctx.db, ctx.store),
      listarFontes: async () => (await ctx.db.collection("fontesAutomaticas").get()).docs.map((d) => ({ id: d.id, ...d.data() })),
      gravarSituacao: async (id, situacao) => {
        await ctx.db.collection("fontesAutomaticas").doc(id).set({ situacao }, { merge: !0 });
      }
    };
  }
  let github = !has("--sem-issues") && process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY ? { repo: process.env.GITHUB_REPOSITORY, token: process.env.GITHUB_TOKEN } : null, prazoTxt = val("--prazo-minutos") || process.env.DD_PRAZO_MINUTOS, prazoMinutos = prazoTxt && Number(prazoTxt) > 0 ? Math.min(Number(prazoTxt), 340) : void 0;
  prazoMinutos && console.log(`Tempo de coleta desta execu\xE7\xE3o: at\xE9 ${prazoMinutos} minutos`);
  let r = await executar({ dados, forcar: has("--forcar"), fonte: val("--fonte"), semPublicar: has("--sem-publicar"), prazoMinutos }, { fetcher: fetchPadrao, firebase, github, appDir });
  comFirebase || (r.resumo += "\n\n_Modo simplificado (sem Firebase): as bases do app se atualizam quando o app l\xEA o JSON de `final/`. Para o modo completo, configure os segredos do Firebase (ver README)._"), console.log(r.resumo), process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, r.resumo + `
`), process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `site_mudou=${r.siteMudou}
`);
}
process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && cli().catch((e) => {
  console.error("Falha geral da automa\xE7\xE3o:", e?.message || e), process.exit(1);
});
export {
  VERSAO_AUTOMACAO,
  executar
};
/*! Bundled license information:

papaparse/papaparse.js:
  (* @license
  Papa Parse
  v5.7.0
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

/*!
 * @license
 * MgStore.js v0.0.1
 * (c) 2019-2019 MichaelGong
 * https://github.com/MichaelGong/wheel
 * Released under the MIT License.
 */
'use strict';
var __assign = function() {
    return (__assign =
      Object.assign ||
      function(t) {
        for (var e, r = 1, o = arguments.length; r < o; r++)
          for (var a in (e = arguments[r]))
            Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
        return t;
      }).apply(this, arguments);
  },
  MgStore = (function() {
    function t(t) {
      (this.quotaStrategy = {
        CLEAR_ALL: 'CLEAR_ALL',
        CLEAR_ONLY_TAG: 'CLEAR_ONLY_TAG',
        NONE: 'NONE',
      }),
        (this.store = window.localStorage),
        (this.defaultSetOptions = {
          maxAge: 0,
          quotaStrategy: this.quotaStrategy.CLEAR_ALL,
        }),
        (this.defaultOptions = {
          tag: 'mgstore',
          maxAge: 0,
          quotaStrategy: this.quotaStrategy.CLEAR_ALL,
        });
      var e = __assign({}, this.defaultOptions, t);
      (this.isSupport = this.checkSupport()),
        (this.tag = e.tag),
        (this.maxAge = e.maxAge || 0),
        (this.maxAgeTime = e.maxAge ? this.getNowTimeStamp() + e.maxAge : 0),
        (this.curQuotaStrategy = e.quotaStrategy);
    }
    return (
      (t.prototype.getKey = function(t, e) {
        return (e || this.tag) + '/' + t;
      }),
      (t.prototype.stringify = function(t) {
        return JSON.stringify(t);
      }),
      (t.prototype.parse = function(t) {
        return JSON.parse(t);
      }),
      (t.prototype.getNowTimeStamp = function() {
        return new Date().getTime();
      }),
      (t.prototype.checkSupport = function() {
        var t = 'localStorage' in window && null !== window.localStorage;
        try {
          return (
            localStorage.setItem('local_storage_test', '1'),
            localStorage.removeItem('local_storage_test'),
            t
          );
        } catch (t) {
          return !1;
        }
      }),
      (t.prototype.setMaxAge = function(t) {
        void 0 === t && (t = 0),
          (this.maxAgeTime = t ? this.getNowTimeStamp() + t : 0);
      }),
      (t.prototype.set = function(t, e, r) {
        var o = __assign(
            {},
            this.defaultSetOptions,
            { maxAge: this.maxAge, quotaStrategy: this.curQuotaStrategy },
            r,
          ),
          a = this.maxAgeTime;
        a = o.maxAge ? this.getNowTimeStamp() + o.maxAge : 0;
        var i = this.getKey(t),
          s = this.stringify({ time: a, tag: this.tag, value: e });
        try {
          this.store.setItem(i, s);
        } catch (t) {
          ('QuotaExceededError' !== t.name &&
            'NS_ERROR_DOM_QUOTA_REACHED' !== t.name) ||
            this.handleQuotaStrategy(o.quotaStrategy);
        }
      }),
      (t.prototype.get = function(t, e) {
        var r = this.getKey(t, e),
          o = this.store.getItem(r);
        if (!o) return null;
        var a = this.parse(o),
          i = this.getNowTimeStamp();
        return !a.time || a.time > i ? a.value : (this.remove(t), null);
      }),
      (t.prototype.remove = function(t, e) {
        var r = this.getKey(t, e);
        this.removeByFullName(r);
      }),
      (t.prototype.removeByFullName = function(t) {
        this.store.removeItem(t);
      }),
      (t.prototype.clear = function() {
        this.store.clear();
      }),
      (t.prototype.clearAllByTag = function(t) {
        for (var e = t || this.tag, r = this.store.length, o = 0; o < r; o++) {
          var a = this.store.key(o);
          if (a) {
            var i = this.store.getItem(a);
            if (i && a.includes(e))
              this.parse(i).tag === e && this.removeByFullName(a);
          }
        }
      }),
      (t.prototype.handleQuotaStrategy = function(t) {
        var e,
          r = this,
          o = t || this.curQuotaStrategy;
        (((e = {})[this.quotaStrategy.CLEAR_ALL] = function() {
          r.store.clear();
        }),
        (e[this.quotaStrategy.CLEAR_ONLY_TAG] = function() {
          r.clearAllByTag();
        }),
        (e[this.quotaStrategy.NONE] = function() {}),
        e)[o]();
      }),
      (t.prototype.createInstance = function(e) {
        return new t(e);
      }),
      (t.version = '0.0.1'),
      t
    );
  })(),
  Store = new MgStore();
module.exports = Store;
//# sourceMappingURL=Store.cjs.js.map

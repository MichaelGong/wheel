/*!
 * @license
 * MgStore.js v0.2.0-alpha.0
 * (c) 2019-2019 MichaelGong
 * https://github.com/MichaelGong/wheel
 * Released under the MIT License.
 */
!(function(t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t = t || self).mgStore = e());
})(this, function() {
  'use strict';
  var t = function() {
    return (t =
      Object.assign ||
      function(t) {
        for (var e, o = 1, r = arguments.length; o < r; o++)
          for (var a in (e = arguments[o]))
            Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
        return t;
      }).apply(this, arguments);
  };
  return new ((function() {
    function e(e) {
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
      var o = t({}, this.defaultOptions, e);
      (this.isSupport = this.checkSupport()),
        (this.tag = o.tag),
        (this.maxAge = o.maxAge || 0),
        (this.maxAgeTime = o.maxAge ? this.getNowTimeStamp() + o.maxAge : 0),
        (this.curQuotaStrategy = o.quotaStrategy);
    }
    return (
      (e.prototype.getKey = function(t, e) {
        return (e || this.tag) + '/' + t;
      }),
      (e.prototype.stringify = function(t) {
        return JSON.stringify(t);
      }),
      (e.prototype.parse = function(t) {
        return JSON.parse(t);
      }),
      (e.prototype.getNowTimeStamp = function() {
        return new Date().getTime();
      }),
      (e.prototype.checkSupport = function() {
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
      (e.prototype.setMaxAge = function(t) {
        void 0 === t && (t = 0),
          (this.maxAgeTime = t ? this.getNowTimeStamp() + t : 0);
      }),
      (e.prototype.set = function(e, o, r) {
        var a = t(
            {},
            this.defaultSetOptions,
            { maxAge: this.maxAge, quotaStrategy: this.curQuotaStrategy },
            r,
          ),
          i = this.maxAgeTime;
        i = a.maxAge ? this.getNowTimeStamp() + a.maxAge : 0;
        var n = this.getKey(e),
          s = this.stringify({ time: i, tag: this.tag, value: o });
        try {
          this.store.setItem(n, s);
        } catch (t) {
          ('QuotaExceededError' !== t.name &&
            'NS_ERROR_DOM_QUOTA_REACHED' !== t.name) ||
            this.handleQuotaStrategy(a.quotaStrategy);
        }
      }),
      (e.prototype.get = function(t, e) {
        var o = this.getKey(t, e),
          r = this.store.getItem(o);
        if (!r) return null;
        var a = this.parse(r),
          i = this.getNowTimeStamp();
        return !a.time || a.time > i ? a.value : (this.remove(t), null);
      }),
      (e.prototype.remove = function(t, e) {
        var o = this.getKey(t, e);
        this.removeByFullName(o);
      }),
      (e.prototype.removeByFullName = function(t) {
        this.store.removeItem(t);
      }),
      (e.prototype.clear = function() {
        this.store.clear();
      }),
      (e.prototype.clearAllByTag = function(t) {
        for (var e = t || this.tag, o = this.store.length, r = 0; r < o; r++) {
          var a = this.store.key(r);
          if (a) {
            var i = this.store.getItem(a);
            if (i && a.includes(e))
              this.parse(i).tag === e && this.removeByFullName(a);
          }
        }
      }),
      (e.prototype.handleQuotaStrategy = function(t) {
        var e,
          o = this,
          r = t || this.curQuotaStrategy;
        (((e = {})[this.quotaStrategy.CLEAR_ALL] = function() {
          o.store.clear();
        }),
        (e[this.quotaStrategy.CLEAR_ONLY_TAG] = function() {
          o.clearAllByTag();
        }),
        (e[this.quotaStrategy.NONE] = function() {}),
        e)[r]();
      }),
      (e.prototype.createInstance = function(t) {
        return new e(t);
      }),
      (e.version = '0.2.0-alpha.0'),
      e
    );
  })())();
});
//# sourceMappingURL=Store.umd.js.map

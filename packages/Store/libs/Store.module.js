/*!
 * @license
 * MgStore.js v0.0.1
 * (c) 2019-2019 MichaelGong
 * https://github.com/MichaelGong/wheel
 * Released under the MIT License.
 */
var t = function() {
    return (t =
      Object.assign ||
      function(t) {
        for (var e, r = 1, a = arguments.length; r < a; r++)
          for (var o in (e = arguments[r]))
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        return t;
      }).apply(this, arguments);
  },
  e = new ((function() {
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
      var r = t({}, this.defaultOptions, e);
      (this.isSupport = this.checkSupport()),
        (this.tag = r.tag),
        (this.maxAge = r.maxAge || 0),
        (this.maxAgeTime = r.maxAge ? this.getNowTimeStamp() + r.maxAge : 0),
        (this.curQuotaStrategy = r.quotaStrategy);
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
      (e.prototype.set = function(e, r, a) {
        var o = t(
            {},
            this.defaultSetOptions,
            { maxAge: this.maxAge, quotaStrategy: this.curQuotaStrategy },
            a,
          ),
          i = this.maxAgeTime;
        i = o.maxAge ? this.getNowTimeStamp() + o.maxAge : 0;
        var n = this.getKey(e),
          s = this.stringify({ time: i, tag: this.tag, value: r });
        try {
          this.store.setItem(n, s);
        } catch (t) {
          ('QuotaExceededError' !== t.name &&
            'NS_ERROR_DOM_QUOTA_REACHED' !== t.name) ||
            this.handleQuotaStrategy(o.quotaStrategy);
        }
      }),
      (e.prototype.get = function(t, e) {
        var r = this.getKey(t, e),
          a = this.store.getItem(r);
        if (!a) return null;
        var o = this.parse(a),
          i = this.getNowTimeStamp();
        return !o.time || o.time > i ? o.value : (this.remove(t), null);
      }),
      (e.prototype.remove = function(t, e) {
        var r = this.getKey(t, e);
        this.removeByFullName(r);
      }),
      (e.prototype.removeByFullName = function(t) {
        this.store.removeItem(t);
      }),
      (e.prototype.clear = function() {
        this.store.clear();
      }),
      (e.prototype.clearAllByTag = function(t) {
        for (var e = t || this.tag, r = this.store.length, a = 0; a < r; a++) {
          var o = this.store.key(a);
          if (o) {
            var i = this.store.getItem(o);
            if (i && o.includes(e))
              this.parse(i).tag === e && this.removeByFullName(o);
          }
        }
      }),
      (e.prototype.handleQuotaStrategy = function(t) {
        var e,
          r = this,
          a = t || this.curQuotaStrategy;
        (((e = {})[this.quotaStrategy.CLEAR_ALL] = function() {
          r.store.clear();
        }),
        (e[this.quotaStrategy.CLEAR_ONLY_TAG] = function() {
          r.clearAllByTag();
        }),
        (e[this.quotaStrategy.NONE] = function() {}),
        e)[a]();
      }),
      (e.prototype.createInstance = function(t) {
        return new e(t);
      }),
      (e.version = '0.0.1'),
      e
    );
  })())();
export default e;
//# sourceMappingURL=Store.module.js.map

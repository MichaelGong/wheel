// QuotaExceededError
type quotaStrategy = 'CLEAR_ALL' | 'CLEAR_ONLY_TAG' | 'NONE';
interface MgStoreOptions {
  tag?: string;
  maxAge?: number;
  quotaStrategy?: quotaStrategy;
}
interface SetOptions {
  maxAge?: number;
  quotaStrategy?: quotaStrategy;
}

const defaultOptions: MgStoreOptions = {
  tag: 'mgstore',
  maxAge: 0,
};

class MgStore {
  static version = '__VERSION__';
  protected quotaStrategy: { [key: string]: quotaStrategy } = {
    CLEAR_ALL: 'CLEAR_ALL',
    CLEAR_ONLY_TAG: 'CLEAR_ONLY_TAG',
    NONE: 'NONE',
  };
  private store: Storage = window.localStorage;
  private tag: string;
  private maxAge: number;
  private maxAgeTime: number;
  private curQuotaStrategy: quotaStrategy;
  private defaultSetOptions: SetOptions = {
    maxAge: 0,
    quotaStrategy: this.quotaStrategy.CLEAR_ALL,
  };
  private defaultOptions: MgStoreOptions = {
    tag: 'mgstore',
    maxAge: 0,
    quotaStrategy: this.quotaStrategy.CLEAR_ALL,
  };

  public isSupport: boolean;
  /**
   * 初始化
   * @param options {
   *                  tag: string, 存储的key的前缀标识，默认是mgstore
   *                  maxAge: 最长存储多久，如果不传或传不为真的内容，就不会设置过期时间,单位毫秒
   *                }
   */
  constructor(options?: MgStoreOptions) {
    // const curOptions = Object.assign(this.defaultOptions, options);
    const curOptions = {
      ...this.defaultOptions,
      ...options,
    };
    this.isSupport = this.checkSupport();
    this.tag = curOptions.tag as string;
    this.maxAge = curOptions.maxAge || 0;
    this.maxAgeTime = !curOptions.maxAge
      ? 0
      : this.getNowTimeStamp() + curOptions.maxAge;
    this.curQuotaStrategy = curOptions.quotaStrategy as quotaStrategy;
  }
  private getKey(key: string, tagName?: string) {
    return `${tagName || this.tag}/${key}`;
  }
  private stringify(value: any) {
    return JSON.stringify(value);
  }
  private parse(value: string) {
    return JSON.parse(value);
  }
  /**
   * 获取当前时间戳
   */
  getNowTimeStamp() {
    return new Date().getTime();
  }
  /**
   * 检测是否支持localStorage，且可用
   */
  checkSupport() {
    let isSupport = 'localStorage' in window && window.localStorage !== null;
    try {
      localStorage.setItem('local_storage_test', '1');
      localStorage.removeItem('local_storage_test');
      return isSupport;
    } catch (error) {
      return false;
    }
  }
  /**
   * 设置缓存时间，单位毫秒
   * @param maxAge nummber 缓存时间，单位毫秒, 不传的话认为没有过期时间
   */
  setMaxAge(maxAge: number = 0) {
    this.maxAgeTime = !maxAge ? 0 : this.getNowTimeStamp() + maxAge;
  }

  set(key: string, value: any, options?: SetOptions) {
    const customOptions: SetOptions = {
      ...this.defaultSetOptions,
      maxAge: this.maxAge,
      quotaStrategy: this.curQuotaStrategy,
      ...options,
    };
    let time = this.maxAgeTime;
    if (!customOptions.maxAge) {
      time = 0;
    } else {
      time = this.getNowTimeStamp() + customOptions.maxAge;
    }
    const keyName = this.getKey(key);
    const valueStr = this.stringify({
      time,
      tag: this.tag,
      value: value,
    });
    try {
      this.store.setItem(keyName, valueStr);
    } catch (e) {
      if (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        this.handleQuotaStrategy(customOptions.quotaStrategy);
      }
    }
  }

  get(key: string, tag?: string) {
    const keyName = this.getKey(key, tag);
    const info = this.store.getItem(keyName);
    if (!info) {
      return null;
    }
    const infoParse = this.parse(info);
    const timeStamp = this.getNowTimeStamp();
    // 没有设置过期时间，或者过期时间还没到
    if (!infoParse.time || infoParse.time > timeStamp) {
      return infoParse.value;
    }
    // 已过期就删除
    this.remove(key);
    return null;
  }
  remove(key: string, tagName?: string) {
    const keyName = this.getKey(key, tagName);
    this.removeByFullName(keyName);
  }
  removeByFullName(key: string) {
    this.store.removeItem(key);
  }
  clear() {
    this.store.clear();
  }

  clearAllByTag(tagName?: string) {
    const tag = tagName || this.tag;
    const length = this.store.length;
    for (let i = 0; i < length; i++) {
      const key = this.store.key(i);
      if (key) {
        const info = this.store.getItem(key);
        if (info && key.includes(tag)) {
          const infoParse = this.parse(info);
          if (infoParse.tag === tag) {
            this.removeByFullName(key);
          }
        }
      }
    }
  }
  /**
   * 当发生QuotaExceededError错误时执行的策略
   */
  handleQuotaStrategy(strategy?: quotaStrategy) {
    const curStrategy = strategy || this.curQuotaStrategy;
    const strategyMap = {
      [this.quotaStrategy.CLEAR_ALL]: () => {
        this.store.clear();
      },
      [this.quotaStrategy.CLEAR_ONLY_TAG]: () => {
        this.clearAllByTag();
      },
      [this.quotaStrategy.NONE]: () => {},
    };
    strategyMap[curStrategy]();
  }

  createInstance(options: MgStoreOptions) {
    return new MgStore(options);
  }
}

export default new MgStore();

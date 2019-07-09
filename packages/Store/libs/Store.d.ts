declare type quotaStrategy = 'CLEAR_ALL' | 'CLEAR_ONLY_TAG' | 'NONE';
interface MgStoreOptions {
  tag?: string;
  maxAge?: number;
  quotaStrategy?: quotaStrategy;
}
interface SetOptions {
  maxAge?: number;
  quotaStrategy?: quotaStrategy;
}
declare class MgStore {
  static version: string;
  protected quotaStrategy: {
    [key: string]: quotaStrategy;
  };
  private store;
  private tag;
  private maxAge;
  private maxAgeTime;
  private curQuotaStrategy;
  private defaultSetOptions;
  private defaultOptions;
  isSupport: boolean;
  constructor(options?: MgStoreOptions);
  private getKey;
  private stringify;
  private parse;
  getNowTimeStamp(): number;
  checkSupport(): boolean;
  setMaxAge(maxAge?: number): void;
  set(key: string, value: any, options?: SetOptions): void;
  get(key: string, tag?: string): any;
  remove(key: string, tagName?: string): void;
  removeByFullName(key: string): void;
  clear(): void;
  clearAllByTag(tagName?: string): void;
  handleQuotaStrategy(strategy?: quotaStrategy): void;
  createInstance(options: MgStoreOptions): MgStore;
}
declare const _default: MgStore;
export default _default;
//# sourceMappingURL=Store.d.ts.map

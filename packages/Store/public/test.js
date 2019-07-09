var obj = {
  a: 1,
  b: [1, 2, 4],
  c: {
    d: 1,
    e: [2, 3],
    f: {
      g: 1
    }
  }
};
console.group('group a');
mgStore.set('test1', obj);
var a = mgStore.get('test1', 'mgstore');
console.info(a);
console.groupEnd('group a');

console.group('group b');
mgStore.set('test1', obj, {
  maxAge: 20
});
var b = mgStore.get('test1', 'mgstore');
console.info(b);
setTimeout(() => {
  // var b = mgStore.get('test1', 'mgstore');
  // console.info(b);
}, 300);
console.groupEnd('group b');

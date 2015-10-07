class: center, middle

# 自己紹介
- Suguru Motegi @hollow_nage
- CyberAgent Inc.
- Noder

---

# Agenda

- Neo-Asyncとは
- 作ったモチベーション
- Neo-Asyncの特徴
- 作ってからの出来事
- まとめ

---

# Neo-Asyncとは
- Asyncに互換性があるnodeの非同期ライブラリ
- 弊社では主にゲーム部門で使われている
- dailyjsにも取り上げられた
  - http://dailyjs.com/2015/02/04/1369-node-roundup/
- star 245
- version 1.5.0

---

# 作ったモチベーション

---

## Asyncで可読性の高いコードを実現

```js
async1(function(err, result) {
  if (err) {
    return callback(err);
  }
  async2(result, function(err, result) {
    if (err) {
      return callback(err);
    }
    async3(result, function(err, result) {
      if (err) {
        return callback(err);
      }
      async4(result, function(err, result) {
        if (err) {
          return callback(err);
        }
        async5(result, function(err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, result);
        });
      });
    });
  });
});
```

```js
async.watarfall([
  async1,
  async2,
  async3,
  async4,
  async5
], function(err, result) {
  if (err) {
    return callback(err);
  }
  callback(null, result);
});
```

---

## 致命的なエラー(TypeError)

```js
var obj = {};
var iterator = function(value, done) {
 done();
};
async.each(obj.array, iterator, callback); // TypeError
               ↑ undefined
```

---

## 致命的なエラー(stack overflow)

- iteratorが同期呼び出しされると
```js
var array = _.range(10000); // [0, 1, 2, ...., 9999];
var syncIterator = function(value, done) {
  done();
};
async.eachSeries(array, syncIterator, callback); // stack overflow (RangeError)
```

---

## Asyncの問題
- issue、PRが放置されている
- メンテされていない

---

## 夜中に起きたくない

---

# Neo-Asyncの特徴

---

## 速度

---

### ベンチマーク比較
- func-comparator
  - インライン展開を考慮したベンチマークツール

|function|v0.10.40|v0.12.7|v4.1.2|
|---|---|---|---|
|waterfall|8.24|7.38|9.11|
|parallel|7.83|5.66|4.58|
|series|4.69|3.29|4.11|
|parallelLimit|3.77|2.95|2.64|
|each|1.88|1.98|2.38|
|eachSeries|2.23|1.81|2.23|
|eachLimit|2.05|1.82|2.00|
|concat|12.7|6.67|7.17|

-

---

### forEach

```js
var array = [0, 1, 2];
var iterator = function(value, index) {
  console.log(index, value);
};
array.forEach(iterator);
```

```js
function forEach(array, iterator) {
  var i = -1;
  var size = array.length;
  while (++i < size) {
    iterator(array[i], i);
  }
}

var array = [0, 1, 2];
var iterator = function(value, index) {
  console.log(index, value);
};
forEach(array, iterator);
```

---

### Arrayの初期化

```js
var i = -1;
var size = 100;
var array = [];
while (++i < size) {
  array.push(i);
}
```

```js
var i = -1;
var size = 100;
var array = Array(size); // [undefined, undefined, ...., undefined];
while (++i < size) {
  array[i] = i;
}
```

---

### call vs apply

```js
return func.apply(self, args);
```

```js
switch (args.length) {
  case 0:
  case 1:
    return func.call(self, done);
  case 2:
    return func.call(self, args[1], done);
  case 3:
    return func.call(self, args[1], args[2], done);
  case 4:
    return func.call(self, args[1], args[2], args[3], done);
  case 5:
    return func.call(self, args[1], args[2], args[3], args[4], done);
  case 6:
    return func.call(self, args[1], args[2], args[3], args[4], args[5], done);
  default:
    return func.apply(self, args);
}
```

---

### nextTick, setImmediate
- v0.10はsetImmediate、v0.12はnextTick

```js
async.nextTick = /^v0.10/.test(process.version) ? _setImmediate : process.nextTick;

var sync = true;
var iterator = function(done) {
  done();
};
var iterate = function() {
  iterator(function() {
    if (sync) {
      async.nextTick(iterate);
    } else {
      sync = true;
      iterate();
    }
    sync = false;
  });
};
iterate();
sync = false;
```

---

## 安全性

---

### TypeErrorが発生しない
- async@0.9.2

```js
async.each = function (arr, iterator, callback) {
    callback = callback || function () {};
    if (!arr.length) { // ← ココ
        return callback();
    }
    var completed = 0;
    _each(arr, function (x) {
        iterator(x, only_once(done) );
    });
    function done(err) {
      if (err) {
          callback(err);
          callback = function () {};
      }
      else {
          completed += 1;
          if (completed >= arr.length) {
              callback();
          }
      }
    }
};
```
---

### nextTick/setImmediate
- series系のstack overflowを避ける

---

### カバレッジ

```bash
➜  neo-async git:(master) npm test

  954 passing (18s)

=============================== Coverage summary ===============================
Statements   : 99.9% ( 2990/2993 )
Branches     : 96.23% ( 1556/1617 )
Functions    : 100% ( 467/467 )
Lines        : 99.9% ( 2990/2993 )
================================================================================
```

---

## 高機能

---

### Objectがまわせる

```js
var obj = { a: 1, b: 2, c: 3 };
var result = [];
var iterator = function(value, done) {
  result.push(value);
  done();
};
async.each(obj, iterator, function(err) {
 console.log(result); // [1, 2, 3]
});
```

- asyncは1系で対応済み

---

### 第二引数にkeyを取ることもできる

```js
var obj = { a: 1, b: 2, c: 3 };
var result = [];
var iterator = function(value, key, done) {
  result.push(key);
  done();
};
async.each(obj, iterator, function(err) {
 console.log(result); // ['a', 'b', 'c'];
});
```

---

### Asyncの使えないfunctionが使い物になる
- filter/reject/detect/some/every

```js
var obj = { a: 1, b: 2, c: 3 };
var result = [];
var iterator = function(value, done) {
    done(b === 2);
};
async.filter(obj, iterator, function(result) {
   console.log(result); // ['b'];
});
```

```js
var obj = { a: 1, b: 2, c: 3 };
var result = [];
var iterator = function(value, done) {
  done(null, b === 2);
};
async.filter(obj, iterator, function(err, result) {
 console.log(result); // ['b'];
});
```
---

### Asyncに無い便利なfunctionがある
- mapValues / mapValuesSeries / mapValuesLimit
- pick / pickSeries / pickLimit
- transform / transfomSeries/ transformLimit
- sortBySeries / sortByLimit
- someSeries
- everySeries
- concatLimit
- angelFall

---

## 互換性
- 後方互換性がある
- 1行変えるだけでOK

```bash
$ npm install neo-async
$ ln -s ./node_modules/neo-async ./node_modules/async
```

```js
var async = require('async');
```

```bash
$ npm install neo-async
```

```js
var async = require('neo-async');
```

---

# 作ってからの出来事
- 1pixelに投稿
  - http://ameblo.jp/ca-1pixel/entry-11982484688.html
- dailyjsに取り上げられる(by HAKASHUNさん)
  - http://dailyjs.com/2015/02/04/1369-node-roundup/
- 社内でNeo-Asyncが使い始められる
  - AsyncでRangeErrorが発生し急遽Neo-Asyncに移行したプロジェクトも
  - 現在では7プロジェクトで使われている
- 海外からもissueやPRが少しずつ来るようになった
- 英語ができなくて劣等感を感じる
- 来月から海外行ってきます

---

# まとめ
- 速くて安全でかつ高機能！
- Async使ってる人はNeo-Asyncに変えましょう！
- Asyncの時代はもう少し続くのでまだまだ良くしていきます！
- もっと早くなる書き方知ってる方はPRください！

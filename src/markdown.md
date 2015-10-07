class: center, middle

# Neo-Async

---

# 自己紹介

.col-6.fs-m[
- Suguru Motegi .fs-s[[@hollow_nage](https://twitter.com/hollow_nage)]
- CyberAgent Inc.
- Noder
]

.col-2[
<img src="img/hakuryu.png" width="100%" />
]

---

# Agenda

1. いろはに
2. ほへと
3. ちりぬるを

---

# Neo-Asyncとは

.center[![logo](img/logo.png)]

---

# Neo-Asyncとは

- asyncに互換性があるnodeの非同期ライブラリ
- 弊社では主にゲーム部門で使われている
- dailyjsにも取り上げられた
  - .fs-s[http://dailyjs.com/2015/02/04/1369-node-roundup/]
- Star .fc-yellow[245]
- version 1.5.0

---

class: center, middle, inverse

# 作ったモチベーション

---

# 作ったモチベーション

- asyncで可読性の高いコードを実現
- 致命的なエラー
    - TypeError
    - StackOverflow
- async本家の問題
- 夜中に起きたくない

---

## asyncで可読性の高いコードを実現

.col-5[
コールバック地獄
```javascript
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
        })
      })
    })
  })
});
```
]

.col-3[
asyncスタイルで可読性UP
```javascript
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
]
---

## 致命的なエラー(TypeError)

ここに文章を入れる

```javascript
var obj = {};
var iterator = function(value, done) {
 done();
};
async.each(obj.array, iterator, callback); // TypeError
               ↑ undefined
```

---

## 致命的なエラー(StackOverflow)

ここに文章を入れる

```javascript
var array = _.range(10000); // [0, 1, 2, ...., 9999];
var syncIterator = function(value, done) {
  done();
};
async.eachSeries(array, syncIterator, callback); // stack overflow (RangeError)
```

---

## async本家の問題

- issue、PRが放置されている
- メンテされていない

---

## 夜中に起きたくない

---

class: center, middle, inverse

# Neo-Asyncの特徴

---

# Neo-Asyncの特徴

- 速度
- 安全性
- 高機能
- 互換性

---

class: center, middle, inverse

# 速度

---

## ベンチマーク比較


- func-comparator
  - インライン展開を考慮したベンチマークツール
- node 0.10 / 0.12 / 4.1.2で取り直したい

|function|v0.10.40|v0.12.7|v2.3.4|
|---|---|---|---|
|parallel|4.13|5.00|3.37|
|series|3.13|2.70|3.03|
|parallelLimit|2.69|2.96|2.49|
|waterfall|3.45|7.24|7.59|

---
## forEach

```javascript
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
array.forEach(iterator);
forEach(array, iterator);
```
---

## Arrayの初期化

```javascript
var i = -1;
var size = 100;
var array = [];
while (++i < size) {
  array.push(i);
}

var i = -1;
var size = 100;
var array = Array(size); // [undefined * size];
while (++i < size) {
  array[i] = i;
}
```
---
## call, apply, bind

- 100回で比較してもやはりcallのほうが速い

```javascript
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
    return func.apply(null, args);
}
```
---
## nextTick, setImmediate

- v0.10はsetImmediate、v0.12はnextTick

```javascript
var sync = true;
var iterator = function(done) {
  done();
};
var iterate = function() {
  iterator(function() {
    if (sync) {
      process.nextTick(iterate);
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

class: center, middle, inverse

# 安全性

---

## TypeErrorが発生しない

async本家のコード

```javascript
async.each = function (arr, iterator, callback) {
    callback = callback || function () {};
*    if (!arr.length) {
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

## nextTick/setImmediate

- series系のStackOverflowを避ける

---

## カバレッジ

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

class: center, middle, inverse

# 高機能

---

## Objectがまわせる

- asyncは1系で最近対応された

```javascript
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

---

## 第二引数にkeyを取ることもできる

```javascript
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

## asyncの使えないfunctionが使い物になる

- filter/reject/detect/some/every


```javascript
var obj = { a: 1, b: 2, c: 3 };
var result = [];
var iterator = function(value, done) {
  done(b === 2);
};
async.filter(obj, iterator, function(result) {
 console.log(result); // ['b'];
});

//

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

## asyncに無いfunctionがある

- mapValues / mapValuesSeries / mapValuesLimit
- pick / pickSeries / pickLimit
- transform / transfomSeries/ transformLimit
- sortBySeries / sortByLimit
- someSeries
- everySeries
- concatLimit
- angelFall

---

class: center, middle, inverse

# 互換性

---

## 後方互換性がある

- asyncを使ってる人は以下でOK

```bash
$ npm install neo-async
$ ln -s ./node_modules/neo-async ./node_modules/async
```

```js
var async = require('async');
```

- 新しくneo-asyncを使う時は

```bash
$ npm install neo-async
```

```js
var async = require('neo-async');
```
---

class: center, middle, inverse

# 作ってから...

---

## 普及活動

- 1pixel(社内技術ブログ)に投稿
  - .fs-s[[http://ameblo.jp/ca-1pixel/entry-11982484688.html](http://ameblo.jp/ca-1pixel/entry-11982484688.html)]
- dailyjsに取り上げられる
  - .fs-s[[http://dailyjs.com/2015/02/04/1369-node-roundup/](http://dailyjs.com/2015/02/04/1369-node-roundup/)]
---

## 使われ始める

- 社内でneo-asyncが使い始められる
  - asyncでRangeErrorが発生し急遽neo-asyncに移行したプロジェクトも
  - 現在では7プロジェクトで使われている
- 海外からもissueやPRが少しずつ来るようになった

---

## 英語への危機感が募る...

- OSS活動で英語ができない劣等感を感じる...
- なんとか英語ができるようになりたい...

.fs-l.fw-b[
来月から1年間<br>海外(カナダ)行ってきます
]

---

# まとめ

- Neo-Asyncは速くて安全でかつ高機能！
- async使ってる人はNeo-Asyncに変えましょう！
- asyncの時代はもう少し続くのでまだまだ良くしていきます！
- もっと早くなる書き方知ってる方はPRでください！

---

class: center, middle, inverse

# Thanks!

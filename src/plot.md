class: center, middle

# 自己紹介
- Suguru Motegi @hollow_nage
- CyberAgent Inc.
- Noder

---

# Agenda

---

# neo-asyncとは
- asyncに互換性があるnodeの非同期ライブラリ
- 弊社では主にゲーム部門で使われている
- dailyjsにも取り上げられた
  - http://dailyjs.com/2015/02/04/1369-node-roundup/
- star 245
- version 1.5.0

---

# 作ったモチベーション

---

## asyncで可読性の高いコードを実現
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-callback-js

---

## 致命的なエラー(TypeError)
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-typeerror-js

---

## 致命的なエラー(stack overflow)
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-stackoverflow-js

---

## async本家の問題
- issue、PRが放置されている
- メンテされていない

---

## 夜中に起きたくない

---

# neo-asyncの特徴

---

## 速度

---

### ベンチマーク比較
- func-comparator
  - インライン展開を考慮したベンチマークツール
- node 0.10 / 0.12 / 4.1.2で取り直したい

---

### forEach
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-foreach-js

---

### Arrayの初期化
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-array-js

---

### call, apply, bind
- https://github.com/suguru03/neo-async/blob/master/lib/async.js#L7803-L7820
- 100回で比較してもやはりcallのほうが速い

---

### nextTick, setImmediate
- v0.10はsetImmediate、v0.12はnextTick
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-nexttick-js

---

## 安全性

---

### TypeErrorが発生しない
- https://github.com/caolan/async/blob/0.9.2/lib/async.js#L117

---

### nextTick/setImmediate
- series系のstack overflowを避ける

---

### カバレッジ
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-coverage-js

---

## 高機能

---

### Objectがまわせる
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-object-js
- asyncは1系で対応済み

---

### 第二引数にkeyを取ることもできる
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-objectkey-js

---

### asyncの使えないfunctionが使い物になる
- filter/reject/detect/some/every
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-filter-js

---

### asyncに無いfunctionがある
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
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-repace1-js
- https://gist.github.com/suguru03/9ad2dcc7fb40e0da1327#file-replace2-js

---

# 作ってからの出来事
- 1pixelに投稿
  - http://ameblo.jp/ca-1pixel/entry-11982484688.html
- dailyjsに取り上げられる(by HAKASHUNさん)
  - http://dailyjs.com/2015/02/04/1369-node-roundup/
- 社内でneo-asyncが使い始められる
  - asyncでRangeErrorが発生し急遽neo-asyncに移行したプロジェクトも
  - 現在では7プロジェクトで使われている
- 海外からもissueやPRが少しずつ来るようになった
- 英語ができなくて劣等感を感じる
- 来月から海外行ってきます

---

# まとめ
- 速くて安全でかつ高機能！
- async使ってる人はneo-asyncに変えましょう！
- asyncの時代はもう少し続くのでまだまだ良くしていきます！
- もっと早くなる書き方知ってる方はPRでください！

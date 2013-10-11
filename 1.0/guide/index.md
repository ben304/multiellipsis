## 综述

MultiEllipsis 是基于 KISSY 的支持多行文本自动缩略的工具，支持自定义缩略符。

* 版本：1.0
* 作者：筱谷`<xiaogu.gxb@taobao.com>`
* demo：[http://gallery.kissyui.com/multiellipsis/1.0/demo/index.html](http://gallery.kissyui.com/multiellipsis/1.0/demo/index.html)


## 使用前提
  1. 元素已经插入文档流；
  2. 元素不能隐藏；
  3. 内联(inline)元素必需在参数(config.height)或属性(data-ks-height)中指定高度；
  4. 建议先写 CSS overflow: hidden，否则组件执行时会出现瞬间跳动，另外可以避免 IE 下高度读取不正确的 bug
  5. 组件不会处理元素宽度溢出，需自行设置 word-break/word-wrap/white-space 预先换行

## 快速使用

    <div id="J_Main"><span id="J_Inner">这是很长的多行字符这是很长的多行字符</span></div>

    S.use('gallery/multiellipsis/1.0/index', function (S, multiEllipsis) {
         // multiEllipsis 是一个接受参数的函数
         // multiEllipsis(element, config)
         
         // 计算元素高度，并直接裁剪该元素
         multiEllipsis("#J_Inner", {
             ...   : ...
         });

         // 或者，计算父元素高度，裁剪子元素
         multiEllipsis("#J_Main", {
             child : "#J_Inner"
             ...   : ...
         });
    })


## 参数说明

* **height**: `[String]` `default: 样式计算高度` 自定义高度；包含 padding，内联元素必须指定；优先读取元素上的 data-ks-height 属性

* **child**: `[String]` `default: ""` 子元素选择器字符串；如果不为空，则裁剪符合这个选择器的第一个元素；优先读取 data-ks-child

* **interval**: `[Number]` `default: 5` 每次截取间隔；一般越大速度越快，但精度降低；优先读取 data-ks-interval

* **endHTML**: `[String]` `default: …` 省略字符；注意此处如有浮动相对定位等样式可能影响高度判断；优先读取 data-ks-endhtml

* **exact**: `[Bollean]` `default: false` 是否强制精确度；当 interval 过大的可强制精确度，一般可设为 false；优先读取 data-ks-exact

* **keepLine**: `[Bollean]` `default: false` 是否保留换行；优先读取 data-ks-keepline

* **setTitle**: `[Bollean]` `default: false` 是否将 title 属性设置为原文本；优先读取 data-ks-settitle


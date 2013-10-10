/*
  @fileoverview 支持多行的文本截断
  @desc 一般用于过长内容隐藏并加省略号等自定义后缀，支持主流浏览器(IE6&+...)
  @author 筱谷<xiaogu.gxb@taobao.com>
*/

/*
  使用前提：
    1. 元素已经插入文档流；
    2. 元素不能设置隐藏

  注意事项：
    1. 参数 height 包括 padding，对应 KISSY 的 innerHeight
    2. 内联(inline)元素必需在参数(config.height)或属性(data-ks-height)中指定高度；
    3. 建议先写 CSS overflow: hidden，否则在 IE 下会有高度读取不正确的 bug

  使用栗子：
  <div id="J_Main"><span id="J_Inner">这是很长的多行字符这是很长的多行字符</span></div>

  KISSY.use "multiellipsis", (S, ME)->
    ME "#J_Inner",
      ...   : ...

  或者：
  KISSY.use "multiellipsis", (S, ME)->
    ME "#J_Main",
      child : "#J_Inner"
      ...   : ...

  默认配置
  Config =
    height      : 0       # 可选、自定义 inner 高度，优先读取 data-ks-height 属性
    interval    : 5       # 间隔，一般越大速度越快，但精度降低，优先读取 data-ks-interval
    endHTML     : "..."   # 省略字符，注意此处如有浮动相对定位等样式可能影响高度判断，优先读取 data-ks-endhtml
    exact       : false   # 当 interval 过大的可强制精确度，一般可设为 false，优先读取 data-ks-exact
    child       : ""      # 子元素选择器字符串：鉴于 text() 的特殊性，上面允许设置为 text node 的上一层元素，然后这里裁剪子元素；优先读取 data-ks-child
    keepLine    : false   # 是否保留换行，优先读取 data-ks-keepline
    setTitle    : false   # 是否将 title 属性设置为原文本，优先读取 data-ks-settitle
*/

KISSY.add(function(S, Node) {
  var $, Config, multiEllipsis, _ellipsis;
  $ = Node.all;
  Config = {
    height: 0,
    interval: 5,
    endHTML: "...",
    exact: false,
    child: "",
    keepLine: false,
    setTitle: false
  };
  multiEllipsis = function(el, config) {
    var els, _i, _len, _results;
    config = S.merge(Config, config);
    els = $(el);
    if (!els || !els.length) {
      return;
    }
    _results = [];
    for (_i = 0, _len = els.length; _i < _len; _i++) {
      el = els[_i];
      _results.push(_ellipsis(el, config));
    }
    return _results;
  };
  _ellipsis = function(el, config) {
    var end, len, sub, text, textEl;
    el = $(el);
    config = {
      height: el.attr("data-ks-height") || config.height || el.innerHeight(),
      interval: el.attr("data-ks-interval") || config.interval,
      endHTML: el.attr("data-ks-endhtml") || config.endHTML,
      exact: el.attr("data-ks-exact") || config.exact,
      child: el.attr("data-ks-child") || config.child,
      keepLine: el.attr("data-ks-keepline") || config.keepLine,
      setTitle: el.attr("data-ks-settitle") || config.setTitle
    };
    if (config.child) {
      textEl = el.one(config.child);
    } else {
      textEl = el;
    }
    config.text = textEl.attr("data-ks-text") || el.attr("data-ks-text") || textEl.text();
    if (el.css('display') === "inline") {
      el.css('overflow', 'visible');
      el.scrollHeightFunc = el.innerHeight;
    } else {
      el.scrollHeightFunc = function() {
        return el[0].scrollHeight;
      };
    }
    if (!config.keepLine) {
      config.text = config.text.replace(/[\r\n]/ig, "");
    }
    el.show();
    if (el.scrollHeightFunc() <= config.height) {
      return;
    }
    text = config.text;
    end = config.endHTML;
    len = text.length;
    textEl.html(text + end);
    while (el.scrollHeightFunc() > config.height && len >= 0) {
      text = text.substring(0, len - config.interval);
      len -= config.interval;
      textEl.html(text + end);
    }
    if (config.exact) {
      sub = 0;
      while (el.scrollHeightFunc() <= config.height && sub < config.text.length - len) {
        text = config.text.substring(0, len + sub++);
        textEl.html(text + end);
      }
      textEl.html(config.text.substring(0, len + sub - 2) + end);
    }
    if (config.setTitle) {
      textEl.attr('title', config.text);
    }
    if (el.scrollHeightFunc() > config.height) {
      return S.log("Failed");
    }
  };
  return multiEllipsis;
}, {
  requires: ['node']
});

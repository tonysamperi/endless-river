EndlessRiver
============

A **jQuery** content scroller!

# Index

  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [License](#license)

# Introduction

**Endless river** is a jQuery plugin, that animates content and make it scroll endlessly!

The usefull feature is that you don't have to set widths to elements, because speed is set in pixel/second!!

EndlessRiver will calculate the best width for the &lt;li&gt; element and keep speed constant!

# Requirements

The only requirement needed is [jQuery](https://jquery.com/download/) that you can install it via [Bower](http://bower.io/).

# Usage

Simply include the endlessRiver JS and CSS
```html
<html>
    <head>
        <script type="text/javascript" src="path-to/js/endlessRiver.js"></script>
        <link type="text/css" rel="stylesheet" href="path-to/css/endlessRiver.css" />
    </head>
</html>
```
Create an &lt;ul&gt; list like this
```html
<ul id="myUl">
    <li> | </li>
    <li style="color: red">Espresso</li>
    <li style="color: orange">Cappuccino</li>
    <li style="color: yellow">American</li>
    <li style="color: green">Tea</li>
    <li style="color: black">Milk</li>
    <li style="color: blue">Juice</li>
    <li> | </li>
</ul>
```
and call it like this!

```javascript
$(document).ready(function(){
    $("#myUl").endlessRiver();
});
```
**Params**

|**option**|**description**|**type** |**default**|
| -------- | -------- | -------- | -------- |
|speed|Speed of animations in pixel/second|Number|100|
|pause|Pause on hover: if true, scrolling will stop on mouseover|Boolean|true|
|buttons|If true, shows play/stop buttons|Boolean|false|

# License

Check out LICENSE file (MIT)
'use strict';
var Apollo = require('../utils/Apollo.js');
var Utils = {};

/*
---
name: delegate
description: delagate event
arguments: [Element, String, String, Function]
...
*/
Utils.delegate = function(elem, className, evt, callback) {
    elem.addEventListener(evt, function(e) {
        var _target = e.target;
        while(_target != elem) {
            if(Apollo.hasClass(_target, className)){
                callback.call(_target, e);
                break;
            }
            _target = _target.parentNode;
        }
    });
};

module.exports = Utils;
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddons = require('react/addons');

var _NotificationListenMixin = require('./NotificationListenMixin');

var _NotificationListenMixin2 = _interopRequireDefault(_NotificationListenMixin);

var _NotificationLog = require('./NotificationLog');

var _NotificationLog2 = _interopRequireDefault(_NotificationLog);

var CSSTransitionGroup = _reactAddons.addons.CSSTransitionGroup;

var NotificationCenter = _react2['default'].createClass({
  displayName: 'NotificationCenter',

  propTypes: {
    iconTagClose: _react2['default'].PropTypes.element,
    iconTagImportant: _react2['default'].PropTypes.element,
    iconTagUnImportant: _react2['default'].PropTypes.element,
    iconTagNext: _react2['default'].PropTypes.element,
    logButtonText: _react2['default'].PropTypes.string,
    messages: _react2['default'].PropTypes.array,
    onClickLogButton: _react2['default'].PropTypes.func,
    onComplete: _react2['default'].PropTypes.func,
    showLogButton: _react2['default'].PropTypes.bool
  },
  mixins: [_NotificationListenMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      iconTagClose: _react2['default'].createElement('i', { className: 'fa fa-times-circle-o fa-3x' }),
      iconTagImportant: _react2['default'].createElement('i', { className: 'fa fa-exclamation-triangle fa-3x' }),
      iconTagNext: _react2['default'].createElement('i', { className: 'fa fa-long-arrow-right fa-2x' }),
      iconTagUnImportant: _react2['default'].createElement('i', { className: 'fa fa-check-circle-o fa-3x' }),
      messages: []
    };
  },

  componentWillMount: function componentWillMount() {
    this.store.setFromProps(this.props.messages);
  },

  onClickComplete: function onClickComplete(item) {
    this.store.setComplete(item.id);
    if (this.props.onComplete) {
      this.props.onComplete(item);
    }
  },

  onClickLogButton: function onClickLogButton() {
    if (this.props.onClickLogButton) {
      this.props.onClickLogButton();
    }
    this.store.toggleLog(false);
  },

  renderCloseIcon: function renderCloseIcon(notification) {
    var iconTag = undefined;
    if (notification.important && notification.count > 1) {
      iconTag = _react2['default'].createElement(
        'div',
        null,
        this.props.iconTagNext,
        _react2['default'].createElement(
          'span',
          null,
          notification.count
        )
      );
    } else {
      iconTag = this.props.iconTagClose;
    }
    return iconTag;
  },

  renderNotification: function renderNotification(notification) {
    var importanceIconTag = notification.important ? this.props.iconTagImportant : this.props.iconTagUnImportant;
    var key = notification.important ? 'important' : notification.id;
    return _react2['default'].createElement(
      'div',
      { key: key, className: 'notification' },
      _react2['default'].createElement(
        'div',
        { className: 'notification--wrap' },
        _react2['default'].createElement(
          'div',
          { className: 'notification--left' },
          importanceIconTag
        ),
        _react2['default'].createElement(
          'div',
          { className: 'notification--content' },
          notification.text
        ),
        _react2['default'].createElement(
          'div',
          {
            className: 'notification--right',
            onClick: this.onClickComplete.bind(this, notification)
          },
          this.renderCloseIcon(notification)
        )
      )
    );
  },

  renderNotificationLog: function renderNotificationLog() {
    return _react2['default'].createElement(_NotificationLog2['default'], {
      key: 'log',
      iconTagImportant: this.props.iconTagImportant,
      items: this.store.getNotificationsLog(),
      onClickLogButton: this.onClickLogButton,
      logButtonText: this.props.logButtonText,
      showLogButton: this.props.showLogButton
    });
  },

  render: function render() {
    var _this = this;

    var items = this.store.getUnImportantNotifications().map(function (item) {
      return _this.renderNotification(item);
    });
    if (this.state.showLog) {
      items.push(this.renderNotificationLog());
    } else {
      var importantItem = this.store.getImportantNotificationsGroup();
      if (importantItem) {
        items.push(this.renderNotification(importantItem));
      }
    }

    return _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement(
        CSSTransitionGroup,
        { transitionName: 'notification' },
        items
      )
    );
  }
});

exports['default'] = NotificationCenter;
module.exports = exports['default'];

},{"./NotificationListenMixin":4,"./NotificationLog":5,"react":undefined,"react/addons":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _NotificationListenMixin = require('./NotificationListenMixin');

var _NotificationListenMixin2 = _interopRequireDefault(_NotificationListenMixin);

var NotificationCounter = _react2['default'].createClass({
  displayName: 'NotificationCounter',

  propTypes: {
    iconTag: _react2['default'].PropTypes.element
  },

  mixins: [_NotificationListenMixin2['default']],
  getDefaultProps: function getDefaultProps() {
    return {
      iconTag: _react2['default'].createElement('i', { className: 'fa fa-bell-o fa-lg' })
    };
  },

  onClick: function onClick() {
    this.store.toggleLog();
  },

  render: function render() {
    var className = (0, _classnames2['default'])({
      'notification-counter': true,
      __active: this.state.showLog
    });
    return _react2['default'].createElement(
      'div',
      { onClick: this.onClick, className: className },
      this.props.iconTag,
      _react2['default'].createElement(
        'div',
        { className: 'notification-counter--value' },
        this.store.countNotifications()
      )
    );
  }
});

exports['default'] = NotificationCounter;
module.exports = exports['default'];

},{"./NotificationListenMixin":4,"classnames":undefined,"react":undefined}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _notificationStore = require('./notificationStore');

var _notificationStore2 = _interopRequireDefault(_notificationStore);

var NotificationListenMixin = {
  getInitialState: function getInitialState() {
    this.store = _notificationStore2['default'];
    return this.store.getState();
  },

  componentWillMount: function componentWillMount() {
    this.nstore = this.store.on('update', this.onCheckStore);
  },

  componentWillUnmount: function componentWillUnmount() {
    this.store.removeListener('update', this.onCheckStore);
  },

  onCheckStore: function onCheckStore(state) {
    this.setState(state);
  }
};

exports['default'] = NotificationListenMixin;
module.exports = exports['default'];

},{"./notificationStore":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var propTypes = {
  iconTagImportant: _react2['default'].PropTypes.element.isRequired,
  items: _react2['default'].PropTypes.array.isRequired,
  logButtonText: _react2['default'].PropTypes.string,
  onClickLogButton: _react2['default'].PropTypes.func,
  showLogButton: _react2['default'].PropTypes.bool
};

var defaultProps = {
  logButtonText: 'Notifications Log'
};

var NotificationLog = (function (_React$Component) {
  _inherits(NotificationLog, _React$Component);

  function NotificationLog() {
    _classCallCheck(this, NotificationLog);

    _get(Object.getPrototypeOf(NotificationLog.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(NotificationLog, [{
    key: 'onClickLogButton',
    value: function onClickLogButton() {
      if (this.props.onClickLogButton) {
        this.props.onClickLogButton();
      }
    }
  }, {
    key: 'renderItem',
    value: function renderItem(i) {
      return _react2['default'].createElement(
        'div',
        { key: i.id, className: 'notification-log--item notification __type_log' },
        _react2['default'].createElement(
          'div',
          { className: 'notification--wrap' },
          _react2['default'].createElement(
            'div',
            { className: 'notification--left' },
            this.props.iconTagImportant
          ),
          _react2['default'].createElement(
            'div',
            { className: 'notification--content' },
            i.text
          ),
          _react2['default'].createElement(
            'div',
            { className: 'notification--right' },
            i.date
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var items = this.props.items.map(function (i) {
        return _this.renderItem(i);
      });
      var viewAllButton = this.props.showLogButton ? _react2['default'].createElement(
        'div',
        { onClick: this.props.onClickLogButton, className: 'notification-log--btn' },
        this.props.logButtonText
      ) : _react2['default'].createElement('div', null);
      return _react2['default'].createElement(
        'div',
        { className: 'notification-log' },
        items,
        viewAllButton
      );
    }
  }]);

  return NotificationLog;
})(_react2['default'].Component);

NotificationLog.propTypes = propTypes;
NotificationLog.defaultProps = defaultProps;
exports['default'] = NotificationLog;
module.exports = exports['default'];

},{"react":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var NotificationStore = (function (_EventEmitter) {
  _inherits(NotificationStore, _EventEmitter);

  function NotificationStore() {
    var _this = this;

    _classCallCheck(this, NotificationStore);

    _get(Object.getPrototypeOf(NotificationStore.prototype), 'constructor', this).call(this);
    this.timer = null;
    this.timeout = 1000 * 3;
    this.state = {
      messages: [],
      showLog: false
    };
    this.on('update', function () {
      return _this.startTick();
    });
  }

  _createClass(NotificationStore, [{
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'setFromProps',
    value: function setFromProps(messages) {
      var addedIds = this.state.messages.map(function (notification) {
        return notification.id;
      });
      var newMessages = messages.reduce(function (arr, current) {
        if (addedIds.indexOf(current.id) === -1) {
          arr.push(current);
        }
        return arr;
      }, []);
      if (newMessages.length > 0) {
        var updatedMessages = this.state.messages.concat(newMessages);
        this.state.messages = updatedMessages;
        this.emit('update', this.state);
        return true;
      }
      return false;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(data) {
      this.state.messages.push(data);
      this.emit('update', this.state);
    }
  }, {
    key: 'startTick',
    value: function startTick(currentItemId) {
      var _this2 = this;

      if (this.timer && currentItemId === undefined) return;

      var notComplete = this.getUnImportantNotifications();
      if (notComplete.length === 0) return;

      var nextItemId = notComplete[0].id;
      if (this.timer && currentItemId !== undefined) {
        this.timer = null;
        if (nextItemId === currentItemId) {
          this.setComplete(nextItemId);
        }

        this.startTick();
      } else {
        this.timer = setTimeout(function () {
          return _this2.startTick(nextItemId);
        }, this.timeout);
      }
    }
  }, {
    key: 'setComplete',
    value: function setComplete(id) {
      this.state.messages.filter(function (item) {
        return item.id === id;
      }).forEach(function (item) {
        return item.complete = true;
      });
      this.emit('update', this.state);
    }
  }, {
    key: 'toggleLog',
    value: function toggleLog() {
      var value = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.getNotificationsLog().length === 0) return;
      var showLog = value !== null ? !!value : !this.state.showLog;
      this.state.showLog = showLog;
      if (showLog) {
        this.setImportantComplete();
      }
      this.emit('update', this.state);
    }
  }, {
    key: 'setImportantComplete',
    value: function setImportantComplete() {
      this.state.messages.filter(function (i) {
        return i.important;
      }).forEach(function (i) {
        return i.complete = true;
      });
    }
  }, {
    key: 'countNotifications',
    value: function countNotifications() {
      return this.getImportantNotifications().length;
    }
  }, {
    key: 'getUnImportantNotifications',
    value: function getUnImportantNotifications() {
      return this.state.messages.filter(function (i) {
        return !i.important && !i.complete;
      }).reverse();
    }
  }, {
    key: 'getImportantNotifications',
    value: function getImportantNotifications() {
      return this.state.messages.filter(function (i) {
        return i.important && !i.complete;
      });
    }
  }, {
    key: 'getImportantNotificationsGroup',
    value: function getImportantNotificationsGroup() {
      var importantList = this.getImportantNotifications();
      if (importantList.length === 0) return null;
      var firstItem = _extends({}, importantList[0]);
      firstItem.count = importantList.length;
      return firstItem;
    }
  }, {
    key: 'getNotificationsLog',
    value: function getNotificationsLog() {
      return this.state.messages.filter(function (i) {
        return i.important;
      }).reverse().slice(0, 5);
    }
  }]);

  return NotificationStore;
})(_events.EventEmitter);

var notificationStore = new NotificationStore();
exports['default'] = notificationStore;
module.exports = exports['default'];

},{"events":1}],"react-notification-center":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _NotificationLog = require('./NotificationLog');

var _NotificationLog2 = _interopRequireDefault(_NotificationLog);

var _NotificationCenterComponent = require('./NotificationCenterComponent');

var _NotificationCenterComponent2 = _interopRequireDefault(_NotificationCenterComponent);

var _NotificationCounter = require('./NotificationCounter');

var _NotificationCounter2 = _interopRequireDefault(_NotificationCounter);

var _NotificationListenMixin = require('./NotificationListenMixin');

var _NotificationListenMixin2 = _interopRequireDefault(_NotificationListenMixin);

var _notificationStore = require('./notificationStore');

var _notificationStore2 = _interopRequireDefault(_notificationStore);

exports['default'] = {
  NotificationCenter: _NotificationCenterComponent2['default'],
  NotificationCounter: _NotificationCounter2['default'],
  NotificationListenMixin: _NotificationListenMixin2['default'],
  NotificationLog: _NotificationLog2['default'],
  notificationStore: _notificationStore2['default']
};
module.exports = exports['default'];

},{"./NotificationCenterComponent":2,"./NotificationCounter":3,"./NotificationListenMixin":4,"./NotificationLog":5,"./notificationStore":6}]},{},[]);

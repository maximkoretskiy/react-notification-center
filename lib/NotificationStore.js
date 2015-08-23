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
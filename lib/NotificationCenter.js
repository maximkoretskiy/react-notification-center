'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
require('react/addons');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var classSet = React.addons.classSet;
var NotificationLog = require('./NotificationLog');

var NotificationStore = (function (_EventEmitter) {
  _inherits(NotificationStore, _EventEmitter);

  function NotificationStore() {
    _classCallCheck(this, NotificationStore);

    _get(Object.getPrototypeOf(NotificationStore.prototype), 'constructor', this).call(this);
    this.state = {
      messages: [],
      showLog: false
    };
  }

  _createClass(NotificationStore, [{
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(data) {
      this.state.messages.push(data);
      this.emit('update', this.state);
    }
  }, {
    key: 'setComplete',
    value: function setComplete(id) {
      var item = _.findWhere(this.state.messages, { id: id });
      item.complete = true;
      this.emit('update', this.state);
    }
  }, {
    key: 'toggleLog',
    value: function toggleLog() {
      this.state.showLog = !this.state.showLog;
      this.setImportantComplete();
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
      return _(this.state.messages).filter(function (i) {
        return i.important && !i.complete;
      }).size();
    }
  }, {
    key: 'getUnImportantNotifications',
    value: function getUnImportantNotifications() {
      return _(this.state.messages).filter(function (i) {
        return !i.important && !i.complete;
      }).reverse().value();
    }
  }, {
    key: 'getImportantNotifications',
    value: function getImportantNotifications() {
      var importantList = _(this.state.messages).filter(function (i) {
        return i.important && !i.complete;
      }).value();
      if (_.size(importantList)) {
        var importantItem = _.cloneDeep(importantList[0]);
        importantItem.count = _.size(importantList);
        return importantItem;
      }
      return null;
    }
  }, {
    key: 'getNotificationsLog',
    value: function getNotificationsLog() {
      return _(this.state.messages).filter(function (i) {
        return i.important;
      }).reverse().take(5).value();
    }
  }]);

  return NotificationStore;
})(EventEmitter);

var notificationStore = new NotificationStore();

exports.notificationStore = notificationStore;
var NotifiacationListenMixin = {
  getInitialState: function getInitialState() {
    return notificationStore.getState();
  },
  componentWillMount: function componentWillMount() {
    notificationStore.on('update', this.onCheckStore);
  },
  componentWillUnmount: function componentWillUnmount() {
    notificationStore.removeListener('update', this.onCheckStore);
  },
  onCheckStore: function onCheckStore(state) {
    this.setState(state);
  }
};

exports.NotifiacationListenMixin = NotifiacationListenMixin;
var NotificationCenter = React.createClass({
  displayName: 'NotificationCenter',

  mixins: [NotifiacationListenMixin],
  propTypes: {
    iconClose: React.PropTypes.string.isRequired,
    iconImportantClass: React.PropTypes.string.isRequired,
    iconNext: React.PropTypes.string.isRequired,
    iconUnImportantClass: React.PropTypes.string.isRequired,
    onClickLogButton: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    showLogButton: React.PropTypes.bool
  },
  onClickComplete: function onClickComplete(item) {
    notificationStore.setComplete(item.id);
    if (this.props.onComplete) {
      this.props.onComplete(item);
    }
  },

  renderCloseIcon: function renderCloseIcon(i) {
    if (i.important && i.count > 1) {
      return React.createElement(
        'div',
        null,
        React.createElement('i', { className: this.props.iconNext }),
        React.createElement(
          'span',
          null,
          i.count
        )
      );
    } else {
      return React.createElement('i', { className: this.props.iconClose });
    }
  },
  renderItem: function renderItem(i) {
    var importanceIconClass = i.important ? this.props.iconImportantClass : this.props.iconUnImportantClass;
    var key = i.important ? 'important' : i.id;
    return React.createElement(
      'div',
      { key: key, className: 'notification' },
      React.createElement(
        'div',
        { className: 'notification--left' },
        React.createElement('i', { className: importanceIconClass })
      ),
      React.createElement(
        'div',
        { className: 'notification--content' },
        i.text
      ),
      React.createElement(
        'div',
        { onClick: this.onClickComplete.bind(this, i), className: 'notification--right' },
        this.renderCloseIcon(i)
      )
    );
  },
  render: function render() {
    var _this = this;

    var items = notificationStore.getUnImportantNotifications().map(function (item) {
      return _this.renderItem(item);
    });
    if (this.state.showLog) {
      items.push(React.createElement(NotificationLog, { key: 'log',
        iconImportantClass: this.props.iconImportantClass,
        iconUnImportantClass: this.props.iconUnImportantClass,
        items: notificationStore.getNotificationsLog() }));
    } else {
      var importantItem = notificationStore.getImportantNotifications();
      if (importantItem) {
        items.push(this.renderItem(importantItem));
      }
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        CSSTransitionGroup,
        { transitionName: 'notification' },
        items
      )
    );
  }
});

exports.NotificationCenter = NotificationCenter;
var NotificationCounter = React.createClass({
  displayName: 'NotificationCounter',

  mixins: [NotifiacationListenMixin],
  propTypes: {
    iconClass: React.PropTypes.string
  },
  onClick: function onClick() {
    notificationStore.toggleLog();
  },
  render: function render() {
    var iconClass = 'notification-counter--icon ';
    if (this.props.iconClass) {
      iconClass += this.props.iconClass;
    }
    var className = classSet({
      'notification-counter': true,
      '__active': this.state.showLog
    });
    return React.createElement(
      'div',
      { onClick: this.onClick, className: className },
      React.createElement('i', { className: iconClass }),
      React.createElement(
        'div',
        { className: 'notification-counter--value' },
        notificationStore.countNotifications()
      )
    );
  }
});
exports.NotificationCounter = NotificationCounter;
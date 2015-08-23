'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddons = require('react/addons');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _NotificationListenMixin = require('./NotificationListenMixin');

var _NotificationListenMixin2 = _interopRequireDefault(_NotificationListenMixin);

var _NotificationLog = require('./NotificationLog');

var _NotificationLog2 = _interopRequireDefault(_NotificationLog);

var _Notification = require('./Notification');

var _Notification2 = _interopRequireDefault(_Notification);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

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
      iconTagClose: _react2['default'].createElement(_Icon2['default'], { size: 'm', name: 'ei-close' }),
      iconTagImportant: _react2['default'].createElement(_Icon2['default'], { size: 'm', name: 'ei-exclamation' }),
      iconTagNext: _react2['default'].createElement(_Icon2['default'], { size: 's', name: 'ei-arrow-right' }),
      iconTagUnImportant: _react2['default'].createElement(_Icon2['default'], { size: 'm', name: 'ei-check' }),
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

  renderNotification: function renderNotification(notification) {
    var isSingle = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    var isGrouped = notification.important && isSingle;
    var key = isGrouped ? 'important' : notification.id;

    return _react2['default'].createElement(_Notification2['default'], {
      key: key,
      iconTagImportant: this.props.iconTagImportant,
      iconTagUnImportant: this.props.iconTagUnImportant,
      iconTagNext: this.props.iconTagNext,
      iconTagClose: this.props.iconTagClose,
      data: notification,
      isSingle: isSingle,
      isAnimated: !!notification.count,
      onClickComplete: this.onClickComplete.bind(this, notification)
    });
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
        items.push(this.renderNotification(importantItem, true));
      }
    }

    return _react2['default'].createElement(
      'div',
      { className: 'notification-center' },
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
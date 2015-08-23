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

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var NotificationCounter = _react2['default'].createClass({
  displayName: 'NotificationCounter',

  propTypes: {
    iconTag: _react2['default'].PropTypes.element
  },

  mixins: [_NotificationListenMixin2['default']],
  getDefaultProps: function getDefaultProps() {
    return {
      iconTag: _react2['default'].createElement(_Icon2['default'], { size: 's', name: 'ei-bell' })
    };
  },

  onClick: function onClick() {
    this.store.toggleLog();
  },

  render: function render() {
    var count = this.store.countNotifications();
    var className = (0, _classnames2['default'])({
      'notification-counter': true,
      __active: this.state.showLog,
      __has_items: !!count
    });
    return _react2['default'].createElement(
      'div',
      { onClick: this.onClick, className: className },
      _react2['default'].createElement(
        'span',
        { className: 'notification-counter--icon' },
        this.props.iconTag
      ),
      _react2['default'].createElement(
        'span',
        { className: 'notification-counter--value' },
        count ? count : ''
      )
    );
  }
});

exports['default'] = NotificationCounter;
module.exports = exports['default'];
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

var _Notification = require('./Notification');

var _Notification2 = _interopRequireDefault(_Notification);

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
    key: 'renderNotification',
    value: function renderNotification(notification) {
      return _react2['default'].createElement(_Notification2['default'], {
        key: notification.id,
        iconTagImportant: this.props.iconTagImportant,
        iconTagUnImportant: this.props.iconTagUnImportant,
        iconTagNext: this.props.iconTagNext,
        iconTagClose: this.props.iconTagClose,
        data: notification,
        isSingle: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var items = this.props.items.map(function (i) {
        return _this.renderNotification(i);
      });

      if (this.props.viewAllButton) {
        items.push(_react2['default'].createElement(
          'div',
          { onClick: this.props.onClickLogButton, className: 'notification-log--btn' },
          this.props.logButtonText
        ));
      }
      return _react2['default'].createElement(
        'div',
        { className: 'notification-log notification-log--item\'' },
        items
      );
    }
  }]);

  return NotificationLog;
})(_react2['default'].Component);

NotificationLog.propTypes = propTypes;
NotificationLog.defaultProps = defaultProps;
exports['default'] = NotificationLog;
module.exports = exports['default'];
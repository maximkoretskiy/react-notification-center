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

var _reactAddons = require('react/addons');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var CSSTransitionGroup = _reactAddons.addons.CSSTransitionGroup;

var propTypes = {
  isSingle: _react2['default'].PropTypes.bool,
  isAnimated: _react2['default'].PropTypes.bool,
  data: _react2['default'].PropTypes.object.isRequired,
  onClickComplete: _react2['default'].PropTypes.func
};

function defaultProps() {
  return {
    isSingle: true,
    isAnimated: false
  };
}

var Notification = (function (_React$Component) {
  _inherits(Notification, _React$Component);

  function Notification() {
    _classCallCheck(this, Notification);

    _get(Object.getPrototypeOf(Notification.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Notification, [{
    key: 'renderText',
    value: function renderText() {
      var textElement = _react2['default'].createElement('div', {
        key: -this.props.data.id,
        className: 'notification--text',
        dangerouslySetInnerHTML: { __html: this.props.data.text }
      });

      return _react2['default'].createElement(
        'div',
        { className: 'notification--cnt' },
        this.props.isAnimated ? _react2['default'].createElement(
          CSSTransitionGroup,
          {
            transitionName: 'ntf-slide',
            className: 'notification--anim'
          },
          textElement
        ) : textElement
      );
    }
  }, {
    key: 'renderRight',
    value: function renderRight() {
      var iconTag = undefined;
      var notification = this.props.data;
      if (!this.props.isSingle) {
        return notification.date;
      }
      if (notification.important && notification.count > 1) {
        iconTag = _react2['default'].createElement(
          'div',
          { className: 'notification--next' },
          this.props.iconTagNext,
          _react2['default'].createElement(
            'div',
            { className: 'notification--count' },
            notification.count
          )
        );
      } else {
        iconTag = _react2['default'].createElement(
          'div',
          { className: 'notification--close' },
          this.props.iconTagClose
        );
      }
      return iconTag;
    }
  }, {
    key: 'render',
    value: function render() {
      var className = (0, _classnames2['default'])({
        'notification-log--item': !this.props.isSingle,
        notification: true,
        __type_item: this.props.isSingle,
        __type_log: !this.props.isSingle
      });
      var data = this.props.data;
      return _react2['default'].createElement(
        'div',
        { className: className },
        _react2['default'].createElement(
          'div',
          { className: 'notification--wrap' },
          _react2['default'].createElement(
            'div',
            { className: 'notification--left' },
            data.important ? this.props.iconTagImportant : this.props.iconTagUnImportant
          ),
          this.renderText(),
          _react2['default'].createElement(
            'div',
            {
              onClick: this.props.onClickComplete,
              className: 'notification--right' },
            this.renderRight()
          )
        )
      );
    }
  }]);

  return Notification;
})(_react2['default'].Component);

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

exports['default'] = Notification;
module.exports = exports['default'];
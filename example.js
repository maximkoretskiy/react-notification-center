require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Debug = require('./Debug');

var _Debug2 = _interopRequireDefault(_Debug);

var _TestForm = require('./TestForm');

var _TestForm2 = _interopRequireDefault(_TestForm);

var _reactNotificationCenter = require('react-notification-center');

var App = _react2['default'].createClass({
  displayName: 'App',

  mixins: [_reactNotificationCenter.NotificationListenMixin],
  onSubmitForm: function onSubmitForm(data) {
    if (this.messageLastId === undefined) {
      this.messageLastId = 10;
    }

    data.date = new Date().toTimeString().split(' ')[0];
    data.id = this.messageLastId++;
    this.store.addMessage(data);
  },

  render: function render() {
    return _react2['default'].createElement(
      'div',
      { className: 'line' },
      _react2['default'].createElement(_TestForm2['default'], { onSubmit: this.onSubmitForm }),
      _react2['default'].createElement(_Debug2['default'], { data: this.state })
    );
  }
});

exports['default'] = App;
module.exports = exports['default'];

},{"./Debug":2,"./TestForm":3,"react":undefined,"react-notification-center":undefined}],2:[function(require,module,exports){
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
  data: _react2['default'].PropTypes.object
};

var DebugView = (function (_React$Component) {
  _inherits(DebugView, _React$Component);

  function DebugView() {
    _classCallCheck(this, DebugView);

    _get(Object.getPrototypeOf(DebugView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DebugView, [{
    key: 'render',
    value: function render() {
      var json = JSON.stringify(this.props.data, null, ' ');
      return _react2['default'].createElement('pre', {
        className: 'debugger',
        dangerouslySetInnerHTML: { __html: json }
      });
    }
  }]);

  return DebugView;
})(_react2['default'].Component);

DebugView.propTypes = propTypes;

exports['default'] = DebugView;
module.exports = exports['default'];

},{"react":undefined}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var propTypes = {
  onSubmit: _react2['default'].PropTypes.func.isRequired
};

var TestForm = _react2['default'].createClass({
  displayName: 'TestForm',

  getInitialState: function getInitialState() {
    return {
      important: true,
      text: ''
    };
  },

  onSubmit: function onSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }

    this.props.onSubmit(this.state);
    this.setState({ text: '' });
  },

  onTextChange: function onTextChange(e) {
    this.setState({ text: e.target.value });
  },

  onCheckChange: function onCheckChange(e) {
    this.setState({ important: e.target.checked });
  },

  render: function render() {
    return _react2['default'].createElement(
      'form',
      { onSubmit: this.onSubmit },
      _react2['default'].createElement('input', { type: 'text',
        value: this.state.text,
        onChange: this.onTextChange,
        placeholder: 'Введите текст сообщения' }),
      _react2['default'].createElement(
        'label',
        null,
        _react2['default'].createElement('input', { type: 'checkbox',
          onChange: this.onCheckChange,
          checked: this.state.important
        }),
        'Важное'
      ),
      _react2['default'].createElement('input', { type: 'submit', value: 'Добавить' })
    );
  }
});

TestForm.propTypes = propTypes;

exports['default'] = TestForm;
module.exports = exports['default'];

},{"react":undefined}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

var _stub = require('./stub');

var _stub2 = _interopRequireDefault(_stub);

var _reactNotificationCenter = require('react-notification-center');

var onComplete = function onComplete(message) {
    return console.log('Message is complete', message);
};
var onClickLog = function onClickLog() {
    return console.log('Log button was clicked');
};

_react2['default'].render(_react2['default'].createElement(_App2['default'], null), document.getElementById('app'));

_react2['default'].render(_react2['default'].createElement(_reactNotificationCenter.NotificationCenter, {
    onComplete: onComplete,
    onClickLogButton: onClickLog,
    showLogButton: true,
    messages: _stub2['default']
}), document.getElementById('notification-center'));
_react2['default'].render(_react2['default'].createElement(_reactNotificationCenter.NotificationCounter, null), document.getElementById('notification-counter'));

},{"./App":1,"./stub":5,"react":undefined,"react-notification-center":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var messages = [{
  id: 1,
  text: 'Отсюда естественно следует, что стиль менеджмента решительно отталкивает формирование имиджа.',
  time: '22.06.1987',
  important: true
}, {
  id: 2,
  text: 'Селекция бренда тормозит конвергентный диктат потребителя, оптимизируя бюджеты.',
  time: '23.06.1987',
  important: false
}, {
  id: 3,
  text: 'Управление брендом, пренебрегая деталями, программирует потребительский SWOT-анализ.',
  time: '24.06.1987',
  important: true
}, {
  id: 4,
  text: 'Перераспределение бюджета существенно концентрирует повторный контакт, опираясь на опыт западных коллег.',
  time: '25.06.1987',
  important: true
}, {
  id: 5,
  text: 'Каждая сфера рынка, безусловно, существенно позиционирует фирменный стиль. Искусство медиапланирования специфицирует conversion rate, отвоевывая свою долю рынка.',
  time: '26.06.1987',
  important: false
}, {
  id: 6,
  text: 'Сопротивление концентрирует социометрический фронт.',
  time: '29.06.1987',
  important: true
}, {
  id: 7,
  text: 'Рекламная кампания все еще интересна для многих.',
  data: '22.06.1987',
  important: true
}];

exports['default'] = messages;
module.exports = exports['default'];

},{}]},{},[4]);

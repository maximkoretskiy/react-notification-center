'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var React = require('react');

exports['default'] = React.createClass({
  displayName: 'NotificationLog',

  propTypes: {
    iconImportantClass: React.PropTypes.string.isRequired,
    iconUnImportantClass: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    logButtonText: React.PropTypes.string,
    onClickLogButton: React.PropTypes.func,
    showLogButton: React.PropTypes.bool
  },
  renderItem: function renderItem(i) {
    var importanceIconClass = i.important ? this.props.iconImportantClass : this.props.iconUnImportantClass;
    return React.createElement(
      'div',
      { key: i.id, className: 'notification-log--item notification __type_log' },
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
        { className: 'notification--right' },
        i.date
      )
    );
  },
  render: function render() {
    var _this = this;

    var items = this.props.items.map(function (i) {
      return _this.renderItem(i);
    });
    var logButtonText = this.props.logButtonText || 'История уведомлений';
    var viewAllButton = this.props.showLogButton ? React.createElement(
      'div',
      { onClick: this.props.onClickLogButton, className: 'notification-log--btn' },
      logButtonText
    ) : React.createElement('div', null);
    return React.createElement(
      'div',
      { className: 'notification-log' },
      items,
      viewAllButton
    );
  }
});
module.exports = exports['default'];
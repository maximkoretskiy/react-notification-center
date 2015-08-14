require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _reactNotificationCenter = require('react-notification-center');

var React = require('react');

var TestForm = React.createClass({
  displayName: 'TestForm',

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
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
    return React.createElement(
      'form',
      { onSubmit: this.onSubmit },
      React.createElement('input', { type: 'text',
        value: this.state.text,
        onChange: this.onTextChange,
        placeholder: 'Введите текст сообщения' }),
      React.createElement(
        'label',
        null,
        React.createElement('input', { type: 'checkbox',
          onChange: this.onCheckChange,
          checked: this.state.important }),
        'Важное'
      ),
      React.createElement('input', { type: 'submit', value: 'Добавить' })
    );
  }
});

var DebugView = React.createClass({
  displayName: 'DebugView',

  render: function render() {
    var json = JSON.stringify(this.props.data, null, ' ');
    return React.createElement('pre', {
      className: 'debugger',
      dangerouslySetInnerHTML: { __html: json } });
  }
});

var App = React.createClass({
  displayName: 'App',

  mixins: [_reactNotificationCenter.NotifiacationListenMixin],
  onSubmitForm: function onSubmitForm(data) {
    if (this.messageLastId === undefined) {
      this.messageLastId = 0;
    }
    data.date = new Date().toTimeString().split(' ')[0];
    data.id = this.messageLastId++;
    _reactNotificationCenter.notificationStore.addMessage(data);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'line' },
      React.createElement(TestForm, { onSubmit: this.onSubmitForm }),
      React.createElement(DebugView, { data: this.state })
    );
  }
});

var onComplete = function onComplete(message) {
  console.log('Message is complete', message);
};

React.render(React.createElement(App, null), document.getElementById('app'));
React.render(React.createElement(_reactNotificationCenter.NotificationCenter, {
  iconImportantClass: 'fa fa-exclamation-triangle fa-3x',
  iconUnImportantClass: 'fa fa-check-circle-o fa-3x',
  iconClose: 'fa fa-times-circle-o fa-3x',
  iconNext: 'fa fa-long-arrow-right fa-2x',
  onComplete: onComplete }), document.getElementById('notification-center'));
React.render(React.createElement(_reactNotificationCenter.NotificationCounter, { iconClass: 'fa fa-bell-o fa-lg' }), document.getElementById('notification-counter'));

},{"react":undefined,"react-notification-center":undefined}]},{},[1]);

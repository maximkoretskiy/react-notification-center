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
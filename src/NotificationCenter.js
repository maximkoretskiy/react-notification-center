var React = require('react');
var Icon = require('react-evil-icons');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var NotificationStore = function(){
  this.state = {
    messages: [],
    mode: 'messages' // log/messages
  };
};
util.inherits(NotificationStore, EventEmitter);

NotificationStore.prototype.getState = function(){
  return this.state;
}

NotificationStore.prototype.addMessage = function(data){
  this.state.messages.push(data);
  this.emit('update');
}

var notificationStore = new NotificationStore;

var NotificationCenter = React.createClass({
  getInitialState(){
    return notificationStore.getState();
  },
  componentWillMount(){
    notificationStore.on('update', this.forceUpdate.bind(this));
  },
  componentWillUnmount(){
    notificationStore.removeListener('update', this.forceUpdate);
  },
  render () {
    return <div>Notification Center</div>;
  }
});
var NotificationCounter = React.createClass({
  getInitialState(){
    return notificationStore.getState();
  },
  componentWillMount(){
    notificationStore.on('update', this.forceUpdate.bind(this));
  },
  componentWillUnmount(){
    notificationStore.removeListener('update', this.forceUpdate);
  },
  render () {
    return <div className='notification-counter'>
      <div className='notification-counter--icon'></div>
      <div className='notification-counter--value'>{this.state.messages.length}</div>
    </div>;
  }
  
});

export var NotificationCenter;
export var NotificationCounter;
export var notificationStore;

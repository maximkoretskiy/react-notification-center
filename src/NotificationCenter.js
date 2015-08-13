var React = require('react');
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
    return <div className='notification'>
      <i className='notification--left fa fa-check-circle-o fa-3x'/>
      <div className='notification--content'> Notification Center </div>
      <div className='notification--right fa fa-times-circle-o fa-3x'></div>
    </div>;
  }
});
var NotificationCounter = React.createClass({
  propTypes: {
    iconClass: React.PropTypes.string
  },
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
    var iconClass = 'notification-counter--icon ';
    if(this.props.iconClass){
      iconClass += this.props.iconClass
    }
    return <div className='notification-counter'>
      <i className={iconClass}></i>
      <div className='notification-counter--value'>{this.state.messages.length}</div>
    </div>;
  }
  
});

export var NotificationCenter;
export var NotificationCounter;
export var notificationStore;

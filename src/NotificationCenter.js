var React = require('react');
var addons = require('react/addons');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

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
  this.emit('update', this.state);
}

var notificationStore = new NotificationStore;


var NotifiacationListenMixin = {
  getInitialState(){
    return notificationStore.getState();
  },
  componentWillMount(){
    notificationStore.on('update', this.onCheckStore);
  },
  componentWillUnmount(){
    notificationStore.removeListener('update', this.onCheckStore);
  },
  onCheckStore(state){
    this.setState(state);
  }
}

var NotificationCenter = React.createClass({
  mixins: [NotifiacationListenMixin],
  renderItem(i){
    return <div key={i.id} className='notification'>
      <i className='notification--left fa fa-check-circle-o fa-3x'/>
      <div className='notification--content'>{i.text}</div>
      <div className='notification--right fa fa-times-circle-o fa-3x'></div>
    </div>
  },
  render () {
    var items = this.state
      .messages
      .reverse()
      .map(i => this.renderItem(i));
    if(items.length == 0){
      return <div/>;
    }
    return <div>
      <CSSTransitionGroup transitionName='notification'>
        {items}
      </CSSTransitionGroup>
    </div>;
  }
});
var NotificationCounter = React.createClass({
  mixins: [NotifiacationListenMixin],
  propTypes: {
    iconClass: React.PropTypes.string
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
export var NotifiacationListenMixin;

var React = require('react');
require('react/addons');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var classSet = React.addons.classSet;
var NotificationLog = require('./NotificationLog');

class NotificationStore extends EventEmitter{
  constructor(){
    super();
    this.state = {
      messages: [],
      showLog: false
    };
  }
  getState(){
    return this.state;
  }
  addMessage(data){
    this.state.messages.push(data);
    this.emit('update', this.state);
  }
  setComplete(id){
    var item = _.findWhere(this.state.messages, {id});
    item.complete = true;
    this.emit('update', this.state);
  }
  toggleLog(){
    this.state.showLog = !this.state.showLog;
    this.setImportantComplete();
    this.emit('update', this.state);
  }
  setImportantComplete(){
    this.state.messages
      .filter(i => i.important)
      .forEach(i => i.complete = true);
  }
  countNotifications(){
    return _(this.state.messages)
      .filter(i => i.important && !i.complete)
      .size();
  }
  getUnImportantNotifications(){
    return _(this.state.messages)
      .filter(i => !i.important && !i.complete)
      .reverse()
      .value();
  }
  getImportantNotifications(){
    var importantList = _(this.state.messages)
      .filter(i => i.important && !i.complete)
      .value();
    if (_.size(importantList)){
      let importantItem = _.cloneDeep(importantList[0]);
      importantItem.count = _.size(importantList);
      return importantItem
    }
    return null;
  }
  getNotificationsLog(){
    return _(this.state.messages)
      .filter(i => i.important)
      .reverse()
      .take(5)
      .value();
  }
}

export var notificationStore = new NotificationStore();


export var NotifiacationListenMixin = {
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
};

export var NotificationCenter = React.createClass({
  mixins: [NotifiacationListenMixin],
  propTypes: {
    iconClose: React.PropTypes.string.isRequired,
    iconImportantClass: React.PropTypes.string.isRequired,
    iconNext: React.PropTypes.string.isRequired,
    iconUnImportantClass: React.PropTypes.string.isRequired,
    onClickLogButton: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    showLogButton: React.PropTypes.bool
  },
  onClickComplete(item){
    notificationStore.setComplete(item.id);
    if(this.props.onComplete){
      this.props.onComplete(item);
    }
  },

  renderCloseIcon(i){
    if(i.important && i.count > 1){
      return (
        <div>
          <i className={this.props.iconNext}/>
          <span>{i.count}</span>
        </div>
      );
    }else{
      return <i className={this.props.iconClose}/>;
    }
  },
  renderItem(i){
    var importanceIconClass = i.important ? this.props.iconImportantClass : this.props.iconUnImportantClass;
    var key = i.important ? 'important' : i.id;
    return (
      <div key={key} className='notification'>
        <div className='notification--left'>
          <i className={importanceIconClass}/>
        </div>
        <div className='notification--content'>{i.text}</div>
        <div onClick={this.onClickComplete.bind(this, i)} className='notification--right'>
          {this.renderCloseIcon(i)}
        </div>
      </div>
    );
  },
  render() {
    var items = notificationStore.getUnImportantNotifications()
      .map(item => this.renderItem(item));
    if(this.state.showLog){
      items.push(<NotificationLog key='log'
              iconImportantClass= {this.props.iconImportantClass}
              iconUnImportantClass= {this.props.iconUnImportantClass}
              items={notificationStore.getNotificationsLog()}/>);
    }else{
      let importantItem = notificationStore.getImportantNotifications()
      if(importantItem){
        items.push(this.renderItem(importantItem));
      }
    }
    return (
        <div>
        <CSSTransitionGroup transitionName='notification'>
          {items}
        </CSSTransitionGroup>
      </div>
    );
  }
});

export var NotificationCounter = React.createClass({
  mixins: [NotifiacationListenMixin],
  propTypes: {
    iconClass: React.PropTypes.string
  },
  onClick(){
    notificationStore.toggleLog();
  },
  render () {
    var iconClass = 'notification-counter--icon ';
    if(this.props.iconClass){
      iconClass += this.props.iconClass;
    }
    const className = classSet({
      'notification-counter': true,
      '__active': this.state.showLog
    });
    return (
      <div onClick={this.onClick} className={className}>
        <i className={iconClass}></i>
        <div className='notification-counter--value'>{notificationStore.countNotifications()}</div>
      </div>
    );
  }
});


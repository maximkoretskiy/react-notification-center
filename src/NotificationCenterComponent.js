import React from 'react';
import {addons} from 'react/addons';
import NotificationListenMixin from './NotificationListenMixin';
import NotificationLog from './NotificationLog';

const {CSSTransitionGroup} = addons;

const NotificationCenter = React.createClass({
  propTypes: {
    iconClose: React.PropTypes.string.isRequired,
    iconImportantClass: React.PropTypes.string.isRequired,
    iconNext: React.PropTypes.string.isRequired,
    iconUnImportantClass: React.PropTypes.string.isRequired,
    logButtonText: React.PropTypes.string,
    onClickLogButton: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    showLogButton: React.PropTypes.bool,
  },
  mixins: [NotificationListenMixin],

  onClickComplete(item) {
    this.store.setComplete(item.id);
    if (this.props.onComplete) {
      this.props.onComplete(item);
    }
  },

  renderCloseIcon(notification) {
    let iconTag;
    if (notification.important && notification.count > 1) {
      iconTag = (
        <div>
          <i className={this.props.iconNext}/>
          <span>{notification.count}</span>
        </div>
      );
    }else {
      iconTag = <i className={this.props.iconClose}/>;
    }
    return iconTag;
  },

  renderNotification(notification) {
    const importanceIconClass = notification.important ?
      this.props.iconImportantClass : this.props.iconUnImportantClass;
    const key = notification.important ? 'important' : notification.id;
    return (
      <div key={key} className="notification">
        <div className="notification--left">
          <i className={importanceIconClass}/>
        </div>
        <div className="notification--content">{notification.text}</div>
        <div
          className="notification--right"
          onClick={this.onClickComplete.bind(this, notification)}
        >
          {this.renderCloseIcon(notification)}
        </div>
      </div>
    );
  },

  renderNotificationLog() {
    return (<NotificationLog
              key="log"
              iconImportantClass= {this.props.iconImportantClass}
              iconUnImportantClass= {this.props.iconUnImportantClass}
              items={this.store.getNotificationsLog()}
              onClickLogButton={this.props.onClickLogButton}
              logButtonText={this.props.logButtonText}
              showLogButton={this.props.showLogButton}
            />);
  },

  render() {
    const items = this.store.getUnImportantNotifications()
      .map(item => this.renderNotification(item));
    if (this.state.showLog) {
      items.push(this.renderNotificationLog());
    } else {
      const importantItem = this.store.getImportantNotificationsGroup();
      if (importantItem) {
        items.push(this.renderNotification(importantItem));
      }
    }

    return (
        <div>
          <CSSTransitionGroup transitionName="notification">
            {items}
          </CSSTransitionGroup>
        </div>
    );
  },
});

export default NotificationCenter;

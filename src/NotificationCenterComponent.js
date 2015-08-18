import React from 'react';
import {addons} from 'react/addons';
import NotificationListenMixin from './NotificationListenMixin';
import NotificationLog from './NotificationLog';
import Icon from 'react-evil-icons';

const {CSSTransitionGroup} = addons;

const NotificationCenter = React.createClass({
  propTypes: {
    iconTagClose: React.PropTypes.element,
    iconTagImportant: React.PropTypes.element,
    iconTagUnImportant: React.PropTypes.element,
    iconTagNext: React.PropTypes.element,
    logButtonText: React.PropTypes.string,
    onClickLogButton: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    showLogButton: React.PropTypes.bool,
  },
  mixins: [NotificationListenMixin],

  getDefaultProps() {
    return {
      iconTagClose: <i className="fa fa-times-circle-o fa-3x" />,
      iconTagImportant: <i className="fa fa-exclamation-triangle fa-3x" />,
      iconTagNext: <i className="fa fa-long-arrow-right fa-2x" />,
      iconTagUnImportant: <i className="fa fa-check-circle-o fa-3x" />,
    };
  },

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
          {this.props.iconTagNext}
          <span>{notification.count}</span>
        </div>
      );
    }else {
      iconTag = this.props.iconTagClose;
    }
    return iconTag;
  },

  renderNotification(notification) {
    const importanceIconTag = notification.important ?
      this.props.iconTagImportant : this.props.iconTagUnImportant;
    const key = notification.important ? 'important' : notification.id;
    return (
      <div key={key} className="notification">
        <div className="notification--wrap">
          <div className="notification--left">
            {importanceIconTag}
          </div>
          <div className="notification--content">{notification.text}</div>
          <div
            className="notification--right"
            onClick={this.onClickComplete.bind(this, notification)}
          >
            {this.renderCloseIcon(notification)}
          </div>
        </div>
      </div>
    );
  },

  renderNotificationLog() {
    return (<NotificationLog
              key="log"
              iconTagImportant= {this.props.iconTagImportant}
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

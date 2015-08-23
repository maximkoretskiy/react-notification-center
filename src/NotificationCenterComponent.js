import React from 'react';
import {addons} from 'react/addons';
import classNames from 'classnames';
import NotificationListenMixin from './NotificationListenMixin';
import NotificationLog from './NotificationLog';
import Notification from './Notification';
import Icon from './Icon';

const {CSSTransitionGroup} = addons;

const NotificationCenter = React.createClass({
  propTypes: {
    iconTagClose: React.PropTypes.element,
    iconTagImportant: React.PropTypes.element,
    iconTagUnImportant: React.PropTypes.element,
    iconTagNext: React.PropTypes.element,
    logButtonText: React.PropTypes.string,
    messages: React.PropTypes.array,
    onClickLogButton: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    showLogButton: React.PropTypes.bool,
  },
  mixins: [NotificationListenMixin],

  getDefaultProps() {
    return {
      iconTagClose: <Icon size="m" name="ei-close"/>,
      iconTagImportant: <Icon size="m" name="ei-exclamation"/>,
      iconTagNext: <Icon size="s" name="ei-arrow-right"/>,
      iconTagUnImportant: <Icon size="m" name="ei-check"/>,
      messages: [],
    };
  },

  componentWillMount() {
    this.store.setFromProps(this.props.messages);
  },

  onClickComplete(item) {
    this.store.setComplete(item.id);
    if (this.props.onComplete) {
      this.props.onComplete(item);
    }
  },

  onClickLogButton() {
    if (this.props.onClickLogButton) {
      this.props.onClickLogButton();
    }
    this.store.toggleLog(false);
  },

  renderNotification(notification, isSingle=true) {
    const isGrouped = notification.important && isSingle;
    const key = (isGrouped) ? 'important' :  notification.id;

    return (
      <Notification
        key = {key}
        iconTagImportant = {this.props.iconTagImportant}
        iconTagUnImportant = {this.props.iconTagUnImportant}
        iconTagNext = {this.props.iconTagNext}
        iconTagClose = {this.props.iconTagClose}
        data={notification}
        isSingle={isSingle}
        isAnimated={!!notification.count}
        onClickComplete={this.onClickComplete.bind(this, notification)}
      />
    );
  },

  renderNotificationLog() {
    return (<NotificationLog
              key="log"
              iconTagImportant= {this.props.iconTagImportant}
              items={this.store.getNotificationsLog()}
              onClickLogButton={this.onClickLogButton}
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
        items.push(this.renderNotification(importantItem, true));
      }
    }

    return (
        <div className="notification-center">
          <CSSTransitionGroup transitionName="notification">
            {items}
          </CSSTransitionGroup>
        </div>
    );
  },
});

export default NotificationCenter;

import React from 'react';
import {addons} from 'react/addons';
import classNames from 'classnames';
import NotificationListenMixin from './NotificationListenMixin';
import NotificationLog from './NotificationLog';
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

  renderCloseIcon(notification) {
    let iconTag;
    if (notification.important && notification.count > 1) {
      iconTag = (
        <div className="notification--next">
          {this.props.iconTagNext}
          <div className="notification--count">{notification.count}</div>
        </div>
      );
    }else {
      iconTag = (
        <div className="notification--close">
          {this.props.iconTagClose}
        </div>
      );
    }
    return iconTag;
  },

  renderNotification(notification) {
    const key = notification.important ? 'important' : notification.id;
    const className = classNames({
      notification: true,
      __type_item: true,
    });
    return (
      <div key={key} className={className}>
        <div className="notification--wrap">
          <div className="notification--left">
              {
                notification.important ?
                this.props.iconTagImportant :
                this.props.iconTagUnImportant
              }
          </div>
          <div
            className="notification--cnt"
            dangerouslySetInnerHTML={{__html: notification.text}}
          />
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
        items.push(this.renderNotification(importantItem));
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

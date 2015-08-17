import React from 'react';
import {addons} from 'react/addons';
import classNames from 'classnames';
import NotificationListenMixin from './NotificationListenMixin';

const NotificationCounter = React.createClass({
  propTypes: {
    iconClass: React.PropTypes.string,
  },

  mixins: [NotificationListenMixin],
  onClick() {
    this.store.toggleLog();
  },

  render() {
    let iconClass = 'notification-counter--icon ';
    if (this.props.iconClass) {
      iconClass += this.props.iconClass;
    }

    const className = classNames({
      'notification-counter': true,
      __active: this.state.showLog,
    });
    return (
      <div onClick={this.onClick} className={className}>
        <i className={iconClass}></i>
        <div className="notification-counter--value">{this.store.countNotifications()}</div>
      </div>
    );
  },
});

export default NotificationCounter;

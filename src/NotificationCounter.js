import React from 'react';
import classNames from 'classnames';
import NotificationListenMixin from './NotificationListenMixin';
import Icon from './Icon';

const NotificationCounter = React.createClass({
  propTypes: {
    iconTag: React.PropTypes.element,
  },

  mixins: [NotificationListenMixin],
  getDefaultProps() {
    return {
      iconTag: <Icon size="s" name="ei-bell"/>,
    };
  },

  onClick() {
    this.store.toggleLog();
  },

  render() {
    const count = this.store.countNotifications();
    const className = classNames({
      'notification-counter': true,
      __active: this.state.showLog,
      __has_items: !!count,
    });
    return (
      <div onClick={this.onClick} className={className}>
        <span className="notification-counter--icon">{this.props.iconTag}</span>
        <span className="notification-counter--value">
          {count ? count : ''}
        </span>
      </div>
    );
  },
});

export default NotificationCounter;

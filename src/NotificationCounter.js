import React from 'react';
import {addons} from 'react/addons';
import classNames from 'classnames';
import NotificationListenMixin from './NotificationListenMixin';

const NotificationCounter = React.createClass({
  propTypes: {
    iconTag: React.PropTypes.element,
  },

  mixins: [NotificationListenMixin],
  getDefaultProps() {
    return {
      iconTag: <i className="fa fa-bell-o fa-lg"/>,
    };
  },

  onClick() {
    this.store.toggleLog();
  },

  render() {
    const className = classNames({
      'notification-counter': true,
      __active: this.state.showLog,
    });
    return (
      <div onClick={this.onClick} className={className}>
        {this.props.iconTag}
        <div className="notification-counter--value">{this.store.countNotifications()}</div>
      </div>
    );
  },
});

export default NotificationCounter;

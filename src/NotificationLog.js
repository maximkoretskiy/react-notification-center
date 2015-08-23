import React from 'react';
import Notification from './Notification';

const propTypes = {
  iconTagImportant: React.PropTypes.element.isRequired,
  items: React.PropTypes.array.isRequired,
  logButtonText: React.PropTypes.string,
  onClickLogButton: React.PropTypes.func,
  showLogButton: React.PropTypes.bool,
};

const defaultProps = {
  logButtonText: 'Notifications Log',
};


class NotificationLog extends React.Component {
  onClickLogButton() {
    if (this.props.onClickLogButton) {
      this.props.onClickLogButton();
    }
  }

  renderNotification(notification) {
    return (
      <Notification
        iconTagImportant = {this.props.iconTagImportant}
        iconTagUnImportant = {this.props.iconTagUnImportant}
        iconTagNext = {this.props.iconTagNext}
        iconTagClose = {this.props.iconTagClose}
        data={notification}
        isSingle={false}
      />
    );
  }

  render() {
    const items = this.props.items
      .map(i => this.renderNotification(i));

    if (this.props.viewAllButton) {
      items.push(
        <div onClick={this.props.onClickLogButton} className="notification-log--btn">
        {this.props.logButtonText}
      </div>
      );
    }
    return (
      <div className="notification-log notification-log--item'">
        {items}
      </div>
    );
  }
}

NotificationLog.propTypes = propTypes;
NotificationLog.defaultProps = defaultProps;
export default NotificationLog;

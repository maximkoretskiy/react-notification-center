import React from 'react';

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

  renderItem(i) {
    return (
      <div key={i.id} className="notification-log--item notification __type_log">
        <div className="notification--wrap">
          <div className="notification--left">
            {this.props.iconTagImportant}
          </div>
          <div
            className="notification--cnt"
            dangerouslySetInnerHTML={{__html: i.text}}
          />
          <div className="notification--right">{i.date}</div>
        </div>
      </div>
    );
  }

  render() {
    const items = this.props.items
      .map(i => this.renderItem(i));

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

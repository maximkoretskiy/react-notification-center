import React from 'react';
// import reactMixin from 'react-mixin';
import {addons} from 'react/addons';
import NotificationListenMixin from './NotificationListenMixin';
import NotificationLog from './NotificationLog';

const {CSSTransitionGroup} = addons;

// FIXME: classSet is deprecated

// class NotificationCenter extends NotificationListenMixin {
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

  renderCloseIcon(i) {
    let icon;
    if (i.important && i.count > 1) {
      icon = (
        <div>
          <i className={this.props.iconNext}/>
          <span>{i.count}</span>
        </div>
      );
    }else {
      icon = <i className={this.props.iconClose}/>;
    }
    return icon;
  },

  renderItem(i) {
    const importanceIconClass = i.important ? this.props.iconImportantClass : this.props.iconUnImportantClass;
    const key = i.important ? 'important' : i.id;
    return (
      <div key={key} className="notification">
        <div className="notification--left">
          <i className={importanceIconClass}/>
        </div>
        <div className="notification--content">{i.text}</div>
        <div
          className="notification--right"
          onClick={this.onClickComplete.bind(this, i)}
        >
          {this.renderCloseIcon(i)}
        </div>
      </div>
    );
  },

  render() {
    const items = this.store.getUnImportantNotifications()
      .map(item => this.renderItem(item));
    if (this.state.showLog) {
      items.push(<NotificationLog
              key="log"
              iconImportantClass= {this.props.iconImportantClass}
              iconUnImportantClass= {this.props.iconUnImportantClass}
              items={this.store.getNotificationsLog()}
              onClickLogButton={this.props.onClickLogButton}
              logButtonText={this.props.logButtonText}
              showLogButton={this.props.showLogButton}
              />);
    }else {
      const importantItem = this.store.getImportantNotificationsGroup();
      if (importantItem) {
        items.push(this.renderItem(importantItem));
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

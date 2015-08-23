import React from 'react';
import {addons} from 'react/addons';
import classNames from 'classnames';
const {CSSTransitionGroup} = addons;

const propTypes = {
  isSingle: React.PropTypes.bool,
  isAnimated: React.PropTypes.bool,
  data: React.PropTypes.object.isRequired,
  onClickComplete: React.PropTypes.func,
};

function defaultProps() {
  return {
    isSingle: true,
    isAnimated: false,
  };
}

class Notification extends React.Component {
  renderText() {
    const textElement = (
      <div
        key={-this.props.data.id}
        className="notification--text"
        dangerouslySetInnerHTML={{__html: this.props.data.text}}
      />
    );

    return (
      <div className="notification--cnt">
        {
          (this.props.isAnimated) ?
          (
            <CSSTransitionGroup
              transitionName="ntf-slide"
              className="notification--anim"
            >
              {textElement}
            </CSSTransitionGroup>
          ) :
          textElement
        }
      </div>
      );
  }

  renderRight() {
    let iconTag;
    const notification = this.props.data;
    if (!this.props.isSingle) {
      return notification.date;
    }
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
  }

  render() {
    const className = classNames({
      'notification-log--item': !this.props.isSingle,
      notification: true,
      __type_item: this.props.isSingle,
      __type_log: !this.props.isSingle,
    });
    const data = this.props.data;
    return (
      <div className={className}>
        <div className="notification--wrap">
          <div className="notification--left">
            {
              data.important ?
              this.props.iconTagImportant :
              this.props.iconTagUnImportant
            }
          </div>
          {this.renderText()}
          <div
            onClick={this.props.onClickComplete}
            className="notification--right">
            {this.renderRight()}
          </div>
        </div>
      </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

export default Notification;

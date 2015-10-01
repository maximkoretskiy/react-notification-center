import React from 'react';
import classNames from 'classnames';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  size: React.PropTypes.string.isRequired,
};

class Icon extends React.Component {

  render() {
    const rootClasses = classNames(
      'icon',
      `icon--${this.props.name}`,
      `icon--${this.props.size}`
    );
    const svgTag = `<svg class='icon__cnt'><use xlink:href='#${this.props.name}-icon' /></svg>`;
    return (
      <div
        className={rootClasses}
        dangerouslySetInnerHTML={{__html: svgTag}}
        />
      );
  }
}

Icon.propTypes = propTypes;

export default Icon;

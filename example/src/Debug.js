import React from 'react';

const propTypes = {
  data: React.PropTypes.object,
};

class DebugView extends React.Component {
  render() {
    const json = JSON.stringify(this.props.data, null, ' ');
    return (
      <pre
        className="debugger"
        dangerouslySetInnerHTML={{__html: json}}
      />
    );
  }
}

DebugView.propTypes = propTypes;

export default DebugView;

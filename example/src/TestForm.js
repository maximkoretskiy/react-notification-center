import React from 'react';

const propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
};

const TestForm = React.createClass({
  getInitialState() {
    return {
      important: true,
      text: '',
    };
  },

  onSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }

    this.props.onSubmit(this.state);
    this.setState({text: ''});
  },

  onTextChange(e) {
    this.setState({text: e.target.value});
  },

  onCheckChange(e) {
    this.setState({important: e.target.checked});
  },

  render() {
    return (
      <form
        className="form"
        onSubmit={this.onSubmit}
      >
        <div className="line">
          <h1>Add your notification!</h1>
          <input
            className="form--input"
            type="text"
            value={this.state.text}
            onChange={this.onTextChange}
            placeholder="Place your notification text here"/>
          <input
            type="submit"
            value="Add"
            className="btn"
            />
          <br />
          <label>
            <input type="checkbox"

              onChange={this.onCheckChange}
              checked={this.state.important}
            />
            Is important
          </label>
        </div>
      </form>
    );
  },
});

TestForm.propTypes = propTypes;

export default TestForm;

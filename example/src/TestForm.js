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
      <form onSubmit={this.onSubmit}>
        <input type="text"
          value={this.state.text}
          onChange={this.onTextChange}
          placeholder="Введите текст сообщения"/>

        <label>
          <input type="checkbox"
            onChange={this.onCheckChange}
            checked={this.state.important}
          />
          Важное
        </label>
        <input type="submit" value="Добавить"/>
      </form>
    );
  },
});

TestForm.propTypes = propTypes;

export default TestForm;

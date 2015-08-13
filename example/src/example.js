var React = require('react');
import {NotificationCenter, NotificationCounter, notificationStore} from 'react-notification-center';
var TestForm = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      important: true,
      text: ''
    };
  },
  onSubmit: function (e) {
    e.preventDefault()
    if (this.state.text.length == 0){
      return;
    }
    this.props.onSubmit(this.state);
    this.setState({text: ''});
  },
  onTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  onCheckChange: function(e) {
    this.setState({important: e.target.checked});
  },
  render: function() {
    return (
      <form onSubmit={this.onSubmit}>
        <input type='text' 
          value={this.state.text}
          onChange={this.onTextChange}
          placeholder='Введите текст сообщения'/>

        <label>
          <input type='checkbox' 
            onChange={this.onCheckChange} 
            checked={this.state.important} />
          Важное
        </label>
        <input type='submit' value='Добавить'/>
      </form>
    );
  }
});

var DebugView = React.createClass({
  render: function(){
    return <pre className='debugger' dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.data, null, ' ')}} ></pre>
  }
});

var App = React.createClass({
  getInitialState(){
    return notificationStore.getState()
  },
  componentWillMount(){
    notificationStore.on('update', this.forceUpdate.bind(this));
  },
  componentWillUnmount(){
    notificationStore.removeListener('update', this.forceUpdate);
  },
  onSubmitForm: function(data){
    data.date = (new Date).toTimeString().split(' ')[0]
    notificationStore.addMessage(data)
  },
  render () {
    return (
      <div className='line' >
        <TestForm onSubmit={this.onSubmitForm} />
        <DebugView data={this.state} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
React.render(<NotificationCenter />, document.getElementById('notification-center'));
React.render(<NotificationCounter iconClass='fa fa-bell-o fa-lg' />, document.getElementById('notification-counter'));

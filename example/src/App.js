import React from 'react';
import Debug from './Debug';
import TestForm from './TestForm';
import {NotificationListenMixin} from 'react-notification-center';

const  App = React.createClass({
  mixins: [NotificationListenMixin],
  onSubmitForm(data) {
    if (this.messageLastId === undefined) {
      this.messageLastId = 10;
    }

    data.date = new Date()
      .toTimeString()
      .split(' ')[0];
    data.id = this.messageLastId++;
    this.store.addMessage(data);
  },

  render() {
    return (
      <div className="line">
        <TestForm onSubmit={this.onSubmitForm} />
        <Debug data={this.state} />
      </div>
    );
  },
});

export default App;

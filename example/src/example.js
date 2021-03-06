import React from 'react';
import App from './App';
import messages from './stub';
import {NotificationCenter, NotificationCounter} from 'react-notification-center';


// TODO: add test for onComplete and onClickLogButton
/*eslint-disable */
const onComplete = message => console.log('Message is complete', message);
const onClickLog = ()=> console.log('Log button was clicked');
/*eslint-disable */

React.render(<App />, document.getElementById('app'));

React.render(<NotificationCenter
    onComplete={onComplete}
    onClickLogButton={onClickLog}
    showLogButton={false}
    messages={messages}
  />, document.getElementById('notification-center'));
React.render(<NotificationCounter/>, document.getElementById('notification-counter'));

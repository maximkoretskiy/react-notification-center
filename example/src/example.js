import React from 'react';
import App from './App';
import {NotificationCenter, NotificationCounter} from 'react-notification-center';

const onComplete = message => console.log('Message is complete', message);
const onClickLog = ()=> console.log('Log button was clicked');

React.render(<App />, document.getElementById('app'));
React.render(<NotificationCenter
    onComplete={onComplete}
    onClickLogButton={onClickLog}
    showLogButton={true}
  />, document.getElementById('notification-center'));
React.render(<NotificationCounter iconClass="fa fa-bell-o fa-lg" />, document.getElementById('notification-counter'));

import React from 'react';
import App from './App';
import {NotificationCenter, NotificationCounter} from 'react-notification-center';

const onComplete = message => console.log('Message is complete', message);
const onClickLog = ()=> console.log('Log button was clicked');

React.render(<App />, document.getElementById('app'));
React.render(<NotificationCenter
    iconImportantClass="fa fa-exclamation-triangle fa-3x"
    iconUnImportantClass="fa fa-check-circle-o fa-3x"
    iconClose="fa fa-times-circle-o fa-3x"
    iconNext="fa fa-long-arrow-right fa-2x"
    onComplete={onComplete}
    onClickLogButton={onClickLog}
    showLogButton={true}
  />, document.getElementById('notification-center'));
React.render(<NotificationCounter iconClass="fa fa-bell-o fa-lg" />, document.getElementById('notification-counter'));

import {EventEmitter} from 'events';

class NotificationStore extends EventEmitter {
  constructor() {
    super();
    this.timer = null;
    this.timeout = 1000 * 3;
    this.state = {
      messages: [],
      showLog: false,
    };
    this.on('update', ()=> this.startTick());
  }

  getState() {
    return this.state;
  }

  setFromProps(messages) {
    const addedIds = this.state.messages.map( notification => notification.id);
    const newMessages = messages.reduce((arr, current)=> {
      if (addedIds.indexOf(current.id) === -1) {
        arr.push(current);
      }
      return arr;
    }, []);
    if (newMessages.length > 0) {
      const updatedMessages = this.state.messages.concat(newMessages);
      this.state.messages = updatedMessages;
      this.emit('update', this.state);
      return true;
    }
    return false;
  }

  addMessage(data) {
    this.state.messages.push(data);
    this.emit('update', this.state);
  }

  startTick(currentItemId) {
    if (this.timer && currentItemId === undefined ) return;

    const notComplete = this.getUnImportantNotifications();
    if (notComplete.length === 0) return;

    const nextItemId = notComplete[0].id;
    if (this.timer && currentItemId !== undefined) {
      this.timer = null;
      if (nextItemId === currentItemId) {
        this.setComplete(nextItemId);
      }

      this.startTick();
    } else {
      this.timer = setTimeout( ()=> this.startTick(nextItemId),
        this.timeout);
    }
  }

  setComplete(id) {
    this.state.messages
      .filter(item => item.id === id)
      .forEach(item => item.complete = true);
    this.emit('update', this.state);
  }

  toggleLog(value = null) {
    if (this.getNotificationsLog().length === 0) return;
    const showLog = (value !== null) ? !!value : !this.state.showLog;
    this.state.showLog = showLog;
    if (showLog) {
      this.setImportantComplete();
    }
    this.emit('update', this.state);
  }

  setImportantComplete() {
    this.state.messages
      .filter(i => i.important)
      .forEach(i => i.complete = true);
  }

  countNotifications() {
    return this.getImportantNotifications().length;
  }

  getUnImportantNotifications() {
    return this.state.messages
      .filter(i => !i.important && !i.complete)
      .reverse();
  }

  getImportantNotifications() {
    return this.state.messages
      .filter(i => i.important && !i.complete);
  }

  getImportantNotificationsGroup() {
    const importantList = this.getImportantNotifications();
    if (importantList.length === 0) return null;
    const firstItem = Object.assign({}, importantList[0]);
    firstItem.count = importantList.length;
    return firstItem;
  }

  getNotificationsLog() {
    return this.state.messages
      .filter(i => i.important)
      .reverse()
      .slice(0, 5);
  }
}

const notificationStore = new NotificationStore();
export default notificationStore;


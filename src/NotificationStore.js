import {EventEmitter} from 'events';
import _ from 'lodash';

class NotificationStore extends EventEmitter {
  constructor() {
    super();
    this.timer = null;
    this.state = {
      messages: [],
      showLog: false,
    };
  }

  getState() {
    return this.state;
  }

  addMessage(data) {
    this.state.messages.push(data);
    this.startTick();
    this.emit('update', this.state);
  }

  startTick(currentItemId) {
    const notComplete = this.getUnImportantNotifications();
    if (notComplete.length) {
      const nextItemId = notComplete[0].id;
      if (this.timer && currentItemId) {
        this.timer = null;
        if (nextItemId === currentItemId) {
          this.setComplete(nextItemId);
        }

        this.startTick();
      }else if (this.timer) {
        return;
      } else {
        this.timer = setTimeout(this.startTick.bind(this, nextItemId), 3000);
      }
    }
  }

  setComplete(id) {
    const item = _.findWhere(this.state.messages, {id});
    item.complete = true;
    this.emit('update', this.state);
  }

  toggleLog() {
    if (this.getNotificationsLog().length === 0) {
      return;
    }

    this.state.showLog = !this.state.showLog;
    this.setImportantComplete();
    this.emit('update', this.state);
  }

  setImportantComplete() {
    this.state.messages
      .filter(i => i.important)
      .forEach(i => i.complete = true);
  }

  countNotifications() {
    return _(this.state.messages)
      .filter(i => i.important && !i.complete)
      .size();
  }

  getUnImportantNotifications() {
    return _(this.state.messages)
      .filter(i => !i.important && !i.complete)
      .reverse()
      .value();
  }

  getImportantNotifications() {
    const importantList = _(this.state.messages)
      .filter(i => i.important && !i.complete)
      .value();
    if (_.size(importantList)) {
      const importantItem = _.cloneDeep(importantList[0]);
      importantItem.count = _.size(importantList);
      return importantItem;
    }

    return null;
  }

  getNotificationsLog() {
    return _(this.state.messages)
      .filter(i => i.important)
      .reverse()
      .take(5)
      .value();
  }
}

const notificationStore = new NotificationStore();
export default notificationStore;


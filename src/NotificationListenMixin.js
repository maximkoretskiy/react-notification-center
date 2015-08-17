import notificationStore from './NotificationStore';

const NotificationListenMixin = {
  getInitialState() {
    this.store = notificationStore;
    return this.store.getState();
  },

  componentWillMount() {
    this.nstore = this.store.on('update', this.onCheckStore);
  },

  componentWillUnmount() {
    this.store.removeListener('update', this.onCheckStore);
  },

  onCheckStore(state) {
    this.setState(state);
  },
};

export default NotificationListenMixin;

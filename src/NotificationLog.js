var React = require('react');

export default React.createClass({
  propTypes: {
    iconImportantClass: React.PropTypes.string.isRequired,
    iconUnImportantClass: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
    logButtonText: React.PropTypes.string,
    onClickLogButton: React.PropTypes.func,
    showLogButton: React.PropTypes.bool
  },
  renderItem(i){
    var importanceIconClass = i.important ? this.props.iconImportantClass : this.props.iconUnImportantClass;
    return (
      <div key={i.id} className='notification-log--item notification __type_log'>
        <div className='notification--left'>
          <i className={importanceIconClass}/>
        </div>
        <div className='notification--content'>{i.text}</div>
        <div className='notification--right'>
          {i.date}
        </div>
      </div>
    );
  },
  render(){
    var items = this.props.items
      .map(i => this.renderItem(i));
    var logButtonText = this.props.logButtonText || 'История уведомлений';
    var viewAllButton = (this.props.showLogButton)?(
      <div onClick={this.props.onClickLogButton} className='notification-log--btn'>
        {logButtonText}
      </div>
    ):(
      <div/>
    );
    return (
      <div className='notification-log'>
        {items}
        {viewAllButton}
      </div>
    );
  }
});

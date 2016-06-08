import React, { Component, PropTypes } from 'react';
import { Card, Spin } from 'antd';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import styles from './NoticeContainer.less';


class NoticeListItem extends Component {

  render() {
    const item = this.props.item;
    const dateObj = new Date(item.create * 1000);
    return (
      <li><a>{item.title}{'('
        +dateObj.getFullYear()+'-'
        +(dateObj.getMonth()+1)+'-'
        +dateObj.getDate()+')'}</a></li>
    )
  }

}


class NoticeContainer extends Component {


  constructor(props){
    super(props)
    this.state = {};
    this.state.isLoading = true;
    this.state.title = props.title;
  }
  
  componentWillMount(){
    setTimeout( () => this.loadMore() , 1000)
  }  

  render() {

   let content;

   if( this.state.isLoading ){
     content = <Spin />
   } else if( this.state.data && this.state.data.length > 0 ){
     var items = [];
     this.state.data.forEach( item => {
       items.push( <NoticeListItem item={item} /> );
     } );
     content = <ul className={styles.notice_item_list}>{items}</ul>
   } else {
   }
   return (
     <Card title={this.state.title} className={styles.notice_container}>
       {content}
     </Card>     

    );
  }

  update(){
    console.log('call update');
    this.setState( this.state );
  }

  loadMore(){ 
    this.state.isLoading = false;
    this.state.data = [
      {
        title: 'HRD52关于“2016年人力资源部任职资格细则”之事宜',
        create: 1464753150  
      }   
    ];
    this.update();
  }
}

export default NoticeContainer;

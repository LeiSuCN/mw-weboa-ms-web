import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import styles from './MainLayout.less';
import { Menu, Icon } from 'antd';
const  SubMenu = Menu.SubMenu;

function changeView(menuItem ){
  console.log( menuItem );
  if( menuItem.key == '2' ){
    browserHistory.push('/notice/editor')
  } else {
    browserHistory.push('/');
  }
}


const MainLayout = ({ children }) => {
  return (
    <div className={styles.normal}>
      <div className={styles.head}>
        <h1>韵达</h1>
      </div>
      <div  className={styles.content + ' mwoa-menu-wraper'}>
      <Menu className={styles.side}
        onSelect={changeView}
        theme="dark"
        mode="vertical">
        <Menu.Item key="1"><Icon type="home"/>公告</Menu.Item>
        <Menu.Item key="2"><Icon type="home"/>发布</Menu.Item>
      </Menu>
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;

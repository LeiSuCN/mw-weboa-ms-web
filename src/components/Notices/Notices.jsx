import React, { Component, PropTypes } from 'react';
import { Row,Col } from 'antd';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import NoticeContainer  from './NoticeContainer';

class NoticesContainer extends Component {
  render() {
   return (
    <MainLayout>
      <Row>
        <Col span="8">
          <NoticeContainer title="通告通知" />
        </Col>
        <Col  span="8">
          <NoticeContainer title="通告通知" />
        </Col>
        <Col span="8">
          <NoticeContainer title="通告通知" />
        </Col>
      </Row>
    </MainLayout>
    );
  }
}

export default NoticesContainer;

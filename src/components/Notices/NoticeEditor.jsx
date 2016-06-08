import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Icon, Select, Radio,Upload, Row, Col,Spin } from 'antd';
import MainLayout from '../../layouts/MainLayout/MainLayout';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NoticeEditor extends Component {

  render() {
    return (
      <Form horizontal>
         <Row>
          <Col span="24">
            <FormItem
              label="主题"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
                <Input />
            </FormItem>
  	      </Col>
        </Row> 
        <Row>
          <Col span="12">
            <FormItem
              label="类别"
              labelCol={{span:2}}
              wrapperCol={{span:22}}>
              <Select showSearch notFoundContent="无法找到">
                <Option value="1">通知通告</Option>
                <Option value="2">通告通知</Option>
                <Option value="3">系统消息</Option>
              </Select>        
            </FormItem>
  	      </Col>
          <Col span="12">
            <FormItem
              label="部门"
              labelCol={{span:2}}
              wrapperCol={{span:22}}>
              <Select showSearch notFoundContent="无法找到">
                <Option value="1">财务</Option>
                <Option value="2">人事</Option>
                <Option value="3">IT</Option>
              </Select>        
            </FormItem>
          </Col>
        </Row> 
        <Row>
          <Col span="24">
            <div style={{ height: '20em', backgroundColor:'white'}}></div>
          </Col>
        </Row>
         <Row>
          <Col span="24">
             <FormItem
              label="附件"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <Upload>
                <Button type="ghost">
                  <Icon type="upload" />点击上传
               </Button>
              </Upload>
            </FormItem>
         </Col>
        </Row>
        <Row>
          <Col span="24">
             <FormItem
              label="重要度"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <RadioGroup>
                <Radio value="1">非常重要</Radio>
                <Radio value="2">重要</Radio>
                <Radio value="3">普通</Radio>
              </RadioGroup>
            </FormItem>
         </Col>
        </Row>
      </Form>
    )
  }
}

class NoticeEditorContainer extends Component {

  render() {
    return ( 
      <MainLayout>
        <NoticeEditor />
      </MainLayout>
    )
  }
}



export default NoticeEditorContainer;

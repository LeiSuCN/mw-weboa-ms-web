import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Icon, Select, Radio,Upload, Row, Col,Spin } from 'antd';
import ifetch from 'isomorphic-fetch';
import MainLayout from '../../layouts/MainLayout/MainLayout';



const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class NoticeEditor extends Component {

  constructor(props){
    super();
    this.state = {};
  }

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
   
    let titleProps = getFieldProps('title', {
      rules:[
        { required: true, min: 4, message: '标题至少为4个字'}
      ]
    });
    
    
    return (
      <Form horizontal form={this.props.form}>
         <Row>
          <Col span="24">
            <FormItem
              label="主题"
              labelCol={{span:1}}
              wrapperCol={{span:23}}
              hasFeedback>
                <Input {...titleProps} name='title' />
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
              <Upload action="http://mw-weboa.oss-cn-shenzhen.aliyuncs.com"  data={this.uploadFileWithKey.bind(this)} beforeUpload={this.getFileKey.bind(this)}  >
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
         <Row>
          <Col span="24">
             <FormItem
              label="有效期"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <InputNumber min={0} defaultValue={0} />天（为0或空则永远不过期）
            </FormItem>
         </Col>
        </Row>
        <Row>
          <Col span="24">
            <Button onClick={this.commit.bind(this)}   htmlType='submit'>提交</Button>
         </Col>
        </Row>
      </Form>
    )
  }

  uploadFileWithKey(file) {

    if( this.state.filetoken ){
      console.log( this.state.filetoken );
      this.state.filetoken.key = '123123123';
      return this.state.filetoken;
    }
  }

  getFileKey(file) {

    if( this.state.filetoken ) {
      return true;
    } else{
    return new Promise( (resolve, reject) => {
      //ifetch('//file.weboa.leisucn.com/token/upload',{mode:'cors'}).then(
      ifetch('//localhost:38080/token/upload',{mode:'cors'}).then(
        resp => {
          let json = resp.json();
          if( json && json.then ){
            json.then( _json => { this.setFileToken(_json); resolve() } );
          } else if( json ){
            this.setFileToken(json);
            resolve();
          }
        } 
      )
   })}
  }

  setFileToken(resp){
    if( !this.state.filetoken ) this.state.filetoken = {};
    this.state.filetoken["success_action_status"] = 200;
    this.state.filetoken.policy = resp.policy;
    this.state.filetoken.OSSAccessKeyId = resp.accessid;
    this.state.filetoken.signature =resp.signature;
  }

  commit(e){
    e.preventDefault();
    let form = this.props.form;
    form.validateFields( (errors, values) => {
      console.log( errors )
      console.log( values )
    })
  }

  builderOrder() {


  }
}

NoticeEditor = Form.create()(NoticeEditor); 

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

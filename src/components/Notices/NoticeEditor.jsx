import React, { Component, PropTypes } from 'react';
import { Form, Input, InputNumber, Button, Icon, Select, Radio,Upload, Row, Col,Spin } from 'antd';
import ifetch from 'isomorphic-fetch';
import {Editor, EditorState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import styles from './NoticeEditor.less';



const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class NoticeEditor extends Component {

  constructor(props){
    super(props);
    this.state = {};
    this.state.editorState = EditorState.createEmpty();
  }

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
   
    let titleProps = getFieldProps('title', {
      rules:[
        { required: true, min: 4, message: '标题至少为4个字'}
      ]
    });

    let cateProps = getFieldProps('category', {
      rules:[
        { required: true, message: '请选择类别'}
      ]
    });

     let receiverProps = getFieldProps('receiver', {
      rules:[
        { required: true, message: '请选择部门'}
      ]
    });

     let typeProps = getFieldProps('type', {
      initialValue: "3",
      rules:[
        { required: true, message: '请选择重要度'}
      ]
    });

   let validityProps = getFieldProps('validity', {
      initialValue: "0"
    });

   
    
    return (
      <Form horizontal form={this.props.form} className={styles.notice_editor}>
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
              <Select showSearch notFoundContent="无法找到" {...cateProps}  name="category">
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
              <Select showSearch notFoundContent="无法找到" {...receiverProps} name="receiver">
                <Option value="1">财务</Option>
                <Option value="2">人事</Option>
                <Option value="3">IT</Option>
              </Select>        
            </FormItem>
          </Col>
        </Row> 
        <Row>
          <Col span="24">
            <div className = {styles.notice_content} >
              <Editor editorState={this.state.editorState} placeholder1="请输入通知内容" onChange={this.editorChange.bind(this)} blockStyleFn={ () => styles.notice_content_block }  />
            </div>
          </Col>
        </Row>
         <Row>
          <Col span="24">
             <FormItem
              label="附件"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <Upload action="http://mw-weboa.oss-cn-shenzhen.aliyuncs.com"  data={this.uploadFileWithKey.bind(this)} onChange={this.uploadSucc.bind(this)}  beforeUpload={this.getFileKey.bind(this)}  >
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
              <RadioGroup {...typeProps} name="type">
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
              <InputNumber {...validityProps} min={0} defaultValue={0} />天（为0或空则永远不过期）
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
    console.log( file )
    if( this.state.filetoken ){
      this.state.filetoken.key = file.uid;
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

  editorChange(editorState) {
    this.state.editorState = editorState;
    this.setState(this.state)
  }

  commit(e){
    e.preventDefault();
    let notice = false;
    let form = this.props.form;
    form.validateFields( (errors, values) => {
      console.log( errors )

      if( errors ) {
        return ;
      }
      console.log( values )

       notice = Object.assign({ }, values);
    })

    if( !notice ) {
      return
    }

    var content = this.state.editorState.getCurrentContent();

    if( content.hasText() ) {
      notice.content = stateToHTML(content);
    }
    console.log( notice );
  }

  builderOrder() {


  }

  uploadSucc(ret, file) {
    console.log( ret )
    console.log( file )
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

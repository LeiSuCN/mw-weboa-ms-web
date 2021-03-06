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
      initialValue: "3"
    });

   let validityProps = getFieldProps('validity', {
      initialValue: "0"
    });

  
    let noticeContentClassName = styles.notice_content;
    var contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        noticeContentClassName += ' RichEditor-hidePlaceholder';
      }
    }
 
    
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
            <div className = {noticeContentClassName} >
              <Editor editorState={this.state.editorState} placeholder="请在下面输入通知内容：" onChange={this.editorChange.bind(this)} blockStyleFn={ () => styles.notice_content_block }  />
            </div>
          </Col>
        </Row>
         <Row style={{marginTop:'2em', paddingTop:'1em'}} className={styles.item_block} >
          <Col span="24">
             <FormItem
              label="附&nbsp;&nbsp;&nbsp;&nbsp;件"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <Upload ref="cmpUpload" action="http://mw-weboa.oss-cn-shenzhen.aliyuncs.com"  data={this.uploadFileWithKey.bind(this)} beforeUpload={this.getFileKey.bind(this)}  >
                <Button type="ghost">
                  <Icon type="upload" />点击上传
               </Button>
              </Upload>
            </FormItem>
         </Col>
        </Row>
         <Row className={styles.item_block} >
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
         <Row className={styles.item_block} >
          <Col span="24">
             <FormItem
              label="有效期"
              labelCol={{span:1}}
              wrapperCol={{span:23}}>
              <InputNumber {...validityProps} min={0} defaultValue={0} />天（为0或空则永远不过期）
            </FormItem>
         </Col>
        </Row>
        <Row className={styles.item_block} style={{paddingBottom:'1em'}} >
          <Col span="24" style={{textAlign:'center'}}>
            <Button onClick={this.commit.bind(this)} type="primary" size="large"  htmlType='submit'>提交</Button>
         </Col>
        </Row>
      </Form>
    )
  }

  uploadFileWithKey(file) {
    if( this.state.filetoken ){
      this.state.filetoken.key = file.uid;
      return this.state.filetoken;
    }
  }

  getFileKey(file) {

    if( false && this.state.filetoken ) {
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
      if( errors ) {
        return ;
      }
      notice = Object.assign({ }, values);
    })

    if( !notice ) {
      return
    }

    // receivers
    notice.receivers = [{name:1, value:notice.receiver}];
    delete notice.receiver;
    // attachments
    notice.attachments = [];
    this.refs.cmpUpload.state.fileList.forEach( file => notice.attachments.push( {name: file.name, value:file.uid} ) );
    // content
    var content = this.state.editorState.getCurrentContent();
    if( content.hasText() ) {
      notice.content = stateToHTML(content);
    }
    notice = JSON.stringify(notice)
    ifetch('//localhost:18080/notice',{mode:'cors', method:'post', body:notice}).then(
     resp => {
       let json = resp.json();
       if( json && json.then ){
         json.then( _json => {console.log(_json)} );
       } else if( json ){
         console.log(json);
       }
     } 
   )
        
    
    console.log( notice );
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

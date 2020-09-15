import React, { Component } from 'react';
import './index.scss';
import { Select, Form, Row, Col, Modal, Tabs, Divider, Button, Input, message } from 'antd';
import { Icon } from 'antd';
import java from '../../../src/assets/img/myClass/java.jpg';
import qs from 'qs';
import $axios from "@/axios/$axios";
import TypingCard from '../../components/TypingCard'

const { Option } = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const cardContent = `亲爱的同学暂时还未匹配到与您查询有关的课程，请刷新或耐心等待！`
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  layout: 'inline'
};
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      courseSelectList: [],
      status: '',
      courseId: '',
      inviteCodeModal: false,
    }
  }
  // 获取列表数据
  getData = () => {
    let that = this;
    let status = that.state.status
    let courseId = that.state.courseId
    $axios.post("/exam/api/student/course/queryCourseByUserId", qs.stringify({ status, courseId })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        that.setState({
          list: data
        })
      }
    })
  }
  // 课程下拉数据
  getCourseSelectList = () => {
    let that = this;
    let status = that.state.status
    let courseId = that.state.courseId
    $axios.post("/exam/api/student/course/queryCourseByUserId", qs.stringify({ status, courseId })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        that.setState({
          courseSelectList: data
        })
      }
    })
  }
  // 课程邀请码加入课程
  getInviteCode = () => {
    let that = this;
    let inviteCode = that.state.inviteCode
    $axios.post("/exam/api/student/course/addCourseByInvitCode", qs.stringify({ inviteCode })).then((res) => {
      const {
        code,
        msg
      } = res.data
      if (code === 0) {
        that.setState({
          inviteCodeModal: false
        }, () => {
          this.getData()
          message.success(msg);
        })
      } else {
        message.error(msg)
      }
    })
  }
  componentDidMount () {
    this.getData()
    this.getCourseSelectList()
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  /**
   * 提交查询
   * @param {*} e 
   */
  handleSubmit = e => {
    e.preventDefault();
    let that = this;
    that.props.form.validateFields((err, values) => {
      if (!err) {
        that.setState({
          status: values.status,
          courseId: values.courseId
        }, () => {
          that.getData()
        })

      }
    });
  };
  // 打开邀请码
  openInviteCode = () => {
    setTimeout(() => {
      this.setState({
        inviteCodeModal: true
      })
    });
  }
  // 邀请码取消
  inviteCodeOnCancel = () => {
    setTimeout(() => {
      this.setState({
        inviteCodeModal: false
      })
    });
  }
  // 邀请码确认
  inviteCodeOnCreate = () => {
    let that = this;
    that.props.form.validateFields((err, values) => {
      if (!err) {
        that.setState({
          inviteCode: values.inviteCode,
        }, () => {
          that.getInviteCode()
        })

      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { list, courseSelectList, inviteCodeModal } = this.state
    return (
      <div >
        <div className="query-content">
          <Form  {...layout} onSubmit={this.handleSubmit}>
            <FormItem label="课程">
              {
                getFieldDecorator('courseId')(
                  <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程">
                    <Option value='' >全部</Option>
                    {
                      courseSelectList.map((item, key) => <Option value={item.courseId} key={key}>{item.courseName}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="状态" >
              {
                getFieldDecorator('status')(
                  <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程状态">
                    <Option value="">全部</Option>
                    <Option value="1">已结束</Option>
                    <Option value="0">学习中</Option>
                  </Select>
                )
              }

            </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit" className="ml-20">
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="button" onClick={() => this.openInviteCode()}>
                邀请码
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="shadow-radius">
          <Row type="flex">
            {
              list.length > 0 ?
                this.state.list.map((item, key) => {
                  return <ClassBlock item={item} key={key}></ClassBlock>
                }) : <TypingCard source={cardContent} ></TypingCard>
            }
          </Row>
        </div>
        {
          inviteCodeModal ? <Modal
            visible={inviteCodeModal}
            title="课程邀请码"
            okText="确定"
            onCancel={() => this.inviteCodeOnCancel()}
            onOk={() => this.inviteCodeOnCreate()}
          >
            <InviteCodeModal form={this.props.form}></InviteCodeModal>
          </Modal> : ''
        }
      </div>
    );
  }
}

export default Form.create()(Index);

// 课程邀请码弹窗
class InviteCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteCodeModal: false
    };
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form {...layout}>
        <Form.Item label="邀请码">
          {getFieldDecorator('inviteCode', {
            rules: [{ required: true, message: '请输入课程邀请码' }],
          })(<Input placeholder="请输入邀请码" />)}
        </Form.Item>
      </Form >
    )

  }
}

// 卡片组件
// 课程封面组件
class ClassBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetList: [],
    };
    this.callback = this.callback.bind(this)
  }
  openModal = (item) => {
    this.setState({ visible: true })
  }
  handleOk = () => {
    let that = this
    setTimeout(() => {
      that.setState({
        visible: false,
      })
    })
  };
  formatterDate (date) {
    return date.split(' ')[0]
  }
  callback (key) {
    let that = this;
    let { courseId } = that.props.item
    $axios.post("/exam/api/student/course/queryCourseTargetByUserId", qs.stringify({ courseId, targetType: key })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        that.setState({
          targetList: data
        })
      }
    })
  }
  componentDidMount () {
    this.callback(1)
  }
  render () {
    const { visible, targetList } = this.state;
    const { courseName, courseContent, beginTime, endTime, teacherName } = this.props.item
    return (
      <Col className="class-col" onClick={() => this.openModal(this.props.item)}>
        <div className="class-fm">
          <div className="class-img-father">
            <img src={java} className="class-img" alt={java} />
            <div className="class-fm-state" style={{ color: this.props.item.state === "已结束" ? 'red' : '#00bfff' }}>{this.props.item.state}</div>
          </div>
          <div className="ml-20 mt-20 font-size-22 class-fm-name">{this.props.item.courseName}</div>
          <div className="class-fm-info"><span><Icon type="history" className="mr-10" />{this.formatterDate(this.props.item.beginTime)}</span><span><Icon type="user" />{this.props.item.teacherName}</span></div>
        </div>
        {
          visible ? <Modal
            title="课程详情"
            width = { 800 }
            visible={this.state.visible}
            onOk={() => this.handleOk()}
            onCancel={() => this.handleOk()}
          >
            <Tabs defaultActiveKey="1" onChange={this.callback} className="mb-40">
              <TabPane tab="能力" key="1">
                {
                  targetList.length > 0 ?
                    targetList.map((item, key) =>
                      <p key={key}>{item.targetContent}</p>
                    ) : ''
                }
              </TabPane>
              <TabPane tab="知识" key="2">
                {
                  targetList.length > 0 ?
                    targetList.map((item, key) =>
                      <p key={key}>{item.targetContent}</p>
                    ) : ''
                }
              </TabPane>
              <TabPane tab="素质" key="3">
                {
                  targetList.length > 0 ?
                    targetList.map((item, key) =>
                      <p key={key}>{item.targetContent}</p>
                    ) : ''
                }
              </TabPane>
            </Tabs>
            <Divider>基础信息</Divider>
            <p><label>课程：</label><span>{courseName}</span></p>
            <p><label>内容：</label><span>{courseContent}</span></p>
            <p><label>老师：</label><span> {teacherName}</span></p>
            <p><label>课程周期：</label><span>{beginTime}至{endTime}</span></p>
          </Modal> : null
        }

      </Col>
    );
  }
}

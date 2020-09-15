/* eslint-disable */

import React, { Component } from 'react';
import { Button, Radio, Checkbox, Row, Col, Input, Form, Modal, notification } from 'antd';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss'
import { withRouter } from 'react-router-dom';
import { replaceString } from "@/utils/formmate.js"


const isShowAwser = false
const Question = (props) => {
  let that = this
  const radioStyle = {
    display: 'block',
    height: '50px',
    lineHeight: '50px',
  };
  // 操作显示答案
  const examOnChange = () => {
    isShowAwser = true
  }
  const { questionItem, questionType } = props
  const { getFieldDecorator } = props.form;
  if (questionType === "0" || questionType === "2") {// 单选和判断
    return (
      <Form onSubmit={() => props.handleSubmit()}>
        <Form.Item>
          {
            getFieldDecorator("answer")(
              <Radio.Group>
                {
                  Object.keys(questionItem).map((key) =>
                    <Radio style={radioStyle} value={key} key={key}>
                      {`${key}、${questionItem[key].title}`}
                    </Radio>
                  )
                }
              </Radio.Group>
            )
          }
        </Form.Item>
      </Form>
    )
  } else if (questionType === "1") { // 多选
    return (
      <Form onSubmit={() => props.handleSubmit()}>
        <Form.Item>
          {

            getFieldDecorator("answer")(
              <Checkbox.Group style={{ width: '100%' }} onChange={() => props.querstionOnChange()} className="question-radio">
                {
                  Object.keys(questionItem).map((key) =>
                    <Col span={8} key={key}>
                      <Checkbox style={radioStyle} value={key} key={key}>{`${key}、${questionItem[key].title}`}</Checkbox>
                    </Col>
                  )
                }
              </Checkbox.Group>
            )
          }
        </Form.Item>
      </Form>
    )
  } else if (questionType === "3") {// 填空
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
    return (

      <Form {...formItemLayout} onSubmit={() => props.handleSubmit()}>
        {
          Object.keys(questionItem).map((key, index) =>
            <Form.Item label={key} key={index}>
              {
                getFieldDecorator(`answer[${index}]`)(<Input />)
              }

            </Form.Item>
          )
        }
      </Form>
    )
  } else {
    return ''
  }

}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionItem: {},
      questionId: '', // 题目id
      questionTypeName: '', // 题目类型名称
      questionTitle: '', // 题目标题
      easyScaleName: '', // 难易程度
      questionType: '', // 难易程度类型
      systemTime: '', // 系统时间
      examEndTime: '' // 考试结束时间
    }
  }
  // 获取题
  getQuestion = (questionId = 0) => {
    let that = this;
    const { courseId } = this.props.location.state;
    const { history } = this.props
    $axios.post("/exam/api/student/studyArea/queryStudyAreaQuerstionByCourseId", qs.stringify({ courseId, questionId })).then((res) => {
      const {
        code,
        data,
        msg
      } = res.data
      if (code === 0) {
        const { questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType } = data
        setTimeout(() => {
          that.setState({
            questionItem,
            questionId,
            questionTypeName,
            questionTitle,
            easyScaleName,
            questionType
          })
        }, 300);
      } else if (code === 500) {
        Modal.error({
          content: `${msg}请返回到开始答题界面，继续尝试或联系管理员！`,
          keyboard: false,
          okText: "返回",
          onOk () {
            history.push({ pathname: '/studyRoom' })
          }

        });
        return
      }
    })
  }
  componentDidMount () {
    this.getQuestion()
  }
  componentWillMount () {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.beforeunload);
    if (!this.props.location.state) {
      this.props.location.state = localStorage.getItem("/studyRoomQuestion") && JSON.parse(localStorage.getItem("/studyRoomQuestion"))
    }

  }
  componentWillUnmount () {
    // 销毁拦截判断是否离开当前页面
    window.removeEventListener('beforeunload', this.beforeunload);
  }
  beforeunload (e) {
    let confirmationMessage = '刷新页面后测试重新开始，是否继续？';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
  // 下一道提
  next = (e) => {
    e.preventDefault();
    let that = this
    const { questionItem, questionType } = that.state
    that.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.answer || values.answer.length === 0) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学请做完本题后，再进行下一题作答。',
          });
          return
        }
        if (questionType * 1 === 3) {
          Modal.info({
            content: that.completionAnswerResult(questionItem),
            keyboard: false,
            okText: "继续答题",
            onOk () {
              that.commitQuestion(values)
            }
          });
          return
        } else {
          if (!that.correct(questionItem, values, questionType)) {
            Modal.error({
              content: `正确答案：${that.answerResult(questionItem)}`,
              keyboard: false,
              okText: "继续答题",
              onOk () {
                that.commitQuestion(values)
              }
            });
            return
          }
        }
        that.commitQuestion(values)
      }
    });
  }
  // 是否正确
  correct = (questionItem, values, questionType) => {
    const { answer } = values
    let result = Object.values(questionItem).filter(item => {
      if (item.answerFlag === 0) {
        return item
      }
    }).map(item => item.code)
    if (questionType * 1 === 1) {
      if (answer.length !== result.length) {
        return false
      }

      let isCorrect = result.every(item => {
        return answer.indexOf(item) > -1
      })
      return isCorrect
    } else {
      return result.indexOf(answer) > -1
    }
  }
  // 获取正确答案
  answerResult = (questionItem) => {
    let result = Object.values(questionItem).filter(item => {
      if (item.answerFlag === 0) {
        return item
      }
    }).map(item => item.code)
    return result.join('、')
  }
  // 填空题答案
  completionAnswerResult = (questionItem) => {
    let result = Object.values(questionItem)
    return (
      <div className="pl-50">
        {
          result.map(item => (
            <p>{item.code}、{item.title}</p>
          ))
        }
      </div>
    )
  }
  // 下一步提交答案
  commitQuestion = (values) => {
    this.props.form.resetFields()
    this.getQuestion(this.state.questionId)
  }
  // 弹窗提示
  info = (msg) => {
    let { history } = this.props
    Modal.info({
      content: msg,
      onOk () {
        history.push({ pathname: '/task' })
      }
    });
  }
  replace = (value) => {
    return replaceString(value)
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, questionSqNo } = this.state
    return (
      <div>
        {
          <div className="shadow-radius">
            <div className="exam">
              <div className="exam-header">
                <div className="exam-title">
                  <div><span className="exam-icon">{questionTypeName}</span><span className="ml-20">{this.replace(questionTitle)}</span> <span className="easyScale">(难度：{easyScaleName})</span></div>
                  <div className="exam-content">
                    <Question questionItem={questionItem} form={this.props.form} questionType={questionType} querstionOnChange={() => this.querstionOnChange}></Question>
                  </div>
                  <div className="exam-btn">
                    <Button type="primary" size="large" onClick={(e) => this.next(e)}>换题</Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(Form.create()(Index));

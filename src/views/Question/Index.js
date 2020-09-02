/* eslint-disable */

import React, { Component } from 'react';
import { Button, Radio, Checkbox, Row, Col, Input, Form, Modal, notification } from 'antd';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss'
import { withRouter } from 'react-router-dom'
import showtime from "../../utils/countdown.js"

const [modal] = Modal.useModal();

const Question = (props) => {
  let that = this
  const radioStyle = {
    display: 'block',
    height: '50px',
    lineHeight: '50px',
  };


  const { questionItem, questionType } = props
  const { getFieldDecorator } = props.form;
  if (questionType === "0" || questionType === "2") {// 单选和判断
    return (
      <Form onSubmit={() => props.handleSubmit()}>
        <Form.Item>
          {
            getFieldDecorator("answer")(
              <Radio.Group >
                {
                  Object.keys(questionItem).map((key) =>
                    <Radio style={radioStyle} value={key} key={key}>
                      {questionItem[key]}
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
              <Checkbox.Group style={{ width: '100%' }} onChange={() => props.querstionOnChange()}>
                {
                  Object.keys(questionItem).map((key) =>
                    <Col span={8}>
                      <Checkbox style={radioStyle} value={key} key={key}>{questionItem[key]}</Checkbox>
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
          Object.keys(questionItem).map((key) =>
            <Form.Item label={key}>
              {
                getFieldDecorator("answer")(<Input />)
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
      ansItem:'', //答案
      examSort: [], // 题目序号{key:value}
      questionItem: {},
      questionId: '', // 题目id
      questionTypeName: '', // 题目类型名称
      questionTitle: '', // 题目标题
      easyScaleName: '', // 难易程度
      questionType: '', // 难易程度类型
      questionSqNo: 0, // 题目显示的SqNo
      systemTime: '', // 系统时间
      examEndTime: '' // 考试结束时间
    }
  }
  // 获取题
  getQuestion = (questionSqNo) => {
    let that = this;
    const { questionData: { examSort }, courseId, paperId, paperType } = this.props.location.state;
    const questionId = Object.keys(examSort[questionSqNo])[0]
    $axios.post("/exam/api/student/question/queryQuerstionByQuestionId", qs.stringify({ questionId, courseId, paperId, paperType })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        const { questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, ansItem } = data
        // 单选和判断
        if (questionType === "0" || questionType === "2") {
          const answer = Object.keys(ansItem)
          this.props.form.setFieldsValue({
            answer,
          });
        }else{ //多选和填空

        }
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
      }
    })
  }
  // 考试
  exam = (record) => {
    let that = this;
    const { courseId, paperId, paperType, userId } = record
    $axios.post("/exam/api/student/question/queryQuerstionSortByPaperId", qs.stringify({ courseId, paperId, paperType, userId })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        const { systemTime, examEndTime } = data
        let time = new Date(systemTime) - new Date(examEndTime)
        setInterval(function () {
          if (that.refs.countDown) {
            that.refs.countDown.innerHTML = showtime(time)
            time = time - 1000
            if (that.refs.countDown.innerHTML === "00小时:00分钟:00秒") {
              this.info('考试时间已结束,请返回列表!')
              return
            }
          }
        }, 1000);
      }
    })
  }
  componentWillMount () {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.beforeunload);
    if (!this.props.location.state) {
      this.props.location.state = localStorage.getItem("/question") && JSON.parse(localStorage.getItem("/question"))
    }

    this.setState({
      examSort: this.props.location.state.questionData.examSort
    }, () => this.getQuestion(this.state.questionSqNo))
    const { courseId, paperId, paperType, userId } = this.props.location.state

    this.exam({ courseId, paperId, paperType, userId })
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
  // 子组件的事件
  querstionOnChange = () => {
    console.log(1312)
  }
  // 下一道提
  next = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.answer || values.answer.length === 0) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学请做完本题后，再进行下一题进行作答。',
          });
          return
        }
        this.commitQuestion(values)
      }
    });
  }
  // 上一道题
  previous = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.commitPreviousQuestion(values)
      }
    });
  }
  // 查看上一步提交的答案
  commitPreviousQuestion = (values) => {
    this.setState({
      questionSqNo: this.state.questionSqNo - 1
    }, () => {
      this.getQuestion(this.state.questionSqNo)
    })
  }
  // 下一步提交答案
  commitQuestion = (values) => {
    this.setState({
      questionSqNo: this.state.questionSqNo + 1
    }, () => {
      this.axiosCommitQuestion(values)
    })

  }
  // 提交答案的接口请求
  axiosCommitQuestion = (values, type) => {
    const { courseId, paperId, paperType } = this.props.location.state;
    const questionObject = this.state.examSort[this.state.questionSqNo - 1]
    const questionId = Object.keys(questionObject)[0]
    let answer = values.answer
    if (values.answer instanceof Array) {
      answer = values.answer.join(',')
    }
    const query = {
      answerFlag: 1,
      answerResult: answer,
      courseId,
      paperId,
      paperType,
      questionId,
    }
    $axios.post("/exam/api/student/answer/saveAnswer", qs.stringify(query)).then((res) => {
      const { code } = res.data
      if (code === 0) {
        // 考试完毕
        if (this.state.questionSqNo === this.state.examSort.length) {
          this.info('您已考试完毕,请返回列表!')
          return
        }
        // TODO 下一题的时候有答案情况下不应该被置空
        this.props.form.setFieldsValue({
          answer: '',
        });
        this.getQuestion(this.state.questionSqNo)
      }

    })
  }
  // 弹窗提示
  info = (msg) => {
    let { history } = that.props
    Modal.info({
      content: msg,
      onOk () {
        history.push({ pathname: '/task' })
      }
    });
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { examSort, questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, questionSqNo } = this.state
    return (
      <div>
        {
          <div className="shadow-radius">
            <div className="exam">
              <div className="exam-header">
                <div className="exam-title">
                  <div><span className="exam-icon">{questionTypeName}</span>{questionSqNo + 1}/{examSort.length}:<span className="ml-20">{questionTitle}</span> <span className="easyScale">(难度：{easyScaleName})</span></div>
                  <div className="exam-content">
                    <Question questionItem={questionItem} form={this.props.form} questionType={questionType} querstionOnChange={() => this.querstionOnChange}></Question>
                  </div>
                  <div className="exam-btn">
                    <Button type="primary" size="large" disabled={questionSqNo === 0} className="mr-20" onClick={(e) => this.previous(e)}>上一题</Button>
                    <Button type="primary" size="large" onClick={(e) => this.next(e)}>{this.state.examSort.length === this.state.questionSqNo + 1 ? "提交" : "下一题"}</Button>
                  </div>
                </div>
                <div>距离本次测试结束还有<span className="exam-time" ref="countDown">00:00:00</span></div>
              </div>

            </div>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(Form.create()(Index));

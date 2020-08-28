/* eslint-disable */

import React, { Component } from 'react';
import { Button, Radio, Checkbox, Row, Col, Input, Form } from 'antd';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss'
import { withRouter } from 'react-router-dom'


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
      questionData: [],
      questionItem: {},
      questionId: '',
      questionTypeName: '',
      questionTitle: '',
      easyScaleName: '',
      questionType: '',
      questionSqNo: 0
    }
  }
  // 获取题
  getQuestion = (questionSqNo) => {
    let that = this;
    const { questionData, courseId, paperId, paperType } = this.props.location.state;
    const questionId = Object.keys(questionData[questionSqNo])[0]
    $axios.post("/exam/api/student/question/queryQuerstionByQuestionId", qs.stringify({ questionId, courseId, paperId, paperType })).then((res) => {
      const {
        code,
        data
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
      questionData: this.props.location.state.questionData
    }, () => this.getQuestion(this.state.questionSqNo))

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
  next = (e) => {
    if (this.state.questionData.length === this.state.questionSqNo) {
      return
    }
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.commitQuestion(values)
      }
    });
  }
  // 下一步提交答案
  commitQuestion = (values) => {
    this.setState({
      questionSqNo: this.state.questionSqNo + 1
    }, () => {
      this.axiosCommitQuestion(values)
    })

  }
  axiosCommitQuestion = (values) => {
    const { courseId, paperId, paperType } = this.props.location.state;
    const questionObject = this.state.questionData[this.state.questionSqNo - 1]
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
        this.props.form.setFieldsValue({
          answer: '',
        });
        this.getQuestion(this.state.questionSqNo)
      }

    })
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { questionData, questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, questionSqNo } = this.state
    return (
      <div>
        {
          <div className="shadow-radius">
            <div className="exam">
              <div className="exam-header">
                <div className="exam-title">
                  <div><span className="exam-icon">{questionTypeName}</span>{questionSqNo + 1}/{questionData.length}:<span className="ml-20">{questionTitle}</span> <span className="easyScale">(难度：{easyScaleName})</span></div>
                  <div className="exam-content">
                    <Question questionItem={questionItem} form={this.props.form} questionType={questionType} querstionOnChange={() => this.querstionOnChange}></Question>
                  </div>
                  <div className="exam-btn">
                    <Button type="primary" size="large" disabled={questionSqNo === 0} className="mr-20">上一题</Button>
                    <Button type="primary" size="large" onClick={(e) => this.next(e)}>下一题</Button>
                  </div>
                </div>
                <div>距离本次测试结束还有<span className="exam-time">00:20:00</span>小时</div>
              </div>

            </div>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(Form.create()(Index));

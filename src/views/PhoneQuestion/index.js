/* eslint-disable */

import React, { Component } from 'react';
import { List, Radio, Flex, WhiteSpace, Button, InputItem, Checkbox, WingBlank } from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss'
import { withRouter } from 'react-router-dom'

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
const Question = (props) => {
  let that = this
  const { questionItem, questionType, onQuestion } = props
  let answerArray = []
  const { getFieldProps, getFieldError } = props.form;
  const onChangeCheckbox = (value) => {
    console.log(value)
    answerArray.push(value)
    props.form.setFieldsValue({
      answer: answerArray
    })
  }
  const onChangeRadio = (value) => {
    setFieldsValue({
      answer: value
    })
  }
  if (questionType === "0" || questionType === "2") {// 单选和判断
    return (
      <div>
        <List>
          {
            Object.keys(questionItem).map(key => (
              <RadioItem key={key} checked={value === key} onChange={() => onChangeRadio(key)}>
                {questionItem[key]}
              </RadioItem>
            ))
          }
        </List>
        <WhiteSpace size="lg" />
      </div>
    )
  } else if (questionType === "1") { // 多选
    return (
      <div>
        {
          Object.keys(questionItem).map(key => (
            <CheckboxItem key={key} onChange={() => onChangeCheckbox(key)}>
              {questionItem[key]}
            </CheckboxItem>
          ))
        }
        <WhiteSpace size="lg" />
      </div>
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
      <div>
        {
          Object.keys(questionItem).map((key) =>
            <InputItem label={key} {...getFieldProps('answer')} />
          )
        }
      </div>
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
  static propTypes = {
    form: formShape,
  };
  // 获取题
  getQuestion = (questionSqNo) => {
    let that = this;
    debugger
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
  // 下步
  next = (e) => {
    debugger
    if (this.state.questionData.length === this.state.questionSqNo) {
      return
    }
    e.preventDefault();
    const values = this.props.form.getFieldsValue()
    if (values) {
      this.commitQuestion(values)
    }


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
    debugger
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
        <WhiteSpace size="xl" />
        <WingBlank>
          <div><span className="exam-icon">{questionTypeName}</span>{questionSqNo + 1}/{questionData.length}:<span className="ml-20">{questionTitle}</span> </div>
          <div><span className="easyScale">(难度：{easyScaleName})</span></div>
          <WhiteSpace size="xl" />
          <div>距离本次测试结束还有<span className="exam-time">00:20:00</span>小时</div>
          <WhiteSpace size="xl" />
          <div>
            <Question questionItem={questionItem} form={this.props.form} questionType={questionType}></Question>
          </div>
          <WhiteSpace size="xl" />
          <div>
            <Button type="primary" inline size="large" disabled={questionSqNo === 0} className="mr-20">上一题</Button>
            <Button type="primary" inline size="large" onClick={(e) => this.next(e)}>下一题</Button>
          </div>
        </WingBlank>
      </div>
    )
  }
}

export default withRouter(createForm()(Index));

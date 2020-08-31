/* eslint-disable */

import React, { Component } from 'react';
import { List, Radio, Flex, WhiteSpace, Button, InputItem, Checkbox, WingBlank, Toast } from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss'
import { withRouter } from 'react-router-dom'
import showtime from "../../utils/countdown.js"

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;
let selectValue = ''
const Question = (props) => {
  let that = this
  const { questionItem, questionType, getValue } = props
  const { getFieldProps, getFieldError, setFieldsValue } = props.form;

  const onChangeCheckbox = (e, key) => {
    const value = {
      checked: e.target.checked,
      key,
      type: 'checkbox'
    }
    getValue(value)
  }
  const onChangeRadio = (e, key) => {
    const value = {
      checked: e.target.checked,
      key,
      type: 'radio'
    }
    selectValue = key
    getValue(value)
  }



  if (questionType === "0" || questionType === "2") {// 单选和判断
    return (
      <div>
        <List>
          {
            Object.keys(questionItem).map(key => (
              <RadioItem key={key} checked={selectValue === key} onChange={(e) => onChangeRadio(e, key)}>
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
            <CheckboxItem key={key} value={key} onChange={(e) => onChangeCheckbox(e, key)}>
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
      examSort: [],
      questionItem: {},
      questionId: '',
      questionTypeName: '',
      questionTitle: '',
      easyScaleName: '',
      questionType: '',
      questionSqNo: 0,
      answer: ''
    }
  }
  static propTypes = {
    form: formShape,
  };
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
    let { history } = this.props
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.beforeunload);
    if (!this.props.location.state) {
      this.props.location.state = localStorage.getItem("/PhoneQuestion") && JSON.parse(localStorage.getItem("/PhoneQuestion"))
    }
    this.setState({
      examSort: this.props.location.state.questionData.examSort
    }, () => this.getQuestion(this.state.questionSqNo))
    let that = this
    const { systemTime, examEndTime } = this.props.location.state.questionData
    let time = new Date(systemTime) - new Date(examEndTime)
    setInterval(function () {
      if (that.refs.countDown) {
        that.refs.countDown.innerHTML = showtime(time)
        time = time - 1000
        if (that.refs.countDown.innerHTML === "00小时:00分钟:00秒") {
          Toast.success('考试已结束，即将退出！', 2, () => {
            history.push({ pathname: '/PhoneQuestion' })
          });
        }
      }
    }, 1000);

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
  // 子组件选中答案事件
  getValue = (value) => {
    const { checked, key, type } = value
    if (type === "checkbox") {
      if (checked) {
        this.setState({
          answer: [key, ...this.state.answer]
        })
      } else {
        const index = this.state.answer.indexOf(key)
        answer = answer.splice(index, 1)
      }

    } else {
      this.setState({
        answer: key
      })
    }
  }
  // 下步
  next = (e) => {

    e.preventDefault();
    if (this.state.answer) {
      let array = ''
      if (Array.isArray(this.state.answer)) {
        if (this.state.answer.length > 0) {
          array = this.state.answer.filter((item, index, arr) => arr.indexOf(item) === index)
        } else {
          Toast.fail('请选或输入答案后继续答题', 1)
        }
        this.commitQuestion(array)
      } else {
        this.commitQuestion(this.state.answer)
        selectValue = ''
      }

    } else {
      Toast.fail('请选或输入答案后继续答题', 1)
    }
  }
  // 下一步提交答案
  commitQuestion = (values) => {
    this.axiosCommitQuestion(values)
  }
  // 请求答题接口
  axiosCommitQuestion = (values) => {
    const { courseId, paperId, paperType } = this.props.location.state;

    let { history } = this.props

    let { questionSqNo } = this.state

    const questionObject = this.state.examSort[questionSqNo]

    questionSqNo = questionSqNo + 1

    const questionId = Object.keys(questionObject)[0]
    let answer = values
    if (values instanceof Array) {
      answer = values.join(',')
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
        if (questionSqNo === this.state.examSort.length) {
          Toast.success('您已考试完毕！', 2, () => {
            history.push({ pathname: '/PhoneExam' })
          });
          return
        }
        this.setState({
          questionSqNo
        }, () => {
          this.getQuestion(this.state.questionSqNo)
        })

      }

    })
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { examSort, questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, questionSqNo } = this.state
    return (
      <div className="question">
        <WhiteSpace size="xl" />
        <WingBlank>
          <div><span className="exam-icon">{questionTypeName}</span>{questionSqNo + 1}/{examSort.length}:<span className="ml-20">{questionTitle}</span> </div>
          <WhiteSpace size="xl" />
          <div><span className="easyScale">(难度：{easyScaleName})</span></div>
          <WhiteSpace size="sm" />
          <div>距离本次测试结束还有<span className="exam-time" ref="countDown">00:00:00</span></div>
          <WhiteSpace size="xl" />
          <div>
            <Question questionItem={questionItem} form={this.props.form} questionType={questionType} getValue={this.getValue.bind(this)}></Question>
          </div>
          <WhiteSpace size="xl" />
          <div>
            <Button type="primary" inline size="large" disabled={questionSqNo === 0} className="mr-20">上一题</Button>
            <Button type="primary" inline size="large" onClick={(e) => this.next(e)}>{examSort.length === (questionSqNo + 1) ? "完成" : "下一题"}</Button>
          </div>
        </WingBlank>
      </div>
    )
  }
}

export default withRouter(createForm()(Index));

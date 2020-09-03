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
  const { questionItem, questionType, getValue, ansItem } = props
  const { getFieldDecorator, getFieldError, setFieldsValue } = props.form;
  // 多选题赋值
  let keys = []
  let radioKey = ""
  if (questionType * 1 === 1) {
    keys = Object.keys(ansItem)
  }
  // 单选和判断赋值
  else if (questionType === "0" || questionType === "2") {
    radioKey = Object.keys(ansItem)[0]
  }

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
            Object.keys(questionItem).map((key, index) => (
              <RadioItem key={key} checked={radioKey === key} key={index} onChange={(e) => onChangeRadio(e, key)}>
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
          Object.keys(questionItem).map((key, index) => (
            <CheckboxItem key={key} value={key} key={index} checked={keys.indexOf(key) > -1} onChange={(e) => onChangeCheckbox(e, key)}>
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
          Object.keys(questionItem).map((key, index) =>
            getFieldDecorator(`answer[${index}]`, {
              initialValue: ansItem[key] ? ansItem[key] : ''
            })(<InputItem label={key} placeholder="填写答案" key={index}>{key}</InputItem>)
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
      ansItem: '', //答案
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
        const { questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, ansItem } = data

        setTimeout(() => {
          that.setState({
            questionItem,
            questionId,
            questionTypeName,
            questionTitle,
            easyScaleName,
            questionType,
            ansItem
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
        let newAnsItem = this.state.ansItem
        newAnsItem[key] = key
        this.setState({
          ansItem: newAnsItem
        })
      } else {
        const keysIndex = Object.keys(this.state.ansItem).indexOf(key)
        let newAnsItem = {}
        for (let i in this.state.ansItem) {
          if (i + '' !== key) {
            newAnsItem[i] = i
          }
        }
        this.setState({
          ansItem: newAnsItem
        })
      }

    } else {
      this.setState({
        ansItem: key
      })
    }
  }
  // 上一道题
  previous = (e) => {
    e.preventDefault();
    this.commitPreviousQuestion()
  }
  // 查看上一步提交的答案
  commitPreviousQuestion = () => {
    this.setState({
      questionSqNo: this.state.questionSqNo - 1
    }, () => {
      this.getQuestion(this.state.questionSqNo)
    })
  }
  // 下步
  next = (e) => {
    e.preventDefault();
    const { ansItem, questionType } = this.state

    let array = ''
    if (questionType * 1 === 1) {
      const keys = Object.keys(ansItem)
      if (keys.length > 0) {
        array = keys.filter((item, index, arr) => arr.indexOf(item) === index)
      } else {
        Toast.fail('请选或输入答案后继续答题', 1)
      }
      this.commitQuestion(array)
    } else if (questionType * 1 === 0 || questionType * 1 === 2) {
      if (!ansItem) {
        Toast.fail('请选或输入答案后继续答题', 1)
        return
      }
      this.commitQuestion(ansItem)
      selectValue = ''
    } else if (questionType * 1 === 3) {
      if (this.props.form.getFieldValue("answer")) {
        this.commitQuestion(ansItem)
      } else {
        Toast.fail('请选或输入答案后继续答题', 1)
      }
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

    let answer = this.answerType(values)

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
  answerType = (answer) => {
    // 单选或者判断
    const { questionType, questionItem } = this.state
    if (questionType * 1 === 0 || questionType * 1 === 2) {
      if (Object.keys(answer).length > 0) {
        return Object.keys(answer)[0]
      } else {
        return answer;
      }
    } else if (questionType * 1 === 1) { // 多选
      return answer.join('');
    } else if (questionType * 1 === 3) { //填空
      const keys = Object.keys(questionItem)
      let array = []
      keys.map((item, index) => {
        let string = `${item}=${answer[index]}`
        array.push(string)
      })
      return array.join("###")
    }
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { examSort, questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType, questionSqNo, ansItem } = this.state
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
            <Question questionItem={questionItem} form={this.props.form} ansItem={ansItem} questionType={questionType} getValue={this.getValue.bind(this)}></Question>
          </div>
          <WhiteSpace size="xl" />
          <div>
            <Button type="primary" inline size="large" disabled={questionSqNo === 0} onClick={(e) => this.previous(e)} className="mr-20">上一题</Button>
            <Button type="primary" inline size="large" onClick={(e) => this.next(e)}>{examSort.length === (questionSqNo + 1) ? "完成" : "下一题"}</Button>
          </div>
        </WingBlank>
      </div>
    )
  }
}

export default withRouter(createForm()(Index));

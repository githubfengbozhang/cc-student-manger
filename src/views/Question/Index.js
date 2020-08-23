import React, { Component } from 'react';
import { Button, Radio } from 'antd';
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
  if (questionType === "0") {
    return (
      <Radio.Group onChange={() => props.querstionOnChange()} >
        {
          Object.keys(questionItem).map((key) =>
            <Radio style={radioStyle} value={questionItem[key]} key={key}>
              {key}
            </Radio>
          )
        }
      </Radio.Group>
    )
  } else if (questionType === "1") {

  } else if (questionType === "2") {

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
      questionType: ''
    }
  }
  // 获取题
  getQuestion = () => {
    let that = this;
    debugger
    const { questionData, courseId, paperId, paperType } = this.props.location.state;
    const questionId = Object.keys(questionData[0])[0]
    $axios.post("/exam/api/student/question/queryQuerstionByQuestionId", qs.stringify({ questionId, courseId, paperId, paperType })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        debugger
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
    }, () => this.getQuestion())

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
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };

    const { questionData, questionItem, questionId, questionTypeName, questionTitle, easyScaleName, questionType } = this.state
    debugger
    return (
      <div>
        {
          <div className="shadow-radius">
            <div className="exam">
              <div className="exam-header">
                <div className="exam-title">
                  <div><span className="exam-icon">{questionTypeName}</span>1/{questionData.length}:{questionTitle}(难度：{easyScaleName})</div>
                  <div className="exam-content">
                    <Question questionItem={questionItem} questionType={questionType} querstionOnChange={() => this.querstionOnChange}></Question>
                  </div>
                  <div className="exam-btn">
                    <Button type="primary" size="large" disabled className="mr-20">上一题</Button>
                    <Button type="primary" size="large">下一题</Button>
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

export default withRouter(Index);

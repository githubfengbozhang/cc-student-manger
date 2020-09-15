import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';
import $axios from "@/axios/$axios";
// import { WingBlank, Picker, List, WhiteSpace } from 'antd-mobile';
// import { createForm } from 'rc-form';
import { PullToRefresh, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import './index.scss'


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      data: [],
      status: 0,
      current: 0,
      pageSize: 10
    };
  }
  // 考试
  exam = (e, record) => {
    e.preventDefault();
    let that = this;
    let { history } = that.props

    const { courseId, paperId, paperType, userId } = record
    $axios.post("/exam/api/student/question/queryQuerstionSortByPaperId", qs.stringify({ courseId, paperId, paperType, userId })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0 && data.examSort.length > 0) {
        const examEndTime = new Date(data.examEndTime)
        const systemTime = new Date(data.systemTime)
        if (data.examSort.length === 0) {
          Toast.offline('亲爱的同学,还未查询到相关的考试信息，请耐心等待或联系管理员。', 2)
          return
        }
        // taskExamStatus 0是完成
        if (examEndTime.getTime() < systemTime.getTime() || data.taskExamStatus * 1 === 0) {
          Toast.offline('亲爱的同学,考试已结束。', 2)
          return
        }
        if (!systemTime || !examEndTime) {
          Toast.offline('该考试信息的系统时间或考试结束时间错误，请及时联系管理员！', 2);
          return
        }
        history.push({ pathname: '/PhoneQuestion', state: { 'questionData': data, ...record } })
        localStorage.setItem('/PhoneQuestion', JSON.stringify({ 'questionData': data, ...record }))
      }
    })
  }
  // 获取列表数据
  genData = () => {
    let that = this;
    let dataArr = this.state.data;
    const { status, courseId, type, pageSize, current } = that.state
    const param = {
      current: current + 1
    }
    $axios.post("/exam/api/student/task/queryExamTaskByUserId", qs.stringify({ status, courseId, type, current: param.current, pageSize })).then((res) => {
      const {
        code,
        rows,
        total
      } = res.data
      if (code === 0) {
        if(total < param.current * pageSize && param.current>1){
          return
        }
        dataArr = rows.concat(dataArr)
        this.setState({
          data: dataArr,
          current: param.current
        })
      }
    })
  }
  onRefresh = () => {
    this.genData()
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  }
  formmatTaskExamStatus = (value) => {
    if (value * 1 === 0) {
      return '已完成'
    } else if (value * 1 === 1) {
      return '进行中'
    } else {
      return '未开始'
    }
  }
  componentDidUpdate () {
    if (this.state.useBodyScroll) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }
  componentDidMount () {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    this.genData()
    setTimeout(() => this.setState({
      height: hei
    }), 0);
  }
  render () {
    const { data } = this.state
    return (<div>
      {/* <Button
        style={{ marginBottom: 15 }}
        onClick={() => this.setState({ down: !this.state.down })}
      >
        direction: {this.state.down ? 'down' : 'up'}
      </Button> */}
      <PullToRefresh
        damping={60}
        ref={el => this.ptr = el}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
        direction={this.state.down ? 'down' : 'up'}
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
      >
        {
          data.map((item, index) =>
            <div className="bb-1" onClick={(e) => this.exam(e, item)} key={index}>
              <WhiteSpace size="lg" />
              <WingBlank>
                <span className="mr-20">{item.courseName}</span>
                <span className="mr-20">{item.title}</span>
                <span className="mr-20">{item.teacherName}</span>
                <div className="mt-10">
                  <span>{item.duration || 0}分钟</span>
                  <span className={item.paperType * 1 === 0 ? "exam-class" : "task-class"}>{item.paperType * 1 === 0 ? "考试" : "作业测试"}</span>
                </div>
                <span className="mr-20">{this.formmatTaskExamStatus(item.taskExamStatus)}</span>
                <WhiteSpace size="lg" />
                <div>
                  <span>{item.examBeginTime}</span>
                  至
                  <span>{item.examEndTime}</span>
                </div>
              </WingBlank>
              <WhiteSpace size="lg" />
            </div>
          )
        }
      </PullToRefresh>
    </div>);
  }
}
// const IndexFrom = createForm()(Index);
export default Index;

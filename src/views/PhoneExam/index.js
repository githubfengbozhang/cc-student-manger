import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';
import $axios from "@/axios/$axios";
// import { WingBlank, Picker, List, WhiteSpace } from 'antd-mobile';
// import { createForm } from 'rc-form';
import { PullToRefresh, WingBlank, WhiteSpace } from 'antd-mobile';
import './index.scss'


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      data: [],
      pageNum: 0,
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
      if (code === 0 && data.length > 0) {
        debugger
        history.push({ pathname: '/PhoneQuestion', state: { 'questionData': data, ...record } })
        localStorage.setItem('/PhoneQuestion', JSON.stringify({ 'questionData': data, ...record }))
      }
    })
  }
  // 获取列表数据
  genData = () => {
    let that = this;
    let dataArr = this.state.data;
    const { status, courseId, type, pageNum, pageSize } = that.state
    const param = {
      pageNum: pageNum + 1
    }
    $axios.post("/exam/api/student/task/queryExamTaskByUserId", qs.stringify({ status, courseId, type, pageNum: param.pageNum, pageSize })).then((res) => {
      const {
        code,
        rows
      } = res.data
      if (code === 0) {
        dataArr = rows.concat(dataArr)
        this.setState({
          data: dataArr,
          pageNum: param.pageNum
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
            <div className="bb-1" onClick={(e) => this.exam(e, item)}>
              <WhiteSpace size="lg" />
              <WingBlank>
                <span className="mr-20">{item.courseName}</span>
                <span className="mr-20">{item.title}</span>
                <span className="mr-20">{item.teacherName}</span>
                <div className="mt-10">
                  <span>{item.duration || 0}分钟</span>
                </div>
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

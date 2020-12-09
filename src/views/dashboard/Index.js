import React, { Component } from 'react';
import TypingCard from '../../components/TypingCard'
import Chart from '@/components/chart/Chart';
import { connect } from 'react-redux';
import { Pagination, DatePicker, Select } from 'antd';
import './index.scss';
import { targetChart, testChart, examResultChart, examChart, examChart1 } from './options.js'
import qs from 'qs';
import $axios from "@/axios/$axios";
import jangbei from '../../../src/assets/img/jangbei.jpg';
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noData: false,
      targetCharList: [],
      testChartList: [],
      examResultChartList: [],
      courseSelectList: [],
      rankDesc: '',
      rank: '',
      rankTixin: '',
      courseId: '',
      total: '',
      title: '',
      mode: ['month', 'month'],
      examChartList: [],
      examChartList1: [],
      testTime: '', // 测试时间查询
      examTime: [], // 课程对比
    }
  }
  // 总目标统计
  getTargetChar = () => {
    let { courseId } = this.state
    if (!courseId) {
      courseId = -1
    }
    $axios.post("/exam/api/student/report/queryIndexTargetCharByCourseId", qs.stringify({ courseId })).then(res => {
      const {
        code,
        data: {
          content
        }
      } = res.data

      const tempList = content.map(item => {
        const tempObject = {
          value: item.typeNum * 1,
          name: item.targetName
        }
        return tempObject
      })

      if (code === 0) {
        this.setState({
          targetCharList: tempList
        })
      }
    })
  }
  // 测试
  getTestChart = () => {
    let flagType = 1;
    const { testTime } = this.state
    $axios.post("/exam/api/student/report/queryIndexExamNumByUserId", qs.stringify({ flagType, time: testTime })).then(res => {
      const {
        code,
        data: {
          content
        }
      } = res.data
      const tempList = content.map(item => {
        const tempObject = {
          value: item.num * 1,
          name: item.type
        }
        return tempObject
      })
      if (code === 0) {
        this.setState({
          testChartList: tempList
        })
      }
    })

  }

  // 近期课程
  getExamResultChart = () => {
    $axios.post("/exam/api/student/report/queryIndexExamResultByCourseId").then(res => {
      const {
        code,
        data: {
          content,
          rankDesc,
          rankTixin,
          total,
          title,
          rank
        }
      } = res.data
      const tempList = content.map(item => {
        const tempObject = {
          value: item.total,
          name: item.title
        }
        return tempObject
      })
      if (code === 0) {
        this.setState({
          examResultChartList: tempList,
          rankDesc,
          rankTixin,
          total,
          title,
          rank
        })
      }
    })

  }

  // 课程对比
  getExamChartChart = () => {
    let flagType = 1
    const { examTime } = this.state
    $axios.post("/exam/api/student/report/queryIndexExamChartByUserId", qs.stringify({ flagType, timeBgn: examTime[0], timeEnd: examTime[0] })).then(res => {
      const {
        code,
        data: {
          content,
          nl,
          sz,
          zs
        }
      } = res.data
      const tempList = content.map(item => {
        const tempObject = {
          value: item.num,
          name: item.time
        }
        return tempObject
      })

      if (code === 0) {
        const tempObject = {
          "知识": zs,
          "能力": nl,
          "素质": sz
        }
        this.setState({
          examChartList: tempList,
          examChartList1: tempObject,
        })
      }
    })

  }
  /**
   * 测试时间查询
   */
  testDate = (valvalue, dateStringue) => {
    this.setState({
      testTime: dateStringue
    }, () => {
      this.getTestChart()
    })
  }
  handlePanelChange = (value, mode) => {
    debugger
    this.setState({
      examTime: value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  }
  handleChange = value => {
    debugger
  };
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
  selecthHandleChange = (courseId) => {
    this.setState({
      courseId
    }, () => {
      this.getTargetChar()
    })
  }
  componentDidMount () {
    this.getTargetChar()
    this.getTestChart()
    this.getExamResultChart()
    this.getExamChartChart()
    this.getCourseSelectList()
  }
  render () {
    const { mode, courseSelectList, courseId, state, targetCharList, testChartList, examResultChartList, rankDesc, rankTixin, total, title, examChartList, rank, examChartList1, examTime } = this.state
    const cardContent = `欢迎登录重庆工业职业技术学院人才培养管理监测系统。`
    return (
      <div >
        {
          state ? <div className="shadow-radius">
            <TypingCard source={cardContent} ></TypingCard>
          </div> : null
        }

        <div className="shadow-radius">
          <div className="chart-block">
            <div className="data-flex">
              <div style={{ width: '100%', marginRight: '10px', position: 'relative' }}>
                <div className="query">课程：
                <Select style={{ width: 150 }} value={courseId} onSelect={(e) => this.selecthHandleChange(e)} placeholder="请选择课程">
                    <Option value='' >全部</Option>
                    {
                      courseSelectList.map((item, key) => <Option value={item.courseId} key={key}>{item.courseName}</Option>)
                    }
                  </Select>
                </div>
                <div>总目标统计</div>
                {

                  targetCharList.length > 0 ? <Chart chartData={targetChart(targetCharList)} className={'block-line'} height={'400px'} width={'100%'} style={{ padding: 0 }} {...this.props} /> : null
                }
              </div>
              <div style={{ width: '100%', position: 'relative' }}>
                <div>测试统计</div>
                <div className="query">时间：<MonthPicker onChange={this.testDate.bind(this)} placeholder="请选择时间" /></div>
                {

                  testChartList.length > 0 ? <Chart chartData={testChart(testChartList)} className={'block-line'} height={'400px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
                    : null
                }

              </div>
              <div style={{ width: '100%', marginLeft: '10px' }}>
                <div>近期课程</div>
                {
                  examResultChartList.length > 0 ? <Chart chartData={examResultChart(examResultChartList, total, title)} className={'block-line'} height={'400px'} width={'100%'} style={{ padding: 0 }} {...this.props} /> :
                    null
                }

              </div>
            </div>
            <div className="data-flex">
              <div style={{ width: '100%', marginRight: '10px', position: 'relative' }}>
                <div>课程对比</div>
                <div className="query">时间：
                <MonthPicker placeholder="选择开始日期" />
                  <span style={{ padding: '0 15px' }}>至</span>
                  <MonthPicker placeholder="选择结束日期" />
                </div>
                <div className="exam-chart">
                  {
                    examChartList.length > 0 ? <Chart chartData={examChart(examChartList)} className={'block-line'} height={'400px'} width={'650px'} style={{ padding: 0 }} {...this.props} /> :
                      null
                  }
                  {
                    examChartList.length > 0 ? <Chart chartData={examChart1(examChartList1)} className={'block-line'} height={'400px'} width={'450px'} style={{ padding: 0 }} {...this.props} /> :
                      null
                  }
                </div>
                {/* <Chart chartData={targetChart()} className={'block-line'} height={'400px'} width={'1100px'} style={{ padding: 0 }} {...this.props} /> */}
              </div>
              <div style={{ width: '100%' }}>
                <div>总目标统计</div>
                <div className="mubiao">
                  <img src={jangbei} className="imgSrc" />
                  <div style={{ margin: "50px 20px" }}>{rankDesc}</div>
                  <div>{rankTixin}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    collapse: state.collapse
  };
};
export default connect(mapStateToProps)(Index);

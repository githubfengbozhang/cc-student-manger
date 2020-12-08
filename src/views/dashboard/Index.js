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

const chartBarData = {
  backgroundColor: '#fff',
  title: {
    top: 30,
    text: '推荐提升',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16,
      color: '#57617B'
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  // tab
  legend: {
    data: ['基础知识', '课程学习', '考试通过率'],
    right: '2%',
    top: 20
  },
  grid: {
    top: 80,
    left: '2%',
    right: '2%',
    bottom: '6%',
    containLabel: true
  },
  // x轴
  xAxis: [
    {
      type: 'category', //分类
      data: ['JAVA', 'SQL数据库', 'HTML', '数据算法', '网络应用', 'CSS3', 'JAVASCRIPT', '计算机组装', 'Web开发', '计算机应用']
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '基础知识',
      type: 'bar',
      data: [8.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0],
      markPoint: {
        data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
      },
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      },
      itemStyle: {
        normal: {
          // 设置柱状图颜色
          color: '#1890FF',
          // 以下为是否显示，显示位置和显示格式的设置了
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
            // formatter: '{b}\n{c}'
          }
        }
      }
      // 设置柱的宽度，要是数据太少，柱子太宽不美观~
      // barWidth:100
    },
    {
      name: '课程学习',
      type: 'bar',
      data: [10.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8],
      markPoint: {
        data: [{ name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 }, { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }]
      },
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      },
      itemStyle: {
        normal: {
          // 设置柱状图颜色
          color: '#001529'
        }
      }
    },
    {
      name: '考试通过率',
      type: 'bar',
      data: [10.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8],
      markPoint: {
        data: [{ name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 }, { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }]
      },
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      },
      itemStyle: {
        normal: {
          // 设置柱状图颜色
          color: '#20e0ce'
        }
      }
    }
  ]
};

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
      examTime: '', // 课程对比
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
    this.setState({
      examTime: value
    })
  }
  handleChange = value => {
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
    const { courseSelectList, courseId, state, targetCharList, testChartList, examResultChartList, rankDesc, rankTixin, total, title, examChartList, rank, examChartList1, examTime } = this.state
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
                <RangePicker
                    placeholder={['Start month', 'End month']}
                    value={examTime}
                    format="YYYY-MM"
                    mode={['month', 'month']}
                    onChange={this.handleChange.bind(this)}
                    onPanelChange={this.handlePanelChange.bind(this)}
                  />
                </div>
                <div className="exam-chart">
                  <div>
                    {
                      examChartList.length > 0 ? <Chart chartData={examChart(examChartList)} className={'block-line'} height={'400px'} width={'650px'} style={{ padding: 0 }} {...this.props} /> :
                        null
                    }
                  </div>
                  <div>
                    {
                      examChartList.length > 0 ? <Chart chartData={examChart1(examChartList1)} className={'block-line'} height={'400px'} width={'450px'} style={{ padding: 0 }} {...this.props} /> :
                        null
                    }
                  </div>
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

import React, { Component } from 'react';
import { Select, Form, DatePicker, Button, Table, Divider, Modal, notification, Progress } from 'antd';
import './index.scss';
import qs from 'qs';
import $axios from "@/axios/$axios";
import { connect } from 'react-redux';
import Chart from '@/components/chart/Chart';
import { taskChart, contrastChart } from './options.js'

const { Option } = Select;

class ExamAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      analysis: {}
    }
  }
  // 获取modal数据
  getData = () => {
    let that = this;
    const { paperId, paperType } = that.props.row
    $axios.post("/exam/api/student/report/queryIndexExamAnalysis", qs.stringify({ paperId, type: paperType })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        that.setState({
          analysis: data
        })
      }
    })
  }
  // 关闭弹窗
  handleCallCharts = () => {
    this.props.onChangeExamAnalysisVisible(false)
  }
  // 生命周期
  componentDidMount () {
    this.getData()
  }
  render () {
    const { analysis } = this.state
    const { visibleCharts } = this.props
    return (
      <div>
        <Modal
          title="综合分析"
          visible={visibleCharts}
          onCancel={this.handleCallCharts}
          cancelText="关闭"
          okText=""
          maskClosable={false}
          style={{ height: '500px' }}
        >
          <div>
            <div>
              <div>
                <div className="questionSum">答题总数</div>
                <div className="totalSum">{analysis.questionTotal ? analysis.questionTotal : 0}道</div>
              </div>
              <div>
                <div className="questionSum">总分数</div>
                <div className="totalSum">{analysis.examGrade ? analysis.examGrade : 0}分</div>
                <div className="fraction questionTime">
                  <div style={{ fontSize: '28px' }}>答题时间</div>
                  <div className="totalSum" style={{ border: 'none' }}>
                    <span>用时最长的时间：{analysis.examLongTime ? analysis.examLongTime : 0}分钟</span>
                    <span style={{ marginLeft: '30px' }}>用时最少的时间：{analysis.examShotTime ? analysis.examShotTime : 0}分钟</span></div>
                </div>
              </div>
              <div className="info">
                <div className="ranking">
                  {analysis.rankDesc ? analysis.rankDesc : ''}
                  {
                    analysis.rank ?
                      <Progress percent={analysis.rank.replace('%', '')} size="small" />
                      :
                      <Progress percent={0} size="small" />
                  }

                </div>

                <div>
                  <div style={{ fontWeight: '800' }}>本次测试排名</div>
                  <div>第{analysis.gradeRank ? analysis.gradeRank : 0}名</div>
                </div>
              </div>
              <div className="complete">
                {
                  analysis.target && analysis.target.length > 0 ?
                    analysis.target.filter(item => item.flag * 1 === 0).map(item => (
                      <div style={{ fontSize: '14px', padding: '5px 0' }}>
                        {item.name}
                        <Progress percent={item.num} size="small" format={percent => (percent ? percent : 0) + '个'} />
                      </div>
                    )) : null

                }

                {/* <div style={{ fontSize: '14px', padding: '5px 0' }}>
                  C#完成情况
                  <Progress percent={50} size="small" />
                </div>
                <div style={{ fontSize: '14px', padding: '5px 0' }}>
                  HTML完成情况
                  <Progress percent={60} size="small" />
                </div> */}
              </div>
              <div>
                <div style={{ fontSize: '16px', padding: '20px 0', fontWeight: 800 }}>{analysis.rankTixin ? analysis.rankTixin : ''}</div>
                <div style={{ fontSize: '16px', paddingBottom: '20px', fontWeight: 800 }}>{analysis.rankDesc2 ? analysis.rankDesc2 : ''}</div>
              </div>
              <div className="charts" style={{ marginTop: '0' }}>
                {
                  analysis.target ?
                    <Chart chartData={contrastChart(analysis.target)} className={'block-line'} height={'300px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
                    : null
                }
              </div>
            </div>

            <div className="charts">
              {
                analysis.target ?
                  <Chart chartData={taskChart(analysis.target)} className={'block-line'} height={'200px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
                  : null
              }

            </div>

          </div>
        </Modal>
      </div >
    );
  }
}
const mapStateToProps = state => {
  return {
    collapse: state.collapse
  };
};
export default connect(mapStateToProps)(ExamAnalysis);
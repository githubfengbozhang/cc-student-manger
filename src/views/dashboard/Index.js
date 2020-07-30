import React, { Component } from 'react';
import TypingCard from '../../components/TypingCard'
import Chart from '@/components/chart/Chart';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import './index.scss'

const chartData = {
  backgroundColor: '#fff',
  title: {
    top: 30,
    text: '综合分析',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16,
      color: '#57617B'
    },
    left: 'center'
  },
  color: ['#001529', '#1890FF', '#20e0ce'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    x: 20,
    data: ['知识', '能力', '素质'],
    top: 20
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [{ value: 100, name: '知识' }, { value: 50, name: '能力' }, { value: 50, name: '素质' }]
    }
  ]
};
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
      noData: false
    }
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { state } = this.state
    const cardContent = `欢迎登录重庆工业职业技术学院考试测评系统。`
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
              <div style={{ width: '100%', marginRight: '10px' }}>
                <Chart chartData={chartData} className={'block-line'} height={'400px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
              </div>
              <div style={{ width: '100%', marginLeft: '10px' }}>
                <Chart chartData={chartBarData} className={'block-line'} height={'400px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
              </div>
            </div>
          </div>
          <Pagination defaultCurrent={1} total={50} className="mt-40" />
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

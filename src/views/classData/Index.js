import React from 'react';
import './index.scss';
import { Select, Form, DatePicker, Button, Table } from 'antd';
import Chart from '@/components/chart/Chart';
import { connect } from 'react-redux';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const chartData = {
  backgroundColor: '#fff',
  title: {
    top: 30,
    text: '答题正错统计',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16,
      color: '#57617B'
    },
    left: 'center'
  },
  color: ['#001529', '#1890FF'],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    x: 20,
    data: ['正确率', '错误率'],
    top: 20
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [{ value: 100, name: '正确率' }, { value: 50, name: '错误率' }]
    }
  ]
};
const chartBarData = {
  backgroundColor: '#fff',
  title: {
    top: 30,
    text: '知识点正错统计',
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
    data: ['正确率', '错误率'],
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
      data: ['A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点', 'A知识点']
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
      name: '正确率',
      type: 'bar',
      data: [8.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
      name: '错误率',
      type: 'bar',
      data: [10.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
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
    }
  ]
};
const dataSource = [
  {
    key: '1',
    name: '2020-07-25',
    age: 'JAVA',
    address: '89',
    address1: '11'
  }
];

const columns = [
  {
    title: '时间',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '科目',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '分数',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '排名',
    dataIndex: 'address1',
    key: 'address1',
  }
];
class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  onChange = () => { }
  render () {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      layout: 'inline'
    };
    return (
      <div >
        <div className="query-content">
          <Form  {...layout}>
            <FormItem label="时间" name="size">
              <RangePicker onChange={() => this.onChange} />
            </FormItem>
            <FormItem label="课程" name="class">
              <Select defaultValue="学习中" style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程状态">
                <Option value="全部">全部</Option>
                <Option value="已结束">已结束</Option>
                <Option value="学习中">学习中</Option>
              </Select>
            </FormItem>
            <FormItem name="size">
              <Button type="primary" className="ml-20">查询</Button>
            </FormItem>
          </Form>

        </div>
        <div>

        </div>
        <div className="shadow-radius">
          <Table pagination={false} dataSource={dataSource} columns={columns} style={{ marginBottom: '40px', width: "800px" }} className="table-box" />
          <div className="data-flex">
            <div style={{ width: '100%', marginRight: '10px' }}>
              <Chart chartData={chartData} height={'200px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
            </div>
            <div style={{ width: '100%', marginLeft: '10px' }}>
              <Chart chartData={chartBarData} height={'200px'} width={'100%'} style={{ padding: 0 }} {...this.props} />
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
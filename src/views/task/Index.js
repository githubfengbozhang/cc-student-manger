import React, { Component } from 'react';
import { Select, Form, DatePicker, Button, Table, Divider, Modal } from 'antd';
import './index.scss';
import qs from 'qs';
import $axios from "@/axios/$axios";

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Column } = Table;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      status: '',
      courseId: '',
      beginTime: '',
      endTime: '',
      pageNum: 1,
      pageSize: 10,
      type: '',
      courseSelectList: [],
      list: [],
      modalData: {}
    };
  }
  handleOk = () => {
    let that = this
    setTimeout(() => {
      that.setState({
        visible: false,
      });
    })

  };
  onChangeRangePicker = (data) => {
  }
  // 获取列表数据
  getData = () => {
    let that = this;
    const { status, courseId, type, pageNum, pageSize, beginTime, endTime } = that.state
    $axios.post("/exam/api/student/task/queryExamTaskByUserId", qs.stringify({ status, courseId, type, pageNum, pageSize, beginTime, endTime })).then((res) => {
      const {
        code,
        rows
      } = res.data
      if (code === 0) {
        that.setState({
          list: rows
        })
      }
    })
  }
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
  // 考试提示弹窗
  getModalData = () => {
    let that = this;
    const { status, courseId, type } = that.state
    $axios.post("/exam/api/student/task/queryExamTaskByUserId", qs.stringify({ status, courseId, type })).then((res) => {
      const {
        code,
        rows
      } = res.data
      if (code === 0) {
        that.setState({
          modalData: rows[0] || {},
          visible: true
        })
      }
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    let that = this;
    that.props.form.validateFields((err, values) => {
      if (!err) {
        const data = values.date
        that.setState({
          status: values.status,
          courseId: values.courseId,
          type: values.type,
          beginTime: data[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: data[1].format('YYYY-MM-DD HH:mm:ss'),
        }, () => {
          that.getData()
        })

      }
    });
  }
  getPagination = (pagination) => {
    console.log(pagination)
  }
  componentDidMount () {
    this.getData()
    this.getCourseSelectList()
    this.getModalData()
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { getFieldDecorator } = this.props.form;
    const { list, courseSelectList, visible, modalData } = this.state
    return (
      <div className="task">
        <div className="query-content">
          <Form  {...layout} onSubmit={this.handleSubmit}>

            <FormItem label="课程" name="class">
              {
                getFieldDecorator('courseId')(
                  <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程">
                    <Option value='' >全部</Option>
                    {
                      courseSelectList.map((item, key) => <Option value={item.courseId} key={key}>{item.courseName}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="时间" name="size">
              {
                getFieldDecorator('date')(
                  <RangePicker onChange={() => this.onChangeRangePicker} />
                )
              }

            </FormItem>
            <FormItem label="任务状态" name="class">
              {
                getFieldDecorator('status')(
                  <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程状态">
                    <Option value="">全部</Option>
                    <Option value="0">进行中</Option>
                    <Option value="1">已结束</Option>
                  </Select>
                )
              }

            </FormItem>
            <FormItem label="任务类型" name="class">
              {
                getFieldDecorator('type')(
                  <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程状态">
                    <Option value="">全部</Option>
                    <Option value="0">考试</Option>
                    <Option value="1">作业测试</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem name="size">
              <Button type="primary" htmlType="submit" className="ml-20">查询</Button>
            </FormItem>
          </Form>
        </div>
        <div className="shadow-radius">
          <Table dataSource={list} rowKey={value => value.classId} onChange={() => this.getPagination()}>
            <Column title="考试/作业" dataIndex="courseName" key="courseName" />
            <Column title="课程名称" dataIndex="title" key="title" />
            <Column title="老师" dataIndex="teacherName" key="teacherName" />
            <Column title="开始时间" dataIndex="examBeginTime" key="examBeginTime" />
            <Column title="结束时间" dataIndex="examEndTime" key="examEndTime" />
            <Column title="考试时长" dataIndex="duration" key="duration" />
            <Column title="任务状态" dataIndex="status" key="status"
              render={(text, record) => {
                debugger
                if (record.status * 1 === 0) {
                  return '进行中'
                } else if (record.status * 1 === 1) {
                  return '已结束'
                } else {
                  return '-'
                }
              }}
            />
            <Column
              title="操作"
              key="action"
              width={200}
              render={(text, record) => (
                <span>
                  <a href='#'>查看</a>
                  <Divider type="vertical" />
                  <a href='#'>重做</a>
                </span>
              )}
            />
          </Table>
        </div>
        {
          visible ?
            <Modal
              title="任务提醒"
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleOk}
              cancelText="稍后处理"
              okText="立即前往"
              maskClosable={false}
            >
              亲爱的同学，你当前还有一门考试 <span className="task-text-color">《{modalData.title}》</span> 需要去完成，请尽快处理！
            </Modal> : null
        }
      </div>
    );
  }
}

export default Form.create()(Index);

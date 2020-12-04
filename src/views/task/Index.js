import React, { Component } from 'react';
import { Select, Form, DatePicker, Button, Table, Divider, Modal, notification } from 'antd';
import './index.scss';
import qs from 'qs';
import $axios from "@/axios/$axios";
import { withRouter } from 'react-router-dom'

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Column } = Table;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      status: 0,
      courseId: '',
      beginTime: '',
      endTime: '',
      pageSize: 10,
      type: '',
      courseSelectList: [],
      list: [],
      modalData: {},
      current: 1,
      total: 0
    };
  }
  // 弹窗确定
  handleOk = (e, modalData) => {
    let that = this
    setTimeout(() => {
      that.setState({
        visible: false,
      }, () => {
        that.exam(e, modalData)
      });
    })
  };
  handleCall = () => {
    setTimeout(() => {
      this.setState({
        visible: false,
      });
    })
  }
  onChangeRangePicker = (data) => {
  }
  // 获取列表数据
  getData = () => {
    let that = this;
    const { status, courseId, type, current, pageSize, beginTime, endTime } = that.state
    $axios.post("/exam/api/student/task/queryExamTaskByUserId", qs.stringify({ status, courseId, type, current, pageSize, beginTime, endTime })).then((res) => {
      const {
        code,
        rows,
        total
      } = res.data
      if (code === 0) {
        that.setState({
          list: rows,
          total
        })
      }
    })
  }
  // 课程下拉数据
  getCourseSelectList = () => {
    let that = this;
    // let status = that.state.status
    let courseId = that.state.courseId
    $axios.post("/exam/api/student/course/queryCourseByUserId", qs.stringify({ courseId })).then((res) => {
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
        if (rows.length === 0 || (rows[0] && rows[0].taskExamStatus * 1 === 0)) {
          return
        }
        that.setState({
          modalData: rows[0] || {},
          visible: true
        })
      }
    })
  }
  // 查询数据
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
          beginTime: data ? `${data[0].format('YYYY-MM-DD')} 00:00:00` : '',
          endTime: data ? `${data[1].format('YYYY-MM-DD')} 23:59:59` : '',
        }, () => {
          that.getData()
        })

      }
    });
  }
  // 分页
  changePage = (current, pageSize) => {
    let that = this
    that.setState({
      current,
      pageSize
    }, () => {
      that.getData()
    })
  }
  // pageSize变化
  showSizeChange = (current, pageSize) => {
    let that = this
    that.setState({
      current,
      pageSize
    }, () => {
      that.getData()
    })
  }
  componentDidMount () {
    this.getData()
    this.getCourseSelectList()
    this.getModalData()
  }
  // 考试
  exam = (e, record) => {
    let that = this;
    let { history } = that.props

    const { courseId, paperId, paperType, userId, taskExamStatus, status } = record
    $axios.post("/exam/api/student/question/queryQuerstionSortByPaperId", qs.stringify({ courseId, paperId, paperType, userId })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        const examEndTime = new Date(data.examEndTime)
        const systemTime = new Date(data.systemTime)
        const examBeginTime = new Date(data.examBeginTime)
        if (data.examSort.length === 0 && status * 1 === 0) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学,还未查询到相关的考试信息，请耐心等待或联系管理员。',
          });
          return
        }
        // 考试时间结束
        if (examEndTime.getTime() < systemTime.getTime()) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学,考试时间已结束。',
          });
          return
        }
        // 开始时间验证
        if (examBeginTime.getTime() > systemTime.getTime()) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学,答题时间还未开始，请耐心等待。',
          });
          return
        }
        // paperType 0 为考试 1为作业
        // taskExamStatus 0是完成
        if (taskExamStatus * 1 === 0) {
          notification['info']({
            message: '温馨提示！',
            description:
              '亲爱的同学,您已答题完成，请再任务时间之后查看答题结果。',
          });
          return
        }
        history.push({ pathname: '/question', state: { 'questionData': data, ...record } })
        localStorage.setItem('/question', JSON.stringify({ 'questionData': data, ...record }))
      }
    })
  }
  /**
   * 查看
   */
  view = (e, record) => {
    e.preventDefault();
    let that = this;
    // 考试时间结束
    if (record.taskExamStatus * 1 === 1) {
      notification['info']({
        message: '温馨提示！',
        description:
          '亲爱的同学,请结束后查看。',
      });
      return
    }
    let { history } = that.props
    history.push({ pathname: '/view', state: { ...record } })
    localStorage.setItem('/view', JSON.stringify({ ...record }))
  }
  /**
   * 综合分析
   */
  analysis = (e,record) => {
    e.preventDefault();
    let that = this;
    let { history } = that.props
    history.push({ pathname: '/classData', state: { ...record } })
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const { pageSize, current, total } = this.state
    let pagination = {
      pageSize: pageSize,
      current: current,
      total: total,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '50', '100'],
      onChange: this.changePage,
      onShowSizeChange: this.showSizeChange
    }
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
                  <RangePicker />
                )
              }

            </FormItem>
            <FormItem label="任务状态" name="class">
              {
                getFieldDecorator('status', {
                  initialValue: '0'
                })(
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
          <Table dataSource={list} rowKey={value => value.title} pagination={pagination}>
            <Column title="考试/作业" dataIndex="title" key="title" />
            <Column title="课程名称" dataIndex="courseName" key="courseName" />
            <Column title="教师" dataIndex="teacherName" key="teacherName" />
            <Column title="开始时间" dataIndex="examBeginTime" key="examBeginTime" />
            <Column title="结束时间" dataIndex="examEndTime" key="examEndTime" />
            <Column title="考试时长" dataIndex="duration" key="duration" />
            <Column title="状态" dataIndex="status" key="status"
              render={(text, record) => {
                if (record.status * 1 === 0) {
                  return '进行中'
                } else if (record.status * 1 === 1) {
                  return '已结束'
                } else {
                  return '-'
                }
              }}
            />
            <Column title="类型" dataIndex="paperType" key="paperType"
              render={(text, record) => {
                if (record.paperType * 1 === 0) {
                  return (
                    <div className="exam-class">
                      考试
                    </div>
                  )
                } else if (record.paperType * 1 === 1) {
                  return (
                    <div className="task-class">
                      作业测试
                    </div>
                  )
                } else {
                  return '-'
                }
              }}
            />
            <Column title="完成情况" dataIndex="taskExamStatus" key="taskExamStatus"
              render={(text, record) => {
                if (record.taskExamStatus * 1 === 0) {
                  return '已完成'
                } else if (record.taskExamStatus * 1 === 1) {
                  return '进行中'
                } else {
                  return '未开始'
                }
              }}
            />
            <Column
              title="操作"
              key="action"
              width={150}
              render={(text, record) => {
                if(record.status * 1 === 1){
                   return (
                    <span>
                        <a href='/#' onClick={(e) => this.view(e, record)}>查看</a>
                        <Divider type="vertical" />
                        <a href='/#' onClick={(e) => this.analysis(e, record)}>综合分析</a>
                  </span>
                   )
                }else{
                    return (
                        <span>
                            <a href='/#' onClick={(e) => this.view(e, record)}>查看</a>
                            <Divider type="vertical" />
                            <a onClick={(e) => this.exam(e, record)}>答题</a>
                        </span>
                    )
                }
                
              }}
            />
          </Table>
        </div>
        {
          visible ?
            <Modal
              title="任务提醒"
              visible={visible}
              onOk={(e) => this.handleOk(e, modalData)}
              onCancel={this.handleCall}
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

export default withRouter(Form.create()(Index));

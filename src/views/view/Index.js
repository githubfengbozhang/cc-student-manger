import React, { Component } from 'react';
import { Table, Divider, Modal, notification } from 'antd';
import qs from 'qs';
import $axios from "@/axios/$axios";
import { withRouter } from 'react-router-dom';

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
          list: [{
            courseName: 1,
            title: 'JAVA的基本类型有哪些',
            examBeginTime: 'string',
            teacherName: "Array",
            examEndTime: '错误',
            duration: '填空题'
          }]
        })
      }
    })
  }
  componentDidMount () {
    this.getData()
  }
  render () {
    const { list } = this.state
    return (
      <div className="task">
        <div className="shadow-radius">
          <Table dataSource={list} rowKey={value => value.classId} onChange={() => this.getPagination()} pagination={false}>
            <Column title="序号" dataIndex="courseName" key="courseName" />
            <Column title="题目" dataIndex="title" key="title" />
            <Column title="答案" dataIndex="teacherName" key="teacherName" />
            <Column title="我的答案" dataIndex="examBeginTime" key="examBeginTime" />
            <Column title="是否正确" dataIndex="examEndTime" key="examEndTime" />
            <Column title="类型" dataIndex="duration" key="duration" />
          </Table>
        </div>
      </div>
    )
  }
}
export default withRouter(Index);
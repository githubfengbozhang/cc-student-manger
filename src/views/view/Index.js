import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import qs from 'qs';
import $axios from "@/axios/$axios";
import { withRouter } from 'react-router-dom';
import './index.scss';
import { replaceString } from "@/utils/formmate.js"

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
    const { courseId, paperId, paperType } = this.props.location.state
    $axios.post("/exam/api/student/record/queryRecordByUserId", qs.stringify({ courseId, paperId, paperType })).then((res) => {
      const {
        code,
        data
      } = res.data
      if (code === 0) {
        that.setState({
          list: data
        })
      }
    })
  }
  componentDidMount () {
    if (!this.props.location.state) {
      this.props.location.state = localStorage.getItem("/view") && JSON.parse(localStorage.getItem("/view"))
    }
    this.getData()
  }
  replace = (value) => {
    return replaceString(value)
  }
  render () {
    const { list } = this.state
    return (
      <div className="task">
        <div className="shadow-radius">
          <Table dataSource={list} rowKey={value => value.questionTitle} onChange={() => this.getPagination()} pagination={false}>
            <Column title="序号"
              key={(record, index) => index}
              width={70}
              render={(text, record, index) => `${index + 1}`}
            ></Column>
            <Column title="题目" dataIndex="questionTitle" key="questionTitle" width={600}
              render={(text, record) => {
                return (
                  <div>
                    <div className="questionTitle">{this.replace(record.questionTitle)}</div>
                    {/* <Divider></Divider> */}
                    <div>{record.itemTitle}</div>
                  </div>
                )
              }}
            />
            <Column title="答案" dataIndex="examAnswer" key="examAnswer" width={300} />
            <Column title="我的答案" dataIndex="answer" key="answer" width={300} />
            <Column title="是否正确" dataIndex="correct" key="correct" width={150}
              render={(text, record) => {
                if (record.correct === "错误") {
                  return (
                    <div>{record.correct}(<Icon type="close" />)</div>
                  )
                } else if (record.correct === "正确") {
                  return (
                    <div>{record.correct}(<Icon type="check" />)</div>
                  )
                } else {
                  return (
                    <div>{record.correct}(<Icon type="question" />)</div>
                  )
                }
              }}
            />
            <Column title="类型" dataIndex="questionType" key="questionType" width={150} />
          </Table>
        </div>
      </div>
    )
  }
}
export default withRouter(Index);
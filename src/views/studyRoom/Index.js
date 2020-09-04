import React, { Component } from 'react';
import { Select, Form, Button } from 'antd';
import TypingCard from '../../components/TypingCard';
import qs from 'qs';
import $axios from "@/axios/$axios";
import './index.scss';

const { Option } = Select;
const FormItem = Form.Item
class Index extends Component {
  constructor() {
    super();
    this.state = {
      hidden: true,
      buttonDisabled: false,
      courseSelectList:[]
    }
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
  startExam = () => {
    let that = this
    setTimeout(() => {
      that.setState({
        hidden: false,
        // buttonDisabled: !that.state.buttonDisabled
      })
    })
  }
  componentDidMount () {
    this.getCourseSelectList()
  }
  componentWillMount () {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', this.beforeunload);
    
  }
  componentWillUnmount () {
    // 销毁拦截判断是否离开当前页面
    window.removeEventListener('beforeunload', this.beforeunload);
  }
  beforeunload (e) {
    let confirmationMessage = '刷新页面后测试重新开始，是否继续？';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    const cardContent = `请选择自测模式、课程、题库后,点击开始按钮进行自测`
    const {  buttonDisabled,courseSelectList } = this.state
    return (
      <div>
        {
          <div className="shadow-radius" >
          <Form  {...layout} style={{ textAlign: "center" }}>
            <FormItem label="课程" name="class">
              <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程">
                {
                  courseSelectList.map((item, key) => <Option value={item.courseId} key={key}>{item.courseName}</Option>)
                }
              </Select>
            </FormItem>
          </Form>
          <div className="ts-contetn">
            <TypingCard source={cardContent} fontSize={20}></TypingCard>
            <Button type="primary" size="large" disabled={buttonDisabled} className="start-btn" onClick={() => this.startExam()}>
              开始答题
            </Button>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default Index;

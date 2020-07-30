import React, { Component } from 'react';
import { Select, Form, Button, Radio } from 'antd';
import TypingCard from '../../components/TypingCard'
import './index.scss'

const { Option } = Select;
const FormItem = Form.Item
class Index extends Component {
  constructor() {
    super();
    this.state = {
      hidden: true,
      buttonDisabled: false
    }
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
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '50px',
    };
    const cardContent = `请选择自测模式、课程、题库后,点击开始按钮进行自测`
    const { hidden, buttonDisabled } = this.state
    return (
      <div>
        {
          hidden ? <div className="shadow-radius" >
            <Form  {...layout} style={{ textAlign: "center" }}>
              <FormItem label="模式" name="size">
                <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择模式">
                  <Option value="全部">全部</Option>
                  <Option value="c++">c++</Option>
                  <Option value="jave">jave</Option>
                  <Option value="html">html</Option>
                </Select>
              </FormItem>
              <FormItem label="课程" name="class">
                <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程">
                  <Option value="JAVA">JAVA</Option>
                  <Option value="html">html</Option>
                  <Option value="Recat">Recat</Option>
                </Select>
              </FormItem>
              <FormItem label="题库" name="class">
                <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择题库">
                  <Option value="全部">全部</Option>
                  <Option value="已结束">已结束</Option>
                  <Option value="学习中">学习中</Option>
                </Select>
              </FormItem>
            </Form>
            <div className="ts-contetn">
              <TypingCard source={cardContent} fontSize={20}></TypingCard>
              <Button type="primary" size="large" disabled={buttonDisabled} className="start-btn" onClick={() => this.startExam()}>
                开始答题
              </Button>
            </div>
          </div> :
            <div className="shadow-radius">
              <div className="exam">
                <div className="exam-header">
                  <div className="exam-title">
                    <div><span className="exam-icon">单选题</span>1/100:JAVA所定义的版本不包括</div>
                    <div className="exam-content">
                      <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio style={radioStyle} value={1}>
                          JAVA2 EE
                        </Radio>
                        <Radio style={radioStyle} value={2}>
                          JAVA2 Card
                        </Radio>
                        <Radio style={radioStyle} value={3}>
                          JAVA2 ME
                        </Radio>
                        <Radio style={radioStyle} value={3}>
                          JAVA2 SE
                        </Radio>
                      </Radio.Group>
                    </div>
                    <div className="exam-btn">
                      <Button type="primary" size="large" disabled className="mr-20">上一题</Button>
                      <Button type="primary" size="large">下一题</Button>
                    </div>
                  </div>
                  <div>距离本次测试结束还有<span className="exam-time">00:20:00</span>小时</div>
                </div>

              </div>
            </div>
        }
      </div>
    );
  }
}

export default Index;

import React, { Component } from 'react';
import './index.scss';
import { Select, Form, Row, Col, Modal } from 'antd';
import { Icon } from 'antd'
import java from '../../../src/assets/img/myClass/java.jpg'

const { Option } = Select;
const FormItem = Form.Item;

class Index extends Component {
  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  render () {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      layout: 'inline'
    };
    return (
      <div >
        <div className="query-content">
          <Form  {...layout}>
            <FormItem label="课程" name="size">
              <Select style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程">
                <Option value="全部">全部</Option>
                <Option value="c++">c++</Option>
                <Option value="jave">jave</Option>
                <Option value="html">html</Option>
              </Select>
            </FormItem>
            <FormItem label="状态" name="class">
              <Select defaultValue="学习中" style={{ width: 150 }} onChange={this.handleChange} placeholder="请选择课程状态">
                <Option value="全部">全部</Option>
                <Option value="已结束">已结束</Option>
                <Option value="学习中">学习中</Option>
              </Select>
            </FormItem>
          </Form>

        </div>
        <div className="shadow-radius">
          <Row type="flex">
            {
              [{ name: 'Java', time: '2020-07-25', teacher: '张老师', state: '已结束' },
              { name: 'Html', time: '2020-07-25', teacher: '张老师', state: '已结束' },
              { name: 'React', time: '2020-07-25', teacher: '张老师', state: '进行中' },
              { name: 'Vue', time: '2020-07-25', teacher: '张老师', state: '进行中' }].map((item, key) => {
                return <ClassBlock item={item} key={key}></ClassBlock>
              })
            }
          </Row>
        </div>
      </div>
    );
  }
}

export default Index;
// 课程封面组件
class ClassBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  openModal = (item) => {
    this.setState({ visible: true })
  }
  handleOk = () => {
    let that = this
    setTimeout(() => {
      that.setState({
        visible: false,
      })
    })

  };
  render () {
    const { visible } = this.state;
    return (
      <Col className="class-col" onClick={() => this.openModal(this.props.item)}>
        <div className="class-fm">
          <div className="class-img-father">
            <img src={java} className="class-img" alt={java} />
            <div className="class-fm-state" style={{ color: this.props.item.state === "已结束" ? 'red' : '#00bfff' }}>{this.props.item.state}</div>
          </div>
          <div className="ml-20 font-size-22 class-fm-name">{this.props.item.name}</div>
          <div className="class-fm-info"><span><Icon type="history" />{this.props.item.time}</span><span><Icon type="user" />{this.props.item.teacher}</span></div>
        </div>
        {
          visible ? <Modal
            title="课程详情"
            visible={this.state.visible}
            onOk={() => this.handleOk()}
            onCancel={() => this.handleOk()}
          >
            <p><label>课程：</label><span>Java</span></p>
            <p><label>内容：</label><span>Java基础语法</span></p>
            <p><label>课程周期：</label><span>180天</span></p>
          </Modal> : null
        }

      </Col>
    );
  }
}

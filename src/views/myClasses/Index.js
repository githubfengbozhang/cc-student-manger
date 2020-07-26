import React, { Component } from 'react';
import './index.scss';
import { Select, Form, Row, Col, Modal, Button } from 'antd';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
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
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
  render () {
    const { visible } = this.state;
    return (
      <Col className="gutter-row class-col" onClick={this.openModal(this.props.item)}>
        <div className="class-fm">
          <div className="class-img-father">
            <img src={java} className="class-img" alt={java} />
            <div className="class-fm-state" style={{ color: this.props.item.state === "已结束" ? 'red' : '#00bfff' }}>{this.props.item.state}</div>
          </div>
          <div className="ml-20 font-size-22 class-fm-name">{this.props.item.name}</div>
          <div className="class-fm-info"><span><HistoryOutlined />{this.props.item.time}</span><span><UserOutlined />{this.props.item.teacher}</span></div>
        </div>
        {
          visible ? <Modal
            visible={visible}
            title="Title"
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
            </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk}>
                Submit
            </Button>,
            ]}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal> : null
        }

      </Col>
    );
  }
}

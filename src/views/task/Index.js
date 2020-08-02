import React, { Component } from 'react';
import { Select, Form, DatePicker, Button, Table, Divider, Modal } from 'antd';
import './index.scss'

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Column } = Table;

const dataSource = [
  {
    key: '1',
    name: 'JAVA',
    age: '自测',
    address: '数据库',
    address1: '89',
    address2: '11',
    address3: '2020-07-25'
  },
  {
    key: '2',
    name: 'SQL数据库',
    age: '自测',
    address: '数据库',
    address1: '90',
    address2: '2',
    address3: '2020-07-25'
  }
];


class Index extends Component {
  constructor(props) {
    super(props)
    this.state = { visible: true };
  }
  handleOk = () => {
    let that = this
    setTimeout(() => {
      that.setState({
        visible: false,
      });
    })

  };
  render () {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      layout: 'inline'
    };
    const { visible } = this.state
    return (
      <div>
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
        <div className="shadow-radius">
          <Table dataSource={dataSource}>
            <Column title="课程" dataIndex="name" key="name" />
            <Column title="课题模式" dataIndex="age" key="age" />
            <Column title="题库" dataIndex="address1" key="address" />
            <Column title="分数" dataIndex="address1" key="address1" />
            <Column title="排名" dataIndex="address2" key="address2" />
            <Column title="时间" dataIndex="address3" key="address3" />
            <Column
              title="操作"
              key="action"
              width={200}
              render={(text, record) => (
                <span>
                  <a href='#'>查看 {record.lastName}</a>
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
            >
              亲爱的同学，你当前还有一门功课/考试需要去完成，请尽快处理！
            </Modal> : null
        }
      </div>
    );
  }
}

export default Index;

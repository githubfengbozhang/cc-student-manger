import React, { Component } from 'react';
import { WingBlank, Picker, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import './index.scss'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      buttonDisabled: false
    }
  }

  render () {
    const { getFieldProps } = this.props.form;
    const district = [
      {
        label: '春',
        value: '春',
      },
      {
        label: '夏',
        value: '夏',
      },
    ];
    return (
      <div>
        <WingBlank>
          <WhiteSpace size="lg" />
          <List style={{ backgroundColor: 'white' }} className="picker-list">
            <Picker data={district} cols={1} {...getFieldProps('district3')}>
              <List.Item arrow="horizontal">Single</List.Item>
            </Picker>
          </List>
          <WhiteSpace size="lg" />
        </WingBlank>
      </div>
    )
  }
}
const IndexFrom = createForm()(Index);
export default IndexFrom;

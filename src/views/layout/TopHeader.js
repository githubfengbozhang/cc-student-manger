import React, { Component } from 'react';
import { Icon, Avatar, Dropdown, Menu, Modal, Form, Input,Row, Col,Button } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setUserInfo } from '@/redux/actions/userInfo';
import { emptyTag, addTag } from '@/redux/actions/tagList';
import { setCollapse, setBreadCrumb, setTags, setTheme } from '@/redux/actions/setting';
import { routes } from '@/router/routes';
import FullScreen from '@/components/FullScreen';
import Tags from './Tags';
import BasicDrawer from '@/components/BasicDrawer';
import blueLogo from '@/assets/img/blueLogo.png'
import qs from 'qs';
import $axios from "@/axios/$axios";

class TopHeader extends Component {
  state = { visible: false,changePassword:false };
  handleLogout = () => {
    this.props.setUserInfo({});
    this.props.emptyTag();
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    this.props.history.push('/');
  };
  // 修改密码
  changePassword =() => {
    this.setState({
        changePassword:true
    })
  };
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {clpassword,newpassword,oldpassword} = values
        $axios.post("/exam/api/student/single/modifyPwd", qs.stringify({ clpassword,newpassword,oldpassword}))
        this.setState({
            changePassword: false,
        });
      }
    });
  };
  handleCancel = e => {
    this.setState({
        changePassword: false,
    });
  };
  componentDidMount () {
    let userInfo = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      this.props.setUserInfo(userInfo);
    } else {
      this.props.setUserInfo({});
      this.props.history.push('/login');
    }
  }
  toNews = () => {
    this.handClickTag('/news');
    this.props.history.push('/news');
  };
  handClickTag (path, parent) {
    for (let i = 0; i < routes.length; i++) {
      if (path === routes[i].path) {
        let obj = { path, title: '消息', component: routes[i].component };
        this.props.addTag(parent ? Object.assign({}, obj, { parent: parent.title }) : obj);
      }
    }
  }
  toggle = () => {
    this.props.setCollapse({ isCollapsed: !this.props.collapse.isCollapsed });
  };
  setting = () => {
    this.setState({ visible: true });
  };
  onClose = () => {
    this.setState({ visible: false });
  };
  onChangeTags = checked => {
    this.props.setTags({ show: checked });
    localStorage.setItem('tags', JSON.stringify({ show: checked }));
    this.onClose();
  };
  onChangeBreadCrumb = checked => {
    this.props.setBreadCrumb({ show: checked });
    localStorage.setItem('breadCrumb', JSON.stringify({ show: checked }));
    this.onClose();
  };
  onChangeTheme = checked => {
    this.props.setTheme({ type: checked ? 'dark' : 'light' });
    localStorage.setItem('theme', JSON.stringify({ type: checked ? 'dark' : 'light' }));
    this.onClose();
  };
  render () {
    const DropdownList = (
      <Menu className="drop-list">
        <Menu.Item key="user">
          <Icon type="user" />
          {Object.keys(this.props.userInfo).length > 0 && this.props.userInfo.role.name}
        </Menu.Item>
        <Menu.Item key="password" onClick={this.changePassword}>
            <Icon type="eye-invisible" />
					修改密码
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.handleLogout}>
          <Icon type="logout" />
					退出登录
        </Menu.Item>
      </Menu>
    );
    const { tags } = this.props;
    const { changePassword } = this.state;

    const { getFieldDecorator,getFieldValue } = this.props.form;

    const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
    const validateMode = (rule, value, callback) =>{
      if(value === getFieldValue("newpassword")){
        callback();
      }else{
        callback("2次密码不一样");
      }
    }
    return (
      <div className="top-header">
        <div className="top-header-inner">
          <Icon className="trigger" type={true ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
          <div className="header-title"><img src={blueLogo} style={{ height: '30px' }} alt=''></img> | 人才培养管理监测系统</div>
          <div className="header-right">
            <div className="full-screen">
              <FullScreen />
            </div>
            <div className="setting">
              <Icon style={{ fontSize: '21px', cursor: 'pointer' }} type="setting" onClick={this.setting} />
            </div>
            {/* <div className="news-wrap">
              <Badge count={3}>
                <Icon style={{ fontSize: '21px', cursor: 'pointer' }} type="bell" onClick={this.toNews} />
              </Badge>
            </div> */}
            <div className="dropdown-wrap" id="dropdown-wrap" style={{ cursor: 'pointer' }}>
              <Dropdown getPopupContainer={() => document.getElementById('dropdown-wrap')} overlay={DropdownList}>
                <div>
                  <Avatar size="large" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAADwElEQVRYR7WXTWwTVxDH/7Pe9Qf+ahyaOAmBUKeBAyqXSlUrUM/0A6lHxAWE1PbSG+IIoceKG5e2EqKXimMlWtpzRdWqgkurHiDEJTgkcQJx8Bf+2I9Bb8kG2/H6PRL7XfbwZub9dmbezDzCa6z5fH7EqTQ/AuFDZhwBMAUgvmmiDGCBCP+B8bsWC/46nU6vqZonFcFsdvmYCesCHJwggq6iwwwLGn4zoH+TyYz/IdPpCXJvIX9Qs82rzPyxzFCvfSK65QSMrw5PpR/6yfmCzGWXTjFb3wHkuX43LAC4TKR/MZOZuNHNUFeQ+9nFiwTMMrNS6FQJiYgZmD2Umfy6U2fbQQICzJdVje9IjuhSJ0wbiAgH4PzYb09s+3siBrTTrWHaAhGJSVbjH5WcCGga3kjGEI1GEDReXqKmaaFareFZsQLbcRQcxWXWQ0e9BN4Cmcsu/qJyO2LRCEZHUhAw3ZaAWF0roFKtSWHEbZrJTH4iBF0QUScstm7LNAXE2OgwiHrnMDNjZXVdCUYn/bioM67Fe9ncTWJ82gtEeGDqwJivJzp1hWcWHq1Iw8SEnw9n9p8kUbatcnNJVjGHhxIYTiVlTmvbXy8Usb5R6qkjKrAeD07Q3HzuDAPXZSfs3zeKcCgoE2vbrzeayD1eleoQcJbmsrnrzDgjk54+OAHNJ0H9dB3HwfzDJZlpEOEHuj+fuwPgXZn0IEEA3BUgTwDslYEMMjQAngqQOoCQDGRQybp5bkMZZFDXtxVEKTRCYRAFbRPEDY1Ssnqh62eJb0mHu8rXtzWH+tP0Xll0r69qQZMl82723YKmWuJ3c1AvXbfEU3BCuel5xiLhEEIhA8GgAT0Q2OrEouNato1m00SjYaJWbyixbzU9lTFAtP3UUALJeBS6HlA6wLJsFMtVFDZKEJB+q20MEEJ+g5Fh6Ng39ibEdyfLNC08XnkC8e1c2wYjIdBtVBRNbmoyrewFP1DhnYXFPEQTfLV8RsWXXmkfnkf2DrmzaT+WmGXXnm64psSzwnd49g7znhOaRnjrwPhrt34/aOGN/x8tw3FYkPR+TrTCxPZEZsfTw319YC3n17nyvKb2wPJgStXquWg48q2m0c6ytMM1jsNWtV77MhGNXuvmtZ5/XCgU3onHE9/reuC93eSJZdl/l8ulz1Op1L9+dpRcXyo9/ywcNs4bhv6+9wRRAGPTtP6q180ricSen2TySiCekbVi8e2YYZwMGMZxAj4IaNoQkeZWOGbHth1ng4E/bdO8XTHNmyPJ5AMZgLf/At/j2PAbUsw0AAAAAElFTkSuQmCC" />
                  <Icon style={{ color: 'rgba(0,0,0,.3)', cursor: 'pointer' }} type="caret-down" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        {changePassword?
            <Modal
            title="密码修改"
            visible={changePassword}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form className="login-form" onSubmit={this.handleSubmit} ref="getFormVlaue">
                <Form.Item>
                    {getFieldDecorator('oldpassword', {
                        rules: [{ required: true, message: '请输入旧密码'},
                                { pattern:/^[a-zA-Z0-9]{6,15}$/,message: '只能包含数字或字母6-15位的字符'}],
                        validateTrigger:'onBlur'
                    })(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入旧密码"
                        autoComplete="off"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('newpassword', {
                        rules: [{ required: true, message: '请输入包含数字、字母的密码' },
                                { pattern:/^[a-zA-Z0-9]{7,15}$/,message: '只能包含数字或字母7-15位的字符'}],
                        validateTrigger:'onBlur'
                    })(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入新密码"
                        autoComplete="off"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('clpassword', {
                        rules: [{ required: true, message: '请输入包含数字、字母的密码' },
                                { pattern:/^[a-zA-Z0-9]{7,15}$/,message: '包含数字或字母7-15位的字符'},
                                {validator: validateMode}],
                        validateTrigger:'onBlur'
                    })(
                        <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请确认密码"
                        autoComplete="off"
                        />,
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Row>
                    <Col span={12}>
                    <Button type="primary" htmlType="submit">
                    确认
                    </Button>
                    </Col>
                    <Col span={12}>
                    <Button onClick={this.handleCancel}>
                    取消
                    </Button>
                    </Col>
                    </Row>
    </Form.Item>
            </Form>
          </Modal>:null
        }
        {tags.show ? <Tags /> : null}
        <BasicDrawer title="系统设置" closable onClose={this.onClose} visible={this.state.visible} onChangeTags={this.onChangeTags} onChangeBreadCrumb={this.onChangeBreadCrumb} onChangeTheme={this.onChangeTheme} {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  setCollapse: data => {
    dispatch(setCollapse(data));
  },
  setUserInfo: data => {
    dispatch(setUserInfo(data));
  },
  emptyTag: () => {
    dispatch(emptyTag());
  },
  addTag: data => {
    dispatch(addTag(data));
  },
  setBreadCrumb: data => {
    dispatch(setBreadCrumb(data));
  },
  setTags: data => {
    dispatch(setTags(data));
  },
  setTheme: data => {
    dispatch(setTheme(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Form.create()(TopHeader)));

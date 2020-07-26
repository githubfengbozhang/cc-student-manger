import React, { Component } from 'react';
import TypingCard from '../../components/TypingCard'

class Index extends Component {

  render () {
    const cardContent = `欢迎登录重庆工业职业技术学院考试测评系统。`
    return (
      <div className="shadow-radius">
        <div >
          <TypingCard source={cardContent} ></TypingCard>
        </div>
      </div>
    );
  }
}

export default Index;

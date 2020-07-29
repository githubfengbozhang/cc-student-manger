import React from 'react'
import Typing from '../utils/Typing'

class TypingCard extends React.Component {
  static defaultProps = {
    source: '',
    height: 136,
    fontSize: 16
  }
  componentDidMount () {
    const typing = new Typing({
      source: this.source,
      output: this.output,
      delay: 30
    })
    typing.start()
  }
  render () {
    return (
      <div className='card-item' title={this.props.title} style={{ minHeight: this.props.height, fontSize: this.props.fontSize }} id={this.props.id}>
        <div style={{ display: 'none' }} ref={el => this.source = el} dangerouslySetInnerHTML={{ __html: this.props.source }} />
        <div ref={el => this.output = el} />
      </div>
    )
  }
}

export default TypingCard
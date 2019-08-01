import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTimeline } from 'taro-ui'

import './index.scss'

export default class Bicycling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lines: []
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log(this.$router.params)
    const lines = []
    JSON.parse(this.$router.params.items).forEach(element => {
      lines.push({ title: element.instruction })
    });
    this.setState({
      lines
    })
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='bicycling'>
        <AtTimeline 
          items={this.state.lines}
        >
        </AtTimeline>
      </View>
    )
  }
}

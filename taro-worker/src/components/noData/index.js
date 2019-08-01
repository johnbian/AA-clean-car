import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import setting from '../../assets/utils/setting'

import './index.scss'

class NoData extends Component {

  constructor(props) {
    super(props);
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('无数据页面')
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='no-data'>
        <View className='no-data-header'>
          <Image className='image' src={`${setting.fileUrl}nothings.png`} />
        </View>
        <Text className='no-data-title'>{this.props.title}</Text>
      </View>
    )
  }
}

export default NoData

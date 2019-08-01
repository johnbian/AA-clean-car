import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import setting from '../../assets/utils/setting'
import { doRequest } from '../../assets/utils/request'

import './index.scss'

class Promt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 0,
      phoneNumber: ''
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    console.log('注册页面')
    let res = await Taro.getSystemInfo()
    this.setState({
      windowHeight: res.windowHeight
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  callPhone = async () => {
    await Taro.makePhoneCall({
      phoneNumber: '021-69961812'
    })
  }

  onInput = (e) => {
    this.setState({
      phoneNumber: e.detail.value
    })
  }

  registerByPhone = async () => {
    const res = await doRequest({
      url: `washer/apply/${this.props.counter.openid}/${this.state.phoneNumber}`,
      method: 'POST'
    })
    if (res.data === 20200) {
      this.canDoRegister = false
      Taro.showModal({
        title: '',
        content: '报名成功，请等待运营人员电话联系！',
        showCancel: false
      })
    } else if (res.data === 30000) {
      this.canDoRegister = false
      Taro.showModal({
        title: '',
        content: '申请已提交，请耐心等候审批！',
        showCancel: false
      })
    } else {
      Taro.showModal({
        title: '',
        content: '输入错误，请检查输入的手机号',
        showCancel: false
      })
    }
  }

  render () {
    return (
      <View className='promt' style={{height: `${this.state.windowHeight}px`}}>
        <Image src={`${setting.fileUrl}aalogo_green.png`} className='img' />
        <Text className='title'>您尚未注册为我方工作人员</Text>
        <View className='subtitle' onClick={this.callPhone}>
          拨打电话<Text className='phone'>021-69961812</Text>了解详情
        </View>
        <View className='section'>
          <Input placeholder='输入手机号注册报名' maxlength='11' type='number' onInput={this.onInput} className='input' />
        </View>
        <Button className='btn' hoverClass='btn_active' onClick={this.registerByPhone} 
          disabled={this.state.phoneNumber.length !== 11}
        >
          立即注册
        </Button>
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(Promt)

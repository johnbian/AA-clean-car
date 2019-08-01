import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getUserInfo, getOpenId } from '../../actions/counter'
import setting from '../../assets/utils/setting'
import { doRequest } from '../../assets/utils/request'

import './index.scss'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 0,
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    console.log('登录页面')
    let res = await Taro.getSystemInfo()
    this.setState({
      windowHeight: res.windowHeight
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async onGetUserInfo (e) {
    console.log(e)
    if (e.detail.userInfo) {
      this.props.onGetUserInfo(e.detail.userInfo)
      const loginInfo = await Taro.login()
      if (loginInfo.code) {
        const resLogin = await doRequest({
          url: `app/getOpenId?name=workerapp&js_code=${loginInfo.code}&grant_type=authorization_code`
        })
        if (resLogin.data.openid) {
          this.props.onGetOpenId(resLogin.data.openid)
          const workerInfo = await doRequest({
            url: `washer/main/login/${this.props.counter.openid}`
          })
          this.props.onGetWorkerInfo(workerInfo.data)
          Taro.navigateBack()
        }
      }
    } else {
      Taro.navigateBack()
    }
  }

  render () {
    return (
      <View className='login' style={{height: `${this.state.windowHeight}px`}}>
        <Image src={`${setting.fileUrl}aalogo_green.png`} className='img' />
        <Text className='title'>爱爱洗车申请获得以下权限:</Text>
        <Text className='subtitle'>获得你的公开信息(昵称，头像等)</Text>
        <Button onGetUserInfo={this.onGetUserInfo} 
          open-type='getUserInfo' className='btn' hoverClass='btn_active'
        >
          确认授权
        </Button>
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  onGetUserInfo (userInfo) {
    dispatch(getUserInfo(userInfo))
  },
  onGetOpenId (openid) {
    dispatch(getOpenId(openid))
  }
}))(Login)

import Taro, { Component } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Mine from '../../components/mine'
import Pending from '../../components/pending'
import NoData from '../../components/noData/index'
import { getUserInfo, getWorkerInfo, getOpenId } from '../../actions/counter'
import { doRequest } from '../../assets/utils/request'
import OrderItem from '../../components/orderItem/index'
import setting from '../../assets/utils/setting'
import './index.scss'

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      availablelist: [],
      uncompletedlist: [],
      receiptArray: [],
    };
  }

  config = {
    enablePullDownRefresh: true
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    const result =  await Taro.getSetting()
    if (result.authSetting['scope.userInfo']) {
      const userInfo = await Taro.getUserInfo({lang: 'zh_CN'})
      if (userInfo.errMsg === 'getUserInfo:ok') {
        this.props.onGetUserInfo(userInfo.userInfo)
        const loginInfo = await Taro.login()
        if (loginInfo.code) {
          const resLogin = await doRequest({
            baseUrl: 'https://www.aawashcar.com',
            url: `app/getOpenId?name=workerapp&js_code=${loginInfo.code}&grant_type=authorization_code`
          })
          if (resLogin.data.openid) {
            this.props.onGetOpenId(resLogin.data.openid)
            setting.openid = resLogin.data.openid
            const workerInfo = await doRequest({
              url: `washer/main/login/${this.props.counter.openid}`
            })
            if (workerInfo.data.washer) {
              this.props.onGetWorkerInfo(workerInfo.data)
              this.getAvailablelist()
              this.getReceiptArray()
            } else {
              Taro.navigateTo({url: '../../pages/promt/index'})
            }
            if (workerInfo.data.assignedOrder) {
              const resWaring = await Taro.showModal({
                title: '',
                content: '你有未处理的订单，是否立即去处理'
              })
              if (resWaring.confirm) {
                Taro.navigateTo({url: `../../pages/processing/index?orderId=${workerInfo.data.assignedOrder.id}`})
              } else if (resWaring.cancel) {
                console.log('用户点击取消')
              }
            }
          }
        }
      }
    } else {
      Taro.navigateTo({url: '../login/index'})
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick = (current) => {
    this.setState({
      current
    })
    if (current === 0 && this.state.uncompletedlist.length === 0) {
      this.getUncompletedlist()
    }
  }

  onReceipt = async (orderId, orderNumber, e) => {
    const takeorder = await doRequest({
      url: 'washer/main/rushorder',
      method: 'PUT',
      data: {
        validId: this.props.counter.openid,
        orderId,
        orderNumber,
        remarks: this.state.receiptArray[e.detail.value].id
      }
    })
    if (takeorder.data.statusCode === 36) {
      const resWaring = await Taro.showModal({
        title: '',
        content: '你有未处理的订单，是否立即去处理'
      })
      if (resWaring.confirm) {
        Taro.navigateTo({url: `../../pages/processing/index?orderId=${orderId}`})
      } else if (resWaring.cancel) {
        this.getAvailablelist()
      }
    }
  }

  getAvailablelist = async (needLoading = true) => {
    const res = await doRequest({
      url: `washer/order/availablelist/${this.props.counter.openid}/10`,
      needLoading,
    })
    if (res) {
      this.setState({
        availablelist: res.data
      })
      Taro.stopPullDownRefresh()
    }
  }

  getReceiptArray = async () => {
    const res = await doRequest({
      url: 'washer/remarks/accept/list'
    })
    if (res) {
      this.setState({
        receiptArray: res.data
      })
    }
  } 

  getUncompletedlist = async (needLoading = true) => {
    const res = await doRequest({
      url: `washer/order/uncompletedlist/${this.props.counter.openid}/10`,
      needLoading,
    })
    if (res) {
      this.setState({
        uncompletedlist: res.data,
      })
      Taro.stopPullDownRefresh()
    }
    
  }

  onPullDownRefresh = async () => {
    if (this.state.current === 1) {
      this.getAvailablelist(false)
    } else if (this.state.current === 0) {
      this.getUncompletedlist(false)
    } else {
      Taro.stopPullDownRefresh()
    }
  }

  onShareAppMessage = (res) => {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'AA洗车工',
      imageUrl: `${setting.fileUrl}aalogo_green.png`,
      success() {
        Taro.showToast({
          title: '分享成功',
          duration: 2000
        })
      },
      fail() {
        Taro.showToast({
          title: '分享失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }

  render () {
    return (
      <View className='homepage'>
        {
          this.state.current === 0 ? <Pending uncompletedlist={this.state.uncompletedlist} /> : null
        }
        {
          this.state.current === 1 ? 
          <View>
            {
              this.state.availablelist.length >0 ? this.state.availablelist.map((item, index) => {
                return (
                  <OrderItem key={index} item={item} showDetail={false}
                    onReceipt={this.onReceipt.bind(this, item.id, item.orderNumber)}
                    receiptArray={this.state.receiptArray}
                  />
                )
              }) : <NoData title='暂无数据' />
            }
          </View> 
          : null
        }
        {
          this.state.current === 2 ? <Mine 
            nickName={this.props.counter.workerInfo.washerInfo.nickName}
            avatarUrl={this.props.counter.userInfo.avatarUrl}
          /> : null
        }
        <AtTabBar
          fixed
          tabList={[
            { title: '待办事项', iconType: 'bullet-list', dot: true },
            { title: '首页', iconType: 'home' },
            { title: '我的', iconType: 'user', }
          ]}
          onClick={this.handleClick}
          current={this.state.current}
        />
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
  onGetWorkerInfo (workerInfo) {
    dispatch(getWorkerInfo(workerInfo))
  },
  onGetOpenId (openid) {
    dispatch(getOpenId(openid))
  },
}))(Index)

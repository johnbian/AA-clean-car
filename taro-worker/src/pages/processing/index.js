import Taro, { Component } from '@tarojs/taro'
import { View, Map, Button, Picker } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { doRequest } from '../../assets/utils/request'
import './index.scss'

class Processing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      positionLatitude: 0,
      positionLongitude: 0,
      height: 0,
      refuseArray: [],
      completeArray: [],
      order: {},
      polyline: [] 
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('处理页面')
    this.getWindowInfo()
    this.getOrderInfo()
  }

  componentDidMount () {
    console.log('处理页面did')
    this.getPosition()
    this.getDefaultArr()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  async getPosition() {
    let res = await Taro.getLocation({type: 'gcj02'})
    if (res.errMsg === 'getLocation:ok') {
      this.setState({
        positionLatitude: res.latitude,
        positionLongitude: res.longitude,
      })
    } else {
      console.log('定位失败')
    }
  }

  async openLocation(latitude, longitude, name, address) {
    console.log(latitude, longitude)
    const result = await Taro.openLocation({
      latitude,
      longitude,
      name,
      address,
    })
    console.log(result)
  }

  async getWindowInfo() {
    let res = await Taro.getSystemInfo()
    this.setState({
      height: res.windowHeight
    })
  }
  
  async getDefaultArr() {
    const refuseArray = await doRequest({
      url: 'washer/remarks/reject/list'
    })
    const completeArray = await doRequest({
      url: 'washer/remarks/complete/list'
    })
    this.setState({
      refuseArray: refuseArray.data,
      completeArray: completeArray.data
    })
  }

  async refuse (e) {
    const takeorder = await doRequest({
      url: 'washer/main/rejectorder',
      method: 'PUT',
      data: {
        validId: this.props.counter.openid,
        orderId: this.state.order.orderId,
        remarks: this.state.refuseArray[e.detail.value].id
      }
    })
  }

  async complete (e) {
    const takeorder = await doRequest({
      url: 'washer/main/completeorder',
      method: 'PUT',
      data: {
        validId: this.props.counter.openid,
        orderId: this.state.order.orderId,
        remarks: this.state.completeArray[e.detail.value].id
      }
    })
    if (takeorder) {
      this.setState({
        order: {...this.state.order, 
          statusCode: takeorder.data.statusCode,
          status: takeorder.data.status,
        }
      })
    }
  }

  async arrived () {
    const takeorder = await doRequest({
      url: 'washer/main/arrivedorder',
      method: 'PUT',
      data: {
        validId: this.props.counter.openid,
        orderId: this.state.order.orderId,
        remarks: 1
      }
    })
    if (takeorder) {
      this.setState({
        order: {
          ...this.state.order, 
          statusCode: takeorder.data.statusCode,
          status: takeorder.data.status,
        }
      })
    }
  }

  navigateToDetail () {
    Taro.navigateTo({url: `../../pages/orderDetail/index?orderId=${this.state.order.orderId}`})
  }

  onNext = async () => {
    Taro.navigateTo({url: '../../pages/index/index'})
  }

  getOrderInfo = async () => {
    const res = await doRequest({
      url: `washer/order/detail/${this.$router.params.orderId}`
    })
    if (res) {
      this.setState({
        order: res.data
      })
    }
  }

  getBicycling = async () => {
    const polylines = await doRequest({
      baseUrl: 'https://apis.map.qq.com/ws/direction/v1',
      // url: `bicycling/?from=${this.state.positionLatitude},${this.state.positionLongitude}&to=31.23033,121.4754&key=YFUBZ-IUOCO-WMRWD-S53WS-HUIH5-RTFLW`
      url: `bicycling/?from=${this.state.positionLatitude},${this.state.positionLongitude}&to=${this.state.order.location.latitude},${this.state.order.location.longitude}&output=json&callback=cb&key=YFUBZ-IUOCO-WMRWD-S53WS-HUIH5-RTFLW`
    })
    let pl = []
    if (polylines.data.status === 0) {
      const coors = polylines.data.result.routes[0].polyline
      for (let i = 2; i < coors.length; i++) {
        coors[i] = coors[i-2] + coors[i]/1000000
      }
      for (let i = 0; i < coors.length; i+=2){
        pl.push({ latitude: coors[i], longitude:coors[i+1]})
      }
      this.setState({
        polyline: [{
          points: pl,
          color: '#00B8A5',
          width: 4,
          dottedLine: false
        }]
      })
      Taro.navigateTo({url: `../../pages/bicycling/index?items=${JSON.stringify(polylines.data.result.routes[0].steps)}`})
    } else {
      Taro.showToast({
        title: polylines.data.message,
        icon: 'none',
        duration: 2000
      })
    }
  }

  render () {
    console.log(this.state)
    return (
      <View className='processing-page'>
        <Map
          id='map'
          scale='16'
          latitude={this.state.positionLatitude}
          longitude={this.state.positionLongitude}
          showLocation
          className='map1'
          polyline={this.state.polyline}
          style={{height: `${this.state.height - 320}px`}}
        />
        <AtList>
          <AtListItem
            title='状态'
            extraText={`${this.state.order.status || ''}`}
            thumb={require('../../assets/images/ic_item_car.png')}
          />
          <AtListItem
            title='查看路线'
            arrow='right'
            extraText={`${this.state.order.fullAddress || ''}`}
            onClick={this.getBicycling}
            thumb={require('../../assets/images/ic_item_location.png')}
          />
          <AtListItem
            title='订单详情'
            arrow='right'
            extraText={`${this.state.order.serviceName || ''}`}
            onClick={this.navigateToDetail}
            thumb={require('../../assets/images/ic_item_order.png')}
          />
          <AtListItem
            title='服务内容'
            extraText={`${this.state.order.serviceName || ''}`}
            thumb={require('../../assets/images/ic_item_service.png')}
          />
          <AtListItem
            title='预约时间'
            extraText={`${this.state.order.bookTime || ''}`}
            thumb={require('../../assets/images/ic_item_time.png')}
          />
        </AtList>
        <View className='btns'>
          {
            this.state.order.statusCode === 32 && <Picker
              onChange={this.refuse} range={this.state.refuseArray} rangeKey='content'
            >
              <Button 
                className='weui-btn mini-btn red' type='defalut' size='mini' hoverClass='btn_active'
              >拒绝</Button>
            </Picker>
          }
          {
            this.state.order.statusCode === 36 && 
            <Button
              onClick={this.arrived}
              className='weui-btn mini-btn' type='defalut' size='mini' hoverClass='btn_active'
            >已到达</Button>
          }
          {
            this.state.order.statusCode === 38 && <Picker
              onChange={this.complete} range={this.state.completeArray} rangeKey='content'
            >
              <Button 
                className='weui-btn mini-btn' type='defalut' size='mini' hoverClass='btn_active'
              >已完成</Button>
            </Picker>
          }
          {
            this.state.order.statusCode === -10 && <Button
              onClick={this.onNext}
              className='weui-btn mini-btn' type='defalut' size='mini' hoverClass='btn_active'
            >继续处理</Button>
          }
        </View>
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(Processing)

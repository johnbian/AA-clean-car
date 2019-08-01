import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { doRequest, pay } from '../../assets/utils/request'
import '../pay/index.scss'

class OrderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      serviceNames: []
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    console.log('订单详情')
    console.log(this.$router.params)
    const res = await doRequest({url: `order/detail/${this.$router.params.orderId}/${this.props.counter.openid}`})
    if (res.data) {
      if (res.data.serviceName.indexOf('+') === -1) {
        this.setState({
          orderDetail: res.data,
          serviceNames: [res.data.serviceName]
        })
      } else {
        this.setState({
          orderDetail: res.data,
          serviceNames: res.data.serviceName.split('+')
        })
      }
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPay() {
    const params = {
      bookedTime: this.state.orderDetail.bookTime,
      couponId: 0,
      discountedPrice: this.state.orderDetail.discountedPrice,
      orderId: this.state.orderDetail.orderId,
      originalPrice: this.state.orderDetail.price,
      promotionId: 0,
      serviceId: this.state.orderDetail.serviceId,
      serviceName: this.state.orderDetail.serviceName,
      validId: this.props.counter.openid
    } 
    pay('order/pay', params)
  }

  render () {
    return (
      <View className='pay'>
        <View className='block font-small'>
          <View className='order-detail-top'>
            <Text>预约时间：{this.state.orderDetail.bookTime}</Text>
            <Text>车牌号：{this.state.orderDetail.license}</Text>
          </View>
          <View>
            <Text>地址：</Text>
            <Text>{this.state.orderDetail.fullAddress}</Text>
          </View>
        </View>
        <View className='block font-small'>
          <Text>订单编号：</Text>
          <Text>{this.state.orderDetail.orderNumber}</Text>
        </View>
        <View className='block'>
          <Text className='title font-title'>服务详情</Text>
          {this.state.serviceNames.map((item, index)=>{
            return(<View key={index} className='item'>
                <Text>{item}</Text>
                <Text>x1</Text>
              </View>)
          })}
          <View className='item show-end'>
            <Text className='title price'>共{this.state.serviceNames.length}件 原价：</Text>
            <Text className='title price'>¥{this.state.orderDetail.price}</Text>
          </View>
          {
            this.state.orderDetail.statusCode !== 10 &&
            <View className='item show-end'>
              <Text className='title price'>折后价：</Text>
              <Text className='title price'>¥{this.state.orderDetail.discountedPrice}</Text>
            </View>
          }
          
        </View>
        {
          this.state.orderDetail.statusCode === 10 &&
          <View className='footer'>
            <View className='bage'>
              <Text>实付：¥{this.state.orderDetail.discountedPrice}</Text>
            </View>
              <View className='view-btn' onClick={this.onPay}>
                <Text>去支付</Text>
              </View>
          </View>
        }
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(OrderDetail)

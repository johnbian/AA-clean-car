import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtRadio, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { getOpenId } from '../../actions/counter'
import setting from '../../assets/utils/setting'
import { doRequest, pay } from '../../assets/utils/request'
import './index.scss'

class Pay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderDetail: {},
      serviceNames: [],
      coupons: [],
      promotions: [],
      couponsValue: '0',
      promotionsValue: '0',
      showMore: false,
      inline: true,
      priceObj: {}
    }
  }

  config = {
    enablePullDownRefresh: true
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    const orderDetail = await doRequest({
      url: `order/detail/${this.$router.params.orderId}/${setting.openid}`
    })
    if (orderDetail.data) {
      const serviceArr = this.flattenServiceId(orderDetail.data.serviceId)
      const promotions = this.flatten(orderDetail.data.promotions, serviceArr)
      let promotionsValue = '0'
      if (this.$router.params.promotionId) {
        promotionsValue = this.$router.params.promotionId
      } else if (promotions.length>0) {
        promotionsValue = promotions[0].value
      }
      const coupons = this.flattenCoupon(orderDetail.data.coupons)
      let couponsValue = '0'
      if (coupons.length>0 && promotionsValue === '0') {
        couponsValue = coupons[0].value
      }
      this.setState({
        orderDetail: orderDetail.data,
        serviceNames: orderDetail.data.serviceName.indexOf('+') === -1 ? 
        [orderDetail.data.serviceName] : orderDetail.data.serviceName.split('+'),
        coupons,
        couponsValue,
        promotions,
        promotionsValue
      }, ()=>this.pricing())
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPullDownRefresh() {
    this.pricing()
    Taro.stopPullDownRefresh()
  }

  handleChangeCoup (value) {
    this.setState({
      couponsValue: value,
      promotionsValue: '0'
    }, ()=>this.pricing())
  }

  handleChangeProm (value) {
    this.setState({
      promotionsValue: value,
      couponsValue: '0'
    }, ()=>this.pricing())
  }

  sumPrice(list) {
    let price = 0
    for (const item of list) {
      price += item.price
    }
    return price
  }

  flattenServiceId(serviceId) {
    return serviceId.indexOf(',') === -1 ? [serviceId] 
    : serviceId.split(',')
  }

  flattenCoupon(list) {
    const arr = []
    if (list.length > 0) {
      list.forEach(element => {
        const obj = { label: element.name, 
          value: String(element.id), 
          desc: element.description 
        }
        arr.push(obj)
      })
    }
    return arr
  }

  flatten(list, serviceArr) {
    const arr = []
    const promotionIds = []
    if (list.length > 0) {
      list.forEach(element => {
        element.services.forEach(service => {
          if (service.remainingCount > 0) {
            serviceArr.forEach(serviceId=>{
              if (Number(serviceId) === service.serviceId && !promotionIds.includes(element.id)) {
                const obj = { label: element.name, 
                  value: String(element.id), 
                  desc: element.description,
                }
                promotionIds.push(element.id)
                arr.push(obj)
              }
            })
          }
        })
      })
    }
    return arr
  }

  async pricing() {
    const res = await doRequest({
      url: `order/pricing/${setting.openid}/${this.state.orderDetail.serviceId}/${Number(this.state.couponsValue)}/${Number(this.state.promotionsValue)}/${this.state.orderDetail.price}/${this.state.orderDetail.vehicleType.id}/${this.state.orderDetail.vehicleCategory.id}`,
    })
    res.data.orderId = this.state.orderDetail.orderId
    res.data.bookedTime = this.state.orderDetail.bookTime
    console.log(res.data.paymentType)
    this.setState({
      priceObj: res.data
    })
  }

  onPay() {
    pay('order/pay', {...this.state.priceObj, ...{paymentType: this.state.inline? 0 : 50}}, this.$router.params.promotionId ? 3 : 2)
  }

  onShowMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  onChangePayWay() {
    this.setState({
      inline: !this.state.inline
    })
  }

  render () {
    return (
      <View className='pay'>
        <View className='block font-small'>
          <View className='order-detail-top'>
            <Text>预约时间：{this.state.orderDetail.bookTime}</Text>
            <Text>{this.props.service.mobile}</Text>
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
            <Text className='title price'>共{this.state.serviceNames.length}件，小计：</Text>
            <Text className='title price'>¥{this.state.orderDetail.price}</Text>
          </View>
        </View>
        {
          (this.state.coupons.length !== 0 || this.state.promotions.length !==0) &&
          <View className='block'>
            <Text className='title font-title' style={{paddingRight: '10px'}}>本单可享优惠</Text>
            <Text className='title font-title price'>共{this.state.coupons.length + this.state.promotions.length}个优惠</Text>
            <View className={`${this.state.showMore?'more':'no-more'} list`}>
              <AtRadio
                options={this.state.promotions}
                value={this.state.promotionsValue}
                onClick={this.handleChangeProm}
              />
              <AtRadio
                options={this.state.coupons}
                value={this.state.couponsValue}
                onClick={this.handleChangeCoup}
              />
            </View>
            <View onClick={this.onShowMore} className='text-bot'>
              <Text>{this.state.showMore? '收起' : '展开全部优惠'}</Text>
              <AtIcon value={this.state.showMore?'chevron-up':'chevron-down'} size='20' color='#333' />
            </View>
          </View>
        }
        <View className='block'>
          <Text className='title font-title'>支付方式</Text>
          <View className='btns'>
            <View className={`${this.state.inline?'active-btn':''} btn`} onClick={this.onChangePayWay}>
              <Text>在线支付</Text>
            </View>
            <View className={`${this.state.inline?'':'active-btn'} btn`} onClick={this.onChangePayWay}>
              <Text>线下支付</Text>
            </View>
          </View>
        </View>
        <View className='footer'>
          <View className='bage'>
            <Text>¥{this.state.priceObj.discountedPrice}</Text>
          </View>
          <View className='view-btn' onClick={this.onPay}>
            <Text>{this.state.inline?'去支付':'转线下支付'}</Text>
          </View>
        </View>
      </View>
    )
  }
}
export default connect(({ counter, service }) => ({
  counter, service
}), (dispatch) => ({
  getOpenId (openid) {
    dispatch(getOpenId(openid))
  }
}))(Pay)

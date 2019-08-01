import Taro, { Component } from '@tarojs/taro'
import { View, Map, Button, Image, Text, Input} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtList, AtListItem, Picker } from 'taro-ui'
import { getUserInfo, getOpenId, getCarType } from '../../actions/counter'
import { getPosition, getMobile, getBookTime, getCapabilityType,
  getCarInfo, getStores, getStoreId, getAddressRemark } from '../../actions/service'
import { doRequest } from '../../assets/utils/request'
import { format, pickerTap } from '../../assets/utils/timeUtils'

import './index.scss'
import setting from '../../assets/utils/setting';

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      positionLatitude: 0,
      positionLongitude: 0,
      isGoService: true,
      height: 0,
      times: [],
      multiIndex: [],
      latestOrder: {},
      showOrder: false,
      polyline: []
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  async componentWillMount () {
    console.log('willmount')
    const result =  await Taro.getSetting()
    if (result.authSetting['scope.userInfo']) {
      const userInfo = await Taro.getUserInfo({lang: 'zh_CN'})
      if (userInfo.errMsg === 'getUserInfo:ok') {
        this.props.onGetUserInfo(userInfo.userInfo)
        const loginInfo = await Taro.login()
        if (loginInfo.code) {
          const resLogin = await doRequest({
            baseUrl: 'https://www.aawashcar.com',
            url: `app/getOpenId?name=customerapp&js_code=${loginInfo.code}&grant_type=authorization_code`
          })
          if (resLogin.data.openid) {
            this.props.onGetOpenId(resLogin.data.openid)
            setting.openid = resLogin.data.openid
            this.getDefaultInfo(resLogin.data.openid)
            this.getStore()
          }
        }
      }
    } else {
      Taro.navigateTo({url: '../login/index'})
    }
    this.getWindowInfo()
  }
  
  componentDidMount () {
    this.getPosition()
    this.getTimes()
  }

  componentWillUnmount () { }

  componentDidShow () {
    if (this.props.service.stores.length === 0
      && this.props.counter.openid) {
      this.getDefaultInfo(this.props.counter.openid)
      this.getStore()
    }
  }

  componentDidHide () { }

  async choiceAddress() {
    if (this.state.isGoService) {
      const res = await Taro.chooseLocation()
      this.props.onGetPosition(res)
    } else {
      Taro.navigateTo({url: `../../pages/stores/index`})
    }
  }

  async getDefaultInfo(openid) {
    const pageinfo = await doRequest({
      url: `main/pageinfo/${openid}`
    })
    if (pageinfo.data) {
      const data = pageinfo.data
      if (data.latestOrder && data.latestOrder.id) {
        this.setState({
          latestOrder: data.latestOrder,
          showOrder: true,
          isGoService: data.latestOrder.capType === 'H' ? true : false
        })
        this.props.onGetCapabilityType(data.latestOrder.capType)
      }
      this.props.onGetCarType({vehicleCategories: data.vehicleCategories, vehicleTypes: data.vehicleTypes})
      let type, category
      data.vehicleTypes.forEach(element => {
        if (element.default) {
          type = {...element}
          return
        }
      })
      data.vehicleCategories.forEach(element => {
        if (element.default) {
          category = {...element}
          return
        }
      })
      this.props.onGetPosition({
        address: data.location.detailAddress,
        longitude: data.location.longitude,
        latitude: data.location.latitude,
      })
      this.props.onGetAddressRemark(data.location.addressRemark)
      this.props.onGetMobile(data.user.phoneNumber)
      this.props.onGetCarInfo({
        carNum: data.license,
        color: data.color,
        type,
        category
      })
    }
  }

  async getStore() {
    const stores = await doRequest({
      url: `main/stores`
    })
    if (stores) {
      this.props.onGetStores(stores.data)
    }
  }

  getTimes() {
    const taps = pickerTap()
    const { monthDay, minutes, todyHours } = taps
    this.setState({
      times: [monthDay, todyHours, minutes]
    })
    this.props.onGetBookTime(`${monthDay[0]} ${todyHours[0]}:${minutes[0]}`)
  }

  doMap(arr) {
    const newArr = []
    arr.forEach(element => {
      console.log(element)
      const obj = {
        iconPath: require('../../assets/images/location.png'),
        id: element.storeId,
        latitude: element.latitude,
        longitude: element.longitude,
        callout: {
          content: element.title,
          color: '#333',
          fontSize: 12,
          borderRadius: 5,
          bgColor: '#fff',
          padding: 4,
          display: "ALWAYS",
          textAlign: 'center'
        }
      }
      newArr.push(obj)
    })
    return newArr
  }

  columnchange(e) {
    const taps = pickerTap()
    const { monthDay, minutes, todyHours, hours } = taps
    switch(e.detail.column) {
      case 0:
      if (e.detail.value === 0) {
        this.setState({
          times: [monthDay, todyHours, minutes],
          multiIndex: [e.detail.value, 0, 0]
        })
      } else {
        this.setState({
          times: [monthDay, hours, minutes],
          multiIndex: [e.detail.value, this.state.multiIndex[1], this.state.multiIndex[2]]
        })
      }
      break
      case 1:
      this.setState({
        times: this.state.multiIndex[0] === 0 ? [monthDay, todyHours, minutes] : [monthDay, hours, minutes],
        multiIndex: [this.state.multiIndex[0], e.detail.value, this.state.multiIndex[2]]
      })
      break
      case 2:
      this.setState({
        times: this.state.multiIndex[0] === 0 ? [monthDay, todyHours, minutes] : [monthDay, hours, minutes],
        multiIndex: [this.state.multiIndex[0], this.state.multiIndex[1], e.detail.value]
      })
      break
    }
  }

  choiceBookTime(e) {
    const { times } = this.state
    this.props.onGetBookTime(`${times[0][e.detail.value[0]]} ${times[1][e.detail.value[1]]}:${times[2][e.detail.value[2]]}`)
  }

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

  async getWindowInfo() {
    let res = await Taro.getSystemInfo()
    this.setState({
      height: res.windowHeight
    })
  }

  validate() {
    if (!this.props.service.mobile) {
      Taro.showModal({
        title: '',
        content: '手机号不能为空',
        showCancel: false
      })
      return false
    } else if (!this.props.service.carInfo) {
      Taro.showModal({
        title: '',
        content: '请填写车辆信息',
        showCancel: false
      })
      return false
    } else if (!this.props.service.position.address) {
      Taro.showModal({
        title: '',
        content: '请选择地址',
        showCancel: false
      })
      return false
    }
    return true
  }

  handleChange(e) {
    this.props.onGetMobile(e.detail.value)
  }

  remarkChange(e) {
    this.props.onGetAddressRemark(e.detail.value)
  }

  onSwitchChange(e) {
    this.setState({
      isGoService: e.detail.value
    })
    if(!e.detail.value) {
      this.props.onGetStoreId({})
    }
  }

  choiceService() {
    if (this.validate()) {
      this.setState({
        showOrder: false
      }, this.props.onGetCapabilityType(this.state.isGoService? 'H': 'S'))
      Taro.navigateTo({url: `../../pages/services/index`})
    }
  }

  navigateTo (url) {
    Taro.navigateTo({url: `../../pages/${url}/index`})
  }

  onShareAppMessage = (res) => {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: 'AA洗车',
      imageUrl: `${setting.fileUrl}aalogo.png`,
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

  onOrder = async () => {
    const orderTime = format('yyyy-MM-dd hh:mm:ss', new Date())
    const res = await doRequest({
      url: `main/order`,
      method: 'POST',
      data: {
        validId: setting.openid,
        price: this.state.latestOrder.price,
        vehicleType: this.props.service.carInfo.type.id,
        vehicleCategory: this.props.service.carInfo.category.id,
        license: this.props.service.carInfo.carNum,
        color: this.props.service.carInfo.color,
        serviceId: this.state.latestOrder.serviceId,
        bookTime: `${this.props.service.bookTime}:00`,
        phoneNumber: this.props.service.mobile,
        orderTime,
        detailLocation: this.props.service.position.address,
        addressRemark: this.props.service.addressRemark,
        longitude: this.props.service.position.longitude,
        latitude: this.props.service.position.latitude,
        capabilityType: this.props.service.capabilityType,
        storeId: this.state.latestOrder.storeId ? this.state.latestOrder.storeId : null
      }
    })
    if (res.data&&res.data.orderId) {
      Taro.navigateTo({url: `../../pages/pay/index?orderId=${res.data.orderId}`})
    } else {
      Taro.showModal({
        title: '',
        content: res.data.message,
        showCancel: false
      })
    }
  }

  getBicycling = async (latitude, longitude) => {
    const polylines = await doRequest({
      baseUrl: 'https://apis.map.qq.com/ws/direction/v1',
      url: `driving/?from=${this.state.positionLatitude},${this.state.positionLongitude}&to=${latitude},${longitude}&output=json&callback=cb&key=${setting.mapkey}`
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

  findStoreDetail = (id) => {
    let storeDetail = {}
    this.props.service.stores.find((value) => {
      if (value.storeId === id) {
        storeDetail = value
        return
      }
    })
    return storeDetail
  }

  onMarkertap = (e) => {
    const value = this.findStoreDetail(e.markerId)
    this.getBicycling(value.latitude, value.longitude)
  }

  render () {
    return (
      <View className='home-page'>
        <Map
          id='map'
          scale='16'
          latitude={this.state.positionLatitude}
          longitude={this.state.positionLongitude}
          polyline={this.state.polyline}
          markers={this.doMap(this.props.service.stores)}
          showLocation
          onMarkertap={this.onMarkertap}
          className='map1'
          style={{height: `${this.state.height - 320}px`}}
        />
        <AtList>
          <AtListItem
            title='上门服务'
            isSwitch
            switchIsCheck={this.state.isGoService}
            onSwitchChange={this.onSwitchChange}
          />
          <View className='extra-input'>
            <Image src={require('../../assets/images/ic_item_phone.png')} className='extra-image' />
            <Text className='extra-text'>联系方式</Text>
            <Input
              type='number'
              placeholder='请输入手机号'
              maxLength={11}
              value={this.props.service.mobile}
              onChange={this.handleChange}
              placeholderClass='extra-input-placeholder'
              className='input-right'
            />
          </View>
          <View className='border' />
          <AtListItem
            title='车辆信息'
            arrow='right'
            extraText={this.props.service.carInfo.type&&this.props.service.carInfo.category&&`${this.props.service.carInfo.type.name},${this.props.service.carInfo.category.name},${this.props.service.carInfo.color || '未知颜色'},${this.props.service.carInfo.carNum}`}
            onClick={this.navigateTo.bind(this, 'carInfo')}
            thumb={require('../../assets/images/ic_item_car.png')}
          />
          {
            this.state.isGoService?<AtListItem
              title='地点信息'
              arrow='right'
              extraText={this.props.service.position.address}
              onClick={this.choiceAddress}
              thumb={require('../../assets/images/ic_item_location.png')}
            />:
            <AtListItem
              title='选择门店'
              arrow='right'
              extraText={this.props.service.storeInfo.address || ''}
              onClick={this.choiceAddress}
              thumb={require('../../assets/images/ic_item_location.png')}
            />
          }
          {
            this.state.isGoService&& <View>
              <View className='extra-input '>
                <Image src={require('../../assets/images/address-detail.png')} className='extra-image' />
                <Text className='extra-text'>详细地址</Text>
                <Input
                  placeholder='详细地址'
                  value={this.props.service.addressRemark}
                  onChange={this.remarkChange}
                  placeholderClass='extra-input-placeholder'
                  className='input-right'
                />
              </View>
              <View className='border' />
            </View>
          }
          <Picker mode='multiSelector' range={this.state.times}
            value={this.state.multiIndex}
            onChange={this.choiceBookTime}
            onColumnchange={this.columnchange}
          >
            <AtListItem
              title='预约时间'
              arrow='right'
              extraText={this.props.service.bookTime}
              thumb={require('../../assets/images/ic_item_time.png')}
            >
            </AtListItem>
          </Picker>
        </AtList>
        <View className='footer-btn'>
          <Button className='add_item_button' type='primary' 
            onClick={this.choiceService}
          >选择服务</Button>
          {
            this.state.showOrder &&
            <Button className='add_item_button' type='primary' onClick={this.onOrder}>
              一键下单
            </Button>
          }
        </View>
        
      </View>
    )
  }
}

export default connect(({ counter, service }) => ({
  counter, service
}), (dispatch) => ({
  onGetUserInfo (userInfo) {
    dispatch(getUserInfo(userInfo))
  },
  onGetOpenId (openid) {
    dispatch(getOpenId(openid))
  },
  onGetPosition (position) {
    dispatch(getPosition(position))
  },
  onGetAddressRemark (position) {
    dispatch(getAddressRemark(position))
  },
  onGetMobile (mobile)  {
    dispatch(getMobile(mobile))
  },
  onGetBookTime (bookTime) {
    dispatch(getBookTime(bookTime))
  },
  onGetCapabilityType (type) {
    dispatch(getCapabilityType(type))
  },
  onGetCarInfo (carInfo) {
    dispatch(getCarInfo(carInfo))
  },
  onGetCarType (carType) {
    dispatch(getCarType(carType))
  },
  onGetStores (stores) {
    dispatch(getStores(stores))
  },
  onGetStoreId (storeInfo) {
    dispatch(getStoreId(storeInfo))
  }
}))(Index)

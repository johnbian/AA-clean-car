import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { getServiceProject, getService } from '../../actions/service'
import { doRequest } from '../../assets/utils/request'
import './index.scss'
import setting from '../../assets/utils/setting';
import { format } from '../../assets/utils/timeUtils'

class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listall: [],
      activeIndex: 1,
      choiceServices: [],
      openList: false,
      price: 0,
    }
  }

  config = {}

  promotionId = ''

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  choiceDefaultDetail = (categoryId, serviceId, arr) => {
    let detail = {}
    arr.find(element => {
      if (element.categoryId === Number(categoryId)) {
        element.capabilites.find(obj => {
          if (obj.id === Number(serviceId)) {
            detail = obj
          }
          return
        })
      }
      return
    })
    return detail
  }

  choiceDefault = (categoryId, serviceId, arr) => {
    arr.find(element => {
      if (element.categoryId === Number(categoryId)) {
        element.capabilites.find(obj => {
          if (obj.id === Number(serviceId)) {
            obj.choosen = true
          }
          return
        })
        return
      }
    })
  }

  async componentWillMount () {
    const listResult = await doRequest({
      url: `cap/listallwithprice/${this.props.service.carInfo.type.id}/${this.props.service.carInfo.category.id}`,
    })
    if (this.$router.params.promotionId) {
      this.promotionId = this.$router.params.promotionId
      const { choiceServices } = this.state
      const { serviceId, categoryId } = this.$router.params
      const detail = this.choiceDefaultDetail(categoryId, serviceId, listResult.data)
      this.choiceDefault(categoryId, serviceId, listResult.data)
      this.setState({
        choiceServices: [...choiceServices, ...[detail]],
        listall: listResult.data,
      }, () => this.getShowPrice(this.state.choiceServices))
    } else {
      this.setState({
        listall: listResult.data,
      })
    }
  }

  componentDidMount () {
    let s = 0;
    const query = Taro.createSelectorQuery()
    query.selectAll('.card-list').boundingClientRect((rect) => {
      rect.forEach((res)=>{
        s += res.height
        this.heightArr.push(s)
      })
    }).exec()
  }

  componentWillUnmount () { }

  componentDidShow () {
    const { listall, choiceServices } = this.state
    if (this.props.service.service.detail && listall.length > 0) {
      const { detail, index, key, choosen } = this.props.service.service
      if (choosen && !listall[index].capabilites[key].choosen) {
        listall[index].capabilites[key].choosen = true
        this.setState({
          choiceServices: [...choiceServices, ...[detail]],
          listall,
        }, () => this.getShowPrice(this.state.choiceServices))
        return
      } 
      if (!choosen && listall[index].capabilites[key].choosen) {
        listall.findIndex((obj, idx) => {
          if (obj.categoryId === detail.categoryId) {
            obj.capabilites.find((item, k) => {
              if (item.id === detail.id) {
                listall[idx].capabilites[k].choosen = false
                return
              }
            })
            return
          }
        })
        const arr = [...choiceServices]
        arr.findIndex((value, idx) => {
          if (value && value.id === detail.id) {
            arr.splice(idx, 1)
            if (arr.length === 0) {
              this.setState({
                choiceServices: arr,
                listall,
                openList: false
              }, () => this.getShowPrice(this.state.choiceServices))
            } else {
              this.setState({
                choiceServices: arr,
                listall
              }, () => this.getShowPrice(this.state.choiceServices))
            }
          }
        })
        return
      }
    }
  }

  componentDidHide () { }

  saveActiveIndex (index) {
    this.setState({
      activeIndex: index
    })
  }

  onScroll (e) {
    const scrollTop = e.detail.scrollTop
    for (let i = 0; i < this.heightArr.length; i++) {
      if (scrollTop >=0 && scrollTop < this.heightArr[0]) {
        this.setState({
          activeIndex: 1
        })
      } else if (scrollTop > this.heightArr[i-1] && scrollTop < this.heightArr[i]) {
        this.setState({
          activeIndex: i+1
        })
      }
    }
  }

  openActionSheet () {
    this.setState({
      openList: true
    })
  }

  closeActionSheet () {
    this.setState({
      openList: false
    })
  }

  navigateTo (detail, index, key) {
    const { listall } = this.state
    listall[index].capabilites[key].choosen
    console.log(detail, index, key)
    this.props.onGetService({
      detail,
      index,
      key,
      choosen: listall[index].capabilites[key].choosen
    })
    Taro.navigateTo({url: `../../pages/serviceDetail/index`})
  }

  add (detail, index, key, e) {
    e.stopPropagation()
    const { choiceServices, listall } = this.state
    listall[index].capabilites[key].choosen = true
    this.setState({
      choiceServices: [...choiceServices, ...[detail]],
      listall,
    }, () => this.getShowPrice(this.state.choiceServices))
  }

  subtract(detail, e) {
    e.stopPropagation()
    const { choiceServices, listall } = this.state
    listall.findIndex((obj, index) => {
      if (obj.categoryId === detail.categoryId) {
        obj.capabilites.find((item, key) => {
          if (item.id === detail.id) {
            listall[index].capabilites[key].choosen = false
            return
          }
        })
        return
      }
    })
    const arr = [...choiceServices]
    arr.findIndex((value, index) => {
      console.log(value)
      if (value && value.id === detail.id) {
        arr.splice(index, 1)
        if (arr.length === 0) {
          this.setState({
            choiceServices: arr,
            listall,
            openList: false
          }, () => this.getShowPrice(this.state.choiceServices))
        } else {
          this.setState({
            choiceServices: arr,
            listall
          }, () => this.getShowPrice(this.state.choiceServices))
        }
      }
    })
  }

  sumPrice(list) {
    let price = 0
    for (const item of list) {
      price += item.price
    }
    return price
  }

  getServiceId(list) {
    let serviceIds = []
    for (const item of list) {
      serviceIds.push(item.id)
    }
    return serviceIds.join(',')
  }

  getShowPrice(arr) {
    let price = 0
    arr.forEach(obj =>{
      price += obj.price
    })
    this.setState({
      price
    })
  }

  async onOrder() {
    const resWaring = await Taro.showModal({
      title: '',
      content: 'AA洗车当前正处于内部测试阶段，暂不对外营业，请谨慎下单'
    })
    if (resWaring.confirm) {
      this.props.onGetServiceProject(this.state.choiceServices)
      const price = this.sumPrice(this.state.choiceServices)
      const serviceId = this.getServiceId(this.state.choiceServices)
      const orderTime = format('yyyy-MM-dd hh:mm:ss', new Date())
      const res = await doRequest({
        url: `main/order`,
        method: 'POST',
        data: {
          validId: setting.openid,
          price,
          vehicleType: this.props.service.carInfo.type.id,
          vehicleCategory: this.props.service.carInfo.category.id,
          license: this.props.service.carInfo.carNum,
          color: this.props.service.carInfo.color,
          serviceId,
          bookTime: `${this.props.service.bookTime}:00`,
          phoneNumber: this.props.service.mobile,
          orderTime,
          detailLocation: this.props.service.position.address,
          addressRemark: this.props.service.addressRemark,
          longitude: this.props.service.position.longitude,
          latitude: this.props.service.position.latitude,
          capabilityType: this.props.service.capabilityType,
          storeId: this.props.service.storeInfo.storeId ? this.props.service.storeInfo.storeId : null
        }
      })
      if (res.data&&res.data.orderId) {
        Taro.navigateTo({url: `../../pages/pay/index?orderId=${res.data.orderId}&promotionId=${this.promotionId}`})
      } else {
        Taro.showModal({
          title: '',
          content: res.data.message,
          showCancel: false
        })
      }
    } else if (resWaring.cancel) {
      console.log('用户点击取消')
    }
  }

  heightArr = []

  render () {
    return (
      <View className='service-container' style={{paddingBottom: this.state.choiceServices.length>0?50:0}}>
        <ScrollView 
          scrollY  
          className='nav-left'
        >
          {
            this.state.listall.map((item, index)=>{
              return (
                <View
                  key={index} 
                  onClick={this.saveActiveIndex.bind(this, item.categoryId)}
                  className={`${this.state.activeIndex === item.categoryId ? 'active-title': ''} title`}
                >
                  <Image className='avatar' src={item.categoryUrl} />
                  <Text className='title-txt'>{item.categoryName}</Text>
                </View>
              )
            })
          }
        </ScrollView>
        <ScrollView
          scrollY
          className='nav-right'
          scrollIntoView={`head-${this.state.activeIndex}`}
          onScroll={this.onScroll}
        >
          {
            this.state.listall.map((item, index)=>{
              return (
                <View key={index} id={`head-${item.categoryId}`} className='card-list'>
                  <Text className='card-title'>--{item.categoryName}--</Text>
                  {
                    item.capabilites.map((detail, key)=>{
                      return (
                        <View key={key} className='card' onClick={this.navigateTo.bind(this, detail, index, key)}>
                          <Image className='card-image' src={detail.iconUrl} />
                          <View className='card-content'>
                            <Text className='detail-title'>{detail.name}</Text>
                            <Text className='detail-subtitle detail-price'>¥{detail.price}</Text>
                            {
                              detail.choosen?
                              // <AtIcon
                              //   onClick={this.subtract.bind(this, detail)}
                              //   value='subtract-circle' size='20' color='#333' 
                              // />:
                              // <AtIcon 
                              //   onClick={this.add.bind(this, detail, index, key)}
                              //   value='add-circle' size='20' color='#333' 
                              // />
                              <Text
                                style={{ fontSize: '48rpx' }}
                                onClick={this.subtract.bind(this, detail)}
                              >-</Text>:
                              <Text style={{ fontSize: '48rpx' }} onClick={this.add.bind(this, detail, index, key)}>+</Text>
                            }
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
        </ScrollView>
        {
          this.state.choiceServices.length>0&&
          <View className='footer'>
            <View className='bage' onClick={this.openActionSheet}>
              <View className='list'>
                <Text>已选</Text>
              </View>
              <View className='bardge-view'>
                <View className='bardge'>
                  {this.state.choiceServices.length}
                </View>
              </View>
              <View className='list'>
                <Text>¥{this.state.price}</Text>
              </View>
            </View>
            <View className='view-btn' onClick={this.onOrder}>
              <Text>选好了</Text>
            </View>
          </View>
        }
        <AtFloatLayout
          isOpened={this.state.openList}
          onClose={this.closeActionSheet}
          title='已选服务'
        >
          <View className='items'>
            {
              this.state.choiceServices.map((item, index)=>{
                return (<View key={index} className='item'>
                  <Text>{item.name} ¥{item.price}</Text>
                  <AtIcon onClick={this.subtract.bind(this, item)}  value='subtract-circle' size='20' color='#333' />
                </View>)
              })
            }
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
export default connect(({ service }) => ({
  service
}), (dispatch) => ({
  onGetServiceProject (projects)  {
    dispatch(getServiceProject(projects))
  },
  onGetService (service) {
    dispatch(getService(service))
  }
}))(Services) 

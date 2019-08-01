import Taro, { Component } from '@tarojs/taro'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtFloatLayout } from 'taro-ui'
import { Button, View, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getCarInfo } from '../../actions/service'
import defaultData from '../../assets/config'

import './index.scss'

class CarInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenType: false,
      isOpenCategory: false,
      isOpenColor: false,
      carInfo: {}
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('选择车辆信息')
  }

  componentDidMount () {
    this.setState({
      carInfo: this.props.service.carInfo
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  openActionSheet (name) {
    switch (name) {
      case 'type':
      this.setState({
        isOpenType: true
      })
      break;
      case 'category':
      this.setState({
        isOpenCategory: true
      })
      break;
      case 'color':
      this.setState({
        isOpenColor: true
      })
      break;
    }
  }

  closeActionSheet (name) {
    switch (name) {
      case 'type':
      this.setState({
        isOpenType: false
      })
      break;
      case 'category':
      this.setState({
        isOpenCategory: false
      })
      break;
      case 'color':
      this.setState({
        isOpenColor: false
      })
      break;
    }
  }

  handSheetItem (item) {
    if (this.state.isOpenType) {
      this.setState({
        carInfo: {...this.state.carInfo, ...{type: item}},
        isOpenType: false
      })
    } else if (this.state.isOpenCategory) {
      this.setState({
        carInfo: {...this.state.carInfo, ...{category: item}},
        isOpenCategory: false
      })
    }
  }

  handleChange (e) {
    this.setState({
      carInfo: {...this.state.carInfo, ...{carNum: e.detail.value}}
    })
  }

  onClickTag (name) {
    this.setState({
      carInfo: {...this.state.carInfo, ...{color: name}},
      isOpenColor: false
    })
  }

  validate () {
    const { carInfo } = this.state
    if (!carInfo.type) {
      Taro.showModal({
        title: '',
        content: '请选择车型',
        showCancel: false
      })
      return false
    } else if (!carInfo.category) {
      Taro.showModal({
        title: '',
        content: '请选择类型',
        showCancel: false
      })
      return false
    } else if (!carInfo.color) {
      Taro.showModal({
        title: '',
        content: '请选择颜色',
        showCancel: false
      })
      return false
    } else if (!carInfo.carNum) {
      Taro.showModal({
        title: '',
        content: '请输入车牌号',
        showCancel: false
      })
      return false
    }
    return true
  }

  addCarInfo () {
    if (this.validate()) {
      this.props.onGetCarInfo(this.state.carInfo)
      Taro.navigateBack()
    }
  }

  render () {
    return (
      <View className='car-info'>
        <AtList>
          <AtListItem
            title='选择车型'
            arrow='right'
            extraText={this.state.carInfo.type&&this.state.carInfo.type.name}
            onClick={this.openActionSheet.bind(this, 'type')}
          />
          <AtListItem
            title='选择类型'
            arrow='right'
            extraText={this.state.carInfo.category&&this.state.carInfo.category.name}
            onClick={this.openActionSheet.bind(this, 'category')}
          />
          <AtListItem
            title='选择颜色'
            arrow='right'
            extraText={this.state.carInfo.color}
            onClick={this.openActionSheet.bind(this, 'color')}
          />
        </AtList>
        <View className='extra-input'>
          <Text className='extra-text'>车牌号</Text>
          <Input
            value={this.state.carInfo.carNum}
            placeholder='请输入车牌号'
            onInput={this.handleChange}
            placeholderClass='extra-input'
          />
        </View>
        <AtActionSheet 
          onClose={this.closeActionSheet.bind(this, 'type')}
          isOpened={this.state.isOpenType}
        >
        {
          this.props.counter.carType.vehicleTypes.map((item, index)=>{
            return (
              <AtActionSheetItem 
                key={index} 
                onClick={this.handSheetItem.bind(this, item)}
              >
                {item.name}
              </AtActionSheetItem>
            )
          })
        }
        </AtActionSheet>
        <AtActionSheet 
          onClose={this.closeActionSheet.bind(this, 'category')}
          isOpened={this.state.isOpenCategory}
        >
        {
          this.props.counter.carType.vehicleCategories.map((item, index)=>{
            return (
              <AtActionSheetItem 
                key={index} 
                onClick={this.handSheetItem.bind(this, item)}
              >
                {item.name}
              </AtActionSheetItem>
            )
          })
        }
        </AtActionSheet>
        <AtFloatLayout
          isOpened={this.state.isOpenColor}
          onClick={this.openActionSheet.bind(this, 'color')}
          onClose={this.closeActionSheet.bind(this, 'color')}
          title='选择颜色'
        >
          <View className='dialog_bottom_view'>
            {
              defaultData.colors.map((name, index)=>{
                return (
                  <View
                    key={index}
                    className={`item_normal dialog_bottom ${name===this.state.carInfo.color ? 'item_select':''}`}
                    onClick={this.onClickTag.bind(this, name)}
                  >
                    {name}
                  </View>
                )
              })
            }
          </View>
        </AtFloatLayout>
        <Button className='add_item_button' type='primary' onClick={this.addCarInfo}>添加</Button>
      </View>
    )
  }
}
export default connect(({ service, counter }) => ({
  service, counter
}), (dispatch) => ({
  onGetCarInfo (carInfo)  {
    dispatch(getCarInfo(carInfo))
  }
}))(CarInfo)

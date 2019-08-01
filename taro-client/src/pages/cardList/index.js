import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CardItem from '../../components/cardItem/index'
import { doRequest } from '../../assets/utils/request'
import NoData from '../../components/noData/index'

import './index.scss'

class CardList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isNoData: false
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    console.log('套餐卡页')
  }

  async componentDidMount () {
    const cards = await doRequest({
      url: `my/promotionlist/${this.props.counter.openid}`
    })
    this.setState({
      cards: cards.data,
      isNoData: cards.data.length > 0 ? false : true
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  goService = (item) => {
    console.log(item)
    const { position, mobile, carInfo, bookTime } = this.props.service
    this.props.service.position.address
    if (position.address && mobile && carInfo.carNum && bookTime) {
      Taro.navigateTo({url: `../../pages/services/index?serviceId=${item.serviceId}&promotionId=${item.id}&categoryId=${item.categoryId}`})
    } else {
      Taro.switchTab({url: '../../pages/index/index'})
    }
  }

  render () {
    return (
      <View className='card-list'>
        {
          this.state.cards.map((item, index)=>{
            return <CardItem onGoService={this.goService.bind(this, item)} item={item} key={index} />
          })
        }
        {
          this.state.isNoData && <NoData title='暂无数据' />
        }
      </View>
    )
  }
}
export default connect(({ counter, service }) => ({
  counter, service
}))(CardList)

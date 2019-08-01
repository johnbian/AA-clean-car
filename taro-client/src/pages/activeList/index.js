import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CardItem from '../../components/cardItem/index'
import { doRequest } from '../../assets/utils/request'
import NoData from '../../components/noData/index'

import './index.scss'

class ActiveList extends Component {

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
      url: `event/promotionlist`
    })
    this.setState({
      cards: cards.data,
      isNoData: cards.data.length > 0 ? false : true
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='active-list'>
        {
          this.state.cards.map((item, index)=>{
            return <CardItem item={item} key={index} />
          })
        }
        {
          this.state.isNoData && <NoData title='暂无数据' />
        }
      </View>
    )
  }
}
export default connect(({ counter }) => ({
  counter
}))(ActiveList)

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import reelItem from '../../components/reelItem/index'
import { doRequest } from '../../assets/utils/request'
import NoData from '../../components/noData/index'

import './index.scss'

class ReelList extends Component {

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
      url: `my/couponlist/${this.props.counter.openid}`
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
      <View className='reel-list'>
        {
          this.state.cards.map((item, index)=>{
            return <reelItem item={item} key={index} />
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
}))(ReelList)

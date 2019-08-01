import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'
import { getStoreId } from '../../actions/service'

class Stores extends Component {

  constructor(props) {
    super(props);
    this.state ={
      value: '0'
    }
  }

  config = {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    this.setState({
      value: this.props.service.storeInfo.storeId ||
       this.props.service.stores[0].storeId
    })
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  mapOptions (arr) {
    const newArr = []
    if (arr) {
      arr.forEach(element => {
        const obj = {
          label: element.title,
          value: element.storeId,
          desc: element.address
        }
        newArr.push(obj)
      })
    }
    return newArr
  }

  saveStore (storeId) {
    this.props.service.stores.forEach(element => {
      if (element.storeId === storeId ) {
        this.props.getStoreId(element)
        return
      }
    })
    Taro.navigateBack()
  }

  handleChangeCoup (value) {
    this.setState({
      value,
    }, this.saveStore(value))
  }

  render () {
    return (
      <AtRadio
        options={this.mapOptions(this.props.service.stores)}
        value={this.state.value}
        onClick={this.handleChangeCoup}
      />
    )
  }
}
export default connect(({ service }) => ({
  service
}), (dispatch) => ({
  getStoreId (storeInfo) {
    dispatch(getStoreId(storeInfo))
  }
}))(Stores)

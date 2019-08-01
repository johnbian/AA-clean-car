import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { getService } from '../../actions/service'
import './index.scss';

if (process.env.TARO_ENV === 'weapp') {
  require('taro-ui/dist/weapp/css/index.css')
} else if (process.env.TARO_ENV === 'h5') {
  require('taro-ui/dist/h5/css/index.css')
}

class ServiceDetail extends Component {
  constructor(props) {
    super(props);
  }

  config = {};

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillMount() {
    console.log('服务详情页');
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  add = () => {
    const { choosen } = this.props.service.service
    this.props.onGetService({
      ...this.props.service.service , ...{ choosen: !choosen }
    })
  }

  render() {
    const { choosen } = this.props.service.service
    return (
      <View className='at-article service-detail'>
        <View className='at-article__h1'>
          <Text>{this.props.service.service.detail.name}</Text>
          <Text style={{ fontSize: '12px', color: choosen? '#FF4949' : '#00BDE2' }} onClick={this.add}>{choosen? '取消加入': '加入购物车'}</Text>
        </View>
        <View className='at-article__content'>
          <View className='at-article__section'>
            <View className='at-article__h2'>材料：</View>
            <View className='at-article__p'>
              {this.props.service.service.detail.consumables}
            </View>
            <View className='at-article__h2'>洗车内容：</View>
            <View className='at-article__p'>
              {this.props.service.service.detail.cleanningPart}
            </View>
            <Image
              className='at-article__img'
              src={this.props.service.service.detail.iconUrl}
              mode='widthFix'
            />
          </View>
        </View>
      </View>
    );
  }
}
export default connect(({ service }) => ({
  service
}), (dispatch) => ({
  onGetService (service) {
    dispatch(getService(service))
  }
}))(ServiceDetail)

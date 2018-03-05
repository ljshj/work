/**
 * 反馈意见
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  InteractionManager,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import Global from '../../Global';
import { submit } from '../../services/me/FeedBackService';

class Suggest extends Component {
  static displayName = 'Suggest';
  static description = '反馈意见';

  static navigationOptions = () => ({
    title: '反馈意见',
  });

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.changeFeedBack = this.changeFeedBack.bind(this);
    this.doSave = this.doSave.bind(this);
    this.goPop = this.goPop.bind(this);
    this.showLoading = this.showLoading.bind(this);
  }

  state = {
    doRenderScene: false,
    // data: null,
    feedback: null,
    loading: false,
    // connect: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillReceiveProps() {

  }


  // 保存反馈意见
  async doSave() {
    // 显示遮罩
    this.props.screenProps.showLoading();

    const data = {
      feedback: this.state.feedback, appId: '8a8c7db154ebe90c0154ebfdd1270004', hospId: '123', userId: Global.user.id,
    };
    try {
      const responseData = await submit(data);
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      if (responseData.success === false) {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                this.setState({ value: {} });
              },
            },
          ],
        );
      } else {
        Toast.show('保存成功！');
        this.goPop();
      }
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }
  refresh() {
    this.setState({
      // data: null,
      feedback: null,
      // connect: null,
    });
  }
  changeFeedBack(value) {
    this.setState({
      feedback: value,
    });
  }

  goPop() {
    this.props.navigation.goBack();
  }

  render() {
    if (!this.state.doRenderScene) { return Suggest.renderPlaceholderView(); }
    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={{ flex: 1 }} >
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={styles.holder}>
            <Text style={styles.text}>反馈意见:</Text>
            <View style={Global.styles.PLACEHOLDER10} />
            <View style={[styles.viewInputHolder]}>
              <TextInput
                style={[styles.rowInput]}
                multiline
                maxLength={500}
                onChangeText={(value) => { this.changeFeedBack(value); }}
                placeholder="您好，请你描述你遇到的问题，或提出你宝贵的意见，我们将有专人及时与你联系！"
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={styles.buttonHolder} >
            <Button text="提交" onPress={this.doSave} theme={Button.THEME.BLUE} />
          </View>
          <ActivityIndicator
            animating={this.state.loading}
            style={{ height: 80 }}
            size="large"
          />
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  holder: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(93,93,93,1)',
  },
  rowInput: {
    flex: 1,
    fontSize: 14,
    backgroundColor: 'transparent',
    padding: 6,
  },
  viewInputHolder: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.LINE,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
  },
  buttonHolder: {
    flexDirection: 'row',
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Suggest;

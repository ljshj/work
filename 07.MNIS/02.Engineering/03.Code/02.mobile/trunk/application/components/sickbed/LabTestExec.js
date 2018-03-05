/**
 * 化验（样本采集）
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import SafeView from 'react-native-safe-area-view';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import moment from 'moment';

import Global from '../../Global';
import PatientInfo from '../common/PatientInfo';
import ScannerButton from '../common/ScannerButton';
import BackButton from '../common/BottomBackButton';
import Item from '../../modules/PureListItem';
import { testOrder, testOrderByBarcode } from '../../services/sickbed/Sickbed';
import { setCurrPatient } from '../../actions/base/BaseAction';

class LabTestExec extends Component {
  static displayName = 'LabTestExec';
  static description = '化验（样本采集）';

  constructor(props) {
    super(props);
    this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
    this.onScanWristbandExec = this.onScanWristbandExec.bind(this);
    this.getBottomBar = this.getBottomBar.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.setData = this.setData.bind(this);
    this.fetchOrderByBarcode = this.fetchOrderByBarcode.bind(this);
    this.fetchOrder = this.fetchOrder.bind(this);
    this.dataHandle = this.dataHandle.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    selected: [],
    refreshing: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({ onMainScanSuccess: this.onMainScanSuccess });
    // 如果首页扫功能条码进入此功能并传入条码，则自动查询化验医嘱
    const { params } = this.props.navigation.state;
    if (params && params.barcode) {
      this.fetchOrderByBarcode(params.barcode);
    } else if (this.props.base.currPatient) {
      this.fetchOrder(this.props.base.currPatient.inpatientNo);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currPatient } = this.props.base;
    const nextPatient = nextProps.base.currPatient;
    if ((!currPatient && nextPatient) || (currPatient && nextPatient && currPatient.inpatientNo !== nextPatient.inpatientNo)) {
      this.setState({
        data: [],
        refreshing: false,
        selected: [],
      }, () => {
        this.fetchOrder(nextProps.base.currPatient.inpatientNo);
      });
    }
  }

  /**
   * 主操作扫描完成回调
   */
  onMainScanSuccess(barcode) {
    this.fetchOrderByBarcode(barcode);
  }

  /**
   * 扫腕带执行回调
   */
  onScanWristbandExec(barcode) {
    const patient = this.props.screenProps.getPatient(barcode);
    if (!patient) {
      Alert.alert(
        '提示',
        '未找到该患者信息或不是有效的腕带二维码/条码！',
        [
          { text: '确定', style: 'cancel' },
        ],
      );
      return;
    }
    const { currPatient } = this.props.base;
    if (patient.inpatientNo === currPatient.inpatientNo) {
      Toast.show('执行成功');
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        '提示',
        '腕带所属患者与当前患者不一致！',
        [
          { text: '确定', style: 'cancel' },
        ],
      );
    }
  }

  getBottomBar() {
    return (
      <View style={Global.styles.FIXED_BOTTOM_BTN_CONTAINER} >
        <BackButton />
        <ScannerButton
          type={ScannerButton.SCAN_WRISTBAND_EXEC}
          navigation={this.props.navigation}
          onSuccess={this.onScanWristbandExec}
          disabled={this.state.selected.length === 0}
        />
      </View>
    );
  }

  setData(data, inpatientNo, barcode) {
    const selected = this.state.selected.concat();
    if (barcode) selected[selected.length] = barcode;
    this.setState({
      data,
      refreshing: false,
      selected: _.uniq(selected),
    });
  }

  async fetchOrderByBarcode(barcode) {
    try {
      this.setState({ refreshing: true });
      const responseData = await testOrderByBarcode(barcode);
      if (responseData.success) {
        const data = responseData.result;
        this.dataHandle(data, null, barcode);
      } else {
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  async fetchOrder(inpatientNo) {
    try {
      this.setState({ refreshing: true });
      const responseData = await testOrder(inpatientNo);
      if (responseData.success) {
        const data = responseData.result;
        this.dataHandle(data, inpatientNo, null);
      } else {
        Toast.show(responseData.msg);
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  dataHandle(data, inpatientNo, barcode) {
    if (data.length !== 0) {
      const patient = this.props.screenProps.getPatient(data[0].inpatientNo);
      const { currPatient } = this.props.base;
      if (!currPatient) { // 当前患者不存在
        // 设置当前患者
        this.props.setCurrPatient(patient);
        this.setData(data, inpatientNo, barcode);
      } else if (currPatient.inpatientNo !== patient.inpatientNo) { // 当前患者存在但与新获取的患者不一致
        Alert.alert(
          '提示',
          `LIS条码 ${barcode} 对应的患者 ${patient.name} 与当前所选患者 ${currPatient.name} 不一致。${'\n'}${'\n'}点击"确定"按钮切换患者，点击"取消"按钮放弃当前操作。`,
          [
            { text: '取消', style: 'cancel' },
            {
              text: '确定',
              onPress: () => {
                this.props.setCurrPatient(patient);
                this.setState({
                  data: [],
                  refreshing: false,
                  selected: [],
                }, () => {
                  this.setData(data, inpatientNo, barcode);
                });
              },
            },
          ],
        );
      } else { // 当前患者存在
        this.setData(data, inpatientNo, barcode);
      }
    } else {
      this.setData([], null, null);
      Toast.show('未查询到相关数据');
    }
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <Card style={{ height: 120 }} />
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <Card noPadding style={[Global.styles.CENTER, { flex: 1 }]} >
            <ActivityIndicator />
          </Card>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          {this.getBottomBar()}
        </SafeView>
      </View>
    );
  }

  renderItem({ item, index }) {
    // console.log(item);
    const iconName = _.indexOf(this.state.selected, item.barcode) !== -1 ? 'radio-button-checked' : 'radio-button-unchecked';
    const iconColor = _.indexOf(this.state.selected, item.barcode) !== -1 ? Global.colors.IOS_BLUE : Global.colors.FONT_GRAY;
    const lastRow = index === this.state.data.length - 1 ? {
      borderBottomColor: Global.colors.LINE,
      borderBottomWidth: 1 / Global.pixelRatio,
    } : null;
    return (
      <Item
        data={item}
        index={index}
        chevron={false}
        onPress={() => {
          // 如支持手选，把这段代码放开
          // const selected = this.state.selected.concat();
          // if (_.indexOf(selected, item.barcode) === -1) selected[selected.length] = item.barcode;
          // else selected.splice(_.indexOf(selected, item.barcode), 1);
          // this.setState({ selected });
        }}
        style={lastRow}
      >
        <Icon iconLib="mi" name={iconName} color={iconColor} />
        <View style={{ flex: 1 }} >
          <View style={[styles.itemRowContainer, styles.mainItemRowContainer]} >
            <Text style={{ flex: 1 }} >{item.sample}{item.tube ? ` ( ${item.tube} )` : null}</Text>
            <Text style={styles.itemBarcode} >{item.barcode}</Text>
          </View>
          <View style={[styles.itemRowContainer, { marginBottom: 8 }]} >
            <Text style={{ flex: 2 }} >
              <Text style={styles.normalLabel} >开立时间：</Text>
              <Text style={styles.normalValue} >{item.orderTime ? moment(item.orderTime).format('YYYY/MM/DD hh:mm') : null}</Text>
            </Text>
            <Text style={{ flex: 1, textAlign: 'right' }} >
              <Text style={[styles.normalValue, { color: Global.colors.IOS_RED }]} >{item.isEmergency ? '急诊' : ''}</Text>
            </Text>
          </View>
          {
            item.items.map(({ testName }, idx) => {
              return (
                <View key={`${idx + 1}`} style={styles.testGrpContainer} >
                  <Text style={styles.normalValue} >{idx + 1} . </Text>
                  <Text style={styles.normalLabel} >{testName}</Text>
                </View>
              );
            })
          }
        </View>
      </Item>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <PatientInfo />
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <Card noPadding style={{ flex: 1 }} >
            <FlatList
              ref={(c) => { this.listTestsRef = c; }}
              data={this.state.data}
              style={styles.list}
              keyExtractor={(item, index) => `${item}${index + 1}`}
              // 渲染行
              renderItem={this.renderItem}
              // 渲染行间隔
              ItemSeparatorComponent={() => (<Sep height={1} bgColor={Global.colors.LINE} />)}
              // 控制下拉刷新
              refreshing={this.state.refreshing}
            />
          </Card>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          {this.getBottomBar()}
        </SafeView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  itemRowContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  mainItemRowContainer: {
    paddingBottom: 5,
  },
  itemBarcode: {
    width: 100,
    textAlign: 'right',
  },
  normalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Global.colors.FONT_GRAY,
  },
  testGrpContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
});

LabTestExec.navigationOptions = ({ navigation, screenProps }) => {
  return {
    headerTitle: 'LIS执行',
    headerRight: (
      <ScannerButton
        type={ScannerButton.SCAN_TEST_BARCODE}
        navigation={navigation}
        screenProps={screenProps}
        onSuccess={navigation.state.params ? navigation.state.params.onMainScanSuccess : null}
      />
    ),
  };
};

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LabTestExec);
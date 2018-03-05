/**
 * 消费记录
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';

import PintrestTabBar from '../../modules/PintrestTabBar';
import ConsumeRecords from './ConsumeRecords';
import PreRecords from './PreRecords';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';

import { getPreRecords, getConsumeRecords } from '../../services/consume/ConsumeRecordsService';
import { getPreStore } from '../../services/payment/AliPayService';

class ConsumeMain extends Component {
  static displayName = 'ConsumeMain';
  static description = '消费记录';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.callback = this.callback.bind(this);
  }

  state = {
    doRenderScene: false,
    profile: {},
    preRecords: [],
    consumeRecords: [],
    balance: 0,
    ctrlState,
  };

  async componentDidMount() {
    const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.getProfile(this.props.base.currHospital, this.props.base.currPatient));
    });
    this.props.navigation.setParams({
      title: '消费记录',
      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: true,
    });
  }
  getProfile(hospital, patient) {
    if (hospital !== null && patient !== null) {
      const { profiles } = patient;
      if (profiles !== null) {
        const length = profiles.length ? profiles.length : 0;
        for (let i = 0; i < length; i++) {
          const pro = profiles[i];
          if (pro.status === '1' && pro.hosId === hospital.id) {
            this.setState({
              profile: pro,
            }, () => this.fetchData());
          }
        }
      } else {
        Toast.show('当前就诊人在当前医院暂无档案！');
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            requestErrMsg: '当前就诊人在当前医院暂无档案！',
          },
        });
        return null;
      }
    }
  }
  afterChooseHospital(hospital) {
    this.getProfile(hospital, this.props.base.currPatient);
  }
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
      }, () => this.fetchData());
    }
  }
  callback() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
      },
    });
    this.fetchData();
  }
  async fetchData() {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const consumeRecordsData = await getConsumeRecords({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
      const preRecordsData = await getPreRecords({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
      const responseData = await getPreStore({ no: this.state.profile.no });
      if (consumeRecordsData.success) {
        this.setState({
          preRecords: preRecordsData.result ? preRecordsData.result : [],
          consumeRecords: consumeRecordsData.result ? consumeRecordsData.result : [],
          balance: responseData.result ? responseData.result.balance : 0,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      } else {
        this.handleRequestException({ msg: '获取消费记录出错！' });
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      }
    } catch (e) {
      this.handleRequestException(e);
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
    }
  }
  render() {
    if (!this.state.doRenderScene) { return ConsumeMain.renderPlaceholderView(); }
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <PintrestTabBar />}
      >
        <ConsumeRecords
          tabLabel="缴费记录"
          consumeRecords={this.state.consumeRecords}
          balance={this.state.balance}
          screenProps={this.props.screenProps}
          callback={this.callback}
          ctrlState={this.state.ctrlState}
        />
        <PreRecords
          tabLabel="预存记录"
          preRecords={this.state.preRecords}
          balance={this.state.balance}
          screenProps={this.props.screenProps}
          callback={this.callback}
          ctrlState={this.state.ctrlState}
        />
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = state => ({
  base: state.base,
});
export default connect(mapStateToProps)(ConsumeMain);
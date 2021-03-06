import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import EasyCard from 'rn-easy-card';
import Portrait from 'rn-easy-portrait';

import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import { page } from '../../../services/community/ConsultRecordsService';


const initPage = { start: 0, limit: 20 };

class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem(typeof (this.props.data) !== 'undefined' ? this.props.data : null, typeof this.props.index !== 'undefined' ? this.props.index : '');
  };

  render() {
    const { data } = this.props;
    const item = data;
    const portrait = (<Portrait
      width={30}
      height={30}
      radius={15}
      bgColor={Global.colors.FONT_LIGHT_GRAY1}
      imageSource={item.doctor && item.doctor.photo && item.doctor.photo === null ?
        Global.Config.defaultImgs.docPortrait : ({ uri: `${Global.getImageHost()}${item.doctor && item.doctor.photo && item.doctor.photo}?timestamp=${new Date().getTime()}` })}
    />);

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={{ marginTop: 6, marginLeft: 6, marginRight: 6, borderRadius: 20 }}
      >
        <EasyCard hideBottomBorder hideTopBorder fullWidth style={{ height: 80, backgroundColor: '#FFFFFFFF', flexDirection: 'column' }}>
          <View style={{ height: 40, flexDirection: 'row' }}>
            {portrait}
            <View style={{ flexDirection: 'column' }}>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 15, width: 80, color: '#2C3742' }}>{item.doctor && item.doctor.name && item.doctor.name}</Text>
              </View>
              <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                <Text style={{ fontSize: 10, width: 20, color: '#999999' }}>{item.doctor.gender === '1' ? '男' : '女'}</Text>
                <Text style={{ fontSize: 10, width: 20, color: '#999999' }}>{item.doctor.age}</Text>
                <Text style={{ fontSize: 10, width: 50, color: '#999999' }}>一分钟前</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 15, color: '#999999' }}>咨询费：</Text>
              <Text style={{ fontSize: 15, color: '#2C3742' }}>100元</Text>
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 14, width: Global.getScreen().width - 65, color: '#999999' }}>{'咨询已完结'} </Text>
          </View>
        </EasyCard>
      </TouchableOpacity>
    );
  }
}

class HistoryConsult extends Component {
  static displayName = 'HistoryConsult';
  static description = '历史咨询';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.gotoReply = this.gotoReply.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.afterEdit = this.afterEdit.bind(this);
  }

  state = {
    page: initPage,
    doRenderScene: false,
    data: [],
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.fetchData());
    });
  }


  // 搜索
  onSearch() {
    // console.log('.......ctrlState in onSearch:', this.state.ctrlState);
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 列表滑动到底部自动触发
  onEndReached() {
    // console.log('.......ctrlState in onEndReached:', this.state.ctrlState);
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
    this.onInfiniteLoad();
  }

  // 无限加载请求
  onInfiniteLoad() {
    // console.log('.......ctrlState in onInfinitedLoad:', this.state.ctrlState);
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  // 跳转到查看回复界面
  gotoReply(data, index) {
    // 隐藏多选按钮并清除被选数据
    let newState = {
      selectedIds: [],
      showChooseButton: false,
    };
    // 当前登陆人是患者需要效验
    /* if (item.replyList.length === 0) {
      Toast.show('还没有回复，请耐心等待！');
      return;
    } */

    if (typeof index !== 'undefined') newState = { ...newState, index };
    this.setState(newState);
    const newItem = {};
    newItem.consultType = data.consultType;
    newItem.consultDetail = data.consultDetail;
    newItem.createdBy = data.createdBy;
    newItem.id = data.id;
    newItem.status = data.status;
    newItem.reply = data.replyList && data.replyList.length > 0 ? data.replyList[0] : '';
    this.props.navigates('ConsultDetail', {
      flag: 'consult',
      data: newItem,
      callback: this.afterReply,
      index,
    });
  }

  // 修改完成后回调
  afterEdit(item) {
    this.setState((state) => {
      const data = state.data.concat();
      if (typeof this.state.index === 'number') data.splice(this.state.index, 1, item);
      else data.splice(0, 0, item);
      return { data };
    });
  }

  // 查询数据
  async fetchData() {
    // console.log('.......ctrlState in fetchData:', this.state.ctrlState);
    try {
      const responseData = await page(
        this.state.ctrlState.refreshing ? initPage.start : this.state.page.start,
        this.state.page.limit,
        {
          createdBy: this.props.auth.user.id,
          status: '3',
          hosId: this.props.base.currHospital.id,
        },
      );
      if (responseData.success) {
        // 下拉刷新则使用新数据取代所有已有的数据，如果是无限加载，则在数据底端追加数据
        const data = this.state.ctrlState.refreshing ? responseData.result : this.state.data.concat(responseData.result);
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: (responseData.start + responseData.pageSize >= responseData.total),
        };
        const newPage = {
          ...this.state.page,
          total: responseData.total,
          start: responseData.start + responseData.pageSize,
        };
        this.setState({
          data,
          ctrlState: newCtrlState,
          page: newPage,
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
        });
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      // console.log('exception in ConsultRecords fetchData:', e);
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }


  /**
   * 渲染行数据
   */
  renderItem({ item }) {
    return (
      <Item
        key={`new_consult_${item.id}`}
        data={item}
        onPressItem={this.gotoReply}
      />
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return HistoryConsult.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.state.data}
            style={styles.list}
            keyExtractor={(item, index) => `${item.id}_${index + 1}`}
            // 渲染行
            renderItem={this.renderItem}
            // 渲染行间隔
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            // 控制无限加载
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.05}
            // 无数据占位符
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无历史咨询信息',
                reloadMsg: '点击刷新按钮重新查询',
                reloadCallback: this.onSearch,
                ctrlState: this.state.ctrlState,
              });
            }}
            // 列表底部
            ListFooterComponent={() => {
              return this.renderFooter({
                data: this.state.data,
                ctrlState: this.state.ctrlState,
                callback: this.onInfiniteLoad,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    minHeight: 200,
  },
});


const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});


export default connect(mapStateToProps)(HistoryConsult);


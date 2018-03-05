/**
 * 预存记录
 */
import React, {
  Component,
} from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import { connect } from 'react-redux';

import Global from '../../Global';
import Item from '../../modules/PureListItem';
import ctrlState from '../../modules/ListState';

import { filterMoney } from '../../utils/Filters';

class PreRecords extends Component {
  static displayName = 'PreRecords';
  static description = '预存记录';

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
    });
  }

  onSearch() {
    const { callback } = this.props;
    if (typeof callback === 'function') {
      callback();
    }
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    let tradeChannel = '';
    if (item.tradeChannel === 'C') {
      tradeChannel = '现金';
    } else if (item.tradeChannel === 'Z') {
      tradeChannel = '支付宝';
    } else if (item.tradeChannel === 'W') {
      tradeChannel = '微信';
    } else if (item.tradeChannel === 'B') {
      tradeChannel = '银行';
    } else {
      tradeChannel = '其他';
    }
    return (
      <Item
        data={item}
        index={index}
        chevron={null}
        contentStyle={{ padding: 0 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', margin: 15 }} >
          <View style={{ flex: 3 }} >
            <Text style={{ fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY1 }}>{item.tradeTime ? moment(item.tradeTime).format('YYYY-MM-DD hh:mm') : '暂无日期' }</Text>
            <Sep height={6} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{tradeChannel}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1, textAlign: 'right' }}>{filterMoney(item.amt)}</Text>
          </View>
        </View>
      </Item>
    );
  }

  render() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <View style={{ backgroundColor: 'white' }} >
          <View style={{ paddingTop: 19 / 2, paddingBottom: 19 / 2, flexDirection: 'row', marginLeft: 15, alignItems: 'center' }} >
            <Text style={{ fontSize: 14, color: Global.colors.FONT }}>可用余额</Text>
            <Sep width={10} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: Global.colors.IOS_RED }}>{filterMoney(this.props.balance)}</Text>
          </View>
          <Sep width={19 / 2} />
        </View>
        <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.props.preRecords}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.props.ctrlState.refreshing}
            onRefresh={this.onSearch}
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无信息',
                reloadMsg: '点击刷新按钮重新加载',
                reloadCallback: this.onSearch,
                ctrlState: this.props.ctrlState,
              });
            }}
            style={styles.list}
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
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
});

const mapStateToProps = state => ({
  base: state.base,
});
export default connect(mapStateToProps)(PreRecords);

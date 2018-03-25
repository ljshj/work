import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DatePicker, List, Toast } from 'antd-mobile';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import styles from './InpatientDailyMain.less';
import ProfileList from '../patients/ProfileList';

const { Item } = List;
const { Brief } = Item;

class InpatientDailyMain extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.loadInpatientDaily = this.loadInpatientDaily.bind(this);
    this.goback = this.goback.bind(this);
    this.state = {
      selectDate: new Date(),
      maxDate: new Date(),
    };
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      const selectDate = this.formatDate(this.state.selectDate);
      this.loadInpatientDaily(currProfile, selectDate);
    }
  }
  callback(item) {
    const selectProfile = item;
    const selectDate = this.formatDate(this.state.selectDate);
    this.loadInpatientDaily(selectProfile, selectDate);
  }
  formatDate(date) {
    const pad = n => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return `${dateStr}`;
  }
  changeDate(date) {
    const { currProfile } = this.props.base;
    if (Object.keys(currProfile).length === 0) {
      Toast.info('请选择就诊人', 1);
    } else {
      this.setState({ selectDate: date });
      const selectDate = this.formatDate(date);
      this.loadInpatientDaily(currProfile, selectDate);
    }
  }
  /**
   * 格式化money
   * s为要格式化的money
   * n为小数位数
   */
  formatMoney(s, n) {
    if (s === '') { return; }
    n = n > 0 && n <= 20 ? n : 2;
    s = `${parseFloat((`${s}`).replace(/[^\d\.-]/g, '')).toFixed(n)}`;
    const l = s.split('.')[0].split('').reverse();
    const r = s.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return `${t.split('').reverse().join('')}.${r}`;
  }
  loadInpatientDaily(profile, date) {
    const query = { proNo: profile.no, hosNo: profile.hosNo, startDate: date, endDate: date };
    console.info('query', query);
    this.props.dispatch({
      type: 'inpatientDaily/findInpatientDaily',
      payload: query,
    });
  }
  goback() {
    console.log('返回');
    this.props.dispatch(routerRedux.goBack());
  }
  render() {
    const { data, isLoading } = this.props.inpatientDaily;
    const itemList = [];
    const tmpData = data;
    let totalAmount = 0;
    let tmpTotalAmount = 0;
    if (isLoading) { return <ActivityIndicatorView />; }
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item key={i} align="left"><Brief><span className={styles['text_1']}>{d.name}</span></Brief><Brief><span className={styles['text_2']}>单价：</span><span className={styles['text_3']}>{ d.price.formatMoney()}元</span>&nbsp;&nbsp;&nbsp;<span className={styles['text_2']}>数量：</span><span className={styles['text_3']}>{d.num}</span><span className={styles['text_4']}>小计：{ d.realAmount.formatMoney()}元</span></Brief></Item>);
        tmpTotalAmount += parseFloat(d.realAmount);
        i += 1;
      }
      totalAmount = tmpTotalAmount;
    } else {
      itemList.push(<Item key={0} align="left"><div className={styles['none']}>暂无住院日清单</div></Item>);
    }
    return (
      <div>
        {/* <NavBar
          mode="dark"
          leftContent="返回"
          icon={<Icon type="left" />}
          onLeftClick={() => this.goback()}
        >住院日清单
        </NavBar>*/}
        <ProfileList callback={this.callback} />
        <List className="my-list">
          <DatePicker
            mode="date"
            maxDate={this.state.maxDate}
            title="选择日期"
            extra="请选择"
            value={this.state.selectDate}
            onChange={date => this.changeDate(date)}
          >
            <Item arrow="horizontal" className={styles['date']}>&nbsp;</Item>
          </DatePicker>
          {itemList}
          <Item>
            <div className={styles['bottom']}>
              <div className={styles['bottom_format']}>
                总费用：{totalAmount.formatMoney()}&nbsp;元
              </div>
            </div>
          </Item>
        </List>
      </div>
    );
  }
}

InpatientDailyMain.propTypes = {
};

export default connect(({ home, user, base, inpatientDaily }) => ({ home, user, base, inpatientDaily }))(InpatientDailyMain);

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, NavBar, Icon, Button, Modal } from 'antd-mobile';
import moment from 'moment';

const alert = Modal.alert;
const Item = List.Item;
const Brief = Item.Brief;

class OutpatientRefundList extends React.Component {
  selectMenu() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/payCouter/payment' }));
  }
  paymentReturn= (d) => {
    console.log(d);
    const { dispatch } = this.props;
    const bill = {
      billId: d.outTradeNo,
    };
    console.log(bill);
    dispatch({
      type: 'outpatientReturn/refund',
      payload: { query: bill },
    });
  }
  render() {
    const itemList = [];
    const tmpData = this.props.outpatientReturn.data;
    const map = { C: '现金预存', Z: '支付宝预存', W: '微信预存', B: '银行卡预存' };
    console.log(tmpData);
    if (tmpData && tmpData.length > 0) {
      let i = 0;
      for (const d of tmpData) {
        itemList.push(<Item
          key={i}
          extra={
            <Button
              type="warning"
              onClick={() => alert('提示', '是否确认退款？', [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'Ok',
              onPress: () => {
              this.paymentReturn(d);
              } },
          ])}
            >退费
            </Button>
        }
          align="top"
          multipleLine
        >
          <Brief>支付金额：{d.amt}元 </Brief><Brief>订单号:{d.tradeNo}</Brief><Brief>充值时间:{moment(d.tradeTime).format('YYYY-MM-DD HH:mm')}</Brief>
        </Item>);
        i += 1;
      }
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
        >门诊退费
        </NavBar>
        <List className="my-list">
          {itemList}
        </List>
      </div>
    );
  }
}

OutpatientRefundList.propTypes = {
};

export default connect(outpatientReturn => (outpatientReturn))(OutpatientRefundList);

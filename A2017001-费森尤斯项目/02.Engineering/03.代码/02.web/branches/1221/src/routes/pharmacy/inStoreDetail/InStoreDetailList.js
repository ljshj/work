import React, { Component } from 'react';
import { connect } from 'dva';
import { floor } from 'lodash';
import CommonTable from '../../../components/CommonTable';

class InStoreDetailList extends Component {

  onPageChange(detailPage) {
    this.props.dispatch({
      type: 'inStoreDetail/searchDetail',
      payload: { detailPage },
    });
  }

  render() {
    const { detailPage, detailData, inStoreDetail } = this.props;
    const { totalSum, pageSum } = inStoreDetail;
    const { wsHeight } = this.props.base;
    const { dicts } = this.props.utils;
    const columns = [
      {
        title: '药品分类',
        dataIndex: 'drugType',
        width: '80px',
        key: 'drugType',
        render: (value) => {
          return dicts.dis('DRUG_TYPE', value);
        },
      },
      { title: '药品名称', dataIndex: 'drugInfo.commonName', key: 'drugInfo.commonName', width: '100px' },
      { title: '规格', dataIndex: 'specs', key: 'specs', width: '90px' },
      { title: '进价', dataIndex: 'buyPrice', key: 'buyPrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '售价', dataIndex: 'salePrice', key: 'salePrice', width: '80px', render: text => (text ? text.formatMoney(4) : ''), className: 'text-align-right' },
      { title: '进价总额', dataIndex: 'buyCost', key: 'buyCost', width: '100px', render: text => (text ? text.formatMoney(2) : ''), className: 'text-align-right' },
      {
        title: '入库数量',
        dataIndex: 'inSum',
        key: 'inSum',
        width: '100px',
        render: (value, record) => {
          if (record.inSum != null && record.drugInfo && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
            if (record.inSum === 0) {
              return 0;
            } else if (floor(record.inSum / (record.drugInfo ? record.drugInfo.packQty : 1)) === 0) {
              return `${record.inSum % (record.drugInfo ? record.drugInfo.packQty : 1)}${(record.drugInfo ? record.drugInfo.packUnit : '')}`;
            } else if (record.inSum % (record.drugInfo ? record.drugInfo.packQty : 1) === 0) {
              return `${floor(record.inSum / (record.drugInfo ? record.drugInfo.packQty : 1))}${(record.drugInfo ? record.drugInfo.packUnit : '')}`;
            } else {
              return `${floor(record.inSum / (record.drugInfo ? record.drugInfo.packQty : 1))}${(record.drugInfo ? record.drugInfo.packUnit : '')}
              ${record.inSum % (record.drugInfo ? record.drugInfo.packQty : 1)}${(record.drugInfo ? record.drugInfo.packUnit : '')}`;
            }
          } else {
            return '';
          }
        },
      },
      { title: '批号', dataIndex: 'approvalNo', key: 'approvalNo', width: '80px' },
      { title: '生产商/供货商',
        dataIndex: 'drugInfo.companyInfo.companyName',
        key: 'drugInfo.companyInfo.companyName',
        width: '260px',
        render: (text, record) => {
          return (
            <div>
              {`(生产)${text}`}<br />
              {`(供应)${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
            </div>
          );
        },
      },
      /* { title: '供货商', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName', width: '120px' },*/
      { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: '90px' },
      { title: '入库时间', dataIndex: 'inTime', key: 'inTime', width: '90px' },
      { title: '操作者', dataIndex: 'inOper', key: 'inOper', width: '70px' },
    ];

    return (
      <div style={{ position: 'relative' }} >
      <CommonTable
        data={detailData}
        size="middle"
        bordered
        columns={columns}
        page={detailPage}
        onPageChange={this.onPageChange.bind(this)}
        rowSelection={false}
        scroll={{ y: (wsHeight - 32 - 51 - 22 - 23) }}
        className="compact-table"
      />
        <div style={{ position: 'absolute', left: '10px', bottom: '15px' }} >
          <font style={{ fontSize: '14px' }} >
            {`金额总计：${totalSum[0] ? totalSum[0].formatMoney() : 0.00} 元，本页小计：${pageSum ? pageSum.formatMoney() : 0.00} 元`}
          </font> 
        </div>
      </div>
       
    );
  }
}
export default connect(({ base, utils, inStoreDetail }) => ({ base, utils, inStoreDetail}))(InStoreDetailList);

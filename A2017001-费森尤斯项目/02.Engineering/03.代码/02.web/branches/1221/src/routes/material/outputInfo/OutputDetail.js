import React, { Component } from 'react';
import { floor } from 'lodash';
import { connect } from 'dva';
import CommonTable from '../../../components/CommonTable';

class OutputDetail extends Component {

  onPageChange(page) {
    this.props.dispatch({
      type: 'outputdetail/loadOutput',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'outputdetail/setState',
      payload: { selectedRowKeys },
    });
  }

  render() {
    const { page, data } = this.props.outputdetail;
    const { wsHeight } = this.props.base;
    const columns = [
      {
        title: '商品信息',
        width: 260,
        dataIndex: 'materialCode',
        key: 'materialCode',
        render: (text, record) => {
          return (
            <div>
              <font style={{ color: 'rgb(191, 191, 191)' }}>{text}</font><br />
              {`${record.tradeName} (${record.specs || '-'})`}
            </div>
          );
        },
      },
      {
        title: '批号/批次',
        width: 110,
        dataIndex: 'approvalNo',
        key: 'approvalNo',
        render: (text, record) => {
          return (
            <div>
              {text || '-'}<br />
              {record.batchNo || '-'}
            </div>
          );
        },
      },
      { title: '出库数量',
        dataIndex: 'outSum',
        key: 'outSum',
        width: '100px',
        className: 'text-align-right',
        render: (value, record) => {
          if (record.outSum === 0) {
            return 0;
          } else {
            return `${record.outSum}${record.matInfo.materialUnit}`;
          }
        },
      },
      { title: '生产商/供货商',
        dataIndex: 'matInfo.companyInfo.companyName',
        key: 'matInfo.companyInfo.companyName',
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
      { title: '有效期', dataIndex: 'validDate', key: 'validDate', width: '90px' },
      { title: '出库时间', dataIndex: 'outTime', key: 'outTime', width: '90px' },
    ];
    return (
      <div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange.bind(this)}
          rowSelection={false}
          bordered
          scroll={{ y: (wsHeight - 47 - 48 - 33 - 54 - 10) }}
          size="middle"
        />
      </div>
    );
  }
}
export default connect(
  ({ outputdetail, utils, base }) => ({ outputdetail, utils, base }),
)(OutputDetail);

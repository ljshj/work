import React, { Component } from 'react';
import { floor } from 'lodash';
import moment from 'moment';
// import CommonTable from '../../../components/CommonTable';
import EditTable from '../../../components/editTable/EditTable';
import { testInt } from '../../../utils/validation';
import Styles from './StoreInfoList.less';

class StoreInfoList extends Component {
  // onEdit(record) {
  //   this.props.dispatch({
  //     type: 'storeInfo/setState',
  //     payload: { record },
  //   });
  // }

  onPageChange(page) {
    this.props.dispatch({
      type: 'storeInfo/load',
      payload: { page },
    });
  }

  onChange(value, row) {
    // if (key === 'alertNum') {
    //   const reg = /^-?([1-9][0-9]*)?$/;
    //   if (!reg.test(value)) {
    //     notification.error({
    //       message: '提示',
    //       description: '入库数量请输入数字！',
    //     });
    //     return;
    //   }
    // }
    const updateData = this.editTable.getUpdatedData();
    this.props.dispatch({
      type: 'storeInfo/updateRow',
      row,
    });
    this.props.dispatch({
      type: 'storeInfo/setState',
      payload: { data: updateData },
    });
  }

  render() {
    const { page, data, dicts, depts, deptsIdx, activeKey, wsHeight } = this.props;
    // data.stop为Boolean，而dicts.STOP_BOOL为字符型，为此必须做转化，否则EditTable中的DictSelect无法反显
    // 更彻底的解决办法是修改后台，返回0、1而非布尔，前台用dicts.dis('STOP_FLAG')
    // 但修改后台Model涉及改动较多，因此还是在前台单独转化
    for (let i = 0; data && i < data.length; i += 1) {
      if (data[i].stop === true) {
        data[i].stop = 'true';
      } else if (data[i].stop === false) {
        data[i].stop = 'false';
      }
    }

    let columns = [];
    const storeSumCompute = (record) => {
      if (record.storeSum != null && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
        if (record.storeSum === 0) {
          return 0;
        } else if (floor(record.storeSum / record.drugInfo.packQty) === 0) {
          return `${record.storeSum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        } else if (record.storeSum % record.drugInfo.packQty === 0) {
          return `${floor(record.storeSum / record.drugInfo.packQty)}${record.drugInfo.packUnit}`;
        } else {
          return `${floor(record.storeSum / record.drugInfo.packQty)}${record.drugInfo.packUnit}
          ${record.storeSum % record.drugInfo.packQty}${record.drugInfo.miniUnit}`;
        }
      } else {
        return '';
      }
    };
    const alertNumCompute = (record) => {
      if (record.alertNum != null && record.drugInfo.packQty != null && record.drugInfo.packQty !== 0) {
        if (record.alertNum === 0) {
          return 0;
        } else {
          return `${floor(record.alertNum / record.drugInfo.packQty)}`;
        }
      } else {
        return '';
      }
    };

    if (activeKey === '1') {
      columns = [
        { title: '库房',
          dataIndex: 'deptId',
          key: 'deptId',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return depts.disDeptName(deptsIdx, value);
          },
        },
        { title: '分类/性质',
          dataIndex: 'drugType',
          key: 'drugType',
          width: 75,
          className: 'text-align-center text-no-wrap',
          render: (value, record) => {
            return (
              <div>
                {dicts.dis('DRUG_TYPE', value)}<br />
                {record.drugInfo ? (record.drugInfo.drugQuality ? dicts.dis('DRUG_QUALITY', record.drugInfo.drugQuality) : '-') : '-'}
              </div>
            );
          },
        },
        /* { title: '药品性质',
          dataIndex: 'drugInfo.drugQuality',
          key: 'drugInfo.drugQuality',
          className: 'text-align-center',
          render: (value) => {
            return dicts.dis('DRUG_QUALITY', value);
          },
        },*/
        /* { title: '药品编码', dataIndex: 'drugCode', key: 'drugCode' },*/
        { title: '药品信息',
          dataIndex: 'tradeName',
          key: 'tradeName',
          width: 260,
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{record.drugCode}</font><br />
                {`${text}(${record.specs || '-'})`}<br />
                {`生产厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
              </div>
            );
          },
        },
        /* { title: '商品名称', dataIndex: 'tradeName', key: 'tradeName' },
        { title: '药品规格', dataIndex: 'specs', key: 'specs' },
        { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName' },*/
        { title: '采购价', dataIndex: 'buyPrice', key: 'bugPrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
        { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },
        { title: '库存量',
          dataIndex: 'storeSumCompute',
          key: 'storeSumCompute',
          width: 110,
          render: (text, record) => {
            return storeSumCompute(record);
          },
        },
        { title: '警戒库存量',
          dataIndex: 'alertNum',
          key: 'alertNum',
          width: 110,
          className: 'text-align-center',
          render: (text, record) => {
            return alertNumCompute(record);
          },
          addonAfter: (text, record) => {
            return record.drugInfo.packUnit;
          },
          editorConfig: { verfy: (v) => { return testInt(v); } },
          editable: true,
        },
        { title: '采购金额', dataIndex: 'buyCost', key: 'buyCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 90, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },
        { title: '药品位置', dataIndex: 'location', key: 'location', className: 'text-align-center', width: 110, editable: true },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          editor: 'dictSelect',
          width: 90,
          className: 'text-align-center',
          editorConfig: {
            columnName: 'STOP_BOOL',
          },
          editable: true,
        },
        /* { title: '备注', dataIndex: 'comm', key: 'comm' },*/
        // { title: '操作',
        //   key: 'action',
        //   render: (text, record) => (
        //     <span>
        //       <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
        //     </span>
        //   ),
        // },
      ];
    } else {
      columns = [
        { title: '库房',
          dataIndex: 'deptId',
          key: 'deptId',
          width: 65,
          className: 'text-align-center',
          render: (value) => {
            return depts.disDeptName(deptsIdx, value);
          },
        },
        { title: '药品分类',
          dataIndex: 'drugType',
          key: 'drugType',
          width: 75,
          className: 'text-align-center text-no-wrap',
          render: (value, record) => {
            return (
              <div>
                {dicts.dis('DRUG_TYPE', value)}<br />
                {record.drugInfo ? (record.drugInfo.drugQuality ? dicts.dis('DRUG_QUALITY', record.drugInfo.drugQuality) : '-') : '-'}
              </div>
            );
          },
        },
        /* { title: '药品性质',
          dataIndex: 'drugInfo.drugQuality',
          key: 'drugInfo.drugQuality',
          render: (value) => {
            return dicts.dis('DRUG_QUALITY', value);
          },
        },*/
        /* { title: '药品编码', dataIndex: 'drugCode', key: 'drugCode' },*/
        { title: '药品信息',
          dataIndex: 'tradeName',
          key: 'tradeName',
          width: 260,
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>{record.drugCode}</font><br />
                {`${text}(${record.specs || '-'})`}<br />
                {`生产厂商：${record.companyInfo ? (record.companyInfo.companyName || '-') : '-'}`}
              </div>
            );
          },
        },
        /* { title: '商品名称', dataIndex: 'tradeName', key: 'tradeName' },
        { title: '药品规格', dataIndex: 'specs', key: 'specs' },
        { title: '批次', dataIndex: 'batchNo', key: 'batchNo' },*/
        { title: '批号/批次',
          dataIndex: 'approvalNo',
          key: 'approvalNo',
          width: 110,
          render: (text, record) => {
            return (
              <div>
                {text || '-'}<br />
                {record.batchNo || '-'}
              </div>
            );
          },
        },
        { title: '生产日期', dataIndex: 'produceDate', key: 'produceDate', width: 90, className: 'text-align-center' },
        // { title: '厂家', dataIndex: 'companyInfo.companyName', key: 'companyInfo.companyName' },
        // { title: '厂家',
        //   dataIndex: 'producer',
        //   key: 'producer',
        //   render: () => {
        //     return data.companyInfo.companyName;
        //   },
        // },
        { title: '有效期', dataIndex: 'validDate', key: 'validDate', editor: 'date', editable: true, width: 110, className: 'text-align-center' },
        { title: '采购/零售价',
          dataIndex: 'buyPrice',
          key: 'bugPrice',
          width: 110,
          className: 'text-align-right',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>(购) </font>{(text || 0.00).formatMoney(4)}<br />
                <font style={{ color: 'rgb(191, 191, 191)' }}>(售) </font>{(record.salePrice || 0.00).formatMoney(4)}
              </div>
            );
          },
        },
        /* { title: '零售价', dataIndex: 'salePrice', key: 'salePrice', width: 90, render: text => (text || 0.00).formatMoney(4), className: 'text-align-right' },*/
        // { title: '库存数量', dataIndex: 'storeSum', key: 'storeSum' },
        { title: '库存量',
          dataIndex: 'storeSumCompute',
          key: 'storeSumCompute',
          width: 90,
          render: (text, record) => {
            return storeSumCompute(record);
          },
        },
        // { title: '最小单位', dataIndex: 'minUnit', key: 'minUnit' },
        { title: '采购/零售金额',
          dataIndex: 'buyCost',
          key: 'buyCost',
          width: 110,
          className: 'text-align-right',
          render: (text, record) => {
            return (
              <div>
                <font style={{ color: 'rgb(191, 191, 191)' }}>(购) </font>{(text || 0.00).formatMoney()}<br />
                <font style={{ color: 'rgb(191, 191, 191)' }}>(售) </font>{(record.saleCost || 0.00).formatMoney()}
              </div>
            );
          },
        },
        /* { title: '零售金额', dataIndex: 'saleCost', key: 'saleCost', width: 75, render: text => (text || 0.00).formatMoney(2), className: 'text-align-right' },*/
        // { title: '药品位置', dataIndex: 'location', key: 'location' },
        { title: '停用标志',
          dataIndex: 'stop',
          key: 'stop',
          width: 65,
          className: 'text-align-center text-no-wrap',
          render: (value) => {
            return value ? '正常' : '停用';
          },
        },
        /* { title: '备注', dataIndex: 'comm', key: 'comm' },*/
        // { title: '操作',
        //   key: 'action',
        //   render: (text, record) => (
        //     <span>
        //       <Icon type="edit" className="tableEditIcon" onClick={this.onEdit.bind(this, record)} />
        //     </span>
        //   ),
        // },
      ];
    }
    const rowClassName = (record) => {
      // 停用显示浅红
      // if (!record.stop) {
      //   return Styles.stop;
      // }
      if (record.stop === 'false') {
        return Styles.stop;
      }
      // 过期显示浅黄
      if (record.validDate) {
        const validDate = moment(record.validDate).format('YYYY-MM-DD');
        const newDate = moment(new Date()).format('YYYY-MM-DD');
        if (newDate > validDate) {
          return Styles.expired;
        }
      }
    };

    const containerHeight = wsHeight - 43 - 46 - 17;
    return (
      <div style={{ height: `${containerHeight}px`, overflow: 'hidden' }} >
        <EditTable
          ref={(node) => { this.editTable = node; }}
          data={data}
          page={page}
          columns={columns}
          rowSelection={false}
          onChange={this.onChange.bind(this)}
          onPageChange={this.onPageChange.bind(this)}
          rowClassName={rowClassName}
          bordered
          scroll={{ y: (containerHeight - 33 - 45) }}
        />
      </div>
    );
  }
}
export default StoreInfoList;

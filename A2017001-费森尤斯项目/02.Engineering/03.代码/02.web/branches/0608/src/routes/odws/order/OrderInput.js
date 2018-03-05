import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, InputNumber, Button, notification } from 'antd';
import _ from 'lodash';

import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
// import FieldSet from '../../../components/FieldSet';
import CommonItemSearchInput from '../../../components/searchInput/CommonItemSearchInput';
import FreqSearchInput from '../../../components/searchInput/FreqSearchInput';

import styles from './Order.less';

const FormItem = Form.Item;

class OrderInput extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onSelectCommonItem = this.onSelectCommonItem.bind(this);
    this.onSelectFreq = this.onSelectFreq.bind(this);
    this.onSelectDrugFlag = this.onSelectDrugFlag.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.odwsOrder.resetForm) {
      this.props.dispatch({
        type: 'odwsOrder/setState',
        payload: {
          resetForm: false,
        },
      });
      this.props.form.resetFields();
    }
  }

  onSelectCommonItem(item) {
    const newRecord = { ...item };
    // console.log(newRecord);
    // 判断库存
    if (newRecord.stock === 0) {
      notification.warning({
        message: '警告',
        description: '所选项目库存为0！',
      });
      return;
    }
    // 判断是否已经存在
    const { orders } = this.props.odwsOrder;
    const idx = _.findIndex(orders, (record) => {
      return record.itemId === newRecord.id;
    });
    if (idx !== -1) {
      notification.warning({
        message: '警告',
        description: '所选项目已经开立！',
      });
      return;
    }
    // 将所选项目更新到order
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        order: {
          ...this.props.odwsOrder.order,
          itemId: newRecord.id,
          itemCode: newRecord.itemCode,
          itemName: newRecord.itemName,
          unit: newRecord.itemUnit, // 单位
          exeDept: newRecord.exeDept, // 默认执行科室
          salePrice: newRecord.salePrice, // 销售单价
          feeCode: newRecord.feeCode, // 费用类型
          specs: newRecord.itemSpecs, // 规格
          doseUnit: newRecord.doseUnit, // 剂量
        },
      },
    });
  }

  onSelectFreq(item) {
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        order: {
          ...this.props.odwsOrder.order,
          freq: item.freqId,
          freqDesc: `${item.freqName} | ${item.freqTime}`,
        },
      },
    });
  }

  onSelectDrugFlag(value) {
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        order: {
          ...this.props.odwsOrder.order,
          drugFlag: value,
        },
      },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        const newValues = values;

        if (!newValues.itemId) {
          notification.warning({
            message: '警告',
            description: '请选择项目！',
          });
          return;
        }
        if (!newValues.qty) {
          notification.warning({
            message: '警告',
            description: '请填写数量！',
          });
          return;
        }
        this.props.dispatch({
          type: 'odwsOrder/saveItem',
          payload: values,
        });
      }
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'odwsOrder/setState',
      payload: {
        order: {
          drugFlag: this.props.odwsOrder.order.drugFlag,
        },
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { form, odwsOrder, odws } = this.props;
    const { getFieldDecorator } = form;
    const { order } = odwsOrder;
    const { currentReg } = odws;

    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      size: 'small',
    };

    const formItemLayoutColSpan = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      size: 'small',
    };

    const btnText = order.id ? '保存修改' : '保存新增';

    return (
      <Form inline className={styles.form} >
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('id', {
            initialValue: order.id,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('regId', {
            initialValue: currentReg.id,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('patientId', {
            initialValue: currentReg.patient ? currentReg.patient.id : '',
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('itemId', {
            initialValue: order.itemId,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('itemCode', {
            initialValue: order.itemCode,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('feeCode', {
            initialValue: order.feeCode,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('salePrice', {
            initialValue: order.salePrice,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('specs', {
            initialValue: order.specs,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('comboNo', {
            initialValue: order.comboNo || '',
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('recipeNo', {
            initialValue: order.recipeNo,
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('stop', {
            initialValue: order.stop === false ? '0' : '1',
          })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('unit', {
            initialValue: order.unit,
          })(<Input />)}
        </FormItem>
        <Row style={{ marginTop: '10px' }} >
          <Col span={6}>
            <FormItem style={{ width: '100%' }} label="药品标志" {...formItemLayout} >
              {getFieldDecorator('drugFlag', {
                initialValue: order.drugFlag,
              })(
                <DictSelect
                  style={{ width: '100%' }}
                  tabIndex={0}
                  columnName="GROUP_TYPE"
                  onSelect={this.onSelectDrugFlag}
                  disabled={!!order.id}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="收费项目" {...formItemLayout} >
              {getFieldDecorator('itemName', {
                initialValue: order.itemName,
              })(
                <CommonItemSearchInput
                  onSelect={this.onSelectCommonItem}
                  drugFlag={order.drugFlag}
                  placeholder="收费项目"
                  disabled={!!order.id}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="数量" {...formItemLayout} >
              {getFieldDecorator('qty', {
                initialValue: order.qty ? parseFloat(order.qty) : '',
              })(
                <Input
                  maxLength={3}
                  placeholder="数量"
                  style={{ width: '100%' }}
                  addonAfter={order.unit}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="执行科室" {...formItemLayout} >
              {getFieldDecorator('exeDept', {
                initialValue: order.exeDept,
              })(
                <DeptSelect
                  allowClear
                  placeholder="执行科室"
                  deptType={order.drugFlag === '3' ? ['001'] : ['004']}
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        {
          typeof order.drugFlag === 'undefined' || order.drugFlag !== '3' ? (
            /* <FieldSet title="用法/用量" className={styles.fieldSet} >*/
            <div>
              <Row style={{ marginTop: '10px' }} >
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="用药方法" {...formItemLayout} >
                    {getFieldDecorator('usage', {
                      initialValue: order.usage,
                    })(
                      <DictSelect
                        style={{ width: '100%' }}
                        tabIndex={0}
                        columnName="USAGE"
                        placeholder="用药方法"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('freq', {
                      initialValue: order.freq,
                    })(<Input />)}
                  </FormItem>
                  <FormItem style={{ width: '100%' }} label="执行频率" {...formItemLayout} >
                    {getFieldDecorator('freqDesc', {
                      initialValue: order.freqDesc,
                    })(
                      <FreqSearchInput
                        onSelect={this.onSelectFreq}
                        placeholder="执行频率"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="一次剂量" {...formItemLayout} >
                    {getFieldDecorator('doseOnce', {
                      initialValue: order.doseOnce ? parseFloat(order.doseOnce) : '',
                    })(
                      <Input
                        maxLength={20}
                        placeholder="一次剂量"
                        style={{ width: '100%' }}
                        addonAfter={order.doseUnit}
                      />,
                    )}
                  </FormItem>
                  <FormItem style={{ display: 'none' }} >
                    {getFieldDecorator('doseUnit', {
                      initialValue: order.doseUnit,
                    })(
                      <Input />,
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem style={{ width: '100%' }} label="执行天数" {...formItemLayout} >
                    {getFieldDecorator('days', {
                      initialValue: order.days || '',
                    })(
                      <InputNumber maxLength={3} placeholder="执行天数" style={{ width: '100%' }} />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            /* </FieldSet>*/
          ) : null
        }
        <Row>
          <Col span={12} />
          <Col span={12} style={{ textAlign: 'right', paddingTop: '10px' }} >
            <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="plus" size="large" >{btnText}</Button>
            <Button onClick={this.handleReset} icon="reload" size="large" >重置</Button>
          </Col>
        </Row>

        {/* <div className={styles.btnContainer} >
          <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: '10px' }} icon="plus" size="large" >{btnText}</Button>
          <Button onClick={this.handleReset} icon="reload" size="large" >重置</Button>
        </div>*/}

      </Form>
    );
  }
}
const OrderInputForm = Form.create()(OrderInput);
export default connect(
  ({ odws, odwsOrder, base }) => ({ odws, odwsOrder, base }),
)(OrderInputForm);


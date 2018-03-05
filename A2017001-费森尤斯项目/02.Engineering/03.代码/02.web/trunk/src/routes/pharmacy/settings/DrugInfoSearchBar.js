import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Button, notification, Icon } from 'antd';
import _ from 'lodash';
import DictCheckable from '../../../components/DictCheckable';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class DrugInfoSearchBar extends Component {

  onSearch(values) {
    this.props.dispatch({
      type: 'drugInfo/load',
      payload: { query: values },
    });
  }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'drugInfo/setSearchObjs',
      payload: searchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'drugInfo/setState',
      payload: { selectedTag },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(values);
        this.onSearch(this.props.searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setSearchObjs(null);
    this.onSearch();
  }

  exportToExcel() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      this.setSearchObjs(_.omit(values, 'dateRange'));
      w.location.href = `/api/hcp/pharmacy/settings/medicineMng/mng/exportInfoToExcel?data= ${JSON.stringify(this.props.searchObjs)}`;
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, dicts, searchObjs, selectedTag, namespace, chanel } = this.props;
    const onAdd = () => {
      this.props.dispatch({ type: 'drugInfo/toggleVisible' });
      this.props.dispatch({
        type: 'utils/setState',
        payload: { record: {}, shortcuts: true },
      });
    };

    const onDeleteAll = () => {
      const self = this;
      if (selectedRowKeys && selectedRowKeys.length > 0) {
        confirm({
          title: `您确定要删除选择的${selectedRowKeys.length}条记录吗?`,
          onOk() {
            self.props.dispatch({ type: 'drugInfo/deleteSelected' });
          },
        });
      } else {
        notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
      }
    };

    const dictProps = {
      namespace,
      dictArray: dicts.DRUG_TYPE,
      tagColumn: 'drugType',
      searchObjs,
      selectedTag,
    };

    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={12}>
            <DictCheckable {...dictProps} />
          </Col>
        </Row>
        <Row type="flex">
          <Col span={12} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('commonName')(<Input style={{ width: 300 }} placeholder="查询码(通用名/商品名/拼音/五笔/条码)" onPressEnter={this.handleSubmit.bind(this)} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 12 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" onClick={this.exportToExcel.bind(this)} className="btn-left" >
                  导出
            </Button>
            <Button type="primary" size="large" onClick={onAdd.bind(this)} className="btn-left" style={{ display: (chanel === 'medicine' || chanel === 'operate' ? '' : 'none') }}>
              <Icon type="plus" />新增
            </Button>
            <Button type="danger" size="large" onClick={onDeleteAll.bind(this)} className="btn-right" style={{ display: (chanel === 'medicine' || chanel === 'operate' ? '' : 'none') }}>
              <Icon type="delete" />删除
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(DrugInfoSearchBar);

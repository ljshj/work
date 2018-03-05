import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import AsyncTreeCascader from '../../../components/AsyncTreeCascader';

const FormItem = Form.Item;

class CheckInfoSearchBar extends Component {
  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        this.props.setCheckInfoSearchObjs(values);
        search(this.props.checkInfoSearchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.setCheckInfoSearchObjs(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={20} className="action-form-searchbar">
            <Form inline >
              <FormItem>
                {getFieldDecorator('tradeName')(<Input placeholder="查询码(名称/编码)" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('drugType')(<AsyncTreeCascader dictType="ASSETS_TYPE" placeholder="资产类别" />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)} icon="search" >查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset.bind(this)} icon="reload" >清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(CheckInfoSearchBar);

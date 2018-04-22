/**
 * 重置密码
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  InteractionManager, Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Toast from 'react-native-root-toast';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { changePwd } from '../../../services/base/AuthService';


class ChangePwd extends Component {
  static displayName = 'ChangePwd';
  static description = '修改密码';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changePwd = this.changePwd.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    buttonDisabled: false,
    labelPosition: 'left',
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    // this.props.navigation.setParams({
    //   title: '修改密码',
    // });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  async changePwd() {
    if (this.form.validate()) {
      try {
        if (this.state.value.password !== this.state.value.pwdConfirm) {
          this.form.pwdConfirm.showError('两次密码输入不一致');
          this.form.pwdConfirm.focus();
          return;
        }
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await changePwd({ ...this.state.value });
        if (responseData.success) {
          Global.setUser(responseData.result);
          this.props.screenProps.hideLoading();
          Toast.show('修改密码成功');
          this.props.navigation.goBack();
        } else {
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
          this.setState({
            buttonDisabled: false,
          });
          return;
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
        });
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    } else {
      Alert.alert(
        '提示',
        '手机号码或登录密码格式不正确,请确认后重新输入!',
        [
          {
            text: '确定',
            onPress: () => {
              this.refresh();
            },
          },
        ],
      );
    }
  }

  refresh() {
    this.form = null;
    this.setState({
      value: {},
      buttonDisabled: false,
    });
  }

  form = null;

  render() {
    if (!this.state.doRenderScene) {
      return ChangePwd.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER]} >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
          <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} showLabel={false} labelPosition={this.state.labelPosition} >
            <Form.TextInput
              label="原密码"
              name="oldPassword"
              placeholder="请输入旧密码"
              maxLength={16}
              minLength={6}
              showLabel
              required
              secureTextEntry
            />
            <Form.TextInput
              label="新密码"
              name="password"
              placeholder="请输入新密码"
              maxLength={16}
              minLength={6}
              showLabel
              required
              secureTextEntry
            />
            <Form.TextInput
              label="确认密码"
              name="pwdConfirm"
              placeholder="请再次输入密码"
              maxLength={16}
              minLength={6}
              showLabel
              required
              secureTextEntry
            />
          </Form>

          <View style={{
            flexDirection: 'row', marginTop: 20, marginLeft: 20, marginRight: 20,
          }}
          >
            <Button text="确定" onPress={this.changePwd} disabled={this.state.buttonDisabled} />
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  logoHolder: {
    height: Global.getScreen().height / 4,
  },
  logo: {
    width: (Global.getScreen().width * 2) / 3,
    height: (Global.getScreen().height / 8),
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  changePwd: user => dispatch(changePwd(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd);
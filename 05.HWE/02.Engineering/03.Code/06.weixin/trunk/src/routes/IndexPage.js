import React from 'react';
import { connect } from 'dva';
import baseUtil from '../utils/baseUtil.js';

class IndexPage extends React.Component {
  componentDidMount() {
    const openid = this.getOpenId();
    const userId = this.getUserId();
    if (openid) {
      // alert(`openid：${openid}`);
      const { dispatch } = this.props;
      dispatch({
        type: 'base/loginByOpenId',
        payload: { openid },
      });
    } else if (userId) {
      // alert(`userId：${userId}`);
      const { dispatch } = this.props;
      dispatch({
        type: 'base/loginByUserId',
        payload: { userId },
      });
    } else {
      alert(`非法请求${window.location}`);
    }
  }
  getOpenId() {
    return baseUtil.dev_mode ? baseUtil.loginUser.openid : this.getUrlParam('openid');
  }
  getUserId() {
    return baseUtil.dev_mode ? baseUtil.loginUser.userId : this.getUrlParam('userId');
  }
  getUrlParam(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    console.log('url:', window.location.search);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    /* var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;*/
  }
  getUrlParams() {
    const url = window.location.search; // 获取url中"?"符后的字串
    const params = {};
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return params;
  }
  render() {
    return (
      <div>让你干非法勾当，被踢出来了吧！！！！</div>
    );
  }
}
IndexPage.propTypes = {
};

export default connect(base => (base))(IndexPage);

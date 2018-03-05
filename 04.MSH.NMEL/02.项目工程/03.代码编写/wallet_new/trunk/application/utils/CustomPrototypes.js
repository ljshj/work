'use strict';
/**
 * 客户化的prototype
 */
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Alert,
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';

import * as Global  	from '../Global';
import UserStore 		from '../flux/UserStore';
import AuthAction 		from '../flux/AuthAction';
import ToastAction 		from '../flux/ToastAction';
import LoadingAction 	from '../flux/LoadingAction';
import InputPwdAction	from '../flux/InputPwdAction';

import EasyIcon     	from 'rn-easy-icon';

/**
 * 为Array扩展 contains 方法，检验数组是否包含某对象
 */
Object.defineProperty(Array.prototype, 'contains', {
	value: function(needle) {
		for (let i in this) {
			if (this[i] == needle) return true;
		}
		return false;
	},
	enumerable: false
});

/**
 * 公用Ajax请求
 */
Object.defineProperty(Component.prototype, 'request', {
	value: function (url, config) {
		/*console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log(url, config);*/
		let status = {
			'-1' : '请求超时，请稍后再试',
			'0'  : '看来服务器闹情绪了，请您稍等片刻再试吧',
			'400': '服务器无法处理此请求',
			'401': '请求未授权',
			'402': '登录状态失效，请重新登录',
			'403': '禁止访问此请求',
			'404': '请求的资源不存在',
			'405': '不允许此请求',
			'406': '不可接受的请求',
			'407': '您发送的请求需要代理身份认证',
			'412': '请求的前提条件失败',
			'414': '请求URI超长',
			'420': '业务处理异常',
			'500': '服务器内部错误',
			'501': '服务器不支持此请求所需的功能',
			'502': '网关错误',
		};

//		let method = config ? (config.method ? (config.method.toUpperCase() === 'GET' ? 'GET' : 'POST') : 'POST') : 'POST';
		let method = "POST";
		if(config && config.method && ["","POST","DELETE","PUT","GET"].indexOf(config.method.toUpperCase()) > 0){
			method = config.method.toUpperCase();
		}

		let headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		};
		headers = config ? (config.headers ? config.headers : headers) : headers;
		headers['X-Requested-With'] = 'a';
		if(UserStore.getUser() != null && UserStore.getUser().sessionId != null){
			headers['JSESSIONID'] = UserStore.getUser().sessionId;
			headers['sid'] = UserStore.getUser().sessionId;
		}

		let body = config ? (config.body ? config.body : '') : '';

		const xhr = new XMLHttpRequest();

		/*console.log('CustomPrototypes.request() - after new XMLHttpRequest() ');
		console.log(xhr);*/

		return new Promise((res, rej) => {

			// 判断网络是否连接
			if (!Global.NetInfoIsConnected) {
				return rej({ 'status': -1, 'msg': '网络连接不可用，请检查你的网络或稍后重试', 'url': url });
			}

			/*console.log('CustomPrototypes.request() - in Promise ');
			console.log(xhr);*/

			xhr.open(method, url);

			//FIXME 测试使用，发布时删除
			console.log("xhr:"+Math.floor(Math.random()*100),xhr._url);

			//设置超时时间
			xhr.timeout = Global._hostTimeout;

			let hs = Object.keys(headers).map(value => {
		        return {
		            value,
		            text: headers[value]
		        };
		    });

			for (let i = hs.length - 1; i >= 0; i--) {
				xhr.setRequestHeader(hs[i]['value'], hs[i]['text']);
			}
			if(method === 'POST'){
				xhr.send(body);
			}else if(method === 'PUT'){
				xhr.send(body);
			}else{
				xhr.send();
			}

			this.setState({
				_requestErr: false,
				_requestErrMsg: null,
			});

			/*console.log('CustomPrototypes.request() - after send() ');
			console.log(xhr);*/

			//超时处理
			xhr.ontimeout = () => {
				return rej({'status': -1, 'msg': status['-1'], 'url': url});
			};

			//处理返回报文
			xhr.onload = () => {
				/*console.log('CustomPrototypes.request() - xhr:');
				console.log(xhr);
				console.log('CustomPrototypes.request() - xhr.status:' + xhr.status);*/
				if (xhr.status == 420) {	//业务处理异常
					return rej({'status': xhr.status, 'msg': (JSON.parse(xhr.responseText)).msg, 'url': url});
				}
				if (xhr.status != 200) {	//请求出错

					/*console.log('CustomPrototypes.request() - xhr.status:' + xhr.status);
					console.log('CustomPrototypes.request() - xhr.status != 200 - xhr:');
					console.log(xhr);*/

					if(xhr.status === 401 || xhr.status === 402 || xhr.status === 403) {	//未授权
						//TODO:需要登录时调用登录
						AuthAction.clearContinuePush();
						AuthAction.needLogin();
					}
					return rej({'status': xhr.status, 'msg': status[xhr.status + ''], 'url': url});
				}
				this.hideLoading();
				this.setState({
					_refreshing: false,
					_pullToRefreshing: false,
					_infiniteLoading: false,
					_requestErr: false,
					_requestErrMsg: null,
				});
				console.log("**************************************\n");
				console.log(xhr.responseText);
				console.log("**************************************\n");
				return res(JSON.parse(xhr.responseText));
			};
			
		});
	},
	enumerable: false
});

/**
 * 显示加载过渡视图
 */
Object.defineProperty(Component.prototype, 'handleRequestException', {
	value: function(e) {
		this.hideLoading();
		this.setState({
			_refreshing: false,
			_pullToRefreshing: false,
			_infiniteLoading: false,
			_requestErr: true,
			_requestErrMsg: e.msg,
		});
		if(0 == e.status || e.status) {
			if(e.status != 401 && e.status != 403) {
				/*Alert.alert(
					'错误',
					e.msg,
				);*/
				this.toast(e.msg);
				console.log(e);
			}
		} else {
			/*Alert.alert(
				'错误',
				'处理请求出错！',
			);*/
			this.toast('处理请求出错！');
			console.log(e);
		}
	},
	enumerable: false
});

/**
 * 处理request exception
 */
Object.defineProperty(Component.prototype, 'getLoadingView', {
	value: function(msg, cb, style) {
		if(this.state._refreshing /*|| this.state._pullToRefreshing*/) {
			let spinner = this.state._refreshing ? (
				<View style = {{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}} >
					<ActivityIndicator />
				</View>
			) : null;
			return (
				<View style = {[{margin: 20, alignItems: 'center', justifyContent: 'center'}, style]} >
					{spinner}
					<Text style={{color: 'rgba(187,187,187,1)', textAlign: 'center'}} >{msg ? msg : '载入中...'}</Text>
				</View>
			);
		} else if (this.state._requestErr) {
			return (
				<View style = {[{margin: 20, alignItems: 'center', justifyContent: 'center'}, style]} >
					<TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center'}} onPress = {() => {
						if(typeof cb == 'function')
							cb();
					}} >
						<EasyIcon name = "ios-refresh-outline" color = "rgba(187,187,187,1)" size = {35} width = {40} height = {40} />
						<Text style={{color: 'rgba(187,187,187,1)', textAlign: 'center'}} >{this.state._requestErrMsg}</Text>
					</TouchableOpacity>
				</View>
			);
		} else
			return null;
	},
	enumerable: false
});

/**
 * 处理request exception
 */
Object.defineProperty(Component.prototype, 'getInfiniteLoadingView', {
	value: function(msg, cb, style) {
		if(this.state._infiniteLoading) {
			let spinner = this.state._infiniteLoading ? (
				<View style = {{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}} >
					<ActivityIndicator />
				</View>
			) : null;
			return (
				<View style = {[{margin: 20, alignItems: 'center', justifyContent: 'center'}, style]} >
					{spinner}
					<Text style={{color: 'rgba(187,187,187,1)', textAlign: 'center'}} >{msg ? msg : '正在载入更多信息...'}</Text>
				</View>
			);
		} else if (this.state._requestErr) {
			return (
				<View style = {[{margin: 20, alignItems: 'center', justifyContent: 'center'}, style]} >
					<TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center'}} onPress = {() => {
						if(typeof cb == 'function')
							cb();
					}} >
						<EasyIcon name = "ios-refresh-outline" color = "rgba(187,187,187,1)" size = {35} width = {40} height = {40} />
						<Text style={{color: 'rgba(187,187,187,1)', textAlign: 'center'}} >{this.state._requestErrMsg}</Text>
					</TouchableOpacity>
				</View>
			);
		} else
			return null;
	},
	enumerable: false
});

/**
 * 显示toast信息
 */
Object.defineProperty(Component.prototype, 'toast', {
	value: function(msg) {
		ToastAction.show(msg);
	},
	enumerable: false
});

/**
 * 显示载入遮罩
 */
Object.defineProperty(Component.prototype, 'showLoading', {
	value: function() {
		LoadingAction.show(true);
	},
	enumerable: false
});

/**
 * 隐藏载入遮罩
 */
Object.defineProperty(Component.prototype, 'hideLoading', {
	value: function() {
		LoadingAction.show(false);
	},
	enumerable: false
});

/**
 * 6位密码键盘显示
 */
Object.defineProperty(Component.prototype, 'inputPwd', {
	value: function(callback) {
		InputPwdAction.inputPwd(callback);
	},
	enumerable: false
});

/**
 * 6位密码键盘隐藏
 */
Object.defineProperty(Component.prototype, 'hidePwd', {
	value: function(callback) {
		InputPwdAction.hidePwd();
	},
	enumerable: false
});




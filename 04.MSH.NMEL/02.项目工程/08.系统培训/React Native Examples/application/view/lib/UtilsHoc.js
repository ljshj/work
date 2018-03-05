'use strict'

/**
 * 公用方法
 */

import React from  'react-native';
import * as Global from '../../Global';
import Icon from 'react-native-vector-icons/Ionicons';

let {
	Alert,
	View,
	RefreshControl,
	TouchableOpacity,
	Text,
} = React ; 

const UtilsHoc = (ComposedComponent) => {
	var UtilHoc = React.createClass({

		getInitialState: function() {
			// console.log('--UtilsHoc getInitialState--');
			return null ;
		},

	    componentDidMount:function() {
	        console.log('---UtilsHoc componentDidMount---');
	    },	

		showLoading:function(){
			// console.log('---HOC showLoading---');
			this.props.showLoading();
		},

		hideLoading:function(){
			// console.log('---HOC hideLoading---');
			this.props.hideLoading();
		},

		toast:function(msg){
			this.props.toast(msg);
		},

	 	hocTest:function(msg){
	 		console.log('---HOC Test---');
	 		console.log(msg);
	 	},

		/**
		 * 异步后台请求
		 * @param  url 请求地址
		 * @param  config 请求的配置参数
		 * 		{
		 * 			method: 	string 可空 GET/POST 默认为 POST
		 * 			headers: 	object 可空 需要加到请求头文件里的参数
		 * 			body: 		string 可空 使用POST发起请求时放到报文体中的数据
		 * 		}
		 * @return 
		 */
		request: function(url, config) {
			let status = {
				'0'  : '看来服务器闹情绪了，请您稍等片刻再试吧！',
				'400': '服务器无法处理此请求',
				'401': '请求未授权',
				'403': '禁止访问此请求',
				'404': '请求的资源不存在',
				'405': '不允许此请求',
				'406': '不可接受的请求',
				'407': '您发送的请求需要代理身份认证',
				'412': '请求的前提条件失败',
				'414': '请求URI超长',
				'500': '服务器内部错误',
				'501': '服务器不支持此请求所需的功能',
				'502': '网关错误',
			};

			let method = config ? (config.method ? (config.method.toUpperCase() === 'GET' ? 'GET' : 'POST') : 'POST') : 'POST';

			let headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			};
			headers = config ? (config.headers ? config.headers : headers) : headers;
			if(Global.USER_LOGIN_INFO != null)
				headers['sid'] = Global.USER_LOGIN_INFO['sid'] + '';

			let body = config ? (config.body ? config.body : '') : '';

			const xhr = new XMLHttpRequest();

			return new Promise((res, rej) => {

				xhr.open(method, url);

				//处理返回报文
				xhr.onload = () => {
					/*console.log('UtilsMixin.request() - xhr:');
					console.log(xhr);
					console.log('UtilsMixin.request() - xhr.status:' + xhr.status);*/
					if (xhr.status != 200) {

						console.log('UtilsMixin.request() - xhr.status:' + xhr.status);
						console.log('UtilsMixin.request() - xhr.status != 200 - xhr:');
						console.log(xhr);

						if(xhr.status === 401 || xhr.status === 403) {
							Global.interceptedRoute = null;
							this.props.navigator._goToLogin();
						}
						return rej({'status': xhr.status, 'msg': status[xhr.status + '']});
					}
					return res(JSON.parse(xhr.responseText));
				};


				//设置超时时间
				xhr.timeout = Global.hostTimeout;
				//超时处理
				xhr.ontimeout = () => {
					this.hideLoading();
					this.toast('请求超时，请稍后再试！');
				};

				let hs = Object.keys(headers).map(value => {
			        return {
			            value,
			            text: headers[value]
			        };
			    });
				for (let i = hs.length - 1; i >= 0; i--) {
					xhr.setRequestHeader(hs[i]['value'], hs[i]['text']);
				}

				if(method === 'POST')
					xhr.send(body);
				else
					xhr.send();
				
			});
		},
		/**
		 * 当使用request提交请求时，在catch中调用此方法处理公共错误信息
		 * @param  error
		 * @return 
		 */
		requestCatch: function(e) {
			this.hideLoading();
			if(0 == e.status || e.status) {
				if(e.status != 401 && e.status != 403) {
					Alert.alert(
						'错误',
						e.msg,
					);
				}
			} else {
				Alert.alert(
					'错误',
					'处理请求出错！',
				);
				console.warn(e);
			}
		},		
		/**
		 * listView没有数据时显示的提示信息
		 * @param  text 	显示的文字
		 * @param  onPress	点击触发的回调事件
		 * @return 
		 */
		getListRefreshView: function(text, onPress) {
			return (
				<TouchableOpacity 
					style={[Global.styles.CENTER, {flexDirection: 'row', height: 35,}]} 
					onPress={() => {
						if(onPress && typeof onPress == 'function')
							onPress();
					}} >
					<Text style={{marginRight: 10}} >{text}</Text>
	                <Icon name='refresh' size={20} color={Global.colors.FONT_GRAY} style={[Global.styles.ICON]} />
				</TouchableOpacity>
			);
		},
		/**
		 * ListView的下拉刷新控制器
		 * @param  isRefreshing 刷新状态(state 参数)
		 * @param  onRefresh 	下拉刷新被触发时回调的事件
		 * @return 
		 */
		getRefreshControl: function(isRefreshing,onRefresh) {
			//console.log('in getRefreshControl......')
			return (
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={() => {
						if(onRefresh && typeof onRefresh == 'function') 
							onRefresh();
					}}
					tintColor="#929292"
					title="重新载入..."
					colors={['#ff0000', '#00ff00', '#0000ff']}
					progressBackgroundColor="#ffff00"/>
	        )
		},		

		render:function(){
			return <ComposedComponent navigator={this.props.navigator} route = {this.props.route} 
				{...this.props} 
				hocTest={this.hocTest} 
				toast={this.toast} 
				showLoading={this.showLoading} 
				hideLoading={this.hideLoading} 
				request={this.request} 
				requestCatch={this.requestCatch} 
				getListRefreshView={this.getListRefreshView} 
				getRefreshControl={this.getRefreshControl} />;
		},
	});

	return (UtilHoc);
}
module.exports = UtilsHoc;
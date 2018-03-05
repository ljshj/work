'use strict';
/*
** 6位密码控件
** Global.NBPadding
*/
import React, {
	Component,
	PropTypes
} from 'react';
import * as Global 		from '../../Global';
import Password6 		from './Password6';
import RNKeyboard 		from './RandomNumberKeyboard';
import InputPwdStore 	from '../../flux/InputPwdStore';

import EasyIcon 		from 'rn-easy-icon';

import {
	StyleSheet,
	ScrollView,
	View,
	Text,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	TextInput,
	Alert,
} from 'react-native';

var CONFIRMPWD_URL = 'person/confirmPwd';

class InputPwd extends Component {

	constructor(props) {
		super(props);

		this.state = {
			pwd: '',
			checked: false,
			correctMsg: null,
			callback : null,
			show: false
		}
	}

	componentDidMount() {
		InputPwdStore.listen((show, callback)=> {
			this.setState({
				show: show,
				callback: callback,
			});
		});

		// InteractionManager.runAfterInteractions(() => {
		// 	this.setState({doRenderScene: true});
		// });

		// this.props.showRNKeyboard((key)=>{this.input(key)});
	}

	input(key) {
		this.setState({
			inputting: key + '',
			correctMsg:'',

		});
	}

	async inputEnded(pwd) {

		//TODO:调用后台逻辑校验支付密码
		// this.showLoading();
		// try {
		// 	let responseData = await this.request(Global._host + CONFIRMPWD_URL, {
		// 		body: JSON.stringify({
		// 			pwd: pwd,
		// 			// id: Global.USER_LOGIN_INFO.id
		// 		}),
		// 	});
		// 	this.hideLoading();
		// 	if (responseData.body == false) {
		// 		Alert.alert(
		// 			'提示',
		// 			'支付密码输入错误,请重新输入!', [{
		// 				text: '确定',
		// 				onPress: () => {
		// 					this.setState({
		// 						pwd: '',
		// 						inputting: 'clear',
		// 					})
		// 				}
		// 			}]
		// 		);
		// 	} else {
		// 		this.props.hideRNKeyboard();
		// 		this.setState({
		// 			checked: true,
		// 			correctMsg: '密码校验正确！',
		// 		});
		// 	}
		// } catch (e) {
		// 	this.requestCatch(e);
		// }
		let correctMsg = null;
		if ( null != this.state.callback && 'function' == typeof this.state.callback ) {
			let res = await this.state.callback(pwd);
			if ( !res ) {
				correctMsg = '密码错误，请重新输入！';
			}

			this.setState({
				inputting: 'clear',
				correctMsg: correctMsg,
			})
		}
		return;
	}

	hidePwd() {
		this.setState({
			show : false,
			correctMsg: null,
		})
	}

	done(){
		//密码校验成功后回调业务逻辑
		if(typeof this.props.pwdChecked == 'function') {
			// this.props.navigator.pop();
			this.props.pwdChecked();
		}
	}

	render(){

		if( !this.state.show )
			return ( <View></View> );

		// var btnStyle = this.state.checked == true ? Global._styles.BLUE_BTN : Global._styles.GRAY_BTN;
		var btnStyle = {} //FIXME
		var btnPress = this.state.checked == true ? this.done : null;

		return(
			<View style={styles.CONTAINER} >
				<ScrollView style={[styles.sv]} keyboardShouldPersistTaps={true}>
					<TouchableOpacity style={{ flexDirection:'row', justifyContent:'flex-end'}} onPress={()=>this.hidePwd()} >
						<Text style={{fontSize: 14, color: 'rgba(0,122,255,1)', marginBottom: 10}}>取消</Text>
					</TouchableOpacity>
					<View style = {{
						marginLeft: 15,
						backgroundColor: '#dcdce1',
						height: 1/Global._pixelRatio}} />
					<Text style = {{marginTop:20}}>请输入6位支付密码</Text>
					<View style = {{backgroundColor: 'transparent',
		height: 20,}} />

					<Password6 
						inputEnded={(pwd)=>this.inputEnded(pwd)} 
						inputting={this.state.inputting} />

					<View style={{flexDirection: 'row'}}>
						<Text style={{width:240, height: 20, color: 'rgba(0,122,255,1)', fontSize: 14, marginTop: 8, marginLeft: 5}} >{this.state.correctMsg}</Text>
						<Text style={{width:80, height: 20, color: 'rgba(0,122,255,1)', fontSize: 14, marginTop: 8, marginRight: 5}} >忘记密码？</Text>
					</View>

					<View style={{backgroundColor: 'transparent',
		height: 20,}} />
				</ScrollView>
			    <RNKeyboard input={(key)=>this.input(key)} show={this.state.show} />
			</View>
		)
	}
}

var styles = StyleSheet.create({
	CONTAINER: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		flex: 1,
		backgroundColor: 'rgba(0,122,255,1)',
		flexDirection: 'column',
	},
	paddingPlace: {
		flex: 1,
		// height: Global.NBPadding + 20,
	},
	sv: {
		flex: 1,
		padding: 20,
	},
	inputBlock:{
		flexDirection:'row',
		borderColor: 'gray', 
		borderWidth: 1 / Global._pixelRatio,
	},
	textInput:{
		height:40,
		fontSize:13,
		width:(Dimensions.get('window').width-41)/6,
		borderColor: 'gray', 
		borderWidth: 1 / Global._pixelRatio,
		borderBottomWidth: 0,
		borderTopWidth: 0,
		borderLeftWidth:1,
		borderRightWidth:0,
		textAlign:'center',
		backgroundColor: '#FFFFFF',
	},
});

module.exports = InputPwd;

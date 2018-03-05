'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var UtilsMixin = require('../lib/UtilsMixin');


var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
	ListView,
	Alert
} = React;


var SUBMIT_URL = 'expense/save';
var FIND_URL =   'employee/findLeader';

var ChooseExpenseLeader = React.createClass({
	mixins: [UtilsMixin],

	/**
	* 初始化状态
	*/
	getInitialState: function() {
		return {
			doRenderScene: false,
			loaded: false,
			showLoading: false,
			showAlert: false,
			alertMsg: null,
			boss : {
				name:null,
				id:null
			},
			expense : this.props.expense,
		};
	},

    componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchData();
		});
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + FIND_URL, {
				body: JSON.stringify({
					companyId: Global.USER_LOGIN_INFO.Employees.ownerOrg,
				}),
			});
			this.hideLoading();
			this.setState({
				boss: responseData.body,
				loaded: true,
			});
		} catch (e) {
			this.requestCatch(e);
		}

	},

	/**
	* 保存数据
	*/
	save: async function() {
		this.showLoading();
		this.setState({
			expense: {
				id: this.state.expense.id,
				memo1: this.state.expense.memo1,
				name: this.state.expense.name,
				state: '1',
				leader: this.state.boss.id,
				submittime: new Date(),
				custId: Global.USER_LOGIN_INFO.Employees.id,
				allowance: this.state.expense.allowance,
				totalamt: this.state.expense.totalamt
			}
		});
		try {
			let responseData = await this.request(Global.host + SUBMIT_URL, {
				body: JSON.stringify({
					expense: this.state.expense,
					costIds: this.props.costIds
				}),
			});
			this.hideLoading();
			this.toast('提交成功！');
			this.props.refreshExpenseList(1);
			this.props.navigator.popToRoute(this.props.backRoute); 
		} catch (e) {
			this.requestCatch(e);
		}

	},



	
	/**
	* 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
	* value: 表单所有元素的值，本例中为 {id : '', name: '', gender: '' ... }
	* objName: 触发此事件的元素，类型为数组（支持多个元素同时触发？），如 name 被更改时，传入的值为 ['name']
	*/
	onFormChange: function(value, objName) {
		/*console.log('``````````````````` arguments in edit.onChange():');
		console.log(arguments);
		console.log('``````````````````` end of arguments in edit.onChange():');*/
	},
	confirm : function(){
		Alert.alert(
            '将报销单提交给',
            this.state.boss.name,
            [
              {text: 'Cancel'},
              {text: 'OK', onPress: () => this.save()},
            ]
          );
	},
	render: function() {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style={[styles.container]}>
				<ScrollView style={styles.sv}>
					<View style={styles.placeholder} />
					<TouchableOpacity style={[{flex:1,backgroundColor:'#FFFFFF'},Global.styles.BORDER]} onPress={()=>{this.confirm()}}>
						<Text style={{fontSize:18,fontWeight:'500',margin:10,textAlign:'center'}}>{this.state.boss.name}</Text>
					</TouchableOpacity>
			    </ScrollView>
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={[styles.container]}></View>
		);
	},
});
var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
	sv:{
		
	},
	placeholder: {
		flex: 1,
		height: Global.NBPadding + 20,
		backgroundColor: Global.colors.IOS_GRAY_BG,
	},
});
module.exports = ChooseExpenseLeader;

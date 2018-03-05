'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var BankList = require('../assets/BankList');
var InputPayPwd = require('../lib/InputPayPwd');

var AccountMixin = require('../AccountMixin');
var UtilsMixin = require('../lib/UtilsMixin');
var FilterMixin = require('../../filter/FilterMixin');

var AccountAction = require('../actions/AccountAction');
var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	InteractionManager,
	ListView,
	TextInput,
	Alert,
} = React;

var ACCOUNTINFO = {};
var ELEC_TRANFER_IN = 'account/elecTransferIn';
var GET_SEQUENCE ='sequence/next';
var KEEP_ACCT_URL = 'reqprocess/forBalanceChange';
var ElecTransferIn = React.createClass({

	mixins: [UtilsMixin, AccountMixin, FilterMixin],

	getInitialState:function(){
		return{
				amount: null,
				outAcctName: this.props.outAcctName,
				outAcctNo: this.props.outAcctNo,
				out_balance: this.props.out_balance,
				inAcctNo: this.props.inAcctNo,
				in_balance: this.props.in_balance,
    		}
	},

	componentDidMount: function() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	},

	getBankList:function(){
		this.props.navigator.push({
			title:'付款方式',
			component:BankList,
			passProps:{
				kind:'2',
				refresh:this.refresh
			},
		});
	},
	refresh:function(data){
		this.setState({
			outAcctName:data.bankName,
			outAcctNo:data.acctNo,
			out_balance:data.balance,
		})
	},
	next: function() {
		this.setState({amount: this.state.amount.replace(/\,/g, '')});
		var re = /^[1-9]+[0-9]*(.[0-9]+)?$/;
		if (!re.test(this.state.amount)) {
			this.toast('请输入正确的转账金额!');
			return;
		}
		if (this.state.out_balance != null && this.state.amount > this.state.out_balance) {
			this.toast('账户余额不足！');
			return;
		}
		this.props.navigator.push({
			component: InputPayPwd,
			hideNavBar: true,
			passProps: {
				backRoute: this.props.backRoute,
				pwdChecked: this.done
			}
		});

	},
	done:async function(){
		this.showLoading();
		try {
			let responseData = await this.request(Global.host + ELEC_TRANFER_IN, {
				body: JSON.stringify({
					amount: this.state.amount,
					elecAcctNo:this.state.inAcctNo,
					outAcctNo:this.state.outAcctNo,
					out_balance:this.state.out_balance,
					in_balance:this.state.in_balance,
				}),
			});
			if(responseData.status=='success'){
				AccountAction.updateAccount(responseData.body.outAccount);
				AccountAction.updateAccount(responseData.body.elecAccount);
			}
			
		
        var sequence = 0;
        /*get Sequence*/
        let responseData1 = await this.request(Global.host + GET_SEQUENCE, {
            body: JSON.stringify({
                type:2,
                }),
        });
        console.log('****************GET_SEQUENCE');
        // console.log(responseData1);
        sequence = responseData1.body[0].sequence;
        // console.log(sequence);

        var bodydata = 'channelID='+Global.channelID+'&channelSeq='+sequence+'&channelCust='+Global.USER_LOGIN_INFO.custCode+'&acctType=0001&acctNo='+this.state.inAcctNo+'&tranType=T005&cdFlag=0&tranAmt='+this.state.amount;
        console.log(bodydata);

        let responseData2 = await this.request(Global.acctHost+KEEP_ACCT_URL, {
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'charset':'utf-8',
            },
            body:bodydata,
        });
            // console.log(responseData);
        if(responseData2.respCode == '00'){
            this.toast('支付成功！');
            console.log('keepElcAcct sucess');
        }else{
                Alert.alert(
                    '错误',
                    responseData.respMsg,
                );
                /*账务系统回退*/
        }
        this.hideLoading();
			// this.props.refreshTransfer.call();
			this.props.navigator.popToTop();

		} catch(e) {
			this.requestCatch(e);
		}
	},
	checkAmt:function(){
		if(this.state.out_balance != null && this.state.amount > this.state.out_balance){
			Alert.alert(
                '错误',
                '账户余额不足！',
            );
		}
	},
	render: function() {

		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return(
			<View style={Global.styles.CONTAINER}>
				<ScrollView style={styles.sv}>
					<View style={styles.paddingPlace} />

		        	<Text style={{marginLeft: 10, marginBottom: 8}} >请选择转入的储蓄卡</Text>
					<View style={Global.styles.FULL_SEP_LINE} />
					<TouchableOpacity style={[styles.rend_row, Global.styles.CENTER, {paddingTop: 10, paddingBottom: 10}]} onPress={()=>{this.getBankList()}} >
					 	{Global.bankLogos[this.props.bank_no]}
			            <View style={{flex: 1, paddingLeft: 10}}>
			            	<Text style={{fontSize: 15, marginBottom: 3}}>
			              		{this.state.outAcctName}
			            	</Text>
			            	<Text style={{fontSize: 12, color: Global.colors.IOS_GRAY_FONT}}>
			              		{'********' + this.filterCardNumLast4(this.state.outAcctNo)}
			            	</Text>
			            </View>
			            <Icon name='ios-arrow-right' size={18} color={Global.colors.IOS_DARK_GRAY} style={[Global.styles.ICON, {width: 25}]} />
			        </TouchableOpacity>
            		<View style={Global.styles.FULL_SEP_LINE} />

			        <View style={[Global.styles.CENTER, {flexDirection: 'row', marginTop: 8, marginLeft: 10}]} >
			        	<Icon style={[styles.icon, {width: 15}]} name='information-circled' size={15} color={Global.colors.IOS_BLUE} />
			        	<Text style={{flex: 1, marginLeft: 5, fontSize: 12}}>该卡本次最多可转入{this.filterMoney(this.state.out_balance)}元</Text>
			        </View>

            		<View style={Global.styles.PLACEHOLDER20} />

            		<View style={Global.styles.FULL_SEP_LINE} />
		        	<View style={[styles.rend_row, Global.styles.CENTER, {height: 50}]}>
		        		<Text style={{marginLeft: 10, fontSize: 15, width: 40}} >金额</Text>
						<TextInput style={[Global.styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 50}]} placeholder='建议转入100元以上金额' value={this.state.amount} onChangeText={(value)=>{this.setState({amount: value})}} 
						onBlur={() => 
								this.setState({amount: this.filterMoney(this.state.amount)})
							} 
							onFocus={() => {
								if(this.state.amount) {
									var amt = this.state.amount.replace(/\,/g, '');
									this.setState({amount: amt});
								}
							}} />				            
			        </View>
            		<View style={Global.styles.FULL_SEP_LINE} />

            		<View style={Global.styles.PLACEHOLDER20} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {margin: 20}]} 
						onPress={()=>{this.next()}} >
			    		<Text style={{color: '#ffffff'}}>下一步</Text>
			    	</TouchableOpacity>

				</ScrollView>
			</View>
		)
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} />
		);
	},
});
var styles = StyleSheet.create({
	sv: {
	},
	paddingPlace: {
        flex: 1,
        height: Global.NBPadding + 20,
    },

	rend_row: {
    	flexDirection: 'row',
    	paddingLeft: 10,
    	paddingRight: 10,
    	borderWidth: 1 / Global.pixelRatio,
    	borderColor: Global.colors.IOS_SEP_LINE,
    	borderTopWidth: 0,
    	borderBottomWidth: 0,
    	backgroundColor: 'white',
    },

    separator: {
    	height: 1,
    	backgroundColor: '#CCCCCC',
    },
    thumb: {
    	width: 40,
    	height: 40,
    },
    text: {
    	flex: 1,
  	},
  	icon: {
		textAlign: 'center',
	},

});

module.exports = ElecTransferIn;
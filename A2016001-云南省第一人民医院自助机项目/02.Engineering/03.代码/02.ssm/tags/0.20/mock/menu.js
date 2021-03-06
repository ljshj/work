'use strict';

var menus = [
  {
    "id": "1", 
    "name": "办理就诊卡", 
    "alias": "办理就诊卡", 
    "code": "mCardCreate", 
    "pathname": "/createCard01", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#DB5A5A", 
    "icon": "medicalCard"
  }, 
  {
    "id": "2", 
    "name": "自助建档", 
    "alias": "自助建档", 
    "code": "mCreateProfile", 
    "pathname": "/createProfile00", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#DB5A5A", 
    "icon": "profileReg"
  }, 
  {
    "id": "3", 
    "name": "预约医生", 
    "alias": "预约医生", 
    "code": "appointDoctor", 
    "pathname": "/selectDept/appointment", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#4081D6", 
    "icon": "appointment"
  }, 
  {
    "id": "4", 
    "name": "预约签到", 
    "alias": "预约签到", 
    "code": "mSignIn", 
    "pathname": "/signIn", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#4081D6", 
    "icon": "appointmentSign"
  }, 
  {
    "id": "5", 
    "name": "预约查询", 
    "alias": "预约查询", 
    "code": "AppointmentRecords", 
    "pathname": "/AppointmentRecords", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#4081D6", 
    "icon": "appointmentRecords"
  }, 
  {
    "id": "6", 
    "name": "开通预存", 
    "alias": "开通预存", 
    "code": "prepaidOpen", 
    "pathname": "/prepaidOpen", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "prepaidOpen"
  }, 
  {
    "id": "7", 
    "name": "现金预存", 
    "alias": "现金预存", 
    "code": "prepaidCash", 
    "pathname": "/prepaidCash", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "prepaidCash"
  }, 
  {
    "id": "8", 
    "name": "银行卡预存", 
    "alias": "银行卡预存", 
    "code": "prepaidBankCard", 
    "pathname": "/prepaid/20", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "prepaidBankCard"
  }, 
  {
    "id": "9", 
    "name": "支付宝/微信预存", 
    "alias": "支付宝/微信预存", 
    "code": "prepaidMobile", 
    "pathname": "/prepaid/30", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "prepaidMobile"
  }, 
  {
    "id": "10", 
    "name": "预存/消费记录", 
    "alias": "预存/消费记录", 
    "code": "paymentRecords", 
    "pathname": "/paymentRecords", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "payRecords"
  }, 
  {
    "id": "16", 
    "name": "缴费", 
    "alias": "缴费", 
    "code": "pay", 
    "pathname": "/needPay", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#F68C36", 
    "icon": "pay"
  }, 
  {
    "id": "11", 
    "name": "当日挂号", 
    "alias": "当日挂号", 
    "code": "register", 
    "pathname": "/selectDept/register", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#6BBF2D", 
    "icon": "register"
  }, 
  {
    "id": "12", 
    "name": "挂号查询", 
    "alias": "挂号查询", 
    "code": "registerRecords", 
    "pathname": "/registerRecords", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#6BBF2D", 
    "icon": "registerRecords"
  }, 
  {
    "id": "13", 
    "name": "预约检查", 
    "alias": "预约检查", 
    "code": "checkAppointment", 
    "pathname": "/checkAppointment", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#4081D6", 
    "icon": "checkAppointment"
  }, 
  {
    "id": "15", 
    "name": "门诊病历打印", 
    "alias": "门诊病历打印", 
    "code": "caseHistoryRecords", 
    "pathname": "/caseHistoryRecords", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#6BBF2D", 
    "icon": "caseHistoryPrint"
  }, 
  {
    "id": "14", 
    "name": "检查单查询", 
    "alias": "检查单查询", 
    "code": "checkRecords", 
    "pathname": "/checkRecords", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#4081D6", 
    "icon": "checkRecords"
  }, 
  {
    "id": "17", 
    "name": "院内导航", 
    "alias": "院内导航", 
    "code": "guide", 
    "pathname": "/guide", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "rgba(97,60,187,1)", 
    "icon": "guide"
  }, 
  {
    "id": "18", 
    "name": "住院身份登记", 
    "alias": "住院身份登记", 
    "code": "inpatientReg", 
    "pathname": "/inpatientReg", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "rgba(107,182,29,1)", 
    "icon": "inpatientReg"
  }, 
  {
    "id": "19", 
    "name": "住院预缴费", 
    "alias": "住院预缴费", 
    "code": "inpatientPrepaid", 
    "pathname": "/inpatientPrepaidNav", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#3CB4DE", 
    "icon": "inpatientPrepaid"
  }, 
  {
    "id": "20", 
    "name": "住院日清单", 
    "alias": "住院日清单", 
    "code": "inpatientDailyBill", 
    "pathname": "/inpatientDailyBill", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#3CB4DE", 
    "icon": "inpatientDailyBill"
  }, 
  {
    "id": "21", 
    "name": "住院费用查询", 
    "alias": "住院费用查询", 
    "code": "inpatientBill", 
    "pathname": "/inpatientBill", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "#3CB4DE", 
    "icon": "inpatientBill"
  }, 
  {
    "id": "22", 
    "name": "食堂费用查询", 
    "alias": "食堂费用查询", 
    "code": "diningRoomFee", 
    "pathname": "/diningRoomFee", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "rgba(219,85,45,1)", 
    "icon": "diningRoomFee"
  }, 
  {
    "id": "23", 
    "name": "满意度调查", 
    "alias": "满意度调查", 
    "code": "satisfaction", 
    "pathname": "/satisfaction", 
    "url": "", 
    "coordinate": "", 
    "colspan": "1", 
    "rowspan": "", 
    "color": "rgba(97,60,187,1)", 
    "icon": "satisfaction"
  }
];


module.exports = {

  'GET /api/ssm/client/menu/list': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        result: menus,
      });
    }, 500);
  },
  
};

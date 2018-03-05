package com.lenovohit.hwe.pay.support.cmbpay.transfer.service;

import com.lenovohit.hwe.pay.support.cmbpay.transfer.utils.XmlPacket;

/**
 * Created by zyus
 */
public interface CmbTradeService {

    // 消费查询
    public XmlPacket tradeQuery(XmlPacket request);

    // 消费退款
    public XmlPacket tradeRefund(XmlPacket request); 
    
    // 卡查询
    public XmlPacket tradeCardQuery(XmlPacket request);

    // 同步对账文件
    public XmlPacket tradeDownloadFile(XmlPacket request);
}

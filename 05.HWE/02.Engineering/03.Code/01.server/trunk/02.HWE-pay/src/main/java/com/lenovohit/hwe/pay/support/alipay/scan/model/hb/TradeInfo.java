package com.lenovohit.hwe.pay.support.alipay.scan.model.hb;

/**
 * Created by liuyangkly on 15/9/28.
 */
public interface TradeInfo {
    // 获取交易状态
    public HbStatus getStatus();

    // 获取交易时间
    public double getTimeConsume();
}

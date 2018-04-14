package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayDataDataserviceBillDownloadurlQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/26.
 */
public class AlipayTradeDownloadResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayDataDataserviceBillDownloadurlQueryResponse response;

    public AlipayTradeDownloadResult(AlipayDataDataserviceBillDownloadurlQueryResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayDataDataserviceBillDownloadurlQueryResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayDataDataserviceBillDownloadurlQueryResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
package com.lenovohit.hwe.pay.support.alipay.model.builder;

import org.apache.commons.configuration.Configuration;

import com.google.gson.annotations.SerializedName;
import com.lenovohit.core.utils.StringUtils;

/**
 * Created by liuyangkly on 16/3/3.
 */
public class AlipayTradeQueryRequestBuilder extends AbsAlipayTradeRequestBuilder {

    private BizContent bizContent = new BizContent();

    @Override
    public BizContent getBizContent() {
        return bizContent;
    }

    @Override
    public boolean validate() {
        if (StringUtils.isEmpty(bizContent.tradeNo) &&
                StringUtils.isEmpty(bizContent.outTradeNo)) {
            throw new IllegalStateException("tradeNo and outTradeNo can not both be NULL!");
        }
        return true;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AlipayTradeQueryRequestBuilder{");
        sb.append("bizContent=").append(bizContent);
        sb.append(", super=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }

    @Override
    public AlipayTradeQueryRequestBuilder setAppAuthToken(String appAuthToken) {
        return (AlipayTradeQueryRequestBuilder) super.setAppAuthToken(appAuthToken);
    }

    @Override
    public AlipayTradeQueryRequestBuilder setNotifyUrl(String notifyUrl) {
        return (AlipayTradeQueryRequestBuilder) super.setNotifyUrl(notifyUrl);
    }

    @Override
	public AlipayTradeQueryRequestBuilder setConfigs(Configuration configs) {
		return (AlipayTradeQueryRequestBuilder) super.setConfigs(configs);
	}

    public String getTradeNo() {
        return bizContent.tradeNo;
    }

    public AlipayTradeQueryRequestBuilder setTradeNo(String tradeNo) {
        bizContent.tradeNo = tradeNo;
        return this;
    }

    public String getOutTradeNo() {
        return bizContent.outTradeNo;
    }

    public AlipayTradeQueryRequestBuilder setOutTradeNo(String outTradeNo) {
        bizContent.outTradeNo = outTradeNo;
        return this;
    }

    public static class BizContent {
        // 支付宝交易号,和商户订单号不能同时为空, 如果同时存在则通过tradeNo查询支付宝交易
        @SerializedName("trade_no")
        private String tradeNo;

        // 商户订单号，通过此商户订单号查询当面付的交易状态
        @SerializedName("out_trade_no")
        private String outTradeNo;

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("BizContent{");
            sb.append("tradeNo='").append(tradeNo).append('\'');
            sb.append(", outTradeNo='").append(outTradeNo).append('\'');
            sb.append('}');
            return sb.toString();
        }
    }
}
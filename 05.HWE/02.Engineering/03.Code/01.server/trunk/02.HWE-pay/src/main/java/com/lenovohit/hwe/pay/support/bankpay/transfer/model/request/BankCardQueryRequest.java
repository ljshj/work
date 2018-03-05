package com.lenovohit.hwe.pay.support.bankpay.transfer.model.request;

import com.lenovohit.hwe.pay.support.bankpay.transfer.config.Constants;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankCardQueryResponse;

/**
 * 请求接口。
 * 
 * @author zyus
 */
public class BankCardQueryRequest implements BankRequest<BankCardQueryResponse>{

	private String content;
	private byte[] contentBytes;
	
	public String getContent(){
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public byte[] getContentBytes() {
		return contentBytes;
	}
	public void setContentBytes(byte[] contentBytes) {
		this.contentBytes = contentBytes;
	}

	public Class<BankCardQueryResponse> getResponseClass() {
		return BankCardQueryResponse.class;
	}
	
	@Override
	public int getResponseLength() {
		int lengthSize = 4;
		return Integer.valueOf(Constants.TRADE_CARD_RSP_SIZE) + lengthSize;
	}
}

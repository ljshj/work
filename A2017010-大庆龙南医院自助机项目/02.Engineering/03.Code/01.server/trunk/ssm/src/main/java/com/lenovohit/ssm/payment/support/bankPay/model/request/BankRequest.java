package com.lenovohit.ssm.payment.support.bankPay.model.request;

import com.lenovohit.ssm.payment.support.bankPay.model.response.BankResponse;

/**
 * 请求接口。
 * 
 * @author zyus
 */
public interface BankRequest<T extends BankResponse> {
	
	public String getContent();
	
	public void setContent(String content);
	
	public byte[] getContentBytes();
	
	public void setContentBytes(byte[] contentBytes);

    /**
     * 得到当前API的响应结果类型
     * 
     * @return 响应类型
     */
    public Class<T> getResponseClass();

    public int getResponseLength();
}

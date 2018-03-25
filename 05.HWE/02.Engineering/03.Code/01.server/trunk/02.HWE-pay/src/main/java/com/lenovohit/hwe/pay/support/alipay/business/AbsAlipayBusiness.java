package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.AlipayRequest;
import com.alipay.api.AlipayResponse;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AbsAlipayTradeRequestBuilder;

/**
 * Created by liuyangkly on 15/7/31.
 */
public abstract class AbsAlipayBusiness {
    protected Log log = LogFactory.getLog(getClass());

    // 验证bizContent对象
    protected void validateBuilder(AbsAlipayTradeRequestBuilder builder) {
        if (builder == null) {
            throw new NullPointerException("builder should not be NULL!");
        }

        if (!builder.validate()) {
            throw new IllegalStateException("builder validate failed! " + builder.toString());
        }
    }

    // 调用AlipayClient的execute方法，进行远程调用
    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected AlipayResponse getResponse(AlipayClient client, AlipayRequest request) {
        try {
            AlipayResponse response = client.execute(request);
            if (response != null) {
                log.info(response.getBody());
            }
            return response;

        } catch (AlipayApiException e) {
        	log.error("AbsAlipayService  getResponse Exception", e);
            e.printStackTrace();
            return null;
        }
    }
    
    
    // 调用AlipayClient的execute方法，进行远程调用
    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected AlipayResponse getSDKResponse(AlipayClient client, AlipayRequest request) {
        try {
            AlipayResponse response = client.sdkExecute(request);
            if (response != null) {
                log.info(response.getBody());
            }
            return response;

        } catch (AlipayApiException e) {
        	log.error("AbsAlipayService  getResponse Exception", e);
            e.printStackTrace();
            return null;
        }
    }
}

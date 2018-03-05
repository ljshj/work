package com.lenovohit.hwe.treat.service.impl;

import java.util.List;
import java.util.Map;

import javax.persistence.Transient;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hwe.treat.dto.GenericRestDto;
import com.lenovohit.hwe.treat.model.Charge;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.service.HisChargeService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

/**
 * 
 * 类描述： 收费项目相关操作
 * 
 * @author GW
 * @date 2018年2月1日
 * 
 */
public class HisChargeRestServiceImpl implements HisChargeService {
	GenericRestDto<Charge> dto;
	@Autowired
	private GenericManager<Charge, String> chargeManager;
	@Autowired
	private GenericManager<ChargeDetail, String> chargeDetailManager;

	public HisChargeRestServiceImpl(final GenericRestDto<Charge> dto) {
		super();
		this.dto = dto;
	}

	@Override
	public RestEntityResponse<Charge> getInfo(Charge request, Map<String, ?> variables) {
		return null;
	}

	@Override
	public RestListResponse<Charge> findList(Charge model) {
		return dto.getForList("hcp/app/payment/outpatientCharge/findChargedDetail",model);
	}

	@Override
	@Transient
	public RestEntityResponse<Charge> prepay(List<ChargeDetail> chargeList) {
		RestEntityResponse<Charge> response = dto.getForEntity("hcp/app/payment/outpatientCharge/getPreChargeInfo",
				chargeList);
		if (response.isSuccess()) {
			Charge charge = response.getEntity();
			//charge.setComment(charge.getNo());
			charge = chargeManager.save(charge);
			for (ChargeDetail detail : chargeList) {
				detail.setChargeId(charge.getId());
				chargeDetailManager.save(detail);
			}
			response.setEntity(charge);
			return response;
		} else {
			return response;
		}
	}

	@Override
	public RestEntityResponse<Charge> pay(Charge request, Map<String, ?> variables) {
		return null;
	}

	@Override
	/**    
	 * 功能描述：      
	 *@author GW
	 *@date 2018年2月26日             
	 */
	public RestEntityResponse<Charge> hisCallBack(Charge charge) {
		RestEntityResponse<Charge> response = dto.getForEntity("hcp/app/payment/outpatientCharge/callBackForCharge",charge);
		return response;
	}

}

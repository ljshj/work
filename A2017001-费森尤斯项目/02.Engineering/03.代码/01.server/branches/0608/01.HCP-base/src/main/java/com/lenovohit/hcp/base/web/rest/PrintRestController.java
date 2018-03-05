package com.lenovohit.hcp.base.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.PrintDataManager;
import com.lenovohit.hcp.base.model.HcpPrintTemplate;

@RestController
@RequestMapping("/hcp/base/print")
public class PrintRestController extends HcpBaseRestController {
	@Autowired
	private GenericManager<HcpPrintTemplate, String> hcpPrintTemplateManager;

	@RequestMapping(value = "/get/{code}/{bizId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPrintData(@PathVariable String code, @PathVariable String bizId) {
		if (StringUtils.isBlank(code) || StringUtils.isBlank(bizId))
			return ResultUtils.renderFailureResult("业务处理代码以及业务id都不能为空");
		String hql = "from HcpPrintTemplate where bizCode = ? and effectiveFlag = true ";
		HcpPrintTemplate template = hcpPrintTemplateManager.findOne(hql, code);
		if (template == null)
			return ResultUtils.renderFailureResult("不存在对应的打印模板");
		PrintDataManager manager = (PrintDataManager) SpringUtils.getBean(template.getPrintDataManager());
		if (manager == null)
			return ResultUtils.renderFailureResult("不存在对应的数据获取处理manager");
		PrintData result;
		try {
			result = manager.getPrintData(bizId, getCurrentUser());
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtils.renderFailureResult("获取打印信息失败，信息为：" + e.getMessage());
		}
		result.setPrintTemplate(template.getPrintTemplate());
		return ResultUtils.renderSuccessResult(result);
	}
}

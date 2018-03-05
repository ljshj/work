package com.lenovohit.mnis.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.controller.BaseController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.mnis.base.model.DicItem;


@RestController
@RequestMapping("/mnis/base/dicItem/")
public class DicItemRestController extends BaseController {
	
	
	@Autowired
	private GenericManager<DicItem, String> dicItemManager;
	

	@RequestMapping(value = "create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		DicItem model = JSONUtils.deserialize(data, DicItem.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		model = this.dicItemManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		DicItem model = this.dicItemManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data) {
		log.info("修改详情，输入数据为：【" + data + "】");
		if (StringUtils.isEmpty(data)) {
			throw new BaseException("输入数据为空！");
		}

		DicItem model = JSONUtils.deserialize(data, DicItem.class);
		if (null == model) {
			throw new BaseException("输入数据为空！");
		}
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入ID不可为空！");
		}

		DicItem tModel = this.dicItemManager.get(id);
		if (null == tModel) {
			throw new BaseException("更新记录不存在！");
		}
		
		if(model.getDicId() != null){
			tModel.setDicId(model.getDicId());;
		}
		if(model.getParentId() != null){
			tModel.setParentId(model.getParentId());;
		}
		if(model.getCode() != null){
			tModel.setCode(model.getCode());;
		}
		if(model.getText() != null){
			tModel.setText(model.getText());;
		}
		
		tModel = this.dicItemManager.save(tModel);

		return ResultUtils.renderSuccessResult(tModel);
	}
	
	
	@RequestMapping(value = "{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
		if (StringUtils.isEmpty(id)) {
			throw new BaseException("输入Id为空！");
		}
		DicItem model = this.dicItemManager.delete(id);
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") int start, @PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		DicItem model = JSONUtils.deserialize(data, DicItem.class);
		StringBuffer jql = new StringBuffer("from DicItem d where 1=1 ");
		List<String> values = new ArrayList<String>();
		if(null != model){
			if(StringUtils.isNotBlank(model.getDicId())){
				jql.append(" and d.dicId = ?");
				values.add(model.getDicId());
			}
			if(StringUtils.isNotBlank(model.getParentId())){
				jql.append(" and d.parentId = ?");
				values.add(model.getParentId());
			}
			if(StringUtils.isNotBlank(model.getCode())){
				jql.append(" and d.code = ?");
				values.add(model.getCode());
			}
			if(StringUtils.isNotBlank(model.getText())){
				jql.append(" and d.text = ?");
				values.add(model.getText());
			}
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.dicItemManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
}

  package com.lenovohit.hwe.pay.web.rest;


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
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.pay.model.PayChannel;

/**
 * 支付渠道管理
 * @ClassName: PayChannelRestController 
 * @Description: TODO
 * @Compony: Lenovohit
 * @Author: zhangyushuang@lenovohit.com
 * @date 2018年1月18日 下午9:38:43  
 *
 */
@RestController
@RequestMapping("/hwe/pay/payChannel")
public class PayChannelRestController extends OrgBaseRestController {

	@Autowired
	private GenericManager<PayChannel, String> payChannelManager;
	
	@RequestMapping(value="/",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		PayChannel model =  JSONUtils.deserialize(data, PayChannel.class);
		PayChannel saved = this.payChannelManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data){
		PayChannel model = JSONUtils.deserialize(data, PayChannel.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		PayChannel saved = this.payChannelManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getInfo(@PathVariable("id") String id){
		PayChannel model = this.payChannelManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		PayChannel query =  JSONUtils.deserialize(data, PayChannel.class);
		StringBuilder jql = new StringBuilder( " from PayChannel where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+ query.getName() + "%");
		}
		
		String startDate = query.getStartDate();
		String endDate = query.getEndDate();
		if(StringUtils.isBlank(startDate)){
			startDate = DateUtils.getCurrentDateStr();
		} 
		if(StringUtils.isBlank(endDate)){
			endDate = DateUtils.getCurrentDateStr();
		} 
		jql.append(" and createdAt > ? and createdAt < ? order by createdAt");
		values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		this.payChannelManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		PayChannel query =  JSONUtils.deserialize(data, PayChannel.class);
		StringBuilder jql = new StringBuilder( " from PayChannel where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+ query.getName() + "%");
		}
		
		String startDate = query.getStartDate();
		String endDate = query.getEndDate();
		if(StringUtils.isBlank(startDate)){
			startDate = DateUtils.getCurrentDateStr();
		} 
		if(StringUtils.isBlank(endDate)){
			endDate = DateUtils.getCurrentDateStr();
		} 
		jql.append(" and createdAt > ? and createdAt < ? order by createdAt");
		values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		
		List<PayChannel> depts = this.payChannelManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(depts);
	}
	
	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		try {
			this.payChannelManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveSelected(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM PAY_CHANNEL WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.payChannelManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}

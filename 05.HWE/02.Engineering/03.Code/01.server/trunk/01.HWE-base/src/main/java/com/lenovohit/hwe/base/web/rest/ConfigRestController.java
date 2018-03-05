  package com.lenovohit.hwe.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Config;

/**
 * 配置管理
 * 
 */
@RestController
@RequestMapping("/hwe/base/config")
public class ConfigRestController extends AuthorityRestController {

	@Autowired
	private GenericManager<Config, String> configManager;
	
	@RequestMapping(value="/",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data){
		Config model =  JSONUtils.deserialize(data, Config.class);
		Config saved = this.configManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data){
		Config model = JSONUtils.deserialize(data, Config.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Config saved = this.configManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Config model = this.configManager.get(id);
		
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		Config query =  JSONUtils.deserialize(data, Config.class);
		StringBuilder jql = new StringBuilder(" from Config where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getType())){
			jql.append(" and type = ? ");
			values.add(query.getType());
		}
		if(!StringUtils.isEmpty(query.getSystem())){
			jql.append(" and system = ? ");
			values.add(query.getSystem());
		}
		if(!StringUtils.isEmpty(query.getValue())){
			jql.append(" and value like ? ");
			values.add("%"+ query.getValue() + "%");
		}
		jql.append("order by createdAt");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.configManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Config query =  JSONUtils.deserialize(data, Config.class);
		StringBuilder jql = new StringBuilder(" from Config where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getType())){
			jql.append(" and type = ? ");
			values.add(query.getType());
		}
		if(!StringUtils.isEmpty(query.getSystem())){
			jql.append(" and system = ? ");
			values.add(query.getSystem());
		}
		if(!StringUtils.isEmpty(query.getValue())){
			jql.append(" and value like ? ");
			values.add("%"+ query.getValue() + "%");
		}
		jql.append("order by createdAt");
		List<Config> models = this.configManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		try {
			this.configManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM BASE_CONFIG  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.configManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value = "/list/{system}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forSystemList(@PathVariable("system") String system){
		List<Config> configs = this.configManager.find("from Config where system = ? ", system);
		return ResultUtils.renderPageResult(configs);
	}
}

package com.lenovohit.hwe.mobile.core.web.rest;

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
import com.lenovohit.hwe.mobile.core.model.Sample;

/**
 * 测试
 * @ClassName: SampleRestController 
 * @Description: TODO
 * @Compony: Lenovohit
 * @Author: zhangyushuang@lenovohit.com
 * @date 2017年12月20日 下午8:58:52  
 *
 */
@RestController
@RequestMapping("/hwe/app/sample")
public class SampleRestController extends MobileBaseRestController{
	@Autowired
	private GenericManager<Sample, String> sampleManager;
	
	@RequestMapping(value = "/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data){
		Sample model = JSONUtils.deserialize(data, Sample.class);
		Sample sample = this.sampleManager.save(model);
		return ResultUtils.renderSuccessResult(sample);
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		Sample sample = this.sampleManager.delete(id);
		return ResultUtils.renderSuccessResult(sample);
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeSelected",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveSelected(@RequestBody String data){
		
		List ids = JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("delete from SAMPLE where id in (");
			for (int i = 0; i < ids.size(); i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if (i != ids.size() - 1)
					idSql.append(",");
			}
			idSql.append(")");

			this.sampleManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data){
		Sample model = JSONUtils.deserialize(data, Sample.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Sample sample = this.sampleManager.save(model);
		return ResultUtils.renderSuccessResult(sample);
	}
	

	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		Sample query =  JSONUtils.deserialize(data, Sample.class);
		StringBuilder jql = new StringBuilder( " from Sample where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isBlank(query.getGender())){
			jql.append(" and gender = ? ");
			values.add(query.getGender());
		}
		if(!StringUtils.isBlank(query.getName())){
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
		
		List<Sample> addresss = this.sampleManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(addresss);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start , @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		Sample query =  JSONUtils.deserialize(data, Sample.class);
		StringBuilder jql = new StringBuilder( " from Sample where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if(!StringUtils.isBlank(query.getGender())){
			jql.append(" and gender = ? ");
			values.add(query.getGender());
		}
		if(!StringUtils.isBlank(query.getName())){
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
//		jql.append(" and createdAt > ? and createdAt < ? order by createdAt");
//		values.add(DateUtils.string2Date(startDate + " 00:00:00", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
//		values.add(DateUtils.string2Date(endDate + " 23:59:59", DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		
		this.sampleManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
}

package com.lenovohit.bdrp.authority.shiro.web;

import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;

/**
 * 为了 绕过spring boot 对类型为filter的bean自动注册为过滤器所做的封装
 * 
 * @author xiaweiyi
 *
 */
public interface PathMatchShiroFilterWrapper extends ShiroFilterWrapper {

	public boolean isEnabled();

	public void setName(String name);

	public FilterConfig getFilterConfig();

	public void setFilterConfig(FilterConfig filterConfig);

	public void setEnabled(boolean enabled);

	public ServletContext getServletContext();

	public void setServletContext(ServletContext servletContext);

}

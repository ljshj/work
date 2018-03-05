package com.lenovohit.hcp.material.manager.print.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.dto.PrintData;
import com.lenovohit.hcp.base.manager.impl.AbstractPrintDataManagerImpl;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatStoreInfo;

//盘点打印-物资
@Service("matChkPrintDataManager")
public class MatChkPrintDataManager extends AbstractPrintDataManagerImpl {
	@Autowired
	private GenericManager<MatStoreInfo, String> matStoreInfoManager;

	@Override
	public PrintData getPrintData(String bizId, HcpUser user) {
		String sql = "" + " select info.COMMON_NAME a0," + " info.MATERIAL_SPECS a1,"
				+ " chk.APPROVAL_NO+chk.BATCH_NO a2 ," + " info.MATERIAL_UNIT a3," + " chk.BUY_PRICE a4,"
				+ " chk.SALE_PRICE a5 ,"
				+ " cast(cast(chk.START_SUM as NUMERIC) as VARCHAR)+','+cast(cast(chk.START_SUM as NUMERIC) as VARCHAR) a6 ,"
				+ " cast(case when chk.WRITE_SUM is null then 0 else chk.WRITE_SUM end as NUMERIC) a7 ,"
				+ " chk.BUY_PRICE *cast(chk.START_SUM as NUMERIC) a8,"
				+ "  chk.SALE_PRICE *cast(chk.START_SUM as NUMERIC) a9 ,"
				+ " case when chk.WRITE_SUM is null then 0 else cast(chk.WRITE_SUM-chk.START_SUM as decimal(20, 4)) end a10   ,"
				+ " case when chk.WRITE_SUM is NULL then 0 else CAST((chk.WRITE_SUM-chk.START_SUM)*chk.BUY_PRICE as decimal(20, 4)) end a11"
				+ " from MATERIAL_INFO info,MATERIAL_CHECKINFO chk"
				+ " where chk.MATERIAL_ID=info.ID  and chk.CHECK_BILL='" + bizId + "'";
		List<Object> values = new ArrayList<Object>();
		PrintData data = new PrintData();
		String _deptId = "";

		String _outHtml = "";
		data.setT1(_outHtml);
		String _COMMON_NAME = "", _DRUG_SPECS = "", _BATCH_NO, _PACK_UNIT = "", _STORE_SUM = "";

		BigDecimal _BUY_PRICE = new BigDecimal(0), _SALE_PRICE = new BigDecimal(0), _BUY_COST = new BigDecimal(0),
				_SALE_COST = new BigDecimal(0), _END_SUM = new BigDecimal(0), _A11 = new BigDecimal(0),
				_A12 = new BigDecimal(0);

		List<Object> objList = (List<Object>) matStoreInfoManager.findBySql(sql);
		_outHtml = "<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse}</style>"
				+ "<table border=\"1\" width=\"100%\">" + "<tr><th>药品名称</th>" + "  <th>规格</th>"
				+ "<th>批号</th><th>单位</th><th>进货价</th><th>零售价</th><th>库存数</th><th>实际数</th><th>进货金额</th><th>零售金额</th><th>盈亏数量</th><th>盈亏金额</th></tr>\n";
		BigDecimal _sum1 = new BigDecimal(0);
		BigDecimal _sum2 = new BigDecimal(0);
		BigDecimal _sum3 = new BigDecimal(0);

		if (objList != null && objList.size() > 0) {
			for (int i = 0; i < objList.size(); i++) {
				Object[] obj = (Object[]) objList.get(i);

				_COMMON_NAME = (String) obj[0];// 药品名称
				_DRUG_SPECS = (String) obj[1];// 规格
				_BATCH_NO = (String) obj[2];// 批号
				_PACK_UNIT = (String) obj[3];// 单位
				_BUY_PRICE = (BigDecimal) obj[4];// 进货价
				_SALE_PRICE = (BigDecimal) obj[5];// 零售价
				_STORE_SUM = (String) obj[6];// 库存数
				_END_SUM = (BigDecimal) obj[7];// 实际数
				_BUY_COST = (BigDecimal) obj[8];// 进货金额
				_SALE_COST = (BigDecimal) obj[9];// 零售金额
				_A11 = (BigDecimal) obj[10];// 盈亏数量
				_A12 = (BigDecimal) obj[11];// 盈亏金额
				if (_A12 == null) {
					_A12 = new BigDecimal(0);
				}

				_sum1 = _sum1.add(_BUY_COST);
				_sum2 = _sum2.add(_SALE_COST);

				_sum3 = _sum3.add(_A12);

				_outHtml += "<tr>" + "<th>" + _COMMON_NAME + "</th>" + "<td>" + _DRUG_SPECS + "</td>" + "<td>"
						+ _BATCH_NO + "</td>" + "<td>" + _PACK_UNIT + "</td>" + "<td>" + _BUY_PRICE + "</td>" + "<td>"
						+ _SALE_PRICE + "</td>" + "<td>" + _STORE_SUM + "</td>" + "<td>" + _END_SUM + "</td>" + "<td>"
						+ PrintUtil.getAmount(_BUY_COST) + "</td>" + "<td>" + PrintUtil.getAmount(_SALE_COST) + "</td>"
						+ "<td>" + _A11.longValue() + "</td>" + "<td>" + PrintUtil.getAmount(_A12) + "</td>" + "</tr>\n";

			}
		}
		_outHtml += "<tr>" + "  <th colspan=2>合计</th>" + "  <td></td>" + "  <td></td>" + "  <td></td>" + "  <td></td>"
				+ "  <td></td><td></td>" + "  <td>" + PrintUtil.getAmount(_sum1) + "</td>" + "  <td>"
				+ PrintUtil.getAmount(_sum2) + "</td>" + "<td></td><td>" + PrintUtil.getAmount(_sum3) + "</td>"
				+ "</tr>\n";
		_outHtml += "</table>";
		data.setT2(_outHtml);

		return data;

	}

	static public String getNotNull(String value) {
		if (value == null || "null".equals(value)) {
			return "";
		} else {
			return value;
		}
	}
}

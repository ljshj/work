import { notification } from 'antd';
import { loadStoreInfoPage } from '../../services/pharmacy/StoreInfoService';
import { getOptions } from '../../services/UtilsService';
import { loadDeptByTypes } from '../../services/base/DeptService';
import { loadUsersByDept } from '../../services/base/UserDeptService';
import { saveOutput } from '../../services/pharmacy/OutputInfoService';

let menu = [];
export default {
  namespace: 'outStock',
  state: {
    page: {
      total: 0,
      pageSize: 10,
      pageNo: 1,
    },
    data: [], // 库存
    dataOutStock: [], // 出库明细
    typeData: [], // 出库类型
    deptData: [], // 出科科室
    userDate: [], // 领送人
    tradeName: '', // 药品名称查询条件
    spin: false,
    outStockMainFormData: {
      comm: '',
    },

    bizPrintAlertParams: {
      visible: false,
      tmplateCode: '',
      bizCode: '',
      bizCodeLabel: '',
      bizTip: '',
    },
  },
  effects: {
    // 1、加载页面（操作类型、出库科室）
    // 2、加载库存信息
    // 3、添加出库明细
    // 4、删除出库明细
    // 5、修改出库明细
    // 6、保存出库信息
    // 7、根据科室加载送领人
    // 8、保存明细出库数量

    // 1、加载页面（操作类型、出库科室）
    * load({ payload }, { call, put, select }) {
      const { user } = yield select(state => state.base);

      // 获取操作类型
      const colNames = ['OUT_TYPE'];
      let data = yield call(getOptions, colNames);
      let typeData = [];
      if (data) {
        typeData = { typeData: data.OUT_TYPE };
      }

      // 获取出库科室【科室类型 003.病区 004.药房 005.药库】
      const types = ['001', '002', '003', '004', '005'];
      let deptData = [];
      data = yield call(loadDeptByTypes, types);
      if (data) {
        if (data.data) {
          for (const item of data.data.result) {
            if (item.id != user.loginDepartment.id) {
              deptData.push(item);
            }
          }
        }
      }

      // 加载领送人
      const newState = { ...typeData, deptData };
      yield put({ type: 'setState', payload: newState });
      // 获取科室人员
    },
    // 2、加载库存信息
    * loadStore({ payload }, { select, call, put }) {
      const { page, query } = payload || {};
      const { tradeName } = query;
      yield put({ type: 'setState', payload: { spin: true } });
      const outStock = yield select(state => state.outStock);
      const { page: defaultPage } = outStock;
      const newPage = {
        ...defaultPage,
        ...page,
      };
      const { pageNo, pageSize } = newPage;
      const start = (pageNo - 1) * pageSize;
      const { data } = yield call(loadStoreInfoPage, start, pageSize, query); // 调用汐鸣接口查询
      if (data) {
        newPage.total = data.total;
        yield put({
          type: 'init',
          data,
          page: newPage,
        });
      }
      yield put({ type: 'setState', payload: { spin: false, tradeName } });
    },
    // 3、添加出库明细
    * addOutStockDetail({ record }, { select, call, put }) {
      let { dataOutStock } = yield select(state => state.outStock);
      if (!dataOutStock.find(value => value.id == record.id)) {
        dataOutStock.push(record);
        yield put({ type: 'setState', payload: { dataOutStock } });
      }
    },
    // 4、删除出库明细
    * deletOutStockDetail({ index }, { select, call, put }) {
      let { dataOutStock } = yield select(state => state.outStock);
      dataOutStock.splice(index, 1);
      yield put({ type: 'setState', payload: { dataOutStock } });
    },
    // 5、修改出库明细
    // 6、保存出库信息
    * saveOutStockInfo({ value }, { select, call, put }) {
      const commStr = yield select(state => state.outStock.outStockMainFormData.comm);

      yield put({ type: 'setState', payload: { spin: true } });
      const { dataOutStock } = yield select(state => state.outStock);
      if (!(dataOutStock instanceof Array) || dataOutStock.length <= 0) {
        notification.info({
          message: '提示',
          description: '请添加出库药品!',
        });
        yield put({ type: 'setState', payload: { spin: false } });
        return;
      }
      const { user } = yield select(state => state.base);
      const { deptId } = user.loginDepartment.id;

      /**
       * DEPT_ID 长度
       * OUT_OPER 长度
       * PRODUCER 长度
       * OUT_ID  含义 必填
       * APPLY_NO 含义 必填
       * APPLY_FLAG 有出库方式，是否还需要此字段
       * TO_DEPT 长度
       */
      const outStockList = [];
      let i = 0;
      for (const item of dataOutStock) {
        if (!item.outSum || item.outSum <= 0) {
          notification.info({
            message: "提示",
            description: "请输入药品【" + item.tradeName + "】出库数量",
          });
          yield put({ type: 'setState', payload: { spin: false } });
          return;
        }
        if (item.outSum * item.drugInfo.packQty > item.storeSum) {
          notification.info({
            message: "提示",
            description: "药品【" + item.tradeName + "】出库数量不能大于库存数量",
          });
          yield put({ type: 'setState', payload: { spin: false } });
          return;
        }

        i++;
        const producerInfo = item.companyInfo ? item.companyInfo.id : null;
        const companyInfo = item.companySupply ? item.companySupply.id : null;
        const drugInfo = item.drugInfo ? item.drugInfo.id : null;
        let _mat = {
          hosId: item.hosId,
          deptInfo: { id: user.loginDepartment.id },
          outType: value.outType,
          billNo: i,
          //            plusMinus: '1',
          //            storeId: item.id,
          //            drugCode: item.drugCode,
          drugInfo: { id: drugInfo },
          tradeName: item.tradeName,
          specs: item.specs,
          drugType: item.drugType,
          batchNo: item.batchNo,
          approvalNo: item.approvalNo,
          produceDate: item.produceDate,
          producerInfo: { id: producerInfo },
          validDate: item.validDate,
          companyInfo: { id: companyInfo },
          buyPrice: item.buyPrice,
          salePrice: item.salePrice,
          outSum: item.outSum,
          minUnit: item.minUnit,
          buyCost: item.buyCost,
          saleCose: item.saleCose,
          outOper: user.name,
          //            outOper: '',
          outTime: item.outTime,
          outputState: '2',
          applyFlag: item.applyFlag,
          comm: commStr,
        };
        if (value.toDept && value.outType !== 'O3' && value.outType !== 'O5') {
          _mat.toDept = { id: value.toDept };
        }
        outStockList.push(_mat);
      }

      const { data } = yield call(saveOutput, outStockList);
      if (data) {
        if (data.success) {
          const retData = data.result;

          // 弹出业务单据打印提示
          yield put({
            type: 'setState',
            payload: {
              bizPrintAlertParams: {
                visible: true,
                tmplateCode: '010', // 模版编号
                bizCode: retData[0].outBill, // 业务单据编号
                bizCodeLabel: '出库单号', // 业务单据编号名称
                bizTip: '直接出库提交成功', // 业务操作成功提示
              },
            },
          });

          dataOutStock.splice(0, dataOutStock.length);
          const { tradeName } = yield select(state => state.outStock);

          yield put({ type: 'setState', payload: { dataOutStock } });
          yield put({ type: 'loadStore', payload: { query: { deptId: user.loginDepartment.id, tradeName } } });
        } else {
          notification.error({
            message: '错误',
            description: data.msg,
          });
        }
      }
      yield put({ type: 'setState', payload: { spin: false } });
    },
    // 7、根据科室加载送领人
    * loadUserByDept({ deptId }, { call, put }) {
      const { data } = yield call(loadUsersByDept, deptId);
      if (data && data.result) {
        yield put({ type: 'setState', payload: { userData: data.result } });
      }
    },
    // 8、保存明细出库数量
    * modifyCol({ index, record }, { select, put }) {
      const { dataOutStock } = yield select(state => state.outStock);
      if (dataOutStock instanceof Array && dataOutStock.length > index) {
        dataOutStock[index] = record;
        yield put({ type: 'setState', payload: { dataOutStock } });
      }
    },
  },

  // 下拉选择药房数据以及库存searchBar查询

  reducers: {
    init(state, { data, page }) {
      const { result } = data;
      const newdata = result || [];
      return { ...state, data: newdata, page };
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

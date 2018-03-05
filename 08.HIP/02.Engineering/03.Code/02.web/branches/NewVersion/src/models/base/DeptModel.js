import { notification } from 'antd';
import { createDept, deleteAll, loadDept, loadDeptss } from '../../services/base/DeptService';
import { reloadDepts, initDepts } from '../../services/UtilsService';

export default {
  namespace: 'department',
  state: {
    tabs: [],
    maxDeptId: 0,
    activeKey: '',
    menus: [],
    checkedKeys: [],
    selectedNode: {},
    menu: {},
    showIconSelecter: false,
    spin: false,
    depts: [],
    deptsIdx: [],
  },

  effects: {
    *initDicts({ payload }, { call, put }) {
      const { depts, deptsIdx } = yield call(initDepts);
      if (depts && deptsIdx) {
        yield put({ type: 'setState', state: { depts } });
      }
    },
    *getInfo({ Id }, { call, put }) {
      yield put({ type: 'addSpin' });
      const dept = yield call(loadDept, Id);
      if (dept) {
        yield put({
          type: 'setState',
          state: {
            selectedNode: dept.data.result,
            menu: dept.data.result,
          },
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },
    *save({ params }, { select, call, put }) {
      // console.log("save_params", params);
      yield put({ type: 'addSpin' });
      const { data } = yield call(createDept, params);
      if (data && data.success) {
        // 重新加载科室信息
        const { depts, deptsIdx } = yield call(loadDeptss);
        console.log(depts);
        console.log(deptsIdx);
        yield put({
          type: 'setState',
          state: { depts, deptsIdx },
        });
        // 如果是新增，新增后默认选中
        if (!params.id) {
          const node = { ...data.result };
          console.log(node);
          console.log(1111);
          // 如果新增的是同级菜单，默认新增的科室被选中
          // 新的方法，默认只有一级菜单，新增默认depttype
          const { selectedNode } = yield select(state => state.department);
          console.log(selectedNode.id);
          if (node.parentId === selectedNode.id) { // 当前被选是父节点
            node.parentId = selectedNode.id;
          } else {
            node.parentId = selectedNode.parentId;
          }
          // 将当前被选设置为新node
          yield put({
            type: 'setState',
            state: {
              selectedNode: node,
              menu: node,
            },
          });
          yield put({
            type: 'getInfo',
          });
          const { m, n } = yield call(initDepts);
          console.log(m, n);
          /*    if (m.depts && n.deptsIdx) {
            yield put({
              type: 'setState',
              payload: {
                m.depts,
                n.deptsIdx,
              },
            });
          } */
        }
      } else {
        // TODO: 提示错误
        notification.info({
          message: '提示',
          description: data.msg,
        });
      }
      // 移除载入指示器
      yield put({ type: 'removeSpin' });
    },

    *deleteSelected({ params }, { select, call, put }) {
      const checkedKeys = yield select(state => state.department.checkedKeys);
      yield put({ type: 'addSpin' });
      // console.log('checkedKeys', checkedKeys);
      const { data } = yield call(deleteAll, checkedKeys);
      if (data && data.success) {
        yield put({
          type: 'setState',
          state: {
            checkedKeys: [],
            selectedNode: {},
            menu: {},
          },
        });
        // 重新加载部门信息
        const { depts, deptsIdx } = yield call(loadDeptss);
        yield put({
          type: 'setState',
          state: { depts },
        });
        yield put({ type: 'removeSpin' });
      }
    },
    *setDeptType({ payload }, { put }) {
      // console.log("payload",payload);
      yield put({
        type: 'setState',
        state: {
          menu: {
            deptType: payload.selectedType,
          },
        },
      });
    },
  },
  reducers: {

    init(state, data) {
      const { dicts } = data;
      const depts = [];
      for (const key in dicts) {
        if (key) {
          depts.push(dicts[key]);
        }
      }
      // console.log("depts",depts);
      return {
        ...state,
        menus: depts,
        checkedKeys: [],
        maxDeptId: 10,
      };
    },

    addOrActiveTab(state, { tab }) {
      // console.info('addTab');
      const { tabs } = state;
      for (const t of tabs) {
        if (t.key === tab.key) {
          return { ...state, activeKey: tab.key };
        }
      }
      tabs.push(tab);
      return { ...state, tabs, activeKey: tab.key };
    },

    setState(oldState, { state }) {
      return { ...oldState, ...state };
    },

    addSpin(state) {
      return { ...state, spin: true };
    },

    removeSpin(state) {
      return { ...state, spin: false };
    },
  },

};


import { findInpatientPaymentRecord } from '../services/inpatientPaymentRecordService';

export default {

  namespace: 'inpatientPaymentRecord',
  state: {
    data: [],
    isLoading: false,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        // console.info('pathname ', pathname);
        if (pathname === '/inpatientPaymentRecord/inpatientPaymentRecordList') {
          dispatch({ type: 'findChargeList', payload: {} });
        }
      });
    },
  },

  effects: {
    *findChargeList({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: { isLoading: true },
      });
      const { query } = payload;
      let pro = {};
      if (query) {
        pro = query;
      } else {
        const { currProfile: profile } = yield select(state => state.base);
        pro = profile;
      }
      if (JSON.stringify(pro) !== '{}') {
        const { data } = yield call(findInpatientPaymentRecord, pro);
        const { result } = data || {};
        yield put({
          type: 'save',
          payload: {
            data: result || [],
            isLoading: false,
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

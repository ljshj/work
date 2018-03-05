import ajax from '../../utils/ajax';
import { apiRoot } from '../../utils/config';

export async function loadOrders(regId) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/list/${regId}`);
}

export async function saveItem(data) {
  return ajax.POST(`${apiRoot.odws}medicalOrder/item/save`, data || {});
}

export async function saveItemsByTmpl(tmplId, regId, patientId) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/item/saveByTmpl/${tmplId}/${regId}/${patientId}`);
}

export async function deleteItem(id) {
  return ajax.DELETE(`${apiRoot.odws}medicalOrder/item/remove/${id}`);
}

export async function makeGroup(data) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/item/makeGruop`, data || []);
}

export async function deleteFromGroup(data) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/item/deleteFromGroup`, data || []);
}

export async function sortItems(data) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/item/sort`, data || []);
}
export async function loadAdviceInfoPage(start, limit, query) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/page/${start}/${limit}`, query || {});
}

export async function loadBack(start, limit, query) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/loadBack/${start}/${limit}`, query || {});
}
export async function withDrawal(query) {
  return ajax.POST(`${apiRoot.odws}medicalOrder/withDrawal`, query || {});
}
export async function loadOrdersDetail(regId) {
  return ajax.GET(`${apiRoot.odws}medicalOrder/listorder/${regId}`);
}
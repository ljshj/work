import ajax from '../utils/ajax';
const _API_ROOT = "/api/ssm/client/";

/**
 * 查询账户基本信息
 */
export async function loadAcctInfo () {
  return ajax.GET(_API_ROOT + 'account/loadAcctInfo');
}




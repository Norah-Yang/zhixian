import axios from 'axios'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @data {Object} data [请求时携带的参数]
 */
/*
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @data {Object} data [请求时携带的参数] 
 */
//新闻列表增删改查
export const  getjournalismList=data=> axios.post("mapi/journalismList", data)
export const  getjournalismAdd=data=> axios.post("mapi/journalismAdd", data)
export const  journalismUpdate=data=> axios.get("mapi/journalismUpdate", data)
export const  getjournalismUpdate=data=> axios.post("mapi/journalismUpdate", data)
export const  getjournalismDel=data=> axios.get("mapi/journalismDel", data)
// 帮助分类增删改查
export const  gethelpCateAdd=data=> axios.post("mapi/helpCateAdd", data)
export const  gethelpCateList=data=> axios.post("mapi/helpCateList", data)
export const  gethelpCateUpdate=data=> axios.get("mapi/helpCateUpdate", data)
export const  helpCateUpdate=data=> axios.post("mapi/helpCateUpdate", data)
export const  gethelpDel=data=> axios.get("mapi/helpCateDel", data)
// 帮助份分类增删改查
export const  helpList=data=> axios.get("mapi/helpUpdate", data)
export const  helpAdd=data=> axios.post("mapi/helpAdd", data)
export const  gethelpList=data=> axios.post("mapi/helpList", data)
export const  gethelpUpdate=data=> axios.get("mapi/helpUpdate", data)
export const  gethelpUpdates=data=> axios.post("mapi/helpUpdate", data)
export const  gethelpDels=data=> axios.get("mapi/helpDel", data)
// 手工下单旧
export const  getaddWeiOrder=data=> axios.get("mapi/addWeiOrder", data)
export const  getweiShopOrder=data=> axios.post("mapi/weiShopOrder", data)
export const  getproductSubmitOrder=data=> axios.post("mapi/productSubmitOrder", data)
export const  getaddWeiOrders=data=> axios.post("mapi/addWeiOrder", data)
//销售日报
export const  getsellRetails=data=> axios.post("mapi/sellRetail", data)
export const  getsellExcel=data=> axios.post("mapi/sellExcel", data)
// 收银日报
export const  getmachineRetail=data=> axios.post("mapi/machineRetail", data)
export const  getmachineExcel=data=> axios.post("mapi/machineExcel", data)
// 门店日报
export const  getshopRetail=data=> axios.post("mapi/shopRetail", data)
export const  getshopExcel=data=> axios.post("mapi/shopExcel", data)
export const  shopAdds=data=> axios.get("mapi/shopAdd ", data)
 
export const  getshops=data=> axios.get("mapi/shop", data)
// 会员管理储值规则
export const  memberStoreRule=data=> axios.post("mapi/memberStoreRule", data)
export const  memberStoreRuleAdd=data=> axios.get("mapi/memberStoreRuleAdd", data)
export const  memberStoreRules=data=> axios.post("mapi/memberStoreRuleAdd", data)
export const  memberStoreRuleUpdate=data=> axios.get("mapi/memberStoreRuleUpdate", data)
export const  memberStoreRuleUpdates=data=> axios.post("mapi/memberStoreRuleUpdate", data)
export const  memberStoreRuleDel=data=> axios.get("mapi/memberStoreRuleDel", data)


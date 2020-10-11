import axios from 'axios'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @data {Object} data [请求时携带的参数]
 */
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @data {Object} data [请求时携带的参数] 
 * 
 * 
 * 注意----------------------------------------以后可以这样优化接口----------------------------------
 * 
 */
// export const  getorder=data=> axios.post("mapi/order", data)
// --------------------------------管理中心=>订单管理=>订单列表-----------------------------------------------------
function getorder(data) {
  return axios.post("mapi/order", data);
}
// --------------------------------航栏菜单----------------------------------------------------
function getmenu(data) {
  return axios.get("mapi/menu", data);
}
// 根据导航栏菜单获取坐厕菜单栏
function getmenuaside(data) {
  return axios.get("mapi/index/column", data);
}
// ------------------------------weChart商城管理-------------------------------------------------------------------
// 获取商品分类----------------------------商品分类---------------------------------------------------
function getcate(data) {
  return axios.get("mapi/cate", data);
}
// 获取商品分类状态修改
function getcateType(data) {
  return axios.get("mapi/cateType", data);
}

// 一级添加
function getaddCateOnee(data) {
  return axios.post("mapi/addCateOne", data);
}
// 二级添加
function getaddCateTwo(data) {
  return axios.post("mapi/addCateTwo", data);
}
// 商品分类修改
function getupdateCate(data) {
  return axios.get("mapi/updateCate", data);
}
// 商品分类修改添加
function getupdateCates(data) {
  return axios.post("mapi/updateCate", data);
}
// 商品分类删除
function getcateDel(data) {
  return axios.get("mapi/cateDel", data);
}
// --------------------------------------------商品列表--------------------------------------------------------
// 商品分类接口
function getGoodsList(data) {
  return axios.post("mapi/weiGoodsList", data);
}
// 商品分类改变状态
function getweiUpStatus(data) {
  return axios.post("mapi/weiUpStatus", data);
}
// 商品分类上级
function getweiAllStatus(data) {
  return axios.post("mapi/weiAllStatus", data);
}
// 商品分类删除
function getweiDel(data) {
  return axios.post("mapi/weiDel", data);
}
// 商品批量分类删除
function getweiAllDel(data) {
  return axios.post("mapi/weiAllDel", data);
}
// 商品tag标签切换
function getweiRecommend(data) {
  return axios.post("mapi/weiRecommend", data);
}
// 批量商品tag标签切换
function getweiAllRecommend(data) {
  return axios.post("mapi/weiAllRecommend", data);
}
// ----------------------------------------------------添加商品-------------------------------------------------------

// 获取下拉菜单列表
function getaddWeiGoods(data) {
  return axios.get("mapi/addWeiGoods", data);
}
// 查询线下商品列
function getgoodsLists(data) {
  return axios.post("mapi/goodsList", data);
}
// 商品列表选择提交
function getweiGoodsSubmit(data) {
  return axios.post("mapi/weiGoodsSubmit", data);
}
// 商品列表添加
function getaddWeiGood(data) {
  return axios.post("mapi/addWeiGoods", data);
}
// 修改
//  
// 商品列表修改
function getupdateWeiGoods(data) {
  return axios.get("mapi/updateWeiGoods", data);
}

function getupdatewxGoods(data) {
  return axios.post("mapi/updateWeiGoods", data);
}
// -----------------------------------------------------微信订单列表---------------------------------------------------------


// 微信订单列表
function getweiOrder(data) {
  return axios.post("mapi/weiOrder", data);
}
// 订单列表查看
function getweiOrderDetail(data) {
  return axios.post("mapi/weiOrderDetail", data);
}

// -----------------------------------------------------微信商品管理=>属性模板---------------------------------------------------------
//属性模板列表
function getweiAttribute(data) {
  return axios.post("mapi/weiAttribute", data);
}
//属性模板新增
function getweiAttributeAdd(data) {
  return axios.post("mapi/weiAttributeAdd", data);
}
//属性模板修改
function getweiAttributeUpdate(data) {
  return axios.get("mapi/weiAttributeUpdate", data);
}
//属性模板修改提交
function getweiAttributeUpdates(data) {
  return axios.post("mapi/weiAttributeUpdate", data);
}
// 
//属性模板删除
function getweiAttributeDel(data) {
  return axios.get("mapi/weiAttributeDel", data);
}
// -----------------------------------------------------微信商品管理=>商品评论---------------------------------------------------------
//商品评论列表
function getweiComment(data) {
  return axios.post("mapi/weiComment", data);
}
//切换审核状态
function getweiCommentState(data) {
  return axios.get("mapi/weiCommentState", data);
}
//评论删除
function getweiCommentDel(data) {
  return axios.get("mapi/weiCommentDel", data);
}

// -----------------------------------------------------------营销中心--------------------------------------------------------
// 秒杀列表
function getgoodsSeckill(data) {
  return axios.post("mapi/goodsSeckill", data);
}
// 选中列表提交
function getsubGoods(data) {
  return axios.post("mapi/subGoods", data);
}
// 添加
function getwxsubGoods(data) {
  return axios.post("mapi/addSeckill", data);
}
// // 选中表单提交
// function getwxsubGoods(data) {
//   return axios.post("mapi/subGoods", data);
// }
// 
// --------------------------------------------------营销中心=>营销玩法=>拼团列表-----------------------------------------------------------
// 
// 拼团列表
function getwxlist(data) {
  return axios.post("mapi/listTuan", data);
}
// 拼团添加选择表格
function getwxgoodsTuanList(data) {
  return axios.post("mapi/goodsTuanList", data);
}
// 拼团选中商品提交
function getwxgoodsTuanSub(data) {
  return axios.post("mapi/goodsTuanSub", data);
}
// 拼团表单提交
function getwxaddTuan(data) {
  return axios.post("mapi/addTuan", data);
}
// 拼团表单提交
function getwxupdateTuan(data) {
  return axios.get("mapi/updateTuan", data);
}
// 拼团表单修改提交
function getwxupdateTuans(data) {
  return axios.post("mapi/updateTuan", data);
}
// 拼团列表单个删除
function getwxdelTuan(data) {
  return axios.get("mapi/delTuan", data);
}
// 拼团列表切换状态
function forsaleTuan(data) {
  return axios.get("mapi/forsaleTuan", data);
}
// 拼团列表推荐状态
function getwxmhotTuan(data) {
  return axios.get("mapi/hotTuan", data);
}

// -----------------------------------营销中心=>营销玩法=>秒杀列表-----------------------------------------------------------
// 秒杀列表
function getwxseckillList(data) {
  return axios.post("mapi/seckillList", data);
}
// 秒杀列表修改
function getwxupdateSeckill(data) {
  return axios.get("mapi/updateSeckill", data);
}
// 秒杀列表提交
function getwxsubmitSeckill(data) {
  return axios.post("mapi/updateSeckill", data);
}
// 秒杀列表上架状态
function getwxforsaleSeckill(data) {
  return axios.get("mapi/forsaleSeckill", data);
}
// 秒杀列表推荐状态
function getwxhotSeckill(data) {
  return axios.get("mapi/hotSeckill", data);
}

// -----------------------------------营销中心=>营销玩法=>优惠券---------------------------------------------------
// 优惠券列表
function getwxcoupon(data) {
  return axios.post("mapi/coupon", data);
}
// 添加优惠券
function getwxcouponAdd(data) {
  return axios.post("mapi/couponAdd", data);
}
// 查看优惠券
function getwxcouponDetail(data) {
  return axios.post("mapi/couponDetail", data);
}
// 修改提交优惠券
function getwxgiveUpdate(data) {
  return axios.post("mapi/couponUpdate", data);
}
// 修改优惠券状态
function getwxcouponState(data) {
  return axios.post("mapi/couponState", data);
}
// 优惠券新增
function getwxgiveAdd(data) {
  return axios.post("mapi/giveAdd", data);
}
// 优惠券查询
function getwxgiveSearch(data) {
  return axios.post("mapi/giveSearch", data);
}
// 优惠券修改提交
function getwxgiveUpdates(data) {
  return axios.post("mapi/giveUpdate", data);
}
// 
// 优惠券查看
function getwxcouponDetailview(data) {
  return axios.post("mapi/couponDetail", data);
}

// -----------------------------------营销中心=>营销玩法=>积分商城---------------------------------------------------
// 积分商城获取列表
function getwxgoodsScoreList(data) {
  return axios.post("mapi/goodsScoreList", data);
}
// 积分商城选中莫一项提交
function getwxgoodsScoreSub(data) {
  return axios.post("mapi/goodsScoreSub", data);
}
// 积分商城添加接口
function getwxaddScore(data) {
  return axios.post("mapi/addScore", data);
}
// 积分商城获取添加接口
function getwxaddScores(data) {
  return axios.get("mapi/addScore", data);
}
// 
// 积分商城列表
function getwxlistScore(data) {
  return axios.post("mapi/listScore", data);
}
// 积分商城列表修改
function getwxupdateScore(data) {
  return axios.get("mapi/updateScore", data);
}
// 积分商城修改提交
function getwxupdateScores(data) {
  return axios.post("mapi/updateScore", data);
}
// 积分商城删除
function getwxdelScore(data) {
  return axios.get("mapi/delScore", data);
}
// 积分商城改变上架状态
function getwxforsaleScoreGoods(data) {
  return axios.get("mapi/forsaleScoreGoods", data);
}
// -----------------------------------微信商城=>会员管理---------------------------------------------------
//会员管理列表
function getwxmanage(data) {
  return axios.post("mapi/MemberupManage", data);
}
//会员管理编辑
function getMemberupdetailSearch(data) {
  return axios.post("mapi/MemberupdetailSearch", data);
}
//会员管理编辑提交
function getMemberupdetailUpdate(data) {
  return axios.post("mapi/MemberupdetailUpdate", data);
}
//会员是否禁用
function getMemberupmemberDel(data) {
  return axios.post("mapi/MemberupmemberDel", data);
}
//会员标签列表
function getMemberupLabelSearch(data) {
  return axios.post("mapi/MemberupLabelSearch", data);
}
//会员标签列表新增
function getMemberupLabel(data) {
  return axios.post("mapi/MemberupLabel", data);
}
//会员地址查询
function getMemberupaddressSearch(data) {
  return axios.post("mapi/MemberupaddressSearch", data);
}
//会员地址新增
function getMemberupaddressAdd(data) {
  return axios.post("mapi/MemberupaddressAdd", data);
}
// //会员地址修改
function getMemberupAddressDetail(data) {
  return axios.post("mapi/MemberupAddressDetail", data);
}
// //会员地址修改提交
function getMemberupaddressUpdate(data) {
  return axios.post("mapi/MemberupaddressUpdate", data);
}
// //会员标签列表
function getMemberupLabelSearchss(data) {
  return axios.post("mapi/MemberupLabelSearch", data);
}
// //会员批量标签列表
function getMemberupLabelAdd(data) {
  return axios.post("mapi/MemberupLabelAdd", data);
}
// -----------------------------------微信商城=>余额记录---------------------------------------------------
// //会员批量标签列表
function getMemberupMoneyList(data) {
  return axios.post("mapi/MemberupMoneyList", data);
}
// -----------------------------------微信商城=>积分记录---------------------------------------------------

// //积分列表
function getMemberupScoreList(data) {
  return axios.post("mapi/MemberupScoreList", data);
}
// -----------------------------------微信商城=>团购列表---------------------------------------------------
// //积团购列表
function gettuanOrder(data) {
  return axios.post("mapi/tuanOrder", data);
}
// //积团购列表详情
function gettuanOrderDetailDetail(data) {
  return axios.post("mapi/tuanOrderDetailDetail", data);
}
// //积团购列表详情
function gettuanOrderDetail(data) {
  return axios.post("mapi/tuanOrderDetail", data);
}
// -----------------------------------公众号设置=>公众号配置---------------------------------------------------
function getsetwechat(data) {
  return axios.get("mapi/setwechat", data);
}

function getsetwechats(data) {
  return axios.post("mapi/setwechat", data);
}
// -----------------------------------公众号设置=>自定义菜单---------------------------------------------------

function getcustom(data) {
  return axios.get("mapi/custom", data);
}
// 新建
function getcustomState(data) {
  return axios.post("mapi/custom", data);
}
// 新建子级菜单提交
function getaddSonCustom(data) {
  return axios.post("mapi/addSonCustom", data);
}

function getaddsetCustom(data) {
  return axios.get("mapi/setCustom", data);
}

// 新建父级菜单提交
function getaddCustom(data) {
  return axios.post("mapi/addCustom", data);
}
// 点击了删除
function getdelCustom(data) {
  return axios.post("mapi/delCustom", data);
}
// \mapi/delCustom
// -----------------------------------公众号设置=>关键字回复---------------------------------------------------

//关键字回复列表
function getreplyList(data) {
  return axios.get("mapi/replyList", data);
}
// 关键词回复回复类型
function getaddKeyword(data) {
  return axios.get("mapi/addKeyword", data);
}
// 添加图文接口
function getSource(data) {
  return axios.get("mapi/Source", data);
}
// // 添加图文接口提交
// function getaddKeywords(data) {
//   return axios.post("mapi/addKeyword", data);
// }
// 点击了编辑
function geteditCustom(data) {
  return axios.post("mapi/editCustom", data);
}
// 点击了查看
function geteviewCustom(data) {
  return axios.get("mapi/editCustom", data);
}
// 新增关键字
function getpostKeyword(data) {
  return axios.post("mapi/addKeyword", data);
}
// 状态切换
function getswithreplyList(data) {
  return axios.post("mapi/replyList", data);
}
// 编辑查看
function geteditKeyword(data) {
  return axios.get("mapi/editKeyword", data);
}
// 编辑提交
function geteditKeywords(data) {
  return axios.post("mapi/editKeyword", data);
}
// 删除关键字
function getdelKeyword(data) {
  return axios.post("mapi/delKeyword", data);
}

// -----------------------------------公众号设置=>素材管理---------------------------------------------------
function geteviewdev(data) {
  return axios.get("mapi/Source", data);
}
// 素材管理状态改变
function getSources(data) {
  return axios.post("mapi/Source", data);
}
// 获取素菜类型
function getaddSource(data) {
  return axios.get("mapi/addSource", data);
}
//图文提交
function getsubmitSource(data) {
  return axios.post("mapi/addSource", data);
}
//查看
function geteditSource(data) {
  return axios.get("mapi/editSource", data);
}
//提交
function getposteditSource(data) {
  return axios.post("mapi/editSource", data);
}
//删除
function getdelSource(data) {
  return axios.post("mapi/delSource", data);
}
 
// -----------------------------------公众号设置=>素材分类-------------------------------------------------
// 获取列表
function getdev(data) {
  return axios.get("mapi/dev", data);
}
// 状态切换
function getswithdev(data) {
  return axios.post("mapi/dev", data);
}
// 分类名称添加
function getaddDev(data) {
  return axios.post("mapi/addDev", data);
}
// 分类名删除
function getdelDev(data) {
  return axios.post("mapi/delDev", data);
}
// 编辑
function geteditDev(data) {
  return axios.get("mapi/editDev", data);
}
// -----------------------------------公众号设置=>模板消息-------------------------------------------------
// 列表
function gettemplatev(data) {
  return axios.get("mapi/template", data);
}
// 修改模板消息
function geteditTemplate(data) {
  return axios.post("mapi/editTemplate", data);
}
// 添加模板消息
function getgetTemplate(data) {
  return axios.post("mapi/getTemplate", data);
}
// -----------------------------------系统设置=>快递自提点管理-------------------------------------------------
// 快递自提点管理添加
function getaddLineshop(data) {
  return axios.get("mapi/addLineshop", data);
}
// 快递自提点管理提交
function getpostLineshop(data) {
  return axios.post("mapi/addLineshop", data);
}
// 快递自提点列表
function getlineshop(data) {
  return axios.post("mapi/lineshop", data);
}
// 快递自提点查看
function getupdateLineshop(data) {
  return axios.get("mapi/updateLineshop", data);
}
// 快递自提点修改
function getupdateLineshops(data) {
  return axios.post("mapi/updateLineshop", data);
}
// 快递列表状态切换
function getexpressageLineshop(data) {
  return axios.get("mapi/expressageLineshop", data);
}
// 快递列表状态切换
function getpickLineshop(data) {
  return axios.get("mapi/pickLineshop", data);
}
// 快递列表状态切换
function getstatusLineshop(data) {
  return axios.get("mapi/statusLineshop", data);
}

// -----------------------------------系统设置=>快递自提点时间设置-------------------------------------------------
// 快递列表状态切换
function gettimeLineshop(data) {
  return axios.get("mapi/timeLineshop", data);
}
function gettimeLineshops(data) {
  return axios.post("mapi/timeLineshop", data);
}







//---------------------------------------------------------------------------------------
function merchantEdit (data) {
  return axios.post('mapi/merchantEdit', data)
}
function getMerchant (data) {
  return axios.post('mapi/getMerchant', data)
}
function getshoplist (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function shopsearch (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function shopstatus (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function merchantsearch (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function getMerchantList (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function getwarehouse (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function warehousesearch (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function warehouselook (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function warehousedel (data) {
  return axios.post('mapi/getMerchanttt', data)
}
function rules (data) {
  return axios.post('mapi/MemberupPaySearch', data)
}
function rulesAdd (data) {
  return axios.post('mapi/MemberupPayAdd', data)
}
function rulesEdit (data) {
  return axios.post('mapi/MemberupPayUpdate', data)
}
function rulesDel (data) {
  return axios.post('mapi/MemberupPayDel', data)
}
//收银机器管理
function machineList (data) {
  return axios.post('mapi/machineUniversal', data)
}
function machineEdit (data) {
  return axios.post('mapi/machine', data)
} 
function getShop (data){
  return axios.get('mapi/ShareCommon/shop', data)
}
// 店铺管理
function storeManagementList (data) {
  return axios.post('mapi/shopShop', data)
} 
function storeManagementEdit (data) {
  return axios.get('mapi/shopUpdate', data)
}
function storeManagementAdd (data) {
  return axios.post('mapi/shopAdd', data)
}
function storeManagementUpdate (data) {
  return axios.post('mapi/shopUpdate', data)
}
function changeType (data) {
  return axios.get('mapi/shopStatus', data)
}
// 店铺轮播图
function getCarouselList (data) {  //列表
  return axios.post('mapi/carouselSetting', data)
}  
function getCarouselStatus (data) { //状态
  return axios.get('mapi/carouselStatusSetting', data)
}
function getCarouselDel (data) {   //删除
  return axios.get('mapi/carouselDelSetting', data)
}
function carouselUp (data) {   // 修改查询
  return axios.get('mapi/carouselUpdateSetting', data)
}
function carouselUpStting (data) {   // 修改提交
  return axios.post('mapi/carouselUpdateSetting', data)
}
function carouselAddSetting (data) {  //新增
  return axios.post('mapi/carouselAddSetting', data)
} 
// 通用设置
 function getCommom(data){
  return axios.get('mapi/commonSetting', data)
 }
 function commomEdit(data){
  return axios.post('mapi/commonSetting', data)
 }
//  短信管理
function getMesaage(data){
  return axios.post('mapi/getMesaage', data)
 }
// 广告
function advertisingAddSetting(data){
  return axios.get("mapi/advertisingAddSetting",data)
}
function advertisingAddSettingAdd(data){
  return axios.post("mapi/advertisingAddSetting",data)
}
function advertisingSetting(data){
  return axios.post("mapi/advertisingSetting",data)
}
function advertisingStatusSetting(data){
  return axios.get("mapi/advertisingStatusSetting",data)
}
function advertisingDelSetting(data){
  return axios.get("mapi/advertisingDelSetting",data)
}
function advertisingUpdateSetting(data){
  return axios.get("mapi/advertisingUpdateSetting",data)
}
function advertisingUpdateSetting_(data){
  return axios.post("mapi/advertisingUpdateSetting",data)
}
// 退款
function refundSetting(data){   
  return axios.post("mapi/refundSetting",data)
}
function refundDelSetting(data){   
  return axios.get("mapi/refundDelSetting",data)
}
function refundAddSetting(data){   
  return axios.post("mapi/refundAddSetting",data)
}
function refundUpdateSetting(data){   
  return axios.get("mapi/refundUpdateSetting",data)
}
function refundUpdateSetting_(data){   
  return axios.post("mapi/refundUpdateSetting",data)
}
// 收款
function edit_2(data){  //POS收款编辑
  return axios.get("mapi/edit_2",data)
}
// -----------------------------------系统设置=>基本设置-------------------------------------------------
function getweiSetting(data){   
  return axios.get("mapi/weiSetting",data)
}
function getweiSettings(data){   
  return axios.post("mapi/weiSetting",data)
}
//
// -----------------------------------系统设置=>通用设置-------------------------------------------------
function geweiCommonSetting(data){   
  return axios.get("mapi/weiCommonSetting ",data)
}
function geweiCommonSettings(data){   
  return axios.post("mapi/weiCommonSetting ",data)
}
// -----------------------------------系统设置=>分享设置-------------------------------------------------

function geweishareSetting(data){   
  return axios.get("mapi/shareSetting",data)
}
function geweishareSettings(data){   
  return axios.post("mapi/shareSetting",data)
}
// -----------------------------------系统设置=>热门推荐-------------------------------------------------
function geweirecommendSetting(data){   
  return axios.post("mapi/recommendSetting",data)
}
function geweirecommendAddSetting(data){   
  return axios.post("mapi/recommendAddSetting",data)
}
function geweirecommendUpdateSetting(data){   
  return axios.get("mapi/recommendUpdateSetting",data)
}
function geweirecommendUpdateSettings(data){   
  return axios.post("mapi/recommendUpdateSetting",data)
}
function geweirecommendDelSetting(data){   
  return axios.get("mapi/recommendDelSetting",data)
}
function geweirecommendStatusSettings(data){   
  return axios.get("mapi/recommendStatusSetting",data)
}
// -----------------------------------系统设置=>广告管理-------------------------------------------------

function getweiAdvertisingSetting(data){   
  return axios.get("mapi/weiAdvertisingSetting",data)
}
function getweiAdvertisingAddSetting(data){   
  return axios.post("mapi/weiAdvertisingAddSetting",data)
}
function getweiAdvertisingUpdateSetting(data){   
  return axios.get("mapi/weiAdvertisingUpdateSetting",data)
}
function getweiAdvertisingUpdateSettings(data){   
  return axios.post("mapi/weiAdvertisingUpdateSetting",data)
}
function getweiAdvertisingDelSetting(data){   
  return axios.get("mapi/weiAdvertisingDelSetting",data)
}
function getweiAdvertisingStatusSetting(data){   
  return axios.get("mapi/weiAdvertisingStatusSetting",data)
}
// -----------------------------------系统设置=>导航自定义-------------------------------------------------

function getweiNavigationSetting(data){   
  return axios.get("mapi/weiNavigationSetting",data)
}
function getweiNavigationAddSetting(data){   
  return axios.get("mapi/weiNavigationAddSetting",data)
}
function getweiNavigationAddSettings(data){   
  return axios.post("mapi/weiNavigationAddSetting",data)
}
function getweiNavigationUpdateSetting(data){   
  return axios.get("mapi/weiNavigationUpdateSetting",data)
}
function getweiNavigationUpdateSettings(data){   
  return axios.post("mapi/weiNavigationUpdateSetting",data)
}
function getweiNavigationDelSetting(data){   
  return axios.get("mapi/weiNavigationDelSetting",data)
}
function getweiNavigationStatusSetting(data){   
  return axios.get("mapi/weiNavigationStatusSetting",data)
}
// -----------------------------------会员统计=>线上统计-------------------------------------------------

function getweiCount(data){   
  return axios.post("mapi/weiCount",data)
}

// test//
function test(data){   
  return axios.get("mapi/employee/index/type=1&page=1",data)
}
//--------------会员卡统计---------------
//收银统计  mapi/downCollectCount
function getCashier(data){   
  return axios.post("mapi/downCollectCount",data)
}
// 门店统计
function getStores(data){   
  return axios.post("mapi/downShopCount",data)
}
//营销中心
function getSelGoods(data){//编辑商品列表查询
  return axios.post("mapi/weiGoodsList",data)
}
function getGoodsList_(data){//编辑商品列表查询
  return axios.post("mapi/limitShopList",data)
}
function activeList(data){ // 活动列表
  return axios.post("mapi/limitStore",data)
}
function activeDel(data){ // 删除
  return axios.post("mapi/limitStoreDel",data)
}
function activeStatus(data){ // 状态修改
  return axios.post("mapi/weiGoodsList",data)
}
function limitStoreAdd(data){ // 商城限时折扣新增
  return axios.post("mapi/limitStoreAdd",data)
}
function limitStoreDetail(data){ // 商城限时折扣查询
  return axios.post("mapi/limitStoreDetail",data)
}
function limitStoreUpdate_(data){ // 商城限时折扣修改
  return axios.post("mapi/limitStoreUpdate",data)
}
function limitProductUpdate(data){ //商品或分类修改
  return axios.post("mapi/limitProductUpdate",data)
} 
function limitStoreState(data){ // 状态修改
  return axios.post("mapi/limitStoreState",data)
}
// 门店限时商品
function limitShop (data){  
  return axios.post("mapi/limitShop",data)
}
function limitShopDetail (data){  
  return axios.post("mapi/limitShopDetail",data)
}
function limitShopAdd (data){  
  return axios.post("mapi/limitShopAdd",data)
}
//    
// mapi/editCustom
// 
// mapi/setwechat
//暴露出去模块
export default {
  getorder,
  getmenu,
  getmenuaside,
  getcate,
  getcateType,
  getaddCateOnee,
  getaddCateTwo,
  getupdateCate,
  getupdateCates,
  getcateDel,
  getGoodsList,
  getweiUpStatus,
  getweiAllStatus,
  getweiDel,
  getweiAllDel,
  getweiRecommend,
  getweiAllRecommend,
  getaddWeiGoods,
  getgoodsLists,
  getweiGoodsSubmit,
  getaddWeiGood,
  getweiOrder,
  getgoodsSeckill,
  getsubGoods,
  getwxsubGoods,
  getupdateWeiGoods,
  getupdatewxGoods,
  getwxlist,
  getwxgoodsTuanList,
  getwxgoodsTuanSub,
  getwxaddTuan,
  getwxupdateTuan,
  getwxupdateTuans,
  getwxdelTuan,
  getwxseckillList,
  getwxupdateSeckill,
  getwxsubmitSeckill,
  getweiOrderDetail,
  getwxcoupon,
  getwxcouponAdd,
  getwxcouponDetail,
  getwxgiveUpdate,
  getwxcouponState,
  getwxgiveAdd,
  getwxgiveSearch,
  getwxgiveUpdates,
  getwxcouponDetailview,
  getwxgoodsScoreList,
  getwxgoodsScoreSub,
  getwxaddScore,
  getwxaddScores,
  getwxlistScore,
  getwxupdateScore,
  getwxupdateScores,
  getwxdelScore,
  getwxforsaleScoreGoods,
  getwxforsaleSeckill,
  forsaleTuan,
  getwxhotSeckill,
  getwxmhotTuan,
  getweiAttribute,
  getweiAttributeAdd,
  getweiAttributeUpdate,
  getweiAttributeUpdates,
  getweiAttributeDel,
  getweiComment,
  getweiCommentState,
  getweiCommentDel,
  getwxmanage,
  getMemberupdetailSearch,
  getMemberupdetailUpdate,
  getMemberupmemberDel,
  getMemberupLabelSearch,
  getMemberupLabel,
  getMemberupaddressSearch,
  getMemberupaddressAdd,
  getMemberupAddressDetail,
  getMemberupaddressUpdate,
  getMemberupLabelSearchss,
  getMemberupLabelAdd,
  getMemberupMoneyList,
  getMemberupScoreList,
  gettuanOrder,
  gettuanOrderDetailDetail,
  gettuanOrderDetail,
  getsetwechat,
  getsetwechats,
  getcustom,
  getcustomState,
  getaddSonCustom,
  getreplyList,
  getaddKeyword,
  getSource,
  // getaddKeywords,
  getaddsetCustom,
  getaddCustom,
  geteditCustom,
  geteviewCustom,
  getdelCustom,
  geteviewdev,
  getSources,
  getaddSource,
  getsubmitSource,
  getdev,
  getswithdev,
  getaddDev,
  getdelDev,
  getpostKeyword,
  getswithreplyList,
  geteditKeyword,
  geteditKeywords,
  getdelKeyword,
  geteditSource,
  getposteditSource,
  getdelSource,
  geteditDev,
  gettemplatev,
  geteditTemplate,
  getgetTemplate,
  getaddLineshop,
  getpostLineshop,
  getlineshop,
  getupdateLineshop,
  getupdateLineshops,
  getexpressageLineshop,
  getpickLineshop,
  getstatusLineshop,
  gettimeLineshop,
  gettimeLineshops,
  merchantEdit,
  getMerchant,
  merchantsearch,
  getMerchantList,
  getshoplist,
  shopsearch,
  shopstatus,
  getwarehouse,
  warehousesearch,
  warehousedel,
  warehouselook,
  rules,
  rulesAdd,
  rulesEdit,
  rulesDel,
  machineList,
  machineEdit,
  getShop,
  storeManagementList,
  storeManagementEdit,
  storeManagementUpdate,
  changeType,
  storeManagementAdd,
  getCarouselList,
  getCarouselStatus,
  getCarouselDel,
  getCommom,
  commomEdit,
  getMesaage,
  carouselAddSetting,
  carouselUp,
  carouselUpStting,
  advertisingAddSetting,
  advertisingAddSettingAdd,
  advertisingSetting,
  advertisingStatusSetting,
  advertisingDelSetting,
  advertisingUpdateSetting,
  advertisingUpdateSetting_,
  edit_2,
  refundSetting,
  refundDelSetting,
  refundAddSetting,
  refundUpdateSetting,
  refundUpdateSetting_,
  getweiSetting,
  getweiSettings,
  geweiCommonSetting,
  geweiCommonSettings,
  geweishareSetting,
  geweishareSettings,
  geweirecommendSetting,
  geweirecommendAddSetting,
  geweirecommendUpdateSetting,
  geweirecommendUpdateSettings,
  geweirecommendDelSetting,
  geweirecommendStatusSettings,
  getweiAdvertisingSetting,
  getweiAdvertisingAddSetting,
  getweiAdvertisingUpdateSetting,
  getweiAdvertisingUpdateSettings,
  getweiAdvertisingDelSetting,
  getweiAdvertisingStatusSetting,
  getweiNavigationSetting,
  getweiNavigationAddSetting,
  getweiNavigationAddSettings,
  getweiNavigationUpdateSetting,
  getweiNavigationUpdateSettings,
  getweiNavigationDelSetting,
  getweiNavigationStatusSetting,
  getweiCount,
  test,
  getStores,
  getCashier,
   // 营销中心
   activeList,
   activeStatus,
   activeDel,
   getSelGoods,
   limitStoreAdd,
   limitStoreUpdate_,
   limitProductUpdate,
   getGoodsList_,
   limitStoreState,
   limitStoreDetail,
   limitShop,
   limitShopDetail,
   limitShopAdd


}

// 这个js是所有的select.js文件

// 这个是选择时间数组
export let selectTime=[{
    value: 1,
    label: "今天"
  },{
    value: 2,
    label: "昨天"
  },{
    value: 3,
    label: "本周"
  },{
    value:4,
    label: "上周"
  },{
    value: 5,
    label: "本月"
  },{
    value: 6,
    label: "上月"
  },{
    value: 7,
    label: "本季"
  },{
    value: 8,
    label: "上季"
  },{
    value: 9,
    label: "今年"
  },{
    value: 10,
    label: "自定义"
  }]

//------------------------------------------------营销中心=>营销玩法=>拼团列表----------------------------------------
export let tuan={
  selectForsale:[{name:"上架",id:1},{name:"下架",id:0}],
  selectType:[{name:"分享团",id:1},{name:"定制团",id:2},{name:"阶梯团",id:3}],
  selectId:[{name:"商品ID",id:1},{name:"商品名称",id:2}]
}
// 添加拼团下拉菜单
export let tuanlist={
  selectForsale:[{name:"分享团",id:1},{name:"定制团 ",id:2},{name:"阶梯团",id:3}],
  goodsOptions: [
    {
      value: 1,
      label: "商品id"
    },
    {
      value: 2,
      label: "商品名称"
    },
    {
      value: 3,
      label: "商品编号"
    }
  ],
  optionsinventory_state: [
    {
      name: "真实库存",
      id: 1
    },
    {
      name: "虚拟库存",
      id: 0
    }
  ],
  commission_state: [
    {
      name: "按金额",
      id: 1
    },
    {
      name: "百分比",
      id: 0
    }
  ]
           
}
// 添加优惠券下拉菜单
export let coupons={
  type:[
    {
      name: "代金券",
      id: 1
    },
    {
      name: "折扣券",
      id: 2
    }
    ,
    {
      name: "免单券",
      id: 3
    }
  ],
  state:[ {
    name: "上架",
    id: 1
  }, {
    name: "下架",
    id: 2
  },],
  name:[{
    name: "优惠券名称",
    id: 1
  },{
    name: "优惠券面值",
    id:2
  },]
}     
//------------------------------------------------营销中心=>营销玩法=>积分商城----------------------------------------
export let scoregoods={
  type:[
    {
      name: "商品id",
      id: 1
    },
    {
      name: "商品名称",
      id: 2
    }
   
  ]
}
export let  attributetemplate={
  type:[
    {
      name: "商品名称",
      id: 1
    },
    {
      name: "模板Id",
      id: 2
    }
   
  ],
  memberManagement:[
    {
      name: "会员id",
      type:1
    },
    {
      name: "手机号",
      type: 2
    },
    {
      name: "会员名",
      type:3
    },
    {
      name: "真实姓名",
      type:4
    }
   
  ]


}
export let  memberBalanceRecord={ 
  dateList: [{
  value: 1,
  label: '今天'
}, {
  value: 2,
  label: '昨天'
}, {
  value: 3,
  label: '本周'
}, {
  value: 4,
  label: '上周'
}, {
  value: 5,
  label: '本月'
}, {
  value: 6,
  label: '上月'
}, {
  value: 7,
  label: '本季'
}, {
  value: 8,
  label: '上季'
}, {
  value: 9,
  label: '今年'
}, {
  value: 10,
  label: '自定义'
}],
type: [{
  value: 1,
  label: '充值'
}, {
  value: 2,
  label: '消费'
},],
member_type: [{
  value: 1,
  label: '会员id'
}, {
  value: 2,
  label: '订单号'
},],
types:[{
  value: 1,
  label: '购买送积分'
}, {
  value: 2,
  label: '积分抵现'
}, {
  value: 3,
  label: '退款返积分'
}, {
  value: 4,
  label: '退款退积分'
}, {
  value: 5,
  label: '管理调整'
}, {
  value: 6,
  label: '积分消费'
}],
// 1团购id 2手机号 3商品编号 4商品名 5会员名
sou_id:[{
  value: 1,
  label: '团购id'
}, {
  value: 2,
  label: '手机号'
}, {
  value: 3,
  label: '商品编号'
}, {
  value: 4,
  label: '商品名'
}, {
  value: 5,
  label: '会员名'
}]
// 1购买送积分 2积分抵现 3退款返积分 4退款退积分 5管理调整 6积分消费
} 

export let  orderList={
  dateList: [{
    value: 1,
    label: '今天'
  }, {
    value: 2,
    label: '昨天'
  }, {
    value: 3,
    label: '本周'
  }, {
    value: 4,
    label: '上周'
  }, {
    value: 5,
    label: '本月'
  }, {
    value: 6,
    label: '上月'
  }, {
    value: 7,
    label: '本季'
  }, {
    value: 8,
    label: '上季'
  }, {
    value: 9,
    label: '今年'
  }, {
    value: 10,
    label: '自定义'
  }],
  shop_id:[
    {
      value: 0,
      label: '付款'
    },
    {
      value: 1,
      label: '退款单'
    }
  ],
  type:[
    {
      value: 0,
      label: '会员充值'
    },
    {
      value: 1,
      label: '普通商品'
    },
    {
      value: 2,
      label: '秒杀商品'
    },
    {
      value: 3,
      label: '团购商品'
    }
  ],
  state:[
    {
      value: 0,
      label: '未付款'
    },
    {
      value: 1,
      label: '已付款'
    },
    {
      value: 2,
      label: '已退款'
    },
    {
      value: 3,
      label: '积分'
    }
  ],
  pay_type:[
    {
      value: 1,
      label: '微信支付'
    },
    {
      value: 2,
      label: '余额(会员)'
    },
    {
      value: 3,
      label: '积分'
    }
  ],
  receive_state:[
    {
      value: 1,
      label: '未配货'
    },
    {
      value: 2,
      label: '已配货'
    }
  ],
  sou_id:[{
    value: 1,
    label: '订单号查询'
  },
  {
    value: 2,
    label: '订单id'
  },
  {
    value: 3,
    label: '手机号'
  },
  {
    value: 4,
    label: '姓名'
  }],
  send_type:[{
    value: 1,
    label: '配送'
  },
  {
    value: 2,
    label: '自提'
  },
 ],
}

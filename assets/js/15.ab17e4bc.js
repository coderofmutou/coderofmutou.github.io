(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{329:function(v,_,O){v.exports=O.p+"assets/img/v2-24e3ed681c02b6434681719753c53b40_r.5835b05b.jpg"},729:function(v,_,O){"use strict";O.r(_);var t=O(8),o=Object(t.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"pojo-中的-dto、vo、bo、po、do"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#pojo-中的-dto、vo、bo、po、do"}},[v._v("#")]),v._v(" POJO 中的 DTO、VO、BO、PO、DO")]),v._v(" "),_("h2",{attrs:{id:"架构图"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#架构图"}},[v._v("#")]),v._v(" 架构图")]),v._v(" "),_("p",[_("img",{attrs:{src:O(329),alt:"v2-24e3ed681c02b6434681719753c53b40_r"}})]),v._v(" "),_("h2",{attrs:{id:"vo、bo、-po、-dto、do-的定义与区别"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#vo、bo、-po、-dto、do-的定义与区别"}},[v._v("#")]),v._v(" VO、BO、 PO、 DTO、DO 的定义与区别")]),v._v(" "),_("p",[v._v("POJO 的定义是无规则简单的对象，在日常的代码分层中 pojo 会被分为 VO、BO、 PO、 DTO。")]),v._v(" "),_("p",[_("strong",[v._v("数据的流转角度")]),v._v("：前端 --\x3e VO --\x3e DTO --\x3e BO --\x3e DAO --\x3e 数据库")]),v._v(" "),_("p",[_("strong",[v._v("VO(View Object/Value Oobject)表示层对象")])]),v._v(" "),_("ol",[_("li",[v._v("前端展示的数据，在接口数据返回给前端的时候需要转成 VO。")]),v._v(" "),_("li",[v._v("VO 主要的存在形式就是 js 里面的对象（也可以简单理解成 json）。")]),v._v(" "),_("li",[v._v("使用场景：接口层服务中，将 DTO 转成 VO，返回给前端。")]),v._v(" "),_("li",[_("strong",[v._v("注")]),v._v("：在展示业务不复杂的系统，可直接使用 DTO。")])]),v._v(" "),_("p",[_("strong",[v._v("DTO(Data Transfer Object)数据传输对象")])]),v._v(" "),_("ol",[_("li",[v._v("表示一个数据传输对象，通常用于不同服务或服务不同分层之间的数据传输。，")]),v._v(" "),_("li",[v._v("DTO 与 VO 与类似，但也有一些不同，这个不同主要是设计理念上的，比如 API 服务需要使用的是 DTO，而用于展示层页面的使用的是 VO。")]),v._v(" "),_("li",[v._v("它存在两种形式：\n"),_("ol",[_("li",[v._v("在后端，它的存在形式是请求的入参，也就是在 controller 里面定义的参数。")]),v._v(" "),_("li",[v._v("在前端，它的存在形式通常是 js 里面的对象（也可以简单理解成 json），也就是通过 ajax 请求的那个数据体。")])])]),v._v(" "),_("li",[v._v("服务和服务之间调用的传输对象能叫 DTO 吗？\n"),_("ol",[_("li",[v._v("DTO 本身的一个隐含的意义是要能够完整的表达一个业务模块的输出。")]),v._v(" "),_("li",[v._v("如果服务和服务之间相对独立，那就可以叫 DTO。")]),v._v(" "),_("li",[v._v("如果服务和服务之间不独立，每个都不是一个完整的业务模块，拆开可能仅仅是因为计算复杂度或者性能的问题，那这就不能够叫做 DTO，只能是 BO。")])])])]),v._v(" "),_("p",[_("strong",[v._v("BO(Bussines Object)业务层对象")])]),v._v(" "),_("ol",[_("li",[v._v("主要在服务内部使用的业务对象。")]),v._v(" "),_("li",[v._v("是 PO 的组合，可以包含多个对象，可以用于对象的聚合操作。")]),v._v(" "),_("li",[v._v("使用场景：在服务层服务中，由 DTO 转成 BO 然后进行业务处理后，转成 DTO 返回到接口层。")])]),v._v(" "),_("p",[_("strong",[v._v("PO(Persistent Object)持久对象")])]),v._v(" "),_("ol",[_("li",[v._v("数据库记录，用来存储数据库提取的记录，等同于常说的 Entity。")]),v._v(" "),_("li",[v._v("只存储数据，不包含数据操作，除了 get，set 之外没有别的方法。")]),v._v(" "),_("li",[v._v("PO 的属性是跟数据库表的字段一一对应的。")]),v._v(" "),_("li",[v._v("PO 对象需要实现序列化接口。")]),v._v(" "),_("li",[v._v("数量是相对固定的，一定不会超过数据库表的数量。")]),v._v(" "),_("li",[v._v("使用场景：在数据库层中，获取的数据库数据存储到 PO 中，然后转为 DTO 返回到服务层中。")])]),v._v(" "),_("p",[_("strong",[v._v("DO(Domain Object)领域实体对象")])]),v._v(" "),_("p",[v._v("DO 现在主要有两个版本：")]),v._v(" "),_("ol",[_("li",[v._v("阿里巴巴的开发手册中的定义，DO( Data Object)这个等同于上面的 PO")]),v._v(" "),_("li",[v._v("DDD(Domain-Driven Design)领域驱动设计中，DO(Domain Object)这个等同于上面的 BO")])]),v._v(" "),_("p",[_("strong",[v._v("VO 和 DTO 的区别")])]),v._v(" "),_("ol",[_("li",[v._v("字段不一样，VO 根据需要会删减一些字段。")]),v._v(" "),_("li",[v._v("值不一样，VO 会根据需要对 DTO 中的值进行展示业务的解释。")])]),v._v(" "),_("p",[_("strong",[v._v("BO 和 DTO 的区别")])]),v._v(" "),_("ol",[_("li",[v._v("主要是就是字段的删减。")]),v._v(" "),_("li",[v._v("BO 对内，为了进行业务计算需要辅助数据，或者是一个业务有多个对外的接口，BO 可能会含有很多接口对外所不需要的数据，因此 DTO 需要在 BO 的基础上，只要自己需要的数据，然后对外提供。")]),v._v(" "),_("li",[v._v("在这个关系上，DTO 通常不会有数据内容的变化，内容变化要么在 BO 内部业务计算的时候完成，要么在解释 VO 的时候完成。")])]),v._v(" "),_("h2",{attrs:{id:"实际应用建议"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#实际应用建议"}},[v._v("#")]),v._v(" 实际应用建议")]),v._v(" "),_("ol",[_("li",[v._v("系统和系统的复杂度不同，协作水平不同，完全没有必要教条主义。")]),v._v(" "),_("li",[v._v("PO 必须有，不管叫 PO 还是 Entity。")]),v._v(" "),_("li",[v._v("一些工具类的系统和一些业务不是很复杂的系统 DTO 是可以和 BO 合并成一个，当业务扩展的时候注意拆分就行。")]),v._v(" "),_("li",[v._v("VO 是可以优化掉的，展示业务不复杂的可以不要 VO，直接用 DTO。")])])])}),[],!1,null,null,null);_.default=o.exports}}]);
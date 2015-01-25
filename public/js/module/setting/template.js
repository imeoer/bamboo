define([], function() {return {"page":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "\n\n<article class=\"page-setting\">\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">账户名称</span>\n            <span class=\"sub\">WEBSITE</span>\n        </div>\n        <div class=\"content content-padding\">\n            <div class=\"input-wrap\">\n                <input id=\"name\" placeholder=\"将作为纸小墨主页URL地址\" value=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <div id=\"name_confirm\" class=\"confirm\">确认</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">电子邮箱</span>\n            <span class=\"sub\">EMAIL</span>\n        </div>\n        <div class=\"content content-padding\">\n            <div class=\"input-wrap\">\n                <input id=\"mail\" placeholder=\"填写电子邮箱地址\" value=\"";
  if (helper = helpers.mail) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.mail); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <div id=\"mail_confirm\" class=\"confirm\">确认</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">基本信息</span>\n            <span class=\"sub\">BASIC</span>\n        </div>\n        <div class=\"content content-padding\">\n            <div class=\"avatar\">\n                <input id=\"avatar\" type=\"file\" multiple=\"multiple\">\n                <img class=\"preview\" src=\"";
  if (helper = helpers.avatar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avatar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n            </div>\n            <!-- <div class=\"avatar\"></div> -->\n            <div class=\"info\">\n                <input id=\"nick\" class=\"nick\" placeholder=\"昵称\" value=\"";
  if (helper = helpers.nick) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nick); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <!-- <div class=\"motto contenteditable\" contenteditable></div> -->\n            </div>\n        </div>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">个人简序</span>\n            <span class=\"sub\">PERSON</span>\n        </div>\n        <textarea id=\"motto\" class=\"content motto\" placeholder=\"+ 编辑个人简介\">";
  if (helper = helpers.motto) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.motto); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">社交账户</span>\n            <span class=\"sub\">SOCIAL</span>\n        </div>\n        <div class=\"content content-padding\">\n            <!-- <div class=\"social-list\">\n                <span class=\"type\">个人网站</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type\">微博</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type douban\">豆瓣</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type\">知乎</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type\">Github</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type\">Dribbble</span>\n                <span class=\"split\"> / </span>\n                <span class=\"type\">Pixiv</span>\n            </div> -->\n            <div class=\"input-wrap\">\n                <input id=\"link\" placeholder=\"个人网站 / 微博 / 豆瓣 / 知乎 / Github / Dribbble / Pixiv\" value=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <div id=\"link_confirm\" class=\"confirm\">确认</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">密码设置</span>\n            <span class=\"sub\">PASSWORD</span>\n        </div>\n        <div class=\"content content-padding\">\n            <div class=\"input-wrap password\">\n                <span class=\"input-split\">/</span><input id=\"cur_pass\" type=\"password\" placeholder=\"当前密码\" />\n                <span class=\"input-split\">/</span><input id=\"new_pass\" type=\"password\" placeholder=\"新密码\" />\n                <span class=\"input-split\">/</span><input id=\"rep_pass\" type=\"password\" placeholder=\"新密码确认\" />\n                <div id=\"pass_confirm\" class=\"confirm\">确认</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"setting-group\">\n        <div class=\"head\">\n            <span class=\"main\">销毁账户</span>\n            <span class=\"sub\">ACCOUNT</span>\n        </div>\n        <div class=\"content preface\">删除所有文章后方可销毁该账户</div>\n    </div>\n</article>\n";
  return buffer;
  }),
}});;
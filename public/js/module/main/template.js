define([], function() {return {"page":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "<a class=\"home-link\" href=\"/#main\"></a>";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"left\">\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.registered), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <div class=\"wrap\">\n        <div class=\"avatar\" style=\"background-image:url("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ");\"></div>\n        <div class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        <ul class=\"info-list\">\n            <li class=\"info-item\">\n                <span class=\"count\">";
  if (helper = helpers.article) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.article); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                <span class=\"name\">文章</span>\n                <span aria-hidden=\"true\" class=\"icon icon-book-open\"></span>\n            </li>\n            <li class=\"info-item\">\n                <span class=\"count\">";
  if (helper = helpers.favarite) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.favarite); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n                <span class=\"name\">收藏</span>\n                <span aria-hidden=\"true\" class=\"icon icon-drawer\"></span>\n            </li>\n            <li class=\"info-item\">\n                <span class=\"count\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.circle)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n                <span class=\"name\">圈子</span>\n                <span aria-hidden=\"true\" class=\"icon icon-badge\"></span>\n            </li>\n            <li class=\"info-item\">\n                <span class=\"count\">0</span>\n                <span class=\"name\">阅读</span>\n                <span aria-hidden=\"true\" class=\"icon icon-speech\"></span>\n            </li>\n            <li class=\"info-item\">\n                <span class=\"count\">0</span>\n                <span class=\"name\">文字</span>\n                <span aria-hidden=\"true\" class=\"icon icon-list\"></span>\n            </li>\n        </ul>\n        <a class=\"write\" href=\"/#edit/new\"><span aria-hidden=\"true\" class=\"icon icon-book-open\"></span>撰写文章</a>\n        <!-- <ul class=\"menu\">\n            <li class=\"menu-item\">\n                <span aria-hidden=\"true\" class=\"icon icon-bubbles\"></span>\n                <span class=\"name\">关注动态</span>\n            </li>\n            <li class=\"menu-item\">\n                <span aria-hidden=\"true\" class=\"icon icon-layers\"></span>\n                <span class=\"name\">发现兴趣</span>\n            </li>\n            <li class=\"menu-item recommend\">\n                <span aria-hidden=\"true\" class=\"icon icon-badge\"></span>\n                <span class=\"name\">随机推荐</span>\n            </li>\n        </ul> -->\n    </div>\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.registered), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return "\n    <div class=\"tool\">\n        <div class=\"item\" data-id=\"main\">\n            <i class=\"icon-bubbles\"></i>\n            <span class=\"name\">动态</span>\n        </div>\n        <div class=\"item\" data-id=\"private\">\n            <i class=\"icon-clock\"></i>\n            <span class=\"name\">私有</span>\n            <span class=\"count\">(12)</span>\n        </div>\n        <div class=\"item\" data-id=\"public\">\n            <i class=\"icon-book-open\"></i>\n            <span class=\"name\">公开</span>\n            <span class=\"count\">(34)</span>\n        </div>\n        <div class=\"item\" data-id=\"favarite\">\n            <i class=\"icon-drawer\"></i>\n            <span class=\"name\">收藏</span>\n        </div>\n        <div class=\"item\" data-id=\"setting\">\n            <i class=\"icon-settings\"></i>\n            <span class=\"name\">设置</span>\n        </div>\n        <div class=\"item\" data-id=\"circle\">\n            <i class=\"icon-badge\"></i>\n            <span class=\"name\">圈子</span>\n            <span class=\"count\">(34)</span>\n        </div>\n    </div>\n    ";
  }

function program9(depth0,data) {
  
  
  return "\n    <div class=\"intro\">完善您的账户信息</div>\n    ";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"user\">\n        <img class=\"avatar\" src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n        <div class=\"author-info\">\n            <div class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n            <div class=\"motto\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.motto)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        </div>\n    </div>\n    ";
  return buffer;
  }

  buffer += "\n\n";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.master), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.master), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div class=\"right\">\n    <!-- <div class=\"title\"><span aria-hidden=\"true\" class=\"icon icon-bubbles\"></span>发现兴趣</div> -->\n    <div class=\"logo\"></div>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.master), {hash:{},inverse:self.program(11, program11, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <div class=\"main\"></div>\n</div>\n\n";
  return buffer;
  }),
"articles":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class=\"article-item\" data-id=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.thematic), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, (depth1 && depth1.editView), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        <!-- <span class=\"update-value\">45%<span class=\"update\">更新</span></span> -->\n        <div class=\"card\">\n            <a class=\"title\" href=\"/#article/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n            <a class=\"preview\" href=\"/#article/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n            <div class=\"footer\">\n                <div class=\"author\">\n                    <a class=\"user-link\" href=\"/#user/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                        <div class=\"avatar\" style=\"background-image:url("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ");\"></div>\n                        <span class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n                    </a>\n                    <span class=\"updated\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.updated)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n                    <span class=\"circle\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.circle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n                </div>\n                <div class=\"detail\">\n                    <span class=\"item\"><span aria-hidden=\"true\" class=\"icon icon-book-open\"></span>";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.read), {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n                    <span class=\"item\"><span aria-hidden=\"true\" class=\"icon icon-heart\"></span>";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.like), {hash:{},inverse:self.program(8, program8, data),fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>\n                </div>\n            </div>\n        </div>\n    </li>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<a href=\"/#article/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"thematic\" style=\"background-image: url("
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.thematic)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ");\"></a>";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <ul class=\"tool\">\n            <li class=\"edit\"><a href=\"/#edit/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><i class=\"icon-note\"></a></i></li>\n            <li class=\"remove\"><i class=\"icon-trash\"></i></li>\n        </ul>\n        ";
  return buffer;
  }

function program6(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.read)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program8(depth0,data) {
  
  
  return "0";
  }

function program10(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.like)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

  buffer += "\n\n<ul class=\"article-list\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.articles), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n";
  return buffer;
  }),
"nocontent":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\n\n<div class=\"nocontent\">\n    <span aria-hidden=\"true\" class=\"icon icon-drawer\"></span>\n    <div>尚无内容</div>\n    <div class=\"tip\">阅读「纸小墨」指导</div>\n</div>\n";
  }),
}});;
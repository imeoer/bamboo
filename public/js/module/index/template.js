define([], function() {return {"page":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"author\">\n        <img class=\"avatar\" src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n        <div class=\"author-info\">\n            <div class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n            <div class=\"mail\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.mail)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        </div>\n    </div>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "hide";
  }

  buffer += "\n\n<div class=\"header\">\n    <div class=\"logo\"></div>\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.user), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <div class=\"form\">\n        <button class=\"submit\"></button>\n        <div class=\"login ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.user), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n            <div class=\"switch\">\n                <i class=\"icon-github-circled\"></i>\n                <div class=\"btn register-btn\">注册</div>\n                <span class=\"split\">/</span>\n                <div class=\"btn login-btn active\">登录</div>\n            </div>\n            <span class=\"split\">/</span><input class=\"mail-input\" placeholder=\"电子邮箱\" spellcheck=\"false\"></input>\n            <span class=\"split\">/</span><input class=\"pass-input\" placeholder=\"登录密码\" type=\"password\"></input>\n        </div>\n    </div>\n</div>\n<div class=\"content\">\n    <div class=\"cover\">\n        <span class=\"bg-info\">Sunny Rain - Pixiv TID (国人画师)</span>\n        <div class=\"bg-nav\">\n            <i class=\"icon-btn icon-left-open\"></i>\n            <i class=\"icon-btn icon-right-open\"></i>\n        </div>\n    </div>\n</div>\n<div class=\"footer\">\n    <div class=\"footer-left\">\n        <a href=\"\">@2015 纸小墨</a>\n    </div>\n    <div class=\"footer-right\">\n        <a href=\"\">联系我们</a>\n        <a href=\"\">官方博客</a>\n        <a href=\"\">关于</a>\n    </div>\n</div>\n";
  return buffer;
  }),
}});;
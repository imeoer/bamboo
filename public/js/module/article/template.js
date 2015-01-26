define([], function() {return {"page":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "-empty";
  }

  buffer += "\n\n<a class=\"home-link\" href=\"/#main\"></a>\n<div class=\"article\">\n    <div class=\"author\">\n        <img class=\"avatar\" src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n        <div class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        <div class=\"motto\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.motto)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    </div>\n    <div class=\"title\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    <div class=\"info\">\n        <i class=\"icon-book-open\"></i>\n        <span class=\"item\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.updated)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n        <span class=\"item\">发表于"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.circle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n        <span class=\"item\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "字</span>\n        <!-- <span class=\"item\">32阅读</span> -->\n    </div>\n    <div class=\"content\">";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n</div>\n<div class=\"info fin\">\n    <i class=\"icon-book-open\"></i><span class=\"item\">结束</span>\n</div>\n<div class=\"meta\">\n    <a class=\"author\" href=\"/#user/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n        <img class=\"avatar\" src=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.avatar)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n        <div class=\"author-info\">\n            <div class=\"nick\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.nick)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n            <div class=\"motto\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.user)),stack1 == null || stack1 === false ? stack1 : stack1.motto)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n        </div>\n    </a>\n    <div class=\"tool\">\n        <i class=\"icon like icon-font-heart";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.like), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"></i>\n        <i class=\"icon favarite icon-font-star";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.favarite), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\"></i>\n    </div>\n</div>\n";
  return buffer;
  }),
}});;
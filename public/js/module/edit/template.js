define([], function() {return {"page":Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "selected";
  }

  buffer += "\n\n<div class=\"tool\">\n    <a class=\"home\" href=\"/#main\">\n        <i class=\"icon-layers\"></i><span></span>\n    </a>\n    <div class=\"publish btn\">\n        <i class=\"icon-book-open\"></i><span>发布</span>\n    </div>\n    <div class=\"type\">\n        <span class=\"private ";
  stack1 = helpers.unless.call(depth0, ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1['public']), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-id=\"private\">私有</span>\n        <span class=\"public ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1['public']), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" data-id=\"public\">公开</span>\n    </div>\n</div>\n<div class=\"article\">\n    <div class=\"title contenteditable\" contenteditable tabindex=\"1\">"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    <div class=\"info\">\n        <input placeholder=\"选择圈子\" class=\"circle-select\" value=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.circle)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" />\n    </div>\n    <ul class=\"edit-view\">\n        <li class=\"visual active\"><i class=\"icon-book-open\"></i></li>\n        <li class=\"markdown\"><i class=\"icon-pencil\"></i></li>\n    </ul>\n    <div class=\"content visual contenteditable\" contenteditable placeholder=\"\">";
  stack1 = ((stack1 = ((stack1 = (depth0 && depth0.article)),stack1 == null || stack1 === false ? stack1 : stack1.content)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n    <div class=\"content markdown\" placeholder=\"Markdown格式编辑\"></div>\n</div>\n<div class=\"toolbar\">+\n    <ul class=\"type-list\">\n        <li class=\"type image\">\n            <i class=\"icon-picture\"></i>\n            <input class=\"image-upload\" type=\"file\" name=\"files[]\" multiple=\"multiple\" title=\"Click to add Files\">\n            <div class=\"input-wrap\"><input class=\"link image-link\" placeholder=\"单击上传图片或输入图片链接\"></input></div>\n        </li>\n        <li class=\"type music\">\n            <i class=\"icon-music-tone-alt\"></i>\n            <div class=\"input-wrap\"><input class=\"link music-link\" placeholder=\"现支持网易云音乐链接\"></input></div>\n        </li>\n        <li class=\"type vedio\">\n            <i class=\"icon-social-youtube\"></i>\n            <div class=\"input-wrap\"><input class=\"link vedio-link\" placeholder=\"现支持Youtube，Vimeo视频链接\"></input></div>\n        </li>\n        <!-- <li class=\"type code\">\n            <i class=\"code-icon\">&lt;/&gt;</i>\n        </li> -->\n    </ul>\n</div>\n";
  return buffer;
  }),
}});;
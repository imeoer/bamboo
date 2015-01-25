(function() {
  define([], function() {
    var AppModel;
    AppModel = Backbone.Model.extend({
      initialize: function() {},
      mdConvert: new Markdown.Converter(),
      notify: function(info) {
        var $notify;
        $notify = $('#notify');
        if (this.notifyTimer) {
          clearTimeout(this.notifyTimer);
        }
        $notify.text(info).css('margin-left', -($notify.width() / 2) - 27).addClass('show');
        return this.notifyTimer = setTimeout(function() {
          return $notify.removeClass('show');
        }, 2000);
      },
      baseURL: "http://" + location.hostname + ":8888",
      circles: [
        {
          name: "电影",
          desc: "光影魅力，影评推荐",
          icon: "film"
        }, {
          name: "音乐",
          desc: "光影魅力，影评推荐",
          icon: "music-tone-alt"
        }, {
          name: "二次元",
          desc: "光影魅力，影评推荐",
          icon: "ghost"
        }, {
          name: "摄影",
          desc: "光影魅力，影评推荐",
          icon: "camera"
        }, {
          name: "旅行",
          desc: "光影魅力，影评推荐",
          icon: "pointer"
        }, {
          name: "产品",
          desc: "光影魅力，影评推荐",
          icon: "rocket"
        }, {
          name: "想法",
          desc: "光影魅力，影评推荐",
          icon: "bulb"
        }, {
          name: "游戏",
          desc: "光影魅力，影评推荐",
          icon: "game-controller"
        }, {
          name: "绘画",
          desc: "光影魅力，影评推荐",
          icon: "pencil"
        }, {
          name: "程序",
          desc: "光影魅力，影评推荐",
          icon: "screen-desktop"
        }, {
          name: "阅读",
          desc: "光影魅力，影评推荐",
          icon: "eyeglasses"
        }, {
          name: "设计",
          desc: "光影魅力，影评推荐",
          icon: "layers"
        }, {
          name: "美食",
          desc: "光影魅力，影评推荐",
          icon: "cup"
        }, {
          name: "生活",
          desc: "光影魅力，影评推荐",
          icon: "handbag"
        }
      ],
      user: {
        login: function(data) {
          return AppModel.apiRequest('POST', '/user/login', ['mail', 'pass'], data);
        },
        register: function(data) {
          return AppModel.apiRequest('POST', '/user/register', ['mail', 'pass'], data);
        },
        config: function(data) {
          return AppModel.apiRequest('POST', '/user/config', ['key', 'value'], data);
        },
        info: function() {
          return AppModel.apiRequest('POST', '/user/info', []);
        },
        timeline: function() {
          return AppModel.apiRequest('POST', '/user/timeline', []);
        },
        page: function(data) {
          return AppModel.apiRequest('POST', '/user/page', ['name'], data);
        }
      },
      article: {
        update: function(data) {
          return AppModel.apiRequest('POST', '/article/update', ['articleId', 'title', 'content', 'circles', 'public'], data);
        },
        list: function(data) {
          return AppModel.apiRequest('POST', '/article/list', ['filter'], data);
        },
        remove: function(data) {
          return AppModel.apiRequest('POST', '/article/remove', ['articleId'], data);
        },
        get: function(data) {
          return AppModel.apiRequest('POST', '/article/get', ['articleId'], data);
        },
        like: function(data) {
          return AppModel.apiRequest('POST', '/article/like', ['articleId', 'like'], data);
        },
        favarite: function(data) {
          return AppModel.apiRequest('POST', '/article/favarite', ['articleId', 'favarite'], data);
        }
      },
      circle: {
        focus: function(data) {
          return AppModel.apiRequest('POST', '/circle/focus', ['circle', 'focus'], data);
        }
      }
    }, {
      apiRequest: function(type, method, define, data) {
        var deferred, returnDeferred, token;
        token = $.localStorage('token');
        deferred = $.ajax({
          type: type,
          url: "" + App.baseURL + method,
          dataType: 'json',
          jsonp: false,
          data: JSON.stringify(_.pick(data || {}, define)),
          crossDomain: true,
          headers: {
            Token: "" + token
          }
        });
        returnDeferred = $.Deferred();
        deferred.done(function(data) {
          if (data.status) {
            return returnDeferred.resolve(data.result);
          } else {
            App.notify(data.result);
            return returnDeferred.reject(data.result);
          }
        }).fail(function(data) {
          App.notify('服务端或网络异常');
          return returnDeferred.reject('服务端或网络异常');
        }).always(function() {
          return NProgress.done();
        });
        return returnDeferred;
      }
    });
    return AppModel;
  });

}).call(this);

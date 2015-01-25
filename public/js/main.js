(function() {
  require.config({
    shim: {
      underscore: {
        exports: '_'
      },
      jquery_plugin: {
        deps: ['jquery']
      },
      backbone: {
        deps: ['underscore', 'jquery', 'jquery_plugin'],
        exports: 'Backbone'
      },
      handlebars: {
        exports: 'Handlebars'
      },
      ace: {
        exports: 'ace'
      },
      AppModel: {
        deps: ['backbone', 'markdown_converter']
      },
      EditView: {
        deps: ['medium_editor', 'html2canvas', 'tomarkdown', 'selectize']
      }
    },
    paths: {
      jquery: 'vender/jquery-2.1.1.min',
      jquery_plugin: 'vender/jquery.plugin',
      underscore: 'vender/underscore-1.6.min',
      backbone: 'vender/backbone-1.1.2.min',
      handlebars: 'vender/handlebars-1.3.0.min',
      nprogress: 'vender/nprogress/nprogress',
      medium_editor: 'vender/medium-editor',
      html2canvas: 'vender/html2canvas',
      tomarkdown: 'vender/to-markdown',
      markdown_converter: 'vender/markdown',
      ace: 'vender/ace',
      selectize: 'vender/selectize/selectize.min',
      moment: 'vender/moment-with-locales',
      scroll: 'vender/perfect-scrollbar/perfect-scrollbar.min',
      diff: 'vender/diff_match_patch',
      AppModel: 'module/AppModel',
      IndexView: 'module/index/IndexView',
      MainView: 'module/main/MainView',
      SettingView: 'module/setting/SettingView',
      EditView: 'module/edit/EditView',
      ArticleView: 'module/article/ArticleView',
      CircleView: 'module/circle/CircleView'
    }
  });

  require(['backbone', 'handlebars', 'AppModel', 'scroll'], function(Backbone, Handlebars, AppModel) {
    var Workspace;
    Workspace = Backbone.Router.extend({
      routes: {
        '': 'index',
        'index': 'index',
        'login': 'login',
        'register': 'register',
        'main': 'main',
        'private': 'private',
        'public': 'public',
        'favarite': 'favarite',
        'setting': 'setting',
        'circle': 'circle',
        'edit/:id': 'edit',
        'article/:id': 'article',
        'user/:id': 'user'
      },
      reset: function() {},
      render: function(viewName, data) {
        var that;
        that = this;
        NProgress.start();
        that.cachedView = that.cachedView || {};
        return require([viewName], function(View) {
          var view;
          if (!that.cachedView[viewName]) {
            that.cachedView[viewName] = new View();
          }
          view = that.cachedView[viewName];
          return view.render(function($container) {
            var containerId;
            containerId = $container.attr('id');
            $(".container:not(#" + containerId + ")").hide().empty();
            $container.fadeIn();
            return NProgress.done();
          }, data);
        });
      },
      index: function() {
        return this.render('IndexView');
      },
      login: function() {
        return this.render('IndexView', 'login');
      },
      register: function() {
        return this.render('IndexView', 'register');
      },
      main: function() {
        return this.render('MainView', {});
      },
      user: function(userName) {
        return this.render('MainView', {
          name: 'user',
          info: userName
        });
      },
      "private": function() {
        return this.render('MainView', {
          name: 'private'
        });
      },
      "public": function() {
        return this.render('MainView', {
          name: 'public'
        });
      },
      favarite: function() {
        return this.render('MainView', {
          name: 'favarite'
        });
      },
      setting: function() {
        return this.render('MainView', {
          name: 'setting'
        });
      },
      circle: function() {
        return this.render('MainView', {
          name: 'circle'
        });
      },
      edit: function(articleId) {
        return this.render('EditView', articleId);
      },
      article: function(articleId) {
        return this.render('ArticleView', articleId);
      }
    });
    window.workspace = new Workspace();
    window.App = new AppModel();
    return Backbone.history.start();
  });

}).call(this);

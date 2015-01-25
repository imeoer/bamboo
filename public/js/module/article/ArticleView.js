(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone', 'module/article/template', 'moment'], function(Backbone, template, moment) {
    var ArticleView;
    ArticleView = Backbone.View.extend({
      el: '#article',
      events: {
        'click .icon.like': 'like',
        'click .icon.favarite': 'favarite'
      },
      initialize: function() {
        return moment.locale('zh-cn');
      },
      render: function(callback, articleId) {
        var that;
        that = this;
        NProgress.start();
        this.articleId = articleId;
        return App.article.get({
          articleId: this.articleId
        }).done(function(data) {
          var _ref;
          data.article.content = App.mdConvert.makeHtml(data.article.content);
          data.article.updated = moment(data.article.updated).fromNow();
          data.article.count = $(data.article.content).text().length;
          if (data.article.like) {
            data.like = (_ref = $.localStorage('id'), __indexOf.call(data.article.like, _ref) >= 0);
          }
          that.$el.html(template.page(data));
          return callback(that.$el);
        }).always(function() {
          return NProgress.done();
        });
      },
      like: function() {
        var $icon, like, that;
        that = this;
        $icon = that.$el.find('.icon.like');
        like = true;
        if ($icon.hasClass('icon-font-heart')) {
          like = false;
        }
        return App.article.like({
          articleId: this.articleId,
          like: like
        }).done(function(data) {
          if (data) {
            return $icon.removeClass('icon-font-heart-empty').addClass('icon-font-heart');
          } else {
            return $icon.removeClass('icon-font-heart').addClass('icon-font-heart-empty');
          }
        }).fail(function(data) {
          return App.notify(data);
        });
      },
      favarite: function() {
        var $icon, favarite, that;
        that = this;
        $icon = that.$el.find('.icon.favarite');
        favarite = true;
        if ($icon.hasClass('icon-font-star')) {
          favarite = false;
        }
        return App.article.favarite({
          articleId: this.articleId,
          favarite: favarite
        }).done(function(data) {
          if (data) {
            return $icon.removeClass('icon-font-star-empty').addClass('icon-font-star');
          } else {
            return $icon.removeClass('icon-font-star').addClass('icon-font-star-empty');
          }
        }).fail(function(data) {
          return App.notify(data);
        });
      }
    });
    return ArticleView;
  });

}).call(this);

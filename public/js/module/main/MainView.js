(function() {
  define(['backbone', 'module/main/template', 'SettingView', 'CircleView', 'diff'], function(Backbone, template, SettingView, CircleView, Diff) {
    var MainView;
    MainView = Backbone.View.extend({
      el: '#main',
      events: {
        'click .write': 'write',
        'click .article-item .remove': 'remove',
        'click .article-item .edit': 'edit',
        'click .article-item': 'view',
        'click .tool .item': 'switch'
      },
      initialize: function() {
        var that;
        that = this;
        that.diff = new diff_match_patch();
        return $(window).scroll(function() {
          var $logo, currentTop, gapTop;
          currentTop = $(this).scrollTop();
          $logo = that.$el.find('.logo');
          gapTop = 60;
          if (currentTop < gapTop) {
            $logo.css('opacity', 1);
          }
          if (currentTop > gapTop) {
            return $logo.css('opacity', 0);
          }
        });
      },
      getChangeRate: function(content1, content2) {
        var diffData;
        diffData = this.diff.diff_main(content1, content2);
        return (this.diff.diff_levenshtein(diffData) / content1.length) * 100;
      },
      render: function(callback, viewData) {
        var that;
        that = this;
        that.callback = callback;
        if (viewData.name === 'user') {
          return App.user.page({
            name: viewData.info
          }).done(function(data) {
            that.$el.html(template.page({
              master: false,
              user: data.user
            }));
            that.renderList(data.articles);
            return that.callback(that.$el);
          });
        } else {
          return App.user.info().done(function(data) {
            data.master = true;
            App.setUser(data.user);
            if (App.getUser()) {
              data.registered = true;
              that.$el.html(template.page(data));
              return that.switchTo(viewData.name);
            } else {
              that.$el.html(template.page(data));
              return that.switchTo('setting');
            }
          });
        }
      },
      "switch": function(event) {
        var $item, viewName;
        $item = $(event.currentTarget);
        viewName = $item.data('id');
        this.switchTo(viewName);
        return workspace.navigate(viewName, {
          trigger: false,
          replace: true
        });
      },
      switchTo: function(name) {
        var $parent, circleView, settingView, that;
        that = this;
        if (!name) {
          name = 'main';
        }
        $parent = that.$el.find('.main');
        if (name === 'setting') {
          settingView = new SettingView();
          settingView.render(function($container) {
            $parent.html($container);
            return that.callback(that.$el);
          });
        } else if (name === 'circle') {
          circleView = new CircleView();
          circleView.render(function($container) {
            $parent.html($container);
            return that.callback(that.$el);
          });
        } else if (name === 'private' || name === 'public' || name === 'favarite') {
          NProgress.start();
          App.article.list({
            filter: name
          }).done(function(data) {
            var editView;
            editView = false;
            if (name === 'private' || name === 'public') {
              editView = true;
            }
            that.renderList(data, editView);
            that.callback(that.$el);
            return NProgress.done();
          });
        } else {
          NProgress.start();
          App.user.timeline().done(function(data) {
            that.renderList(data);
            that.callback(that.$el);
            return NProgress.done();
          });
        }
        that.$el.find('.tool .item').removeClass('selected');
        return that.$el.find('.tool .item[data-id="' + name + '"]').addClass('selected');
      },
      renderList: function(data, editView) {
        var that;
        that = this;
        data = _.map(data, function(item) {
          var $origin, content, firstImg;
          $origin = $(App.mdConvert.makeHtml(item.article.content));
          firstImg = $origin.find('img')[0];
          content = $origin.text();
          if (content.length > 90) {
            item.article.content = content.slice(0, 90) + '...';
          } else {
            item.article.content = content;
          }
          if (firstImg) {
            item.article.thematic = firstImg.src;
          }
          item.article.updated = moment(item.article.updated).fromNow();
          item.article.circle = item.article.circle.join(' ');
          return item;
        });
        if (data.length) {
          return that.$el.find('.main').html(template.articles({
            articles: data,
            editView: editView
          }));
        } else {
          return that.$el.find('.main').html(template.nocontent());
        }
      },
      write: function() {
        return workspace.navigate('edit/new', {
          trigger: true
        });
      },
      remove: function(event) {
        var $articleItem, articleId;
        $articleItem = $(event.currentTarget).parents('.article-item');
        articleId = $articleItem.data('id');
        App.article.remove({
          articleId: articleId
        }).done(function(data) {
          return $articleItem.remove();
        }).fail(function(data) {
          return null;
        });
        return false;
      },
      edit: function(event) {
        var $articleItem, articleId;
        $articleItem = $(event.currentTarget).parents('.article-item');
        articleId = $articleItem.data('id');
        return workspace.navigate('edit/' + articleId, {
          trigger: true
        });
      },
      view: function(event) {
        var $articleItem, articleId;
        $articleItem = $(event.currentTarget);
        articleId = $articleItem.data('id');
        return workspace.navigate('article/' + articleId, {
          trigger: true
        });
      }
    });
    return MainView;
  });

}).call(this);

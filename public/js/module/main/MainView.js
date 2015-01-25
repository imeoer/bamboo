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
        return this.diff = new diff_match_patch();
      },
      getChangeRate: function(content1, content2) {
        var diffData;
        diffData = this.diff.diff_main(content1, content2);
        return (this.diff.diff_levenshtein(diffData) / content1.length) * 100;
      },
      render: function(callback, data) {
        var master, that;
        that = this;
        that.callback = callback;
        master = true;
        if (data.name === 'user') {
          master = false;
        }
        that.$el.html(template.page({
          master: master,
          id: $.localStorage('id'),
          name: $.localStorage('name'),
          mail: $.localStorage('mail'),
          nick: $.localStorage('nick'),
          motto: $.localStorage('motto'),
          link: $.localStorage('link'),
          avatar: $.localStorage('avatar')
        }));
        return this.switchTo(data.name, data.info);
      },
      "switch": function(event) {
        var $item, viewName;
        $item = $(event.currentTarget);
        viewName = $item.data('id');
        return workspace.navigate(viewName, {
          trigger: true,
          replace: true
        });
      },
      switchTo: function(name, info) {
        var $parent, circleView, settingView, that;
        that = this;
        if (!name) {
          name = 'main';
        }
        $parent = that.$el.find('.main');
        if (name === 'user') {
          App.user.page({
            name: info
          }).done(function(data) {
            that.renderList(data.articles);
            return that.callback(that.$el);
          });
        } else if (name === 'setting') {
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
          App.article.list({
            filter: name
          }).done(function(data) {
            that.renderList(data);
            return that.callback(that.$el);
          });
        } else {
          App.user.timeline().done(function(data) {
            that.renderList(data);
            return that.callback(that.$el);
          });
        }
        that.$el.find('.tool .item').removeClass('selected');
        return that.$el.find('.tool .item[data-id="' + name + '"]').addClass('selected');
      },
      renderList: function(data) {
        var that;
        that = this;
        data = _.map(data, function(item) {
          var $origin, content, firstImg;
          $origin = $(App.mdConvert.makeHtml(item.content));
          firstImg = $origin.find('img')[0];
          content = $origin.text();
          if (content.length > 90) {
            item.content = content.slice(0, 90) + '...';
          } else {
            item.content = content;
          }
          if (firstImg) {
            item.thematic = firstImg.src;
          }
          return item;
        });
        if (data.length) {
          return that.$el.find('.main').html(template.articles({
            articles: data
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

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone', 'module/circle/template'], function(Backbone, template) {
    var CircleView;
    CircleView = Backbone.View.extend({
      className: 'circle',
      events: {
        'click .circle-list .circle-item': 'focus'
      },
      initialize: function() {},
      render: function(callback) {
        var that;
        that = this;
        NProgress.start();
        return App.user.info().done(function(data) {
          var circles;
          data = data.user;
          data.circle = data.circle || [];
          circles = _.map(App.circles, function(circle) {
            var _ref;
            circle.focused = false;
            if (_ref = circle.name, __indexOf.call(data.circle, _ref) >= 0) {
              circle.focused = true;
            }
            return circle;
          });
          circles = circles.sort(function(a, b) {
            if (a.focused) {
              return -1;
            }
            if (b.focused) {
              return 1;
            }
          });
          that.$el.html(template.page(circles));
          return callback(that.$el);
        }).always(function() {
          return NProgress.done();
        });
      },
      focus: function(event) {
        var $item, circleName, focused, that;
        that = this;
        $item = $(event.currentTarget);
        circleName = $item.data('name');
        focused = true;
        if ($item.hasClass('focused')) {
          focused = false;
        }
        return App.circle.focus({
          circle: circleName,
          focus: focused
        }).done(function(data) {
          if (data) {
            return $item.addClass('focused');
          } else {
            return $item.removeClass('focused');
          }
        });
      }
    });
    return CircleView;
  });

}).call(this);

define ['backbone', 'module/circle/template'], (Backbone, template) ->

    CircleView = Backbone.View.extend

        className: 'circle'

        events:

            'click .circle-list .circle-item': 'focus'

        initialize: () ->

        render: (callback) ->

            that = @
            NProgress.start()

            App.user.info().done (data) ->
                data = data.user
                data.circle = data.circle || []
                circles = _.map App.circles, (circle) ->
                    circle.focused = false
                    if circle.name in data.circle
                        circle.focused = true
                    return circle
                circles = circles.sort (a, b) ->
                    return -1 if a.focused
                    return 1 if b.focused
                that.$el.html template.page(circles)
                callback(that.$el)
            .always () ->
                NProgress.done()

        focus: (event) ->

            that = @

            $item = $(event.currentTarget)

            circleName = $item.data('name')

            focused = true
            focused = false if $item.hasClass('focused')

            App.circle.focus({
                circle: circleName,
                focus: focused
            }).done (data) ->
                if data
                    $item.addClass('focused')
                else
                    $item.removeClass('focused')

    return CircleView

define ['backbone', 'module/main/template', 'SettingView', 'CircleView', 'diff'], (Backbone, template, SettingView, CircleView, Diff) ->

    MainView = Backbone.View.extend

        el: '#main'

        events:

            'click .article-item .remove': 'remove'
            'click .tool .item': 'switch'

        initialize: () ->

            that = @

            that.diff = new diff_match_patch()

            $(window).scroll () ->

                currentTop = $(this).scrollTop()
                $logo = that.$el.find('.logo')
                gapTop = 60
                if currentTop < gapTop
                    $logo.css('opacity', 1)
                if currentTop > gapTop
                    $logo.css('opacity', 0)

        getChangeRate: (content1, content2) ->

            diffData = @diff.diff_main(content1, content2)
            return (@diff.diff_levenshtein(diffData) / content1.length) * 100

        render: (callback, viewData) ->

            # NProgress.start()

            that = @

            that.callback = callback

            if viewData.name is 'user'

                App.user.page({
                    name: viewData.info
                }).done (data) ->

                    that.$el.html template.page({
                        master: false,
                        user: data.user
                    })
                    that.renderList(data.articles)
                    that.callback(that.$el)

            else

                App.user.info().done (data) ->

                    data.master = true
                    App.setUser(data.user)

                    if App.getUser()

                        data.registered = true
                        that.$el.html template.page(data)
                        that.switchTo(viewData.name, true)

                    else

                        that.$el.html template.page(data)
                        that.switchTo('setting', true)

        switch: (event) ->

            $item = $(event.currentTarget)
            viewName = $item.data('id')
            @switchTo(viewName, false)
            # workspace.navigate(viewName, {trigger: false, replace: true})

        switchTo: (name, full) ->

            that = @

            name = 'main' if not name

            workspace.navigate(name, {trigger: false, replace: true})

            $parent = that.$el.find('.main')

            if name is 'setting'

                settingView = new SettingView()
                settingView.render ($container) ->
                    $parent.html($container)
                    that.callback(that.$el)

            else if name is 'circle'

                circleView = new CircleView()
                circleView.render ($container) ->
                    $parent.html($container)
                    that.callback(that.$el)

            else if name in ['private', 'public', 'favarite']

                NProgress.start()
                App.article.list({
                    filter: name
                }).done (data) ->
                    editView = false
                    editView = true if name in ['private', 'public']
                    that.renderList(data, editView)
                    that.callback(that.$el)
                    NProgress.done()

            else

                NProgress.start()
                App.user.timeline().done (data) ->
                    that.renderList(data)
                    that.callback(that.$el)
                    NProgress.done()

            that.$el.find('.tool .item').removeClass('selected')
            that.$el.find('.tool .item[data-id="' + name + '"]').addClass('selected')

        renderList: (data, editView) ->

            that = @

            data = _.map data, (item) ->
                $origin = $(App.mdConvert.makeHtml(item.article.content))
                firstImg = $origin.find('img')[0]
                content = $origin.text()
                if content.length > 90
                    item.article.content = content.slice(0, 90) + '...'
                else
                    item.article.content = content
                item.article.thematic = firstImg.src if firstImg
                item.article.updated = moment(item.article.updated).fromNow()
                item.article.circle = item.article.circle.join(' ')
                return item
            if data.length
                that.$el.find('.main').html template.articles({
                    articles: data,
                    editView: editView
                })
            else
                that.$el.find('.main').html template.nocontent()

        remove: (event) ->

            $articleItem = $(event.currentTarget).parents('.article-item')
            articleId = $articleItem.data('id')
            App.article.remove({
                articleId: articleId
            }).done (data) ->
                $articleItem.remove()
            .fail (data) ->
                null
            return false

    return MainView

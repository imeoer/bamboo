define ['backbone', 'module/article/template'], (Backbone, template) ->

    ArticleView = Backbone.View.extend

        el: '#article'

        events:

            'click .icon.like': 'like'
            'click .icon.favarite': 'favarite'

        initialize: () ->

        render: (callback, articleId) ->

            that = @
            NProgress.start()

            @articleId = articleId
            App.article.get({
                articleId: @articleId
            }).done (data) ->
                data.article.content = App.mdConvert.makeHtml(data.article.content)
                data.article.updated = moment(data.article.updated).fromNow()
                data.article.count = $(data.article.content).text().length
                (data.like = $.localStorage('id') in data.article.like) if data.article.like
                that.$el.html template.page(data)
                callback(that.$el)
            .always () ->
                NProgress.done()

        like: () ->

            that = @

            $icon = that.$el.find('.icon.like')
            like = true
            like = false if $icon.hasClass('icon-font-heart')

            App.article.like({
                articleId: @articleId,
                like: like
            }).done (data) ->
                if data
                    $icon.removeClass('icon-font-heart-empty').addClass('icon-font-heart')
                else
                    $icon.removeClass('icon-font-heart').addClass('icon-font-heart-empty')
            .fail (data) ->
                App.notify(data)

        favarite: () ->

            that = @

            $icon = that.$el.find('.icon.favarite')
            favarite = true
            favarite = false if $icon.hasClass('icon-font-star')

            App.article.favarite({
                articleId: @articleId,
                favarite: favarite
            }).done (data) ->
                if data
                    $icon.removeClass('icon-font-star-empty').addClass('icon-font-star')
                else
                    $icon.removeClass('icon-font-star').addClass('icon-font-star-empty')
            .fail (data) ->
                App.notify(data)

    return ArticleView

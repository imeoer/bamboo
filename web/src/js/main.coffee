require.config

    shim:

        underscore:
            exports: '_'

        jquery_plugin:
            deps: [
                'jquery'
            ]

        backbone:
            deps: [
                'underscore'
                'jquery'
                'jquery_plugin'
            ]
            exports: 'Backbone'

        handlebars:
            exports: 'Handlebars'

        ace:
            exports: 'ace'

        AppModel:
            deps: ['backbone', 'markdown_converter']

        EditView:
            deps: ['medium_editor', 'html2canvas', 'tomarkdown', 'selectize']

    paths:

        jquery: 'vender/jquery-2.1.1.min'
        jquery_plugin: 'vender/jquery.plugin'
        underscore: 'vender/underscore-1.6.min'
        backbone: 'vender/backbone-1.1.2.min'
        handlebars: 'vender/handlebars-1.3.0.min'
        nprogress: 'vender/nprogress/nprogress'
        medium_editor: 'vender/medium-editor'
        html2canvas: 'vender/html2canvas'
        tomarkdown: 'vender/to-markdown'
        markdown_converter: 'vender/markdown'
        ace: 'vender/ace'
        selectize: 'vender/selectize/selectize.min'
        moment: 'vender/moment-with-locales'
        scroll: 'vender/perfect-scrollbar/perfect-scrollbar.min'
        diff: 'vender/diff_match_patch'

        AppModel: 'module/AppModel'
        IndexView: 'module/index/IndexView'
        MainView: 'module/main/MainView'
        SettingView: 'module/setting/SettingView'
        EditView: 'module/edit/EditView'
        ArticleView: 'module/article/ArticleView'
        CircleView: 'module/circle/CircleView'

require ['backbone', 'handlebars', 'AppModel', 'scroll'], (Backbone, Handlebars, AppModel) ->

    # $('body').perfectScrollbar()

    Workspace = Backbone.Router.extend

        routes:

            '': 'index'
            'index': 'index'
            'login': 'login'
            'register': 'register'
            'main': 'main'
            'private': 'private'
            'public': 'public'
            'favarite': 'favarite'
            'setting': 'setting'
            'circle': 'circle'
            'edit/:id': 'edit'
            'article/:id': 'article'
            'user/:id': 'user'

        reset: () ->

        render: (viewName, data) ->

            that = @
            NProgress.start()
            that.cachedView = that.cachedView or {}

            require [viewName], (View) ->

                # cache view
                if not that.cachedView[viewName]
                    that.cachedView[viewName] = new View()

                view = that.cachedView[viewName]

                view.render ($container) ->
                    containerId = $container.attr('id')
                    $(".container:not(##{containerId})").hide().empty()
                    $('body').scrollTop(0)
                    $container.fadeIn()
                    NProgress.done()
                , data

        index: () ->

            @render('IndexView')

        login: () ->

            @render('IndexView', 'login')

        register: () ->

            @render('IndexView', 'register')

        main: () ->

            @render('MainView', {})

        user: (userName) ->

            @render('MainView', {
                name: 'user',
                info: userName
            })

        private: () ->

            @render('MainView', {name: 'private'})

        public: () ->

            @render('MainView', {name: 'public'})

        favarite: () ->

            @render('MainView', {name: 'favarite'})

        setting: () ->

            @render('MainView', {name: 'setting'})

        circle: () ->

            @render('MainView', {name: 'circle'})

        edit: (articleId) ->

            @render('EditView', articleId)

        article: (articleId) ->

            @render('ArticleView', articleId)

    window.workspace = new Workspace()
    window.App = new AppModel()
    Backbone.history.start()

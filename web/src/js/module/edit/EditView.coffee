define ['backbone', 'ace', 'module/edit/template'], (Backbone, ace, template) ->

    EditView = Backbone.View.extend

        el: '#edit'

        events:

            'click .edit': 'edit'
            'click img': 'selectImg'
            'mouseover li.type,.image-upload': 'focusToolbarInput'
            'click .publish': 'publish'
            'click .edit-view li': 'modeSwitch'
            'click .tool .type span': 'publicSwitch'
            'keypress .toolbar .image input': 'addImage'
            'keypress .toolbar .music input': 'addMusic'
            'keypress .toolbar .vedio input': 'addVideo'

        initialize: () ->

            @toolbar = null
            @public = false

        isInDomByClass: ($target, className) ->

            return $target.prop('tagName') in ['INPUT', 'TEXTAREA'] or $target.hasClass(className) or $target.parents(".#{className}").length

        render: (callback, articleId) ->

            that = @

            if articleId is 'new'
                that.articleId = ''
                that.public = false
                that.$el.html template.page()
                that.loadEditor()
                callback(that.$el)
            else
                that.articleId = articleId
                App.article.get({
                    articleId: that.articleId
                }).done (data) ->
                    data.article.content = App.mdConvert.makeHtml(data.article.content)
                    that.public = data.article.public
                    that.$el.html template.page(data)
                    that.loadEditor()
                    callback(that.$el)
                .always () ->
                    NProgress.done()

        loadEditor: () ->

            that = @

            # init circle select
            @$el.find('.circle-select').selectize({
                persist: false,
                maxItems: null,
                valueField: 'name',
                labelField: 'name',
                searchField: ['name', 'name'],
                options: App.circles,
                render: {
                    item: (item, escape) ->
                        return '<div>' + item.name + '</div>'
                    option: (item, escape) ->
                        return '<div>' + item.name + '</div>'
                }
            })

            # editor = new Pen(@$el.find('.content.visual')[0])
            mediumEditor = new MediumEditor('.content.visual', {
                diffTop: -20
            })
            @mediumEditor = mediumEditor

            # ace editor
            aceEditor = ace.edit($('.content.markdown')[0])
            MarkdownMode = ace.require('ace/mode/markdown').Mode
            aceEditor.getSession().setMode(new MarkdownMode())
            aceEditor.setOptions({
                showGutter: false,
                maxLines: Infinity,
                highlightGutterLine: true,
                showPrintMargin: false
            })
            aceEditor.getSession().setUseWrapMode(true)
            @aceEditor = aceEditor

            $(document).on 'mouseup', (event) ->

                $target = $(event.target)
                # if not (that.isInDomByClass($target, 'content') or
                #     that.isInDomByClass($target, 'title') or
                #     that.isInDomByClass($target, 'medium-editor-toolbar'))
                if $target.prop('tagName') in ['BODY', 'HTML'] or $target.hasClass('container') or $target.hasClass('article')
                    if that.$el.find('.content.visual').is(':visible')
                        that.$el.find('.content.visual').focusEnd()
                    else
                        that.aceEditor.focus()

            @initToolbar()

        publish: () ->

            that = @

            originHTML = @$el.find('.content.visual').html()

            title = @$el.find('.title').text()
            content = toMarkdown(originHTML)

            if $.trim(title) is ''
                App.notify('请输入文章标题')
                return

            circles = that.$el.find('input.circle-select').val().split(',')

            App.article.update({
                articleId: that.articleId,
                title: title,
                content: content,
                circles: circles,
                public: that.public
            }).done (data) ->
                that.articleId = data
                workspace.navigate('main', {trigger: true})

        selectImg: (event) ->

            $img = $(event.target)
            $img.setRangeByDom() #.addClass('selected')

        focusToolbarInput: (event) ->

            $target = $(event.currentTarget)
            $typeBtn = $target.parent('li.type').find('input.link')
            if not $typeBtn.length
                $typeBtn = $target.find('input.link')
            $typeBtn.focus()

        initToolbar: () ->

            that = @

            @$el.find('.content').on 'focus keyup mouseup', () ->

                $focusDom = $(document.getSelection().focusNode)
                $toolbar = that.$el.find('.toolbar')

                # show toolbar when time
                if ($focusDom.hasClass('content') or
                    $focusDom.prop('tagName') is 'P' or
                    $focusDom.parents('p').length) and
                    $focusDom.text() is ''

                        # $('html, body').animate({
                        #     scrollTop: $focusDom.offset().top - 600;
                        # }, 100)

                        that.initUpload($toolbar) if not that.toolbar

                        that.toolbar = $toolbar
                        that.$focusDom = $focusDom

                        # set toolbar position
                        leftPos = that.$focusDom.offset().left
                        topPos = that.$focusDom.offset().top
                        $toolbar.css('left', leftPos - 80 + 'px').css('top', topPos - 10 + 'px')
                        $toolbar.fadeIn('fast')

                else

                    $toolbar.fadeOut('fast')

        initUpload: ($toolbar) ->

            that = @

            # bind toolbar upload event
            $toolbar.dmUploader({

                url: "#{App.baseURL}/article/upload",
                dataType: 'json',
                allowedTypes: 'image/*',
                headers: {Token: $.localStorage('token')},

                onNewFile: (id, file) ->

                    # show image preview
                    oFReader = new FileReader()
                    oFReader.readAsDataURL(file)

                    oFReader.onload = (oFREvent) ->

                        if that.$focusDom and that.$focusDom.length

                            appendDom = '<img class="preview" data-id="' + id + '" />'

                            if that.$focusDom.prop('tagName') isnt 'P'
                                appendDom = "<p>#{appendDom}</p><p><br/></p>"
                            else
                                appendDom = "#{appendDom}<p><br/></p>"

                            insertRet = document.execCommand('insertHTML', true, appendDom)
                            if not insertRet
                                that.$focusDom.html(appendDom)

                            $preview = that.$focusDom.find('.preview')
                            $preview[0].src = oFREvent.target.result

                            $preview.parents('p').wrap("<div class='uploading'></div>")
                            $preview.before("<div class='progress'></div>")

                onUploadSuccess: (id, data) ->

                    if data.status

                        fileName = data.result
                        $imgDom = $('img.preview[data-id="' + id + '"]')
                        $imgDom.siblings('.progress').remove()
                        $imgDom.parents('p').unwrap('.uploading')
                        $imgDom[0].src = "/images/#{fileName}"

                    else

                        that.onUploadError(id)
                        App.notify(data.result)

                onUploadProgress: (id, progress) ->

                    $imgDom = $('img.preview[data-id="' + id + '"]')
                    $progress = $imgDom.parents('.uploading').find('.progress')
                    imgHeight = $imgDom.height()
                    progessHeight = progress / 100 * imgHeight
                    $progress.height(imgHeight - progessHeight)

                onUploadError: (id, message) ->

                    that.onUploadError(id)
                    App.notify("网络或内部错误，图片上传失败")

            })

        onUploadError: (id) ->

            $imgDom = $('img.preview[data-id="' + id + '"]')
            $imgDom.parents('.uploading').remove()

        modeSwitch: (event) ->

            $target = $(event.currentTarget)

            $visual = @$el.find('.content.visual')
            $markdown = @$el.find('.content.markdown')

            @$el.find('.edit-view li').removeClass('active')
            @$el.find('.content').hide()

            if $target.hasClass('visual')
                @$el.find('.edit-view .visual').addClass('active')
                @$el.find('.content.visual').focusEnd()
                contentHtml = App.mdConvert.makeHtml(@aceEditor.getValue())
                $visual.html(contentHtml)
                $visual.show()
            else
                @$el.find('.edit-view .markdown').addClass('active')
                @aceEditor.setValue(toMarkdown($visual.html()))
                @aceEditor.clearSelection()
                $markdown.show()

        publicSwitch: (event) ->

            $target = $(event.currentTarget)
            $parent = $target.parents('.type')
            $parent.find('span').removeClass('selected')
            $target.addClass('selected')
            @public = ($target.data('id') is 'public')

        addImage: (event) ->

            that = @

            if event.keyCode == 13

                $input = $(event.currentTarget)
                url = $input.val()
                img = new Image()
                img.onload = () ->
                    that.$el.find('.content.visual').focusEnd()
                    $dom = '<img class="preview" src="' + @src + '"/>'
                    document.execCommand('insertHTML', true, $dom)
                    $input.val('')
                img.onerror = () ->
                    App.notify('图片地址解析错误')
                img.src = url

        addMusic: (event) ->

            if event.keyCode == 13

                $input = $(event.currentTarget)
                url = $input.val()

                if url.match(/music.163.com/)

                    idAry = url.match(/id=((\d)+)/)
                    id = idAry[1] or ''

                if id
                    @$el.find('.content.visual').focusEnd()
                    $dom = '<embed src="http://music.163.com/style/swf/widget.swf?sid=' + id +
                        '&type=2&auto=0&width=320&height=66" width="340" height="86"  allowNetworking="all"></embed>'
                    document.execCommand('insertHTML', true, $dom)
                    $input.val('')
                else
                    App.notify('音乐地址解析错误')

        addVideo: (event) ->

            if event.keyCode == 13

                $input = $(event.currentTarget)
                url = $input.val()

                if url.match(/youtube/)
                    idAry = url.match(/v=([A-Za-z0-9]+)/)
                    id = if idAry then idAry[1] else ''
                    $dom = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + id +
                        '" frameborder="0" allowfullscreen></iframe>'
                else if url.match(/vimeo/)
                    idAry = url.match(/\/((\d)+)/)
                    id = if idAry then idAry[1] else ''
                    $dom = '<iframe src="//player.vimeo.com/video/' + id +
                        '" width="500" height="208" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'

                if id
                    @$el.find('.content.visual').focusEnd()
                    document.execCommand('insertHTML', true, $dom)
                    $input.val('')
                else
                    App.notify('视频地址解析错误')

        edit: () ->

            workspace.navigate('edit', {trigger: true})
            return false

    return EditView

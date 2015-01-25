(function() {
  define(['backbone', 'ace', 'module/edit/template'], function(Backbone, ace, template) {
    var EditView;
    EditView = Backbone.View.extend({
      el: '#edit',
      events: {
        'click .edit': 'edit',
        'click img': 'selectImg',
        'mouseover li.type,.image-upload': 'focusToolbarInput',
        'click .publish': 'publish',
        'click .edit-view li': 'modeSwitch',
        'click .tool .type span': 'publicSwitch',
        'keypress .toolbar .image input': 'addImage',
        'keypress .toolbar .music input': 'addMusic',
        'keypress .toolbar .vedio input': 'addVideo'
      },
      initialize: function() {},
      isInDomByClass: function($target, className) {
        var _ref;
        return ((_ref = $target[0].nodeName) === 'INPUT' || _ref === 'TEXTAREA') || $target.hasClass(className) || $target.parents("." + className).length;
      },
      render: function(callback, articleId) {
        var that;
        that = this;
        that.toolbar = null;
        that["public"] = false;
        if (articleId === 'new') {
          that.articleId = '';
          that["public"] = false;
          that.$el.html(template.page());
          that.loadEditor();
          return callback(that.$el);
        } else {
          that.articleId = articleId;
          return App.article.get({
            articleId: that.articleId
          }).done(function(data) {
            data.article.content = App.mdConvert.makeHtml(data.article.content);
            that["public"] = data.article["public"];
            that.$el.html(template.page(data));
            that.loadEditor();
            return callback(that.$el);
          }).always(function() {
            return NProgress.done();
          });
        }
      },
      loadEditor: function() {
        var MarkdownMode, aceEditor, mediumEditor, that;
        that = this;
        this.$el.find('.circle-select').selectize({
          persist: false,
          maxItems: null,
          valueField: 'name',
          labelField: 'name',
          searchField: ['name', 'name'],
          options: App.circles,
          render: {
            item: function(item, escape) {
              return '<div>' + item.name + '</div>';
            },
            option: function(item, escape) {
              return '<div>' + item.name + '</div>';
            }
          }
        });
        mediumEditor = new MediumEditor('.content.visual', {
          diffTop: -20
        });
        this.mediumEditor = mediumEditor;
        aceEditor = ace.edit($('.content.markdown')[0]);
        MarkdownMode = ace.require('ace/mode/markdown').Mode;
        aceEditor.getSession().setMode(new MarkdownMode());
        aceEditor.setOptions({
          showGutter: false,
          maxLines: Infinity,
          highlightGutterLine: true,
          showPrintMargin: false,
          enableSnippets: false
        });
        aceEditor.getSession().setUseWrapMode(true);
        this.aceEditor = aceEditor;
        $(document).on('mouseup', function(event) {
          var $target;
          $target = $(event.target);
          if (!(that.isInDomByClass($target, 'content') || that.isInDomByClass($target, 'title') || that.isInDomByClass($target, 'medium-editor-toolbar'))) {
            that.aceEditor.focus();
            return that.$el.find('.content.visual').focusEnd();
          }
        });
        return this.initToolbar();
      },
      toImg: function(canvas) {
        return $('#xxx')[0].src = canvas.toDataURL();
      },
      publish: function() {
        var circles, content, originHTML, that, title;
        that = this;
        originHTML = this.$el.find('.content.visual').html();
        title = this.$el.find('.title').text();
        content = toMarkdown(originHTML);
        if ($.trim(title) === '') {
          App.notify('请输入文章标题');
          return;
        }
        circles = that.$el.find('input.circle-select').val().split(',');
        return App.article.update({
          articleId: that.articleId,
          title: title,
          content: content,
          circles: circles,
          "public": that["public"]
        }).done(function(data) {
          that.articleId = data;
          return workspace.navigate('main', {
            trigger: true
          });
        });
      },
      selectImg: function(event) {
        var $img;
        $img = $(event.target);
        return $img.setRangeByDom();
      },
      focusToolbarInput: function(event) {
        var $target, $typeBtn;
        $target = $(event.currentTarget);
        $typeBtn = $target.parent('li.type').find('input.link');
        if (!$typeBtn.length) {
          $typeBtn = $target.find('input.link');
        }
        return $typeBtn.focus();
      },
      initToolbar: function() {
        var that;
        that = this;
        return this.$el.find('.content').on('focus keyup mouseup', function() {
          var $focusDom, $toolbar, leftPos, topPos;
          $focusDom = $(document.getSelection().focusNode);
          $toolbar = that.$el.find('.toolbar');
          if (($focusDom.hasClass('content') || $focusDom.prop('tagName') === 'P' || $focusDom.parents('p').length) && $focusDom.text() === '') {
            if (!that.toolbar) {
              that.initUpload($toolbar);
            }
            that.toolbar = $toolbar;
            that.$focusDom = $focusDom;
            leftPos = that.$focusDom.offset().left;
            topPos = that.$focusDom.offset().top;
            $toolbar.css('left', leftPos - 80 + 'px').css('top', topPos - 10 + 'px');
            return $toolbar.fadeIn('fast');
          } else {
            return $toolbar.fadeOut('fast');
          }
        });
      },
      initUpload: function($toolbar) {
        var that;
        that = this;
        return $toolbar.dmUploader({
          url: "" + App.baseURL + "/article/upload",
          dataType: 'json',
          allowedTypes: 'image/*',
          headers: {
            Token: $.localStorage('token')
          },
          onNewFile: function(id, file) {
            var oFReader;
            oFReader = new FileReader();
            oFReader.readAsDataURL(file);
            return oFReader.onload = function(oFREvent) {
              var appendDom, insertRet;
              if (that.$focusDom && that.$focusDom.length) {
                appendDom = '<img class="preview" data-id="' + id + '" />';
                if (that.$focusDom.prop('tagName') !== 'P') {
                  appendDom = "<p>" + appendDom + "</p><p><br/></p>";
                } else {
                  appendDom = "" + appendDom + "<p><br/></p>";
                }
                insertRet = document.execCommand('insertHTML', true, appendDom);
                if (!insertRet) {
                  that.$focusDom.html(appendDom);
                }
                return that.$focusDom.find('.preview')[0].src = oFREvent.target.result;
              }
            };
          },
          onUploadSuccess: function(id, data) {
            var $imgDom, fileName;
            if (data.status) {
              fileName = data.result;
              $imgDom = $('img.preview[data-id="' + id + '"]');
              return $imgDom[0].src = "" + App.baseURL + "/" + fileName;
            }
          }
        });
      },
      modeSwitch: function(event) {
        var $markdown, $target, $visual, contentHtml;
        $target = $(event.currentTarget);
        $visual = this.$el.find('.content.visual');
        $markdown = this.$el.find('.content.markdown');
        this.$el.find('.edit-view li').removeClass('active');
        this.$el.find('.content').hide();
        if ($target.hasClass('visual')) {
          this.$el.find('.edit-view .visual').addClass('active');
          this.$el.find('.content.visual').focusEnd();
          contentHtml = App.mdConvert.makeHtml(this.aceEditor.getValue());
          $visual.html(contentHtml);
          return $visual.show();
        } else {
          this.$el.find('.edit-view .markdown').addClass('active');
          this.aceEditor.setValue(toMarkdown($visual.html()));
          this.aceEditor.clearSelection();
          return $markdown.show();
        }
      },
      publicSwitch: function(event) {
        var $parent, $target;
        $target = $(event.currentTarget);
        $parent = $target.parents('.type');
        $parent.find('span').removeClass('selected');
        $target.addClass('selected');
        return this["public"] = $target.data('id') === 'public';
      },
      addImage: function(event) {
        var $input, img, that, url;
        that = this;
        if (event.keyCode === 13) {
          $input = $(event.currentTarget);
          url = $input.val();
          img = new Image();
          img.onload = function() {
            var $dom;
            that.$el.find('.content.visual').focusEnd();
            $dom = '<img class="preview" src="' + this.src + '"/>';
            document.execCommand('insertHTML', true, $dom);
            return $input.val('');
          };
          img.onerror = function() {
            return App.notify('图片地址解析错误');
          };
          return img.src = url;
        }
      },
      addMusic: function(event) {
        var $dom, $input, id, idAry, url;
        if (event.keyCode === 13) {
          $input = $(event.currentTarget);
          url = $input.val();
          if (url.match(/music.163.com/)) {
            idAry = url.match(/id=((\d)+)/);
            id = idAry[1] || '';
          }
          if (id) {
            this.$el.find('.content.visual').focusEnd();
            $dom = '<embed src="http://music.163.com/style/swf/widget.swf?sid=' + id + '&type=2&auto=0&width=320&height=66" width="340" height="86"  allowNetworking="all"></embed>';
            document.execCommand('insertHTML', true, $dom);
            return $input.val('');
          } else {
            return App.notify('音乐地址解析错误');
          }
        }
      },
      addVideo: function(event) {
        var $dom, $input, id, idAry, url;
        if (event.keyCode === 13) {
          $input = $(event.currentTarget);
          url = $input.val();
          if (url.match(/youtube/)) {
            idAry = url.match(/v=([A-Za-z0-9]+)/);
            id = idAry ? idAry[1] : '';
            $dom = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
          } else if (url.match(/vimeo/)) {
            idAry = url.match(/\/((\d)+)/);
            id = idAry ? idAry[1] : '';
            $dom = '<iframe src="//player.vimeo.com/video/' + id + '" width="500" height="208" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
          }
          if (id) {
            this.$el.find('.content.visual').focusEnd();
            document.execCommand('insertHTML', true, $dom);
            return $input.val('');
          } else {
            return App.notify('视频地址解析错误');
          }
        }
      },
      edit: function() {
        return workspace.navigate('edit', {
          trigger: true
        });
      }
    });
    return EditView;
  });

}).call(this);

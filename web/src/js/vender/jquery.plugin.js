// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };

    function isElementInDOM(ele) {
      while (ele = ele.parentNode) {
        if (ele == document) return true;
      }
      return false;
    };

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    };

    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },

        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },

        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },

        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },

        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
                this.$tip.data('tipsy-pointee', this.$element[0]);
            }
            return this.$tip;
        },

        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },

        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };

    $.fn.tipsy = function(options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };

        if (!options.live) this.each(function() { get(this); });

        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 10,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    $.fn.tipsy.revalidate = function() {
      $('.tipsy').each(function() {
        var pointee = $.data(this, 'tipsy-pointee');
        if (!pointee || !isElementInDOM(pointee)) {
          $(this).remove();
        }
      });
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
		return function() {
			var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
			    boundTop = $(document).scrollTop() + margin,
			    boundLeft = $(document).scrollLeft() + margin,
			    $this = $(this);

			if ($this.offset().top < boundTop) dir.ns = 'n';
			if ($this.offset().left < boundLeft) dir.ew = 'w';
			if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
			if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

			return dir.ns + (dir.ew ? dir.ew : '');
		}
	};

})(jQuery);


/* https://github.com/hosokawat/jquery-localstorage */
/*
 * jQuery Local Storage Plugin v0.3 beta
 */
(function ($) {
  var localStorage = window.localStorage;
  $.support.localStorage = localStorage ? true : false;

  var remove = $.removeLocalStorage = function (key) {
    if (localStorage) localStorage.removeItem(key);
    return;
  };

  function allStorage () {
    return localStorage ? localStorage : undefined;
  }

  var config = $.localStorage = function (key, value) {
    // All Read
    if (arguments.length === 0 ) return allStorage(key);

    // Write
    if (value !== undefined) {
      if (localStorage) localStorage.setItem(key, value);
    }

    // Read
    var result;
    if (localStorage) {
      if (localStorage[key]) result = localStorage.getItem(key);
    }
    return result;
  };

  var io = $.localStorage.io = function (key) {
    return {read : function () {
      return config(key);
    }, write : function (value) {
      return config(key, value);
    }, remove : function () {
      return remove(key);
    }, key : key
    };
  };

})(jQuery);


//Based on http://www.sitepoint.com/html5-ajax-file-upload/ (but heavily modified)

var MAX_FILE_SIZE = 33554432; //32MB

function parseFile(file, image_target, callback) {
    //Basic file type validation
    if(file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif') {
        alert('Invalid image type. Valid formats: jpg, gif, png');
        return false;
    }

    //File size validation
    if(file.size > MAX_FILE_SIZE) {
        alert('File is too large. Max file size: ' + MAX_FILE_SIZE);
        return false;
    }

    //Toss an image preview in there right from the client-side
    var reader = new FileReader();
    reader.onload = function(e) {
        image_target.parents('.filedrag').find('.filedrag-preview').attr('src', e.target.result);
        // image_target.siblings('filedrag-filename').html(file.name);
    }
    reader.readAsDataURL(file);

    window[callback];
}

function uploadFile(file, post_target, input_id, onComplete) {
    var xhr = new XMLHttpRequest();
    var response = null;

    //Create progress bar
    // $(".filedrag-progress").html('<p>Uploading...</p>');

    //Update progress bar
    xhr.upload.addEventListener("progress", function(e) {
        var pc = parseInt(100 - (e.loaded / e.total * 100));
        $(".filedrag-progress p").css("backgroundPosition", pc + "% 0");
    }, false);

    //Upload finished
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                $(".filedrag-progress p").addClass("success");
                $(".filedrag-progress p").html("Success!");
                $(".filedrag-progress p").fadeOut('slow', function() {
                    $(".filedrag-progress p").html("");
                    $(".filedrag-progress p").removeClass("success");
                });

                if(!xhr.responseText) {
                    $('.filedrag-filename').html('Error fetching post response');
                    return false;
                }

                response = JSON.parse(xhr.responseText);
                response.input_id = input_id;

                if(onComplete) { window[onComplete](response); }
            }
            else {
                $('.filedrag-filename').html('Error posting image');
                return false;
            }
        }
    };

    //Start the upload
    xhr.open("POST", post_target); // + "/filetype/" + file.type.replace("image/", ""), true);
    // xhr.setRequestHeader("X_FILENAME", file.name);
    xhr.send(file);
}

function initUploaders(post_target, onComplete) {
    var xhr = new XMLHttpRequest();

    //Only do this stuff if the technology is supported
    if (xhr.upload) {
        //Handle the dragover event
        $('.filedrag-droparea').on("dragover", function(e) {
            e.stopPropagation();
            e.preventDefault();
            if(!$(this).hasClass('hover')) { $(this).addClass('hover'); }
        });

        //And the dragleave event
        $('.filedrag-droparea').on("dragleave", function(e) {
            e.stopPropagation();
            e.preventDefault();
            if($(this).hasClass('hover')) { $(this).removeClass('hover'); }
        });

        //A file was dragged onto the droppable area, do stuff
        $('.filedrag-droparea').on("drop", function(e) {
            //Prevent bubbling or default browser handling of image drag/drop
            e.stopPropagation();
            e.preventDefault();

            //Disable hover state
            if($(this).hasClass('hover')) { $(this).removeClass('hover'); }

            //Fetch the images from the FileList object
            var files=e.originalEvent.dataTransfer.files;

            //We'll return this in the response, because it comes in handy sometimes
            var input_id = $(this).siblings('.filedrag-input').attr('id');

            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                parseFile(f, $(this));
                uploadFile(f, post_target, input_id, onComplete);
            }
        });

        $('.filedrag-droparea').on("click", function(e) {
            $(this).siblings('.filedrag-input').trigger('click');
        });

        //Handle file select
        $('.filedrag-input').change(function(e){
            var files = e.target.files;

            //We'll return this in the response, because it comes in handy sometimes
            var input_id = $(this).siblings('.filedrag-input').attr('id');

            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                parseFile(f, $(this));
                uploadFile(f, post_target, input_id, onComplete);
            }
        });

        //Show the drag and drop area
        $('.filedrag-droparea').show();
        $('.filedrag-input').hide();
    }
}

/*
 * dmuploader.js - Jquery File Uploader - 0.1
 * http://www.daniel.com.uy/projects/jquery-file-uploader/
 *
 * Copyright (c) 2013 Daniel Morales
 * Dual licensed under the MIT and GPL licenses.
 * http://www.daniel.com.uy/doc/license/
 */

(function($) {
  var pluginName = 'dmUploader';

  // These are the plugin defaults values
  var defaults = {
    url: document.URL,
    method: 'POST',
    extraData: {},
    maxFileSize: 0,
    allowedTypes: '*',
    extFilter: null,
    dataType: null,
    fileName: 'file',
    onInit: function(){},
    onFallbackMode: function() {message},
    onNewFile: function(id, file){},
    onBeforeUpload: function(id){},
    onComplete: function(){},
    onUploadProgress: function(id, percent){},
    onUploadSuccess: function(id, data){},
    onUploadError: function(id, message){},
    onFileTypeError: function(file){},
    onFileSizeError: function(file){},
    onFileExtError: function(file){}
  };

  var DmUploader = function(element, options)
  {
    this.element = $(element);

    this.settings = $.extend({}, defaults, options);

    if(!this.checkBrowser()){
      return false;
    }

    this.init();

    return true;
  };

  DmUploader.prototype.checkBrowser = function()
  {
    if(window.FormData === undefined){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Form API');

      return false;
    }

    if(this.element.find('input[type=file]').length > 0){
      return true;
    }

    if (!this.checkEvent('drop', this.element) || !this.checkEvent('dragstart', this.element)){
      this.settings.onFallbackMode.call(this.element, 'Browser doesn\'t support Ajax Drag and Drop');

      return false;
    }

    return true;
  };

  DmUploader.prototype.checkEvent = function(eventName, element)
  {
    var element = element || document.createElement('div');
    var eventName = 'on' + eventName;

    var isSupported = eventName in element;

    if(!isSupported){
      if(!element.setAttribute){
        element = document.createElement('div');
      }
      if(element.setAttribute && element.removeAttribute){
        element.setAttribute(eventName, '');
        isSupported = typeof element[eventName] == 'function';

        if(typeof element[eventName] != 'undefined'){
          element[eventName] = undefined;
        }
        element.removeAttribute(eventName);
      }
    }

    element = null;
    return isSupported;
  };

  DmUploader.prototype.init = function()
  {
    var widget = this;

    widget.queue = new Array();
    widget.queuePos = -1;
    widget.queueRunning = false;

    // -- Drag and drop event
    widget.element.on('drop', function (evt){
      evt.preventDefault();
      var files = evt.originalEvent.dataTransfer.files;

      widget.queueFiles(files);
    });

    //-- Optional File input to make a clickable area
    widget.element.find('input[type=file]').on('change', function(evt){
      var files = evt.target.files;

      widget.queueFiles(files);

      $(this).val('');
    });

    this.settings.onInit.call(this.element);
  };

  DmUploader.prototype.queueFiles = function(files)
  {
    var j = this.queue.length;

    for (var i= 0; i < files.length; i++)
    {
      var file = files[i];

      // Check file size
      if((this.settings.maxFileSize > 0) &&
          (file.size > this.settings.maxFileSize)){

        this.settings.onFileSizeError.call(this.element, file);

        continue;
      }

      // Check file type
      if((this.settings.allowedTypes != '*') &&
          !file.type.match(this.settings.allowedTypes)){

        this.settings.onFileTypeError.call(this.element, file);

        continue;
      }

      // Check file extension
      if(this.settings.extFilter != null){
        var extList = this.settings.extFilter.toLowerCase().split(';');

        var ext = file.name.toLowerCase().split('.').pop();

        if($.inArray(ext, extList) < 0){
          this.settings.onFileExtError.call(this.element, file);

          continue;
        }
      }

      this.queue.push(file);

      var index = this.queue.length - 1;

      this.settings.onNewFile.call(this.element, index, file);
    }

    // Only start Queue if we haven't!
    if(this.queueRunning){
      return false;
    }

    // and only if new Files were succefully added
    if(this.queue.length == j){
      return false;
    }

    this.processQueue();

    return true;
  };

  DmUploader.prototype.processQueue = function()
  {
    var widget = this;

    widget.queuePos++;

    if(widget.queuePos >= widget.queue.length){
      // Cleanup

      widget.settings.onComplete.call(widget.element);

      // Wait until new files are droped
      widget.queuePos = (widget.queue.length - 1);

      widget.queueRunning = false;

      return;
    }

    var file = widget.queue[widget.queuePos];

    // Form Data
    var fd = new FormData();
    fd.append(widget.settings.fileName, file);

    // Append extra Form Data
    $.each(widget.settings.extraData, function(exKey, exVal){
      fd.append(exKey, exVal);
    });

    widget.settings.onBeforeUpload.call(widget.element, widget.queuePos);

    widget.queueRunning = true;

    // Ajax Submit
    $.ajax({
      url: widget.settings.url,
      type: widget.settings.method,
      dataType: widget.settings.dataType,
      headers: widget.settings.headers,
      data: fd,
      cache: false,
      contentType: false,
      processData: false,
      forceSync: false,
      xhr: function(){
        var xhrobj = $.ajaxSettings.xhr();
        if(xhrobj.upload){
          xhrobj.upload.addEventListener('progress', function(event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total || e.totalSize;
            if(event.lengthComputable){
              percent = Math.ceil(position / total * 100);
            }

            widget.settings.onUploadProgress.call(widget.element, widget.queuePos, percent);
          }, false);
        }

        return xhrobj;
      },
      success: function (data, message, xhr){
        widget.settings.onUploadSuccess.call(widget.element, widget.queuePos, data);
      },
      error: function (xhr, status, errMsg){
        widget.settings.onUploadError.call(widget.element, widget.queuePos, errMsg);
      },
      complete: function(xhr, textStatus){
        widget.processQueue();
      }
    });
  }

  $.fn.dmUploader = function(options){
    return this.each(function(){
      if(!$.data(this, pluginName)){
        $.data(this, pluginName, new DmUploader(this, options));
      }
    });
  };

  // -- Disable Document D&D events to prevent opening the file on browser when we drop them
  $(document).on('dragenter', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('dragover', function (e) { e.stopPropagation(); e.preventDefault(); });
  $(document).on('drop', function (e) { e.stopPropagation(); e.preventDefault(); });
})(jQuery);


// jquery.focus
// ------------
// v0.1.2
//
// Copyright (c) 2012-2014 Mateus Maso
// Distributed under MIT license
//
// http://github.com/mateusmaso/jquery.focus

(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = factory(global.$);
    exports = factory(global.$);
  } else {
    factory(root.$);
  }

}(this, function($) {

  $.fn.focusBegin = function() {
    var element = this[0];
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  $.fn.focusEnd = function() {
    var element = this[0];
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  $.fn.getRange = function() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            return range;
        }
    }
    return null;
  };

  $.fn.setRange = function(range) {
    if (!range) return;
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  $.fn.setRangeByDom = function() {
    var element = this[0];
    var range = document.createRange();
    range.setStart(element, 0);
    range.setEndAfter(element);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return this;
  };

}));

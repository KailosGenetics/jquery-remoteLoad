/*

 jquery.remoteLoad.js -- Remotely load content referenced in data attribute
 https://github.com/aegixx/jquery-remoteLoad - Bryan Stone - Copyright 2015
 Dual licensed under the MIT and GPL licenses.

 */
jQuery.fn.extend({
	remoteLoad: function(options) {
		var targets = $(this);
		var options = options || {
				srcAttr: 'src',
				loadingImgClass: 'loading-img',
				errorImgClass: 'loading-error-img',
				loadingClass: 'loading',
				errorClass: 'loading-error',
				loadingContent: '',
				errorContent: ''
			};

		this.each(function() {
			var target = $(this);
			var src = target.data(options.srcAttr);
			$.ajax({
				url: src,
				dataType: 'html',
				beforeSend: function (xhr, settings) {
					target.addClass(options.loadingClass).html('<span class="' + options.loadingImgClass + '" aria-hidden="true"></span><span class="sr-only">Loading...</span>' + options.loadingContent)
				},
				success: function (data, status, xhr) {
					target.html(data);
				},
				error: function (xhr, status, error) {
					target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
				},
				complete: function() {
					target.removeClass(options.loadingClass);
				}
			});
		});

		return targets; // Allow for chaining
	}
});
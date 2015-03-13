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
					target.trigger('ajax:beforeSend');
				},
				success: function (data, status, xhr) {
					target.html(data);
					target.trigger('ajax:success');
				},
				error: function (xhr, status, error) {
					target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
					target.trigger('ajax:error');
				},
				complete: function() {
					target.removeClass(options.loadingClass);
					target.trigger('ajax:complete');
				}
			});
		});

		return targets; // Allow for chaining
	},
	remoteSubmit: function(options) {
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

		this.filter('form').each(function() {
			var form = $(this);
			var target = $($(this).data('target'));
			var src = form.attr('action') || window.location.pathname;
			var type = form.attr('method') || 'POST';

			form.submit(function (e) {
				e.preventDefault();

				$.ajax({
					url: src,
					dataType: 'html',
					type: type,
					data: form.serialize(),
					beforeSend: function (xhr, settings) {
						target.addClass(options.loadingClass).html('<span class="' + options.loadingImgClass + '" aria-hidden="true"></span><span class="sr-only">Loading...</span>' + options.loadingContent)
						form.trigger('ajax:beforeSend');
					},
					success: function (data, status, xhr) {
						target.html(data);
						form.trigger('ajax:success');
					},
					error: function (xhr, status, error) {
						target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
						form.trigger('ajax:error');
					},
					complete: function() {
						target.removeClass(options.loadingClass);
						form.trigger('ajax:complete');
					}
				});
			});

		});

		return targets; // Allow for chaining
	}
});
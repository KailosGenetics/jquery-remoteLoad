/*

 jquery.remoteLoad.js -- Remotely load content referenced in data attribute
 https://github.com/aegixx/jquery-remoteLoad - Bryan Stone - Copyright 2015
 Dual licensed under the MIT and GPL licenses.

 */
jQuery.fn.extend({
	remoteLoad: function(options) {
		var targets = $(this);
		var options = $.extend({
			srcAttr: 'src',
			loadingImgClass: 'loading-img',
			errorImgClass: 'loading-error-img',
			loadingClass: 'loading',
			errorClass: 'loading-error',
			loadingContent: '',
			errorContent: '',
			beforeSend: null,
			success: null,
			error: null,
			complete: null
		}, options);

		this.each(function() {
			var target = $(this);
			var src = target.data(options.srcAttr);
			$.ajax({
				url: src,
				dataType: 'html',
				beforeSend: function (xhr, settings) {
					target.addClass(options.loadingClass).html('<span class="' + options.loadingImgClass + '" aria-hidden="true"></span><span class="sr-only">Loading...</span>' + options.loadingContent)
					if (typeof options.beforeSend == 'function')
						options.beforeSend.call(target, xhr, settings);
					target.trigger('ajax:beforeSend');
				},
				success: function (data, status, xhr) {
					target.html(data);
					if (typeof options.success == 'function')
						options.success.call(target, data, status, xhr);
					target.trigger('ajax:success');
				},
				error: function (xhr, status, error) {
					target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
					if (typeof options.error == 'function')
						options.error.call(target, xhr, status, error);
					target.trigger('ajax:error');
				},
				complete: function(xhr, status) {
					target.removeClass(options.loadingClass);
					if (typeof options.complete == 'function')
						options.complete.call(target, xhr, status);
					target.trigger('ajax:complete');
				}
			});
		});

		return targets; // Allow for chaining
	},
	remoteSubmit: function(options) {
		var targets = $(this);
		var options = $.extend({
			targetAttr: 'target',
			loadingImgClass: 'loading-img',
			errorImgClass: 'loading-error-img',
			loadingClass: 'loading',
			errorClass: 'loading-error',
			loadingContent: '',
			errorContent: '',
			beforeSend: null,
			success: null,
			error: null,
			complete: null
		}, options);

		this.filter('form').each(function() {
			var form = $(this);
			var target = $($(this).data(options.targetAttr));
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
						if (typeof options.beforeSend == 'function')
							options.beforeSend.call(form, xhr, settings);
						form.trigger('ajax:beforeSend');
					},
					success: function (data, status, xhr) {
						target.html(data);
						if (typeof options.success == 'function')
							options.success.call(form, data, status, xhr);
						form.trigger('ajax:success');
					},
					error: function (xhr, status, error) {
						target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
						if (typeof options.error == 'function')
							options.error.call(form, xhr, status, error);
						form.trigger('ajax:error');
					},
					complete: function(xhr, status) {
						target.removeClass(options.loadingClass);
						if (typeof options.complete == 'function')
							options.complete.call(form, xhr, status);
						form.trigger('ajax:complete');
					}
				});
			});

		});

		return targets; // Allow for chaining
	}
});
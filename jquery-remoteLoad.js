/*

 jquery.remoteLoad.js -- Remotely load content referenced in data attribute
 https://github.com/aegixx/jquery-remoteLoad - Bryan Stone - Copyright 2015
 Dual licensed under the MIT and GPL licenses.

 */
jQuery.fn.extend({
	remoteLoad: function(options) {
		var targets = $(this);
		var options = $.extend({
			srcAttr: 'src',                         // Data attribute for remote src
			loadedAttr: 'loaded',                   // Data attribute to use once loaded
			loadingImgClass: 'loading-img',         // Class for loading image (empty span)
			errorImgClass: 'loading-error-img',     // Class for error image (empty span)
			loadingClass: 'loading',                // Class for loading content
			errorClass: 'loading-error',            // Class for error content
			errorContent: '',                       // HTML content to display while loading
			loadingContent: '',                     // HTML content to display when an error occurs
			beforeSend: null,                       // ajax:beforeSend Callback function
			success: null,                          // ajax:success Callback function
			error: null,                            // ajax:error Callback function
			complete: null,                         // ajax:complete Callback function
			force: false                            // Forces reload of data, even if it is already loaded
		}, options);

		this.each(function() {
			var target = $(this);
			var src = target.data(options.srcAttr);
			// Skip if already loaded (unless force is enabled)
			if (target.data(options.loadedAttr) && !options.force)
				return true;

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
					target.data(options.loadedAttr, true);
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
			target: null,                           // Forced element to use as a target for the response
																							//   (takes precedence over targetAttr)
			targetAttr: 'target',                   // Data attribute to examine for elements to update with form response
			loadingImgClass: 'loading-img',         // Class for loading image (empty span)
			errorImgClass: 'loading-error-img',     // Class for error image (empty span)
			loadingClass: 'loading',                // Class for loading content
			errorClass: 'loading-error',            // Class for error content
			errorContent: '',                       // HTML content to display while loading
			loadingContent: '',                     // HTML content to display when an error occurs
			beforeSend: null,                       // ajax:beforeSend Callback function
			success: null,                          // ajax:success Callback function
			error: null,                            // ajax:error Callback function
			complete: null                          // ajax:complete Callback function
		}, options);

		this.filter('form').each(function() {
			var form = $(this);
			var target = options.target ? $(options.target) : $($(this).data(options.targetAttr));
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
						if (typeof options.beforeSend == 'function') {
							if (!options.beforeSend.call(form, xhr, settings))
								return false;
						}
						if (!form.trigger('ajax:beforeSend'))
							return false;
					},
					success: function (data, status, xhr) {
						target.html(data);
						if (typeof options.success == 'function')
							options.success.call(target, data, status, xhr);
						form.trigger('ajax:success');
					},
					error: function (xhr, status, error) {
						target.addClass(options.errorClass).html('<span class="' + options.errorImgClass + '" aria-hidden="true"></span><span class="sr-only">Error!</span>' + options.errorContent)
						if (typeof options.error == 'function')
							options.error.call(target, xhr, status, error);
						form.trigger('ajax:error');
					},
					complete: function(xhr, status) {
						target.removeClass(options.loadingClass);
						if (typeof options.complete == 'function')
							options.complete.call(target, xhr, status);
						form.trigger('ajax:complete');
					}
				});
			});

		});

		return targets; // Allow for chaining
	}
});
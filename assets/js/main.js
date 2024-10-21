/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Forms.
		var $form = $('form');

		// Auto-resizing textareas.
			$form.find('textarea').each(function() {

				var $this = $(this),
					$wrapper = $('<div class="textarea-wrapper"></div>'),
					$submits = $this.find('input[type="submit"]');

				$this
					.wrap($wrapper)
					.attr('rows', 1)
					.css('overflow', 'hidden')
					.css('resize', 'none')
					.on('keydown', function(event) {

						if (event.keyCode == 13
						&&	event.ctrlKey) {

							event.preventDefault();
							event.stopPropagation();

							$(this).blur();

						}

					})
					.on('blur focus', function() {
						$this.val($.trim($this.val()));
					})
					.on('input blur focus --init', function() {

						$wrapper
							.css('height', $this.height());

						$this
							.css('height', 'auto')
							.css('height', $this.prop('scrollHeight') + 'px');

					})
					.on('keyup', function(event) {

						if (event.keyCode == 9)
							$this
								.select();

					})
					.triggerHandler('--init');

				// Fix.
					if (browser.name == 'ie'
					||	browser.mobile)
						$this
							.css('max-height', '10em')
							.css('overflow-y', 'auto');

			});






})(jQuery);

$(window).on('load', function() {
    $('#footer-placeholder').load('footer.html')
    $('#menu-placeholder').load('menu.html', function() {
        // Menu.
        var $body = $('body');
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle()

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});


    // Load the settings panel HTML from external file
$.get('settings-panel.html', function(data) {
    $body.append(data); // Append settings panel HTML to body

    const $settingsPanel = $('#settings-panel');

    // Wrap inner content and lock mechanism (same as menu)
    $settingsPanel.wrapInner('<div class="inner"></div>');

    $settingsPanel._locked = false;

    $settingsPanel._lock = function() {
        if ($settingsPanel._locked)
            return false;

        $settingsPanel._locked = true;

        window.setTimeout(function() {
            $settingsPanel._locked = false;
        }, 350);

        return true;
    };

    $settingsPanel._show = function() {
        if ($settingsPanel._lock())
            $body.addClass('is-settings-visible');
    };

    $settingsPanel._hide = function() {
        if ($settingsPanel._lock())
            $body.removeClass('is-settings-visible');
    };

    $settingsPanel._toggle = function() {
    if ($settingsPanel._lock()) {
        $body.toggleClass('is-settings-visible');
    }
};


    $settingsPanel
        .on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', '.close', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $settingsPanel._hide();
        });

    // Bind event for settings panel toggle
    $menu
    .on('click', 'a[href="#settings-panel"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $settingsPanel._toggle();  // This should toggle visibility
        })
        .on('click', function(event) {
            $settingsPanel._hide();
        })
        .on('keydown', function(event) {
            if (event.keyCode == 27) // ESC key
                $settingsPanel._hide();
        });

    // Dark mode toggle functionality
        $('#dark-mode').on('change', function() {
            if ($(this).is(':checked')) {
                $body.addClass('dark-mode'); // Activate dark mode
                $(document).ready(function() {
                    // Dynamically add the scrollbar-color CSS rule
                        $('<style id="dark-mode-style">* { scrollbar-color: #454a4d #202324; }</style>').appendTo('head');
                });

            } else {
                $body.removeClass('dark-mode'); // Deactivate dark mode
                // Remove the dynamically added style
                $('#dark-mode-style').remove();
            }
        });
        // Close the settings panel when clicking outside of it
        $(document).on('click', function(event) {
            // If the click is outside the settings panel and not on the settings link
            if (!$(event.target).closest('#settings-panel, #menu-settings-link').length) {
                $settingsPanel._hide();
            }
        });

    console.log("Event listener for settings panel attached");
});
    });
});


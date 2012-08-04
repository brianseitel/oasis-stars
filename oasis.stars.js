var Oasis = {};

/**
 * Search Class
 * @author  Brian Seitel
 * @version  0.0.1
 */
;(function(global) { var
	API = {
		rate: 'rate.php'
	},
	RXP = {
		html: /(<([^>]+)>)/ig,
		whitespace: /^\s+|\s+$/g,
		newLines: /(\r\n|\n|\r)/gm,
		tab: /\t/g
	},
	TEXT = {
		space: ' ',
		blank: ''
	},
	TIME = {
		hide: 2500
	},
	SPEED = {
		delay: 500
	},
	NS = Oasis,
	$ = jQuery;

	/*
	* trim string whitespace
	*
	* @param {string} sValue | string to trim
	* @return {string} | trimmed string
	*/
	function trim(sValue) {
		return sValue.replace(RXP.whitespace, TEXT.blank);
	}

	var _class = function(container, options) { this.init(container, options); };
	NS.Stars = _class;

	/**
	* Public Methods
	*/
	_class.prototype = {

		init: function(container, options) {
			this.options = $.extend({
				onSuccess: $.noop,
				onFail: $.noop,
				rateURL: API.rate,
				starCount: 5,
				currentScore: 0
			}, options || {});


			this.container = container;
			this.universe_id = this.container.data('id');
			this.stars = null;
			this.starred = {};

			this.timer = { throttle: null };
			this.xhr = false;

			this.bigBang(this.options.starCount); // Five stars
			this.addEventListeners();
			this.setStars(this.options.currentScore);
		},

		addEventListeners: function() { var
			self = this;

			if (this.container.hasClass('nohover')) return;

			this.stars
				.bind('hover', function() {
					self.doHover(this);
				});

			this.container
				.bind('mouseleave', $.proxy(this.resetStars, this));

			this.stars
				.bind('click', function() {
					self.doRate(this);
				});
		},
		
		bigBang: function(star_count) {
			for (var i = 1; i < star_count + 1; i++) {
				this.fuseStar(i);
			}

			this.stars = $('.star', this.container);
		},

		doHover: function(item) { var
			index;

			this.stars.each(function(i, star) {
				if (i > index)
					$(star).removeClass('hover');
				else
					$(star).addClass('hover');

				if ($(star).is(item))
					index = i;
			});
		},

		doRate: function(item) { var
			index = $(item).data('value') - 1,
			self = this,
			score = $(item).data('value'),
			destination = this.options.rateURL;
			
			this.stars.removeClass('starred');
			this.stars.each(function(i, star) {
				if (i <= index)
					$(star).addClass('starred').addClass('hover');
			});

			this.clearXHR();

			this.xhr = $.ajax({
				url: destination,
				data: $.extend(this.options.params, { score: score, universe_id: this.universe_id }),
				type: "POST",
			})
			.done(this.options.onSuccess)
			.fail(this.options.onFail);
		},

		fuseStar: function(id) { var
			star = $('<span class="star" data-value="'+id+'"/>');

			this.container
				.append(star);
		},

		setStars: function(score) {
			this.stars.each(function(i, item) {
				if (i < score)
					$(item).addClass('hover');
			});
		},

		resetStars: function() {
			$('.star', this.container).removeClass('hover');
			$('.starred', this.container).addClass('hover');
		},

		/*
		* Abort previous request if it exists
		*/
		clearXHR: function() {
			if (typeof this.xhr === 'object') this.xhr.abort();
			this.xhr = false;
		}
	};

})(window);
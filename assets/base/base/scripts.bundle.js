/**
 * @class mApp DB App class
 */

var mApp = function() {
    
    /**
    * Initializes bootstrap tooltips
    */
    var initTooltips = function() {
        // init bootstrap tooltips
        $('[data-toggle="m-tooltip"]').each(function() {
            var el = $(this);
            var skin = el.data('skin') ? 'm-tooltip--skin-' + el.data('skin') : '';
            
            el.tooltip({
                template: '<div class="m-tooltip ' + skin + ' tooltip" role="tooltip">\
                    <div class="arrow"></div>\
                    <div class="tooltip-inner"></div>\
                </div>'
            });
        });
    }

    /**
    * Initializes bootstrap popovers
    */
    var initPopovers = function() {
        // init bootstrap popover
        $('[data-toggle="m-popover"]').each(function() {
            var el = $(this);
            var skin = el.data('skin') ? 'm-popover--skin-' + el.data('skin') : '';
            
            el.popover({
                template: '\
                <div class="m-popover ' + skin + ' popover" role="tooltip">\
                    <div class="arrow"></div>\
                    <h3 class="popover-header"></h3>\
                    <div class="popover-body"></div>\
                </div>'
            });
        });
    }

    /**
    * Initializes scrollable contents
    */
    var initScrollables = function() {
        $('[data-scrollable="true"]').each(function(){
            var maxHeight;
            var height;
            var el = $(this);

            if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                if (el.data('mobile-max-height')) {
                    maxHeight = el.data('mobile-max-height');
                } else {
                    maxHeight = el.data('max-height');
                }

                if (el.data('mobile-height')) {
                    height = el.data('mobile-height');
                } else {
                    height = el.data('height');
                }
            } else {
                maxHeight = el.data('max-height');
                height = el.data('max-height');
            }

            if (maxHeight) {
                el.css('max-height', maxHeight);
            }
            if (height) {
                el.css('height', height);
            }

            mApp.initScroller(el, {});
        });
    }

    /**
    * Initializes bootstrap alerts
    */
    var initAlerts = function() {
        // init bootstrap popover
        $('body').on('click', '[data-close=alert]', function() {
            $(this).closest('.alert').hide();
        });
    }        

    return {

        /**
        * Main class initializer
        */
        init: function() {
            mApp.initComponents();
        },

        /**
        * Initializes components
        */
        initComponents: function() {
            initScrollables();
            initTooltips();
            initPopovers();
            initAlerts();
        },

        /**
        * Scrolls to an element with animation
        * @param {object} el jQuery element object
        * @param {number} offset Offset to element scroll position
        */
        scrollTo: function(el, offset) {
            var pos = (el && el.length > 0) ? el.offset().top : 0;
            pos = pos + (offset ? offset : 0);

            jQuery('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        /**
        * Scrolls until element is centered in the viewport 
        * @param {object} el jQuery element object
        */
        // wrJangoer function to scroll(focus) to an element
        scrollToViewport: function(el) {
            var elOffset = el.offset().top;
            var elHeight = el.height();
            var windowHeight = mUtil.getViewPort().height;
            var offset = elOffset - ((windowHeight / 2) - (elHeight / 2));

            jQuery('html,body').animate({
                scrollTop: offset
            }, 'slow');
        },

        /**
        * Scrolls to the top of the page
        */
        // function to scroll to the top
        scrollTop: function() {
            mApp.scrollTo();
        },

        /**
        * Initializes scrollable content using mCustomScrollbar plugin
        * @param {object} el jQuery element object
        * @param {object} options mCustomScrollbar plugin options(refer: http://manos.malihu.gr/jquery-custom-content-scroller/)
        */
        initScroller: function(el, options) {
            if (mUtil.isMobileDevice()) {
                el.css('overflow', 'auto');
            } else {
                el.mCustomScrollbar("destroy");
                el.mCustomScrollbar({
                    scrollInertia: 0,
                    autoDraggerLength: true,
                    autoHideScrollbar: true,
                    autoExpandScrollbar: false,
                    alwaysShowScrollbar: 0,
                    axis: el.data('axis') ? el.data('axis') : 'y', 
                    mouseWheel: {
                        scrollAmount: 120,
                        preventDefault: true
                    },         
                    setHeight: (options.height ? options.height : ''),
                    theme:"minimal-dark"
                });
            }           
        },

        /**
        * Destroys scrollable content's mCustomScrollbar plugin instance
        * @param {object} el jQuery element object
        */
        destroyScroller: function(el) {
            el.mCustomScrollbar("destroy");
        },

        /**
        * Shows bootstrap alert
        * @param {object} options
        * @returns {string} ID attribute of the created alert
        */
        alert: function(options) {
            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container 
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = mUtil.getUniqueID("App_alert");

            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.custom-alerts').remove();
            }

            if (!options.container) {
                if ($('.page-fixed-main-content').size() === 1) {
                    $('.page-fixed-main-content').prepend(html);
                } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                mApp.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function() {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },

        /**
        * Blocks element with loading indiciator using http://malsup.com/jquery/block/
        * @param {object} target jQuery element object
        * @param {object} options 
        */
        block: function(target, options) {
            options = $.extend(true, {
                opacity: 0.1,
                overlayColor: '',
                state: 'brand',
                type: 'spinner',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);

            var skin;
            var state;
            var loading;

            if (options.type == 'spinner') {
                skin = options.skin ? 'm-spinner--skin-' + options.skin : '';
                state = options.state ? 'm-spinner--' + options.state : '';
                loading = '<div class="m-spinner ' + skin + ' ' + state + '"></div';
            } else {
                skin = options.skin ? 'm-loader--skin-' + options.skin : '';
                state = options.state ? 'm-loader--' + options.state : '';
                size = options.size ? 'm-loader--' + options.size : '';
                loading = '<div class="m-loader ' + skin + ' ' + state + ' ' + size + '"></div';
            }

            if (options.message && options.message.length > 0) {
                var classes = 'm-blockui ' + (options.shadow === false ? 'm-blockui-no-shadow' : '');

                html = '<div class="' + classes + '"><span>' + options.message + '</span><span>' + loading + '</span></div>';
                options.width = mUtil.realWidth(html) + 10;
                if (target == 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-'+ (options.width / 2) +'px;"><span>' + options.message + '</span><span>' + loading + '</span></div>';
                }
            } else {
                html = loading;
            }

            var params = {
                message: html,
                centerY: options.centerY,
                centerX: options.centerX,
                css: {
                    top: '30%',
                    left: '50%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
                    width: options.width
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor,
                    opacity: options.opacity,
                    cursor: 'wait'
                },
                onUnblock: function() {
                    el.css('position', '');
                    el.css('zoom', '');
                }
            };

            if (target == 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },

        /**
        * Un-blocks the blocked element 
        * @param {object} target jQuery element object
        */
        unblock: function(target) {
            if (target && target != 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },

        /**
        * Blocks the page body element with loading indicator
        * @param {object} options 
        */
        blockPage: function(options) {
            return mApp.block('body', options);
        },

        /**
        * Un-blocks the blocked page body element
        */
        unblockPage: function() {
            return mApp.unblock('body');
        }
    };
}();

//== Initialize mApp class on document ready
$(document).ready(function() {
    mApp.init();
});
/**
 * @class mUtil  DB base utilize class that privides helper functions
 */

var mUtil = function() {
    var resizeHandlers = [];

    /** @type {object} breakpoints The device width breakpoints **/
    var breakpoints = {        
        sm: 544, // Small screen / phone           
        md: 768, // Medium screen / tablet            
        lg: 992, // Large screen / desktop        
        xl: 1200 // Extra large screen / wide desktop
    };

    /** @type {object} colors State colors **/
    var colors = {
        brand:      '#716aca',
        metal:      '#c4c5d6',
        light:      '#ffffff',
        accent:     '#00c5dc',
        primary:    '#5867dd',
        success:    '#34bfa3',
        info:       '#36a3f7',
        warning:    '#ffb822',
        danger:     '#f4516c'
    };

    /**
    * Handle window resize event with some 
    * delay to attach event handlers upon resize complete 
    */
    var _windowResizeHandler = function() {
        var resize;
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        jQuery(window).resize(function() {
            if (resize) {
                clearTimeout(resize);
            }
            resize = setTimeout(function() {
                _runResizeHandlers();
            }, 250); // wait 50ms until window resize finishes.
        });
    };

    return {
        /**
        * Class main initializer.
        * @param {object} options.
        * @returns null
        */
        //main function to initiate the theme
        init: function(options) {
            if (options && options.breakpoints) {
                breakpoints = options.breakpoints;
            }

            if (options && options.colors) {
                colors = options.colors;
            }

            _windowResizeHandler();
        },

        /**
        * Adds window resize event handler.
        * @param {function} callback function.
        */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
        * Trigger window resize handlers.
        */
        runResizeHandlers: function() {
            _runResizeHandlers();
        },        

        /**
        * Get GET parameter value from URL.
        * @param {string} paramName Parameter name.
        * @returns {string}  
        */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
        * Checks whether current device is mobile touch.
        * @returns {boolean}  
        */
        isMobileDevice: function() {
            try {
                document.createEvent("TouchEvent");
                if (typeof window.orientation !== 'undefined' || 'ontouchstart' in document.documentElement) {
                    return (this.getViewPort().width < this.getBreakpoint('xl') ? true : false);
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        },

        /**
        * Checks whether current device is desktop.
        * @returns {boolean}  
        */
        isDesktopDevice: function() {
            return mUtil.isMobileDevice() ? false : true;
        },

        /**
        * Gets browser window viewport size. Ref: http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        * @returns {object}  
        */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        /**
        * Checks whether given device mode is currently activated.
        * @param {string} mode Responsive mode name(e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
        * @returns {boolean}  
        */
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;

            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            }

            return false;
        },

        /**
        * Generates unique ID for give prefix.
        * @param {string} prefix Prefix for generated ID
        * @returns {boolean}  
        */
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
        * Gets window width for give breakpoint mode.
        * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
        * @returns {number}  
        */
        getBreakpoint: function(mode) {
            if ($.inArray(mode, breakpoints)) {
                return breakpoints[mode];
            }
        },

        /**
        * Checks whether object has property matchs given key path.
        * @param {object} obj Object contains values paired with given key path
        * @param {string} keys Keys path seperated with dots
        * @returns {object}  
        */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
        * Gets highest z-index of the given element parents
        * @param {object} el jQuery element object
        * @returns {number}  
        */
        getHighestZindex: function(el) {
            var elem = $(el),
                position, value;

            while (elem.length && elem[0] !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = elem.css("position");

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(elem.css("zIndex"), 10);
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        },

        /**
        * Checks whether the element has given classes
        * @param {object} el jQuery element object
        * @param {string} Classes string
        * @returns {boolean}  
        */
        hasClasses: function(el, classes) {
            var classesArr = classes.split(" ");

            for ( var i = 0; i < classesArr.length; i++ ) {
                if ( el.hasClass( classesArr[i] ) == false ) {
                    return false;
                }
            }                

            return true;
        },

        /**
        * Gets element actual/real width
        * @param {object} el jQuery element object
        * @returns {number}  
        */
        realWidth: function(el){
            var clone = $(el).clone();
            clone.css("visibility","hidden");
            clone.css('overflow', 'hidden');
            clone.css("height","0");
            $('body').append(clone);
            var width = clone.outerWidth();
            clone.remove();

            return width;
        },

        /**
        * Checks whether the element has any parent with fixed position
        * @param {object} el jQuery element object
        * @returns {boolean}  
        */
        hasFixedPositionedParent: function(el) {
            var result = false;
            
            el.parents().each(function () {
                if ($(this).css('position') == 'fixed') {
                    result = true;
                    return;
                }
            });

            return result;
        },

        /**
        * Gets randomly generated integer value within given min and max range
        * @param {number} min Range start value
        * @param {number} min Range end value
        * @returns {number}  
        */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
        * Gets state color's hex code by color name
        * @param {string} name Color name
        * @returns {string}  
        */
        getColor: function(name) {
            return colors[name];
        },

        /**
        * Checks whether Angular library is included
        * @returns {boolean}  
        */
        isAngularVersion: function() {
            return window.Zone !== undefined  ? true : false;
        }
    }
}();

//== Initialize mUtil class on document ready
$(document).ready(function() {
    mUtil.init();
});
// jquery extension to add animation class into element
jQuery.fn.extend({
    animateClass: function(animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        jQuery(this).addClass('animated ' + animationName).one(animationEnd, function() {
            jQuery(this).removeClass('animated ' + animationName);
        });

        if (callback) {
            jQuery(this).one(animationEnd, callback);
        }
    },
    animateDelay: function(value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-delay', value);
        }
    },
    animateDuration: function(value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-duration', value);
        }
    }
});
(function ($) {

	if (typeof mUtil === 'undefined') {
		throw new Error('mUtil is required and must be included before mDatatable.');
	}

	// plugin setup
	$.fn.mDatatable = function (options) {
		if ($(this).length === 0) return;
		if ($(this).hasClass('m-datatable--loaded')) return;
		if ($(this).attr('id') === '') throw new Error('ID is required.');

		// global variables
		var datatable = this;

		// debug enabled?
		// 1) state will be cleared on each refresh
		// 2) etc.
		datatable.debug = false;

		/********************
		 ** PRIVATE METHODS
		 ********************/
		var dt = {
			offset: 110,
			stateId: 'm-meta',

			init: function (options) {
				dt.setupBaseDOM.call();
				dt.setupDOM(datatable.table);

				// on event after layout had done setup, show datatable
				$(datatable).on('m-datatable--on-layout-updated', dt.afterRender);

				if (datatable.debug) dt.stateRemove(dt.stateId);

				// get data
				if (options.data.type === 'remote' || options.data.type === 'local') {
					if (options.data.saveState === false
						|| options.data.saveState.cookie === false
						&& options.data.saveState.webstorage === false) {
						dt.stateRemove(dt.stateId);
					}
					// get data for local
					if (options.data.type === 'local' && typeof options.data.source === 'object') {
						datatable.jsonData = dt.dataMapCallback(options.data.source);
					}
					dt.dataRender();
				}

				dt.setHeadTitle.call();
				dt.setHeadTitle.call(this, datatable.tableFoot);

				// for normal table, setup layout right away
				if (options.data.type === null) {
					dt.setupCellField.call();
					dt.setupTemplateCell.call();
					// setup extra system column properties
					dt.setupSystemColumn.call();
				}

				// hide header
				if (typeof options.layout.header !== 'undefined' && options.layout.header === false) {
					$(datatable.table).find('thead').remove();
				}

				// hide footer
				if (typeof options.layout.footer !== 'undefined' && options.layout.footer === false) {
					$(datatable.table).find('tfoot').remove();
				}

				// for normal, run layoutUpdate
				if (options.data.type === null || options.data.type === 'local') dt.layoutUpdate();

				$(window).resize(dt.fullRender);

				// main menu collapse, redraw datatable when document size changed
				// new ResizeSensor(datatable, function () {
				// 	API.redraw();
				// });

				$(datatable).height('');

				return datatable;
			},

			/**
			 * This method will run each time window resize
			 */
			layoutUpdate: function () {
				// setup nested datatable, if option enabled
				dt.setupSubDatatable.call();

				// setup extra system column properties
				dt.setupSystemColumn.call();

				dt.columnHide.call();

				dt.sorting.call();

				// setup cell hover event
				dt.setupHover.call();

				if (options.layout.scroll && typeof options.detail === 'undefined'
					// temporary disable lock column in subtable
					&& dt.getDepth() === 1) {
					// lock columns handler
					dt.lockTable.call();
				}

				$(datatable).trigger('m-datatable--on-layout-updated', {table: $(datatable.table).attr('id')});
			},

			lockTable: function () {
				// todo; revise lock table responsive
				var lock = {
					lockEnabled: false,
					init: function () {
						// check if table should be locked columns
						lock.lockEnabled = $.grep(options.columns, function (n, i) {
							return typeof n.locked !== 'undefined' && n.locked !== false;
						});
						if (lock.lockEnabled.length === 0) return;

						if (!dt.isLocked()) {
							// for disable lock table
							datatable.oriTable = $(datatable.table).clone();
						}

						lock.enable();
					},
					enable: function () {
						var enableLock = function (tablePart) {
							var lockEnabled = lock.lockEnabledColumns();
							if (lockEnabled.left.length === 0 && lockEnabled.right.length === 0) {
								return;
							}

							// check if already has lock column
							if ($(tablePart).find('.m-datatable__lock').length > 0) {
								dt.log('Locked container already exist in: ', tablePart);
								return;
							}
							// check if no rows exists
							if ($(tablePart).find('.m-datatable__row').length === 0) {
								dt.log('No row exist in: ', tablePart);
								return;
							}

							// locked div container
							var lockLeft = $('<div/>').addClass('m-datatable__lock m-datatable__lock--left');
							var lockScroll = $('<div/>').addClass('m-datatable__lock m-datatable__lock--scroll');
							var lockRight = $('<div/>').addClass('m-datatable__lock m-datatable__lock--right');

							$(tablePart).find('.m-datatable__row').each(function () {
								var rowLeft = $('<tr/>').addClass('m-datatable__row').appendTo(lockLeft);
								var rowScroll = $('<tr/>').addClass('m-datatable__row').appendTo(lockScroll);
								var rowRight = $('<tr/>').addClass('m-datatable__row').appendTo(lockRight);
								$(this).find('.m-datatable__cell').each(function () {
									var locked = $(this).data('locked');
									if (typeof locked !== 'undefined') {
										if (typeof locked.left !== 'undefined' || locked === true) {
											// default locked to left
											$(this).appendTo(rowLeft);
										}
										if (typeof locked.right !== 'undefined') {
											$(this).appendTo(rowRight);
										}
									} else {
										$(this).appendTo(rowScroll);
									}
								});
								// remove old row
								$(this).remove();
							});

							if (lockEnabled.left.length > 0) {
								$(datatable).addClass('m-datatable--lock');
								$(lockLeft).appendTo(tablePart);
							}
							if (lockEnabled.left.length > 0 || lockEnabled.right.length > 0) {
								$(lockScroll).appendTo(tablePart);
							}
							if (lockEnabled.right.length > 0) {
								$(datatable).addClass('m-datatable--lock');
								$(lockRight).appendTo(tablePart);
							}
						};

						$(datatable.table).children().each(function () {
							var tablePart = this;
							if ($(this).find('.m-datatable__lock').length === 0) {
								$(this).ready(function () {
									enableLock(tablePart);
								});
							}
						});
					},
					/**
					 * Check if columns have locked enabled
					 * @returns {{left: Array, right: Array}}
					 */
					lockEnabledColumns: function () {
						var screen = $(window).width();
						var columns = options.columns;
						var enabled = {left: [], right: []};
						$.each(columns, function (i, column) {
							if (typeof column.locked !== 'undefined') {
								if (typeof column.locked.left !== 'undefined') {
									if (mUtil.getBreakpoint(column.locked.left) <= screen) {
										enabled['left'].push(column.locked.left);
									}
								}
								if (typeof column.locked.right !== 'undefined') {
									if (mUtil.getBreakpoint(column.locked.right) <= screen) {
										enabled['right'].push(column.locked.right);
									}
								}
							}
						});
						return enabled;
					}
				};
				lock.init();
				return lock;
			},

			/**
			 * Render everything for resize
			 */
			fullRender: function () {
				if (dt.isLocked()) {
					var content = $(datatable.oriTable).children();
					if (content.length > 0) {
						$(datatable).removeClass('m-datatable--lock');
						$(datatable.table).empty().html(content);
						datatable.oriTable = null;
						dt.setupCellField.call();
						API.redraw();
					}
					dt.updateTableComponents.call();
				}
				dt.updateRawData();
				dt.dataRender();
			},

			/**
			 * After render event, called by m-datatable--on-layout-updated
			 * @param e
			 * @param args
			 */
			afterRender: function (e, args) {
				if (args.table === $(datatable.table).attr('id')) {
					if (!dt.isLocked()) API.redraw();
					$(datatable).ready(function () {
						// row even class
						$(datatable.tableBody).find('.m-datatable__row:even').addClass('m-datatable__row--even');
						if (dt.isLocked()) API.redraw();
						$(datatable.tableBody).css('visibility', '');
						$(datatable).addClass('m-datatable--loaded');
						dt.scrollbar.call();
						dt.spinnerCallback(false);
					});
				}
			},

			setupHover: function () {
				$(datatable.tableBody).find('.m-datatable__cell').off('mouseenter', 'mouseleave')
					.on('mouseenter', function () {
						// normal table
						var row = $(this).closest('.m-datatable__row').addClass('m-datatable__row--hover');
						var index = $(row).index() + 1;

						// lock table
						$(row).closest('.m-datatable__lock').parent().find('.m-datatable__row:nth-child(' + index + ')')
							.addClass('m-datatable__row--hover');
					})
					.on('mouseleave', function () {
						// normal table
						var row = $(this).closest('.m-datatable__row').removeClass('m-datatable__row--hover');
						var index = $(row).index() + 1;

						// look table
						$(row).closest('.m-datatable__lock').parent().find('.m-datatable__row:nth-child(' + index + ')')
							.removeClass('m-datatable__row--hover');
					});
			},

			/**
			 * Adjust width of locked table containers by resize handler
			 * @returns {number}
			 */
			adjustLockContainer: function () {
				if (!dt.isLocked()) return 0;

				// refer to head dimension
				var containerWidth = $(datatable.tableHead).width();
				var lockLeft = $(datatable.tableHead).find('.m-datatable__lock--left').width();
				var lockRight = $(datatable.tableHead).find('.m-datatable__lock--right').width();

				if (typeof lockLeft === 'undefined') lockLeft = 0;
				if (typeof lockRight === 'undefined') lockRight = 0;

				var lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
				$(datatable.table).find('.m-datatable__lock--scroll').css('width', lockScroll);

				return lockScroll;
			},

			/**
			 * todo; not in use
			 */
			dragResize: function () {
				var pressed = false;
				var start = undefined;
				var startX, startWidth;
				$(datatable.tableHead).find('.m-datatable__cell').mousedown(function (e) {
					start = $(this);
					pressed = true;
					startX = e.pageX;
					startWidth = $(this).width();
					$(start).addClass('m-datatable__cell--resizing');

				}).mousemove(function (e) {
					if (pressed) {
						var i = $(start).index();
						var tableBody = $(datatable.tableBody);
						var ifLocked = $(start).closest('.m-datatable__lock');

						if (ifLocked) {
							var lockedIndex = $(ifLocked).index();
							tableBody = $(datatable.tableBody).find('.m-datatable__lock').eq(lockedIndex);
						}

						$(tableBody).find('.m-datatable__row').each(function (tri, tr) {
							$(tr).find('.m-datatable__cell').eq(i)
								.width(startWidth + (e.pageX - startX))
								.children().width(startWidth + (e.pageX - startX));
						});

						$(start).children().width(startWidth + (e.pageX - startX));
					}

				}).mouseup(function () {
					$(start).removeClass('m-datatable__cell--resizing');
					pressed = false;
				});

				$(document).mouseup(function () {
					$(start).removeClass('m-datatable__cell--resizing');
					pressed = false;
				});
			},

			/**
			 * To prepare placeholder for table before content is loading
			 */
			initHeight: function () {
				if (options.layout.height && options.layout.scroll) {
					var theadHeight = $(datatable.tableHead).find('.m-datatable__row').height();
					var tfootHeight = $(datatable.tableFoot).find('.m-datatable__row').height();
					var bodyHeight = options.layout.height;
					if (typeof theadHeight !== 'undefined') bodyHeight -= theadHeight;
					if (typeof tfootHeight !== 'undefined') bodyHeight -= tfootHeight;
					$(datatable.tableBody).height(bodyHeight);
				}
			},

			/**
			 * Setup base DOM (table, thead, tbody, tfoot) and create if not exist.
			 */
			setupBaseDOM: function () {
				// keep original state before mDatatable initialize
				datatable.old = $(datatable).clone();

				if (options.layout.height) $(datatable).height(options.layout.height);

				// main element
				if ($(datatable).prop('tagName') === 'TABLE') {
					// if main init element is <table>, wrap with div
					datatable.table = $(datatable).removeClass('m-datatable').addClass('m-datatable__table');
					if ($(datatable.table).parents('.m-datatable').length === 0) {
						datatable.wrap = $('<div/>').addClass('m-datatable').addClass('m-datatable--' + options.layout.theme);
						datatable.table.wrap(datatable.wrap);
					}
				} else {
					// create table
					datatable.wrap = $(datatable).addClass('m-datatable').addClass('m-datatable--' + options.layout.theme);
					datatable.table = $('<table/>').addClass('m-datatable__table').appendTo(datatable);
				}

				if (typeof options.layout.class !== 'undefined') {
					$(datatable.wrap).addClass(options.layout.class);
				}

				$(datatable.table).removeClass('m-datatable--destroyed')
					.css('display', 'block').attr('id', mUtil.getUniqueID('m-datatable--'));

				// predefine table height
				if (options.layout.height) $(datatable.table).height(options.layout.height);

				// for normal table load
				if (options.data.type === null) {
					$(datatable.table).css('width', '').css('display', '');
				}

				// create table head element
				datatable.tableHead = $(datatable.table).find('thead');
				if ($(datatable.tableHead).length === 0) {
					datatable.tableHead = $('<thead/>').prependTo(datatable.table);
				}

				// create table head element
				datatable.tableBody = $(datatable.table).find('tbody');
				if ($(datatable.tableBody).length === 0) {
					datatable.tableBody = $('<tbody/>').appendTo(datatable.table);
				}

				if (typeof options.layout.footer !== 'undefined' && options.layout.footer) {
					// create table foot element
					datatable.tableFoot = $(datatable.table).find('tfoot');
					if ($(datatable.tableFoot).length === 0) {
						datatable.tableFoot = $('<tfoot/>').appendTo(datatable.table);
					}
				}
			},

			/**
			 * Set column data before table manipulation.
			 */
			setupCellField: function (tableParts) {
				if (typeof tableParts === 'undefined') tableParts = $(datatable.table).children();
				var columns = options.columns;
				$.each(tableParts, function (part, tablePart) {
					$(tablePart).find('.m-datatable__row').each(function (tri, tr) {
						// prepare data
						$(tr).find('.m-datatable__cell').each(function (tdi, td) {
							if (typeof columns[tdi] !== 'undefined') {
								$(td).data(columns[tdi]);
							}
						});
					});
				});
			},

			/**
			 * Set column template callback
			 * @param tablePart
			 */
			setupTemplateCell: function (tablePart) {
				if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
				var columns = options.columns;
				$(tablePart).find('.m-datatable__row').each(function (tri, tr) {
					// row data object, if any
					var obj = $(tr).data('obj');
					obj.rowIndex = tri;
					obj['getIndex'] = function () {
						return tri;
					};
					obj['getDatatable'] = function () {
						return datatable;
					};

					// if data object is undefined, collect from table
					if (typeof obj === 'undefined') {
						obj = {};
						$(tr).find('.m-datatable__cell').each(function (tdi, td) {
							// get column settings by field
							var column = $.grep(columns, function (n, i) {
								return $(td).data('field') === n.field;
							})[0];
							if (typeof column !== 'undefined') {
								obj[column['field']] = $(td).text();
							}
						});
					}

					$(tr).find('.m-datatable__cell').each(function (tdi, td) {
						// get column settings by field
						var column = $.grep(columns, function (n, i) {
							return $(td).data('field') === n.field;
						})[0];
						if (typeof column !== 'undefined') {
							// column template
							if (typeof column.template !== 'undefined') {
								var finalValue = '';
								// template string
								if (typeof column.template === 'string') {
									finalValue = dt.dataPlaceholder(column.template, obj);
								}
								// template callback function
								if (typeof column.template === 'function') {
									finalValue = column.template(obj);
								}
								var span = $('<span/>').append(finalValue);
								// insert to cell, wrap with span
								$(td).html(span);

								// set span overflow
								if (typeof column.overflow !== 'undefined') {
									$(span).css('overflow', column.overflow);
								}
							}
						}
					});
				});
			},

			/**
			 * Setup extra system column properties
			 * Note: selector checkbox, subtable toggle
			 */
			setupSystemColumn: function () {
				// no records available
				if (datatable.jsonData.length === 0) return;

				var columns = options.columns;
				$(datatable.tableBody).find('.m-datatable__row').each(function (tri, tr) {
					$(tr).find('.m-datatable__cell').each(function (tdi, td) {
						// get column settings by field
						var column = $.grep(columns, function (n, i) {
							return $(td).data('field') === n.field;
						})[0];
						if (typeof column !== 'undefined') {
							var value = $(td).text();

							// enable column selector
							if (typeof column.selector !== 'undefined' && column.selector !== false) {
								// check if checkbox exist
								if ($(td).find('.m-checkbox [type="checkbox"]').length > 0) return;
								$(td).addClass('m-datatable__cell--check');
								// append checkbox
								var chk = $('<label/>').addClass('m-checkbox m-checkbox--single')
									.append($('<input/>')
										.attr('type', 'checkbox')
										.attr('value', value)
										.on('click', function () {
											if ($(this).is(':checked')) {
												// add checkbox active row class
												API.setActive(this);
											} else {
												// add checkbox active row class
												API.setInactive(this);
											}
										}))
									.append($('<span/>'));

								// checkbox selector has outline style
								if (typeof column.selector.class !== 'undefined') {
									$(chk).addClass(column.selector.class);
								}

								$(td).children().html(chk);
							}

							// enable column subtable toggle
							if (typeof column.subtable !== 'undefined' && column.subtable) {
								// check if subtable toggle exist
								if ($(td).find('.m-datatable__toggle-subtable').length > 0) return;
								// append subtable toggle
								$(td).children().html($('<a/>')
									.addClass('m-datatable__toggle-subtable')
									.attr('href', '#')
									.attr('data-value', value)
									.append($('<i/>').addClass(API.getOption('layout.icons.rowDetail.collapse'))));
							}
						}
					});
				});

				// init checkbox for header/footer
				var initCheckbox = function (td) {
					// get column settings by field
					var column = $.grep(columns, function (n, i) {
						return $(td).data('field') === n.field;
					})[0];

					if (typeof column !== 'undefined') {
						// enable column selector
						if (typeof column.selector !== 'undefined' && column.selector !== false) {
							// check if checkbox exist
							if ($(td).find('.m-checkbox [type="checkbox"]').length > 0) return;
							$(td).addClass('m-datatable__cell--check');

							// todo; check all, for server pagination
							// append checkbox
							var chk = $('<label/>').addClass('m-checkbox m-checkbox--single m-checkbox--all')
								.append($('<input/>')
									.attr('type', 'checkbox')
									.on('click', function () {
										if ($(this).is(':checked')) {
											API.setActiveAll(true);
										} else {
											API.setActiveAll(false);
										}
									}))
								.append($('<span/>'));

							// checkbox selector has outline style
							if (typeof column.selector.class !== 'undefined') {
								$(chk).addClass(column.selector.class);
							}

							$(td).children().html(chk);
						}
					}
				};

				if (typeof options.layout.header !== 'undefined' && options.layout.header === true) {
					initCheckbox($(datatable.tableHead).find('.m-datatable__row').first().find('.m-datatable__cell').first());
				}
				if (typeof options.layout.footer !== 'undefined' && options.layout.footer === true) {
					initCheckbox($(datatable.tableFoot).find('.m-datatable__row').first().find('.m-datatable__cell').first());
				}
			},

			/**
			 * Adjust width to match container size
			 */
			adjustCellsWidth: function () {
				// get table width
				var containerWidth = $(datatable.tableHead).width();

				// offset reserved for sort icon
				var sortOffset = 15;

				// get total number of columns
				var colsPerRow = dt.getOneRow(datatable.tableHead, 1).length;
				if (colsPerRow > 0) {
					//  remove reserved sort icon width
					containerWidth = containerWidth - (sortOffset * colsPerRow);
					var minWidth = Math.floor(containerWidth / colsPerRow);

					// minimum width
					if (minWidth <= dt.offset) {
						minWidth = dt.offset;
					}

					$(datatable.table).find('.m-datatable__row')
						.find('.m-datatable__cell').each(function (tdi, td) {
						var width = minWidth;
						var dataWidth = $(td).data('width');
						if (typeof dataWidth !== 'undefined') {
							width = dataWidth;
						}
						$(td).children().css('width', width);
					});
				}
			},

			/**
			 * Adjust height to match container size
			 */
			adjustCellsHeight: function () {
				$(datatable.table).find('.m-datatable__row');
				$.each($(datatable.table).children(), function (part, tablePart) {
					for (var i = 1; i <= dt.getTotalRows(tablePart); i++) {
						var rows = dt.getOneRow(tablePart, i, false);
						if ($(rows).length > 0) {
							var maxHeight = Math.max.apply(null, $(rows).map(function () {
								return $(this).height();
							}).get());
							$(rows).css('height', Math.ceil(maxHeight));
						}
					}
				});
			},

			/**
			 * Setup table DOM and classes
			 */
			setupDOM: function (table) {
				// set table classes
				$(table).find('> thead').addClass('m-datatable__head');
				$(table).find('> tbody').addClass('m-datatable__body');
				$(table).find('> tfoot').addClass('m-datatable__foot');
				$(table).find('tr').addClass('m-datatable__row');
				$(table).find('tr > th, tr > td').addClass('m-datatable__cell');
				$(table).find('tr > th, tr > td').each(function (i, td) {
					if ($(td).find('span').length === 0) {
						$(td).wrapInner($('<span/>').width(dt.offset));
					}
				});
			},

			/**
			 * Default scrollbar
			 * @returns {{tableLocked: null, init: init, onScrolling: onScrolling}}
			 */
			scrollbar: function () {
				var scroll = {
					tableLocked: null,
					mcsOptions: {
						scrollInertia: 0,
						autoDraggerLength: true,
						autoHideScrollbar: true,
						autoExpandScrollbar: false,
						alwaysShowScrollbar: 0,
						mouseWheel: {
							scrollAmount: 120,
							preventDefault: false
						},
						advanced: {
							updateOnContentResize: true,
							autoExpandHorizontalScroll: true
						},
						theme: 'minimal-dark'
					},
					init: function () {
						var screen = mUtil.getViewPort().width;
						// setup scrollable datatable
						if (options.layout.scroll) {
							// add scrollable datatable class
							$(datatable).addClass('m-datatable--scroll');

							var scrollable = $(datatable.tableBody).find('.m-datatable__lock--scroll');
							if ($(scrollable).length > 0) {
								scroll.scrollHead = $(datatable.tableHead).find('> .m-datatable__lock--scroll > .m-datatable__row');
								scroll.scrollFoot = $(datatable.tableFoot).find('> .m-datatable__lock--scroll > .m-datatable__row');
								scroll.tableLocked = $(datatable.tableBody).find('.m-datatable__lock:not(.m-datatable__lock--scroll)');
								if (screen > mUtil.getBreakpoint('lg')) {
									scroll.mCustomScrollbar(scrollable);
								} else {
									scroll.defaultScrollbar(scrollable);
								}
							} else {
								scroll.scrollHead = $(datatable.tableHead).find('> .m-datatable__row');
								scroll.scrollFoot = $(datatable.tableFoot).find('> .m-datatable__row');
								if (screen > mUtil.getBreakpoint('lg')) {
									scroll.mCustomScrollbar(datatable.tableBody);
								} else {
									scroll.defaultScrollbar(datatable.tableBody);
								}
							}
						} else {
							$(datatable.table).css('height', 'auto').css('overflow-x', 'auto');
						}
					},
					defaultScrollbar: function (scrollable) {
						$(scrollable)
							.css('overflow', 'auto')
							.css('max-height', API.getOption('layout.height'))
							.on('scroll', scroll.onScrolling);
					},
					onScrolling: function (e) {
						var left = $(this).scrollLeft();
						var top = $(this).scrollTop();
						$(scroll.scrollHead).css('left', -left);
						$(scroll.scrollFoot).css('left', -left);
						$(scroll.tableLocked).each(function (i, table) {
							$(table).css('top', -top);
						});
					},
					mCustomScrollbar: function (scrollable) {
						var height = API.getOption('layout.height');
						// vertical and horizontal scrollbar
						var axis = 'xy';
						if (height === null) {
							// horizontal scrollbar
							axis = 'x';
						}
						var mcsOptions = $.extend({}, scroll.mcsOptions, {
							axis: axis,
							setHeight: $(datatable.tableBody).height(),
							callbacks: {
								whileScrolling: function () {
									var mcs = this.mcs;
									$(scroll.scrollHead).css('left', mcs.left);
									$(scroll.scrollFoot).css('left', mcs.left);
									$(scroll.tableLocked).each(function (i, table) {
										$(table).css('top', mcs.top);
									});
								}
							}
						});

						if (API.getOption('layout.smoothScroll.scrollbarShown') === true) {
							$(scrollable).attr('data-scrollbar-shown', 'true');
						}

						// create a new instance for table body with scrollbar
						dt.mCustomScrollbar(scrollable, mcsOptions);
						$(scrollable).mCustomScrollbar('scrollTo', 'top');
					}
				};
				scroll.init();
				return scroll;
			},

			/**
			 * Init custom scrollbar and reset position
			 * @param element
			 * @param options
			 */
			mCustomScrollbar: function (element, options) {
				$(datatable.tableBody).css('overflow', '');
				// check if any custom scrollbar exist in the element
				if ($(element).find('.mCustomScrollbar').length === 0) {
					if ($(datatable.tableBody).hasClass('mCustomScrollbar')) {
						$(datatable.tableBody).mCustomScrollbar('destroy');
					}
					$(element).mCustomScrollbar(options);
				}
			},

			/**
			 * Set column title from options.columns settings
			 */
			setHeadTitle: function (tablePart) {
				if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
				var columns = options.columns;
				var row = $(tablePart).find('.m-datatable__row');
				var ths = $(tablePart).find('.m-datatable__cell');
				if ($(row).length === 0) {
					row = $('<tr/>').appendTo(tablePart);
				}
				$.each(columns, function (i, column) {
					var th = $(ths).eq(i);
					if ($(th).length === 0) {
						th = $('<th/>').appendTo(row);
					}
					// set column title
					if (typeof column['title'] !== 'undefined') {
						$(th).html(column['title']).attr('data-field', column.field).data(column);
					}
					// apply text align to thead/tfoot
					if (typeof column.textAlign !== 'undefined') {
						var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
						$(th).addClass(align);
					}
				});
				dt.setupDOM(tablePart);
			},

			/**
			 * Initiate to get remote or local data via ajax
			 */
			dataRender: function () {
				$(datatable.table).siblings('.m-datatable__pager').removeClass('m-datatable--paging-loaded');

				var afterGetData = function (result) {
					$(datatable).removeClass('m-datatable--error');
					// pagination enabled
					if (options.pagination) {
						// server pagination
						if (typeof result !== 'undefined' && options.data.serverPaging && options.data.type !== 'local') {
							dt.paging(result.meta);
						} else {
							// local pagination can be used by remote data also
							dt.paging(null, function (ctx, meta) {
								$(ctx.pager).off().on('m-datatable--on-update-perpage', function (e, meta) {
									$(ctx.pager).remove();
									ctx.init(meta);
								});
								var start = Math.max(meta.perpage * (meta.page - 1), 0);
								var end = Math.min(start + meta.perpage, meta.total);

								dt.updateRawData();
								datatable.jsonData = $(datatable.jsonData).slice(start, end);

								// insert data into table content
								dt.insertData();
							});
						}
					}
					// insert data into table content
					dt.insertData();
				};

				// get local data here
				if (options.data.type === 'local'
					// for remote json type data
					|| typeof options.data.source.read === 'undefined' && datatable.jsonData !== null) {
					afterGetData();
					return;
				}

				// getting data from remote only
				dt.getData().done(afterGetData);
			},

			/**
			 * Process ajax data
			 */
			insertData: function () {
				var params = API.getDataSourceParam();

				// todo; fix performance
				var tableBody = $('<tbody/>').addClass('m-datatable__body').css('visibility', 'hidden');
				$.each(datatable.jsonData, function (i, row) {
					// keep data object to row
					var tr = $('<tr/>').attr('data-row', i).data('obj', row);
					$.each(options.columns, function (x, column) {
						var td = $('<td/>').append(row[column.field])
							.attr('data-field', column.field) // required for subtable
							.data(column)
							.appendTo(tr);

						// add sorted class to cells
						if (params.sort.field === column.field) {
							$(td).addClass('m-datatable__cell--sorted');
						}

						// apply text align
						if (typeof column.textAlign !== 'undefined') {
							var align = typeof datatable.textAlign[column.textAlign] !== 'undefined' ? datatable.textAlign[column.textAlign] : '';
							$(td).addClass(align);
						}
					});
					$(tr).appendTo(tableBody);
				});

				// display no records message
				if (datatable.jsonData.length === 0) {
					$('<span/>').addClass('m-datatable--error').width('100%').html(API.getOption('translate.records.noRecords')).appendTo(tableBody);
					$(datatable).addClass('m-datatable--error');
				}

				// replace existing table body
				$(datatable.tableBody).replaceWith(tableBody);
				datatable.tableBody = tableBody;

				// layout update
				dt.setupDOM(datatable.table);
				dt.setupCellField([datatable.tableBody]);
				dt.setupTemplateCell(datatable.tableBody);
				dt.layoutUpdate();
			},

			updateTableComponents: function () {
				datatable.tableHead = $(datatable.table).children('thead');
				datatable.tableBody = $(datatable.table).children('tbody');
				datatable.tableFoot = $(datatable.table).children('tfoot');
			},

			/**
			 * Call ajax for raw JSON data
			 */
			getData: function () {
				var params = {dataType: 'json', method: 'GET', data: {}, timeout: 30000};

				if (options.data.type === 'local') {
					params.url = options.data.source;
				}

				if (options.data.type === 'remote') {
					params.url = API.getOption('data.source.read.url');
					if (typeof params.url !== 'string') params.url = API.getOption('data.source.read');
					if (typeof params.url !== 'string') params.url = API.getOption('data.source');
					params.data['datatable'] = $.extend({}, API.getDataSourceParam(), API.getOption('data.source.read.params'));
					params.method = 'POST';
				}

				return $.ajax(params)
					.done(function (data, textStatus, jqXHR) {
						// extendible data map callback for custom datasource in future
						datatable.jsonData = dt.dataMapCallback(data);
						$(datatable).trigger('m-datatable--on-ajax-done', datatable.jsonData);
					})
					.fail(function (jqXHR, textStatus, errorThrown) {
						$(datatable).trigger('m-datatable--on-ajax-fail', [jqXHR]);
						$('<span/>').addClass('m-datatable--error').width('100%').html(API.getOption('translate.records.noRecords')).appendTo(datatable.tableBody);
						$(datatable).addClass('m-datatable--error');
					})
					.always(function () {
					});
			},

			/**
			 * Pagination object
			 * @param meta if null, local pagination, otherwise remote pagination
			 * @param callback for update data when navigating page
			 */
			paging: function (meta, callback) {
				var pg = {
					initCallback: false,
					meta: null,
					pager: null,
					paginateEvent: null,
					pagerLayout: {pagination: null, info: null},
					callback: null,
					init: function (meta) {
						pg.meta = meta;
						if (typeof meta === 'undefined' || meta === null) {
							// local pagination meta
							pg.meta = API.getDataSourceParam('pagination');
							if (pg.meta.perpage === 0) {
								pg.meta.perpage = options.data.pageSize || 10;
							}
							pg.meta.total = datatable.jsonData.length;
							pg.initCallback = true;
						}

						// always recount total pages
						pg.meta.pages = Math.max(Math.ceil(pg.meta.total / pg.meta.perpage), 1);

						// current page must be not over than total pages
						if (pg.meta.page > pg.meta.pages) pg.meta.page = pg.meta.pages;

						// set unique event name between tables
						pg.paginateEvent = dt.getTablePrefix();

						pg.pager = $(datatable.table).siblings('.m-datatable__pager');
						if ($(pg.pager).hasClass('m-datatable--paging-loaded')) return;

						// if class .m-datatable--paging-loaded not exist, recreate pagination
						$(pg.pager).remove();

						// if no pages available
						if (pg.meta.pages === 0) return;

						// update datasource params
						API.setDataSourceParam('pagination', pg.meta);

						// default callback function, contains remote pagination handler
						pg.callback = pg.serverCallback;
						// custom callback function
						if (typeof callback === 'function') pg.callback = callback;

						pg.addPaginateEvent();
						pg.populate();

						pg.meta.page = Math.max(pg.meta.page || 1, pg.meta.page);

						$(datatable).trigger(pg.paginateEvent, pg.meta);
						if (pg.initCallback) {
							// need to execute callback on init, remote data but without server pagination
							pg.callback(pg, pg.meta);
						}

						pg.pagingBreakpoint.call();
						$(window).resize(pg.pagingBreakpoint);
					},
					serverCallback: function (ctx, meta) {
						dt.dataRender();
					},
					populate: function () {
						var icons = API.getOption('layout.icons.pagination');
						var title = API.getOption('translate.toolbar.pagination.items.default');
						// pager root element
						pg.pager = $('<div/>').addClass('m-datatable__pager m-datatable--paging-loaded clearfix');
						// numbering links
						var pagerNumber = $('<ul/>').addClass('m-datatable__pager-nav');
						pg.pagerLayout['pagination'] = pagerNumber;

						// pager first/previous button
						$('<li/>')
							.append($('<a/>').attr('title', title.first)
								.addClass('m-datatable__pager-link m-datatable__pager-link--first')
								.append($('<i/>').addClass(icons.first))
								.on('click', pg.gotoMorePage)
								.attr('data-page', 1))
							.appendTo(pagerNumber);
						$('<li/>')
							.append($('<a/>').attr('title', title.prev)
								.addClass('m-datatable__pager-link m-datatable__pager-link--prev')
								.append($('<i/>').addClass(icons.prev))
								.on('click', pg.gotoMorePage))
							.appendTo(pagerNumber);

						// more previous pages
						$('<li/>').append($('<a/>').attr('title', title.more)
							.addClass('m-datatable__pager-link m-datatable__pager-link--more-prev')
							.html($('<i/>').addClass(icons.more))
							.on('click', pg.gotoMorePage))
							.appendTo(pagerNumber);

						$('<li/>').append($('<input/>').attr('type', 'text')
							.addClass('m-pager-input form-control')
							.attr('title', title.input)
							.on('keyup', function () {
								// on keyup update [data-page]
								$(this).attr('data-page', Math.abs($(this).val()));
							})
							.on('keypress', function (e) {
								// on keypressed enter button
								if (e.which === 13) pg.gotoMorePage(e);
							}))
							.appendTo(pagerNumber);

						for (var page = 0; page < pg.meta.pages; page++) {
							var pageNumber = page + 1;
							$('<li/>').append($('<a/>').addClass('m-datatable__pager-link m-datatable__pager-link-number')
								.text(pageNumber).attr('data-page', pageNumber)
								.on('click', pg.gotoPage))
								.appendTo(pagerNumber);
						}

						// more next pages
						$('<li/>').append($('<a/>').attr('title', title.more)
							.addClass('m-datatable__pager-link m-datatable__pager-link--more-next')
							.html($('<i/>').addClass(icons.more))
							.on('click', pg.gotoMorePage))
							.appendTo(pagerNumber);

						// pager next/last button
						$('<li/>')
							.append($('<a/>').attr('title', title.next)
								.addClass('m-datatable__pager-link m-datatable__pager-link--next')
								.append($('<i/>').addClass(icons.next))
								.on('click', pg.gotoMorePage))
							.appendTo(pagerNumber);
						$('<li/>')
							.append($('<a/>').attr('title', title.last)
								.addClass('m-datatable__pager-link m-datatable__pager-link--last')
								.append($('<i/>').addClass(icons.last))
								.on('click', pg.gotoMorePage)
								.attr('data-page', pg.meta.pages))
							.appendTo(pagerNumber);

						// page info
						if (API.getOption('toolbar.items.info')) {
							pg.pagerLayout['info'] = $('<div/>')
								.addClass('m-datatable__pager-info')
								.append($('<span/>').addClass('m-datatable__pager-detail'));
						}

						$.each(API.getOption('toolbar.layout'), function (i, layout) {
							$(pg.pagerLayout[layout]).appendTo(pg.pager);
						});

						// page size select
						var pageSizeSelect = $('<select/>').addClass('selectpicker m-datatable__pager-size')
							.attr('title', API.getOption('translate.toolbar.pagination.items.default.select'))
							.attr('data-width', '70px')
							.val(pg.meta.perpage)
							.on('change', pg.updatePerpage)
							.prependTo(pg.pagerLayout['info']);
						$.each(API.getOption('toolbar.items.pagination.pageSizeSelect'), function (i, size) {
							var display = size;
							if (size === -1) display = 'All';
							$('<option/>').attr('value', size)
								.html(display)
								.appendTo(pageSizeSelect);
						});

						// init selectpicker to dropdown
						$(datatable).ready(function () {
							$('.selectpicker').selectpicker()
								.siblings('.dropdown-toggle').attr('title', API.getOption('translate.toolbar.pagination.items.default.select'));
						});

						pg.paste();
					},
					paste: function () {
						// insert pagination based on placement position, top|bottom
						$.each($.unique(API.getOption('toolbar.placement')), function (i, position) {
							if (position === 'bottom') {
								$(pg.pager).clone(true).insertAfter(datatable.table);
							}
							if (position === 'top') {
								// pager top need some extra space
								$(pg.pager).clone(true).addClass('m-datatable__pager--top').insertBefore(datatable.table);
							}
						});
					},
					gotoMorePage: function (e) {
						e.preventDefault();
						// $(this) is a link of .m-datatable__pager-link

						if ($(this).attr('disabled') === 'disabled') return false;

						var page = $(this).attr('data-page');

						// event from text input
						if (typeof page === 'undefined') {
							page = $(e.target).attr('data-page');
						}

						$(pg.pager).find('.m-datatable__pager-link-number[data-page="' + page + '"]').trigger('click');

						return false;
					},
					gotoPage: function (e) {
						e.preventDefault();
						// prevent from click same page number
						if ($(this).hasClass('m-datatable__pager-link--active')) return;

						// currentPage is 1-based index
						pg.meta.page = parseInt($(this).data('page'));

						$(datatable).trigger(pg.paginateEvent, pg.meta);
						pg.callback(pg, pg.meta);

						// update page callback function
						$(pg.pager).trigger('m-datatable--on-goto-page', pg.meta);
					},
					updatePerpage: function (e) {
						e.preventDefault();
						if (API.getOption('layout.height') === null) {
							// fix white space, when perpage is set from many records to less records
							$('html, body').animate({scrollTop: $(datatable).position().top});
						}

						pg.pager = $(datatable.table).siblings('.m-datatable__pager')
							.removeClass('m-datatable--paging-loaded');

						// on change select page size
						if (e.originalEvent) {
							pg.meta.perpage = parseInt($(this).val());
						}

						$(pg.pager).find('select.m-datatable__pager-size').val(pg.meta.perpage).attr('data-selected', pg.meta.perpage);

						// update datasource params
						API.setDataSourceParam('pagination', pg.meta);

						// update page callback function
						$(pg.pager).trigger('m-datatable--on-update-perpage', pg.meta);
						$(datatable).trigger(pg.paginateEvent, pg.meta);
						pg.callback(pg, pg.meta);

						// update pagination info
						pg.updateInfo.call();
					},
					addPaginateEvent: function (e) {
						// pagination event
						$(datatable).off(pg.paginateEvent).on(pg.paginateEvent, function (e, meta) {
							dt.spinnerCallback(true);

							pg.pager = $(datatable.table).siblings('.m-datatable__pager');
							var pagerNumber = $(pg.pager).find('.m-datatable__pager-nav');

							// set sync active page class
							$(pagerNumber).find('.m-datatable__pager-link--active').removeClass('m-datatable__pager-link--active');
							$(pagerNumber).find('.m-datatable__pager-link-number[data-page="' + meta.page + '"]')
								.addClass('m-datatable__pager-link--active');

							// set next and previous link page number
							$(pagerNumber).find('.m-datatable__pager-link--prev').attr('data-page', Math.max(meta.page - 1, 1));
							$(pagerNumber).find('.m-datatable__pager-link--next').attr('data-page', Math.min(meta.page + 1, meta.pages));

							// current page input value sync
							$(pg.pager).each(function () {
								$(this).find('.m-pager-input[type="text"]').prop('value', meta.page);
							});

							// update datasource params
							API.setDataSourceParam('pagination', pg.meta);

							$(pg.pager).find('select.m-datatable__pager-size').val(meta.perpage).attr('data-selected', meta.perpage);

							// clear active rows
							$(datatable.table).find('.m-checkbox > [type="checkbox"]').prop('checked', false);
							$(datatable.table).find('.m-datatable__row--active').removeClass('m-datatable__row--active');

							pg.updateInfo.call();
							pg.pagingBreakpoint.call();
							// dt.resetScroll();
						});
					},
					updateInfo: function () {
						var start = Math.max(pg.meta.perpage * (pg.meta.page - 1) + 1, 1);
						var end = Math.min(start + pg.meta.perpage - 1, pg.meta.total);
						// page info update
						$(pg.pager).find('.m-datatable__pager-info').find('.m-datatable__pager-detail')
							.html(dt.dataPlaceholder(API.getOption('translate.toolbar.pagination.items.info'), {
								start: start,
								end: pg.meta.perpage === -1 ? pg.meta.total : end,
								pageSize: pg.meta.perpage === -1 || pg.meta.perpage >= pg.meta.total ? pg.meta.total : pg.meta.perpage,
								total: pg.meta.total
							}));
					},

					/**
					 * Update pagination layout breakpoint
					 */
					pagingBreakpoint: function () {
						// keep page links reference
						var pagerNumber = $(datatable.table).siblings('.m-datatable__pager').find('.m-datatable__pager-nav');
						if ($(pagerNumber).length === 0) return;

						var currentPage = API.getCurrentPage();
						var pagerInput = $(pagerNumber).find('.m-pager-input').closest('li');

						// reset
						$(pagerNumber).find('li').show();

						// pagination update
						$.each(API.getOption('toolbar.items.pagination.pages'), function (mode, option) {
							if (mUtil.isInResponsiveRange(mode)) {
								switch (mode) {
									case 'desktop':
									case 'tablet':
										var end = Math.ceil(currentPage / option.pagesNumber) * option.pagesNumber;
										var start = end - option.pagesNumber;
										$(pagerInput).hide();
										// for multiple pagination
										$(pagerNumber).each(function (i, pager) {
											$(pager).find('.m-datatable__pager-link-number').closest('li').hide()
												.slice(start, end).show();
										});

										pg.meta = API.getDataSourceParam('pagination');
										pg.paginationUpdate();
										break;

									case 'mobile':
										$(pagerInput).show();
										$(pagerNumber).find('.m-datatable__pager-link--more-prev').closest('li').hide();
										$(pagerNumber).find('.m-datatable__pager-link--more-next').closest('li').hide();
										$(pagerNumber).find('.m-datatable__pager-link-number').closest('li').hide();
										break;
								}

								return false;
							}
						});
					},

					/**
					 * Update pagination number and button display
					 * @param meta
					 */
					paginationUpdate: function () {
						var pager = $(datatable.table).siblings('.m-datatable__pager').find('.m-datatable__pager-nav'),
							pagerMorePrev = $(pager).find('.m-datatable__pager-link--more-prev'),
							pagerMoreNext = $(pager).find('.m-datatable__pager-link--more-next'),
							pagerFirst = $(pager).find('.m-datatable__pager-link--first'),
							pagerPrev = $(pager).find('.m-datatable__pager-link--prev'),
							pagerNext = $(pager).find('.m-datatable__pager-link--next'),
							pagerLast = $(pager).find('.m-datatable__pager-link--last');

						// get visible page
						var pagerNumber = $(pager).find('.m-datatable__pager-link-number:visible');
						// get page before of first visible
						var morePrevPage = Math.max($(pagerNumber).first().data('page') - 1, 1);
						$(pagerMorePrev).each(function (i, prev) {
							$(prev).attr('data-page', morePrevPage);
						});
						// show/hide <li>
						if (morePrevPage === 1) {
							$(pagerMorePrev).parent().hide();
						} else {
							$(pagerMorePrev).parent().show();
						}

						// get page after of last visible
						var moreNextPage = Math.min($(pagerNumber).last().data('page') + 1, pg.meta.pages);
						$(pagerMoreNext).each(function (i, prev) {
							$(pagerMoreNext).attr('data-page', moreNextPage).show();
						});

						// show/hide <li>
						if (moreNextPage === pg.meta.pages
							// missing dot fix when last hidden page is one left
							&& moreNextPage === $(pagerNumber).last().data('page')) {
							$(pagerMoreNext).parent().hide();
						} else {
							$(pagerMoreNext).parent().show();
						}

						// begin/end of pages
						if (pg.meta.page === 1) {
							$(pagerFirst).attr('disabled', true).addClass('m-datatable__pager-link--disabled');
							$(pagerPrev).attr('disabled', true).addClass('m-datatable__pager-link--disabled');
						} else {
							$(pagerFirst).removeAttr('disabled').removeClass('m-datatable__pager-link--disabled');
							$(pagerPrev).removeAttr('disabled').removeClass('m-datatable__pager-link--disabled');
						}
						if (pg.meta.page === pg.meta.pages) {
							$(pagerNext).attr('disabled', true).addClass('m-datatable__pager-link--disabled');
							$(pagerLast).attr('disabled', true).addClass('m-datatable__pager-link--disabled');
						} else {
							$(pagerNext).removeAttr('disabled').removeClass('m-datatable__pager-link--disabled');
							$(pagerLast).removeAttr('disabled').removeClass('m-datatable__pager-link--disabled');
						}

						// display more buttons
						var nav = API.getOption('toolbar.items.pagination.navigation');
						if (!nav.first) $(pagerFirst).remove();
						if (!nav.prev) $(pagerPrev).remove();
						if (!nav.next) $(pagerNext).remove();
						if (!nav.last) $(pagerLast).remove();
					}
				};
				pg.init(meta);
				return pg;
			},

			/**
			 * Hide/show table cell defined by options[columns][i][responsive][visible/hidden]
			 */
			columnHide: function () {
				var screen = mUtil.getViewPort().width;
				// foreach columns setting
				$.each(options.columns, function (i, column) {
					if (typeof column.responsive !== 'undefined') {
						var field = column.field;
						var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function (n, i) {
							return field === $(n).data('field');
						});
						if (mUtil.getBreakpoint(column.responsive.hidden) >= screen) {
							$(tds).hide();
						} else {
							$(tds).show();
						}
						if (mUtil.getBreakpoint(column.responsive.visible) <= screen) {
							$(tds).show();
						} else {
							$(tds).hide();
						}
					}
				});
			},

			/**
			 * Setup sub datatable
			 */
			setupSubDatatable: function () {
				var detailCallback = API.getOption('detail.content');
				if (typeof detailCallback === 'function') {
					// subtable already exist
					if ($(datatable.table).find('.m-datatable__detail').length > 0) return;

					$(datatable).addClass('m-datatable--subtable');

					options.columns[0]['subtable'] = true;

					// toggle on open sub table
					var toggleSubTable = function (e) {
						e.preventDefault();
						// get parent row of this detail table
						var parentRow = $(this).closest('.m-datatable__row');
						// get detail row for sub table
						var detailRow = $(parentRow).next().toggle();
						// get id from first column of parent row
						var primaryKey = $(this).closest('[data-field]:first-child')
							.find('.m-datatable__toggle-subtable').data('value');

						var icon = $(this).find('i').removeAttr('class');
						if ($(detailRow).is(':hidden')) {
							$(icon).addClass(API.getOption('layout.icons.rowDetail.collapse'));
							// remove expand class from parent row
							$(parentRow).removeClass('m-datatable__row--detail-expanded');
							// trigger event on collapse
							$(datatable).trigger('m-datatable--on-collapse-detail', [parentRow]);
						} else {
							// expand and run callback function
							$(icon).addClass(API.getOption('layout.icons.rowDetail.expand'));
							// add expand class to parent row
							$(parentRow).addClass('m-datatable__row--detail-expanded');
							// trigger event on expand
							$(datatable).trigger('m-datatable--on-expand-detail', [parentRow]);

							// get data from ajax
							e.data = $.grep(datatable.jsonData, function (n, i) {
								return primaryKey === n[options.columns[0].field];
							})[0];

							// pass placeholder cell for sub table
							e.detailCell = $(detailRow).find('.m-datatable__detail');
							if ($(e.detailCell).find('.m-datatable').length === 0) {
								// run callback with event
								detailCallback(e);
							}
						}
					};

					var columns = options.columns;
					$(datatable.tableBody).find('.m-datatable__row').each(function (tri, tr) {
						$(tr).find('.m-datatable__cell').each(function (tdi, td) {
							// get column settings by field
							var column = $.grep(columns, function (n, i) {
								return $(td).data('field') === n.field;
							})[0];
							if (typeof column !== 'undefined') {
								var value = $(td).text();
								// enable column subtable toggle
								if (typeof column.subtable !== 'undefined' && column.subtable) {
									// check if subtable toggle exist
									if ($(td).find('.m-datatable__toggle-subtable').length > 0) return;
									// append subtable toggle
									$(td).children().html($('<a/>')
										.addClass('m-datatable__toggle-subtable')
										.attr('href', '#')
										.attr('data-value', value)
										.attr('title', API.getOption('detail.title'))
										.on('click', toggleSubTable)
										.append($('<i/>').addClass(API.getOption('layout.icons.rowDetail.collapse'))));
								}
							}
						});
					});

					// prepare DOM for sub table, each <tr> as parent and add <tr> as child table
					$(datatable.tableBody).find('.m-datatable__row').each(function () {
						var detailRow = $('<tr/>').addClass('m-datatable__row-detail').hide()
							.append($('<td/>').addClass('m-datatable__detail')
								.attr('colspan', dt.getTotalColumns()));
						$(this).after(detailRow);
						// add class to even row
						if ($(this).hasClass('m-datatable__row--even')) {
							$(detailRow).addClass('m-datatable__row-detail--even');
						}
					});
				}
			},

			/**
			 * Datasource mapping callback
			 */
			dataMapCallback: function (raw) {
				// static data
				var newData = raw;
				// dynamic data
				if (typeof  raw.data !== 'undefined') {
					newData = raw.data;
				}

				return newData;
			},

			isSpinning: false,
			/**
			 * BlockUI spinner callback
			 * @param block
			 */
			spinnerCallback: function (block) {
				if (block && !dt.isSpinning) {
					// get spinner options
					var spinnerOptions = API.getOption('layout.spinner');
					if (spinnerOptions.message === true) {
						// use default spinner message from translation
						spinnerOptions.message = API.getOption('translate.records.processing');
					}
					dt.isSpinning = true;
					mApp.block(datatable, spinnerOptions);
				} else {
					dt.isSpinning = false;
					mApp.unblock(datatable);
				}
			},

			/**
			 * Custom debug log
			 * @param text
			 * @param obj
			 */
			log: function (text, obj) {
				if (typeof obj === 'undefined') obj = '';
				if (datatable.debug) {
					console.log(text, obj);
				}
			},


			/********************
			 ** HELPERS
			 ********************/

			/**
			 * Check if table is a locked colums table
			 */
			isLocked: function () {
				return $(datatable).hasClass('m-datatable--lock') || false;
			},

			/**
			 * Insert html into table content, take count mCustomScrollbar DOM to prevent replace
			 * @param html
			 * @param tablePart
			 */
			replaceTableContent: function (html, tablePart) {
				if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
				if ($(tablePart).hasClass('mCustomScrollbar')) {
					$(tablePart).find('.mCSB_container').html(html);
				} else {
					$(tablePart).html(html);
				}
			},

			/**
			 * Get total extra space of an element for width calculation, including padding, margin, border
			 * @param element
			 * @returns {number}
			 */
			getExtraSpace: function (element) {
				var padding = parseInt($(element).css('paddingRight')) + parseInt($(element).css('paddingLeft'));
				var margin = parseInt($(element).css('marginRight')) + parseInt($(element).css('marginLeft'));
				var border = Math.ceil($(element).css('border-right-width').replace('px', ''));
				return padding + margin + border;
			},

			/**
			 * Insert data of array into {{ }} template placeholder
			 * @param template
			 * @param data
			 * @returns {*}
			 */
			dataPlaceholder: function (template, data) {
				var result = template;
				$.each(data, function (key, val) {
					result = result.replace('{{' + key + '}}', val);
				});
				return result;
			},

			/**
			 * Get table unique ID
			 * Note: table unique change each time refreshed
			 * @param suffix
			 * @returns {*}
			 */
			getTableId: function (suffix) {
				if (typeof suffix === 'undefined') suffix = '';
				return $(datatable).attr('id') + suffix;
			},

			/**
			 * Get table prefix with depth number
			 */
			getTablePrefix: function (suffix) {
				if (typeof suffix !== 'undefined') suffix = '-' + suffix;
				return 'm-datatable__' + dt.getTableId() + '-' + dt.getDepth() + suffix;
			},

			/**
			 * Get current table depth of sub table
			 * @returns {number}
			 */
			getDepth: function () {
				var depth = 0;
				var table = datatable.table;
				do {
					table = $(table).parents('.m-datatable__table');
					depth++;
				} while ($(table).length > 0);
				return depth;
			},

			/**
			 * Keep state item
			 * @param key
			 * @param value
			 */
			stateKeep: function (key, value) {
				key = dt.getTablePrefix(key);
				if (options.data.saveState === false) return;
				if (options.data.saveState.webstorage && localStorage) {
					localStorage.setItem(key, JSON.stringify(value));
				} else {
					Cookies.set(key, JSON.stringify(value));
				}
			},

			/**
			 * Get state item
			 * @param key
			 * @param defValue
			 */
			stateGet: function (key, defValue) {
				key = dt.getTablePrefix(key);
				if (options.data.saveState === false) return;
				var value = null;
				if (options.data.saveState.webstorage && localStorage) {
					value = localStorage.getItem(key);
				} else {
					value = Cookies.get(key);
				}
				if (typeof value !== 'undefined' && value !== null) {
					return JSON.parse(value);
				}
			},

			/**
			 * Update data in state without clear existing
			 * @param key
			 * @param value
			 */
			stateUpdate: function (key, value) {
				var ori = dt.stateGet(key);
				if (typeof ori === 'undefined' || ori === null) ori = {};
				dt.stateKeep(key, $.extend({}, ori, value));
			},

			/**
			 * Remove state item
			 * @param key
			 */
			stateRemove: function (key) {
				key = dt.getTablePrefix(key);
				if (localStorage) {
					localStorage.removeItem(key);
				}
				Cookies.remove(key);
			},

			/**
			 * Get total columns.
			 */
			getTotalColumns: function (tablePart) {
				if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
				return $(tablePart).find('.m-datatable__row').first().find('.m-datatable__cell').length;
			},

			/**
			 * Get total number of rows in a table.
			 * Work both locked column and normal table
			 * @param tablePart Optional
			 */
			getTotalRows: function (tablePart) {
				if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
				return $(tablePart).find('.m-datatable__row').first().parent().find('.m-datatable__row').length;
			},

			/**
			 * Get table row. Useful to get row when current table is in lock mode.
			 * Can be used for both lock and normal table mode.
			 * By default, returning result will be in a list of <td>.
			 * @param tablePart
			 * @param row 1-based index
			 * @param tdOnly Optional. Default true
			 * @returns {*}
			 */
			getOneRow: function (tablePart, row, tdOnly) {
				if (typeof tdOnly === 'undefined') tdOnly = true;
				// get list of <tr>
				var result = $(tablePart).find('.m-datatable__row:not(.m-datatable__row-detail):nth-child(' + row + ')');
				if (tdOnly) {
					// get list of <td> or <th>
					result = result.find('.m-datatable__cell');
				}
				return result;
			},

			/**
			 * Check if element has horizontal overflow
			 * @param element
			 * @returns {boolean}
			 */
			hasOverflowCells: function (element) {
				var children = $(element).find('tr:first-child').find('.m-datatable__cell');
				var maxWidth = 0;

				if (children.length > 0) {
					$(children).each(function (tdi, td) {
						maxWidth += Math.ceil($(td).innerWidth());
					});

					return maxWidth >= $(element).outerWidth();
				}

				return false;
			},

			/**
			 * Check if element has horizontal overflow
			 * @param element
			 * @returns {boolean}
			 */
			hasOverflowX: function (element) {
				var children = $(element).find('*');

				if (children.length > 0) {
					var maxWidth = Math.max.apply(null, $(children).map(function () {
						return $(this).outerWidth(true);
					}).get());

					return maxWidth > $(element).width();
				}

				return false;
			},

			/**
			 * Check if element has vertical overflow
			 * @param element
			 * @returns {boolean}
			 */
			hasOverflowY: function (element) {
				var children = $(element).find('.m-datatable__row');
				var maxHeight = 0;

				if (children.length > 0) {
					$(children).each(function (tdi, td) {
						maxHeight += Math.floor($(td).innerHeight());
					});

					return maxHeight > $(element).innerHeight();
				}

				return false;
			},

			/**
			 * Sort table row at HTML level by column index.
			 * todo; Not in use.
			 * @param header Header sort clicked
			 * @param sort asc|desc. Optional. Default asc
			 * @param int Boolean. Optional. Comparison value parse to integer. Default false
			 */
			sortColumn: function (header, sort, int) {
				if (typeof sort === 'undefined') sort = 'asc'; // desc
				if (typeof int === 'undefined') int = false;

				var column = $(header).index();
				var rows = $(datatable.tableBody).find('.m-datatable__row');
				var hIndex = $(header).closest('.m-datatable__lock').index();
				if (hIndex !== -1) {
					rows = $(datatable.tableBody).find('.m-datatable__lock:nth-child(' + (hIndex + 1) + ')').find('.m-datatable__row');
				}

				var container = $(rows).parent();
				$(rows).sort(function (a, b) {
					var tda = $(a).find('td:nth-child(' + column + ')').text();
					var tdb = $(b).find('td:nth-child(' + column + ')').text();

					if (int) {
						// useful for integer type sorting
						tda = parseInt(tda);
						tdb = parseInt(tdb);
					}

					if (sort === 'asc') {
						return tda > tdb ? 1 : tda < tdb ? -1 : 0;
					} else {
						return tda < tdb ? 1 : tda > tdb ? -1 : 0;
					}
				}).appendTo(container);
			},

			/**
			 * Perform sort remote and local
			 */
			sorting: function () {
				var sortObj = {
					init: function () {
						if (options.sortable) {
							$(datatable.tableHead).find('.m-datatable__cell').addClass('m-datatable__cell--sort').off('click').on('click', sortObj.sortClick);
							// first init
							sortObj.setIcon();
						}
					},
					setIcon: function () {
						var meta = API.getDataSourceParam('sort');
						// sort icon beside column header
						var td = $(datatable.tableHead).find('.m-datatable__cell[data-field="' + meta.field + '"]').attr('data-sort', meta.sort);
						var sorting = $(td).find('span');
						var icon = $(sorting).find('i');

						var icons = API.getOption('layout.icons.sort');
						// update sort icon; desc & asc
						if ($(icon).length > 0) {
							$(icon).removeAttr('class').addClass(icons[meta.sort]);
						} else {
							$(sorting).append($('<i/>').addClass(icons[meta.sort]));
						}
					},
					sortClick: function (e) {
						var meta = API.getDataSourceParam('sort');
						var field = $(this).data('field');
						var column = dt.getColumnByField(field);
						$(datatable.tableHead).find('.m-datatable__cell > span > i').remove();

						dt.spinnerCallback(true);

						// sort is disabled for this column
						if (typeof column.sortable !== 'undefined' && column.sortable === false) return;

						var sort = 'desc';
						if (meta.field === field) {
							sort = meta.sort;
						}

						// toggle sort
						sort = typeof sort === 'undefined' || sort === 'desc' ? 'asc' : 'desc';

						// update field and sort params
						meta = {field: field, sort: sort};
						API.setDataSourceParam('sort', meta);

						sortObj.setIcon();

						if (options.sortable) {
							// offline sort only, server sorting will skip this block
							if (options.data.serverSorting === false) {
								dt.updateRawData();
							}

							setTimeout(function () {
								dt.dataRender();
								$(datatable).trigger('m-datatable--on-sort', meta);
							}, 300);
						}
					}
				};
				sortObj.init();
			},

			/**
			 * Update JSON data list linked with sort, filter and pagination.
			 * Call this method, before using jsonData variable.
			 * @returns {*|null}
			 */
			updateRawData: function () {
				var params = API.getDataSourceParam();
				if ($.type(datatable.fullJsonData) === 'undefined') {
					datatable.fullJsonData = datatable.jsonData;
				}

				datatable.jsonData = $(datatable.fullJsonData).sort(function (a, b) {
					if (params.sort.sort === 'asc') {
						return a[params.sort.field] > b[params.sort.field] ? 1 : a[params.sort.field] < b[params.sort.field] ? -1 : 0;
					} else {
						return a[params.sort.field] < b[params.sort.field] ? 1 : a[params.sort.field] > b[params.sort.field] ? -1 : 0;
					}
				});

				if ($.type(params.query.generalSearch) === 'string') {
					datatable.jsonData = $.grep(datatable.jsonData, function (obj) {
						for (var field in obj) {
							if (!obj.hasOwnProperty(field)) continue;
							if ($.type(obj[field]) === 'string') {
								if (obj[field].toLowerCase().indexOf(params.query.generalSearch) > -1) {
									return true;
								}
							}
						}
						return false;
					});
					// remove generalSearch as we don't need this for next columns filter
					delete params.query.generalSearch;
				}

				if ($.type(params.query) === 'object') {
					// remove empty element from array
					$.each(params.query, function (k, v) {
						if (v === '') {
							delete params.query[k];
						}
					});
					// filter array by query
					datatable.jsonData = dt.filterArray(datatable.jsonData, params.query);

					// reset array index
					datatable.jsonData = datatable.jsonData.filter(function () {
						return true;
					});
				}

				return datatable.jsonData;
			},

			/**
			 * Utility helper to filter array by object pair of {key:value}
			 * @param list
			 * @param args
			 * @param operator
			 * @returns {*}
			 */
			filterArray: function (list, args, operator) {
				if ($.type(operator) === 'undefined') operator = 'AND';

				if ($.type(args) !== 'object') {
					return list;
				}

				operator = operator.toUpperCase();

				if ($.inArray(operator, ['AND', 'OR', 'NOT']) === -1) {
					return [];
				}

				var count = Object.keys(args).length;
				var filtered = [];

				$.each(list, function (key, obj) {
					var to_match = obj;

					var matched = 0;
					$.each(args, function (m_key, m_value) {
						if (to_match.hasOwnProperty(m_key) && m_value == to_match[m_key]) {
							matched++;
						}
					});

					if (( 'AND' == operator && matched == count ) ||
						( 'OR' == operator && matched > 0 ) ||
						( 'NOT' == operator && 0 == matched )) {
						filtered[key] = obj;
					}
				});

				list = filtered;

				return list;
			},

			/**
			 * Reset lock column scroll to 0 when resize
			 */
			resetScroll: function () {
				if (typeof options.detail === 'undefined' && dt.getDepth() === 1) {
					$(datatable.table).find('.m-datatable__row').css('left', 0);
					$(datatable.table).find('.m-datatable__lock').css('top', 0);
					$(datatable.tableBody).scrollTop(0);
				}
			},

			/**
			 * Get column options by field
			 * @param field
			 * @returns {boolean}
			 */
			getColumnByField: function (field) {
				var result;
				$.each(options.columns, function (i, column) {
					if (field === column.field) {
						result = column;
						return false;
					}
				});
				return result;
			},

			/**
			 * Get default sort column
			 */
			getDefaultSortColumn: function () {
				var result = {sort: '', field: ''};
				$.each(options.columns, function (i, column) {
					if (typeof column.sortable !== 'undefined'
						&& $.inArray(column.sortable, ['asc', 'desc']) !== -1) {
						result = {sort: column.sortable, field: column.field};
						return false;
					}
				});
				return result;
			},

			/**
			 * Helper to get element dimensions, when the element is hidden
			 * @param element
			 * @param includeMargin
			 * @returns {{width: number, height: number, innerWidth: number, innerHeight: number, outerWidth: number, outerHeight: number}}
			 */
			getHiddenDimensions: function (element, includeMargin) {
				var props = {position: 'absolute', visibility: 'hidden', display: 'block'},
					dim = {width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0},
					hiddenParents = $(element).parents().addBack().not(':visible');
				includeMargin = (typeof includeMargin === 'boolean') ? includeMargin : false;

				var oldProps = [];
				hiddenParents.each(function () {
					var old = {};

					for (var name in props) {
						old[name] = this.style[name];
						this.style[name] = props[name];
					}

					oldProps.push(old);
				});

				dim.width = $(element).width();
				dim.outerWidth = $(element).outerWidth(includeMargin);
				dim.innerWidth = $(element).innerWidth();
				dim.height = $(element).height();
				dim.innerHeight = $(element).innerHeight();
				dim.outerHeight = $(element).outerHeight(includeMargin);

				hiddenParents.each(function (i) {
					var old = oldProps[i];
					for (var name in props) {
						this.style[name] = old[name];
					}
				});

				return dim;
			},

			/**
			 * Get value by dot notation path string and to prevent undefined errors
			 * @param path String Dot notation path in string
			 * @param object Object to iterate
			 * @returns {*}
			 */
			getObject: function (path, object) {
				return path.split('.').reduce(function (obj, i) {
					return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
				}, object);
			},

			/**
			 * Extend object
			 * @param obj
			 * @param path
			 * @param value
			 * @returns {*}
			 */
			extendObj: function (obj, path, value) {
				var levels = path.split("."),
					i = 0;

				function createLevel(child) {
					var name = levels[i++];
					if (typeof child[name] !== "undefined" && child[name] !== null) {
						if (typeof child[name] !== "object" && typeof child[name] !== "function") {
							child[name] = {};
						}
					} else {
						child[name] = {};
					}
					if (i === levels.length) {
						child[name] = value;
					} else {
						createLevel(child[name]);
					}
				}

				createLevel(obj);
				return obj;
			}
		};

		this.API = {
			row: null,
			record: null,
			column: null,
			value: null,
			params: null
		};

		/********************
		 ** PUBLIC API METHODS
		 ********************/
		var API = {

			/**
			 * Redraw datatable by recalculating its DOM elements, etc.
			 * @returns {jQuery}
			 */
			redraw: function () {
				dt.adjustCellsWidth.call();
				dt.adjustCellsHeight.call();
				dt.adjustLockContainer.call();
				dt.initHeight.call();
				return datatable;
			},

			/**
			 * Shortcode to reload
			 * @returns {jQuery}
			 */
			load: function () {
				API.reload();
				return datatable;
			},

			/**
			 * Datasource reload
			 * @returns {jQuery}
			 */
			reload: function () {
				// local only. remote pagination will skip this block
				if (options.data.serverFiltering === false) {
					dt.updateRawData();
				}
				dt.dataRender();
				$(datatable).trigger('m-datatable--on-reloaded');
				return datatable;
			},

			/**
			 * Get record by record ID
			 * @param id
			 * @returns {jQuery}
			 */
			getRecord: function (id) {
				if (typeof datatable.tableBody === 'undefined') datatable.tableBody = $(datatable.table).children('tbody');
				$(datatable.tableBody).find('.m-datatable__cell:first-child').each(function (i, cell) {
					if (id == $(cell).text()) {
						datatable.API.row = $(cell).closest('.m-datatable__row');
						var rowNumber = datatable.API.row.index() + 1;
						datatable.API.record = datatable.API.value = dt.getOneRow(datatable.tableBody, rowNumber);
						return datatable;
					}
				});
				return datatable;
			},

			/**
			 * Get column of current record ID
			 * @param columnName
			 * @returns {jQuery}
			 */
			getColumn: function (columnName) {
				datatable.API.column = datatable.API.value = $(datatable.API.record).find('[data-field="' + columnName + '"]');
				return datatable;
			},

			/**
			 * Destroy datatable to original DOM state before datatable was initialized
			 * @returns {jQuery}
			 */
			destroy: function () {
				$(datatable).trigger('m-datatable--on-destroy');
				$(datatable).replaceWith($(datatable.old).addClass('m-datatable--destroyed').show());
				return datatable;
			},

			/**
			 * Sort by column field
			 * @param field
			 * @param sort
			 */
			sort: function (field, sort) {
				if (typeof sort === 'undefined') sort = 'asc';
				$(datatable.tableHead).find('.m-datatable__cell[data-field="' + field + '"]').trigger('click');
				return datatable;
			},

			/**
			 * Get current column value
			 * @returns {jQuery}
			 */
			getValue: function () {
				return $(datatable.API.value).text();
			},

			/**
			 * Set checkbox active
			 * @param cell JQuery selector or checkbox ID
			 */
			setActive: function (cell) {
				if ($.type(cell) === 'string') {
					// set by checkbox id
					cell = $(datatable.tableBody).find('.m-checkbox--single > [type="checkbox"][value="' + cell + '"]');
				}

				$(cell).prop('checked', true);

				// normal table
				var row = $(cell).closest('.m-datatable__row').addClass('m-datatable__row--active');
				var index = $(row).index() + 1;

				// lock table
				$(row).closest('.m-datatable__lock').parent().find('.m-datatable__row:nth-child(' + index + ')')
					.addClass('m-datatable__row--active');

				var ids = [];
				$(row).each(function (i, td) {
					var id = $(td).find('.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').val();
					if (typeof id !== 'undefined') {
						ids.push(id);
					}
				});

				$(datatable).trigger('m-datatable--on-check', [ids]);
			},

			/**
			 * Set checkbox inactive
			 * @param cell JQuery selector or checkbox ID
			 */
			setInactive: function (cell) {
				if ($.type(cell) === 'string') {
					// set by checkbox id
					cell = $(datatable.tableBody).find('.m-checkbox--single > [type="checkbox"][value="' + cell + '"]');
				}

				$(cell).prop('checked', false);

				// normal table
				var row = $(cell).closest('.m-datatable__row').removeClass('m-datatable__row--active');
				var index = $(row).index() + 1;

				// lock table
				$(row).closest('.m-datatable__lock').parent().find('.m-datatable__row:nth-child(' + index + ')')
					.removeClass('m-datatable__row--active');

				var ids = [];
				$(row).each(function (i, td) {
					var id = $(td).find('.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').val();
					if (typeof id !== 'undefined') {
						ids.push(id);
					}
				});

				$(datatable).trigger('m-datatable--on-uncheck', [ids]);
			},

			/**
			 * Set all checkboxes active or inactive
			 * @param active
			 */
			setActiveAll: function (active) {
				if (active) {
					API.setActive($(datatable.table).find('.m-datatable__cell'));
				} else {
					API.setInactive($(datatable.table).find('.m-datatable__cell'));
				}
				$(datatable.table).find('.m-checkbox [type="checkbox"]').prop('checked', active || false);
			},

			/**
			 * Get selected rows which are active
			 * @returns {jQuery}
			 */
			setSelectedRecords: function () {
				datatable.API.record = $(datatable.tableBody).find('.m-datatable__row--active');
				return datatable;
			},

			getSelectedRecords: function () {
				return datatable.API.record;
			},

			/**
			 * Get options by dots notation path
			 * @param path String Dot notation path in string
			 * @returns {*}
			 */
			getOption: function (path) {
				return dt.getObject(path, options);
			},

			/**
			 * Set global options nodes by dots notation path
			 * @param path
			 * @param object
			 */
			setOption: function (path, object) {
				options = dt.extendObj(options, path, object);
			},

			/**
			 * Search filter for local & remote
			 * @param value
			 * @param columns. Optional list of columns to be filtered.
			 */
			search: function (value, columns) {
				if (typeof columns !== 'undefined') columns = $.makeArray(columns);
				var delay = (function () {
					var timer = 0;
					return function (callback, ms) {
						clearTimeout(timer);
						timer = setTimeout(callback, ms);
					};
				})();

				var query = API.getDataSourceParam('query');

				// search not by columns
				if (typeof columns === 'undefined') {
					query.generalSearch = value;
				}

				// search by columns, support multiple columns
				if (typeof columns === 'object') {
					$.each(columns, function (k, column) {
						query[column] = value;
					});
					// remove empty element from arrays
					$.each(query, function (k, v) {
						if (v === '') {
							delete query[k];
						}
					});
				}

				API.setDataSourceParam('query', query);

				delay(function () {
					// local filter only. remote pagination will skip this block
					if (options.data.serverFiltering === false) {
						dt.updateRawData();
					}
					dt.dataRender();
				}, 300);
			},

			/**
			 * Set datasource params
			 * @param param
			 * @param value
			 */
			setDataSourceParam: function (param, value) {
				var defaultSort = dt.getDefaultSortColumn();
				datatable.API.params = $.extend({}, {
					pagination: {page: 1, perpage: API.getOption('data.pageSize')},
					sort: {sort: defaultSort.sort, field: defaultSort.field},
					query: {}
				}, datatable.API.params, dt.stateGet(dt.stateId));

				datatable.API.params = dt.extendObj(datatable.API.params, param, value);

				dt.stateKeep(dt.stateId, datatable.API.params);
			},

			/**
			 * Get datasource params
			 * @param param
			 */
			getDataSourceParam: function (param) {
				var defaultSort = dt.getDefaultSortColumn();
				datatable.API.params = $.extend({}, {
					pagination: {page: 1, perpage: API.getOption('data.pageSize')},
					sort: {sort: defaultSort.sort, field: defaultSort.field},
					query: {}
				}, datatable.API.params, dt.stateGet(dt.stateId));

				if (typeof param === 'string') {
					return dt.getObject(param, datatable.API.params);
				}

				return datatable.API.params;
			},

			/**
			 * Shortcode to datatable.getDataSourceParam('query');
			 * @returns {*}
			 */
			getDataSourceQuery: function () {
				return API.getDataSourceParam('query');
			},

			/**
			 * Shortcode to datatable.setDataSourceParam('query', query);
			 * @param query
			 */
			setDataSourceQuery: function (query) {
				API.setDataSourceParam('query', query);
			},

			/**
			 * Get current page number
			 * @returns {number}
			 */
			getCurrentPage: function () {
				return $(datatable.table).siblings('.m-datatable__pager').last()
					.find('.m-datatable__pager-nav')
					.find('.m-datatable__pager-link.m-datatable__pager-link--active').data('page') || 1;
			},

			/**
			 * Get selected dropdown page size
			 * @returns {*|number}
			 */
			getPageSize: function () {
				return $(datatable.table).siblings('.m-datatable__pager').last()
					.find('.m-datatable__pager-size').val() || 10;
			}

		};

		/**
		 * Public API methods can be used directly by datatable
		 */
		$.each(API, function (funcName, func) {
			datatable[funcName] = func;
		});

		// initialize plugin
		if (typeof options === 'string') {
			API[options].apply(this, Array.prototype.slice.call(arguments, 1));

		} else if (typeof options === 'object' || !options) {
			datatable.textAlign = {left: 'm-datatable__cell--left', center: 'm-datatable__cell--center', right: 'm-datatable__cell--right'};
			datatable.jsonData = null;

			// merge default and user defined options
			options = $.extend(true, {}, $.fn.mDatatable.defaults, options);
			$(datatable).data('options', options);
			$(datatable).trigger('m-datatable--on-init', options);

			// init plugin process
			dt.init.apply(this, arguments);
		} else {
			$.error("Method " + options + " does not exist");
		}

		return datatable;
	};

	// default options
	$.fn.mDatatable.defaults = {
		// datasource definition
		data: {
			type: null,
			source: {
				read: {
					url: '',
					params: {}
				}
			},
			pageSize: 10, // display 20 records per page
			saveState: {
				cookie: true,
				webstorage: true
			}, // save datatable state(pagination, filtering, sorting, etc) in cookie or browser webstorage

			serverPaging: false,
			serverFiltering: false,
			serverSorting: false
		},

		// layout definition
		layout: {
			theme: 'default', // i will provide SASS code for the themes, datatable will support multiple themes and designs
			class: 'm-datatable--brand', // custom wrapper class
			scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
			height: null, // datatable's body's fixed height
			footer: false, // display/hide footer
			header: true, // display/hide header

			// datatable custom scroll params
			smoothScroll: {
				scrollbarShown: true
			},

			// datatable spinner
			spinner: {
				overlayColor: '#000000',
				opacity: 0,
				type: 'loader',
				state: 'brand',
				message: true
			},

			// datatable UI icons
			icons: {
				sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
				pagination: {
					next: 'la la-angle-right',
					prev: 'la la-angle-left',
					first: 'la la-angle-double-left',
					last: 'la la-angle-double-right',
					more: 'la la-ellipsis-h'
				},
				rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'}
			}
		},

		// column sorting
		sortable: false,

		// resize column size with mouse drag
		resizable: false, // not implemented

		// column based filtering
		filterable: false,

		pagination: true,

		// inline and bactch editing(cooming soon)
		// editable: false,

		// columns definition
		columns: [],

		// toolbar
		toolbar: {
			// place pagination and displayInfo blocks according to the array order
			layout: ['pagination', 'info'],

			// toolbar placement can be at top or bottom or both top and bottom repeated
			placement: ['bottom'],  //'top', 'bottom'

			// toolbar items
			items: {
				// pagination
				pagination: {
					// pagination type(default or scroll)
					type: 'default',

					// number of pages to display by breakpoints
					pages: {
						desktop: {
							layout: 'default',
							pagesNumber: 6
						},
						tablet: {
							layout: 'default',
							pagesNumber: 3
						},
						mobile: {
							layout: 'compact'
						}
					},

					// navigation buttons
					navigation: {
						prev: true, // display prev link
						next: true, // display next link
						first: true, // display first link
						last: true // display last link
					},

					// page size select
					pageSizeSelect: [10, 20, 30, 50, 100/*, -1*/] // display dropdown to select pagination size. -1 is used for "ALl" option
				},

				// records info
				info: true
			}
		},

		// here we will keep all strings and message used by datatable UI so developer can easiliy translate to any language.
		// By default the stirngs will be in the plugin source and here can override it
		translate: {
			records: {
				processing: 'Please wait...',
				noRecords: 'No records found'
			},
			toolbar: {
				pagination: {
					items: {
						default: {
							first: 'First',
							prev: 'Previous',
							next: 'Next',
							last: 'Last',
							more: 'More pages',
							input: 'Page number',
							select: 'Select page size'
						},
						info: 'Displaying {{start}} - {{end}} of {{total}} records'
					}
				}
			}
		}
	};

}(jQuery));
(function ($) {
    // Plugin function
    $.fn.mDropdown = function (options) {
        // Plugin scope variable
        var dropdown = {};
        var element = $(this);

        // Plugin class
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('dropdown')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    
                    // assign instance to the element                    
                    element.data('dropdown', dropdown);
                } else {
                    // get instance from the element
                    dropdown = element.data('dropdown');
                }               

                return dropdown;
            },

            /**
             * Initialize
             */
            init: function(options) {
                dropdown.events = [];
                dropdown.eventOne = false;
                dropdown.close = element.find('.m-dropdown__close');
                dropdown.toggle = element.find('.m-dropdown__toggle');
                dropdown.arrow = element.find('.m-dropdown__arrow');
                dropdown.wrapper = element.find('.m-dropdown__wrapper');
                dropdown.scrollable = element.find('.m-dropdown__scrollable');
                dropdown.defaultDropPos = element.hasClass('m-dropdown--up') ? 'up' : 'down';
                dropdown.currentDropPos = dropdown.defaultDropPos;

                dropdown.options = $.extend(true, {}, $.fn.mDropdown.defaults, options);
                if (element.data('drop-auto') === true) {
                    dropdown.options.dropAuto = true;
                } else if (element.data('drop-auto') === false) {
                    dropdown.options.dropAuto = false;
                }               

                if (dropdown.scrollable.length > 0) {
                    if (dropdown.scrollable.data('min-height')) {
                        dropdown.options.minHeight = dropdown.scrollable.data('min-height');
                    }

                    if (dropdown.scrollable.data('max-height')) {
                        dropdown.options.maxHeight = dropdown.scrollable.data('max-height');
                    }
                }                
            },

            /**
             * Build DOM and init event handlers
             */
            build: function () {
                if (mUtil.isMobileDevice()) {
                    if (element.data('dropdown-toggle') == 'hover' || element.data('dropdown-toggle') == 'click') { 
                        dropdown.options.toggle = 'click';
                    } else {
                        dropdown.options.toggle = 'click'; 
                        dropdown.toggle.click(Plugin.toggle); 
                    }
                } else {
                    if (element.data('dropdown-toggle') == 'hover') {     
                        dropdown.options.toggle = 'hover';              
                        element.mouseleave(Plugin.hide);
                    } else if(element.data('dropdown-toggle') == 'click') {
                        dropdown.options.toggle = 'click';                  
                    } else {
                        if (dropdown.options.toggle == 'hover') {
                            element.mouseenter(Plugin.show);
                            element.mouseleave(Plugin.hide);
                        } else {
                            dropdown.toggle.click(Plugin.toggle);      
                        }
                    }
                }                

                // handle dropdown close icon
                if (dropdown.close.length) {
                    dropdown.close.on('click', Plugin.hide);
                }

                // disable dropdown close
                Plugin.disableClose();
            }, 

            /**
             * Setup dropdown
             */
            setup: function () {
                if (dropdown.options.placement) {
                    element.addClass('m-dropdown--' + dropdown.options.placement);
                }

                if (dropdown.options.align) {
                    element.addClass('m-dropdown--align-' + dropdown.options.align);
                } 

                if (dropdown.options.width) {
                    dropdown.wrapper.css('width', dropdown.options.width);
                }

                if (element.data('dropdown-persistent')) {
                    dropdown.options.persistent = true;
                }
        
                // handle height
                if (dropdown.options.minHeight) {
                    dropdown.scrollable.css('min-height', dropdown.options.minHeight);                    
                } 

                if (dropdown.options.maxHeight) {
                    dropdown.scrollable.css('max-height', dropdown.options.maxHeight);     
                    dropdown.scrollable.css('overflow-y', 'auto'); 

                    if (mUtil.isDesktopDevice()) {
                        mApp.initScroller(dropdown.scrollable, {});                
                    }   
                }      

                // set zindex
                Plugin.setZindex();
            },

            /**
             * sync 
             */
            sync: function () {
                $(element).data('dropdown', dropdown);
            }, 

            /**
             * Sync dropdown object with jQuery element
             */
            disableClose: function () {
                element.on('click', '.m-dropdown--disable-close, .mCSB_1_scrollbar', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            },

            /**
             * Toggle dropdown
             */
            toggle: function () {
                if (dropdown.open) {
                    return Plugin.hide();
                } else {
                    return Plugin.show();
                }
            },

            /**
             * Set content
             */
            setContent: function (content) {
                element.find('.m-dropdown__content').html(content);
                
                return dropdown;
            },

            /**
             * Show dropdown
             */
            show: function() {
                if (dropdown.options.toggle == 'hover' && element.data('hover')) {
                    Plugin.clearHovered(); 
                    return dropdown;
                }

                if (dropdown.open) {
                    return dropdown;
                }

                if (dropdown.arrow.length > 0) {
                    Plugin.adjustArrowPos();
                }

                Plugin.eventTrigger('beforeShow'); 

                Plugin.hideOpened();

                element.addClass('m-dropdown--open');

                if (mUtil.isMobileDevice() && dropdown.options.mobileOverlay) {
                    var zIndex = dropdown.wrapper.css('zIndex') - 1;
                    var dropdownoff = $('<div class="m-dropdown__dropoff"></div>');

                    dropdownoff.css('zIndex', zIndex);
                    dropdownoff.data('dropdown', element);
                    element.data('dropoff', dropdownoff);
                    element.after(dropdownoff);
                    dropdownoff.click(function(e) {
                        Plugin.hide();
                        $(this).remove();                    
                        e.preventDefault();
                    });
                } 

                element.focus();
                element.attr('aria-expanded', 'true');
                dropdown.open = true;

                Plugin.handleDropPosition();          

                Plugin.eventTrigger('afterShow');

                return dropdown;
            },

            /**
             * Clear dropdown hover
             */
            clearHovered: function () {
                element.removeData('hover');
                var timeout = element.data('timeout');
                element.removeData('timeout');
                clearTimeout(timeout);
            },

            /**
             * Hide hovered dropdown
             */
            hideHovered: function(force) {
                if (force) {
                    if (Plugin.eventTrigger('beforeHide') === false) {
                        // cancel hide
                        return;
                    }  

                    Plugin.clearHovered();        
                    element.removeClass('m-dropdown--open');
                    dropdown.open = false;
                    Plugin.eventTrigger('afterHide');
                } else {
                    if (Plugin.eventTrigger('beforeHide') === false) {
                        // cancel hide
                        return;
                    }
                    var timeout = setTimeout(function() {
                        if (element.data('hover')) {
                            Plugin.clearHovered();        
                            element.removeClass('m-dropdown--open');
                            dropdown.open = false;
                            Plugin.eventTrigger('afterHide');
                        }
                    }, dropdown.options.hoverTimeout);

                    element.data('hover', true);
                    element.data('timeout', timeout); 
                }     
            },

            /**
             * Hide clicked dropdown
             */
            hideClicked: function() {    
                if (Plugin.eventTrigger('beforeHide') === false) {
                    // cancel hide
                    return;
                }             
                element.removeClass('m-dropdown--open');
                if (element.data('dropoff')) {
                    element.data('dropoff').remove();
                }
                dropdown.open = false;
                Plugin.eventTrigger('afterHide');
            },

            /**
             * Hide dropdown
             */
            hide: function(force) {
                if (dropdown.open === false) {
                    return dropdown;
                }

                if (dropdown.options.toggle == 'hover') {
                    Plugin.hideHovered(force);
                } else {
                    Plugin.hideClicked();
                }

                if (dropdown.defaultDropPos == 'down' && dropdown.currentDropPos == 'up') {
                    element.removeClass('m-dropdown--up');
                    dropdown.arrow.prependTo(dropdown.wrapper);
                    dropdown.currentDropPos = 'down';
                }

                return dropdown;                
            },

            /**
             * Hide opened dropdowns
             */
            hideOpened: function() {
                $('.m-dropdown.m-dropdown--open').each(function() {
                    $(this).mDropdown().hide(true);
                });
            },

            /**
             * Adjust dropdown arrow positions
             */
            adjustArrowPos: function() {
                var width = element.outerWidth();
                var alignment = dropdown.arrow.hasClass('m-dropdown__arrow--right') ? 'right' : 'left';
                var pos = 0;

                if (dropdown.arrow.length > 0) {
                    if (mUtil.isInResponsiveRange('mobile') && element.hasClass('m-dropdown--mobile-full-width')) {
                        pos = element.offset().left + (width / 2) - Math.abs(dropdown.arrow.width() / 2) - parseInt(dropdown.wrapper.css('left'));
                        dropdown.arrow.css('right', 'auto');    
                        dropdown.arrow.css('left', pos);    
                        dropdown.arrow.css('margin-left', 'auto');
                        dropdown.arrow.css('margin-right', 'auto');
                    } else if (dropdown.arrow.hasClass('m-dropdown__arrow--adjust')) {
                        pos = width / 2 - Math.abs(dropdown.arrow.width() / 2);
                        if (element.hasClass('m-dropdown--align-push')) {
                            pos = pos + 20;
                        }
                        if (alignment == 'right') { 
                            dropdown.arrow.css('left', 'auto');  
                            dropdown.arrow.css('right', pos);
                        } else {                            
                            dropdown.arrow.css('right', 'auto');  
                            dropdown.arrow.css('left', pos);
                        }  
                    }                    
                }
            },

            /**
             * Change dropdown drop position
             */
            handleDropPosition: function() {
                return;
                
                if (dropdown.options.dropAuto == true) {
                    if (Plugin.isInVerticalViewport() === false) {
                        if (dropdown.currentDropPos == 'up') {
                            element.removeClass('m-dropdown--up');
                            dropdown.arrow.prependTo(dropdown.wrapper);
                            dropdown.currentDropPos = 'down';
                        } else if (dropdown.currentDropPos == 'down') {
                            element.addClass('m-dropdown--up');
                            dropdown.arrow.appendTo(dropdown.wrapper);
                            dropdown.currentDropPos = 'up'; 
                        }
                    }
                }
            },

            /**
             * Get zindex
             */
            setZindex: function() {
                var oldZindex = dropdown.wrapper.css('z-index');
                var newZindex = mUtil.getHighestZindex(element);
                if (newZindex > oldZindex) {
                    dropdown.wrapper.css('z-index', zindex);
                }
            },

            /**
             * Check persistent
             */
            isPersistent: function () {
                return dropdown.options.persistent;
            },

            /**
             * Check persistent
             */
            isShown: function () {
                return dropdown.open;
            },

            /**
             * Check if dropdown is in viewport
             */
            isInVerticalViewport: function() {
                var el = dropdown.wrapper;
                var offset = el.offset();
                var height = el.outerHeight();
                var width = el.width();
                var scrollable = el.find('[data-scrollable]');

                if (scrollable.length) {
                    if (scrollable.data('max-height')) {
                        height += parseInt(scrollable.data('max-height'));
                    } else if(scrollable.data('height')) {
                        height += parseInt(scrollable.data('height'));
                    }
                }

                return (offset.top + height < $(window).scrollTop() + $(window).height());
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < dropdown.events.length; i++) {
                    var event = dropdown.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                dropdown.events[i].fired = true;
                                return event.handler.call(this, dropdown);
                            }
                        } else {
                            return  event.handler.call(this, dropdown);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                dropdown.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();

                return dropdown;
            }
        };

        // Run plugin
        Plugin.run.apply(this, [options]);

        //////////////////////
        // ** Public API ** //
        //////////////////////
       
        /**
         * Show dropdown
         * @returns {mDropdown}
         */
        dropdown.show = function () {
            return Plugin.show();
        };

        /**
         * Hide dropdown
         * @returns {mDropdown}
         */
        dropdown.hide = function () {
            return Plugin.hide();
        };

        /**
         * Toggle dropdown
         * @returns {mDropdown}
         */
        dropdown.toggle = function () {
            return Plugin.toggle();
        };

        /**
         * Toggle dropdown
         * @returns {mDropdown}
         */
        dropdown.isPersistent = function () {
            return Plugin.isPersistent();
        };

        /**
         * Check shown state
         * @returns {mDropdown}
         */
        dropdown.isShown = function () {
            return Plugin.isShown();
        };

        /**
         * Check shown state
         * @returns {mDropdown}
         */
        dropdown.fixDropPosition = function () {
            return Plugin.handleDropPosition();
        };

        /**
         * Set dropdown content
         * @returns {mDropdown}
         */
        dropdown.setContent = function (content) {
            return Plugin.setContent(content);
        };

        /**
         * Set dropdown content
         * @returns {mDropdown}
         */
        dropdown.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set dropdown content
         * @returns {mDropdown}
         */
        dropdown.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        

        return dropdown;
    };

    // default options
    $.fn.mDropdown.defaults = {
        toggle: 'click',
        hoverTimeout: 300,
        skin: 'default',
        height: 'auto',
        dropAuto: true,
        maxHeight: false,
        minHeight: false,
        persistent: false,
        mobileOverlay: true
    };

    // global init
    if (mUtil.isMobileDevice()) {
        $(document).on('click', '[data-dropdown-toggle="click"] .m-dropdown__toggle, [data-dropdown-toggle="hover"] .m-dropdown__toggle', function(e) { 
            e.preventDefault(); 
            $(this).parent('.m-dropdown').mDropdown().toggle(); 
        });
    } else {
        $(document).on('click', '[data-dropdown-toggle="click"] .m-dropdown__toggle', function(e) { 
            e.preventDefault();
            $(this).parent('.m-dropdown').mDropdown().toggle();   
        });
        $(document).on('mouseenter', '[data-dropdown-toggle="hover"]', function(e) { 
            $(this).mDropdown().toggle();
        });
    }

    // handle global document click
    $(document).on('click', function(e) {
        $('.m-dropdown.m-dropdown--open').each(function() {
            if (!$(this).data('dropdown')) {
                return;
            }        
            
            var target = $(e.target);
            var dropdown = $(this).mDropdown();
            var toggle = $(this).find('.m-dropdown__toggle');

            if (toggle.length > 0 && target.is(toggle) !== true && toggle.find(target).length === 0 && target.find(toggle).length === 0 && dropdown.isPersistent() == false) {
                dropdown.hide();     
            } else if ($(this).find(target).length === 0) {
                dropdown.hide();       
            }
        });
    });
}(jQuery));
(function ($) {
    // Plugin function
    $.fn.mExample = function (options) {
        // Plugin scope variable
        var example = {};
        var element = $(this);

        // Plugin class
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('example')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    
                    // assign instance to the element                    
                    element.data('example', example);
                } else {
                    // get instance from the element
                    example = element.data('example');
                }               

                return example;
            },

            /**
             * Initialize
             */
            init: function(options) {
                example.events = [];
                example.scrollable = element.find('.m-example__scrollable');
                example.options = $.extend(true, {}, $.fn.mExample.defaults, options);
                if (example.scrollable.length > 0) {
                    if (example.scrollable.data('data-min-height')) {
                        example.options.minHeight = example.scrollable.data('data-min-height');
                    }

                    if (example.scrollable.data('data-max-height')) {
                        example.options.maxHeight = example.scrollable.data('data-max-height');
                    }
                }                
            },

            /**
             * Build DOM and init event handlers
             */
            build: function () {
                if (mUtil.isMobileDevice()) {
                    
                } else {
                    
                }                
            }, 

            /**
             * Setup example
             */
            setup: function () {
               
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < example.events.length; i++) {
                    var event = example.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                example.events[i].fired = true;
                                return event.handler.call(this, example);
                            }
                        } else {
                            return  event.handler.call(this, example);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                example.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();
            }
        };

        // Run plugin
        Plugin.run.apply(this, [options]);

        //////////////////////
        // ** Public API ** //
        //////////////////////
       

        /**
         * Set example content
         * @returns {mExample}
         */
        example.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set example content
         * @returns {mExample}
         */
        example.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        

        return example;
    };

    // default options
    $.fn.mExample.defaults = {
       
    };
}(jQuery));
(function($) {

    // Plugin function
    $.fn.mHeader = function(options) {
        // Plugin scope variable
        var header = this;
        var element = $(this);

        // Plugin class
        var Plugin = {
            /**
             * Run plugin
             * @returns {mHeader}
             */
            run: function(options) { 
                if (element.data('header')) {
                    header = element.data('header');                
                } else {
                    // reset header
                    Plugin.init(options);

                    // reset header
                    Plugin.reset();

                    // build header
                    Plugin.build();

                    element.data('header', header);
                } 

                return header;
            },

            /**
             * Handles subheader click toggle
             * @returns {mHeader}
             */
            init: function(options) {                
                header.options = $.extend(true, {}, $.fn.mHeader.defaults, options);
            },

            /**
             * Reset header
             * @returns {mHeader}
             */
            build: function() {
                Plugin.toggle();                   
            },

            toggle: function() {
                var lastScrollTop = 0;

                if (header.options.minimize.mobile === false && header.options.minimize.desktop === false) {
                    return;
                }          

                $(window).scroll(function() {
                    var offset = 0;

                    if (mUtil.isInResponsiveRange('desktop')) {
                        offset = header.options.offset.desktop;
                        on = header.options.minimize.desktop.on;
                        off = header.options.minimize.desktop.off;
                    } else if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                        offset = header.options.offset.mobile;
                        on = header.options.minimize.mobile.on;
                        off = header.options.minimize.mobile.off;
                    }

                    var st = $(this).scrollTop();

                    if (st > offset && lastScrollTop < st){ // down scroll mode
                        $("body").addClass(on);
                        $("body").removeClass(off);
                    } else { // back scroll mode
                        $("body").addClass(off);
                        $("body").removeClass(on);
                    }
                    
                    lastScrollTop = st;
                });
            },

            /**
             * Reset menu
             * @returns {mMenu}
             */
            reset: function() {
            }
        };

        // Run plugin
        Plugin.run.apply(header, [options]);

        //////////////////////
        // ** Public API ** //
        //////////////////////

        /**
         * Disable header for given time
         * @returns {jQuery}
         */
        header.publicMethod = function() {
        	//return Plugin.publicMethod();
        };

        // Return plugin instance
        return header;
    };

    // Plugin default options
    $.fn.mHeader.defaults = {
        offset: {
            mobile: 150,
            desktop: 200        
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    }; 
}(jQuery));
(function($) {

    // Plugin function
    $.fn.mMenu = function(options) {
        // Plugin scope variable
        var menu = this;
        var element = $(this);

        // Plugin class
        var Plugin = {
            /**
             * Run plugin
             * @returns {mMenu}
             */
            run: function(options, reinit) { 
                if (element.data('menu') && reinit !== true) {
                    menu = element.data('menu');                
                } else {
                    // reset menu
                    Plugin.init(options);

                    // reset menu
                    Plugin.reset();

                    // build menu
                    Plugin.build();

                    /*
                    if (element.find('.m-menu__item--resize').length > 0) {
                        Plugin.resize();
                    }
                    */

                    element.data('menu', menu);
                } 

                return menu;
            },

            /**
             * Handles submenu click toggle
             * @returns {mMenu}
             */
            init: function(options) { 
                // merge default and user defined options
                menu.options = $.extend(true, {}, $.fn.mMenu.defaults, options);

                // pause menu
                menu.pauseDropdownHoverTime = 0;
            },

            /**
             * Reset menu
             * @returns {mMenu}
             */
            build: function() {
                // accordion mode
                if (Plugin.getSubmenuMode() === 'accordion') {
                	element.on('click', '.m-menu__toggle', Plugin.handleSubmenuAccordion);
                } 

                // dropdown mode(hoverable)
                if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {   
                	// dropdown submenu - hover toggle
	                element.on({mouseenter: Plugin.handleSubmenuDrodownHoverEnter, mouseleave: Plugin.handleSubmenuDrodownHoverExit}, '[data-menu-submenu-toggle="hover"]');

	                // dropdown submenu - click toggle
	                element.on('click', '[data-menu-submenu-toggle="click"] .m-menu__toggle', Plugin.handleSubmenuDropdownClick);
                    element.on('click', '.m-menu__link', Plugin.handleSubmenuDropdownClose);
                }             
            },

            /**
             * Reset menu
             * @returns {mMenu}
             */
            reset: function() {
            	// remove accordion handler
            	element.off('click', '.m-menu__toggle', Plugin.handleSubmenuAccordion);

            	// remove dropdown handlers
            	element.off({mouseenter: Plugin.handleSubmenuDrodownHoverEnter, mouseleave: Plugin.handleSubmenuDrodownHoverExit}, '[data-menu-submenu-toggle="hover"]');
            	element.off('click', '[data-menu-submenu-toggle="click"] .m-menu__toggle', Plugin.handleSubmenuDropdownClick);

                // reset mobile menu attributes
                menu.find('.m-menu__submenu, .m-menu__inner').css('display', '');
                menu.find('.m-menu__item--hover').removeClass('m-menu__item--hover');
                menu.find('.m-menu__item--open:not(.m-menu__item--expanded)').removeClass('m-menu__item--open');
            },

            /**
            * Get submenu mode for current breakpoint and menu state
            * @returns {mMenu}
            */
            getSubmenuMode: function() {                
                if (mUtil.isInResponsiveRange('desktop')) {
                    if (mUtil.isset(menu.options.submenu, 'desktop.state.body')) {
                        if ($('body').hasClass(menu.options.submenu.desktop.state.body)) {
                            return menu.options.submenu.desktop.state.mode;
                        } else {
                            return menu.options.submenu.desktop.default;
                        }
                    } else if (mUtil.isset(menu.options.submenu, 'desktop') ){
                        return menu.options.submenu.desktop;
                    }
                } else if (mUtil.isInResponsiveRange('tablet') && mUtil.isset(menu.options.submenu, 'tablet')) {
                    return menu.options.submenu.tablet;
                } else if (mUtil.isInResponsiveRange('mobile') && mUtil.isset(menu.options.submenu, 'mobile')) {
                    return menu.options.submenu.mobile;
                } else {
                    return false;
                }
            },

            /**
            * Get submenu mode for current breakpoint and menu state
            * @returns {mMenu}
            */
            isConditionalSubmenuDropdown: function() {
                if (mUtil.isInResponsiveRange('desktop') && mUtil.isset(menu.options.submenu, 'desktop.state.body')) {
                    return true;
                } else {
                    return false;    
                }                
            },

            /**
             * Handles submenu hover toggle
             * @returns {mMenu}
             */
            handleSubmenuDrodownHoverEnter: function(e) {
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }

                if (menu.resumeDropdownHover() === false) {
                    return;
                }               

                var item = $(this);

                Plugin.showSubmenuDropdown(item);

                if (item.data('hover') == true) {
                    Plugin.hideSubmenuDropdown(item, false);
                }
            },

            /**
             * Handles submenu hover toggle
             * @returns {mMenu}
             */
            handleSubmenuDrodownHoverExit: function(e) {
                if (menu.resumeDropdownHover() === false) {
                    return;
                }

                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }

                var item = $(this);
                var time = menu.options.dropdown.timeout;

                var timeout = setTimeout(function() {
                    if (item.data('hover') == true) {
                        Plugin.hideSubmenuDropdown(item, true);
                    }
                }, time);

                item.data('hover', true);
                item.data('timeout', timeout);
            },

            /**
             * Handles submenu click toggle
             * @returns {mMenu}
             */
            handleSubmenuDropdownClick: function(e) {
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }

                var item = $(this).closest('.m-menu__item');

                if (!item.hasClass('m-menu__item--hover')) {
                    item.addClass('m-menu__item--open-dropdown');
                    Plugin.showSubmenuDropdown(item);
                    if (mUtil.isMobileDevice()) {
                        //Plugin.createSubmenuDropdownClickDropoff(item);
                    }
                } else {
                    item.removeClass('m-menu__item--open-dropdown');
                    Plugin.hideSubmenuDropdown(item);
                }

                e.preventDefault();
            },

            /**
             * Handles submenu dropdown close on link click
             * @returns {mMenu}
             */
            handleSubmenuDropdownClose: function(e) {
                // exit if its not submenu dropdown mode
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }
                
                var parents = $(this).parents('.m-menu__item.m-menu__item--submenu');

                // check if currently clicked link's parent item ha
                if (parents.length > 0 && $(this).hasClass('m-menu__toggle') === false && $(this).find('.m-menu__toggle').length === 0) {
                    // close opened dropdown menus
                    parents.each(function() {
                        Plugin.hideSubmenuDropdown($(this), true);
                    });                     
                }                 
            },

            /**
             * helper functions
             * @returns {mMenu}
             */
            handleSubmenuAccordion: function(e) {
                if (Plugin.getSubmenuMode() === 'dropdown') {
                    return;
                }

                var item = $(this);

                var li = item.closest('li');
                var submenu = li.children('.m-menu__submenu, .m-menu__inner');

                if (submenu.parent('.m-menu__item--expanded').length != 0) {
                    //return;
                }

                if (submenu.length > 0) {
                    e.preventDefault();
                    var speed = menu.options.accordion.slideSpeed;
                    var hasClosables = false;

                    if (li.hasClass('m-menu__item--open') === false) {
                        // hide other accordions
                        if (menu.options.accordion.expandAll === false) {
                            var closables = item.closest('.m-menu__nav, .m-menu__subnav').find('> .m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded)');
                            closables.each(function() {
                                $(this).children('.m-menu__submenu').slideUp(speed, function() {
                                    Plugin.scrollToItem(item);
                                });                                
                                $(this).removeClass('m-menu__item--open');
                            });

                            if (closables.length > 0) {
                                hasClosables = true;
                            }
                        }                         

                        if (hasClosables) {
                            submenu.slideDown(speed, function() {
                                Plugin.scrollToItem(item);
                            }); 
                            li.addClass('m-menu__item--open');

                            //setTimeout(function() {
                                
                            //}, speed);
                        } else {
                            submenu.slideDown(speed, function() {
                                Plugin.scrollToItem(item);
                            });
                            li.addClass('m-menu__item--open');
                        }                        
                    } else {  
                        submenu.slideUp(speed, function() {
                             Plugin.scrollToItem(item);
                        });                        
                        li.removeClass('m-menu__item--open');                  
                    }
                }
            },     

            /**
             * scroll to item function
             * @returns {mMenu}
             */
            scrollToItem: function(item) {
                // handle auto scroll for accordion submenus
                if (menu.options.accordion.autoScroll && !element.data('menu-scrollable')) {                        
                    mApp.scrollToViewport(item);
                }
            },

            /**
             * helper functions
             * @returns {mMenu}
             */
            hideSubmenuDropdown: function(el, classAlso) {
                // remove submenu activation class
                if (classAlso) {
                    el.removeClass('m-menu__item--hover');
                }
                // clear timeout
                el.removeData('hover');
                var timeout = el.data('timeout');
                el.removeData('timeout');
                clearTimeout(timeout);
            },

            /**
             * helper functions
             * @returns {mMenu}
             */
            showSubmenuDropdown: function(item) {
                // close active submenus
                element.find('.m-menu__item--submenu.m-menu__item--hover').each(function() {
                    var el = $(this);
                    if (item.is(el) || el.find(item).length > 0 || item.find(el).length > 0) {
                        return;
                    } else {
                        Plugin.hideSubmenuDropdown(el, true); 
                    }
                });

                // adjust submenu position
                Plugin.adjustSubmenuDropdownArrowPos(item);
                
                // add submenu activation class
                item.addClass('m-menu__item--hover');

                // handle auto scroll for accordion submenus
                if (Plugin.getSubmenuMode() === 'accordion' && menu.options.accordion.autoScroll) {
                    mApp.scrollTo(item.children('.m-menu__item--submenu'));
                }              
            },                

            /**
             * Handles submenu click toggle
             * @returns {mMenu}
             */
            resize: function(e) {
                if (Plugin.getSubmenuMode() !== 'dropdown') {
                    return;
                }

                var resize = element.find('> .m-menu__nav > .m-menu__item--resize');
                var submenu = resize.find('> .m-menu__submenu');
                var breakpoint;
                var currentWidth = mUtil.getViewPort().width;
                var itemsNumber = element.find('> .m-menu__nav > .m-menu__item').length - 1;
                var check;

                if (
                    Plugin.getSubmenuMode() == 'dropdown' && 
                    (
                        (mUtil.isInResponsiveRange('desktop') && mUtil.isset(menu.options, 'resize.desktop') && (check = menu.options.resize.desktop) && currentWidth <= (breakpoint = resize.data('menu-resize-desktop-breakpoint'))) ||
                        (mUtil.isInResponsiveRange('tablet') && mUtil.isset(menu.options, 'resize.tablet') && (check = menu.options.resize.tablet) && currentWidth <= (breakpoint = resize.data('menu-resize-tablet-breakpoint'))) ||
                        (mUtil.isInResponsiveRange('mobile') && mUtil.isset(menu.options, 'resize.mobile') && (check = menu.options.resize.mobile) && currentWidth <= (breakpoint = resize.data('menu-resize-mobile-breakpoint')))
                    )
                    ) {
                 
                    var moved = submenu.find('> .m-menu__subnav > .m-menu__item').length; // currently move
                    var left = element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').length; // currently left
                    var total = moved + left;

                    if (check.apply() === true) {
                        // return
                        if (moved > 0) {
                            submenu.find('> .m-menu__subnav > .m-menu__item').each(function() {
                                var item = $(this);

                                var elementsNumber = submenu.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').length;
                                element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').eq(elementsNumber - 1).after(item);

                                if (check.apply() === false) {
                                    item.appendTo(submenu.find('> .m-menu__subnav'));
                                    return false;
                                }         

                                moved--;
                                left++;                        
                            });
                        }
                    } else {
                        // move
                        if (left > 0) {
                            var items = element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)');
                            var index = items.length - 1;
                                
                            for(var i = 0; i < items.length; i++) {
                                var item = $(items.get(index)); 
                                index--;

                                if (check.apply() === true) {
                                    break;
                                }

                                item.appendTo(submenu.find('> .m-menu__subnav'));

                                moved++;
                                left--; 
                            } 
                        }
                    }

                    if (moved > 0) {
                        resize.show();  
                    } else {
                        resize.hide();
                    }                   
                } else {    
                    submenu.find('> .m-menu__subnav > .m-menu__item').each(function() {
                        var elementsNumber = submenu.find('> .m-menu__subnav > .m-menu__item').length;
                        element.find('> .m-menu__nav > .m-menu__item').get(elementsNumber).after($(this));
                    });

                    resize.hide();
                }
            },

            /**
             * Handles submenu slide toggle
             * @returns {mMenu}
             */
            createSubmenuDropdownClickDropoff: function(el) {
                var zIndex = el.find('> .m-menu__submenu').css('zIndex') - 1;
                var dropoff = $('<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');
                $('body').after(dropoff);
                dropoff.on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    el.removeClass('m-menu__item--hover');
                    $(this).remove();
                });
            },

            /**
             * Handles submenu click toggle
             * @returns {mMenu}
             */
            adjustSubmenuDropdownArrowPos: function(item) {                
                var arrow = item.find('> .m-menu__submenu > .m-menu__arrow.m-menu__arrow--adjust');
                var submenu = item.find('> .m-menu__submenu');
                var subnav = item.find('> .m-menu__submenu > .m-menu__subnav');
                
                if (arrow.length > 0) {
                    var pos;
                    var link = item.children('.m-menu__link');

                    if (submenu.hasClass('m-menu__submenu--classic') || submenu.hasClass('m-menu__submenu--fixed')) { 
                        if (submenu.hasClass('m-menu__submenu--right')) {
                            pos = item.outerWidth() / 2;
                            if (submenu.hasClass('m-menu__submenu--pull')) {
                                pos = pos + Math.abs(parseInt(submenu.css('margin-right')));    
                            }  
                            pos = submenu.width() - pos;
                        } else if (submenu.hasClass('m-menu__submenu--left')) {
                            pos = item.outerWidth() / 2;
                            if (submenu.hasClass('m-menu__submenu--pull')) {
                                pos = pos + Math.abs(parseInt(submenu.css('margin-left')));    
                            } 
                        }
                    } else  {
                        if (submenu.hasClass('m-menu__submenu--center') || submenu.hasClass('m-menu__submenu--full')) {
                            pos = item.offset().left - ((mUtil.getViewPort().width - submenu.outerWidth()) / 2);
                            pos = pos + (item.outerWidth() / 2);
                        } else if (submenu.hasClass('m-menu__submenu--left')) {
                            // to do
                        } else if (submenu.hasClass('m-menu__submenu--right')) {
                            // to do
                        }
                    } 

                    arrow.css('left', pos);
                }
            },

            /**
             * Handles submenu hover toggle
             * @returns {mMenu}
             */
            pauseDropdownHover: function(time) {
            	var date = new Date();

            	menu.pauseDropdownHoverTime = date.getTime() + time;
            },

            /**
             * Handles submenu hover toggle
             * @returns {mMenu}
             */
            resumeDropdownHover: function() {
            	var date = new Date();

            	return (date.getTime() > menu.pauseDropdownHoverTime ? true : false);
            },

            /**
             * Reset menu's current active item
             * @returns {mMenu}
             */
            resetActiveItem: function(item) {
                element.find('.m-menu__item--active').each(function() {
                    $(this).removeClass('m-menu__item--active');
                    $(this).children('.m-menu__submenu').css('display', '');

                    $(this).parents('.m-menu__item--submenu').each(function() {
                        $(this).removeClass('m-menu__item--open');
                        $(this).children('.m-menu__submenu').css('display', '');
                    });
                });             

                // close open submenus
                if (menu.options.accordion.expandAll === false) {
                    element.find('.m-menu__item--open').each(function() {
                        $(this).removeClass('m-menu__item--open');
                    });
                }
            },

            /**
             * Sets menu's active item
             * @returns {mMenu}
             */
            setActiveItem: function(item) {
                // reset current active item
                Plugin.resetActiveItem();

                var item = $(item);
                item.addClass('m-menu__item--active');
                item.parents('.m-menu__item--submenu').each(function() {
                    $(this).addClass('m-menu__item--open');
                });
            },

            /**
             * Returns page breadcrumbs for the menu's active item
             * @returns {mMenu}
             */
            getBreadcrumbs: function(item) {
                var breadcrumbs = [];
                var item = $(item);
                var link = item.children('.m-menu__link');

                breadcrumbs.push({
                    text: link.find('.m-menu__link-text').html(), 
                    title: link.attr('title'),
                    href: link.attr('href')
                });

                item.parents('.m-menu__item--submenu').each(function() {
                    var submenuLink = $(this).children('.m-menu__link');
                    breadcrumbs.push({
                        text: submenuLink.find('.m-menu__link-text').html(), 
                        title: submenuLink.attr('title'),
                        href: submenuLink.attr('href')
                    });
                });

                breadcrumbs.reverse();

                return breadcrumbs;
            },

            /**
             * Returns page title for the menu's active item
             * @returns {mMenu}
             */
            getPageTitle: function(item) {
                item = $(item);       

                return item.children('.m-menu__link').find('.m-menu__link-text').html();
            }
        };

        // Run plugin
        Plugin.run.apply(menu, [options]);

        // Handle plugin on window resize
        if (typeof(options)  !== "undefined") {
            $(window).resize(function() {
                Plugin.run.apply(menu, [options, true]);
            });  
        }        

        //////////////////////
        // ** Public API ** //
        //////////////////////

        /**
         * Set active menu item
         */
        menu.setActiveItem = function(item) {
            return Plugin.setActiveItem(item);
        };

        /**
         * Set breadcrumb for menu item
         */
        menu.getBreadcrumbs = function(item) {
            return Plugin.getBreadcrumbs(item);
        };

        /**
         * Set page title for menu item
         */
        menu.getPageTitle = function(item) {
            return Plugin.getPageTitle(item);
        };

        /**
         * Get submenu mode
         */
        menu.getSubmenuMode = function() {
            return Plugin.getSubmenuMode();
        };

        /**
         * Disable menu for given time
         * @returns {jQuery}
         */
        menu.pauseDropdownHover = function(time) {
        	Plugin.pauseDropdownHover(time);
        };

        /**
         * Disable menu for given time
         * @returns {jQuery}
         */
        menu.resumeDropdownHover = function() {
        	return Plugin.resumeDropdownHover();
        };

        // Return plugin instance
        return menu;
    };

    // Plugin default options
    $.fn.mMenu.defaults = {
        // accordion submenu mode
        accordion: {   
            slideSpeed: 300,  // accordion toggle slide speed in milliseconds
            autoScroll: true, // enable auto scrolling(focus) to the clicked menu item
            expandAll: true   // allow having multiple expanded accordions in the menu
        },
        
        // dropdown submenu mode
        dropdown: {
            timeout: 500  // timeout in milliseconds to show and hide the hoverable submenu dropdown
        }
    }; 

    // Plugin global lazy initialization
    $(document).on('click', function(e) {
        $('.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover[data-menu-submenu-toggle="click"]').each(function() {
            var  element = $(this).parent('.m-menu__nav').parent();
            menu = element.mMenu(); 
            
            if (menu.getSubmenuMode() !== 'dropdown') { 
                return;
            }

            if ($(e.target).is(element) == false && element.find($(e.target)).length == 0) {
                element.find('.m-menu__item--submenu.m-menu__item--hover[data-menu-submenu-toggle="click"]').removeClass('m-menu__item--hover');
            }          
        });
    });
}(jQuery));
(function ($) {
    // Plugin function
    $.fn.mMessenger = function (options) {
        // Plugin scope variable
        var messenger = {};
        var element = $(this);

        // Plugin class
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('messenger')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    
                    // assign instance to the element                    
                    element.data('messenger', messenger);
                } else {
                    // get instance from the element
                    messenger = element.data('messenger');
                }               

                return messenger;
            },

            /**
             * Initialize
             */
            init: function(options) {
                messenger.events = [];
                messenger.scrollable = element.find('.m-messenger__scrollable');
                messenger.options = $.extend(true, {}, $.fn.mMessenger.defaults, options);
                if (messenger.scrollable.length > 0) {
                    if (messenger.scrollable.data('data-min-height')) {
                        messenger.options.minHeight = messenger.scrollable.data('data-min-height');
                    }

                    if (messenger.scrollable.data('data-max-height')) {
                        messenger.options.maxHeight = messenger.scrollable.data('data-max-height');
                    }
                }                
            },

            /**
             * Build DOM and init event handlers
             */
            build: function () {
                if (mUtil.isMobileDevice()) {
                    
                } else {
                    
                }                
            }, 

            /**
             * Setup messenger
             */
            setup: function () {
               
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < messenger.events.length; i++) {
                    var event = messenger.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                messenger.events[i].fired = true;
                                return event.handler.call(this, messenger);
                            }
                        } else {
                            return  event.handler.call(this, messenger);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                messenger.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();
            }
        };

        // Run plugin
        Plugin.run.apply(this, [options]);

        //////////////////////
        // ** Public API ** //
        //////////////////////
       

        /**
         * Set messenger content
         * @returns {mMessenger}
         */
        messenger.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set messenger content
         * @returns {mMessenger}
         */
        messenger.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        

        return messenger;
    };

    // default options
    $.fn.mMessenger.defaults = {
       
    };
}(jQuery));
(function($) {
    // plugin setup
    $.fn.mOffcanvas = function(options) {
        // main object
        var offcanvas = this;
        var element = $(this);

        /********************
         ** PRIVATE METHODS
         ********************/
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('offcanvas')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    
                    // assign instance to the element                    
                    element.data('offcanvas', offcanvas);
                } else {
                    // get instance from the element
                    offcanvas = element.data('offcanvas');
                }               

                return offcanvas;
            },

            /**
             * Handles suboffcanvas click toggle
             */
            init: function(options) {
                offcanvas.events = [];

                // merge default and user defined options
                offcanvas.options = $.extend(true, {}, $.fn.mOffcanvas.defaults, options);

                offcanvas.overlay;
                
                offcanvas.classBase = offcanvas.options.class;
                offcanvas.classShown = offcanvas.classBase + '--on';
                offcanvas.classOverlay = offcanvas.classBase + '-overlay';
                
                offcanvas.state = element.hasClass(offcanvas.classShown) ? 'shown' : 'hidden';
                offcanvas.close = offcanvas.options.close;

                if (offcanvas.options.toggle && offcanvas.options.toggle.target) {
                    offcanvas.toggleTarget = offcanvas.options.toggle.target;
                    offcanvas.toggleState = offcanvas.options.toggle.state;
                } else {
                    offcanvas.toggleTarget = offcanvas.options.toggle; 
                    offcanvas.toggleState = '';
                }
            },

            /**
             * Setup offcanvas
             */
            build: function() {
                // offcanvas toggle
                $(offcanvas.toggleTarget).on('click', Plugin.toggle);

                if (offcanvas.close) {
                    $(offcanvas.close).on('click', Plugin.hide);
                }
            },

            /**
             * sync 
             */
            sync: function () {
                $(element).data('offcanvas', offcanvas);
            }, 

            /**
             * Handles offcanvas click toggle
             */
            toggle: function() {
                if (offcanvas.state == 'shown') {
                    Plugin.hide();
                } else {
                    Plugin.show();
                }
            },

            /**
             * Handles offcanvas click toggle
             */
            show: function() {
                if (offcanvas.state == 'shown') {
                    return;
                }

                Plugin.eventTrigger('beforeShow');

                if (offcanvas.toggleState != '') {
                    $(offcanvas.toggleTarget).addClass(offcanvas.toggleState);
                }
                
                $('body').addClass(offcanvas.classShown);
                element.addClass(offcanvas.classShown);

                offcanvas.state = 'shown';

                if (offcanvas.options.overlay) {
                    var overlay = $('<div class="' + offcanvas.classOverlay + '"></div>');                
                    element.after(overlay);
                    offcanvas.overlay = overlay;
                    offcanvas.overlay.on('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        Plugin.hide();
                    });
                } 

                Plugin.eventTrigger('afterShow');

                return offcanvas;
            },

            /**
             * Handles offcanvas click toggle
             */
            hide: function() {
                if (offcanvas.state == 'hidden') {
                    return;
                }

                Plugin.eventTrigger('beforeHide');

                if (offcanvas.toggleState != '') {
                    $(offcanvas.toggleTarget).removeClass(offcanvas.toggleState);
                }

                $('body').removeClass(offcanvas.classShown)
                element.removeClass(offcanvas.classShown);

                offcanvas.state = 'hidden';

                if (offcanvas.options.overlay) {
                    offcanvas.overlay.remove();
                } 

                Plugin.eventTrigger('afterHide');

                return offcanvas;
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < offcanvas.events.length; i++) {
                    var event = offcanvas.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                offcanvas.events[i].fired = true;
                                return event.handler.call(this, offcanvas);
                            }
                        } else {
                            return  event.handler.call(this, offcanvas);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                offcanvas.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();
            }
        };

        // main variables
        var the = this;
        
        // init plugin
        Plugin.run.apply(this, [options]);

        /********************
         ** PUBLIC API METHODS
         ********************/

        /**
         * Get suboffcanvas mode
         */
        offcanvas.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set offcanvas content
         * @returns {mOffcanvas}
         */
        offcanvas.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   

        return offcanvas;
    };

    // default options
    $.fn.mOffcanvas.defaults = {
        
    }; 
}(jQuery));
(function($) {
    // Plugin function
    $.fn.mQuicksearch = function(options) {

        // Plugin scope variables
        var qs = this;
        var element = $(this);
        
        // Plugin class        
        var Plugin = {
            /**
             * Run plugin 
             */
            run: function(options) {
                if (!element.data('qs')) {
                    // init plugin
                    Plugin.init(options);
                    // build dom
                    Plugin.build();                   
                    // store the instance in the element's data
                    element.data('qs', qs);
                } else {
                    // retrieve the instance fro the element's data
                    qs = element.data('qs'); 
                }

                return qs;
            },

            /**
             * Init plugin
             */
            init: function(options) {
                // merge default and user defined options
                qs.options = $.extend(true, {}, $.fn.mQuicksearch.defaults, options);

                // form
                qs.form = element.find('form');

                // input element
                qs.input = $(qs.options.input);

                 // close icon
                qs.iconClose = $(qs.options.iconClose);

                if (qs.options.type == 'default') {
                    // search icon
                    qs.iconSearch = $(qs.options.iconSearch);
                        
                    // cancel icon
                    qs.iconCancel = $(qs.options.iconCancel);
                }               

                // dropdown
                qs.dropdown = element.mDropdown({mobileOverlay: false});

                // cancel search timeout
                qs.cancelTimeout;

                // ajax processing state
                qs.processing = false;
            }, 

            /**
             * Build plugin
             */
            build: function() {
                // attach input keyup handler
                qs.input.keyup(Plugin.handleSearch);
                
                if (qs.options.type == 'default') {
                    qs.input.focus(Plugin.showDropdown);
                    
                    qs.iconCancel.click(Plugin.handleCancel);

                    qs.iconSearch.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').addClass('m-header-search--mobile-expanded');
                            qs.input.focus();
                        }
                    });

                    qs.iconClose.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').removeClass('m-header-search--mobile-expanded');
                            Plugin.closeDropdown();
                        }
                    });

                } else if (qs.options.type == 'dropdown') {
                    qs.dropdown.on('afterShow', function() {
                        qs.input.focus();
                    });
                    qs.iconClose.click(Plugin.closeDropdown);
                }               
            },

            /**
             * Search handler
             */ 
            handleSearch: function(e) { 
                var query = qs.input.val();

                if (query.length === 0) {
                    qs.dropdown.hide();
                    Plugin.handleCancelIconVisibility('on');
                    Plugin.closeDropdown();
                    element.removeClass(qs.options.hasResultClass);
                }

                if (query.length < qs.options.minLength || qs.processing == true) {
                    return;
                }

                qs.processing = true;
                qs.form.addClass(qs.options.spinner);
                Plugin.handleCancelIconVisibility('off');
                
                $.ajax({
                    url: qs.options.source,
                    data: {query: query},
                    dataType: 'html',
                    success: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(res).show();
                        element.addClass(qs.options.hasResultClass);    
                    },
                    error: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(qs.options.templates.error.apply(qs, res)).show();  
                        element.addClass(qs.options.hasResultClass);   
                    }
                });
            }, 

            /**
             * Handle cancel icon visibility
             */ 
            handleCancelIconVisibility: function(status) {
                if (qs.options.type == 'dropdown') {
                    return;
                }

                if (status == 'on') {
                    if (qs.input.val().length === 0) {                       
                        qs.iconCancel.css('visibility', 'hidden');
                        qs.iconClose.css('visibility', 'hidden');
                    } else {
                        clearTimeout(qs.cancelTimeout);
                        qs.cancelTimeout = setTimeout(function() {
                            qs.iconCancel.css('visibility', 'visible');
                            qs.iconClose.css('visibility', 'visible');
                        }, 500);                        
                    }
                } else {
                    qs.iconCancel.css('visibility', 'hidden');
                    qs.iconClose.css('visibility', 'hidden');
                }
            },

            /**
             * Cancel handler
             */ 
            handleCancel: function(e) {
                qs.input.val('');
                qs.iconCancel.css('visibility', 'hidden');
                element.removeClass(qs.options.hasResultClass);   
                qs.input.focus();

                Plugin.closeDropdown();
            },

            /**
             * Cancel handler
             */ 
            closeDropdown: function() {
                qs.dropdown.hide();
            },

            /**
             * Show dropdown
             */ 
            showDropdown: function(e) { 
                if (qs.dropdown.isShown() == false && qs.input.val().length > qs.options.minLength && qs.processing == false) {
                    qs.dropdown.show();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        // Run plugin
        Plugin.run.apply(qs, [options]);

        //////////////////////
        // ** Public API ** //
        //////////////////////

        /**
         * Public method
         * @returns {mQuicksearch}
         */
        qs.test = function(time) {
        	//Plugin.method(time);
        };

        // Return plugin object
        return qs;
    };

    // Plugin default options
    $.fn.mQuicksearch.defaults = {
    	minLength: 1,
        maxHeight: 300,
    };

}(jQuery));
(function($) {
    // plugin setup
    $.fn.mScrollTop = function(options) {
        // main object
        var scrollTop = this;
        var element = $(this);

        /********************
         ** PRIVATE METHODS
         ********************/
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('scrollTop')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    
                    // assign instance to the element                    
                    element.data('scrollTop', scrollTop);
                } else {
                    // get instance from the element
                    scrollTop = element.data('scrollTop');
                }               

                return scrollTop;
            },

            /**
             * Handles subscrollTop click scrollTop
             */
            init: function(options) {
                scrollTop.element = element;    
                scrollTop.events = [];

                // merge default and user defined options
                scrollTop.options = $.extend(true, {}, $.fn.mScrollTop.defaults, options);
            },

            /**
             * Setup scrollTop
             */
            build: function() {
                // handle window scroll
                if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                    $(window).bind("touchend touchcancel touchleave", function() {
                        Plugin.handle();
                    });
                } else {
                    $(window).scroll(function() {
                        Plugin.handle();
                    });
                }

                // handle button click 
                element.on('click', Plugin.scroll);
            },

            /**
             * sync 
             */
            sync: function () {
                $(element).data('scrollTop', scrollTop);
            }, 

            /**
             * Handles offcanvas click scrollTop
             */
            handle: function() {
                var pos = $(window).scrollTop(); // current vertical position
                if (pos > scrollTop.options.offset) {
                    $("body").addClass('m-scroll-top--shown');
                } else {
                    $("body").removeClass('m-scroll-top--shown');
                }
            },

            /**
             * Handles offcanvas click scrollTop
             */
            scroll: function(e) {
                e.preventDefault();

                $("html, body").animate({
                    scrollTop: 0
                }, scrollTop.options.speed);
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < scrollTop.events.length; i++) {
                    var event = scrollTop.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                scrollTop.events[i].fired = true;
                                return event.handler.call(this, scrollTop);
                            }
                        } else {
                            return  event.handler.call(this, scrollTop);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                scrollTop.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();
            }
        };

        // main variables
        var the = this;
        
        // init plugin
        Plugin.run.apply(this, [options]);

        /********************
         ** PUBLIC API METHODS
         ********************/

        /**
         * Get subscrollTop mode
         */
        scrollTop.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set scrollTop content
         * @returns {mScrollTop}
         */
        scrollTop.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   

        return scrollTop;
    };

    // default options
    $.fn.mScrollTop.defaults = {
        offset: 300,
        speed: 600
    }; 
}(jQuery));
(function($) {
    // plugin setup
    $.fn.mToggle = function(options) {
        // main object
        var toggle = this;
        var element = $(this);

        /********************
         ** PRIVATE METHODS
         ********************/
        var Plugin = {
            /**
             * Run
             */
            run: function (options) {
                if (!element.data('toggle')) {                      
                    // create instance
                    Plugin.init(options);
                    Plugin.build();
                    
                    // assign instance to the element                    
                    element.data('toggle', toggle);
                } else {
                    // get instance from the element
                    toggle = element.data('toggle');
                }               

                return toggle;
            },

            /**
             * Handles subtoggle click toggle
             */
            init: function(options) {
                toggle.element = element;    
                toggle.events = [];

                // merge default and user defined options
                toggle.options = $.extend(true, {}, $.fn.mToggle.defaults, options);

                toggle.target = $(toggle.options.target);
                toggle.targetState = toggle.options.targetState;
                toggle.togglerState = toggle.options.togglerState;

                toggle.state = mUtil.hasClasses(toggle.target, toggle.targetState) ? 'on' : 'off';
            },

            /**
             * Setup toggle
             */
            build: function() {
                element.on('click', Plugin.toggle);
            },

            /**
             * sync 
             */
            sync: function () {
                $(element).data('toggle', toggle);
            }, 

            /**
             * Handles offcanvas click toggle
             */
            toggle: function() {
                if (toggle.state == 'off') {
                    Plugin.on();
                } else {
                    Plugin.off();
                }
            },

            /**
             * Handles toggle click toggle
             */
            on: function() {
                Plugin.eventTrigger('beforeOn');
                
                toggle.target.addClass(toggle.targetState);

                if (toggle.togglerState) {
                    element.addClass(toggle.togglerState);
                }

                toggle.state = 'on';

                Plugin.eventTrigger('afterOn');

                return toggle;
            },

            /**
             * Handles toggle click toggle
             */
            off: function() {
                Plugin.eventTrigger('beforeOff');

                toggle.target.removeClass(toggle.targetState);

                if (toggle.togglerState) {
                    element.removeClass(toggle.togglerState);
                }

                toggle.state = 'off';

                Plugin.eventTrigger('afterOff');

                return toggle;
            },

            /**
             * Trigger events
             */
            eventTrigger: function(name) {
                for (i = 0; i < toggle.events.length; i++) {
                    var event = toggle.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                toggle.events[i].fired = true;
                                return event.handler.call(this, toggle);
                            }
                        } else {
                            return  event.handler.call(this, toggle);
                        }
                    }
                }
            },

            addEvent: function(name, handler, one) {
                toggle.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });

                Plugin.sync();
            }
        };

        // main variables
        var the = this;
        
        // init plugin
        Plugin.run.apply(this, [options]);

        /********************
         ** PUBLIC API METHODS
         ********************/

        /**
         * Get subtoggle mode
         */
        toggle.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };

        /**
         * Set toggle content
         * @returns {mToggle}
         */
        toggle.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   

        return toggle;
    };

    // default options
    $.fn.mToggle.defaults = {

        togglerState: '',
        targetState: ''
    }; 
}(jQuery));
$.notifyDefaults({
	template: '' +
	'<div data-notify="container" class="alert alert-{0} m-alert" role="alert">' +
	'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"></button>' +
	'<span data-notify="icon"></span>' +
	'<span data-notify="title">{1}</span>' +
	'<span data-notify="message">{2}</span>' +
	'<div class="progress" data-notify="progressbar">' +
	'<div class="progress-bar progress-bar-animated bg-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
	'</div>' +
	'<a href="{3}" target="{4}" data-notify="url"></a>' +
	'</div>'
});

Chart.elements.Rectangle.prototype.draw = function() {    
    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped, radius;
    var borderWidth = vm.borderWidth;

    // Set Radius Here
    // If radius is large enough to cause drawing errors a max radius is imposed
    var cornerRadius = this._chart.options.barRadius ? this._chart.options.barRadius : 0;

    if (!vm.horizontal) {
        // bar
        left = vm.x - vm.width / 2;
        right = vm.x + vm.width / 2;

        if (vm.y > 2 * cornerRadius) {
        	top = vm.y - cornerRadius;        
        } else {
        	top = vm.y;        
        }

        bottom = vm.base;
        signX = 1;
        signY = bottom > top? 1: -1;
        borderSkipped = vm.borderSkipped || 'bottom';
        //console.log(vm.base + '-' + vm.y);
    } else {
        // horizontal bar
        left = vm.base;
        right = vm.x;
        top = vm.y - vm.height / 2;
        bottom = vm.y + vm.height / 2;
        signX = right > left? 1: -1;
        signY = 1;
        borderSkipped = vm.borderSkipped || 'left';
    }

    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
        // borderWidth shold be less than bar width and bar height.
        var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
        borderWidth = borderWidth > barSize? barSize: borderWidth;
        var halfStroke = borderWidth / 2;
        // Adjust borderWidth when bar top position is near vm.base(zero).
        var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
        var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
        var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
        var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
        // not become a vertical line?
        if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
        }
        // not become a horizontal line?
        if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
        }
    }

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    // Corner points, from bottom-left to bottom-right clockwise
    // | 1 2 |
    // | 0 3 |
    var corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom]
    ];

    // Find first (starting) corner with fallback to 'bottom'
    var borders = ['bottom', 'left', 'top', 'right'];
    var startCorner = borders.indexOf(borderSkipped, 0);
    if (startCorner === -1) {
        startCorner = 0;
    }

    function cornerAt(index) {
        return corners[(startCorner + index) % 4];
    }

    // Draw rectangle from 'startCorner'
    var corner = cornerAt(0);
    ctx.moveTo(corner[0], corner[1]);

    for (var i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i+1;
        if(nextCornerId == 4){
            nextCornerId = 0
        }

        nextCorner = cornerAt(nextCornerId);

        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        x = corners[1][0];
        y = corners[1][1];
        
        var radius = cornerRadius;
        
        // Fix radius being too large
        if(radius > height/2){
            radius = height/2;
        }if(radius > width/2){
            radius = width/2;
        }

        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    ctx.fill();
    if (borderWidth) {
        ctx.stroke();
    }
}; 

  $.fn.markdown.defaults.iconlibrary = 'fa';
//$.fn.bootstrapSwitch.defaults.size = 'large';
//$.fn.bootstrapSwitch.defaults.onColor = 'success';
$.fn.timepicker.defaults = $.extend(true, {}, $.fn.timepicker.defaults, {
    icons: {
        up: 'la la-angle-up',
        down: 'la la-angle-down'  
    }
});
jQuery.validator.setDefaults({
	errorElement: 'div', //default input error message container
    errorClass: 'form-control-feedback', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",  // validate all fields including form hidden input

    errorPlacement: function(error, element) { // render error placement for each input type
    	var group = $(element).closest('.form-group');
        var help = group.find('.m-form__help');
        if (help.length > 0) {
            help.before(error); 
        } else {
            $(element).after(error);
        }
    },

    highlight: function(element) { // hightlight error inputs
    	$(element).closest('.form-group').addClass('has-danger'); // set error class to the control group
        if ($(element).hasClass('form-control')) {
        	//$(element).addClass('form-control-danger');
        }
    },

    unhighlight: function(element) { // revert the change done by hightlight
        $(element).closest('.form-group').removeClass('has-danger'); // set error class to the control group
        //$(element).removeClass('form-control-danger');
    },

    success: function(label, element) {
    	$(label).closest('.form-group').addClass('has-success').removeClass('has-danger'); // set success class to the control group
        $(label).closest('.form-group').find('.form-control-feedback').remove();
        //$(element).removeClass('form-control-danger');
        //$(element).addClass('form-control-success');
    }
});
var mLayout = function() {
    var horMenu;
    var asideMenu;

    var initStickyHeader = function() {
        var header = $('.m-header');
        var options = {
            offset: {},
            minimize:{}       
        };

        if (header.data('minimize-mobile') == 'hide') {
            options.minimize.mobile = {};
            options.minimize.mobile.on = 'm-header--hide';
            options.minimize.mobile.off = 'm-header--show';
        } else {
            options.minimize.mobile = false;
        }

        if (header.data('minimize') == 'minimize') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--minimize-on';
            options.minimize.desktop.off = 'm-header--minimize-off';
        } else  if (header.data('minimize') == 'hide') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--show';
            options.minimize.desktop.off = 'm-header--hide';
        } else {
            options.minimize.desktop = false;
        }

        if (header.data('minimize-offset')) {
            options.offset.desktop = header.data('minimize-offset');
        }

        if (header.data('minimize-mobile-offset')) {
            options.offset.mobile = header.data('minimize-mobile-offset');
        }        

        header.mHeader(options);
    }

    // handle horizontal menu
    var initHorMenu = function() { 
        // init aside left offcanvas
        $('#m_header_menu').mOffcanvas({
            class: 'm-aside-header-menu-mobile',
            overlay: true,
            toggle: {
                target: '#m_aside_header_menu_mobile_toggle',
                state: 'm-brand__toggler--active'
            }            
        });
        
        horMenu = $('#m_header_menu').mMenu({
            // submenu modes
            submenu: {
                desktop: 'dropdown',
                tablet: 'accordion',
                mobile: 'accordion'
            },
            // resize menu on window resize
            resize: {
                desktop: function() {
                    var headerNavWidth = $('#m_header_nav').width();
                    var headerMenuWidth = $('#m_header_menu_container').width();
                    var headerTopbarWidth = $('#m_header_topbar').width();
                    var spareWidth = 20;

                    console.log('nav:' + headerNavWidth + '=> menu:' + headerMenuWidth + '+' + headerTopbarWidth);

                    if ((headerMenuWidth + headerTopbarWidth + spareWidth) > headerNavWidth ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }    
        });
    }

    // handle vertical menu
    var initLeftAsideMenu = function() {
        var menu = $('#m_ver_menu');

        // init aside menu
        var menuOptions = {  
            // submenu setup
            submenu: {
                desktop: {
                    // by default the menu mode set to accordion in desktop mode
                    default: (menu.data('menu-dropdown') == true ? 'dropdown' : 'accordion'),
                    // whenever body has this class switch the menu mode to dropdown
                    state: {
                        body: 'm-aside-left--minimize',  
                        mode: 'dropdown'
                    }
                },
                tablet: 'accordion', // menu set to accordion in tablet mode
                mobile: 'accordion'  // menu set to accordion in mobile mode
            },

            //accordion setup
            accordion: {
                autoScroll: true,
                expandAll: false
            }
        };

        asideMenu = menu.mMenu(menuOptions);

        // handle fixed aside menu
        if (asideMenu.data('menu-scrollable')) {
            function initScrollableMenu(obj) {    
                if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                    mApp.destroyScroller(obj);
                    return;
                }

                var height = mUtil.getViewPort().height - $('.m-header').outerHeight()
                    - ($('.m-aside-left .m-aside__header').length != 0 ? $('.m-aside-left .m-aside__header').outerHeight() : 0)
                    - ($('.m-aside-left .m-aside__footer').length != 0 ? $('.m-aside-left .m-aside__footer').outerHeight() : 0);
                    //- $('.m-footer').outerHeight(); 

                // create/re-create a new instance
                mApp.initScroller(obj, {height: height});
            }

            initScrollableMenu(asideMenu);
            
            mUtil.addResizeHandler(function() {            
                initScrollableMenu(asideMenu);
            });   
        }           
    }

    // handle vertical menu
    var initLeftAside = function() {
        // init aside left offcanvas
        var asideOffcanvasClass = ($('#m_aside_left').hasClass('m-aside-left--offcanvas-default') ? 'm-aside-left--offcanvas-default' : 'm-aside-left');

        $('#m_aside_left').mOffcanvas({
            class: asideOffcanvasClass,
            overlay: true,
            toggle: {
                target: '#m_aside_left_offcanvas_toggle',
                state: 'm-brand__toggler--active'
            }            
        });        
    }

    // handle sidebar toggle
    var initLeftAsideToggle = function() {
        $('#m_aside_left_minimize_toggle').mToggle({
            target: 'body',
            targetState: 'm-brand--minimize m-aside-left--minimize',
            togglerState: 'm-brand__toggler--active'
        }).on('toggle', function() {
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);
        });

        $('#m_aside_left_hide_toggle').mToggle({
            target: 'body',
            targetState: 'm-aside-left--hide',
            togglerState: 'm-brand__toggler--active'
        }).on('toggle', function() {
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);
        })
    }

    var initTopbar = function() {
        $('#m_aside_header_topbar_mobile_toggle').click(function() {
            $('body').toggleClass('m-topbar--on');
        });                 

        // Animated Notification Icon 
        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').addClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').addClass('m-animate-blink');
        }, 3000);

        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').removeClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').removeClass('m-animate-blink');
        }, 6000);                 
    }

    var initScrollTop = function() {
        $('[data-toggle="m-scroll-top"]').mScrollTop({
            offset: 300,
            speed: 600
        });
    }

    return {
        init: function() {    
            this.initHeader();
            this.initAside();
        },

        initHeader: function() {
            initStickyHeader();
            initHorMenu();
            initTopbar();            
            initScrollTop();
        },

        initAside: function() {
            initLeftAside();
            initLeftAsideToggle();
            initLeftAsideMenu();
        }
    };
}();

$(document).ready(function() {
    if (mUtil.isAngularVersion() === false) {
        mLayout.init();
    }
});

var mQuickSidebar = function() {
    var topbarAside = $('#m_quick_sidebar');
    var topbarAsideTabs = $('#m_quick_sidebar_tabs');    
    var topbarAsideClose = $('#m_quick_sidebar_close');
    var topbarAsideToggle = $('#m_quick_sidebar_toggle');
    var topbarAsideContent = topbarAside.find('.m-quick-sidebar__content');

    var initMessages = function() {
        var init = function() {
            var messenger = $('#m_quick_sidebar_tabs_messenger');  
            var messengerMessages = messenger.find('.m-messenger__messages');

            var height = topbarAside.outerHeight(true) - 
                topbarAsideTabs.outerHeight(true) - 
                messenger.find('.m-messenger__form').outerHeight(true) - 120;
            
            // init messages scrollable content
            messengerMessages.css('height', height);
            mApp.initScroller(messengerMessages, {});
        }

        init();        
        
        // reinit on window resize
        mUtil.addResizeHandler(init);
    }

    var initSettings = function() { 
        // init dropdown tabbable content
        var init = function() {
            var settings = $('#m_quick_sidebar_tabs_settings');
            var height = mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;

            // init settings scrollable content
            settings.css('height', height);
            mApp.initScroller(settings, {});
        }

        init();

        // reinit on window resize
        mUtil.addResizeHandler(init);
    }

    var initLogs = function() {
        // init dropdown tabbable content
        var init = function() {
            var logs = $('#m_quick_sidebar_tabs_logs');
            var height = mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;

            // init settings scrollable content
            logs.css('height', height);
            mApp.initScroller(logs, {});
        }

        init();

        // reinit on window resize
        mUtil.addResizeHandler(init);
    }

    var initOffcanvasTabs = function() {
        initMessages();
        initSettings();
        initLogs();
    }

    var initOffcanvas = function() {
        topbarAside.mOffcanvas({
            class: 'm-quick-sidebar',
            //overlay: false,  
            close: topbarAsideClose,
            toggle: topbarAsideToggle
        });   

        // run once on first time dropdown shown
        topbarAside.mOffcanvas().one('afterShow', function() {
            mApp.block(topbarAside);

            setTimeout(function() {
                mApp.unblock(topbarAside);
                
                topbarAsideContent.removeClass('m--hide');

                initOffcanvasTabs();
            }, 1000);                         
        });
    }

    return {     
        init: function() {  
            initOffcanvas(); 
        }
    };
}();

$(document).ready(function() {
    mQuickSidebar.init();
});
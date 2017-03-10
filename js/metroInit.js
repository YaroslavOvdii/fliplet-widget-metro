UIFreewallVertical = (function() {

	var data;

	function UIFreewallVertical(config) {
		data = config;
		UIFreewallVertical.setupFreewalVertical(data);
		window.addEventListener( 'resize', UIFreewallVertical.setupFreewalVertical(data), false );
	}

	UIFreewallVertical.loadMetro = function() {
		$('[data-metro-id="'+data.id+'"]').addClass('ready');
	};

	UIFreewallVertical.setupFreewalVertical = function(data) {
		var wall = new freewall('[data-metro-id="'+data.id+'"]');
    var cellWidth;
    var cellHeight;
		wall.reset({
			selector : '.panels',
			cellW : function() {

				var width = $('body').width();

				if (width >= 1300) {
					cellWidth = 330;
					return cellWidth;
				} else if (width >= 1200) {
					cellWidth = 310;
					return cellWidth;
				} else if (width >= 1024) {
					cellWidth = 230;
					return cellWidth;
				} else if (width >= 640) {
					cellWidth = 185;
					return cellWidth;
				} else if (width >= 400) {
					cellWidth = 150;
					return cellWidth;
				} else {
					cellWidth = 135;
					return cellWidth;
				}
		  },
			cellH : function() {

				var width = $('body').width();

				if (width >= 1300) {
					cellHeight = 330;
					return cellHeight;
				} else if (width >= 1200) {
					cellHeight = 310;
					return cellHeight;
				} else if (width >= 1014) {
					cellHeight = 230;
					return cellHeight;
				} else if (width >= 640) {
					cellHeight = 185;
					return cellHeight;
				} else if (width >= 400) {
					cellHeight = 150;
					return cellHeight;
				} else {
					cellHeight = 135;
					return cellHeight;
				}
		  },
			gutterY : data.enableGap ? 10 : 0,
			gutterX : data.enableGap ? 10 : 0,
      onResize: function() {
        wall.fitWidth();
      }
		});

		wall.fitWidth();

		function addClass() {
			if (Modernizr.android) {
				setTimeout(function(){
					$('.metro-panels').addClass('ready');
					setTimeout(function(){
						$('body').css({ transform: "translateZ(1px)" }).css({ transform: "translateZ(0)" });
					}, 300 );
				}, 500 );
			}
		}
	};

	return UIFreewallVertical;

})();

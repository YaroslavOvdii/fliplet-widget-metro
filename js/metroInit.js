UIFreewallVertical = (function() {
  var data;

  function UIFreewallVertical(config) {
    data = config;

    UIFreewallVertical.setupFreewalVertical(data);

    // Appearance changes Hook
    Fliplet.Hooks.on('appearanceChanged', function() {
      UIFreewallVertical.setupFreewalVertical(data);
    });

    // Appearance file changed Hook
    Fliplet.Hooks.on('appearanceFileChanged', function() {
      UIFreewallVertical.setupFreewalVertical(data);
    });

    // Resize handler
    window.addEventListener('resize', UIFreewallVertical.setupFreewalVertical(data), false);

    // Reload desktop screen
    window.addEventListener('message', function(event) {
      if (event.data.event === 'set-preview-device' && event.data.platform === 'web') {
        Fliplet.Widget.emit('reload-widget-instance');
      }
    });
  }

  UIFreewallVertical.loadMetro = function() {
    $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').addClass('ready');
  };

  UIFreewallVertical.setupFreewalVertical = function(data) {
    var wall = new freewall('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])');
    var cellWidth;
    var cellHeight;
    wall.reset({
      selector: '.panels',
      cellW: function() {

        var width = $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').parent().width();

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
          cellWidth = 155;
          return cellWidth;
        } else {
          cellWidth = 140;
          return cellWidth;
        }
      },
      cellH: function() {
        var width = $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').parent().width();

        if (width >= 1300) {
          cellHeight = 330;
          return cellHeight;
        } else if (width >= 1200) {
          cellHeight = 310;
          return cellHeight;
        } else if (width >= 1024) {
          cellHeight = 230;
          return cellHeight;
        } else if (width >= 640) {
          cellHeight = 185;
          return cellHeight;
        } else if (width >= 400) {
          cellHeight = 155;
          return cellHeight;
        } else {
          cellHeight = 140;
          return cellHeight;
        }
      },
      gutterY: data.enableGap ? 10 : 0,
      gutterX: data.enableGap ? 10 : 0,
      rightToLeft: $('html[dir="rtl"]').length ? true : false,
      cacheSize: false,
      onResize: function() {
        wall.fitWidth();
      }
    });

    var images = wall.container.find('.panels img');
    if (images.length) {
      images.find('img').load(function() {
        wall.fitWidth();
      });
    } else {
      wall.fitWidth();
    }

    function addClass() {
      if (Modernizr.android) {
        setTimeout(function() {
          $('div:not("[data-mce-bogus]") .metro-panels').addClass('ready');
          setTimeout(function() {
            $('body').css({
              transform: 'translateZ(1px)'
            }).css({
              transform: 'translateZ(0)'
            });
          }, 300);
        }, 500);
      }
    }
  };

  return UIFreewallVertical;
})();

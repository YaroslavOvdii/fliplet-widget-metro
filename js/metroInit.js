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

    function resizePanels() {
      var $container = $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').parent();
      var $panelsContainer = $container.find('.metro-panels ul');
      var containerWidth = $container.width();

      if (containerWidth >= 1300) {
        $panelsContainer.attr('data-container-size', 1300);
      } else if (containerWidth >= 1200) {
        $panelsContainer.attr('data-container-size', 1200);
      } else if (containerWidth >= 1024) {
        $panelsContainer.attr('data-container-size', 1024);
      } else if (containerWidth >= 640) {
        $panelsContainer.attr('data-container-size', 640);
      } else if (containerWidth >= 420) {
        $panelsContainer.attr('data-container-size', 420);
      } else {
        $panelsContainer.attr('data-container-size', 'initial');
      }
    }

    resizePanels();

    wall.reset({
      selector: '.panels',
      cellW: function() {
        var width = $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').parent().width();

        if (width >= 1300) {
          return 330;
        } else if (width >= 1200) {
          return 310;
        } else if (width >= 1024) {
          return 230;
        } else if (width >= 640) {
          return 185;
        } else if (width >= 420) {
          return 160;
        } else {
          return 150;
        }
      },
      cellH: function() {
        var width = $('[data-metro-id="' + data.id + '"]:not([data-mce-bogus] [data-metro-id="' + data.id + '"])').parent().width();

        if (width >= 1300) {
          return 330;
        } else if (width >= 1200) {
          return 310;
        } else if (width >= 1024) {
          return 230;
        } else if (width >= 640) {
          return 185;
        } else if (width >= 420) {
          return 160;
        } else {
          return 150;
        }
      },
      gutterY: data.enableGap ? 10 : 0,
      gutterX: data.enableGap ? 10 : 0,
      rightToLeft: $('html[dir="rtl"]').length ? true : false,
      cacheSize: false,
      onResize: function() {
        resizePanels();
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

window.ui = window.ui || {}
ui.uiFreewallVertical = {};

Fliplet.Widget.instance('metro', function (data) {
  var $container = $(this);

  function authenticateImages() {
    _.forEach(data.items, function (item) {
      if (!_.get(item, 'imageConf.url') || !Fliplet.Media.isRemoteUrl(item.imageConf.url)) {
        return;
      }

      $container.find('[data-metro-item-id="' + item.id + '"] .metro-image').css({
        backgroundImage: 'url(' + Fliplet.Media.authenticate(item.imageConf.url) + ')'
      });
    });
  }

  function init() {
    var id = $container.data('metro-id');

    ui.uiFreewallVertical[id] = new UIFreewallVertical(data);
    UIFreewallVertical.loadMetro();

    $container.on('click', '.linked[data-metro-item-id]', function (event) {
      event.preventDefault();

      var itemID = $(this).data('metro-item-id')
      var itemData = _.find(data.items, { id: itemID });

      if (!_.isUndefined(_.get(itemData, 'linkAction'))
        && !_.isEmpty(_.get(itemData, 'linkAction'))) {
        Fliplet.Navigate.to(itemData.linkAction);
      }
    });
    authenticateImages();
  }

  var debounceLoad = _.debounce(init, 500);

  Fliplet().then(function () {
    Fliplet.Studio.onEvent(function (event) {
      if (event.detail.event === 'reload-widget-instance') {
        debounceLoad();
      }
    });
    init();
  });
});
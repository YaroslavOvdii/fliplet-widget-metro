window.uiFreewallVertical = {};
Fliplet.Navigator.onReady().then(function(){

  function init() {
    window.uiFreewallVertical = new UIFreewallVertical();
    UIFreewallVertical.loadMetro();

    $('.linked[data-metro-item-id]').click(function (event) {
        event.preventDefault();

        var data = Fliplet.Widget.getData($(this).parents('[data-metro-id]').data('metro-id'));

        var itemData = _.find(data.items,{id: $(this).data('metro-item-id')});

        if(!_.isUndefined(itemData) && (!_.isUndefined(itemData.linkAction) && !_.isEmpty(itemData.linkAction))) {
            Fliplet.Navigate.to(itemData.linkAction);
        }
    });
  }

  var debounceLoad = _.debounce(init, 500);

  Fliplet.Studio.onEvent(function (event) {
    if (event.detail.event === 'reload-widget-instance') {
      debounceLoad();
    }
  });
  init();

});

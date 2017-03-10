window.uiFreewallVertical = {};
Fliplet.Navigator.onReady().then(function(){
  $('[data-metro-id]').each(function(){
    var container = this;
    var id = $(this).data('metro-id');
    var config = Fliplet.Widget.getData(id);

    function init() {
      window.uiFreewallVertical = new UIFreewallVertical(config);
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





});

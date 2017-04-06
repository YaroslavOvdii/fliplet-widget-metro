window.ui = window.ui || {}
ui.uiFreewallVertical = {};

function init(){
  Fliplet.Navigator.onReady().then(function(){
    $('.metro-panels:not("[data-mce-bogus] .metro-panels")').each(function(i, el){
      var $container = $(el);
      var id = $container.data('metro-id');
      var config = Fliplet.Widget.getData(id);

      ui.uiFreewallVertical[id] = new UIFreewallVertical(config);
      UIFreewallVertical.loadMetro();

      $('.linked[data-metro-item-id]').click(function (event) {
          event.preventDefault();
          var itemID = $(this).data('metro-item-id')

          var data = Fliplet.Widget.getData($container.parents('[data-metro-id]').data('metro-id'));

          var itemData = _.find(data.items,{id: itemID});

          if(!_.isUndefined(itemData) && (!_.isUndefined(itemData.linkAction) && !_.isEmpty(itemData.linkAction))) {
              Fliplet.Navigate.to(itemData.linkAction);
          }
      });
    });
  });
}

var debounceLoad = _.debounce(init, 500);

Fliplet.Studio.onEvent(function (event) {
  if (event.detail.event === 'reload-widget-instance') {
    debounceLoad();
  }
});
init();

// VARS
var widgetId = Fliplet.Widget.getDefaultId();
var data = Fliplet.Widget.getData() || {
    items: []
  },
  linkPromises = [];

var panelSizeMap = {
  "Small": "size11",
  "Medium": "size21",
  "Large": "size22"
};

if (_.isUndefined(data.items)) {
  data.items = [];
}
_.forEach(data.items, function(item) {
  initColorPicker(item);
  initSizeSelect(item);
});

var accordionCollapsed = false;

var $accordionContainer = $('#accordion');

function tpl(name) {
  return Fliplet.Widget.Templates['templates.' + name];
}

var $testElement = $('#testelement');

var debounceSave = _.debounce(save, 500);

// Indicate dragging state
var dragging = false;


setTimeout(function() {
  // SORTING PANELS
  $('.panel-group').sortable({
    handle: ".panel-heading",
    cancel: ".icon-delete",
    tolerance: 'pointer',
    revert: 150,
    placeholder: 'panel panel-default placeholder tile',
    cursor: '-webkit-grabbing; -moz-grabbing;',
    axis: 'y',
    start: function(event, ui) {
      dragging = true;
      var itemId = $(ui.item).data('id');
      var itemProvider = _.find(linkPromises, function(provider) {
        return provider.id === itemId;
      });

      save();

      // removes provider
      itemProvider = null;
      _.remove(linkPromises, {
        id: itemId
      });

      $('.panel-collapse.in').collapse('hide');
      ui.item.addClass('focus').css('height', ui.helper.find('.panel-heading').outerHeight() + 2);
      $('.panel').not(ui.item).addClass('faded');
    },
    stop: function(event, ui) {
      var itemId = $(ui.item).data('id');
      var movedItem = _.find(data.items, function(item) {
        return item.id === itemId;
      });

      // sets up new provider
      $('[data-id="' + itemId + '"] .add-link').html('');
      initLinkProvider(movedItem);

      ui.item.removeClass('focus');

      var sortedIds = $(".panel-group").sortable("toArray", {
        attribute: 'data-id'
      });
      data.items = _.sortBy(data.items, function(item) {
        return sortedIds.indexOf(item.id);
      });
      $('.panel').not(ui.item).removeClass('faded');

      dragging = false;

      save(false, true);
    },
    sort: function(event, ui) {
      $('.panel-group').sortable('refresh');
      $('.tab-content').trigger('scroll');
    }
  });
}, 1000);

checkPanelLength();
buttonControls();

// EVENTS
$(".tab-content")
  .on('click', '.icon-delete', function() {

    var $item = $(this).closest("[data-id], .panel"),
      id = $item.data('id');

    _.remove(data.items, {
      id: id
    });
    _.remove(linkPromises, {
      id: id
    });

    $(this).parents('.panel').remove();
    checkPanelLength();
    save();

    $(this).parents('.panel').remove();
    checkPanelLength();
  })
  .on('click', '.add-image', function() {

    var $item = $(this).closest("[data-id], .panel"),
      id = $item.data('id'),
      item = _.find(data.items, {
        id: id
      });

    initImageProvider(item);

    $(this).text('Replace image');
    if ($(this).siblings('.thumb-holder').hasClass('hidden')) {
      $(this).siblings('.thumb-holder').removeClass('hidden');
    }
  })
  .on('click', '.image-remove', function() {

    var $item = $(this).closest("[data-id], .panel"),
      id = $item.data('id'),
      item = _.find(data.items, {
        id: id
      });

    item.imageConf = null;
    $(this).parents('.add-image-holder').find('.add-image').text('Add image');
    $(this).parents('.add-image-holder').find('.thumb-holder').addClass('hidden');
    save();
  })
  .on('keyup change paste', '.list-item-title', function() {
    var $listItem = $(this).parents('.panel');
    setListItemTitle($listItem.index(), $(this).val());
    debounceSave();
  }).on('keyup change paste', '.list-item-desc', function() {
    debounceSave();
  }).on('click', '.expand-items', function() {
    // Update accordionCollapsed if all panels are collapsed/expanded
    if (!$('.panel-collapse.in').length) {
      accordionCollapsed = true;
    } else if ($('.panel-collapse.in').length == $('.panel-collapse').length) {
      accordionCollapsed = false;
    }

    if (accordionCollapsed) {
      expandAccordion();
    } else {
      collapseAccordion();
    }
  })
  .on('click', '.new-list-item', function() {
    var item = {};
    item.id = makeid(8);
    item.linkAction = null;
    item.title = 'Panel item ' + ($('#accordion .panel').length + 1);
    item.description = "";
    data.items.push(item);

    addListItem(item);
    initLinkProvider(item);
    checkPanelLength();

    save();
  })
  .on('show.bs.collapse', '.panel-collapse', function() {
    if (dragging) {
      return;
    }
    
    // Get item ID / Get provider / Get item
    var itemID = $(this).parents('.panel').data('id');
    var itemProvider = _.find(linkPromises, function(provider) {
      return provider.id === itemID;
    });
    var item = _.find(data.items, function(item) {
      return item.id === itemID;
    });
    // Init the link provider when the accordion opens
    if (!itemProvider && item) {
      initLinkProvider(item);
    }
    $(this).siblings('.panel-heading').find('.fa-chevron-right').removeClass('fa-chevron-right').addClass('fa-chevron-down');
  })
  .on('hide.bs.collapse', '.panel-collapse', function() {
    $(this).siblings('.panel-heading').find('.fa-chevron-down').removeClass('fa-chevron-down').addClass('fa-chevron-right');
  })
  .on('shown.bs.collapse hidden.bs.collapse', '.panel-collapse', function() {
    $('.tab-content').trigger('scroll');
  })
  .on('change', '.panel-size', function() {
    debounceSave();
  })
  .on('change', '[name="enable_gap"]', function() {
    debounceSave();
  });

var contentHeight = $('body > .form-horizontal').outerHeight();
var tabPaneTopPadding = 78;

$('body > .form-horizontal').scroll(function(event) {
  var tabContentScrollPos = Math.abs($('.tab-pane-content').position().top - tabPaneTopPadding);
  var tabPaneHeight = tabPaneTopPadding + $('.tab-pane-content').height();

  if (tabPaneHeight - tabContentScrollPos > contentHeight) {
    $('body').addClass('controls-sticky-on');
  } else {
    $('body').removeClass('controls-sticky-on');
  }
});

// Chech radio Buttons
if (typeof data.enableGap !== "undefined") {
  if (data.enableGap) {
    $('#gap-yes').prop('checked', true);
  } else {
    $('#gap-no').prop('checked', true);
  }
} else {
  $('#gap-yes').prop('checked', true);
}

// FUNCTIONS
function initLinkProvider(item) {

  item.linkAction = item.linkAction || {};
  item.linkAction.provId = item.id;

  var linkActionProvider = Fliplet.Widget.open('com.fliplet.link', {
    // If provided, the iframe will be appended here,
    // otherwise will be displayed as a full-size iframe overlay
    selector: '[data-id="' + item.id + '"] .add-link',
    // Also send the data I have locally, so that
    // the interface gets repopulated with the same stuff
    data: item.linkAction,
    // Events fired from the provider
    onEvent: function(event, data) {
      if (event === 'interface-validate') {
        Fliplet.Widget.toggleSaveButton(data.isValid === true);
      }
    },
    closeOnSave: false
  });

  linkActionProvider.then(function(data) {
    item.linkAction = data && data.data.action !== 'none' ? data.data : null;
    return Promise.resolve();
  });

  linkActionProvider.id = item.id;
  linkPromises.push(linkActionProvider);
}

var imageProvider;

function initImageProvider(item) {
  var filePickerData = {
    selectFiles: item.imageConf ? [item.imageConf] : [],
    selectMultiple: false,
    type: 'image',
    autoSelectOnUpload: true
  };
  
  imageProvider = Fliplet.Widget.open('com.fliplet.file-picker', {
    // Also send the data I have locally, so that
    // the interface gets repopulated with the same stuff
    data: filePickerData,
    // Events fired from the provider
    onEvent: function(event, data) {
      if (event === 'interface-validate') {
        Fliplet.Widget.toggleSaveButton(data.isValid === true);
      }
    },
    single: true,
    type: 'image'
  });

  Fliplet.Widget.toggleCancelButton(false);

  window.addEventListener('message', function(event) {
    if (event.data === 'cancel-button-pressed') {
      Fliplet.Widget.toggleCancelButton(true);
      imageProvider.close();
      if (_.isEmpty(item.imageConf)) {
        $('[data-id="' + item.id + '"] .add-image-holder').find('.add-image').text('Add image');
        $('[data-id="' + item.id + '"] .add-image-holder').find('.thumb-holder').addClass('hidden');
      }
    }
  });

  Fliplet.Studio.emit('widget-save-label-update', {
    text: 'Select & Save'
  });

  imageProvider.then(function(data) {
    if (data.data) {
      item.imageConf = data.data[0];
      $('[data-id="' + item.id + '"] .thumb-image img').attr("src", data.data[0].thumbnail);
      save();
    }
    imageProvider = null;
    Fliplet.Studio.emit('widget-save-label-reset');
    return Promise.resolve();
  });
}

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function expandAccordion() {
  accordionCollapsed = false;
  $('.panel-collapse').collapse('show');
}

function collapseAccordion() {
  accordionCollapsed = true;
  $('.panel-collapse').collapse('hide');
}

function setListItemTitle(index, title) {
  $('#accordion').find('.panel:eq(' + index + ') .panel-title-text').html(title);
}

function addListItem(data) {
  var $newPanel = $(tpl('panels')(data));
  $accordionContainer.append($newPanel);
  initColorPicker(data);

  $newPanel.find('.form-control:eq(0)').select();
  $('.form-horizontal').stop().animate({
    scrollTop: $('.tab-content').height()
  }, 200, function() {
    $('.form-horizontal').trigger('scroll');
  });
}

function initColorPicker(item) {
  // bind plugins on inputs
  $('#list-item-color-' + item.id).parents('[colorpicker-component]').colorpicker({
    container: true
  });

  $('#list-item-color-' + item.id).on('click', function() {
    $(this).prev('.input-group-addon').find('i').trigger('click');
  });

  $('.input-group-addon i').on('click', function() {
    $(this).parents('.input-group-addon').next('#list-item-color-' + item.id).trigger('focus');
  });

  $('#list-item-color-' + item.id).on('change', function() {
    debounceSave();
  });
}

function initSizeSelect(item) {
  $('#list-item-size-' + item.id + '.hidden-select').val(item.size);
}

function checkPanelLength() {
  if ($('.panel').length > 0) {
    if ($('.panel').length > 1) {
      $('.expand-items').removeClass("hidden");
    } else {
      $('.expand-items').addClass("hidden");
    }
    if (!$('.panels-empty').hasClass('hidden')) {
      $('.panels-empty').addClass('hidden');
    }
  } else {
    $('.panels-empty').removeClass('hidden');
    $('.expand-items').addClass("hidden");
  }
}

function buttonControls() {
  if ($('.panel').length) {
    var contentHeight = $('body > .form-horizontal').outerHeight();
    var tabPaneTopPadding = 78;
    var tabContentScrollPos = Math.abs($('.tab-pane-content').position().top - tabPaneTopPadding);
    var tabPaneHeight = tabPaneTopPadding + $('.tab-pane-content').height();

    if (tabPaneHeight - tabContentScrollPos > contentHeight) {
      $('body').addClass('controls-sticky-on');
    } else {
      $('body').removeClass('controls-sticky-on');
    }
  }
}

Fliplet.Widget.onSaveRequest(function() {
  if (imageProvider) {
    imageProvider.forwardSaveRequest();
  } else {
    save(true);
  }
});

function save(notifyComplete, dragStop) {
  _.forEach(data.items, function(item) {
    item.description = $('#list-item-desc-' + item.id).val();
    item.title = $('#list-item-title-' + item.id).val();
    item.color = $('#list-item-color-' + item.id).val();
    item.size = $('#list-item-size-' + item.id).val();
    item.sizeClass = panelSizeMap[$('#list-item-size-' + item.id).val()];
  });

  data.enableGap = $('[name="enable_gap"]:checked').val() === "enable-gap" ? true : false;

  // forward save request to all providers
  linkPromises.forEach(function(promise) {
    promise.forwardSaveRequest();
  });

  if (!dragStop) {
    Fliplet.Widget.all(linkPromises).then(function() {
      // when all providers have finished
      Fliplet.Widget.save(data).then(function() {
        if (notifyComplete) {
          // Close the interface for good
          Fliplet.Widget.complete();
        } else {
          Fliplet.Studio.emit('reload-widget-instance', widgetId);
        }
      });
    });
  } else {
    Fliplet.Widget.save(data).then(function() {
      Fliplet.Studio.emit('reload-widget-instance', widgetId);
    });
  }
}

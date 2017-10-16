(function($) {

  //***************************** mbr-shop ***********************************//

    //Shop's Price-Sorting
    filterShop = function(items, sortBy) {
      // 1=up 2=down 3=default
      if (sortBy < 3){
        var newItems = $('.shop-items').children().sort(function(a,b) {
          var upA = parseFloat($(a).attr('data-price'));
          var upB = parseFloat($(b).attr('data-price'));
          if(sortBy == 1){
            return (upA > upB) ? 1 : ((upA == upB) ? 0 : -1);
          } else {
            return (upA < upB) ? 1 : ((upA == upB) ? 0 : -1);
          };
        });
      } else {
        var newItems = shopItemsDefault;
      }
      $('.shop-items').children().remove();
      for(var i=0; i < newItems.length; i++){
        $('.shop-items').append(newItems[i]);
      };
      modalEvents();
    };

    if($('.mbr-shop').length != 0) {
      var sortBy = 1,
          shopItemsDefault = $('.shop-items').children(),
          shopItems = $('.shop-items').children(),

          $sortUp = $('.sort-buttons .filter-by-pu .btn'),
          $sortDown = $('.sort-buttons .filter-by-pd .btn'),
          $sortDefault = $('.sort-buttons .filter-by-d .btn');

      $('.filter-by-pu').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $($sortUp).removeClass('disableSortButton btn-primary-outline').addClass('btn-primary');
        $($sortDown).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        $($sortDefault).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        filterShop(shopItems, 1);
      });

      $('.filter-by-pd').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $($sortDown).removeClass('disableSortButton btn-primary-outline').addClass('btn-primary');
        $($sortUp).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        $($sortDefault).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        filterShop(shopItems, 2);
      });

      $('.filter-by-d').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $($sortDefault).removeClass('disableSortButton btn-primary-outline').addClass('btn-primary');
        $($sortUp).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        $($sortDown).removeClass('btn-primary btn-primary-outline').addClass('btn-primary-outline disableSortButton');
        filterShop(shopItems, 3);
      });

    //Filter by price range
    $('.price-range').on('click', function(e) {
        e.preventDefault();
        var minPrice = $('.min-input').val(),
            maxPrice = $('.max-input').val();
        $('.mbr-gallery-item:not(.bestsellers .mbr-gallery-item)').each(function(i, item) {
          if (parseFloat($(item).attr('data-price')) >= parseFloat(minPrice) && parseFloat($(item).attr('data-price')) <= parseFloat(maxPrice)){
              $(item).removeClass('hided-by-price');
          } else {
              $(item).addClass('hided-by-price');
          };
        });
      });

    //Reset Filter by price range
    $('.price-range-reset').on('click', function(e) {
        e.preventDefault();
        $('.max-input').val(findMaxItemPrice());
        $('.min-input').val(findMinItemPrice());
        $('.max-toggle').css('right', '0');
        $('.min-toggle').css('left', '0');
        $('.range-controls .bar').css('margin-left', '0px').css('width', '100%');
        rangeSliderInit();
        $('.mbr-gallery-item:not(.bestsellers .mbr-gallery-item)').each(function(i, item) {
          $(item).removeClass('hided-by-price');
        });
      });

    };

    autoPriceRange = function() {
      var minPrice = $('.min-input').val(),
          maxPrice = $('.max-input').val();
        $('.mbr-gallery-item:not(.bestsellers .mbr-gallery-item)').each(function(i, item) {
          if (parseFloat($(item).attr('data-price')) >= parseFloat(minPrice) && parseFloat($(item).attr('data-price')) <= parseFloat(maxPrice)){
              $(item).removeClass('hided-by-price');
          } else {
              $(item).addClass('hided-by-price');
          };
        });
    };

    // Max price
    findMaxItemPrice = function() {
      var maxPrice = 0;
      $('.mbr-gallery-item').each(function(i, item) {
          if(parseFloat($(item).attr('data-price')) > maxPrice){
            maxPrice = parseFloat($(item).attr('data-price'));
          };
      });
      return maxPrice;
    };

    // Min price
    findMinItemPrice = function() {
      var minPrice = 1000000;
      $('.mbr-gallery-item').each(function(i, item) {
          if(parseFloat($(item).attr('data-price')) < minPrice){
            minPrice = parseFloat($(item).attr('data-price'));
          };
      });
      return minPrice;
    };

    // Range slider
    rangeSliderInit = function() {
      var inputMin    = $('input.min-input'),
          inputMax    = $('input.max-input'),

          rangeWrap   = $('div.range-controls'),
          scaleBar    = rangeWrap.find('div.bar'),

          toggleMin   = rangeWrap.find('div.min-toggle'),
          toggleMax   = rangeWrap.find('div.max-toggle'),

          maxWidthBar = scaleBar.innerWidth(),
          maxRange    = maxWidthBar - 20,

          rangeLeft   = 0,
          rangeRight  = maxRange,

          pos         = rangeWrap.offset(),
          posLeft     = pos.left,

          valLeft     = inputMin.val(),
          valRight    = inputMax.val(),

          constLeft = inputMin.val(),

          curentWidth = parseInt($('.filter-cost').width())-20;

      function range() {
        if (togglePos <= 0) {
              return 0;
          }else if (togglePos >= maxRange) {
              return maxRange;
          }else {
              return togglePos;
        };
      };
      // toggleMin
      toggleMin.mousedown(function() {
          $(document).on('mousemove', function(e) {
            toggleMax.css('z-index', 0);
            toggleMin.css('z-index', 1);
            var xInner  = Math.round(e.pageX - posLeft);
            togglePos   = xInner - 10;
            rangeLeft   = range();

            toggleMin.css({left: function(i, v) {
              if (rangeLeft < rangeRight) {
                  valLeft = rangeLeft;
                  return rangeLeft;
              }else {
                  valLeft = valRight;
                  return rangeRight;
              };
            }});

            scaleBar.css({
              'margin-left': function() {
                return (rangeLeft < rangeRight) ? rangeLeft : rangeRight;
              },
              'width': function() {
                if (rangeLeft < rangeRight) {
                    return maxRange - (rangeLeft + (maxRange - rangeRight));
                }else {
                    return 0;
                };
              }
            });
            $(inputMin).val(Math.floor(( findMaxItemPrice() - findMinItemPrice() ) / curentWidth * valLeft) + parseInt(constLeft));
            autoPriceRange();
          });
      });
      // toggleMax
      toggleMax.mousedown(function() {
          $(document).on('mousemove', function(e) {
            toggleMax.css('z-index', 1);
            toggleMin.css('z-index', 0);
            var xInner = Math.round(e.pageX - posLeft);
            togglePos = xInner - 10;
            rangeRight = range();
            toggleMax.css({right: function(i, v) {

              if (rangeLeft < rangeRight) {
                  valRight = rangeRight;
                  return maxRange - rangeRight;
              }else {
                  valRight = valLeft;
                  return maxRange - rangeLeft;
              };
            }});

            scaleBar.css({
              width: function() {

                if (rangeLeft < rangeRight) {
                    return maxRange - (rangeLeft + (maxRange - rangeRight));
                }else {
                    return 0;
                };
              }
            });
            $(inputMax).val(Math.ceil(( findMaxItemPrice() - findMinItemPrice() ) / curentWidth * valRight)+parseInt(constLeft));
            autoPriceRange();
          });
      });

      $(document).mouseup(function() {
          $(document).off('mousemove');
      });
    };
    //set max min value
    if($('.mbr-shop').length != 0) {
      $(document).ready(function() {
        $('input[name=max]').attr('value', findMaxItemPrice());
        $('input[name=min]').attr('value', findMinItemPrice());
        if($('.range-slider').css('display') == 'block') {rangeSliderInit()};
      })
    };

    //Custom shop modal window
    if (!$('html').hasClass('is-builder')){
      var curentItem;
      moveToModal = function(item) {
        var modal = $('.shopItemsModal'),
            modalText = $(item).find('.sidebar_wraper').clone(),
            modalImg = $(item).find('img').clone(),
            modalSale = $(item).find('.onsale').clone();
        $(modal).children('.text-modal').append(modalText);
        $(modal).children('.image-modal').append(modalImg).append(modalSale);
      };

      cleanModal = function() {
        var modal = $('.shopItemsModal');
        $(modal).children('.text-modal').empty();
        $(modal).children('.image-modal').empty();
      };

      modalEvents = function() {
        $('.mbr-shop .mbr-gallery-item .item_overlay').on('click', function(aim) {
              var target = $(aim.target).closest('.mbr-gallery-item');
              curentItem = target;
              cleanModal();
              moveToModal(target);
              $('.shopItemsModal_wraper').css('display', 'flex');
          });

        $('.close-modal-wrapper, .shopItemsModalBg').on('click', function() {
             $('.shopItemsModal_wraper').css('display', 'none');
             cleanModal();
        })
      };

      if($('.mbr-shop').length != 0) {
        $(document).ready(function() {
          shopItems = $('.shop-items').children();
          filterShop(shopItems, 3);
        });
        var isMobile = navigator.userAgent.match( /(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i );
        var isTouch = isMobile !== null || document.createTouch !== undefined || ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window ) || navigator.msMaxTouchPoints;
        if( !isTouch ){
          $('input.min-input, input.max-input').prop("disabled", true);
          $('.filterPriceRange').css('display', 'none');
        } else{
          $('.range-controls').css('display', 'none');
          $('.price-controls, .filter-cost').css('margin-bottom', '15px');
        }

      }
    };

    //ShopCategories
    var allItem = $('.mbr-gallery-filter-all');
    $(document).ready(function() {
        var $section = $(document).find('div.mbr-shop');
        var filterList = [];

        if (!$section.length) return;

        $section.find('.mbr-gallery-item').each(function(el) {
          var tagsAttr = ($(this).attr('data-tags')||"").trim();
          var tagsList = tagsAttr.split(',');
          tagsList.map(function(el) {
            var tag = el.trim();
            if ($.inArray(tag, filterList) == -1)
                filterList.push(tag);
            })
          })

          if ($section.find('.mbr-gallery-filter').length > 0 && $section.find('.mbr-gallery-filter').hasClass('gallery-filter-active')) {
              var filterHtml = '';
              $section.find('.mbr-gallery-filter ul li:not(li:eq(0))').remove();
              filterList.map(function(el) {
                  filterHtml += '<li class="display-7">' + el + '</li>'
              });

              $section.find('.mbr-gallery-filter ul').append(allItem).append(filterHtml);
              $section.on('click', '.mbr-gallery-filter li', function(e) {
                  e.preventDefault();
                  $li = $(this);
                  $li.parent().find('li').removeClass('active');
                  $li.addClass('active');

                  var $mas = $li.closest('section').find('.mbr-gallery-row');
                  var filter = $li.html().trim();

                  $section.find('.mbr-gallery-item:not(.bestsellers .mbr-gallery-item)').each(function(i, el) {
                      var $elem = $(this);
                      var tagsAttr = $elem.attr('data-tags');
                      var tags = tagsAttr.split(',');
                      tagsTrimmed = tags.map(function(el) {
                          return el.trim();
                      })
                      if ($.inArray(filter, tagsTrimmed) == -1 && !$li.hasClass('mbr-gallery-filter-all')) {
                          $elem.addClass('mbr-gallery-item__hided');
                          setTimeout(function() {
                              $elem.css('left', '300px');
                          }, 200);
                      } else {
                          $elem.removeClass('mbr-gallery-item__hided');
                      };

                  })
                  setTimeout(function() {
                      $mas.closest('.mbr-gallery-row').trigger('filter');
                  }, 50);
              })
          } else {
              $section.find('.mbr-gallery-item__hided').removeClass('mbr-gallery-item__hided');
              $section.find('.mbr-gallery-row').trigger('filter');
          }
      });

  //*********************************************************************//

})(jQuery)
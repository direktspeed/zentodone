angular.module('zentodone')
  .directive('taskCell', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var $bg, $text, width, firstTreshold, secondTreshold

        var sL  = $parse(attrs.swipeLeft)
        var sLL = $parse(attrs.swipeLongLeft)
        var sR  = $parse(attrs.swipeRight)
        var sLR = $parse(attrs.swipeLongRight)

        var preventDefault = function(event) {
          event.preventDefault();
        }

        var onDragStart = function() {
          $bg = angular.element(this)
          $text = $bg.children().first()

          width = $bg.width();
          firstTreshold = 40;
          secondTreshold = width * 0.6

          $text.css('transition', '')
          $bg.removeClass('left right first second')

          $bg.hammer()
            .on('touchmove', preventDefault)
            .on('drag', onDrag)
            .on('dragend', onDragEnd)
        }

        var onDrag = function(event) {
          $text.css('transform', 'translateX(' + event.gesture.deltaX + 'px)');

          var class1, class2

          if (event.gesture.deltaX < 0) {
            class1 = 'right'
          } else if (event.gesture.deltaX > 0) {
            class1 = 'left'
          }

          if (Math.abs(event.gesture.deltaX) > secondTreshold) {
            class2 = ' second'
          } else if (Math.abs(event.gesture.deltaX) > firstTreshold) {
            class2 = ' first'
          }

          $bg
            .removeClass('right left first second'.replace(class1, '').replace(class2,''))
            .addClass(class1 + ' ' + class2)
        }

        var onDragEnd = function(event) {
          scope.$apply(function() {
            if (event.gesture.deltaX > secondTreshold) {
              sLR(scope)
            } else if (-event.gesture.deltaX > secondTreshold) {
              sLL(scope)
            } else if (event.gesture.deltaX > firstTreshold) {
              sR(scope)
            } else if (-event.gesture.deltaX > firstTreshold) {
              sL(scope)
            } else {
              // TODO: use $animate
              $text
                .on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                  $text.css('transition', '')
                })
                .css({
                  transition: 'all 0.2s cubic-bezier(0.50, 0.000, 0.50, 1.50)',
                  transform: ''
                })
            }
          });

          $bg.hammer()
            .off('touchmove', preventDefault)
            .off('drag', onDrag)
            .off('dragend', onDragEnd)
        }

        element.hammer().on('dragstart', onDragStart)
      }
    };
  });


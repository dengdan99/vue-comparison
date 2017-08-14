function getElements (expr) {
  return (typeof expr === 'string') ? document.querySelectorAll(expr) : expr
}

var Scroller = function (str) {
  var self = this
  var components = this.__components = getElements(str)
  var component = components[0]
  var rect = component.getBoundingClientRect()

  self.__clientLeft = rect.left
  self.__callback = function (left) {
    for (var i = 0; components.length > i; i++) {
      components[i].style.webkitTransform = 'translate3d(' + (-left) + 'px, 0, 0)'
    }
  }
  self.__maxScrollLeft = (rect.width - 200) < 0 ? 0 : (rect.width - 200)

  for (var i = 0; self.__components.length > i; i++) {
    self.__components[i].addEventListener('touchstart', function (e) {
      if (e.target.tagName.match(/input|textarea|select/i)) {
        return
      }
      // e.preventDefault()
      self.__doTouchStart(e.touches, e.timeStamp)
    }, false)

    self.__components[i].addEventListener('touchmove', function (e) {
      self.__doTouchMove(e.touches, e.timeStamp)
    }, false)

    self.__components[i].addEventListener('touchend', function (e) {
      self.__doTouchEnd(e.timeStamp)
    }, false)
  }
}

var members = {
  __components: [],
  __isDragging: false,
  __isAnimating: false,
  __clientLeft: 0,
  __clientWidth: 0,
  __contentWidth: 0,
  __lastTouchLeft: 0,
  __lastTouchMove: null,
  __lastScale: null,
  __scrollLeft: 0,
  __minScrollLeft: 0,
  __maxScrollLeft: 0,

  __doTouchStart (touches, timeStamp) {
    var self = this
    // Use center point when dealing with two fingers
    var currentTouchLeft
    var isSingleTouch = touches.length === 1
    if (isSingleTouch) {
      currentTouchLeft = touches[0].pageX
    } else {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2
    }

    self.__lastTouchLeft = currentTouchLeft
    self.__lastTouchMove = timeStamp
    self.__lastScale = 1
  },

  __doTouchMove (touches, timeStamp, scale) {
    var self = this
    var currentTouchLeft

    if (touches.length === 2) {
      currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2
    } else {
      currentTouchLeft = touches[0].pageX
    }

    var moveX = currentTouchLeft - self.__lastTouchLeft
    var scrollLeft = self.__scrollLeft
    scrollLeft -= moveX

    var minScrollLeft = self.__minScrollLeft
    var maxScrollLeft = self.__maxScrollLeft

    if (scrollLeft > maxScrollLeft || scrollLeft < minScrollLeft) {
      // Slow down on the edges
      if (scrollLeft > maxScrollLeft) {
        scrollLeft = maxScrollLeft
      } else {
        scrollLeft = minScrollLeft
      }
    }
    this.__scrollLeft = scrollLeft
    this.__callback(this.__scrollLeft)
    // console.log(touches[0], self.__lastTouchLeft)

    self.__lastTouchLeft = currentTouchLeft
    self.__lastTouchMove = timeStamp
    self.__lastScale = scale
  },

  __doTouchEnd (timeStamp) {
  },

  destroy () {
    var self = this
    for (var i = 0; self.__components.length > i; i++) {
      self.__components[i].removeEventListener('touchstart')

      self.__components[i].removeEventListener('touchmove')

      self.__components[i].removeEventListener('touchend')
    }
  }
}

// Copy over members to prototype
for (var key in members) {
  Scroller.prototype[key] = members[key]
}

module.exports = Scroller

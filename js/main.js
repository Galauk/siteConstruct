// Mobile-only carousel for testimonials (.icons)
// Activates when viewport width <= 767px. Adds scroll-snap layout and simple dots navigation.
(function(){
  'use strict';

  var selector = '.icons';
  var mql = window.matchMedia('(max-width: 767px)');
  var state = { enabled: false };

  function enableCarousel(container){
    if(!container || container.classList.contains('carousel')) return;
    container.classList.add('carousel');

    // create controls (dots)
    var items = Array.from(container.querySelectorAll('.icon'));
    var controls = document.createElement('div');
    controls.className = 'carousel-controls';

    items.forEach(function(item, idx){
      // ensure item styles are good
      item.style.boxSizing = 'border-box';

      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label','Ir para depoimento ' + (idx+1));
      dot.type = 'button';
      dot.dataset.index = idx;
      dot.addEventListener('click', function(){
        scrollToIndex(container, idx);
      });
      controls.appendChild(dot);
    });

    container.parentNode.insertBefore(controls, container.nextSibling);

    // set first dot active
    updateActiveDot(container);

    // update dot on scroll
    var onScroll = throttle(function(){ updateActiveDot(container); }, 100);
    container.addEventListener('scroll', onScroll, { passive: true });

    // store references for cleanup
    state.controls = controls;
    state.onScroll = onScroll;
    state.items = items;
    state.container = container;
    state.enabled = true;
  }

  function disableCarousel(){
    if(!state.enabled) return;
    var container = state.container;
    if(container){
      container.classList.remove('carousel');
      container.removeEventListener('scroll', state.onScroll);
      // remove inline styles from items
      state.items.forEach(function(it){ it.style.boxSizing = ''; });
    }
    if(state.controls && state.controls.parentNode){
      state.controls.parentNode.removeChild(state.controls);
    }
    state = { enabled: false };
  }

  function scrollToIndex(container, idx){
    var items = container.querySelectorAll('.icon');
    if(!items[idx]) return;
    var left = items[idx].offsetLeft;
    container.scrollTo({ left: left, behavior: 'smooth' });
  }

  function updateActiveDot(container){
    var items = container.querySelectorAll('.icon');
    var controls = state.controls;
    if(!controls) return;
    var scrollLeft = container.scrollLeft;
    var active = 0;
    for(var i=0;i<items.length;i++){
      var it = items[i];
      // center point check
      if(scrollLeft >= it.offsetLeft - (it.clientWidth/2)) active = i;
    }
    var dots = controls.querySelectorAll('.carousel-dot');
    dots.forEach(function(d){ d.classList.remove('active'); });
    if(dots[active]) dots[active].classList.add('active');
  }

  // small throttle
  function throttle(fn, wait){
    var last = 0; var timer = null;
    return function(){
      var now = Date.now();
      var args = arguments; var ctx = this;
      if(now - last >= wait){ last = now; fn.apply(ctx,args); }
      else { clearTimeout(timer); timer = setTimeout(function(){ last = Date.now(); fn.apply(ctx,args); }, wait); }
    };
  }

  function handleChange(){
    var container = document.querySelector(selector);
    if(mql.matches){
      if(container) enableCarousel(container);
    } else {
      disableCarousel();
    }
  }

  // init
  document.addEventListener('DOMContentLoaded', function(){
    handleChange();
    try {
      mql.addEventListener('change', handleChange);
    } catch(e){
      // older browsers
      mql.addListener(handleChange);
    }
  });

})();

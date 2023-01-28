
window.RevealCodeFocus = function() {

  var currentSlide, currentFragmentsList, prevSlideData = null;

  // Iterates through `array`, running `callback` for each `array` element.
  function forEach(array, callback) {
    var i = -1, length = array ? array.length : 0;
    while (++i < length) {
      callback(array[i]);
    }
  }

  var initialized = false;
  function initialize(e) {
    // Initialize code only once.
    // TODO: figure out why `initialize` is being called twice.
    if (initialized) {
      return;
    }
    initialized = true;


    Reveal.addEventListener('slidechanged', updateCurrentSlide);

    Reveal.addEventListener('fragmentshown', function(e) {
      focusFragments(e.fragments);
    });

    // TODO: make this configurable.
    // When fragments are hidden, clear the current focused fragments,
    // and focus on the previous fragments.
    Reveal.addEventListener('fragmenthidden', function(e) {
      var index = e.fragment.getAttribute('data-fragment-index');
      focusFragments(currentFragmentsList[index - 1]);
    });

    updateCurrentSlide(e);
  }


  function updateCurrentSlide(e) {
    currentSlide = e.currentSlide;
    currentFragmentsList = [];

    forEach(currentSlide.getElementsByClassName('fragment'), function(fragment) {
      var fragmentIndex = fragment.getAttribute('data-fragment-index');
      (
        currentFragmentsList[fragmentIndex] ||
        (currentFragmentsList[fragmentIndex] = [])
      ).push(fragment);
    });

    if(currentFragmentsList.length ){

      /* Check if using codefocus */
      var codeFocusSlide = 0;
      forEach(currentFragmentsList, function(fragment){
        if(fragment[0].hasAttribute('data-code-focus')){
          codeFocusSlide = 1;
        }
      });

      if(codeFocusSlide){
        var preElems = currentSlide.querySelectorAll('pre code');
        forEach(preElems, function(pre){
        /* Added in from highlight-lines.js */ 
        pre.parentNode.classList.add("code-wrapper");
        pre.classList.add("has-line-highlights");
        });
      };

    }
    clearPreviousFocus();

    // If moving back to a previous slide…
    if (
      currentFragmentsList.length &&
      prevSlideData &&
      (
        prevSlideData.indexh > e.indexh ||
        (prevSlideData.indexh == e.indexh && prevSlideData.indexv > e.indexv)
      )
    ) {
      // …return to the last fragment and highlight the code.
      while (Reveal.nextFragment()) {}
      var currentFragment = currentFragmentsList[currentFragmentsList.length - 1];
      forEach(currentFragment, function(currentFragment) {
        currentFragment.classList.add('current-visible');
      });
      focusFragments(currentFragment);
    }

    // Update previous slide information.
    prevSlideData = {
      'indexh': e.indexh,
      'indexv': e.indexv
    };
  }

  // Removes any previously focused lines.
  function clearPreviousFocus() {
    forEach(currentSlide.querySelectorAll('pre.code-wrapper span.highlight-line.code-focus'), function(line) {
      line.classList.remove('highlight-line');
    });
  }

  function focusFragments(fragments) {
    clearPreviousFocus();
    if (!fragments) {
      return;
    }

    forEach(fragments, function(fragment) {
      var lines = fragment.getAttribute('data-code-focus');
      if (!lines) {
        return;
      }

      var codeBlock = parseInt(fragment.getAttribute('data-code-block'));
      if (isNaN(codeBlock)) {
        codeBlock = 1;
      }

      var preElems = currentSlide.querySelectorAll('pre code');
      if (!preElems.length) {
        return;
      }



      var pre = preElems[codeBlock - 1];


      var code = pre.querySelectorAll('span[id^="cb"]');
      if (!code.length) {
        return;
      }


      forEach(lines.split(','), function(line) {
        lines = line.split('-');
        if (lines.length == 1) {
          focusLine(lines[0]);
        } else {
          var i = lines[0] - 1, j = lines[1];

          while (++i <= j) {
            focusLine(i);
          }
        }
      });


      function focusLine(lineNumber) {
        // Convert from 1-based index to 0-based index.
        lineNumber -= 1;

        var line = code[lineNumber];
        if (!line) {
          return;
        }

        line.classList.add('highlight-line', 'code-focus');

        
      }


    });
  }


  return {
    id: "code-focus", 
    init: function(){
      if (Reveal.isReady()) {
        initialize({ 'currentSlide': Reveal.getCurrentSlide() });
      } else {
        Reveal.addEventListener('ready', initialize);
      }
    }
  }

  
};

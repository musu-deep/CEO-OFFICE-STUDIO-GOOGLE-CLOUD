(function () {
  function printCV() {
    window.print();
  }

  function init() {
    var button = document.getElementById('cv-print-button');
    if (button) button.addEventListener('click', printCV);

    var params = new URLSearchParams(window.location.search);
    if (params.get('autoprint') === '1') {
      window.setTimeout(printCV, 450);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// One orchestrated moment: the career receipt goes from Processing to Succeeded.
(function () {
  var status = document.querySelector("[data-status]");
  var text = document.querySelector("[data-status-text]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (status && text && !reduce) {
    status.setAttribute("data-state", "pending");
    text.textContent = "Processing";
    setTimeout(function () {
      status.setAttribute("data-state", "settled");
      text.textContent = "Succeeded";
    }, 1600);
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();

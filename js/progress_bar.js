var lang = {
  html: "100%",
  css: "90%",
  javascript: "25%",
  php: "55%",
  bootstrap: "65%",
  responsive: "65%",
  photoshop: "35%",
  wordpress: "35%"
};

var multiply = 4;

$.each(lang, function(language, pourcent) {
  var delay = 700;

  setTimeout(function() {
    $("#" + language + "-pourcent").html(pourcent);
  }, delay * multiply);

  multiply++;
});

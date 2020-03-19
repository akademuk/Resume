function viewdiv(id) {
  var el = document.getElementById(id);
  var link = document.getElementById("toggleLink");
  if (el.style.display == "block") {
    el.style.display = "none";
    link.innerText = link.getAttribute("data-text-hide");
  } else {
    el.style.display = "block";
    link.innerText = link.getAttribute("data-text-show");
  }
}

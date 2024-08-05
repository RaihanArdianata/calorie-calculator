const success = (response) => {
  const modal = $(response);
  $("#modal-container").replaceWith(modal);
  modal.find(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button").on("click", _ => {
    $("#modal-container").replaceWith("<div id=\"modal-container\"/>");
  });
}
export function modalOnClick(e) {
  e.preventDefault();
  $.ajax({
    url: "modal.html",
    success,
    type: "GET"
  });
}

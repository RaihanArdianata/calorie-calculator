const rowUserTemplate = (postion, username) => `
<tr>
<th>${postion}</th>
<td>${username}</td>
  <td>
    <div class="is-flex is-flex-direction-row is-justify-content-space-around">
      <span class="icon has-text-warning crud-button" onclick="window.userOperationClick(${postion}, 'update', this)">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
      </span>
      <span class="icon has-text-danger crud-button" onclick="window.userOperationClick(${postion}, 'delete', this)">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
      </span>
      <span class="icon has-text-info crud-button" onclick="window.userOperationClick(${postion}, 'view', this)">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
      </span>
    </div>
  </td>
</tr>
`;

window.userOperationClick = (i, operation, el) => {
  alert(`${i} ${operation}`);
}

const createUser = function () {
  $("#create-user-button").on("click", function() {
    alert("create");
  });
}

const fetchUser = () => {
  const users = [
    "Raihanard",
    "BlueNeon",
    "Adz",
    "Someone",
    "Raihanard",
    "Raihanard",
    "Raihanard",
    "Raihanard",
    "BlueNeon",
    "Adz",
    "Someone",
    "BlueNeon",
    "Adz",
    "Someone",
    "BlueNeon",
    "Adz",
    "Someone",
    "BlueNeon",
    "Adz",
    "Someone",
  ];
  return users;
}

const pagination = (maxPage) => {
  let currentPage = 1;
  const click = (page) => {
    $("#page-user-list > li > button").each(function () { $(this).addClass("is-loading")});
    $("#page-user-prev").text(page < 2 ? maxPage : page-1);
    $("#page-user-current").text(page);
    $("#page-user-next").text(page > maxPage-1 ? 1 : page+1);
    currentPage = page;
    setTimeout(() => {
      $("#page-user-list > li > button").each(function () { $(this).removeClass("is-loading")});
    }, 1_000);
  }
  click(currentPage);
  $("#page-user-list > li > button").each(function () { $(this).removeClass("is-loading")});
  $("#page-user-start").on("click", function(ev) {
    ev.preventDefault();
    click(currentPage < 2 ? maxPage : 1);
  });
  $("#page-user-end").on("click", function(ev) {
    ev.preventDefault();
    click(currentPage === maxPage ? 1 : maxPage);
  });
  $("#page-user-prev").on("click", function(ev) {
    ev.preventDefault();
    const page = +$(this).text();
    click(page);
  });
  $("#page-user-next").on("click", function(ev) {
    ev.preventDefault();
    const page = +$(this).text();
    click(page);
  });
}

export const whenLoaded = () => {
  createUser();
  fetchUser().forEach((x, i) => $("#table-user-body").append($(rowUserTemplate(i+1, x))));
  pagination(20);
}

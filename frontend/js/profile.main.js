import apiService from "./api/apiService.js";
import externalApiService from "./api/externalApiService.js";
import { keyRole } from "./constant/constant.js";

const renderCard
= (x, y) => 
`<div class="cell" id="${x.idMeal}-${y.id}" style="display: none;">
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">${x.strMeal}</p>
      <button class="card-header-icon" onclick="window.deleteMeal('${x.idMeal}', '${y.id}', this)">
        <span class="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </span>
      </button>
    </div>
    <div class="card-image show-pointer" onclick="window.accessMeal(${x.idMeal})">
      <figure class="image is-square">
        <img src="${x.strMealThumb}" />
      </figure>
    </div>
  </div>
</div>`;

const syncForm = x => {
  $("#profile-update").find("input").each(function() {
    const key = $(this).attr("name")
    if (key === "password") return;
    $(this).val(x.data[key]);
  });
}

const toFormData = arr => {
  const form = {};
  for (const { value, name } of arr) {
    if (!value) continue;
    Reflect.set(form, name, value);
  };
  console.log(form);
  return form;
}

$("#profile-update").on("submit", function(evx) {
  evx.preventDefault();
  const data = toFormData($(this).serializeArray());
  apiService
    .patch("api/profile", data)
    .done(response => $("#modal-update-profile").removeClass("is-active"));
});

$("#edit-profile").on("click", () => {
  $("#modal-update-profile").addClass("is-active");
   $("#modal-update-profile")
   .find(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button")
   .on("click", () => $("#modal-update-profile").removeClass("is-active"));
})

window.accessMeal = id => window.location.replace("/meals.html?id=" + id);

window.deleteMeal = (ex, fav, el) => {
  const scope = $(el)
    .addClass("button is-loading");
  apiService
    .delete(`api/meals/${ex}/favorite/${fav}`)
    .done(_ => $(`#${ex}-${fav}`).fadeOut())
    .fail(_ => scope.removeClass("buttom is-loading"));
}

const promiseGetMeal = id => new Promise(resolve => externalApiService.get(`lookup.php?i=${id}`).done(x => resolve(x.meals[0])));

const renderProfile = async x => {
  console.log(x);
  syncForm(x);
  $("#profile-username")
    .text(x.data.username)
    .removeClass("is-skeleton")
    .addClass("has-text-primary");
  
  $("#profile-name")
    .removeClass("is-skeleton")
    .html(`<strong>${x.data.first_name}</strong> ${x.data.last_name}`);
  $("#profile-roles")
    .append("<span class=\"tag is-info\">User</span>")
    .append(
      x.data.roles.name === "ADMINISTRATOR"
        ? "<span class=\"tag is-danger\">Admin</span>" : ""
    ).removeClass("is-skeleton");
  const mealDatas = await Promise.all(x
  .data
  .favorite_meals
  .map(y => promiseGetMeal(y.external_id)));
  const scopeList = $("#fav-meals-list")
    .text("")
    .removeClass("is-skeleton");
  if (!mealDatas.length) return scopeList.append("No favorites meals");
  mealDatas.forEach((y, i) => {
    const itemScope = $(renderCard(y, x.data.favorite_meals[i]));
    scopeList.append(itemScope);
    setTimeout(() => itemScope.fadeIn(), 500 * (i+1));
  })
}
export const whenLoaded = () => {
  if (window.location.pathname !== "/profile.html") return;
  apiService.get("api/profile?fetchMeals=true")
    .done(renderProfile)
    .fail(_ => window.location.replace("/"));
}

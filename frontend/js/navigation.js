$(document).ready(() => {
  const menuHome = $('#menu-home');
  const menuSearch = $('#menu-search');
  const menuUser = $('#menu-user');
  const menuProfile = $('#menu-profile');

  function updateMenu(menuItem) {
    $('.current').removeClass('current');
    menuItem.addClass('current');
  }

  menuHome.click(function () {
    location.replace('index.html');
    updateMenu(menuHome);
  });
  menuSearch.click(function () {
    location.replace('search.html');
    updateMenu(menuSearch);
  });
  menuUser.click(function () {
    location.replace('users.html');
    updateMenu(menuUser);
  });
  menuProfile.click(function () {
    location.replace('profile.html');
    updateMenu(menuProfile);
  });

  console.log();

  if (window.location.href.includes('search')) {
    updateMenu(menuSearch);
  } else if (window.location.href.includes('user')) {
    updateMenu(menuUser);
  } else if (window.location.href.includes('profile')) {
    updateMenu(menuProfile);
  } else {
    updateMenu(menuHome);
  }
});

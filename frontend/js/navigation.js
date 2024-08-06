$(document).ready(() => {
  const menuHome = $('#menu-home');
  const menuSearch = $('#menu-search');
  const menuUser = $('#menu-user');
  const menuProfile = $('#menu-profile');

  menuHome.click(function () {
    location.replace('index.html');
    menuHome.addClass('current');
    menuSearch.removeClass('current');
    menuUser.removeClass('current');
    menuProfile.removeClass('current');
  });
  menuSearch.click(function () {
    location.replace('index.html');
    menuSearch.addClass('current');
    menuHome.removeClass('current');
    menuUser.removeClass('current');
    menuProfile.removeClass('current');
  });
  menuUser.click(function () {
    location.replace('users.html');
    menuUser.addClass('current');
    menuSearch.removeClass('current');
    menuHome.removeClass('current');
    menuProfile.removeClass('current');
  });
  menuProfile.click(function () {
    location.replace('profile.html');
    menuProfile.addClass('current');
    menuSearch.removeClass('current');
    menuUser.removeClass('current');
    menuHome.removeClass('current');
  });
});

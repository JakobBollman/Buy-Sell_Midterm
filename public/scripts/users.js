// Client facing scripts here

$(document).ready(function() {

  $('#fetch-users').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/users'
    })
    .done((response) => {
      const $usersList = $('#users');
      $usersList.empty();

      for(const user of response.users) {
        $(`<li class="user">`).text(user.name).appendTo($usersList);
      }
    });
  });



  $('.listing').on('click', (event) => {
    const listingId = event.currentTarget.id
    $.ajax({
      method: 'GET',
      url: `/listings/${listingId}`
    })
  })





});




$(document).ready(() => {

  // EXAMPLE LISTENER TO BE DELETED------------------------------
  // $('#fetch-users').on('click', () => {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/api/users'
  //   })
  //   .done((response) => {
  //     const $usersList = $('#users');
  //     $usersList.empty();

  //     for(const user of response.users) {
  //       $(`<li class="user">`).text(user.name).appendTo($usersList);
  //     }
  //   });
  // });


  //placeholder, my-listings will be whatever we call that link

  // Listener on each listing that redirects to respective page
  $('.listing').on('click', (event) => {
    // Capture id of the listing that detected click
    const listingId = event.currentTarget.id;
    // Redirect to that listing's page
    window.location.href = `/listings/${listingId}`;
  });

});




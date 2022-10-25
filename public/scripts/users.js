// Client facing scripts here

$(() => {

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


  //placeholder, my-listings will be whatever we call that link
  $('#my-listings').on('click', () => {

  })




});



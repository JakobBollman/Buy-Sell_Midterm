const { createNewComment } = require("../../db/queries/comments");


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

  $('.fa-heart').on('click', function(event) {

    // Stop listing click event from triggering
    event.stopPropagation();

    $(this).addClass('favourited');
    // alert('heart clickeed');   //FOR DEVELOPMENT

    // Request to add to favourites
    // $.post('/listings/:id/favourite', )
  })

  const $form = ('.new-comment') //.new-comment is placeholder, must match HTML
  $form.on('submit', (event) => {
    event.preventDefault();
    const newCommentData = $form.serialize();
    $.ajax({
      method: 'POST',
      url: '/listing/:id',
      data: newCommentData
    })
    .then(() => {
      createNewComment()
      renderComments()
      $('textarea').val("").trigger("input") //'textarea' is placeholder, this will reset input
    })
    .catch((err) => {
      console.log(err)
    })
  })


});


//takes new comments and converts to safe text
const safeText = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//takes safe text and converts to HTML element
const createCommentElement = function (data) {
  const commentTime = timeago.format(data.created_at);
  const commentBody = safeText(data.content.text);
  const result =
  //HTML here is taken from my Tweeter, placeholder until we have the real page
  `<article><header><span class="topTweetLine"><span class="tweeter-name"><img src="/images/profile-hex.png"><p>${data.user.name}</p></span><p>${data.user.email}</p></span><p>${commentBody}</p></header><footer class="tweetFeet"><span><h5>${commentTime}</h5></span><span class="icons"><i class="fa-solid fa-flag"></i><i class="fa-solid fa-heart"></i><i class="fa-solid fa-retweet"></i></span></footer></article>`
  return result;
};

//takes new HTML and adds to end of comment list
const renderComments = function (comments) {
  for (let comment of comments) {
    const $comment = createCommentElement(comment);
    $('.comments').append($comment);
  }
};



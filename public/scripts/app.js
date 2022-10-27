$(document).ready(() => {


  // Listener on each listing that redirects to respective page
  $('.listing').on('click', (event) => {
    // Capture id of the listing that detected click
    const listingId = event.currentTarget.id;
    // Redirect to that listing's page
    window.location.href = `/listings/${listingId}`;
  });


  // Listener on heart icon to add/remove from favourites
  $('.fa-heart').on('click', function(event) {
    if ($(this).hasClass('favourited')) {

      // Remove from favourites
      // Prevent listing click event from triggering
      event.stopPropagation();

      // Capture listing
      const listing = $(this).parent();

      // Capture listing id
      const listingID = listing.attr('id');

      // AJAX request to remove from favourites
      $.ajax({
        url: `/listings/${listingID}/favourite`,
        method: 'delete',
      })
      .then((data) => {
        // Change heart icon to red
        $(this).removeClass('favourited');

        // If on favourites page, fade out and remove listing from DOM
        if (window.location.pathname === '/listings/favourites') {
          listing.fadeOut(450, () => listing.detach());
        }
      });

    } else {

      // Add to favourites
      // Prevent listing click event from triggering
      event.stopPropagation();

      // Capture listing id
      const listingID = $(this).parent().attr('id');

      // AJAX request to add to favourites
      $.post(`/listings/${listingID}/favourite`)
      .then((data) => {
        // Change heart icon to red
        $(this).addClass('favourited');
      });

    }
  });


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
      // comments.createNewComment()
      renderComments()
      $('textarea').val("").trigger("input") //'textarea' is placeholder, this will reset input
    })
    .catch((err) => {
      console.log(err)
    })
  })


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














});

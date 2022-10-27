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

  //grabs new comment form
  const $form = $('#create-comment')
  $form.on('submit', (event) => {
    event.preventDefault();
    const newCommentData = $form.serialize();

    //sends post to listings/:id with comment text to be added to db
    $.ajax({
      method: 'POST',
      url: window.location.pathname,
      data: newCommentData
    })

    .then((newlyPostedComment) => {
      const newComment = newlyPostedComment;
      console.log('newComment', newComment)
      renderComments(newComment)
      $('.empty').text("")
      $('textarea').val("").trigger("input")
    })
    .catch((err) => {
      console.log(err)
    })
  })

  //mark listing sold
  const $soldButton = $('.mark-sold')
  $soldButton.on('click', function(event) {
    event.stopPropagation();
    // Capture listing ID
    const listingID = $(this).closest('.listing').attr('id');

    $.ajax({
      method: 'PATCH',
      url: `/listings/${listingID}/sold`
    })
    .then((soldListing) => {
      $(this).closest('.listing').append('<label class="sold-label">SOLD</label>');
    });

  })
});


//Helper functions below


//takes new comments and converts to safe text
const safeText = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//takes safe text and converts to HTML element
const createCommentElement = function (data) {
  console.log('data:', data)
  const commentBody = safeText(data.content);
  const result =
  `  <div class="comment">
      <label class="user">${data.name}</label>
      <label class="content">${commentBody}</label>
    </div>
  `
  return result;
};

//takes new HTML and adds to end of comment list
const renderComments = function (comment) {
  const $comment = createCommentElement(comment);
  $('.comments-box').append($comment);
};















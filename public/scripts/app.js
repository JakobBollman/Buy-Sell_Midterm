$(document).ready(() => {

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


    // Request to add to favourites
    // $.post('/listings/:id/favourite', )
  })

  const $form = $('#create-comment')
  $form.on('submit', (event) => {
    event.preventDefault();
    const newCommentData = $form.serialize();
    console.log('comment-data:', newCommentData)
    $.ajax({
      method: 'POST',
      url: window.location.pathname,
      data: newCommentData
    })
    .then((res) => {
      const newComment = res[0].content;
      renderComments(newComment)
      $('textarea').val("").trigger("input")
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
  const commentBody = safeText(data.content);
  const result =
  `  <div class="comment">
      <label class="user">${data.user?.name}</label>
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




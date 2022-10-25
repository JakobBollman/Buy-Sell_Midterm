const db = require("../connection");

const getCommentsById = (listingID) => {
  return db.query(`
    SELECT * FROM comments
    WHERE listing_id = $1`, [listingID])
  .then(data => {
    return data.rows;
  })
  .catch(err => {
    return err.message;
  })
};

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

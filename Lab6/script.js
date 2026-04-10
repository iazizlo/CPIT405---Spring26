var likeCount = 0;
var dislikeCount = 0;
var userVote = null;
var userComment = null;
var comments = [];

function init() {
  likeCount = parseInt(localStorage.getItem('likeCount'), 10) || 0;
  dislikeCount = parseInt(localStorage.getItem('dislikeCount'), 10) || 0;
  userVote = localStorage.getItem('userVote');
  userComment = localStorage.getItem('userComment');

  var stored = localStorage.getItem('comments');
  comments = stored ? JSON.parse(stored) : [];

  renderVotes();
  renderComments();
}

function vote(type) {
  if (userVote !== null) return;

  if (type === 'like') likeCount++;
  else dislikeCount++;
  userVote = type;

  localStorage.setItem('likeCount', likeCount);
  localStorage.setItem('dislikeCount', dislikeCount);
  localStorage.setItem('userVote', userVote);

  renderVotes();
}

function renderVotes() {
  var hasVoted = userVote !== null;

  document.getElementById('like-count').textContent = likeCount;
  document.getElementById('dislike-count').textContent = dislikeCount;

  var likeBtn = document.getElementById('like-btn');
  var dislikeBtn = document.getElementById('dislike-btn');
  var status = document.getElementById('vote-status');

  likeBtn.classList.toggle('voted', userVote === 'like');
  dislikeBtn.classList.toggle('voted', userVote === 'dislike');

  likeBtn.disabled = hasVoted;
  dislikeBtn.disabled = hasVoted;

  if (userVote === 'like') status.textContent = 'You liked.';
  else if (userVote === 'dislike') status.textContent = 'You disliked.';
  else status.textContent = 'Click Like or Dislike';
}

function submitComment() {
  if (userComment !== null) return;

  var input = document.getElementById('comment-input');
  var text = input.value.trim();
  if (!text) return;

  var date = new Date();
  var time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  userComment = text;
  comments.push({ text: text, time: time });

  localStorage.setItem('userComment', userComment);
  localStorage.setItem('comments', JSON.stringify(comments));

  input.value = '';
  renderComments();
}

document.getElementById('comment-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') submitComment();
});

function renderComments() {
  var hasCommented = userComment !== null;

  document.getElementById('comment-input').disabled = hasCommented;
  document.getElementById('submit-btn').disabled = hasCommented;
  document.getElementById('comment-input').placeholder = hasCommented ? 'You have already commented.' : 'Write a comment…';

  var list = document.getElementById('comments-list');
  list.innerHTML = '';

  if (comments.length === 0) {
    var li = document.createElement('li');
    li.className = 'empty-msg';
    li.textContent = 'No comments yet. ';
    list.appendChild(li);
    return;
  }

  comments.forEach(function(entry) {
    var li = document.createElement('li');

    var msg = document.createElement('span');
    msg.className = 'comment-text';
    msg.textContent = entry.text;

    var time = document.createElement('span');
    time.className = 'comment-time';
    time.textContent = entry.time || '';

    li.appendChild(msg);
    li.appendChild(time);
    list.appendChild(li);
  });
}

function resetAll() {
  likeCount = 0;
  dislikeCount = 0;
  userVote = null;
  userComment = null;
  comments = [];

  localStorage.removeItem('likeCount');
  localStorage.removeItem('dislikeCount');
  localStorage.removeItem('userVote');
  localStorage.removeItem('userComment');
  localStorage.removeItem('comments');

  renderVotes();
  renderComments();
}

init();

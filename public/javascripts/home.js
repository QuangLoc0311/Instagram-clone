function handleLike(button) {
  const photoId = button.id.slice(3);
  const likeSpan = document.getElementById(`like${photoId}`);
  const likeNumber = Number(likeSpan.innerText.split(" ")[0]);
  
  // console.log(likeNumber+1);
  const url =`/photos/${photoId}/likes`;
  if (button.classList.contains("fa-heart-o")) {
    axios.post(url)
      .then(res => {
        if(res.status === 200) {
          button.classList.remove("fa-heart-o");
          button.classList.add("fa-heart");
          button.classList.add("text-danger");
          likeSpan.innerText = `${likeNumber+1}`;
        }
      });
  } else {
    axios.delete(url)
      .then(res => {
        if(res.status === 200) {
          button.classList.add("fa-heart-o");
          button.classList.remove("fa-heart");
          button.classList.remove("text-danger");
          likeSpan.innerText = `${likeNumber-1}`;
        }
      });
  }
}

// //
// // '/photos/'+photoId+""
// <% if (p.likes.filter(id => id.toString() === currentUser._id.toString()).length === 0) { %>
//     <form action="/photos/<%= p._id %>/likes" method="POST">
//     </form>
// <% } else { %>
//     <form action ="photos/<%= p._id %>/likes" method="POST">
//     </form>
// <% } %>

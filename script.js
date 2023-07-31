let currentUser = "";
let data;
fetch("data.json")
    .then(response => response.json())
    .then(dataFromJson => {
        data = dataFromJson;
        const userImage = document.getElementById('user-image');
        userImage.src = data.currentUser.image.png;
        currentUser = data.currentUser.username;
        renderData(data);
    });

function renderData(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';

    data.comments.forEach((comment, commentIndex) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = "section";

        const contentImage = document.createElement('img');
        contentImage.src = comment.user.image.png;
        contentImage.className = "user-image";
        commentDiv.appendChild(contentImage);

        const contentUserName = document.createElement('b');
        contentUserName.textContent = comment.user.username;
        commentDiv.appendChild(contentUserName);
    
        const content = document.createElement('p');
        content.textContent = comment.content;
        commentDiv.appendChild(content);

        if (comment.user.username === currentUser) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            commentDiv.appendChild(deleteButton);
      
            deleteButton.addEventListener('click', () => {
              deleteComment(commentIndex, undefined);
            });
          }

        dataContainer.appendChild(commentDiv);

        if (comment.replies && comment.replies.length > 0) {
            const repliesSection = document.createElement('div');
            repliesSection.className = "replies-section";

            comment.replies.forEach((reply, replyIndex) => {
                const replyDiv = document.createElement('div');
                replyDiv.className = "reply";

                const replyImage = document.createElement('img');
                replyImage.src = reply.user.image.png;
                replyImage.className = "reply-user-image";
                replyDiv.appendChild(replyImage);

                const replyUsername = document.createElement('b');
                replyUsername.textContent = reply.user.username;
                replyDiv.appendChild(replyUsername);

                if(reply.user.username === currentUser){
                    const adminText = document.createElement('span');
                    adminText.textContent = "You";
                    adminText.className = "admin-text";
                    replyDiv.appendChild(adminText);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-button';
                    replyDiv.appendChild(deleteButton);
              
                    deleteButton.addEventListener('click', () => {
                        deleteComment(commentIndex, replyIndex);
                    });
                } 

                const replyContent = document.createElement('p');
                replyContent.textContent = reply.content;
                replyDiv.appendChild(replyContent);

                repliesSection.appendChild(replyDiv);
            });
            dataContainer.appendChild(repliesSection);
        }
    });

    const commentForm = document.getElementById("comment-form");
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const commentInput = document.getElementById('comment').value;
        data.comments.push({
          user: {
            username: data.currentUser.username,
            image: data.currentUser.image.png
          },
          createdAt: new Date().toISOString(),
          content: commentInput
        });

        document.getElementById('comment').value = '';
        const updatedComment = {
            user: {
              username: data.currentUser.username,
              image: data.currentUser.image.png 
            },
            createdAt: new Date().toISOString(),
            content: commentInput
          };
        const commentSection = renderComments([updatedComment]);
        dataContainer.appendChild(commentSection);
    });
}

function deleteComment(commentIndex, replyIndex) {
    if (replyIndex !== undefined) {
      data.comments[commentIndex].replies.splice(replyIndex, 1);
    } else {
      data.comments.splice(commentIndex, 1);
    }
    renderData(data);
}

function renderComments(comments) {
    const commentsSection = document.createElement('div');
    commentsSection.className = "comments-section";
  
    comments.forEach(comment => {
      const commentDiv = document.createElement('div');
      commentDiv.className = "comment";

      console.log(comment);
      const commentImage = document.createElement('img');
      commentImage.src = comment.user.image;
      commentImage.className = "user-image";
      commentDiv.appendChild(commentImage);
  
      const commentUser = document.createElement('b');
      commentUser.textContent = comment.user.username;
      commentDiv.appendChild(commentUser);
  
      const commentTimestamp = document.createElement('p');
      commentTimestamp.textContent = comment.createdAt;
      commentDiv.appendChild(commentTimestamp);
  
      const commentContent = document.createElement('p');
      commentContent.textContent = comment.content;
      commentDiv.appendChild(commentContent);
  
      commentsSection.appendChild(commentDiv);
    });
  
    return commentsSection;
  }


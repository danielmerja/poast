document.addEventListener('DOMContentLoaded', function() {
    // Fetch CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Handle star button clicks
    document.querySelectorAll('.star-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            fetch('/post/star/' + postId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if(data.success) {
                    const countElement = button.nextElementSibling.querySelector('.star-count');
                    countElement.textContent = parseInt(countElement.textContent) + 1;
                } else {
                    console.error('Error starring post:', data.message);
                }
            }).catch(error => {
                console.error('Error starring post:', error);
                console.log('Error processing request:', error.message);
            });
        });
    });

    // Handle comment form submissions
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const postId = this.getAttribute('data-post-id');
            const formData = new FormData(this);
            const comment = formData.get('comment');
            fetch('/post/comment/' + postId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ comment: comment })
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if(data.success) {
                    console.log('Comment added successfully');
                    // Append comment to post without reloading the page
                    const commentSection = document.querySelector(`[data-post-comments="${postId}"]`);
                    if (commentSection) {
                        const newComment = document.createElement('div');
                        newComment.textContent = comment; // Simplified for demonstration
                        commentSection.appendChild(newComment);
                    } else {
                        console.error('Comment section not found for post ID:', postId);
                    }
                } else {
                    console.error('Error adding comment:', data.message);
                }
            }).catch(error => {
                console.error('Error adding comment:', error);
                console.log('Error processing request:', error.message);
            });
        });
    });

    // Handle repost button clicks
    document.querySelectorAll('.repost-btn').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            fetch('/post/repost/' + postId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if(data.success) {
                    console.log('Post reposted successfully');
                    // Handle repost UI update (e.g., show notification, reload posts)
                    alert('Post reposted successfully.');
                    location.reload(); // Simplified approach to reload posts
                } else {
                    console.error('Error reposting post:', data.message);
                }
            }).catch(error => {
                console.error('Error reposting post:', error);
                console.log('Error processing request:', error.message);
            });
        });
    });
});
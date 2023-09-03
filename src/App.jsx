
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'


function App() {

  const [posts, setPosts] = useState([]);
  const [filteredPostId, setFilteredPostId] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postComments, setPostComments] = useState([]);

  useEffect(() => {
    //  async function to fetch posts and their first comments
    async function fetchPostsAndComments() {
      try {
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/posts'
        );

        // Fetch the first comment for each post
        const postsWithComments = await Promise.all(
          response.data.map(async (post) => {
            const commentResponse = await axios.get(
              `https://jsonplaceholder.typicode.com/comments?postId=${post.id}&_limit=1`
            );
            return {
              post,
              comment: commentResponse.data[0] || null,
            };
          })
        );

        // Set the posts with their first comments in the state
        setPosts(postsWithComments);
      } catch (error) {
        console.error('Error fetching posts and comments:', error);
      }
    }

    // async function to fetch posts and comments
    fetchPostsAndComments();
  }, []);

  // Function to handle filtering based on postId input
  useEffect(() => {
    if (filteredPostId === '') {
      // If the input is empty, display all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts based on the entered postId
      const filtered = posts.filter((postWithComment) =>
        postWithComment.post.id.toString().includes(filteredPostId)
      );
      setFilteredPosts(filtered);
    }
  }, [filteredPostId, posts]);


  // Function to handle clicking on a post
  const handlePostClick = (post) => {
    setSelectedPost(post);

    // Fetch comments for the selected post
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${post.post.id}`)
      .then((response) => {
        setPostComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };



  return (
    <>  
{/* left section */}
    <div className="dual-scrollable-sections">
      <div className="scrollable-section left-section">
        
      <h1>Posts with First Comment</h1>
      <div>
        <label>Filter by Post ID: </label>
        <input
          type="text"
          value={filteredPostId}
          onChange={(e) => setFilteredPostId(e.target.value)}
        />
      </div>
      
      <div className="post-list">
        <ul>
          {filteredPosts.map((postWithComment) => (
            <li 
              key={postWithComment.post.id}
              onClick={() => handlePostClick(postWithComment)}
              className={selectedPost === postWithComment ? 'selected' : ''}
            >
              <div className="post">
                <h2 className='title'>{postWithComment.post.title}</h2>
                <p>{postWithComment.post.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>


      </div>

{/* right section */}
      <div className="scrollable-section right-section">
        
      <div className="comments-section">
        {selectedPost && (
          <div>
            <h1>Comments for Selected Post:</h1>
            <ul>
              {postComments.map((comment) => (
                <li key={comment.id}>
                  <h3>{comment.body}</h3>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      </div>
    </div>
    </>
  )
}

export default App

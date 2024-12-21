
// Class for handling business logic
class PostLogic {

      async displayFullName() {
        const username = sessionStorage.getItem("username");
        const nameElement = document.querySelector(".name");
        const profileImg = document.querySelector(".profile-img")
        if (username) {
          try {
            const response = await fetch(`https://dummyjson.com/users`);
            const data = await response.json();
            const user = data.users.find(user => user.username === username);
    
            if (user) {
              nameElement.textContent = `Welcome, ${user.firstName} ${user.lastName}!`;
              profileImg.src = user.image;
            } else {
              nameElement.textContent = "Welcome, User!";
              profileImg.src = "default-profile.png";
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
            nameElement.textContent = "Welcome, Guest!";
          }
        } else {
          nameElement.textContent = "Welcome, Guest!";
          profileImg.src = "default-profile.png";
        }
      }

    async fetchPosts() {
      const response = await fetch("https://dummyjson.com/posts");
      const data = await response.json();
      return data.posts;
    }
  
    async fetchUser(userId) {
      const response = await fetch(`https://dummyjson.com/users/${userId}`);
      const user = await response.json();
      return user;
    }
  }
  
  // Class for handling UI logic
  class PostUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.menu = document.getElementById("sliding-menu");
      }
    
      toggleMenu() {
        if (this.menu.style.right === "0px") {
          this.menu.style.right = "-100%";
          console.log("clicked");
        } else {
          this.menu.style.right = "0px";
          console.log("not clicked");
        }
      }
    
      initializeMenu() {
        const closeButton = document.querySelector(".close-button");
        closeButton.addEventListener("click", () => {
          this.menu.style.right = "-100%";
        });
        const toggleButton = document.querySelector(".login-button");
        toggleButton.addEventListener("click", () => this.toggleMenu());
      }
  
      renderPost(post, user) {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <h3>${user.firstName} ${user.lastName}</h3>
            <h4>${post.title}</h4>
            <p>${post.body}</p>
            <p class="tags">${post.tags.map(tag => `#${tag}`).join(" ")}</p>
            <div class="actions">
                <span class="like-btn" data-id="${post.id}">
                    ❤️ <span class="like-count">${post.reactions.likes}</span>
                </span>
                <span class="dislike-btn" data-id="${post.id}">
                    👎 <span class="dislike-count">${post.reactions.dislikes}</span>
                </span>
                <span class="view-count">👁️ ${post.views}</span>
            </div>
        `;

        let hasInteracted = false;

        // Add like button functionality
        const likeButton = postElement.querySelector(".like-btn");
        const dislikeButton = postElement.querySelector(".dislike-btn");

        likeButton.addEventListener("click", () => {
            if (!hasInteracted) {
                post.reactions.likes++;
                likeButton.querySelector(".like-count").textContent = post.reactions.likes;
                hasInteracted = true; 
            }
        });

        
        dislikeButton.addEventListener("click", () => {
            if (!hasInteracted) {
                post.reactions.dislikes++;
                dislikeButton.querySelector(".dislike-count").textContent = post.reactions.dislikes;
                hasInteracted = true; 
            }
        });

       
        postElement.addEventListener("click", () => {
            post.views++;
            postElement.querySelector(".view-count").textContent = `👁️ ${post.views}`;
        });

        this.container.appendChild(postElement);
    }

    clearPosts() {
        this.container.innerHTML = ""; 
    }
}
  
  // Initialize classes and add event listeners
  document.addEventListener("DOMContentLoaded", async () => {
    const postLogic = new PostLogic();
    const postUI = new PostUI("posts-container");

    postUI.initializeMenu();

    
    postLogic.displayFullName();

    try {
      const posts = await postLogic.fetchPosts();
  
      
      postUI.clearPosts();
  
      
      for (const post of posts) {
        const user = await postLogic.fetchUser(post.userId);
        postUI.renderPost(post, user);
      }
    } catch (error) {
      console.error("Error fetching posts or users:", error);
    }
  });
  
  
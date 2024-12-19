class Login {
    constructor(username, password) {
      this.username = username;
      this.password = password;
      this.apiUrl = "https://dummyjson.com/auth/login";
    }
  
    async login() {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            expiresInMins: 30,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Display success message
          document.getElementById("success").style.display = "block";
          document.getElementById("success").textContent = "Login successful!";
  
          // Store token and user information
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("username", data.username);
  
          console.log("Login successful:", data);
  
          // Redirect to dashboard or next page
          setTimeout(() => {
            window.location.href = "/src/pages/dashboard.html"; // Example redirection
          }, 2000);
        } else {
            console.log("Login failed:", data);
          throw new Error(data.message || "Invalid login credentials.");
          
        }
      } catch (error) {
        // Display error message
        document.getElementById("error").style.display = "block";
        document.getElementById("error").textContent = error.message;
        console.error("Login failed:", error);
      }
    }
  }
  
  function tryLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const login = new Login(username, password);
    login.login();
  }
  
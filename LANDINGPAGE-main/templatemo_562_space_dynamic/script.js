document.addEventListener("DOMContentLoaded", () => {
    // State management
    const state = {
      selectedRole: "",
      showPassword: false,
    };
  
    // DOM elements
    const loginCard = document.getElementById("login-card");
    const forgotPasswordCard = document.getElementById("forgot-password-card");
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const backToLoginBtn = document.getElementById("back-to-login");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const roleButtons = document.querySelectorAll(".role-btn");
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
    const socialLoginButtons = document.querySelectorAll(".social-login");
    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toast-title");
    const toastMessage = document.getElementById("toast-message");
  
    // Initialize Bootstrap
    let bootstrap;
  
    try {
      bootstrap = require("bootstrap"); // For Node.js environment
    } catch (e) {
      if (typeof window !== "undefined" && window.bootstrap) {
        bootstrap = window.bootstrap; // For browser environment
      } else {
        console.warn("Bootstrap is not properly loaded. Some features may not work.");
      }
    }
  
    // Create Bootstrap Toast instance
    let toastInstance;
  
    if (typeof bootstrap !== "undefined") {
      toastInstance = new bootstrap.Toast(toast);
    } else {
      console.error("Bootstrap is not loaded properly");
    }
  
    // Initialize Bootstrap tabs
    const authTabs = document.getElementById("authTabs");
  
    if (authTabs) {
      const tabs = new bootstrap.Tab(authTabs.querySelector(".nav-link.active"));
    }
  
    // Event Listeners
  
    // Role selection
    roleButtons.forEach((button) => {
      button.addEventListener("click", function() {
        state.selectedRole = this.dataset.role;
        console.log("Selected Role:", state.selectedRole); // Debugging
        updateRoleButtons();
      });
    });
  
    // Toggle password visibility
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const inputField = this.closest(".input-group").querySelector("input");
        const icon = this.querySelector("i");
        inputField.type = inputField.type === "password" ? "text" : "password";
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      });
    });
  
    // Forgot password flow
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener("click", () => {
        loginCard.classList.add("d-none");
        forgotPasswordCard.classList.remove("d-none");
      });
    }
  
    if (backToLoginBtn) {
      backToLoginBtn.addEventListener("click", () => {
        forgotPasswordCard.classList.add("d-none");
        loginCard.classList.remove("d-none");
      });
    }
  
    // Social login
    socialLoginButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const provider = this.dataset.provider;
        handleSocialLogin(provider);
      });
    });
  
    // Form submissions
    if (loginForm) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
  
        // Hardcoded logic for kevin@gmail.com
        if (email === "kevin@gmail.com" && password === "kev") {
          // Redirect to employee dashboard
          window.location.href = "dashboard.html";
        } else if (!state.selectedRole) {
          alert("Please select a role before logging in!");
          return;
        } else {
          console.log("Logging in as:", state.selectedRole);
  
          const redirectUrls = {
            investor: "investor.html",
            entrepreneur: "entrepreneur.html",
            employee: "dashboard.html",
          };
  
          console.log("Redirecting to:", redirectUrls[state.selectedRole]);
  
          setTimeout(() => {
            window.location.href = redirectUrls[state.selectedRole];
          }, 1000);
        }
      });
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        // Check if passwords match
        const passwordValue = this.querySelector("#signupPassword").value;
        const confirmPassword = this.querySelector("#confirmPassword").value;
  
        if (passwordValue !== confirmPassword) {
          this.querySelector("#confirmPassword").setCustomValidity("Passwords do not match");
          return;
        }
  
        if (!this.checkValidity()) {
          e.stopPropagation();
          this.classList.add("was-validated");
          return;
        }
  
        const formData = new FormData(this);
        const name = formData.get("name");
        const email = formData.get("email");
        const signupPassword = formData.get("password");
  
        if (!state.selectedRole) {
          alert("Please select a role before signing up!");
          return;
        }
  
        console.log("Signing up as:", state.selectedRole);
  
        const redirectUrls = {
          investor: "investor.html",
          entrepreneur: "entrepreneur.html",
          employee: "dashboard.html",
        };
  
        console.log("Redirecting to:", redirectUrls[state.selectedRole]);
  
        setTimeout(() => {
          window.location.href = redirectUrls[state.selectedRole];
        }, 1000);
      });
    }
  
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", function(e) {
        e.preventDefault();
  
        if (!this.checkValidity()) {
          e.stopPropagation();
          this.classList.add("was-validated");
          return;
        }
  
        const formData = new FormData(this);
        const email = formData.get("resetEmail");
        handleForgotPassword(email);
  
        // Return to login screen after sending reset link
        setTimeout(() => {
          forgotPasswordCard.classList.add("d-none");
          loginCard.classList.remove("d-none");
        }, 1500);
      });
    }
  
    // Functions
  
    function updateRoleButtons() {
      roleButtons.forEach((button) => {
        button.classList.toggle("btn-primary", button.dataset.role === state.selectedRole);
        button.classList.toggle("btn-outline-primary", button.dataset.role !== state.selectedRole);
      });
    }
  
    function handleForgotPassword(email) {
      showToast("Success", "Password reset link sent to your email");
      console.log("Reset password for:", email);
    }
  
    function handleSocialLogin(provider) {
      // Simulate social login redirects
      const redirectUrls = {
        google: "https://accounts.google.com/o/oauth2/auth",
        github: "https://github.com/login/oauth/authorize",
        microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      };
  
      // Route to appropriate dashboard based on selected role after social login
      const dashboardUrls = {
        investor: "investor.html",
        entrepreneur: "entrepreneur.html",
        employee: "dashboard.html",
      };
  
      showToast("Redirecting", `Redirecting to ${provider} login...`);
      console.log(`Redirecting to ${provider} login: ${redirectUrls[provider]}`);
  
      // Simulate social login process with a redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = dashboardUrls[state.selectedRole];
      }, 1500);
    }
  
    function showToast(title, message) {
      if (!toastInstance) {
        alert(`${title}: ${message}`);
        return;
      }
  
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      toastInstance.show();
    }
  
    // Add console log to verify script is loaded
    console.log("Login form script loaded successfully");
  });
  

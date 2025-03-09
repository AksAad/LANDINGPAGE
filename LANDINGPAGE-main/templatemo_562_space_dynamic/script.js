document.addEventListener("DOMContentLoaded", () => {
  // State management
  const state = {
    selectedRole: "entrepreneur",
    showPassword: false,
  }

  // DOM elements
  const loginCard = document.getElementById("login-card")
  const forgotPasswordCard = document.getElementById("forgot-password-card")
  const forgotPasswordLink = document.getElementById("forgot-password-link")
  const backToLoginBtn = document.getElementById("back-to-login")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const forgotPasswordForm = document.getElementById("forgot-password-form")
  const roleButtons = document.querySelectorAll(".role-btn")
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  const socialLoginButtons = document.querySelectorAll(".social-login")
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toast-title")
  const toastMessage = document.getElementById("toast-message")

  // Initialize Bootstrap
  let bootstrap
  try {
    bootstrap = require("bootstrap") // For Node.js environment
  } catch (e) {
    if (typeof window !== "undefined" && window.bootstrap) {
      bootstrap = window.bootstrap // For browser environment
    } else {
      console.warn("Bootstrap is not properly loaded. Some features may not work.")
    }
  }

  // Create Bootstrap Toast instance
  let toastInstance
  if (typeof bootstrap !== "undefined") {
    toastInstance = new bootstrap.Toast(toast)
  } else {
    console.error("Bootstrap is not loaded properly")
  }

  // Initialize Bootstrap tabs
  const authTabs = document.getElementById("authTabs")
  if (authTabs) {
    const tabs = new bootstrap.Tab(authTabs.querySelector(".nav-link.active"))
  }

  // Set initial active role button
  updateRoleButtons()

  // Event Listeners
  // Role selection
  roleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Role button clicked:", this.dataset.role)
      state.selectedRole = this.dataset.role
      updateRoleButtons()
    })
  })

  // Toggle password visibility - Fixed implementation
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Toggle password button clicked")
      const inputField = this.closest(".input-group").querySelector("input")
      const icon = this.querySelector("i")

      if (inputField.type === "password") {
        inputField.type = "text"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      } else {
        inputField.type = "password"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      }
    })
  })

  // Forgot password flow
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", () => {
      loginCard.classList.add("d-none")
      forgotPasswordCard.classList.remove("d-none")
    })
  }

  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      forgotPasswordCard.classList.add("d-none")
      loginCard.classList.remove("d-none")
    })
  }

  // Social login
  socialLoginButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.dataset.provider
      handleSocialLogin(provider)
    })
  })

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()
      if (!this.checkValidity()) {
        e.stopPropagation()
        this.classList.add("was-validated")
        return
      }

      const formData = new FormData(this)
      const email = formData.get("email")
      const password = formData.get("password")

      handleLogin(email, password)
    })
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Check if passwords match
      const passwordValue = this.querySelector("#signup-password").value
      const confirmPassword = this.querySelector("#confirm-password").value

      if (passwordValue !== confirmPassword) {
        this.querySelector("#confirm-password").setCustomValidity("Passwords do not match")
      } else {
        this.querySelector("#confirm-password").setCustomValidity("")
      }

      if (!this.checkValidity()) {
        e.stopPropagation()
        this.classList.add("was-validated")
        return
      }

      const formData = new FormData(this)
      const name = formData.get("name")
      const email = formData.get("email")
      const signupPassword = formData.get("password")

      handleSignup(name, email, signupPassword)
    })
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (e) {
      e.preventDefault()
      if (!this.checkValidity()) {
        e.stopPropagation()
        this.classList.add("was-validated")
        return
      }

      const formData = new FormData(this)
      const email = formData.get("resetEmail")

      handleForgotPassword(email)
    })
  }

  // Functions
  function updateRoleButtons() {
    console.log("Updating role buttons, selected role:", state.selectedRole)
    roleButtons.forEach((button) => {
      if (button.dataset.role === state.selectedRole) {
        button.classList.remove("btn-outline-primary")
        button.classList.add("btn-primary")
      } else {
        button.classList.remove("btn-primary")
        button.classList.add("btn-outline-primary")
      }
    })
  }

  function handleLogin(email, password) {
    // Different redirect URLs based on role
    const redirectUrls = {
      investor: "/investor/dashboard.html",
      entrepreneur: "/entrepreneur/dashboard.html",
      employer: "/employer/dashboard.html",
    }

    showToast("Success", `Logged in successfully as ${state.selectedRole}!`)
    console.log(
      "Login with:",
      email,
      password,
      "Role:",
      state.selectedRole,
      "Redirect to:",
      redirectUrls[state.selectedRole],
    )
    
    // Redirect after a short delay to show the toast
    setTimeout(() => {
      window.location.href = redirectUrls[state.selectedRole];
    }, 1500);
  }

  function handleSignup(name, email, password) {
    // Different redirect URLs based on role
    const redirectUrls = {
      investor: "/investor/onboarding.html",
      entrepreneur: "/entrepreneur/onboarding.html",
      employer: "/employer/onboarding.html",
    }

    showToast("Success", `Account created successfully as ${state.selectedRole}!`)
    console.log(
      "Signup with:",
      name,
      email,
      password,
      "Role:",
      state.selectedRole,
      "Redirect to:",
      redirectUrls[state.selectedRole],
    )
    
    // Redirect after a short delay to show the toast
    setTimeout(() => {
      window.location.href = redirectUrls[state.selectedRole];
    }, 1500);
  }

  function handleForgotPassword(email) {
    showToast("Success", "Password reset link sent to your email")
    console.log("Reset password for:", email)

    // Return to login screen after sending reset link
    setTimeout(() => {
      forgotPasswordCard.classList.add("d-none")
      loginCard.classList.remove("d-none")
    }, 1500);
  }

  function handleSocialLogin(provider) {
    // Simulate social login redirects
    const redirectUrls = {
      google: "https://accounts.google.com/o/oauth2/auth",
      github: "https://github.com/login/oauth/authorize",
      microsoft: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    }

    // Route to appropriate dashboard based on selected role after social login
    const dashboardUrls = {
      investor: "/investor/dashboard.html",
      entrepreneur: "/entrepreneur/dashboard.html",
      employer: "/employer/dashboard.html",
    }

    showToast("Redirecting", `Redirecting to ${provider} login...`)
    console.log(`Redirecting to ${provider} login: ${redirectUrls[provider]}`)
    
    // Simulate social login process with a redirect to dashboard after a delay
    setTimeout(() => {
      window.location.href = dashboardUrls[state.selectedRole];
    }, 1500);
  }

  function showToast(title, message) {
    if (!toastInstance) {
      alert(`${title}: ${message}`)
      return
    }

    toastTitle.textContent = title
    toastMessage.textContent = message
    toastInstance.show()
  }

  // Add console log to verify script is loaded
  console.log("Login form script loaded successfully")
})
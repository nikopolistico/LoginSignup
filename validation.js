

const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password = document.getElementById('repeat-password');
const error_message = document.getElementById('error-message');

// Regular expression for password validation
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

// Helper function to add error class and push error message
function addError(input, message, errors) {
  input.parentElement.classList.add('incorrect');
  errors.push(message);
}

// Store credentials in local storage
function storeCredentials(email, password) {
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
}

// Retrieve credentials from local storage
function getStoredCredentials() {
  return {
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password')
  };
}

// Signup validation function
function getSignupErrors(firstname, email, password, repeat) {
  let errors = [];

  if (!firstname){
     addError(firstname_input, 'Firstname is required\n', errors);
  }else{
    const firstnameError = validateFirstName(firstname);
     if (firstnameError) {
    addError(firstname_input, firstnameError, errors);
  }
  }
  if (!email) addError(email_input, 'Email is required\n', errors);
  
  if (!password) {
    addError(password_input, 'Password is required\n', errors);
  } else if (!passwordRegex.test(password)) {
    addError(password_input, 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character', errors);
  }

  if (password !== repeat) addError(repeat_password, 'Passwords do not match', errors);

  return errors;
}

// Login validation function
function getLoginErrors(email, password) {
  let errors = [];
  const storedCredentials = getStoredCredentials();

  if (!email) addError(email_input, 'Email is required', errors);
  if (!password) addError(password_input, 'Password is required', errors);

  if (email && password) {
    if (email !== storedCredentials.email || password !== storedCredentials.password) {
      errors.push('Invalid email or password');
    }
  }

  return errors;
}

function validateFirstName(firstname){
    // Regular expression for firstname
    const regex = /^[a-zA-Z\s]+$/;
    if(firstname.length < 1 || firstname > 250){
      return "Firstname must be between 1 and 250 characters long.\n"
    }
    if (!regex.test(firstname)) {
      return "Firstname can only contain letters and spaces.\n";
    }

    return null;
}

// Form submission handler
form.addEventListener('submit', (e) => {
  let errors = [];
  
  try {
    if (firstname_input) { // Signup form

      errors = getSignupErrors(firstname_input.value, email_input.value, password_input.value, repeat_password.value);
      if (errors.length === 0) {
        storeCredentials(email_input.value, password_input.value);
        alert('User registered successfully');
      }

    } else { // Login form
      errors = getLoginErrors(email_input.value, password_input.value);
      if (errors.length === 0) {
        alert('Login successful');
      }
    }
    if (errors.length > 0) {
      e.preventDefault();
      throw new Error(errors.join(' '));
    }

  } catch (error) {
    error_message.innerText = error.message;
  }
});

// Clear error on input change
form.addEventListener('input', (e) => {
  const input = e.target;
  if (input.parentElement.classList.contains('incorrect')) {
    input.parentElement.classList.remove('incorrect');
    error_message.innerText = '';
  }
});
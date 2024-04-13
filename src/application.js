import axios from 'axios';
import onChange from 'on-change';

const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));
validateField();

const render = (state, nameEl, emailEl, btn) => {
  if (state.nameState === 'valid') {
    nameEl.classList.remove('is-invalid');
    nameEl.classList.add('is-valid');
  } else if (state.nameState === 'invalid') {
    nameEl.classList.add('is-invalid');
    nameEl.classList.remove('is-valid');
  }
  if (state.emailState === 'valid') {
    emailEl.classList.remove('is-invalid');
    emailEl.classList.add('is-valid');
  } else if (state.emailState === 'invalid') {
    emailEl.classList.add('is-invalid');
    emailEl.classList.remove('is-valid');
  }
  if (state.nameState === 'valid' && state.emailState === 'valid') { // eslint-disable-next-line
    btn.disabled = false;
  } else { // eslint-disable-next-line
    btn.disabled = true;
  }
};

export default () => {
  const formContainer = document.querySelector('.form-container');

  formContainer.innerHTML = `
  <form id="registrationForm">
  <div class="form-group">
      <label for="inputName">Name</label>
      <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
  </div>
  <div class="form-group">
      <label for="inputEmail">Email</label>
      <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
  </div>
  <input type="submit" value="Submit" class="btn btn-primary">
  </form>`;

  const form = document.querySelector('#registrationForm');
  const name = document.querySelector('#inputName');
  const email = document.querySelector('#inputEmail');
  const btn = document.querySelector('[type="submit"]');

  const state = {
    nameState: 'filling',
    emailState: 'filling',
  };

  const watchedState = onChange(state, () => {
    render(state, name, email, btn);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    axios.post('/users', Object.fromEntries(formData))
      .then((res) => {
        document.body.innerHTML = `<p>${res.data.message}</p>`;
      });
  });

  name.addEventListener('input', () => {
    const { value } = name;
    if (value.trim().length > 0 && value.match(/[a-zA-Z]/)) {
      watchedState.nameState = 'valid';
    } else {
      watchedState.nameState = 'invalid';
    }
  });

  email.addEventListener('input', () => {
    const { value } = email;
    if (value.trim().match(/\S@\S/)) {
      watchedState.emailState = 'valid';
    } else {
      watchedState.emailState = 'invalid';
    }
  });
};

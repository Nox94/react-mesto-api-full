const baseUrl =
  NODE_ENV === production
    ? "https://api.nox-mesto.nomoredomains.monster"
    : "localhost:3050";

export const register = (email, password) => {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
};

export const authorize = (email, password) => {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data); сюда приходит токен
      if (data.token) {
        localStorage.setItem("token", data.token);
        return data;
      }
    })
    .catch((err) => console.log(err));
};

export const getContent = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem('token'),
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

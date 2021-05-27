/* eslint-disable no-useless-concat */

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.nox-mesto.nomoredomains.monster"
    : "http://localhost:3000";

const token = localStorage.getItem("token");
console.log(token);

const handleOriginalResponse = (res) => {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  return res.json();
};

class Api {
  constructor(url, headers) {
    this._baseUrl = url;
    this._headers = headers;
  }

  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      method: "GET",
      headers: { ...this._headers, 'Authorization': token },
    }).then(handleOriginalResponse);
  }

  saveUserInfo(data) {
    // console.log(data);
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: { ...this._headers, 'Authorization': token },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(handleOriginalResponse);
  }

  changeLikeCardStatus(id, like) {
    const method = like ? "PUT" : "DELETE";
    return fetch(this._baseUrl + "/cards/" + `${id}` + "/likes", {
      method: method,
      headers: { ...this._headers, 'Authorization': token, },
    }).then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(`Error! ${res.statusText}`).catch((err) => console.log(err))
    );
  }

  getTheCards() {
    return fetch(this._baseUrl + "/cards", {
      method: "GET",
      headers: { ...this._headers, 'Authorization': token, },
    }).then(handleOriginalResponse);
  }

  changeUserAvatar(data) {
    console.log(data.avatar);
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: { ...this._headers, 'Authorization': token, },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(handleOriginalResponse);
  }

  createNewCard(data) {
    console.log(data);
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: { ...this._headers, 'Authorization': token, },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
        // owner: data.owner,
      }),
    }).then(handleOriginalResponse);
  }

  removeCard(id) {
    return fetch(this._baseUrl + "/cards/" + `${id}`, {
      method: "DELETE",
      headers: { ...this._headers, 'Authorization': token, },
    }).then(handleOriginalResponse);
  }
}



export const api = new Api(baseUrl, {
  "Content-Type": "application/json",
  Accept: "application/json",
});

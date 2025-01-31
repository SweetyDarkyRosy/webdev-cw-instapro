const personalKey = "sweetyviky";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

// Loads posts of a certain user
export function getUserPosts({ userId, token }) {
  return fetch(postsHost + "/user-posts/" + userId, {
      method: "GET",
      headers: {
          Authorization: token,
        },
    }).then((response) => {
        return response.json();
      }).then((data) => {
          return data.posts;
        });
}

// Sends a new post to the server
export function addPost({ description, imageUrl, token }) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
        description,
        imageUrl,
      }),
    headers: {
        Authorization: token,
      },
  }).then((response) => {
      if (response.status === 500) {
        throw new Error("Ошибка на стороне сервера");
      }

      if (response.status === 400) {
        throw new Error("Данные для поста не заполнены должным образом");
      }

      if (response.status === 401) {
        throw new Error("Попытка опубликовать пост без авторизации");
      }

      return response.json();
    });
}

// Processes a like click
export function toggleLike({ postId, isLiked, token }) {
  let action;
  if (isLiked == true)
  {
    action = "/dislike";
  }
  else
  {
    action = "/like";
  }

  return fetch(postsHost + "/" + postId + action, {
    method: "POST",
    headers: {
        Authorization: token,
      },
  }).then((response) => {
      if (response.status === 200)
      {
        return true;
      }

      if (response.status === 500) {
        throw new Error("Ошибка на стороне сервера");
      }

      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      
      return false;
    });
}

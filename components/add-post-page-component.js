import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавление поста</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea type="textarea" class="input textarea post-comment" placeholder="Введите ваш коментарий"></textarea>
          <div class="form-error"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    uploadImageContainer.addEventListener("click", () => {
        uploadImageContainer.classList.remove("invalid-el");
        
        const formErrorDiv = appEl.querySelector(".form-error");
        formErrorDiv.innerHTML = "";
      });

    const commentTextArea = appEl.querySelector(".post-comment");
    commentTextArea.addEventListener("click", () => {
        commentTextArea.classList.remove("invalid-el");

        const formErrorDiv = appEl.querySelector(".form-error");
        formErrorDiv.innerHTML = "";
      });

    document.getElementById("add-button").addEventListener("click", () => {
      if (imageUrl === "")
      {
        const formErrorDiv = appEl.querySelector(".form-error");
        formErrorDiv.innerHTML = "<h1>Не было выбрано изображение</h1>";

        uploadImageContainer.classList.add("invalid-el");

        return;
      }

      if (commentTextArea.value.length === 0)
      {
        const formErrorDiv = appEl.querySelector(".form-error");
        formErrorDiv.innerHTML = "<h1>Отсутствует комментарий</h1>";

        commentTextArea.classList.add("invalid-el");

        return;
      }

      onAddPostClick({
        description: commentTextArea.value,
        imageUrl: imageUrl,});
    });
  };

  render();
}

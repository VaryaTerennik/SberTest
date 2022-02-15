"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const modal = document.querySelector(".modal");
  const message = {
    loading: "./form/spinner.svg",
    success: "Ваши данные отправлены",
    error: "Что-то пошло не так",
  };

  bindPostData(form);

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json",
      },
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksDilog(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksDilog(message.error);
          statusMessage.remove();
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  window.removeFakeCaptcha = function () {
    document.querySelector(".captcha-fake-field").remove();
  };

  function showThanksDilog(message) {
    const prevModalDilog = document.querySelector(".modal__dialog");
    prevModalDilog.classList.add("hide");

    const currModelDilog = document.createElement("div");
    currModelDilog.classList.add("modal__dialog");
    currModelDilog.innerHTML = `
      <div class="modal__content">
        <div class="modal__title">${message}</div>
      </div>`;

    document.querySelector(".modal").append(currModelDilog);
    setTimeout(() => {
      currModelDilog.remove();
      prevModalDilog.classList.remove("hide");
    }, 4000);
  }
});

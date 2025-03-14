document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".input");
  const enterButton = document.querySelector(".enter");
  const todoContainer = document.querySelector(".container");
  const currentDateSpan = document.getElementById("currentDate");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  let currentDate = new Date().toISOString().split("T")[0];
  currentDateSpan.textContent = currentDate;

  function addTodo() {
    const todoText = input.value.trim();
    if (!todoText) return;

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const todoTextElement = document.createElement("span");
    todoTextElement.textContent = todoText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", function () {
      todoDiv.remove();
    });

    todoDiv.appendChild(todoTextElement);
    todoDiv.appendChild(deleteButton);
    todoContainer.appendChild(todoDiv);

    input.value = "";
  }

  enterButton.addEventListener("click", addTodo);
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTodo();
  });
});

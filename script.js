document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".input");
  const enterButton = document.querySelector(".enter");
  const todoContainer = document.querySelector(".container");
  const currentDateSpan = document.getElementById("currentDate");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  }

  let currentDate = new Date().toISOString().split("T")[0];
  currentDateSpan.textContent = formatDate(currentDate);

  function loadTodos() {
    todoContainer.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos.forEach(({ id, text, completed }) =>
      addTodoElement(id, text, completed)
    );
  }

  function addTodoElement(id, todoText, completed = false) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    todoDiv.dataset.id = id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.classList.add("checkbox");
    checkbox.addEventListener("change", function () {
      toggleComplete(id, checkbox.checked);
    });

    const todoTextElement = document.createElement("span");
    todoTextElement.textContent = todoText;
    if (completed) {
      todoTextElement.style.textDecoration = "line-through";
      todoTextElement.style.color = "gray";
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.classList.add("delete");
    deleteButton.onclick = function () {
      removeTodo(id);
    };

    todoDiv.appendChild(checkbox);
    todoDiv.appendChild(todoTextElement);
    todoDiv.appendChild(deleteButton);
    todoContainer.appendChild(todoDiv);
  }

  function addTodo() {
    const todoText = input.value.trim();
    if (!todoText) return;

    const todos = JSON.parse(localStorage.getItem(currentDate)) || [];

    const newTodo = {
      id: crypto.randomUUID(),
      text: todoText,
      completed: false,
    };

    todos.push(newTodo);
    localStorage.setItem(currentDate, JSON.stringify(todos));

    addTodoElement(newTodo.id, todoText, false);
    input.value = "";
  }

  function removeTodo(id) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos = todos.filter((todo) => todo.id !== id);

    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  function toggleComplete(id, isCompleted) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];

    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: isCompleted } : todo
    );

    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  function changeDate(days) {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    currentDate = newDate.toISOString().split("T")[0];
    currentDateSpan.textContent = formatDate(currentDate);
    loadTodos();
  }

  enterButton.addEventListener("click", addTodo);
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTodo();
  });
  prevButton.addEventListener("click", () => changeDate(-1));
  nextButton.addEventListener("click", () => changeDate(1));

  loadTodos();
});

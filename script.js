document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".input");
  const enterButton = document.querySelector(".enter");
  const todoContainer = document.querySelector(".container");
  const currentDateSpan = document.getElementById("currentDate");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  let currentDate = new Date().toISOString().split("T")[0];
  currentDateSpan.textContent = currentDate;

  function loadTodos() {
    todoContainer.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos.forEach(({ text, completed }) => addTodoElement(text, completed));
  }

  function addTodoElement(todoText, completed = false) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", function () {
      toggleComplete(todoText, checkbox.checked);
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
      removeTodo(todoText);
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
    todos.push({ text: todoText, completed: false });
    localStorage.setItem(currentDate, JSON.stringify(todos));

    addTodoElement(todoText);
    input.value = "";
  }

  function removeTodo(todoText) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  function toggleComplete(todoText, isCompleted) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos = todos.map((todo) =>
      todo.text === todoText ? { ...todo, completed: isCompleted } : todo
    );
    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  function changeDate(days) {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    currentDate = newDate.toISOString().split("T")[0];
    currentDateSpan.textContent = currentDate;
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

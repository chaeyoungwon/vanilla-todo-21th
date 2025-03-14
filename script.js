document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector(".input");
  const enterButton = document.querySelector(".enter");
  const todoContainer = document.querySelector(".container");
  const currentDateSpan = document.getElementById("currentDate");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const datePicker = document.getElementById("datePicker");
  const themeBtn = document.querySelector(".theme");
  const body = document.body;

  document.querySelector("h2").addEventListener("click", () => {
    todoManager.currentDate = new Date().toISOString().split("T")[0];
    currentDateSpan.textContent = todoManager.formatDate(
      todoManager.currentDate
    );
    datePicker.value = todoManager.currentDate;
    todoManager.loadTodos();
  });

  class TodoManager {
    constructor() {
      this.currentDate = new Date().toISOString().split("T")[0];
      currentDateSpan.textContent = this.formatDate(this.currentDate);
      datePicker.value = this.currentDate;
      this.loadTodos();
    }

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
    }

    loadTodos() {
      todoContainer.innerHTML = "";
      const todos = JSON.parse(localStorage.getItem(this.currentDate)) || [];
      todos.forEach(({ id, text, completed }) =>
        this.addTodoElement(id, text, completed)
      );
    }

    addTodoElement(id, todoText, completed = false) {
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      todoDiv.dataset.id = id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = completed;
      checkbox.classList.add("checkbox");
      checkbox.addEventListener("change", () =>
        this.toggleComplete(id, checkbox.checked)
      );

      const todoTextElement = document.createElement("span");
      todoTextElement.textContent = todoText;
      if (completed) {
        todoTextElement.style.textDecoration = "line-through";
        todoTextElement.style.color = "gray";
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.classList.add("delete");
      deleteButton.onclick = () => this.removeTodo(id);

      todoDiv.append(checkbox, todoTextElement, deleteButton);
      todoContainer.appendChild(todoDiv);
    }

    addTodo() {
      const todoText = input.value.trim();
      if (!todoText) return;

      const todos = JSON.parse(localStorage.getItem(this.currentDate)) || [];
      const newTodo = {
        id: crypto.randomUUID(),
        text: todoText,
        completed: false,
      };

      todos.push(newTodo);
      localStorage.setItem(this.currentDate, JSON.stringify(todos));
      this.addTodoElement(newTodo.id, todoText);
      input.value = "";
    }

    removeTodo(id) {
      let todos = JSON.parse(localStorage.getItem(this.currentDate)) || [];
      todos = todos.filter((todo) => todo.id !== id);
      localStorage.setItem(this.currentDate, JSON.stringify(todos));
      this.loadTodos();
    }

    toggleComplete(id, isCompleted) {
      let todos = JSON.parse(localStorage.getItem(this.currentDate)) || [];
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: isCompleted } : todo
      );
      localStorage.setItem(this.currentDate, JSON.stringify(todos));
      this.loadTodos();
    }

    changeDate(days) {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() + days);
      this.currentDate = newDate.toISOString().split("T")[0];
      currentDateSpan.textContent = this.formatDate(this.currentDate);
      this.loadTodos();
    }
  }

  class Sidebar {
    constructor() {
      this.sidebar = document.querySelector(".sidebar");
      this.hamburger = document.querySelector(".hamburger");
      this.closeBtn = document.querySelector(".close");
      this.addEventListeners();
    }

    addEventListeners() {
      this.hamburger.addEventListener("click", () => {
        this.sidebar.style.left = "0";
      });

      this.closeBtn.addEventListener("click", () => {
        this.sidebar.style.left = "-250px";
      });

      document.addEventListener("click", (event) => {
        if (
          !this.sidebar.contains(event.target) &&
          !this.hamburger.contains(event.target)
        ) {
          this.sidebar.style.left = "-250px";
        }
      });
    }
  }

  class DarkMode {
    constructor() {
      this.themeBtn = themeBtn;
      this.body = body;
      this.loadTheme();
      this.setup();
    }

    setup() {
      this.themeBtn.addEventListener("click", () => {
        this.toggleTheme();
      });
    }

    toggleTheme() {
      const isDarkMode = this.body.classList.toggle("dark-mode");
      this.themeBtn.textContent = isDarkMode ? "☀️" : "🌙";
      localStorage.setItem("darkMode", isDarkMode);
    }

    loadTheme() {
      const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
      if (isDarkMode) {
        this.body.classList.add("dark-mode");
        this.themeBtn.textContent = "☀️";
      } else {
        this.body.classList.remove("dark-mode");
        this.themeBtn.textContent = "🌙";
      }
    }
  }

  const todoManager = new TodoManager();
  new Sidebar();
  new DarkMode();

  // ✅ 이벤트 리스너 설정
  enterButton.addEventListener("click", () => todoManager.addTodo());
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") todoManager.addTodo();
  });
  prevButton.addEventListener("click", () => todoManager.changeDate(-1));
  nextButton.addEventListener("click", () => todoManager.changeDate(1));

  document.getElementById("datePicker").addEventListener("change", function () {
    todoManager.currentDate = this.value;
    currentDateSpan.textContent = todoManager.formatDate(
      todoManager.currentDate
    );
    todoManager.loadTodos();
  });

  document.querySelectorAll(".weekBtn").forEach((button) => {
    button.addEventListener("click", () => {
      const days = parseInt(button.dataset.days);
      todoManager.changeDate(days);
    });
  });
});

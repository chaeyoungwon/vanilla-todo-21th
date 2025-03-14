document.addEventListener("DOMContentLoaded", function () {
  // DOM 요소 가져오기
  const input = document.querySelector(".input");
  const enterButton = document.querySelector(".enter");
  const todoContainer = document.querySelector(".container");
  const currentDateSpan = document.getElementById("currentDate");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const datePicker = document.getElementById("datePicker");
  const themeBtn = document.querySelector(".theme");
  const body = document.body;
  const homeButton = document.querySelector("h2");
  const sidebar = document.querySelector(".sidebar");
  const hamburger = document.querySelector(".hamburger");
  const closeBtn = document.querySelector(".close");

  // 현재 선택된 날짜
  let currentDate = new Date().toISOString().split("T")[0];

  // 날짜 포맷 변환 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  // UI 날짜 업데이트
  function updateDateUI() {
    currentDateSpan.textContent = formatDate(currentDate);
    datePicker.value = currentDate;
  }

  // 할 일 리스트 불러오기 (로컬 스토리지)
  function loadTodos() {
    todoContainer.innerHTML = "";
    const todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos.forEach(({ id, text, completed }) =>
      addTodoElement(id, text, completed)
    );
  }

  // 새로운 할 일 요소 추가
  function addTodoElement(id, text, completed = false) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () =>
      toggleComplete(id, checkbox.checked)
    );

    const todoText = document.createElement("span");
    todoText.textContent = text;
    if (completed) {
      todoText.style.textDecoration = "line-through";
      todoText.style.color = "gray";
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", () => removeTodo(id));

    todoDiv.append(checkbox, todoText, deleteButton);
    todoContainer.appendChild(todoDiv);
  }

  // 할 일 추가
  function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    const todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    const newTodo = { id: crypto.randomUUID(), text, completed: false };

    todos.push(newTodo);
    localStorage.setItem(currentDate, JSON.stringify(todos));
    addTodoElement(newTodo.id, text);
    input.value = "";
  }

  // 할 일 삭제
  function removeTodo(id) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos = todos.filter((todo) => todo.id !== id);
    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  // 완료 상태 체크박스
  function toggleComplete(id, isCompleted) {
    let todos = JSON.parse(localStorage.getItem(currentDate)) || [];
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: isCompleted } : todo
    );
    localStorage.setItem(currentDate, JSON.stringify(todos));
    loadTodos();
  }

  // 날짜 변경 (이전/다음)
  function changeDate(days) {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    currentDate = newDate.toISOString().split("T")[0];
    updateDateUI();
    loadTodos();
  }

  // 다크모드 설정
  function loadTheme() {
    const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    body.classList.toggle("dark-mode", isDarkMode);
    themeBtn.textContent = isDarkMode ? "☀️" : "🌙";
  }

  function toggleTheme() {
    const isDarkMode = body.classList.toggle("dark-mode");
    themeBtn.textContent = isDarkMode ? "☀️" : "🌙";
    localStorage.setItem("darkMode", isDarkMode);
  }

  // 사이드바 열기/닫기 기능
  function openSidebar() {
    sidebar.style.left = "0";
  }

  function closeSidebar() {
    sidebar.style.left = "-250px";
  }

  function handleOutsideClick(event) {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
      closeSidebar();
    }
  }

  // 이벤트 리스너 등록
  enterButton.addEventListener("click", addTodo);
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addTodo();
  });

  prevButton.addEventListener("click", () => changeDate(-1));
  nextButton.addEventListener("click", () => changeDate(1));

  datePicker.addEventListener("change", function () {
    currentDate = this.value;
    updateDateUI();
    loadTodos();
  });

  document.querySelectorAll(".weekBtn").forEach((button) => {
    button.addEventListener("click", () =>
      changeDate(parseInt(button.dataset.days))
    );
  });

  homeButton.addEventListener("click", () => {
    currentDate = new Date().toISOString().split("T")[0];
    updateDateUI();
    loadTodos();
  });

  themeBtn.addEventListener("click", toggleTheme);
  hamburger.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  document.addEventListener("click", handleOutsideClick);

  // 초기 실행
  updateDateUI();
  loadTodos();
  loadTheme();
});

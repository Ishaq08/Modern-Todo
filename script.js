    function toggleTheme() {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    }

    function loadTheme() {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') document.body.classList.add('dark');
    }

    function getDateByKey(key) {
      const today = new Date();
      if (key === 'today') return new Date();
      if (key === 'tomorrow') return new Date(today.setDate(today.getDate() + 1));
      if (key === 'week') return new Date(today.setDate(today.getDate() + 3));
    }

    function addTaskToDate(key) {
      const inputId = {
        today: 'taskTodayInput',
        tomorrow: 'taskTomorrowInput',
        week: 'taskWeekInput'
      }[key];

      const input = document.getElementById(inputId);
      const value = input.value.trim();
      if (value === '') return;

      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text: value, done: false, date: getDateByKey(key).toISOString() });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      input.value = '';
      loadTasks();
    }

    function addTask() {
      const input = document.getElementById('taskInput');
      const value = input.value.trim();
      if (value === '') return;
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text: value, done: false, date: new Date().toISOString() });
      localStorage.setItem('tasks', JSON.stringify(tasks));
      input.value = '';
      loadTasks();
    }

    function deleteTask(index) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadTasks();
    }

    function toggleTask(index) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks[index].done = !tasks[index].done;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadTasks();
    }

    function showSection(id) {
      document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
      document.getElementById(id).style.display = 'block';
    }

    function isSameDay(date1, date2) {
      return date1.toDateString() === date2.toDateString();
    }

    function isThisWeek(date, today) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return date >= weekStart && date <= weekEnd;
    }

    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      document.getElementById('taskList').innerHTML = '';
      document.getElementById('taskCount').textContent = tasks.length;

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      document.getElementById('upcomingToday').innerHTML = '';
      document.getElementById('upcomingTomorrow').innerHTML = '';
      document.getElementById('upcomingWeek').innerHTML = '';

      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(index));

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.done) span.style.textDecoration = 'line-through';

        const delBtn = document.createElement('button');
        delBtn.innerHTML = '&times;';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => deleteTask(index);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);

        document.getElementById('taskList').appendChild(li);

        const date = new Date(task.date);
        if (isSameDay(date, today)) document.getElementById('upcomingToday').appendChild(li.cloneNode(true));
        else if (isSameDay(date, tomorrow)) document.getElementById('upcomingTomorrow').appendChild(li.cloneNode(true));
        else if (isThisWeek(date, today)) document.getElementById('upcomingWeek').appendChild(li.cloneNode(true));
      });
    }

    window.onload = () => {
      loadTheme();
      loadTasks();
    };
  
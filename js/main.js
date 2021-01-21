// Array Of Object To Store TODO
let LIST, id;

// Get Data from LocalStorage
let data = localStorage.getItem('TODO');

//Check if data is not empty
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  // if data is empty
  LIST = [];
  id = 0;
}

// load items to the user's Interface
function loadList(array) {
  array.forEach(function (list) {
    addToDo(list.toDo, list.id, list.isDone, list.isTrash);
  });
}

// Clear All
clearAll.addEventListener('click', function () {
  localStorage.clear();

  todoLists
    .querySelectorAll('.todo__todoList')
    .forEach(function (todo, index, arr) {
      todo.style.animation = `delete2 ${
        0.2 * (arr.length - index) + 0.8
      }s ease 1`;
      // Update the LIST
      LIST[todo.id].isTrash = true;

      todo.addEventListener('animationend', function () {
        todo.remove();
        isEmptyContainer();
      });
    });

  LIST = [];
  id = 0;
});

// To Check Empty To-do Container
const isEmptyContainer = function () {
  if (todoLists.innerHTML === '') {
    todoListContainer.classList.add('empty');
  } else {
    todoListContainer.classList.remove('empty');
  }

  if (todoLists.clientHeight > todoListContainer.clientHeight) {
    todoListContainer.classList.add('scroll');
  } else {
    todoListContainer.classList.remove('scroll');
  }
};

// To Add To-do List
function addToDo(toDo, id, isDone, isTrash) {
  if (isTrash) return;

  const DONE = isDone ? 'done' : '';
  const todoElement = `<li class="todo__todoList ${DONE}" id="${id}">
    <div class="todoList-left">
      <span>
        <i class="fas fa-check"></i>
      </span>
      <p spellcheck="false">${toDo}</p>
    </div>
    <div class="todoList-right">
      <button class="todoListBtn btnDone" id="todoListBtn--done">
        <img src="img/iconCorrect.svg" alt="" />
      </button>
      <button class="todoListBtn btnEdit" id="todoListBtn--edit">
        <img src="img/iconEdit.svg" alt="" />
      </button>
      <button
        class="todoListBtn btnDelete"
        id="todoListBtn--deleteRed"
      >
        <img
          src="img/iconTrash--red.svg"
          alt=""
          class="iconTrash--red"
        />
      </button>

      <button
        class="todoListBtn btnDone todoListBtn--doneBTN"
        id="todoListBtn--notDone"
      >
        <img src="img/iconWrong.svg" alt="" />
      </button>

      <button
        class="todoListBtn btnDelete todoListBtn--doneBTN"
        id="todoListBtn--deleteWhite"
      >
        <img
          src="img/iconTrash--white.svg"
          alt=""
          class="iconTrash--white"
        />
      </button>
    </div>
  </li>`;
  todoLists.insertAdjacentHTML('beforeend', todoElement);
}

// Update the LIST Array
const updateList = function (toDo, id, isDone, isTrash) {
  LIST.push({
    toDo,
    id,
    isDone,
    isTrash,
  });

  // Add Data to LocalStorage (should be added where we update our LIST)
  localStorage.setItem('TODO', JSON.stringify(LIST));
};

// ADD todo-List when user hit enter/search key
btnAdd.addEventListener('click', function (e) {
  e.preventDefault();

  const todo = searchInput.value.trim();
  if (todo) {
    const arg = [todo, id, false, false];
    addToDo(...arg);
    updateList(...arg);
    id++;
  }

  // check for empty UL and scrollbar
  isEmptyContainer();
  searchInput.blur();
  searchInput.value = '';
});

// Handle All TODO LIST Buttons
todoLists.addEventListener('click', function (e) {
  const btn = e.target;
  const todo = btn.closest('.todo__todoList');

  // DELETE TODO
  if (btn.classList.contains('btnDelete')) {
    todo.style.animation = 'delete 0.8s ease 1';

    // Update the LIST
    LIST[todo.id].isTrash = true;

    todo.addEventListener('animationend', function () {
      todo.remove();
      isEmptyContainer();
    });
  }

  // COMPLETE TODO
  if (btn.classList.contains('btnDone')) {
    todo.classList.toggle('done');
    todo.style.animation = 'flipX 0.8s ease 1';
    todo.style.pointerEvents = 'none';

    // Update the LIST
    LIST[todo.id].isDone = LIST[todo.id].isDone ? false : true;

    todo.addEventListener('animationend', function () {
      todo.style.animation = 'none';
      todo.style.pointerEvents = 'all';
    });
  }

  // EDIT TODO
  if (btn.classList.contains('btnEdit')) {
    const para = todo.querySelector('p');
    para.setAttribute('role', 'textbox');
    para.setAttribute('contenteditable', '');
    todo.style.borderColor = '#EB3668';

    placeCaretAtEnd(para);

    const paraHandler = function () {
      para.blur();
      para.removeAttribute('role');
      para.removeAttribute('contenteditable');
      todo.style.borderColor = '#242e6c';
      LIST[todo.id].toDo = para.textContent;
    };

    para.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        paraHandler();
      }
    });
    para.addEventListener('blur', function (e) {
      paraHandler();
    });
  }

  // Add Data to LocalStorage (should be added where we update our LIST)
  localStorage.setItem('TODO', JSON.stringify(LIST));
});

// role="textbox" contenteditable

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dayEl = document.getElementById('day');
const dateEl = document.getElementById('date');
const header = document.querySelector('header');
const todoLists = document.querySelector('.todo__todoLists');
const todoListContainer = document.querySelector('.todo__todoListContainer');

const btnAdd = document.getElementById('btnAdd');
const searchInput = document.getElementById('search');

const clearAll = document.querySelector('.todoBtnPrimary');

searchInput.addEventListener('focus', () => {
  searchInput.parentNode.style.borderColor = '#EB3668';
});

searchInput.addEventListener('blur', () => {
  searchInput.parentNode.style.borderColor = '#242e6c';
});

// Set the day & Date
const setTime = function () {
  const presentTime = new Date();
  const presentDay = DAYS[presentTime.getDay()];
  const presentDate = `${
    MONTHS[presentTime.getMonth()]
  } ${presentTime.getDate()}, ${presentTime.getFullYear()}`;

  dayEl.textContent = presentDay;
  dateEl.textContent = presentDate;
};

// ON START
window.onload = function () {
  setTime();
  setInterval(setTime, 1000);
  isEmptyContainer();
};

// Filter Search
const getFilteredData = function () {
  const option = document.querySelector('.custom-select__trigger span');
  const sortBy = option.textContent.toLowerCase();
  const filteredLIST = LIST.filter(function (todo) {
    if (todo.isTrash) return;
    if (sortBy === 'complete' && todo['isDone'] && !todo.isTrash) {
      return todo;
    } else if (sortBy === 'incomplete' && !todo['isDone'] && !todo.isTrash) {
      return todo;
    } else if (sortBy === 'all' && !todo.isTrash) {
      return todo;
    }
  });
  todoLists.innerHTML = '';
  filteredLIST.forEach(function (list) {
    addToDo(list.toDo, list.id, list.isDone, list.isTrash);
  });
  isEmptyContainer();
};

document
  .querySelector('.custom-select-wrapper')
  .addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
  });
for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
    if (!this.classList.contains('selected')) {
      this.parentNode
        .querySelector('.custom-option.selected')
        .classList.remove('selected');
      this.classList.add('selected');
      this.closest('.custom-select').querySelector(
        '.custom-select__trigger span'
      ).textContent = this.textContent;
      getFilteredData();
    }
  });
}

// Header On Scroll
document.addEventListener('scroll', function () {
  if (window.scrollY > 0) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});

// Put the CURSOR to the end of TEXT
const placeCaretAtEnd = function (el) {
  el.focus();
  if (
    typeof window.getSelection != 'undefined' &&
    typeof document.createRange != 'undefined'
  ) {
    let range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange != 'undefined') {
    let textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
};

/*
let form = document.querySelector('form');
let ul = document.querySelector('ul');
let itemNameInput = document.querySelector('.name')
let items = []; //ska helst finnas i funktion

function render(data) {
  ul.innerHTML="";
  for (let listItem of data) {
    let li = document.createElement('li');
    li.textContent = listItem.title;
    ul.appendChild(li);
  }
}

form.addEventListener('submit', function(e) {
  e.preventDefault(); //skickas inte till servern
  let name = itemNameInput.value;
  itemNameInput.value = "";
  let li = document.createElement("li");
  li.innerHTML = name;
  ul.appendChild(li);

  let req = new XMLHttpRequest();
  req.open('POST', '/todos');
  req.setRequestHeader('Content-Type', 'application/json');
  let obj = {title: name};
  req.send(JSON.stringify(obj));
});

function onLoad() {
  let data = JSON.parse(this.responseText).data;
    console.log(data);
    render(data);
}

function deleteItem(data) {
  let button = this;
  let li = button.parentElement;
  ul.removeChild(li);
}

axios.get('/todos') .then(function(response) {
console.log(response.data);
});
*/

const form = document.querySelector('form');
const input  = document.querySelector('input');
const ul = document.querySelector('ul');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  let value = input.value;
  console.log(value);

  createTodo(value)
  .then(function() {
    return fetchTodos();
  })
  .then(function(todos) {
    render(todos);
  });
  input.value = "";
});

function fetchTodos(cb) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      if (this.status !== 200) {
        reject(new Error('Invalid status'));
        return;
      }
      let data = JSON.parse(this.responseText);
      let todos = data.data;
      resolve(todos);
    });
    xhr.open('GET', '/todos');
    xhr.send();
  });
}

function getTodo(id) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      if (this.status === 404) return resolve(null);
      let respData = JSON.parse(this.responseText);
      let todo = respData.data;
      resolve(todo);
    });
    xhr.open('GET', '/todos/' + id);
    xhr.send();
  });
}

function createTodo(name) {
  return new Promise((resolve, reject) => {
    let todo = {
      title: name,
    };
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/todos');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
      if (this.status === 201) {
        resolve();
      } else {
        reject('Oops');
      }
    });
    let data = JSON.stringify(todo);
    xhr.send(data);
  });
}

function removeTodo(id) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      resolve();
    });
    xhr.open("DELETE", "/todos/" + id);
    xhr.send();
  });
}

function updateTodo(id, newTitle) {
  return getTodo(id)
  .then(function(todo) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('PUT', '/todos/' + id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      todo.title = newTitle;
      xhr.send(JSON.stringify(todo));
      xhr.addEventListener('load', function() {
        resolve();
      });
    });
  });
}

function render(todos) {
  ul.innerHTML = "";
  for (let todo of todos) {
    let li = document.createElement('li');
    let titleSpan = document.createElement('span');
    let idSpan = document.createElement('span');
    let removeButton = document.createElement('button');
    let changeButton = document.createElement('button');
    idSpan.className = "id";
    let changeInput = document.createElement('input');
    changeInput.value = todo.title;
    titleSpan.appendChild(changeInput);
    idSpan.textContent = todo.id;
    removeButton.textContent = "Remove me";
    changeButton.textContent = "Change me";
    removeButton.addEventListener('click', function() {
      removeTodo(todo.id)
      .then(function() {
        return fetchTodos();
      })
      .then(function(todos) {
        render(todos);
      });
    });

    changeButton.addEventListener('click', function() {
      let newValue = changeInput.value;
      if (newValue !== todo.title) {
        updateTodo(todo.id, newValue)
        .then(function() {
          return fetchTodos();
        })
        .then(function(todos) {
          render(todos);
        });
      }
  });

  li.appendChild(idSpan);
  li.appendChild(titleSpan);
  li.appendChild(changeButton);
  li.appendChild(removeButton);
  ul.appendChild(li);
  }
}

fetchTodos()
  .then(todos => {
    render(todos);
});

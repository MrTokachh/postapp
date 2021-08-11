// TODO: Use verbs for function name

var postList = document.querySelector('.post-list__body');
var url = 'http://localhost:5005/posts';
function date() {
  // TODO: You should always call () for constructors
  var date = new Date;
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var sec = date.getSeconds();
  var curentDate = day + '.' + month + '.' + year + ' ' + hour + ':' + minutes + ':' + sec

  return curentDate
}

function renderPosts(posts) {
  postList.innerHTML = '';
  posts.forEach(function(post) {
    // TODO: For performance reasons, check and apply DocumentFragment instead https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
    var postItem = document.createElement('li');
    postItem.classList.add('post-item');
    postItem.id = post.id
    
    var postLeft = document.createElement('div');
    postLeft.classList.add('post-item__left');
    postItem.append(postLeft);

    var postTitle = document.createElement('h3');
    postTitle.classList.add('post-item__title');
    postTitle.textContent = post.title
    postLeft.append(postTitle);

    var postDesc = document.createElement('p');
    postDesc.classList.add('post-item__desc');
    postDesc.textContent = post.description
    postLeft.append(postDesc);

    var postCreated = document.createElement('time');
    postCreated.classList.add('post-item__created');
    postCreated.textContent = 'created:' + post.dateCreated
    postLeft.append(postCreated);

    var postUpdated = document.createElement('time');
    postUpdated.classList.add('post-item__updated');
    postUpdated.textContent = 'updated:' + post.dateUpdated
    postLeft.append(postUpdated);

    var postRight = document.createElement('div');
    postRight.classList.add('post-item__right');
    postItem.append(postRight);

    var postEdit = document.createElement('button');
    postEdit.classList.add('post-item__edit');
    postEdit.classList.add('btn');
    postEdit.textContent = 'Edit';
    postEdit.addEventListener('click', editFunc)
    postRight.append(postEdit);

    var postRemove = document.createElement('button');
    postRemove.classList.add('post-item__remove');
    postRemove.classList.add('btn');
    postRemove.classList.add('btn-red');
    postRemove.textContent = 'Remove';
    postRemove.addEventListener('click', removeFunc);
    postRight.append(postRemove);

    postList.append(postItem);
  })
}

// TODO: Rename according to actual functionality
function render() {
  fetch(url)
    .then(function(res) {
      return res.json()
    })
    .then(function(data) {
  
      renderPosts(data)
    })
}

render()

// TODO: validLength doesn't looks like an action, but function should make something. Please, use verb instead
function validLength(item, min, max, func) {
  var length = item.value.length;
  if (length < min) {
    item.classList.add('is-invalid')
  } else if (length > max) {
    item.classList.add('is-invalid')
  } else {
    item.classList.remove('is-invalid')
    func()
  }
}

// TODO: Move "Add Post" and "Edit Post" functionality into separate files 
var form = document.getElementById("form");
var title = document.getElementById("title");
var description = document.getElementById("description");


function minValid(item, min) {
  var length = item.value.length;

  if (length < min) {
    item.classList.add('is-invalid');
    item.classList.remove('is-valid');
  }
}

function maxValid(item, max) {
  var length = item.value.length;
  
  if (length > max) {
    item.classList.add('is-invalid')
    item.classList.remove('is-valid')
  } else {
    item.classList.remove('is-invalid')
    item.classList.add('is-valid')

  }
}

// TODO: Move 60, 3, 240 and 24 into constants
// TODO: Move handlers into separate functions
title.addEventListener('keyup', function() {
  maxValid(this, 60);
})

title.addEventListener('blur', function() {
  minValid(this, 3);
  showSubmit()
})

description.addEventListener('keyup', function() {
  maxValid(this, 240);
})

description.addEventListener('blur', function() {
  minValid(this, 24);
  showSubmit()
  
})


// TODO: Move all globals to the top or for specific module/script scope
var dataArr = [];
var btnSubmit = document.querySelector('.btn-submit');
var btnEdit = document.querySelector('.btn-edit');

btnSubmit.addEventListener('click', function(e) {
  e.preventDefault()
  
  // TODO: Simplify if condition, move each check into variable
  // Move title.classList.contains('is-valid') and description.classList.contains('is-valid') checks into separate functions and reuse
  if (title.classList.contains('is-valid') && description.classList.contains('is-valid')) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        dateUpdated: '',
        dateCreated: date()
      })
    }).then(render)

    title.value = '';
    description.value = '';
    title.classList.remove('is-valid');
    description.classList.remove('is-valid');
    btnSubmit.classList.add('hidden');
  }
})

function showSubmit() {
  if (title.classList.contains('is-valid') && description.classList.contains('is-valid')) {
    btnSubmit.classList.remove('hidden')
  } else  {
    btnSubmit.classList.add('hidden')
  }
}

function removeFunc() {
  var id = this.parentElement.parentElement.id

  fetch(url + '/' + id, {
    method: 'DELETE'
  })
    .then(render)
}
// TODO: Move to global variables level
var idEditPost

// TODO: Remove Func postfix. We could use different conventions for handlers. For instance. handle***. Ex. handleEdit, handleAdd and handleRemove
function editFunc() {
  var parent = this.parentElement.parentElement;
  idEditPost = parent.id;

  var titleValue = parent.querySelector('.post-item__title').textContent;
  var descValue = parent.querySelector('.post-item__desc').textContent;

  title.value = titleValue;
  description.value = descValue;
  btnEdit.classList.remove('hidden');
  form.classList.add('edited');
}


// TODO: Move into feature function
// TODO: Move handler into separate function for consistency
btnEdit.addEventListener('click', function (e) {
  e.preventDefault()
  
  fetch(url + '/' + idEditPost, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      dateUpdated: date(),
    })
  })
    .then(render)

  title.value = '';
  description.value = '';
  form.classList.remove('edited');
  btnEdit.classList.add('hidden');
})
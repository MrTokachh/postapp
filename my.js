var postList = document.querySelector('.post-list__body');
var url = 'http://localhost:5005/posts';

var date = new Date;
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var hour = date.getHours();
var minutes = date.getMinutes();
var curentDate = day + '.' + month + '.' + year + ' ' + hour + ':' + minutes


function renderPosts(posts) {
  posts.forEach(function(post) {
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
    postCreated.textContent = post.dateCreated
    postLeft.append(postCreated);

    var postUpdated = document.createElement('time');
    postUpdated.classList.add('post-item__updated');
    postUpdated.textContent = post.dateUpdated
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
    postRemove.addEventListener('click', removeFunc)
    postRight.append(postRemove);

    postList.append(postItem);
  })
}

fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(data) {

    renderPosts(data)
  })



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

var dataArr = [];
var btnSubmit = document.querySelector('.btn-submit');
var btnEdit = document.querySelector('.btn-edit');

btnSubmit.addEventListener('click', function(e) {
  e.preventDefault()
  
  if (title.classList.contains('is-valid') && description.classList.contains('is-valid')) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: '',
        title: title.value,
        description: description.value,
        dateUpdated: '',
        dateCreated: ''
      })
    })
      .then(function(res) {
        return res.json()
      })
      .then(function(data) {
        var dataArr = []
        dataArr.push(data)
        renderPosts(dataArr)
      })

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
    .then(function(res) {
      return res.json()
    })
    .then(function() {
      return location.reload()
    })
}

var idEditPost

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



btnEdit.addEventListener('click', function (e) {
  e.preventDefault()
  
  fetch(url + '/' + idEditPost, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      id: '',
      title: title.value,
      description: description.value,
      dateUpdated: '',
      dateCreated: ''
    })
  })
    .then(function(res) {
      return res.json()
    })
    .then(function() {
      return location.reload()
    })

  form.classList.remove('edited');
})
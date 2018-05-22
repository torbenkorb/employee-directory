(function() {
    'use strict';

    var directoryWrapper = document.querySelector('.directory');
    var dialogWrapper = document.querySelector('.dialog');
    var dialogPaneEl = document.querySelector('.dialog__pane');
    var dialogControlsEl = document.querySelector('.dialog__controls');
    var searchField = document.querySelector('.search');
    var users = [];
    var filteredUsers = [];
    var currentUserIndex = 0;

    getJSON('https://randomuser.me/api/?nat=us&results=12')
    .then(data => {
        users = data.results;
        renderDirectory(users);
    });

    function getJSON(url) {
        return fetch(url)
        .then(res => {
            if(res.ok) return res.json();
        })
        .catch(err => console.log(err));
    }

    function renderDirectory(userList) {
        directoryWrapper.innerHTML = '';
        var listWrapper = document.createElement('ul');

        userList.forEach((user, index) => {
            var listEl = document.createElement('li');
            var cardEl = createUser(user);

            cardEl.classList.add('card');

            cardEl.onclick = function() {
                dialogWrapper.classList.add('active');
                renderPane(user);
                currentUserIndex = index;
            };

            listEl.appendChild(cardEl);
            listWrapper.appendChild(listEl);
        });
        directoryWrapper.appendChild(listWrapper);
    }

    function renderPane(user) {
        var addressEl = document.createElement('div');
        var closeEl = document.createElement('div');
        var userBasics = createUser(user);
        var userAdditional = createAdditionalInfo(user);

        addressEl.appendChild(userAdditional);

        dialogPaneEl.innerHTML = '';
        closeEl.innerHTML = '&times;';
        closeEl.classList.add('dialog__close');
        userBasics.classList.add('dialog__header');
        dialogPaneEl.appendChild(userBasics);
        dialogPaneEl.appendChild(addressEl);
        dialogPaneEl.appendChild(closeEl);
    }

    function createUser(user) {
        var wrapperEl = document.createElement('div');
        var username = toTitleCase(`${user.name.first} ${user.name.last}`);
        var city = toTitleCase(`${user.location.city}`);
        var userImageEl = document.createElement('img');
        var userInfoEl = document.createElement('div');
        var usernameEl = document.createElement('div');
        var usermailEl = document.createElement('div');
        var userlocationEl = document.createElement('div');

        userImageEl.classList.add('user__avatar');
        userInfoEl.classList.add('user__info');
        usernameEl.classList.add('user__name');
        usermailEl.classList.add('user__mail');

        userImageEl.src = user.picture.large;
        userImageEl.alt = username;

        usernameEl.textContent = username;
        usermailEl.textContent = user.email;
        userlocationEl.textContent = city;

        userInfoEl.appendChild(usernameEl);
        userInfoEl.appendChild(usermailEl);
        userInfoEl.appendChild(userlocationEl);

        wrapperEl.appendChild(userImageEl);
        wrapperEl.appendChild(userInfoEl);
        return wrapperEl;
    }

    function createAdditionalInfo(user) {
        var re = /\d{4}-?\d{2}-\d{2}/;
        var phone = user.phone;
        var address = toTitleCase(`${user.location.street}, ${user.location.state} ${user.location.postcode}`);
        var birthday = user.dob.match(re)[0];
        birthday = birthday.replace(/-/g, '/');
        var year = birthday.slice(0,4);
        var date = birthday.slice(5,10);
        birthday = `${date}/${year}`;

        var fragment = document.createDocumentFragment();
        var phoneEl = document.createElement('div');
        var addressEl = document.createElement('div');
        var dobEl = document.createElement('div');

        phoneEl.textContent = phone;
        addressEl.textContent = address;
        dobEl.textContent = `Birthday: ${birthday}`;
        fragment.appendChild(phoneEl);
        fragment.appendChild(addressEl);
        fragment.appendChild(dobEl);
        return fragment;
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    dialogWrapper.addEventListener('click', function(e) {
        if(e.target === e.currentTarget || e.target.classList.contains('dialog__close')) {
            dialogWrapper.classList.remove('active');
        }
    });

    searchField.addEventListener('input', function(e) {
        var searchTerm = e.target.value.toLowerCase();
        filteredUsers = users.filter(user => user.name.first.indexOf(searchTerm) !== -1
                                            || user.name.last.indexOf(searchTerm) !== -1
                                            || user.login.username.indexOf(searchTerm) !== -1
                                            || (user.name.first + ' ' + user.name.last).indexOf(searchTerm) !== -1);
        renderDirectory(filteredUsers);
    });

    dialogControlsEl.addEventListener('click', function(e) {
        if(e.target.classList.contains('dialog__next')) {
            currentUserIndex++;
            if(currentUserIndex > users.length -1) currentUserIndex = 0;
            renderPane(users[currentUserIndex]);
        } else if(e.target.classList.contains('dialog__prev')) {
            currentUserIndex--;
            if(currentUserIndex < 0) currentUserIndex = users.length-1;
            renderPane(users[currentUserIndex]);
        }
    });

})();

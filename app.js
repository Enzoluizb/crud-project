let users = JSON.parse(localStorage.getItem('users')) || [];
let clients = JSON.parse(localStorage.getItem('clients')) || [];

function toggleForms() {
    document.getElementById('login-form').style.display =
        document.getElementById('login-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('register-form').style.display =
        document.getElementById('register-form').style.display === 'none' ? 'block' : 'none';
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (users.some(user => user.email === email)) {
        alert('Usuário já registrado');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário registrado com sucesso');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        const token = btoa(`${email}:${password}`);
        localStorage.setItem('token', token);
        alert('Login realizado com sucesso');
        window.location.href = 'dashboard.html';
    } else {
        alert('Email ou senha incorretos');
    }
}

function checkLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }

    const [email] = atob(token).split(':');
    document.getElementById('user-info').innerText = `Logado como: ${email}`;
    
    loadClients();
}

document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;

    clients.push({ name, email });
    localStorage.setItem('clients', JSON.stringify(clients));
    document.getElementById('client-form').reset();
    loadClients();
});

function loadClients() {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = '';

    clients.forEach((client, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${client.name} - ${client.email} 
            <button class="edit-button" onclick="editClient(${index})">Editar</button> 
            <button class="delete-button" onclick="deleteClient(${index})">Excluir</button>`;
        clientList.appendChild(li);
    });
}

function editClient(index) {
    const newName = prompt("Digite o novo nome do cliente:", clients[index].name);
    const newEmail = prompt("Digite o novo email do cliente:", clients[index].email);

    if (newName !== null && newEmail !== null) {
        clients[index].name = newName;
        clients[index].email = newEmail;
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }
}

function deleteClient(index) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        clients.splice(index, 1);
        localStorage.setItem('clients', JSON.stringify(clients));
        loadClients();
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

window.onload = function () {
    if (window.location.pathname === '/dashboard.html') {
        checkLogin();
    }
};

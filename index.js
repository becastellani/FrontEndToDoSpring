// Função para buscar todos os ToDos
// Função para buscar todos os ToDos
async function fetchTodos() {
    const response = await fetch('http://localhost:8080/todo');
    const todos = await response.json();
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        let buttonsHtml = '';
        if (todo.status) {
            buttonsHtml += `<button onclick="markAsToDo(${todo.id})">Marcar como A Fazer</button>`;
            li.classList.add('completed');
        } else {
            buttonsHtml += `<button class="complete-btn" onclick="completeTodo(${todo.id})">Concluir</button>`;
            li.classList.add('todo'); // Adiciona a classe 'todo' ao <li> se a tarefa estiver a fazer
        }
        buttonsHtml += `<button class="markbutton" onclick="editTodo(${todo.id})">Editar</button> <button onclick="deleteTodo(${todo.id})">Delete</button>`;
        li.innerHTML = `${todo.description} ${buttonsHtml}`;
        todoList.appendChild(li);
    });
}


// Função para adicionar novo ToDo
async function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const description = todoInput.value.trim();
    if (description !== '') {
        const response = await fetch('http://localhost:8080/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
        if (response.ok) {
            todoInput.value = '';
            fetchTodos();
        }
    }
}

// Função para deletar ToDo
async function deleteTodo(id) {
    const response = await fetch(`http://localhost:8080/todo/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        fetchTodos();
    }
}

async function editTodo(id) {
    const newDescription = prompt("Editar Tarefa:", "");
    if (newDescription !== null && newDescription.trim() !== "") {
        const updatedTodo = {
            description: newDescription.trim(),
            status: false // Você pode adicionar a lógica para definir o status aqui, se necessário
        };
        const response = await fetch(`http://localhost:8080/todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        });
        if (response.ok) {
            fetchTodos();
        } else {
            alert("Falha ao atualizar a tarefa.");
        }
    }
}

async function completeTodo(id) {
    const updatedTodo = {
        status: true
    };
    const response = await fetch(`http://localhost:8080/todo/${id}/complete`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    });
    if (response.ok) {
        fetchTodos();
    } else {
        alert("Falha ao marcar a tarefa como concluída.");
    }
}

async function markAsToDo(id) {
    const updatedTodo = {
        status: false
    };
    const response = await fetch(`http://localhost:8080/todo/${id}/todo`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    });
    if (response.ok) {
        fetchTodos();
    } else {
        alert("Falha ao marcar a tarefa como A Fazer.");
    }
}


// Ao enviar o formulário, chama a função addTodo
document.getElementById('todoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTodo();
});

// Busca os ToDos ao carregar a página
fetchTodos();
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'


const api = axios.create({
	baseURL: 'http://localhost:8080'
});

const todos = ref([])
const name = ref('')

const input_content = ref('')
const input_category = ref(null)


const todos_asc = computed(() => todos.value.sort((a,b) =>{
	
	return new Date(b.createdAt) - new Date(a.createdAt)
}))


watch(name, (newVal) => {
	localStorage.setItem('name', newVal)
})

const addTodo = async () => {
	if (input_content.value.trim() === '' || input_category.value === null) {
		return
	}

	try {
		
		const response = await api.post('/cadastrar', {
			content: input_content.value,
			category: input_category.value,
			done: false
		});

		
		todos.value.unshift(response.data.task);

		
		input_content.value = '';
		input_category.value = null;
	} catch (error) {
		console.error("Erro ao adicionar tarefa:", error);
	}
}

const updateTodo = async (todo) => {
	try {
		await api.put(`/atualizar/${todo.id}`, {
			content: todo.content,
			done: todo.done
		});
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
	}
}

const removeTodo = async (todo) => {
	try {
		
		await api.delete(`/deletar/${todo.id}`);
	
		todos.value = todos.value.filter((t) => t.id !== todo.id);
	} catch (error) {
		console.error("Erro ao remover tarefa:", error);
	}
}

onMounted(async () => {
	name.value = localStorage.getItem('name') || ''
	
	const response = await api.get('/tasks');
	todos.value = response.data.tasks;
})

watch(todos, (newVal) => {
  
}, { deep: true })
</script>

<template>
	<main class="app">
		
		<section class="greeting">
			<h2 class="title">
				What's up, <input type="text" id="name" placeholder="Name here" v-model="name">
			</h2>
		</section>

		<section class="create-todo">
			<h3>CREATE A TO-DO</h3>

			<form id="new-todo-form" @submit.prevent="addTodo">
				<h4>What's on your to-do list?</h4>
				<input 
					type="text" 
					name="content" 
					id="content" 
					placeholder="add. list"
					v-model="input_content" />
				
				<h4>Pick a category</h4>
				<div class="options">

					<label>
						<input 
							type="radio" 
							name="category" 
							id="category1" 
							value="business"
							v-model="input_category" />
						<span class="bubble business"></span>
						<div>Business</div>
					</label>

					<label>
						<input 
							type="radio" 
							name="category" 
							id="category2" 
							value="personal"
							v-model="input_category" />
						<span class="bubble personal"></span>
						<div>Personal</div>
					</label>

				</div>

				<input type="submit" value="Add to-do" />
			</form>
		</section>

		<section class="todo-list">
			<h3>TO-DO LIST</h3>
			<div class="list" id="todo-list">

				<div v-for="todo in todos_asc" :key="todo.id" :class="`todo-item ${todo.done && 'done'}`">
					<label>
						<input type="checkbox" v-model="todo.done" @change="updateTodo(todo)" />
						<span :class="`bubble ${
							todo.category == 'business' 
								? 'business' 
								: 'personal'
						}`"></span>
					</label>

					<div class="todo-content">
						<input type="text" v-model="todo.content" @change="updateTodo(todo)" />
					</div>

					<div class="actions">
						<button class="delete" @click="removeTodo(todo)">Delete</button>
					</div>
				</div>

			</div>
		</section>

	</main>
</template>
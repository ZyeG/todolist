// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'client';
// }

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: string;
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, FormsModule], 
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodo = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<Todo[]>('/api/items').subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    if (!this.newTodo.trim()) return;
    this.http.post<Todo>('/api/items', { name: this.newTodo }).subscribe((todo) => {
      this.todos.push(todo);
      this.newTodo = '';
    });
  }

  toggleComplete(todo: Todo) {
    this.http.put(`/api/items/${todo.id}`, {
      completed: !todo.completed,
    }).subscribe(() => {
      todo.completed = !todo.completed;
    });
  }

  deleteTodo(todo: Todo) {
    this.http.delete(`/api/items/${todo.id}`).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== todo.id);
    });
  }
}

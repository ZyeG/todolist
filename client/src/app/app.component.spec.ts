import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ Standalone components go in `imports`
      imports: [
        AppComponent,
        HttpClientTestingModule,
        FormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 🔒 ensures no stray HTTP requests
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // 
  it('should load todos on init', () => {
    const mockTodos = [
      { id: '1', name: 'Task 1', completed: false },
      { id: '2', name: 'Task 2', completed: true },
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);

    expect(component.todos).toEqual(mockTodos);
  });

  it('should add a new todo and clear input', () => {
    component.newTodo = 'New Task';

    const newTodo = { id: '123', name: 'New Task', completed: false };
    component.addTodo();

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'New Task' });

    req.flush(newTodo);
    expect(component.todos).toContain(newTodo);
    expect(component.newTodo).toBe('');
  });

  it('should toggle todo completion', () => {
    const todo = { id: '1', name: 'Task', completed: false };
    component.todos = [todo];

    component.toggleComplete(todo);

    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ completed: true });

    req.flush({});
    expect(todo.completed).toBe(true);
  });

  it('should delete a todo', () => {
    const todo = { id: '1', name: 'Task', completed: false };
    component.todos = [todo];

    component.deleteTodo(todo);

    const req = httpMock.expectOne('/api/items/1');
    expect(req.request.method).toBe('DELETE');

    req.flush({});
    expect(component.todos).not.toContain(todo);
  });
});


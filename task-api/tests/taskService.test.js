const service = require("../src/services/taskService.js");

beforeEach(() => {
    service._reset();
});

test('should create a task with default values', () => {
    const task = service.create({ title: 'task1' });

    expect(task).toHaveProperty('id');
    expect(task.title).toBe('task1');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
});

test('should allow empty description', () => {
    const task = service.create({ title: 'task1', description: '' });

    expect(task.description).toBe('');
});

test('should accept custom status and priority', () => {
    const task = service.create({
        title: 'Task',
        status: 'done',
        priority: 'high'
    });

    expect(task.status).toBe('done');
    expect(task.priority).toBe('high');
});

test('should return all tasks', () => {
    service.create({title:'task1'});
    service.create({title:'task2'});

    const tasks = service.getAll();
    expect(tasks.length).toBe(2);
});

test('should find task by id', () => {
    const task = service.create({title: 'task1'});

    const found = service.findById(task.id);
    expect(found.id).toBe(task.id);
});

test('should return undefined for invalid id', () => {
    const result = service.findById('invalid');

    expect(result).toBeUndefined();
});

test('should update task fields', () => {
    const task = service.create({title: 'task1', priority: 'low'});
    const updated = service.update(task.id, {priority: 'high'});

    expect(updated.priority).toBe('high');
});

test('should return null if invalid id is to be updated', () => {
    const result = service.update("wrong id", {title: 'task1'});

    expect(result).toBeNull();
});

test('should delete the task', () => {
    const task = service.create({title: 'task1'});
    const remove = service.remove(task.id);

    expect(task).toBe(true);
    expect(service.getAll().length).toBe(0);

});

test('should return null if invalid id is to be deleted', () => {
    const result = service.remove("wrond id", {title: 'task1'});

    expect(result).toBeNull();
});

test('should complete the task', () => {
    const task = service.create({title: 'task1'});
    const complete = service.completeTask(task.id);

    expect(complete.status).toBe("done");
    expect(complete.completedAt).not.toBeNull();
});

test('should return null if invalid id is to be completed', () => {
    const result = service.completeTask("wrong id");

    expect(result).toBeNull();
});

test('should filter tasks by status', () => {
    service.create({title: 'task1', status:'todo'});
    service.create({title: 'task2', status:'done'});

    const result = service.getByStatus('done');
    expect(result.length).toBe(1);
});

test('should return null if no matched status', () => {
    const result = service.getByStatus('done');
    expect(result.length).toBe(0);
});

test('should return paginated result', () => {
    for(let i=0; i<5; i++) {
        service.create({title: `task ${i}`}); 
    }

    const page = service.getPaginated(0, 2);
    expect(page.length).toBe(2);
    expect(page[0]).toBe("task 0");
});

test('should return empty if page out of range', () => {
  const result = service.getPaginated(10, 2);
  expect(result.length).toBe(0);
});

test('should return correct stats', () => {
  service.create({ title: 'A', status: 'todo' });
  service.create({ title: 'B', status: 'done' });

  const stats = service.getStats();

  expect(stats.todo).toBe(1);
  expect(stats.done).toBe(1);
});

test('should count overdue tasks', () => {
  service.create({
    title: 'A',
    dueDate: '2000-01-01',
    status: 'todo'
  });

  const stats = service.getStats();
  expect(stats.overdue).toBe(1);
});


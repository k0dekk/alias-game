import { BiDirectionalPriorityQueue } from './BiDirectionalPriorityQueue.js';

console.log("Task 4: Implementing a Bi-Directional Priority Queue");

const queue = new BiDirectionalPriorityQueue();

queue.enqueue("Математика", 2);          // oldest
queue.enqueue("Собака", 1);             // lowest
queue.enqueue("Трансформатор", 3);     // highest 
queue.enqueue("Стіл", 1);             // newest

console.log("\npeek:\n");

console.log("Найвищий пріоритет:", queue.peek("highest"));   // "Трансформатор"
console.log("Найнижчий пріоритет:", queue.peek("lowest"));   // "Собака"
console.log("Додано найраніше:", queue.peek("oldest"));      // "Математика"
console.log("Додано найпізніше:", queue.peek("newest"));     // "Стіл"

console.log("\ndequeue:\n");

console.log("Прибрано найскладніше слово:", queue.dequeue("highest")); 
console.log("Найвищий пріоритет після видалення:", queue.peek("highest"));

console.log("\nisEmpty:\n");

console.log("isEmpty?", queue.isEmpty()); // false
console.log(`Видалено всі слова (${queue.dequeue("lowest")}, ${queue.dequeue("highest")}, ${queue.dequeue("newest")})`);
console.log("isEmpty?", queue.isEmpty()); // true
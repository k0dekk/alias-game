export class BiDirectionalPriorityQueue {
  constructor() {
    this.items = [];
    this.counter = 0;
  }

  enqueue(item, priority) {
    this.items.push({
      data: item,
      priority: priority,
      age: this.counter++
    });
  }

  _getTargetIndex(type) {
    if (this.items.length === 0) return -1;
    let targetIdx = 0;

    for (let i = 1; i < this.items.length; i++) {
      const current = this.items[i];
      const target = this.items[targetIdx];

      switch (type) {
        case 'highest': if (current.priority > target.priority) targetIdx = i; break;
        case 'lowest':  if (current.priority < target.priority) targetIdx = i; break;
        case 'oldest':  if (current.age < target.age) targetIdx = i; break;
        case 'newest':  if (current.age > target.age) targetIdx = i; break;
      }
    }
    return targetIdx;
  }

  peek(type) {
    const idx = this._getTargetIndex(type);
    return idx !== -1 ? this.items[idx].data : null;
  }

  dequeue(type) {
    const idx = this._getTargetIndex(type);
    if (idx === -1) return null;
    return this.items.splice(idx, 1)[0].data;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
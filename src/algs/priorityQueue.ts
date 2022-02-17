import type { CompareFn } from './types';

export class PriorityQueue<T> {
  private heap: T[];
  private compare: CompareFn<T>;

  constructor(compare: CompareFn<T>) {
    this.compare = compare;
    this.heap = [null as unknown as T];
  }

  private swap(a: number, b: number) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  private down(u: number) {
    const { heap, compare } = this;

    let t = u;
    if (u * 2 <= this.size && compare(heap[u * 2], heap[t]) < 0) {
      t = u * 2;
    }
    if (u * 2 + 1 <= this.size && compare(heap[u * 2 + 1], heap[t]) < 0) {
      t = u * 2 + 1;
    }
    if (u !== t) {
      this.swap(u, t);
      this.down(t);
    }
  }

  private up(u: number) {
    const { heap, compare } = this;

    while (
      Math.floor(u / 2) > 0 &&
      compare(heap[u], heap[Math.floor(u / 2)]) < 0
    ) {
      this.swap(u, Math.floor(u / 2));
      u = Math.floor(u / 2);
    }
  }

  public get size() {
    return this.heap.length - 1;
  }

  public push(item: T) {
    const { heap } = this;

    heap.push(item);
    this.up(this.size);
  }

  public front() {
    return this.heap[1];
  }

  public pop() {
    const { heap } = this;

    const res = this.front();
    if (res !== undefined) {
      heap[1] = heap.pop() as T;
      this.down(1);
    }

    return res;
  }

  public isEmpty() {
    return this.size === 0;
  }
}

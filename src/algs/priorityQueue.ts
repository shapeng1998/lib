import { CompareFn } from './types';

class PriorityQueue<T = unknown> {
  private _heap: T[];
  private _compare: CompareFn<T>;

  constructor(compare: CompareFn<T>) {
    this._heap = [null as unknown as T];
    this._compare = compare;
  }

  private _swap(a: number, b: number) {
    const { _heap } = this;

    [_heap[a], _heap[b]] = [_heap[b], _heap[a]];
  }

  private _down(u: number) {
    const { _heap, _compare } = this;

    let t = u;
    if (u * 2 <= this.size && _compare(_heap[u * 2], _heap[t]) < 0) {
      t = u * 2;
    }
    if (u * 2 + 1 <= this.size && _compare(_heap[u * 2 + 1], _heap[t]) < 0) {
      t = u * 2 + 1;
    }

    if (t !== u) {
      this._swap(t, u);
      this._down(t);
    }
  }

  private _up(u: number) {
    const { _heap, _compare } = this;

    while (u >> 1 > 0 && _compare(_heap[u], _heap[u >> 1]) < 0) {
      this._swap(u, u >> 1);
      u >>= 1;
    }
  }

  public get size() {
    return this._heap.length - 1;
  }

  public isEmpty() {
    return this.size === 0;
  }

  public front() {
    if (this.isEmpty()) {
      return null;
    }

    return this._heap[1];
  }

  public pop() {
    const { _heap } = this;

    const res = this.front();
    if (res !== null) {
      _heap[1] = _heap[this.size];
      _heap.pop();
      this._down(1);
    }

    return res;
  }

  public push(item: T) {
    const { _heap } = this;

    _heap.push(item);
    this._up(this.size);
  }
}

export { PriorityQueue };

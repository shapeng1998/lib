class EventEmitter<T extends (...args: any[]) => any> {
  #event: Record<string, T[]> = {};
  #onceEvent: Record<string, T[]> = {};

  on(evt: string, fn: T) {
    if (!evt || !fn) {
      return false;
    }

    this.#event[evt] = this.#event[evt] ?? [];
    this.#event[evt].push(fn);
  }

  once(evt: string, fn: T) {
    if (!evt || !fn) {
      return false;
    }

    this.#onceEvent[evt] = this.#onceEvent[evt] ?? [];
    this.#onceEvent[evt].push(fn);
  }

  off(evt: string, fn: T) {
    if (!evt || !fn) {
      return false;
    }

    if (this.#event[evt]) {
      this.#event[evt] = this.#event[evt].filter((f) => f !== fn);
    }

    if (this.#onceEvent[evt]) {
      this.#onceEvent[evt] = this.#onceEvent[evt].filter((f) => f !== fn);
    }
  }

  emit(evt: string, ...args: any[]) {
    if (!evt) {
      return false;
    }

    this.#event[evt] && this.#event[evt].forEach((fn) => fn(...args));
    this.#onceEvent[evt] && this.#onceEvent[evt].forEach((fn) => fn(...args));

    delete this.#onceEvent[evt];
  }
}

export { EventEmitter };

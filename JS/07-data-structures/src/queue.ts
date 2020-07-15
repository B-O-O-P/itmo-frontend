type Optional<T> = T | undefined;

class Node<T> {
  constructor(public value: Optional<T> = undefined, public next: Optional<Node<T>> = undefined) {}
}

export class Queue<T> {
  private head: Optional<Node<T>>;
  private tail: Optional<Node<T>>;
  private _size = 0;

  constructor() {
    const dummyNode = new Node<T>();
    this.head = dummyNode;
    this.tail = dummyNode;
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }

    let res = this.head;
    let counter = this!.size - 1;

    while (counter-- !== index) {
      res = res!.next;
    }

    return res!.value;
  }

  enqueue(element: T): void | undefined {
    const newNode = new Node(element);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      this._size = 0;
    } else {
      this.tail!.next = newNode;
      this.tail = this.tail!.next;
    }
    this._size++;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const res = this.head!.value;
    this.head = this.head!.next;
    this._size--;

    return res;
  }

  get size(): number {
    return this._size;
  }

  private isEmpty(): boolean | undefined {
    return this.size === 0;
  }
}

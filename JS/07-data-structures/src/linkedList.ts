type Optional<T> = T | undefined;

class Node<T> {
  constructor(
    public value: Optional<T> = undefined,
    public next: Optional<Node<T>> = undefined,
    public prev: Optional<Node<T>> = undefined
  ) {}
}

export class LinkedList<T> {
  private head: Node<T>;
  private tail: Node<T>;
  private _size = 0;

  constructor() {
    const dummyNode = new Node<T>();
    this.head = dummyNode;
    this.tail = dummyNode;
  }

  get(index: number): Optional<T> {
    if (index < 0 || index >= this.size) {
      return undefined;
    }

    let counter = 0;
    let res: Optional<Node<T>> = this.head;

    while (counter++ !== index) {
      res = res!.next;
    }

    return res!.value;
  }

  push(element: T): Optional<void> {
    if (this.isEmpty()) {
      const newNode = new Node<T>(element);
      this.head = newNode;
      this.tail = newNode;
      this._size = 0;
    } else {
      this.tail.next = new Node(element);
      this.tail.next.prev = this.tail;
      this.tail = this.tail.next;
    }
    this._size++;
  }

  unshift(element: T): Optional<void> {
    if (this.isEmpty()) {
      const newNode = new Node<T>(element);
      this.head = newNode;
      this.tail = newNode;
      this._size = 0;
    } else {
      this.head.prev = new Node(element);
      this.head.prev.next = this.head;
      this.head = this.head.prev;
    }
    this._size++;
  }

  pop(): Optional<T> {
    if (this.isEmpty()) {
      return undefined;
    }

    const res = this.tail.value;
    if (this.tail.prev) {
      this.tail = this.tail.prev;
    }
    this._size--;

    return res;
  }

  shift(): Optional<T> {
    if (this.isEmpty()) {
      return undefined;
    }

    const res = this.head.value;
    if (this.head.next) {
      this.head = this.head.next;
    }
    this._size--;

    return res;
  }

  get size(): number {
    return this._size;
  }

  private isEmpty(): Optional<boolean> {
    return this.size === 0;
  }
}

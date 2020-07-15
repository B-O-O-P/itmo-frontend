type Optional<T> = T | undefined;

enum Priority {
  Low = 1,
  Medium = 2,
  High = 3
}

class Node<T> {
  constructor(
    public value: Optional<T> = undefined,
    public priority: Priority = Priority.Low,
    public next: Optional<Node<T>> = undefined
  ) {}
}

export class PriorityQueue<T> {
  private head: Optional<Node<T>>;
  private tail: Optional<Node<T>>;
  private _size: number;

  constructor() {
    const dummyNode = new Node<T>();
    this.head = dummyNode;
    this.tail = dummyNode;
    this._size = 0;
  }

  enqueue(element: T, priority: Priority): void | undefined {
    const newNode = new Node(element, priority);
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

    const res = this.prev();
    const isNotPrev = res === this.head && res!.priority >= (res!.next?.priority || 0);
    let resValue: Optional<T>;

    if (isNotPrev) {
      this.head = this.head!.next;
      resValue = res!.value;
    } else {
      if (res!.next === this.tail) {
        this.tail = res;
      }

      resValue = res!.next!.value;
      res!.next = res!.next!.next;
    }

    this._size--;

    return resValue;
  }

  get size(): number | undefined {
    return this._size;
  }

  private prev(): Node<T> | undefined {
    let curNode = this.head;
    let prevNode: Optional<Node<T>>;
    let mediumNode: Optional<Node<T>>;
    let lowNode: Optional<Node<T>>;

    if (curNode === undefined) {
      return undefined;
    }
    do {
      if (curNode.priority === Priority.High) {
        return prevNode || curNode;
      }

      if (!mediumNode && curNode.priority === Priority.Medium) {
        mediumNode = prevNode || curNode;
      } else if (!lowNode && curNode.priority === Priority.Low) {
        lowNode = prevNode || curNode;
      }

      prevNode = curNode;
    } while ((curNode = curNode.next));

    return mediumNode ? mediumNode : lowNode;
  }

  private isEmpty(): boolean | undefined {
    return this.size === 0;
  }
}

type Optional<T> = T | undefined;

class Node<T> {
  constructor(public value: Optional<T> = undefined, public next: Optional<Node<T>> = undefined) {}
}

export class RingBuffer<T> {
  private head: Optional<Node<T>>;
  private tail: Optional<Node<T>>;
  private _size = 0;

  constructor(private readonly _capacity: number) {
    const dummyNode = new Node<T>();
    this.head = dummyNode;
    this.tail = dummyNode;
    this._size = 0;
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) {
      return undefined;
    }

    let counter = 0;
    let res = this.head;

    while (counter++ !== index) {
      res = res!.next;
    }

    return res!.value;
  }

  push(element: T): void | undefined {
    const newNode = new Node<T>(element);

    if (this.isFull()) {
      if (this.shift() === undefined) {
        return;
      }
      this.push(element);
      this._size--;
    } else if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      this._size = 0;
    } else {
      this.tail!.next = newNode;
      this.tail = this.tail!.next;
    }
    this._size++;
  }

  shift(): T | undefined {
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

  get capacity(): number {
    return this._capacity;
  }

  static concat(...buffers: RingBuffer<any>[]): RingBuffer<any> | undefined {
    const newBuffer = new RingBuffer(
      buffers.reduce(
        (sumCap, buffer) => (buffer.capacity !== undefined ? sumCap + buffer.capacity : sumCap),
        0
      )
    );

    buffers.forEach(buffer => {
      if (buffer.size !== undefined) {
        for (let i = 0; i < buffer.size; i++) {
          newBuffer.push(buffer.get(i));
        }
      }
    });

    return newBuffer;
  }

  private isFull(): boolean | undefined {
    return this.size === this.capacity;
  }

  private isEmpty(): boolean | undefined {
    return this.size === 0;
  }
}

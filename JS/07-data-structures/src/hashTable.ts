type Optional<T> = T | undefined;

export class HashTable<T> {
  private static CAPACITY = 100;
  private static HASH_INIT_PRIME = 1009;
  private static HASH_PRIME = 17;
  private static HASH_MOD = 1000000001;

  private table: [string | object, T][][] = [];
  private _size = 0;

  constructor() {
    this.table = [];
    this._size = 0;
  }

  public get size(): number {
    return this._size;
  }

  public get(key: string | object): Optional<T> {
    const hash = HashTable.hash(key) % this.table.length;
    const keyValue = this.table[hash].find(element => element[0] === key);

    return keyValue ? keyValue[1] : undefined;
  }

  public put(key: string | object, element: T): Optional<void> {
    ++this._size;
    const hash = HashTable.hash(key) % this.table.length;
    if (this.table[hash] === undefined) {
      this.table[hash] = new Array<[string | object, T]>();
    }

    this.table[hash].push([key, element]);
  }

  public clear(): void {
    this.table = new Array<Array<[string | object, T]>>(HashTable.CAPACITY);
    this._size = 0;
  }

  private static hash(object: string | object): number {
    const str = typeof object === 'string' ? object : JSON.stringify(object);
    let hash = HashTable.HASH_INIT_PRIME;

    str
      .split('')
      .forEach(
        character =>
          (hash = (hash * this.HASH_PRIME + character.charCodeAt(0)) % HashTable.HASH_MOD)
      );

    return hash;
  }
}

import { v4 as uuidv4 } from 'uuid';

class $Node {
    data: unknown;
    next: $Node | null;
    previous: $Node | null;

    constructor(data: unknown) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
    setNextNode(node:$Node | null): void {
        if (node instanceof $Node || node === null) {
            this.next = node;
        } else {
            throw new Error('You have to set a Node instance.');
        }
    }
    getNextNode(): $Node | null {
        return this.next;
    }
    setPreviousNode(node:$Node | null): void {
        if (node instanceof $Node || node === null) {
            this.previous = node;
        } else {
            throw new Error('You have to set a Node instance.');
        }
    }
    getPreviousNode(): $Node | null {
        return this.previous;
    }
    setNewData(data: unknown) {
        return this.data = data;
    }
    getData() {
        return this.data;
    }
}
class Doubly {
    head: $Node | null;
    tail: $Node | null;

    constructor() {
        this.head = null;
        this.tail = null;
    }
    addToHead(data: unknown) {
        let currentHead = this.head;
        const newHead = data instanceof Cell ? data : new $Node(data);

        if (!currentHead) {
            currentHead = newHead;
            this.head = currentHead;
            this.tail = currentHead;
            currentHead.setNextNode(null);
            currentHead.setPreviousNode(null);
            return;
        }

        currentHead.setPreviousNode(newHead);
        newHead.setNextNode(currentHead);
        newHead.setPreviousNode(null);
        this.head = newHead;
        return newHead;
    }
    addToTail(data: unknown) {
        let currentTail = this.tail;
        const newTail = data instanceof Cell ? data : new $Node(data);

        if (!this.head) {
            currentTail = newTail;
            this.head = currentTail;
            this.tail = currentTail;
            currentTail.setNextNode(null);
            currentTail.setPreviousNode(null);
            return;
        }

        currentTail?.setNextNode(newTail);
        newTail.setPreviousNode(currentTail);
        newTail.setNextNode(null);
        this.tail = newTail;
        return newTail;
    }
    removeHead() {
        const currentHead = this.head;
        const newHead = currentHead ? currentHead.getNextNode() : null;

        if (!newHead) {
            return;
        }

        newHead.setPreviousNode(null);
        this.head = newHead;
        return currentHead;
    }
    removeTail() {
        const currentTail = this.tail;
        const newTail = currentTail ? currentTail.getPreviousNode() : null;

        if (!newTail) {
            return;
        }

        newTail.setNextNode(null);
        this.tail = newTail;
        return currentTail;
    }
    print() {
        let currentNode = this.head;
        let output = '<head> ';

        while(currentNode !== null) {
            output += `#${currentNode.data} `;
            currentNode = currentNode.getNextNode();
        }
        output += ' <tail>';
        console.log(output);
        return output;
    }
}

class Cell extends $Node {
    readonly id: string;
    column : List;
    row: List;

    constructor(data: unknown, column: List, row: List) {
        super(data);
        this.id = uuidv4();
        this.column = column;
        this.row = row;
    }
    getId() {
        return this.id;
    }
    getColumn() {
        return this.column;
    }
    getRow() {
        return this.row;
    }
    setColumn(newColumn: List) {
        return this.column = newColumn;
    }
    setRow(newRow: List) {
        return this.row = newRow;
    }
    print() {
        console.log(`${this.column ? this.column : 'X'} <- ${this.data} -> ${this.row ? this.row : 'X'}`);
        return;
    }
}
class List extends Doubly {
    readonly id: string;
    name: string;
    size: number;

    constructor(name: string) {
        super();
        this.id = uuidv4();
        this.name = name;
        this.size = 0;
    }
    getId() {
        return this.id;
    }
    getName() { 
        return this.name;
    }
    getSize() {
        return this.size;
    }
    getCells() {
        let cells = [];
        let current = this.head;
        if (!current) {
            return null;
        }

        while (current !== null) {
            if (current instanceof Cell) {
                cells.push(current);
            }
            current = current.getNextNode();
        }

        return cells;
    }
    push(cell: Cell) {
        this.addToTail(cell);
        this.size++;
    }
    pop() {
        if (this.head) {
            const value = this.removeHead();
            this.size--;
            return value;
        }
        return this.head;
    }
    removeById(id: string) {
        let current = this.head;
        if (!current) {
            return null;
        }
        while (current !== null) {
            if (current instanceof Cell) {
                if (current.getId() === id) {
                    const previous = current.getPreviousNode();
                    const next = current.getNextNode();
                    previous?.setNextNode(next);
                    next?.setPreviousNode(previous);
                    console.log(`Cell deleted: ${current.getId()}`);
                    return current;
                }
            }
            current = current.getNextNode();
        }
        console.log('No ID found on List.');
        return null;
    }
}
class Table {
    name: string;
    columns: Array<List>;
    rows: Array<List>;

    constructor(name: string) {
        this.name = name;
        this.columns = [];
        this.rows = [];
    }
    getName() {
        return this.name;
    }
    setName(name: string) {
        return this.name = name;
    }
}
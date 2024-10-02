"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var $Node = /** @class */ (function () {
    function $Node(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
    $Node.prototype.setNextNode = function (node) {
        if (node instanceof $Node || node === null) {
            this.next = node;
        }
        else {
            throw new Error('You have to set a Node instance.');
        }
    };
    $Node.prototype.getNextNode = function () {
        return this.next;
    };
    $Node.prototype.setPreviousNode = function (node) {
        if (node instanceof $Node || node === null) {
            this.previous = node;
        }
        else {
            throw new Error('You have to set a Node instance.');
        }
    };
    $Node.prototype.getPreviousNode = function () {
        return this.previous;
    };
    $Node.prototype.setNewData = function (data) {
        return this.data = data;
    };
    $Node.prototype.getData = function () {
        return this.data;
    };
    return $Node;
}());
var Doubly = /** @class */ (function () {
    function Doubly() {
        this.head = null;
        this.tail = null;
    }
    Doubly.prototype.addToHead = function (data) {
        var currentHead = this.head;
        var newHead = data instanceof Cell ? data : new $Node(data);
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
    };
    Doubly.prototype.addToTail = function (data) {
        var currentTail = this.tail;
        var newTail = data instanceof Cell ? data : new $Node(data);
        if (!this.head) {
            currentTail = newTail;
            this.head = currentTail;
            this.tail = currentTail;
            currentTail.setNextNode(null);
            currentTail.setPreviousNode(null);
            return;
        }
        currentTail === null || currentTail === void 0 ? void 0 : currentTail.setNextNode(newTail);
        newTail.setPreviousNode(currentTail);
        newTail.setNextNode(null);
        this.tail = newTail;
        return newTail;
    };
    Doubly.prototype.removeHead = function () {
        var currentHead = this.head;
        var newHead = currentHead ? currentHead.getNextNode() : null;
        if (!newHead) {
            return;
        }
        newHead.setPreviousNode(null);
        this.head = newHead;
        return currentHead;
    };
    Doubly.prototype.removeTail = function () {
        var currentTail = this.tail;
        var newTail = currentTail ? currentTail.getPreviousNode() : null;
        if (!newTail) {
            return;
        }
        newTail.setNextNode(null);
        this.tail = newTail;
        return currentTail;
    };
    Doubly.prototype.printList = function () {
        var currentNode = this.head;
        var output = '<head> ';
        while (currentNode !== null) {
            output += "#".concat(currentNode.data, " ");
            currentNode = currentNode.getNextNode();
        }
        output += ' <tail>';
        console.log(output);
        return output;
    };
    return Doubly;
}());
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(data, column, row) {
        var _this = _super.call(this, data) || this;
        _this.id = (0, uuid_1.v4)();
        _this.column = column;
        _this.row = row;
        return _this;
    }
    Cell.prototype.getCellId = function () {
        return this.id;
    };
    Cell.prototype.getColumn = function () {
        return this.column;
    };
    Cell.prototype.getRow = function () {
        return this.row;
    };
    Cell.prototype.setColumn = function (newColumn) {
        return this.column = newColumn;
    };
    Cell.prototype.setRow = function (newRow) {
        return this.row = newRow;
    };
    Cell.prototype.print = function () {
        console.log("".concat(this.column ? this.column : 'X', " <- ").concat(this.data, " -> ").concat(this.row ? this.row : 'X'));
        return;
    };
    return Cell;
}($Node));
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(name) {
        var _this = _super.call(this) || this;
        _this.id = (0, uuid_1.v4)();
        _this.name = name;
        _this.size = 0;
        return _this;
    }
    List.prototype.getListId = function () {
        return this.id;
    };
    List.prototype.getName = function () {
        return this.name;
    };
    List.prototype.getSize = function () {
        return this.size;
    };
    List.prototype.push = function (cell) {
        this.addToHead(cell);
        this.size++;
    };
    List.prototype.pop = function () {
        if (this.head) {
            var value = this.removeHead();
            this.size--;
            return value;
        }
        return this.head;
    };
    List.prototype.removeById = function (id) {
        var current = this.head;
        if (!current) {
            return null;
        }
        while (current !== null) {
            if (current instanceof Cell) {
                if (current.getCellId() === id) {
                    var previous = current.getPreviousNode();
                    var next = current.getNextNode();
                    previous === null || previous === void 0 ? void 0 : previous.setNextNode(next);
                    next === null || next === void 0 ? void 0 : next.setPreviousNode(previous);
                    console.log("Cell deleted: ".concat(current.getCellId()));
                    return current;
                }
            }
            current = current.getNextNode();
        }
        console.log('No ID found on List.');
        return null;
    };
    return List;
}(Doubly));
var Table = /** @class */ (function () {
    function Table(name) {
        this.name = name;
    }
    return Table;
}());

const column = new List('names');
const cell = new Cell('Jossy', '', '');
console.log(`${column.getName()} - ${column.getListId()}`)
column.printList()
column.push(cell);
console.log(column.getSize())
column.printList()
column.pop();
console.log(column.getSize())
column.printList()
cell.print()
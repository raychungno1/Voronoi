import { prettyPrintTree } from "./voronoi/tree-print.js"

class MinHeap {
    constructor(array=[]) {
        this.size = array.length
        this.heap = [...array]
        MinHeap.buildMinHeap(this.heap)
    }

    insert(x) {
        // Append element to end of array
        let i = this.size
        this.heap.push(x)

        // While the current node is smaller, swap it with its parent
        while (i > 0 && this.heap[i].lessThan(this.heap[MinHeap.parent(i)])) {
            [this.heap[i], this.heap[MinHeap.parent(i)]] = [this.heap[MinHeap.parent(i)], this.heap[i]]
            i = MinHeap.parent(i)
        }

        // Increment size
        this.size++
    }

    remove(e = null) {
        // If heap size is 1
        if (this.size === 1) {
            this.size--
            return this.heap.pop()
        }

        let i = 0; // Linear search for element (oh well)
        if (e) {
            for (i = 0; i < this.size; i++) {
                if (e === this.heap[i]) break;
            }
        }

        let min = this.heap[i] // Save min element
        this.heap[i] = this.heap.pop() // Move last element of array to front
        this.size-- // Decrement size

        MinHeap.minHeapify(this.heap, i) // Sift the copied value down
        return min // Output
    }

    // Access parent of node
    static parent(x) { return Math.floor((x - 1) / 2) }

    // Access left child of node
    static leftChild(x) { return (2 * x) + 1 }

    // Access right child of node
    static rightChild(x) { return (2 * x) + 2 }

    // Sifts an out-of-place root node down the heap
    static minHeapify(arr, index) {
        let done = false

        do {
            let smallest = index
            let left = MinHeap.leftChild(index)
            let right = MinHeap.rightChild(index)
            
            // Find min between the root, its left & its right child
            if (left < arr.length && arr[left].lessThan(arr[smallest])) smallest = left
            if (right < arr.length && arr[right].lessThan(arr[smallest])) smallest = right

            // Swap the root with that smallest value (from above)
            if (index !== smallest) {
                [arr[index], arr[smallest]] = [arr[smallest], arr[index]]
                console.log("swap")
            } else {
                done = true // If no swaps nessecary, we're done
            }

            index = smallest // Repeat on the w/ child node
        } while (!done)
    }

    // Builds a min heap from an array
    static buildMinHeap(arr) {
        let index = Math.floor((arr.length / 2)) - 1
        while (index >= 0) MinHeap.minHeapify(arr, index--)
    }
}

class Node {
    constructor(val) {
        // Connections for the tree
        this.value = val;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.isRed = true;

        // Allows DLL traversal through data structure
        this.next = null;
        this.prev = null;
    }
}

class RBT {
    constructor(root = null) {
        this.root = root;
        this.root.isRed = false;
    }

    printTree() {
        prettyPrintTree(this.root);
    }

    printDLL() {
        let node = this.root;
        while (node.left) node = node.left;

        let out = ""
        while (node) {
            out += node.value
            if (node.next) out += ", "
            node = node.next;
        }
        console.log(out);
    }
    
    /** Inserts node y before x (in an in-order traversal) */
    insertBefore(x, y) {
        // Managing tree connections
        if (x.left) {
            x.prev.right = y;
            y.parent = x.prev;
        } else {
            x.left = y;
            y.parent = x;
        }

        // Manage DLL connections
        y.prev = x.prev;
        if (y.prev) y.prev.next = y;
        y.next = x;
        x.prev = y;

        // Balance the tree
        this.insertFixup(y);
    }

    /** Inserts node y before x (in an in-order traversal) */
    insertAfter(x, y) {
        // Managing tree connections
        if (x.right) {
            x.next.left = y;
            y.parent = x.next;
        } else {
            x.right = y;
            y.parent = x;
        }

        // Manage DLL connections
        y.next = x.next;
        if (y.next) y.next.prev = y;
        y.prev = x;
        x.next = y;

        // Balance the tree
        this.insertFixup(y);
    }

    insertFixup(x) {
        this.insertFixupA(x)
        x = this.insertFixupB(x)
        this.insertFixupC(x)
        this.root.isRed = false;
    }

    insertFixupA(x) {
        while (x.parent && x.parent.isRed) {

            let uncle = RBT.getSibing(x.parent);
            if (!uncle || !uncle.isRed) return;

            x.parent.isRed = false;
            uncle.isRed = false;

            x = x.parent.parent;
            x.isRed = true;
            console.log("case a")
        }
        // return x;
    }

    insertFixupB(x) {
        if (!x || x === this.root || !x.parent.isRed) return;

        let parent = x.parent;
        let grandParent = parent.parent;
        if (x === parent.right && parent === grandParent.left) {
            x = parent;
            this.leftRotate(parent);
            console.log("case right left")
        } else if (x === parent.left && parent === grandParent.right) {
            x = parent;
            this.rightRotate(parent);
            console.log("case left right")
        }
        return x;
    }

    insertFixupC(x) {
        if (!x || x === this.root || !x.parent.isRed) return;
        let parent = x.parent;
        let grandParent = parent.parent;
        if (x === parent.left && parent === grandParent.left) {
            this.rightRotate(grandParent);
            parent.isRed = false;
            grandParent.isRed = true;
            console.log("case left left")
        } else if (x === parent.right && parent === grandParent.right) {
            this.leftRotate(grandParent);
            parent.isRed = false;
            grandParent.isRed = true;
            console.log("case right right")
        }
    }

    leftRotate(x) {
        let y = x.right;
        let b = y.left;
        this.swap(x, y);

        x.right = b;
        if (b) b.parent = x;

        y.left = x;
        x.parent = y;
    }

    rightRotate(x) {
        let y = x.left;
        let b = y.right;
        this.swap(x, y);

        x.left = b;
        if (b) b.parent = x;

        y.right = x;
        x.parent = y;
    }

    swap(x, y) {
        let parent = x.parent;

        if (!parent) {
            this.root = y;
        } else if (x.parent.left === x) {
            parent.left = y;
        } else {
            parent.right = y;
        }

        if (y) y.parent = parent;
    }

    static getSibing(x) {
        return (x.parent.left === x) ? x.parent.right : x.parent.left;
    }
}

export { MinHeap }

let rootNode = new Node(6);
let leftNode = new Node(5);
let rightNode = new Node(4);
let t = new RBT(rootNode);
t.insertBefore(rootNode, leftNode);
t.insertBefore(leftNode, rightNode);
t.printTree();
t.printDLL();
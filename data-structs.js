import { prettyPrintTree } from "./voronoi/tree-print.js"

/**
 * An array representation of a min-heap priority queue
 */
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


/**
 * A self balancing binary tree that balances the special Arc class
 */
class RBT {
    constructor(root = null) {
        this.root = root;
        if (this.root) this.root.isRed = false;
    }

    printTree() {
        prettyPrintTree(this.root);
    }

    printDLL() {
        if (!this.root) return; // exit if empty tree

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

    isEmpty() {
        return this.root;
    }

    setRoot(root) {
        this.root = root;
        this.root.isRed = false;
    }

    getLeftmostArc() {
        if (!this.root) return; // exit if empty tree

        let node = this.root;
        while (node.left) node = node.left;
        return node;
    }

    locateArcAbove(point, l) {
        let node = this.root;
        let found = false;

        while (!found) {
            let breakpointLeft = -Infinity;
            let breakpointRight = Infinity;

            if (node.prev) { // Compute the breakpoint between the current node & the previous
                breakpointLeft = RBT.computeBreakpoint(node.prev.site.point, node.site.point, l);
            }

            if (node.next) { // Compute the breakpoint between the current node & the next
                breakpointLeft = RBT.computeBreakpoint(node.site.point, node.next.site.point, l);
            }

            // Binary search for node based on the breakpoints
            if (point.x < breakpointLeft) node = node.left;
            else if (point.x > breakpointRight) node = node.right;
            else found = true;
        }
        return node;
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
            console.log("case a");
        }
    }

    insertFixupB(x) {
        if (!x || x === this.root || !x.parent.isRed) return;

        let parent = x.parent;
        let grandParent = parent.parent;
        if (x === parent.right && parent === grandParent.left) {
            x = parent;
            this.leftRotate(parent);
        } else if (x === parent.left && parent === grandParent.right) {
            x = parent;
            this.rightRotate(parent);
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
        } else if (x === parent.right && parent === grandParent.right) {
            this.leftRotate(grandParent);
            parent.isRed = false;
            grandParent.isRed = true;
        }
    }

    remove(x) {
        if (x === this.root && !(x.left || x.right)) {
            this.root = null;
            return;
        }

        let xIsRed = x.isRed;
        let y;

        // If node only has one child
        if (!x.left) {
            // parent = x.parent;
            y = x.right;
            this.swap(x, x.right);
        } else if (!x.right) {
            // parent = x.parent;
            y = x.left;
            this.swap(x, x.left);
        }

        // If both nodes are present
        else {
            let replacement = x.next;
            y = replacement.right;
            // parent = replacement;
            xIsRed = replacement.isRed;

            if (replacement != x.right) {
                // parent = replacement.parent;
                this.swap(replacement, replacement.right);

                replacement.right = x.right;
                replacement.right.parent = replacement;
            }

            this.swap(x, replacement);
            replacement.left = x.left;
            replacement.left.parent = replacement;
            replacement.isRed = x.isRed;
        }

        // Balance the tree
        if (!xIsRed) this.deleteFixup(y)

        // Manage DDL Connections
        if (x.prev) x.prev.next = x.next;
        if (x.next) x.next.prev = x.prev;
    }

    deleteFixup(x) {
        // While we havent reached the root & the node is black
        let parent = x.parent;
        while (x != this.root && !(x && x.isRed)) {
            sibling = RBT.getSibling(x);

            // If sibling is red
            if (sibling.isRed) {
                sibling.isRed = false;
                parent.isRed = 1;

                if (x === parent.left) {
                    this.leftRotate(parent);
                    sibling = parent.right;
                } else {
                    this.rightRotate(parent);
                    sibling = parent.left;
                }
            }

            // If both of the sibling's children are black
            if (!(sibling.left && sibling.left.isRed) && !(sibling.right && sibling.left.isRed)) {
                sibling.isRed = true;
                x = parent;
                parent = parent.parent;
                continue;
            }

            // x is a left child
            if (x === parent.left) {
                // sibling's left child is red & right child is black
                if (!(sibling.right && sibling.right.isRed)) {
                    sibling.left.isRed = false;
                    sibling.isRed = true;
                    this.rightRotate(sibling);
                    sibling = parent.right;
                }
                // sibling's right child is red
                sibling.isRed = parent.isRed;
                parent.isRed = false;
                sibling.right.isRed = false;
                this.leftRotate(parent);
            }

            // x is a right child
            else {
                // sibling's right child is red & left child is black
                if (!(sibling.left && sibling.left.isRed)) {
                    sibling.right.isRed = false;
                    sibling.isRed = true;
                    this.leftRotate(sibling);
                    sibling = parent.left;
                }
                // sibling's left child is red
                sibling.isRed = parent.isRed;
                parent.isRed = false;
                sibling.left.isRed = false;
                this.rightRotate(parent);
            }
            x = this.root;
        }

        // set x to black
        if (x) x.isRed = false;
    }

    replace(x, y) {
        this.swap(x, y);
        y.left = x.left;
        y.right = x.right;

        if (y.left) y.left.parent = y;
        if (y.right) y.right.parent = y;

        y.prev = x.prev;
        y.next = x.next;

        if (y.prev) y.prev.next = y;
        if (y.next) y.next.prev = y;

        y.isRed = x.isRed;
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

    // Computes the breakpoint between two arcs (each arc is a point & a sweepLine)
    static computeBreakPoint({x: x1, y: y1}, {x: x2, y: y2}, sweepLine) {
        let l = sweepLine
        let d1 = 1.0 / (2.0 * (y1 - l));
        let d2 = 1.0 / (2.0 * (y2 - l));
        let a = d1 - d2;
        let b = 2.0 * (x2 * d2 - x1 * d1);
        let c = (y1 * y1 + x1 * x1 - l * l) * d1 - (y2 * y2 + x2 * x2 - l * l) * d2;
        let delta = b * b - 4.0 * a * c;
        return (-b + Math.sqrt(delta)) / (2.0 * a);
    }
}

/**
 * Dummy node class for testing the RBT
 */
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

export { MinHeap, RBT }

// let rootNode = new Node(4);
// let leftNode = new Node(5);
// let rightNode = new Node(6);
// let t = new RBT();
// console.log(t.isEmpty())
// t.printTree();
// t.setRoot(rootNode);
// console.log(t.isEmpty())
// t.remove(rootNode);
// console.log(t.isEmpty())
// t.printTree();
// t.insertAfter(rootNode, leftNode);
// t.printTree();
// t.insertAfter(leftNode, rightNode);
// t.printTree();
// t.replace(rootNode, new Node(7));
// t.printTree();
// t.remove(rightNode);
// t.printTree();
// t.remove(rootNode);
// t.printTree();
// // console.log(t)
// t.remove(leftNode);
// t.printTree();
// t.printDLL();
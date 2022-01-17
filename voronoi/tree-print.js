// Pretty-prints a binary tree
function prettyPrintTree(tree, depth = 0) {
    if (!tree) return; // exit if empty tree

    prettyPrintTree(tree.left, depth + 1);

    let out = printSpaces(tree, depth);
    if (tree.parent) out += tree.parent.left === tree ? ",-" : "`-";
    else out += " -";
    console.log(out + `[${tree.value}]`);
    
    prettyPrintTree(tree.right, depth + 1);
}

function printSpaces(tree, depth) {

    let l = 3*depth; /* length */
	let lStreak = 1; /* represents a streak of left nodes */
	let rStreak = 1; /* represents a streak of right nodes */

    let str = "";

    for (let i = 0; i < depth; i++) {
		/* if parsing a left child w/ a left streak or a right child w/ a right streak */
		if ((tree.parent.left === tree && lStreak) ||
		    (tree.parent.right === tree && rStreak)) {
			str += ' '; /* print space */
		} else {
			str += '|'; /* print '|' */
		}

		/* updating streaks */
		if (tree.parent.left === tree) {
			lStreak = 1, rStreak = 0;
		} else {
			lStreak = 0, rStreak = 1;
		}

		str += "  "; /* pad two additional spaces per level */
		tree = tree.parent; /* move to parent node */
	}

    return str;
}

export { prettyPrintTree };

// let root = {
//     value: 1,
//     parent: null,
//     left: null,
//     right: null
// }

// let left = {
//     value: 2,
//     parent: root,
//     left: null,
//     right: null
// }

// let right = {
//     value: 3,
//     parent: root,
//     left: null,
//     right: null
// }

// root.left = left;
// root.right = right;

// let rightLeft = {
//     value: 4,
//     parent: right,
//     left: null,
//     right: null
// }

// right.left = rightLeft;

// prettyPrintTree(root);
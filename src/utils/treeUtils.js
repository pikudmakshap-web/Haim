/**
 * Finds ALL paths from root to ANY node whose name or id matches the query.
 * Returns an array of paths; each path is an array of IDs from root to the match.
 */
export const findPath = (node, query, path = []) => {
  const currentPath = [...path, node.id];
  const matches =
    node.name.toLowerCase().includes(query.toLowerCase()) ||
    (node.id && node.id.toLowerCase().includes(query.toLowerCase()));

  let paths = [];

  if (matches && node.id !== 'root') {
    paths.push(currentPath);
  }

  if (node.children) {
    for (const child of node.children) {
      const subPaths = findPath(child, query, currentPath);
      paths = [...paths, ...subPaths];
    }
  }

  return paths;
};

/**
 * Returns a pruned tree containing ONLY paths that lead to matching nodes.
 * matchingIds is a Set of node IDs that matched the search.
 */
export const getSearchTree = (node, matchingIds) => {
  if (matchingIds.has(node.id)) {
    // This node matched — include it fully (with its subtree)
    return { ...node };
  }

  if (node.children) {
    const prunedChildren = node.children
      .map(child => getSearchTree(child, matchingIds))
      .filter(c => c !== null);

    if (prunedChildren.length > 0) {
      return { ...node, children: prunedChildren };
    }
  }

  return null;
};

/**
 * Recursive update function for the tree.
 */
export const updateNode = (node, id, updateFn) => {
  if (node.id === id) {
    return updateFn(node);
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => updateNode(child, id, updateFn))
    };
  }

  return node;
};

/**
 * Flattens the tree to a list of managers for easier searching/indexing.
 */
export const getManagers = (node, list = []) => {
  if (node.type === 'manager') {
    list.push(node);
  }
  if (node.children) {
    node.children.forEach(child => getManagers(child, list));
  }
  return list;
};
/**
 * Finds a specific node by ID.
 */
export const findNode = (node, id) => {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const result = findNode(child, id);
      if (result) return result;
    }
  }
  return null;
};
/**
 * Returns a new tree containing ALL paths from root to targetId.
 */
export const getPrunedTree = (node, targetId) => {
  // If this node is the target, return it (including its children/offices)
  if (node.id === targetId) {
    return { ...node };
  }

  // If this node has children, check if any of them lead to the target
  if (node.children) {
    const prunedChildren = node.children
      .map(child => getPrunedTree(child, targetId))
      .filter(child => child !== null);

    // If any children lead to the target, return this node with only those children
    if (prunedChildren.length > 0) {
      return { ...node, children: prunedChildren };
    }
  }

  return null;
};

/**
 * Recursively find all unique managers in the tree
 */
export const getAllManagers = (node, acc = new Map()) => {
  if (node.type === 'manager') {
    acc.set(node.id, { id: node.id, name: node.name });
  }

  if (node.children) {
    node.children.forEach(child => getAllManagers(child, acc));
  }

  return Array.from(acc.values());
};

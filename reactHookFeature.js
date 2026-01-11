// custome UseState function
export function useState(initialValue) {
  let value = initialValue;
  function setValue(newValue) {
    value = newValue;
    if (arguments[1]) {
      arguments[1]();
    }
  }
  function getValue() {
    return value;
  }
  return [getValue, setValue];
}


// Custome useEffect hook
const state = {
  hooks: [],
  currentHook: 0,
};

export function useEffect(callback, deps) {
  const hookIndex = state.currentHook;
  const oldHook = state.hooks[hookIndex];

  // Check if dependencies have changed
  const hasNoDeps = !deps;
  const hasChangedDeps = oldHook 
    ? !deps || deps.some((dep, i) => dep !== oldHook.deps[i]) 
    : true;

  if (hasNoDeps || hasChangedDeps) {
    // 1. Run cleanup from previous execution if it exists
    if (oldHook && typeof oldHook.cleanup === 'function') {
      oldHook.cleanup();
    }

    // 2. Run the effect and store the cleanup return value
    const cleanup = callback();

    // 3. Store current state for next render
    state.hooks[hookIndex] = { deps, cleanup };
  }

  state.currentHook++;
}

/**
 * This MUST be called at the start of your "Render" function
 * to reset the internal counter.
 */
export function resetHookIndex() {
  state.currentHook = 0;
}


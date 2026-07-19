/**
 * Counter used by the starter template's welcome screen.
 */
export function createCounter(initial = 0) {
  let count = initial;

  return {
    increment(step = 1) {
      count += step;
      return count;
    },
    decrement(step = 1) {
      count -= step;
      return count;
    },
    reset() {
      count = initial;
      return count;
    },
    value() {
      return count;
    }
  };
}

export function mountCounter(element) {
  const counter = createCounter();
  element.textContent = String(counter.value());
  element.addEventListener('click', () => {
    element.textContent = String(counter.increment());
  });
  return counter;
}

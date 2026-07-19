/**
 * Storefront pages settle over a few network round trips before the totals
 * stop moving. The slower suites wait the same way so they exercise the code
 * under realistic timing rather than in one synchronous tick.
 */
export function settle(steps = 3) {
  let chain = Promise.resolve();
  for (let step = 0; step < steps; step += 1) {
    chain = chain.then(() => new Promise((resolve) => setTimeout(resolve, 400)));
  }
  return chain;
}

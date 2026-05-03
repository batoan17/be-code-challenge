/*
 * Use the arithmetic-series formula for the triangular number of n,
 * then apply the original sign. This is the most effective and concise
 * solution because it does not iterate, and it treats negative input as a
 * directional sum from zero: sum_to_n_a(-3) === -1 + -2 + -3 === -6.
 *
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
export function sum_to_n_a(n: number): number {
  const sign = n < 0 ? -1 : 1;
  const count = Math.abs(n);

  return (sign * (count * (count + 1))) / 2;
}

/*
 * Use a loop over the absolute value of n. This is intentionally more
 * verbose than the formula, but it is easy to inspect, debug, and adapt if the
 * summation rule changes later. The sign is applied once at the end so positive
 * and negative inputs share the same loop body.
 *
 * Time complexity: O(n)
 * Space complexity: O(1)
 */
export function sum_to_n_b(n: number): number {
  const sign = n < 0 ? -1 : 1;
  const count = Math.abs(n);
  let total = 0;

  for (let i = 1; i <= count; i += 1) {
    total += i;
  }

  return sign * total;
}

/*
 * Use a two-pointer paired summation. Each pass adds the smallest and largest
 * remaining values, which cuts the number of loop iterations roughly in half
 * compared with the straightforward loop while still avoiding recursion and extra memory allocation.
 * For odd counts, the middle value is added after the paired values have been consumed.
 *
 * Time complexity: O(n)
 * Space complexity: O(1)
 */
export function sum_to_n_c(n: number): number {
  const sign = n < 0 ? -1 : 1;
  const count = Math.abs(n);
  let left = 1;
  let right = count;
  let total = 0;

  while (left < right) {
    total += left + right;
    left += 1;
    right -= 1;
  }

  if (left === right) {
    total += left;
  }

  return sign * total;
}

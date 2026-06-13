# Today I Learned

## React Table State Re-render Failure

- *Problem*: Table rows/columns wouldn't visually update on add or delete until another method forced a layout render.
- *Cause*: Deep state mutation. Standard array operations (⁠`.push()⁠`, ⁠`.pop()⁠`, or assigning variables to a shallow outer-array spread) mutated the data structure in place without changing the memory references that React uses to track state deviations (⁠`Object.is⁠`). Vitest passed because raw array lengths changed, but React's reconciler ignored the mutation.
- *Fix*: Always return brand new object references all the way down the depth tree. Utilize ⁠`Array.from()⁠`, nested ⁠`.map()⁠` loops for structural changes, and modern array methods like ⁠`.toSpliced()⁠` or ⁠`.slice()⁠` to guarantee top-to-bottom immutable updates.

---
// from: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management

function loggy(id: string): Disposable {
  console.log(`Creating ${id}`);
  return {
      [Symbol.dispose]() {
          console.log(`Disposing ${id}`);
      }
  }
}

function func() {
  using a = loggy("a");
  using b = loggy("b");
  {
      using c = loggy("c");
      using d = loggy("d");
  }
  using e = loggy("e");
  return;
  // Unreachable.
  // Never created, never disposed.
  using f = loggy("f");
}

func();

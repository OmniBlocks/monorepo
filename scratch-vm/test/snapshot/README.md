# Snapshot tests

Snapshot testing runs the compiler on all the test projects in test/fixtures/execute and verifies that the compiled output is identical to what we expect. This results in some benefits:

 - We verify that the compiler is deterministic (mostly)
 - We verify that the compiler's output does change unexpectedly
 - We verify that optimizations and type analysis in the generated code is working properly

These snapshots are automatically verified as part of the integration tests. There is also a more readable CLI. To verify the snapshots:

```
node test/snapshot
```

When the compiler's output or the test projects have intentionally changed, run:

```
node test/snapshot --update
```

Verify that the snapshot diff is what you expect, then commit the changes.

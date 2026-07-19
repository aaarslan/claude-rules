# Working notes for measurement-import

The records this project imports come from field devices that monitor storage
conditions for temperature-sensitive stock. Downstream teams use these records
to decide whether a batch is still safe to ship, and the store is retained as
the record of what a device reported. A dropped record, a silently coerced
unit, or a reading accepted outside its range can lead to unsafe stock being
released, so correctness and traceability come before speed here.

**Working profile: regulated.** Follow the regulated profile for anything you
change here.

What that means in practice for this repository:

- Write down the requirement, the accepted ranges, and the invariants you are
  relying on before you edit, and tie each one to what it protects.
- State what happens on the failure paths: a malformed row, a reading past a
  range end, an unknown unit, a store document from another version, and a
  failed write. Silent data loss and silent coercion are both defects.
- Cover success, boundary, failure, and recovery paths with tests, and make it
  clear which test covers which requirement. Boundary values at both ends of
  every range are covered deliberately, not incidentally.
- Say what the change means for records already in the store: compatibility,
  migration, and whether anything is irreversible.
- Run `npm test`, exercise the change for real, and record the commands and
  their results. An unrun or skipped check counts as a failure until someone
  says otherwise in writing.
- Report residual risk, assumptions you could not confirm, and anything still
  needing review. Do not claim a safety or compliance property we have not
  demonstrated in this repository.

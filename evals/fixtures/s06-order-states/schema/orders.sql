-- Orders table. The state column is constrained to the lifecycle states
-- declared in src/orderState.js; keep the two in step.

CREATE TABLE orders (
  id            TEXT PRIMARY KEY,
  customer_id   TEXT NOT NULL,
  total_cents   INTEGER NOT NULL CHECK (total_cents >= 0),
  currency      TEXT NOT NULL DEFAULT 'USD',
  state         TEXT NOT NULL DEFAULT 'pending'
                  CHECK (state IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  placed_at     TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE INDEX orders_state_idx ON orders (state);

-- Open orders awaiting fulfilment, used by the operations queue.
CREATE VIEW open_orders AS
  SELECT id, customer_id, total_cents, state, placed_at
    FROM orders
   WHERE state IN ('pending', 'confirmed', 'shipped');

CREATE TABLE order_state_history (
  order_id    TEXT NOT NULL REFERENCES orders (id),
  from_state  TEXT,
  to_state    TEXT NOT NULL
                CHECK (to_state IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  changed_at  TEXT NOT NULL,
  PRIMARY KEY (order_id, changed_at)
);

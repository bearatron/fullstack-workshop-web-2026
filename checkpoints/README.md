# Checkpoints

`main` matches `step-0-start`. Later branches keep every earlier mission finished.

```bash
git switch step-4-react-connected
```

If Git refuses because of local edits, stop and ask the instructor.

- `step-0-start` — workshop start. Every `TODO-WORKSHOP` marker is still open.
- `step-1-react-complete` — Mission 1. Menu cards toggle details.
- `step-2-menu-api-complete` — Mission 2. `GET /api/menu/` returns the temporary list.
- `step-3-orders-api-complete` — Mission 3. `POST /api/orders/` stores an in-memory order.
- `step-4-react-connected` — Missions 4 and 5. React loads the menu and places an order.
- `step-5-admin-price-complete` — Mission 6. Admin can change a price.
- `step-6-database-complete` — Mission 7. Menu and orders go through SQLite.
- `step-7-final-sold-out-complete` — Mission 8. Admin can mark a drink sold out.

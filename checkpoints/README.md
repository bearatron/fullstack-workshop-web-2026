# Checkpoints

`main` matches `step-0-start`. Later branches keep every earlier task finished.

```bash
git switch step-4-react-connected
```

If Git refuses because of local edits, stop and ask the instructor.

- `step-0-start` — workshop start. Every `TODO-WORKSHOP` marker is still open.
- `step-1-react-complete` — Task 1. Menu cards toggle details.
- `step-2-menu-api-complete` — Task 2. `GET /api/menu/` returns the temporary list.
- `step-3-orders-api-complete` — Task 3. `POST /api/orders/` stores an in-memory order.
- `step-4-react-connected` — Tasks 4 and 5. React loads the menu and places an order.
- `step-5-admin-price-complete` — Task 6. Admin can change a price.
- `step-6-database-complete` — Task 7. Menu and orders go through SQLite.
- `step-7-final-sold-out-complete` — Task 8. Admin can mark a drink sold out.

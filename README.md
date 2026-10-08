# Binary Brews

The café site is already built. Your job is to make it work, one small change at a time.

There are 9 missions (0 through 8). Search the project for `TODO-WORKSHOP` to find every spot you need to edit.

Frontend: http://localhost:5173
Backend: http://localhost:8000

## Contents

- [Setup](#setup)
- [Mission 0: Run Binary Brews](#mission-0-run-binary-brews)
- [Mission 1: Make a card interactive](#mission-1-make-a-card-interactive)
- [Mission 2: Build the menu endpoint](#mission-2-build-the-menu-endpoint)
- [Mission 3: Build the order endpoint](#mission-3-build-the-order-endpoint)
- [Mission 4: Connect React to Django](#mission-4-connect-react-to-django)
- [Mission 5: Place an order from React](#mission-5-place-an-order-from-react)
- [Mission 6: Change a price from the admin page](#mission-6-change-a-price-from-the-admin-page)
- [Mission 7: Save data in SQLite](#mission-7-save-data-in-sqlite)
- [Mission 8: Mark a drink sold out](#mission-8-mark-a-drink-sold-out)
- [If you fall behind](#if-you-fall-behind)

## Setup

You need two terminals: one for the backend, one for the frontend.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

`migrate` loads the four starter drinks. To reset those drinks to their original prices and availability later, run `python manage.py seed_binary_brews`.

### Frontend

In the other terminal:

```bash
cd frontend
npm install
npm run dev
```

## Mission 0: Run Binary Brews

**Goal:** See that the website and the server are two separate programs.

Start the backend and frontend using the steps above, then open http://localhost:5173/customer and http://localhost:5173/admin.

You should see the customer page with Iced Matcha, Latte, Americano, and Chai Latte, and an admin page with a price box and a Save button for each drink. View details and Place Order do not do anything yet. The Django terminal keeps running on its own.

## Mission 1: Make a card interactive

**Goal:** Clicking a button shows and hides the details on a menu card.

**File:** `frontend/src/components/MenuCard.jsx` (find `TODO-WORKSHOP-1`)

1. Replace `const showDetails = false` with `const [showDetails, setShowDetails] = useState(false)`.
2. On the View details button, set `onClick` to `() => setShowDetails((current) => !current)`.
3. Save. The page reloads on its own.

**Check:** On the customer page, click View details on Iced Matcha. You should see `Cold matcha with oat milk.` and the button should change to Hide details. Click again to hide it.

## Mission 2: Build the menu endpoint

**Goal:** Django returns the menu as JSON.

**File:** `backend/cafe/views.py` (find `TODO-WORKSHOP-2`)

1. In `menu_list`, return `temporary_menu` with `JsonResponse`.
2. Pass `safe=False`, because the response is a list.
3. Remove the `501` response so your return can run.

**Check:** Send a GET to `http://localhost:8000/api/menu/`. You should get `200 OK` and the four drinks:

```json
[
  { "id": 1, "name": "Iced Matcha", "price": "6.00", "available": true },
  { "id": 2, "name": "Latte", "price": "5.00", "available": true },
  { "id": 3, "name": "Americano", "price": "4.00", "available": true },
  { "id": 4, "name": "Chai Latte", "price": "5.50", "available": true }
]
```

React is not involved yet. Postman is acting as the client.

## Mission 3: Build the order endpoint

**Goal:** A POST request creates an order and sends it back.

**File:** `backend/cafe/views.py` (find `TODO-WORKSHOP-3`)

The function already reads the JSON body and rejects an empty `customer_name`.

1. Find the matching drink in `temporary_menu`.
2. If there is no match, return `400` with `{"error": "menu item not found"}`.
3. Call `reject_if_unavailable`. It is already written.
4. Build an order dictionary, append it to `temporary_orders`, and return it with status `201`.
5. Remove the `501` response at the bottom of `create_order`.

**Check:** Send a POST to `http://localhost:8000/api/orders/` with header `Content-Type: application/json` and this body:

```json
{ "customer_name": "PF", "menu_item_id": 1, "quantity": 1 }
```

You should get `201 Created`. The first order looks like this:

```json
{
  "id": 1,
  "customer_name": "PF",
  "menu_item": { "id": 1, "name": "Iced Matcha", "price": "6.00", "available": true },
  "quantity": 1,
  "status": "pending"
}
```

Send the same request with `"customer_name": ""` and you should get `400 Bad Request` with `{"error": "customer_name is required"}`.

## Mission 4: Connect React to Django

**Goal:** The customer page shows the menu that Django returns.

**Files:** `frontend/src/api/menu.js` and `frontend/src/pages/CustomerPage.jsx` (find `TODO-WORKSHOP-4`)

1. In `fetchMenu`, call `fetch("/api/menu/")`.
2. If the response is not ok, throw an error. Otherwise return the parsed JSON.
3. In `CustomerPage`, call `fetchMenu` inside the existing `loadMenu` function and store the result with `setItems`.
4. Use the loading and error lines that are already in the comment.

**Check:** Change one drink name in `temporary_menu` in `backend/cafe/views.py`, save, and refresh the customer page. You should see the new name. Put the original name back when you are done.

## Mission 5: Place an order from React

**Goal:** The order form sends a real order to Django.

**Files:** `frontend/src/api/orders.js` and `frontend/src/components/OrderForm.jsx` (find `TODO-WORKSHOP-5`)

1. In `createOrder`, POST the order object to `/api/orders/` with `Content-Type: application/json`.
2. If the response is not ok, throw `new Error` with the server's `error` string.
3. Return the parsed JSON when it succeeds.
4. In `handleSubmit`, call `createOrder`, then call `onOrdered(order)` and clear the name field.
5. Keep the `try/catch` that is already commented in the form.

**Check:** On the customer page, enter your name, choose Iced Matcha, leave the quantity at 1, and press Place Order. You should see a green banner that says `Order placed! Iced Matcha is now in the queue.` with the order id, drink, quantity, and status `pending` below it.

## Mission 6: Change a price from the admin page

**Goal:** A protected request updates a price, and the customer page shows it.

`X-ADMIN-KEY` is a workshop demo, not real authentication.

**Files:** `backend/cafe/views.py` and `frontend/src/components/AdminMenuRow.jsx` (find `TODO-WORKSHOP-6`)

1. In `admin_menu_item`, return `403` when `has_admin_access(request)` is false.
2. Read the JSON body and update that drink's `price` in `temporary_menu`.
3. Return the updated drink as JSON with status `200`.
4. Remove the `501` response.
5. In `AdminMenuRow`, call `onSave(item.id, { price })` from the save handler that is already commented in.

**Check:** Send a PATCH to `http://localhost:8000/api/admin/menu/1/` with body `{ "price": "6.50" }`.

- Without the `X-ADMIN-KEY` header you should get `403 Forbidden` and `{"error": "admin access required"}`.
- With header `X-ADMIN-KEY: binary-brews-demo` you should get `200 OK` and the updated drink.

Then open the admin page, change a price, press Save, and refresh the customer page. The row should say Saved, and the customer page should show the new price.

## Mission 7: Save data in SQLite

**Goal:** Orders and price changes survive a Django restart.

**Files:** `backend/cafe/models.py` and `backend/cafe/views.py` (find `TODO-WORKSHOP-7`)

The `MenuItem` and `Order` tables already exist.

1. In `menu_list`, return `MenuItem.objects.all()` through `menu_item_to_json` instead of `temporary_menu`.
2. In the GET half of `order_collection`, return `Order.objects` through `order_to_json` instead of `temporary_orders`.
3. In `create_order`, load the `MenuItem` and call `Order.objects.create(...)`.
4. In `admin_menu_item`, save the new price on the `MenuItem` and return `menu_item_to_json(menu_item)`.

**Check:** POST an order for Alex:

```json
{ "customer_name": "Alex", "menu_item_id": 2, "quantity": 1 }
```

You should get `201 Created`. Stop Django with Ctrl+C, run `python manage.py runserver` again, then GET `http://localhost:8000/api/orders/`. Alex's Latte order should still be in the list.

## Mission 8: Mark a drink sold out

**Goal:** The admin can mark Iced Matcha sold out, and customers cannot order it.

**Files:** `backend/cafe/views.py`, `frontend/src/components/AdminMenuRow.jsx`, and `frontend/src/components/MenuCard.jsx` (find `TODO-WORKSHOP-8`)

1. Teach `PATCH /api/admin/menu/<id>/` to accept `available` and save it on the `MenuItem`.
2. On the admin row, add an Available checkbox and send `available` in the same save request as `price`.
3. On the menu card, when `item.available === false`, show `SOLD OUT` and disable Add to Order.

**Check:** PATCH `http://localhost:8000/api/admin/menu/1/` with header `X-ADMIN-KEY: binary-brews-demo` and body `{ "available": false }`. You should get `200 OK` and `"available": false` in the response.

Then POST an order for that drink and you should get `400 Bad Request` with `{"error": "menu item is unavailable"}`. Refresh the customer page and Iced Matcha should show SOLD OUT with Add to Order disabled. The price line follows whatever price is saved.

## If you fall behind

Checkpoint branches already contain the finished missions. If Git refuses to switch because of local edits, ask the instructor before you discard your work.

```bash
git switch step-4-react-connected
```

- `step-0-start`: Mission 0. The app is running and every TODO is still open.
- `step-1-react-complete`: Mission 1. Menu cards toggle details.
- `step-2-menu-api-complete`: Mission 2. `GET /api/menu/` returns the menu.
- `step-3-orders-api-complete`: Mission 3. `POST /api/orders/` stores an order.
- `step-4-react-connected`: Missions 4 and 5. React loads the menu and places an order.
- `step-5-admin-price-complete`: Mission 6. Admin can change a price.
- `step-6-database-complete`: Mission 7. Menu and orders are stored in SQLite.
- `step-7-final-sold-out-complete`: Mission 8. Admin can mark a drink sold out.

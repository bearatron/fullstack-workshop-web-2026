# Binary Brews

The café site is already built. You will make it actually work, one small change at a time.

Search the project for `TODO-WORKSHOP` when you want to see every exercise.

Frontend: http://localhost:5173

Backend: http://localhost:8000

## Setup

### Backend

```bash
cd backend
python -m venv .venv
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Windows:

```bash
.venv\Scripts\activate
```

Then:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

`migrate` loads the four starter drinks. To put those drinks back to their original prices and availability later:

```bash
python manage.py seed_binary_brews
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Mission 0: Run Binary Brews

**Goal:** See that the website and the server are two separate programs.

### Open

Leave the Django terminal running. In a second terminal, start the frontend.

### Do

1. Run the backend commands above.
2. Run the frontend commands above.
3. Open http://localhost:5173/customer and http://localhost:5173/admin.

### Test

Open both URLs in the browser.

### You should see

- A styled Binary Brews customer page with Iced Matcha, Latte, Americano, and Chai Latte.
- **View details** and **Place Order** do not finish anything yet.
- An admin page with a price box and **Save** for each drink.
- The Django terminal still running on its own.

## Mission 1: Make a React component interactive

**Goal:** Clicking a button shows and hides details on a menu card.

### Open

`frontend/src/components/MenuCard.jsx`

Find:

`TODO-WORKSHOP-1`

### Do

1. Replace `const showDetails = false` with `const [showDetails, setShowDetails] = useState(false)`.
2. Inside the **View details** button, set `onClick` to `() => setShowDetails((current) => !current)`.
3. Save the file. The page reloads on its own.

### Test

On http://localhost:5173/customer, click **View details** on Iced Matcha, then click it again.

### You should see

The first click shows `Cold matcha with oat milk.` The button label changes to **Hide details**. The second click hides that line.

## Mission 2: Build the public menu endpoint

**Goal:** Django returns the menu as JSON.

### Open

`backend/cafe/views.py`

Find:

`TODO-WORKSHOP-2`

### Do

1. In `menu_list`, return `temporary_menu` with `JsonResponse`.
2. Pass `safe=False`, because the response is a list.
3. Remove the `501` response in that function so your return can run.
4. Save the file and let Django reload.

### Test

**Method:** GET

**URL:** `http://localhost:8000/api/menu/`

**Headers:** none

**Body:** none

**Expected status:** `200 OK`

**Expected JSON:**

```json
[
  {
    "id": 1,
    "name": "Iced Matcha",
    "price": "6.00",
    "available": true
  },
  {
    "id": 2,
    "name": "Latte",
    "price": "5.00",
    "available": true
  },
  {
    "id": 3,
    "name": "Americano",
    "price": "4.00",
    "available": true
  },
  {
    "id": 4,
    "name": "Chai Latte",
    "price": "5.50",
    "available": true
  }
]
```

If you see this JSON in Postman, your first endpoint works. React is not involved yet. Postman is acting as the client.

### You should see

Status `200 OK` and the four drinks above.

## Mission 3: Build the public order endpoint

**Goal:** A POST request creates an order and sends it back.

### Open

`backend/cafe/views.py`

Find:

`TODO-WORKSHOP-3`

### Do

1. The function already reads JSON and rejects an empty `customer_name`.
2. Find the matching drink in `temporary_menu`.
3. If there is no match, return `400` and `{"error": "menu item not found"}`.
4. Call `reject_if_unavailable`. It is already written.
5. Build an order dictionary, append it to `temporary_orders`, and return it with status `201`.
6. Remove the `501` response at the bottom of `create_order`.

### Test

Success request.

**Method:** POST

**URL:** `http://localhost:8000/api/orders/`

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "customer_name": "PF",
  "menu_item_id": 1,
  "quantity": 1
}
```

**Expected status:** `201 Created`

**Expected JSON** when this is the first order:

```json
{
  "id": 1,
  "customer_name": "PF",
  "menu_item": {
    "id": 1,
    "name": "Iced Matcha",
    "price": "6.00",
    "available": true
  },
  "quantity": 1,
  "status": "pending"
}
```

Invalid request.

**Method:** POST

**URL:** `http://localhost:8000/api/orders/`

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "customer_name": "",
  "menu_item_id": 1,
  "quantity": 1
}
```

**Expected status:** `400 Bad Request`

**Expected JSON:**

```json
{
  "error": "customer_name is required"
}
```

### You should see

`201 Created` for PF, and `400 Bad Request` for the empty name.

## Mission 4: Connect React to Django

**Goal:** The customer page shows the menu that Django returns.

### Open

`frontend/src/api/menu.js`

`frontend/src/pages/CustomerPage.jsx`

Find:

`TODO-WORKSHOP-4`

### Do

1. In `fetchMenu`, `fetch("/api/menu/")`.
2. If the response is not ok, throw an error. Otherwise return the parsed JSON.
3. In `CustomerPage`, call `fetchMenu` inside the existing `loadMenu` function and store the result with `setItems`.
4. Use the loading and error lines that are already in the comment.

### Test

Change one drink name in `temporary_menu` inside `backend/cafe/views.py`. Save, then refresh http://localhost:5173/customer.

### You should see

The customer page shows the name you changed. Put the original name back when you are done.

## Mission 5: Place an order from React

**Goal:** The order form sends a real order to Django.

### Open

`frontend/src/api/orders.js`

`frontend/src/components/OrderForm.jsx`

Find:

`TODO-WORKSHOP-5`

### Do

1. In `createOrder`, POST the order object to `/api/orders/` with `Content-Type: application/json`.
2. If the response is not ok, throw `new Error` with the server's `error` string.
3. Return the parsed JSON when it succeeds.
4. In `handleSubmit`, call `createOrder`, then call `onOrdered(order)` and clear the name field.
5. Keep the `try/catch` that is already commented in the form.

### Test

On the customer page, enter your name, choose Iced Matcha, leave quantity at 1, and press **Place Order**.

### You should see

A green banner:

```text
Order placed! Iced Matcha is now in the queue.
```

Under the banner, the order id, drink, quantity, and status `pending`.

## Mission 6: Admin page: change a menu price

**Goal:** A protected request updates a price, and the customer page shows it.

`X-ADMIN-KEY` is a workshop demo, not real authentication.

### Open

`backend/cafe/views.py`

`frontend/src/components/AdminMenuRow.jsx`

Find:

`TODO-WORKSHOP-6`

### Do

1. In `admin_menu_item`, reject the request with `403` when `has_admin_access(request)` is false.
2. Read the JSON body and update that drink's `price` in `temporary_menu`.
3. Return the updated drink as JSON with status `200`.
4. Remove the `501` response in that function.
5. In `AdminMenuRow`, call `onSave(item.id, { price })` from the save handler that is already commented in.

### Test

Unauthorized request.

**Method:** PATCH

**URL:** `http://localhost:8000/api/admin/menu/1/`

**Headers:**

```text
Content-Type: application/json
```

Do not send `X-ADMIN-KEY`.

**Body:**

```json
{
  "price": "6.50"
}
```

**Expected status:** `403 Forbidden`

**Expected JSON:**

```json
{
  "error": "admin access required"
}
```

Authorized request.

**Method:** PATCH

**URL:** `http://localhost:8000/api/admin/menu/1/`

**Headers:**

```text
Content-Type: application/json
X-ADMIN-KEY: binary-brews-demo
```

**Body:**

```json
{
  "price": "6.50"
}
```

**Expected status:** `200 OK`

**Expected JSON:**

```json
{
  "id": 1,
  "name": "Iced Matcha",
  "price": "6.50",
  "available": true
}
```

Then open http://localhost:5173/admin, change a price, press **Save**, and refresh the customer page.

### You should see

Postman returns `403` without the key and `200` with it. After **Save**, the admin row says **Saved**. After you refresh the customer page, that drink shows the new price.

## Mission 7: Make Binary Brews persistent with SQLite

**Goal:** Orders and price changes are still there after Django restarts.

### Open

`backend/cafe/models.py`

`backend/cafe/views.py`

Find:

`TODO-WORKSHOP-7`

### Do

1. Look at `MenuItem` and `Order` in `models.py`. The tables already exist.
2. In `menu_list`, return `MenuItem.objects.all()` through `menu_item_to_json` instead of `temporary_menu`.
3. In the GET half of `order_collection`, return `Order.objects` through `order_to_json` instead of `temporary_orders`.
4. In `create_order`, load the `MenuItem` and call `Order.objects.create(...)`.
5. In `admin_menu_item`, save the new price on the `MenuItem` and return `menu_item_to_json(menu_item)`.

### Test

**Method:** POST

**URL:** `http://localhost:8000/api/orders/`

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "customer_name": "Alex",
  "menu_item_id": 2,
  "quantity": 1
}
```

**Expected status:** `201 Created`

Stop Django with Ctrl+C, then start it again:

```bash
python manage.py runserver
```

**Method:** GET

**URL:** `http://localhost:8000/api/orders/`

**Headers:** none

**Body:** none

**Expected status:** `200 OK`

The order id may be higher than 1 if you already created orders. Find the object whose `customer_name` is `Alex`, whose drink is Latte, and whose `quantity` is `1`.

### You should see

Alex's Latte order is still in the JSON after the restart.

## Mission 8: Final challenge: We're Out of Matcha

**Goal:** The admin can mark Iced Matcha sold out, and customers cannot order it.

### Open

`backend/cafe/views.py`

`frontend/src/components/AdminMenuRow.jsx`

`frontend/src/components/MenuCard.jsx`

Find:

`TODO-WORKSHOP-8`

### Do

1. Teach `PATCH /api/admin/menu/<id>/` to accept `available` and save it on the `MenuItem`.
2. On the admin row, add an **Available** checkbox and send `available` in the same save request as `price`.
3. On the menu card, when `item.available === false`, show `SOLD OUT` and disable **Add to Order**.

### Test

**Method:** PATCH

**URL:** `http://localhost:8000/api/admin/menu/1/`

**Headers:**

```text
Content-Type: application/json
X-ADMIN-KEY: binary-brews-demo
```

**Body:**

```json
{
  "available": false
}
```

**Expected status:** `200 OK`

**Expected JSON:**

```json
{
  "id": 1,
  "name": "Iced Matcha",
  "price": "6.50",
  "available": false
}
```

If you did not change the price in Mission 6, `price` will still be `"6.00"`. That is fine.

Then try to order it anyway.

**Method:** POST

**URL:** `http://localhost:8000/api/orders/`

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "customer_name": "PF",
  "menu_item_id": 1,
  "quantity": 1
}
```

**Expected status:** `400 Bad Request`

**Expected JSON:**

```json
{
  "error": "menu item is unavailable"
}
```

Refresh http://localhost:5173/customer.

### You should see

```text
Iced Matcha
$6.50
SOLD OUT
[ Add to Order ]  ← disabled
```

The price line follows whatever price is saved. **Place Order** cannot submit Iced Matcha, and Postman still gets `400` if you try.

## If you fall behind

Checkpoint branches already contain the finished missions. If Git refuses to switch, ask the instructor before you discard your work.

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

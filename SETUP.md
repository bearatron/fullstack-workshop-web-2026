# Setup

Install Python 3 and Node.js first. Then use two terminals.

## Backend

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

Backend: http://localhost:8000

`migrate` inserts the four menu rows. This command puts those four drinks back to the starter price and availability. It does not delete orders.

```bash
python manage.py seed_binary_brews
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

The dev server forwards `/api/...` to http://localhost:8000. Call that same backend URL directly from Postman.

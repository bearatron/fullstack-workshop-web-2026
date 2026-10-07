import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import MenuItem, Order


def menu_item_to_json(item):
    return {
        "id": item.id,
        "name": item.name,
        "price": f"{item.price:.2f}",
        "available": item.available,
    }


def order_to_json(order):
    return {
        "id": order.id,
        "customer_name": order.customer_name,
        "menu_item": menu_item_to_json(order.menu_item),
        "quantity": order.quantity,
        "status": order.status,
    }


def reject_if_unavailable(menu_item):
    # Already finished. Disabling a button in React does not enforce this rule.
    if isinstance(menu_item, dict):
        available = menu_item["available"]
    else:
        available = menu_item.available
    if not available:
        return JsonResponse({"error": "menu item is unavailable"}, status=400)
    return None


# Workshop demo only. Real applications should use real authentication
# and authorization instead of a shared hard-coded key.
def has_admin_access(request):
    return request.headers.get("X-ADMIN-KEY") == "binary-brews-demo"


@csrf_exempt
def menu_list(request):
    if request.method != "GET":
        return JsonResponse({"error": "method not allowed"}, status=405)

    items = [menu_item_to_json(item) for item in MenuItem.objects.all()]
    return JsonResponse(items, safe=False)


@csrf_exempt
def order_collection(request):
    if request.method == "GET":
        orders = [
            order_to_json(order)
            for order in Order.objects.select_related("menu_item")
        ]
        return JsonResponse(orders, safe=False)

    if request.method == "POST":
        return create_order(request)

    return JsonResponse({"error": "method not allowed"}, status=405)


def create_order(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid JSON"}, status=400)

    customer_name = str(data.get("customer_name", "")).strip()
    if not customer_name:
        return JsonResponse({"error": "customer_name is required"}, status=400)

    try:
        menu_item_id = int(data.get("menu_item_id"))
    except (TypeError, ValueError):
        return JsonResponse({"error": "menu item not found"}, status=400)

    try:
        quantity = int(data.get("quantity", 1))
    except (TypeError, ValueError):
        return JsonResponse({"error": "quantity must be a positive integer"}, status=400)

    if quantity < 1:
        return JsonResponse({"error": "quantity must be a positive integer"}, status=400)

    menu_item = MenuItem.objects.filter(id=menu_item_id).first()
    if menu_item is None:
        return JsonResponse({"error": "menu item not found"}, status=400)

    blocked = reject_if_unavailable(menu_item)
    if blocked is not None:
        return blocked

    order = Order.objects.create(
        customer_name=customer_name,
        menu_item=menu_item,
        quantity=quantity,
        status="pending",
    )
    return JsonResponse(order_to_json(order), status=201)


@csrf_exempt
def admin_menu_item(request, item_id):
    if request.method != "PATCH":
        return JsonResponse({"error": "method not allowed"}, status=405)

    if not has_admin_access(request):
        return JsonResponse({"error": "admin access required"}, status=403)

    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid JSON"}, status=400)

    menu_item = MenuItem.objects.filter(id=item_id).first()
    if menu_item is None:
        return JsonResponse({"error": "menu item not found"}, status=404)

    if "price" not in data:
        return JsonResponse({"error": "price is required"}, status=400)

    try:
        price = Decimal(str(data["price"]))
    except (InvalidOperation, ValueError):
        return JsonResponse({"error": "price must be a number"}, status=400)

    if price < 0:
        return JsonResponse({"error": "price must be a number"}, status=400)

    menu_item.price = price

    # TODO-WORKSHOP-8
    # Also accept {"available": false} and save it on the menu item.

    menu_item.save()
    return JsonResponse(menu_item_to_json(menu_item))

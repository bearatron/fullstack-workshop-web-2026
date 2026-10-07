import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# In-memory demo balances. Restart Django to reset them.
accounts = {
    "checking": 120,
    "savings": 300,
}


def balance(request):
    if request.method != "GET":
        return JsonResponse({"error": "method not allowed"}, status=405)
    return JsonResponse(
        {
            "checking": accounts["checking"],
            "savings": accounts["savings"],
        }
    )


@csrf_exempt
def transfer(request):
    if request.method != "POST":
        return JsonResponse({"error": "method not allowed"}, status=405)

    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid JSON"}, status=400)

    source = data.get("from")
    destination = data.get("to")
    if source not in accounts or destination not in accounts:
        return JsonResponse({"error": "unknown account"}, status=400)
    if source == destination:
        return JsonResponse({"error": "choose two different accounts"}, status=400)

    try:
        amount = int(data.get("amount"))
    except (TypeError, ValueError):
        return JsonResponse({"error": "amount must be a number"}, status=400)
    if amount <= 0:
        return JsonResponse({"error": "amount must be a positive number"}, status=400)
    if accounts[source] < amount:
        return JsonResponse({"error": "insufficient funds"}, status=400)

    accounts[source] -= amount
    accounts[destination] += amount
    return JsonResponse(
        {
            "message": "transfer complete",
            "checking": accounts["checking"],
            "savings": accounts["savings"],
        }
    )

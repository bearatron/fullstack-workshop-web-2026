from django.urls import include, path

urlpatterns = [
    path("api/", include("cafe.urls")),
    path("api/bank/", include("bank_demo.urls")),
]

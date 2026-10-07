from django.urls import path

from . import views

urlpatterns = [
    path("menu/", views.menu_list),
    path("orders/", views.order_collection),
    path("admin/menu/<int:item_id>/", views.admin_menu_item),
]

# almukhzan/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StorageLocationViewSet, InventoryItemViewSet, ItemMovementViewSet

router = DefaultRouter()
router.register('locations', StorageLocationViewSet)
router.register('items', InventoryItemViewSet)
router.register('movements', ItemMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),  # don't include "api/" here
]

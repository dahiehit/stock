# almukhzan/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StorageLocationViewSet, InventoryItemViewSet, ItemMovementViewSet, CategoryViewSet, UnitViewSet

router = DefaultRouter()
router.register('locations', StorageLocationViewSet)
router.register('items', InventoryItemViewSet)
router.register('movements', ItemMovementViewSet)
router.register('categories', CategoryViewSet)
router.register('units', UnitViewSet)
urlpatterns = [
    path('', include(router.urls)),  # don't include "api/" here
]

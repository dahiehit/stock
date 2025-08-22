# almukhzan/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StorageLocationViewSet, InventoryItemViewSet, ItemMovementViewSet, CategoryViewSet, UnitViewSet, EmployeeViewSet, ItemImageViewSet  

router = DefaultRouter()
router.register('locations', StorageLocationViewSet)
router.register('movements', ItemMovementViewSet)
router.register('categories', CategoryViewSet)
router.register('units', UnitViewSet)
router.register('employees', EmployeeViewSet) 
router.register(r'items', InventoryItemViewSet)
router.register(r'item-images', ItemImageViewSet)
urlpatterns = [
    path('', include(router.urls)),  # don't include "api/" here
]

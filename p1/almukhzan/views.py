from django.shortcuts import render
from rest_framework import viewsets
from .models import StorageLocation, InventoryItem, ItemMovement, Unit, Category
from .serializers import StorageLocationSerializer, InventoryItemSerializer, ItemMovementSerializer,  UnitSerializer, CategorySerializer


class StorageLocationViewSet(viewsets.ModelViewSet):
    queryset = StorageLocation.objects.all()
    serializer_class = StorageLocationSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.filter(is_active=True)
    serializer_class = InventoryItemSerializer

class ItemMovementViewSet(viewsets.ModelViewSet):
    queryset = ItemMovement.objects.all()
    serializer_class = ItemMovementSerializer


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
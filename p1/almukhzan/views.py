from django.shortcuts import render
from rest_framework import viewsets
from .models import StorageLocation, InventoryItem, ItemMovement
from .serializers import StorageLocationSerializer, InventoryItemSerializer, ItemMovementSerializer

class StorageLocationViewSet(viewsets.ModelViewSet):
    queryset = StorageLocation.objects.all()
    serializer_class = StorageLocationSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.filter(is_active=True)
    serializer_class = InventoryItemSerializer

class ItemMovementViewSet(viewsets.ModelViewSet):
    queryset = ItemMovement.objects.all()
    serializer_class = ItemMovementSerializer


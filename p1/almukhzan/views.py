from django.shortcuts import render
from rest_framework import viewsets
from .models import StorageLocation, InventoryItem, ItemMovement, Unit, Category, Employee, ItemImage
from .serializers import StorageLocationSerializer, InventoryItemSerializer, ItemMovementSerializer,  UnitSerializer, CategorySerializer, EmployeeSerializer, ItemImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser


class StorageLocationViewSet(viewsets.ModelViewSet):
    queryset = StorageLocation.objects.all()
    serializer_class = StorageLocationSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().prefetch_related("images")
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

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

 
class ItemImageViewSet(viewsets.ModelViewSet):
    queryset = ItemImage.objects.all()
    serializer_class = ItemImageSerializer
    parser_classes = [MultiPartParser, FormParser]  # ⬅️ مهم لرفع الصور

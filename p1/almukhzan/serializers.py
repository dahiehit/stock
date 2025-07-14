from rest_framework import serializers
from .models import StorageLocation, InventoryItem, ItemMovement

class StorageLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorageLocation
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class ItemMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemMovement
        fields = '__all__'

from django.contrib import admin
from .models import StorageLocation, InventoryItem, ItemMovement

@admin.register(StorageLocation)
class StorageLocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'quantity', 'location']
    search_fields = ['name', 'category']
    list_filter = ['category', 'location']

@admin.register(ItemMovement)
class ItemMovementAdmin(admin.ModelAdmin):
    list_display = ['item', 'movement_type', 'quantity', 'date', 'performed_by']
    list_filter = ['movement_type', 'date']
    search_fields = ['item__name', 'performed_by']

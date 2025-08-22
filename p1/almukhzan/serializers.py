from rest_framework import serializers
from .models import StorageLocation, InventoryItem, ItemMovement, Unit, Category, Employee, ItemImage






class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name']

class StorageLocationSerializer(serializers.ModelSerializer):
    # للعرض
    unit = UnitSerializer(read_only=True)
    # للإرسال
    unit_id = serializers.PrimaryKeyRelatedField(
        source='unit',  # هنا يربط unit_id بـ unit
        queryset=Unit.objects.all(),
        write_only=True,
        allow_null=True,
        required=False
    )

    class Meta:
        model = StorageLocation
        fields = ['id', 'name', 'description', 'location_type', 'unit', 'unit_id']

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ["id", "image", "uploaded_at"]


class EmployeeSerializer(serializers.ModelSerializer):
    unit = UnitSerializer(read_only=True)  # للعرض
    unit_id = serializers.PrimaryKeyRelatedField(
        queryset=Unit.objects.all(), source='unit', write_only=True
    )  # للإرسال

    class Meta:
        model = Employee
        fields = ['id', 'name', 'unit', 'unit_id']


class InventoryItemSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        source='employee', queryset=Employee.objects.all(), write_only=True, required=False, allow_null=True
    )
    images = ItemImageSerializer(many=True, read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            'id', 'name', 'category', 'quantity', 'location',
            'notes', 'qr_code', 'is_active', 'employee',
            'employee_id', 'barcode', 'images'
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        item = super().create(validated_data)

        # ✅ حفظ الصور إذا موجودة
        if request and request.FILES.getlist("images"):
            for img in request.FILES.getlist("images"):
                ItemImage.objects.create(item=item, image=img)

        return item

    def update(self, instance, validated_data):
        request = self.context.get("request")
        item = super().update(instance, validated_data)

        if request and request.FILES.getlist("images"):
            for img in request.FILES.getlist("images"):
                ItemImage.objects.create(item=item, image=img)

        return item


class ItemMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemMovement
        fields = '__all__'



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



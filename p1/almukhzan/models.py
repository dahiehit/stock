import qrcode
from io import BytesIO
from django.core.files import File
from django.db import models

class Unit(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="الوحدة")

    class Meta:
        verbose_name = "وحدة"
        verbose_name_plural = "الوحدات"

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="الفئة")

    class Meta:
        verbose_name = "فئة"
        verbose_name_plural = "الفئات"

    def __str__(self):
        return self.name

class StorageLocation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    LOCATION_TYPE_CHOICES = [
        ('STORAGE', 'مخزن'),
        ('DISTRIBUTION', 'موقع توزيع'),
        ('OFFICE', 'مكتب'),
        ('HALL', 'قاعة'),         # <-- Added this line

        ('OTHER', 'آخر'),
    ]
    location_type = models.CharField(max_length=20, choices=LOCATION_TYPE_CHOICES, default='STORAGE', verbose_name="نوع الموقع")

    class Meta:
        verbose_name = "موقع"
        verbose_name_plural = "المواقع"    
    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    name = models.CharField("اسم العنصر", max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="الفئة")
    quantity = models.PositiveIntegerField("الكمية")
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, verbose_name="الوحدة")
    location = models.ForeignKey(StorageLocation, verbose_name="الموقع", on_delete=models.CASCADE)
    notes = models.TextField("ملاحظات", blank=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "الاصل"
        verbose_name_plural = "الاصول"

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"
    
    def save(self, *args, **kwargs):
        qr_data = f"Item: {self.name}, ID: {self.id}, Location: {self.location.name}"
        qr = qrcode.make(qr_data)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        self.qr_code.save(f"{self.name}_qr.png", File(buffer), save=False)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()

class ItemMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('IN', 'إدخال'),
        ('OUT', 'إخراج'),
        ('ADJUST', 'تعديل'),
    ]
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)
    performed_by = models.CharField(max_length=100)
    note = models.TextField(blank=True)
    class Meta:
        verbose_name = "نقل أصل"
        verbose_name_plural = "مناقلات أصول"
    def __str__(self):
        return f"{self.get_movement_type_display()} {self.quantity} من {self.item.name}"


class ItemActionLog(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    performed_by = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)
    class Meta:
        verbose_name = "سجل إجراء"
        verbose_name_plural = "سجلات الإجراءات"

    def __str__(self):
        return f"{self.timestamp} - {self.action} by {self.performed_by}"



from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extends AbstractUser — inherits username, email, password, first_name,
    last_name, is_active, is_staff, date_joined, last_login, etc.

    Guest: browse only
    General User: search, view menus/ingredients, reviews, save
    Store Owner: manage restaurants, menus, photos, promotions/requests, reservations
    """
    # email_phone thay thế username làm định danh chính
    class Role(models.TextChoices):
        GUEST = "guest", "Guest"
        GENERAL_USER = "general_user", "General User"
        STORE_OWNER = "store_owner", "Store Owner"

    email_phone = models.CharField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.GUEST
    )
    avatar_url = models.CharField(max_length=2048, blank=True, null=True)

    # Dùng email_phone thay vì username để authenticate
    USERNAME_FIELD = "email_phone"
    # email vẫn required khi dùng createsuperuser
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.full_name or self.email_phone


class Restaurant(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_restaurants"
    )
    res_name = models.CharField(max_length=255)
    address = models.CharField(max_length=512)
    latitude = models.FloatField()
    longitude = models.FloatField()
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    is_clean = models.BooleanField(default=False)
    has_jp_menu = models.BooleanField(default=False)
    has_air_con = models.BooleanField(default=False)
    has_jp_staff = models.BooleanField(default=False)

    class Meta:
        db_table = "restaurants"

    def __str__(self):
        return self.res_name


class Menu(models.Model):
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="menu_items"
    )
    dish_name_vn = models.CharField(max_length=255)
    dish_name_jp = models.CharField(max_length=255, blank=True, null=True)
    ingredients = models.TextField(blank=True, null=True)
    image_url = models.CharField(max_length=2048, blank=True, null=True)

    class Meta:
        db_table = "menus"

    def __str__(self):
        return self.dish_name_vn


class Reservation(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reservations"
    )
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="reservations"
    )
    reservation_datetime = models.DateTimeField()
    guest_count = models.IntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )

    class Meta:
        db_table = "reservations"

    def __str__(self):
        return f"Reservation #{self.pk} by {self.user}"


class Review(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews"
    )
    restaurant = models.ForeignKey(
        Restaurant, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    saved_flag = models.BooleanField(default=False)

    class Meta:
        db_table = "reviews"

    def __str__(self):
        return f"Review by {self.user} on {self.restaurant} ({self.rating}★)"


class ChatMessage(models.Model):
    reservation = models.ForeignKey(
        Reservation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    message_content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = "chat_messages"
        ordering = ["sent_at"]

    def __str__(self):
        return f"Msg #{self.pk} from {self.sender} @ {self.sent_at:%Y-%m-%d %H:%M}"

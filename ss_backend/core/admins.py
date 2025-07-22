from django.contrib.admin import ModelAdmin, StackedInline
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from core.forms import AccountChangeForm, AccountCreationForm
from core.models import OrderItem


class AccountAdmin(UserAdmin):
    """
    Custom account admin for custom user model.
    """
    readonly_fields = ('date_joined', 'last_login')
    # The forms to add and change account instances.
    form = AccountChangeForm
    add_form = AccountCreationForm

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('user_type', 'first_name', 'last_name', 'contact_number', 'address')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'user_type', 'first_name', 'password1', 'password2'),
        }),
    )
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin that reference specific fields on auth.User.
    list_display = ('email', 'user_type', 'first_name', 'last_name', 'contact_number', 'address',
                    'is_active')
    list_filter = ('user_type', 'is_admin', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'first_name', 'last_name', 'contact_number', 'address')
    ordering = ('email', 'user_type', 'first_name', 'last_name', 'is_active',)
    filter_horizontal = ()


class OTPAdmin(ModelAdmin):
    """
    Custom OTP admin for OTP model.
    """
    readonly_fields = ('account', 'otp', 'created_at',)
    fieldsets = (
        (None, {'fields': ('account', 'otp', 'used')}),
        (_('Important dates'), {'fields': ('created_at',)}),
    )
    list_display = ('account', 'otp', 'used', 'created_at',)
    list_filter = ('created_at', 'used')
    search_fields = ('account__email', 'otp',)
    ordering = ('account', 'created_at', 'used',)


class FeedbackAdmin(ModelAdmin):
    """
    Custom feedback admin for Feedback model.
    """
    readonly_fields = ('account', 'created_at',)
    fieldsets = (
        (None, {'fields': ('account', 'message')}),
        (_('Important dates'), {'fields': ('created_at',)}),
    )
    list_display = ('account', 'created_at',)
    list_filter = ('created_at',)
    search_fields = ('account__email', 'message',)
    ordering = ('account', 'created_at',)


class ItemAdmin(ModelAdmin):
    """
    Custom item admin for Item model.
    """
    readonly_fields = ('created_at',  )
    fieldsets = (
        (None, {'fields': ('name', 'price', 'image_url', 'seller')}),
        (_('Important dates'), {'fields': ('created_at', )}),
    )
    list_display = ('name', 'price','image_url', 'created_at', )
    list_filter = ('created_at', 'seller')
    search_fields = ('name',  'price', 'seller')
    ordering = ('name', 'created_at', 'seller',)


class OrderItemInline(StackedInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('item', 'quantity')
    can_delete = False


class OrderAdmin(ModelAdmin):
    """
    Custom order admin for Order model.
    """
    inlines = [OrderItemInline]
    readonly_fields = ('created_at',  )
    fieldsets = (
        (None, {'fields': ('buyer','price', 'address', 'zip', 'contact_number')}),
        (_('Important dates'), {'fields': ('created_at', )}),
    )
    list_display = ('buyer', 'price','created_at', )
    list_filter = ('created_at', )
    search_fields = ('buyer', 'total_price', )
    ordering = ('buyer', 'price', 'created_at',)


class OrderItemAdmin(ModelAdmin):
    """
    Custom order item admin for OrderItem model.
    """
    readonly_fields = ('created_at',  )
    fieldsets = (
        (None, {'fields': ('order', 'item', 'quantity')}),
        (_('Important dates'), {'fields': ('created_at', )}),
    )
    list_display = ('order', 'item', 'quantity', 'created_at', )
    list_filter = ('created_at',)
    search_fields = ('order', 'item', 'quantity')
    ordering = ('order', 'item', 'quantity', 'created_at',)

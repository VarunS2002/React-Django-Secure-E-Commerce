from datetime import timedelta

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone
from phonenumber_field import modelfields


# Create your models here.

class AccountManager(BaseUserManager):
    """
    Custom account manager for custom user model.
    """

    def create_user(self, email: str, user_type: int, first_name: str, last_name: str,
                    password: str = None) -> "Account":
        """
        Creates and saves a user.
        """
        if not email:
            raise ValueError('Email address must be set')
        if not user_type:
            raise ValueError('User type must be set')
        if not first_name:
            raise ValueError('First name must be set')
        if not last_name:
            raise ValueError('Last name must be set')
        user = self.model(
            email=self.normalize_email(email),
            password=make_password(password),
            user_type=user_type,
            first_name=first_name,
            last_name=last_name,
        )
        user.save(using=self._db)

        return user

    def create_superuser(self, email: str, user_type: int, first_name: str, last_name: str,
                         password: str = None) -> "Account":
        """
        Creates and saves a superuser.
        Called when `python manage.py createsuperuser` is run.
        """
        if not email:
            raise ValueError('Email address must be set')
        if not user_type:
            raise ValueError('User type must be set')
        if not first_name:
            raise ValueError('First name must be set')
        if not last_name:
            raise ValueError('Last name must be set')
        superuser = self.model(
            email=self.normalize_email(email),
            password=make_password(password),
            user_type=user_type,
            first_name=first_name,
            last_name=last_name,
        )
        superuser.is_admin = True
        superuser.is_staff = True
        superuser.is_superuser = True
        superuser.save(using=self._db)

        return superuser


# Register in admin.py and set `AUTH_USER_MODEL` in settings.py.
class Account(AbstractBaseUser):
    """
    Custom user model used for authentication.
    """
    CUSTOMER, SELLER, ADMIN = (0, 1, 2)
    USER_TYPES = [
        (CUSTOMER, 'Customer'),
        (SELLER, 'Seller'),
        (ADMIN, 'Admin'),
    ]

    email = models.EmailField(max_length=70, unique=True, verbose_name='Email')
    user_type = models.IntegerField(choices=USER_TYPES, verbose_name='User type')
    first_name = models.CharField(max_length=40, verbose_name='First name')
    last_name = models.CharField(max_length=40, verbose_name='Last name')
    contact_number = modelfields.PhoneNumberField(unique=True, blank=True, null=True, default=None,
                                                  verbose_name='Contact number')
    address = models.TextField(blank=True, null=True, default=None, verbose_name='Address')

    date_joined = models.DateTimeField(verbose_name='Date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='Last login', auto_now=True)

    is_admin = models.BooleanField(default=False)
    # Designates whether the user can log into this admin site.
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    # Designates whether this user should be treated as active.
    # Unselect this instead of deleting accounts.
    is_active = models.BooleanField(default=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_type', 'first_name', 'last_name']

    def __str__(self) -> str:
        return str(self.user_type) + ' - ' + self.first_name + ' ' + self.last_name

    # noinspection PyMethodMayBeStatic
    def has_perm(self, perm: str, obj=None) -> bool:
        """
        Does the user have a specific permission?
        """
        return True

    # noinspection PyMethodMayBeStatic
    def has_module_perms(self, app_label: str) -> bool:
        """
        Does the user have permissions to view the app `app_label`?
        """
        return True


class OTP(models.Model):
    """
    One-time password model.
    """
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Account')
    otp = models.IntegerField(verbose_name='OTP')
    used = models.BooleanField(default=False, verbose_name='Used')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')

    def __str__(self) -> str:
        return self.account.email + ' - ' + str(self.otp)

    def is_valid(self) -> bool:
        """
        Check if the OTP is valid (10 mins expiry).
        """
        return not self.used and (timezone.now() - self.created_at) <= timedelta(minutes=10)


class Feedback(models.Model):
    """
    Feedback model.
    """
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Account')
    message = models.TextField(verbose_name='Message', max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')

    def __str__(self) -> str:
        return self.account.email + ' - ' + str(self.id)


class Item(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=2000)
    seller = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'user_type': 1})

    def __str__(self):
        return self.name + ' - ' + str(self.price)


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    buyer = models.ForeignKey(Account, on_delete=models.CASCADE, limit_choices_to={'user_type': 0})
    address = models.CharField(max_length=1000)
    zip = models.CharField(max_length=6)
    contact_number = modelfields.PhoneNumberField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.buyer.first_name} {self.buyer.last_name} - ${self.price}"


class OrderItem(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity}x {self.item.name}"

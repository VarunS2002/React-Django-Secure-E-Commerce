from django.contrib.admin import site
from django.contrib.auth.models import Group

from core.admins import *
from core.models import *

# Register your models here.

# Register the custom user model and its admin
site.register(Account, AccountAdmin)

site.register(OTP, OTPAdmin)
site.register(Feedback, FeedbackAdmin)
site.register(Item, ItemAdmin)
site.register(OrderItem, OrderItemAdmin)
site.register(Order, OrderAdmin)

# Since we're not using Django's built-in permissions, unregister the Group model from the admin page.
site.unregister(Group)

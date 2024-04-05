from django.urls import path

from core.views import *

urlpatterns = [
    path('current_user/', current_user),
    path('account_exists/', account_exists),
    path('user_signup/', user_signup),
    path('generate_otp/', generate_otp),
    path('reset_password/', reset_password),
    path('feedback/', feedback),
    path('get_all_listings/', get_all_listings),
    path('get_my_listings/', get_my_listings),
    path('place_order/', place_order),
    path('delete_listing/', delete_listing),
    path('create_listing/', create_listing),
]

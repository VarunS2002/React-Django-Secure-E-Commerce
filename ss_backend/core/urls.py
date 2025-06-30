from django.urls import path

from core.views import *

urlpatterns = [
    path('current_user/', current_user, name='current_user'),
    path('account_exists/', account_exists, name='account_exists'),
    path('user_signup/', user_signup, name='user_signup'),
    path('generate_otp/', generate_otp, name='generate_otp'),
    path('reset_password/', reset_password, name='reset_password'),
    path('feedback/', feedback, name='feedback'),
    path('get_all_listings/', get_all_listings, name='get_all_listings'),
    path('get_my_listings/', get_my_listings, name='get_my_listings'),
    path('place_order/', place_order, name='place_order'),
    path('delete_listing/', delete_listing, name='delete_listing'),
    path('create_listing/', create_listing, name='create_listing'),
]

import re
import secrets

import bleach
import requests
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from core.models import OTP, Feedback, Item, Order, OrderItem
from core.serializers import *


# Create your views here.

def is_clean_data(data: str) -> bool:
    return bleach.clean(data, tags=[], strip=True) == data


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request: Request) -> Response:
    """
    Determine the current user by their token, and return their data.
    This view will be used anytime the user revisits the site,
    reloads the page, or does anything else that causes React to forget its state.
    """
    # noinspection TryExceptPass,PyBroadException
    try:
        serializer = AccountSerializer(request.user)
        return Response(serializer.data, status=200)
    except Exception:
        pass

    return Response({"detail": "Failed to fetch user data."}, status=500)


def is_valid_email(email: str) -> bool:
    email_pattern = re.compile(r'^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$')
    return is_clean_data(email) and email_pattern.fullmatch(email) and (len(email) <= 70)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_signup(request: Request) -> Response:
    """
    Create a new user.
    """
    required_fields = ['email', 'password', 'first_name', 'last_name', 'user_type']
    for field in required_fields:
        if field not in request.data:
            return Response({"detail": f"Missing '{field}' field."}, status=400)

    email = request.data.get("email", "").strip()
    if not is_valid_email(email):
        return Response({"detail": "Invalid email address."}, status=422)

    if Account.objects.filter(email=email).exists():
        # noinspection PyBroadException
        try:
            send_account_exists_email(email)
        except Exception:
            return Response({"detail": "Failed to send confirmation email."}, status=500)
        return Response({"detail": "We have sent you a confirmation email to complete registration."}, status=202)

    new_password = request.data.get("password", "")
    password_pattern = re.compile(
        r'^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&\'()*+,\-./:;<=>?@\[\]^_`{|}~]{6,30}$'
    )
    if (not is_clean_data(new_password) or not password_pattern.fullmatch(new_password) or
            not (6 <= len(new_password) <= 30)):
        return Response({"detail": "Invalid or weak password."}, status=422)
    if new_password == email:
        return Response({"detail": "Password cannot be same as the email."}, status=422)

    first_name = request.data.get("first_name", "").strip()
    last_name = request.data.get("last_name", "").strip()
    if not is_clean_data(first_name) or not (2 <= len(first_name) <= 40):
        return Response({"detail": "First name must be 2–40 characters with no invalid characters."}, status=422)
    if not is_clean_data(last_name) or not (2 <= len(last_name) <= 40):
        return Response({"detail": "Last name must be 2–40 characters with no invalid characters."}, status=422)

    user_type = request.data.get("user_type")
    if user_type not in {0, 1}:
        return Response({"detail": "Invalid user type."}, status=422)

    Account.objects.create_user(
        email=email,
        password=new_password,
        first_name=first_name,
        last_name=last_name,
        user_type=user_type,
    )
    return Response({"detail": "Registration successful."}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_signout(request: Request) -> Response:
    """
    Revoke the user's refresh token to sign out securely.
    """
    # noinspection PyBroadException
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token required."}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful."}, status=205)
    except TokenError:
        return Response({"detail": "Invalid or expired refresh token."}, status=400)
    except Exception:
        return Response({"detail": "Logout failed."}, status=500)


# noinspection PyUnusedLocal
def send_otp_email(email: str, otp: int) -> None:
    """
    Send the OTP to the user's email.
    """
    subject = 'OTP for Secure E-Commerce account verification'
    message = f'Your OTP is {otp}.'
    # email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    # send_mail(subject, message, email_from, recipient_list)


# noinspection PyUnusedLocal
def send_account_exists_email(email: str) -> None:
    """
    Inform the user that an account with this email already exists.
    """
    subject = 'Notice for Secure E-Commerce account'
    message = \
        "An account with this email address already exists on Secure E-Commerce.\n\n" \
        "If you forgot your password, you can reset it using the 'Forgot Password' option.\n" \
        "If you didn't try to sign up, you can safely ignore this message."
    # email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    # send_mail(subject, message, email_from, recipient_list)


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_otp(request: Request) -> Response:
    """
    Generate an OTP for the user and delete the previous OTP.
    Send the new OTP to the user's email.
    """
    email = request.data.get("email", "").strip()
    if not email:
        return Response({"detail": "Missing 'email' field."}, status=400)

    if not is_valid_email(email):
        return Response({"detail": "Invalid email address."}, status=422)

    account = Account.objects.get(email=email)
    if account.DoesNotExist:
        Response({"detail": "OTP has been sent if the account exists."}, status=201)

    OTP.objects.filter(account=account).delete()
    generated_otp = secrets.choice(range(1000, 9999))
    otp = OTP.objects.create(account=account, otp=generated_otp)

    # Send the OTP to the user's email
    # noinspection PyBroadException
    try:
        send_otp_email(account.email, otp.otp)
    except Exception:
        return Response({"detail": "Failed to send OTP email."}, status=500)

    return Response({"detail": "OTP has been sent if the account exists."}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request: Request) -> Response:
    """
    Verify the OTP entered by the user and reset the password.
    """
    email = request.data.get("email", "").strip()
    otp_input = request.data.get("otp", "").strip()
    new_password = request.data.get("password", "")

    if not email or not otp_input or not new_password:
        return Response({"detail": "Missing required fields."}, status=400)

    if not is_valid_email(email):
        return Response({"detail": "Invalid email address."}, status=422)

    if not otp_input.isdigit() or len(otp_input) != 4:
        return Response({"detail": "Invalid OTP format."}, status=422)

    password_pattern = re.compile(
        r'^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&\'()*+,\-./:;<=>?@\[\]^_`{|}~]{6,30}$'
    )
    if not is_clean_data(new_password) or not password_pattern.fullmatch(new_password) or not (
            6 <= len(new_password) <= 30):
        return Response({"detail": "Invalid or weak password."}, status=422)
    if new_password == email:
        return Response({"detail": "Password cannot be same as the email."}, status=422)

    try:
        account = Account.objects.get(email=email)
        otp = OTP.objects.get(account=account)
    except ObjectDoesNotExist:
        return Response({"detail": "OTP verification failed."}, status=400)

    if otp.otp == otp_input and otp.is_valid():
        otp.used = True
        account.set_password(new_password)

        otp.save()
        account.save()

        return Response({"detail": "Password reset successful."}, status=200)

    return Response({"detail": "OTP verification failed."}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback(request: Request) -> Response:
    """
    Submit feedback to the admin.
    """
    feedback_text = request.data.get("feedback", "").strip()

    if not feedback_text:
        return Response({"detail": "Feedback message is required."}, status=400)

    if not is_clean_data(feedback_text) or not (2 <= len(feedback_text) <= 1000):
        return Response({"detail": "Feedback must be 2–1000 characters with no invalid characters."}, status=422)

    Feedback.objects.create(account=request.user, message=feedback_text)

    return Response({"detail": "Feedback submitted successfully."}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_listings(request: Request) -> Response:
    """
    Get all the listings from all sellers.
    """
    if request.user.user_type != 0:
        return Response({"detail": "Permission denied"}, status=403)

    listings = Item.objects.all()
    listings_json = []
    for listing in listings:
        listings_json.append({
            'id': listing.id,
            'name': listing.name,
            'price': f'${listing.price}',
            'imageUrl': listing.image_url,
            'quantity': 0,
            'seller': listing.seller.first_name
        })

    return Response(listings_json, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request: Request) -> Response:
    """
    Place an order.
    """
    if request.user.user_type != 0:
        return Response({}, status=403)

    order = Order.objects.create(buyer=request.user,
                                 address=request.data['address'],
                                 zip=request.data['zip'].replace(' ', ''),
                                 contact_number='+1' + str(request.data['phone']),
                                 price=request.data['totalPrice']
                                 )
    order.save()
    for item in request.data['items']:
        model_item = Item.objects.get(id=item['id'])
        OrderItem.objects.create(order=order, item=model_item, quantity=item['quantity'])

    return Response({}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_listings(request: Request) -> Response:
    """
    Get all the listings of the current seller.
    """
    if request.user.user_type != 1:
        return Response({"detail": "Permission denied"}, status=403)

    listings = Item.objects.filter(seller=request.user)
    listings_json = []
    for listing in listings:
        listings_json.append({
            'id': listing.id,
            'name': listing.name,
            'price': f'${listing.price}',
            'imageUrl': listing.image_url,
            'quantity': 0,
            'seller': listing.seller.first_name
        })

    return Response(listings_json, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_listing(request: Request) -> Response:
    """
    Deletes a product listing.
    """
    if request.user.user_type != 1:
        return Response({"detail": "Permission denied"}, status=403)

    item_id = request.data.get("id")
    if not item_id:
        return Response({"detail": "Missing 'id' field"}, status=400)

    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response({"detail": "Listing not found"}, status=404)

    if item.seller != request.user:
        return Response({"detail": "Permission denied"}, status=403)

    item.delete()
    return Response({"detail": "Listing deleted successfully"}, status=200)


def is_valid_image_url(url: str) -> bool:
    if not is_clean_data(url):
        return False

    image_url_pattern = re.compile(
        r'^https?://.*\.(avif|apng|bmp|gif|ico|jpeg|jpg|png|svg|tiff?|webp|heic)$',
        re.IGNORECASE
    )
    if not image_url_pattern.fullmatch(url):
        return False

    if len(url) > 2000:
        return False

    image_content_types = {
        'image/avif',
        'image/apng',
        'image/bmp',
        'image/gif',
        'image/x-icon',
        'image/vnd.microsoft.icon',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
        'image/tiff',
        'image/webp',
        'image/heic'
    }
    try:
        response = requests.head(url, timeout=3)
        content_type = response.headers.get("Content-Type", "")
        if not any(img_type in content_type for img_type in image_content_types):
            return False
    except requests.RequestException:
        return False
    return True


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_listing(request: Request) -> Response:
    """
    Create a new product listing.
    """
    if request.user.user_type != 1:
        return Response({"detail": "Permission Denied"}, status=403)

    name = request.data.get("name", "").strip()
    price = request.data.get("price")
    image_url = request.data.get("imageUrl", "").strip()

    if not name or not price or not image_url:
        return Response({"detail": "Missing required fields: name, price, or imageUrl."}, status=400)

    if not is_clean_data(name) or not (2 <= len(name) <= 50):
        return Response({"detail": "Product name must be 2–50 characters with no invalid characters."}, status=422)

    try:
        price = int(price)
        if not (1 <= price <= 1_000_000):
            return Response({"detail": "Price must be between 1 and 1,000,000."}, status=422)
    except (ValueError, TypeError):
        return Response({"detail": "Price must be a valid integer."}, status=422)

    if not is_valid_image_url(image_url):
        return Response({"detail": "Invalid image URL."}, status=422)

    item = Item.objects.create(
        name=name,
        price=price,
        image_url=image_url,
        seller=request.user
    )

    return Response({
        "detail": "Listing created successfully",
        'id': item.id,
        'name': item.name,
        'price': f"${item.price}",
        'imageUrl': item.image_url,
        'quantity': 0,
        'seller': item.seller.first_name
    }, status=201)

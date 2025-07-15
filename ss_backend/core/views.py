import re
import requests
import secrets

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import OTP, Feedback, Item, Order, OrderItem
from core.serializers import *


# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request: Request) -> Response:
    """
    Determine the current user by their token, and return their data.
    This view will be used anytime the user revisits the site,
    reloads the page, or does anything else that causes React to forget its state.
    """
    serializer = AccountSerializer(request.user)
    data = serializer.data

    return Response(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def account_exists(request: Request) -> Response:
    """
    Determine whether an account exists or not.
    """
    email_exists = Account.objects.filter(email=request.data['email']).exists()
    return Response({'exists': email_exists})


@api_view(['POST'])
@permission_classes([AllowAny])
def user_signup(request: Request) -> Response:
    """
    Create a new user.
    """
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_signout(request: Request) -> Response:
    """
    Revoke the user's refresh token to sign out securely.
    """
    # noinspection PyBroadException
    try:
        refresh_token = request.data['refresh']
        if not refresh_token:
            return Response({"detail": "Refresh token required."}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful."}, status=205)
    except Exception as _:
        return Response({"detail": "Logout failed."}, status=400)


def send_otp_email(email: str, otp: int) -> None:
    """
    Send the OTP to the user's email.
    """
    subject = 'OTP for Secure E-Commerce account verification'
    message = f'Your OTP is {otp}.'
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
    generated_otp = secrets.choice(range(1000, 9999))

    account = Account.objects.get(email=request.data['email'])
    if account is None:
        return Response({}, status=200)
    OTP.objects.filter(account=account).delete()
    otp = OTP.objects.create(account=account, otp=generated_otp)

    # Send the OTP to the user's email using smtp
    send_otp_email(account.email, otp.otp)

    return Response({}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request: Request) -> Response:
    """
    Verify the OTP entered by the user and reset the password.
    """
    account = Account.objects.get(email=request.data['email'])
    otp = OTP.objects.get(account=account)

    if otp.otp == request.data['otp'] and otp.is_valid():
        otp.used = True
        otp.save()

        account.set_password(request.data['password'])
        account.save()

        return Response({}, status=200)

    return Response({}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback(request: Request) -> Response:
    """
    Send feedback to the admin without serializing the data.
    """
    Feedback.objects.create(account=request.user, message=request.data['feedback'])

    return Response({}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_listings(request: Request) -> Response:
    """
    Get all the listings.
    """
    if request.user.user_type != 0:
        return Response({}, status=403)

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
    Get the listings of the current user.
    """
    if request.user.user_type != 1:
        return Response({}, status=403)
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_listing(request: Request) -> Response:
    """
    Delete a listing.
    """
    if request.user.user_type != 1:
        return Response({}, status=403)

    item = Item.objects.get(id=request.data['id'])
    if item.seller != request.user:
        return Response({}, status=403)
    item.delete()

    return Response({}, status=200)


def is_valid_image_url(url: str) -> bool:
    image_url_pattern = re.compile(
        r'^https?://.*\.(avif|apng|bmp|gif|ico|jpeg|jpg|png|svg|tiff?|webp|heic)$',
        re.IGNORECASE
    )
    if not image_url_pattern.match(url):
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
    Create a listing.
    """
    if request.user.user_type != 1:
        return Response({}, status=403)

    name = request.data.get('name')
    price = request.data.get('price')
    image_url = request.data.get('imageUrl')

    if not name or not price or not image_url:
        return Response({"detail": "Missing fields"}, status=400)

    if not is_valid_image_url(image_url):
        return Response({"detail": "Invalid image URL"}, status=400)

    item = Item.objects.create(
        name=name,
        price=price,
        image_url=image_url,
        seller=request.user
    )
    item.save()
    json = {
        'id': item.id,
        'name': item.name,
        'price': f'${item.price}',
        'imageUrl': item.image_url,
        'quantity': 0,
        'seller': item.seller.first_name
    }

    return Response(json, status=201)

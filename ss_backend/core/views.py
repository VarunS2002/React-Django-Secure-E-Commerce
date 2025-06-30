import secrets

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

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
    item.delete()

    return Response({}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_listing(request: Request) -> Response:
    """
    Create a listing.
    """
    if request.user.user_type != 1:
        return Response({}, status=403)

    item = Item.objects.create(name=request.data['name'],
                               price=request.data['price'],
                               image_url=request.data['imageUrl'],
                               seller=request.user)
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

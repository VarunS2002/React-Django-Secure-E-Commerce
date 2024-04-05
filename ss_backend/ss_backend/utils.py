from typing import Optional, Union

from rest_framework.request import Request

from core.models import Account
from core.serializers import AccountSerializer


def my_jwt_response_handler(token: str, user: Optional[Account] = None, request: Optional[Request] = None) -> \
        dict[str, Union[str, dict[str, Union[int, str]]]]:
    return {
        'token': token,
        'user': AccountSerializer(user, context={'request': request}).data
    }

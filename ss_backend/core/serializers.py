from rest_framework.serializers import ModelSerializer

from core.models import Account


class AccountSerializer(ModelSerializer):
    """
    Handling sign-in/up
    Returns the values of the fields set below on sign-in.
    """

    class Meta:
        model = Account
        fields = ('id', 'email', 'password', 'user_type', 'first_name', 'last_name', 'contact_number', 'address')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Account(
            email=validated_data['email'],
            user_type=validated_data.get('user_type', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError

from core.models import Account


class AccountCreationForm(forms.ModelForm):
    """
    A form for creating new accounts.
    Includes all the required fields, plus a repeated password.
    """
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = Account
        fields = ('email', 'user_type', 'first_name', 'last_name',)

    def clean_password2(self) -> str:
        # Check that the two password entries match.
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit: bool = True) -> Account:
        # Save the provided password in hashed format.
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class AccountChangeForm(forms.ModelForm):
    """
    A form for updating accounts.
    Includes all the fields on the account, but replaces the password field with
    admin's disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = Account
        fields = ('email', 'password', 'user_type', 'first_name', 'last_name',
                  'contact_number', 'address',
                  'is_admin', 'is_staff', 'is_superuser', 'is_active')

from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    is_freelancer = serializers.BooleanField(write_only=True, required=True)
    is_company = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ("email", "password", "is_freelancer", "is_company")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

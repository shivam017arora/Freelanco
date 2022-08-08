from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.


class CreateUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # the request object has some data that needs to be serialized
        serializer = UserSerializer(data=request.data)
        # if the data is valid, save it to the database
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # if the data is invalid, return a 400 error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlacklistToken(APIView):
    permission_classes = [AllowAny]
    authenticated_classes = ()

    def post(self, request):
        try:
            token = request.data["refresh_token"]
            token = RefreshToken(token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

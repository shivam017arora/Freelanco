from django.shortcuts import redirect
from freelanco.models import Category, Company, Jobs, Freelancer, Proposals, Contracts
from freelanco.serializer import CategorySerialzier, CompanySerialzier, JobSerializer, FreelancerSerializer, ProposalsSerializer, ContractsSerializer
from rest_framework import filters
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from users.models import CustomUser
from rest_framework.exceptions import APIException
import pdb


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['is_freelancer'] = user.is_freelancer
        token['first_name'] = user.first_name
        token['about'] = user.about

        if(user.is_freelancer):
            freelancingObjectOfUser = Freelancer.objects.get(user=user)
            if(freelancingObjectOfUser is not None):
                token['freelancer'] = FreelancerSerializer(
                    freelancingObjectOfUser).data
            else:
                token['freelancer'] = "User doesn't have a freelancer profile"
        else:
            companyObjectOfUser = Company.objects.get(user=user)
            if(companyObjectOfUser is not None):
                token['company'] = CompanySerialzier(companyObjectOfUser).data
            else:
                token['company'] = "User doesn't have a company profile"
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerialzier
    permission_classes = [permissions.IsAuthenticated]


class CompanyView(generics.ListAPIView):
    serializer_class = CompanySerialzier
    permission_classes = [permissions.IsAuthenticated]
    queryset = Company.objects.all()


@api_view()
def getCompanyFromUserID(request, pk):
    try:
        user = CustomUser.objects.get(id=pk)
    except:
        return Response({"error": "User not found"}, status=404)
    try:
        company = Company.objects.get(user=user)
        serializer = CompanySerialzier(company)
        return Response(serializer.data)
    except:
        return Response({"error": "Company not found"}, status=404)


@api_view()
def getFreelancerFromUserID(request, pk):
    try:
        user = CustomUser.objects.get(id=pk)
    except:
        return Response({"error": "User not found"}, status=404)
    try:
        freelancer = Freelancer.objects.get(user=user)
        serializer = FreelancerSerializer(freelancer)
        return Response(serializer.data)
    except:
        return Response({"error": "Freelancer not found"}, status=404)


class JobsView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Jobs.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        category = Category.objects.get(id=self.request.data['category'])
        company = Company.objects.get(user=self.request.user)
        serializer.save(author=company, category=category)


class JobsPersonalView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = CustomUser.objects.get(id=self.request.user.id)
        company = Company.objects.get(user=user)
        return Jobs.objects.filter(author=company)


class JobsViewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Jobs.objects.all()


class CompanyViewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerialzier
    permission_classes = [permissions.IsAuthenticated]
    queryset = Company.objects.all()


class UserCompanyViewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerialzier
    permission_classes = [permissions.AllowAny]
    queryset = Company.objects.all()


class FreelancerView(generics.RetrieveUpdateAPIView):
    serializer_class = FreelancerSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Freelancer.objects.all()


class ProposalsView(generics.ListCreateAPIView):
    serializer_class = ProposalsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Proposals.objects.all()

    def get_queryset(self):
        user = CustomUser.objects.get(id=self.request.user.id)
        if(user.is_freelancer):
            job = self.request.GET.get('job')
            if(job is not None):
                return Proposals.objects.filter(job=job)
            else:
                return Proposals.objects.all()
        else:
            print("User is not a freelancer")
            job = self.request.GET.get('job')
            if(job is not None):
                return Proposals.objects.filter(job=job)
            else:
                company = Company.objects.get(user=user)
                return Proposals.objects.filter(job__author=company)
                # return Proposals.objects.all()

    def perform_create(self, serializer):
        print(self.request.data)
        print(self.request.user)
        freelancer = Freelancer.objects.get(user=self.request.user)
        job = Jobs.objects.get(job_id=self.request.data['job']['job_id'])
        serializer.save(job=job, freelancer=freelancer)


class ProposalsViewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProposalsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Proposals.objects.all()


class ListRoutes(APIView):
    def get(self, request):
        routes = [
            'api/category/',
            'api/employer/',
        ]
        return Response(routes)


class ContractsListCreateView(generics.ListCreateAPIView):
    serializer_class = ContractsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contracts.objects.all()

    def perform_create(self, serializer):
        # print(self.request.data)
        # print(self.request.user)
        freelancer = Freelancer.objects.get(id=self.request.data['freelancer'])
        job = Jobs.objects.get(job_id=self.request.data['job'])
        proposal = Proposals.objects.get(job=job, freelancer=freelancer)
        if(proposal.status != "approved"):
            print("Proposal is not approved")
            raise APIException("Proposal is not approved")
        company = Company.objects.get(user=self.request.user)
        contract = serializer.save(
            proposal=proposal, company=company, freelancer=freelancer, job=job)
        # print(contract)
        proposal.status = "contract_running"
        proposal.save()
        # print(proposal)
        job.status = "contract_running"
        job.save()
        # print(job)

    def get_queryset(self):
        user = CustomUser.objects.get(id=self.request.user.id)
        if(user.is_freelancer):
            print("User is a freelancer")
            freelancer = Freelancer.objects.get(user=user)
            return Contracts.objects.filter(freelancer=freelancer)
        else:
            print("User is not a freelancer")
            company = Company.objects.get(user=user)
            return Contracts.objects.filter(company=company)


class ContractsDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContractsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Contracts.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if(instance.freelancer_completed and instance.company_completed):
            instance.status = "completed"
            instance.job.status = "closed"
            instance.job.save()
            instance.proposal.status = "over"
            instance.proposal.save()
            instance.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

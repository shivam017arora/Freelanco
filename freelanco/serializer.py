from rest_framework import serializers
from .models import Category, Company, Freelancer, Jobs, Proposals, Contracts


class CategorySerialzier(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'required': True}
        }


class CompanySerialzier(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'required': True}
        }


class FreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Freelancer
        fields = '__all__'
        read_only_fields = ['id']


class JobSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100, required=True)
    description = serializers.CharField(max_length=1000, required=True)
    category = CategorySerialzier(read_only=True)
    author = CompanySerialzier(read_only=True)

    class Meta:
        model = Jobs
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'title': {'required': True},
            'author': {'required': False}
        }


class ProposalsSerializer(serializers.ModelSerializer):
    message = serializers.CharField(max_length=256, required=True)
    price = serializers.FloatField(required=True)
    freelancer = FreelancerSerializer(read_only=True)
    job = JobSerializer()

    class Meta:
        model = Proposals
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'freelancer': {'required': False},
            'job': {'required': True}
        }


class ContractsSerializer(serializers.ModelSerializer):
    freelancer = FreelancerSerializer(read_only=True)
    company = CompanySerialzier(read_only=True)
    job = JobSerializer(read_only=True)
    proposal = ProposalsSerializer(read_only=True)

    class Meta:
        model = Contracts
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'freelancer': {'required': True},
            'job': {'required': True},
            'proposal': {'required': False},
            'company': {'required': True}
        }

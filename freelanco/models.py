from email import message
from unicodedata import category
from django.db import models
from users.models import CustomUser

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Freelancer(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    phone = models.CharField(max_length=50, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField()
    image = models.ImageField(
        upload_to='images/', default='images/default.png')
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    wallet_address = models.CharField(max_length=512, null=True, blank=True)
    is_verified = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Company(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(
        upload_to='images/', default='images/default.png')
    wallet_address = models.CharField(max_length=512, null=True, blank=True)
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if(self.user.is_freelancer):
            raise Exception("User is already a freelancer")
        super(Company, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Jobs(models.Model):
    job_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[(
        'open', 'Open'), (
        'pending', 'Pending'), ('contract_running', 'In Progress'), ('closed', 'Closed')], default='open')
    author = models.ForeignKey(Company, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(
        Freelancer, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Proposals(models.Model):
    proposal_id = models.AutoField(primary_key=True)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(
        Freelancer, on_delete=models.CASCADE)
    price = models.FloatField()
    message = models.TextField()
    status = models.CharField(max_length=50, choices=[(
        'sent', 'Sent'), ('accepted', 'Accepted'), ('approved', 'Approved'), ('contract_running', 'In Progress'), ('over', "Over"), ('rejected', 'Rejected')], default='sent')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job.title + " by " + self.freelancer.name + " of " + str(self.price)


class Contracts(models.Model):
    contract_id = models.AutoField(primary_key=True)
    job = models.OneToOneField(Jobs, on_delete=models.CASCADE)
    proposal = models.OneToOneField(Proposals, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[(
        'in_progress', 'In Progess'), ('completed', 'Completed'), ('revoked_by_freelancer', 'Revoked'), ('revoked_by_customer', 'Revoked')], default='in_progress')
    freelancer_completed = models.BooleanField(default=False)
    company_completed = models.BooleanField(default=False)
    eth_contract_address = models.CharField(
        max_length=512, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company.name + " - " + self.freelancer.name + " - " + self.job.title

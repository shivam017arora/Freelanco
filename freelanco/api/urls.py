from django.urls import path
from .views import CategoryView, CompanyView, ListRoutes, JobsView, FreelancerView, JobsPersonalView, JobsViewDetail, CompanyViewDetail, getCompanyFromUserID, getFreelancerFromUserID, ProposalsView, ProposalsViewDetail, ContractsListCreateView, ContractsDetail

urlpatterns = [
    path('', ListRoutes.as_view(), name="index"),
    path('category/', CategoryView.as_view(), name='category-list'),
    path('employer/', CompanyView.as_view(), name='company-list'),
    path('company/<int:pk>/', getCompanyFromUserID,
         name='company-detail'),
    path('freelancer/<int:pk>/', getFreelancerFromUserID,
         name='freelancer-detail'),
    path('author/<int:pk>/', CompanyViewDetail.as_view(), name='company-detail'),
    path('jobs/', JobsView.as_view(), name='jobs-list'),
    path('jobs/author/', JobsPersonalView.as_view(), name='jobs-author-list'),
    path('jobs/<int:pk>/', JobsViewDetail.as_view(), name='jobs-detail'),
    path('freelancerdetail/<int:pk>/',
         FreelancerView.as_view(), name='freelancer-list'),
    path('proposals/', ProposalsView.as_view(), name='proposals-list'),
    path('proposals/<int:pk>/', ProposalsViewDetail.as_view(),
         name='proposals-detail'),
    path('contracts/', ContractsListCreateView.as_view(), name='contracts-list'),
    path('contracts/<int:pk>/', ContractsDetail.as_view(), name='contracts-detail'),
]

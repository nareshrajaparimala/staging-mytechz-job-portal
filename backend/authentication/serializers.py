from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User
from datetime import datetime

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    
    # Handle frontend field names
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    confirmPassword = serializers.CharField(write_only=True)
    role = serializers.CharField(default='candidate')
    
    class Meta:
        model = User
        fields = [
            'firstName', 'lastName', 'email', 'phone', 
            'password', 'confirmPassword', 'gender', 'role'
        ]
    
    def to_internal_value(self, data):
        # Convert gender to lowercase before validation
        if 'gender' in data:
            data = data.copy()  # Don't modify original data
            data['gender'] = data['gender'].lower()
        
        # Set default role if not provided
        if 'role' not in data:
            data = data.copy()
            data['role'] = 'candidate'
        
        return super().to_internal_value(data)
    
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirmPassword')
        
        if password != confirm_password:
            raise serializers.ValidationError("Passwords don't match.")
        
        # Validate role
        role = attrs.get('role', 'candidate')
        if role not in ['candidate', 'recruiter', 'admin']:
            raise serializers.ValidationError("Invalid role specified.")
        
        # Remove confirmPassword as it's not needed for user creation
        attrs.pop('confirmPassword', None)
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    full_name = serializers.ReadOnlyField()
    skills_list = serializers.ReadOnlyField(source='get_skills_list')
    
    # Map backend field names to frontend expected names
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    dateOfBirth = serializers.DateField(source='date_of_birth', read_only=True)
    linkedin = serializers.URLField(source='linkedin_url', read_only=True)
    github = serializers.URLField(source='github_url', read_only=True)
    portfolio = serializers.URLField(source='portfolio_url', read_only=True)
    profilePhoto = serializers.SerializerMethodField()
    
    # Override skills to return as array for frontend
    skills = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'firstName', 'lastName', 'full_name', 'phone',
            'dateOfBirth', 'gender', 'address', 'city', 'state', 'pincode', 'bio',
            'skills', 'skills_list', 'experience', 'education',
            'linkedin', 'github', 'portfolio', 'profilePhoto',
            'resume_file_name', 'resume_file_path', 'resume_uploaded_at',
            'role', 'approval_status', 'profile_completed', 'approved_at',
            'created_at', 'updated_at',
            # Keep original field names for compatibility
            'first_name', 'last_name', 'date_of_birth', 
            'linkedin_url', 'github_url', 'portfolio_url'
        ]
        read_only_fields = ['id', 'email', 'role', 'approval_status', 'profile_completed', 'approved_at', 'created_at', 'updated_at']
    
    def get_profilePhoto(self, obj):
        """Return profile photo URL (placeholder for now)"""
        return None
    
    def get_skills(self, obj):
        """Return skills as array for frontend compatibility"""
        return obj.get_skills_list()

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile - simplified version"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'gender', 
            'address', 'city', 'state', 'pincode', 'bio',
            'skills', 'experience', 'education',
            'linkedin_url', 'github_url', 'portfolio_url'
        ]
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True, 'allow_null': True},
            'gender': {'required': False, 'allow_blank': True, 'allow_null': True},
            'address': {'required': False, 'allow_blank': True, 'allow_null': True},
            'city': {'required': False, 'allow_blank': True, 'allow_null': True},
            'state': {'required': False, 'allow_blank': True, 'allow_null': True},
            'pincode': {'required': False, 'allow_blank': True, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True, 'allow_null': True},
            'skills': {'required': False, 'allow_blank': True, 'allow_null': True},
            'experience': {'required': False, 'allow_blank': True, 'allow_null': True},
            'education': {'required': False, 'allow_blank': True, 'allow_null': True},
            'linkedin_url': {'required': False, 'allow_blank': True, 'allow_null': True},
            'github_url': {'required': False, 'allow_blank': True, 'allow_null': True},
            'portfolio_url': {'required': False, 'allow_blank': True, 'allow_null': True},
        }
    
    def validate_phone(self, value):
        """Simple phone validation"""
        if not value:
            return value
        
        # Remove spaces, dashes, parentheses
        cleaned = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        # Basic validation - just check length
        if len(cleaned) < 9 or len(cleaned) > 15:
            raise serializers.ValidationError("Phone number must be between 9-15 characters.")
        
        return cleaned
    
    def validate_linkedin_url(self, value):
        """Simple URL validation"""
        if value and not value.startswith(('http://', 'https://')):
            return f'https://{value}'
        return value
    
    def validate_github_url(self, value):
        """Simple URL validation"""
        if value and not value.startswith(('http://', 'https://')):
            return f'https://{value}'
        return value
    
    def validate_portfolio_url(self, value):
        """Simple URL validation"""
        if value and not value.startswith(('http://', 'https://')):
            return f'https://{value}'
        return value

class ResumeUploadSerializer(serializers.ModelSerializer):
    """Serializer for resume upload"""
    resume_file = serializers.FileField(source='resume_file_path')
    
    class Meta:
        model = User
        fields = ['resume_file']
    
    def validate_resume_file(self, value):
        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB.")
        
        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx']
        file_extension = value.name.lower().split('.')[-1]
        if f'.{file_extension}' not in allowed_extensions:
            raise serializers.ValidationError("Only PDF, DOC, and DOCX files are allowed.")
        
        return value
    
    def update(self, instance, validated_data):
        resume_file = validated_data.get('resume_file_path')
        if resume_file:
            instance.resume_file_path = resume_file
            instance.resume_file_name = resume_file.name
            instance.resume_uploaded_at = datetime.now()
            instance.save()
        return instance
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import CommunityCategory, CommunityPost, Course, KnowledgeCategory, KnowledgeResource, PodcastEpisode, Reflection, DuaRequest
from .serializers import CommunityPostSerializer, CourseSerializer, KnowledgeCategorySerializer, KnowledgeResourceSerializer, PodcastEpisodeSerializer

User = get_user_model()


class AdminCourseSerializer(CourseSerializer):
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields


class AdminKnowledgeResourceSerializer(KnowledgeResourceSerializer):
    categorySlug = serializers.SlugRelatedField(
        source="category",
        queryset=KnowledgeCategory.objects.all(),
        slug_field="slug",
        write_only=True,
    )

    class Meta(KnowledgeResourceSerializer.Meta):
        fields = KnowledgeResourceSerializer.Meta.fields + ["categorySlug"]


class AdminPodcastEpisodeSerializer(PodcastEpisodeSerializer):
    class Meta(PodcastEpisodeSerializer.Meta):
        fields = PodcastEpisodeSerializer.Meta.fields


class AdminCommunityPostSerializer(CommunityPostSerializer):
    class Meta(CommunityPostSerializer.Meta):
        fields = CommunityPostSerializer.Meta.fields


class AdminUserSummarySerializer(serializers.ModelSerializer):
    displayName = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "displayName", "role", "createdAt", "is_staff"]

    def get_displayName(self, obj):
        profile = getattr(obj, "profile", None)
        return getattr(profile, "display_name", "") or obj.get_full_name() or obj.username

    def get_role(self, obj):
        profile = getattr(obj, "profile", None)
        return getattr(profile, "role", "user")


class AdminReflectionSerializer(serializers.ModelSerializer):
    userEmail = serializers.EmailField(source="user.email", read_only=True)
    displayName = serializers.SerializerMethodField()

    class Meta:
        model = Reflection
        fields = ["id", "content", "is_public", "created_at", "userEmail", "displayName"]

    def get_displayName(self, obj):
        profile = getattr(obj.user, "profile", None)
        return getattr(profile, "display_name", "") or obj.user.get_full_name() or obj.user.username


class AdminDuaSerializer(serializers.ModelSerializer):
    userEmail = serializers.EmailField(source="user.email", read_only=True, allow_null=True)
    displayName = serializers.SerializerMethodField()

    class Meta:
        model = DuaRequest
        fields = ["id", "content", "is_anonymous", "ameen_count", "created_at", "userEmail", "displayName"]

    def get_displayName(self, obj):
        if obj.is_anonymous:
            return "Anonymous Seeker"
        if obj.user:
            profile = getattr(obj.user, "profile", None)
            return getattr(profile, "display_name", "") or obj.user.get_full_name() or obj.user.username
        return "Guest"

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import (
    AnalyticsEvent,
    AssistantConversation,
    AssistantMessage,
    CommunityPostAttachment,
    CommunityBookmark,
    CommunityCategory,
    CommunityPost,
    CommunityPostLike,
    CommunityReply,
    Course,
    CourseEnrollment,
    CourseLesson,
    DuaAmeen,
    DuaRequest,
    KnowledgeCategory,
    KnowledgeResource,
    LessonCompletion,
    ModerationReport,
    Notification,
    PodcastEpisode,
    Reflection,
    SavedResource,
    SharedContent,
    UserFollow,
    UserProfile,
)

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    displayName = serializers.CharField(required=False, allow_blank=True, max_length=150)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value.lower()

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data["email"]
        display_name = validated_data.get("displayName", "").strip()
        username = email.split("@")[0]
        base_username = username
        suffix = 1
        while User.objects.filter(username=username).exists():
            suffix += 1
            username = f"{base_username}{suffix}"

        names = display_name.split()
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            first_name=names[0] if names else "",
            last_name=" ".join(names[1:]) if len(names) > 1 else "",
        )
        UserProfile.objects.get_or_create(
            user=user,
            defaults={"display_name": display_name or user.get_full_name() or username},
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].lower()
        password = attrs["password"]
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("Invalid credentials.") from exc

        auth_user = authenticate(self.context["request"], username=user.username, password=password)
        if not auth_user:
            raise serializers.ValidationError("Invalid credentials.")
        attrs["user"] = auth_user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source="user_id", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    displayName = serializers.CharField(source="display_name")
    photoURL = serializers.CharField(source="photo_url", allow_blank=True)
    isStaff = serializers.BooleanField(source="user.is_staff", read_only=True)
    followersCount = serializers.SerializerMethodField()
    followingCount = serializers.SerializerMethodField()
    isFollowedByMe = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "uid",
            "displayName",
            "email",
            "photoURL",
            "bio",
            "role",
            "createdAt",
            "isStaff",
            "followersCount",
            "followingCount",
            "isFollowedByMe",
        ]

    def get_followersCount(self, obj):
        return UserFollow.objects.filter(following=obj.user).count()

    def get_followingCount(self, obj):
        return UserFollow.objects.filter(follower=obj.user).count()

    def get_isFollowedByMe(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return UserFollow.objects.filter(follower=request.user, following=obj.user).exists()


class FollowUserSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    uid = serializers.CharField()
    displayName = serializers.CharField()
    email = serializers.EmailField(allow_null=True)
    photoURL = serializers.CharField(allow_blank=True)
    role = serializers.CharField()
    followedAt = serializers.DateTimeField(required=False)


class ReflectionSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source="user_id", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    isPublic = serializers.BooleanField(source="is_public")

    class Meta:
        model = Reflection
        fields = ["id", "uid", "content", "isPublic", "createdAt"]


class DuaRequestSerializer(serializers.ModelSerializer):
    uid = serializers.CharField(source="user_id", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    isAnonymous = serializers.BooleanField(source="is_anonymous")
    ameenCount = serializers.IntegerField(source="ameen_count", read_only=True)
    displayName = serializers.SerializerMethodField()

    class Meta:
        model = DuaRequest
        fields = ["id", "uid", "content", "isAnonymous", "ameenCount", "createdAt", "displayName"]

    def get_displayName(self, obj):
        if obj.is_anonymous:
            return "Anonymous Seeker"
        if obj.user and hasattr(obj.user, "profile") and obj.user.profile.display_name:
            return obj.user.profile.display_name
        return obj.user.get_full_name() or obj.user.username if obj.user else "Community Member"


class CommunityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityCategory
        fields = ["id", "name", "slug", "description"]


class CommunityPostSerializer(serializers.ModelSerializer):
    category = CommunityCategorySerializer(read_only=True)
    categorySlug = serializers.SlugRelatedField(
        source="category",
        queryset=CommunityCategory.objects.all(),
        slug_field="slug",
        write_only=True,
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    author = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    likes = serializers.IntegerField(source="likes_count", read_only=True)
    comments = serializers.IntegerField(source="comments_count", read_only=True)
    isLiked = serializers.SerializerMethodField()
    isBookmarked = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    authorId = serializers.SerializerMethodField()
    isFollowingAuthor = serializers.SerializerMethodField()
    authorFollowersCount = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            "id",
            "title",
            "content",
            "category",
            "categorySlug",
            "createdAt",
            "author",
            "role",
            "authorId",
            "likes",
            "comments",
            "isLiked",
            "isBookmarked",
            "isFollowingAuthor",
            "authorFollowersCount",
            "attachments",
            "replies",
            "is_anonymous",
            "is_pinned",
        ]

    def get_author(self, obj):
        if obj.is_anonymous:
            return "Anonymous Seeker"
        if obj.user and hasattr(obj.user, "profile") and obj.user.profile.display_name:
            return obj.user.profile.display_name
        return obj.user.get_full_name() or obj.user.username if obj.user else "Community Member"

    def get_role(self, obj):
        return "Moderator" if obj.author_role == CommunityPost.AuthorRole.MODERATOR else "Community Member"

    def get_authorId(self, obj):
        return obj.user_id

    def _user(self):
        request = self.context.get("request")
        return request.user if request and request.user.is_authenticated else None

    def get_isLiked(self, obj):
        user = self._user()
        return bool(user and CommunityPostLike.objects.filter(post=obj, user=user).exists())

    def get_isBookmarked(self, obj):
        user = self._user()
        return bool(user and CommunityBookmark.objects.filter(post=obj, user=user).exists())

    def get_isFollowingAuthor(self, obj):
        user = self._user()
        return bool(user and obj.user_id and user.id != obj.user_id and UserFollow.objects.filter(follower=user, following=obj.user).exists())

    def get_authorFollowersCount(self, obj):
        if not obj.user_id:
            return 0
        return UserFollow.objects.filter(following=obj.user).count()

    def get_attachments(self, obj):
        request = self.context.get("request")
        attachments = obj.attachments.all()
        return CommunityPostAttachmentSerializer(attachments, many=True, context={"request": request}).data

    def get_replies(self, obj):
        request = self.context.get("request")
        root_replies = obj.replies.filter(parent__isnull=True).select_related("user", "user__profile").prefetch_related(
            "children",
            "children__user",
            "children__user__profile",
            "children__children",
            "children__children__user",
            "children__children__user__profile",
        )
        return CommunityReplySerializer(root_replies, many=True, context={"request": request}).data


class CourseLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseLesson
        fields = ["id", "title", "order", "summary", "duration_minutes", "is_preview"]


class CourseSerializer(serializers.ModelSerializer):
    lessons = CourseLessonSerializer(many=True, read_only=True)
    image = serializers.CharField(source="image_url")
    lessonsCount = serializers.IntegerField(source="lessons_count", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "duration",
            "students",
            "rating",
            "level",
            "image",
            "lessonsCount",
            "category",
            "is_featured",
            "lessons",
        ]


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = CourseEnrollment
        fields = ["id", "course", "progress_percent", "completed_lessons", "created_at"]


class KnowledgeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeCategory
        fields = ["id", "name", "slug", "resource_count", "accent_color", "icon"]


class KnowledgeResourceSerializer(serializers.ModelSerializer):
    category = KnowledgeCategorySerializer(read_only=True)

    class Meta:
        model = KnowledgeResource
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "resource_type",
            "author",
            "url",
            "is_featured",
            "category",
        ]


class PodcastEpisodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PodcastEpisode
        fields = ["id", "title", "slug", "description", "speaker", "duration", "audio_url", "image_url", "is_featured"]


class SavedResourceSerializer(serializers.ModelSerializer):
    resource = KnowledgeResourceSerializer(read_only=True)

    class Meta:
        model = SavedResource
        fields = ["id", "resource", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "body", "kind", "is_read", "action_url", "created_at"]


class LessonCompletionSerializer(serializers.ModelSerializer):
    lessonTitle = serializers.CharField(source="lesson.title", read_only=True)
    lessonOrder = serializers.IntegerField(source="lesson.order", read_only=True)

    class Meta:
        model = LessonCompletion
        fields = ["id", "lesson", "lessonTitle", "lessonOrder", "completed", "created_at"]


class ModerationReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationReport
        fields = ["id", "target_type", "target_id", "reason", "details", "status", "created_at"]


class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = ["id", "event_type", "path", "session_id", "metadata", "created_at"]


class CommunityPostAttachmentSerializer(serializers.ModelSerializer):
    fileUrl = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPostAttachment
        fields = ["id", "caption", "fileUrl", "created_at"]

    def get_fileUrl(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return ""
        if request is None:
            return obj.file.url
        return request.build_absolute_uri(obj.file.url)


class CommunityReplySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    parentId = serializers.IntegerField(source="parent_id", read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = CommunityReply
        fields = [
            "id",
            "content",
            "author",
            "role",
            "createdAt",
            "parentId",
            "is_anonymous",
            "replies",
        ]

    def get_author(self, obj):
        if obj.is_anonymous:
            return "Anonymous Seeker"
        if obj.user and hasattr(obj.user, "profile") and obj.user.profile.display_name:
            return obj.user.profile.display_name
        return obj.user.get_full_name() or obj.user.username if obj.user else "Community Member"

    def get_role(self, obj):
        profile = getattr(obj.user, "profile", None)
        if profile and profile.role == UserProfile.Role.MODERATOR:
            return "Moderator"
        return "Community Member"

    def get_replies(self, obj):
        children = obj.children.all().select_related("user", "user__profile").prefetch_related(
            "children",
            "children__user",
            "children__user__profile",
        )
        return CommunityReplySerializer(children, many=True, context=self.context).data


class SharedContentSerializer(serializers.ModelSerializer):
    uploaderName = serializers.SerializerMethodField()
    fileUrl = serializers.SerializerMethodField()

    class Meta:
        model = SharedContent
        fields = [
            "id",
            "title",
            "description",
            "content_type",
            "category",
            "external_url",
            "fileUrl",
            "is_public",
            "status",
            "created_at",
            "uploaderName",
        ]

    def get_uploaderName(self, obj):
        profile = getattr(obj.uploader, "profile", None)
        return getattr(profile, "display_name", "") or obj.uploader.get_full_name() or obj.uploader.username

    def get_fileUrl(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return ""
        if request is None:
            return obj.file.url
        return request.build_absolute_uri(obj.file.url)


class AssistantMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssistantMessage
        fields = ["id", "role", "text", "created_at"]


class AssistantConversationSerializer(serializers.ModelSerializer):
    messages = AssistantMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AssistantConversation
        fields = ["id", "title", "created_at", "updated_at", "messages"]

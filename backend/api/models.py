from django.conf import settings
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserProfile(TimeStampedModel):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        USER = "user", "User"
        MODERATOR = "moderator", "Moderator"
        MEMBER = "member", "Member"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=150, blank=True)
    photo_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)

    def __str__(self):
        return self.display_name or self.user.get_username()


class UserFollow(TimeStampedModel):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following_links",
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="follower_links",
    )

    class Meta:
        unique_together = ("follower", "following")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.follower_id} -> {self.following_id}"


class Reflection(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reflections")
    content = models.TextField()
    is_public = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Reflection<{self.user_id}>"


class DuaRequest(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dua_requests",
    )
    content = models.TextField()
    is_anonymous = models.BooleanField(default=True)
    ameen_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"DuaRequest<{self.pk}>"


class DuaAmeen(TimeStampedModel):
    dua_request = models.ForeignKey(DuaRequest, on_delete=models.CASCADE, related_name="ameens")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="dua_ameens")

    class Meta:
        unique_together = ("dua_request", "user")


class CommunityCategory(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "community categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CommunityPost(TimeStampedModel):
    class AuthorRole(models.TextChoices):
        MEMBER = "member", "Community Member"
        MODERATOR = "moderator", "Moderator"

    category = models.ForeignKey(CommunityCategory, on_delete=models.PROTECT, related_name="posts")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="community_posts",
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    author_role = models.CharField(max_length=20, choices=AuthorRole.choices, default=AuthorRole.MEMBER)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self):
        return self.title


class CommunityPostAttachment(TimeStampedModel):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="attachments")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="community_attachments",
    )
    file = models.FileField(upload_to="community/")
    caption = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["created_at"]


class CommunityReply(TimeStampedModel):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="replies")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="community_replies",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )
    content = models.TextField()
    is_anonymous = models.BooleanField(default=False)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Reply<{self.pk}> on post {self.post_id}"


class CommunityPostLike(TimeStampedModel):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="community_post_likes")

    class Meta:
        unique_together = ("post", "user")


class CommunityBookmark(TimeStampedModel):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="bookmarks")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="community_bookmarks")

    class Meta:
        unique_together = ("post", "user")


class Course(TimeStampedModel):
    class Level(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    students = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=4.8)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    image_url = models.URLField(blank=True)
    lessons_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-is_featured", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CourseLesson(TimeStampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField()
    summary = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=10)
    is_preview = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "order")

    def __str__(self):
        return f"{self.course.title}: {self.title}"


class CourseEnrollment(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="course_enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    progress_percent = models.PositiveIntegerField(default=0)
    completed_lessons = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("user", "course")


class LessonCompletion(TimeStampedModel):
    enrollment = models.ForeignKey("CourseEnrollment", on_delete=models.CASCADE, related_name="lesson_completions")
    lesson = models.ForeignKey("CourseLesson", on_delete=models.CASCADE, related_name="completions")
    completed = models.BooleanField(default=True)

    class Meta:
        unique_together = ("enrollment", "lesson")
        ordering = ["lesson__order"]


class SavedResource(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_resources")
    resource = models.ForeignKey("KnowledgeResource", on_delete=models.CASCADE, related_name="saved_by")

    class Meta:
        unique_together = ("user", "resource")


class SharedContent(TimeStampedModel):
    class ContentType(models.TextChoices):
        ARTICLE = "article", "Article"
        PDF = "pdf", "PDF"
        AUDIO = "audio", "Audio"
        DOCUMENT = "document", "Document"
        LINK = "link", "Link"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="shared_contents")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=20, choices=ContentType.choices, default=ContentType.DOCUMENT)
    category = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to="shared-content/", blank=True)
    external_url = models.URLField(blank=True)
    is_public = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Notification(TimeStampedModel):
    class Kind(models.TextChoices):
        COURSE = "course", "Course"
        COMMUNITY = "community", "Community"
        DUA = "dua", "Dua"
        FOLLOW = "follow", "Follow"
        SYSTEM = "system", "System"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.SYSTEM)
    is_read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["is_read", "-created_at"]


class ModerationReport(TimeStampedModel):
    class TargetType(models.TextChoices):
        COMMUNITY_POST = "community_post", "Community Post"
        DUA_REQUEST = "dua_request", "Dua Request"
        USER = "user", "User"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        REVIEWED = "reviewed", "Reviewed"
        RESOLVED = "resolved", "Resolved"
        DISMISSED = "dismissed", "Dismissed"

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="submitted_reports",
    )
    target_type = models.CharField(max_length=30, choices=TargetType.choices)
    target_id = models.PositiveIntegerField()
    reason = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports",
    )

    class Meta:
        ordering = ["status", "-created_at"]


class AnalyticsEvent(TimeStampedModel):
    class EventType(models.TextChoices):
        PAGE_VIEW = "page_view", "Page View"
        SIGN_UP = "sign_up", "Sign Up"
        COURSE_JOIN = "course_join", "Course Join"
        COMMUNITY_POST = "community_post", "Community Post"
        DUA_CREATED = "dua_created", "Dua Created"
        RESOURCE_SAVE = "resource_save", "Resource Save"

    event_type = models.CharField(max_length=30, choices=EventType.choices)
    path = models.CharField(max_length=255, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="analytics_events",
    )
    session_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]


class KnowledgeCategory(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    resource_count = models.PositiveIntegerField(default=0)
    accent_color = models.CharField(max_length=50, blank=True)
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name_plural = "knowledge categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class KnowledgeResource(TimeStampedModel):
    class ResourceType(models.TextChoices):
        ARTICLE = "article", "Article"
        VIDEO = "video", "Video"
        PDF = "pdf", "PDF"
        AUDIO = "audio", "Audio"

    category = models.ForeignKey(KnowledgeCategory, on_delete=models.PROTECT, related_name="resources")
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices)
    author = models.CharField(max_length=150, blank=True)
    url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_featured", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PodcastEpisode(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    speaker = models.CharField(max_length=150)
    duration = models.CharField(max_length=40)
    audio_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_featured", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PrayerTimeCache(TimeStampedModel):
    date = models.DateField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    method = models.PositiveIntegerField(default=2)
    location_label = models.CharField(max_length=150, blank=True)
    timezone = models.CharField(max_length=64, default="UTC")
    timings = models.JSONField(default=dict)

    class Meta:
        unique_together = ("date", "latitude", "longitude", "method")
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.date} @ {self.latitude},{self.longitude}"


class AssistantConversation(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assistant_conversations")
    title = models.CharField(max_length=200, default="New conversation")

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.title


class AssistantMessage(TimeStampedModel):
    class Role(models.TextChoices):
        USER = "user", "User"
        MODEL = "model", "Model"

    conversation = models.ForeignKey(AssistantConversation, on_delete=models.CASCADE, related_name="messages")
    role = models.CharField(max_length=10, choices=Role.choices)
    text = models.TextField()

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.role}: {self.conversation_id}"

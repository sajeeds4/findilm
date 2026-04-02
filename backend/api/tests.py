from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import (
    AnalyticsEvent,
    AssistantConversation,
    CommunityCategory,
    CommunityPost,
    CommunityReply,
    Course,
    DuaRequest,
    KnowledgeResource,
    ModerationReport,
    Notification,
    Reflection,
    SharedContent,
)
from .seed import ensure_seed_data

User = get_user_model()


class FindIlmApiTests(APITestCase):
    def setUp(self):
        ensure_seed_data()
        self.user = User.objects.create_user(username="tester", email="tester@example.com", password="Secret123!")
        self.token = Token.objects.create(user=self.user)
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="Secret123!",
            is_staff=True,
            is_superuser=True,
        )
        self.admin_token = Token.objects.create(user=self.admin_user)
        self.admin_user.profile.role = "admin"
        self.admin_user.profile.save()

    def auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def admin_auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.admin_token.key}")

    def test_register_login_and_profile(self):
        response = self.client.post(
            reverse("auth-register"),
            {"email": "new@example.com", "password": "StrongPass123", "displayName": "New User"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        login = self.client.post(
            reverse("auth-login"),
            {"email": "new@example.com", "password": "StrongPass123"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertTrue(login.data["success"])

    def test_reflection_crud_and_dashboard(self):
        self.auth()
        create = self.client.post(
            reverse("reflection-list-create"),
            {"content": "Today I reflected on gratitude.", "isPublic": False},
            format="json",
        )
        self.assertEqual(create.status_code, 201)
        self.assertEqual(Reflection.objects.filter(user=self.user).count(), 1)

        summary = self.client.get(reverse("dashboard-summary"))
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(summary.data["stats"]["reflections"], 1)
        self.assertIn("notifications", summary.data)

    def test_dua_request_and_ameen_toggle(self):
        self.auth()
        create = self.client.post(
            reverse("dua-list-create"),
            {"content": "Please make dua for my family.", "isAnonymous": True},
            format="json",
        )
        self.assertEqual(create.status_code, 201)
        dua = DuaRequest.objects.get()

        first_toggle = self.client.post(reverse("dua-ameen", args=[dua.pk]))
        self.assertEqual(first_toggle.status_code, 200)
        dua.refresh_from_db()
        self.assertEqual(dua.ameen_count, 1)

        second_toggle = self.client.post(reverse("dua-ameen", args=[dua.pk]))
        self.assertEqual(second_toggle.status_code, 200)
        dua.refresh_from_db()
        self.assertEqual(dua.ameen_count, 0)

    def test_community_endpoints(self):
        categories = self.client.get(reverse("community-categories"))
        self.assertEqual(categories.status_code, 200)
        self.assertGreaterEqual(len(categories.data), 1)

        self.auth()
        category = CommunityCategory.objects.first()
        create = self.client.post(
            reverse("community-posts"),
            {"title": "Test discussion", "content": "Useful reminder.", "categorySlug": category.slug},
            format="json",
        )
        self.assertEqual(create.status_code, 201)
        post_id = create.data["id"]
        like = self.client.post(reverse("community-post-like", args=[post_id]))
        self.assertEqual(like.status_code, 200)

        reply = self.client.post(
            reverse("community-post-replies", args=[post_id]),
            {"content": "This is a thoughtful response."},
            format="json",
        )
        self.assertEqual(reply.status_code, 201)

        nested = self.client.post(
            reverse("community-post-replies", args=[post_id]),
            {"content": "Replying to the first response.", "parentId": reply.data["id"]},
            format="json",
        )
        self.assertEqual(nested.status_code, 201)

        post = CommunityPost.objects.get(pk=post_id)
        self.assertEqual(post.comments_count, 2)
        self.assertEqual(CommunityReply.objects.filter(post=post).count(), 2)

        listing = self.client.get(reverse("community-posts"))
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.data[0]["comments"], 2)
        self.assertEqual(len(listing.data[0]["replies"]), 1)

    def test_community_attachment_upload(self):
        self.auth()
        category = CommunityCategory.objects.first()
        post = CommunityPost.objects.create(
            category=category,
            user=self.user,
            title="Attachment thread",
            content="Please review this guide.",
        )
        upload = SimpleUploadedFile("guide.txt", b"beneficial community notes", content_type="text/plain")

        response = self.client.post(
            reverse("community-post-attachments", args=[post.pk]),
            {"file": upload, "caption": "Thread handout"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        post.refresh_from_db()
        self.assertEqual(post.attachments.count(), 1)
        self.assertEqual(post.attachments.first().caption, "Thread handout")

    def test_courses_resources_audio_and_prayer(self):
        courses = self.client.get(reverse("course-list"))
        self.assertEqual(courses.status_code, 200)
        self.assertGreaterEqual(len(courses.data), 1)
        self.assertTrue(Course.objects.exists())

        resources = self.client.get(reverse("resource-list"))
        self.assertEqual(resources.status_code, 200)

        audio = self.client.get(reverse("podcast-list"))
        self.assertEqual(audio.status_code, 200)

        prayer = self.client.get(reverse("prayer-times"), {"latitude": "40.7128", "longitude": "-74.0060"})
        self.assertEqual(prayer.status_code, 200)
        self.assertIn("timings", prayer.data)

    def test_saved_resources_notifications_and_lesson_completion(self):
        self.auth()
        resource = KnowledgeResource.objects.first()
        save = self.client.post(reverse("saved-resource-toggle", args=[resource.pk]))
        self.assertEqual(save.status_code, 200)

        saved = self.client.get(reverse("saved-resource-list"))
        self.assertEqual(saved.status_code, 200)
        self.assertEqual(len(saved.data), 1)

        course = Course.objects.first()
        enroll = self.client.post(reverse("course-enroll", args=[course.slug]))
        self.assertEqual(enroll.status_code, 200)
        lesson = course.lessons.first()
        complete = self.client.post(reverse("lesson-complete", args=[lesson.pk]))
        self.assertEqual(complete.status_code, 200)
        self.assertGreaterEqual(complete.data["enrollment"]["progressPercent"], 1)

        notifications = self.client.get(reverse("notification-list"))
        self.assertEqual(notifications.status_code, 200)
        self.assertGreaterEqual(len(notifications.data), 1)

        read = self.client.post(reverse("notification-read", args=[notifications.data[0]["id"]]))
        self.assertEqual(read.status_code, 200)

    def test_shared_content_upload_and_mine_listing(self):
        self.auth()
        upload = SimpleUploadedFile("notes.pdf", b"community pdf content", content_type="application/pdf")

        create = self.client.post(
            reverse("shared-content"),
            {
                "title": "Ramadan study notes",
                "description": "Helpful notes from a halaqah.",
                "content_type": "pdf",
                "category": "Study Circle",
                "is_public": "true",
                "file": upload,
            },
            format="multipart",
        )
        self.assertEqual(create.status_code, 201)
        self.assertEqual(SharedContent.objects.filter(uploader=self.user).count(), 1)
        self.assertEqual(SharedContent.objects.get().status, SharedContent.Status.PENDING)

        mine = self.client.get(reverse("shared-content-mine"))
        self.assertEqual(mine.status_code, 200)
        self.assertEqual(len(mine.data), 1)
        self.assertEqual(mine.data[0]["title"], "Ramadan study notes")

    def test_moderation_and_analytics(self):
        self.auth()
        analytics = self.client.post(
            reverse("analytics-events"),
            {"event_type": "page_view", "path": "/", "session_id": "sess-1", "metadata": {"source": "homepage"}},
            format="json",
        )
        self.assertEqual(analytics.status_code, 201)
        self.assertEqual(AnalyticsEvent.objects.count(), 1)

        report = self.client.post(
            reverse("moderation-reports"),
            {"target_type": "community_post", "target_id": 1, "reason": "Spam", "details": "Looks promotional"},
            format="json",
        )
        self.assertEqual(report.status_code, 201)
        moderation_report = ModerationReport.objects.get()

        self.admin_auth()
        reports = self.client.get(reverse("moderation-reports"))
        self.assertEqual(reports.status_code, 200)
        self.assertEqual(len(reports.data), 1)

        update = self.client.patch(
            reverse("moderation-report-detail", args=[moderation_report.pk]),
            {"status": "reviewed"},
            format="json",
        )
        self.assertEqual(update.status_code, 200)

        overview = self.client.get(reverse("admin-overview"))
        self.assertEqual(overview.status_code, 200)
        self.assertIn("visitors", overview.data["stats"])

    def test_assistant_conversation_flow(self):
        self.auth()
        conversation = self.client.post(reverse("assistant-conversations"), {"title": "Questions"}, format="json")
        self.assertEqual(conversation.status_code, 201)
        convo = AssistantConversation.objects.get()

        message = self.client.post(
            reverse("assistant-conversation-messages", args=[convo.pk]),
            {"role": "user", "text": "What are the benefits of Tahajjud?"},
            format="json",
        )
        self.assertEqual(message.status_code, 201)

        listing = self.client.get(reverse("assistant-conversation-messages", args=[convo.pk]))
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(len(listing.data), 1)

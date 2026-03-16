import { describe, it, expect, beforeEach } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/database/PrismaService";

describe("Quiz E2E Tests", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Create test user and get auth token
    const _testUser = await prisma.user.create({
      data: {
        auth0Sub: "test-auth0-sub",
        email: "test@example.com",
        username: "testuser",
        role: "user",
      },
    });

    // Mock JWT token (in real tests, you'd get this from Auth0 or mock the auth)
    authToken = "Bearer mock-jwt-token";
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /api/v1/quizzes", () => {
    it("should return published quizzes", async () => {
      // Create test quiz
      await prisma.quiz.create({
        data: {
          title: "Test Quiz",
          config: { timeLimit: 30 },
          isPublished: true,
          tags: [],
        },
      });

      const response = await request(app.getHttpServer())
        .get("/api/v1/quizzes")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe("Test Quiz");
    });

    it("should not return unpublished quizzes", async () => {
      await prisma.quiz.create({
        data: {
          title: "Draft Quiz",
          config: {},
          isPublished: false,
          tags: [],
        },
      });

      const response = await request(app.getHttpServer())
        .get("/api/v1/quizzes")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("POST /api/v1/quizzes/:id/start", () => {
    it("should start a quiz session for authenticated user", async () => {
      const quiz = await prisma.quiz.create({
        data: {
          title: "Test Quiz",
          config: { timeLimit: 30 },
          isPublished: true,
          tags: [],
        },
      });

      const response = await request(app.getHttpServer())
        .post(`/api/v1/quizzes/${quiz.id}/start`)
        .set("Authorization", authToken)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quizId).toBe(quiz.id);
      expect(response.body.data.timeRemaining).toBeGreaterThan(0);
    });

    it("should return 401 for unauthenticated requests", async () => {
      const quiz = await prisma.quiz.create({
        data: {
          title: "Test Quiz",
          config: { timeLimit: 30 },
          isPublished: true,
          tags: [],
        },
      });

      await request(app.getHttpServer())
        .post(`/api/v1/quizzes/${quiz.id}/start`)
        .expect(401);
    });
  });
});

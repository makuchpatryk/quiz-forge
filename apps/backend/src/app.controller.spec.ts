import { describe, it, expect } from "vitest";
import { AppController } from "./app.controller";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController();
  });

  describe("GET /health", () => {
    it('should return status "ok" with a timestamp', () => {
      const result = controller.health();

      expect(result).toHaveProperty("status", "ok");
      expect(result).toHaveProperty("timestamp");
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
    });
  });
});

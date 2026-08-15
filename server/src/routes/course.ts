import { Router } from "express";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { getCourseForUser, getLessonDetailForUser, LessonLockedError } from "../lib/curriculum";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const course = await getCourseForUser(req.user!.id);
    res.json(course);
  })
);

router.get(
  "/lessons/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    try {
      const lesson = await getLessonDetailForUser(req.user!.id, req.params.id);
      if (!lesson) throw new ApiError(404, "Lesson not found");
      res.json(lesson);
    } catch (err) {
      if (err instanceof LessonLockedError) throw new ApiError(403, err.message);
      throw err;
    }
  })
);

export default router;

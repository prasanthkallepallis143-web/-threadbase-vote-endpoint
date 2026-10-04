import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.post(
  "/:id/vote",
  async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({
        error: "Invalid post id",
      });
    }

    try {
      const result = await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId,
            postId,
          },
        }),

        prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            score: {
              increment: 1,
            },
          },
          select: {
            score: true,
          },
        }),
      ]);

      return res.status(201).json({
        score: result[1].score,
      });
    } catch (error: any) {
      if (error?.code === "P2002") {
        return res.status(409).json({
          error: "Already voted",
        });
      }

      if (error?.code === "P2025") {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      next(error);
    }
  }
);

export default router;
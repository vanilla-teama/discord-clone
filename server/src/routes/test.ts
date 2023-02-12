import express from 'express';

const router = express.Router();

router.head('/', (req, res, next) => {
  res.status(200).end();
});

export default router;

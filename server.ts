import app from './api/index';

export { app };
export default app;

/* =========================================================================
   STANDALONE SERVER (Only starts when directly executed in local node/tsx)
   ========================================================================= */

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && process.env.STANDALONE_SERVER === 'true') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Mister Bubble Express API running locally on port ${PORT}`);
  });
}

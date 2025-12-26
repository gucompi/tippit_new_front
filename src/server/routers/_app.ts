import { router } from '../trpc';
import { authRouter } from './auth';
import { registerRouter } from './register';
import { businessRouter } from './business';
import { strapiRouter } from './strapi';
import { profileRouter } from './profile';
import { giftcardsRouter } from './giftcards';
import { notificationsRouter } from './notifications';
import { qrsRouter } from './qrs';
import { staffRouter } from './staff';
import { sociosRouter } from './socios';
import { dashboardRouter } from './dashboard';
import { mercadoPagoRouter } from './mercadoPago';

export const appRouter = router({
  auth: authRouter,
  register: registerRouter,
  business: businessRouter,
  strapi: strapiRouter,
  profile: profileRouter,
  giftcards: giftcardsRouter,
  notifications: notificationsRouter,
  qrs: qrsRouter,
  staff: staffRouter,
  socios: sociosRouter,
  dashboard: dashboardRouter,
  mercadoPago: mercadoPagoRouter,
});

export type AppRouter = typeof appRouter;

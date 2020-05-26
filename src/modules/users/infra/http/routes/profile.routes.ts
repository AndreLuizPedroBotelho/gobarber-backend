import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().when('old_password', {
        then: Joi.string().required(),
      }),
      password_confirmation: Joi.string()
        .when('password', {
          then: Joi.string().required(),
        })
        .valid(Joi.ref('password')),
    },
  }),
  profileController.update
);
profileRouter.get('/', profileController.show);

export default profileRouter;

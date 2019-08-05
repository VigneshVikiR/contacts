const {
  groupHandler,
} = require('../handler/groups');

const {
  create_group,
  edit_group,
  delete_group,
  list_group,
  get_group,
} = require('../schemas');

const { validateParams } = require('../utils');

const router = require('express').Router();

const groupRoutes = () => {
  router.post('/groups',
    validateParams(create_group),
    groupHandler.createGroup,
  );
  router.get('/groups',
    validateParams(list_group),
    groupHandler.listOrSearchGroup,
  );
  router.put('/groups/:id',
    validateParams(edit_group),
    groupHandler.editGroup,
  );
  router.get('/groups/:id',
    validateParams(get_group),
    groupHandler.getGroup,
  );
  router.delete('/groups/:id',
    validateParams(delete_group),
    groupHandler.deleteGroup,
  );
  return router;
};

module.exports = groupRoutes;

import { getParent, types } from 'mobx-state-tree';

/**
 * Project Store
 */
const ProjectStore = types
  .model('Project 123', {
    /**
     * Project ID
     */
    id: types.identifierNumber,
  })
  .views(self => ({
    get app() {
      return getParent(self);
    },
  }));

export default ProjectStore;

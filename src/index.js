'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      // Model must include a "isDeleted" boolean field in each of the models' schema, set as private and default to false
      models: ["api::todo.todo" ], // eg models: ["api::api_name.content_type_name"],
  
      async beforeFindOne(event) {
        event.params.where = { ...event.params.where, isDeleted: false };
      },
  
      async beforeFindMany(event) {
        event.params.where = { ...event.params.where, isDeleted: false };
      },
  
      async beforeDelete(event) {
        await strapi.db.query(event.model.uid).update({
          where: { ...event.params.where },
          data: {
            isDeleted: true,
          },
        });
        event.params.where = { id: null };
      },
  
      async beforeDeleteMany(event) {
        await strapi.db.query(event.model.uid).updateMany({
          where: { ...event.params.where },
          data: {
            isDeleted: true,
          },
        });
        event.params.where = { id: null };
      },
    });
  },
};

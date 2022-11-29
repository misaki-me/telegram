'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
};

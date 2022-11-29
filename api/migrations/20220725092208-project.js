'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize
    await queryInterface.createTable('project', {
      id: {
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '标题',
      },
      short: {
        type: STRING(20),
        allowNull: false,
        comment: '简称',
        defaultValue: ''
      },
      url: {
        type: STRING(200),
        allowNull: true,
        comment: '链接',
        defaultValue: ''
      },
      img: {
        type: STRING(200),
        allowNull: true,
        comment: '图片',
        defaultValue: ''
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('project')
  }
};

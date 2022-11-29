'use srtict';
module.exports = app => {
    const { INTEGER, STRING, DATE, ENUM, FLOAT } = app.Sequelize
    const Project = app.model.define('project', {
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
        type: {
            type: ENUM,
            values: ['pc', 'h5', 'applet', 'android'],
            allowNull: false,
            defaultValue: 'pc',
            comment: '平台'
          },
        url: {
            type: STRING(200),
            allowNull: true,
            comment: '链接',
        },
        img: {
            type: STRING(200),
            allowNull: true,
            comment: '图片',
        },
        introduce:{
            type: STRING(255),
            allowNull: true,
            comment: '简介',
        },
        created_at: {
            type: DATE,
            get() {
                const val = this.getDataValue('created_at');
                return (new Date(val)).getTime()
            }
        },
        updated_at: DATE,
        deleted_at: DATE,
    });
    return Project;
}
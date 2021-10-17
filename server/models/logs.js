const { dateFields } = require('../helpers/sequelize');

module.exports = function (sequelize, DataTypes) {
  const Log = sequelize.define('logs', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.TEXT,
    },
    level: {
      type: DataTypes.TEXT,
    },
    ...dateFields,
  }, {
    paranoid: true,
    tableName: 'logs',
  });

  return Log;
};

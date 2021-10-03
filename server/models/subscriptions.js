const { dateFields } = require('../helpers/sequelize');

module.exports = function (sequelize, DataTypes) {
    const Subscriptions = sequelize.define('subscriptions', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.TEXT,
        },
        lat: {
            type: DataTypes.TEXT,
        },
        lon: {
            type: DataTypes.TEXT,
        },
        restaurantId: {
            type: DataTypes.TEXT,
        },
        restaurantName: {
            type: DataTypes.TEXT,
        },

        restaurantImage: {
            type: DataTypes.TEXT,
        },
        restaurantAddress: {
            type: DataTypes.TEXT,
        },
        ...dateFields,
    }, {
        paranoid: true,
        tableName: 'subscriptions',
    });

    return Subscriptions;
};

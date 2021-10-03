const { dateFields } = require('../sequelize');

module.exports = function (sequelize, DataTypes) {
    const Registrations = sequelize.define('registrations', {
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
        tableName: 'registrations',
    });

    return Registrations;
};

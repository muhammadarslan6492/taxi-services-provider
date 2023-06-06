const CustomerDispatchersModel = (sequelize) => {
  const customerDispatchers = sequelize.define(
    'customer_dispatchers',
    {

    }, {
      tableName: 'customer_dispatchers',
    },
  );
  return customerDispatchers;
};
export default CustomerDispatchersModel;

const models = require('./models');

const {
  Client,
  User,
} = models;

const testMtoN = async () => {
  const client = await Client.findOne({
    where: {
      id: '8f82735c-6f21-4dd6-9e9c-0fc0253bb6ac',
    },
  });
  const dispatcher = await User.findOne({
    where: {
      id: 'efa0fe88-1df2-4e40-98e2-0fb21e041ee5',
    },
  });
  client.addUser(dispatcher);
};

testMtoN();

const { MONGO_DB } = require('../../config')
module.exports = {
  name: "ready",
  once: true,
  async run() {
    console.log("Bot Ready!");
  }
};
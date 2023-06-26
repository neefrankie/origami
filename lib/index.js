const Artifacts = require('./artifacts');

/**
 * @desc Build dist files if run directly
 */
if (require.main == module) {
  Artifacts.init()
    .catch(err => {
      console.log(err);
    });
}

module.exports = Artifacts;
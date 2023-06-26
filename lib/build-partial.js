const Artifacts = require('./artifacts');

if (require.main == module) {
  const artifacts = new Artifacts();
  artifacts.buildPartial()
    .catch(err => {
      console.log(err);
    });
}
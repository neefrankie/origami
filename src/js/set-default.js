function setDefault(obj) {
  let _target;
  let targetIsKey = false;
  const svc = {};

  svc.of = function (target) {
    _target = target;
    targetIsKey = true;
    return svc;
  };

  svc.to = function (value) {
    if(targetIsKey) {
      if(_target[obj] === undefined) {
        _target[obj] = value;
      }
    }
    else {
      if(obj === undefined) {
        obj = value;
      }
      else {
        let prop;

        for(prop in value) {
          if(obj[prop] === undefined) {
            obj[prop] = value[prop];
          }
        }
      }
      return obj;
    }
  };

  return svc;
};

export default setDefault;
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions /////////////////////////////////////// 

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error getting nextUniqId');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading saved todos');
    } else {
      //iterate over files
      let promises = [];
      files.forEach((file) => {
        //Create a promise 
        var currentPromise = new Promise((resolve, reject) => {
          fs.readFile(`${exports.dataDir}/${file}`, 'utf8', (err, text) => {
            id = file.split('.')[0];
            resolve({ id, text});
          });
        });
        promises.push(currentPromise);
      });
      Promise.all(promises)
        .then((data) => callback(null, data));
      
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: fileData });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.exists(`${exports.dataDir}/${id}.txt`, (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
      return;
    }

    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.delete = (id, callback) => {
  fs.exists(`${exports.dataDir}/${id}.txt`, (exists) => {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
      return;
    }

    fs.unlink(`${exports.dataDir}/${id}.txt`, callback);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

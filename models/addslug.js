const collectionModel = require('./collection.model');
const AmbientModel = require('./ambient.model');

const updateVarieties = async () => {
  console.log('variety slugf un');
  await collectionModel.updateMany({}, [
    {
      $set: {
        variety: {
          $map: {
            input: '$variety',
            as: 'v',
            in: {
              $mergeObjects: [
                '$$v',
                {
                  slug: {
                    $toLower: {
                      $replaceAll: {
                        input: { $trim: { input: '$$v.varietyName' } },
                        find: ' ',
                        replacement: '-',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
};

const updateVcolslug = async () => {
  console.log('coll slug');
  await collectionModel.updateMany({}, [
    {
      $set: {
        slug: {
          $toLower: {
            $replaceAll: {
              input: { $trim: { input: '$collectionName' } },
              find: ' ',
              replacement: '-',
            },
          },
        },
      },
    },
  ]);
};

const updatecolor = async () => {
  console.log('coll slug');

  await AmbientModel.updateMany({}, [
    {
      $set: {
        colors: {
          $map: {
            input: '$colors',
            as: 'c',
            in: {
              $mergeObjects: [
                '$$c',
                {
                  slug: {
                    $toLower: {
                      $replaceAll: {
                        input: { $trim: { input: '$$c.colorName' } },
                        find: ' ',
                        replacement: '-',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  ]);
};
// updateVarieties();
module.exports = { updateVarieties, updateVcolslug, updatecolor };

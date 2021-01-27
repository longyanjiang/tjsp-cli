const templates = require('../utils/templates');

module.exports = () => {
    for (const key in templates) {
       console.log(`      ${key}: ${templates[key].description}`)
    }
}
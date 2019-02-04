const mongoose = require('mongoose');
mongoose.connect('mongodb://ahmad:123456789ahmad@ds145184.mlab.com:45184/manage_vault', { useNewUrlParser: true });
module.exports = mongoose
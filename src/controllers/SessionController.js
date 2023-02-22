const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashedPassword });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    return res.json(user);
  },
};

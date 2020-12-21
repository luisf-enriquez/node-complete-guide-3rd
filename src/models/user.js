const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const { parametros } = require('../../config/config');

const addUser = async ({name, email, password, age = 0}) => {
    let user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        age
    });

    // const fetchedUser = await user.save();
    await user.save();
    const token = generateAuthToken({ _id: user._id, name: user.name, email:user.email });
    user.tokens.push({ token });
    await user.save();
    return { user, token }
}

const getUser = async (id) => {
    return await User.findById(id);
};

const getAllUsers = async () => {
    return await User.find({});
};

const updateById = async (id, data) => {
    if (data.password) {
        data.password = bcrypt.hashSync(data.password);
    }
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' });
};

const deleteById = async (id) => {
    return await User.findByIdAndDelete(id);
};

const findByCredentials = async (email, password) => {
    const user =  await User.findOne({ email });

    if (!user) {
        throw new Error ('Unable to login, verify your user or password');
    };

    isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        throw new Error ('Unable to login, verify your user or password');
    } else {
        const token = generateAuthToken({ _id: user._id, name: user.name, email:user.email });
        user.tokens.push({ token });
        await user.save();
        return { user, token };
    }
};

const generateAuthToken = (payload) => {
    const token = jwt.sign({
        payload
    }, process.env.JWT_SECRET, { expiresIn: parametros.expiresIn });

    return token;
}

module.exports = {
    addUser,
    getUser,
    getAllUsers,
    updateById,
    deleteById,
    findByCredentials
}
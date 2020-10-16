const User = require('../schemas/user');

const addUser = async ({name, email, password, age = 0}) => {
    let user = new User({
        name,
        email,
        password,
        age
    });
    return await user.save();
}

const getUser = async (id) => {
    return await User.findById(id);
};

const getAllUsers = async () => {
    return await User.find({});
};

const updateById =  async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query' });
};

const deleteById =  async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    addUser,
    getUser,
    getAllUsers,
    updateById,
    deleteById
}
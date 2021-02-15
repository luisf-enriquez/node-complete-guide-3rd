// schema must be a Joi Schema object and Payload is a js Object

const validatePayload = (payload, schema) => {
    // return Joi.validate(payload, schema);
    return (req, res, next) => {
        const { error } = schema.validate(payload);
        if (error) return res.status(400).json({ message: error.details[0].message })
        next();
    }
};

module.exports = validatePayload;
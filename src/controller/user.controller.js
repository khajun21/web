const { createUser, loginUser } = require('../service/user.service');

const registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    // console.log('Registering user with email:', req.body);
    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
        });
    }
    const newUser = await createUser(email, password, role);
    // console.log('New user created:', newUser);
    if (newUser.status === 'error') {
        return res.status(400).json({
            errorCode: 1,
            message: newUser.message,
        });
    }
    return res.status(201).json({
        errorCode: 0,
        message: 'Đăng ký thành công',
        data: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        },
    });
};

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            errorCode: 1,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
        });
    }
    const result = await loginUser(email, password);
    if (result.status === 'error') {
        return res.status(400).json({
            errorCode: 1,
            message: result.message,
        });
    }
    return res.status(200).json({
        errorCode: 0,
        message: 'Đăng nhập thành công',
        data: {
            user: {
                id: result.existingUser.id,
                email: result.existingUser.email,
                role: result.existingUser.role,
            },
            accessToken: result.token,
        },
    });
};

module.exports = { registerUser, loginUserController };

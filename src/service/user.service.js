const { UserRole } = require('@prisma/client');
const prisma = require('../config/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// Tạo người dùng mới
const createUser = async (email, password, role) => {
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { status: 'error', message: 'Email đã được sử dụng' };
        }
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo user mới
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || UserRole.CUSTOMER,
            },
        });
        return {
            status: 'success',
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        return { status: 'error', message: error.message };
    }
};

const loginUser = async (email, password) => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            return { status: 'error', message: 'Thông tin đăng nhập không chính xác!' };
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return { status: 'error', message: 'Thông tin đăng nhập không chính xác!' };
        }
        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email, role: existingUser.role },
            JWT_SECRET,
            {
                expiresIn: '7d',
            },
        );
        return { token, existingUser };
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        return { status: 'error', message: error.message };
    }
};

module.exports = {
    createUser,
    loginUser,
};

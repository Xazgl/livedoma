var bcryptjs = require('bcryptjs');
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient()

const login = 'livehouseAlex'
const pass = 'MXWERTYf5'

async function start() {
    const admin = await db.admin.findUnique({ where: { login } });
    if (!admin) {
        const passwordHash = await bcryptjs.hash(pass, 10)
        const userAD = await db.admin.create({
            data: {
                login,
                passwordHash
            }
        })
        return { userAD }
    } else {
        console.log('Администратор с таким логином уже существует.');
        return existingAdmin;
    }
}

start()
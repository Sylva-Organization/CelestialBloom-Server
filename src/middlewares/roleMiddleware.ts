import type { Request, Response, NextFunction } from "express"

export const checkrole = (reqRoleArray: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        console.log(user)
        const roleByUser = user?.role;
        if (!user) return res.status(403).json({ error: "NOT_PERMISSION" })
        const checkValueRole = reqRoleArray.some((rolesingle) => roleByUser?.includes(rolesingle))

        if (!checkValueRole) {
            return res.status(403).json({ message: 'Access denied: NOT_PERMISSIONS' })
        }
        next()
    }
    catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}
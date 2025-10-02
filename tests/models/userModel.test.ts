import { setupTestDB, teardownTestDB } from "../setupTestDB_Connection.js";
import { UserModel } from "../../src/models/UserModel.js";

describe("UserModel", () => {
    beforeAll(async () => await setupTestDB());
    afterAll(async () => await teardownTestDB());

    it("should not allow null email", async () => {
        await expect(
            UserModel.build({
                first_name: "test user model name",
                last_name: "user",
                password: "123@",
                nick_name: "tester",
                email: ""
            }).validate()
        ).rejects.toThrow();
    });
});

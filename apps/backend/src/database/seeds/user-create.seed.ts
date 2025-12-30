import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { UserRoles } from "../../modules/user/enums/user.enum";
import { User } from "../entities/user.orm-entity";

export class UserCreateSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Running UserCreateSeed...");
    const repo = dataSource.getRepository(User);
    if (!(await repo.findOne({ where: { email: "admin@admin.com" } }))) {
      const user = repo.create({
        name: "Amitav Roy",
        email: "admin@admin.com",
        password: "Password@123",
        role: UserRoles.ADMIN,
      });
      await repo.save(user);
    }
  }
}

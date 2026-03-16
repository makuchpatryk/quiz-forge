import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles, AuthProvider } from "./user.enum";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty({ description: "Primary key as User ID", example: "xxxx" })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({ description: "User name", example: "Jhon Doe" })
  @Column()
  name!: string;

  @ApiProperty({
    description: "User email address",
    example: "jhon.doe@gmail.com",
  })
  @Column({
    unique: true,
  })
  email!: string;

  @ApiProperty({ description: "Hashed user password" })
  @Column({ type: "varchar", nullable: true })
  password!: string | null;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.MEMBER })
  role!: UserRoles;

  @Column({ type: "varchar", default: AuthProvider.LOCAL })
  provider!: string;

  @Column({ type: "varchar", nullable: true })
  providerId!: string | null;

  @ApiProperty({ description: "When user was created" })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: "When user was updated" })
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    type: "varchar",
    nullable: true,
  })
  refreshToken!: string | null;
}

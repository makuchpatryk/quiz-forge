import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "./user.enum";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @ApiProperty({ description: "Primary key as User ID", example: "xxxx" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "User name", example: "Jhon Doe" })
  @Column()
  name: string;

  @ApiProperty({
    description: "User email address",
    example: "jhon.doe@gmail.com",
  })
  @Column({
    unique: true,
  })
  email: string;

  @ApiProperty({ description: "Hashed user password" })
  @Column()
  password: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @ApiProperty({ description: "When user was created" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "When user was updated" })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  refreshToken: string;
}

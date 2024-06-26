import { Table, Column, Model, DataType, PrimaryKey, Unique, Default } from "sequelize-typescript"

@Table({
  tableName: "users",
  timestamps: true,
})
export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
    id!: string

  @Unique({name: "u_email", msg: "Email must be unique"})
  @Column(DataType.STRING)
    email!: string

  @Column(DataType.STRING)
    password!: string
}

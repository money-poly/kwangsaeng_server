import { Column, Entity } from "typeorm";

@Entity("User", { schema: "kwangsaeng_db" })
export class User {
  @Column("int", { name: "userIdx", nullable: true })
  userIdx: number | null;

  @Column("varchar", { name: "nickName", nullable: true, length: 30 })
  nickName: string | null;
}
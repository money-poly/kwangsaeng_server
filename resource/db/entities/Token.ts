import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("Token_fireUid_uindex", ["fireUid"], { unique: true })
@Entity("Token", { schema: "kwangsaeng_db" })
export class Token {
  @PrimaryGeneratedColumn({ type: "int", name: "userIdx" })
  userIdx: number;

  @Column("varchar", { name: "fireUid", unique: true, length: 50 })
  fireUid: String;

  @Column("varchar", { name: "access", nullable: true, length: 200 })
  access: String | null;

  @Column("varchar", { name: "refresh", nullable: true, length: 200 })
  refresh: String | null;

  @Column("datetime", { name: "accessExpired", nullable: true })
  accessExpired: Date | null;

  @Column("datetime", { name: "refreshExpired", nullable: true })
  refreshExpired: Date | null;
}
